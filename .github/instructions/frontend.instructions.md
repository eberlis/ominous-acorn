---
applyTo: '**'
---

# Next.js Frontend Coding Standards & Best Practices

## Project Overview
This is a Next.js application using:
- **Next.js**: ^14.2.32
- **React**: ^18.2.0
- **CSS Modules**: For component styling

## Project Structure

```
/workspaces/codespaces-nextjs/
├── .github/
│   └── instructions/          # Project guidelines and instructions
├── components/                # Reusable React components
│   ├── ComponentName.js
│   └── ComponentName.module.css
├── pages/                     # Next.js pages (file-based routing)
│   ├── _app.js               # Custom App component
│   ├── index.js              # Home page
│   └── api/                  # API routes (if needed)
├── styles/                    # Global and page-specific styles
│   ├── home.module.css
│   └── [page].module.css
├── public/                    # Static assets (images, fonts, etc.)
├── lib/                       # Utility functions and helpers
├── hooks/                     # Custom React hooks
├── global.css                 # Global styles
└── package.json
```

## Coding Standards

### 1. Component Guidelines

#### File Naming
- **Components**: PascalCase (e.g., `Button.js`, `UserProfile.js`)
- **CSS Modules**: Match component name with `.module.css` extension (e.g., `Button.module.css`)
- **Pages**: lowercase or kebab-case (e.g., `index.js`, `about.js`, `user-profile.js`)
- **Utilities**: camelCase (e.g., `formatDate.js`, `apiClient.js`)

#### Component Structure
```javascript
// Import external dependencies first
import { useState, useEffect } from 'react'
import Link from 'next/link'

// Import internal components
import Button from '@/components/Button'

// Import styles last
import styles from './ComponentName.module.css'

// Component definition
export default function ComponentName({ prop1, prop2 }) {
  // 1. Hooks at the top
  const [state, setState] = useState(initialValue)
  
  // 2. Effects and side effects
  useEffect(() => {
    // Effect logic
  }, [dependencies])
  
  // 3. Event handlers and helper functions
  const handleClick = () => {
    // Handler logic
  }
  
  // 4. Early returns for conditional rendering
  if (!data) return <div>Loading...</div>
  
  // 5. Main render
  return (
    <div className={styles.container}>
      {/* Component JSX */}
    </div>
  )
}
```

### 2. React Best Practices

#### Props and PropTypes
- **Destructure props** in function parameters for clarity
- Use **default parameters** when appropriate
- Consider adding PropTypes or TypeScript for type safety

```javascript
// Good
export default function Button({ 
  children, 
  variant = 'primary', 
  onClick,
  disabled = false 
}) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={styles[variant]}
    >
      {children}
    </button>
  )
}
```

#### State Management
- Use `useState` for local component state
- Use `useReducer` for complex state logic
- Keep state as close to where it's used as possible
- Lift state up only when necessary

#### Performance Optimization
- Use `React.memo()` for expensive components
- Use `useMemo()` for expensive calculations
- Use `useCallback()` for function references passed as props
- Implement code splitting with `dynamic()` for large components

```javascript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false // Disable server-side rendering if needed
})
```

### 3. CSS Modules Best Practices

#### Naming Conventions
- Use **camelCase** for class names in CSS Modules
- Use **semantic names** that describe purpose, not appearance
- Prefix utility classes with their function (e.g., `marginTop`, `flexCenter`)

```css
/* Button.module.css */
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.primary {
  background-color: #0070f3;
  color: white;
}

.secondary {
  background-color: #eaeaea;
  color: #333;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

#### Global Styles
- Use `global.css` for:
  - CSS reset/normalize
  - Root CSS variables
  - Typography base styles
  - Global utility classes (sparingly)

```css
/* global.css */
:root {
  --primary-color: #0070f3;
  --secondary-color: #666;
  --background: #ffffff;
  --text-color: #333;
  --spacing-unit: 0.25rem;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--text-color);
}
```

### 4. Next.js Specific Guidelines

#### Pages
- Each file in `/pages` becomes a route automatically
- Use `getStaticProps` for static generation (SSG)
- Use `getServerSideProps` for server-side rendering (SSR)
- Use `getStaticPaths` for dynamic routes with SSG

```javascript
// pages/blog/[slug].js
export async function getStaticProps({ params }) {
  const post = await fetchPost(params.slug)
  
  return {
    props: { post },
    revalidate: 60 // ISR: revalidate every 60 seconds
  }
}

export async function getStaticPaths() {
  const posts = await fetchAllPosts()
  
  return {
    paths: posts.map(post => ({ params: { slug: post.slug } })),
    fallback: 'blocking'
  }
}
```

#### Image Optimization
- Always use `next/image` instead of `<img>` tags
- Specify width and height to prevent layout shift
- Use appropriate `priority` prop for above-the-fold images

```javascript
import Image from 'next/image'

<Image
  src="/images/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority
  placeholder="blur"
/>
```

#### Link Navigation
- Use `next/link` for internal navigation
- Use `prefetch={false}` for links that shouldn't be prefetched

```javascript
import Link from 'next/link'

<Link href="/about">
  <a className={styles.link}>About Us</a>
</Link>
```

### 5. Code Quality Standards

#### Naming Conventions
- **Variables/Functions**: camelCase (e.g., `userData`, `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`, `MAX_RETRIES`)
- **Components**: PascalCase (e.g., `UserCard`, `NavBar`)
- **Boolean variables**: Prefix with `is`, `has`, `should` (e.g., `isLoading`, `hasError`)

#### Functions
- Keep functions small and focused (single responsibility)
- Use descriptive names that indicate what the function does
- Prefer arrow functions for non-component functions
- Use async/await over promises for better readability

```javascript
// Good
const fetchUserData = async (userId) => {
  try {
    const response = await fetch(`/api/users/${userId}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw error
  }
}
```

#### Error Handling
- Always handle errors in async operations
- Provide user-friendly error messages
- Log errors for debugging
- Use error boundaries for React component errors

```javascript
import { useState } from 'react'

export default function DataFetcher() {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await fetchData()
      // Process data
    } catch (err) {
      setError('Failed to load data. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }
  
  if (error) return <div className={styles.error}>{error}</div>
  if (isLoading) return <div className={styles.loading}>Loading...</div>
  
  return <div>Content</div>
}
```

### 6. Accessibility Standards

- Use **semantic HTML** elements (`<nav>`, `<main>`, `<article>`, `<button>`)
- Include **alt text** for all images
- Ensure proper **heading hierarchy** (h1 → h2 → h3)
- Add **ARIA labels** when semantic HTML isn't enough
- Test keyboard navigation (Tab, Enter, Space, Escape)
- Maintain proper **color contrast** ratios (WCAG AA: 4.5:1 for text)

```javascript
// Good accessibility example
<button
  onClick={handleClick}
  aria-label="Close modal"
  disabled={isDisabled}
>
  <span aria-hidden="true">×</span>
</button>

<nav aria-label="Main navigation">
  <ul>
    <li><Link href="/">Home</Link></li>
    <li><Link href="/about">About</Link></li>
  </ul>
</nav>
```

### 7. Performance Best Practices

- **Minimize bundle size**: Use dynamic imports for large components
- **Optimize images**: Use WebP format, proper sizing, and lazy loading
- **Reduce re-renders**: Use React.memo, useMemo, useCallback appropriately
- **Code splitting**: Split routes and lazy load components
- **API optimization**: Implement caching, debouncing, and pagination

### 8. Git Commit Conventions

Use conventional commits format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(components): add UserProfile component with avatar support

fix(api): handle null response in fetchUserData

refactor(Button): simplify props and improve accessibility
```

## Environment & Configuration

### Environment Variables
- Store in `.env.local` (never commit this file)
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Document all required environment variables in `.env.example`

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://localhost:5432/mydb
SECRET_KEY=your-secret-key
```

### Scripts
```json
{
  "dev": "next dev",           // Development server
  "build": "next build",       // Production build
  "start": "next start",       // Production server
  "lint": "next lint",         // Run ESLint
  "format": "prettier --write ."  // Format code
}
```

## Testing Guidelines

- Write unit tests for utility functions
- Write integration tests for API routes
- Write component tests for complex components
- Aim for meaningful test coverage, not 100% coverage
- Use descriptive test names: `it('should render error message when fetch fails')`

## Documentation

- Add JSDoc comments for complex functions
- Document component props and their types
- Keep README.md updated with setup instructions
- Document API endpoints and their responses
- Add inline comments for complex logic only

```javascript
/**
 * Formats a date string to a human-readable format
 * @param {string} dateString - ISO 8601 date string
 * @param {string} locale - Locale code (default: 'en-US')
 * @returns {string} Formatted date string
 */
const formatDate = (dateString, locale = 'en-US') => {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
```

## Review Checklist

Before committing code, ensure:
- [ ] Code follows naming conventions
- [ ] Components are properly structured
- [ ] CSS Modules are used correctly
- [ ] No console.logs in production code
- [ ] Proper error handling is implemented
- [ ] Accessibility guidelines are followed
- [ ] Images are optimized
- [ ] Code is formatted and linted
- [ ] No hardcoded values (use constants or env variables)
- [ ] Responsive design is implemented
- [ ] Browser compatibility is considered