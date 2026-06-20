import User from './user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { redisCache } from '../../shared/utils/cache/redis';
import { AppError } from '../../shared/utils/errors/AppError';
import { sendRegisterEmail, sendNewDeviceEmail, sendOtpEmail, sendPasswordChangeSuccessEmail } from '../../shared/services/email.service';
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
    
    const newUser = new User({ email, passwordHash, isEmailVerified: false });
    await newUser.save();

    const otp = generateOTP();
    await redisCache.set(`register_otp:${email}`, otp, OTP_TTL);
    await sendRegisterEmail(email, otp);
  }

  async verifyEmail(email: string, otp: string) {
    const user = await User.findOne({ email });
    if (!user) throw new AppError('User not found', 404);
    if (user.isEmailVerified) throw new AppError('Email already verified', 400);

    const cachedOtp = await redisCache.get(`register_otp:${email}`);
    if (!cachedOtp || cachedOtp !== otp) throw new AppError('Invalid or expired OTP', 400);

    user.isEmailVerified = true;
    await user.save();
    await redisCache.delete(`register_otp:${email}`);
  }

  async resendOtp(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new AppError('User not found', 404);
    if (user.isEmailVerified) throw new AppError('Email already verified', 400);

    const otp = generateOTP();
    await redisCache.set(`register_otp:${email}`, otp, OTP_TTL);
    await sendRegisterEmail(email, otp);
  }

  async login(email: string, password: string, userAgent: string) {
    const user = await User.findOne({ email });
    if (!user) throw new AppError('Invalid credentials', 400);

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new AppError('Invalid credentials', 400);

    if (!user.isEmailVerified) throw new AppError('Please verify your email before logging in', 403);

    if (!user.knownDevices.includes(userAgent)) {
      user.knownDevices.push(userAgent);
      await user.save();
      if (user.knownDevices.length > 1) {
        await sendNewDeviceEmail(email, userAgent);
      }
    }

    const token = jwt.sign({ userId: user._id, email: user.email, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1d' });
    return token;
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) return; // Don't throw to prevent email enumeration

    const otp = generateOTP();
    await redisCache.set(`reset_otp:${email}`, otp, OTP_TTL);
    await sendOtpEmail(email, otp);
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await User.findOne({ email });
    if (!user) throw new AppError('Invalid request', 400);

    const cachedOtp = await redisCache.get(`reset_otp:${email}`);
    if (!cachedOtp || cachedOtp !== otp) throw new AppError('Invalid or expired OTP', 400);

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.knownDevices = []; // require re-auth
    await user.save();
    
    await redisCache.delete(`reset_otp:${email}`);
    await sendPasswordChangeSuccessEmail(email);
  }
}

export const authService = new AuthService();
