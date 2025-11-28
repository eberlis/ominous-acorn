import { useState } from 'react';
import { getAllCities } from '../lib/costOfLivingData';
import styles from './LocationInput.module.css';

export default function LocationInput({ onLocationSubmit }) {
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const cities = getAllCities();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!location.trim()) {
      setError('Please select a location');
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
            Select Your Location
          </label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={styles.input}
            aria-label="Location selector"
          >
            <option value="">-- Choose a city --</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
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
        Select a city to get personalized budget suggestions based on local cost of living
      </p>
    </div>
  );
}
