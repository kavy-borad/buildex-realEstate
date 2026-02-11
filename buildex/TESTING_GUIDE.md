# 🧪 Complete Testing Guide - Frontend to Backend Integration

## ✅ Current Setup Status

```
✓ Frontend Running: http://localhost:3000
✓ Backend Running: http://localhost:5000
✓ MongoDB Connected: 127.0.0.1:27017
✓ Database: buildex
✓ API Integration: ENABLED (USE_API = true)
```

---

## 🎯 Step-by-Step Testing Instructions

### **Test 1: Create Quotation from Frontend**

#### Step 1: Open the App
1. Open browser: `http://localhost:3000`
2. Login if needed (or navigate to create quotation)
3. Click **"New Quotation"** or **"Create Quotation"**

#### Step 2: Fill Client Details
```
Name: Rajesh Kumar
Phone: +91 9876543210
Email: rajesh.kumar@test.com
Site Address: Plot 45, Navi Mumbai
```

#### Step 3: Fill Project Details
```
Project Type: Residential - Villa
Built-up Area: 3500
Area Unit: Sq.ft
Location: Navi Mumbai
Quality: Premium
```

#### Step 4: Add Cost Items

**Item 1:**
```
Name: Foundation Work
Quantity: 1
Unit: Lump Sum
Rate: 850000
Total: 850000 (auto-calculated)
```

**Item 2:**
```
Name: Structural Work
Quantity: 3500
Unit: Sq.ft
Rate: 450
Total: 1575000 (auto-calculated)
```

**Item 3:**
```
Name: Flooring Work
Quantity: 3500
Unit: Sq.ft
Rate: 120
Total: 420000 (auto-calculated)
```

#### Step 5: Review Summary
```
Subtotal: ₹28,45,000
GST (18%): ₹5,12,100
Discount: ₹50,000
Grand Total: ₹33,07,100
```

#### Step 6: Save
Click **"Save Draft"** button

---

### **Expected Result After Save:**

1. ✅ **Toast notification**: "Quotation created successfully"
2. ✅ **Navigation**: Redirects to `/quotations` list page
3. ✅ **Backend Call**: POST to `http://localhost:5000/api/quotations`
4. ✅ **Database**: Quotation saved in MongoDB
5. ✅ **List Shows**: New quotation appears in list

---

### **Test 2: Verify in Backend**

#### Option A: Thunder Client / Postman
```http
GET http://localhost:5000/api/quotations
```

**Expected Response:**
```json
[
  {
    "_id": "65f9abc123...",
    "client": {
      "_id": "65f8xyz...",
      "name": "Rajesh Kumar",
      "phone": "+91 9876543210"
    },
    "projectDetails": {
      "projectType": "Residential - Villa",
      "builtUpArea": 3500,
      "location": "Navi Mumbai"
    },
    "summary": {
      "grandTotal": 3307100
    },
    "status": "draft",
    "createdAt": "2026-02-04T..."
  }
]
```

#### Option B: MongoDB Compass
1. Open MongoDB Compass
2. Connect to: `mongodb://127.0.0.1:27017`
3. Database: `buildex`
4. Collection: `quotations`
5. You'll see your quotation document!

#### Option C: Terminal (mongosh)
```bash
mongosh
use buildex
db.quotations.find().pretty()
db.clients.find().pretty()
```

---

### **Test 3: View Quotation Details**

1. On quotations list page
2. Click **"View"** icon (👁️) on any quotation
3. Opens preview page
4. Shows complete quotation details

**Expected:**
- ✅ Client details from database
- ✅ All cost items
- ✅ Correct calculations
- ✅ Status badge

---

### **Test 4: Update Quotation Status**

On preview page or list page:
1. Change status from "Draft" to "Sent"
2. Click update

**Backend Call:**
```http
PATCH http://localhost:5000/api/quotations/YOUR_ID/status
Body: { "status": "sent" }
```

**Expected:**
- ✅ Status badge updates
- ✅ Changes saved to MongoDB
- ✅ Toast shows success

---

### **Test 5: Delete Quotation**

1. Click delete icon (🗑️) on any quotation
2. Confirm deletion

**Backend Call:**
```http
DELETE http://localhost:5000/api/quotations/YOUR_ID
```

**Expected:**
- ✅ Quotation removed from list
- ✅ Deleted from MongoDB
- ✅ Success message shown

---

## 🔍 Debugging: Check Browser Console

Press **F12** → Console tab

### What to Look For:

**On Create Quotation:**
```
POST http://localhost:5000/api/quotations
Status: 201 Created
Response: {...quotation data...}
```

**On List Page Load:**
```
GET http://localhost:5000/api/quotations
Status: 200 OK
Response: [...quotations array...]
```

### If You See Errors:

**CORS Error:**
```javascript
// Add to backend/server.js
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

**Network Error:**
- Check backend is running on port 5000
- Check MongoDB is connected
- Verify API_BASE_URL in quotationApi.ts

---

## 📊 Data Flow Verification

### 1. Frontend Form → API Service
**File:** `src/pages/CreateQuotationPage.tsx`
```typescript
const handleSave = async () => {
  await addQuotation(quotationData);
  // This calls context function
};
```

### 2. Context → API Call
**File:** `src/contexts/QuotationContext.tsx`
```typescript
const addQuotation = async (quotation) => {
  const result = await quotationApi.createQuotation(quotation);
  // Posts to backend
};
```

### 3. API Service → Backend
**File:** `src/services/quotationApi.ts`
```typescript
export const createQuotation = async (quotation) => {
  const response = await fetch(`${API_BASE_URL}/quotations`, {
    method: 'POST',
    body: JSON.stringify(quotation)
  });
};
```

### 4. Backend → MongoDB
**File:** `backend/controllers/quotationController.js`
```javascript
export const createQuotation = async (req, res) => {
  const quotation = new Quotation(req.body);
  await quotation.save();
};
```

---

## ✅ Success Checklist

After creating a quotation, verify:

- [ ] **Console shows**: Successful POST request
- [ ] **Backend logs**: Show incoming request
- [ ] **MongoDB Compass**: Shows new document
- [ ] **List page**: Displays the quotation
- [ ] **Preview page**: Shows all details correctly
- [ ] **Thunder Client**: GET returns the data
- [ ] **Status update**: Works dynamically
- [ ] **Delete**: Removes from DB

---

## 🎯 Quick Test Command (Backend Verification)

After creating quotation from frontend:

```bash
# Open terminal
mongosh

# Connect to database
use buildex

# Check quotations
db.quotations.find().pretty()

# Check clients (auto-created)
db.clients.find().pretty()

# Count total documents
db.quotations.countDocuments()

# Get latest quotation
db.quotations.find().sort({createdAt: -1}).limit(1).pretty()
```

---

## 🔥 Pro Tips

1. **Keep Console Open**: Monitor all API calls in real-time
2. **Check Network Tab**: See request/response details
3. **MongoDB Compass**: Real-time database viewer
4. **Backend Terminal**: Watch for incoming requests

---

## 🚨 Common Issues & Solutions

### Issue: "Failed to fetch quotations"
**Solution:**
- Ensure backend is running on port 5000
- Check CORS is enabled
- Verify MongoDB is connected

### Issue: "Quotation list is empty"
**Solution:**
- Check `USE_API = true` in QuotationContext
- Verify backend returned data
- Check browser console for errors

### Issue: "Cannot POST /api/quotations"
**Solution:**
- Verify routes are registered in server.js
- Check quotationRoutes.js is imported
- Restart backend server

---

## 🎉 When Everything Works

You'll see:
1. **Form submission** → Smooth, no errors
2. **List page** → Shows quotation immediately
3. **MongoDB** → Document saved with all data
4. **Stats** → Count updates
5. **Backend logs** → Request logged
6. **Thunder Client** → Data matches frontend

---

## 📸 Expected Screenshots Flow

```
1. Empty Create Form
   ↓
2. Filled Form with Data
   ↓
3. Success Toast Message
   ↓
4. Quotations List (showing new item)
   ↓
5. Quotation Preview Page
   ↓
6. Thunder Client GET Response
   ↓
7. MongoDB Compass (database view)
```

---

## 🎯 Final Verification

Run all 7 API endpoints:

```bash
# 1. Create (through frontend)
# 2. Get All
GET http://localhost:5000/api/quotations

# 3. Get Single
GET http://localhost:5000/api/quotations/YOUR_ID

# 4. Update
PUT http://localhost:5000/api/quotations/YOUR_ID

# 5. Update Status
PATCH http://localhost:5000/api/quotations/YOUR_ID/status

# 6. Delete
DELETE http://localhost:5000/api/quotations/YOUR_ID

# 7. Stats
GET http://localhost:5000/api/quotations/stats
```

---

## ✨ Success Criteria

✅ **Frontend**:
- Form submits without errors
- List shows data from MongoDB
- Preview displays correctly
- Status updates work
- Delete works

✅ **Backend**:
- All API endpoints respond
- Data saves to MongoDB
- Relationships created (Client + Quotation)
- Error handling works

✅ **Database**:
- Quotations collection has documents
- Clients collection has documents
- Data structure matches schema
- Relationships are correct

---

**🚀 Your app is now FULLY CONNECTED to MongoDB backend!**

Test it by creating a quotation from the frontend form! 🎉
