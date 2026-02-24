# Buildex Design System & Theme Guide

## 🎨 Design Philosophy

Buildex follows a **premium, professional, and minimalist** design approach suitable for B2B SaaS applications in the construction industry. The design prioritizes clarity, trust, and efficiency.

### **Core Principles**
1. **Clarity Over Decoration**: Information hierarchy is king
2. **Consistency**: Same patterns across all pages
3. **Efficiency**: Reduce clicks, increase productivity
4. **Trust**: Professional aesthetics build credibility
5. **Accessibility**: WCAG 2.1 AA compliance

---

## 🎨 Color Palette

### **Primary Colors**

```css
/* Blue/Indigo - Primary Actions & Trust */
--primary-50: #EEF2FF;
--primary-100: #E0E7FF;
--primary-200: #C7D2FE;
--primary-300: #A5B4FC;
--primary-400: #818CF8;
--primary-500: #6366F1;  /* Main Primary */
--primary-600: #4F46E5;
--primary-700: #4338CA;
--primary-800: #3730A3;
--primary-900: #312E81;

/* Usage */
- Primary buttons: bg-primary-600 hover:bg-primary-700
- Links: text-primary-600
- Focus states: ring-primary-500
```

### **Semantic Colors**

```css
/* Success - Emerald/Green */
--success-50: #ECFDF5;
--success-500: #10B981;
--success-600: #059669;
--success-700: #047857;

/* Error/Danger - Red */
--error-50: #FEF2F2;
--error-500: #EF4444;
--error-600: #DC2626;
--error-700: #B91C1C;

/* Warning - Amber */
--warning-50: #FFFBEB;
--warning-500: #F59E0B;
--warning-600: #D97706;

/* Info - Blue */
--info-50: #EFF6FF;
--info-500: #3B82F6;
--info-600: #2563EB;
```

### **Neutral Colors (Slate)**

```css
/* Backgrounds, Text, Borders */
--slate-50: #F8FAFC;   /* Light backgrounds */
--slate-100: #F1F5F9;  /* Card backgrounds */
--slate-200: #E2E8F0;  /* Borders */
--slate-300: #CBD5E1;  /* Disabled states */
--slate-400: #94A3B8;  /* Placeholder text */
--slate-500: #64748B;  /* Secondary text */
--slate-600: #475569;  /* Body text */
--slate-700: #334155;  /* Headings */
--slate-800: #1E293B;  /* Dark headings */
--slate-900: #0F172A;  /* Brand dark */
```

---

## 📐 Typography

### **Font Stack**
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Helvetica Neue', Arial, sans-serif;
```

### **Type Scale**

```css
/* Headings */
.text-xs     { font-size: 0.75rem;  line-height: 1rem; }      /* 12px */
.text-sm     { font-size: 0.875rem; line-height: 1.25rem; }   /* 14px */
.text-base   { font-size: 1rem;     line-height: 1.5rem; }    /* 16px */
.text-lg     { font-size: 1.125rem; line-height: 1.75rem; }   /* 18px */
.text-xl     { font-size: 1.25rem;  line-height: 1.75rem; }   /* 20px */
.text-2xl    { font-size: 1.5rem;   line-height: 2rem; }      /* 24px */
.text-3xl    { font-size: 1.875rem; line-height: 2.25rem; }   /* 30px */
.text-4xl    { font-size: 2.25rem;  line-height: 2.5rem; }    /* 36px */

/* Font Weights */
.font-normal    { font-weight: 400; }  /* Body text */
.font-medium    { font-weight: 500; }  /* Labels, buttons */
.font-semibold  { font-weight: 600; }  /* Subheadings */
.font-bold      { font-weight: 700; }  /* Headings */
.font-extrabold { font-weight: 800; }  /* Hero text */
```

### **Usage Guidelines**

```jsx
/* Page Titles */
<h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>

/* Section Headers */
<h2 className="text-xl font-semibold text-slate-800">Recent Activity</h2>

/* Card Titles */
<h3 className="text-lg font-medium text-slate-700">Quotation #QT-001</h3>

/* Body Text */
<p className="text-base text-slate-600">Regular paragraph text</p>

/* Secondary/Helper Text */
<span className="text-sm text-slate-500">Last updated 2 hours ago</span>

/* Labels */
<label className="text-sm font-medium text-slate-700">Client Name</label>
```

---

## 🧱 Component Patterns

### **Buttons**

```jsx
/* Primary Button */
<Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium 
                   px-4 py-2 rounded-lg shadow-sm transition-colors">
  Save Quotation
</Button>

/* Secondary Button */
<Button variant="outline" className="border-slate-300 text-slate-700 
                                     hover:bg-slate-50">
  Cancel
</Button>

/* Destructive Button */
<Button variant="destructive" className="bg-red-600 hover:bg-red-700">
  Delete
</Button>

/* Icon Button */
<Button size="icon" variant="ghost">
  <Download className="h-4 w-4" />
</Button>
```

### **Cards**

```jsx
/* Standard Card */
<Card className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
  <CardHeader>
    <CardTitle className="text-xl font-semibold">Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>

/* Stat Card with Gradient */
<Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white 
                border-0 shadow-lg">
  <div className="p-6">
    <p className="text-blue-100 text-sm">Total Revenue</p>
    <p className="text-4xl font-bold">₹12,50,000</p>
  </div>
</Card>
```

### **Forms**

```jsx
/* Input Field */
<div className="space-y-2">
  <Label className="text-sm font-medium text-slate-700">
    Client Name
  </Label>
  <Input 
    className="w-full px-3 py-2 border border-slate-300 rounded-lg
               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    placeholder="Enter client name"
  />
  <p className="text-xs text-slate-500">Helper text here</p>
</div>

/* Select Dropdown */
<Select>
  <SelectTrigger className="w-full border-slate-300">
    <SelectValue placeholder="Select project type" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="villa">Residential - Villa</SelectItem>
    <SelectItem value="apartment">Residential - Apartment</SelectItem>
  </SelectContent>
</Select>
```

### **Badges & Status Indicators**

```jsx
/* Status Badges */
<Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
  Sent
</Badge>

<Badge className="bg-amber-100 text-amber-700 border-amber-200">
  Draft
</Badge>

<Badge className="bg-blue-100 text-blue-700 border-blue-200">
  Approved
</Badge>

<Badge className="bg-red-100 text-red-700 border-red-200">
  Rejected
</Badge>
```

### **Toast Notifications**

```jsx
/* Success Toast */
toast({
  title: 'Success',
  description: 'Quotation saved successfully',
  className: 'border-l-4 border-l-emerald-600 bg-white shadow-md'
});

/* Error Toast */
toast({
  title: 'Error',
  description: 'Failed to save quotation',
  variant: 'destructive'
});

/* Info Toast */
toast({
  title: 'Generating PDF...',
  description: 'Please wait',
  className: 'border-l-4 border-l-blue-600 bg-white shadow-md'
});
```

---

## 📏 Spacing & Layout

### **Spacing Scale**
```css
/* Tailwind spacing (1 unit = 0.25rem = 4px) */
.p-1   { padding: 0.25rem; }  /* 4px */
.p-2   { padding: 0.5rem; }   /* 8px */
.p-3   { padding: 0.75rem; }  /* 12px */
.p-4   { padding: 1rem; }     /* 16px */
.p-6   { padding: 1.5rem; }   /* 24px */
.p-8   { padding: 2rem; }     /* 32px */
.p-12  { padding: 3rem; }     /* 48px */
```

### **Common Spacing Patterns**
```jsx
/* Card Padding */
<Card className="p-6">  {/* 24px all sides */}

/* Section Gaps */
<div className="space-y-4">  {/* 16px vertical gap */}

/* Form Field Gaps */
<div className="space-y-2">  {/* 8px gap */}

/* Grid Gaps */
<div className="grid grid-cols-3 gap-6">  {/* 24px gap */}
```

---

## 🎭 Shadows & Elevation

```css
/* Shadow Scale */
.shadow-sm   { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.shadow      { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); }
.shadow-md   { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
.shadow-lg   { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
.shadow-xl   { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }

/* Usage */
/* Cards: shadow-sm or shadow */
/* Modals/Dropdowns: shadow-lg */
/* Hero sections: shadow-xl */
```

---

## 🎬 Animations & Transitions

```css
/* Default Transition */
.transition-colors { transition: color, background-color, border-color 150ms; }

/* Custom Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

/* Hover States */
.hover:scale-105 { /* Subtle scale on hover */ }
.hover:shadow-lg { /* Elevate on hover */ }
```

---

## 📱 Responsive Breakpoints

```css
/* Tailwind Breakpoints */
sm:   640px   /* Small devices (landscape phones) */
md:   768px   /* Medium devices (tablets) */
lg:   1024px  /* Large devices (desktops) */
xl:   1280px  /* Extra large devices */
2xl:  1536px  /* 2X large devices */

/* Usage Example */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 col mobile, 2 col tablet, 3 col desktop */}
</div>
```

---

## 🎯 Specific Component Themes

### **Dashboard Stats Cards**
```jsx
<Card className="bg-gradient-to-br from-blue-600 to-indigo-700 
                text-white border-0 shadow-xl">
  <div className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">
          Total Revenue
        </p>
        <p className="text-4xl font-extrabold mt-2">₹12,50,000</p>
      </div>
      <DollarSign className="h-12 w-12 text-blue-200 opacity-80" />
    </div>
  </div>
</Card>
```

### **Quotation List Item**
```jsx
<Card className="hover:shadow-md transition-shadow cursor-pointer 
                bg-white border border-slate-200">
  <div className="p-4 flex items-center justify-between">
    <div>
      <h3 className="font-semibold text-slate-900">Quotation #QT-001</h3>
      <p className="text-sm text-slate-500">Client Name • 2 days ago</p>
    </div>
    <Badge className="bg-emerald-100 text-emerald-700">Sent</Badge>
  </div>
</Card>
```

### **Form Layout**
```jsx
<div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
  <h2 className="text-xl font-semibold text-slate-900 mb-6">
    Client Details
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-2">
      <Label>Client Name</Label>
      <Input placeholder="Enter name" />
    </div>
    <div className="space-y-2">
      <Label>Phone Number</Label>
      <Input placeholder="Enter phone" />
    </div>
  </div>
</div>
```

---

## 🌙 Dark Mode Support (Future)

```css
/* Dark mode color palette (prepared for future use) */
--dark-bg-primary: #0F172A;     /* slate-900 */
--dark-bg-secondary: #1E293B;   /* slate-800 */
--dark-bg-tertiary: #334155;    /* slate-700 */
--dark-text-primary: #F8FAFC;   /* slate-50 */
--dark-text-secondary: #CBD5E1; /* slate-300 */

/* Usage with dark: variant */
<div className="bg-white dark:bg-slate-900 
                text-slate-900 dark:text-slate-50">
```

---

## ✅ Accessibility Guidelines

1. **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
2. **Focus States**: Always visible `focus:ring-2` classes
3. **Keyboard Navigation**: All interactive elements accessible via keyboard
4. **ARIA Labels**: Added to icon-only buttons
5. **Form Labels**: Always associate labels with inputs

---

## 📋 PDF Theme (Print Styles)

### **PDF Color Palette**
```css
/* Professional invoice colors */
--pdf-primary: #1E40AF;      /* Blue-800 */
--pdf-secondary: #64748B;    /* Slate-500 */
--pdf-success: #059669;      /* Emerald-600 */
--pdf-border: #E2E8F0;       /* Slate-200 */
--pdf-background: #FFFFFF;   /* White */
```

### **PDF Typography**
```css
font-family: Arial, Helvetica, sans-serif;  /* Maximum compatibility */
font-size: 11px;  /* Base size */
line-height: 1.4;
```

---

## 🎨 Theme Usage Examples

### **Primary Action Flow**
```jsx
/* Create Quotation Button (Primary CTA) */
<Button className="bg-blue-600 hover:bg-blue-700 text-white 
                   font-semibold px-6 py-3 rounded-lg shadow-md
                   transition-all hover:shadow-lg">
  <Plus className="mr-2 h-4 w-4" />
  Create New Quotation
</Button>
```

### **Destructive Action**
```jsx
/* Delete Button */
<Button variant="destructive" className="bg-red-600 hover:bg-red-700">
  <Trash2 className="mr-2 h-4 w-4" />
  Delete Quotation
</Button>
```

### **Status Indicators**
```jsx
/* Conditional rendering based on status */
{quotation.status === 'sent' && (
  <Badge className="bg-emerald-100 text-emerald-700 
                   border border-emerald-200">
    <CheckCircle className="mr-1 h-3 w-3" />
    Sent
  </Badge>
)}

{quotation.status === 'draft' && (
  <Badge className="bg-amber-100 text-amber-700 
                   border border-amber-200">
    <Clock className="mr-1 h-3 w-3" />
    Draft
  </Badge>
)}
```

---

## 🚀 Performance Considerations

1. **Lazy Loading**: Use React.lazy() for heavy pages
2. **Image Optimization**: Compress logos and images
3. **CSS Purging**: Tailwind automatically purges unused CSS in production
4. **Animation Performance**: Use `transform` and `opacity` for animations
5. **Font Loading**: Use `font-display: swap` to prevent FOIT

---

**Theme Version**: 1.0  
**Last Updated**: February 2026  
**Maintained by**: Buildex Design Team
