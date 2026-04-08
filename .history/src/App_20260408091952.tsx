import { useState, useEffect, useMemo } from "react";
import "./App.css";

// Import utilities
// @ts-expect-error
import { parseCSV, cleanData } from "./utils/parseCSV";
// @ts-expect-error
import { detectSchema } from "./utils/detectSchema";
// @ts-expect-error
import { generateInsights } from "./utils/generateInsights";

// Import components
// @ts-expect-error
import KPISection from "./components/KPISection";
// @ts-expect-error
import FilteredCharts from "./components/FilteredCharts";
// @ts-expect-error
import Filters from "./components/Filters";
// @ts-expect-error
import InsightSummary from "./components/InsightSummary";

function App() {
  const [rawData, setRawData] = useState<any[]>([]);
  const [schema, setSchema] = useState<any>(null);
  const [filters, setFilters] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load CSV on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await parseCSV(
          "/public/Sleep_health_and_lifestyle_dataset.csv",
        );
        const cleaned = cleanData(data);

        if (cleaned.length === 0) {
          setError("No valid data found in CSV");
          return;
        }

        setRawData(cleaned);

        // Detect schema
        const detectedSchema = detectSchema(cleaned);
        setSchema(detectedSchema);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load CSV data";
        setError(errorMessage);
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply filters to data
  const filteredData = useMemo(() => {
    if (!rawData || rawData.length === 0) return [];

    if (!filters || Object.keys(filters).length === 0) {
      return rawData;
    }

    return rawData.filter((row) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;

        // Handle date range filters
        if (
          typeof value === "object" &&
          (value as any).min &&
          (value as any).max
        ) {
          const rowDate = new Date(row[key]).getTime();
          const minDate = new Date((value as any).min).getTime();
          const maxDate = new Date((value as any).max).getTime();
          return rowDate >= minDate && rowDate <= maxDate;
        }

        // Handle array filters (categories)
        if (Array.isArray(value) && value.length === 0) return true;
        if (Array.isArray(value)) {
          return value.includes(String(row[key]));
        }

        // Handle string filters
        return String(row[key]) === String(value);
      });
    });
  }, [rawData, filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleExportPDF = () => {
    const timestamp = new Date()
      .toLocaleDateString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-");
    exportDashboardToPDF(
      rawData,
      schema,
      filteredData,
      `Sleep_Health_Report_${timestamp}.pdf`,
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard">
        <div
          style={{
            padding: "12px 20px",
            background: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <div style={{ opacity: 0.5 }}>Loading...</div>
        </div>
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Sleep Health Dashboard 😴</h1>
            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: "13px",
                color: "#666",
                fontWeight: "400",
              }}
            >
              Created by: AIKO HANAKO LASUT & PRINCE AZARYA TIMOTHY TAMPI
            </p>
            <p>Loading data...</p>
          </div>
        </header>
        <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>
          <p>
            ⏳ Memproses data CSV, mendeteksi schema, menghasilkan
            visualisasi...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard">
        <div
          style={{
            padding: "12px 20px",
            background: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <div style={{ opacity: 0.5 }}>Error</div>
        </div>
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Sleep Health Dashboard 😴</h1>
            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: "13px",
                color: "#666",
                fontWeight: "400",
              }}
            >
              Created by: AIKO HANAKO LASUT & PRINCE AZARYA TIMOTHY TAMPI
            </p>
            <p>Error loading data</p>
          </div>
        </header>
        <div style={{ padding: "40px", textAlign: "center", color: "#d9534f" }}>
          <p>❌ {error}</p>
          <p style={{ marginTop: "10px", color: "#888", fontSize: "14px" }}>
            Pastikan /public/Sleep_health_and_lifestyle_dataset.csv ada dan
            formatnya benar.
          </p>
        </div>
      </div>
    );
  }

  // No data state
  if (!rawData || rawData.length === 0) {
    return (
      <div className="dashboard">
        <div
          style={{
            padding: "12px 20px",
            background: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <div style={{ opacity: 0.5 }}>No Data</div>
        </div>
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Sleep Health Dashboard 😴</h1>
            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: "13px",
                color: "#666",
                fontWeight: "400",
              }}
            >
              Created by: AIKO HANAKO LASUT & PRINCE AZARYA TIMOTHY TAMPI
            </p>
            <p>No data available</p>
          </div>
        </header>
        <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>
          <p>Data CSV tidak ditemukan. Silakan periksa file data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Export Button */}
      <div
        style={{
          padding: "12px 20px",
          background: "#f8f9fa",
          borderBottom: "1px solid #dee2e6",
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <a
          href="https://www.kaggle.com/datasets/uom190346a/sleep-health-and-lifestyle-dataset"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "8px 16px",
            background: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "background-color 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            textDecoration: "none",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#5a6268")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#6c757d")}
        >
          🔗 Sumber Data
        </a>
        <button
          onClick={handleExportPDF}
          style={{
            padding: "8px 16px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "background-color 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#0056b3")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#007bff")}
        >
          📄 Export Report (PDF)
        </button>
      </div>

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🌙 Sleep Health & Lifestyle Dashboard</h1>
          <p
            style={{
              margin: "8px 0 0 0",
              fontSize: "13px",
              color: "#666",
              fontWeight: "400",
            }}
          >
            Created by: AIKO HANAKO LASUT & PRINCE AZARYA TIMOTHY TAMPI
          </p>
          <p>
            Analisis komprehensif kesehatan tidur, stress, dan aktivitas fisik
          </p>
        </div>
      </header>

      {/* Data Summary */}
      <div
        style={{
          padding: "15px 20px",
          background: "var(--accent-bg)",
          borderBottom: "1px solid var(--accent-border)",
          color: "var(--text-h)",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        📊 Dataset: {rawData.length} responden |
        {schema && ` Total Kolom: ${schema.allColumns.length}`}
        {filteredData.length < rawData.length &&
          ` | Filtered: ${filteredData.length} responden`}
      </div>

      {/* Main Layout: Horizontal (Filter Left + Content Right) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "250px 1fr",
          gap: "0",
          minHeight: "calc(100vh - 200px)",
        }}
      >
        {/* Left Column: Filters (Sticky) */}
        <div
          style={{
            backgroundColor: "var(--bg)",
            borderRight: "1px solid var(--border)",
            padding: "20px",
            position: "sticky",
            top: 0,
            height: "fit-content",
            maxHeight: "100vh",
            overflowY: "auto",
          }}
        >
          {schema && (
            <Filters
              schema={schema}
              data={rawData}
              onFilterChange={handleFilterChange}
            />
          )}
        </div>

        {/* Right Column: Main Content (2 Sections) */}
        <div
          style={{
            padding: "30px",
            overflowY: "auto",
          }}
        >
          {/* SECTION 1: Main Dashboard (Filtered Data) */}
          <div style={{ marginBottom: "40px" }}>
            {/* KPI Section */}
            <KPISection filteredData={filteredData} />

            {/* Charts Section with Tabs */}
            <FilteredCharts filteredData={filteredData} />
          </div>

          {/* SECTION 2: Insight Summary (Static, from All Data) */}
          <div
            style={{
              marginTop: "50px",
              paddingTop: "30px",
              borderTop: "2px solid var(--border)",
            }}
          >
            <InsightSummary allData={rawData} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          padding: "20px",
          textAlign: "center",
          color: "#888",
          borderTop: "1px solid var(--border)",
          marginTop: "40px",
          fontSize: "12px",
          backgroundColor: "var(--bg)",
        }}
      >
        <p>
          Sleep Health Dashboard • Analisis berbasis filter dengan insights
          global
        </p>
      </footer>
    </div>
  );
}

export default App;
