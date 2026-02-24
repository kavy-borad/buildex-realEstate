
import express from 'express';
import { generateQuotationPDF } from '../controllers/pdfController.js';


const router = express.Router();

// Logging middleware
router.use((req, res, next) => {
    console.log(`\n🔍 PDF Route Hit: ${req.method} ${req.path}`);
    console.log(`📋 Params:`, req.params);
    console.log(`📦 Body:`, req.body ? 'Has body data' : 'No body');
    console.log(`🔑 Auth:`, req.headers.authorization ? 'Token present' : 'No auth');
    next();
});

// Route to generate PDF from ID
router.get('/:id/download', generateQuotationPDF);

// Route to generate PDF from POST data (preview)
router.post('/preview/download', generateQuotationPDF);

export default router;
