import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';

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
      await authService.verifyEmail(email, otp);
      res.status(200).json({ message: 'Email verified successfully' });
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
}

export const authController = new AuthController();
