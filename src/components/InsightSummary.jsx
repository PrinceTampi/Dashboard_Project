import { useMemo } from 'react';
import { Accordion } from 'react-bootstrap';
import { generateStaticInsights } from '../utils/generateStaticInsights';

/**
 * Insight Summary Component - Sleep Health Dashboard
 * 
 * Displays static insights from the ENTIRE (unfiltered) dataset.
 * Content does NOT change when filters are applied.
 * Uses React Bootstrap Accordion for expandable/collapsible layout.
 * 
 * Props:
 * - allData: The complete unfiltered dataset
 */
const InsightSummary = ({ allData }) => {
  const insights = useMemo(() => {
    if (!allData || allData.length === 0) {
      return {
        mainInsights: [],
        recommendations: [],
        funFacts: []
      };
    }
    return generateStaticInsights(allData);
  }, [allData]);

  // Check if we have any insights
  const hasInsights =
    insights.mainInsights.length > 0 ||
    insights.recommendations.length > 0 ||
    insights.funFacts.length > 0;

  if (!hasInsights) {
    return null;
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <Accordion defaultActiveKey={null} flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header style={{
            backgroundColor: 'var(--accent-bg)',
            borderColor: 'var(--accent-border)',
            color: 'var(--accent)',
            fontWeight: '600',
            fontSize: '16px'
          }}>
            📋 Ringkasan Insight & Rekomendasi (Berdasarkan Seluruh Data)
          </Accordion.Header>
          <Accordion.Body style={{
            backgroundColor: 'var(--bg)',
            padding: '30px 20px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {/* Column 1: Main Insights */}
              <div>
                <h4 style={{
                  color: 'var(--text-h)',
                  marginBottom: '15px',
                  paddingBottom: '10px',
                  borderBottom: '2px solid var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>💡</span>
                  Insight Utama
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  margin: '0'
                }}>
                  {insights.mainInsights.map((insight, idx) => (
                    <li
                      key={idx}
                      style={{
                        marginBottom: '15px',
                        paddingLeft: '25px',
                        position: 'relative',
                        lineHeight: '1.6',
                        color: 'var(--text)',
                        fontSize: '14px'
                      }}
                    >
                      <span style={{
                        position: 'absolute',
                        left: '0',
                        color: 'var(--accent)',
                        fontWeight: 'bold'
                      }}>
                        •
                      </span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Recommendations */}
              <div>
                <h4 style={{
                  color: 'var(--text-h)',
                  marginBottom: '15px',
                  paddingBottom: '10px',
                  borderBottom: '2px solid #00aa44',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>🎯</span>
                  Rekomendasi
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  margin: '0'
                }}>
                  {insights.recommendations.map((rec, idx) => (
                    <li
                      key={idx}
                      style={{
                        marginBottom: '15px',
                        paddingLeft: '0',
                        lineHeight: '1.6',
                        color: 'var(--text)',
                        fontSize: '14px'
                      }}
                    >
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Fun Facts */}
              <div>
                <h4 style={{
                  color: 'var(--text-h)',
                  marginBottom: '15px',
                  paddingBottom: '10px',
                  borderBottom: '2px solid #ff9900',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>🌟</span>
                  Fakta Menarik
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  margin: '0'
                }}>
                  {insights.funFacts.map((fact, idx) => (
                    <li
                      key={idx}
                      style={{
                        marginBottom: '15px',
                        paddingLeft: '0',
                        lineHeight: '1.6',
                        color: 'var(--text)',
                        fontSize: '14px'
                      }}
                    >
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default InsightSummary;
