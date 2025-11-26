---
applyTo: '**'
---

# General Coding Best Practices

## Code Quality Principles

### 1. Readability and Maintainability
- Write self-documenting code with clear, descriptive names for variables, functions, and classes
- Keep functions small and focused on a single responsibility (Single Responsibility Principle)
- Use meaningful comments for complex logic, but prefer clear code over excessive comments
- Follow consistent formatting and indentation throughout the codebase
- Limit line length to 80-120 characters for better readability

### 2. DRY (Don't Repeat Yourself)
- Extract repeated code into reusable functions or components
- Create utility functions for common operations
- Use constants for repeated values
- Avoid copy-paste programming

### 3. Error Handling
- Always handle errors gracefully with try-catch blocks or error boundaries
- Provide meaningful error messages that help with debugging
- Validate inputs at function boundaries
- Use proper error types and custom error classes when appropriate
- Never silently swallow errors without logging

### 4. Security Best Practices
- Never commit sensitive data (API keys, passwords, tokens) to version control
- Use environment variables for configuration
- Validate and sanitize all user inputs
- Implement proper authentication and authorization
- Keep dependencies up to date to patch security vulnerabilities
- Use HTTPS for all external communications

### 5. Performance Optimization
- Avoid premature optimization; measure before optimizing
- Use efficient data structures and algorithms
- Implement lazy loading and code splitting where appropriate
- Minimize unnecessary re-renders in React components
- Optimize database queries and use proper indexing
- Use caching strategies for expensive operations

## Language-Specific Best Practices

### JavaScript/TypeScript
- Use `const` by default, `let` when reassignment is needed, avoid `var`
- Prefer arrow functions for callbacks and short functions
- Use async/await over raw promises for better readability
- Leverage TypeScript for type safety when available
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Destructure objects and arrays for cleaner code
- Use template literals for string interpolation

### React/Next.js
- Use functional components with hooks instead of class components
- Keep components small and composable
- Use proper component naming (PascalCase)
- Implement proper prop validation with PropTypes or TypeScript
- Use React.memo() for expensive components that don't need frequent re-renders
- Follow the rules of hooks (only call at top level, only in React functions)
- Use CSS Modules or styled-components for scoped styling
- Implement proper SEO with Next.js Head component
- Use Next.js Image component for optimized images
- Leverage Server-Side Rendering (SSR) and Static Generation appropriately

### CSS
- Use semantic class names that describe purpose, not appearance
- Follow BEM or similar naming convention for consistency
- Prefer CSS Grid and Flexbox over floats and absolute positioning
- Use CSS custom properties (variables) for theming
- Keep specificity low to avoid override issues
- Use mobile-first responsive design approach
- Avoid inline styles; prefer CSS modules or styled-components

## Testing Best Practices

### General Testing Principles
- Write tests for all critical functionality
- Follow the AAA pattern: Arrange, Act, Assert
- Keep tests independent and isolated
- Use descriptive test names that explain what is being tested
- Test edge cases and error conditions
- Aim for high code coverage but focus on meaningful tests
- Use mocks and stubs appropriately to isolate units
- Run tests in CI/CD pipeline before merging
- Keep tests fast and reliable

### Test Types and When to Use Them

#### 1. Unit Tests
Test individual functions and components in isolation.

**Example: Testing a Utility Function**
```javascript
// lib/utils/formatDate.js
export function formatDate(date, format = 'MM/DD/YYYY') {
  if (!date) return '';
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  
  return format
    .replace('MM', month)
    .replace('DD', day)
    .replace('YYYY', year);
}

// lib/utils/formatDate.test.js
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('should format date in MM/DD/YYYY format by default', () => {
    const date = new Date('2025-11-26');
    expect(formatDate(date)).toBe('11/26/2025');
  });

  it('should handle custom format', () => {
    const date = new Date('2025-11-26');
    expect(formatDate(date, 'YYYY-MM-DD')).toBe('2025-11-26');
  });

  it('should return empty string for null date', () => {
    expect(formatDate(null)).toBe('');
  });

  it('should handle invalid date', () => {
    expect(formatDate('invalid')).toBe('NaN/NaN/NaN');
  });
});
```

**Example: Testing a React Component**
```javascript
// components/Button/Button.js
import styles from './Button.module.css';

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  type = 'button'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${styles[variant]}`}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
    </button>
  );
}

// components/Button/Button.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('should render with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply variant class', () => {
    const { container } = render(<Button variant="secondary">Click me</Button>);
    const button = container.querySelector('button');
    expect(button.className).toContain('secondary');
  });

  it('should have correct accessibility attributes', () => {
    render(<Button>Submit</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Submit');
  });
});
```

#### 2. Integration Tests
Test how multiple units work together.

**Example: Testing Component Integration**
```javascript
// components/LoginForm/LoginForm.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';
import { login } from '@/lib/api/auth';

jest.mock('@/lib/api/auth');

describe('LoginForm Integration', () => {
  it('should handle successful login flow', async () => {
    const mockUser = { id: 1, email: 'user@example.com' };
    login.mockResolvedValue({ success: true, user: mockUser });
    
    const onSuccess = jest.fn();
    render(<LoginForm onSuccess={onSuccess} />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    // Verify API call
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123'
      });
    });
    
    // Verify success callback
    expect(onSuccess).toHaveBeenCalledWith(mockUser);
  });

  it('should display error message on failed login', async () => {
    login.mockRejectedValue(new Error('Invalid credentials'));
    
    render(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
```

#### 3. End-to-End Tests
Test complete user workflows using tools like Cypress or Playwright.

**Example: E2E Test with Playwright**
```javascript
// tests/e2e/login.spec.js
import { test, expect } from '@playwright/test';

test.describe('User Login Flow', () => {
  test('should allow user to login successfully', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Fill in credentials
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Verify user is logged in
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Verify error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
    
    // Verify still on login page
    await expect(page).toHaveURL('/login');
  });
});
```

#### 4. Accessibility Tests
Ensure WCAG compliance using tools like jest-axe.

**Example: Accessibility Testing**
```javascript
// components/Button/Button.a11y.test.js
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Button from './Button';

expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes when disabled', async () => {
    const { container } = render(<Button disabled>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Testing Custom Hooks

**Example: Testing a Custom Hook**
```javascript
// lib/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// lib/hooks/useLocalStorage.test.js
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
  });

  it('should retrieve value from localStorage on mount', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('stored');
  });
});
```

### Test Coverage Guidelines
- Aim for **80%+ code coverage** for critical paths
- **100% coverage** for utility functions and helpers
- Focus on **meaningful tests** over coverage metrics
- Test **happy paths** and **error scenarios**
- Test **edge cases** and **boundary conditions**

### Testing Tools Recommendations
- **Unit/Integration**: Jest + React Testing Library
- **E2E**: Playwright or Cypress
- **Accessibility**: jest-axe
- **API Testing**: MSW (Mock Service Worker)
- **Coverage**: Jest built-in coverage
- **Visual Regression**: Percy or Chromatic

## Version Control Best Practices

### Git Workflow
- Write clear, descriptive commit messages using conventional commits format
- Make small, atomic commits that address one concern
- Keep commits focused on a single feature or fix
- Use feature branches and pull requests for code review
- Never commit directly to main/master branch
- Rebase feature branches to keep history clean
- Use `.gitignore` to exclude generated files and dependencies

### Commit Message Format
```
type(scope): subject

body

footer
```
Types: feat, fix, docs, style, refactor, test, chore

## Code Review Guidelines

### For Authors
- Keep pull requests small and focused
- Provide context in PR descriptions
- Self-review your code before requesting review
- Respond to feedback promptly and professionally
- Add tests for new functionality

### For Reviewers
- Be constructive and respectful in feedback
- Focus on code quality, not personal preferences
- Check for security issues and performance concerns
- Verify tests are included and passing
- Approve only when confident in the changes

## Documentation

### Code Documentation
- Document public APIs and interfaces
- Use JSDoc comments for functions with parameters
- Keep README files up to date with setup and usage instructions
- Document architectural decisions in ADR (Architecture Decision Records)
- Include examples in documentation

### Project Documentation
- Maintain a clear README with:
  - Project description and purpose
  - Installation instructions
  - Usage examples
  - Contributing guidelines
  - License information
- Document environment variables and configuration
- Keep API documentation current

## Accessibility (a11y)

- Use semantic HTML elements (`<nav>`, `<main>`, `<article>`, etc.)
- Provide alt text for images
- Ensure proper heading hierarchy (h1-h6)
- Implement keyboard navigation support
- Maintain sufficient color contrast ratios
- Use ARIA labels and roles when necessary
- Test with screen readers

## Project Structure

### General Organization Principles
- Organize files by feature or domain, not by type
- Keep related files close together
- Use consistent naming conventions across the project
- Separate concerns (presentation, logic, data)
- Create clear module boundaries
- Use index files to simplify imports

### Next.js Project Structure Example
```
project-root/
├── .github/
│   ├── workflows/          # CI/CD workflows
│   └── instructions/       # AI coding guidelines
├── public/                 # Static assets
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
├── src/
│   ├── app/               # Next.js 13+ app directory
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── [feature]/     # Feature-based routes
│   ├── components/        # Reusable components
│   │   ├── common/        # Shared UI components
│   │   │   ├── Button/
│   │   │   │   ├── Button.js
│   │   │   │   ├── Button.test.js
│   │   │   │   ├── Button.module.css
│   │   │   │   └── index.js
│   │   │   └── Input/
│   │   └── features/      # Feature-specific components
│   │       ├── auth/
│   │       └── dashboard/
│   ├── lib/               # Utility functions and helpers
│   │   ├── api/           # API client functions
│   │   ├── utils/         # Generic utilities
│   │   ├── hooks/         # Custom React hooks
│   │   └── constants.js
│   ├── styles/            # Global styles
│   │   ├── globals.css
│   │   └── variables.css
│   ├── types/             # TypeScript type definitions
│   └── config/            # Configuration files
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example           # Environment variables template
├── .env.local             # Local environment variables (gitignored)
├── .eslintrc.js
├── .prettierrc
├── jest.config.js
├── next.config.js
├── package.json
└── README.md
```

### Component File Organization
Each component should have its own directory containing:
- Component file (`ComponentName.js` or `ComponentName.tsx`)
- Test file (`ComponentName.test.js`)
- Styles (`ComponentName.module.css` or styled-components)
- Index file for cleaner imports (`index.js`)
- Types file if using TypeScript (`ComponentName.types.ts`)

### Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.js`, `NavigationBar.js`)
- **Utilities/Hooks**: camelCase (e.g., `formatDate.js`, `useAuth.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `MAX_RETRIES`)
- **CSS Modules**: ComponentName.module.css
- **Test Files**: ComponentName.test.js or ComponentName.spec.js

## Dependencies Management

- Keep dependencies minimal and justified
- Regularly update dependencies for security patches
- Use exact versions or lock files (package-lock.json, yarn.lock)
- Audit dependencies for vulnerabilities regularly
- Remove unused dependencies
- Prefer well-maintained packages with active communities

## Development Workflow

- Use linters (ESLint) and formatters (Prettier) consistently
- Set up pre-commit hooks to enforce code quality
- Automate testing in CI/CD pipeline
- Use environment-specific configurations
- Implement logging for debugging and monitoring
- Use debugging tools instead of console.log in production code

## Environment Variables

### Best Practices
- Never commit `.env` files with sensitive data
- Provide `.env.example` with all required variables
- Use different `.env` files for different environments
- Validate required environment variables at startup
- Document all environment variables in README

### Example .env Structure
```bash
# .env.example
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
API_SECRET_KEY=your-secret-key-here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# External Services
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### Loading Environment Variables
```javascript
// config/env.js
const requiredEnvVars = [
  'NEXT_PUBLIC_API_URL',
  'DATABASE_URL',
  'NEXTAUTH_SECRET'
];

export function validateEnv() {
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  databaseUrl: process.env.DATABASE_URL,
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};
```

## Error Handling Patterns

### API Error Handling
```javascript
// lib/api/client.js
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiClient(endpoint, options = {}) {
  try {
    const response = await fetch(`${config.apiUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(
        error.message || 'An error occurred',
        response.status,
        error
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error occurred', 0, error);
  }
}
```

### React Error Boundaries
```javascript
// components/ErrorBoundary/ErrorBoundary.js
import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Performance Optimization Patterns

### Code Splitting and Lazy Loading
```javascript
// Lazy load components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Disable server-side rendering if needed
});

// Lazy load with named exports
const Chart = dynamic(
  () => import('@/components/Chart').then(mod => mod.Chart),
  { ssr: false }
);
```

### React Optimization Techniques
```javascript
// Use React.memo for expensive components
import { memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  // Complex rendering logic
  return <div>{/* ... */}</div>;
}, (prevProps, nextProps) => {
  // Custom comparison function
  return prevProps.data.id === nextProps.data.id;
});

// Use useMemo for expensive calculations
import { useMemo } from 'react';

function DataTable({ data, filters }) {
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Expensive filtering logic
      return filters.every(filter => filter(item));
    });
  }, [data, filters]);

  return <table>{/* render filteredData */}</table>;
}

// Use useCallback for function props
import { useCallback } from 'react';

function ParentComponent() {
  const handleClick = useCallback((id) => {
    // Handle click logic
    console.log('Clicked:', id);
  }, []); // Dependencies array

  return <ChildComponent onClick={handleClick} />;
}
```

### Image Optimization
```javascript
// Use Next.js Image component
import Image from 'next/image';

export function OptimizedImage({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      loading="lazy"
      quality={85}
    />
  );
}
```

## Code Quality Tools Configuration

### ESLint Configuration
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  plugins: ['@typescript-eslint', 'react-hooks'],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': 'error',
    'prefer-const': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
```

### Prettier Configuration
```javascript
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid"
}
```

### Husky Pre-commit Hooks
```json
// package.json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "format": "prettier --write .",
    "test": "jest",
    "test:coverage": "jest --coverage"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "jest --bail --findRelatedTests"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  }
}
```

## Monitoring and Logging

### Structured Logging
```javascript
// lib/logger.js
const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

class Logger {
  constructor(context) {
    this.context = context;
  }

  log(level, message, meta = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      ...meta,
    };

    if (process.env.NODE_ENV === 'production') {
      // Send to logging service
      // logToService(logEntry);
    } else {
      console[level](logEntry);
    }
  }

  error(message, error, meta = {}) {
    this.log(LOG_LEVELS.ERROR, message, {
      ...meta,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
    });
  }

  warn(message, meta) {
    this.log(LOG_LEVELS.WARN, message, meta);
  }

  info(message, meta) {
    this.log(LOG_LEVELS.INFO, message, meta);
  }

  debug(message, meta) {
    this.log(LOG_LEVELS.DEBUG, message, meta);
  }
}

export function createLogger(context) {
  return new Logger(context);
}
```

## Additional Considerations

### Mobile Responsiveness
- Design mobile-first, then enhance for larger screens
- Use responsive breakpoints consistently
- Test on multiple devices and screen sizes
- Consider touch interactions and gestures
- Optimize for performance on mobile networks

### SEO Best Practices
- Use semantic HTML and proper heading hierarchy
- Implement proper meta tags (title, description, OG tags)
- Generate sitemap.xml and robots.txt
- Use Next.js Image component for optimized images
- Implement structured data (JSON-LD)
- Ensure fast page load times (Core Web Vitals)

### Internationalization (i18n)
- Plan for multi-language support from the start
- Use i18n libraries (next-intl, react-i18next)
- Externalize all user-facing strings
- Consider RTL (right-to-left) languages
- Format dates, numbers, and currencies based on locale

### State Management
- Use React Context for simple state sharing
- Consider Zustand or Redux for complex state
- Keep state as local as possible
- Use server state management (React Query, SWR) for API data
- Implement optimistic updates for better UX

### API Design
- Follow RESTful conventions or use GraphQL
- Version your APIs (e.g., `/api/v1/`)
- Implement proper HTTP status codes
- Use pagination for large datasets
- Implement rate limiting
- Document APIs with OpenAPI/Swagger

### Deployment
- Use CI/CD pipelines for automated deployments
- Implement staging environments
- Use feature flags for gradual rollouts
- Monitor application health and errors
- Set up automated backups
- Implement rollback strategies