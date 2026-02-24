# Buildex - Construction Management SaaS Platform

## 🏗️ Project Overview

**Buildex** is a modern, full-stack SaaS platform designed specifically for construction contractors and builders to streamline their business operations. It provides a complete suite of tools for managing quotations, invoices, clients, and payments with professional PDF generation and client collaboration features.

---

## 🎯 Core Purpose

Enable construction contractors to:
- **Create professional quotations** with detailed cost breakdowns
- **Generate invoice-quality PDFs** with perfect A4 formatting
- **Share quotations with clients** via secure, trackable links
- **Manage client relationships** and project history
- **Track payments and revenue** through an intuitive dashboard
- **Collaborate with clients** who can approve/reject/request changes

---

## 🚀 Key Features

### 1. **Quotation Management**
- Dual template system (Primary Template & Material Template)
- Real-time cost calculation with GST, labour costs, and discounts
- Draft/Sent/Accepted/Rejected status tracking
- Duplicate quotations for faster workflow
- Search and filter capabilities

### 2. **PDF Generation (Puppeteer-based)**
- Server-side A4 PDF generation using Puppeteer
- Multi-page support with automatic page breaks
- Repeating headers for professional invoices
- Company branding with logo integration
- Two PDF formats based on template type

### 3. **Client Portal**
- Shareable links with secure token-based access
- Client can view quotation details
- Approve, reject, or request changes
- Built-in feedback forms with reason capturing
- Activity logging for contractor visibility

### 4. **Dashboard & Analytics**
- Revenue tracking with trend charts
- Project count visualization
- Recent activity feed
- Payment status overview

### 5. **Settings & Customization**
- Company details (name, logo, address, phone, email, GST)
- Material categories and items management
- Terms & conditions templates
- User profile management

---

## 📦 Technology Stack

### **Frontend**
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **UI Components**: Shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast)

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript (ES Modules)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **PDF Generation**: Puppeteer
- **Security**: bcryptjs, helmet, cors

### **Infrastructure**
- **Development**: Vite Dev Server (Frontend), Nodemon (Backend)
- **Environment**: `.env` files for configuration
- **API Architecture**: RESTful API with JSON responses

---

## 🗂️ Project Structure

```
buildex/
├── frontend/                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/         # Shadcn/ui base components
│   │   │   ├── layout/     # Layout components (Sidebar, Navbar)
│   │   │   └── quotation/  # Quotation-specific components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services and data fetching
│   │   ├── contexts/       # React Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── data/           # Static data (material items, categories)
│   │   └── styles/         # Global CSS and theme
│   ├── public/             # Static assets
│   └── package.json
│
├── backend/                  # Node.js + Express Backend
│   ├── controllers/         # Business logic handlers
│   │   ├── pdfController.js            # PDF generation logic
│   │   ├── quotationController.js      # Quotation CRUD
│   │   ├── publicQuotationController.js # Client portal
│   │   ├── settingsController.js       # Settings management
│   │   └── ...
│   ├── models/              # Mongoose schemas
│   │   ├── Quotation.js    # Quotation model
│   │   ├── Client.js       # Client model
│   │   ├── Settings.js     # Settings model
│   │   └── ...
│   ├── routes/              # Express routes
│   │   ├── pdfRoutes.js    # /api/pdf routes
│   │   ├── quotationRoutes.js
│   │   └── ...
│   ├── middleware/          # Custom middleware (auth, etc.)
│   ├── utils/               # Utility functions
│   │   ├── quotationPdfTemplate.js  # HTML template for PDFs
│   │   └── ...
│   ├── db/                  # Database connection
│   ├── server.js            # Express app entry point
│   └── package.json
│
└── README.md                # This file
```

---

## 🎨 Design Philosophy

### **Visual Aesthetics**
- **Modern & Professional**: Clean, minimal UI suitable for business use
- **Card-based Layout**: Information organized in shadowed cards
- **Premium Feel**: Gradients, subtle animations, smooth transitions
- **Responsive Design**: Mobile-first approach with breakpoints

### **Color Psychology**
- **Blue/Indigo**: Trust, professionalism (primary actions)
- **Emerald/Green**: Success, approval states
- **Red**: Rejection, errors, destructive actions
- **Slate/Gray**: Neutral backgrounds, secondary text

### **Typography**
- **Font Family**: Inter, System UI fallbacks
- **Hierarchy**: Clear distinction between headings, body, and labels
- **Readability**: Proper line heights and letter spacing

---

## 🔐 Security Features

1. **JWT Authentication**: Token-based auth with httpOnly cookies
2. **Password Hashing**: bcryptjs with salt rounds
3. **CORS Protection**: Configured origins
4. **Input Validation**: Server-side validation for all inputs
5. **Secure Quotation Links**: UUID-based tokens with expiration
6. **Activity Logging**: Track all client interactions

---

## 📊 Database Schema

### **Core Models**

#### **Quotation**
```javascript
{
  quotationNumber: String (unique),
  client: ObjectId (ref: Client),
  projectDetails: {
    projectType, builtUpArea, city, area, projectDuration
  },
  costItems: [{
    itemName, category, description, quantity, unit, rate, total
  }],
  summary: {
    subtotal, gstPercentage, gstAmount, discount, grandTotal, labourCost
  },
  status: Enum[draft, sent, accepted, rejected],
  accessToken: String (for shareable links),
  clientStatus: Enum[pending, viewed, approved, rejected, changes-requested],
  clientFeedback: { action, comments, rejectionReason, requestedChanges },
  termsAndConditions: String,
  timestamps: true
}
```

#### **Client**
```javascript
{
  name, phone (unique), email, address,
  totalQuotations, totalInvoices, totalRevenue,
  gstNumber, panNumber,
  status: Enum[active, inactive],
  timestamps: true
}
```

#### **Settings**
```javascript
{
  companyDetails: {
    name, logo, address, phone, email, gstNumber
  },
  categories: [{ name, items: [String] }],
  projectTypes: [String],
  defaultTerms: String,
  timestamps: true
}
```

---

## 🛣️ API Endpoints

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### **Quotations**
- `GET /api/quotations` - List all quotations (with pagination, search, filters)
- `POST /api/quotations` - Create new quotation
- `GET /api/quotations/:id` - Get quotation by ID
- `PUT /api/quotations/:id` - Update quotation
- `DELETE /api/quotations/:id` - Delete quotation
- `POST /api/quotations/:id/duplicate` - Duplicate quotation
- `POST /api/quotations/:id/shareable-link` - Generate shareable link

### **PDF Generation**
- `GET /api/pdf/:id/download` - Download PDF for saved quotation
- `POST /api/pdf/preview/download` - Generate PDF from preview data

### **Public Quotation Portal**
- `GET /api/public/quotation/:token` - Get quotation via token
- `POST /api/public/quotation/:token/respond` - Client response

### **Clients**
- `GET /api/clients` - List clients
- `POST /api/clients` - Create client
- `GET /api/clients/:id` - Get client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### **Settings**
- `GET /api/settings` - Get settings
- `PUT /api/settings/company` - Update company details
- `PUT /api/settings/categories` - Update material categories

### **Dashboard**
- `GET /api/dashboard/stats` - Get dashboard statistics

---

## 🎯 User Workflows

### **Contractor Workflow**
1. Create/Edit Quotation → Fill details → Select template
2. Preview → Export PDF / Save Draft / Send to Client
3. Share Link → Client receives secure link
4. Monitor → Client views/responds
5. Take Action → Based on client feedback

### **Client Workflow**
1. Receive secure link via email/SMS
2. View quotation in clean portal
3. Review details, pricing, terms
4. Take action: Approve / Reject / Request Changes
5. Provide feedback with structured forms

---

## 🚀 Deployment Considerations

### **Environment Variables**

**Backend (.env)**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/buildex
JWT_SECRET=your-secret-key
NODE_ENV=production
```

**Frontend (.env)**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### **Production Checklist**
- [ ] Set NODE_ENV=production
- [ ] Use strong JWT_SECRET
- [ ] Configure CORS for production domain
- [ ] Enable MongoDB authentication
- [ ] Set up SSL/HTTPS
- [ ] Configure rate limiting
- [ ] Set up logging (Winston/Morgan)
- [ ] Database backups
- [ ] CDN for static assets

---

## 📝 Development Guidelines

### **Code Standards**
- **ES Modules**: Use import/export syntax
- **Async/Await**: Avoid callback hell
- **Error Handling**: Try-catch blocks with meaningful messages
- **Naming Conventions**: camelCase for variables, PascalCase for components
- **Comments**: Document complex logic

### **Git Workflow**
- Feature branches: `feature/quotation-pdf`
- Bug fixes: `fix/pdf-generation-error`
- Commit messages: Clear and descriptive

---

## 🐛 Known Issues & Limitations

1. **Mongoose Duplicate Index Warning**: Exists due to schema definitions, doesn't affect functionality
2. **Puppeteer Installation**: Requires Chrome dependencies on Linux servers
3. **Large PDFs**: Very long quotations may take time to generate

---

## 🔮 Future Enhancements

- [ ] Email integration for quotation sending
- [ ] SMS notifications
- [ ] Invoice generation
- [ ] Payment gateway integration
- [ ] Multi-user/team support
- [ ] Role-based access control
- [ ] Export to Excel
- [ ] WhatsApp integration
- [ ] Mobile app (React Native)

---

## 📞 Support & Contact

For issues, feature requests, or contributions, please contact the development team.

**Version**: 1.0.0  
**Last Updated**: February 2026
