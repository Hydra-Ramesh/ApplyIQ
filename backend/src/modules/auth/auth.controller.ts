import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authService } from './auth.service';
import cloudinary from '../../shared/config/cloudinary';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';
import { env } from '../../shared/config/env';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      await authService.register(email, password);
      res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      const user = await authService.verifyEmail(email, otp);

      // Issue a JWT so the user is auto-logged in after verification
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
        env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.status(200).json({ token, message: 'Email verified successfully' });
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      await authService.resendOtp(email);
      res.status(200).json({ message: 'OTP resent to your email' });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const userAgent = req.headers['user-agent'] || 'Unknown Device';
      const token = await authService.login(email, password, userAgent);
      res.status(200).json({ token, message: 'Login successful' });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      await authService.forgotPassword(email);
      res.status(200).json({ message: 'If the email exists, an OTP has been sent' });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp, newPassword } = req.body;
      await authService.resetPassword(email, otp, newPassword);
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { name } = req.body;
      const user = await authService.updateProfile(userId, { name });

      // Issue a fresh JWT so the client token stays in sync
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
        env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.status(200).json({ user, token, message: 'Profile updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async uploadAvatar(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      // Upload to Cloudinary using upload_stream
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'avatars', public_id: `user_${userId}` },
        async (error, result) => {
          if (error || !result) {
            return next(error || new Error('Upload to Cloudinary failed'));
          }

          const avatarUrl = result.secure_url;
          const user = await authService.updateProfile(userId, { avatarUrl });

          // Issue a fresh JWT so the client token stays in sync
          const token = jwt.sign(
            {
              userId: user._id,
              email: user.email,
              isAdmin: user.isAdmin,
              name: user.name,
              avatarUrl: user.avatarUrl,
            },
            env.JWT_SECRET,
            { expiresIn: '1d' }
          );

          res.status(200).json({ avatarUrl, token, message: 'Avatar updated successfully' });
        }
      );

      uploadStream.end(req.file.buffer);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(userId, currentPassword, newPassword);
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  }

  async uploadIcon(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      // Safe filename without extension
      const safeName = req.file.originalname.replace(/[^a-zA-Z0-9_\-\.]/g, '');
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'icons', public_id: `user_${userId}_${uniqueSuffix}` },
        async (error, result) => {
          if (error || !result) {
            return next(error || new Error('Upload to Cloudinary failed'));
          }

          const iconUrl = result.secure_url;
          const User = (await import('./user.model')).default;
          
          await User.findByIdAndUpdate(userId, {
            $push: { icons: { name: safeName, url: iconUrl } }
          });

          res.status(200).json({ iconUrl, name: safeName, message: 'Icon uploaded successfully' });
        }
      );

      uploadStream.end(req.file.buffer);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const userAgent = req.headers['user-agent'] || 'Unknown Device';
      await authService.logout(userId, userAgent);
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
