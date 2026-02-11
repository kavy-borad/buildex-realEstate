# 🚀 Buildex Quotation API - Complete Setup & Testing Guide

## 📋 Table of Contents
1. [API Overview](#api-overview)
2. [Quick Start](#quick-start)
3. [Available Endpoints](#available-endpoints)
4. [Testing with Sample Data](#testing-with-sample-data)
5. [File Reference](#file-reference)

---

## 🎯 API Overview

**Base URL:** `http://localhost:5000`

**Database:** MongoDB  (Local)
- Host: `127.0.0.1:27017`
- Database Name: `buildex`
- Collections: `quotations`, `clients`

**Total Endpoints:** 7

---

## ⚡ Quick Start

### 1. Start MongoDB
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 2. Start Backend Server
```bash
cd backend
npm install
npm run dev
```

**Expected Output:**
```
✓ MongoDB connected !! DB HOST: 127.0.0.1
✓ Server is running on http://localhost:5000
```

### 3. Test API (Quick Check)
Open browser: `http://localhost:5000/api`

Expected response:
```json
{
  "message": "Buildex Backend is connected!"
}
```

---

## 📡 Available Endpoints

### 1. **POST** `/api/quotations` - Create Quotation
**Request Body:** See `API_COLLECTION.json` → Endpoint #1

**Key Fields:**
- `clientDetails` - Client info (name, phone, email, address)
- `projectDetails` - Project info (type, area, location, quality)
- `costItems[]` - Array of cost items
- `summary` - Financial summary (subtotal, GST, discount, grandTotal)
- `validTill` - Quotation validity date

**Response:** `201 Created` with full quotation object including `_id`

---

### 2. **GET** `/api/quotations` - List All Quotations
**Query Params (Optional):**
- `?status=draft` - Filter by status
- `?startDate=2026-02-01` - Filter by date range
- `?endDate=2026-02-28`

**Response:** `200 OK` with array of quotations

---

### 3. **GET** `/api/quotations/:id` - Get Single Quotation
**URL Param:** `:id` - Quotation MongoDB ObjectId

**Response:** `200 OK` with complete quotation details

---

### 4. **PUT** `/api/quotations/:id` - Update Quotation
**Request Body:** Partial update (send only fields to update)

**Response:** `200 OK` with updated quotation

---

### 5. **PATCH** `/api/quotations/:id/status` - Update Status Only
**Request Body:**
```json
{
  "status": "sent"
}
```

**Valid Statuses:**
- `draft` - Initial state
- `sent` - Sent to client
- `negotiation` - Under negotiation
- `approved` - Client approved
- `rejected` - Client rejected
- `completed` - Work completed

**Response:** `200 OK`

---

### 6. **DELETE** `/api/quotations/:id` - Delete Quotation
**URL Param:** `:id` - Quotation ID

**Response:** `200 OK` with success message

---

### 7. **GET** `/api/quotations/stats` - Dashboard Statistics
**Response:**
```json
{
  "total": 42,
  "draft": 15,
  "sent": 18,
  "approved": 7,
  "rejected": 2,
  "totalValue": 125000000
}
```

---

## 🧪 Testing with Sample Data

### Option 1: Postman/Thunder Client

1. Import `API_COLLECTION.json` into Postman
2. Collection contains all 7 endpoints with sample data
3. Run requests in sequence

### Option 2: cURL Commands

See `TESTING_COMMANDS.sh` for complete cURL commands

**Quick Test:**
```bash
# Create a quotation
curl -X POST http://localhost:5000/api/quotations \
  -H "Content-Type: application/json" \
  -d @sample_quotation.json

# Get all quotations
curl http://localhost:5000/api/quotations

# Get stats
curl http://localhost:5000/api/quotations/stats
```

### Option 3: Browser (GET requests only)

- `http://localhost:5000/api`
- `http://localhost:5000/api/quotations`
- `http://localhost:5000/api/quotations/stats`

---

## 📁 File Reference

| File | Purpose |
|------|---------|
| `API_COLLECTION.json` | Complete Postman collection with all endpoints & sample JSON |
| `API_DOCUMENTATION.js` | Detailed API documentation with examples & flow |
| `TESTING_COMMANDS.sh` | Ready-to-use cURL & PowerShell commands |
| `server.js` | Express server entry point |
| `routes/quotationRoutes.js` | API route definitions |
| `controllers/quotationController.js` | Business logic for all endpoints |
| `models/Quotation.js` | MongoDB schema |
| `.env` | Database connection config |

---

## 🎯 Sample Testing Workflow

### Step 1: Create a Quotation
```bash
POST /api/quotations
```
**Copy the returned `_id`** from response

### Step 2: View All Quotations
```bash
GET /api/quotations
```
Verify your quotation appears in the list

### Step 3: Get Single Quotation
```bash
GET /api/quotations/YOUR_ID_HERE
```

### Step 4: Update Status to "Sent"
```bash
PATCH /api/quotations/YOUR_ID_HERE/status
Body: { "status": "sent" }
```

### Step 5: Update Project Details
```bash
PUT /api/quotations/YOUR_ID_HERE
Body: { "projectDetails": { "location": "New Location" } }
```

### Step 6: Check Statistics
```bash
GET /api/quotations/stats
```

### Step 7: Delete Quotation (Optional)
```bash
DELETE /api/quotations/YOUR_ID_HERE
```

---

## 📊 Sample Data Sets

### Small Project (Renovation)
```json
{
  "clientDetails": {
    "name": "Amit Sharma",
    "phone": "+91 9123456789",
    "email": "amit.sharma@gmail.com",
    "siteAddress": "B-102, Green Valley, Pune"
  },
  "projectDetails": {
    "projectType": "Renovation",
    "builtUpArea": 1200,
    "areaUnit": "Sq.ft",
    "location": "Pune",
    "constructionQuality": "standard"
  },
  "summary": {
    "grandTotal": 500040
  }
}
```

### Large Project (Commercial Office)
```json
{
  "clientDetails": {
    "name": "TechCorp Solutions",
    "email": "projects@techcorp.com"
  },
  "projectDetails": {
    "projectType": "Commercial - Office",
    "builtUpArea": 12000,
    "areaUnit": "Sq.ft",
    "location": "Pune - Hinjewadi",
    "constructionQuality": "premium"
  },
  "summary": {
    "grandTotal": 38204000
  }
}
```

See `API_COLLECTION.json` → `sampleDataSets` for complete examples

---

## ✅ Verification Checklist

- [ ] MongoDB is running (`mongosh` connects successfully)
- [ ] Backend server started (`npm run dev` in backend folder)
- [ ] Server shows "MongoDB connected" message
- [ ] Server shows "Server is running on http://localhost:5000"
- [ ] Browser opens `http://localhost:5000/api` and shows connection message
- [ ] Can create quotation via POST request
- [ ] Can fetch quotations via GET request
- [ ] Stats endpoint returns data

---

## 🔍 Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongosh

# If not installed, download from:
# https://www.mongodb.com/try/download/community
```

### Port 5000 Already in Use
Edit `.env` file:
```env
PORT=5001
```

### Cannot POST/GET
- Verify server is running
- Check BASE URL is `http://localhost:5000`
- Ensure Content-Type header is `application/json`

---

## 📞 Support

For issues or questions, refer to:
- `API_DOCUMENTATION.js` - Complete technical documentation
- `API_COLLECTION.json` - Full API specs with examples
- `TESTING_COMMANDS.sh` - Testing commands

---

## 🎉 You're All Set!

Backend is **production-ready** with:
- ✅ Complete CRUD operations
- ✅ RESTful API design
- ✅ MongoDB integration
- ✅ Validation & error handling
- ✅ Statistics endpoint
- ✅ Client auto-creation
- ✅ Comprehensive documentation

**Happy Testing!** 🚀
