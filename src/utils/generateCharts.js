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
 * Sleep Health Dashboard - Specialized Chart Generators
 */

/**
 * Chart 1: Line Chart - Pengaruh Stres terhadap Kualitas Tidur
 * X: Stress Level (1-10), Y: Average Quality of Sleep
 */
export const generateStressVsSleepQualityChart = (data, filters = null) => {
  if (!data || data.length === 0) return null;

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

  // Group by Stress Level
  const groupedByStress = {};
  filteredData.forEach(row => {
    const stress = toNumber(row['Stress Level']);
    const quality = toNumber(row['Quality of Sleep']);
    
    if (stress !== null && quality !== null) {
      if (!groupedByStress[stress]) {
        groupedByStress[stress] = [];
      }
      groupedByStress[stress].push(quality);
    }
  });

  // Calculate average quality per stress level
  const chartData = Object.entries(groupedByStress)
    .map(([stress, qualities]) => ({
      stressLevel: parseInt(stress),
      avgQuality: Math.round((qualities.reduce((a, b) => a + b, 0) / qualities.length) * 100) / 100
    }))
    .sort((a, b) => a.stressLevel - b.stressLevel);

  return {
    type: 'line',
    title: 'Pengaruh Stres terhadap Kualitas Tidur',
    xAxis: { dataKey: 'stressLevel', label: 'Tingkat Stres (1-10)', type: 'number' },
    yAxis: { label: 'Rata-rata Kualitas Tidur (/10)' },
    lines: [{ dataKey: 'avgQuality', stroke: '#0066cc', strokeWidth: 2, name: 'Kualitas Tidur' }],
    data: chartData,
    canRender: chartData.length > 0
  };
};

/**
 * Chart 2: Bar Chart - Durasi Tidur per Pekerjaan (Top 8)
 */
export const generateSleepDurationByOccupationChart = (data, filters = null) => {
  if (!data || data.length === 0) return null;

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

  // Group by Occupation
  const groupedByOccupation = {};
  filteredData.forEach(row => {
    const occupation = String(row['Occupation']).trim();
    const duration = toNumber(row['Sleep Duration']);
    
    if (occupation && duration !== null) {
      if (!groupedByOccupation[occupation]) {
        groupedByOccupation[occupation] = [];
      }
      groupedByOccupation[occupation].push(duration);
    }
  });

  // Calculate average duration per occupation
  const chartData = Object.entries(groupedByOccupation)
    .map(([occupation, durations]) => ({
      occupation,
      avgDuration: Math.round((durations.reduce((a, b) => a + b, 0) / durations.length) * 100) / 100
    }))
    .sort((a, b) => b.avgDuration - a.avgDuration)
    .slice(0, 8); // Top 8

  return {
    type: 'bar',
    title: 'Durasi Tidur per Pekerjaan (Top 8)',
    xAxis: { dataKey: 'occupation', label: 'Pekerjaan' },
    yAxis: { label: 'Rata-rata Durasi Tidur (jam)' },
    bars: [{ dataKey: 'avgDuration', fill: '#00aa44', name: 'Durasi Tidur (jam)' }],
    data: chartData,
    canRender: chartData.length > 0
  };
};

/**
 * Chart 3: Donut Chart - Distribusi Gangguan Tidur
 */
export const generateSleepDisorderDistribution = (data, filters = null) => {
  if (!data || data.length === 0) return null;

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

  // Count sleep disorders
  const disorderCounts = {};
  filteredData.forEach(row => {
    const disorder = String(row['Sleep Disorder']).trim();
    disorderCounts[disorder] = (disorderCounts[disorder] || 0) + 1;
  });

  const total = filteredData.length;
  const chartData = Object.entries(disorderCounts)
    .map(([disorder, count]) => ({
      name: disorder,
      value: count,
      percentage: Math.round((count / total) * 100 * 100) / 100
    }))
    .sort((a, b) => b.value - a.value);

  const COLORS = ['#00cc00', '#ff6666', '#ffaa00'];

  const chartDataWithColor = chartData.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length]
  }));

  return {
    type: 'donut',
    title: 'Distribusi Gangguan Tidur',
    data: chartDataWithColor,
    dataKey: 'value',
    nameKey: 'name',
    canRender: chartData.length > 0
  };
};

/**
 * Chart 4: Grouped Bar Chart - Kategori BMI vs Kualitas Tidur & Stres
 */
export const generateBMIVsQualityStressChart = (data, filters = null) => {
  if (!data || data.length === 0) return null;

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

  // Group by BMI Category
  const groupedByBMI = {};
  filteredData.forEach(row => {
    const bmi = String(row['BMI Category']).trim();
    const quality = toNumber(row['Quality of Sleep']);
    const stress = toNumber(row['Stress Level']);
    
    if (bmi && quality !== null && stress !== null) {
      if (!groupedByBMI[bmi]) {
        groupedByBMI[bmi] = { qualities: [], stresses: [] };
      }
      groupedByBMI[bmi].qualities.push(quality);
      groupedByBMI[bmi].stresses.push(stress);
    }
  });

  const chartData = Object.entries(groupedByBMI)
    .map(([bmi, data]) => ({
      bmi,
      avgQuality: Math.round((data.qualities.reduce((a, b) => a + b, 0) / data.qualities.length) * 100) / 100,
      avgStress: Math.round((data.stresses.reduce((a, b) => a + b, 0) / data.stresses.length) * 100) / 100
    }));

  return {
    type: 'groupedBar',
    title: 'Kategori BMI vs Kualitas Tidur & Stres',
    xAxis: { dataKey: 'bmi', label: 'Kategori BMI' },
    yAxis: { label: 'Nilai (Kualitas Tidur /10 atau Stres /10)' },
    bars: [
      { dataKey: 'avgQuality', fill: '#0066cc', name: 'Kualitas Tidur' },
      { dataKey: 'avgStress', fill: '#ff0000', name: 'Tingkat Stres' }
    ],
    data: chartData,
    canRender: chartData.length > 0
  };
};

/**
 * Chart 5: Scatter Plot - Usia vs Durasi Tidur (dengan warna berdasarkan Heart Rate)
 */
export const generateAgeVsSleepDurationChart = (data, filters = null) => {
  if (!data || data.length === 0) return null;

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

  const chartData = filteredData
    .map((row, idx) => {
      const age = toNumber(row['Age']);
      const duration = toNumber(row['Sleep Duration']);
      const heartRate = toNumber(row['Heart Rate']);
      
      if (age !== null && duration !== null && heartRate !== null) {
        let hrColor = '#00cc00'; // green
        if (heartRate >= 70 && heartRate <= 80) {
          hrColor = '#ffaa00'; // yellow
        } else if (heartRate > 80) {
          hrColor = '#ff0000'; // red
        }
        
        return {
          age,
          duration,
          heartRate,
          name: `Age ${age}`,
          fill: hrColor
        };
      }
      return null;
    })
    .filter(item => item !== null);

  return {
    type: 'scatter',
    title: 'Usia vs Durasi Tidur (warna: Denyut Jantung)',
    xAxis: { dataKey: 'age', label: 'Usia (tahun)', type: 'number' },
    yAxis: { dataKey: 'duration', label: 'Durasi Tidur (jam)', type: 'number' },
    data: chartData,
    canRender: chartData.length > 1,
    colors: { green: '#00cc00', yellow: '#ffaa00', red: '#ff0000' }
  };
};

/**
 * Chart 6: Horizontal Bar Chart - Aktivitas Fisik berdasarkan Gangguan Tidur
 */
export const generatePhysicalActivityBySleepDisorder = (data, filters = null) => {
  if (!data || data.length === 0) return null;

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

  // Group by Sleep Disorder
  const groupedByDisorder = {};
  filteredData.forEach(row => {
    const disorder = String(row['Sleep Disorder']).trim();
    const activity = toNumber(row['Physical Activity Level']);
    
    if (disorder && activity !== null) {
      if (!groupedByDisorder[disorder]) {
        groupedByDisorder[disorder] = [];
      }
      groupedByDisorder[disorder].push(activity);
    }
  });

  const chartData = Object.entries(groupedByDisorder)
    .map(([disorder, activities]) => ({
      disorder,
      avgActivity: Math.round((activities.reduce((a, b) => a + b, 0) / activities.length) * 100) / 100
    }));

  return {
    type: 'horizontalBar',
    title: 'Aktivitas Fisik berdasarkan Gangguan Tidur',
    xAxis: { label: 'Rata-rata Aktivitas Fisik (menit/hari)', type: 'number' },
    yAxis: { dataKey: 'disorder', label: 'Gangguan Tidur' },
    bars: [{ dataKey: 'avgActivity', fill: '#9900cc', name: 'Aktivitas Fisik' }],
    data: chartData,
    canRender: chartData.length > 0
  };
};

/**
 * Chart 7: Stacked Bar Chart - Pekerjaan vs Gangguan Tidur
 */
export const generateOccupationVsSleepDisorderChart = (data, filters = null) => {
  if (!data || data.length === 0) return null;

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

  // Group by Occupation and Sleep Disorder
  const groupedByOccupation = {};
  filteredData.forEach(row => {
    const occupation = String(row['Occupation']).trim();
    const disorder = String(row['Sleep Disorder']).trim();
    
    if (occupation) {
      if (!groupedByOccupation[occupation]) {
        groupedByOccupation[occupation] = { None: 0, Insomnia: 0, 'Sleep Apnea': 0 };
      }
      groupedByOccupation[occupation][disorder] = (groupedByOccupation[occupation][disorder] || 0) + 1;
    }
  });

  const chartData = Object.entries(groupedByOccupation)
    .map(([occupation, disorders]) => ({
      occupation,
      None: disorders['None'] || 0,
      Insomnia: disorders['Insomnia'] || 0,
      'Sleep Apnea': disorders['Sleep Apnea'] || 0,
      total: Object.values(disorders).reduce((a, b) => a + b, 0)
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6); // Top 6

  return {
    type: 'stackedBar',
    title: 'Pekerjaan vs Gangguan Tidur (Top 6)',
    xAxis: { dataKey: 'occupation', label: 'Pekerjaan' },
    yAxis: { label: 'Jumlah Orang' },
    bars: [
      { dataKey: 'None', fill: '#00cc00', stackId: 'a', name: 'Tidak Ada' },
      { dataKey: 'Insomnia', fill: '#ff6666', stackId: 'a', name: 'Insomnia' },
      { dataKey: 'Sleep Apnea', fill: '#ffaa00', stackId: 'a', name: 'Sleep Apnea' }
    ],
    data: chartData,
    canRender: chartData.length > 0
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
