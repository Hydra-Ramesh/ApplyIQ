import { Router } from 'express';
import { resumeController } from './resume.controller';
import { cacheRoute } from '../../shared/middlewares/cache.middleware';

const router = Router();

// Cache the first page for 5 minutes. Subsequent pages hit DB.
// In a full implementation, we'd invalidate cache on POST.
router.get('/', cacheRoute(300), resumeController.getResumes);
router.post('/', resumeController.createResume);

export default router;
