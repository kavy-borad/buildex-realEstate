import express from 'express';
import {
    createQuotation,
    getAllQuotations,
    getQuotationById,
    updateQuotation,
    deleteQuotation,
    updateQuotationStatus,
    getQuotationStats,
    getShareableLink
} from '../controllers/quotationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createQuotation);
router.get('/', getAllQuotations);
router.get('/stats', getQuotationStats);
router.get('/:id', getQuotationById);
router.put('/:id', updateQuotation);
router.delete('/:id', deleteQuotation);
router.patch('/:id/status', updateQuotationStatus);
router.get('/:id/shareable-link', getShareableLink);

export default router;
