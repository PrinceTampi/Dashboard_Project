import { useMemo } from 'react';

/**
 * Data Table Component
 * 
 * Displays raw CSV data in a scrollable table format
 * Shows first 20 rows with a note if there are more
 * 
 * Props:
 * - data: Raw data array
 * - title: Optional table title (default: "Raw Data")
 */
const DataTable = ({ data, title = 'Raw Data' }) => {
  const memoizedData = useMemo(() => data, [data]);

  if (!memoizedData || memoizedData.length === 0) {
    return (
      <div className="data-table-container">
        <h3>{title}</h3>
        <p style={{ color: '#888', textAlign: 'center' }}>No data available</p>
      </div>
    );
  }

  const columns = Object.keys(memoizedData[0]);
  const displayRows = memoizedData.slice(0, 50);
  const hasMore = memoizedData.length > 50;

  return (
    <div className="data-table-container">
      <h3>{title}</h3>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {columns.map(col => (
                  <td key={`${rowIdx}-${col}`}>{String(row[col] || '')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <p style={{ color: '#888', fontSize: '12px', marginTop: '10px' }}>
          Showing 50 of {memoizedData.length} rows
        </p>
      )}
    </div>
  );
};

export default DataTable;
