# ═══════════════════════════════════════════════════════════════════════════
# 🧪 BUILDEX API TESTING GUIDE - Complete cURL Commands
# ═══════════════════════════════════════════════════════════════════════════

# BASE URL
BASE_URL="http://localhost:5000"

# ─────────────────────────────────────────────────────────────────────────
# 1️⃣ CREATE NEW QUOTATION
# ─────────────────────────────────────────────────────────────────────────

curl -X POST http://localhost:5000/api/quotations \
  -H "Content-Type: application/json" \
  -d '{
    "clientDetails": {
      "name": "Rajesh Kumar",
      "phone": "+91 9876543210",
      "email": "rajesh.kumar@example.com",
      "siteAddress": "Plot No. 45, Sector 12, Navi Mumbai, Maharashtra - 400706"
    },
    "projectDetails": {
      "projectType": "Residential - Villa",
      "builtUpArea": 3500,
      "areaUnit": "Sq.ft",
      "location": "Navi Mumbai",
      "constructionQuality": "premium"
    },
    "costItems": [
      {
        "itemName": "Foundation Work",
        "quantity": 1,
        "unit": "Lump Sum",
        "rate": 850000,
        "total": 850000
      },
      {
        "itemName": "Structural Work",
        "quantity": 3500,
        "unit": "Sq.ft",
        "rate": 450,
        "total": 1575000
      },
      {
        "itemName": "Flooring Work",
        "quantity": 3500,
        "unit": "Sq.ft",
        "rate": 120,
        "total": 420000
      }
    ],
    "summary": {
      "subtotal": 2845000,
      "gstPercentage": 18,
      "gstAmount": 512100,
      "discount": 50000,
      "grandTotal": 3307100
    },
    "validTill": "2026-03-06T00:00:00.000Z"
  }'

# ─────────────────────────────────────────────────────────────────────────
# 2️⃣ GET ALL QUOTATIONS
# ─────────────────────────────────────────────────────────────────────────

# Get all quotations
curl http://localhost:5000/api/quotations

# Filter by status
curl "http://localhost:5000/api/quotations?status=draft"

# Filter by date range
curl "http://localhost:5000/api/quotations?startDate=2026-02-01&endDate=2026-02-28"

# ─────────────────────────────────────────────────────────────────────────
# 3️⃣ GET SINGLE QUOTATION
# ─────────────────────────────────────────────────────────────────────────

# Replace YOUR_QUOTATION_ID with actual ID from create response
curl http://localhost:5000/api/quotations/YOUR_QUOTATION_ID

# Example:
# curl http://localhost:5000/api/quotations/65f9abc123def456789

# ─────────────────────────────────────────────────────────────────────────
# 4️⃣ UPDATE QUOTATION
# ─────────────────────────────────────────────────────────────────────────

curl -X PUT http://localhost:5000/api/quotations/YOUR_QUOTATION_ID \
  -H "Content-Type: application/json" \
  -d '{
    "projectDetails": {
      "projectType": "Commercial - Office",
      "builtUpArea": 4000,
      "location": "Pune"
    },
    "summary": {
      "subtotal": 3500000,
      "gstPercentage": 18,
      "gstAmount": 630000,
      "discount": 100000,
      "grandTotal": 4030000
    }
  }'

# ─────────────────────────────────────────────────────────────────────────
# 5️⃣ UPDATE STATUS ONLY
# ─────────────────────────────────────────────────────────────────────────

# Mark as sent
curl -X PATCH http://localhost:5000/api/quotations/YOUR_QUOTATION_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "sent"}'

# Mark as approved
curl -X PATCH http://localhost:5000/api/quotations/YOUR_QUOTATION_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'

# Mark as rejected
curl -X PATCH http://localhost:5000/api/quotations/YOUR_QUOTATION_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "rejected"}'

# ─────────────────────────────────────────────────────────────────────────
# 6️⃣ DELETE QUOTATION
# ─────────────────────────────────────────────────────────────────────────

curl -X DELETE http://localhost:5000/api/quotations/YOUR_QUOTATION_ID

# ─────────────────────────────────────────────────────────────────────────
# 7️⃣ GET STATISTICS
# ─────────────────────────────────────────────────────────────────────────

curl http://localhost:5000/api/quotations/stats

# ═══════════════════════════════════════════════════════════════════════════
# 📋 TESTING WORKFLOW
# ═══════════════════════════════════════════════════════════════════════════

# Step 1: Create a quotation (copy the returned _id)
# Step 2: Get all quotations (verify it appears in list)
# Step 3: Get single quotation using the _id
# Step 4: Update status to "sent"
# Step 5: Update project details
# Step 6: Get statistics
# Step 7: Delete the quotation

# ═══════════════════════════════════════════════════════════════════════════
# 🎯 SAMPLE COMPLETE TEST WORKFLOW
# ═══════════════════════════════════════════════════════════════════════════

# 1. Create quotation and save ID
echo "Creating quotation..."
QUOTATION_ID=$(curl -s -X POST http://localhost:5000/api/quotations \
  -H "Content-Type: application/json" \
  -d '{
    "clientDetails": {
      "name": "Test Client",
      "phone": "+91 9999999999",
      "email": "test@test.com",
      "siteAddress": "Test Address"
    },
    "projectDetails": {
      "projectType": "Residential - Apartment",
      "builtUpArea": 1000,
      "areaUnit": "Sq.ft",
      "location": "Mumbai",
      "constructionQuality": "standard"
    },
    "costItems": [
      {
        "itemName": "Basic Construction",
        "quantity": 1000,
        "unit": "Sq.ft",
        "rate": 1500,
        "total": 1500000
      }
    ],
    "summary": {
      "subtotal": 1500000,
      "gstPercentage": 18,
      "gstAmount": 270000,
      "discount": 0,
      "grandTotal": 1770000
    }
  }' | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)

echo "Created quotation with ID: $QUOTATION_ID"

# 2. Get the quotation
echo "Fetching quotation..."
curl http://localhost:5000/api/quotations/$QUOTATION_ID

# 3. Update status
echo "Updating status to sent..."
curl -X PATCH http://localhost:5000/api/quotations/$QUOTATION_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "sent"}'

# 4. Get stats
echo "Getting statistics..."
curl http://localhost:5000/api/quotations/stats

# ═══════════════════════════════════════════════════════════════════════════
# 💡 WINDOWS POWERSHELL COMMANDS (If cURL doesn't work)
# ═══════════════════════════════════════════════════════════════════════════

# Create Quotation (PowerShell)
Invoke-RestMethod -Uri "http://localhost:5000/api/quotations" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{
    "clientDetails": {
      "name": "Test Client",
      "phone": "+91 9999999999",
      "email": "test@test.com",
      "siteAddress": "Test Address"
    },
    "projectDetails": {
      "projectType": "Residential - Villa",
      "builtUpArea": 2000,
      "areaUnit": "Sq.ft",
      "location": "Mumbai",
      "constructionQuality": "premium"
    },
    "costItems": [
      {
        "itemName": "Construction",
        "quantity": 2000,
        "unit": "Sq.ft",
        "rate": 1800,
        "total": 3600000
      }
    ],
    "summary": {
      "subtotal": 3600000,
      "gstPercentage": 18,
      "gstAmount": 648000,
      "discount": 50000,
      "grandTotal": 4198000
    }
  }'

# Get All Quotations (PowerShell)
Invoke-RestMethod -Uri "http://localhost:5000/api/quotations" -Method Get

# Get Stats (PowerShell)
Invoke-RestMethod -Uri "http://localhost:5000/api/quotations/stats" -Method Get
