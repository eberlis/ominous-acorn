import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseSummary from '../components/ExpenseSummary';
import { loadExpenses, exportExpensesToJSON, importExpensesFromJSON } from '../lib/expenseStorage';
import styles from '../styles/expenses.module.css';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [editingExpense, setEditingExpense] = useState(null);
  const [period, setPeriod] = useState('month');

  // Load expenses on mount
  useEffect(() => {
    refreshExpenses();
  }, []);

  const refreshExpenses = () => {
    const loaded = loadExpenses();
    setExpenses(loaded);
  };

  const handleSave = () => {
    refreshExpenses();
    setEditingExpense(null);
    setActiveTab('all');
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setActiveTab('add');
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setActiveTab('all');
  };

  const handleExport = () => {
    const json = exportExpensesToJSON();
    if (!json) {
      alert('Failed to export expenses');
      return;
    }

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = importExpensesFromJSON(event.target.result);
      if (result.success) {
        alert(result.message);
        refreshExpenses();
      } else {
        alert(`Import failed: ${result.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset file input
  };

  return (
    <>
      <Head>
        <title>Expense Tracking - Financial Planner</title>
        <meta name="description" content="Track and categorize your expenses" />
      </Head>

      <div className={styles.container}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>🏠 Home</Link>
          <Link href="/expenses" className={styles.navLink}>💰 Expenses</Link>
        </nav>
        
        <header className={styles.header}>
          <h1 className={styles.title}>💰 Expense Tracking</h1>
          <p className={styles.subtitle}>
            Track, categorize, and analyze your spending
          </p>
        </header>

        {/* Tab Navigation */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('all')}
          >
            📋 All Expenses ({expenses.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'add' ? styles.activeTab : ''}`}
            onClick={() => {
              setEditingExpense(null);
              setActiveTab('add');
            }}
          >
            ➕ Add New
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'summary' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            📊 Summary
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.content}>
          {activeTab === 'all' && (
            <div className={styles.listTab}>
              <div className={styles.listActions}>
                <button onClick={handleExport} className={styles.actionButton}>
                  📥 Export Data
                </button>
                <label className={styles.actionButton}>
                  📤 Import Data
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className={styles.fileInput}
                  />
                </label>
              </div>
              <ExpenseList
                expenses={expenses}
                onEdit={handleEdit}
                onRefresh={refreshExpenses}
              />
            </div>
          )}

          {activeTab === 'add' && (
            <ExpenseForm
              existingExpense={editingExpense}
              onSave={handleSave}
              onCancel={handleCancelEdit}
            />
          )}

          {activeTab === 'summary' && (
            <div className={styles.summaryTab}>
              <div className={styles.periodSelector}>
                <label>Time Period:</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className={styles.periodSelect}
                >
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
              <ExpenseSummary expenses={expenses} period={period} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
