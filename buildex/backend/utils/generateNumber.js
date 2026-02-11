/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔢 AUTO NUMBER GENERATOR - For Quotations & Invoices
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Settings from '../models/Settings.js';

/**
 * Generate next quotation number
 * Format: QT-2026-0001
 */
export const generateQuotationNumber = async () => {
    const settings = await Settings.getInstance();

    // Ensure numbering config exists (migration fallback)
    if (!settings.numbering) {
        settings.numbering = {
            quotationPrefix: 'QT',
            invoicePrefix: 'INV',
            quotationCounter: 1,
            invoiceCounter: 1,
            includeYear: true,
            digitLength: 4
        };
        await settings.save();
    }

    const { quotationPrefix, quotationCounter, includeYear, digitLength } = settings.numbering;

    const year = new Date().getFullYear();
    const paddedCounter = String(quotationCounter).padStart(digitLength, '0');

    const number = includeYear
        ? `${quotationPrefix}-${year}-${paddedCounter}`
        : `${quotationPrefix}-${paddedCounter}`;

    // Increment counter for next time
    settings.numbering.quotationCounter += 1;
    await settings.save();

    return number;
};

/**
 * Generate next invoice number
 * Format: INV-2026-0001
 */
export const generateInvoiceNumber = async () => {
    const settings = await Settings.getInstance();

    // Ensure numbering config exists (migration fallback)
    if (!settings.numbering) {
        settings.numbering = {
            quotationPrefix: 'QT',
            invoicePrefix: 'INV',
            quotationCounter: 1,
            invoiceCounter: 1,
            includeYear: true,
            digitLength: 4
        };
        await settings.save();
    }

    const { invoicePrefix, invoiceCounter, includeYear, digitLength } = settings.numbering;

    const year = new Date().getFullYear();
    const paddedCounter = String(invoiceCounter).padStart(digitLength, '0');

    const number = includeYear
        ? `${invoicePrefix}-${year}-${paddedCounter}`
        : `${invoicePrefix}-${paddedCounter}`;

    // Increment counter for next time
    settings.numbering.invoiceCounter += 1;
    await settings.save();

    return number;
};

/**
 * Reset counters (usually at year start)
 */
export const resetCounters = async () => {
    const settings = await Settings.getInstance();
    settings.numbering.quotationCounter = 1;
    settings.numbering.invoiceCounter = 1;
    await settings.save();
    return { success: true, message: 'Counters reset successfully' };
};
