Ini upgrade yang kamu cari—versi **README.md dengan AI agent cerdas (auto-detect CSV + auto-generate chart + adaptive dashboard)**. Ini bukan sekadar template; ini sudah seperti *mini system design spec* untuk agent kamu.

---

```markdown
# 🚀 SMART DATA VISUALIZATION DASHBOARD (AUTO-ADAPTIVE AI AGENT)

## 📌 PROJECT OVERVIEW
This project builds an **intelligent dashboard** that automatically adapts to any CSV dataset.

The system must:
- Detect data structure dynamically
- Infer data types
- Generate KPIs automatically
- Create appropriate charts without hardcoding
- Produce insights from data

---

# 🤖 AI AGENT — ADVANCED EXECUTION MODE

## 🎯 OBJECTIVE
You are an AI coding agent building a **self-adaptive dashboard system**.

DO NOT assume dataset structure.

You MUST:
- Analyze CSV structure
- Infer column roles
- Generate visualization dynamically

---

# ⚙️ TECH STACK

- React (Vite)
- PapaParse
- Recharts

---

# 📂 PROJECT STRUCTURE

```

src/
│
├── components/
│   ├── KPISection.jsx
│   ├── DynamicCharts.jsx
│   ├── DataTable.jsx
│   ├── Filters.jsx
│   └── InsightsSection.jsx
│
├── utils/
│   ├── parseCSV.js
│   ├── detectSchema.js
│   ├── generateCharts.js
│   └── generateInsights.js
│
├── App.jsx
└── main.jsx

public/
└── data.csv

````

---

# 📥 DATA LOADING

Use PapaParse:

```javascript
Papa.parse("/data.csv", {
  download: true,
  header: true,
  complete: (result) => {
    processData(result.data);
  },
});
````

---

# 🔍 STEP 1 — SCHEMA DETECTION (CRITICAL)

Create `detectSchema.js`

## You MUST classify each column into:

* number → numeric values
* category → low unique values
* date → date/time format
* text → everything else

### Detection rules:

```javascript
const isNumber = !isNaN(value);
const isDate = !isNaN(Date.parse(value));
```

### Output format:

```javascript
{
  numeric: ["price", "amount"],
  categorical: ["category", "region"],
  date: ["date"],
  text: ["name"]
}
```

---

# 🔄 STEP 2 — DATA CLEANING

* Remove empty rows
* Convert numeric fields
* Normalize data

---

# 📊 STEP 3 — AUTO KPI GENERATION

For ALL numeric fields:

Generate:

* Total
* Average
* Max
* Min

Example:

```javascript
{
  price: {
    total: 1000,
    avg: 50,
    max: 200,
    min: 10
  }
}
```

Render dynamically in `KPISection`.

---

# 📈 STEP 4 — AUTO CHART GENERATION (CORE INTELLIGENCE)

Create `generateCharts.js`

## Chart rules:

### 1. If DATE + NUMBER exists:

→ Generate LINE CHART

```
X-axis: date
Y-axis: numeric field
```

---

### 2. If CATEGORY + NUMBER exists:

→ Generate BAR CHART

```
X-axis: category
Y-axis: aggregated numeric (sum)
```

---

### 3. If CATEGORY exists:

→ Generate PIE CHART

```
Distribution of category frequency
```

---

### 4. ALWAYS:

→ Render DATA TABLE

---

## Dynamic chart config example:

```javascript
[
  {
    type: "line",
    x: "date",
    y: "sales"
  },
  {
    type: "bar",
    x: "category",
    y: "sales"
  }
]
```

---

# 🧩 STEP 5 — DYNAMIC CHART RENDERING

Create `DynamicCharts.jsx`

* Loop through chart config
* Render correct Recharts component
* Use switch-case or mapping

---

# 🎛️ STEP 6 — SMART FILTER SYSTEM

Create `Filters.jsx`

Rules:

* Dropdown for categorical fields
* Date range filter if date exists

Filtering MUST:

* Update all charts
* Update KPI

---

# 🧠 STEP 7 — AUTO INSIGHT GENERATION

Create `generateInsights.js`

## You MUST detect:

### 1. Trend:

* Increasing or decreasing (based on date)

### 2. Top category:

* Highest value

### 3. Anomaly:

* Outliers (very high/low values)

---

### Example output:

```javascript
[
  "Sales increased steadily over time",
  "Category 'Food' dominates the dataset",
  "Unusual spike detected in March"
]
```

Render in `InsightsSection`.

---

# 🧪 ERROR HANDLING

Handle:

* Empty CSV
* Invalid format
* Missing numeric fields

Fallback UI:

```
"No valid data available"
```

---

# 🚀 PERFORMANCE RULES

* Use useMemo for:

  * processed data
  * KPI
  * chart config

* Avoid re-computation

---

# ⚠️ STRICT RULES

DO NOT:

* Hardcode column names
* Assume schema
* Render charts without validation
* Skip schema detection

---

# ✅ SUCCESS CRITERIA

System works if:

* ANY CSV file can be loaded
* Schema auto-detected correctly
* KPI generated automatically
* Charts adapt dynamically
* Insights generated without manual input

---

# 👨‍💻 MANUAL SETUP

```bash
npm install
npm install papaparse recharts
npm run dev
```

---

# 📌 FINAL SYSTEM FLOW

```
CSV
 ↓
Parse
 ↓
Schema Detection
 ↓
Data Cleaning
 ↓
KPI Generation
 ↓
Chart Generation
 ↓
Filtering
 ↓
Insight Generation
```

---

# 🔥 FINAL NOTE

This is not a static dashboard.

This is an **adaptive data intelligence system** that:

* Understands data
* Decides what to show
* Explains what it means
