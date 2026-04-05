/**
 * Dynamic Chart Generation Utility
 * 
 * Generates chart configurations based on data schema and rules:
 * - LINE CHART: date + numeric field
 * - BAR CHART: categorical + numeric field (aggregated)
 * - PIE CHART: categorical field (distribution)
 * - TABLE: always included
 */

/**
 * Convert string to number
 */
const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
};

/**
 * Parse date string to Date object
 */
const parseDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) ? date : null;
};

/**
 * Sort two dates
 */
const compareDates = (a, b) => {
  const dateA = parseDate(a);
  const dateB = parseDate(b);
  if (!dateA || !dateB) return 0;
  return dateA.getTime() - dateB.getTime();
};

/**
 * Generate LINE CHART config (date + numeric)
 */
export const generateLineChartConfig = (data, dateField, numericField, filters = null) => {
  if (!data || data.length === 0 || !dateField || !numericField) {
    return null;
  }

  let filteredData = data;
  if (filters && Object.keys(filters).length > 0) {
    filteredData = data.filter(row => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        
        // Handle date range filters
        if (typeof value === 'object' && value.min && value.max) {
          const rowDate = new Date(row[key]).getTime();
          const minDate = new Date(value.min).getTime();
          const maxDate = new Date(value.max).getTime();
          return rowDate >= minDate && rowDate <= maxDate;
        }
        
        // Handle array filters
        if (Array.isArray(value) && value.length === 0) return true;
        if (Array.isArray(value)) {
          return value.includes(String(row[key]));
        }
        
        return String(row[key]) === String(value);
      });
    });
  }

  // Group by date
  const groupedByDate = {};
  filteredData.forEach(row => {
    const date = String(row[dateField]).trim();
    const value = toNumber(row[numericField]);

    if (date && value !== null) {
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(value);
    }
  });

  // Aggregate (sum) by date
  const chartData = Object.entries(groupedByDate)
    .map(([date, values]) => ({
      name: date,
      [numericField]: Math.round(values.reduce((a, b) => a + b, 0) * 100) / 100
    }))
    .sort((a, b) => compareDates(a.name, b.name));

  return {
    type: 'line',
    title: `${numericField} over ${dateField}`,
    xAxis: { dataKey: 'name', label: dateField },
    yAxis: { label: numericField },
    lines: [{ dataKey: numericField, stroke: '#8884d8', name: numericField }],
    data: chartData,
    canRender: chartData.length > 0
  };
};

/**
 * Generate BAR CHART config (categorical + numeric)
 */
export const generateBarChartConfig = (data, categoryField, numericField, filters = null) => {
  if (!data || data.length === 0 || !categoryField || !numericField) {
    return null;
  }

  let filteredData = data;
  if (filters && Object.keys(filters).length > 0) {
    filteredData = data.filter(row => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        
        // Handle date range filters
        if (typeof value === 'object' && value.min && value.max) {
          const rowDate = new Date(row[key]).getTime();
          const minDate = new Date(value.min).getTime();
          const maxDate = new Date(value.max).getTime();
          return rowDate >= minDate && rowDate <= maxDate;
        }
        
        // Handle array filters
        if (Array.isArray(value) && value.length === 0) return true;
        if (Array.isArray(value)) {
          return value.includes(String(row[key]));
        }
        
        return String(row[key]) === String(value);
      });
    });
  }

  // Group by category
  const groupedByCategory = {};
  filteredData.forEach(row => {
    const category = String(row[categoryField]).trim();
    const value = toNumber(row[numericField]);

    if (category && value !== null) {
      if (!groupedByCategory[category]) {
        groupedByCategory[category] = [];
      }
      groupedByCategory[category].push(value);
    }
  });

  // Aggregate (sum) by category
  const chartData = Object.entries(groupedByCategory)
    .map(([category, values]) => ({
      name: category,
      [numericField]: Math.round(values.reduce((a, b) => a + b, 0) * 100) / 100
    }))
    .sort((a, b) => b[numericField] - a[numericField]); // Sort by value desc

  return {
    type: 'bar',
    title: `${numericField} by ${categoryField}`,
    xAxis: { dataKey: 'name', label: categoryField },
    yAxis: { label: numericField },
    bars: [{ dataKey: numericField, fill: '#8884d8', name: numericField }],
    data: chartData,
    canRender: chartData.length > 0
  };
};

/**
 * Generate PIE CHART config (categorical distribution)
 */
export const generatePieChartConfig = (data, categoryField, filters = null) => {
  if (!data || data.length === 0 || !categoryField) {
    return null;
  }

  let filteredData = data;
  if (filters && Object.keys(filters).length > 0) {
    filteredData = data.filter(row => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        
        // Handle date range filters
        if (typeof value === 'object' && value.min && value.max) {
          const rowDate = new Date(row[key]).getTime();
          const minDate = new Date(value.min).getTime();
          const maxDate = new Date(value.max).getTime();
          return rowDate >= minDate && rowDate <= maxDate;
        }
        
        // Handle array filters
        if (Array.isArray(value) && value.length === 0) return true;
        if (Array.isArray(value)) {
          return value.includes(String(row[key]));
        }
        
        return String(row[key]) === String(value);
      });
    });
  }

  // Count occurrences
  const groupedByCategory = {};
  filteredData.forEach(row => {
    const category = String(row[categoryField]).trim();
    if (category) {
      groupedByCategory[category] = (groupedByCategory[category] || 0) + 1;
    }
  });

  // Format for pie chart
  const chartData = Object.entries(groupedByCategory)
    .map(([category, count]) => ({
      name: category,
      value: count
    }))
    .sort((a, b) => b.value - a.value);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0', '#82d7c1', '#ffa07a'];

  const chartDataWithColor = chartData.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length]
  }));

  return {
    type: 'pie',
    title: `Distribution of ${categoryField}`,
    data: chartDataWithColor,
    dataKey: 'value',
    nameKey: 'name',
    canRender: chartData.length > 0
  };
};

/**
 * Generate AREA CHART config (date + numeric with filled area)
 */
export const generateAreaChartConfig = (data, dateField, numericField, filters = null) => {
  if (!data || data.length === 0 || !dateField || !numericField) {
    return null;
  }

  let filteredData = data;
  if (filters && Object.keys(filters).length > 0) {
    filteredData = data.filter(row => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        if (typeof value === 'object' && value.min && value.max) {
          const rowDate = new Date(row[key]).getTime();
          const minDate = new Date(value.min).getTime();
          const maxDate = new Date(value.max).getTime();
          return rowDate >= minDate && rowDate <= maxDate;
        }
        if (Array.isArray(value) && value.length === 0) return true;
        if (Array.isArray(value)) {
          return value.includes(String(row[key]));
        }
        return String(row[key]) === String(value);
      });
    });
  }

  const groupedByDate = {};
  filteredData.forEach(row => {
    const date = String(row[dateField]).trim();
    const value = toNumber(row[numericField]);
    if (date && value !== null) {
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(value);
    }
  });

  const chartData = Object.entries(groupedByDate)
    .map(([date, values]) => ({
      name: date,
      [numericField]: Math.round(values.reduce((a, b) => a + b, 0) * 100) / 100
    }))
    .sort((a, b) => compareDates(a.name, b.name));

  return {
    type: 'area',
    title: `${numericField} Trend (${dateField})`,
    xAxis: { dataKey: 'name', label: dateField },
    yAxis: { label: numericField },
    areas: [{ dataKey: numericField, stroke: '#0056b3', fill: '#003d99', name: numericField }],
    data: chartData,
    canRender: chartData.length > 0
  };
};

/**
 * Generate SCATTER PLOT config (two numeric fields correlation)
 */
export const generateScatterPlotConfig = (data, numericField1, numericField2, filters = null) => {
  if (!data || data.length === 0 || !numericField1 || !numericField2) {
    return null;
  }

  let filteredData = data;
  if (filters && Object.keys(filters).length > 0) {
    filteredData = data.filter(row => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        if (typeof value === 'object' && value.min && value.max) {
          const rowDate = new Date(row[key]).getTime();
          const minDate = new Date(value.min).getTime();
          const maxDate = new Date(value.max).getTime();
          return rowDate >= minDate && rowDate <= maxDate;
        }
        if (Array.isArray(value) && value.length === 0) return true;
        if (Array.isArray(value)) {
          return value.includes(String(row[key]));
        }
        return String(row[key]) === String(value);
      });
    });
  }

  const chartData = filteredData
    .map((row, idx) => {
      const val1 = toNumber(row[numericField1]);
      const val2 = toNumber(row[numericField2]);
      return val1 !== null && val2 !== null ? {
        [numericField1]: val1,
        [numericField2]: val2,
        name: `Point ${idx + 1}`
      } : null;
    })
    .filter(item => item !== null);

  return {
    type: 'scatter',
    title: `${numericField1} vs ${numericField2}`,
    xAxis: { dataKey: numericField1, label: numericField1, type: 'number' },
    yAxis: { dataKey: numericField2, label: numericField2, type: 'number' },
    data: chartData,
    canRender: chartData.length > 1
  };
};

/**
 * Generate HEATMAP config (date + categorical + numeric)
 */
export const generateHeatmapConfig = (data, dateField, categoryField, numericField, filters = null) => {
  if (!data || data.length === 0 || !dateField || !categoryField || !numericField) {
    return null;
  }

  let filteredData = data;
  if (filters && Object.keys(filters).length > 0) {
    filteredData = data.filter(row => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        if (typeof value === 'object' && value.min && value.max) {
          const rowDate = new Date(row[key]).getTime();
          const minDate = new Date(value.min).getTime();
          const maxDate = new Date(value.max).getTime();
          return rowDate >= minDate && rowDate <= maxDate;
        }
        if (Array.isArray(value) && value.length === 0) return true;
        if (Array.isArray(value)) {
          return value.includes(String(row[key]));
        }
        return String(row[key]) === String(value);
      });
    });
  }

  const matrix = {};
  filteredData.forEach(row => {
    const date = String(row[dateField]).trim();
    const category = String(row[categoryField]).trim();
    const value = toNumber(row[numericField]);
    if (date && category && value !== null) {
      const key = `${date}|${category}`;
      matrix[key] = value;
    }
  });

  const uniqueDates = [...new Set(Object.keys(matrix).map(k => k.split('|')[0]))].sort(compareDates);
  const uniqueCategories = [...new Set(Object.keys(matrix).map(k => k.split('|')[1]))];

  const heatmapData = uniqueDates.map(date => {
    const row = { date };
    uniqueCategories.forEach(category => {
      const key = `${date}|${category}`;
      row[category] = matrix[key] || 0;
    });
    return row;
  });

  return {
    type: 'heatmap',
    title: `${numericField} Heatmap (${dateField} × ${categoryField})`,
    data: heatmapData,
    categories: uniqueCategories,
    dateField: 'date',
    numericField: numericField,
    canRender: heatmapData.length > 0 && uniqueCategories.length > 0
  };
};

/**
 * Generate BOX PLOT config (numeric field distribution)
 */
export const generateBoxPlotConfig = (data, numericField, filters = null) => {
  if (!data || data.length === 0 || !numericField) {
    return null;
  }

  let filteredData = data;
  if (filters && Object.keys(filters).length > 0) {
    filteredData = data.filter(row => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        if (typeof value === 'object' && value.min && value.max) {
          const rowDate = new Date(row[key]).getTime();
          const minDate = new Date(value.min).getTime();
          const maxDate = new Date(value.max).getTime();
          return rowDate >= minDate && rowDate <= maxDate;
        }
        if (Array.isArray(value) && value.length === 0) return true;
        if (Array.isArray(value)) {
          return value.includes(String(row[key]));
        }
        return String(row[key]) === String(value);
      });
    });
  }

  const values = filteredData
    .map(row => toNumber(row[numericField]))
    .filter(v => v !== null)
    .sort((a, b) => a - b);

  if (values.length === 0) {
    return null;
  }

  // Calculate quartiles and statistics
  const q1Index = Math.floor(values.length * 0.25);
  const q2Index = Math.floor(values.length * 0.50);
  const q3Index = Math.floor(values.length * 0.75);

  const q1 = values[q1Index];
  const q2 = values[q2Index];
  const q3 = values[q3Index];
  const min = values[0];
  const max = values[values.length - 1];
  const iqr = q3 - q1;

  // Identify outliers
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  const outliers = values.filter(v => v < lowerBound || v > upperBound);

  const boxplotData = [{
    name: numericField,
    min: min,
    q1: q1,
    median: q2,
    q3: q3,
    max: max,
    mean: Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100,
    outlierCount: outliers.length,
    outliers: outliers.slice(0, 10) // Show first 10 outliers
  }];

  return {
    type: 'boxplot',
    title: `Distribution of ${numericField}`,
    data: boxplotData,
    canRender: values.length > 0
  };
};

/**
 * Generate all applicable charts based on schema
 */
export const generateCharts = (data, schema, filters = null) => {
  if (!data || data.length === 0 || !schema) {
    return [];
  }

  const charts = [];

  // Line chart: date + first numeric field
  if (schema.date.length > 0 && schema.numeric.length > 0) {
    const dateField = schema.date[0];
    const numericField = schema.numeric[0];
    const lineChart = generateLineChartConfig(data, dateField, numericField, filters);
    if (lineChart && lineChart.canRender) {
      charts.push(lineChart);
    }
  }

  // Area chart: date + second numeric field (if available)
  if (schema.date.length > 0 && schema.numeric.length > 1) {
    const dateField = schema.date[0];
    const numericField = schema.numeric[1];
    const areaChart = generateAreaChartConfig(data, dateField, numericField, filters);
    if (areaChart && areaChart.canRender) {
      charts.push(areaChart);
    }
  }

  // Bar chart: first categorical + first numeric
  if (schema.categorical.length > 0 && schema.numeric.length > 0) {
    const categoryField = schema.categorical[0];
    const numericField = schema.numeric[0];
    const barChart = generateBarChartConfig(data, categoryField, numericField, filters);
    if (barChart && barChart.canRender) {
      charts.push(barChart);
    }
  }

  // Scatter plot: two numeric fields (if available)
  if (schema.numeric.length > 1) {
    const numericField1 = schema.numeric[0];
    const numericField2 = schema.numeric[1];
    const scatterChart = generateScatterPlotConfig(data, numericField1, numericField2, filters);
    if (scatterChart && scatterChart.canRender) {
      charts.push(scatterChart);
    }
  }

  // Heatmap: date + first categorical + first numeric
  if (schema.date.length > 0 && schema.categorical.length > 0 && schema.numeric.length > 0) {
    const dateField = schema.date[0];
    const categoryField = schema.categorical[0];
    const numericField = schema.numeric[0];
    const heatmapChart = generateHeatmapConfig(data, dateField, categoryField, numericField, filters);
    if (heatmapChart && heatmapChart.canRender) {
      charts.push(heatmapChart);
    }
  }

  // Box plot: first numeric field
  if (schema.numeric.length > 0) {
    const numericField = schema.numeric[0];
    const boxplotChart = generateBoxPlotConfig(data, numericField, filters);
    if (boxplotChart && boxplotChart.canRender) {
      charts.push(boxplotChart);
    }
  }

  // Pie chart: first categorical field
  if (schema.categorical.length > 0) {
    const categoryField = schema.categorical[0];
    const pieChart = generatePieChartConfig(data, categoryField, filters);
    if (pieChart && pieChart.canRender) {
      charts.push(pieChart);
    }
  }

  // Always add table config
  charts.push({
    type: 'table',
    title: 'Raw Data',
    data: data
  });

  return charts;
};
