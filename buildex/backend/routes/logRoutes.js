import express from 'express';
import { getLogs, getLogStats, clearLogs, getLiveLogs } from '../controllers/logController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🔒 All log routes protected — requires admin JWT token
// Frontend (React) sends token automatically via logApi service
// Standalone /system-logs page uses internal routes (see server.js)
router.use(protect);

router.get('/', getLogs);
router.get('/stats', getLogStats);
router.get('/live', getLiveLogs);
router.delete('/', clearLogs);

export default router;
