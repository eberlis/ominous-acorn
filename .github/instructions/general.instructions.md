---
applyTo: '**'
---

# General Project Guidelines

## Development Workflow

### 1. Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: New features (e.g., `feature/user-authentication`)
- `bugfix/*`: Bug fixes (e.g., `bugfix/login-error`)
- `hotfix/*`: Urgent production fixes (e.g., `hotfix/security-patch`)

### 2. Pull Request Guidelines

**Before creating a PR:**
- [ ] Code is tested and working
- [ ] All tests pass
- [ ] Code follows project conventions
- [ ] No console logs or debug code
- [ ] Documentation is updated
- [ ] Commits are clean and meaningful

**PR Description should include:**
- Summary of changes
- Related issue numbers
- Screenshots (for UI changes)
- Testing instructions
- Breaking changes (if any)

### 3. Code Review Process

**As a reviewer:**
- Check for code quality and readability
- Verify tests are adequate
- Look for potential bugs or edge cases
- Ensure accessibility standards are met
- Check for performance implications
- Verify security best practices

**As an author:**
- Respond to all comments
- Make requested changes or discuss alternatives
- Keep PR scope focused and manageable
- Update PR description if scope changes

## Project Setup

### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd codespaces-nextjs

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

### Environment Files

- `.env.local`: Local development (gitignored)
- `.env.development`: Development environment
- `.env.production`: Production environment
- `.env.example`: Template with all required variables (committed)

## Dependency Management

### Adding Dependencies

```bash
# Production dependency
npm install package-name

# Development dependency
npm install --save-dev package-name
```

**Before adding a new dependency:**
1. Check if similar functionality exists in current dependencies
2. Verify package is actively maintained
3. Check bundle size impact
4. Review security vulnerabilities
5. Document why it's needed

### Keeping Dependencies Updated

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Update to latest versions (be careful)
npm install package-name@latest
```

## File Organization

### Component Organization

```javascript
// ✅ Good: Clear structure
components/
├── Button/
│   ├── Button.js
│   ├── Button.module.css
│   ├── Button.test.js
│   └── index.js          # Re-export for cleaner imports
├── Card/
│   ├── Card.js
│   ├── Card.module.css
│   └── index.js

// ✅ Also acceptable for simple components
components/
├── Button.js
├── Button.module.css
├── Card.js
└── Card.module.css
```

### Utility Functions

```javascript
// lib/utils/
├── date.js           // Date formatting utilities
├── string.js         // String manipulation
├── validation.js     // Input validation
├── api.js           // API client utilities
└── index.js         // Re-export all utilities
```

## Code Style

### Variables and Constants

```javascript
// ✅ Good
const API_URL = process.env.NEXT_PUBLIC_API_URL
const MAX_RETRY_ATTEMPTS = 3
const userData = await fetchUser(id)
const isAuthenticated = !!user
const hasPermission = user?.role === 'admin'

// ❌ Bad
const x = process.env.NEXT_PUBLIC_API_URL
const max = 3
const data = await fetchUser(id)
const auth = !!user
```

### Functions

```javascript
// ✅ Good: Descriptive names, single responsibility
const calculateTotalPrice = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0)
}

const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

// ❌ Bad: Unclear names, doing too much
const calc = (items) => {
  let sum = 0
  for (let i = 0; i < items.length; i++) {
    sum += items[i].price
  }
  return '$' + sum.toFixed(2)
}
```

### Async/Await

```javascript
// ✅ Good: Clear error handling
const loadUserData = async (userId) => {
  try {
    const user = await fetchUser(userId)
    const posts = await fetchUserPosts(userId)
    return { user, posts }
  } catch (error) {
    console.error('Failed to load user data:', error)
    throw new Error('Unable to load user data')
  }
}

// ❌ Bad: No error handling
const loadUserData = async (userId) => {
  const user = await fetchUser(userId)
  const posts = await fetchUserPosts(userId)
  return { user, posts }
}
```

### Conditional Rendering

```javascript
// ✅ Good: Clear and readable
const UserProfile = ({ user }) => {
  if (!user) {
    return <Loading />
  }
  
  if (user.error) {
    return <Error message={user.error} />
  }
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
    </div>
  )
}

// ❌ Bad: Nested ternaries
const UserProfile = ({ user }) => {
  return !user ? <Loading /> : user.error ? <Error /> : (
    <div>
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
    </div>
  )
}
```

## Performance Guidelines

### 1. Avoid Unnecessary Re-renders

```javascript
// ✅ Good: Memoized component
import { memo } from 'react'

const ExpensiveComponent = memo(({ data }) => {
  return <div>{/* Complex rendering */}</div>
})

// ✅ Good: Memoized callback
const ParentComponent = () => {
  const handleClick = useCallback(() => {
    // Handler logic
  }, [])
  
  return <ChildComponent onClick={handleClick} />
}
```

### 2. Optimize Data Fetching

```javascript
// ✅ Good: Parallel requests
const loadData = async () => {
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments()
  ])
  return { users, posts, comments }
}

// ❌ Bad: Sequential requests
const loadData = async () => {
  const users = await fetchUsers()
  const posts = await fetchPosts()
  const comments = await fetchComments()
  return { users, posts, comments }
}
```

### 3. Code Splitting

```javascript
// ✅ Good: Dynamic import for large components
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('@/components/Chart'), {
  loading: () => <Spinner />,
  ssr: false
})

// Use in component
export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Chart data={chartData} />
    </div>
  )
}
```

## Security Guidelines

### 1. Input Sanitization

```javascript
// ✅ Good: Sanitize user input
import DOMPurify from 'isomorphic-dompurify'

const SafeContent = ({ html }) => {
  const cleanHTML = DOMPurify.sanitize(html)
  return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
}
```

### 2. Environment Variables

```javascript
// ✅ Good: Public variables prefixed
NEXT_PUBLIC_API_URL=https://api.example.com

// ✅ Good: Private variables (server-side only)
DATABASE_URL=postgresql://...
API_SECRET_KEY=...

// ❌ Bad: Exposing secrets
NEXT_PUBLIC_SECRET_KEY=...  // Don't do this!
```

### 3. Authentication

```javascript
// ✅ Good: Secure token storage
// Store JWT in httpOnly cookie (server-side)
// Don't store sensitive tokens in localStorage

// ✅ Good: Validate on every request
const protectedPage = async (context) => {
  const session = await getSession(context)
  
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }
  
  return {
    props: { session }
  }
}
```

## Debugging

### Console Logging

```javascript
// ✅ Development only
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}

// ✅ Use proper logging levels
console.log('Info')
console.warn('Warning')
console.error('Error')

// ❌ Never commit
console.log('Testing 123')
```

### Error Boundaries

```javascript
// components/ErrorBoundary.js
import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // Log to error reporting service
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }
    
    return this.props.children
  }
}

export default ErrorBoundary
```

## Documentation

### Code Comments

```javascript
// ✅ Good: Explain WHY, not WHAT
// Using setTimeout instead of setInterval to prevent overlapping requests
// if the API is slow to respond
setTimeout(fetchData, 5000)

// ❌ Bad: Obvious comments
// Set user to null
user = null
```

### README Documentation

Your README should include:
- Project description
- Prerequisites
- Installation steps
- Environment variables
- Available scripts
- Project structure
- Contributing guidelines
- License information

## Troubleshooting Common Issues

### Port Already in Use

```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or use different port
npm run dev -- -p 3001
```

### Module Not Found

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear npm cache
npm cache clean --force
```

### Build Errors

```bash
# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint

# Build locally to debug
npm run build
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [MDN Web Docs](https://developer.mozilla.org)
- [Web.dev](https://web.dev)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref)
