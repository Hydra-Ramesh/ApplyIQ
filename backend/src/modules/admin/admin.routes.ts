import { Router } from 'express';
import { adminController } from './admin.controller';
import { adminAuthMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Protect all admin routes
router.use(adminAuthMiddleware);

router.get('/users', adminController.getUsers);
router.get('/users/:id/resumes', adminController.getUserResumes);
router.post('/templates', adminController.createTemplate);
router.put('/templates/:id', adminController.updateTemplate);
router.delete('/templates/:id', adminController.deleteTemplate);

export default router;
