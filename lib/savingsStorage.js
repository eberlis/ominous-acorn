/**
 * Savings Goals Storage Manager
 * Handles localStorage operations for savings and emergency fund data persistence
 */

const SAVINGS_GOALS_KEY = 'ominous_acorn_savings_goals';
const EMERGENCY_FUND_KEY = 'ominous_acorn_emergency_fund';
const STORAGE_VERSION = '1.0.0';

/**
 * Generate a unique ID for a savings goal
 * @returns {string} Unique identifier
 */
export function generateGoalId() {
  return `goal_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Save savings goals to localStorage
 * @param {Array} goals - Array of savings goal objects
 * @returns {boolean} Success status
 */
export function saveSavingsGoals(goals) {
  try {
    const data = {
      version: STORAGE_VERSION,
      goals: goals,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(SAVINGS_GOALS_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving savings goals:', error);
    return false;
  }
}

/**
 * Load savings goals from localStorage
 * @returns {Array} Array of savings goal objects
 */
export function loadSavingsGoals() {
  try {
    const data = localStorage.getItem(SAVINGS_GOALS_KEY);
    if (!data) return [];

    const parsed = JSON.parse(data);
    return Array.isArray(parsed.goals) ? parsed.goals : [];
  } catch (error) {
    console.error('Error loading savings goals:', error);
    return [];
  }
}

/**
 * Add a new savings goal
 * @param {Object} goal - Savings goal object to add
 * @returns {boolean} Success status
 */
export function addSavingsGoal(goal) {
  try {
    const goals = loadSavingsGoals();
    const newGoal = {
      ...goal,
      id: goal.id || generateGoalId(),
      createdAt: goal.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    goals.push(newGoal);
    return saveSavingsGoals(goals);
  } catch (error) {
    console.error('Error adding savings goal:', error);
    return false;
  }
}

/**
 * Update an existing savings goal
 * @param {string} id - Goal ID
 * @param {Object} updates - Fields to update
 * @returns {boolean} Success status
 */
export function updateSavingsGoal(id, updates) {
  try {
    const goals = loadSavingsGoals();
    const index = goals.findIndex(goal => goal.id === id);
    
    if (index === -1) return false;

    goals[index] = {
      ...goals[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return saveSavingsGoals(goals);
  } catch (error) {
    console.error('Error updating savings goal:', error);
    return false;
  }
}

/**
 * Delete a savings goal
 * @param {string} id - Goal ID to delete
 * @returns {boolean} Success status
 */
export function deleteSavingsGoal(id) {
  try {
    const goals = loadSavingsGoals();
    const filtered = goals.filter(goal => goal.id !== id);
    return saveSavingsGoals(filtered);
  } catch (error) {
    console.error('Error deleting savings goal:', error);
    return false;
  }
}

/**
 * Get a single savings goal by ID
 * @param {string} id - Goal ID
 * @returns {Object|null} Savings goal object or null
 */
export function getSavingsGoalById(id) {
  try {
    const goals = loadSavingsGoals();
    return goals.find(goal => goal.id === id) || null;
  } catch (error) {
    console.error('Error getting savings goal:', error);
    return null;
  }
}

/**
 * Add contribution to a savings goal
 * @param {string} id - Goal ID
 * @param {number} amount - Amount to add
 * @returns {boolean} Success status
 */
export function addContribution(id, amount) {
  try {
    const goals = loadSavingsGoals();
    const index = goals.findIndex(goal => goal.id === id);
    
    if (index === -1) return false;

    const currentSaved = parseFloat(goals[index].currentAmount) || 0;
    goals[index] = {
      ...goals[index],
      currentAmount: currentSaved + parseFloat(amount),
      updatedAt: new Date().toISOString(),
      contributions: [
        ...(goals[index].contributions || []),
        {
          amount: parseFloat(amount),
          date: new Date().toISOString()
        }
      ]
    };

    return saveSavingsGoals(goals);
  } catch (error) {
    console.error('Error adding contribution:', error);
    return false;
  }
}

/**
 * Save emergency fund settings
 * @param {Object} settings - Emergency fund settings
 * @returns {boolean} Success status
 */
export function saveEmergencyFund(settings) {
  try {
    const data = {
      version: STORAGE_VERSION,
      ...settings,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(EMERGENCY_FUND_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving emergency fund:', error);
    return false;
  }
}

/**
 * Load emergency fund settings
 * @returns {Object} Emergency fund settings
 */
export function loadEmergencyFund() {
  try {
    const data = localStorage.getItem(EMERGENCY_FUND_KEY);
    if (!data) {
      return {
        targetAmount: 0,
        currentAmount: 0,
        monthsOfExpenses: 3,
        monthlyExpenses: 0
      };
    }

    const parsed = JSON.parse(data);
    return {
      targetAmount: parsed.targetAmount || 0,
      currentAmount: parsed.currentAmount || 0,
      monthsOfExpenses: parsed.monthsOfExpenses || 3,
      monthlyExpenses: parsed.monthlyExpenses || 0
    };
  } catch (error) {
    console.error('Error loading emergency fund:', error);
    return {
      targetAmount: 0,
      currentAmount: 0,
      monthsOfExpenses: 3,
      monthlyExpenses: 0
    };
  }
}

/**
 * Clear all savings data
 * @returns {boolean} Success status
 */
export function clearAllSavingsData() {
  try {
    localStorage.removeItem(SAVINGS_GOALS_KEY);
    localStorage.removeItem(EMERGENCY_FUND_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing savings data:', error);
    return false;
  }
}

/**
 * Export savings data to JSON
 * @returns {string} JSON string of all savings data
 */
export function exportSavingsToJSON() {
  try {
    const goals = loadSavingsGoals();
    const emergencyFund = loadEmergencyFund();
    
    const exportData = {
      version: STORAGE_VERSION,
      exportDate: new Date().toISOString(),
      savingsGoals: goals,
      emergencyFund
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting savings data:', error);
    return null;
  }
}

/**
 * Import savings data from JSON
 * @param {string} jsonString - JSON string containing savings data
 * @returns {Object} Result with success status and message
 */
export function importSavingsFromJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    
    if (data.savingsGoals && Array.isArray(data.savingsGoals)) {
      const existingGoals = loadSavingsGoals();
      const existingIds = new Set(existingGoals.map(goal => goal.id));
      const newGoals = data.savingsGoals.filter(goal => !existingIds.has(goal.id));
      const mergedGoals = [...existingGoals, ...newGoals];
      saveSavingsGoals(mergedGoals);
    }

    if (data.emergencyFund) {
      saveEmergencyFund(data.emergencyFund);
    }

    return {
      success: true,
      message: 'Successfully imported savings data'
    };
  } catch (error) {
    console.error('Error importing savings data:', error);
    return {
      success: false,
      message: `Import failed: ${error.message}`
    };
  }
}
