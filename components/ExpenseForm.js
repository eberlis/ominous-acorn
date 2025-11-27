import { useState, useEffect } from 'react';
import CategorySelector from './CategorySelector';
import { FREQUENCY_OPTIONS, PAYMENT_METHODS } from '../lib/expenseCategories';
import { suggestCategory, validateExpense, createExpense } from '../lib/expenseUtils';
import { addExpense, updateExpense } from '../lib/expenseStorage';
import styles from './ExpenseForm.module.css';

export default function ExpenseForm({ existingExpense = null, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    amount: '',
    merchant: '',
    category: 'other',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    paymentMethod: 'cash',
    isRecurring: false,
    frequency: 'once'
  });

  const [errors, setErrors] = useState([]);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState(null);

  // Load existing expense if editing
  useEffect(() => {
    if (existingExpense) {
      setFormData({
        amount: existingExpense.amount,
        merchant: existingExpense.merchant,
        category: existingExpense.category,
        date: existingExpense.date,
        notes: existingExpense.notes || '',
        paymentMethod: existingExpense.paymentMethod || 'cash',
        isRecurring: existingExpense.isRecurring || false,
        frequency: existingExpense.frequency || 'once'
      });
    }
  }, [existingExpense]);

  // Suggest category when merchant name changes
  useEffect(() => {
    if (formData.merchant && !existingExpense) {
      const suggested = suggestCategory(formData.merchant);
      if (suggested) {
        setSuggestedCategory(suggested);
      }
    }
  }, [formData.merchant, existingExpense]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setErrors([]);
  };

  const handleCategorySelect = (categoryId) => {
    setFormData(prev => ({ ...prev, category: categoryId }));
    setShowCategorySelector(false);
    setSuggestedCategory(null);
  };

  const applySuggestion = () => {
    if (suggestedCategory) {
      setFormData(prev => ({ ...prev, category: suggestedCategory }));
      setSuggestedCategory(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const validation = validateExpense(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Create or update expense
    const expenseData = createExpense({
      ...formData,
      ...(existingExpense && { id: existingExpense.id })
    });

    const success = existingExpense
      ? updateExpense(existingExpense.id, expenseData)
      : addExpense(expenseData);

    if (success) {
      // Reset form
      setFormData({
        amount: '',
        merchant: '',
        category: 'other',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        paymentMethod: 'cash',
        isRecurring: false,
        frequency: 'once'
      });
      setErrors([]);
      setSuggestedCategory(null);

      if (onSave) {
        onSave(expenseData);
      }
    } else {
      setErrors(['Failed to save expense. Please try again.']);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>
        {existingExpense ? 'Edit Expense' : 'Add New Expense'}
      </h2>

      {errors.length > 0 && (
        <div className={styles.errorBox}>
          {errors.map((error, index) => (
            <p key={index} className={styles.error}>{error}</p>
          ))}
        </div>
      )}

      <div className={styles.formGrid}>
        {/* Amount */}
        <div className={styles.formGroup}>
          <label htmlFor="amount" className={styles.label}>
            Amount <span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={styles.input}
            required
          />
        </div>

        {/* Date */}
        <div className={styles.formGroup}>
          <label htmlFor="date" className={styles.label}>
            Date <span className={styles.required}>*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        {/* Merchant */}
        <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="merchant" className={styles.label}>
            Merchant / Description <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="merchant"
            name="merchant"
            value={formData.merchant}
            onChange={handleChange}
            placeholder="e.g., Starbucks, Whole Foods"
            className={styles.input}
            required
          />
          {suggestedCategory && (
            <button
              type="button"
              onClick={applySuggestion}
              className={styles.suggestionButton}
            >
              💡 Suggested category: {suggestedCategory}
            </button>
          )}
        </div>

        {/* Category */}
        <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
          <label className={styles.label}>
            Category <span className={styles.required}>*</span>
          </label>
          <button
            type="button"
            onClick={() => setShowCategorySelector(!showCategorySelector)}
            className={styles.categoryButton}
          >
            Select Category: {formData.category}
          </button>
          {showCategorySelector && (
            <div className={styles.categorySelector}>
              <CategorySelector
                selectedCategory={formData.category}
                onSelect={handleCategorySelect}
              />
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className={styles.formGroup}>
          <label htmlFor="paymentMethod" className={styles.label}>
            Payment Method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className={styles.select}
          >
            {PAYMENT_METHODS.map(method => (
              <option key={method.value} value={method.value}>
                {method.icon} {method.label}
              </option>
            ))}
          </select>
        </div>

        {/* Recurring Checkbox */}
        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="isRecurring"
              checked={formData.isRecurring}
              onChange={handleChange}
              className={styles.checkbox}
            />
            Recurring Expense
          </label>
        </div>

        {/* Frequency (shown only if recurring) */}
        {formData.isRecurring && (
          <div className={styles.formGroup}>
            <label htmlFor="frequency" className={styles.label}>
              Frequency
            </label>
            <select
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className={styles.select}
            >
              {FREQUENCY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Notes */}
        <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="notes" className={styles.label}>
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional details..."
            className={styles.textarea}
            rows="3"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        )}
        <button type="submit" className={styles.submitButton}>
          {existingExpense ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}
