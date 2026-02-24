# Client Feedback API - Testing Guide

## 🧪 Test Endpoints with Thunder Client / Postman

### 1. Submit Feedback - Approve

**Request:**
```
POST http://localhost:5000/api/quotations/YOUR_QUOTATION_ID/feedback
Content-Type: application/json

{
  "action": "approve",
  "comments": "This quotation looks great! Approved."
}
```

### 2. Submit Feedback - Reject

**Request:**
```
POST http://localhost:5000/api/quotations/YOUR_QUOTATION_ID/feedback
Content-Type: application/json

{
  "action": "reject",
  "rejectionReason": "Budget exceeds our limit",
  "comments": "Unfortunately, we need to reduce costs"
}
```

### 3. Submit Feedback - Request Changes

**Request:**
```
POST http://localhost:5000/api/quotations/YOUR_QUOTATION_ID/feedback
Content-Type: application/json

{
  "action": "request-changes",
  "requestedChanges": [
    "Reduce tile cost by 15%",
    "Change paint brand to Asian Paints",
    "Add waterproofing in bathroom"
  ],
  "comments": "Please make these adjustments and resubmit"
}
```

### 4. Get Feedback for Quotation

**Request:**
```
GET http://localhost:5000/api/quotations/YOUR_QUOTATION_ID/feedback
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "clientFeedback": {
      "action": "approve",
      "comments": "This quotation looks great! Approved.",
      "respondedAt": "2026-02-17T10:53:00.000Z",
      "ipAddress": "::1",
      "userAgent": "Thunder Client"
    },
    "clientStatus": "approved",
    "status": "accepted",
    "activityLog": [...],
    "client": {...}
  }
}
```

### 5. Get All Quotations with Feedback

**Request:**
```
GET http://localhost:5000/api/quotations/feedback/all
```

**With Filters:**
```
GET http://localhost:5000/api/quotations/feedback/all?status=accepted
GET http://localhost:5000/api/quotations/feedback/all?clientStatus=approved
```

### 6. Get Feedback Statistics

**Request:**
```
GET http://localhost:5000/api/feedback/statistics
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "statistics": {
      "approved": 5,
      "rejected": 2,
      "changesRequested": 3,
      "total": 10
    },
    "recentFeedback": [...]
  }
}
```

## 🔍 How to Test

1. **Start Backend:**
   ```bash
   cd d:/Buildex/buildex/backend
   npm run dev
   ```

2. **Get a Quotation ID:**
   - Create a quotation first, or
   - Get existing ID from database/API

3. **Test with Thunder Client:**
   - Open VS Code
   - Install Thunder Client extension
   - Create new request
   - Copy endpoint URLs from above
   - Replace `YOUR_QUOTATION_ID` with actual ID
   - Send request

4. **Verify in Database:**
   - Check MongoDB Compass
   - Look for updated `clientFeedback` field in Quotation
   - Verify `status` and `clientStatus` changes

## ✅ Success Indicators

- ✅ Response status: 200 OK
- ✅ `success: true` in response
- ✅ Quotation status updated in database
- ✅ Activity log entry added
- ✅ Timestamp recorded
- ✅ IP address captured

## ⚠️ Error Scenarios to Test

1. **Invalid Action:**
```json
{
  "action": "invalid-action"
}
```
Expected: 400 Bad Request

2. **Missing Rejection Reason:**
```json
{
  "action": "reject"
  // Missing rejectionReason
}
```
Expected: Should still work (optional validation can be added)

3. **Non-existent Quotation:**
```
POST /api/quotations/000000000000000000000000/feedback
```
Expected: 404 Not Found

4. **Empty Requested Changes:**
```json
{
  "action": "request-changes",
  "requestedChanges": []
}
```
Expected: Should still work (frontend validation handles this)
