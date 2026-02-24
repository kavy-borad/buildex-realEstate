# Dashboard Interactvity - Switch Charts

## Changes Made

I have updated the Dashboard to support switching between **Revenue** and **Project Growth** charts.

### 1. Backend Updates (`dashboardController.js`)
- Added `projectChart` data to the API response.
- This chart tracks the number of projects (quotations) over time.
- Now the API returns both `revenueChart` and `projectChart`.

### 2. Frontend Updates (`DashboardPage.tsx`)
- **Added State**: `selectedChart` ('revenue' | 'projects')
- **Updated Stats Cards**: 
  - Clicking "Total Revenue" switches to Revenue Chart
  - Clicking "Total Projects" switches to Project Growth Chart
  - Added visual feedback (highlight border/shadow) to the active card
- **Updated Chart Area**:
  - Dynamically updates **Chart Title** ("Revenue Overview" vs "Total Projects Growth")
  - Dynamically updates **Total Value** (Currency format vs Number format)
  - Dynamically updates **Chart Color** (Purple for Revenue, Pink for Projects)
  - Dynamically switches **Chart Data** based on selection

## How to Uses

1. Open Dashboard
2. Click on the **Total Revenue** card → See Revenue Chart (Purple)
3. Click on the **Total Projects** card → See Project Growth Chart (Pink)

## Logic Flow

```
User Clicks Card
     ↓
setSelectedChart('projects')
     ↓
getChartData() returns project data
     ↓
Chart Component Re-renders
     - Use Pink Color
     - Show Project Count
     - Hide Currency Symbol
```

The data switching is instantaneous because both datasets are fetched initially. No extra API calls needed when switching tabs!
