import express from 'express';
import {
    getSettings,
    updateSettings,
    resetCounters
} from '../controllers/settingsController.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', updateSettings);
router.post('/reset-counters', resetCounters);

export default router;
