
import puppeteer from 'puppeteer';
import { generateQuotationHTML } from '../utils/quotationPdfTemplate.js';
import Quotation from '../models/Quotation.js';
import Settings from '../models/Settings.js';

export const generateQuotationPDF = async (req, res) => {
    try {
        const { id } = req.params;
        const previewData = req.body?.previewData; // Safe access

        console.log('📄 PDF Generation Request Received');
        if (id) console.log(`🆔 Quotation ID: ${id}`);
        if (previewData) console.log('📝 Preview Data Received');

        let quotation;
        let companyDetails = {};

        // 1. Fetch Company Settings
        try {
            const settings = await Settings.findOne();
            if (settings && settings.companyDetails) {
                console.log('🏢 Company details found');
                companyDetails = {
                    name: settings.companyDetails.name,
                    address: settings.companyDetails.address,
                    phone: settings.companyDetails.phone,
                    email: settings.companyDetails.email,
                    gstNo: settings.companyDetails.gstNumber,
                    logo: settings.companyDetails.logo
                };
            } else {
                console.log('⚠️ No company details found, using defaults');
            }
        } catch (settingsError) {
            console.error('❌ Error fetching settings:', settingsError);
        }

        // 2. Determine Source (DB vs Preview)
        if (req.method === 'POST' && previewData) {
            // Preview mode
            quotation = previewData;
            // Ensure dates exist for preview
            if (!quotation.createdAt) quotation.createdAt = new Date().toISOString();
            if (!quotation.quotationNumber) quotation.quotationNumber = 'DRAFT';

            console.log('✅ Using Preview Data');
        } else if (id) {
            // Fetch from DB
            console.log(`🔍 Fetching quotation with ID: ${id}`);

            try {
                quotation = await Quotation.findById(id).populate('client');
            } catch (dbError) {
                console.error('❌ Database query error:', dbError.message);
                return res.status(400).json({
                    success: false,
                    message: 'Invalid quotation ID format',
                    error: dbError.message
                });
            }

            if (!quotation) {
                console.log('❌ Quotation not found in DB');
                return res.status(404).json({
                    success: false,
                    message: 'Quotation not found. Please check if the quotation exists.',
                    hint: 'The quotation may have been deleted or the ID is incorrect.'
                });
            }

            console.log('✅ Quotation found in DB:', quotation.quotationNumber);
        } else {
            console.log('❌ Invalid request: No ID or Data');
            return res.status(400).json({
                success: false,
                message: 'Invalid Request: Missing ID or Data',
                hint: 'Please provide either a quotation ID or preview data.'
            });
        }

        // 3. Ensure Data Integrity (Fix missing clientDetails)
        if (!quotation.clientDetails) {
            console.log('⚠️ Missing clientDetails, attempting to reconstruct...');
            if (quotation.client) {
                quotation.clientDetails = {
                    name: quotation.client.name || 'Client Name',
                    phone: quotation.client.phone || '',
                    email: quotation.client.email || '',
                    siteAddress: quotation.client.address || '',
                    quotationDate: quotation.quotationDate || quotation.createdAt,
                    validTill: quotation.validTill || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                };
            } else {
                // Fallback for previews without client details or corrupted data
                quotation.clientDetails = {
                    name: 'Client Name',
                    phone: '',
                    email: '',
                    siteAddress: '',
                    quotationDate: quotation.quotationDate || quotation.createdAt || new Date(),
                    validTill: quotation.validTill || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                };
            }
            console.log('✅ Client details reconstructed');
        }

        // 4. Validate essential data
        if (!quotation.costItems || quotation.costItems.length === 0) {
            console.log('❌ No cost items found');
            return res.status(400).json({
                success: false,
                message: 'Cannot generate PDF: Quotation has no cost items'
            });
        }

        if (!quotation.summary) {
            console.log('❌ No summary found');
            return res.status(400).json({
                success: false,
                message: 'Cannot generate PDF: Quotation has no summary'
            });
        }

        // 4. Generate HTML
        console.log(`PAGE: Generating PDF for ${quotation.quotationNumber}`);
        let htmlContent;
        try {
            htmlContent = generateQuotationHTML(quotation, companyDetails);
        } catch (templateError) {
            console.error('❌ Template Generation Error:', templateError);
            throw new Error('Failed to generate PDF template: ' + templateError.message);
        }
        console.log('✅ HTML content generated. Launching browser...');

        // 5. Generate PDF with Puppeteer
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        console.log('✅ Browser launched. Opening new page...');
        const page = await browser.newPage();

        // Set content and wait for it to load
        console.log('⏳ Setting page content...');
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0',
            timeout: 60000 // 60 seconds timeout
        });
        console.log('✅ Page content set. Generating PDF...');

        // Generate PDF Buffer
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                bottom: '20mm',
                left: '20mm',
                right: '20mm'
            }
        });

        console.log(`✅ PDF generated. Size: ${pdfBuffer.length} bytes. Closing browser...`);
        await browser.close();

        // 6. Send Response
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
            'Content-Disposition': `attachment; filename="Quotation_${quotation.quotationNumber || 'DRAFT'}.pdf"`,
        });

        res.send(pdfBuffer);
        console.log('✅ PDF sent to client.');

    } catch (error) {
        console.error('❌ Error generating PDF:', error);
        res.status(500).json({
            success: false,
            message: 'PDF Generation Failed',
            error: error.message
        });
    }
};
