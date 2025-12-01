import { useState, useMemo } from 'react';
import { formatAmount } from '../lib/expenseUtils';
import {
  calculateProgress,
  calculateGoalProjection,
  calculateRecommendedEmergencyFund,
  getGoalTypeById,
  getMilestones,
  getReachedMilestones,
  getNextMilestone,
  calculateTotalSavings,
  formatGoalDate,
  GOAL_TYPES
} from '../lib/savingsUtils';
import styles from './SavingsGoals.module.css';

export default function SavingsGoals({
  goals = [],
  emergencyFund = {},
  monthlyExpenses = 0,
  monthlySavings = 0,
  onAddGoal,
  onEditGoal,
  onDeleteGoal,
  onAddContribution,
  onUpdateEmergencyFund
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [contributionGoalId, setContributionGoalId] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'other',
    targetAmount: '',
    currentAmount: '',
    monthlyTarget: '',
    deadline: '',
    notes: ''
  });

  // Emergency fund form state
  const [emergencyMonths, setEmergencyMonths] = useState(emergencyFund.monthsOfExpenses || 3);
  const [emergencyCurrentAmount, setEmergencyCurrentAmount] = useState(emergencyFund.currentAmount || 0);
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);

  // Calculate recommended emergency fund
  const recommendedEmergency = useMemo(() => {
    return calculateRecommendedEmergencyFund(monthlyExpenses, emergencyMonths);
  }, [monthlyExpenses, emergencyMonths]);

  // Calculate total savings
  const totals = useMemo(() => calculateTotalSavings(goals), [goals]);

  // Emergency fund progress
  const emergencyProgress = useMemo(() => {
    return calculateProgress(
      emergencyFund.currentAmount || 0,
      emergencyFund.targetAmount || recommendedEmergency.recommended
    );
  }, [emergencyFund, recommendedEmergency]);

  // Emergency fund projection
  const emergencyProjection = useMemo(() => {
    return calculateGoalProjection(
      emergencyFund.currentAmount || 0,
      emergencyFund.targetAmount || recommendedEmergency.recommended,
      monthlySavings * 0.3 // Assume 30% of savings go to emergency fund
    );
  }, [emergencyFund, recommendedEmergency, monthlySavings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const goalData = {
      ...formData,
      targetAmount: parseFloat(formData.targetAmount) || 0,
      currentAmount: parseFloat(formData.currentAmount) || 0,
      monthlyTarget: parseFloat(formData.monthlyTarget) || 0
    };

    if (editingGoal) {
      onEditGoal && onEditGoal(editingGoal.id, goalData);
      setEditingGoal(null);
    } else {
      onAddGoal && onAddGoal(goalData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'other',
      targetAmount: '',
      currentAmount: '',
      monthlyTarget: '',
      deadline: '',
      notes: ''
    });
    setShowAddForm(false);
    setEditingGoal(null);
  };

  const handleEdit = (goal) => {
    setFormData({
      name: goal.name || '',
      type: goal.type || 'other',
      targetAmount: goal.targetAmount || '',
      currentAmount: goal.currentAmount || '',
      monthlyTarget: goal.monthlyTarget || '',
      deadline: goal.deadline || '',
      notes: goal.notes || ''
    });
    setEditingGoal(goal);
    setShowAddForm(true);
  };

  const handleContribution = (goalId) => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) return;
    
    onAddContribution && onAddContribution(goalId, parseFloat(contributionAmount));
    setContributionGoalId(null);
    setContributionAmount('');
  };

  const handleEmergencyFundUpdate = (e) => {
    e.preventDefault();
    onUpdateEmergencyFund && onUpdateEmergencyFund({
      targetAmount: recommendedEmergency.recommended,
      currentAmount: parseFloat(emergencyCurrentAmount) || 0,
      monthsOfExpenses: emergencyMonths,
      monthlyExpenses
    });
    setShowEmergencyForm(false);
  };

  return (
    <div className={styles.container}>
      {/* Overview Section */}
      <div className={styles.overview}>
        <div className={styles.overviewCard}>
          <h3 className={styles.overviewLabel}>Total Saved</h3>
          <p className={styles.overviewAmount}>{formatAmount(totals.totalSaved)}</p>
          <p className={styles.overviewSubtext}>
            {formatAmount(totals.totalTarget - totals.totalSaved)} remaining
          </p>
        </div>
        <div className={styles.overviewCard}>
          <h3 className={styles.overviewLabel}>Overall Progress</h3>
          <p className={styles.overviewAmount}>{totals.overallProgress.toFixed(1)}%</p>
          <div className={styles.overviewProgress}>
            <div 
              className={styles.overviewProgressFill} 
              style={{ width: `${totals.overallProgress}%` }}
            />
          </div>
        </div>
        <div className={styles.overviewCard}>
          <h3 className={styles.overviewLabel}>Active Goals</h3>
          <p className={styles.overviewAmount}>{goals.length}</p>
          <p className={styles.overviewSubtext}>savings goals</p>
        </div>
      </div>

      {/* Emergency Fund Section */}
      <div className={styles.emergencySection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🛡️ Emergency Fund</h2>
          <button 
            className={styles.editButton}
            onClick={() => setShowEmergencyForm(!showEmergencyForm)}
          >
            {showEmergencyForm ? 'Cancel' : 'Configure'}
          </button>
        </div>

        {showEmergencyForm ? (
          <form className={styles.emergencyForm} onSubmit={handleEmergencyFundUpdate}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Months of Expenses to Cover</label>
              <div className={styles.monthsSelector}>
                {[3, 4, 5, 6].map(month => (
                  <button
                    key={month}
                    type="button"
                    className={`${styles.monthButton} ${emergencyMonths === month ? styles.monthButtonActive : ''}`}
                    onClick={() => setEmergencyMonths(month)}
                  >
                    {month} months
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Current Amount Saved</label>
              <input
                type="number"
                className={styles.input}
                value={emergencyCurrentAmount}
                onChange={(e) => setEmergencyCurrentAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className={styles.recommendedInfo}>
              <p>Based on your monthly expenses of <strong>{formatAmount(monthlyExpenses)}</strong>:</p>
              <ul>
                <li>Minimum (3 months): {formatAmount(recommendedEmergency.minimum)}</li>
                <li>Recommended ({emergencyMonths} months): {formatAmount(recommendedEmergency.recommended)}</li>
                <li>Maximum (6 months): {formatAmount(recommendedEmergency.maximum)}</li>
              </ul>
            </div>
            <button type="submit" className={styles.submitButton}>
              Save Emergency Fund Settings
            </button>
          </form>
        ) : (
          <div className={styles.emergencyCard}>
            <div className={styles.emergencyHeader}>
              <div>
                <p className={styles.emergencyLabel}>Target ({emergencyFund.monthsOfExpenses || 3} months of expenses)</p>
                <p className={styles.emergencyTarget}>
                  {formatAmount(emergencyFund.targetAmount || recommendedEmergency.recommended)}
                </p>
              </div>
              <div className={styles.emergencyStats}>
                <span className={styles.emergencyCurrent}>
                  {formatAmount(emergencyFund.currentAmount || 0)}
                </span>
                <span className={styles.emergencyPercent}>
                  {emergencyProgress.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className={styles.emergencyProgress}>
              <div 
                className={styles.emergencyProgressFill}
                style={{ width: `${emergencyProgress}%` }}
              />
            </div>
            {!emergencyProjection.isAchieved && emergencyProjection.projectedDate && (
              <p className={styles.emergencyProjection}>
                📅 Projected to reach goal by {formatGoalDate(emergencyProjection.projectedDate)} 
                ({emergencyProjection.monthsRemaining} months)
              </p>
            )}
            {emergencyProjection.isAchieved && (
              <p className={styles.emergencyComplete}>
                🎉 Emergency fund goal reached!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Savings Goals Section */}
      <div className={styles.goalsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>💰 Savings Goals</h2>
          <button 
            className={styles.addButton}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : '+ Add Goal'}
          </button>
        </div>

        {/* Add/Edit Goal Form */}
        {showAddForm && (
          <form className={styles.goalForm} onSubmit={handleSubmit}>
            <h3 className={styles.formTitle}>
              {editingGoal ? 'Edit Goal' : 'New Savings Goal'}
            </h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="goalName" className={styles.label}>Goal Name *</label>
              <input
                type="text"
                id="goalName"
                name="name"
                className={styles.input}
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Summer Vacation"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Goal Type *</label>
              <div className={styles.typeSelector}>
                {Object.values(GOAL_TYPES).map(type => (
                  <button
                    key={type.id}
                    type="button"
                    className={`${styles.typeButton} ${formData.type === type.id ? styles.typeButtonActive : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                    style={{ 
                      borderColor: formData.type === type.id ? type.color : 'transparent',
                      backgroundColor: formData.type === type.id ? `${type.color}15` : 'transparent'
                    }}
                  >
                    <span className={styles.typeIcon}>{type.icon}</span>
                    <span className={styles.typeName}>{type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="targetAmount" className={styles.label}>Target Amount *</label>
                <input
                  type="number"
                  id="targetAmount"
                  name="targetAmount"
                  className={styles.input}
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="currentAmount" className={styles.label}>Current Amount</label>
                <input
                  type="number"
                  id="currentAmount"
                  name="currentAmount"
                  className={styles.input}
                  value={formData.currentAmount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="monthlyTarget" className={styles.label}>Monthly Target</label>
                <input
                  type="number"
                  id="monthlyTarget"
                  name="monthlyTarget"
                  className={styles.input}
                  value={formData.monthlyTarget}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="deadline" className={styles.label}>Target Date</label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  className={styles.input}
                  value={formData.deadline}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="notes" className={styles.label}>Notes</label>
              <textarea
                id="notes"
                name="notes"
                className={styles.textarea}
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any notes about this goal..."
                rows="3"
              />
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.cancelButton} onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className={styles.submitButton}>
                {editingGoal ? 'Update Goal' : 'Create Goal'}
              </button>
            </div>
          </form>
        )}

        {/* Goals List */}
        {goals.length === 0 && !showAddForm ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyIcon}>🎯</p>
            <p className={styles.emptyText}>No savings goals yet</p>
            <p className={styles.emptySubtext}>
              Create your first goal to start tracking your savings!
            </p>
          </div>
        ) : (
          <div className={styles.goalsList}>
            {goals.map(goal => {
              const goalType = getGoalTypeById(goal.type);
              const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
              const projection = calculateGoalProjection(
                goal.currentAmount,
                goal.targetAmount,
                goal.monthlyTarget || monthlySavings
              );
              const milestones = getMilestones(goal.targetAmount);
              const reachedMilestones = getReachedMilestones(goal.currentAmount, goal.targetAmount);
              const nextMilestone = getNextMilestone(goal.currentAmount, goal.targetAmount);

              return (
                <div key={goal.id} className={styles.goalCard}>
                  <div className={styles.goalHeader}>
                    <div className={styles.goalInfo}>
                      <span 
                        className={styles.goalIcon}
                        style={{ backgroundColor: `${goalType.color}20` }}
                      >
                        {goalType.icon}
                      </span>
                      <div>
                        <h3 className={styles.goalName}>{goal.name}</h3>
                        <p className={styles.goalType}>{goalType.name}</p>
                      </div>
                    </div>
                    <div className={styles.goalActions}>
                      <button 
                        className={styles.iconButton}
                        onClick={() => handleEdit(goal)}
                        aria-label="Edit goal"
                      >
                        ✏️
                      </button>
                      <button 
                        className={styles.iconButton}
                        onClick={() => onDeleteGoal && onDeleteGoal(goal.id)}
                        aria-label="Delete goal"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className={styles.goalAmounts}>
                    <div className={styles.amountCurrent}>
                      <span className={styles.amountLabel}>Saved</span>
                      <span className={styles.amountValue}>{formatAmount(goal.currentAmount)}</span>
                    </div>
                    <div className={styles.amountTarget}>
                      <span className={styles.amountLabel}>Target</span>
                      <span className={styles.amountValue}>{formatAmount(goal.targetAmount)}</span>
                    </div>
                  </div>

                  <div className={styles.goalProgress}>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ 
                          width: `${progress}%`,
                          backgroundColor: goalType.color
                        }}
                      />
                      {/* Milestone markers */}
                      {milestones.map(milestone => (
                        <div
                          key={milestone.percent}
                          className={`${styles.milestone} ${reachedMilestones.includes(milestone) ? styles.milestoneReached : ''}`}
                          style={{ left: `${milestone.percent}%` }}
                          title={`${milestone.percent}% - ${formatAmount(milestone.amount)}`}
                        />
                      ))}
                    </div>
                    <div className={styles.progressStats}>
                      <span className={styles.progressPercent}>{progress.toFixed(1)}%</span>
                      <span className={styles.progressRemaining}>
                        {formatAmount(goal.targetAmount - goal.currentAmount)} to go
                      </span>
                    </div>
                  </div>

                  {/* Milestones info */}
                  {reachedMilestones.length > 0 && (
                    <div className={styles.milestonesReached}>
                      <span className={styles.milestoneLabel}>🏆 Milestones reached:</span>
                      <span className={styles.milestoneList}>
                        {reachedMilestones.map(m => `${m.percent}%`).join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Next milestone */}
                  {nextMilestone && (
                    <div className={styles.nextMilestone}>
                      <span className={styles.milestoneLabel}>🎯 Next milestone:</span>
                      <span>{nextMilestone.percent}% ({formatAmount(nextMilestone.amount - goal.currentAmount)} away)</span>
                    </div>
                  )}

                  {/* Projection */}
                  {!projection.isAchieved && projection.projectedDate && goal.monthlyTarget > 0 && (
                    <p className={styles.goalProjection}>
                      📅 Projected completion: {formatGoalDate(projection.projectedDate)}
                    </p>
                  )}

                  {projection.isAchieved && (
                    <p className={styles.goalComplete}>
                      🎉 Goal reached! Congratulations!
                    </p>
                  )}

                  {/* Deadline warning */}
                  {goal.deadline && new Date(goal.deadline) < new Date() && !projection.isAchieved && (
                    <p className={styles.deadlinePassed}>
                      ⚠️ Target date has passed
                    </p>
                  )}

                  {/* Add contribution */}
                  {contributionGoalId === goal.id ? (
                    <div className={styles.contributionForm}>
                      <input
                        type="number"
                        className={styles.contributionInput}
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(e.target.value)}
                        placeholder="Amount"
                        min="0"
                        step="0.01"
                      />
                      <button 
                        className={styles.contributionSubmit}
                        onClick={() => handleContribution(goal.id)}
                      >
                        Add
                      </button>
                      <button 
                        className={styles.contributionCancel}
                        onClick={() => setContributionGoalId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      className={styles.addContributionButton}
                      onClick={() => setContributionGoalId(goal.id)}
                    >
                      + Add Contribution
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
