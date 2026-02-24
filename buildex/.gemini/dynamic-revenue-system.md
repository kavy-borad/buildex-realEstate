# Dynamic Revenue System - Complete Implementation

## ✅ Revenue is Now Fully Dynamic from Database!

The dashboard revenue calculation now dynamically pulls data from MongoDB in real-time, including both invoices and quotations.

## Revenue Calculation Logic

### 1. Total Revenue (Combined)
```javascript
Total Revenue = Invoice Revenue + Quotation Revenue
```

**Components:**
- **Invoice Revenue**: Sum of all invoice `summary.grandTotal` values
- **Quotation Revenue**: Sum of all accepted/sent quotation `summary.grandTotal` values

### 2. Database Queries

#### Invoice Revenue:
```javascript
const invoices = await Invoice.find();
const invoiceRevenue = invoices.reduce((sum, inv) => sum + (inv.summary?.grandTotal || 0), 0);
```

#### Quotation Revenue:
```javascript
const acceptedQuotations = await Quotation.find({ 
    status: { $in: ['accepted', 'sent'] } 
});
const quotationRevenue = acceptedQuotations.reduce((sum, quot) => sum + (quot.summary?.grandTotal || 0), 0);
```

#### Combined:
```javascript
const totalRevenue = invoiceRevenue + quotationRevenue;
```

## Revenue Chart (Last 30 Days)

The revenue chart dynamically aggregates data from both invoices and quotations:

### Step 1: Get Invoice Revenue by Date
```javascript
const invoiceChartData = await Invoice.aggregate([
    {
        $match: {
            issueDate: { $gte: thirtyDaysAgo }
        }
    },
    {
        $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$issueDate" } },
            value: { $sum: "$summary.grandTotal" }
        }
    },
    { $sort: { _id: 1 } }
]);
```

### Step 2: Get Quotation Revenue by Date
```javascript
const quotationChartData = await Quotation.aggregate([
    {
        $match: {
            status: { $in: ['accepted', 'sent'] },
            createdAt: { $gte: thirtyDaysAgo }
        }
    },
    {
        $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            value: { $sum: "$summary.grandTotal" }
        }
    },
    { $sort: { _id: 1 } }
]);
```

### Step 3: Combine Both Sources
```javascript
const combinedRevenueData = {};

invoiceChartData.forEach(item => {
    combinedRevenueData[item._id] = (combinedRevenueData[item._id] || 0) + item.value;
});

quotationChartData.forEach(item => {
    combinedRevenueData[item._id] = (combinedRevenueData[item._id] || 0) + item.value;
});
```

## API Response Structure

### Endpoint: `GET /api/dashboard/stats`

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalQuotations": 10,
      "totalInvoices": 5,
      "totalClients": 8,
      "totalRevenue": 5000000,         // Combined (invoices + quotations)
      "invoiceRevenue": 3000000,       // From invoices only
      "quotationRevenue": 2000000,     // From accepted/sent quotations
      "totalCollected": 2500000,       // Amount paid
      "totalPending": 500000           // Amount pending
    },
    "quotationStats": {
      "draft": 2,
      "sent": 3,
      "accepted": 4,
      "rejected": 1,
      "working": 7                     // sent + accepted
    },
    "revenueChart": [
      { "date": "2026-01-18", "name": "Jan 18", "value": 150000 },
      { "date": "2026-01-19", "name": "Jan 19", "value": 0 },
      { "date": "2026-01-20", "name": "Jan 20", "value": 250000 },
      // ... 30 days of data
    ]
  }
}
```

## What's Dynamic Now

### ✅ Total Revenue
- **Source**: MongoDB aggregation
- **Calculation**: Invoice revenue + Quotation revenue
- **Updates**: Real-time on every dashboard load

### ✅ Revenue Chart
- **Source**: MongoDB aggregation from last 30 days
- **Data**: Combined invoice + quotation revenue per day
- **Updates**: Real-time on every dashboard load

### ✅ Revenue Breakdown
- **Invoice Revenue**: Actual billed revenue
- **Quotation Revenue**: Projected revenue from accepted/sent quotes
- **Total Collected**: Payments received
- **Total Pending**: Outstanding invoices

## How Data Flows

```
┌─────────────────────────────────────────────────┐
│           MongoDB Database                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  Invoices Collection:                           │
│  ├─ { summary: { grandTotal: 500000 }, ...}    │
│  ├─ { summary: { grandTotal: 300000 }, ...}    │
│  └─ Total: 800000                               │
│                                                 │
│  Quotations Collection (status: accepted/sent): │
│  ├─ { summary: { grandTotal: 400000 }, ...}    │
│  ├─ { summary: { grandTotal: 200000 }, ...}    │
│  └─ Total: 600000                               │
│                                                 │
└─────────────────────────────────────────────────┘
                    ↓
        ┌───────────────────────┐
        │  Dashboard API Query  │
        │  /api/dashboard/stats │
        └───────────────────────┘
                    ↓
        ┌───────────────────────┐
        │ Backend Aggregation   │
        │ - Sum invoices        │
        │ - Sum quotations      │
        │ - Combine totals      │
        └───────────────────────┘
                    ↓
        ┌───────────────────────┐
        │   JSON Response       │
        │ totalRevenue: 1400000 │
        └───────────────────────┘
                    ↓
        ┌───────────────────────┐
        │  Frontend Dashboard   │
        │  Displays: ₹14,00,000 │
        └───────────────────────┘
```

## Testing Revenue Calculation

### 1. Check Current Revenue
```bash
# Via API
curl http://localhost:5000/api/dashboard/stats

# Response will show:
# - totalRevenue (combined)
# - invoiceRevenue (from invoices)
# - quotationRevenue (from quotations)
```

### 2. Add Test Data

**Create Invoice:**
```javascript
POST /api/invoices
{
  "summary": {
    "grandTotal": 500000
  }
  // ... other fields
}
```

**Create Accepted Quotation:**
```javascript
POST /api/quotations
{
  "status": "accepted",
  "summary": {
    "grandTotal": 300000
  }
  // ... other fields
}
```

**Result:** Total Revenue = ₹500,000 + ₹300,000 = ₹800,000

### 3. Verify on Dashboard
1. Open dashboard page
2. Look at "Total Revenue" card
3. It should show the combined total from database

## Database Collections Used

### 1. Invoices
```javascript
{
  _id: ObjectId("..."),
  summary: {
    grandTotal: 500000
  },
  paidAmount: 300000,
  issueDate: ISODate("2026-02-15")
}
```

### 2. Quotations
```javascript
{
  _id: ObjectId("..."),
  status: "accepted",  // or "sent"
  summary: {
    grandTotal: 400000
  },
  createdAt: ISODate("2026-02-10")
}
```

## Key Features

✅ **Real-time**: Revenue updates on every dashboard load
✅ **Dynamic**: Pulls from database, not hardcoded
✅ **Combined**: Shows both invoice and quotation revenue
✅ **Historical**: Chart shows last 30 days of revenue
✅ **Detailed**: Breaks down by invoice vs quotation
✅ **Safe**: Uses optional chaining to handle missing data

## Summary

Your revenue system is now **100% dynamic** and pulls all data from the MongoDB database in real-time. Every time you:
- Create an invoice → Revenue increases
- Accept a quotation → Revenue increases
- Mark quotation as sent → Revenue increases
- Refresh dashboard → See updated numbers

No manual updates needed! 🎉
