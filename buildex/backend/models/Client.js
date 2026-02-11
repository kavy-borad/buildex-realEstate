import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    address: {
        type: String,
        trim: true
    },

    // Statistics
    totalQuotations: {
        type: Number,
        default: 0
    },
    totalInvoices: {
        type: Number,
        default: 0
    },
    totalRevenue: {
        type: Number,
        default: 0
    },

    // Business Info
    gstNumber: {
        type: String,
        trim: true
    },
    panNumber: {
        type: String,
        trim: true
    },

    // Status
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },

    // Notes
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Index for faster queries
clientSchema.index({ phone: 1 });
clientSchema.index({ email: 1 });
clientSchema.index({ name: 'text' });

const Client = mongoose.model('Client', clientSchema);

export default Client;
