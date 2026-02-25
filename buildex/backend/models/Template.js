import mongoose from 'mongoose';

const templateItemSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    category: { type: String, required: false },
    description: { type: String, required: false },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
    rate: { type: Number, required: true, min: 0 }
}, { _id: false });

const templateSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    // Default items array
    items: {
        type: [templateItemSchema],
        default: []
    },
    // Optional variants based on construction quality
    qualityVariants: {
        basic: [templateItemSchema],
        standard: [templateItemSchema],
        premium: [templateItemSchema]
    },
    // SaaS Architecture: Global vs Custom
    isGlobal: {
        type: Boolean,
        default: false
        // true: Created by Superadmin (visible to all users)
        // false: Custom template created by a specific user/builder
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        default: null
        // Null for global templates, populated for user templates
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret) {
            ret._id = ret.id || ret._id; // Ensure consistent ID mapping for frontend
        }
    }
});

const Template = mongoose.model('Template', templateSchema);
export default Template;
