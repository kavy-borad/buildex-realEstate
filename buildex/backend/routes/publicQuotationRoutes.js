import express from 'express';
import { getPublicQuotation, respondToQuotation } from '../controllers/publicQuotationController.js';

const router = express.Router();

/**
 * @route   GET /api/public/quotation/:token
 * @desc    Get quotation details by secure access token
 * @access  Public
 */
router.get('/:token', getPublicQuotation);

/**
 * @route   POST /api/public/quotation/:token/respond
 * @desc    Submit client response (Approve, Reject, Request Changes)
 * @access  Public
 */
router.post('/:token/respond', respondToQuotation);

export default router;
