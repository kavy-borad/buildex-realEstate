import express from 'express';
import {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    getMe,
    getAllAdmins,
    setupSuperAdmin
} from '../controllers/authController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', loginAdmin);
router.get('/setup-admin', setupSuperAdmin); // One-time setup

// Protected routes
router.post('/logout', protect, logoutAdmin);
router.get('/me', protect, getMe);
router.get('/admins', protect, restrictTo('super-admin'), getAllAdmins);

// Super-admin only - register new admin
router.post('/register', protect, restrictTo('super-admin'), registerAdmin);

export default router;
