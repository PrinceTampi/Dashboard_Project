/**
 * Advanced Insight Generation System
 * 
 * Generates sophisticated analytics:
 * - Detailed trend analysis with regression & R² values
 * - Multi-metric correlation detection
 * - Advanced anomaly detection (dynamic thresholding)
 * - Distribution insights (skewness, variance)
 * - Category performance analysis
 * - Data quality assessment
 * - Time-based pattern detection
 * - Executive summary
 */

// ============================================
// UTILITY FUNCTIONS
// ============================================

const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
};

const parseDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) ? date : null;
};

/**
 * Calculate mean of array
 */
const calculateMean = (values) => {
  if (!values || values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return sum / values.length;
};

/**
 * Calculate median of array
 */
const calculateMedian = (values) => {
  if (!values || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

/**
 * Calculate standard deviation
 */
const calculateStdDev = (values) => {
  if (!values || values.length < 2) return 0;
  const mean = calculateMean(values);
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  const variance = calculateMean(squaredDiffs);
  return Math.sqrt(variance);
};

/**
 * Calculate quartiles (Q1, Q2/median, Q3)
 */
const calculateQuartiles = (values) => {
  if (!values || values.length < 4) {
    return { q1: 0, q2: calculateMedian(values), q3: 0, iqr: 0 };
  }
  const sorted = [...values].sort((a, b) => a - b);
  const q1Index = Math.floor(sorted.length / 4);
  const q2Index = Math.floor(sorted.length / 2);
  const q3Index = Math.floor((3 * sorted.length) / 4);

  return {
    q1: sorted[q1Index],
    q2: sorted[q2Index],
    q3: sorted[q3Index],
    iqr: sorted[q3Index] - sorted[q1Index]
  };
};

/**
 * Calculate skewness (Fisher-Pearson coefficient)
 */
const calculateSkewness = (values) => {
  if (!values || values.length < 3) return 0;
  const mean = calculateMean(values);
  const stdDev = calculateStdDev(values);
  if (stdDev === 0) return 0;

  const cubedDiffs = values.map(v => Math.pow((v - mean) / stdDev, 3));
  return calculateMean(cubedDiffs);
};

/**
 * Linear regression - returns slope, intercept, R²
 * Used for trend analysis with statistical confidence
 */
const linearRegression = (xValues, yValues) => {
  if (!xValues || !yValues || xValues.length < 2) {
    return { slope: 0, intercept: 0, r: 0, rSquared: 0 };
  }

  const n = xValues.length;
  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);
  const sumY2 = yValues.reduce((sum, y) => sum + y * y, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R² (coefficient of determination)
  const yPredicted = xValues.map(x => slope * x + intercept);
  const ssRes = yValues.reduce((sum, y, i) => sum + Math.pow(y - yPredicted[i], 2), 0);
  const ssTot = yValues.reduce((sum, y) => sum + Math.pow(y - calculateMean(yValues), 2), 0);
  const rSquared = ssTot === 0 ? 0 : 1 - (ssRes / ssTot);

  // Correlation coefficient
  const r = (n * sumXY - sumX * sumY) / Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return {
    slope: parseFloat(slope.toFixed(4)),
    intercept: parseFloat(intercept.toFixed(2)),
    r: parseFloat(r.toFixed(3)),
    rSquared: parseFloat(rSquared.toFixed(3))
  };
};

/**
 * Calculate Pearson correlation coefficient
 */
const calculatePearsonCorrelation = (values1, values2) => {
  if (!values1 || !values2 || values1.length < 2 || values1.length !== values2.length) {
    return 0;
  }

  const mean1 = calculateMean(values1);
  const mean2 = calculateMean(values2);

  const numerator = values1.reduce((sum, v1, i) => sum + (v1 - mean1) * (values2[i] - mean2), 0);
  const denominator = Math.sqrt(
    values1.reduce((sum, v1) => sum + Math.pow(v1 - mean1, 2), 0) *
    values2.reduce((sum, v2) => sum + Math.pow(v2 - mean2, 2), 0)
  );

  return denominator === 0 ? 0 : numerator / denominator;
};

// ============================================
// INSIGHT GENERATION FUNCTIONS
// ============================================

/**
 * Generate detailed trend analysis with regression
 */
const generateTrendInsight = (data, dateField, numericField) => {
  if (!data || data.length < 5 || !dateField || !numericField) return null;

  const points = data
    .map((row, index) => ({
      index,
      date: parseDate(row[dateField]),
      value: toNumber(row[numericField])
    }))
    .filter(p => p.date && p.value !== null)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (points.length < 2) return null;

  const xValues = points.map((_, i) => i);
  const yValues = points.map(p => p.value);

  const regression = linearRegression(xValues, yValues);
  const percentChange = ((regression.slope * (points.length - 1)) / yValues[0] * 100).toFixed(1);
  const isStrong = Math.abs(regression.rSquared) > 0.6;
  const direction = regression.slope > 0 ? '📈 upward' : '📉 downward';
  const confidence = `R²=${regression.rSquared}`;

  return {
    type: 'trend',
    icon: regression.slope > 0 ? '📈' : '📉',
    severity: 'info',
    field: numericField,
    message: `${numericField} shows **${direction} trend** (+${percentChange}% total, ${confidence}). ${isStrong ? 'Statistically significant' : 'Moderate relationship to time'}.`,
    details: {
      slope: regression.slope,
      rSquared: regression.rSquared,
      percentChange: parseFloat(percentChange),
      confidence: isStrong ? 'strong' : 'moderate'
    }
  };
};

/**
 * Generate correlation insights between numeric fields
 */
const generateCorrelationInsights = (data, schema) => {
  if (!schema || !schema.numeric || schema.numeric.length < 2) return [];

  const insights = [];
  const fields = schema.numeric.slice(0, 4); // Limit to first 4 numeric fields

  for (let i = 0; i < fields.length - 1; i++) {
    for (let j = i + 1; j < fields.length; j++) {
      const field1 = fields[i];
      const field2 = fields[j];

      const values1 = data
        .map(row => toNumber(row[field1]))
        .filter(v => v !== null);
      const values2 = data
        .map(row => toNumber(row[field2]))
        .filter(v => v !== null);

      if (values1.length < 2 || values2.length < 2) continue;

      const correlation = calculatePearsonCorrelation(values1, values2);
      const absCorr = Math.abs(correlation);

      if (absCorr > 0.7) {
        const direction = correlation > 0 ? 'strongly correlated' : 'inversely correlated';
        const relevance = absCorr > 0.85 ? 'very strong' : 'strong';

        insights.push({
          type: 'correlation',
          icon: '🔗',
          severity: 'success',
          message: `**${field1}** and **${field2}** are **${relevance} ${direction}** (r=${correlation.toFixed(2)}). Changes in one metric tend to predict the other.`,
          details: {
            field1,
            field2,
            correlation: parseFloat(correlation.toFixed(3)),
            strength: relevance
          }
        });
      }
    }
  }

  return insights;
};

/**
 * Generate advanced anomaly detection insights
 */
const generateAnomalyInsights = (data, numericField) => {
  if (!data || data.length < 5 || !numericField) return null;

  const values = data
    .map((row, index) => ({
      index,
      value: toNumber(row[numericField]),
      row
    }))
    .filter(item => item.value !== null);

  if (values.length < 4) return null;

  const numericValues = values.map(item => item.value);
  const stats = {
    mean: calculateMean(numericValues),
    median: calculateMedian(numericValues),
    stdDev: calculateStdDev(numericValues),
    quartiles: calculateQuartiles(numericValues)
  };

  // Use IQR method for robustness against extreme outliers
  const lowerBound = stats.quartiles.q1 - 1.5 * stats.quartiles.iqr;
  const upperBound = stats.quartiles.q3 + 1.5 * stats.quartiles.iqr;

  const anomalies = values
    .filter(item => item.value < lowerBound || item.value > upperBound)
    .sort((a, b) => Math.abs(b.value - stats.mean) - Math.abs(a.value - stats.mean))
    .slice(0, 5);

  if (anomalies.length === 0) return null;

  const deviceFromMean = anomalies.map(a => (
    ((a.value - stats.mean) / stats.mean * 100).toFixed(0)
  ));

  const anomalyList = anomalies
    .map((a, i) => `${numericField} = ${a.value.toLocaleString(undefined, {maximumFractionDigits: 2})} (${deviceFromMean[i]}% from avg)`)
    .join(', ');

  return {
    type: 'anomaly',
    icon: '⚠️',
    severity: 'warning',
    field: numericField,
    message: `Found **${anomalies.length} unusual value${anomalies.length > 1 ? 's' : ''}** in ${numericField}: ${anomalyList}. These are ${((anomalies.length / values.length) * 100).toFixed(1)}% of data.`,
    details: {
      count: anomalies.length,
      percentage: ((anomalies.length / values.length) * 100).toFixed(1),
      examples: anomalies.slice(0, 3).map(a => a.value)
    }
  };
};

/**
 * Generate distribution insights
 */
const generateDistributionInsight = (data, numericField) => {
  if (!data || data.length < 5 || !numericField) return null;

  const values = data
    .map(row => toNumber(row[numericField]))
    .filter(v => v !== null);

  if (values.length < 5) return null;

  const stats = {
    min: Math.min(...values),
    max: Math.max(...values),
    mean: calculateMean(values),
    median: calculateMedian(values),
    stdDev: calculateStdDev(values),
    quartiles: calculateQuartiles(values)
  };

  const skewness = calculateSkewness(values);
  const variance = stats.stdDev / stats.mean;

  let shape = 'balanced';
  if (Math.abs(skewness) > 0.5) {
    shape = skewness > 0 ? 'right-skewed (tail toward higher values)' : 'left-skewed (tail toward lower values)';
  }

  const varianceDesc = variance > 0.5 ? 'high variability (values spread widely)' : 'moderate variability';

  // Count outliers using IQR
  const iqr = stats.quartiles.iqr;
  const outliers = values.filter(v => v < stats.quartiles.q1 - 1.5 * iqr || v > stats.quartiles.q3 + 1.5 * iqr);
  const outlierPercent = ((outliers.length / values.length) * 100).toFixed(1);

  return {
    type: 'distribution',
    icon: '📊',
    severity: 'info',
    field: numericField,
    message: `${numericField} data is **${shape}** with ${varianceDesc}. Range: ${stats.min.toLocaleString(undefined, {maximumFractionDigits: 2})} - ${stats.max.toLocaleString(undefined, {maximumFractionDigits: 2})}. **${outlierPercent}%** outliers detected.`,
    details: {
      mean: parseFloat(stats.mean.toFixed(2)),
      median: parseFloat(stats.median.toFixed(2)),
      stdDev: parseFloat(stats.stdDev.toFixed(2)),
      shape,
      outlierPercent: parseFloat(outlierPercent)
    }
  };
};

/**
 * Generate category performance insights
 */
const generateCategoryInsights = (data, categoryField, numericField) => {
  if (!data || !categoryField || !numericField) return null;

  const grouped = {};
  data.forEach(row => {
    const category = String(row[categoryField]).trim();
    const value = toNumber(row[numericField]);

    if (category && value !== null) {
      if (!grouped[category]) {
        grouped[category] = { sum: 0, count: 0, values: [] };
      }
      grouped[category].sum += value;
      grouped[category].count += 1;
      grouped[category].values.push(value);
    }
  });

  if (Object.keys(grouped).length === 0) return null;

  const categories = Object.entries(grouped).map(([name, stats]) => ({
    name,
    total: stats.sum,
    average: stats.sum / stats.count,
    count: stats.count,
    percent: 0
  }));

  const totalSum = categories.reduce((sum, c) => sum + c.total, 0);
  categories.forEach(c => {
    c.percent = ((c.total / totalSum) * 100).toFixed(1);
  });

  const topCategory = categories.sort((a, b) => b.total - a.total)[0];
  const avgCategory = categories.sort((a, b) => b.average - a.average)[0];

  const topMessage = `**${topCategory.name}** leads by total (${topCategory.percent}%, ${topCategory.total.toLocaleString(undefined, { maximumFractionDigits: 2 })})`;
  const avgMessage = `${avgCategory.name} has highest average (${avgCategory.average.toLocaleString(undefined, { maximumFractionDigits: 2 })} per item)`;

  return {
    type: 'category',
    icon: '⭐',
    severity: 'success',
    field: categoryField,
    message: `${topMessage}. ${avgMessage}. Total categories: ${categories.length}.`,
    details: {
      top: {
        name: topCategory.name,
        percent: parseFloat(topCategory.percent),
        total: parseFloat(topCategory.total.toFixed(2))
      },
      categories: categories.length
    }
  };
};

/**
 * Generate data quality insight
 */
const generateDataQualityInsight = (data, schema) => {
  if (!data || !schema) return null;

  let totalCells = 0;
  let missingCells = 0;
  const fieldsAnalyzed = [];

  schema.allColumns.forEach(field => {
    let fieldMissing = 0;
    data.forEach(row => {
      totalCells += 1;
      const value = row[field];
      if (value === null || value === undefined || String(value).trim() === '') {
        missingCells += 1;
        fieldMissing += 1;
      }
    });

    const completeness = (((data.length - fieldMissing) / data.length) * 100).toFixed(1);
    fieldsAnalyzed.push({
      field,
      completeness: parseFloat(completeness)
    });
  });

  const overallCompleteness = ((((totalCells - missingCells) / totalCells) * 100)).toFixed(1);

  const incompleteFields = fieldsAnalyzed.filter(f => f.completeness < 100);
  const incompleteNote = incompleteFields.length > 0
    ? ` Field "${incompleteFields[0].field}" is ${(100 - incompleteFields[0].completeness).toFixed(1)}% incomplete.`
    : '';

  return {
    type: 'dataQuality',
    icon: '✅',
    severity: parseFloat(overallCompleteness) < 90 ? 'warning' : 'success',
    message: `Data is **${overallCompleteness}% complete** with ${data.length} rows and ${schema.allColumns.length} fields. ${incompleteNote}`,
    details: {
      rows: data.length,
      fields: schema.allColumns.length,
      completeness: parseFloat(overallCompleteness),
      missingCells
    }
  };
};

/**
 * Generate seasonality/time pattern insights
 */
const generateSeasonalityInsight = (data, dateField) => {
  if (!data || !dateField || data.length < 30) return null;

  const dateData = data
    .map(row => ({
      date: parseDate(row[dateField]),
      dayOfWeek: parseDate(row[dateField])?.getDay()
    }))
    .filter(d => d.date && d.dayOfWeek !== undefined);

  if (dateData.length < 20) return null;

  // Count by day of week
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayCounts = new Array(7).fill(0);
  dateData.forEach(d => {
    dayCounts[d.dayOfWeek] += 1;
  });

  const avgPerDay = dayCounts.reduce((a, b) => a + b, 0) / 7;
  const maxDay = Math.max(...dayCounts);
  const minDay = Math.min(...dayCounts);
  const maxDayIndex = dayCounts.indexOf(maxDay);
  const variation = (((maxDay - minDay) / avgPerDay) * 100).toFixed(1);

  if (variation > 20) {
    return {
      type: 'seasonality',
      icon: '📅',
      severity: 'info',
      message: `Strong **${variation}% day-of-week pattern** detected. **${dayNames[maxDayIndex]}** has ${Math.round(((maxDay - avgPerDay) / avgPerDay) * 100)}% more activity than average.`,
      details: {
        peakDay: dayNames[maxDayIndex],
        variation: parseFloat(variation),
        pattern: 'weekly'
      }
    };
  }

  return null;
};

/**
 * Generate executive summary
 */
const generateExecutiveSummary = (insights, data, schema) => {
  if (!insights || insights.length === 0) {
    return {
      type: 'summary',
      icon: '📋',
      severity: 'info',
      message: `Dataset contains **${data.length} rows** across **${schema.allColumns.length} fields**. Limited insights available with current data characteristics.`,
      isSummary: true
    };
  }

  const trendInsights = insights.filter(i => i.type === 'trend');
  const correlations = insights.filter(i => i.type === 'correlation');
  const anomalies = insights.filter(i => i.type === 'anomaly');

  const parts = [];

  if (trendInsights.length > 0) {
    const trend = trendInsights[0];
    const direction = trend.details.slope > 0 ? 'upward' : 'downward';
    parts.push(`**${direction.charAt(0).toUpperCase() + direction.slice(1)} trend** in ${trend.field} (R²=${trend.details.rSquared})`);
  }

  if (correlations.length > 0) {
    parts.push(`**${correlations.length} strong correlation${correlations.length > 1 ? 's' : ''}** found between metrics`);
  }

  if (anomalies.length > 0) {
    parts.push(`**${anomalies[0].details.count} anomalies** detected (${anomalies[0].details.percentage}% of data)`);
  }

  const summary = parts.length > 0
    ? `Key findings: ${parts.join('. ')}. Dataset shows consistent quality with actionable patterns.`
    : `Dataset analysis complete with ${schema.numeric.length} numeric fields and ${schema.categorical.length} categories analyzed.`;

  return {
    type: 'summary',
    icon: '📋',
    severity: 'info',
    message: summary,
    isSummary: true
  };
};

// ============================================
// MAIN EXPORT
// ============================================

/**
 * Generate comprehensive insights from data
 */
export const generateInsights = (data, schema) => {
  if (!data || data.length === 0 || !schema) {
    return [];
  }

  const insights = [];

  try {
    // Add data quality insight (always)
    const qualityInsight = generateDataQualityInsight(data, schema);
    if (qualityInsight) insights.push(qualityInsight);

    // Add trend insights for each numeric + date combination
    if (schema.date && schema.date.length > 0 && schema.numeric && schema.numeric.length > 0) {
      const dateField = schema.date[0];
      schema.numeric.forEach(numField => {
        const trendInsight = generateTrendInsight(data, dateField, numField);
        if (trendInsight) insights.push(trendInsight);
      });
    }

    // Add distribution insights for each numeric field
    if (schema.numeric && schema.numeric.length > 0) {
      schema.numeric.forEach(field => {
        const distInsight = generateDistributionInsight(data, field);
        if (distInsight) insights.push(distInsight);
      });
    }

    // Add anomaly insights for each numeric field
    if (schema.numeric && schema.numeric.length > 0) {
      schema.numeric.forEach(field => {
        const anomalyInsight = generateAnomalyInsights(data, field);
        if (anomalyInsight) insights.push(anomalyInsight);
      });
    }

    // Add category performance insights
    if (schema.categorical && schema.categorical.length > 0 && schema.numeric && schema.numeric.length > 0) {
      const catField = schema.categorical[0];
      const numField = schema.numeric[0];
      const catInsight = generateCategoryInsights(data, catField, numField);
      if (catInsight) insights.push(catInsight);
    }

    // Add correlation insights
    const correlationInsights = generateCorrelationInsights(data, schema);
    insights.push(...correlationInsights);

    // Add seasonality insight if date field exists
    if (schema.date && schema.date.length > 0) {
      const seasonalInsight = generateSeasonalityInsight(data, schema.date[0]);
      if (seasonalInsight) insights.push(seasonalInsight);
    }

    // Add executive summary
    const summary = generateExecutiveSummary(insights, data, schema);
    insights.push(summary);
  } catch (error) {
    console.error('Error generating insights:', error);
  }

  return insights;
};
