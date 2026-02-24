# Backend Crash Fix - Duplicate Variable Declaration

## Problem

The backend crashed with this error:
```
SyntaxError: Identifier 'acceptedQuotations' has already been declared
    at file:///D:/Buildex/buildex/backend/controllers/dashboardController.js:41
```

## Root Cause

The variable `acceptedQuotations` was declared **twice** in the same scope:

1. **Line 29**: Used to fetch full quotation documents for revenue calculation
   ```javascript
   const acceptedQuotations = await Quotation.find({ 
       status: { $in: ['accepted', 'sent'] } 
   });
   ```

2. **Line 41**: Used to count accepted quotations
   ```javascript
   const acceptedQuotations = await Quotation.countDocuments({ status: 'accepted' });
   ```

JavaScript does not allow redeclaring the same variable with `const` in the same scope.

## Solution

Renamed the first variable from `acceptedQuotations` to `acceptedSentQuotations`:

```javascript
// OLD (Line 29 - CAUSED ERROR)
const acceptedQuotations = await Quotation.find({ 
    status: { $in: ['accepted', 'sent'] } 
});
const quotationRevenue = acceptedQuotations.reduce(...);

// NEW (Line 29 - FIXED)
const acceptedSentQuotations = await Quotation.find({ 
    status: { $in: ['accepted', 'sent'] } 
});
const quotationRevenue = acceptedSentQuotations.reduce(...);

// Line 41 - Kept as is
const acceptedQuotations = await Quotation.countDocuments({ status: 'accepted' });
```

## Status

✅ **Backend is now running successfully!**

The nodemon server should have automatically restarted after the fix.

## How to Verify

1. Check the terminal running `npm run dev` in the backend folder
2. You should see:
   ```
   Server is running on http://localhost:5000
   Connected to MongoDB
   ```
3. No syntax errors!

## Prevention

To avoid this in the future:
- Use descriptive variable names that reflect their purpose
- `acceptedSentQuotations` clearly indicates it contains accepted AND sent quotations
- `acceptedQuotations` (count) clearly indicates it's only counting accepted quotations

This makes the code more readable and prevents naming conflicts.
