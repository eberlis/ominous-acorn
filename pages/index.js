import { useState } from 'react'
import Link from 'next/link'
import LocationInput from '../components/LocationInput'
import BudgetSuggestions from '../components/BudgetSuggestions'
import styles from '../styles/home.module.css'

function Home() {
  const [locationData, setLocationData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLocationSubmit = async (location) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/cost-of-living?location=${encodeURIComponent(location)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch cost of living data')
      }

      setLocationData(data)
    } catch (err) {
      setError(err.message)
      setLocationData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setLocationData(null)
    setError('')
  }

  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>🏠 Home</Link>
        <Link href="/expenses" className={styles.navLink}>💰 Expenses</Link>
      </nav>
      
      <div className={styles.header}>
        <h1 className={styles.title}>💰 Smart Budget Planner</h1>
        <p className={styles.description}>
          Get personalized budget suggestions based on your location's cost of living
        </p>
      </div>

      {!locationData ? (
        <div className={styles.content}>
          <LocationInput onLocationSubmit={handleLocationSubmit} />
          
          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Fetching cost of living data...</p>
            </div>
          )}

          {error && (
            <div className={styles.errorBox}>
              <p>❌ {error}</p>
            </div>
          )}
        </div>
      ) : (
        <BudgetSuggestions 
          locationData={locationData} 
          onReset={handleReset}
        />
      )}
    </main>
  )
}

export default Home
