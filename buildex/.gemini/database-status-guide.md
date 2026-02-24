# Database Storage & Status Update Guide

## ✅ YES - Status is Stored in Database!

The quotation `status` field is **permanently stored** in MongoDB in the `quotations` collection.

## Database Schema

### Quotation Status Field:
```javascript
status: {
    type: String,
    enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'],
    default: 'draft'
}
```

### Available Statuses:
- `draft` - Initial state (default)
- `sent` - Quotation has been sent to client
- `accepted` - Client accepted the quotation ✅
- `rejected` - Client rejected the quotation ❌
- `expired` - Quotation validity period expired

## How to Update Quotation Status

### Option 1: Via API Endpoint (Recommended)

**Endpoint:** `PATCH /api/quotations/:id/status`

**Request Body:**
```json
{
  "status": "rejected"  // or "accepted", "sent", etc.
}
```

**Example with cURL:**
```bash
curl -X PATCH http://localhost:5000/api/quotations/YOUR_QUOTATION_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "rejected"}'
```

**Example with JavaScript/Frontend:**
```javascript
const updateQuotationStatus = async (quotationId, newStatus) => {
  const response = await fetch(`/api/quotations/${quotationId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  return response.json();
};

// Usage:
await updateQuotationStatus('123abc', 'accepted');
await updateQuotationStatus('456def', 'rejected');
```

### Option 2: Via MongoDB Directly

You can also update directly in MongoDB Compass or CLI:

```javascript
// Find a specific quotation and update to rejected
db.quotations.updateOne(
  { _id: ObjectId("YOUR_QUOTATION_ID") },
  { 
    $set: { 
      status: "rejected",
      rejectedAt: new Date()
    } 
  }
)

// Update multiple quotations
db.quotations.updateMany(
  { status: "sent", validTill: { $lt: new Date() } },
  { $set: { status: "expired" } }
)
```

## What Happens When Status is Updated

When you update a quotation status, the backend automatically tracks timestamps:

```javascript
if (status === 'sent')     → quotation.sentAt = new Date()
if (status === 'accepted') → quotation.acceptedAt = new Date()
if (status === 'rejected') → quotation.rejectedAt = new Date()
```

## Dashboard Counts

Once quotations have their status set, the dashboard automatically counts:

- **Working Projects** = quotations with status `'accepted'` OR `'sent'`
- **Rejected Projects** = quotations with status `'rejected'`
- **Approved Projects** = quotations with status `'accepted'`
- **Sent Projects** = quotations with status `'sent'`

## Testing the Dashboard Counts

To see the dashboard numbers change:

1. **Create some test quotations** (if you don't have any)
2. **Update their status** using the API or MongoDB:
   ```javascript
   // Update quotation to accepted (will show in Working Projects)
   PATCH /api/quotations/:id/status
   { "status": "accepted" }
   
   // Update quotation to rejected (will show in Rejected Projects)
   PATCH /api/quotations/:id/status
   { "status": "rejected" }
   ```
3. **Refresh the dashboard** - the counts will update automatically!

## Quick Test Script

You can run this in your browser console on the dashboard page:

```javascript
// Get all quotations
const quotations = await fetch('/api/quotations').then(r => r.json());

// Update first quotation to "accepted"
if (quotations.data?.length > 0) {
  const id = quotations.data[0]._id;
  await fetch(`/api/quotations/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'accepted' })
  });
  console.log('✅ Updated quotation to accepted!');
  window.location.reload(); // Refresh to see new count
}
```

## Summary

✅ **Status IS stored in MongoDB**
✅ **Dashboard reads from database in real-time**
✅ **You can update status via API or directly in database**
✅ **Counts update automatically when you refresh dashboard**

The system is fully dynamic and database-driven! 🎉
