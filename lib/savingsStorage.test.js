/**
 * @jest-environment jsdom
 */

import {
  saveSavingsGoals,
  loadSavingsGoals,
  addSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  addContribution,
  saveEmergencyFund,
  loadEmergencyFund,
  clearAllSavingsData,
  exportSavingsToJSON,
  importSavingsFromJSON
} from './savingsStorage';

describe('savingsStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('saveSavingsGoals', () => {
    it('should save goals to localStorage', () => {
      const goals = [
        { id: 'goal_1', name: 'Vacation', targetAmount: 5000 }
      ];
      
      const result = saveSavingsGoals(goals);
      
      expect(result).toBe(true);
      const stored = JSON.parse(localStorage.getItem('ominous_acorn_savings_goals'));
      expect(stored.goals).toEqual(goals);
    });
  });

  describe('loadSavingsGoals', () => {
    it('should return empty array when no goals exist', () => {
      const goals = loadSavingsGoals();
      expect(goals).toEqual([]);
    });

    it('should load goals from localStorage', () => {
      const testGoals = [{ id: 'goal_1', name: 'Test' }];
      localStorage.setItem('ominous_acorn_savings_goals', JSON.stringify({
        version: '1.0.0',
        goals: testGoals
      }));

      const goals = loadSavingsGoals();
      expect(goals).toEqual(testGoals);
    });
  });

  describe('addSavingsGoal', () => {
    it('should add a new goal', () => {
      const goal = {
        name: 'New Car',
        targetAmount: 20000,
        currentAmount: 5000
      };

      const result = addSavingsGoal(goal);
      expect(result).toBe(true);

      const goals = loadSavingsGoals();
      expect(goals.length).toBe(1);
      expect(goals[0].name).toBe('New Car');
      expect(goals[0].targetAmount).toBe(20000);
      expect(goals[0].id).toBeDefined();
      expect(goals[0].createdAt).toBeDefined();
    });
  });

  describe('updateSavingsGoal', () => {
    it('should update an existing goal', () => {
      addSavingsGoal({
        id: 'goal_test',
        name: 'Test Goal',
        targetAmount: 1000
      });

      const result = updateSavingsGoal('goal_test', { targetAmount: 2000 });
      expect(result).toBe(true);

      const goals = loadSavingsGoals();
      expect(goals[0].targetAmount).toBe(2000);
      expect(goals[0].updatedAt).toBeDefined();
    });

    it('should return false for non-existent goal', () => {
      const result = updateSavingsGoal('nonexistent', { targetAmount: 2000 });
      expect(result).toBe(false);
    });
  });

  describe('deleteSavingsGoal', () => {
    it('should delete a goal', () => {
      addSavingsGoal({ id: 'goal_to_delete', name: 'Delete Me' });
      expect(loadSavingsGoals().length).toBe(1);

      const result = deleteSavingsGoal('goal_to_delete');
      expect(result).toBe(true);
      expect(loadSavingsGoals().length).toBe(0);
    });
  });

  describe('addContribution', () => {
    it('should add contribution to a goal', () => {
      addSavingsGoal({
        id: 'goal_contribution',
        name: 'Contribution Test',
        currentAmount: 100
      });

      const result = addContribution('goal_contribution', 50);
      expect(result).toBe(true);

      const goals = loadSavingsGoals();
      expect(goals[0].currentAmount).toBe(150);
      expect(goals[0].contributions.length).toBe(1);
      expect(goals[0].contributions[0].amount).toBe(50);
    });
  });

  describe('saveEmergencyFund', () => {
    it('should save emergency fund settings', () => {
      const settings = {
        targetAmount: 15000,
        currentAmount: 5000,
        monthsOfExpenses: 4
      };

      const result = saveEmergencyFund(settings);
      expect(result).toBe(true);
    });
  });

  describe('loadEmergencyFund', () => {
    it('should return default values when no data exists', () => {
      const fund = loadEmergencyFund();
      
      expect(fund.targetAmount).toBe(0);
      expect(fund.currentAmount).toBe(0);
      expect(fund.monthsOfExpenses).toBe(3);
    });

    it('should load saved emergency fund settings', () => {
      saveEmergencyFund({
        targetAmount: 20000,
        currentAmount: 8000,
        monthsOfExpenses: 5
      });

      const fund = loadEmergencyFund();
      expect(fund.targetAmount).toBe(20000);
      expect(fund.currentAmount).toBe(8000);
      expect(fund.monthsOfExpenses).toBe(5);
    });
  });

  describe('clearAllSavingsData', () => {
    it('should clear all savings data', () => {
      addSavingsGoal({ name: 'Test' });
      saveEmergencyFund({ targetAmount: 1000 });

      const result = clearAllSavingsData();
      expect(result).toBe(true);
      expect(loadSavingsGoals()).toEqual([]);
    });
  });

  describe('exportSavingsToJSON', () => {
    it('should export savings data as JSON', () => {
      addSavingsGoal({ id: 'export_test', name: 'Export Test' });
      saveEmergencyFund({ targetAmount: 10000 });

      const json = exportSavingsToJSON();
      expect(json).toBeDefined();

      const data = JSON.parse(json);
      expect(data.savingsGoals.length).toBe(1);
      expect(data.emergencyFund.targetAmount).toBe(10000);
      expect(data.exportDate).toBeDefined();
    });
  });

  describe('importSavingsFromJSON', () => {
    it('should import savings data from JSON', () => {
      const importData = JSON.stringify({
        savingsGoals: [{ id: 'import_1', name: 'Imported Goal' }],
        emergencyFund: { targetAmount: 15000, currentAmount: 3000 }
      });

      const result = importSavingsFromJSON(importData);
      expect(result.success).toBe(true);

      const goals = loadSavingsGoals();
      expect(goals.length).toBe(1);
      expect(goals[0].name).toBe('Imported Goal');
    });

    it('should handle invalid JSON', () => {
      const result = importSavingsFromJSON('invalid json');
      expect(result.success).toBe(false);
    });
  });
});
