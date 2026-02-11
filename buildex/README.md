# BuildEx - Construction Quotation Management System

## 📁 Project Structure

```
buildex/
├── frontend/          ← React + Vite frontend application
│   ├── src/          ← Source code
│   ├── public/       ← Static assets
│   └── package.json  ← Frontend dependencies
├── backend/          ← Node.js + Express backend
│   ├── models/       ← MongoDB models
│   ├── routes/       ← API routes
│   └── server.js     ← Backend entry point
└── package.json      ← Root workspace scripts
```

## 🚀 Quick Start

### 1. Install Dependencies

```sh
# Install all dependencies (frontend + backend)
npm run install:all

# Or install individually
cd frontend && npm install
cd ../backend && npm install
```

### 2. Start Development Servers

**Option 1: Use the batch file (Recommended)**
```sh
# Double-click START_BUILDEX.bat
# This will start both frontend and backend servers
```

**Option 2: Use npm scripts**
```sh
# Start frontend only (Port 8080)
npm run dev

# Start backend only (Port 5000)
npm run dev:backend

# Start both servers
npm run dev:all
```

**Option 3: Start individually**
```sh
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

## 🔧 Technologies Used

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Routing
- **React Query** - Data fetching

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM

## 📝 Available Scripts

```sh
# Development
npm run dev              # Start frontend dev server
npm run dev:backend      # Start backend dev server
npm run dev:all          # Start both servers

# Build
npm run build            # Build frontend for production
npm run build:dev        # Build frontend for development

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode

# Linting
npm run lint             # Run ESLint

# Installation
npm run install:frontend # Install frontend dependencies
npm run install:all      # Install all dependencies
```

## 🔑 Default Login Credentials

```
Email: admin@buildex.com
Password: admin123
```

## 🌐 Server URLs

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000

## 📱 Features

- Client Management
- Quotation Creation & Management
- Invoice Generation
- PDF Export
- Dashboard Analytics
- Responsive Design

