import { useMemo } from 'react';
import { formatKPIValue } from '../utils/generateKPIs';

/**
 * KPI Section Component
 * 
 * Displays dynamic KPI cards:
 * - Total (sum)
 * - Average (mean)
 * - Maximum (max)
 * - Minimum (min)
 * 
 * Props:
 * - kpis: KPI object from generateKPIs()
 */
const KPISection = ({ kpis }) => {
  const memoizedKpis = useMemo(() => kpis, [kpis]);

  if (!memoizedKpis || Object.keys(memoizedKpis).length === 0) {
    return (
      <div className="kpi-container">
        <p style={{ color: '#888', textAlign: 'center' }}>No numeric data available</p>
      </div>
    );
  }

  return (
    <div className="kpi-container">
      {Object.entries(memoizedKpis).map(([fieldName, kpiData]) => (
        <div key={fieldName}>
          <h3>{fieldName}</h3>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-value">{formatKPIValue(kpiData.total)}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{formatKPIValue(kpiData.avg)}</div>
              <div className="stat-label">Average</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{formatKPIValue(kpiData.max)}</div>
              <div className="stat-label">Maximum</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{formatKPIValue(kpiData.min)}</div>
              <div className="stat-label">Minimum</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPISection;
