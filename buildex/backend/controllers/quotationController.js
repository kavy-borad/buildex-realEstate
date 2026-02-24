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
    const quotationObj = quotation.toObject ? quotation.toObject() : quotation;

    return {
        id: quotationObj._id.toString(),
        quotationNumber: quotationObj.quotationNumber,
        clientDetails: {
            name: quotationObj.client?.name || '',
            phone: quotationObj.client?.phone || '',
            email: quotationObj.client?.email || '',
            siteAddress: quotationObj.client?.address || '',
            quotationDate: quotationObj.quotationDate || quotationObj.createdAt,
            validTill: quotationObj.validTill || quotationObj.tokenExpiresAt
        },
        projectDetails: quotationObj.projectDetails,
        costItems: quotationObj.costItems,
        summary: quotationObj.summary,
        status: quotationObj.status,
        createdAt: quotationObj.createdAt,
        notes: quotationObj.notes
    };
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * 1. CREATE QUOTATION
 * ─────────────────────────────────────────────────────────────────────────
 */
export const createQuotation = async (req, res) => {
    try {
        console.log('\n🔵 ============================================');
        console.log('📋 CREATE QUOTATION REQUEST RECEIVED');
        console.log('============================================');

        const { clientDetails, projectDetails, costItems, summary, status, notes } = req.body;

        console.log('📝 Request Body:', {
            hasClientDetails: !!clientDetails,
            hasProjectDetails: !!projectDetails,
            hasCostItems: !!costItems,
            costItemsCount: costItems?.length || 0,
            hasSummary: !!summary,
            status: status || 'draft'
        });

        // Find or create client
        console.log('🔍 Searching for existing client with phone:', clientDetails.phone);
        let client = await Client.findOne({ phone: clientDetails.phone });

        if (!client) {
            console.log('❌ Client not found - Creating new client...');
            client = await Client.create({
                name: clientDetails.name,
                phone: clientDetails.phone,
                email: clientDetails.email,
                address: clientDetails.siteAddress
            });
            console.log('✅ New client created:', client._id);
        } else {
            console.log('✅ Existing client found:', client._id);
        }

        // Generate quotation number
        console.log('🔢 Generating quotation number...');
        const quotationNumber = await generateQuotationNumber();
        console.log('✅ Quotation number generated:', quotationNumber);

        // Generate secure access token
        const accessToken = crypto.randomBytes(32).toString('hex');

        // Calculate valid till date (30 days default)
        const quotationDate = clientDetails.quotationDate ? new Date(clientDetails.quotationDate) : new Date();
        const validTill = clientDetails.validTill ? new Date(clientDetails.validTill) : new Date(quotationDate.getTime() + 30 * 24 * 60 * 60 * 1000);

        console.log('📅 Dates:', {
            quotationDate: quotationDate.toISOString(),
            validTill: validTill.toISOString()
        });

        // Create quotation
        console.log('💾 Creating quotation in database...');
        const quotation = await Quotation.create({
            quotationNumber,
            client: client._id,
            projectDetails,
            costItems,
            summary,
            status: status || 'draft',
            quotationDate,
            validTill,
            notes,
            accessToken,
            tokenExpiresAt: validTill
        });
        console.log('✅ Quotation created successfully! ID:', quotation._id);

        // Update client statistics
        console.log('📊 Updating client statistics...');
        client.totalQuotations += 1;
        await client.save();
        console.log('✅ Client stats updated. Total quotations:', client.totalQuotations);

        // Populate and return
        console.log('🔗 Populating client data...');
        await quotation.populate('client');
        console.log('✅ Client data populated');

        console.log('✅ ============================================');
        console.log('✅ QUOTATION CREATED SUCCESSFULLY!');
        console.log('✅ ============================================\n');

        res.status(201).json({
            success: true,
            data: transformQuotationForFrontend(quotation)
        });
    } catch (error) {
        console.error('\n❌ ============================================');
        console.error('❌ ERROR CREATING QUOTATION');
        console.error('❌ ============================================');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('❌ ============================================\n');

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
 * ─────────────────────────────────────────────────────────────────────────
 */
export const getAllQuotations = async (req, res) => {
    try {
        const { status, clientStatus, startDate, endDate, clientId } = req.query;

        // Build filter
        const filter = {};
        if (status) filter.status = status;
        if (clientStatus) filter.clientStatus = clientStatus;
        if (clientId) filter.client = clientId;
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const quotations = await Quotation.find(filter)
            .sort({ createdAt: -1 })
            .populate('client');

        // Transform to frontend format
        const transformedQuotations = quotations.map(transformQuotationForFrontend);

        res.status(200).json({
            success: true,
            data: transformedQuotations
        });
    } catch (error) {
        console.error('Error fetching quotations:', error);
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
        const quotation = await Quotation.findById(req.params.id).populate('client');

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
    try {
        const { projectDetails, costItems, summary, notes } = req.body;

        const quotation = await Quotation.findById(req.params.id);

        if (!quotation) {
            return res.status(404).json({ message: 'Quotation not found' });
        }

        // Update fields
        if (projectDetails) quotation.projectDetails = projectDetails;
        if (costItems) quotation.costItems = costItems;
        if (summary) quotation.summary = summary;
        if (notes !== undefined) quotation.notes = notes;

        await quotation.save();
        await quotation.populate('client');

        res.status(200).json({
            success: true,
            data: transformQuotationForFrontend(quotation)
        });
    } catch (error) {
        console.error('Error updating quotation:', error);
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
 * ─────────────────────────────────────────────────────────────────────────
 */
export const deleteQuotation = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id);

        if (!quotation) {
            return res.status(404).json({ message: 'Quotation not found' });
        }

        // Update client statistics (Optional: don't block deletion if this fails)
        if (quotation.client) {
            try {
                const client = await Client.findById(quotation.client);
                if (client) {
                    client.totalQuotations = Math.max(0, client.totalQuotations - 1);
                    await client.save();
                }
            } catch (clientError) {
                console.warn('Failed to update client stats during quotation deletion:', clientError);
                // Continue with deletion
            }
        }

        await quotation.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Quotation deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting quotation:', error);
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
        const quotation = await Quotation.findById(req.params.id);

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
        const totalQuotations = await Quotation.countDocuments();
        const draftQuotations = await Quotation.countDocuments({ status: 'draft' });
        const sentQuotations = await Quotation.countDocuments({ status: 'sent' });
        const acceptedQuotations = await Quotation.countDocuments({ status: 'accepted' });
        const rejectedQuotations = await Quotation.countDocuments({ status: 'rejected' });

        // Calculate total value
        const quotations = await Quotation.find();
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
        const quotation = await Quotation.findById(req.params.id);

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
