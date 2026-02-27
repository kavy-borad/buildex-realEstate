import express from 'express';
import {
    loginPlatformAdmin,
    logoutAdmin,
    getMe,
    getPlatformProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─────────────────────────────────────────────
// PUBLIC routes  (no token required)
// ─────────────────────────────────────────────
// POST /api/platform/auth/login
router.post('/login', loginPlatformAdmin);

// ─────────────────────────────────────────────
// PROTECTED routes  (Bearer token required)
// ─────────────────────────────────────────────

// POST /api/platform/auth/logout
// Response 200: { success: true, message: "Logged out successfully" }
router.post('/logout', protect, logoutAdmin);

// GET /api/platform/auth/profile
// Response 200: { success: true, admin: { _id, name, email, role, createdAt } }
// Response 401: { success: false, message: "Not authorized, token missing" }
router.get('/profile', protect, getPlatformProfile);

// GET /api/platform/auth/me  (kept for backward compatibility)
router.get('/me', protect, getMe);

export default router;
