/**
 * CSV Parser Utility
 * 
 * Loads and parses CSV files using PapaParse
 * Handles errors and returns cleaned data
 */

import Papa from 'papaparse';

/**
 * Parse CSV file from public folder
 * @param {string} filePath - Path to CSV file (e.g., '/data.csv')
 * @returns {Promise<Array>} - Array of objects with headers as keys
 */
export const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    Papa.parse(filePath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // Keep as strings for manual type detection
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          // Filter out completely empty rows
          const cleanedData = results.data.filter(row => 
            Object.values(row).some(val => val !== null && val !== undefined && val !== '')
          );
          resolve(cleanedData);
        } else {
          reject(new Error('CSV file is empty or has no valid data'));
        }
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      }
    });
  });
};

/**
 * Clean and normalize CSV data
 * - Trim whitespace from string values
 * - Remove rows with all empty cells
 * @param {Array} data - Raw parsed data
 * @returns {Array} - Cleaned data
 */
export const cleanData = (data) => {
  return data
    .map(row => {
      const cleanedRow = {};
      for (const [key, value] of Object.entries(row)) {
        cleanedRow[key] = typeof value === 'string' ? value.trim() : value;
      }
      return cleanedRow;
    })
    .filter(row => 
      Object.values(row).some(val => val !== null && val !== undefined && val !== '')
    );
};
