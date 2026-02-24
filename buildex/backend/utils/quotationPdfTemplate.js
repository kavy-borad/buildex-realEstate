
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 ENTERPRISE QUOTATION PDF TEMPLATE
 * ═══════════════════════════════════════════════════════════════════════════
 * Enterprise-grade A4 quotation PDF for Buildex Construction.
 * Features:
 * - Sharp, print-ready typography (Poppins/Inter)
 * - Corporate color theme (Navy/Gold/Gray)
 * - Multi-page auto flow support
 * - Professional card layouts and financial summaries
 */

export const generateQuotationHTML = (quotation, companyDetails) => {
    // Format currency helper
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // 1️⃣ Typography & Colors
    // Note: We use absolute imports for fonts to ensure they render in Puppeteer
    const styles = `
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap');

        :root {
            --primary-navy: #0F172A;
            --secondary-steel: #1E293B;
            --accent-gold: #C6A75E;
            --border-gray: #E5E7EB;
            --bg-soft-gray: #F8FAFC;
            --text-dark: #334155;
            --text-light: #64748B;
            --white: #FFFFFF;
        }

        @page {
            size: A4;
            margin: 20mm;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            font-size: 11.5px;
            color: var(--text-dark);
            line-height: 1.6;
            letter-spacing: 0.3px;
            margin: 0;
            padding: 0;
            background-color: var(--white);
            -webkit-print-color-adjust: exact;
        }

        /* 
         * LAYOUT UTILITIES 
         */
        .container {
            width: 100%;
            position: relative;
            z-index: 2;
        }

        /* WATERMARK */
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            opacity: 0.05;
            z-index: 0;
            pointer-events: none;
        }
        
        .watermark img {
            width: 500px;
            height: auto;
        }

        /* 4️⃣ HEADER DESIGN (Premium) */
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }

        .header-table td {
            vertical-align: top;
            padding: 0;
        }

        .company-branding {
            text-align: left;
        }

        .company-logo-img {
            height: 60px;
            width: auto;
            object-fit: contain;
            margin-bottom: 12px;
        }

        .company-name {
            font-family: 'Poppins', sans-serif;
            font-size: 22px;
            font-weight: 700;
            color: var(--primary-navy);
            text-transform: uppercase;
            line-height: 1.2;
            margin-bottom: 5px;
        }

        .company-details {
            font-size: 10.5px;
            color: var(--text-light);
            line-height: 1.5;
        }

        .quotation-header-block {
            text-align: right;
        }

        .quotation-title {
            font-family: 'Poppins', sans-serif;
            font-size: 28px;
            font-weight: 700;
            color: var(--primary-navy);
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 5px;
            line-height: 1;
        }

        .quotation-meta-table {
            float: right;
            border-collapse: collapse;
            margin-top: 5px;
        }
        
        .quotation-meta-table td {
            text-align: right;
            padding: 2px 0 2px 15px;
            font-size: 11px;
        }

        .meta-label {
            color: var(--text-light);
            font-weight: 500;
        }

        .meta-value {
            color: var(--primary-navy);
            font-weight: 600;
        }

        .header-divider {
            width: 100%;
            height: 2px;
            background: linear-gradient(to right, var(--primary-navy) 70%, var(--accent-gold) 70%);
            margin-bottom: 30px;
        }

        /* 5️⃣ CLIENT & PROJECT SECTION (Card Layout) */
        .details-container {
            width: 100%;
            margin-bottom: 35px;
            display: table; /* Use table for reliable side-by-side layout in PDF */
            border-spacing: 20px 0;
            margin-left: -20px; /* Compenstate for spacing */
            width: calc(100% + 40px);
        }

        .details-card {
            display: table-cell;
            width: 50%;
            background-color: var(--bg-soft-gray);
            border: 1px solid var(--border-gray);
            border-radius: 6px;
            padding: 20px;
            vertical-align: top;
        }

        .card-header {
            font-family: 'Poppins', sans-serif;
            font-size: 13px;
            font-weight: 600;
            color: var(--secondary-steel);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid var(--border-gray);
            padding-bottom: 10px;
            margin-bottom: 15px;
        }

        .info-table {
            width: 100%;
            border-collapse: collapse;
        }

        .info-table td {
            padding: 4px 0;
            vertical-align: top;
            font-size: 11.5px;
        }

        .info-label {
            font-weight: 600;
            color: var(--secondary-steel);
            width: 90px;
        }

        .info-value {
            color: var(--text-dark);
        }

        /* 6️⃣ TABLE DESIGN (Most Important) */
        .cost-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            border: 1px solid var(--border-gray);
        }

        .cost-table thead {
            background-color: #F1F5F9;
            display: table-header-group;
        }

        .cost-table th {
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            font-weight: 600;
            color: var(--primary-navy);
            text-transform: uppercase;
            padding: 14px 10px;
            border-bottom: 1px solid var(--border-gray);
            white-space: nowrap;
        }

        .cost-table tr {
            page-break-inside: avoid;
        }

        .cost-table tbody tr:nth-child(even) {
            background-color: #FAFAFA;
        }

        .cost-table td {
            padding: 12px 10px;
            border-bottom: 1px solid var(--border-gray);
            color: var(--text-dark);
            vertical-align: top;
            font-size: 11.5px;
        }

        /* Column Alignments - increased specificity to apply to both th and td */
        .cost-table .col-sr { width: 50px; text-align: center; }
        .cost-table td.col-sr { color: var(--text-light); }
        
        .cost-table .col-desc { width: auto; text-align: left; }
        .cost-table td.col-desc { font-weight: 500; }
        
        .cost-table .col-qty { width: 80px; text-align: center; }
        
        .cost-table .col-unit { width: 70px; text-align: center; }
        .cost-table td.col-unit { color: var(--text-light); }
        
        .cost-table .col-rate { width: 120px; text-align: right; }
        
        .cost-table .col-amount { width: 130px; text-align: right; }
        .cost-table td.col-amount { font-weight: 600; color: var(--primary-navy); }

        .item-name {
            font-weight: 600;
            color: var(--primary-navy);
            margin-bottom: 4px;
        }

        .item-desc {
            font-size: 11px;
            color: var(--text-light);
            white-space: pre-wrap;
            line-height: 1.5;
        }

        /* 7️⃣ FINANCIAL SUMMARY SECTION */
        .summary-container {
            page-break-inside: avoid;
            width: 100%;
            margin-bottom: 40px;
            display: flex;
            justify-content: flex-end;
        }

        .summary-block {
            width: 45%;
            margin-left: auto;
        }

        .summary-table {
            width: 100%;
            border-collapse: collapse;
        }

        .summary-table td {
            padding: 8px 0;
            text-align: right;
        }

        .summary-label {
            color: var(--text-light);
            padding-right: 25px;
            font-weight: 500;
        }

        .summary-value {
            color: var(--primary-navy);
            font-weight: 600;
            font-size: 12px;
        }

        .gst-row td {
            color: var(--secondary-steel);
        }

        .grand-total-row td {
            border-top: 2px solid var(--primary-navy);
            padding-top: 15px;
            padding-bottom: 15px;
            font-family: 'Poppins', sans-serif;
            font-size: 16px;
            font-weight: 700;
            color: var(--accent-gold);
        }

        /* 8️⃣ TERMS & CONDITIONS */
        .terms-section {
            page-break-inside: avoid;
            margin-top: 40px;
            border-top: 1px solid var(--border-gray);
            padding-top: 25px;
        }

        .terms-title {
            font-family: 'Poppins', sans-serif;
            font-size: 12px;
            font-weight: 600;
            color: var(--primary-navy);
            text-transform: uppercase;
            margin-bottom: 15px;
            letter-spacing: 0.5px;
        }

        .terms-list {
            margin: 0;
            padding-left: 20px;
            color: var(--text-dark);
            font-size: 11px;
        }

        .terms-list li {
            margin-bottom: 8px;
        }

        /* 9️⃣ SIGNATURE SECTION */
        .signature-section {
            page-break-inside: avoid;
            margin-top: 60px;
            width: 100%;
        }

        .signature-box {
            float: right;
            width: 250px;
        }

        .for-text {
            font-size: 11px;
            margin-bottom: 50px; /* Space for signature */
            color: var(--text-dark);
        }

        .signature-line {
            border-top: 1px solid var(--border-gray);
            padding-top: 8px;
            font-weight: 600;
            color: var(--primary-navy);
        }
        
        .date-placeholder {
            margin-top: 5px;
            font-size: 10px;
            color: var(--text-light);
        }

        /* 🔟 FOOTER */
        .page-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 20px;
            text-align: center;
            font-size: 9px;
            color: #94A3B8;
            border-top: 1px solid #F1F5F9;
            padding-top: 8px;
        }
    </style>
    `;

    // Process items (Robust Data Handling)
    const costItems = quotation.costItems.map((item, index) => {
        let description = item.description || '';
        // If description looks like a comma-separated list of items, format it better
        if (description.includes(',') && description.length > 50) {
            // Use spaced bullets for horizontal flow instead of vertical list
            description = description.split(',').map(s => s.trim()).join('  •  ');
        }

        // Helper to parsing numbers safely
        const parseNum = (val) => {
            if (val === undefined || val === null || val === '') return undefined;
            const n = Number(val);
            return isNaN(n) ? undefined : n;
        };

        // Robust Fallbacks for missing values
        const itemName = item.itemName || item.category || `Item ${index + 1}`;
        const quantity = parseNum(item.quantity) ?? parseNum(item.qty) ?? 0;
        const unit = item.unit || item.uom || '';
        const rate = parseNum(item.rate) ?? parseNum(item.price) ?? parseNum(item.unitPrice) ?? 0;

        // Try to find total, otherwise calculate it
        let total = parseNum(item.total) ?? parseNum(item.amount) ?? parseNum(item.cost);
        if (total === undefined) {
            total = quantity * rate;
        }

        return {
            ...item,
            formattedDescription: description,
            itemName,
            quantity,
            unit,
            rate,
            total
        };
    });

    // Handle Terms
    const termsList = quotation.termsAndConditions
        ? quotation.termsAndConditions.split('\n').filter(t => t.trim().length > 0)
        : [
            "Valid for 30 days from issue date.",
            "50% advance payment required to commence work.",
            "Goods once sold cannot be returned.",
            "Subject to Ahmedabad jurisdiction."
        ];

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Quotation - ${quotation.quotationNumber}</title>
        ${styles}
    </head>
    <body>

        <!-- WATERMARK -->
        ${companyDetails.logo ? `
        <div class="watermark">
            <img src="${companyDetails.logo}" alt="Watermark" />
        </div>` : ''}

        <div class="container">
            <!-- 4️⃣ HEADER -->
            <table class="header-table">
                <tr>
                    <td width="60%">
                        <div class="company-branding">
                            ${companyDetails.logo ? `<img src="${companyDetails.logo}" class="company-logo-img" alt="Logo" />` : ''}
                            <div class="company-name">${companyDetails.name || 'Buildex Construction'}</div>
                            <div class="company-details">
                                ${companyDetails.address || 'Ahmedabad, India'}<br>
                                Phone: ${companyDetails.phone || '+91 98765 43210'}<br>
                                Email: ${companyDetails.email || 'info@buildex.com'}<br>
                                GSTIN: ${companyDetails.gstNo || '-'}
                            </div>
                        </div>
                    </td>
                    <td width="40%">
                        <div class="quotation-header-block">
                            <div class="quotation-title">QUOTATION</div>
                            <table class="quotation-meta-table">
                                <tr>
                                    <td class="meta-label">Quotation No:</td>
                                    <td class="meta-value">${quotation.quotationNumber}</td>
                                </tr>
                                <tr>
                                    <td class="meta-label">Date:</td>
                                    <td class="meta-value">${formatDate(quotation.createdAt)}</td>
                                </tr>
                                <tr>
                                    <td class="meta-label">Valid Until:</td>
                                    <td class="meta-value">${formatDate(quotation.validTill)}</td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>
            </table>

            <div class="header-divider"></div>

            <!-- 5️⃣ CLIENT & PROJECT CARDS -->
            <div class="details-container">
                <!-- Left Card: Client -->
                <div class="details-card">
                    <div class="card-header">Client Details</div>
                    <table class="info-table">
                        <tr>
                            <td class="info-label">Name:</td>
                            <td class="info-value"><b>${quotation.clientDetails.name}</b></td>
                        </tr>
                        <tr>
                            <td class="info-label">Phone:</td>
                            <td class="info-value">${quotation.clientDetails.phone}</td>
                        </tr>
                        <tr>
                            <td class="info-label">Email:</td>
                            <td class="info-value">${quotation.clientDetails.email || '-'}</td>
                        </tr>
                        <tr>
                            <td class="info-label">Address:</td>
                            <td class="info-value">${quotation.clientDetails.siteAddress || '-'}</td>
                        </tr>
                    </table>
                </div>

                <!-- Right Card: Project -->
                <div class="details-card">
                    <div class="card-header">Project Details</div>
                    <table class="info-table">
                         <tr>
                            <td class="info-label">Type:</td>
                            <td class="info-value">${quotation.projectDetails.projectType}</td>
                        </tr>
                        <tr>
                            <td class="info-label">Location:</td>
                            <td class="info-value">${quotation.projectDetails.city}, ${quotation.projectDetails.area}</td>
                        </tr>
                        <tr>
                            <td class="info-label">Area:</td>
                            <td class="info-value">${quotation.projectDetails.builtUpArea} ${quotation.projectDetails.areaUnit}</td>
                        </tr>
                        <tr>
                            <td class="info-label">Duration:</td>
                            <td class="info-value">${quotation.projectDetails.projectDuration || '-'}</td>
                        </tr>
                    </table>
                </div>
            </div>

            <!-- 6️⃣ COST TABLE -->
            <table class="cost-table">
                <thead>
                    <tr>
                        <th class="col-sr">#</th>
                        <th class="col-desc">Description / Item</th>
                        <th class="col-qty">Qty</th>
                        <th class="col-unit">Unit</th>
                        <th class="col-rate">Rate</th>
                        <th class="col-amount">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${costItems.map((item, index) => `
                    <tr>
                        <td class="col-sr">${index + 1}</td>
                        <td class="col-desc">
                            <div class="item-name">${item.itemName}</div>
                            ${item.formattedDescription ? `<div class="item-desc">${item.formattedDescription}</div>` : ''}
                        </td>
                        <td class="col-qty">${item.quantity}</td>
                        <td class="col-unit">${item.unit}</td>
                        <td class="col-rate">${formatCurrency(item.rate)}</td>
                        <td class="col-amount">${formatCurrency(item.total)}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>

            <!-- 7️⃣ FINANCIAL SUMMARY -->
            <div class="summary-container">
                <div class="summary-block">
                    <table class="summary-table">
                        <tr>
                            <td class="summary-label">Subtotal</td>
                            <td class="summary-value">${formatCurrency(quotation.summary.subtotal)}</td>
                        </tr>
                         ${quotation.summary.labourCost > 0 ? `
                        <tr>
                            <td class="summary-label">Labour Cost</td>
                            <td class="summary-value">${formatCurrency(quotation.summary.labourCost)}</td>
                        </tr>` : ''}
                        <tr class="gst-row">
                            <td class="summary-label">GST (${quotation.summary.gstPercentage}%)</td>
                            <td class="summary-value">${formatCurrency(quotation.summary.gstAmount)}</td>
                        </tr>
                         ${quotation.summary.discount > 0 ? `
                        <tr>
                            <td class="summary-label">Discount</td>
                            <td class="summary-value" style="color: #EF4444;">-${formatCurrency(quotation.summary.discount)}</td>
                        </tr>` : ''}
                        <tr class="grand-total-row">
                            <td class="summary-label">GRAND TOTAL</td>
                            <td class="summary-value">${formatCurrency(quotation.summary.grandTotal)}</td>
                        </tr>
                    </table>
                </div>
            </div>

            <!-- 8️⃣ TERMS & CONDITIONS -->
            <div class="terms-section">
                <div class="terms-title">Terms & Conditions</div>
                <ol class="terms-list">
                    ${termsList.map(term => `<li>${term.replace(/^\d+\.\s*/, '')}</li>`).join('')}
                </ol>
            </div>

            <!-- 9️⃣ SIGNATURE -->
            <div class="signature-section">
                <div class="signature-box">
                    <div class="for-text">For ${companyDetails.name || 'Buildex Construction'}</div>
                    <div class="signature-line">Authorized Signatory</div>
                    <div class="date-placeholder">Date: __________________</div>
                </div>
            </div>
            
        </div>

        <!-- 🔟 FOOTER -->
        <div class="page-footer">
            ${companyDetails.name || 'Buildex Construction'} | Generated on ${new Date().toLocaleDateString('en-IN')} | Page <span class="pageNumber"></span>
        </div>

    </body>
    </html>
    `;
};
