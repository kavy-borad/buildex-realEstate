import ApiLog from '../models/ApiLog.js';

/**
 * ═══════════════════════════════════════════════════════════════
 * 📡 API LOGGER MIDDLEWARE - Captures request + response data
 * ═══════════════════════════════════════════════════════════════
 * - Uses process.hrtime.bigint() for accurate timing
 * - Captures sanitized request body (passwords hidden)
 * - Captures response body via res.json intercept
 * - Saves asynchronously — never blocks the response
 */

const apiLogger = (req, res, next) => {
    const start = process.hrtime.bigint();

    // Intercept res.json to capture response body
    const originalJson = res.json.bind(res);
    let capturedResponseBody = null;

    res.json = (body) => {
        capturedResponseBody = body;
        return originalJson(body);
    };

    res.on('finish', () => {
        // Only log /api routes
        if (!req.originalUrl.startsWith('/api')) return;

        // Skip logger's own routes to prevent infinite loops
        if (req.originalUrl.startsWith('/api/logs')) return;

        // Skip preflight requests
        if (req.method === 'OPTIONS') return;

        // Calculate response time in ms
        const end = process.hrtime.bigint();
        const responseTime = Math.round(Number(end - start) / 1e6);

        // Sanitize request body — hide passwords & tokens
        let sanitizedBody = null;
        if (req.body && Object.keys(req.body).length > 0) {
            sanitizedBody = { ...req.body };
            if (sanitizedBody.password) sanitizedBody.password = '***HIDDEN***';
            if (sanitizedBody.confirm_password) sanitizedBody.confirm_password = '***HIDDEN***';
            if (sanitizedBody.token) sanitizedBody.token = '***HIDDEN***';
        }

        const logData = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            responseTime,
            ip: req.ip || req.connection?.remoteAddress || 'unknown',
            userAgent: req.headers['user-agent'] || '',
            requestBody: sanitizedBody,
            responseBody: capturedResponseBody,
            timestamp: new Date()
        };

        // Save async — never blocks API response
        ApiLog.create(logData).catch(() => { });
    });

    next();
};

export default apiLogger;
