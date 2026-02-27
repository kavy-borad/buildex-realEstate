import express from 'express';
import {
    registerAdmin,
    registerPublicAdmin,
    loginAdmin,
    logoutAdmin,
    getMe,
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    setupSuperAdmin
} from '../controllers/authController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', loginAdmin);
router.post('/register-public', registerPublicAdmin);
router.get('/setup-admin', setupSuperAdmin); // One-time setup

// Protected routes
router.post('/logout', protect, logoutAdmin);
router.get('/me', protect, getMe);

// buildexadmin only routes
router.get('/admins', protect, restrictTo('buildexadmin'), getAllAdmins);
router.post('/register', protect, restrictTo('buildexadmin'), registerAdmin);
router.get('/admins/:id', protect, restrictTo('buildexadmin'), getAdminById);
router.put('/admins/:id', protect, restrictTo('buildexadmin'), updateAdmin);
router.delete('/admins/:id', protect, restrictTo('buildexadmin'), deleteAdmin);

export default router;
