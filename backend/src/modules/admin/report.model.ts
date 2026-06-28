import mongoose, { Schema, Document } from 'mongoose';

import * as mongooseModule from 'mongoose';
const { Schema: MongooseSchema, model } = mongooseModule;

export interface IReport extends mongooseModule.Document {
  name: string;
  email: string;
  issue: string;
  userId?: string;
  adminReply?: string;
  isResolved: boolean;
  createdAt: Date;
}

const reportSchema = new MongooseSchema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  issue: { type: String, required: true },
  userId: { type: String, required: false },
  adminReply: { type: String, required: false },
  isResolved: { type: Boolean, default: false }
}, { timestamps: true });

export default model<IReport>('Report', reportSchema);
