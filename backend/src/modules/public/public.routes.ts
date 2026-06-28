import { Router } from 'express';
import { publicController } from './public.controller';

const router = Router();

router.get('/careers', publicController.getCareers);
router.get('/blogs', publicController.getBlogs);
router.post('/contacts', publicController.submitContact);

router.get('/testimonials', publicController.getTestimonials);
router.post('/testimonials', publicController.submitTestimonial);

router.post('/reports', publicController.submitReport);

export default router;
