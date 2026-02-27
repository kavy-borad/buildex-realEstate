/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📋 QUOTATION CONTROLLER - Complete Business Logic
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Quotation from '../models/Quotation.js';
import Client from '../models/Client.js';
import { generateQuotationNumber } from '../utils/generateNumber.js';

import crypto from 'crypto';

/**
 * Transform MongoDB quotation to frontend format
 */
const transformQuotationForFrontend = (quotation) => {
    const q = quotation.toObject ? quotation.toObject() : quotation;

    return {
        id: q._id.toString(),
        quotationNumber: q.quotationNumber,
        clientDetails: q.clientDetails || {
            name: q.client?.name || '',
            phone: q.client?.phone || '',
            email: q.client?.email || '',
            siteAddress: q.client?.address || '',
            quotationDate: q.quotationDate || q.createdAt,
            validTill: q.validTill || q.tokenExpiresAt
        },
        projectDetails: q.projectDetails,
        costItems: q.costItems,
        summary: q.summary,
        termsAndConditions: q.termsAndConditions || '',
        status: q.status,
        createdAt: q.createdAt,
        notes: q.notes
    };
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * 1. CREATE QUOTATION
 * POST /api/quotations
 * ─────────────────────────────────────────────────────────────────────────
 */
export const createQuotation = async (req, res) => {
    const startTime = Date.now();
    console.log('\n📋 [Quotation] POST /quotations → Request received');

    try {
        const { clientDetails, projectDetails, costItems, summary, termsAndConditions, status, notes } = req.body;

        // ── Step 1: Validate required fields ──
        if (!clientDetails?.name || !clientDetails?.phone) {
            console.log('  ❌ Validation failed: Missing client name or phone');
            return res.status(400).json({
                success: false,
                message: 'Client name and phone are required'
            });
        }
        if (!projectDetails?.projectType) {
            console.log('  ❌ Validation failed: Missing project type');
            return res.status(400).json({
                success: false,
                message: 'Project type is required'
            });
        }
        if (!costItems || costItems.length === 0) {
            console.log('  ❌ Validation failed: No cost items');
            return res.status(400).json({
                success: false,
                message: 'At least one cost item is required'
            });
        }
        if (!summary?.grandTotal && summary?.grandTotal !== 0) {
            console.log('  ❌ Validation failed: Missing grand total in summary');
            return res.status(400).json({
                success: false,
                message: 'Quotation summary with grandTotal is required'
            });
        }
        console.log('  ✅ Validation passed:', {
            client: clientDetails.name,
            project: projectDetails.projectType,
            items: costItems.length,
            grandTotal: summary.grandTotal
        });

        // ── Step 2: Find or create client in Client collection ──
        console.log('  🔍 Looking up client:', clientDetails.phone);
        let client = await Client.findOne({ phone: clientDetails.phone, adminId: req.admin._id });

        if (!client) {
            client = await Client.create({
                name: clientDetails.name,
                phone: clientDetails.phone,
                email: clientDetails.email || '',
                address: clientDetails.siteAddress || '',
                adminId: req.admin._id
            });
            console.log('  👤 New client created:', client._id);
        } else {
            console.log('  👤 Existing client found:', client._id);
        }

        // ── Step 3: Generate quotation number ──
        const quotationNumber = await generateQuotationNumber();
        console.log('  🔢 Quotation number:', quotationNumber);

        // ── Step 4: Generate access token + dates ──
        const accessToken = crypto.randomBytes(32).toString('hex');
        const quotationDate = clientDetails.quotationDate ? new Date(clientDetails.quotationDate) : new Date();
        const validTill = clientDetails.validTill ? new Date(clientDetails.validTill) : new Date(quotationDate.getTime() + 30 * 24 * 60 * 60 * 1000);

        // ── Step 5: Save to database ──
        console.log('  💾 Saving to database...');
        const quotation = await Quotation.create({
            quotationNumber,
            adminId: req.admin._id,
            clientDetails,
            client: client._id,
            projectDetails,
            costItems,
            summary,
            termsAndConditions: termsAndConditions || '',
            status: status || 'draft',
            quotationDate,
            validTill,
            notes: notes || '',
            accessToken,
            tokenExpiresAt: validTill
        });

        // ── Step 6: Update client stats ──
        client.totalQuotations += 1;
        await client.save();

        const duration = Date.now() - startTime;
        console.log(`  ✅ Quotation created: ${quotationNumber} | ID: ${quotation._id} | ₹${summary.grandTotal.toLocaleString('en-IN')} | ${duration}ms\n`);

        res.status(201).json({
            success: true,
            data: transformQuotationForFrontend(quotation)
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`  ❌ [Quotation] POST failed | ${duration}ms | ${error.message}`);
        console.error('  Stack:', error.stack);

        res.status(500).json({
            success: false,
            message: `Failed to create quotation: ${error.message}`,
            error: error.message
        });
    }
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * 2. GET ALL QUOTATIONS
 * GET /api/quotations?status=draft&startDate=...&endDate=...
 * ─────────────────────────────────────────────────────────────────────────
 */
export const getAllQuotations = async (req, res) => {
    const startTime = Date.now();
    console.log('\n📋 [Quotation] GET /quotations → Request received');

    try {
        const { status, clientStatus, startDate, endDate, clientId } = req.query;

        // Build filter
        const filter = { adminId: req.admin._id };
        if (status) filter.status = status;
        if (clientStatus) filter.clientStatus = clientStatus;
        if (clientId) filter.client = clientId;
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const activeFilters = Object.keys(filter);
        if (activeFilters.length > 0) {
            console.log('  🔍 Filters:', filter);
        }

        const quotations = await Quotation.find(filter)
            .sort({ createdAt: -1 })
            .populate('client');

        // Transform to frontend format
        const transformedQuotations = quotations.map(transformQuotationForFrontend);

        const duration = Date.now() - startTime;
        console.log(`  ✅ Found ${transformedQuotations.length} quotations | Filters: ${activeFilters.length > 0 ? activeFilters.join(', ') : 'none'} | ${duration}ms\n`);

        res.status(200).json({
            success: true,
            count: transformedQuotations.length,
            data: transformedQuotations
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`  ❌ [Quotation] GET failed | ${duration}ms | ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch quotations',
            error: error.message
        });
    }
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * 3. GET SINGLE QUOTATION
 * ─────────────────────────────────────────────────────────────────────────
 */
export const getQuotationById = async (req, res) => {
    try {
        const quotation = await Quotation.findOne({ _id: req.params.id, adminId: req.admin._id }).populate('client');

        if (!quotation) {
            return res.status(404).json({
                success: false,
                message: 'Quotation not found'
            });
        }

        res.status(200).json({
            success: true,
            data: transformQuotationForFrontend(quotation)
        });
    } catch (error) {
        console.error('Error fetching quotation:', error);

        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Quotation not found (Invalid ID)'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to fetch quotation',
            error: error.message
        });
    }
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * 4. UPDATE QUOTATION
 * ─────────────────────────────────────────────────────────────────────────
 */
export const updateQuotation = async (req, res) => {
    const startTime = Date.now();
    const id = req.params.id;
    console.log(`\n✏️ [Quotation] PUT /quotations/${id} → Request received`);

    try {
        const { clientDetails, projectDetails, costItems, summary, notes, termsAndConditions } = req.body;

        const quotation = await Quotation.findOne({ _id: id, adminId: req.admin._id });

        if (!quotation) {
            console.log(`  ❌ Quotation not found (${id})`);
            return res.status(404).json({ success: false, message: 'Quotation not found' });
        }

        console.log(`  📋 Found: ${quotation.quotationNumber} | Status: ${quotation.status} | ClientStatus: ${quotation.clientStatus}`);

        // Update fields
        if (clientDetails) quotation.clientDetails = clientDetails;
        if (projectDetails) quotation.projectDetails = projectDetails;
        if (costItems) quotation.costItems = costItems;
        if (summary) quotation.summary = summary;
        if (notes !== undefined) quotation.notes = notes;
        if (termsAndConditions !== undefined) quotation.termsAndConditions = termsAndConditions;

        // If the quotation was previously responded to by the client (e.g. changes requested)
        // Reset it when admin makes edits, so the client gets a fresh "pending" state.
        if (quotation.clientStatus && quotation.clientStatus !== 'pending') {
            const prevStatus = quotation.clientStatus;
            quotation.clientStatus = 'pending';
            quotation.status = 'draft';

            quotation.activityLog.push({
                action: 'Quotation Revised',
                details: `Admin revised quotation after client ${prevStatus}.`,
                ipAddress: req.ip
            });

            quotation.clientFeedback = undefined;
            console.log(`  🔁 Reset: clientStatus ${prevStatus} → pending | Cleared feedback`);
        } else {
            quotation.activityLog.push({
                action: 'Quotation Updated',
                details: 'Admin updated quotation details.',
                ipAddress: req.ip
            });
        }

        await quotation.save();
        await quotation.populate('client');

        const duration = Date.now() - startTime;
        console.log(`  ✅ Updated ${quotation.quotationNumber} | Total: ₹${quotation.summary?.grandTotal?.toLocaleString()} | ${duration}ms\n`);

        res.status(200).json({
            success: true,
            data: transformQuotationForFrontend(quotation)
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`  ❌ [Quotation] PUT failed | ${duration}ms | ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to update quotation',
            error: error.message
        });
    }
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * 5. DELETE QUOTATION
 * DELETE /api/quotations/:id
 * ─────────────────────────────────────────────────────────────────────────
 */
export const deleteQuotation = async (req, res) => {
    const startTime = Date.now();
    const id = req.params.id;
    console.log(`\n🗑️ [Quotation] DELETE /quotations/${id} → Request received`);

    try {
        const quotation = await Quotation.findOne({ _id: id, adminId: req.admin._id });

        if (!quotation) {
            console.log(`  ❌ Error: Quotation not found (${id})`);
            return res.status(404).json({ success: false, message: 'Quotation not found' });
        }

        const quotationNumber = quotation.quotationNumber;

        // Update client statistics
        if (quotation.client) {
            try {
                const client = await Client.findById(quotation.client);
                if (client) {
                    client.totalQuotations = Math.max(0, client.totalQuotations - 1);
                    await client.save();
                    console.log(`  👤 Updated client stats (Total Quotations: ${client.totalQuotations})`);
                }
            } catch (clientError) {
                console.warn('  ⚠️ Failed to update client stats:', clientError.message);
            }
        }

        await quotation.deleteOne();

        const duration = Date.now() - startTime;
        console.log(`  ✅ Successfully deleted quotation ${quotationNumber} (ID: ${id}) | ${duration}ms\n`);

        res.status(200).json({
            success: true,
            message: 'Quotation deleted successfully'
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`  ❌ [Quotation] DELETE failed | ${duration}ms | ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to delete quotation',
            error: error.message
        });
    }
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * 6. UPDATE QUOTATION STATUS
 * ─────────────────────────────────────────────────────────────────────────
 */
export const updateQuotationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const quotation = await Quotation.findOne({ _id: req.params.id, adminId: req.admin._id });

        if (!quotation) {
            return res.status(404).json({ message: 'Quotation not found' });
        }

        quotation.status = status;

        // Update tracking timestamps
        if (status === 'sent') quotation.sentAt = new Date();
        if (status === 'accepted') quotation.acceptedAt = new Date();
        if (status === 'rejected') quotation.rejectedAt = new Date();

        await quotation.save();

        res.status(200).json({
            success: true,
            data: quotation
        });
    } catch (error) {
        console.error('Error updating quotation status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update quotation status',
            error: error.message
        });
    }
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * 7. GET QUOTATION STATISTICS
 * ─────────────────────────────────────────────────────────────────────────
 */
export const getQuotationStats = async (req, res) => {
    try {
        const filter = { adminId: req.admin._id };
        const totalQuotations = await Quotation.countDocuments(filter);
        const draftQuotations = await Quotation.countDocuments({ ...filter, status: 'draft' });
        const sentQuotations = await Quotation.countDocuments({ ...filter, status: 'sent' });
        const acceptedQuotations = await Quotation.countDocuments({ ...filter, status: 'accepted' });
        const rejectedQuotations = await Quotation.countDocuments({ ...filter, status: 'rejected' });

        // Calculate total value
        const quotations = await Quotation.find(filter);
        const totalValue = quotations.reduce((sum, q) => sum + q.summary.grandTotal, 0);

        res.status(200).json({
            success: true,
            data: {
                total: totalQuotations,
                draft: draftQuotations,
                sent: sentQuotations,
                accepted: acceptedQuotations,
                rejected: rejectedQuotations,
                totalValue
            }
        });
    } catch (error) {
        console.error('Error fetching quotation stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch quotation stats',
            error: error.message
        });
    }
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * 8. GET SHAREABLE LINK FOR CLIENT
 * ─────────────────────────────────────────────────────────────────────────
 */
export const getShareableLink = async (req, res) => {
    try {
        const quotation = await Quotation.findOne({ _id: req.params.id, adminId: req.admin._id });

        if (!quotation) {
            return res.status(404).json({
                success: false,
                message: 'Quotation not found'
            });
        }

        // If no access token exists, generate one
        if (!quotation.accessToken) {
            quotation.accessToken = crypto.randomBytes(32).toString('hex');
            quotation.tokenExpiresAt = quotation.validTill || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            await quotation.save();
        }

        // Update status to 'sent' if it's still draft
        if (quotation.status === 'draft') {
            quotation.status = 'sent';
            quotation.sentAt = new Date();
            await quotation.save();
        }

        // Generate full URL (you can configure the base URL via environment variable)
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
        const shareableUrl = `${baseUrl}/quotation/view/${quotation.accessToken}`;

        res.status(200).json({
            success: true,
            data: {
                accessToken: quotation.accessToken,
                shareableUrl,
                expiresAt: quotation.tokenExpiresAt
            }
        });
    } catch (error) {
        console.error('Error generating shareable link:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate shareable link',
            error: error.message
        });
    }
};
