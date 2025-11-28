import { useMemo } from 'react';
import { calculateTotal, groupByCategory, formatAmount, getExpensesByPeriod } from '../lib/expenseUtils';
import { getCategoryById } from '../lib/expenseCategories';
import styles from './ExpenseSummary.module.css';

export default function ExpenseSummary({ expenses = [], period = 'month' }) {
  // Filter expenses by period
  const periodExpenses = useMemo(() => {
    return getExpensesByPeriod(expenses, period);
  }, [expenses, period]);

  // Calculate totals
  const total = useMemo(() => calculateTotal(periodExpenses), [periodExpenses]);

  // Group by category
  const byCategory = useMemo(() => {
    const grouped = groupByCategory(periodExpenses);
    return Object.values(grouped).sort((a, b) => b.total - a.total);
  }, [periodExpenses]);

  // Calculate percentages
  const categoriesWithPercentage = useMemo(() => {
    return byCategory.map(item => ({
      ...item,
      percentage: total > 0 ? (item.total / total) * 100 : 0
    }));
  }, [byCategory, total]);

  // Top 5 categories
  const topCategories = categoriesWithPercentage.slice(0, 5);

  return (
    <div className={styles.container}>
      {/* Total Overview */}
      <div className={styles.totalCard}>
        <h3 className={styles.totalLabel}>Total Spending</h3>
        <p className={styles.totalAmount}>{formatAmount(total)}</p>
        <p className={styles.periodLabel}>
          {period === 'today' && 'Today'}
          {period === 'week' && 'Last 7 Days'}
          {period === 'month' && 'Last 30 Days'}
          {period === 'year' && 'Last Year'}
        </p>
        <p className={styles.transactionCount}>
          {periodExpenses.length} transaction{periodExpenses.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Category Breakdown */}
      {byCategory.length > 0 ? (
        <div className={styles.breakdown}>
          <h3 className={styles.sectionTitle}>Spending by Category</h3>
          
          {/* Top Categories */}
          <div className={styles.topCategories}>
            {topCategories.map((item, index) => (
              <div key={item.category.id} className={styles.categoryItem}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryIcon}>
                    {item.category.icon}
                  </span>
                  <span className={styles.categoryName}>
                    {item.category.name}
                  </span>
                  <span className={styles.categoryAmount}>
                    {formatAmount(item.total)}
                  </span>
                </div>
                
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${item.percentage}%`,
                      background: item.category.color
                    }}
                  />
                </div>
                
                <div className={styles.categoryStats}>
                  <span className={styles.percentage}>
                    {item.percentage.toFixed(1)}%
                  </span>
                  <span className={styles.count}>
                    {item.expenses.length} transaction{item.expenses.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* All Categories Summary */}
          {byCategory.length > 5 && (
            <details className={styles.allCategories}>
              <summary className={styles.showMore}>
                Show all {byCategory.length} categories
              </summary>
              <div className={styles.categoriesList}>
                {categoriesWithPercentage.slice(5).map((item) => (
                  <div key={item.category.id} className={styles.categoryRow}>
                    <span className={styles.categoryIcon}>
                      {item.category.icon}
                    </span>
                    <span className={styles.categoryName}>
                      {item.category.name}
                    </span>
                    <span className={styles.categoryAmount}>
                      {formatAmount(item.total)}
                    </span>
                    <span className={styles.percentage}>
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No expenses for this period</p>
        </div>
      )}

      {/* Quick Stats */}
      {periodExpenses.length > 0 && (
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Average per Transaction</span>
            <span className={styles.statValue}>
              {formatAmount(total / periodExpenses.length)}
            </span>
          </div>
          
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Highest Expense</span>
            <span className={styles.statValue}>
              {formatAmount(Math.max(...periodExpenses.map(e => parseFloat(e.amount))))}
            </span>
          </div>
          
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Most Frequent Category</span>
            <span className={styles.statValue}>
              {topCategories[0]?.category.icon} {topCategories[0]?.category.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
