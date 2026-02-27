import mongoose from 'mongoose';

const costItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

const clientDetailsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    siteAddress: { type: String },
    quotationDate: { type: String },
    validTill: { type: String }
}, { _id: false });

const projectDetailsSchema = new mongoose.Schema({
    projectType: {
        type: String,
        required: true
    },
    builtUpArea: {
        type: Number,
        required: true
    },
    areaUnit: {
        type: String,
        default: 'Sq.ft'
    },
    city: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    constructionQuality: {
        type: String,
        enum: ['basic', 'standard', 'premium'],
        default: 'standard'
    },
    projectDuration: {
        type: String
    }
}, { _id: false });

const summarySchema = new mongoose.Schema({
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    gstPercentage: {
        type: Number,
        default: 18,
        min: 0,
        max: 100
    },
    gstAmount: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    grandTotal: {
        type: Number,
        required: true,
        min: 0
    },
    labourCost: {
        type: Number,
        default: 0,
        min: 0
    }
}, { _id: false });

const quotationSchema = new mongoose.Schema({
    quotationNumber: {
        type: String,
        unique: true,
        required: true
    },

    // Builder/Admin Reference for Multi-tenancy
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: [true, 'Admin (Builder) ID is required']
    },

    // Client Details (Frontend Structure)
    clientDetails: {
        type: clientDetailsSchema,
        required: true
    },
    // Optional Reference to Client Collection (if user is registered as a regular client later)
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: false
    },

    // Project Details
    projectDetails: {
        type: projectDetailsSchema,
        required: true
    },

    // Cost Items
    costItems: {
        type: [costItemSchema],
        required: true,
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'At least one cost item is required'
        }
    },

    // Summary
    summary: {
        type: summarySchema,
        required: true
    },

    // Status
    status: {
        type: String,
        enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'],
        default: 'draft'
    },

    // Dates
    quotationDate: {
        type: Date,
        default: Date.now
    },
    validTill: {
        type: Date
    },

    // Tracking
    sentAt: Date,
    viewedAt: Date,
    acceptedAt: Date,
    rejectedAt: Date,

    // NEW: Secure Access
    accessToken: {
        type: String,
        unique: true,
        sparse: true  // Only for sent quotations
    },
    tokenExpiresAt: {
        type: Date
    },

    // NEW: Client Actions
    clientStatus: {
        type: String,
        enum: ['pending', 'viewed', 'approved', 'rejected', 'changes-requested'],
        default: 'pending'
    },

    // NEW: Client Feedback
    clientFeedback: {
        action: {
            type: String,
            enum: ['approve', 'reject', 'request-changes']
        },
        comments: String,
        rejectionReason: String,
        requestedChanges: [String],
        respondedAt: Date,
        ipAddress: String,
        userAgent: String
    },

    // NEW: Activity Timeline
    activityLog: [{
        action: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        details: String,
        ipAddress: String
    }],

    // Notes
    notes: {
        type: String
    },

    // Terms & Conditions
    termsAndConditions: {
        type: String
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

// Indexes for performance
quotationSchema.index({ quotationNumber: 1 });
quotationSchema.index({ client: 1 });
quotationSchema.index({ status: 1 });
quotationSchema.index({ createdAt: -1 });

// Virtual for checking if expired
quotationSchema.virtual('isExpired').get(function () {
    if (!this.validTill) return false;
    return new Date() > this.validTill;
});

// Auto-populate removed to avoid middleware conflicts. Use .populate() in controllers.

const Quotation = mongoose.model('Quotation', quotationSchema);

export default Quotation;
