import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

// JWT Secret (should be in .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'buildex-secret-key-change-in-production';
const JWT_EXPIRE = '7d'; // Token expires in 7 days

// Generate JWT Token
const generateToken = (adminId) => {
    return jwt.sign({ id: adminId }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE
    });
};

// @desc    Register new admin (protected - only super-admin can create)
// @route   POST /api/auth/register
export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                error: 'Admin with this email already exists'
            });
        }

        // Create admin
        const admin = await Admin.create({
            name,
            email,
            password,
            role: role || 'admin'
        });

        // Generate token
        const token = generateToken(admin._id);

        res.status(201).json({
            success: true,
            data: {
                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role
                },
                token
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to register admin'
        });
    }
};

// @desc    Login admin
// @route   POST /api/auth/login
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password'
            });
        }

        // Find admin and include password field
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check if admin is active
        if (!admin.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Account is deactivated. Contact super admin.'
            });
        }

        // Verify password
        const isPasswordValid = await admin.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // Generate token
        const token = generateToken(admin._id);

        res.status(200).json({
            success: true,
            data: {
                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed. Please try again.'
        });
    }
};

// @desc    Get current admin profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id);

        res.status(200).json({
            success: true,
            data: admin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to get profile'
        });
    }
};

// @desc    Get all admins (super-admin only)
// @route   GET /api/auth/admins
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select('-password');

        res.status(200).json({
            success: true,
            data: admins
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch admins'
        });
    }
};

// @desc    Setup initial super-admin (Run once)
// @route   GET /api/auth/setup-admin
export const setupSuperAdmin = async (req, res) => {
    try {
        const existingAdmin = await Admin.findOne({ role: 'super-admin' });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: 'Super Admin already exists' });
        }
        const superAdmin = await Admin.create({
            name: 'Super Admin',
            email: 'admin@buildex.com',
            password: 'admin123',
            role: 'super-admin'
        });
        const token = generateToken(superAdmin._id);
        res.status(201).json({ success: true, data: { admin: superAdmin, token } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
