import { Router } from 'express';
import { notificationController } from './notification.controller';
import { authenticate } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Protect all notification routes
router.use(authenticate);

router.get('/', notificationController.getMyNotifications);
router.put('/:id/read', notificationController.markAsRead);
router.put('/read-all', notificationController.markAllAsRead);

export default router;
