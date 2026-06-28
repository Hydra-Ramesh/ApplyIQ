import mongoose, { Schema, Document } from 'mongoose';

export interface ICareer extends Document {
  title: string;
  location: string;
  googleFormLink: string;
  createdAt: Date;
}

const CareerSchema: Schema = new Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  googleFormLink: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ICareer>('Career', CareerSchema);
