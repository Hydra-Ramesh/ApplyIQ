import mongoose, { Schema, Document } from 'mongoose';

export interface IContactMessage extends Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

const ContactMessageSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);
