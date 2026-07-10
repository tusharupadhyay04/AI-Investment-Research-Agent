import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const HISTORY_FILE_PATH = path.join(__dirname, '../data/history.json');

// Ensure the data directory exists
const dataDir = path.dirname(HISTORY_FILE_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize history file if it doesn't exist
if (!fs.existsSync(HISTORY_FILE_PATH)) {
  fs.writeFileSync(HISTORY_FILE_PATH, JSON.stringify([]));
}

/**
 * Saves a successful analysis result to the history file.
 * @param {string} company - The company ticker/name
 * @param {Object} result - The full analysis result
 */
export const saveHistory = (company, result) => {
  try {
    const historyData = fs.readFileSync(HISTORY_FILE_PATH, 'utf-8');
    let history = JSON.parse(historyData || '[]');

    // Create history entry
    const newEntry = {
      id: Date.now().toString(),
      company: company.toUpperCase(),
      timestamp: new Date().toISOString(),
      result: result
    };

    // Remove older entry for the same company to act as a cache update
    history = history.filter(entry => entry.company !== newEntry.company);

    // Add new entry to the beginning
    history.unshift(newEntry);

    // Keep only the last 20 searches to prevent the file from growing too large
    if (history.length > 20) {
      history = history.slice(0, 20);
    }

    fs.writeFileSync(HISTORY_FILE_PATH, JSON.stringify(history, null, 2));
    console.log(`History saved for ${company}`);
  } catch (error) {
    console.error('Error saving history:', error);
  }
};

/**
 * Retrieves the search history.
 * @returns {Array} List of past search results
 */
export const getHistory = () => {
  try {
    if (!fs.existsSync(HISTORY_FILE_PATH)) {
      return [];
    }
    const historyData = fs.readFileSync(HISTORY_FILE_PATH, 'utf-8');
    return JSON.parse(historyData || '[]');
  } catch (error) {
    console.error('Error reading history:', error);
    return [];
  }
};

/**
 * Deletes a specific history entry by ID.
 * @param {string} id - The ID of the entry to delete
 */
export const deleteHistory = (id) => {
  try {
    if (!fs.existsSync(HISTORY_FILE_PATH)) return false;
    
    const historyData = fs.readFileSync(HISTORY_FILE_PATH, 'utf-8');
    let history = JSON.parse(historyData || '[]');
    
    const initialLength = history.length;
    history = history.filter(entry => entry.id !== id);
    
    if (history.length !== initialLength) {
      fs.writeFileSync(HISTORY_FILE_PATH, JSON.stringify(history, null, 2));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting history:', error);
    return false;
  }
};
