import {
  calculateProgress,
  calculateRecommendedEmergencyFund,
  calculateGoalProjection,
  validateSavingsGoal,
  createSavingsGoal,
  getMilestones,
  getReachedMilestones,
  getNextMilestone,
  formatGoalForDisplay,
  sortGoals,
  calculateTotalSavings,
  getGoalTypeById,
  GOAL_TYPES
} from './savingsUtils';

describe('savingsUtils', () => {
  describe('calculateProgress', () => {
    it('should calculate progress percentage correctly', () => {
      expect(calculateProgress(50, 100)).toBe(50);
      expect(calculateProgress(75, 100)).toBe(75);
      expect(calculateProgress(100, 100)).toBe(100);
    });

    it('should return 0 for invalid target', () => {
      expect(calculateProgress(50, 0)).toBe(0);
      expect(calculateProgress(50, -10)).toBe(0);
    });

    it('should cap at 100% for overfunded goals', () => {
      expect(calculateProgress(150, 100)).toBe(100);
    });

    it('should handle zero current amount', () => {
      expect(calculateProgress(0, 100)).toBe(0);
    });
  });

  describe('calculateRecommendedEmergencyFund', () => {
    it('should calculate emergency fund recommendations', () => {
      const result = calculateRecommendedEmergencyFund(3000, 4);
      
      expect(result.minimum).toBe(9000); // 3 months
      expect(result.recommended).toBe(12000); // 4 months
      expect(result.maximum).toBe(18000); // 6 months
      expect(result.monthsToSave).toBe(4);
    });

    it('should use default 3 months if not specified', () => {
      const result = calculateRecommendedEmergencyFund(2000);
      
      expect(result.minimum).toBe(6000);
      expect(result.recommended).toBe(6000);
      expect(result.maximum).toBe(12000);
    });
  });

  describe('calculateGoalProjection', () => {
    it('should return achieved for goals already met', () => {
      const result = calculateGoalProjection(1000, 1000, 100);
      
      expect(result.isAchieved).toBe(true);
      expect(result.daysRemaining).toBe(0);
    });

    it('should calculate projection for goals in progress', () => {
      const result = calculateGoalProjection(500, 1000, 100);
      
      expect(result.isAchieved).toBe(false);
      expect(result.monthsRemaining).toBe(5);
      expect(result.projectedDate).toBeInstanceOf(Date);
    });

    it('should return infinity for zero savings rate', () => {
      const result = calculateGoalProjection(500, 1000, 0);
      
      expect(result.isAchieved).toBe(false);
      expect(result.daysRemaining).toBe(Infinity);
      expect(result.projectedDate).toBeNull();
    });
  });

  describe('validateSavingsGoal', () => {
    it('should pass validation for valid goal', () => {
      const goal = {
        name: 'Vacation',
        targetAmount: 5000,
        type: 'vacation'
      };
      
      const result = validateSavingsGoal(goal);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for missing name', () => {
      const goal = {
        name: '',
        targetAmount: 5000,
        type: 'vacation'
      };
      
      const result = validateSavingsGoal(goal);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Goal name is required');
    });

    it('should fail validation for zero target amount', () => {
      const goal = {
        name: 'Test',
        targetAmount: 0,
        type: 'other'
      };
      
      const result = validateSavingsGoal(goal);
      expect(result.isValid).toBe(false);
    });

    it('should fail validation for negative current amount', () => {
      const goal = {
        name: 'Test',
        targetAmount: 1000,
        currentAmount: -100,
        type: 'other'
      };
      
      const result = validateSavingsGoal(goal);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Current amount cannot be negative');
    });
  });

  describe('createSavingsGoal', () => {
    it('should create goal with default values', () => {
      const goal = createSavingsGoal();
      
      expect(goal.name).toBe('');
      expect(goal.type).toBe('other');
      expect(goal.targetAmount).toBe(0);
      expect(goal.currentAmount).toBe(0);
      expect(goal.contributions).toEqual([]);
      expect(goal.createdAt).toBeDefined();
    });

    it('should create goal with provided values', () => {
      const goal = createSavingsGoal({
        name: 'New Car',
        type: 'car',
        targetAmount: 25000,
        currentAmount: 5000
      });
      
      expect(goal.name).toBe('New Car');
      expect(goal.type).toBe('car');
      expect(goal.targetAmount).toBe(25000);
      expect(goal.currentAmount).toBe(5000);
    });
  });

  describe('getMilestones', () => {
    it('should return milestones for target amount', () => {
      const milestones = getMilestones(10000);
      
      expect(milestones).toHaveLength(5);
      expect(milestones[0]).toEqual({ percent: 10, amount: 1000, label: '10% Complete' });
      expect(milestones[2]).toEqual({ percent: 50, amount: 5000, label: '50% Complete' });
      expect(milestones[4]).toEqual({ percent: 100, amount: 10000, label: '100% Complete' });
    });

    it('should return empty array for invalid target', () => {
      expect(getMilestones(0)).toEqual([]);
      expect(getMilestones(-100)).toEqual([]);
    });
  });

  describe('getReachedMilestones', () => {
    it('should return reached milestones', () => {
      const reached = getReachedMilestones(6000, 10000);
      
      expect(reached).toHaveLength(3);
      expect(reached.map(m => m.percent)).toEqual([10, 25, 50]);
    });

    it('should return empty for no progress', () => {
      const reached = getReachedMilestones(0, 10000);
      expect(reached).toHaveLength(0);
    });
  });

  describe('getNextMilestone', () => {
    it('should return next milestone to reach', () => {
      const next = getNextMilestone(3000, 10000);
      
      expect(next.percent).toBe(50);
      expect(next.amount).toBe(5000);
    });

    it('should return null when all milestones reached', () => {
      const next = getNextMilestone(10000, 10000);
      expect(next).toBeNull();
    });
  });

  describe('formatGoalForDisplay', () => {
    it('should format goal with display values', () => {
      const goal = {
        id: 'test',
        name: 'Test Goal',
        type: 'vacation',
        targetAmount: 5000,
        currentAmount: 2500
      };
      
      const formatted = formatGoalForDisplay(goal);
      
      expect(formatted.progress).toBe(50);
      expect(formatted.goalType.id).toBe('vacation');
      expect(formatted.formattedTarget).toBe('$5,000.00');
      expect(formatted.formattedCurrent).toBe('$2,500.00');
      expect(formatted.remaining).toBe(2500);
    });
  });

  describe('sortGoals', () => {
    const goals = [
      { name: 'Beta', targetAmount: 5000, currentAmount: 1000 },
      { name: 'Alpha', targetAmount: 10000, currentAmount: 8000 },
      { name: 'Gamma', targetAmount: 3000, currentAmount: 1500 }
    ];

    it('should sort by name ascending', () => {
      const sorted = sortGoals(goals, 'name', 'asc');
      expect(sorted.map(g => g.name)).toEqual(['Alpha', 'Beta', 'Gamma']);
    });

    it('should sort by progress descending', () => {
      const sorted = sortGoals(goals, 'progress', 'desc');
      expect(sorted[0].name).toBe('Alpha'); // 80% progress
    });

    it('should sort by amount', () => {
      const sorted = sortGoals(goals, 'amount', 'desc');
      expect(sorted[0].name).toBe('Alpha'); // 10000 target
    });

    it('should handle empty array', () => {
      expect(sortGoals([], 'name', 'asc')).toEqual([]);
    });
  });

  describe('calculateTotalSavings', () => {
    it('should calculate totals across all goals', () => {
      const goals = [
        { targetAmount: 5000, currentAmount: 2500 },
        { targetAmount: 10000, currentAmount: 3000 },
        { targetAmount: 3000, currentAmount: 1500 }
      ];
      
      const totals = calculateTotalSavings(goals);
      
      expect(totals.totalSaved).toBe(7000);
      expect(totals.totalTarget).toBe(18000);
      expect(totals.overallProgress).toBeCloseTo(38.89, 1);
    });

    it('should handle empty goals array', () => {
      const totals = calculateTotalSavings([]);
      
      expect(totals.totalSaved).toBe(0);
      expect(totals.totalTarget).toBe(0);
      expect(totals.overallProgress).toBe(0);
    });
  });

  describe('getGoalTypeById', () => {
    it('should return goal type by id', () => {
      const vacation = getGoalTypeById('vacation');
      expect(vacation.name).toBe('Vacation');
      expect(vacation.icon).toBe('✈️');
    });

    it('should return OTHER for unknown type', () => {
      const unknown = getGoalTypeById('unknown');
      expect(unknown.id).toBe('other');
    });
  });

  describe('GOAL_TYPES', () => {
    it('should have all expected goal types', () => {
      expect(GOAL_TYPES.VACATION).toBeDefined();
      expect(GOAL_TYPES.HOME).toBeDefined();
      expect(GOAL_TYPES.CAR).toBeDefined();
      expect(GOAL_TYPES.EMERGENCY).toBeDefined();
      expect(GOAL_TYPES.OTHER).toBeDefined();
    });
  });
});
