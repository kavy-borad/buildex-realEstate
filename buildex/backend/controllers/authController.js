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

// @desc    Register new admin (public - for contractors)
// @route   POST /api/auth/register-public
export const registerPublicAdmin = async (req, res) => {
    const startTime = Date.now();
    console.log('\n📝 [Auth] POST /auth/register-public → Request received');

    try {
        const { name, email, password, confirmPassword } = req.body;

        // ── Field validation ──────────────────────────────────────────
        if (!name || !email || !password || !confirmPassword) {
            console.log('  ❌ Validation failed: Missing required fields');
            return res.status(400).json({
                success: false,
                error: 'All fields are required (name, email, password, confirmPassword)'
            });
        }

        // ── Password length check ─────────────────────────────────────
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters long'
            });
        }

        // ── Password match check ──────────────────────────────────────
        if (password !== confirmPassword) {
            console.log('  ❌ Validation failed: Passwords do not match');
            return res.status(400).json({
                success: false,
                error: 'Passwords do not match'
            });
        }

        // ── Duplicate email check ─────────────────────────────────────
        const existingAdmin = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (existingAdmin) {
            const duration = Date.now() - startTime;
            console.log(`  ❌ Email already exists: ${email} | ${duration}ms`);
            return res.status(400).json({
                success: false,
                error: 'Account with this email already exists'
            });
        }

        // ── Create admin ──────────────────────────────────────────────
        const admin = await Admin.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,          // confirmPassword NOT stored — only password is hashed & saved
            role: 'admin'
        });

        const duration = Date.now() - startTime;
        console.log(`  ✅ New admin registered: ${admin.email} (id: ${admin._id}) | ${duration}ms\n`);

        res.status(201).json({
            success: true,
            message: 'Registration successful. You can now log in.',
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                isActive: admin.isActive,
                createdAt: admin.createdAt
            }
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`  ❌ [Auth] Register failed | ${duration}ms | ${error.message}`);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to register account'
        });
    }
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
            role: 'admin'  // only 'admin' role can be created this way
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
    const startTime = Date.now();
    console.log('\n🔐 [Auth] POST /auth/login → Request received');

    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            console.log('  ❌ Validation failed: Missing email or password');
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password'
            });
        }

        console.log(`  📧 Email: ${email}`);

        // Find admin and include password field
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            const duration = Date.now() - startTime;
            console.log(`  ❌ Admin not found for email: ${email} | ${duration}ms`);
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check if admin is active
        if (!admin.isActive) {
            const duration = Date.now() - startTime;
            console.log(`  ❌ Account deactivated: ${admin.name} (${email}) | ${duration}ms`);
            return res.status(401).json({
                success: false,
                error: 'Account is deactivated. Contact super admin.'
            });
        }

        // Verify password
        const isPasswordValid = await admin.comparePassword(password);

        if (!isPasswordValid) {
            const duration = Date.now() - startTime;
            console.log(`  ❌ Invalid password for: ${admin.name} (${email}) | ${duration}ms`);
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

        const duration = Date.now() - startTime;
        console.log(`  ✅ Login successful: ${admin.name} | Role: ${admin.role} | ${duration}ms\n`);

        res.status(200).json({
            success: true,
            token,
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`  ❌ [Auth] Login failed | ${duration}ms | ${error.message}`);
        res.status(500).json({
            success: false,
            error: 'Login failed. Please try again.'
        });
    }
};

// @desc    Login Platform admin (super-admin only)
// @route   POST /api/platform/auth/login
export const loginPlatformAdmin = async (req, res) => {
    const startTime = Date.now();
    console.log('\n🔐 [Platform Auth] POST /platform/auth/login → Request received');

    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            console.log('  ❌ Validation failed: Missing email or password');
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password'
            });
        }

        console.log(`  📧 Email: ${email}`);

        // Find admin and include password field
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            const duration = Date.now() - startTime;
            console.log(`  ❌ Platform Admin not found for email: ${email} | ${duration}ms`);
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Restrict to superadmin or buildexadmin roles
        if (admin.role !== 'superadmin' && admin.role !== 'buildexadmin') {
            const duration = Date.now() - startTime;
            console.log(`  ❌ Forbidden role: ${admin.role} for email: ${email} | ${duration}ms`);
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check if admin is active
        if (!admin.isActive) {
            const duration = Date.now() - startTime;
            console.log(`  ❌ Account deactivated: ${admin.name} (${email}) | ${duration}ms`);
            return res.status(401).json({
                success: false,
                error: 'Account is deactivated. Contact super admin.'
            });
        }

        // Verify password
        const isPasswordValid = await admin.comparePassword(password);

        if (!isPasswordValid) {
            const duration = Date.now() - startTime;
            console.log(`  ❌ Invalid password for: ${admin.name} (${email}) | ${duration}ms`);
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

        const duration = Date.now() - startTime;
        console.log(`  ✅ Platform Login successful: ${admin.name} | Role: ${admin.role} | ${duration}ms\n`);

        res.status(200).json({
            success: true,
            token,
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`  ❌ [Platform Auth] Login failed | ${duration}ms | ${error.message}`);
        res.status(500).json({
            success: false,
            error: 'Login failed. Please try again.'
        });
    }
};

// @desc    Logout admin
// @route   POST /api/auth/logout
export const logoutAdmin = async (req, res) => {
    const startTime = Date.now();
    console.log('\n🚪 [Auth] POST /auth/logout → Request received');

    try {
        const adminName = req.admin?.name || 'Unknown';
        const adminEmail = req.admin?.email || 'Unknown';

        const duration = Date.now() - startTime;
        console.log(`  ✅ Logout successful: ${adminName} (${adminEmail}) | ${duration}ms\n`);

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`  ❌ [Auth] Logout failed | ${duration}ms | ${error.message}`);
        res.status(500).json({
            success: false,
            error: 'Logout failed'
        });
    }
};

// @desc    Get current admin profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id);

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Admin not found'
            });
        }

        res.status(200).json({
            success: true,
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                isActive: admin.isActive,
                lastLogin: admin.lastLogin,
                createdAt: admin.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to get profile'
        });
    }
};

// @desc    Get current platform admin profile (Super Admin / Buildex Admin)
// @route   GET /api/platform/auth/profile
export const getPlatformProfile = async (req, res) => {
    const startTime = Date.now();
    console.log('\n👤 [Platform Auth] GET /platform/auth/profile → Request received');

    try {
        // req.admin is already set by protect middleware (full admin doc minus password)
        const admin = await Admin.findById(req.admin._id).select('-password');

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, admin not found'
            });
        }

        const duration = Date.now() - startTime;
        console.log(`  ✅ Profile fetched: ${admin.name} | Role: ${admin.role} | ${duration}ms\n`);

        res.status(200).json({
            success: true,
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                createdAt: admin.createdAt
            }
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`  ❌ [Platform Auth] Profile fetch failed | ${duration}ms | ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile'
        });
    }
};

// @desc    Get all admins (buildexadmin only)
// @route   GET /api/auth/admins
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select('-password');

        res.status(200).json({
            success: true,
            admins
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch admins'
        });
    }
};

// @desc    Get admin by ID
// @route   GET /api/auth/admins/:id
export const getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select('-password');
        if (!admin) return res.status(404).json({ success: false, error: 'Admin not found' });
        res.status(200).json({ success: true, admin });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch admin' });
    }
};

// @desc    Update admin
// @route   PUT /api/auth/admins/:id
export const updateAdmin = async (req, res) => {
    try {
        const { name, email, isActive } = req.body;
        const admin = await Admin.findByIdAndUpdate(
            req.params.id,
            { name, email, isActive },
            { new: true, runValidators: true }
        ).select('-password');
        if (!admin) return res.status(404).json({ success: false, error: 'Admin not found' });
        res.status(200).json({ success: true, admin });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update admin' });
    }
};

// @desc    Delete admin
// @route   DELETE /api/auth/admins/:id
export const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) return res.status(404).json({ success: false, error: 'Admin not found' });
        res.status(200).json({ success: true, message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete admin' });
    }
};

// @desc    Setup initial super-admin (Run once)
// @route   GET /api/auth/setup-admin
export const setupSuperAdmin = async (req, res) => {
    try {
        const existingAdmin = await Admin.findOne({ role: 'buildexadmin' });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: 'Buildex Admin already exists' });
        }
        const superAdmin = await Admin.create({
            name: 'Buildex Admin',
            email: 'admin@buildex.io',
            password: 'Admin@123',
            role: 'buildexadmin'
        });
        const token = generateToken(superAdmin._id);
        res.status(201).json({ success: true, data: { admin: superAdmin, token } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Seed super admin on server start
export const seedSuperAdmin = async () => {
    try {
        const existing = await Admin.findOne({ email: 'admin@buildex.io' });
        if (existing) {
            console.log('✅ [Seed] Buildex Super Admin already exists:', existing.email, '| Role:', existing.role);
            return;
        }
        await Admin.create({
            name: 'Super Admin',
            email: 'admin@buildex.io',
            password: 'Admin@123',
            role: 'superadmin'
        });
        console.log('✅ [Seed] Super Admin created: admin@buildex.io / Admin@123');
    } catch (error) {
        console.error('❌ [Seed] Failed to seed admin:', error.message);
    }
};
