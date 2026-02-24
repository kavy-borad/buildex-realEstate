# AI Assistant Prompts for Buildex Development

This document contains comprehensive prompts for working with AI assistants (like Claude, ChatGPT, etc.) on the Buildex project. Use these prompts to quickly onboard AI assistants and get accurate, context-aware help.

---

## 📋 Master Project Prompt

**Use this when starting a new conversation:**

```
I'm working on "Buildex" - a full-stack construction management SaaS platform.

**Tech Stack:**
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS + Shadcn/ui
- Backend: Node.js + Express + MongoDB + Mongoose
- PDF Generation: Puppeteer (server-side A4 PDF generation)
- Authentication: JWT tokens

**Project Structure:**
- `/frontend` - React application with TypeScript
- `/backend` - Express API with ES modules

**Key Features:**
1. Quotation management with dual templates (Primary & Material)
2. Server-side PDF generation using Puppeteer (A4 format, multi-page)
3. Client portal with shareable links (approve/reject/request changes)
4. Dashboard with revenue tracking and analytics
5. Settings for company branding and material management

**Design System:**
- Color Palette: Blue/Indigo (primary), Emerald (success), Red (error), Slate (neutral)
- Typography: Inter font family
- Component Library: Shadcn/ui with Radix UI primitives
- Styling: Tailwind CSS with utility-first approach
- Theme: Professional, modern, card-based layout

**Current Working Directory:** d:\Buildex\buildex

Please help me with: [YOUR SPECIFIC REQUEST]
```

---

## 🎯 Feature-Specific Prompts

### **Adding a New API Endpoint**

```
I need to add a new API endpoint to Buildex:

**Endpoint Details:**
- Route: [e.g., GET /api/reports/revenue]
- Purpose: [What it should do]
- Request Parameters: [Query params, body, etc.]
- Response Format: [Expected JSON structure]

**Context:**
- Backend Structure: Express + Mongoose
- Existing Pattern: Routes in `/backend/routes/`, Controllers in `/backend/controllers/`
- Authentication: JWT middleware required for protected routes

Please provide:
1. Route definition
2. Controller logic
3. Any necessary model updates
4. Error handling

Follow existing patterns in the codebase.
```

---

### **Creating a New Frontend Component**

```
I need to create a new React component for Buildex:

**Component Name:** [e.g., RevenueChart]
**Purpose:** [What it displays/does]
**Props:** [Expected props and types]

**Design Requirements:**
- Follow Buildex design system (Tailwind + Shadcn/ui)
- Use existing color palette (Blue/Indigo primary, Slate neutral)
- Card-based layout with shadow-sm
- Responsive design (mobile-first)

**Integration:**
- Use TanStack Query for data fetching if needed
- Lucide React for icons
- Follow TypeScript strict mode

Please provide complete component code with:
1. TypeScript interface for props
2. Proper styling with Tailwind
3. Accessibility considerations
4. Error states and loading states
```

---

### **Modifying PDF Template**

```
I need to modify the Puppeteer PDF template for quotations:

**Current Location:** `/backend/utils/quotationPdfTemplate.js`

**Requirements:**
- A4 size (210mm x 297mm)
- 20mm margins on all sides
- Multi-page support with page breaks
- Professional invoice-style layout

**Changes Needed:**
[Describe what you want to change]

**Design Constraints:**
- Must use inline CSS (no external stylesheets)
- Table headers should repeat on each page (display: table-header-group)
- Avoid page breaks within items (page-break-inside: avoid)
- Use Arial/Helvetica for maximum PDF compatibility

Please provide updated HTML template function.
```

---

### **Database Schema Changes**

```
I need to update a Mongoose schema in Buildex:

**Model:** [e.g., Quotation, Client, Settings]
**Location:** `/backend/models/[ModelName].js`

**Changes:**
[List the fields to add/modify/remove]

**Considerations:**
- Maintain backward compatibility if possible
- Add proper validation
- Update indexes if needed
- Create migration script if necessary

Please provide:
1. Updated schema code
2. Migration strategy (if needed)
3. Impact on existing API endpoints
```

---

### **Fixing a Bug**

```
I'm experiencing a bug in Buildex:

**Bug Description:**
[Clear description of the issue]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Expected vs Actual behavior]

**Error Messages:**
[Paste any console errors or server logs]

**Relevant Code Location:**
[File path and function/component name]

**Environment:**
- Node version: [e.g., v18.x]
- OS: Windows
- Browser (if frontend): [e.g., Chrome 120]

Please help me:
1. Identify root cause
2. Provide a fix
3. Suggest preventive measures
```

---

## 🎨 Design & UI Prompts

### **Creating a New Page**

```
I need to create a new page in Buildex:

**Page Name:** [e.g., ReportsPage]
**Route:** [e.g., /reports]
**Purpose:** [What the page shows]

**Design Requirements:**
- Follow Buildex theme (modern, professional, card-based)
- Responsive layout (mobile-first breakpoints)
- Use Shadcn/ui components
- Color scheme: Blue/Indigo primary, Slate neutral

**Components Needed:**
[List main sections/components]

**Data Requirements:**
[API endpoints to fetch data from]

Please provide:
1. Full page component code (TypeScript)
2. Route configuration
3. Required API service methods
4. Mobile-responsive layout
```

---

### **Styling a Component**

```
I need to style a component according to Buildex design system:

**Component:** [Name and purpose]

**Design System Requirements:**
- Typography: Inter font family
- Primary color: Blue-600 (#4F46E5)
- Success color: Emerald-600 (#059669)
- Error color: Red-600 (#DC2626)
- Neutral: Slate scale
- Shadows: shadow-sm for cards, shadow-md for elevated elements
- Rounded corners: rounded-lg (8px)
- Spacing: p-6 for card padding, space-y-4 for vertical gaps

**Additional Requirements:**
[Any specific styling needs]

Please provide Tailwind CSS classes following the design system.
```

---

## 🧪 Testing Prompts

### **Writing Tests**

```
I need to write tests for Buildex:

**What to Test:**
[Component/Function/API endpoint]

**Testing Framework:**
- Frontend: Vitest + React Testing Library (if applicable)
- Backend: Jest/Mocha (specify which)

**Test Cases:**
1. [Test case 1]
2. [Test case 2]
3. [Edge cases]

Please provide:
1. Test file structure
2. Test cases with assertions
3. Mock data/services if needed
```

---

## 🚀 Deployment & DevOps Prompts

### **Production Deployment**

```
I need to prepare Buildex for production deployment:

**Target Platform:** [e.g., AWS, Vercel, DigitalOcean]

**Requirements:**
- Frontend: Vite production build
- Backend: Node.js server with PM2
- Database: MongoDB (hosted or self-hosted)
- SSL: Required
- Environment: Production

Please provide:
1. Build scripts
2. Environment variable configuration
3. Deployment checklist
4. Security hardening steps
5. Performance optimization tips
```

---

## 📊 Data & Analytics Prompts

### **Adding Analytics/Reporting**

```
I need to add analytics/reporting to Buildex:

**Requirement:**
[What data to track/display]

**Visualization:**
- Library: Recharts (already installed)
- Chart type: [Line, Bar, Pie, etc.]

**Data Source:**
[API endpoint or calculation]

**Design:**
- Follow Buildex dashboard card style
- Use primary color palette for charts
- Responsive design

Please provide:
1. Backend aggregation query (if needed)
2. API endpoint
3. Frontend chart component
4. Data transformation logic
```

---

## 🔐 Security Prompts

### **Security Review**

```
I need a security review for this Buildex feature:

**Feature:** [Name and description]

**Security Concerns:**
1. Authentication: JWT-based
2. Authorization: Role-based (if applicable)
3. Input Validation: Required
4. SQL/NoSQL Injection: MongoDB (Mongoose)
5. XSS: React (auto-escaping)

Please review:
[Paste relevant code]

Provide:
1. Security vulnerabilities found
2. Recommended fixes
3. Best practices to follow
```

---

## 🔧 Debugging Prompts

### **Understanding Error Logs**

```
I'm getting an error in Buildex:

**Error Message:**
[Paste full error with stack trace]

**When it Occurs:**
[Describe the scenario]

**Relevant Code:**
[Paste code snippet]

**Environment:**
- Development/Production
- Node version
- Browser (if applicable)

Please help me:
1. Understand what's causing this
2. Provide a fix
3. Explain why it happened
```

---

## 📚 Learning & Documentation Prompts

### **Explaining a Feature**

```
Please explain how [FEATURE NAME] works in Buildex:

**Feature:** [e.g., PDF Generation, Shareable Links, etc.]

I need to understand:
1. Architecture/flow
2. Key files and functions
3. Data flow
4. Any gotchas or edge cases

Please provide a clear explanation with code references.
```

---

## 🎯 Quick Reference Prompts

### **File Locations**
```
Where should I place [TYPE OF FILE] in Buildex?

Types: React component, API route, Mongoose model, utility function, type definition, CSS file, etc.
```

### **Code Standards**
```
What are the coding standards for Buildex?

Specifically for: [JavaScript/TypeScript, naming conventions, file organization, etc.]
```

### **Dependencies**
```
Should I add [PACKAGE NAME] to Buildex?

Purpose: [Why you need it]
Alternative: [Any existing solution]

Please advise on:
1. Whether it fits the project
2. Bundle size impact
3. Alternative solutions
```

---

## 💡 Pro Tips for Using These Prompts

1. **Be Specific**: Replace placeholders with actual details
2. **Provide Context**: Include error messages, code snippets, or screenshots
3. **Reference Existing Code**: Point to similar implementations in the codebase
4. **Specify Constraints**: Mention design system, performance, or compatibility requirements
5. **Ask for Alternatives**: Request multiple solutions when applicable

---

## 🔄 Iteration Prompts

### **Refining a Solution**
```
The previous solution works, but I need to refine it:

**Current Implementation:**
[Paste code or describe]

**Issues/Improvements Needed:**
1. [Issue 1]
2. [Issue 2]

**Constraints:**
[Performance, compatibility, design requirements]

Please provide an improved version.
```

---

**Document Version**: 1.0  
**Last Updated**: February 2026  

Use these prompts to maintain consistency and quality when working with AI assistants on the Buildex project!
