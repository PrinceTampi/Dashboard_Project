import { useMemo } from 'react';

/**
 * Insights Section Component
 * 
 * Displays auto-generated insights from data:
 * - Trends (increasing/decreasing)
 * - Top performers (highest values)
 * - Anomalies (outliers)
 * - Data quality metrics
 * 
 * Props:
 * - insights: Array of insights from generateInsights()
 */
const InsightsSection = ({ insights }) => {
  const memoizedInsights = useMemo(() => insights, [insights]);

  if (!memoizedInsights || memoizedInsights.length === 0) {
    return (
      <div className="insights-container">
        <h2>Insights</h2>
        <p style={{ color: '#888', textAlign: 'center' }}>
          No insights available yet. Add more data to generate insights.
        </p>
      </div>
    );
  }

  return (
    <div className="insights-container">
      <h2>Insights</h2>
      <div className="insights-grid">
        {memoizedInsights.map((insight, idx) => {
          let bgColor = '#2d3436';
          let borderColor = '#636e72';

          switch (insight.severity) {
            case 'success':
              bgColor = '#00b89438';
              borderColor = '#00b894';
              break;
            case 'warning':
              bgColor = '#f0ad4e38';
              borderColor = '#f0ad4e';
              break;
            case 'danger':
              bgColor = '#d9534f38';
              borderColor = '#d9534f';
              break;
            case 'info':
            default:
              bgColor = '#5dade238';
              borderColor = '#5dade2';
              break;
          }

          return (
            <div
              key={idx}
              className="insight-card"
              style={{
                backgroundColor: bgColor,
                borderLeft: `4px solid ${borderColor}`
              }}
            >
              <div className="insight-icon">{insight.icon}</div>
              <div className="insight-content">
                <div className="insight-type">{insight.type}</div>
                <div className="insight-message">{insight.message}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InsightsSection;
