import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<INotification>('Notification', notificationSchema);
