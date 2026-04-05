import { useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

/**
 * Dynamic Charts Component
 * 
 * Renders charts based on type:
 * - LineChart: time-series data (date + numeric)
 * - BarChart: categorical data (category + numeric)
 * - PieChart: distribution (categorical)
 * - Table: raw data (fallback)
 * 
 * Props:
 * - charts: Array of chart configs from generateCharts()
 */
const DynamicCharts = ({ charts }) => {
  const memoizedCharts = useMemo(() => charts, [charts]);

  if (!memoizedCharts || memoizedCharts.length === 0) {
    return (
      <div className="charts-container">
        <p style={{ color: '#888', textAlign: 'center' }}>No data available for charts</p>
      </div>
    );
  }

  const renderChart = (chartConfig) => {
    if (!chartConfig.canRender && chartConfig.type !== 'table') {
      return null;
    }

    switch (chartConfig.type) {
      case 'line':
        return (
          <div key={`line-${chartConfig.title}`} className="chart-card">
            <h3>{chartConfig.title}</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartConfig.data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={chartConfig.xAxis.dataKey} angle={-45} textAnchor="end" height={100} />
                <YAxis label={{ value: chartConfig.yAxis.label, angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                {chartConfig.lines.map((line, idx) => (
                  <Line
                    key={idx}
                    type="monotone"
                    dataKey={line.dataKey}
                    stroke={line.stroke}
                    dot={false}
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 'bar':
        return (
          <div key={`bar-${chartConfig.title}`} className="chart-card">
            <h3>{chartConfig.title}</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartConfig.data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={chartConfig.xAxis.dataKey} angle={-45} textAnchor="end" />
                <YAxis label={{ value: chartConfig.yAxis.label, angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                {chartConfig.bars.map((bar, idx) => (
                  <Bar key={idx} dataKey={bar.dataKey} fill={bar.fill} isAnimationActive={false} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'pie':
        return (
          <div key={`pie-${chartConfig.title}`} className="chart-card">
            <h3>{chartConfig.title}</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
                <Pie
                  data={chartConfig.data}
                  dataKey={chartConfig.dataKey}
                  nameKey={chartConfig.nameKey}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                  isAnimationActive={false}
                >
                  {chartConfig.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      case 'area':
        return (
          <div key={`area-${chartConfig.title}`} className="chart-card">
            <h3>{chartConfig.title}</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartConfig.data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0056b3" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0056b3" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={chartConfig.xAxis.dataKey} angle={-45} textAnchor="end" height={100} />
                <YAxis label={{ value: chartConfig.yAxis.label, angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                {chartConfig.areas.map((area, idx) => (
                  <Area
                    key={idx}
                    type="monotone"
                    dataKey={area.dataKey}
                    stroke={area.stroke}
                    fillOpacity={1}
                    fill="url(#colorArea)"
                    isAnimationActive={false}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );

      case 'scatter':
        return (
          <div key={`scatter-${chartConfig.title}`} className="chart-card">
            <h3>{chartConfig.title}</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={chartConfig.xAxis.dataKey} label={{ value: chartConfig.xAxis.label, position: 'insideBottomRight', offset: -5 }} />
                <YAxis dataKey={chartConfig.yAxis.dataKey} label={{ value: chartConfig.yAxis.label, angle: -90, position: 'insideLeft' }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={chartConfig.data} fill="#0056b3" isAnimationActive={false} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        );

      case 'heatmap':
        return (
          <div key={`heatmap-${chartConfig.title}`} className="chart-card">
            <h3>{chartConfig.title}</h3>
            <div style={{ overflowX: 'auto', padding: '20px 0' }}>
              <table style={{ borderCollapse: 'collapse', minWidth: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #dee2e6', padding: '8px', backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                      {chartConfig.dateField}
                    </th>
                    {chartConfig.categories.map(cat => (
                      <th key={cat} style={{ border: '1px solid #dee2e6', padding: '8px', backgroundColor: '#f8f9fa', fontWeight: 'bold', textAlign: 'center' }}>
                        {cat}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chartConfig.data.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ border: '1px solid #dee2e6', padding: '8px', backgroundColor: '#f8f9fa', fontWeight: '500' }}>
                        {row[chartConfig.dateField]}
                      </td>
                      {chartConfig.categories.map(cat => {
                        const value = row[cat] || 0;
                        const maxValue = Math.max(...chartConfig.data.flatMap(r => chartConfig.categories.map(c => r[c] || 0)));
                        const intensity = maxValue > 0 ? value / maxValue : 0;
                        const color = `rgba(0, 86, 179, ${intensity * 0.8})`;
                        return (
                          <td key={`${idx}-${cat}`} style={{ border: '1px solid #dee2e6', padding: '8px', backgroundColor: color, textAlign: 'center', color: intensity > 0.5 ? 'white' : '#212529', fontWeight: '500' }}>
                            {Math.round(value * 100) / 100}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'boxplot':
        return (
          <div key={`boxplot-${chartConfig.title}`} className="chart-card">
            <h3>{chartConfig.title}</h3>
            <div style={{ padding: '20px' }}>
              {chartConfig.data.map((stat, idx) => (
                <div key={idx} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                    <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                      <div style={{ fontSize: '12px', color: '#6c757d', fontWeight: '600', marginBottom: '4px' }}>MIN</div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#0056b3' }}>{Math.round(stat.min * 100) / 100}</div>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                      <div style={{ fontSize: '12px', color: '#6c757d', fontWeight: '600', marginBottom: '4px' }}>Q1</div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#004ec8' }}>{Math.round(stat.q1 * 100) / 100}</div>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                      <div style={{ fontSize: '12px', color: '#6c757d', fontWeight: '600', marginBottom: '4px' }}>MEDIAN</div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#003d99' }}>{Math.round(stat.median * 100) / 100}</div>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                      <div style={{ fontSize: '12px', color: '#6c757d', fontWeight: '600', marginBottom: '4px' }}>Q3</div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#004ec8' }}>{Math.round(stat.q3 * 100) / 100}</div>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                      <div style={{ fontSize: '12px', color: '#6c757d', fontWeight: '600', marginBottom: '4px' }}>MAX</div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#0056b3' }}>{Math.round(stat.max * 100) / 100}</div>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                      <div style={{ fontSize: '12px', color: '#6c757d', fontWeight: '600', marginBottom: '4px' }}>MEAN</div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#0056b3' }}>{stat.mean}</div>
                    </div>
                  </div>
                  {stat.outliers && stat.outliers.length > 0 && (
                    <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#fff3cd', borderRadius: '4px', border: '1px solid #ffeeba' }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#856404', marginBottom: '8px' }}>
                        OUTLIERS ({stat.outlierCount} found)
                      </div>
                      <div style={{ fontSize: '13px', color: '#856404' }}>
                        {stat.outliers.map((o, oi) => Math.round(o * 100) / 100).join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'table':
        return (
          <div key="table" className="chart-card">
            <h3>{chartConfig.title}</h3>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    {Object.keys(chartConfig.data[0] || {}).map(col => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chartConfig.data.slice(0, 20).map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((val, colIdx) => (
                        <td key={colIdx}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {chartConfig.data.length > 20 && (
                <p style={{ color: '#888', fontSize: '12px', marginTop: '10px' }}>
                  Showing 20 of {chartConfig.data.length} rows
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="charts-container">
      {memoizedCharts.map(chartConfig => renderChart(chartConfig))}
    </div>
  );
};

export default DynamicCharts;
