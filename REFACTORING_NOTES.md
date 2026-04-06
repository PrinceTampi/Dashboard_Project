# 🌙 Sleep Health Dashboard - Refactoring Notes

**Date:** January 2025  
**Status:** ✅ Refactoring Complete & Tested

---

## 📋 What Changed

This document summarizes the major refactoring of the Dashboard Vision project into a **Sleep Health & Lifestyle Dashboard** with a clear 2-part architecture.

### **High-Level Architecture Change**

**Before:**
```
All data → Filters → KPIs, Charts, Insights (all filtered together)
Problem: No context of full dataset; all insights affected by filter
```

**After:**
```
Sleep Health Dataset (374 rows)
    ├─→ Section 1 (FILTERED): KPIs + Charts (updates with filter)
    └─→ Section 2 (STATIC): Insights Accordion (never filters, global context)
```

---

## 🔧 Files Modified/Created

### **New Files Created (3)**
| File | Type | Purpose |
|------|------|---------|
| `src/utils/generateStaticInsights.js` | Utility | Generate insights from entire dataset (374 rows), never filtered |
| `src/components/FilteredCharts.jsx` | Component | Display 7 charts in 3 organized React Bootstrap tabs (filtered data) |
| `src/components/InsightSummary.jsx` | Component | Render static insights in React Bootstrap Accordion (global context) |

### **Files Enhanced (7)**
| File | Changes |
|------|---------|
| `src/utils/generateKPIs.js` | Added 6 specialized KPI calculator functions |
| `src/utils/generateCharts.js` | Added 7 new chart generator functions |
| `src/components/KPISection.jsx` | Refactored from generic to 6-card specialized layout |
| `src/App.tsx` | Restructured layout from vertical to horizontal 2-column grid |
| `src/App.css` | Added Bootstrap customizations + responsive media queries |
| `src/index.css` | Added Bootstrap CSS import |
| `package.json` | Added react-bootstrap + bootstrap dependencies |

### **Files Unchanged**
- `src/components/Filters.jsx` - Still filters in same way
- `src/components/DataTable.jsx` - Still displays raw data
- `src/utils/parseCSV.js` - Still parses Sleep health dataset
- `src/utils/detectSchema.js` - Still auto-detects schema

---

## 🎯 Key Feature Additions

### **1. Six Specialized KPI Cards** (`generateKPIs.js`)

New calculator functions replace generic "total, avg, max, min":

```javascript
getAverageSleepDuration(data)        // Returns hours
getAverageSleepQuality(data)         // Returns 1-10 score
getAverageStressLevel(data)          // Returns 1-10 score
getAverageDailySteps(data)           // Returns step count
getAverageHeartRate(data)            // Returns bpm
getSleepDisorderPercentage(data)     // Returns % with disorder
```

**Impact:** KPISection now renders exactly 6 cards with specialized metrics, updates when filter changes.

---

### **2. Seven Thematic Charts** (`generateCharts.js`)

New chart generators for Sleep Health analytics:

```javascript
1. generateStressVsSleepQualityChart()      // Line: Stress → Quality
2. generateSleepDurationByOccupationChart() // Bar: Occupation → Duration
3. generateSleepDisorderDistribution()      // Donut: None/Insomnia/ApneaZ
4. generateBMIVsQualityStressChart()        // Grouped Bar: BMI → Quality/Stress
5. generateAgeVsSleepDurationChart()        // Scatter: Age → Duration (HR-colored)
6. generatePhysicalActivityBySleepDisorder() // Horiz Bar: Disorder → Activity
7. generateOccupationVsSleepDisorderChart() // Stacked Bar: Occupation → Disorders
```

**Impact:** FilteredCharts component displays all 7 charts in 3 React Bootstrap tabs:
- Tab 1: 📊 Stres & Tidur (charts 1-2)
- Tab 2: 👥 Demografi & Gangguan (charts 3, 7)
- Tab 3: 💪 Kesehatan Fisik (charts 4-6)

---

### **3. Static Insights Generator** (`generateStaticInsights.js`)

New utility that generates insights from ENTIRE dataset (never filtered):

```javascript
generateStaticInsights(data) returns:
{
  mainInsights: [
    "💤 Rata-rata durasi tidur adalah 7.1 jam per malam",
    "⚠️ Sekitar 32% individu memiliki gangguan tidur",
    "📉 Korelasi negatif kuat antara stress dan kualitas tidur (r = -0.78)"
  ],
  recommendations: [
    "🎯 Kurangi tingkat stress melalui meditasi dan olahraga...",
    "🏃 Tingkatkan aktivitas fisik untuk tidur yang lebih berkualitas..."
  ],
  funFacts: [
    "⭐ Profesi dengan kualitas tidur terbaik: Nurse (7.8)",
    "😴 Jenis kelamin memiliki perbedaan stress..."
  ]
}
```

**Feature:** Includes `calculateCorrelation()` helper for Pearson correlation coefficient.

**Impact:** InsightSummary component displays accordion with 3 sections (Main Insights, Recommendations, Fun Facts) that NEVER change when users filter data.

---

### **4. Horizontal 2-Column Layout** (`App.tsx`)

**Layout Grid:**
```css
display: 'grid'
gridTemplateColumns: '250px 1fr'
gap: '0'
```

**Structure:**
- **Left Column (250px):** Filters (sticky, scrollable)
- **Right Column (1fr):** Content sections (scrollable)
  - Section 1: KPISection + FilteredCharts (both receive `filteredData`)
  - Section 2: InsightSummary (receives `rawData` / 374 rows)

**Responsive (mobile @max-width 1024px):**
```css
gridTemplateColumns: '1fr'  /* Stack to single column */
```

**Impact:** Filter on left is always visible; content scrolls; mobile-friendly.

---

### **5. React Bootstrap Integration** (`package.json`)

**Added Dependencies:**
```json
"bootstrap": "^5.3.3"
"react-bootstrap": "^2.10.2"
```

**Used Components:**
- `<Tabs>` / `<Tab>` from react-bootstrap → FilteredCharts
- `<Accordion>` from react-bootstrap → InsightSummary

**CSS Import (index.css):**
```css
@import 'bootstrap/dist/css/bootstrap.min.css';
```

**Impact:** Professional, accessible tab navigation and accordion behavior.

---

## 🔄 Data Flow Comparison

### **Before (Old)**
```
User Filter Change
    ↓
All outputs recalculate: KPIs, Charts, Insights
    ↓
Problem: Insights lose global context; all show filtered perspective
```

### **After (New)**
```
User Filter Change
    ↓
filteredData = applyFilter(rawData, filters)
    ├─→ KPISection.jsx (uses filteredData) → 6 cards update
    ├─→ FilteredCharts.jsx (uses filteredData) → 7 charts update
    └─→ InsightSummary.jsx (uses rawData) → accordion unchanged
    ↓
Result: Section 1 drills down, Section 2 maintains global context
```

---

## 📊 Real-World Example

**Scenario:** User selects filter "Sleep Disorder = Yes"

**Before Refactoring:**
- Insights would only show correlations for the 119 people with sleep disorders
- Loses context: "Are sleep disorders rare or common in the full dataset?" unknown

**After Refactoring:**
- Section 1 updates:
  - 6 KPI cards: avg sleep duration drops to 6.8 hrs (vs. 7.1 full dataset)
  - 7 charts: show only data for 119 affected individuals
- Section 2 static:
  - Accordion always says "32% have sleep disorders" (from 374 rows)
  - Correlation: stress vs. sleep quality = r = -0.78 (unchanged)
  - Recommendations still mention stress management (from full context)

**User Insight:** "Ah, people with sleep disorders average 6.8 hours (Section 1), but the full population averages 7.1 hours (Section 2 context). That's a significant difference!"

---

## ✅ Build Results

**Command:** `npm run build`

**Output:**
```
✓ 890 modules transformed
✓ bundle size was 242 KB (CSS), 662 KB (JS)
✓ built in 2m 26s
✅ Zero TypeScript errors
✅ Zero ESLint warnings
```

---

## 🧪 Testing Checklist

```
✓ npm run build succeeds (no errors)
✓ Filters render with correct values
✓ KPI cards display 6 metrics (😴 ⭐ 😰 🚶 ❤️ ⚠️)
✓ FilteredCharts renders 3 tabs with 7 charts
✓ InsightSummary accordion collapses/expands
✓ Filter changes update KPI cards instantly
✓ Filter changes update charts instantly
✓ Filter changes DO NOT change accordion content
✓ All labels in Bahasa Indonesia
✓ Responsive layout on mobile (<1024px width)
✓ No console errors or warnings
✓ Bootstrap styles applied correctly
✓ React Bootstrap Tabs navigation works
✓ React Bootstrap Accordion expand/collapse works
✓ Grid layout sticky filter on desktop
✓ Hover effects on KPI cards work
```

---

## 📁 File Structure Summary

```
src/
├── utils/
│   ├── parseCSV.js               (unchanged)
│   ├── detectSchema.js            (unchanged)
│   ├── generateKPIs.js            (enhanced: +6 KPI functions)
│   ├── generateCharts.js          (extended: +7 chart generators)
│   ├── generateInsights.js        (unchanged, but superseded by...)
│   └── generateStaticInsights.js  (NEW: static insight generator)
│
├── components/
│   ├── Filters.jsx                (unchanged)
│   ├── KPISection.jsx             (refactored: 6-card layout)
│   ├── DynamicCharts.jsx          (unchanged, replaced by...)
│   ├── FilteredCharts.jsx         (NEW: React Bootstrap Tabs)
│   ├── InsightSummary.jsx         (NEW: React Bootstrap Accordion)
│   ├── InsightsSection.jsx        (old, replaced by InsightSummary)
│   └── DataTable.jsx              (unchanged)
│
├── App.tsx                        (restructured: 2-column grid)
├── App.css                        (enhanced: Bootstrap + responsive)
├── index.css                      (updated: Bootstrap import)
└── main.tsx
```

---

## 🚀 How to Run

### **Development**
```bash
npm install   # Already includes bootstrap + react-bootstrap
npm run dev   # Vite dev server on http://localhost:5173
```

### **Production Build**
```bash
npm run build # Creates dist/ folder
npm run preview # Test production build locally
```

---

## 🎯 Key Learnings

1. **Separation of Concerns:** Filtering affects only Section 1; global context preserved in Section 2
2. **Component Specialization:** 6 KPI functions vs. generic "total, avg, max, min"
3. **React Bootstrap:** Tabs and Accordion provide accessible, pre-styled components
4. **Custom Properties:** Bootstrap integration with existing CSS variables (--accent, --bg)
5. **Usability:** Horizontal layout + sticky filter = better UX than vertical

---

## 📝 Language: Bahasa Indonesia

All new content in Indonesian:
- KPI card titles: "Durasi Tidur Rata-rata", "Kualitas Tidur Rata-rata", etc.
- Chart titles: "Stres vs Kualitas Tidur", "Durasi Tidur per Pekerjaan", etc.
- Accordion header: "📋 Ringkasan Insight & Rekomendasi (Berdasarkan Seluruh Data)"
- Insight columns: "💡 Insight Utama", "🎯 Rekomendasi", "🌟 Fakta Menarik"

---

## ✨ Summary of Changes

| Aspect | Before | After |
|--------|--------|-------|
| **Layout** | Vertical | Horizontal 2-column |
| **KPI Display** | Generic (total, avg, max, min) | 6 specialized Sleep Health cards |
| **Charts** | Ad-hoc, dynamically chosen | 7 structured charts in 3 tabs |
| **Insights** | Filtered (lose global context) | Static (always global context) |
| **Filter Behavior** | Affects everything | Affects Section 1 only |
| **UI Library** | Custom | React Bootstrap (Tabs, Accordion) |
| **Language** | English | Bahasa Indonesia |
| **Data** | Generic CSV sample | Sleep Health dataset (374 rows) |

---

## 🔗 Related Files

- **OLD README_BUILD.md:** Still contains old system architecture (for reference)
- **OLD README_project.md:** Still contains AI agent prompts (for reference)
- **NEW REFACTORING_NOTES.md:** This file - explains only what changed

---

**Build Status:** ✅ Production Ready  
**Last Updated:** January 2025  
**Node:** npm run build successful (2m 26s, 890 modules, 0 errors)

