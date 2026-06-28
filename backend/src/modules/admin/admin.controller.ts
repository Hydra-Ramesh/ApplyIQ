import { Request, Response } from 'express';
import User from '../auth/user.model';
import Resume from '../resume/resume.model';
import Template from './template.model';
import Career from './career.model';
import Blog from './blog.model';
import ContactMessage from './contact.model';
import Testimonial from './testimonial.model';
import Report from './report.model';
import Notification from '../notification/notification.model';
import { getIO } from '../../socket';

export const adminController = {
  getUsers: async (req: Request, res: Response) => {
    try {
      const users = await User.find({}, '-passwordHash').sort({ createdAt: -1 });
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

  getUserResumes: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const resumes = await Resume.find({ userId: id }).sort({ createdAt: -1 });
      res.status(200).json(resumes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user resumes', error });
    }
  },

  getAllResumes: async (req: Request, res: Response) => {
    try {
      const resumes = await Resume.find().sort({ createdAt: -1 });
      res.status(200).json(resumes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching all resumes', error });
    }
  },

  publishResumeAsTemplate: async (req: Request, res: Response) => {
    try {
      const { resumeId } = req.params;
      const { name, description } = req.body;
      const resume = await Resume.findById(resumeId);
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }
      
      const newTemplate = new Template({ 
        name: name || `${resume.title || 'Untitled'} Template`, 
        description: description || 'A community-sourced template.', 
        latexCode: resume.texCode 
      });
      await newTemplate.save();
      res.status(201).json(newTemplate);
    } catch (error) {
      res.status(500).json({ message: 'Error publishing template', error });
    }
  },

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
  
  deleteTemplate: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await Template.findByIdAndDelete(id);
      res.status(200).json({ message: 'Template deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting template', error });
    }
  },

  // Careers CRUD
  getCareers: async (req: Request, res: Response) => {
    try {
      const careers = await Career.find().sort({ createdAt: -1 });
      res.status(200).json(careers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching careers', error });
    }
  },
  createCareer: async (req: Request, res: Response) => {
    try {
      const career = new Career(req.body);
      await career.save();
      res.status(201).json(career);
    } catch (error) {
      res.status(500).json({ message: 'Error creating career', error });
    }
  },
  deleteCareer: async (req: Request, res: Response) => {
    try {
      await Career.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Career deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting career', error });
    }
  },

  // Blogs CRUD
  getBlogs: async (req: Request, res: Response) => {
    try {
      const blogs = await Blog.find().sort({ createdAt: -1 });
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching blogs', error });
    }
  },
  createBlog: async (req: Request, res: Response) => {
    try {
      const blog = new Blog(req.body);
      await blog.save();
      res.status(201).json(blog);
    } catch (error) {
      res.status(500).json({ message: 'Error creating blog', error });
    }
  },
  deleteBlog: async (req: Request, res: Response) => {
    try {
      await Blog.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Blog deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting blog', error });
    }
  },

  // Contacts
  getContacts: async (req: Request, res: Response) => {
    try {
      const contacts = await ContactMessage.find().sort({ createdAt: -1 });
      res.status(200).json(contacts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching contacts', error });
    }
  },

  // Testimonials
  getTestimonials: async (req: Request, res: Response) => {
    try {
      const testimonials = await Testimonial.find().sort({ createdAt: -1 });
      res.status(200).json(testimonials);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching testimonials', error });
    }
  },
  toggleTestimonialPublish: async (req: Request, res: Response) => {
    try {
      const testimonial = await Testimonial.findById(req.params.id);
      if (!testimonial) return res.status(404).json({ message: 'Not found' });
      testimonial.isPublished = !testimonial.isPublished;
      await testimonial.save();
      res.status(200).json(testimonial);
    } catch (error) {
      res.status(500).json({ message: 'Error toggling publish', error });
    }
  },
  deleteTestimonial: async (req: Request, res: Response) => {
    try {
      await Testimonial.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Testimonial deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting testimonial', error });
    }
  },

  // Reports
  getReports: async (req: Request, res: Response) => {
    try {
      const reports = await Report.find().sort({ createdAt: -1 });
      res.status(200).json(reports);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching reports', error });
    }
  },
  toggleReportStatus: async (req: Request, res: Response) => {
    try {
      const report = await Report.findById(req.params.id);
      if (!report) return res.status(404).json({ message: 'Not found' });
      report.isResolved = !report.isResolved;
      await report.save();
      res.status(200).json(report);
    } catch (error) {
      res.status(500).json({ message: 'Error toggling report status', error });
    }
  },
  deleteReport: async (req: Request, res: Response) => {
    try {
      await Report.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Report deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting report', error });
    }
  },

  replyToReport: async (req: Request, res: Response) => {
    try {
      const { replyMessage } = req.body;
      const report = await Report.findById(req.params.id);
      
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }

      report.adminReply = replyMessage;
      report.isResolved = true; // Auto-resolve when replied
      await report.save();

      // Create a notification for the user if they were logged in
      if (report.userId) {
        const notif = new Notification({
          userId: report.userId,
          title: 'Reply to your Bug Report',
          message: replyMessage
        });
        await notif.save();

        // Emit real-time socket event
        getIO().to(`user_${report.userId}`).emit('new_notification', notif);
      }

      res.status(200).json(report);
    } catch (error) {
      res.status(500).json({ message: 'Error replying to report', error });
    }
  }
};
