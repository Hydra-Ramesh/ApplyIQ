import { Router } from 'express';
import Template from './template.model';

const router = Router();

// Public route to get all templates for the Template Gallery
router.get('/', async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching templates', error });
  }
});

export default router;
