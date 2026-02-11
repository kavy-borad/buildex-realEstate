import express from 'express';
import {
    createPayment,
    getAllPayments,
    getPaymentById,
    deletePayment,
    getPaymentStats
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/', createPayment);
router.get('/', getAllPayments);
router.get('/stats', getPaymentStats);
router.get('/:id', getPaymentById);
router.delete('/:id', deletePayment);

export default router;
