/**
 * Savings Utilities
 * Helper functions for savings goals management, calculations, and projections
 */

import { formatAmount } from './expenseUtils';

/**
 * Goal types for savings
 */
export const GOAL_TYPES = {
  VACATION: {
    id: 'vacation',
    name: 'Vacation',
    icon: '✈️',
    color: '#2ECC71'
  },
  HOME: {
    id: 'home',
    name: 'Home',
    icon: '🏠',
    color: '#4A90E2'
  },
  CAR: {
    id: 'car',
    name: 'Car',
    icon: '🚗',
    color: '#9B59B6'
  },
  EDUCATION: {
    id: 'education',
    name: 'Education',
    icon: '📚',
    color: '#16A085'
  },
  RETIREMENT: {
    id: 'retirement',
    name: 'Retirement',
    icon: '👴',
    color: '#E67E22'
  },
  EMERGENCY: {
    id: 'emergency',
    name: 'Emergency Fund',
    icon: '🛡️',
    color: '#E74C3C'
  },
  WEDDING: {
    id: 'wedding',
    name: 'Wedding',
    icon: '💒',
    color: '#F39C12'
  },
  OTHER: {
    id: 'other',
    name: 'Other',
    icon: '💰',
    color: '#95A5A6'
  }
};

/**
 * Get goal type by ID
 * @param {string} id - Goal type ID
 * @returns {Object} Goal type object
 */
export function getGoalTypeById(id) {
  return Object.values(GOAL_TYPES).find(type => type.id === id) || GOAL_TYPES.OTHER;
}

/**
 * Calculate progress percentage
 * @param {number} current - Current amount saved
 * @param {number} target - Target amount
 * @returns {number} Progress percentage (0-100)
 */
export function calculateProgress(current, target) {
  if (!target || target <= 0) return 0;
  const progress = (current / target) * 100;
  return Math.min(100, Math.max(0, progress));
}

/**
 * Calculate recommended emergency fund amount based on expenses
 * @param {number} monthlyExpenses - Monthly expenses amount
 * @param {number} months - Number of months to cover (default: 3-6)
 * @returns {Object} Recommended amounts
 */
export function calculateRecommendedEmergencyFund(monthlyExpenses, months = 3) {
  const minimumMonths = 3;
  const maximumMonths = 6;
  
  return {
    minimum: monthlyExpenses * minimumMonths,
    recommended: monthlyExpenses * months,
    maximum: monthlyExpenses * maximumMonths,
    monthsToSave: months
  };
}

/**
 * Calculate days until goal is reached based on savings rate
 * @param {number} currentAmount - Current amount saved
 * @param {number} targetAmount - Target amount
 * @param {number} monthlySavings - Monthly savings rate
 * @returns {Object} Projection data
 */
export function calculateGoalProjection(currentAmount, targetAmount, monthlySavings) {
  if (currentAmount >= targetAmount) {
    return {
      daysRemaining: 0,
      monthsRemaining: 0,
      projectedDate: new Date(),
      isAchieved: true
    };
  }

  if (monthlySavings <= 0) {
    return {
      daysRemaining: Infinity,
      monthsRemaining: Infinity,
      projectedDate: null,
      isAchieved: false
    };
  }

  const remaining = targetAmount - currentAmount;
  const monthsRemaining = remaining / monthlySavings;
  const daysRemaining = Math.ceil(monthsRemaining * 30);
  
  const projectedDate = new Date();
  projectedDate.setDate(projectedDate.getDate() + daysRemaining);

  return {
    daysRemaining,
    monthsRemaining: Math.ceil(monthsRemaining),
    projectedDate,
    isAchieved: false
  };
}

/**
 * Validate savings goal data
 * @param {Object} goal - Goal object to validate
 * @returns {Object} Validation result with isValid flag and errors array
 */
export function validateSavingsGoal(goal) {
  const errors = [];

  if (!goal.name || goal.name.trim().length === 0) {
    errors.push('Goal name is required');
  }

  if (!goal.targetAmount || isNaN(parseFloat(goal.targetAmount))) {
    errors.push('Target amount is required and must be a valid number');
  } else if (parseFloat(goal.targetAmount) <= 0) {
    errors.push('Target amount must be greater than zero');
  }

  if (goal.currentAmount && parseFloat(goal.currentAmount) < 0) {
    errors.push('Current amount cannot be negative');
  }

  if (!goal.type) {
    errors.push('Goal type is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Create a new savings goal object
 * @param {Object} data - Goal data
 * @returns {Object} Complete goal object
 */
export function createSavingsGoal(data = {}) {
  return {
    id: data.id || null,
    name: data.name || '',
    type: data.type || 'other',
    targetAmount: parseFloat(data.targetAmount) || 0,
    currentAmount: parseFloat(data.currentAmount) || 0,
    monthlyTarget: parseFloat(data.monthlyTarget) || 0,
    deadline: data.deadline || null,
    notes: data.notes || '',
    contributions: data.contributions || [],
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Get milestone checkpoints for a goal
 * @param {number} targetAmount - Target amount
 * @returns {Array} Array of milestone objects
 */
export function getMilestones(targetAmount) {
  if (!targetAmount || targetAmount <= 0) return [];

  const percentages = [10, 25, 50, 75, 100];
  return percentages.map(percent => ({
    percent,
    amount: (targetAmount * percent) / 100,
    label: `${percent}% Complete`
  }));
}

/**
 * Check which milestones have been reached
 * @param {number} currentAmount - Current amount saved
 * @param {number} targetAmount - Target amount
 * @returns {Array} Array of reached milestones
 */
export function getReachedMilestones(currentAmount, targetAmount) {
  const milestones = getMilestones(targetAmount);
  return milestones.filter(milestone => currentAmount >= milestone.amount);
}

/**
 * Get the next milestone to reach
 * @param {number} currentAmount - Current amount saved
 * @param {number} targetAmount - Target amount
 * @returns {Object|null} Next milestone or null if all reached
 */
export function getNextMilestone(currentAmount, targetAmount) {
  const milestones = getMilestones(targetAmount);
  return milestones.find(milestone => currentAmount < milestone.amount) || null;
}

/**
 * Format goal for display
 * @param {Object} goal - Goal object
 * @returns {Object} Formatted goal with display values
 */
export function formatGoalForDisplay(goal) {
  const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
  const goalType = getGoalTypeById(goal.type);
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
  
  return {
    ...goal,
    progress,
    goalType,
    formattedTarget: formatAmount(goal.targetAmount),
    formattedCurrent: formatAmount(goal.currentAmount),
    formattedRemaining: formatAmount(remaining),
    remaining
  };
}

/**
 * Sort goals by various criteria
 * @param {Array} goals - Array of goals
 * @param {string} sortBy - Sort criteria ('progress', 'deadline', 'amount', 'name')
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted goals
 */
export function sortGoals(goals, sortBy = 'name', order = 'asc') {
  if (!Array.isArray(goals)) return [];

  return [...goals].sort((a, b) => {
    let compareA, compareB;

    switch (sortBy) {
      case 'progress':
        compareA = calculateProgress(a.currentAmount, a.targetAmount);
        compareB = calculateProgress(b.currentAmount, b.targetAmount);
        break;
      case 'deadline':
        compareA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
        compareB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
        break;
      case 'amount':
        compareA = parseFloat(a.targetAmount) || 0;
        compareB = parseFloat(b.targetAmount) || 0;
        break;
      case 'name':
      default:
        compareA = (a.name || '').toLowerCase();
        compareB = (b.name || '').toLowerCase();
    }

    if (order === 'asc') {
      return compareA > compareB ? 1 : compareA < compareB ? -1 : 0;
    } else {
      return compareA < compareB ? 1 : compareA > compareB ? -1 : 0;
    }
  });
}

/**
 * Calculate total savings across all goals
 * @param {Array} goals - Array of goals
 * @returns {Object} Totals object
 */
export function calculateTotalSavings(goals) {
  if (!Array.isArray(goals)) return { totalSaved: 0, totalTarget: 0, overallProgress: 0 };

  const totalSaved = goals.reduce((sum, goal) => sum + (parseFloat(goal.currentAmount) || 0), 0);
  const totalTarget = goals.reduce((sum, goal) => sum + (parseFloat(goal.targetAmount) || 0), 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return {
    totalSaved,
    totalTarget,
    overallProgress: Math.min(100, overallProgress)
  };
}

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatGoalDate(date) {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
