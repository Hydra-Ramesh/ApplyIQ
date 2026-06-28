import { Router } from 'express';
import { adminController } from './admin.controller';
import { adminAuthMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Protect all admin routes
router.use(adminAuthMiddleware);

router.get('/users', adminController.getUsers);
router.get('/users/:id/resumes', adminController.getUserResumes);

// Resumes & Templates
router.get('/resumes', adminController.getAllResumes);
router.post('/templates/publish/:resumeId', adminController.publishResumeAsTemplate);
router.post('/templates', adminController.createTemplate);
router.put('/templates/:id', adminController.updateTemplate);
router.delete('/templates/:id', adminController.deleteTemplate);

// Careers
router.get('/careers', adminController.getCareers);
router.post('/careers', adminController.createCareer);
router.delete('/careers/:id', adminController.deleteCareer);

// Blogs
router.get('/blogs', adminController.getBlogs);
router.post('/blogs', adminController.createBlog);
router.delete('/blogs/:id', adminController.deleteBlog);

// Contacts
router.get('/contacts', adminController.getContacts);
router.delete('/contacts/:id', adminController.deleteContact);

// Testimonials
router.get('/testimonials', adminController.getTestimonials);
router.put('/testimonials/:id/publish', adminController.toggleTestimonialPublish);
router.delete('/testimonials/:id', adminController.deleteTestimonial);

// Reports
router.get('/reports', adminController.getReports);
router.put('/reports/:id/resolve', adminController.toggleReportStatus);
router.delete('/reports/:id', adminController.deleteReport);
router.post('/reports/:id/reply', adminController.replyToReport);

export default router;
