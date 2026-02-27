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

    // Builder/Admin Reference for Multi-tenancy
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: [true, 'Admin (Builder) ID is required']
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

// Index for faster queries and uniqueness per builder
clientSchema.index({ phone: 1, adminId: 1 }, { unique: true });
clientSchema.index({ email: 1 });
clientSchema.index({ name: 'text' });

const Client = mongoose.model('Client', clientSchema);

export default Client;
