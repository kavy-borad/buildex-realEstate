import Template from '../models/Template.js';

/**
 * ─────────────────────────────────────────────────────────────
 * GET /api/templates
 * Returns all accessible templates (Global + User specific)
 * ─────────────────────────────────────────────────────────────
 */
export const getAllTemplates = async (req, res) => {
    try {
        // Find all templates where either it's a global template or belongs to this user's company
        // For now, since user/company structure might be simple, returning all global ones
        const templates = await Template.find({
            $or: [
                { isGlobal: true },
                // { companyId: req.user.companyId } // Uncomment when Auth companyId is fully integrated
            ]
        }).lean();

        res.status(200).json({
            success: true,
            data: templates
        });
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch templates'
        });
    }
};

/**
 * ─────────────────────────────────────────────────────────────
 * POST /api/templates
 * Create a new custom or global template
 * ─────────────────────────────────────────────────────────────
 */
export const createTemplate = async (req, res) => {
    try {
        const { id, name, description, items, qualityVariants, isGlobal } = req.body;

        // For global templates, only superadmin should be allowed. 
        // For now, accepting it as is from the request body.

        const newTemplate = new Template({
            id: id || Date.now().toString(),
            name,
            description,
            items: items || [],
            qualityVariants: qualityVariants || {},
            isGlobal: isGlobal || false
            // companyId: req.user.companyId
        });

        await newTemplate.save();

        res.status(201).json({
            success: true,
            data: newTemplate
        });
    } catch (error) {
        console.error('Error creating template:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create template',
            error: error.message
        });
    }
};
