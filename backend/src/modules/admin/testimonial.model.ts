import mongoose, { Schema, Document } from 'mongoose';

// We just want mongoose
import * as mongooseModule from 'mongoose';
const { Schema: MongooseSchema, model } = mongooseModule;

export interface ITestimonial extends mongooseModule.Document {
  name: string;
  role: string;
  message: string;
  rating: number;
  isPublished: boolean;
  createdAt: Date;
}

const testimonialSchema = new MongooseSchema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, required: true, default: 5 },
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

export default model<ITestimonial>('Testimonial', testimonialSchema);
