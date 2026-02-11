import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
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

const projectDetailsSchema = new mongoose.Schema({
    projectType: String,
    builtUpArea: Number,
    areaUnit: String,
    city: String,
    area: String,
    constructionQuality: String
}, { _id: false });

const summarySchema = new mongoose.Schema({
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    gstPercentage: {
        type: Number,
        default: 18
    },
    gstAmount: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    grandTotal: {
        type: Number,
        required: true
    }
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        unique: true,
        required: true
    },

    // References
    quotation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quotation'
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },

    // Project Details
    projectDetails: {
        type: projectDetailsSchema,
        required: true
    },

    // Items
    items: {
        type: [invoiceItemSchema],
        required: true,
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'At least one item is required'
        }
    },

    // Summary
    summary: {
        type: summarySchema,
        required: true
    },

    // Payment Details
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Partial', 'Paid', 'Overdue'],
        default: 'Pending'
    },
    paidAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    balanceAmount: {
        type: Number,
        required: true
    },

    // Dates
    issueDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },

    // Status
    status: {
        type: String,
        enum: ['draft', 'sent', 'viewed', 'paid', 'cancelled'],
        default: 'draft'
    },

    // Notes
    notes: {
        type: String
    },

    // Terms
    paymentTerms: {
        type: String
    },

    // Tracking
    sentAt: Date,
    viewedAt: Date,
    paidAt: Date
}, {
    timestamps: true
});

// Indexes
invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ client: 1 });
invoiceSchema.index({ quotation: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ paymentStatus: 1 });
invoiceSchema.index({ dueDate: 1 });
invoiceSchema.index({ createdAt: -1 });

// Virtual for overdue status
invoiceSchema.virtual('isOverdue').get(function () {
    return this.dueDate < new Date() && this.paymentStatus !== 'Paid';
});

// Auto-populate on find
// Auto-populate removed. Use .populate() in controllers.

// Update payment status based on paid amount
invoiceSchema.methods.updatePaymentStatus = function () {
    if (this.paidAmount === 0) {
        this.paymentStatus = 'Pending';
    } else if (this.paidAmount >= this.summary.grandTotal) {
        this.paymentStatus = 'Paid';
        this.paidAt = new Date();
    } else {
        this.paymentStatus = 'Partial';
    }

    // Check for overdue
    if (this.dueDate < new Date() && this.paymentStatus !== 'Paid') {
        this.paymentStatus = 'Overdue';
    }

    this.balanceAmount = this.summary.grandTotal - this.paidAmount;
};

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
