import mongoose from 'mongoose';

/**
 * ═══════════════════════════════════════════════════════════════
 * 📊 API LOG MODEL - Tracks API requests for Log Viewer
 * ═══════════════════════════════════════════════════════════════
 * Stores essential fields + sanitized request/response data.
 * TTL index auto-deletes logs after 7 days.
 */

const apiLogSchema = new mongoose.Schema({
    method: {
        type: String,
        required: true,
        enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    },
    url: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        required: true,
    },
    responseTime: {
        type: Number,
        required: true,
    },
    ip: {
        type: String,
    },
    userAgent: {
        type: String,
    },
    requestBody: {
        type: mongoose.Schema.Types.Mixed,  // Sanitized request body (passwords hidden)
    },
    responseBody: {
        type: mongoose.Schema.Types.Mixed,  // Response JSON
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: false,
    versionKey: false,
});

// Performance indexes
apiLogSchema.index({ timestamp: -1 });
apiLogSchema.index({ status: 1 });
apiLogSchema.index({ method: 1 });

// TTL: auto-delete logs older than 7 days
apiLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

const ApiLog = mongoose.model('ApiLog', apiLogSchema);

export default ApiLog;
