import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import SavingsGoals from '../components/SavingsGoals';
import {
  loadSavingsGoals,
  saveSavingsGoals,
  addSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  addContribution,
  loadEmergencyFund,
  saveEmergencyFund,
  exportSavingsToJSON,
  importSavingsFromJSON
} from '../lib/savingsStorage';
import { loadExpenses } from '../lib/expenseStorage';
import { calculateTotal, getExpensesByPeriod } from '../lib/expenseUtils';
import styles from '../styles/savings.module.css';

export default function Savings() {
  const [goals, setGoals] = useState([]);
  const [emergencyFund, setEmergencyFund] = useState({});
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(500); // Default value
  const [showSettings, setShowSettings] = useState(false);

  // Load data on mount
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    // Load savings goals
    const loadedGoals = loadSavingsGoals();
    setGoals(loadedGoals);

    // Load emergency fund
    const loadedEmergencyFund = loadEmergencyFund();
    setEmergencyFund(loadedEmergencyFund);

    // Calculate monthly expenses from expense data
    const expenses = loadExpenses();
    const monthlyExpensesList = getExpensesByPeriod(expenses, 'month');
    const total = calculateTotal(monthlyExpensesList);
    setMonthlyExpenses(total);

    // Update emergency fund monthly expenses
    if (total > 0 && loadedEmergencyFund.monthlyExpenses !== total) {
      const updatedEmergencyFund = {
        ...loadedEmergencyFund,
        monthlyExpenses: total
      };
      saveEmergencyFund(updatedEmergencyFund);
      setEmergencyFund(updatedEmergencyFund);
    }
  };

  const handleAddGoal = (goalData) => {
    addSavingsGoal(goalData);
    refreshData();
  };

  const handleEditGoal = (goalId, updates) => {
    updateSavingsGoal(goalId, updates);
    refreshData();
  };

  const handleDeleteGoal = (goalId) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteSavingsGoal(goalId);
      refreshData();
    }
  };

  const handleAddContribution = (goalId, amount) => {
    addContribution(goalId, amount);
    refreshData();
  };

  const handleUpdateEmergencyFund = (settings) => {
    saveEmergencyFund(settings);
    setEmergencyFund(settings);
  };

  const handleExport = () => {
    const json = exportSavingsToJSON();
    if (!json) {
      alert('Failed to export savings data');
      return;
    }

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `savings-${new Date().toISOString().split('T')[0]}.json`;
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
      const result = importSavingsFromJSON(event.target.result);
      if (result.success) {
        alert(result.message);
        refreshData();
      } else {
        alert(`Import failed: ${result.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <>
      <Head>
        <title>Savings Goals - Financial Planner</title>
        <meta name="description" content="Track your savings goals and emergency fund" />
      </Head>

      <div className={styles.container}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>🏠 Home</Link>
          <Link href="/expenses" className={styles.navLink}>💰 Expenses</Link>
          <Link href="/savings" className={styles.navLink}>🎯 Savings</Link>
        </nav>

        <header className={styles.header}>
          <h1 className={styles.title}>🎯 Savings Goals</h1>
          <p className={styles.subtitle}>
            Track your savings and build financial security
          </p>
        </header>

        {/* Settings Bar */}
        <div className={styles.settingsBar}>
          <div className={styles.settingsInfo}>
            <span className={styles.settingsLabel}>Monthly Savings Target:</span>
            {showSettings ? (
              <input
                type="number"
                className={styles.settingsInput}
                value={monthlySavings}
                onChange={(e) => setMonthlySavings(parseFloat(e.target.value) || 0)}
                min="0"
                step="10"
              />
            ) : (
              <span className={styles.settingsValue}>${monthlySavings.toLocaleString()}</span>
            )}
            <button 
              className={styles.settingsToggle}
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? 'Done' : 'Edit'}
            </button>
          </div>
          <div className={styles.settingsActions}>
            <button onClick={handleExport} className={styles.actionButton}>
              📥 Export
            </button>
            <label className={styles.actionButton}>
              📤 Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className={styles.fileInput}
              />
            </label>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          <SavingsGoals
            goals={goals}
            emergencyFund={emergencyFund}
            monthlyExpenses={monthlyExpenses}
            monthlySavings={monthlySavings}
            onAddGoal={handleAddGoal}
            onEditGoal={handleEditGoal}
            onDeleteGoal={handleDeleteGoal}
            onAddContribution={handleAddContribution}
            onUpdateEmergencyFund={handleUpdateEmergencyFund}
          />
        </div>

        {/* Tips Section */}
        <div className={styles.tipsSection}>
          <h3 className={styles.tipsTitle}>💡 Savings Tips</h3>
          <ul className={styles.tipsList}>
            <li>Start with an emergency fund covering 3-6 months of expenses</li>
            <li>Set specific, measurable goals with deadlines</li>
            <li>Automate your savings by setting up recurring transfers</li>
            <li>Track your progress regularly to stay motivated</li>
            <li>Celebrate milestones to maintain momentum</li>
          </ul>
        </div>
      </div>
    </>
  );
}
