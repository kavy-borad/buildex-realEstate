/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 💬 CLIENT FEEDBACK ROUTES
 * ═══════════════════════════════════════════════════════════════════════════
 */

import express from 'express';
import {
    submitClientFeedback,
    getQuotationFeedback,
    getAllQuotationsWithFeedback,
    getFeedbackStatistics
} from '../controllers/feedbackController.js';

const router = express.Router();

// Submit client feedback for a quotation
router.post('/quotations/:quotationId/feedback', submitClientFeedback);

// Get feedback for a specific quotation
router.get('/quotations/:quotationId/feedback', getQuotationFeedback);

// Get all quotations with feedback
router.get('/quotations/feedback/all', getAllQuotationsWithFeedback);

// Get feedback statistics
router.get('/feedback/statistics', getFeedbackStatistics);

export default router;
