import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Resume from './modules/resume/resume.model';
import User from './modules/auth/user.model';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/resume-ai';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');

    // Create a dummy user
    const user = new User({ email: 'test@applyiq.com', password: 'password123', isVerified: true });
    await user.save();
    console.log('Dummy user created:', user._id);

    // Generate 50 fake resumes
    const resumes = [];
    for (let i = 1; i <= 50; i++) {
      resumes.push({
        userId: user._id,
        title: `Resume Variant #${i}`,
        texCode: `\\documentclass{article}\\begin{document}Content for resume ${i}\\end{document}`,
        targetRole: i % 2 === 0 ? 'Software Engineer' : 'Product Manager',
        atsScore: Math.floor(Math.random() * 40) + 60 // Random score between 60 and 99
      });
    }

    await Resume.insertMany(resumes);
    console.log('✅ Successfully seeded 50 resumes!');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
