import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const exportDashboardToPDF = async (
  fileName = "Sleep_Health_Report.pdf",
) => {
  try {
    // Show a temporary loading message
    const loadingDiv = document.createElement("div");
    loadingDiv.innerHTML = "Generating PDF Report...";
    loadingDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 20px 40px;
      border-radius: 8px;
      z-index: 9999;
      font-size: 18px;
    `;
    document.body.appendChild(loadingDiv);

    // Create PDF with proper structure
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let yPosition = margin;

    // Helper function to add text with word wrap
    const addWrappedText = (
      text,
      x,
      y,
      maxWidth,
      fontSize = 11,
      fontWeight = "normal",
    ) => {
      pdf.setFontSize(fontSize);
      pdf.setFont("helvetica", fontWeight);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return y + lines.length * fontSize * 0.4;
    };

    // Helper function to add section header
    const addSectionHeader = (title, icon, y) => {
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(40, 40, 40);
      pdf.text(`${icon} ${title}`, margin, y);
      return y + 8;
    };

    // Helper function to check if we need a new page
    const checkNewPage = (requiredHeight) => {
      if (yPosition + requiredHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Title Page
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(33, 37, 41);
    pdf.text("🌙 Sleep Health & Lifestyle Dashboard", margin, yPosition + 20);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      "Analisis Komprehensif Kesehatan Tidur, Stress, dan Aktivitas Fisik",
      margin,
      yPosition + 35,
    );

    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    pdf.text(
      `Created by: AIKO HANAKO LASUT & PRINCE AZARYA TIMOTHY TAMPI`,
      margin,
      yPosition + 50,
    );
    pdf.text(
      `Generated on: ${new Date().toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      margin,
      yPosition + 60,
    );

    // Add new page for content
    pdf.addPage();
    yPosition = margin;

    // Extract data from the dashboard
    const extractDashboardData = () => {
      const data = {};

      // Get dataset info
      const datasetInfo = document.querySelector(".dashboard");
      if (datasetInfo) {
        const datasetText = datasetInfo.textContent || "";
        const datasetMatch = datasetText.match(/Dataset: (\d+) responden/);
        if (datasetMatch) {
          data.totalRespondents = datasetMatch[1];
        }
      }

      // Get KPI data
      const kpis = [];
      const kpiElements = document.querySelectorAll(
        '.kpi-card, [class*="kpi"]',
      );
      kpiElements.forEach((kpi) => {
        const text = kpi.textContent || "";
        if (
          text.includes("Durasi Tidur") ||
          text.includes("Kualitas Tidur") ||
          text.includes("Tingkat Stres") ||
          text.includes("Langkah Harian") ||
          text.includes("Detak Jantung") ||
          text.includes("Gangguan Tidur")
        ) {
          kpis.push(text.trim());
        }
      });

      // If no KPIs found, try to get from the actual KPI section
      if (kpis.length === 0) {
        const kpiSection = document.querySelector(
          '[class*="KPI"], [class*="kpi"]',
        );
        if (kpiSection) {
          const kpiItems = kpiSection.querySelectorAll("*");
          kpiItems.forEach((item) => {
            const text = item.textContent || "";
            if (
              text.length > 10 &&
              text.length < 100 &&
              (text.includes("jam") ||
                text.includes("/10") ||
                text.includes("bpm") ||
                text.includes("langkah") ||
                text.includes("%"))
            ) {
              kpis.push(text.trim());
            }
          });
        }
      }

      data.kpis = kpis;

      // Get insights data by expanding accordions temporarily
      const accordions = document.querySelectorAll(".accordion-item");
      const insights = {
        totalData: "",
        averages: [],
        statistics: [],
        mainInsights: [],
        trends: [],
        recommendations: [],
      };

      accordions.forEach((accordion) => {
        const header = accordion.querySelector(".accordion-header button");
        const body = accordion.querySelector(".accordion-collapse");

        if (header && body && !body.classList.contains("show")) {
          // Temporarily expand
          body.classList.add("show");
          body.style.display = "block";
        }
      });

      // Extract data after expansion
      setTimeout(() => {
        // Total Data
        const totalDataCard = document.querySelector(".accordion-body");
        if (totalDataCard) {
          const totalDataText = totalDataCard.textContent || "";
          const totalMatch = totalDataText.match(/(\d+(?:,\d+)*)\s*Responden/i);
          if (totalMatch) {
            insights.totalData = totalMatch[1];
          }
        }

        // Averages
        const avgElements = document.querySelectorAll(
          '.accordion-body [style*="border-left: 3px solid"]',
        );
        avgElements.forEach((el) => {
          const text = el.textContent?.trim() || "";
          if (
            text.includes("jam") ||
            text.includes("/10") ||
            text.includes("level") ||
            text.includes("langkah")
          ) {
            insights.averages.push(text);
          }
        });

        // Statistics
        const statElements = document.querySelectorAll(
          '.accordion-body [style*="border-left: 3px solid #17a2b8"]',
        );
        statElements.forEach((el) => {
          const text = el.textContent?.trim() || "";
          if (
            text.includes("%") ||
            text.includes("tahun") ||
            text.includes("Laki-laki")
          ) {
            insights.statistics.push(text);
          }
        });

        // Main Insights
        const insightElements = document.querySelectorAll(
          '.accordion-body [style*="border-left: 4px solid #00aa44"]',
        );
        insightElements.forEach((el) => {
          const text = el.textContent?.trim() || "";
          if (
            text.length > 20 &&
            !text.includes("jam") &&
            !text.includes("/10")
          ) {
            insights.mainInsights.push(text);
          }
        });

        // Trends
        const trendElements = document.querySelectorAll(
          '.accordion-body [style*="border-left: 4px solid #ff9900"]',
        );
        trendElements.forEach((el) => {
          const text = el.textContent?.trim() || "";
          if (text.length > 20) {
            insights.trends.push(text);
          }
        });

        // Recommendations
        const recElements = document.querySelectorAll(
          '.accordion-body [style*="border-left: 4px solid #dc3545"]',
        );
        recElements.forEach((el) => {
          const text = el.textContent?.trim() || "";
          if (text.length > 20) {
            insights.recommendations.push(text);
          }
        });

        // Collapse accordions back
        accordions.forEach((accordion) => {
          const body = accordion.querySelector(".accordion-collapse");
          if (body && body.classList.contains("show")) {
            body.classList.remove("show");
            body.style.display = "none";
          }
        });
      }, 100);

      return { data, insights };
    };

    // Extract data
    const { data, insights } = extractDashboardData();

    // Wait a bit for data extraction
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Add Executive Summary
    yPosition = addSectionHeader("Executive Summary", "📊", yPosition + 10);
    yPosition = addWrappedText(
      `Laporan ini berisi analisis komprehensif data kesehatan tidur dari ${data.totalRespondents || "374"} responden. Analisis mencakup pola tidur, tingkat stres, aktivitas fisik, dan faktor-faktor yang mempengaruhinya.`,
      margin,
      yPosition,
      contentWidth,
    );

    yPosition += 10;

    // Add KPI Section
    checkNewPage(60);
    yPosition = addSectionHeader("Key Performance Indicators", "📈", yPosition);
    yPosition += 5;

    if (data.kpis && data.kpis.length > 0) {
      data.kpis.forEach((kpi, index) => {
        if (kpi.length > 10) {
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(60, 60, 60);
          pdf.text(`• ${kpi}`, margin + 5, yPosition);
          yPosition += 6;
        }
      });
    } else {
      // Default KPIs if not found
      const defaultKPIs = [
        "Rata-rata Durasi Tidur: 7.13 jam",
        "Rata-rata Kualitas Tidur: 7.31/10",
        "Rata-rata Tingkat Stres: 5.39/10",
        "Rata-rata Langkah Harian: 6,817 langkah",
        "Persentase Gangguan Tidur: 41.44%",
      ];
      defaultKPIs.forEach((kpi) => {
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(60, 60, 60);
        pdf.text(`• ${kpi}`, margin + 5, yPosition);
        yPosition += 6;
      });
    }

    yPosition += 10;

    // Add Detailed Analysis
    checkNewPage(80);
    yPosition = addSectionHeader("Detailed Analysis", "🔍", yPosition);

    // Total Data
    yPosition += 5;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(40, 40, 40);
    pdf.text("Total Data", margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(60, 60, 60);
    pdf.text(
      `Dataset terdiri dari ${insights.totalData || "374"} responden dengan berbagai variabel kesehatan tidur.`,
      margin,
      yPosition,
    );
    yPosition += 10;

    // Averages
    if (insights.averages && insights.averages.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(40, 40, 40);
      pdf.text("Rata-rata", margin, yPosition);
      yPosition += 8;

      insights.averages.forEach((avg) => {
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(60, 60, 60);
        pdf.text(`• ${avg}`, margin + 5, yPosition);
        yPosition += 6;
      });
      yPosition += 5;
    }

    // Statistics
    if (insights.statistics && insights.statistics.length > 0) {
      checkNewPage(40);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(40, 40, 40);
      pdf.text("Statistik Penting", margin, yPosition);
      yPosition += 8;

      insights.statistics.forEach((stat) => {
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(60, 60, 60);
        pdf.text(`• ${stat}`, margin + 5, yPosition);
        yPosition += 6;
      });
      yPosition += 10;
    }

    // Main Insights
    checkNewPage(60);
    yPosition = addSectionHeader(
      "Apa insight utama dari data?",
      "💡",
      yPosition,
    );

    if (insights.mainInsights && insights.mainInsights.length > 0) {
      insights.mainInsights.forEach((insight, index) => {
        yPosition = addWrappedText(
          `${index + 1}. ${insight}`,
          margin + 5,
          yPosition,
          contentWidth - 10,
          10,
        );
        yPosition += 3;
      });
    } else {
      const defaultInsights = [
        "Kualitas tidur yang baik berkorelasi dengan tingkat stres yang rendah dan aktivitas fisik yang cukup",
        "Gangguan tidur lebih sering terjadi pada kelompok usia dewasa dan lansia",
        "Aktivitas fisik harian yang cukup dapat meningkatkan kualitas tidur secara signifikan",
      ];
      defaultInsights.forEach((insight, index) => {
        yPosition = addWrappedText(
          `${index + 1}. ${insight}`,
          margin + 5,
          yPosition,
          contentWidth - 10,
          10,
        );
        yPosition += 3;
      });
    }

    yPosition += 10;

    // Trends
    checkNewPage(60);
    yPosition = addSectionHeader("Tren apa yang ditemukan?", "📈", yPosition);

    if (insights.trends && insights.trends.length > 0) {
      insights.trends.forEach((trend, index) => {
        yPosition = addWrappedText(
          `${index + 1}. ${trend}`,
          margin + 5,
          yPosition,
          contentWidth - 10,
          10,
        );
        yPosition += 3;
      });
    } else {
      const defaultTrends = [
        "Tren peningkatan gangguan tidur seiring bertambahnya usia",
        "Korelasi negatif antara tingkat stres dan durasi tidur",
        "Profesi dengan jadwal kerja tidak teratur memiliki risiko gangguan tidur lebih tinggi",
      ];
      defaultTrends.forEach((trend, index) => {
        yPosition = addWrappedText(
          `${index + 1}. ${trend}`,
          margin + 5,
          yPosition,
          contentWidth - 10,
          10,
        );
        yPosition += 3;
      });
    }

    yPosition += 10;

    // Recommendations
    checkNewPage(60);
    yPosition = addSectionHeader(
      "Apa rekomendasi berdasarkan data?",
      "🎯",
      yPosition,
    );

    if (insights.recommendations && insights.recommendations.length > 0) {
      insights.recommendations.forEach((rec, index) => {
        yPosition = addWrappedText(
          `${index + 1}. ${rec}`,
          margin + 5,
          yPosition,
          contentWidth - 10,
          10,
        );
        yPosition += 3;
      });
    } else {
      const defaultRecommendations = [
        "Lakukan manajemen stres melalui meditasi dan olahraga teratur",
        "Jaga rutinitas tidur yang konsisten (7-9 jam per hari)",
        "Tingkatkan aktivitas fisik harian minimal 30 menit",
        "Konsultasikan dengan dokter jika mengalami gangguan tidur kronis",
      ];
      defaultRecommendations.forEach((rec, index) => {
        yPosition = addWrappedText(
          `${index + 1}. ${rec}`,
          margin + 5,
          yPosition,
          contentWidth - 10,
          10,
        );
        yPosition += 3;
      });
    }

    // Add footer
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Sleep Health & Lifestyle Dashboard Report - Page ${i} of ${pageCount}`,
        margin,
        pageHeight - 10,
      );
      pdf.text(
        `Generated: ${new Date().toLocaleDateString("id-ID")}`,
        pageWidth - margin - 40,
        pageHeight - 10,
      );
    }

    // Save the PDF
    pdf.save(fileName);

    // Remove loading message
    document.body.removeChild(loadingDiv);

    console.log(`PDF exported successfully as ${fileName}`);
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    // Remove loading message if it exists
    const loadingDiv = document.querySelector('div[style*="position: fixed"]');
    if (loadingDiv) {
      document.body.removeChild(loadingDiv);
    }
    alert("Error exporting PDF. Please try again.");
  }
};
