import { Router } from 'express';
import { resumeController } from './resume.controller';
import { cacheRoute } from '../../shared/middlewares/cache.middleware';

const router = Router();

// Cache the first page for 5 minutes. Subsequent pages hit DB.
// Avoid caching user-specific data to prevent stale states and cross-user leaks
router.get('/', resumeController.getResumes);
router.post('/', resumeController.createResume);
router.get('/:id', resumeController.getResumeById);
router.put('/:id', resumeController.updateResume);

export default router;
