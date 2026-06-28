import { Request, Response } from 'express';
import Notification from './notification.model';

export const notificationController = {
  getMyNotifications: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(20);
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching notifications', error });
    }
  },

  markAsRead: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const notification = await Notification.findOneAndUpdate(
        { _id: id, userId },
        { isRead: true },
        { new: true }
      );
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      res.status(200).json(notification);
    } catch (error) {
      res.status(500).json({ message: 'Error marking notification as read', error });
    }
  },

  markAllAsRead: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      await Notification.updateMany({ userId }, { isRead: true });
      res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
      res.status(500).json({ message: 'Error marking notifications as read', error });
    }
  }
};
