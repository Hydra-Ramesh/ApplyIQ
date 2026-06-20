import { Request, Response } from 'express';
import User from '../auth/user.model';
import Resume from '../resume/resume.model';
import Template from './template.model';

export const adminController = {
  // Get all users with their resume counts
  getUsers: async (req: Request, res: Response) => {
    try {
      // Find all users
      const users = await User.find({}, '-passwordHash');
      
      // We could use an aggregation pipeline, but for simplicity we will just do a Promise.all
      // In a real large app we'd aggregate Resumes by userId.
      const usersWithCounts = await Promise.all(users.map(async (user) => {
        const resumeCount = await Resume.countDocuments({ userId: user._id });
        return {
          ...user.toObject(),
          resumeCount
        };
      }));

      res.status(200).json(usersWithCounts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  },

  // Get resumes for a specific user
  getUserResumes: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const resumes = await Resume.find({ userId: id }).sort({ createdAt: -1 });
      res.status(200).json(resumes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching resumes', error });
    }
  },

  // Create a new Template from copied LaTeX
  createTemplate: async (req: Request, res: Response) => {
    try {
      const { name, description, latexCode } = req.body;
      const newTemplate = new Template({ name, description, latexCode });
      await newTemplate.save();
      res.status(201).json(newTemplate);
    } catch (error) {
      res.status(500).json({ message: 'Error creating template', error });
    }
  },
  
  // Update a template
  updateTemplate: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description, latexCode } = req.body;
      const template = await Template.findByIdAndUpdate(id, { name, description, latexCode }, { new: true });
      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }
      res.status(200).json(template);
    } catch (error) {
      res.status(500).json({ message: 'Error updating template', error });
    }
  },
  
  // Delete a template
  deleteTemplate: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await Template.findByIdAndDelete(id);
      res.status(200).json({ message: 'Template deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting template', error });
    }
  }
};
