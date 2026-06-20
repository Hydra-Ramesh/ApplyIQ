import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface IEducation {
  institution: string;
  degree: string;
  cgpa?: string;
  startDate: string;
  endDate?: string;
}

export interface IProject {
  name: string;
  keywords: string[];
  techStack: string[];
  description: string;
  link?: string;
}

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  personal: {
    firstName: string;
    lastName: string;
    phone?: string;
    location?: string;
    portfolio?: string;
  };
  codingProfiles: {
    leetcode?: string;
    github?: string;
    codeforces?: string;
  };
  experience: IExperience[];
  education: IEducation[];
  projects: IProject[];
  updatedAt: Date;
}

const ProfileSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  personal: {
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    portfolio: { type: String, default: '' }
  },
  codingProfiles: {
    leetcode: { type: String, default: '' },
    github: { type: String, default: '' },
    codeforces: { type: String, default: '' }
  },
  experience: [{
    company: String,
    role: String,
    startDate: String,
    endDate: String,
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    cgpa: String,
    startDate: String,
    endDate: String
  }],
  projects: [{
    name: String,
    keywords: [String],
    techStack: [String],
    description: String,
    link: String
  }],
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IProfile>('Profile', ProfileSchema);
