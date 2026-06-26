import { Request, Response } from 'express';
import Resume from './resume.model';

export class ResumeController {
  
  // POST /api/resumes
  async createResume(req: Request, res: Response) {
    try {
      // In a real app, userId comes from the auth middleware (e.g., req.user.id)
      // For testing, we'll allow passing it in or hardcoding a dummy
      const { title, texCode, targetRole, userId } = req.body;
      
      let finalTitle = title?.trim() || "My Resume";
      
      if (finalTitle === "My Resume") {
        const existingDocs = await Resume.find({
          userId,
          title: { $regex: /^My Resume( \d+)?$/ }
        }).select('title');
        
        if (existingDocs.length > 0) {
          let maxNum = 0;
          let hasBase = false;
          for (const doc of existingDocs) {
            if (doc.title === "My Resume") hasBase = true;
            else {
               const match = doc.title.match(/^My Resume (\d+)$/);
               if (match) {
                 const num = parseInt(match[1], 10);
                 if (num > maxNum) maxNum = num;
               }
            }
          }
          if (hasBase && maxNum === 0) finalTitle = "My Resume 1";
          else if (maxNum > 0) finalTitle = `My Resume ${maxNum + 1}`;
        }
      }
      
      const newResume = new Resume({
        userId,
        title: finalTitle,
        texCode,
        targetRole
      });

      await newResume.save();
      return res.status(201).json(newResume);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to create resume' });
    }
  }

  // GET /api/resumes/:id
  async getResumeById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resume = await Resume.findById(id);
      if (!resume) return res.status(404).json({ message: 'Resume not found' });
      
      // In a real app, verify req.user.id === resume.userId
      return res.status(200).json(resume);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch resume' });
    }
  }

  // PUT /api/resumes/:id
  async updateResume(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, texCode, targetRole, chatHistory, atsScore } = req.body;
      const resume = await Resume.findById(id);
      if (!resume) return res.status(404).json({ message: 'Resume not found' });
      
      // Verify req.user.id === resume.userId in real app
      
      if (title !== undefined) resume.title = title;
      if (texCode !== undefined) resume.texCode = texCode;
      if (targetRole !== undefined) resume.targetRole = targetRole;
      if (chatHistory !== undefined) resume.chatHistory = chatHistory;
      if (atsScore !== undefined) resume.atsScore = atsScore;

      await resume.save();
      return res.status(200).json(resume);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update resume' });
    }
  }

  // GET /api/resumes?page=1&limit=10
  async getResumes(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // In a real app, filter by req.user.id
      const userId = req.query.userId as string | undefined; 
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

  // DELETE /api/resumes/:id
  async deleteResume(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resume = await Resume.findByIdAndDelete(id);
      if (!resume) return res.status(404).json({ message: 'Resume not found' });
      
      return res.status(200).json({ message: 'Resume deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete resume' });
    }
  }
}

export const resumeController = new ResumeController();
