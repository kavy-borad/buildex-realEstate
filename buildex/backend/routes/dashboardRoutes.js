import express from 'express';
import { getProjectStats, getRecentActivities, getCharts, getOverview } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/overview', getOverview);
router.get('/project-stats', getProjectStats);
router.get('/recent-activities', getRecentActivities);
router.get('/charts', getCharts);

export default router;
