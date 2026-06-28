import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticate } from '../../shared/middlewares/auth.middleware';
import { upload } from '../../shared/middlewares/upload.middleware';

const router = Router();

router.post('/register', authController.register);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-otp', authController.resendOtp);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Profile & Settings Routes (Protected)
router.get('/me', authenticate, authController.getMe);
router.put('/me', authenticate, authController.updateProfile);
router.post('/me/avatar', authenticate, upload.single('avatar'), authController.uploadAvatar);
router.post('/me/icon', authenticate, upload.single('icon'), authController.uploadIcon);
router.post('/change-password', authenticate, authController.changePassword);
router.post('/logout', authenticate, authController.logout);
router.get('/me/export', authenticate, authController.exportData);
router.delete('/me', authenticate, authController.deleteAccount);

export default router;
