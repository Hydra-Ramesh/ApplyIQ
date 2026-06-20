import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  texCode: string;
  targetRole: string;
  atsScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    texCode: { type: String, required: true },
    targetRole: { type: String, default: 'General' },
    atsScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes to speed up queries, especially for user-specific searches
ResumeSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IResume>('Resume', ResumeSchema);
