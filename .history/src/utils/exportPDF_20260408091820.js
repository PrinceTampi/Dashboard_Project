import html2canvas from "html2canvas";
import {
  getAverageSleepDuration,
  getAverageSleepQuality,
  getAverageStressLevel,
  getAverageDailySteps,
  getAverageHeartRate,
  getSleepDisorderPercentage,
} from "./generateKPIs.js";
import { generateKPIs, generateInsights } from "./generateKPIs.js";
import jsPDF from "jspdf";

export const exportDashboardToPDF = async (
  rawData,
  schema,
  filteredData,
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

    // Use dynamic KPIs and insights from generators
    const kpis = generateKPIs(filteredData || rawData, schema);
    const dynamicInsights = generateInsights(rawData, schema);

    // Format KPIs for display
    const kpiDisplay = Object.entries(kpis).map(([key, values]) => {
      const avg = values.avg.toFixed(2);
      return `${key}: ${avg}`;
    });

    // Group insights by type for PDF sections
    const groupedInsights = {
      trends: dynamicInsights.filter((i) => i.type === "trend"),
      correlations: dynamicInsights.filter((i) => i.type === "correlation"),
      anomalies: dynamicInsights.filter((i) => i.type === "anomaly"),
      distributions: dynamicInsights.filter((i) => i.type === "distribution"),
      summary: dynamicInsights.find((i) => i.isSummary),
    };

    const totalRespondents = rawData.length.toLocaleString();

    // Wait a bit for data extraction
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Add Executive Summary
    yPosition = addSectionHeader("Executive Summary", "📊", yPosition + 10);
    yPosition = addWrappedText(
      `Laporan analisis kesehatan tidur dari ${totalRespondents} responden. Filtered: ${filteredCount} records. Insights generated: ${dynamicInsights.length}.`,
      margin,
      yPosition,
      contentWidth,
    );

    yPosition += 10;

    // Add KPI Section
    checkNewPage(60);
    yPosition = addSectionHeader("Key Performance Indicators", "📈", yPosition);
    yPosition += 5;

    // Dynamic KPIs
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    kpiDisplay.slice(0, 6).forEach((kpi) => {
      pdf.setFont("helvetica", "normal");
      pdf.text(`• ${kpi}`, margin + 5, yPosition);
      yPosition += 6;
    });

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
