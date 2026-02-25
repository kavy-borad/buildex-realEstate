# Buildex - Complete REST API Documentation

Base URL: `http://localhost:5000/api`
Environment: `Development`
Authorization: `Bearer <token>` (Required for all routes except `/auth/login`, `/public/quotation`, and log Webhook)

---

## 🔐 1. Authentication (`/auth`)

### 1.1 Login Admin
**Endpoint:** `POST /api/auth/login`
**Description:** Authenticates an admin and returns a JWT token.

**Request JSON:**
```json
{
  "email": "admin@example.com",
  "password": "yourpassword123"
}
```

**Response JSON (Success - 200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "admin": {
    "id": "60a...123",
    "name": "Super Admin",
    "email": "admin@example.com",
    "role": "super-admin"
  }
}
```

### 1.2 Get Current Profile
**Endpoint:** `GET /api/auth/me`
**Description:** Fetch current logged-in user profile. Includes token in Header: `Authorization: Bearer <token>`

**Response JSON (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "60a...123",
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

## 👥 2. Clients (`/clients`)

### 2.1 Create Client
**Endpoint:** `POST /api/clients`

**Request JSON:**
```json
{
  "name": "Acme Corp",
  "phone": "+91 9876543210",
  "email": "contact@acme.com",
  "address": "123 Business Avenue, City",
  "gstNumber": "22AAAAA0000A1Z5",
  "panNumber": "ABCDE1234F",
  "notes": "Premium client"
}
```

**Response JSON (Success - 201 Created):**
```json
{
  "success": true,
  "message": "Client created successfully",
  "data": {
    "_id": "61c...456",
    "name": "Acme Corp",
    "phone": "+91 9876543210",
    "email": "contact@acme.com",
    "status": "active",
    "totalQuotations": 0,
    "totalInvoices": 0,
    "totalRevenue": 0
  }
}
```

### 2.2 Get All Clients
**Endpoint:** `GET /api/clients?search=Acme&page=1&limit=10`

**Response JSON (Success - 200 OK):**
```json
{
  "success": true,
  "count": 1,
  "pagination": {
    "total": 1,
    "pages": 1,
    "page": 1,
    "limit": 10
  },
  "data": [
    {
      "_id": "61c...456",
      "name": "Acme Corp",
      "phone": "+91 9876543210",
      "status": "active"
    }
  ]
}
```

### 2.3 Update Client
**Endpoint:** `PUT /api/clients/:id`

**Request JSON:**
```json
{
  "status": "inactive"
}
```

**Response JSON:**
```json
{
  "success": true,
  "message": "Client updated successfully",
  "data": { ...updatedClientData }
}
```

---

## 📄 3. Quotations (`/quotations`)

### 3.1 Create Quotation
**Endpoint:** `POST /api/quotations`

**Request JSON:**
```json
{
  "client": "61c...456",
  "date": "2026-02-24T00:00:00.000Z",
  "validUntil": "2026-03-24T00:00:00.000Z",
  "items": [
    {
      "name": "Web Development",
      "description": "Full stack project",
      "quantity": 1,
      "rate": 50000,
      "amount": 50000
    }
  ],
  "subTotal": 50000,
  "discount": 0,
  "tax": {
    "rate": 18,
    "amount": 9000
  },
  "total": 59000,
  "notes": "Thank you for the business!",
  "terms": "50% advance, 50% on completion",
  "template": "primary"
}
```

**Response JSON (Success - 201 Created):**
```json
{
  "success": true,
  "message": "Quotation created successfully",
  "data": {
    "_id": "65d...789",
    "quotationNumber": "QT-2026-0001",
    "status": "Draft",
    "total": 59000
    // ... rest of data
  }
}
```

### 3.2 View Public Quotation (No Auth Required)
**Endpoint:** `GET /api/public/quotation/:shareId`

**Response JSON (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "quotationNumber": "QT-2026-0001",
    "client": { "name": "Acme Corp", "email": "contact@acme.com" },
    "items": [ ... ],
    "total": 59000,
    "status": "Sent"
  }
}
```

---

## 🧾 4. Invoices (`/invoices`)

### 4.1 Create Invoice
**Endpoint:** `POST /api/invoices`

**Request JSON:**
```json
{
  "client": "61c...456",
  "quotationId": "65d...789", 
  "date": "2026-02-24T00:00:00.000Z",
  "dueDate": "2026-03-10T00:00:00.000Z",
  "items": [
    {
      "name": "Web Development",
      "quantity": 1,
      "rate": 50000,
      "amount": 50000
    }
  ],
  "subTotal": 50000,
  "tax": { "rate": 18, "amount": 9000 },
  "total": 59000,
  "notes": "Payment due in 15 days"
}
```

**Response JSON (Success - 201 Created):**
```json
{
  "success": true,
  "message": "Invoice created successfully",
  "data": {
    "_id": "77f...012",
    "invoiceNumber": "INV-2026-0001",
    "status": "Unpaid",
    "total": 59000,
    "balanceDue": 59000
  }
}
```

---

## 💳 5. Payments (`/payments`)

### 5.1 Record Payment
**Endpoint:** `POST /api/payments`

**Request JSON:**
```json
{
  "invoice": "77f...012",
  "client": "61c...456",
  "amount": 29500,
  "date": "2026-02-24T00:00:00.000Z",
  "paymentMethod": "Bank Transfer",
  "referenceNumber": "TRX987654321",
  "notes": "Advance payment 50%"
}
```

**Response JSON (Success - 201 Created):**
```json
{
  "success": true,
  "message": "Payment recorded successfully",
  "data": {
    "_id": "88g...345",
    "receiptNumber": "REC-2026-0001",
    "amount": 29500,
    "paymentMethod": "Bank Transfer"
  }
}
```

*(Note: Automatically updates related Invoice `balanceDue` and `status` to "Partially Paid" or "Paid"!)*

---

## 📊 6. Dashboard (`/dashboard`)

### 6.1 Get Overview Statistics
**Endpoint:** `GET /api/dashboard/overview`
**Description:** Returns main counts for total revenue and total projects/quotations.

**Request JSON:**
*(No Body Required)*

**Response JSON (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 500000, 
    "totalQuotations": 10   
  }
}
```

### 6.2 Get Project Status Stats
**Endpoint:** `GET /api/dashboard/project-stats`
**Description:** Returns the status breakdown of projects for the grid cards.

**Request JSON:**
*(No Body Required)*

**Response JSON (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "working": 7,
    "accepted": 4, 
    "sent": 3, 
    "rejected": 1
  }
}
```

### 6.3 Get Charts Data
**Endpoint:** `GET /api/dashboard/charts`
**Description:** Returns date-wise data for plotting the Revenue and Projects graphs.

**Request JSON:**
*(No Body Required)*

**Response JSON (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "revenueChart": [
      { "name": "Feb 23", "value": 15000 },
      { "name": "Feb 24", "value": 18000 }
    ],
    "projectChart": [
      { "name": "Feb 23", "value": 2 },
      { "name": "Feb 24", "value": 5 }
    ]
  }
}
```

### 6.4 Get Recent Activities
**Endpoint:** `GET /api/dashboard/recent-activities`
**Description:** Returns the latest quotes and invoices for the sidebar.

**Request JSON:**
*(No Body Required)*

**Response JSON (Success - 200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "651a2b34...",
      "type": "quotation",
      "client": { 
        "name": "Rajesh Kumar" 
      },
      "quotationNumber": "QT-001", 
      "summary": { "grandTotal": 125000 },
      "createdAt": "2024-02-25T10:00:00.000Z"
    },
    {
      "_id": "651a2b35...",
      "type": "invoice",
      "client": { 
        "name": "Amit Sharma" 
      },
      "invoiceNumber": "INV-102", 
      "summary": { "grandTotal": 50000 },
      "createdAt": "2024-02-24T14:30:00.000Z"
    }
  ]
}
```

---

## ⚙️ 7. System Settings (`/settings`)

### 7.1 Update Company Profile
**Endpoint:** `PUT /api/settings/company`

**Request JSON:**
```json
{
  "companyName": "Buildex Studio",
  "email": "hello@buildex.com",
  "phone": "+91 8888888888",
  "address": "Tech Park, City",
  "currency": "INR",
  "gstNumber": "22BBBBB0000B1Z6",
  "theme": "dark"
}
```

**Response JSON (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "data": { ...updatedSettingsObject }
}
```

---

## 🛠 8. System Logs (API Monitor) (`/logs`)

### 8.1 Get All Logs
**Endpoint:** `GET /api/logs?limit=200&filter=all`

**Response JSON (Success - 200 OK):**
```json
{
  "success": true,
  "count": 200,
  "data": [
    {
      "_id": "99h...456",
      "method": "POST",
      "url": "/api/auth/login",
      "status": 200,
      "responseTime": 42,
      "requestHeaders": { "user-agent": "PostmanRuntime/7.28.4" },
      "requestBody": { "email": "admin@example.com", "password": "***HIDDEN***" },
      "responseBody": { "success": true, "token": "eyJ..." },
      "timestamp": "2026-02-24T12:26:17.000Z"
    }
  ]
}
```

### 8.2 Get Log Statistics
**Endpoint:** `GET /api/logs/stats`

**Response JSON (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "totalRequests": 1542,
    "successRequests": 1540,
    "errorRequests": 2,
    "avgResponseTime": 34
  }
}
```

---

## 🖨️ 9. PDF Generation (`/pdf`)

### 9.1 Download Quotation PDF
**Endpoint:** `GET /api/pdf/quotation/:id`
**Description:** Generates and returns a PDF file stream for the given Quotation ID. 
**Response:** `application/pdf` binary stream.

---

### *End of Document*
