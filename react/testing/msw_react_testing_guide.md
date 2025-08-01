# MSW (Mock Service Worker) Guide for React Testing

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Basic Setup](#basic-setup)
4. [Creating Mock Handlers](#creating-mock-handlers)
5. [Testing Components with MSW](#testing-components-with-msw)
6. [Advanced Patterns](#advanced-patterns)
7. [Best Practices](#best-practices)
8. [Common Pitfalls](#common-pitfalls)
9. [Examples](#examples)

## Introduction

Mock Service Worker (MSW) is a powerful API mocking library that intercepts network requests at the network level. Unlike traditional mocking approaches that mock individual functions or modules, MSW works by intercepting requests made by your actual application code, making your tests more realistic and reliable.

### Why MSW?
- **Network-level mocking**: Intercepts actual HTTP requests
- **Framework agnostic**: Works with any testing framework
- **Development and testing**: Can be used in both environments
- **Type safety**: Full TypeScript support
- **Realistic testing**: Your components use real HTTP clients

## Installation

```bash
# npm
npm install msw --save-dev

# yarn
yarn add msw --dev

# pnpm
pnpm add -D msw
```

For React testing, you'll also need testing utilities:

```bash
npm install @testing-library/react @testing-library/jest-dom --save-dev
```

## Basic Setup

### 1. Create Mock Handlers

Create a `src/mocks/handlers.js` file:

```javascript
import { http, HttpResponse } from 'msw'

export const handlers = [
  // Handle GET request to /api/users
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ])
  }),

  // Handle POST request to /api/users
  http.post('/api/users', async ({ request }) => {
    const newUser = await request.json()
    return HttpResponse.json(
      { id: 3, ...newUser },
      { status: 201 }
    )
  }),
]
```

### 2. Set Up Test Server

Create a `src/mocks/server.js` file:

```javascript
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Setup mock server with handlers
export const server = setupServer(...handlers)
```

### 3. Configure Jest Setup

Create or update `src/setupTests.js`:

```javascript
import '@testing-library/jest-dom'
import { server } from './mocks/server'

// Establish API mocking before all tests
beforeAll(() => server.listen())

// Reset any request handlers that are declared as a part of tests
// (i.e. for testing error scenarios)
afterEach(() => server.resetHandlers())

// Clean up after all tests are done
afterAll(() => server.close())
```

### 4. Update Jest Configuration

In your `package.json` or `jest.config.js`:

```json
{
  "jest": {
    "setupFilesAfterEnv": ["<rootDir>/src/setupTests.js"]
  }
}
```

## Creating Mock Handlers

### HTTP Methods

```javascript
import { http, HttpResponse } from 'msw'

export const handlers = [
  // GET request
  http.get('/api/posts', () => {
    return HttpResponse.json({ posts: [] })
  }),

  // POST request
  http.post('/api/posts', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 1, ...body }, { status: 201 })
  }),

  // PUT request
  http.put('/api/posts/:id', async ({ params, request }) => {
    const { id } = params
    const body = await request.json()
    return HttpResponse.json({ id, ...body })
  }),

  // DELETE request
  http.delete('/api/posts/:id', ({ params }) => {
    return new HttpResponse(null, { status: 204 })
  }),
]
```

### Dynamic Responses

```javascript
// Using path parameters
http.get('/api/users/:id', ({ params }) => {
  const { id } = params
  return HttpResponse.json({
    id: parseInt(id),
    name: `User ${id}`,
    email: `user${id}@example.com`
  })
})

// Using query parameters
http.get('/api/posts', ({ request }) => {
  const url = new URL(request.url)
  const category = url.searchParams.get('category')
  
  const posts = category 
    ? mockPosts.filter(post => post.category === category)
    : mockPosts
    
  return HttpResponse.json({ posts })
})
```

### Error Responses

```javascript
// Simulate network error
http.get('/api/error', () => {
  return HttpResponse.error()
})

// Simulate HTTP error
http.get('/api/not-found', () => {
  return new HttpResponse(null, { status: 404 })
})

// Simulate server error with message
http.get('/api/server-error', () => {
  return HttpResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
})
```

## Testing Components with MSW

### Basic Component Test

```javascript
import { render, screen, waitFor } from '@testing-library/react'
import UserList from './UserList'

test('displays list of users', async () => {
  render(<UserList />)
  
  // Wait for the component to load data
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })
})
```

### Testing Error States

```javascript
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

test('displays error message when API fails', async () => {
  // Override the handler for this specific test
  server.use(
    http.get('/api/users', () => {
      return new HttpResponse(null, { status: 500 })
    })
  )

  render(<UserList />)
  
  await waitFor(() => {
    expect(screen.getByText(/error loading users/i)).toBeInTheDocument()
  })
})
```

### Testing Loading States

```javascript
test('displays loading state', async () => {
  // Delay the response to test loading state
  server.use(
    http.get('/api/users', async () => {
      await delay(100) // Custom delay function
      return HttpResponse.json([])
    })
  )

  render(<UserList />)
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
  
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })
})
```

### Testing Form Submissions

```javascript
import userEvent from '@testing-library/user-event'

test('creates new user on form submission', async () => {
  const user = userEvent.setup()
  
  render(<CreateUserForm />)
  
  await user.type(screen.getByLabelText(/name/i), 'New User')
  await user.type(screen.getByLabelText(/email/i), 'new@example.com')
  await user.click(screen.getByRole('button', { name: /create/i }))
  
  await waitFor(() => {
    expect(screen.getByText(/user created successfully/i)).toBeInTheDocument()
  })
})
```

## Advanced Patterns

### Request Matching with Conditions

```javascript
http.get('/api/users', ({ request }) => {
  const url = new URL(request.url)
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader) {
    return new HttpResponse(null, { status: 401 })
  }
  
  // Return different data based on conditions
  return HttpResponse.json({ users: [] })
})
```

### Stateful Mocks

```javascript
let users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' }
]

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json(users)
  }),
  
  http.post('/api/users', async ({ request }) => {
    const newUser = await request.json()
    const user = { id: Date.now(), ...newUser }
    users.push(user)
    return HttpResponse.json(user, { status: 201 })
  }),
  
  http.delete('/api/users/:id', ({ params }) => {
    const { id } = params
    users = users.filter(user => user.id !== parseInt(id))
    return new HttpResponse(null, { status: 204 })
  })
]
```

### Using with React Query/SWR

```javascript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function renderWithQueryClient(component) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  )
}

test('fetches and displays data with React Query', async () => {
  renderWithQueryClient(<UserList />)
  
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})
```

### GraphQL Support

```javascript
import { graphql, HttpResponse } from 'msw'

const handlers = [
  graphql.query('GetUsers', () => {
    return HttpResponse.json({
      data: {
        users: [
          { id: '1', name: 'John Doe' },
          { id: '2', name: 'Jane Smith' }
        ]
      }
    })
  }),
  
  graphql.mutation('CreateUser', ({ variables }) => {
    return HttpResponse.json({
      data: {
        createUser: {
          id: '3',
          ...variables.input
        }
      }
    })
  })
]
```

## Best Practices

### 1. Organize Handlers by Domain

```javascript
// handlers/users.js
export const userHandlers = [
  http.get('/api/users', () => { /* ... */ }),
  http.post('/api/users', () => { /* ... */ }),
]

// handlers/posts.js
export const postHandlers = [
  http.get('/api/posts', () => { /* ... */ }),
  http.post('/api/posts', () => { /* ... */ }),
]

// handlers/index.js
export const handlers = [
  ...userHandlers,
  ...postHandlers,
]
```

### 2. Use TypeScript for Type Safety

```typescript
interface User {
  id: number
  name: string
  email: string
}

export const handlers = [
  http.get<never, never, User[]>('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'John Doe', email: 'john@example.com' }
    ])
  })
]
```

### 3. Create Reusable Test Utilities

```javascript
// test-utils.js
export function createMockUser(overrides = {}) {
  return {
    id: Math.random(),
    name: 'Test User',
    email: 'test@example.com',
    ...overrides
  }
}

export function mockApiError(endpoint, status = 500) {
  server.use(
    http.get(endpoint, () => {
      return new HttpResponse(null, { status })
    })
  )
}
```

### 4. Test Both Success and Error Scenarios

```javascript
describe('UserList', () => {
  test('displays users when API succeeds', async () => {
    // Test success case
  })
  
  test('displays error when API fails', async () => {
    mockApiError('/api/users', 500)
    // Test error case
  })
  
  test('displays empty state when no users', async () => {
    server.use(
      http.get('/api/users', () => HttpResponse.json([]))
    )
    // Test empty state
  })
})
```

## Common Pitfalls

### 1. Not Waiting for Async Operations

```javascript
// ❌ Wrong - not waiting for async updates
test('displays users', () => {
  render(<UserList />)
  expect(screen.getByText('John Doe')).toBeInTheDocument() // This will fail
})

// ✅ Correct - waiting for async updates
test('displays users', async () => {
  render(<UserList />)
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})
```

### 2. Not Resetting Handlers Between Tests

```javascript
// ❌ Wrong - handlers persist between tests
test('test 1', () => {
  server.use(http.get('/api/users', () => HttpResponse.error()))
  // Test code
})

test('test 2', () => {
  // This test might still use the error handler from test 1
})

// ✅ Correct - reset in setupTests.js
afterEach(() => server.resetHandlers())
```

### 3. Incorrect URL Matching

```javascript
// ❌ Wrong - missing leading slash
http.get('api/users', () => { /* ... */ })

// ✅ Correct - proper URL format
http.get('/api/users', () => { /* ... */ })

// ✅ Also correct - full URL
http.get('https://api.example.com/users', () => { /* ... */ })
```

## Examples

### Complete Example: User Management Component

```javascript
// UserManager.jsx
import { useState, useEffect } from 'react'

function UserManager() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createUser = async (userData) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      if (!response.ok) throw new Error('Failed to create user')
      const newUser = await response.json()
      setUsers(prev => [...prev, newUser])
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserManager
```

```javascript
// UserManager.test.jsx
import { render, screen, waitFor } from '@testing-library/react'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'
import UserManager from './UserManager'

describe('UserManager', () => {
  test('displays loading state initially', () => {
    render(<UserManager />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('displays users after loading', async () => {
    render(<UserManager />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe - john@example.com')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith - jane@example.com')).toBeInTheDocument()
    })
  })

  test('displays error message when fetch fails', async () => {
    server.use(
      http.get('/api/users', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    render(<UserManager />)

    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch users/)).toBeInTheDocument()
    })
  })

  test('displays empty list when no users', async () => {
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.json([])
      })
    )

    render(<UserManager />)

    await waitFor(() => {
      expect(screen.getByText('Users')).toBeInTheDocument()
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    })
  })
})
```

This guide covers the essential aspects of using MSW for React testing. MSW provides a robust foundation for testing components that interact with APIs, making your tests more reliable and closer to real-world usage patterns.