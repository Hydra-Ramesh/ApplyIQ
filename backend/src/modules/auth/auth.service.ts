import User from './user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { redisCache } from '../../shared/utils/cache/redis';
import { AppError } from '../../shared/utils/errors/AppError';
import { sendRegisterEmail, sendNewDeviceEmail, sendOtpEmail, sendPasswordChangeSuccessEmail, sendWelcomeEmail } from '../../shared/services/email.service';
import { generateOTP } from '../../shared/utils/crypto/generateOTP';
import { env } from '../../shared/config/env';

const JWT_SECRET = env.JWT_SECRET;
const OTP_TTL = 900; // 15 mins

export class AuthService {
  async register(email: string, password: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new AppError('User already exists', 400);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const otp = generateOTP();
    await redisCache.set(`register_pwd:${email}`, passwordHash, OTP_TTL);
    await redisCache.set(`register_otp:${email}`, otp, OTP_TTL);
    sendRegisterEmail(email, otp).catch(console.error);
  }

  async verifyEmail(email: string, otp: string) {
    const cachedOtp = await redisCache.get(`register_otp:${email}`);
    console.log('[DEBUG OTP] key:', `register_otp:${email}`);
    console.log('[DEBUG OTP] cachedOtp:', JSON.stringify(cachedOtp), 'type:', typeof cachedOtp);
    console.log('[DEBUG OTP] userOtp:', JSON.stringify(otp), 'type:', typeof otp);
    console.log('[DEBUG OTP] match:', String(cachedOtp) === otp);
    if (!cachedOtp || String(cachedOtp) !== otp) throw new AppError('Invalid or expired OTP', 400);

    const passwordHash = await redisCache.get(`register_pwd:${email}`);
    if (!passwordHash) throw new AppError('Registration session expired, please register again', 400);

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new AppError('User already exists', 400);

    const user = new User({ email, passwordHash: String(passwordHash), isEmailVerified: true });
    await user.save();
    
    await redisCache.delete(`register_otp:${email}`);
    await redisCache.delete(`register_pwd:${email}`);
    
    // Send welcome email with checkout link
    sendWelcomeEmail(email, env.CHECKOUT_URL).catch(console.error);
    
    return user;
  }

  async resendOtp(email: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new AppError('Email already verified', 400);

    const passwordHash = await redisCache.get(`register_pwd:${email}`);
    if (!passwordHash) throw new AppError('Registration session expired, please register again', 400);

    const otp = generateOTP();
    await redisCache.set(`register_otp:${email}`, otp, OTP_TTL);
    sendRegisterEmail(email, otp).catch(console.error);
  }

  async login(email: string, password: string, userAgent: string) {
    const user = await User.findOne({ email });
    if (!user) throw new AppError('Invalid credentials', 400);

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new AppError('Invalid credentials', 400);

    if (!user.knownDevices.includes(userAgent)) {
      user.knownDevices.push(userAgent);
      await user.save();
      if (user.knownDevices.length > 1) {
        sendNewDeviceEmail(email, userAgent).catch(console.error);
      }
    }

    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        isAdmin: user.isAdmin,
        name: user.name,
        avatarUrl: user.avatarUrl 
      }, 
      JWT_SECRET, 
      { expiresIn: '1d' }
    );
    return token;
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) return; // Don't throw to prevent email enumeration

    const otp = generateOTP();
    await redisCache.set(`reset_otp:${email}`, otp, OTP_TTL);
    sendOtpEmail(email, otp).catch(console.error);
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await User.findOne({ email });
    if (!user) throw new AppError('Invalid request', 400);

    const cachedOtp = await redisCache.get(`reset_otp:${email}`);
    if (!cachedOtp || String(cachedOtp) !== otp) throw new AppError('Invalid or expired OTP', 400);

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.knownDevices = []; // require re-auth
    await user.save();
    
    await redisCache.delete(`reset_otp:${email}`);
    sendPasswordChangeSuccessEmail(email).catch(console.error);
  }

  async updateProfile(userId: string, data: { name?: string, avatarUrl?: string }) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    if (data.name !== undefined) user.name = data.name;
    if (data.avatarUrl !== undefined) user.avatarUrl = data.avatarUrl;

    await user.save();
    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) throw new AppError('Incorrect current password', 400);

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.knownDevices = []; // require re-auth
    await user.save();
    
    sendPasswordChangeSuccessEmail(user.email).catch(console.error);
  }

  async logout(userId: string, userAgent: string) {
    const user = await User.findById(userId);
    if (!user) return;

    // Remove current device so the next login triggers a new-device alert
    user.knownDevices = user.knownDevices.filter(d => d !== userAgent);
    await user.save();
  }
}

export const authService = new AuthService();
