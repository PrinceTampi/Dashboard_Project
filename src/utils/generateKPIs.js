/**
 * KPI Generation Utility
 * 
 * Generates Key Performance Indicators from numeric data:
 * - Total (sum)
 * - Average (mean)
 * - Maximum
 * - Minimum
 */

/**
 * Convert string value to number
 */
const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
};

/**
 * Calculate KPIs for a single numeric field
 */
const calculateFieldKPI = (values) => {
  const numbers = values
    .map(toNumber)
    .filter(v => v !== null);

  if (numbers.length === 0) {
    return null;
  }

  const total = numbers.reduce((sum, val) => sum + val, 0);
  const avg = total / numbers.length;
  const max = Math.max(...numbers);
  const min = Math.min(...numbers);

  return {
    total: Math.round(total * 100) / 100,
    avg: Math.round(avg * 100) / 100,
    max: Math.round(max * 100) / 100,
    min: Math.round(min * 100) / 100,
    count: numbers.length
  };
};

/**
 * Generate KPIs for all numeric fields in schema
 */
export const generateKPIs = (data, schema, filters = null) => {
  if (!data || data.length === 0 || !schema || schema.numeric.length === 0) {
    return {};
  }

  // Apply filters if provided
  let filteredData = data;
  if (filters && Object.keys(filters).length > 0) {
    filteredData = data.filter(row => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || value.length === 0) return true;
        if (Array.isArray(value)) {
          return value.includes(String(row[key]));
        }
        return String(row[key]) === String(value);
      });
    });
  }

  const kpis = {};

  for (const numericField of schema.numeric) {
    const values = filteredData.map(row => row[numericField]);
    const kpi = calculateFieldKPI(values);
    if (kpi) {
      kpis[numericField] = kpi;
    }
  }

  return kpis;
};

/**
 * Format KPI value for display
 */
export const formatKPIValue = (value) => {
  if (value === null || value === undefined) return '-';
  if (typeof value !== 'number') return value;
  
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
};
