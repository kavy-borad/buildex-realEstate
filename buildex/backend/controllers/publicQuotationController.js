import Quotation from '../models/Quotation.js';
import Client from '../models/Client.js';
import Notification from '../models/Notification.js';
import crypto from 'crypto';

// Get public quotation by token
export const getPublicQuotation = async (req, res) => {
    try {
        const { token } = req.params;

        const quotation = await Quotation.findOne({ accessToken: token }).populate('client');

        if (!quotation) {
            return res.status(404).json({ message: 'Quotation not found or invalid link.' });
        }

        // Check if expired
        if (quotation.tokenExpiresAt && new Date() > quotation.tokenExpiresAt) {
            return res.status(410).json({ message: 'This quotation link has expired.' });
        }

        // Log view activity if not already viewed by client (or just log every view)
        // Only update status if it's pending
        if (quotation.clientStatus === 'pending') {
            quotation.clientStatus = 'viewed';
            quotation.viewedAt = new Date();
            await quotation.save();
        }

        // Map backend model to frontend expected structure
        const responseData = {
            ...quotation.toObject(),
            clientDetails: {
                name: quotation.client?.name || 'Valued Client',
                phone: quotation.client?.phone || '',
                email: quotation.client?.email || '',
                siteAddress: quotation.client?.address || '',
                quotationDate: quotation.quotationDate,
                validTill: quotation.validTill
            },
            id: quotation._id
        };

        res.json({
            success: true,
            data: responseData
        });
    } catch (error) {
        console.error('Error fetching public quotation:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Respond to quotation (Approve/Reject/Request Changes)
export const respondToQuotation = async (req, res) => {
    try {
        const { token } = req.params;
        const { action, comments, reasons, requestedChanges } = req.body;

        const quotation = await Quotation.findOne({ accessToken: token }).populate('client');

        if (!quotation) {
            return res.status(404).json({ success: false, message: 'Quotation not found.' });
        }

        if (quotation.tokenExpiresAt && new Date() > quotation.tokenExpiresAt) {
            return res.status(410).json({ success: false, message: 'Link expired.' });
        }

        // Validate action
        const validActions = ['approve', 'reject', 'request-changes'];
        if (!validActions.includes(action)) {
            return res.status(400).json({ success: false, message: 'Invalid action.' });
        }

        // Update status based on action
        let newStatus = 'pending';
        let clientStatus = 'pending';

        if (action === 'approve') {
            newStatus = 'accepted';
            clientStatus = 'approved';
            quotation.acceptedAt = new Date();
        } else if (action === 'reject') {
            newStatus = 'rejected';
            clientStatus = 'rejected';
            quotation.rejectedAt = new Date();
        } else if (action === 'request-changes') {
            // Keep internal status as sent or maybe a new one 'negotiation'
            // For now let's keep it 'sent' but client status 'changes-requested'
            newStatus = 'sent';
            clientStatus = 'changes-requested';
        }

        quotation.status = newStatus;
        quotation.clientStatus = clientStatus;

        // Save feedback
        quotation.clientFeedback = {
            action,
            comments,
            rejectionReason: reasons, // Assuming reasons is a string or array joined
            requestedChanges: requestedChanges || [],
            respondedAt: new Date(),
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        };

        // Log activity
        quotation.activityLog.push({
            action: `Client ${action}d`,
            details: comments || (action === 'reject' ? reasons : ''),
            ipAddress: req.ip
        });

        await quotation.save();

        // Create Notification
        let notificationType = 'info';
        let notificationMessage = `Client responded to quotation ${quotation.quotationNumber}`;

        const clientName = quotation.client?.name || 'Client';

        if (action === 'approve') {
            notificationType = 'success';
            notificationMessage = `Quotation ${quotation.quotationNumber} approved by ${clientName}`;
        } else if (action === 'reject') {
            notificationType = 'error';
            notificationMessage = `Quotation ${quotation.quotationNumber} rejected by ${clientName}`;
        } else if (action === 'request-changes') {
            notificationType = 'warning';
            notificationMessage = `Changes requested for ${quotation.quotationNumber} by ${clientName}`;
        }

        await Notification.create({
            type: notificationType,
            message: notificationMessage,
            relatedId: quotation._id,
            clientName: clientName,
            isRead: false
        });

        // TODO: Send email notification to contractor (admin)

        res.json({
            success: true,
            message: 'Response submitted successfully',
            status: clientStatus,
            data: { status: clientStatus }
        });

    } catch (error) {
        console.error('Error responding to quotation:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
