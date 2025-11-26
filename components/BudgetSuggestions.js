import { useState, useEffect } from 'react';
import styles from './BudgetSuggestions.module.css';

export default function BudgetSuggestions({ locationData, onReset }) {
  const [adjustedBudget, setAdjustedBudget] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (locationData) {
      setAdjustedBudget({ ...locationData.budget });
    }
  }, [locationData]);

  if (!locationData || !adjustedBudget) {
    return null;
  }

  const categories = [
    { key: 'housing', label: 'Housing', icon: '🏠' },
    { key: 'food', label: 'Food & Groceries', icon: '🍎' },
    { key: 'transportation', label: 'Transportation', icon: '🚗' },
    { key: 'utilities', label: 'Utilities', icon: '💡' },
    { key: 'entertainment', label: 'Entertainment & Leisure', icon: '🎭' },
    { key: 'healthcare', label: 'Healthcare', icon: '⚕️' },
    { key: 'other', label: 'Other Expenses', icon: '📦' }
  ];

  const totalBudget = Object.values(adjustedBudget).reduce((sum, val) => sum + val, 0);

  const handleValueChange = (category, value) => {
    const numValue = parseFloat(value) || 0;
    setAdjustedBudget(prev => ({
      ...prev,
      [category]: numValue
    }));
  };

  const resetToOriginal = () => {
    setAdjustedBudget({ ...locationData.budget });
    setIsEditing(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>
            Budget Suggestions for {locationData.city}, {locationData.state}
          </h2>
          <p className={styles.subtitle}>
            Based on average cost of living data
          </p>
        </div>
        <button onClick={onReset} className={styles.resetButton}>
          Change Location
        </button>
      </div>

      <div className={styles.totalCard}>
        <div className={styles.totalLabel}>Total Monthly Budget</div>
        <div className={styles.totalAmount}>
          ${totalBudget.toLocaleString()}
        </div>
      </div>

      <div className={styles.controls}>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={styles.editButton}
        >
          {isEditing ? 'Done Editing' : 'Adjust Budget'}
        </button>
        {isEditing && (
          <button
            onClick={resetToOriginal}
            className={styles.secondaryButton}
          >
            Reset to Suggested
          </button>
        )}
      </div>

      <div className={styles.budgetGrid}>
        {categories.map(({ key, label, icon }) => (
          <div key={key} className={styles.budgetCard}>
            <div className={styles.cardHeader}>
              <span className={styles.icon}>{icon}</span>
              <h3 className={styles.categoryLabel}>{label}</h3>
            </div>
            <div className={styles.cardBody}>
              {isEditing ? (
                <div className={styles.editContainer}>
                  <span className={styles.dollarSign}>$</span>
                  <input
                    type="number"
                    value={adjustedBudget[key]}
                    onChange={(e) => handleValueChange(key, e.target.value)}
                    className={styles.editInput}
                    min="0"
                    step="10"
                  />
                </div>
              ) : (
                <div className={styles.amount}>
                  ${adjustedBudget[key].toLocaleString()}
                </div>
              )}
              <div className={styles.percentage}>
                {((adjustedBudget[key] / totalBudget) * 100).toFixed(1)}% of total
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.disclaimer}>
        <p>
          💡 <strong>Note:</strong> These suggestions are based on average cost of living data 
          and may vary based on your specific circumstances. Feel free to adjust any category 
          to match your personal situation.
        </p>
      </div>
    </div>
  );
}
