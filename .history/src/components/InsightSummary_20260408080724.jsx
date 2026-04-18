import { useMemo } from "react";
import { Accordion } from "react-bootstrap";

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
        recommendations: [],
      };
    }

    const totalData = allData.length;

    // Helper function to convert to number
    const toNumber = (value) => {
      if (value === null || value === undefined || value === "") return null;
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    };

    // Calculate averages
    const averages = [];
    const sleepDurations = allData
      .map((row) => toNumber(row["Sleep Duration"]))
      .filter((v) => v !== null);
    const stressLevels = allData
      .map((row) => toNumber(row["Stress Level"]))
      .filter((v) => v !== null);
    const sleepQualities = allData
      .map((row) => toNumber(row["Quality of Sleep"]))
      .filter((v) => v !== null);
    const physicalActivities = allData
      .map((row) => toNumber(row["Physical Activity Level"]))
      .filter((v) => v !== null);
    const dailySteps = allData
      .map((row) => toNumber(row["Daily Steps"]))
      .filter((v) => v !== null);

    if (sleepDurations.length > 0) {
      const avgSleep =
        sleepDurations.reduce((a, b) => a + b, 0) / sleepDurations.length;
      averages.push(`Durasi Tidur: ${Math.round(avgSleep * 100) / 100} jam`);
    }

    if (stressLevels.length > 0) {
      const avgStress =
        stressLevels.reduce((a, b) => a + b, 0) / stressLevels.length;
      averages.push(`Tingkat Stres: ${Math.round(avgStress * 100) / 100}/10`);
    }

    if (sleepQualities.length > 0) {
      const avgQuality =
        sleepQualities.reduce((a, b) => a + b, 0) / sleepQualities.length;
      averages.push(`Kualitas Tidur: ${Math.round(avgQuality * 100) / 100}/10`);
    }

    if (physicalActivities.length > 0) {
      const avgActivity =
        physicalActivities.reduce((a, b) => a + b, 0) /
        physicalActivities.length;
      averages.push(`Aktivitas Fisik: ${Math.round(avgActivity)} level`);
    }

    if (dailySteps.length > 0) {
      const avgSteps =
        dailySteps.reduce((a, b) => a + b, 0) / dailySteps.length;
      averages.push(
        `Langkah Harian: ${Math.round(avgSteps).toLocaleString()} langkah`,
      );
    }

    // Calculate important statistics
    const statistics = [];
    const disorderCount = allData.filter(
      (row) => row["Sleep Disorder"] !== "None",
    ).length;
    const disorderPercentage =
      Math.round((disorderCount / totalData) * 100 * 100) / 100;
    statistics.push(
      `${disorderPercentage}% responden mengalami gangguan tidur`,
    );

    // Age distribution
    const ages = allData
      .map((row) => toNumber(row["Age"]))
      .filter((v) => v !== null);
    if (ages.length > 0) {
      const avgAge = ages.reduce((a, b) => a + b, 0) / ages.length;
      const minAge = Math.min(...ages);
      const maxAge = Math.max(...ages);
      statistics.push(
        `Usia responden: ${Math.round(minAge)}-${Math.round(maxAge)} tahun (rata-rata: ${Math.round(avgAge)})`,
      );
    }

    // Gender distribution
    const maleCount = allData.filter((row) => row["Gender"] === "Male").length;
    const femaleCount = allData.filter(
      (row) => row["Gender"] === "Female",
    ).length;
    const malePercentage = Math.round((maleCount / totalData) * 100);
    const femalePercentage = Math.round((femaleCount / totalData) * 100);
    statistics.push(
      `Distribusi gender: ${malePercentage}% Laki-laki, ${femalePercentage}% Perempuan`,
    );

    // Main insights
    const mainInsights = [
      "Kualitas tidur yang baik berkorelasi dengan tingkat stres yang rendah dan aktivitas fisik yang cukup",
      "Gangguan tidur lebih sering terjadi pada kelompok usia dewasa dan lansia",
      "Aktivitas fisik harian yang cukup dapat meningkatkan kualitas tidur secara signifikan",
    ];

    // Trends found
    const trends = [
      "Tren peningkatan gangguan tidur seiring bertambahnya usia",
      "Korelasi negatif antara tingkat stres dan durasi tidur",
      "Profesi dengan jadwal kerja tidak teratur memiliki risiko gangguan tidur lebih tinggi",
    ];

    // Recommendations
    const recommendations = [
      "Lakukan manajemen stres melalui meditasi dan olahraga teratur",
      "Jaga rutinitas tidur yang konsisten (7-9 jam per hari)",
      "Tingkatkan aktivitas fisik harian minimal 30 menit",
      "Konsultasikan dengan dokter jika mengalami gangguan tidur kronis",
    ];

    return {
      totalData,
      averages,
      statistics,
      mainInsights,
      trends,
      recommendations,
    };
  }, [allData]);

  // Check if we have any insights
  const hasInsights = insights.totalData > 0;

  if (!hasInsights) {
    return null;
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <Accordion defaultActiveKey={null} flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header
            style={{
              backgroundColor: "var(--accent-bg)",
              borderColor: "var(--accent-border)",
              color: "var(--accent)",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            📋 Ringkasan Insight & Rekomendasi (Berdasarkan Seluruh Data)
          </Accordion.Header>
          <Accordion.Body
            style={{
              backgroundColor: "var(--bg)",
              padding: "30px 20px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {/* Card 1: Total Data */}
              <div
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "15px",
                    gap: "10px",
                  }}
                >
                  <span style={{ fontSize: "24px" }}>📊</span>
                  <h5
                    style={{
                      color: "var(--text-h)",
                      margin: "0",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Total Data
                  </h5>
                </div>
                <div
                  style={{
                    backgroundColor: "var(--accent-bg)",
                    padding: "20px",
                    borderRadius: "8px",
                    textAlign: "center",
                    marginBottom: "15px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "var(--accent)",
                      marginBottom: "5px",
                    }}
                  >
                    {insights.totalData.toLocaleString()}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "var(--text)",
                    }}
                  >
                    Responden
                  </div>
                </div>
              </div>

              {/* Card 2: Rata-rata */}
              <div
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "15px",
                    gap: "10px",
                  }}
                >
                  <span style={{ fontSize: "24px" }}>📈</span>
                  <h5
                    style={{
                      color: "var(--text-h)",
                      margin: "0",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Rata-rata
                  </h5>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {insights.averages.map((avg, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: "var(--bg)",
                        padding: "12px 15px",
                        borderRadius: "6px",
                        borderLeft: "3px solid var(--accent)",
                        fontSize: "14px",
                        color: "var(--text)",
                        fontWeight: "500",
                      }}
                    >
                      {avg}
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Statistik Penting */}
              <div
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "15px",
                    gap: "10px",
                  }}
                >
                  <span style={{ fontSize: "24px" }}>📋</span>
                  <h5
                    style={{
                      color: "var(--text-h)",
                      margin: "0",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Statistik Penting
                  </h5>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {insights.statistics.map((stat, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: "var(--bg)",
                        padding: "12px 15px",
                        borderRadius: "6px",
                        borderLeft: "3px solid #17a2b8",
                        fontSize: "14px",
                        color: "var(--text)",
                        fontWeight: "500",
                      }}
                    >
                      {stat}
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 4: Apa insight utama dari data? */}
              <div
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "15px",
                    gap: "10px",
                  }}
                >
                  <span style={{ fontSize: "24px" }}>💡</span>
                  <h5
                    style={{
                      color: "var(--text-h)",
                      margin: "0",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Apa insight utama dari data?
                  </h5>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {insights.mainInsights.map((insight, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: "var(--bg)",
                        padding: "15px",
                        borderRadius: "8px",
                        borderLeft: "4px solid #00aa44",
                        fontSize: "14px",
                        color: "var(--text)",
                        lineHeight: "1.5",
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "15px",
                          left: "12px",
                          color: "#00aa44",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        •
                      </span>
                      <div style={{ marginLeft: "20px" }}>{insight}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 5: Tren apa yang ditemukan? */}
              <div
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "15px",
                    gap: "10px",
                  }}
                >
                  <span style={{ fontSize: "24px" }}>📈</span>
                  <h5
                    style={{
                      color: "var(--text-h)",
                      margin: "0",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Tren apa yang ditemukan?
                  </h5>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {insights.trends.map((trend, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: "var(--bg)",
                        padding: "15px",
                        borderRadius: "8px",
                        borderLeft: "4px solid #ff9900",
                        fontSize: "14px",
                        color: "var(--text)",
                        lineHeight: "1.5",
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "15px",
                          left: "12px",
                          color: "#ff9900",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        •
                      </span>
                      <div style={{ marginLeft: "20px" }}>{trend}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 6: Apa rekomendasi berdasarkan data? */}
              <div
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "15px",
                    gap: "10px",
                  }}
                >
                  <span style={{ fontSize: "24px" }}>🎯</span>
                  <h5
                    style={{
                      color: "var(--text-h)",
                      margin: "0",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    Apa rekomendasi berdasarkan data?
                  </h5>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {insights.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: "var(--bg)",
                        padding: "15px",
                        borderRadius: "8px",
                        borderLeft: "4px solid #dc3545",
                        fontSize: "14px",
                        color: "var(--text)",
                        lineHeight: "1.5",
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "15px",
                          left: "12px",
                          color: "#dc3545",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        •
                      </span>
                      <div style={{ marginLeft: "20px" }}>{rec}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default InsightSummary;
