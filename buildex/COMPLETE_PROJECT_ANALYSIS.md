# 🎯 BUILDEX - COMPLETE PROJECT ANALYSIS & BACKEND DESIGN

## 📊 **FRONTEND FEATURES - Complete Analysis**

### **1. PAGES (11 Total)**

```
Landing & Auth:
├── LandingPage.tsx      → Marketing page
├── LoginPage.tsx        → User authentication

Dashboard:
├── DashboardPage.tsx    → Main dashboard with stats

Quotations Module:
├── CreateQuotationPage.tsx   → Create quotations
├── QuotationListPage.tsx     → View all quotations
├── QuotationPreviewPage.tsx  → Preview/View single quotation

Invoices Module:
├── CreateInvoicePage.tsx    → Create invoices
├── InvoiceListPage.tsx      → View all invoices
├── InvoicePreviewPage.tsx   → Preview/View single invoice

Management:
├── ClientsPage.tsx      → Client management
└── SettingsPage.tsx     → Company settings
```

---

## 📋 **DATA STRUCTURES (From Frontend Types)**

### **1. QUOTATION System**

```typescript
// Main Quotation Object
interface Quotation {
  id: string;
  clientDetails: ClientDetails;
  projectDetails: ProjectDetails;
  costItems: CostItem[];
  summary: QuotationSummary;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
}

// Client Details
interface ClientDetails {
  name: string;
  phone: string;
  email: string;
  siteAddress: string;
  quotationDate: string;
  validTill: string;
}

// Project Details
interface ProjectDetails {
  projectType: string;
  builtUpArea: number;
  areaUnit: string;
  location: string;
  constructionQuality: 'basic' | 'standard' | 'premium';
}

// Cost Item
interface CostItem {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  rate: number;
  total: number;
}

// Summary
interface QuotationSummary {
  subtotal: number;
  gstPercentage: number;
  gstAmount: number;
  discount: number;
  grandTotal: number;
}
```

---

### **2. INVOICE System**

```typescript
// Main Invoice Object
interface Invoice {
  id: string;
  invoiceNumber: string;
  quotationId: string;
  clientDetails: {
    name: string;
    phone: string;
    email: string;
    siteAddress: string;
  };
  projectDetails: {
    projectType: string;
    builtUpArea: number;
    areaUnit: string;
    location: string;
    constructionQuality: 'basic' | 'standard' | 'premium';
  };
  items: InvoiceItem[];
  summary: InvoiceSummary;
  paymentStatus: 'Pending' | 'Partial' | 'Paid' | 'Overdue';
  paidAmount: number;
  balanceAmount: number;
  issueDate: string;
  dueDate: string;
  paymentHistory: PaymentRecord[];
  notes?: string;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'cancelled';
  createdAt: string;
}

// Payment Record
interface PaymentRecord {
  id: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'Cash' | 'Cheque' | 'Online' | 'Bank Transfer' | 'UPI' | 'Other';
  notes?: string;
  recordedAt: string;
}
```

---

### **3. COMPANY Details**

```typescript
interface CompanyDetails {
  name: string;
  address: string;
  phone: string;
  email: string;
  gstNumber: string;
  tagline?: string;
}
```

---

## 🗄️ **DATABASE SCHEMA DESIGN**

### **1. Collections Needed**

```
buildex (Database)
├── users
├── clients
├── quotations
├── invoices
├── payments
└── settings
```

---

### **2. MongoDB Schemas**

#### **A. User Schema**
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String, // 'admin', 'user'
  createdAt: Date,
  updatedAt: Date
}
```

#### **B. Client Schema**
```javascript
{
  _id: ObjectId,
  name: String (required),
  phone: String (unique, required),
  email: String,
  address: String,
  projects: [ObjectId], // Reference to Quotations
  totalQuotations: Number,
  totalInvoices: Number,
  totalRevenue: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### **C. Quotation Schema**
```javascript
{
  _id: ObjectId,
  quotationNumber: String (auto-generated, unique),
  client: ObjectId (ref: Client),
  
  projectDetails: {
    projectType: String,
    builtUpArea: Number,
    areaUnit: String,
    location: String,
    constructionQuality: String (enum)
  },
  
  costItems: [{
    itemName: String,
    quantity: Number,
    unit: String,
    rate: Number,
    total: Number
  }],
  
  summary: {
    subtotal: Number,
    gstPercentage: Number,
    gstAmount: Number,
    discount: Number,
    grandTotal: Number
  },
  
  status: String (enum: 'draft', 'sent', 'accepted', 'rejected'),
  quotationDate: Date,
  validTill: Date,
  
  // Tracking
  sentAt: Date,
  viewedAt: Date,
  acceptedAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

#### **D. Invoice Schema**
```javascript
{
  _id: ObjectId,
  invoiceNumber: String (auto-generated, unique),
  quotation: ObjectId (ref: Quotation),
  client: ObjectId (ref: Client),
  
  projectDetails: {
    projectType: String,
    builtUpArea: Number,
    areaUnit: String,
    location: String,
    constructionQuality: String
  },
  
  items: [{
    itemName: String,
    quantity: Number,
    unit: String,
    rate: Number,
    total: Number
  }],
  
  summary: {
    subtotal: Number,
    gstPercentage: Number,
    gstAmount: Number,
    discount: Number,
    grandTotal: Number
  },
  
  paymentStatus: String (enum: 'Pending', 'Partial', 'Paid', 'Overdue'),
  paidAmount: Number (default: 0),
  balanceAmount: Number,
  
  issueDate: Date,
  dueDate: Date,
  
  notes: String,
  status: String (enum: 'draft', 'sent', 'viewed', 'paid', 'cancelled'),
  
  createdAt: Date,
  updatedAt: Date
}
```

#### **E. Payment Schema**
```javascript
{
  _id: ObjectId,
  invoice: ObjectId (ref: Invoice),
  client: ObjectId (ref: Client),
  amount: Number,
  paymentDate: Date,
  paymentMethod: String (enum),
  notes: String,
  recordedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### **F. Settings Schema**
```javascript
{
  _id: ObjectId,
  companyDetails: {
    name: String,
    address: String,
    phone: String,
    email: String,
    gstNumber: String,
    tagline: String,
    logo: String (URL)
  },
  preferences: {
    defaultGST: Number,
    currency: String,
    dateFormat: String,
    invoicePrefix: String,
    quotationPrefix: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 **API ENDPOINTS DESIGN**

### **1. Authentication APIs**
```
POST   /api/auth/register      → Register new user
POST   /api/auth/login         → Login user
POST   /api/auth/logout        → Logout user
GET    /api/auth/me            → Get current user
```

### **2. Client APIs**
```
GET    /api/clients            → Get all clients
GET    /api/clients/:id        → Get single client
POST   /api/clients            → Create client
PUT    /api/clients/:id        → Update client
DELETE /api/clients/:id        → Delete client
GET    /api/clients/stats      → Get clients statistics
```

### **3. Quotation APIs**
```
GET    /api/quotations              → Get all quotations
GET    /api/quotations/:id          → Get single quotation
POST   /api/quotations              → Create quotation
PUT    /api/quotations/:id          → Update quotation
DELETE /api/quotations/:id          → Delete quotation
PATCH  /api/quotations/:id/status   → Update status
GET    /api/quotations/stats        → Get quotations statistics
GET    /api/quotations/client/:id   → Get client quotations
```

### **4. Invoice APIs**
```
GET    /api/invoices                → Get all invoices
GET    /api/invoices/:id            → Get single invoice
POST   /api/invoices                → Create invoice (from quotation)
PUT    /api/invoices/:id            → Update invoice
DELETE /api/invoices/:id            → Delete invoice
PATCH  /api/invoices/:id/status     → Update status
GET    /api/invoices/stats          → Get invoices statistics
GET    /api/invoices/client/:id     → Get client invoices
```

### **5. Payment APIs**
```
GET    /api/payments                → Get all payments
GET    /api/payments/invoice/:id    → Get invoice payments
POST   /api/payments                → Record payment
PUT    /api/payments/:id            → Update payment
DELETE /api/payments/:id            → Delete payment
GET    /api/payments/stats          → Get payment statistics
```

### **6. Settings APIs**
```
GET    /api/settings                → Get settings
PUT    /api/settings                → Update settings
PUT    /api/settings/company        → Update company details
```

### **7. Dashboard APIs**
```
GET    /api/dashboard/stats         → Get dashboard statistics
GET    /api/dashboard/recent        → Get recent activities
GET    /api/dashboard/revenue       → Get revenue analytics
```

---

## 📄 **JSON REQUEST/RESPONSE FORMATS**

### **1. Create Quotation**

**Request:**
```json
POST /api/quotations
Content-Type: application/json

{
  "clientDetails": {
    "name": "Rajesh Kumar",
    "phone": "+91 9876543210",
    "email": "rajesh@example.com",
    "siteAddress": "123 Main Street, Mumbai",
    "quotationDate": "2026-02-04",
    "validTill": "2026-03-04"
  },
  "projectDetails": {
    "projectType": "Residential - Villa",
    "builtUpArea": 2500,
    "areaUnit": "Sq.ft",
    "location": "Mumbai",
    "constructionQuality": "premium"
  },
  "costItems": [
    {
      "id": "item-1",
      "itemName": "Foundation Work",
      "quantity": 1,
      "unit": "Lump Sum",
      "rate": 500000,
      "total": 500000
    },
    {
      "id": "item-2",
      "itemName": "Brickwork",
      "quantity": 2500,
      "unit": "Sq.ft",
      "rate": 85,
      "total": 212500
    }
  ],
  "summary": {
    "subtotal": 712500,
    "gstPercentage": 18,
    "gstAmount": 128250,
    "discount": 0,
    "grandTotal": 840750
  },
  "status": "draft"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Quotation created successfully",
  "data": {
    "_id": "6982d512eac0d96f270e3d9c",
    "quotationNumber": "QT-2026-0001",
    "client": {
      "_id": "6982d512eac0d96f270e3d9a",
      "name": "Rajesh Kumar",
      "phone": "+91 9876543210",
      "email": "rajesh@example.com",
      "address": "123 Main Street, Mumbai"
    },
    "projectDetails": { ... },
    "costItems": [ ... ],
    "summary": { ... },
    "status": "draft",
    "quotationDate": "2026-02-04T00:00:00.000Z",
    "validTill": "2026-03-04T00:00:00.000Z",
    "createdAt": "2026-02-04T05:11:23.000Z",
    "updatedAt": "2026-02-04T05:11:23.000Z"
  }
}
```

---

### **2. Create Invoice from Quotation**

**Request:**
```json
POST /api/invoices
Content-Type: application/json

{
  "quotationId": "6982d512eac0d96f270e3d9c",
  "issueDate": "2026-02-04",
  "dueDate": "2026-02-19",
  "notes": "Payment due within 15 days"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Invoice created successfully",
  "data": {
    "_id": "6982d612eac0d96f270e3d9f",
    "invoiceNumber": "INV-2026-0001",
    "quotation": "6982d512eac0d96f270e3d9c",
    "client": { ... },
    "projectDetails": { ... },
    "items": [ ... ],
    "summary": { ... },
    "paymentStatus": "Pending",
    "paidAmount": 0,
    "balanceAmount": 840750,
    "issueDate": "2026-02-04T00:00:00.000Z",
    "dueDate": "2026-02-19T00:00:00.000Z",
    "status": "draft",
    "createdAt": "2026-02-04T05:15:00.000Z"
  }
}
```

---

### **3. Record Payment**

**Request:**
```json
POST /api/payments
Content-Type: application/json

{
  "invoiceId": "6982d612eac0d96f270e3d9f",
  "amount": 400000,
  "paymentDate": "2026-02-10",
  "paymentMethod": "Bank Transfer",
  "notes": "Partial payment received"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment recorded successfully",
  "data": {
    "_id": "6982d712eac0d96f270e3da2",
    "invoice": "6982d612eac0d96f270e3d9f",
    "client": "6982d512eac0d96f270e3d9a",
    "amount": 400000,
    "paymentDate": "2026-02-10T00:00:00.000Z",
    "paymentMethod": "Bank Transfer",
    "notes": "Partial payment received",
    "recordedAt": "2026-02-10T08:30:00.000Z",
    "createdAt": "2026-02-10T08:30:00.000Z"
  },
  "invoice": {
    "paymentStatus": "Partial",
    "paidAmount": 400000,
    "balanceAmount": 440750
  }
}
```

---

## 🎯 **IMPLEMENTATION PLAN**

### **Phase 1: Backend Setup (This Part)**
1. ✅ Create all MongoDB schemas
2. ✅ Setup database connection
3. ✅ Create all API endpoints
4. ✅ Test with Postman/Thunder Client
5. ✅ Create comprehensive API documentation

### **Phase 2: Frontend Integration**
1. ✅ Create API service layers
2. ✅ Integrate quotations module
3. ✅ Integrate invoices module
4. ✅ Integrate clients module
5. ✅ Add loading states
6. ✅ Add error handling

### **Phase 3: Testing & Polish**
1. ✅ End-to-end testing
2. ✅ Fix bugs
3. ✅ Performance optimization
4. ✅ Final documentation

---

## 📊 **FEATURES SUMMARY**

### **Quotation System**
- Create, edit, delete quotations
- Multiple status tracking
- Auto client creation
- PDF generation
- Template support

### **Invoice System**
- Create invoices from quotations
- Payment tracking (multiple payments)
- Payment status (Pending, Partial, Paid, Overdue)
- Due date tracking
- PDF generation

### **Client Management**
- Client database
- Client history
- Total quotations/invoices per client
- Revenue tracking

### **Dashboard**
- Total quotations/invoices count
- Revenue analytics
- Recent activities
- Status-wise breakdown

### **Settings**
- Company details
- GST configuration
- Numbering formats
- Preferences

---

**This is complete frontend analysis. Now we'll build proper backend for ALL these features!** 🚀
