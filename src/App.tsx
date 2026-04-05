import { useState } from 'react'
import './App.css'

interface DataPoint {
  label: string
  value: number
}

interface FilterType {
  name: string
  active: boolean
}

function App() {
  // Sample data for visualization
  const [monthlyData] = useState<DataPoint[]>([
    { label: 'Jan', value: 4000 },
    { label: 'Feb', value: 3000 },
    { label: 'Mar', value: 5200 },
    { label: 'Apr', value: 4278 },
    { label: 'May', value: 5100 },
    { label: 'Jun', value: 6800 },
  ])

  const [categoryData] = useState<DataPoint[]>([
    { label: 'Sales', value: 65 },
    { label: 'Marketing', value: 45 },
    { label: 'Support', value: 52 },
    { label: 'Development', value: 78 },
    { label: 'Operations', value: 38 },
  ])

  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [hoveredBar, setHoveredBar] = useState<string | null>(null)

  const maxValue = Math.max(...monthlyData.map(d => d.value))
  const maxCategory = Math.max(...categoryData.map(d => d.value))

  const stats = [
    { label: 'Total Revenue', value: '$125,400', change: '+12.5%', color: '#3b82f6' },
    { label: 'Users', value: '8,543', change: '+5.2%', color: '#10b981' },
    { label: 'Conversions', value: '2,345', change: '+8.1%', color: '#f59e0b' },
    { label: 'Engagement', value: '78.5%', change: '+3.4%', color: '#8b5cf6' },
  ]

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard Analytics</h1>
          <p>Real-time data visualization and insights</p>
        </div>
        <div className="header-controls">
          <button className="btn btn-primary">Export</button>
          <button className="btn btn-secondary">Settings</button>
        </div>
      </header>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          {['all', 'week', 'month', 'year'].map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <section className="stats-section">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card" style={{ borderTopColor: stat.color }}>
            <div className="stat-header">
              <h3>{stat.label}</h3>
              <span className="stat-change positive">{stat.change}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </section>

      {/* Charts Section */}
      <section className="charts-section">
        {/* Monthly Revenue Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h2>Monthly Revenue</h2>
            <span className="chart-subtitle">Last 6 months</span>
          </div>
          <div className="bar-chart">
            <div className="chart-bars">
              {monthlyData.map((item) => {
                const height = (item.value / maxValue) * 100
                return (
                  <div
                    key={item.label}
                    className="bar-container"
                    onMouseEnter={() => setHoveredBar(item.label)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <div
                      className={`bar ${hoveredBar === item.label ? 'hovered' : ''}`}
                      style={{ height: `${height}%` }}
                    >
                      {hoveredBar === item.label && (
                        <span className="bar-value">${item.value}</span>
                      )}
                    </div>
                    <span className="bar-label">{item.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Category Performance Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h2>Category Performance</h2>
            <span className="chart-subtitle">Comparative metrics</span>
          </div>
          <div className="horizontal-chart">
            {categoryData.map((item, idx) => {
              const width = (item.value / maxCategory) * 100
              const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']
              return (
                <div key={item.label} className="horizontal-bar-container">
                  <span className="h-label">{item.label}</span>
                  <div className="h-bar-wrapper">
                    <div
                      className="h-bar"
                      style={{ width: `${width}%`, backgroundColor: colors[idx] }}
                    >
                      <span className="h-value">{item.value}%</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pie Chart Section */}
      <section className="pie-section">
        <div className="chart-card">
          <div className="chart-header">
            <h2>Distribution</h2>
            <span className="chart-subtitle">Market segment breakdown</span>
          </div>
          <div className="pie-chart">
            <svg viewBox="0 0 100 100">
              {/* Simplified pie representation using circles */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="20" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#10b981" strokeWidth="15" />
              <circle cx="50" cy="50" r="15" fill="#f59e0b" />
            </svg>
            <div className="pie-legend">
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#3b82f6' }}></span>
                <span>Segment A - 40%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#10b981' }}></span>
                <span>Segment B - 35%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#f59e0b' }}></span>
                <span>Segment C - 25%</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
