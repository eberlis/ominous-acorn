import { useState } from 'react';
import styles from './LocationInput.module.css';

export default function LocationInput({ onLocationSubmit }) {
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }

    setError('');
    onLocationSubmit(location);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="location" className={styles.label}>
            Enter Your Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., New York, NY"
            className={styles.input}
            aria-label="Location input"
          />
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
        </div>
        <button type="submit" className={styles.button}>
          Get Budget Suggestions
        </button>
      </form>
      <p className={styles.hint}>
        Try: New York, NY • Los Angeles, CA • Chicago, IL • Austin, TX • Miami, FL
      </p>
    </div>
  );
}
