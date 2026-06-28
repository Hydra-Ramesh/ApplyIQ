import { Request, Response } from 'express';
import Career from '../admin/career.model';
import Blog from '../admin/blog.model';
import ContactMessage from '../admin/contact.model';
import Testimonial from '../admin/testimonial.model';
import Report from '../admin/report.model';
import { getIO } from '../../socket';

export const publicController = {
  getCareers: async (req: Request, res: Response) => {
    try {
      const careers = await Career.find().sort({ createdAt: -1 });
      res.status(200).json(careers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching careers', error });
    }
  },

  getBlogs: async (req: Request, res: Response) => {
    try {
      const blogs = await Blog.find().sort({ createdAt: -1 });
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching blogs', error });
    }
  },

  submitContact: async (req: Request, res: Response) => {
    try {
      const { name, email, message } = req.body;
      const newMessage = new ContactMessage({ name, email, message });
      await newMessage.save();
      
      try { getIO().emit('new_contact_message', { name, email }); } catch(e) {}
      
      res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending message', error });
    }
  },

  // Testimonials
  getTestimonials: async (req: Request, res: Response) => {
    try {
      // Only fetch published ones for public viewing
      const testimonials = await Testimonial.find({ isPublished: true }).sort({ createdAt: -1 });
      res.status(200).json(testimonials);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching testimonials', error });
    }
  },

  submitTestimonial: async (req: Request, res: Response) => {
    try {
      const { name, role, message, rating } = req.body;
      const testimonial = new Testimonial({ name, role, message, rating });
      await testimonial.save();
      res.status(201).json({ message: 'Testimonial submitted' });
    } catch (error) {
      res.status(500).json({ message: 'Error submitting testimonial', error });
    }
  },

  // Reports
  submitReport: async (req: Request, res: Response) => {
    try {
      const { name, email, issue } = req.body;
      const report = new Report({ name, email, issue });
      await report.save();
      
      try { getIO().emit('new_report', { name, issue }); } catch(e) {}

      res.status(201).json({ message: 'Report submitted' });
    } catch (error) {
      res.status(500).json({ message: 'Error submitting report', error });
    }
  }
};
