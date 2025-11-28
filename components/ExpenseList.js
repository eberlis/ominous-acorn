import { useState, useMemo } from 'react';
import { getCategoryById, CATEGORIES_LIST, PAYMENT_METHODS } from '../lib/expenseCategories';
import { formatAmount, formatDate, filterExpenses, sortExpenses } from '../lib/expenseUtils';
import { deleteExpense } from '../lib/expenseStorage';
import styles from './ExpenseList.module.css';

export default function ExpenseList({ expenses = [], onEdit, onDelete, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Apply filters and sorting
  const filteredAndSorted = useMemo(() => {
    const filters = {
      search: searchTerm,
      category: categoryFilter,
      paymentMethod: paymentFilter,
      startDate: dateRange.start,
      endDate: dateRange.end
    };

    const filtered = filterExpenses(expenses, filters);
    return sortExpenses(filtered, sortField, sortOrder);
  }, [expenses, searchTerm, categoryFilter, paymentFilter, dateRange, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
      if (onDelete) onDelete(id);
      if (onRefresh) onRefresh();
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setPaymentFilter('');
    setDateRange({ start: '', end: '' });
  };

  const hasFilters = searchTerm || categoryFilter || paymentFilter || dateRange.start || dateRange.end;

  return (
    <div className={styles.container}>
      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={styles.select}
        >
          <option value="">All Categories</option>
          {CATEGORIES_LIST.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className={styles.select}
        >
          <option value="">All Payment Methods</option>
          {PAYMENT_METHODS.map(method => (
            <option key={method.value} value={method.value}>
              {method.icon} {method.label}
            </option>
          ))}
        </select>

        <div className={styles.dateRange}>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className={styles.dateInput}
            placeholder="Start date"
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className={styles.dateInput}
            placeholder="End date"
          />
        </div>

        {hasFilters && (
          <button onClick={clearFilters} className={styles.clearButton}>
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className={styles.resultInfo}>
        Showing {filteredAndSorted.length} of {expenses.length} expenses
      </div>

      {/* Expense List */}
      {filteredAndSorted.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No expenses found</p>
          {hasFilters && <p>Try adjusting your filters</p>}
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th onClick={() => handleSort('date')} className={styles.sortable}>
                  Date {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('merchant')} className={styles.sortable}>
                  Merchant {sortField === 'merchant' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Category</th>
                <th onClick={() => handleSort('amount')} className={styles.sortable}>
                  Amount {sortField === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map((expense) => {
                const category = getCategoryById(expense.category);
                const paymentMethod = PAYMENT_METHODS.find(m => m.value === expense.paymentMethod);
                
                return (
                  <tr key={expense.id} className={styles.row}>
                    <td>{formatDate(expense.date, 'short')}</td>
                    <td>
                      <div className={styles.merchantCell}>
                        <span className={styles.merchantName}>{expense.merchant}</span>
                        {expense.notes && (
                          <span className={styles.notes} title={expense.notes}>
                            📝 {expense.notes.substring(0, 30)}
                            {expense.notes.length > 30 ? '...' : ''}
                          </span>
                        )}
                        {expense.isRecurring && (
                          <span className={styles.badge}>🔄 {expense.frequency}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span 
                        className={styles.category}
                        style={{ color: category.color }}
                      >
                        {category.icon} {category.name}
                      </span>
                    </td>
                    <td className={styles.amount}>{formatAmount(expense.amount)}</td>
                    <td>
                      <span className={styles.payment}>
                        {paymentMethod?.icon} {paymentMethod?.label}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        {onEdit && (
                          <button
                            onClick={() => onEdit(expense)}
                            className={styles.editButton}
                            title="Edit"
                          >
                            ✏️
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className={styles.deleteButton}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
