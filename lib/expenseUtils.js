/**
 * Expense Utilities
 * Helper functions for expense management, validation, and categorization
 */

import { MERCHANT_PATTERNS, getCategoryById, EXPENSE_CATEGORIES } from './expenseCategories';

/**
 * Generate a unique ID for an expense
 * @returns {string} Unique identifier
 */
export function generateExpenseId() {
  return `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Suggest a category based on merchant name using pattern matching
 * @param {string} merchantName - Name of the merchant
 * @returns {string|null} Suggested category ID or null
 */
export function suggestCategory(merchantName) {
  if (!merchantName || typeof merchantName !== 'string') {
    return null;
  }

  const normalizedName = merchantName.trim();
  
  for (const [categoryId, patterns] of Object.entries(MERCHANT_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(normalizedName)) {
        return categoryId;
      }
    }
  }
  
  return null;
}

/**
 * Validate expense data
 * @param {Object} expense - Expense object to validate
 * @returns {Object} Validation result with isValid flag and errors array
 */
export function validateExpense(expense) {
  const errors = [];

  // Required fields
  if (!expense.amount || isNaN(parseFloat(expense.amount))) {
    errors.push('Amount is required and must be a valid number');
  } else if (parseFloat(expense.amount) <= 0) {
    errors.push('Amount must be greater than zero');
  }

  if (!expense.date) {
    errors.push('Date is required');
  } else {
    const date = new Date(expense.date);
    if (isNaN(date.getTime())) {
      errors.push('Invalid date format');
    }
  }

  if (!expense.merchant || expense.merchant.trim().length === 0) {
    errors.push('Merchant name is required');
  }

  if (!expense.category) {
    errors.push('Category is required');
  }

  // Optional fields validation
  if (expense.paymentMethod && typeof expense.paymentMethod !== 'string') {
    errors.push('Invalid payment method');
  }

  if (expense.isRecurring && !expense.frequency) {
    errors.push('Frequency is required for recurring expenses');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Format expense amount for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted amount
 */
export function formatAmount(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type ('short', 'medium', 'long')
 * @returns {string} Formatted date
 */
export function formatDate(date, format = 'medium') {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    medium: { month: 'long', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
  };

  return dateObj.toLocaleDateString('en-US', options[format] || options.medium);
}

/**
 * Check if two expenses are potential duplicates
 * @param {Object} expense1 - First expense
 * @param {Object} expense2 - Second expense
 * @returns {boolean} True if likely duplicates
 */
export function isDuplicateExpense(expense1, expense2) {
  if (!expense1 || !expense2) return false;

  // Check if same amount and date
  const sameAmount = Math.abs(parseFloat(expense1.amount) - parseFloat(expense2.amount)) < 0.01;
  const date1 = new Date(expense1.date).toDateString();
  const date2 = new Date(expense2.date).toDateString();
  const sameDate = date1 === date2;

  // Check if same or similar merchant name
  const merchant1 = (expense1.merchant || '').toLowerCase().trim();
  const merchant2 = (expense2.merchant || '').toLowerCase().trim();
  const sameMerchant = merchant1 === merchant2;

  return sameAmount && sameDate && sameMerchant;
}

/**
 * Filter expenses by criteria
 * @param {Array} expenses - Array of expenses
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered expenses
 */
export function filterExpenses(expenses, filters = {}) {
  if (!Array.isArray(expenses)) return [];

  return expenses.filter(expense => {
    // Filter by category
    if (filters.category && expense.category !== filters.category) {
      return false;
    }

    // Filter by date range
    if (filters.startDate) {
      const expenseDate = new Date(expense.date);
      const startDate = new Date(filters.startDate);
      if (expenseDate < startDate) return false;
    }

    if (filters.endDate) {
      const expenseDate = new Date(expense.date);
      const endDate = new Date(filters.endDate);
      if (expenseDate > endDate) return false;
    }

    // Filter by payment method
    if (filters.paymentMethod && expense.paymentMethod !== filters.paymentMethod) {
      return false;
    }

    // Filter by search query
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const merchantMatch = (expense.merchant || '').toLowerCase().includes(searchLower);
      const notesMatch = (expense.notes || '').toLowerCase().includes(searchLower);
      const categoryMatch = getCategoryById(expense.category).name.toLowerCase().includes(searchLower);
      
      if (!merchantMatch && !notesMatch && !categoryMatch) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort expenses by field
 * @param {Array} expenses - Array of expenses
 * @param {string} field - Field to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted expenses
 */
export function sortExpenses(expenses, field = 'date', order = 'desc') {
  if (!Array.isArray(expenses)) return [];

  return [...expenses].sort((a, b) => {
    let compareA = a[field];
    let compareB = b[field];

    // Handle date sorting
    if (field === 'date') {
      compareA = new Date(compareA).getTime();
      compareB = new Date(compareB).getTime();
    }

    // Handle amount sorting
    if (field === 'amount') {
      compareA = parseFloat(compareA);
      compareB = parseFloat(compareB);
    }

    // Handle string sorting (merchant, category)
    if (typeof compareA === 'string') {
      compareA = compareA.toLowerCase();
      compareB = compareB.toLowerCase();
    }

    if (order === 'asc') {
      return compareA > compareB ? 1 : compareA < compareB ? -1 : 0;
    } else {
      return compareA < compareB ? 1 : compareA > compareB ? -1 : 0;
    }
  });
}

/**
 * Calculate total expenses
 * @param {Array} expenses - Array of expenses
 * @returns {number} Total amount
 */
export function calculateTotal(expenses) {
  if (!Array.isArray(expenses)) return 0;
  return expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
}

/**
 * Group expenses by category
 * @param {Array} expenses - Array of expenses
 * @returns {Object} Expenses grouped by category with totals
 */
export function groupByCategory(expenses) {
  if (!Array.isArray(expenses)) return {};

  const grouped = {};

  expenses.forEach(expense => {
    const categoryId = expense.category || 'other';
    if (!grouped[categoryId]) {
      grouped[categoryId] = {
        category: getCategoryById(categoryId),
        expenses: [],
        total: 0
      };
    }

    grouped[categoryId].expenses.push(expense);
    grouped[categoryId].total += parseFloat(expense.amount || 0);
  });

  return grouped;
}

/**
 * Get expenses for a specific time period
 * @param {Array} expenses - Array of expenses
 * @param {string} period - Period type ('today', 'week', 'month', 'year')
 * @returns {Array} Filtered expenses
 */
export function getExpensesByPeriod(expenses, period = 'month') {
  if (!Array.isArray(expenses)) return [];

  const now = new Date();
  const startDate = new Date();

  switch (period) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      return expenses;
  }

  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= startDate && expenseDate <= now;
  });
}

/**
 * Create an expense object with default values
 * @param {Object} data - Expense data
 * @returns {Object} Complete expense object
 */
export function createExpense(data = {}) {
  return {
    id: data.id || generateExpenseId(),
    amount: data.amount || 0,
    merchant: data.merchant || '',
    category: data.category || 'other',
    date: data.date || new Date().toISOString().split('T')[0],
    notes: data.notes || '',
    paymentMethod: data.paymentMethod || 'cash',
    isRecurring: data.isRecurring || false,
    frequency: data.frequency || 'once',
    status: data.status || 'completed',
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
