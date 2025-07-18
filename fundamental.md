# React Comprehensive Guide 2025: Fundamentals & Interview Preparation

## Table of Contents
1. [React Basics](#react-basics)
   - [Introduction to React](#introduction-to-react)
   - [Components](#components)
   - [JSX Syntax](#jsx-syntax)
   - [Props and State Management](#props-and-state-management)
   - [Event Handling](#event-handling)
   - [Lifecycle Methods and Hooks](#lifecycle-methods-and-hooks)
   - [Conditional Rendering](#conditional-rendering)
   - [Lists and Keys](#lists-and-keys)
   - [Forms and Controlled Components](#forms-and-controlled-components)
2. [Medium-Level Interview Questions 2025](#medium-level-interview-questions-2025)

---

## React Basics

### Introduction to React

React is a free, open-source JavaScript library for building user interfaces, particularly for web applications. As of 2025, React continues to be the most popular JavaScript library for frontend development, with over 2 million developers worldwide visiting the React documentation monthly.

#### Current Position in the Frontend Ecosystem (2025)
- **React 19** stable release in late 2024 has brought significant improvements
- **Functional components with hooks** are now the standard approach
- **Server Components** are stable and increasingly adopted
- **TypeScript integration** is considered essential for modern React development

#### Why React is Used in 2025
1. **Component-based architecture** promotes reusability and maintainability
2. **Virtual DOM** provides efficient updates and rendering
3. **Mature ecosystem** with extensive tooling and community support
4. **Performance optimizations** through features like concurrent rendering
5. **Flexibility** - can be used for small components or entire applications

### Components

#### Functional Components (Recommended Approach)
Functional components are now the standard and recommended approach in 2025. They are preferred over class components due to their simplicity, performance benefits, and compatibility with React hooks.

**Basic Functional Component Example:**
```javascript
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Arrow function syntax (also acceptable)
const Welcome = (props) => {
  return <h1>Hello, {props.name}!</h1>;
};
```

**Modern Functional Component with Hooks:**
```javascript
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const userData = await fetchUserData(userId);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [userId]);

  if (loading) return <LoadingSpinner />;
  if (!user) return <ErrorMessage message="User not found" />;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

#### Class Components (Legacy but Still Supported)
Class components are still supported but **not recommended for new development in 2025**. They are primarily maintained for legacy codebases and specific use cases like error boundaries.

```javascript
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

### JSX Syntax

JSX is a syntax extension for JavaScript that allows you to write HTML-like code within JavaScript. It's the recommended way to write React components in 2025.

#### Basic JSX Rules:
```javascript
function MyComponent() {
  return (
    <>
      <h1>Welcome to React</h1>
      <p>JSX makes React components easy to write!</p>
    </>
  );
}
```

#### Key JSX Rules for 2025:
1. **Use fragments** (`<>...</>`) to return multiple elements
2. **All tags must be closed** (e.g., `<br />`, `<input />`)
3. **Use `className` instead of `class`**
4. **Use camelCase for event handlers** (e.g., `onClick`, `onChange`)

#### Modern JSX Examples:

**Conditional Rendering:**
```javascript
function UserGreeting({ user, isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Welcome back, {user.name}!</h1>
      ) : (
        <h1>Please sign in.</h1>
      )}
      
      {/* Short-circuit evaluation for optional content */}
      {user.notifications?.length > 0 && (
        <div className="notifications">
          You have {user.notifications.length} new notifications
        </div>
      )}
    </div>
  );
}
```

**Dynamic Styling:**
```javascript
function StatusBadge({ status, children }) {
  return (
    <span 
      className={`badge ${status}`}
      style={{ 
        backgroundColor: status === 'active' ? '#4caf50' : '#f44336',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px'
      }}
    >
      {children}
    </span>
  );
}
```

### Props and State Management

#### Props - Modern Patterns and Best Practices

**Basic Props Usage:**
```javascript
function Button({ text, onClick, variant = 'primary' }) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

// Usage
<Button text="Click me" onClick={handleClick} variant="secondary" />
```

**Props with TypeScript (2025 Recommended):**
```javascript
interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

function Button({ text, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
```

**Children Props:**
```javascript
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
```

#### State Management Basics - useState

```javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
    </div>
  );
}
```

**Object State Management:**
```javascript
function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });

  const updateUser = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,
      [field]: value
    }));
  };

  return (
    <form>
      <input 
        value={user.name}
        onChange={(e) => updateUser('name', e.target.value)}
        placeholder="Name"
      />
      <input 
        value={user.email}
        onChange={(e) => updateUser('email', e.target.value)}
        placeholder="Email"
      />
    </form>
  );
}
```

### Event Handling

#### Basic Event Handling:
```javascript
function Button() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

#### Form Event Handling:
```javascript
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Your name"
      />
      <input 
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Your email"
      />
      <textarea 
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Your message"
      />
      <button type="submit">Send Message</button>
    </form>
  );
}
```

### Lifecycle Methods and Hooks

#### Core React Hooks

**useState:**
```javascript
const [count, setCount] = useState(0);

// Functional state updates (recommended for dependent updates)
const increment = () => setCount(prev => prev + 1);

// Lazy initialization for expensive initial state
const [expensiveState, setExpensiveState] = useState(() => {
  return computeExpensiveValue();
});
```

**useEffect:**
```javascript
// Basic side effect
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);

// Effect with cleanup
useEffect(() => {
  const subscription = subscribe(something);
  return () => subscription.unsubscribe();
}, []);

// Data fetching with error handling
useEffect(() => {
  let isCancelled = false;
  
  const fetchData = async () => {
    try {
      const response = await api.getData();
      if (!isCancelled) {
        setData(response);
      }
    } catch (error) {
      if (!isCancelled) {
        setError(error);
      }
    }
  };
  
  fetchData();
  return () => { isCancelled = true; };
}, []);
```

**useContext:**
```javascript
const ThemeContext = createContext();

// Provider
function App() {
  return (
    <ThemeContext.Provider value={{ theme: 'dark', toggleTheme }}>
      <Component />
    </ThemeContext.Provider>
  );
}

// Consumer
function Component() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return <button onClick={toggleTheme}>Theme: {theme}</button>;
}
```

**useReducer:**
```javascript
const initialState = { count: 0, step: 1 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
}
```

**useMemo and useCallback:**
```javascript
function ExpensiveComponent({ items, filterText }) {
  // Memoize expensive calculations
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [items, filterText]);
  
  // Memoize callback functions
  const handleItemClick = useCallback((item) => {
    console.log('Clicked:', item);
  }, []);
  
  return (
    <div>
      {filteredItems.map(item => (
        <div key={item.id} onClick={() => handleItemClick(item)}>
          {item.name}
        </div>
      ))}
    </div>
  );
}
```

### Conditional Rendering

#### Different Techniques:

**If/Else Pattern:**
```javascript
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}
```

**Ternary Operator:**
```javascript
function Profile({ user }) {
  return (
    <div>
      {user ? (
        <UserProfile user={user} />
      ) : (
        <LoginPrompt />
      )}
    </div>
  );
}
```

**Logical AND (&&):**
```javascript
function NotificationBell({ notifications }) {
  return (
    <div>
      <BellIcon />
      {notifications.length > 0 && (
        <Badge count={notifications.length} />
      )}
    </div>
  );
}
```

**Object Literal Pattern:**
```javascript
function StatusMessage({ status }) {
  const messages = {
    loading: <LoadingSpinner />,
    error: <ErrorMessage />,
    success: <SuccessMessage />,
    default: <DefaultMessage />
  };
  
  return messages[status] || messages.default;
}
```

### Lists and Keys

**Proper Key Usage:**
```javascript
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <span>{todo.text}</span>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

**Performance Optimization with React.memo:**
```javascript
const TodoItem = React.memo(({ todo, onToggle, onDelete }) => {
  return (
    <div>
      <span 
        onClick={() => onToggle(todo.id)}
        style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
      >
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
});
```

### Forms and Controlled Components

**Controlled Components:**
```javascript
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

**React 19 Form Actions:**
```javascript
function ModernForm() {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      try {
        await submitFormData(formData);
        redirect('/success');
        return null;
      } catch (error) {
        return error.message;
      }
    },
    null
  );
  
  return (
    <form action={submitAction}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

---

## Medium-Level Interview Questions 2025

### 1. Custom Hooks - Advanced Patterns

**Question:** "Create a custom hook that handles complex async data fetching with caching, error handling, and optimistic updates."

**Answer:**
```javascript
import { useState, useEffect, useCallback, useRef } from 'react';

function useAsyncData(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cacheRef = useRef(new Map());
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async (url, options) => {
    // Check cache first
    const cacheKey = JSON.stringify({ url, options });
    if (cacheRef.current.has(cacheKey)) {
      setData(cacheRef.current.get(cacheKey));
      setLoading(false);
      return;
    }

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...options,
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const result = await response.json();
      cacheRef.current.set(cacheKey, result);
      setData(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(url, options);
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [url, fetchData]);

  const refetch = useCallback(() => fetchData(url, options), [url, options, fetchData]);

  return { data, loading, error, refetch };
}
```

**Why it's important:** Custom hooks are crucial for code reusability and logic sharing. This question tests understanding of advanced async patterns, caching strategies, and proper cleanup.

### 2. Performance Optimization with React.memo

**Question:** "How would you optimize a large list component that's re-rendering too frequently? Show different optimization strategies."

**Answer:**
```javascript
// 1. Basic React.memo optimization
const ListItem = React.memo(({ item, onUpdate }) => {
  return (
    <div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <button onClick={() => onUpdate(item.id)}>Update</button>
    </div>
  );
});

// 2. Virtualization for large lists
import { FixedSizeList as List } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ListItem item={items[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={80}
      width="100%"
    >
      {Row}
    </List>
  );
}

// 3. Lazy loading with Intersection Observer
function LazyLoadedList({ items }) {
  const [visibleItems, setVisibleItems] = useState(items.slice(0, 10));
  const observerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleItems(prev => [
            ...prev,
            ...items.slice(prev.length, prev.length + 10)
          ]);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [items]);

  return (
    <div>
      {visibleItems.map(item => (
        <ListItem key={item.id} item={item} />
      ))}
      <div ref={observerRef} style={{ height: '1px' }} />
    </div>
  );
}
```

### 3. React 18+ Concurrent Features

**Question:** "Explain React 18's concurrent features and how Suspense has evolved. Provide examples of useTransition and useDeferredValue."

**Answer:**
```javascript
// useTransition for non-urgent updates
function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();
  
  const handleSearch = (value) => {
    setQuery(value); // Urgent update
    startTransition(() => {
      // Non-urgent update
      const filtered = expensiveFilter(allItems, value);
      setResults(filtered);
    });
  };
  
  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isPending && <div>Loading...</div>}
      {results.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  );
}

// useDeferredValue for derived state
function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  
  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <SearchResults query={deferredQuery} />
    </div>
  );
}

// Suspense for data fetching
function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading profile...</div>}>
        <UserProfile />
      </Suspense>
      <Suspense fallback={<div>Loading posts...</div>}>
        <PostsList />
      </Suspense>
    </div>
  );
}
```

### 4. Server Components (React 19)

**Question:** "Explain React Server Components and their benefits. How do they differ from traditional SSR?"

**Answer:**
```javascript
// Server Component (runs on server)
async function BlogPost({ id }) {
  // This runs on the server - can directly access database
  const post = await db.posts.findById(id);
  const author = await db.users.findById(post.authorId);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>By {author.name}</p>
      <div>{post.content}</div>
      {/* This client component handles interactivity */}
      <LikeButton postId={id} />
    </article>
  );
}

// Client Component (runs in browser)
'use client';

function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);
  
  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? '❤️' : '🤍'} Like
    </button>
  );
}
```

**Benefits:**
- Zero JavaScript bundle for server-rendered components
- Direct database access without API routes
- Better SEO and initial load performance
- Automatic code splitting

### 5. State Management - Modern Approaches

**Question:** "Compare Zustand and Redux Toolkit for state management. When would you choose each?"

**Answer:**
```javascript
// Zustand - Simpler for most use cases
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useStore = create(
  immer((set) => ({
    user: null,
    cart: [],
    addToCart: (item) => set((state) => {
      const existingItem = state.cart.find(i => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ ...item, quantity: 1 });
      }
    }),
    removeFromCart: (id) => set((state) => {
      state.cart = state.cart.filter(item => item.id !== id);
    }),
  }))
);

// Redux Toolkit - For complex applications
import { configureStore, createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});
```

**When to use:**
- **Zustand**: Simpler apps, smaller teams, less boilerplate
- **Redux**: Large teams, complex middleware needs, time-travel debugging

### 6. Testing React Components

**Question:** "Write comprehensive tests for a component with async behavior, user interactions, and error states."

**Answer:**
```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Component being tested
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
      <button onClick={fetchUsers}>Refresh</button>
    </div>
  );
}

// Tests
describe('UserList', () => {
  test('renders loading state initially', () => {
    render(<UserList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders users after successful fetch', async () => {
    render(<UserList />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe - john@example.com')).toBeInTheDocument();
    });
  });

  test('handles error state', async () => {
    // Mock failed API call
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch/)).toBeInTheDocument();
    });
  });
});
```

### 7. React 19 New Hooks

**Question:** "Explain the new hooks in React 19: useActionState, useOptimistic, and the use API."

**Answer:**
```javascript
// useActionState - Simplifies form actions
const [error, submitAction, isPending] = useActionState(
  async (previousState, formData) => {
    const error = await updateName(formData.get("name"));
    if (error) return error;
    redirect("/path");
    return null;
  },
  null,
);

// useOptimistic - Enables optimistic UI updates
function ChangeName({currentName, onUpdateName}) {
  const [optimisticName, setOptimisticName] = useOptimistic(currentName);

  const submitAction = async formData => {
    const newName = formData.get("name");
    setOptimisticName(newName);
    const updatedName = await updateName(newName);
    onUpdateName(updatedName);
  };

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <input type="text" name="name" disabled={currentName !== optimisticName} />
    </form>
  );
}

// use API - Reads resources in render
import {use} from 'react';

function Comments({commentsPromise}) {
  const comments = use(commentsPromise); // Suspends until promise resolves
  return comments.map(comment => <p key={comment.id}>{comment}</p>);
}
```

### 8. Performance Monitoring and Web Vitals

**Question:** "How do you monitor and optimize Core Web Vitals in a React application?"

**Answer:**
```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Track Core Web Vitals
function sendToAnalytics(metric) {
  // Send to your analytics endpoint
  const body = JSON.stringify(metric);
  fetch('/analytics', { method: 'POST', body });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);

// Performance optimization techniques
// 1. Code splitting
const Dashboard = React.lazy(() => import('./Dashboard'));

// 2. Image optimization
function OptimizedImage({ src, alt }) {
  return (
    <img 
      src={src} 
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
}

// 3. Memoization
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => 
    expensiveProcessing(data), [data]
  );
  
  return <div>{processedData}</div>;
});
```

### 9. Build Tools and Deployment

**Question:** "What are the current best practices for build tools and deployment in 2025? Compare Vite vs Next.js."

**Answer:**

**Vite Configuration:**
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.js'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'date-fns']
        }
      }
    }
  }
})
```

**Next.js Configuration:**
```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'],
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['prisma'],
  },
}
```

**When to use:**
- **Vite**: Single-page applications, faster development experience
- **Next.js**: Full-stack applications, SEO requirements, server-side rendering

### 10. TypeScript with React

**Question:** "Show advanced TypeScript patterns for React components including generics and strict typing."

**Answer:**
```javascript
// Generic component with constraints
interface BaseItem {
  id: string;
  name: string;
}

function DataTable<T extends BaseItem>({ 
  items, 
  columns,
  onRowClick 
}: {
  items: T[];
  columns: Array<keyof T>;
  onRowClick: (item: T) => void;
}) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map(column => (
            <th key={String(column)}>{String(column)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id} onClick={() => onRowClick(item)}>
            {columns.map(column => (
              <td key={String(column)}>{String(item[column])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Strict prop typing
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  variant, 
  size = 'medium', 
  loading = false,
  children,
  ...props 
}) => {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};
```

## Key Takeaways for 2025

1. **React 19 Features**: Server Components, Actions API, and new hooks are becoming standard
2. **Performance**: Focus on Core Web Vitals, concurrent features, and smart optimization
3. **State Management**: Lightweight solutions like Zustand are preferred for most applications
4. **TypeScript**: Now considered essential for production React applications
5. **Testing**: Vitest is rapidly gaining adoption alongside React Testing Library
6. **Build Tools**: Vite for SPAs, Next.js for full-stack applications
7. **Deployment**: Focus on edge deployment and automated CI/CD pipelines

This comprehensive guide reflects the current state of React development in 2025, emphasizing practical skills and modern patterns that developers need in production applications.