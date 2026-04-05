import { useState, useEffect, useMemo } from 'react'
import './App.css'

// Import utilities
// @ts-expect-error
import { parseCSV, cleanData } from './utils/parseCSV'
// @ts-expect-error
import { detectSchema } from './utils/detectSchema'
// @ts-expect-error
import { generateKPIs } from './utils/generateKPIs'
// @ts-expect-error
import { generateCharts } from './utils/generateCharts'
// @ts-expect-error
import { generateInsights } from './utils/generateInsights'

// Import components
// @ts-expect-error
import KPISection from './components/KPISection'
// @ts-expect-error
import DynamicCharts from './components/DynamicCharts'
// @ts-expect-error
import Filters from './components/Filters'
// @ts-expect-error
import InsightsSection from './components/InsightsSection'

function App() {
  const [rawData, setRawData] = useState<any[]>([])
  const [schema, setSchema] = useState<any>(null)
  const [filters, setFilters] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Load CSV on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await parseCSV('/public/Sleep_health_and_lifestyle_dataset.csv')
        const cleaned = cleanData(data)
        
        if (cleaned.length === 0) {
          setError('No valid data found in CSV')
          return
        }

        setRawData(cleaned)
        
        // Detect schema
        const detectedSchema = detectSchema(cleaned)
        setSchema(detectedSchema)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load CSV data'
        setError(errorMessage)
        console.error('Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Apply filters to data
  const filteredData = useMemo(() => {
    if (!rawData || rawData.length === 0) return []
    
    if (!filters || Object.keys(filters).length === 0) {
      return rawData
    }

    return rawData.filter(row => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true
        
        // Handle date range filters
        if (typeof value === 'object' && (value as any).min && (value as any).max) {
          const rowDate = new Date(row[key]).getTime()
          const minDate = new Date((value as any).min).getTime()
          const maxDate = new Date((value as any).max).getTime()
          return rowDate >= minDate && rowDate <= maxDate
        }
        
        // Handle array filters (categories)
        if (Array.isArray(value) && value.length === 0) return true
        if (Array.isArray(value)) {
          return value.includes(String(row[key]))
        }
        
        // Handle string filters
        return String(row[key]) === String(value)
      })
    })
  }, [rawData, filters])

  // Generate KPIs
  const kpis = useMemo(() => {
    if (!filteredData || !schema || !schema.numeric) return {}
    return generateKPIs(filteredData, schema)
  }, [filteredData, schema])

  // Generate charts
  const charts = useMemo(() => {
    if (!filteredData || !schema) return []
    return generateCharts(filteredData, schema)
  }, [filteredData, schema])

  // Generate insights
  const insights = useMemo(() => {
    if (!rawData || !schema) return []
    return generateInsights(rawData, schema)
  }, [rawData, schema])

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  // Loading state
  if (loading) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Smart Data Dashboard</h1>
            <p>Loading data...</p>
          </div>
        </header>
        <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
          <p>⏳ Processing CSV data, detecting schema, generating visualizations...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Smart Data Dashboard</h1>
            <p>Error loading data</p>
          </div>
        </header>
        <div style={{ padding: '40px', textAlign: 'center', color: '#d9534f' }}>
          <p>❌ {error}</p>
          <p style={{ marginTop: '10px', color: '#888', fontSize: '14px' }}>
            Make sure /public/data.csv exists and is formatted correctly.
          </p>
        </div>
      </div>
    )
  }

  // No data state
  if (!rawData || rawData.length === 0) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Smart Data Dashboard</h1>
            <p>No data available</p>
          </div>
        </header>
        <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
          <p>No CSV data loaded. Please check the data file.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🚀 Smart Data Dashboard</h1>
          <p>Auto-adaptive visualization with schema detection, KPI generation, and AI insights</p>
        </div>
        <div className="header-controls">
          <button className="btn btn-primary">Export Data</button>
          <button className="btn btn-secondary">Settings</button>
        </div>
      </header>

      {/* Data Summary */}
      <div style={{ padding: '20px', background: '#1e1e1e', borderBottom: '1px solid #2d2d2d', color: '#aaa', fontSize: '14px' }}>
        📊 Dataset: {rawData.length} rows | 
        {schema && `Columns: ${schema.allColumns.length} (${schema.numeric.length} numeric, ${schema.categorical.length} categorical, ${schema.date.length} date)`}
        {filteredData.length < rawData.length && ` | Filtered: ${filteredData.length} rows`}
      </div>

      {/* Filters Section */}
      {schema && <Filters schema={schema} data={rawData} onFilterChange={handleFilterChange} />}

      {/* KPI Section */}
      {schema && schema.numeric && schema.numeric.length > 0 && (
        <section className="kpi-section">
          <h2>Key Performance Indicators</h2>
          <KPISection kpis={kpis} />
        </section>
      )}

      {/* Charts Section */}
      <section className="charts-section">
        <h2>Dynamic Visualizations</h2>
        <DynamicCharts charts={charts} />
      </section>

      {/* Insights Section */}
      {insights && insights.length > 0 && (
        <section className="insights-section">
          <InsightsSection insights={insights} />
        </section>
      )}

      {/* Footer */}
      <footer style={{ padding: '20px', textAlign: 'center', color: '#888', borderTop: '1px solid #2d2d2d', marginTop: '40px', fontSize: '12px' }}>
        <p>Smart Dashboard • CSV Auto-Detection • Dynamic Schema Analysis</p>
      </footer>
    </div>
  )
}

export default App
