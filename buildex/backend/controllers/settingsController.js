/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚙️ SETTINGS CONTROLLER
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Settings from '../models/Settings.js';

// Get Settings
export const getSettings = async (req, res) => {
    try {
        const settings = await Settings.getInstance();
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch settings', error: error.message });
    }
};

// Update Settings
export const updateSettings = async (req, res) => {
    try {
        const settings = await Settings.getInstance();

        // Update fields provided in request
        if (req.body.companyDetails) {
            settings.companyDetails = { ...settings.companyDetails, ...req.body.companyDetails };
        }

        if (req.body.numbering) {
            settings.numbering = { ...settings.numbering, ...req.body.numbering };
        }

        if (req.body.defaults) {
            settings.defaults = { ...settings.defaults, ...req.body.defaults };
        }

        if (req.body.termsAndConditions) {
            settings.termsAndConditions = { ...settings.termsAndConditions, ...req.body.termsAndConditions };
        }

        await settings.save();
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update settings', error: error.message });
    }
};

// Reset Counters
export const resetCounters = async (req, res) => {
    try {
        const settings = await Settings.getInstance();
        settings.numbering.quotationCounter = 1;
        settings.numbering.invoiceCounter = 1;
        await settings.save();
        res.status(200).json({ message: 'Counters reset successfully', settings });
    } catch (error) {
        res.status(500).json({ message: 'Failed to reset counters', error: error.message });
    }
};
