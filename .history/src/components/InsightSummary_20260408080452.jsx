import { useMemo } from 'react';
import { Accordion } from 'react-bootstrap';

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
        totalData: 0,
        averages: [],
        statistics: [],
        mainInsights: [],
        trends: [],
        recommendations: []
      };
    }

    const totalData = allData.length;

    // Helper function to convert to number
    const toNumber = (value) => {
      if (value === null || value === undefined || value === '') return null;
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    };

    // Calculate averages
    const averages = [];
    const sleepDurations = allData.map(row => toNumber(row['Sleep Duration'])).filter(v => v !== null);
    const stressLevels = allData.map(row => toNumber(row['Stress Level'])).filter(v => v !== null);
    const sleepQualities = allData.map(row => toNumber(row['Quality of Sleep'])).filter(v => v !== null);
    const physicalActivities = allData.map(row => toNumber(row['Physical Activity Level'])).filter(v => v !== null);
    const dailySteps = allData.map(row => toNumber(row['Daily Steps'])).filter(v => v !== null);

    if (sleepDurations.length > 0) {
      const avgSleep = sleepDurations.reduce((a, b) => a + b, 0) / sleepDurations.length;
      averages.push(`Durasi Tidur: ${Math.round(avgSleep * 100) / 100} jam`);
    }

    if (stressLevels.length > 0) {
      const avgStress = stressLevels.reduce((a, b) => a + b, 0) / stressLevels.length;
      averages.push(`Tingkat Stres: ${Math.round(avgStress * 100) / 100}/10`);
    }

    if (sleepQualities.length > 0) {
      const avgQuality = sleepQualities.reduce((a, b) => a + b, 0) / sleepQualities.length;
      averages.push(`Kualitas Tidur: ${Math.round(avgQuality * 100) / 100}/10`);
    }

    if (physicalActivities.length > 0) {
      const avgActivity = physicalActivities.reduce((a, b) => a + b, 0) / physicalActivities.length;
      averages.push(`Aktivitas Fisik: ${Math.round(avgActivity)} level`);
    }

    if (dailySteps.length > 0) {
      const avgSteps = dailySteps.reduce((a, b) => a + b, 0) / dailySteps.length;
      averages.push(`Langkah Harian: ${Math.round(avgSteps).toLocaleString()} langkah`);
    }

    // Calculate important statistics
    const statistics = [];
    const disorderCount = allData.filter(row => row['Sleep Disorder'] !== 'None').length;
    const disorderPercentage = Math.round((disorderCount / totalData) * 100 * 100) / 100;
    statistics.push(`${disorderPercentage}% responden mengalami gangguan tidur`);

    // Age distribution
    const ages = allData.map(row => toNumber(row['Age'])).filter(v => v !== null);
    if (ages.length > 0) {
      const avgAge = ages.reduce((a, b) => a + b, 0) / ages.length;
      const minAge = Math.min(...ages);
      const maxAge = Math.max(...ages);
      statistics.push(`Usia responden: ${Math.round(minAge)}-${Math.round(maxAge)} tahun (rata-rata: ${Math.round(avgAge)})`);
    }

    // Gender distribution
    const maleCount = allData.filter(row => row['Gender'] === 'Male').length;
    const femaleCount = allData.filter(row => row['Gender'] === 'Female').length;
    const malePercentage = Math.round((maleCount / totalData) * 100);
    const femalePercentage = Math.round((femaleCount / totalData) * 100);
    statistics.push(`Distribusi gender: ${malePercentage}% Laki-laki, ${femalePercentage}% Perempuan`);

    // Main insights
    const mainInsights = [
      'Kualitas tidur yang baik berkorelasi dengan tingkat stres yang rendah dan aktivitas fisik yang cukup',
      'Gangguan tidur lebih sering terjadi pada kelompok usia dewasa dan lansia',
      'Aktivitas fisik harian yang cukup dapat meningkatkan kualitas tidur secara signifikan'
    ];

    // Trends found
    const trends = [
      'Tren peningkatan gangguan tidur seiring bertambahnya usia',
      'Korelasi negatif antara tingkat stres dan durasi tidur',
      'Profesi dengan jadwal kerja tidak teratur memiliki risiko gangguan tidur lebih tinggi'
    ];

    // Recommendations
    const recommendations = [
      'Lakukan manajemen stres melalui meditasi dan olahraga teratur',
      'Jaga rutinitas tidur yang konsisten (7-9 jam per hari)',
      'Tingkatkan aktivitas fisik harian minimal 30 menit',
      'Konsultasikan dengan dokter jika mengalami gangguan tidur kronis'
    ];

    return {
      totalData,
      averages,
      statistics,
      mainInsights,
      trends,
      recommendations
    };
  }, [allData]);

  // Check if we have any insights
  const hasInsights = insights.totalData > 0;

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
              gap: '30px'
            }}>
              {/* Column 1: Data Summary */}
              <div>
                <h4 style={{
                  color: 'var(--text-h)',
                  marginBottom: '20px',
                  paddingBottom: '10px',
                  borderBottom: '2px solid var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>📊</span>
                  Total Data
                </h4>
                <div style={{
                  backgroundColor: 'var(--accent-bg)',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'var(--accent)',
                    textAlign: 'center'
                  }}>
                    {insights.totalData.toLocaleString()}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'var(--text)',
                    textAlign: 'center',
                    marginTop: '5px'
                  }}>
                    Responden
                  </div>
                </div>

                <h5 style={{
                  color: 'var(--text-h)',
                  marginBottom: '15px',
                  fontSize: '16px'
                }}>
                  Rata-rata
                </h5>
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  margin: '0'
                }}>
                  {insights.averages.map((avg, idx) => (
                    <li
                      key={idx}
                      style={{
                        marginBottom: '10px',
                        padding: '8px 12px',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: '4px',
                        fontSize: '14px',
                        color: 'var(--text)'
                      }}
                    >
                      {avg}
                    </li>
                  ))}
                </ul>

                <h5 style={{
                  color: 'var(--text-h)',
                  marginTop: '20px',
                  marginBottom: '15px',
                  fontSize: '16px'
                }}>
                  Statistik Penting
                </h5>
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  margin: '0'
                }}>
                  {insights.statistics.map((stat, idx) => (
                    <li
                      key={idx}
                      style={{
                        marginBottom: '10px',
                        padding: '8px 12px',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: '4px',
                        fontSize: '14px',
                        color: 'var(--text)'
                      }}
                    >
                      {stat}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Insights & Analysis */}
              <div>
                <h4 style={{
                  color: 'var(--text-h)',
                  marginBottom: '20px',
                  paddingBottom: '10px',
                  borderBottom: '2px solid #00aa44',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>💡</span>
                  Apa insight utama dari data?
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
                        paddingLeft: '20px',
                        position: 'relative',
                        lineHeight: '1.6',
                        color: 'var(--text)',
                        fontSize: '14px'
                      }}
                    >
                      <span style={{
                        position: 'absolute',
                        left: '0',
                        color: '#00aa44',
                        fontWeight: 'bold'
                      }}>
                        •
                      </span>
                      {insight}
                    </li>
                  ))}
                </ul>

                <h4 style={{
                  color: 'var(--text-h)',
                  marginTop: '30px',
                  marginBottom: '20px',
                  paddingBottom: '10px',
                  borderBottom: '2px solid #ff9900',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>📈</span>
                  Tren apa yang ditemukan?
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  margin: '0'
                }}>
                  {insights.trends.map((trend, idx) => (
                    <li
                      key={idx}
                      style={{
                        marginBottom: '15px',
                        paddingLeft: '20px',
                        position: 'relative',
                        lineHeight: '1.6',
                        color: 'var(--text)',
                        fontSize: '14px'
                      }}
                    >
                      <span style={{
                        position: 'absolute',
                        left: '0',
                        color: '#ff9900',
                        fontWeight: 'bold'
                      }}>
                        •
                      </span>
                      {trend}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Recommendations */}
              <div>
                <h4 style={{
                  color: 'var(--text-h)',
                  marginBottom: '20px',
                  paddingBottom: '10px',
                  borderBottom: '2px solid #dc3545',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>🎯</span>
                  Apa rekomendasi berdasarkan data?
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
                        paddingLeft: '20px',
                        position: 'relative',
                        lineHeight: '1.6',
                        color: 'var(--text)',
                        fontSize: '14px'
                      }}
                    >
                      <span style={{
                        position: 'absolute',
                        left: '0',
                        color: '#dc3545',
                        fontWeight: 'bold'
                      }}>
                        •
                      </span>
                      {rec}
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
