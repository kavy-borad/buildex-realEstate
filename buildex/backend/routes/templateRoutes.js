import express from 'express';
import { getAllTemplates, createTemplate } from '../controllers/templateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET - Global templates are public data (no auth needed)
// Any logged-in or guest user can see the template list for creating quotations
router.get('/', getAllTemplates);

// POST - Creating/modifying templates requires auth (only superadmin/company)
router.post('/', protect, createTemplate);

export default router;
