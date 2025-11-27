/**
 * Expense Storage Manager
 * Handles localStorage operations for expense data persistence
 */

const STORAGE_KEY = 'ominous_acorn_expenses';
const CUSTOM_CATEGORIES_KEY = 'ominous_acorn_custom_categories';
const STORAGE_VERSION = '1.0.0';

/**
 * Save expenses to localStorage
 * @param {Array} expenses - Array of expense objects
 * @returns {boolean} Success status
 */
export function saveExpenses(expenses) {
  try {
    const data = {
      version: STORAGE_VERSION,
      expenses: expenses,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving expenses:', error);
    return false;
  }
}

/**
 * Load expenses from localStorage
 * @returns {Array} Array of expense objects
 */
export function loadExpenses() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const parsed = JSON.parse(data);
    return Array.isArray(parsed.expenses) ? parsed.expenses : [];
  } catch (error) {
    console.error('Error loading expenses:', error);
    return [];
  }
}

/**
 * Add a new expense
 * @param {Object} expense - Expense object to add
 * @returns {boolean} Success status
 */
export function addExpense(expense) {
  try {
    const expenses = loadExpenses();
    expenses.push(expense);
    return saveExpenses(expenses);
  } catch (error) {
    console.error('Error adding expense:', error);
    return false;
  }
}

/**
 * Update an existing expense
 * @param {string} id - Expense ID
 * @param {Object} updates - Fields to update
 * @returns {boolean} Success status
 */
export function updateExpense(id, updates) {
  try {
    const expenses = loadExpenses();
    const index = expenses.findIndex(exp => exp.id === id);
    
    if (index === -1) return false;

    expenses[index] = {
      ...expenses[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return saveExpenses(expenses);
  } catch (error) {
    console.error('Error updating expense:', error);
    return false;
  }
}

/**
 * Delete an expense
 * @param {string} id - Expense ID to delete
 * @returns {boolean} Success status
 */
export function deleteExpense(id) {
  try {
    const expenses = loadExpenses();
    const filtered = expenses.filter(exp => exp.id !== id);
    return saveExpenses(filtered);
  } catch (error) {
    console.error('Error deleting expense:', error);
    return false;
  }
}

/**
 * Get a single expense by ID
 * @param {string} id - Expense ID
 * @returns {Object|null} Expense object or null
 */
export function getExpenseById(id) {
  try {
    const expenses = loadExpenses();
    return expenses.find(exp => exp.id === id) || null;
  } catch (error) {
    console.error('Error getting expense:', error);
    return null;
  }
}

/**
 * Clear all expenses
 * @returns {boolean} Success status
 */
export function clearAllExpenses() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing expenses:', error);
    return false;
  }
}

/**
 * Save custom categories
 * @param {Array} categories - Array of custom category objects
 * @returns {boolean} Success status
 */
export function saveCustomCategories(categories) {
  try {
    localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(categories));
    return true;
  } catch (error) {
    console.error('Error saving custom categories:', error);
    return false;
  }
}

/**
 * Load custom categories
 * @returns {Array} Array of custom category objects
 */
export function loadCustomCategories() {
  try {
    const data = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading custom categories:', error);
    return [];
  }
}

/**
 * Export expenses to JSON
 * @returns {string} JSON string of all expenses
 */
export function exportExpensesToJSON() {
  try {
    const expenses = loadExpenses();
    const customCategories = loadCustomCategories();
    
    const exportData = {
      version: STORAGE_VERSION,
      exportDate: new Date().toISOString(),
      expenses,
      customCategories
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting expenses:', error);
    return null;
  }
}

/**
 * Import expenses from JSON
 * @param {string} jsonString - JSON string containing expenses
 * @returns {Object} Result with success status and message
 */
export function importExpensesFromJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    
    if (!data.expenses || !Array.isArray(data.expenses)) {
      return {
        success: false,
        message: 'Invalid data format: expenses array not found'
      };
    }

    // Merge with existing expenses (avoid duplicates by ID)
    const existingExpenses = loadExpenses();
    const existingIds = new Set(existingExpenses.map(exp => exp.id));
    
    const newExpenses = data.expenses.filter(exp => !existingIds.has(exp.id));
    const mergedExpenses = [...existingExpenses, ...newExpenses];

    saveExpenses(mergedExpenses);

    // Import custom categories if present
    if (data.customCategories && Array.isArray(data.customCategories)) {
      const existingCustom = loadCustomCategories();
      const mergedCustom = [...existingCustom, ...data.customCategories];
      saveCustomCategories(mergedCustom);
    }

    return {
      success: true,
      message: `Successfully imported ${newExpenses.length} expenses`,
      imported: newExpenses.length
    };
  } catch (error) {
    console.error('Error importing expenses:', error);
    return {
      success: false,
      message: `Import failed: ${error.message}`
    };
  }
}

/**
 * Get storage usage information
 * @returns {Object} Storage information
 */
export function getStorageInfo() {
  try {
    const expensesData = localStorage.getItem(STORAGE_KEY) || '[]';
    const customCategoriesData = localStorage.getItem(CUSTOM_CATEGORIES_KEY) || '[]';
    
    const expensesSize = new Blob([expensesData]).size;
    const customCategoriesSize = new Blob([customCategoriesData]).size;
    const totalSize = expensesSize + customCategoriesSize;

    // Estimate remaining storage (most browsers have 5-10MB limit)
    const estimatedLimit = 5 * 1024 * 1024; // 5MB
    const remaining = estimatedLimit - totalSize;
    const percentUsed = (totalSize / estimatedLimit) * 100;

    return {
      used: totalSize,
      remaining: Math.max(0, remaining),
      percentUsed: Math.min(100, percentUsed),
      expenseCount: loadExpenses().length,
      customCategoryCount: loadCustomCategories().length
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return {
      used: 0,
      remaining: 0,
      percentUsed: 0,
      expenseCount: 0,
      customCategoryCount: 0
    };
  }
}
