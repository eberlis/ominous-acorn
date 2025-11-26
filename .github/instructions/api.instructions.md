---
applyTo: 'pages/api/**'
---

# API Routes Best Practices

## Overview
Next.js API routes provide a solution to build your API within your Next.js app. Any file inside `pages/api` is mapped to `/api/*` and treated as an API endpoint.

## File Structure

```
pages/
└── api/
    ├── hello.js              # GET /api/hello
    ├── users/
    │   ├── index.js         # GET/POST /api/users
    │   └── [id].js          # GET/PUT/DELETE /api/users/:id
    └── auth/
        ├── login.js         # POST /api/auth/login
        └── logout.js        # POST /api/auth/logout
```

## API Route Template

```javascript
// pages/api/users/[id].js
export default async function handler(req, res) {
  const { method, query, body } = req
  const { id } = query

  // Handle different HTTP methods
  switch (method) {
    case 'GET':
      return handleGet(req, res, id)
    case 'PUT':
      return handlePut(req, res, id, body)
    case 'DELETE':
      return handleDelete(req, res, id)
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      return res.status(405).json({ error: `Method ${method} Not Allowed` })
  }
}

async function handleGet(req, res, id) {
  try {
    const user = await fetchUser(id)
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    return res.status(200).json({ data: user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function handlePut(req, res, id, body) {
  try {
    // Validate request body
    if (!body.name || !body.email) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    
    const updatedUser = await updateUser(id, body)
    return res.status(200).json({ data: updatedUser })
  } catch (error) {
    console.error('Error updating user:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function handleDelete(req, res, id) {
  try {
    await deleteUser(id)
    return res.status(204).end()
  } catch (error) {
    console.error('Error deleting user:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
```

## Best Practices

### 1. HTTP Methods & Status Codes

**Use appropriate HTTP methods:**
- `GET`: Retrieve data (should be idempotent)
- `POST`: Create new resources
- `PUT`: Update existing resources (full update)
- `PATCH`: Partial update of resources
- `DELETE`: Remove resources

**Use correct status codes:**
- `200 OK`: Successful GET, PUT, PATCH
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource doesn't exist
- `405 Method Not Allowed`: HTTP method not supported
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server errors

### 2. Request Validation

```javascript
// lib/validation.js
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function validateUser(data) {
  const errors = {}
  
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
  }
  
  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Invalid email address'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// pages/api/users/index.js
import { validateUser } from '@/lib/validation'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { isValid, errors } = validateUser(req.body)
    
    if (!isValid) {
      return res.status(422).json({ errors })
    }
    
    // Process valid data
  }
}
```

### 3. Error Handling

```javascript
// lib/apiError.js
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
  }
}

// lib/apiHandler.js
export function withErrorHandling(handler) {
  return async (req, res) => {
    try {
      await handler(req, res)
    } catch (error) {
      console.error('API Error:', error)
      
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({ error: error.message })
      }
      
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}

// Usage
export default withErrorHandling(async (req, res) => {
  if (req.method !== 'GET') {
    throw new ApiError(405, 'Method not allowed')
  }
  
  const data = await fetchData()
  res.status(200).json({ data })
})
```

### 4. Authentication & Authorization

```javascript
// lib/auth.js
import jwt from 'jsonwebtoken'

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}

export function requireAuth(handler) {
  return async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' })
    }
    
    const user = verifyToken(token)
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' })
    }
    
    req.user = user
    return handler(req, res)
  }
}

// Usage
export default requireAuth(async (req, res) => {
  const userId = req.user.id
  // Protected route logic
})
```

### 5. Rate Limiting

```javascript
// lib/rateLimit.js
const requests = new Map()

export function rateLimit({ interval = 60000, limit = 10 } = {}) {
  return (handler) => {
    return async (req, res) => {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
      const now = Date.now()
      const windowStart = now - interval
      
      const userRequests = requests.get(ip) || []
      const recentRequests = userRequests.filter(time => time > windowStart)
      
      if (recentRequests.length >= limit) {
        return res.status(429).json({ 
          error: 'Too many requests',
          retryAfter: Math.ceil((recentRequests[0] + interval - now) / 1000)
        })
      }
      
      recentRequests.push(now)
      requests.set(ip, recentRequests)
      
      return handler(req, res)
    }
  }
}

// Usage
export default rateLimit({ limit: 5, interval: 60000 })(async (req, res) => {
  // Handler logic
})
```

### 6. CORS Configuration

```javascript
// lib/cors.js
export function cors(handler) {
  return async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.setHeader('Access-Control-Max-Age', '86400')
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }
    
    return handler(req, res)
  }
}
```

### 7. Response Format

**Consistent response structure:**

```javascript
// Success response
{
  "data": { /* resource data */ },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}

// Error response
{
  "error": "Error message",
  "errors": {
    "field1": "Field-specific error",
    "field2": "Another error"
  }
}

// List response with pagination
{
  "data": [ /* array of resources */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### 8. Database Queries

```javascript
// lib/db.js
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export async function query(text, params) {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  
  console.log('Executed query', { text, duration, rows: res.rowCount })
  return res
}

// Usage in API route
import { query } from '@/lib/db'

export default async function handler(req, res) {
  try {
    const result = await query(
      'SELECT * FROM users WHERE id = $1',
      [req.query.id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.status(200).json({ data: result.rows[0] })
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Database error' })
  }
}
```

### 9. Caching

```javascript
// lib/cache.js
const cache = new Map()

export function withCache(handler, ttl = 60000) {
  return async (req, res) => {
    const key = req.url
    const cached = cache.get(key)
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      res.setHeader('X-Cache', 'HIT')
      return res.status(200).json(cached.data)
    }
    
    // Store original json method
    const originalJson = res.json.bind(res)
    
    // Override json method to cache response
    res.json = (data) => {
      if (res.statusCode === 200) {
        cache.set(key, { data, timestamp: Date.now() })
      }
      res.setHeader('X-Cache', 'MISS')
      return originalJson(data)
    }
    
    return handler(req, res)
  }
}
```

### 10. Logging

```javascript
// lib/logger.js
export function logRequest(req) {
  console.log({
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    userAgent: req.headers['user-agent']
  })
}

// Use in API routes
export default async function handler(req, res) {
  logRequest(req)
  // Handler logic
}
```

## Security Best Practices

1. **Never expose sensitive data** in API responses
2. **Validate and sanitize all inputs** to prevent injection attacks
3. **Use HTTPS** in production
4. **Implement rate limiting** to prevent abuse
5. **Use environment variables** for secrets
6. **Sanitize error messages** - don't expose internal details
7. **Use parameterized queries** to prevent SQL injection
8. **Implement CSRF protection** for state-changing operations
9. **Set security headers** (Content-Security-Policy, X-Frame-Options, etc.)
10. **Keep dependencies updated** to patch security vulnerabilities

## Testing API Routes

```javascript
// __tests__/api/users.test.js
import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/users'

describe('/api/users', () => {
  it('should return users list', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    })
    
    await handler(req, res)
    
    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toHaveProperty('data')
  })
  
  it('should return 405 for unsupported methods', async () => {
    const { req, res } = createMocks({
      method: 'PATCH',
    })
    
    await handler(req, res)
    
    expect(res._getStatusCode()).toBe(405)
  })
})
```

## Documentation

Document your API endpoints:

```javascript
/**
 * @api {get} /api/users/:id Get User
 * @apiName GetUser
 * @apiGroup Users
 * 
 * @apiParam {Number} id User's unique ID
 * 
 * @apiSuccess {Object} data User object
 * @apiSuccess {Number} data.id User ID
 * @apiSuccess {String} data.name User name
 * @apiSuccess {String} data.email User email
 * 
 * @apiError (404) {String} error User not found
 * @apiError (500) {String} error Internal server error
 */
```
