import { Request, Response } from 'express';
import Resume from './resume.model';

export class ResumeController {
  
  // POST /api/resumes
  async createResume(req: Request, res: Response) {
    try {
      // In a real app, userId comes from the auth middleware (e.g., req.user.id)
      // For testing, we'll allow passing it in or hardcoding a dummy
      const { title, texCode, targetRole, userId } = req.body;
      
      const newResume = new Resume({
        userId,
        title,
        texCode,
        targetRole
      });

      await newResume.save();
      return res.status(201).json(newResume);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to create resume' });
    }
  }

  // GET /api/resumes?page=1&limit=10
  async getResumes(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // In a real app, filter by req.user.id
      const userId = req.query.userId; 
      const query = userId ? { userId } : {};

      const skip = (page - 1) * limit;

      const [resumes, total] = await Promise.all([
        Resume.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Resume.countDocuments(query)
      ]);

      const totalPages = Math.ceil(total / limit);

      return res.status(200).json({
        data: resumes,
        meta: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch resumes' });
    }
  }
}

export const resumeController = new ResumeController();
