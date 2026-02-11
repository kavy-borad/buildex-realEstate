import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    // Company Details
    companyDetails: {
        name: {
            type: String,
            required: true,
            default: 'Buildex Construction'
        },
        address: {
            type: String,
            required: true,
            default: 'Mumbai, India'
        },
        phone: {
            type: String,
            required: true,
            default: '+91 98765 43210'
        },
        email: {
            type: String,
            required: true,
            default: 'info@buildex.com'
        },
        gstNumber: {
            type: String,
            trim: true
        },
        panNumber: {
            type: String,
            trim: true
        },
        tagline: {
            type: String,
            default: 'Building Dreams, Creating Reality'
        },
        logo: {
            type: String // URL or base64
        },
        website: {
            type: String
        }
    },

    // Numbering Preferences
    numbering: {
        quotationPrefix: {
            type: String,
            default: 'QT'
        },
        invoicePrefix: {
            type: String,
            default: 'INV'
        },
        quotationCounter: {
            type: Number,
            default: 1
        },
        invoiceCounter: {
            type: Number,
            default: 1
        },
        includeYear: {
            type: Boolean,
            default: true
        },
        digitLength: {
            type: Number,
            default: 4,
            min: 3,
            max: 6
        }
    },

    // Default Values
    defaults: {
        gstPercentage: {
            type: Number,
            default: 18,
            min: 0,
            max: 100
        },
        currency: {
            type: String,
            default: 'INR'
        },
        currencySymbol: {
            type: String,
            default: '₹'
        },
        paymentTermsDays: {
            type: Number,
            default: 15
        },
        quotationValidityDays: {
            type: Number,
            default: 30
        }
    },

    // Terms & Conditions
    termsAndConditions: {
        quotation: {
            type: String,
            default: 'This quotation is valid for 30 days from the date of issue.'
        },
        invoice: {
            type: String,
            default: 'Payment is due within 15 days of invoice date.'
        }
    },

    // Email Settings
    emailSettings: {
        smtpHost: String,
        smtpPort: Number,
        smtpUser: String,
        smtpPassword: String,
        fromEmail: String,
        fromName: String
    }
}, {
    timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getInstance = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
