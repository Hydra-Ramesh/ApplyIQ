import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  snippet: string;
  content: string;
  createdAt: Date;
}

const BlogSchema: Schema = new Schema({
  title: { type: String, required: true },
  snippet: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IBlog>('Blog', BlogSchema);
