import mongoose, { Schema, Document } from 'mongoose';

export interface ITemplate extends Document {
  name: string;
  description: string;
  latexCode: string;
  createdAt: Date;
}

const TemplateSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  latexCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ITemplate>('Template', TemplateSchema);
