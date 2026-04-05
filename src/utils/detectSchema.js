/**
 * Schema Detection Utility
 * 
 * Analyzes CSV data structure and classifies columns into types:
 * - numeric: numbers that can be aggregated/charted
 * - categorical: low cardinality values for grouping
 * - date: temporal data for time-series charts
 * - text: high cardinality text (names, descriptions)
 */

/**
 * Detect data type of a single value
 */
const detectValueType = (value) => {
  // Handle null/undefined/empty
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const strValue = String(value).trim();

  // Try parsing as number
  const numValue = parseFloat(strValue);
  if (!isNaN(numValue) && strValue !== '') {
    return 'numeric';
  }

  // Try parsing as date
  const dateValue = new Date(strValue);
  if (!isNaN(dateValue.getTime()) && strValue.length >= 8) {
    // Avoid matching short strings as dates
    return 'date';
  }

  return 'text';
};

/**
 * Count unique values in a column
 */
const countUnique = (values) => {
  const unique = new Set(values.filter(v => v !== null && v !== undefined && v !== ''));
  return unique.size;
};

/**
 * Main schema detection function
 */
export const detectSchema = (data) => {
  if (!data || data.length === 0) {
    return {
      numeric: [],
      categorical: [],
      date: [],
      text: [],
      allColumns: []
    };
  }

  const schema = {
    numeric: [],
    categorical: [],
    date: [],
    text: [],
    allColumns: Object.keys(data[0])
  };

  // Analyze each column
  for (const column of schema.allColumns) {
    const values = data.map(row => row[column]);
    const totalRows = data.length;
    const nonEmptyRows = values.filter(v => v !== null && v !== undefined && v !== '').length;
    const uniqueCount = countUnique(values);

    // Skip empty columns
    if (nonEmptyRows === 0) continue;

    // Sample up to 100 rows for type detection
    const sampleSize = Math.min(100, totalRows);
    const sampleValues = values.slice(0, sampleSize);

    // Count type frequencies in sample
    const typeCounts = {
      numeric: 0,
      date: 0,
      text: 0,
      empty: 0
    };

    sampleValues.forEach(val => {
      const type = detectValueType(val);
      if (type) {
        typeCounts[type]++;
      } else {
        typeCounts.empty++;
      }
    });

    // Determine primary type based on frequency
    const typeThreshold = (sampleSize * 0.8); // 80% threshold

    if (typeCounts.numeric >= typeThreshold) {
      schema.numeric.push(column);
    } else if (typeCounts.date >= typeThreshold) {
      schema.date.push(column);
    } else if (uniqueCount <= Math.ceil(Math.sqrt(totalRows)) && uniqueCount <= 50) {
      // Categorical: low unique count (sqrt of total, max 50)
      schema.categorical.push(column);
    } else {
      // Otherwise treat as text
      schema.text.push(column);
    }
  }

  return schema;
};

/**
 * Validate schema and return summary
 */
export const getSchemaInfo = (schema) => {
  return {
    columns: schema.allColumns.length,
    numericFields: schema.numeric.length,
    categoricalFields: schema.categorical.length,
    dateFields: schema.date.length,
    textFields: schema.text.length,
    canCreateLineChart: schema.date.length > 0 && schema.numeric.length > 0,
    canCreateBarChart: schema.categorical.length > 0 && schema.numeric.length > 0,
    canCreatePieChart: schema.categorical.length > 0
  };
};
