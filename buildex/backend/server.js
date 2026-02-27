import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import connectDB from "./db/index.js";
import quotationRoutes from './routes/quotationRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import authRoutes from './routes/authRoutes.js';
import platformAuthRoutes from './routes/platformAuthRoutes.js';
import { seedSuperAdmin } from './controllers/authController.js';
import publicQuotationRoutes from './routes/publicQuotationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import logRoutes from './routes/logRoutes.js';
import apiLogger from './middlewares/apiLogger.js';
import { getLogs, getLogStats, clearLogs, getLiveLogs } from './controllers/logController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ═══════════════════════════════════════════════════
// CORE MIDDLEWARE
// ═══════════════════════════════════════════════════
const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
    : [];

app.use(cors({
    origin: allowedOrigins.length > 0
        ? (origin, callback) => {
            // Allow requests with no origin (mobile apps, Postman, server-to-server)
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.warn(`⚠️ [CORS] Blocked origin: ${origin}`);
                callback(null, true); // Allow all for now, but log warnings
            }
        }
        : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 📡 API Logger — MUST be BEFORE all /api routes
app.use(apiLogger);

// ═══════════════════════════════════════════════════
// STATIC & UTILITY ROUTES
// ═══════════════════════════════════════════════════
app.get('/api', (req, res) => {
    res.json({ message: 'Buildex Backend is connected!' });
});

// 📊 Standalone Log Viewer (HTML page + internal API)
// These are NOT /api routes so they won't be logged by apiLogger
app.get('/system-logs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'logs.html'));
});
// Internal log routes for standalone viewer (no auth required)
app.get('/internal/logs', getLogs);
app.get('/internal/logs/stats', getLogStats);
app.get('/internal/logs/live', getLiveLogs);
app.delete('/internal/logs', clearLogs);

// ═══════════════════════════════════════════════════
// API ROUTES (Protected)
// ═══════════════════════════════════════════════════
app.use('/api/quotations', quotationRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/auth', authRoutes);           // Buildex app auth
app.use('/api/platform/auth', platformAuthRoutes); // Super Admin platform auth
app.use('/api/public/quotation', publicQuotationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', feedbackRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/logs', logRoutes);  // Protected with admin auth

// ═══════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════
connectDB()
    .then(async () => {
        await seedSuperAdmin();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    });
