# 👑 Buildex Super Admin & SaaS Management Guide

This guide describes the architecture, design, and workflows for the **Super Admin** role. This role allows you to transform Buildex into a multi-tenant SaaS platform where you manage multiple contractors/businesses.

---

## 🏗️ Roles & Permissions

| Feature | Regular Admin (Contractor) | 👑 Super Admin (Platform Owner) |
| :--- | :--- | :--- |
| **Scope** | Single Business Data Only | **All Businesses/Tenants** |
| **User Mgmt** | Manage their own employees | Manage **Contractor Accounts** |
| **Billing** | Pay for subscription | **Create/Manage Subscription Plans** |
| **Data Access** | Own Quotations/Invoices | **Global System Stats & Logs** |
| **System** | Configure own settings | **System-wide Configuration & Maintenance** |

---

## 🚀 Key Super Admin Features

### 1. **Tenant/Contractor Management**
- **List All Contractors**: View search-able list of all registered businesses.
- **Account Actions**: Verify, Suspend (Ban), or Delete accounts.
- **Login As User**: Impersonate a contractor to debug their issues.
- **User Details**: View their contact info, subscription status, and usage stats.

### 2. **Global Command Center (Dashboard)**
- **System Health**: CPU/Memory usage, API response times.
- **Business Metrics**:
  - Total Active Contractors
  - Total Revenue (Platform MRR/ARR)
  - Total Quotations Generated (System-wide)
- **Growth Charts**: New signups vs. Churn rate.

### 3. **Subscription & Billing**
- **Plan Management**: Create/Edit plans (e.g., Free, Pro, Enterprise).
- **Feature Gating**: Control which features are available in which plan.
- **Payment History**: View platform-level transaction history.

### 4. **System Maintenance**
- **Audit Logs**: Who did what and when (Security logs).
- **Broadcast Notifications**: Send alerts to all users (e.g., "System maintenance at 2 AM").
- **App Configuration**: Toggle global features on/off (e.g., disable PDF generation temporarily).

---

## 🎨 Super Admin Design Theme ("Command Center")

The Super Admin interface should feel distinct from the regular user app. We use a **"Dark Mode First"** approach with **Purple/Violet** accents to signify higher authority and separation from the Client App (Blue).

### **Color Palette (The Royal Theme)**

```css
/* Violet/Purple - The Super Admin Accent */
--admin-primary-50: #f5f3ff;
--admin-primary-500: #8b5cf6;
--admin-primary-600: #7c3aed; /* Main Action Color */
--admin-primary-900: #4c1d95;

/* Dark Backgrounds */
--admin-bg-main: #0f172a;     /* Deep Slate */
--admin-bg-card: #1e293b;     /* Lighter Slate */
--admin-border: #334155;
```

### **UI Components**

#### **1. The Sidebar (Dark & Dense)**
Contractors have a clean, white sidebar. Super Admins get a **Midnight Blue** sidebar to instantly signal "You are in God Mode".

#### **2. Data Tables (High Density)**
Super admins need to scan data fast.
- **Compact Rows**: Reduced padding compared to consumer app.
- **Quick Actions**: Hover actions for common tasks (Ban, Edit, View).
- **Status Pills**: High contrast badges for 'Active', 'Suspended', 'Trial'.

#### **3. Stats Cards (Neon Glow)**
```jsx
/* React Component Style */
<Card className="bg-slate-800 border-slate-700 text-white shadow-lg shadow-purple-900/20">
  <div className="p-4">
    <h3 className="text-slate-400 text-xs uppercase font-bold tracking-wider">Total MRR</h3>
    <div className="flex items-end gap-2 mt-1">
      <span className="text-3xl font-mono font-bold text-white">₹4,50,000</span>
      <span className="text-emerald-400 text-sm font-medium mb-1">+12% ↗</span>
    </div>
  </div>
</Card>
```

---

## 🤖 AI Prompts for Super Admin Tasks

Use these prompts when asking AI to build Super Admin features.

### **Prompt 1: Creating the Super Admin Layout**
```
I need to create the Layout for the Super Admin section of Buildex.

**Requirements:**
- Route Base: `/admin` (distinct from `/app`)
- Theme: Dark Mode default (Slate-900 background)
- Accent Color: Violet-600 (#7c3aed)
- Sidebar items: Dashboard, Tenants, Subscriptions, Settings, Logs.
- Navbar: Should show "SUPER ADMIN" badge clearly to avoid confusion.

Please provide the `AdminLayout.tsx` component using Tailwind and Shadcn/ui.
```

### **Prompt 2: Building the Tenant List**
```
Create a "Tenant Management" table for the Super Admin dashboard.

**Columns:**
1. Business Name (with Logo)
2. Owner Email
3. Status (Active/Suspended/Trial)
4. Plan (Free/Pro)
5. Joined Date
6. Actions (Meatball menu: View Details, Suspend, Delete)

**Tech Stack:**
- React Table (TanStack Table)
- Shadcn/ui Table component
- Mock data for now

**Style:**
- Dark theme optimized
- Compact row height
```

### **Prompt 3: User Impersonation (Login As)**
```
I need to implement a "Login As" feature for Super Admins.

**Logic:**
1. Super Admin clicks "Login as user" on the tenant list.
2. Backend generates a temporary JWT token for that specific user.
3. Frontend stores the admin token separately (to switch back later).
4. Redirects to the user's dashboard `/dashboard`.

Please explain the security implications and provide the Backend API controller code for this.
```

### **Prompt 4: System Analytics API**
```
Create a MongoDB aggregation pipeline for the Super Admin Dashboard.

**Metrics Needed:**
1. Count of new users created in the last 30 days (grouped by day).
2. Top 5 active users by number of quotations generated.
3. Total revenue generated by the platform (sum of subscription payments).

**Models:** `User`, `Quotation`, `Payment`

Please provide the Mongoose controller function.
```

---

## 🛡️ Security Best Practices for Super Admin

1.  **Separate Auth Guard**: Always use a distinct middleware (`requireSuperAdmin`) for `/admin` routes.
2.  **IP Whitelisting**: Optionally restrict Super Admin access to specific IP addresses.
3.  **2FA (Two-Factor Auth)**: **Mandatory** for Super Admin accounts.
4.  **Action Logging**: **Critical**. Every action taken by a Super Admin (e.g., banning a user) must be logged to a tamper-proof audit log.

---

**Guide Version**: 1.0
**Context**: Use this strictly for "Platform Owner" features, separate from regular "Contractor" features.
