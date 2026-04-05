import { useState, useMemo } from 'react';

/**
 * Filters Component
 * 
 * Renders interactive filters based on schema:
 * - Dropdowns for categorical fields
 * - Date range picker for date fields
 * 
 * Props:
 * - schema: Schema object from detectSchema()
 * - data: Raw data array
 * - onFilterChange: Callback function (filters) => void
 */
const Filters = ({ schema, data, onFilterChange }) => {
  const [filters, setFilters] = useState({});

  // Get unique values for each categorical field
  const categoricalOptions = useMemo(() => {
    if (!schema || !schema.categorical) return {};

    const options = {};
    schema.categorical.forEach(field => {
      const values = new Set();
      data.forEach(row => {
        const val = String(row[field]).trim();
        if (val) values.add(val);
      });
      options[field] = Array.from(values).sort();
    });
    return options;
  }, [schema, data]);

  // Get date range
  const dateRange = useMemo(() => {
    if (!schema || !schema.date || schema.date.length === 0) {
      return { min: null, max: null };
    }

    const dateField = schema.date[0];
    let minDate = null;
    let maxDate = null;

    data.forEach(row => {
      const dateStr = String(row[dateField]).trim();
      if (dateStr) {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          if (!minDate || date < minDate) minDate = date;
          if (!maxDate || date > maxDate) maxDate = date;
        }
      }
    });

    return {
      min: minDate ? minDate.toISOString().split('T')[0] : null,
      max: maxDate ? maxDate.toISOString().split('T')[0] : null
    };
  }, [schema, data]);

  const handleCategoryChange = (field, value) => {
    const newFilters = { ...filters };
    if (!newFilters[field]) {
      newFilters[field] = [];
    }

    const index = newFilters[field].indexOf(value);
    if (index > -1) {
      newFilters[field].splice(index, 1);
    } else {
      newFilters[field].push(value);
    }

    if (newFilters[field].length === 0) {
      delete newFilters[field];
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (field, type, value) => {
    const newFilters = { ...filters };
    if (!newFilters[field]) {
      newFilters[field] = {};
    }
    newFilters[field][type] = value;

    if (!newFilters[field].min && !newFilters[field].max) {
      delete newFilters[field];
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setFilters({});
    onFilterChange({});
  };

  // Don't render if no filters available
  if (
    (!categoricalOptions || Object.keys(categoricalOptions).length === 0) &&
    (!dateRange.min && !dateRange.max)
  ) {
    return null;
  }

  return (
    <div className="filters-section">
      <div className="filters-header">
        <h3>Filters</h3>
        {Object.keys(filters).length > 0 && (
          <button className="btn-reset" onClick={handleReset}>
            Reset Filters
          </button>
        )}
      </div>

      <div className="filters-content">
        {/* Category Filters */}
        {Object.entries(categoricalOptions).map(([field, options]) => (
          <div key={field} className="filter-group">
            <label className="filter-label">{field}</label>
            <div className="filter-options">
              {options.map(option => (
                <label key={option} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters[field]?.includes(option) || false}
                    onChange={() => handleCategoryChange(field, option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Date Range Filter */}
        {dateRange.min && dateRange.max && (
          <div className="filter-group">
            <label className="filter-label">{schema.date[0]}</label>
            <div className="filter-date-range">
              <input
                type="date"
                min={dateRange.min}
                max={dateRange.max}
                value={filters[schema.date[0]]?.min || dateRange.min}
                onChange={(e) =>
                  handleDateChange(schema.date[0], 'min', e.target.value)
                }
              />
              <span>to</span>
              <input
                type="date"
                min={dateRange.min}
                max={dateRange.max}
                value={filters[schema.date[0]]?.max || dateRange.max}
                onChange={(e) =>
                  handleDateChange(schema.date[0], 'max', e.target.value)
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filters;
