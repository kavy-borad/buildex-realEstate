/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📋 QUOTATION BACKEND API - COMPLETE DOCUMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Project: Buildex Construction Management System
 * Module: Quotation Management Backend
 * Type: RESTful API with MongoDB
 * Status: ✅ Production Ready
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ───────────────────────────────────────────────────────────────────────────
// 🎯 API BASE URL
// ───────────────────────────────────────────────────────────────────────────

/**
 * Development: http://localhost:5000/api/quotations
 * Production:  https://your-domain.com/api/quotations
 */

// ───────────────────────────────────────────────────────────────────────────
// 📦 AVAILABLE ENDPOINTS
// ───────────────────────────────────────────────────────────────────────────

/**
 * 1. CREATE NEW QUOTATION
 * ──────────────────────────────────────────────────────────────────────────
 * Method: POST
 * Endpoint: /api/quotations
 *
 * Request Body:
 * {
 *   "clientDetails": {
 *     "name": "John Doe",
 *     "phone": "+91 9876543210",
 *     "email": "john@example.com",
 *     "siteAddress": "123 Main St, Mumbai"
 *   },
 *   "projectDetails": {
 *     "projectType": "Residential - Villa",
 *     "builtUpArea": 2500,
 *     "areaUnit": "Sq.ft",
 *     "location": "Mumbai",
 *     "constructionQuality": "premium"
 *   },
 *   "costItems": [
 *     {
 *       "itemName": "Foundation Work",
 *       "quantity": 1,
 *       "unit": "Lump Sum",
 *       "rate": 500000,
 *       "total": 500000
 *     },
 *     {
 *       "itemName": "Structural Work",
 *       "quantity": 2500,
 *       "unit": "Sq.ft",
 *       "rate": 1200,
 *       "total": 3000000
 *     }
 *   ],
 *   "summary": {
 *     "subtotal": 3500000,
 *     "gstPercentage": 18,
 *     "gstAmount": 630000,
 *     "discount": 50000,
 *     "grandTotal": 4080000
 *   },
 *   "validTill": "2026-03-06T00:00:00.000Z"
 * }
 *
 * Response (201 Created):
 * {
 *   "_id": "65f9...",
 *   "client": "65f8...",
 *   "projectDetails": {...},
 *   "costItems": [...],
 *   "summary": {...},
 *   "status": "draft",
 *   "quotationDate": "2026-02-04T...",
 *   "validTill": "2026-03-06T...",
 *   "createdAt": "2026-02-04T...",
 *   "updatedAt": "2026-02-04T..."
 * }
 */

/**
 * 2. GET ALL QUOTATIONS
 * ──────────────────────────────────────────────────────────────────────────
 * Method: GET
 * Endpoint: /api/quotations
 *
 * Query Parameters (Optional):
 * - status: Filter by status (draft, sent, approved, rejected, etc.)
 * - clientId: Filter by client ID
 * - startDate: Filter quotations created after this date
 * - endDate: Filter quotations created before this date
 *
 * Example: /api/quotations?status=draft&startDate=2026-01-01
 *
 * Response (200 OK):
 * [
 *   {
 *     "_id": "65f9...",
 *     "client": {
 *       "_id": "65f8...",
 *       "name": "John Doe",
 *       "phone": "+91 9876543210"
 *     },
 *     "projectDetails": {...},
 *     "summary": {
 *       "grandTotal": 4080000
 *     },
 *     "status": "draft",
 *     "createdAt": "2026-02-04T..."
 *   },
 *   ...
 * ]
 */

/**
 * 3. GET SINGLE QUOTATION
 * ──────────────────────────────────────────────────────────────────────────
 * Method: GET
 * Endpoint: /api/quotations/:id
 *
 * Example: /api/quotations/65f9abc123def456
 *
 * Response (200 OK):
 * {
 *   "_id": "65f9...",
 *   "client": {
 *     "_id": "65f8...",
 *     "name": "John Doe",
 *     "email": "john@example.com",
 *     "phone": "+91 9876543210",
 *     "address": "..."
 *   },
 *   "projectDetails": {...},
 *   "costItems": [...],
 *   "summary": {...},
 *   "status": "draft",
 *   ...
 * }
 *
 * Error (404 Not Found):
 * {
 *   "message": "Quotation not found"
 * }
 */

/**
 * 4. UPDATE QUOTATION
 * ──────────────────────────────────────────────────────────────────────────
 * Method: PUT
 * Endpoint: /api/quotations/:id
 *
 * Request Body (send only fields to update):
 * {
 *   "projectDetails": {
 *     "projectType": "Commercial - Office",
 *     "builtUpArea": 3000
 *   },
 *   "summary": {
 *     "subtotal": 4000000,
 *     "gstAmount": 720000,
 *     "discount": 100000,
 *     "grandTotal": 4620000
 *   }
 * }
 *
 * Response (200 OK):
 * {
 *   "_id": "65f9...",
 *   "projectDetails": {
 *     "projectType": "Commercial - Office",
 *     "builtUpArea": 3000,
 *     ...
 *   },
 *   "summary": {
 *     "grandTotal": 4620000,
 *     ...
 *   },
 *   ...
 * }
 */

/**
 * 5. DELETE QUOTATION
 * ──────────────────────────────────────────────────────────────────────────
 * Method: DELETE
 * Endpoint: /api/quotations/:id
 *
 * Example: DELETE /api/quotations/65f9abc123def456
 *
 * Response (200 OK):
 * {
 *   "success": true,
 *   "message": "Quotation deleted successfully"
 * }
 *
 * Error (404 Not Found):
 * {
 *   "message": "Quotation not found"
 * }
 */

/**
 * 6. UPDATE QUOTATION STATUS
 * ──────────────────────────────────────────────────────────────────────────
 * Method: PATCH
 * Endpoint: /api/quotations/:id/status
 *
 * Request Body:
 * {
 *   "status": "sent"
 * }
 *
 * Valid Status Values:
 * - draft
 * - sent
 * - negotiation
 * - approved
 * - rejected
 * - completed
 *
 * Response (200 OK):
 * {
 *   "_id": "65f9...",
 *   "status": "sent",
 *   ...
 * }
 */

/**
 * 7. GET QUOTATION STATISTICS
 * ──────────────────────────────────────────────────────────────────────────
 * Method: GET
 * Endpoint: /api/quotations/stats
 *
 * Response (200 OK):
 * {
 *   "total": 42,
 *   "draft": 15,
 *   "sent": 18,
 *   "approved": 7,
 *   "rejected": 2,
 *   "totalValue": 125000000
 * }
 */

// ───────────────────────────────────────────────────────────────────────────
// 📊 DATABASE SCHEMA
// ───────────────────────────────────────────────────────────────────────────

/**
 * QUOTATION COLLECTION STRUCTURE:
 *
 * {
 *   _id: ObjectId,
 *   client: ObjectId (ref: 'Client'),
 *
 *   projectDetails: {
 *     projectType: String (Required),
 *     builtUpArea: Number,
 *     areaUnit: String,
 *     location: String,
 *     constructionQuality: String (enum: 'basic', 'standard', 'premium')
 *   },
 *
 *   costItems: [
 *     {
 *       itemName: String (Required),
 *       quantity: Number (Required),
 *       unit: String (Required),
 *       rate: Number (Required),
 *       total: Number (Required)
 *     }
 *   ],
 *
 *   summary: {
 *     subtotal: Number (Required),
 *     gstPercentage: Number (Default: 18),
 *     gstAmount: Number (Required),
 *     discount: Number (Default: 0),
 *     grandTotal: Number (Required)
 *   },
 *
 *   status: String (enum: 'draft', 'sent', 'negotiation', 'approved', 'rejected', 'completed'),
 *   validTill: Date,
 *   quotationDate: Date (Default: now),
 *
 *   createdAt: Date (Auto),
 *   updatedAt: Date (Auto)
 * }
 */

// ───────────────────────────────────────────────────────────────────────────
// 🔄 COMPLETE BACKEND FLOW
// ───────────────────────────────────────────────────────────────────────────

/**
 * STEP 1: USER CREATES QUOTATION (Frontend)
 *    ↓
 * STEP 2: POST REQUEST to /api/quotations
 *    ├── Controller receives clientDetails + quotationData
 *    ├── Check if Client exists by phone/email
 *    ├── If NO → Create new Client in DB
 *    ├── If YES → Use existing Client ID
 *    └── Create Quotation with Client reference
 *    ↓
 * STEP 3: SAVE to MongoDB
 *    ├── Quotation model validates all fields
 *    ├── Auto-generates timestamps
 *    └── Returns saved quotation
 *    ↓
 * STEP 4: RESPONSE sent to Frontend
 *    └── Frontend updates UI with new quotation
 *
 *
 * STEP 5: USER VIEWS QUOTATIONS LIST
 *    ↓
 * STEP 6: GET REQUEST to /api/quotations
 *    ├── Controller fetches all quotations
 *    ├── Populates client details (name, phone, email)
 *    ├── Sorts by createdAt (newest first)
 *    └── Returns array of quotations
 *    ↓
 * STEP 7: RESPONSE to Frontend
 *    └── Frontend displays in table/cards
 *
 *
 * STEP 8: USER CLICKS "VIEW" on a quotation
 *    ↓
 * STEP 9: GET REQUEST to /api/quotations/:id
 *    ├── Controller finds quotation by ID
 *    ├── Populates full client details
 *    └── Returns complete quotation
 *    ↓
 * STEP 10: RESPONSE to Frontend
 *    └── Navigate to Preview/Detail page
 *
 *
 * STEP 11: USER UPDATES quotation status
 *    ↓
 * STEP 12: PATCH REQUEST to /api/quotations/:id/status
 *    ├── Controller validates status value
 *    ├── Updates only status field
 *    └── Returns updated quotation
 *    ↓
 * STEP 13: RESPONSE to Frontend
 *    └── UI updates status badge
 *
 *
 * STEP 14: USER DELETES quotation
 *    ↓
 * STEP 15: DELETE REQUEST to /api/quotations/:id
 *    ├── Controller finds quotation
 *    ├── Removes quotation from DB
 *    └── Returns success message
 *    ↓
 * STEP 16: RESPONSE to Frontend
 *    └── Remove from list, show toast notification
 */

// ───────────────────────────────────────────────────────────────────────────
// 🔗 FILE STRUCTURE
// ───────────────────────────────────────────────────────────────────────────

/**
 * backend/
 * ├── models/
 * │   ├── Quotation.js          ← Database schema definition
 * │   └── Client.js             ← Client schema (linked to quotations)
 * │
 * ├── controllers/
 * │   └── quotationController.js ← Business logic for all endpoints
 * │
 * ├── routes/
 * │   └── quotationRoutes.js     ← API route definitions
 * │
 * ├── db/
 * │   └── index.js               ← MongoDB connection
 * │
 * └── server.js                  ← Express app entry point
 */

// ───────────────────────────────────────────────────────────────────────────
// ✅ VALIDATION & ERROR HANDLING
// ───────────────────────────────────────────────────────────────────────────

/**
 * AUTOMATIC VALIDATIONS:
 * ✓ Required fields: itemName, quantity, unit, rate, etc.
 * ✓ Data types: Number for amounts, String for names
 * ✓ Enum validation: status, constructionQuality
 * ✓ Default values: gstPercentage (18), discount (0), status ('draft')
 *
 * ERROR RESPONSES:
 * - 400 Bad Request: Invalid data or missing required fields
 * - 404 Not Found: Quotation/Client doesn't exist
 * - 500 Internal Server Error: Database or server issues
 *
 * All errors return:
 * {
 *   "message": "Error description",
 *   "error": "Technical details (in development)"
 * }
 */

// ───────────────────────────────────────────────────────────────────────────
// 🚀 TESTING INSTRUCTIONS
// ───────────────────────────────────────────────────────────────────────────

/**
 * 1. START BACKEND SERVER:
 *    cd backend
 *    npm run dev
 *
 * 2. TEST WITH POSTMAN/THUNDER CLIENT:
 *
 *    A. Create Quotation:
 *       POST http://localhost:5000/api/quotations
 *       Body: JSON (see example above)
 *
 *    B. Get All Quotations:
 *       GET http://localhost:5000/api/quotations
 *
 *    C. Get Single Quotation:
 *       GET http://localhost:5000/api/quotations/YOUR_ID_HERE
 *
 *    D. Update Status:
 *       PATCH http://localhost:5000/api/quotations/YOUR_ID_HERE/status
 *       Body: { "status": "sent" }
 *
 *    E. Delete Quotation:
 *       DELETE http://localhost:5000/api/quotations/YOUR_ID_HERE
 *
 *    F. Get Stats:
 *       GET http://localhost:5000/api/quotations/stats
 */

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 CONCLUSION: BACKEND IS PRODUCTION-READY! ✅
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ✅ Complete CRUD operations
 * ✅ RESTful API design
 * ✅ MongoDB integration
 * ✅ Client relationship handling
 * ✅ Validation & error handling
 * ✅ Statistics endpoint
 * ✅ Proper status codes
 * ✅ Clean architecture
 * ✅ Well-documented
 * 
 * Ready for frontend integration!
 */
