import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authService } from './auth.service';
import cloudinary from '../../shared/config/cloudinary';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';
import { env } from '../../shared/config/env';
import User from './user.model';
import Resume from '../resume/resume.model';
import { ZipArchive } from 'archiver';

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

  async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Return a fresh token so the frontend can update its state instantly
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
        env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(200).json({ 
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          subscriptionTier: user.isAdmin ? 'pro' : user.subscriptionTier,
          isAdmin: user.isAdmin,
          icons: user.icons,
        }
      });
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

  async deleteAccount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      // Delete all resumes associated with the user
      await Resume.deleteMany({ userId });
      // Delete the user
      await User.findByIdAndDelete(userId);
      res.status(200).json({ message: 'Account and associated data deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async exportData(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const resumes = await Resume.find({ userId });
      
      const exportPayload = {
        exportedAt: new Date().toISOString(),
        user,
        resumes
      };

      // Create a ZIP archive
      const archive = new ZipArchive({
        zlib: { level: 9 } // Sets the compression level.
      });

      // Listen for all archive data to be written
      archive.on('error', function(err: any) {
        throw err;
      });

      // Set headers for ZIP download
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename=applyiq_export.zip');

      // Pipe archive data to the response
      archive.pipe(res);

      // Append data to the ZIP
      archive.append(JSON.stringify(user, null, 2), { name: 'profile.json' });
      archive.append(JSON.stringify(exportPayload, null, 2), { name: 'full_export_metadata.json' });

      // Add each resume as a .tex file
      resumes.forEach((resume, index) => {
        // Create a safe filename based on the title
        const safeTitle = resume.title ? resume.title.replace(/[^a-zA-Z0-9_-]/g, '_') : `resume_${index}`;
        archive.append(resume.texCode, { name: `resumes/${safeTitle}.tex` });
      });

      // Finalize the archive (i.e. we are done appending files but streams have to finish yet)
      await archive.finalize();

    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
