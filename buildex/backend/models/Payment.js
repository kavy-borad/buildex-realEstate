import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    // References
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },

    // Payment Details
    amount: {
        type: Number,
        required: [true, 'Payment amount is required'],
        min: [0, 'Amount must be positive']
    },

    paymentDate: {
        type: Date,
        required: true,
        default: Date.now
    },

    paymentMethod: {
        type: String,
        enum: ['Cash', 'Cheque', 'Online', 'Bank Transfer', 'UPI', 'Other'],
        required: true,
        default: 'Cash'
    },

    // Transaction Details
    transactionId: {
        type: String,
        trim: true
    },
    chequeNumber: {
        type: String,
        trim: true
    },
    bankName: {
        type: String,
        trim: true
    },

    // Notes
    notes: {
        type: String,
        trim: true
    },

    // Status
    status: {
        type: String,
        enum: ['confirmed', 'pending', 'failed', 'refunded'],
        default: 'confirmed'
    },

    // Recorded timestamp
    recordedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes
paymentSchema.index({ invoice: 1 });
paymentSchema.index({ client: 1 });
paymentSchema.index({ paymentDate: -1 });
paymentSchema.index({ createdAt: -1 });

// Auto-populate on find
paymentSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'invoice',
        select: 'invoiceNumber summary.grandTotal'
    }).populate({
        path: 'client',
        select: 'name phone email'
    });
    next();
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
