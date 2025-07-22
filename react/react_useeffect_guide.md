# React useEffect() - Advanced Study Guide with Interview Questions

## Table of Contents
1. [Introduction to useEffect](#introduction-to-useeffect)
2. [Core Concepts and Fundamentals](#core-concepts-and-fundamentals)
3. [Dependency Arrays - Deep Dive](#dependency-arrays---deep-dive)
4. [Cleanup Functions and Memory Management](#cleanup-functions-and-memory-management)
5. [Advanced Patterns and Best Practices](#advanced-patterns-and-best-practices)
6. [Performance Optimization](#performance-optimization)
7. [Common Pitfalls and Anti-Patterns](#common-pitfalls-and-anti-patterns)
8. [useEffect vs useLayoutEffect](#useeffect-vs-uselayouteffect)
9. [Modern Alternatives (2025)](#modern-alternatives-2025)
10. [Advanced Interview Questions](#advanced-interview-questions)

---

## Introduction to useEffect

The `useEffect` Hook is one of the most powerful and versatile hooks in React, allowing you to perform side effects in functional components. It serves as a replacement for `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` lifecycle methods from class components.

### What are Side Effects?

Side effects are operations that affect something outside the scope of the function being executed. Common examples include:
- **Data fetching** (API calls)
- **DOM manipulation**
- **Subscriptions** (WebSocket connections, event listeners)
- **Timers** (setTimeout, setInterval)
- **Logging and analytics**
- **Cleanup operations**

### Basic Syntax

```javascript
useEffect(() => {
  // Side effect logic here
  
  return () => {
    // Cleanup logic (optional)
  };
}, [dependencies]); // Dependency array (optional)
```

---

## Core Concepts and Fundamentals

### 1. Basic useEffect Implementation

```javascript
import React, { useState, useEffect } from 'react';

function DocumentTitle() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // This runs after every render
    document.title = `Count: ${count}`;
  });

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### 2. Effect with Dependencies

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]); // Only re-run when userId changes

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### 3. Effect Lifecycle

The useEffect lifecycle consists of three phases:

1. **Setup**: The effect function runs
2. **Cleanup**: The cleanup function runs (if provided)
3. **Re-setup**: The effect runs again if dependencies change

```javascript
function EffectLifecycle() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Effect setup - count:', count);
    
    // Setup some side effect
    const timer = setInterval(() => {
      console.log('Timer tick for count:', count);
    }, 1000);

    // Cleanup function
    return () => {
      console.log('Effect cleanup - count:', count);
      clearInterval(timer);
    };
  }, [count]);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

---

## Dependency Arrays - Deep Dive

### 1. No Dependency Array

```javascript
useEffect(() => {
  // Runs after every render
  console.log('Component rendered');
});
```

### 2. Empty Dependency Array

```javascript
useEffect(() => {
  // Runs only once after initial mount
  console.log('Component mounted');
}, []);
```

### 3. Specific Dependencies

```javascript
function SearchResults({ query, filters }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const searchAPI = async () => {
      const response = await fetch(`/api/search?q=${query}&filters=${JSON.stringify(filters)}`);
      const data = await response.json();
      setResults(data);
    };

    if (query) {
      searchAPI();
    }
  }, [query, filters]); // Runs when query or filters change

  return (
    <div>
      {results.map(result => (
        <div key={result.id}>{result.title}</div>
      ))}
    </div>
  );
}
```

### 4. Complex Dependency Management

```javascript
function ComplexComponent({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [preferences, setPreferences] = useState({});

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await fetch(`/api/users/${userId}`).then(r => r.json());
      setUser(userData);
    };

    fetchUser();
  }, [userId]);

  // Fetch user posts (depends on user being loaded)
  useEffect(() => {
    if (!user) return;

    const fetchPosts = async () => {
      const postsData = await fetch(`/api/users/${user.id}/posts`).then(r => r.json());
      setPosts(postsData);
    };

    fetchPosts();
  }, [user]); // user object as dependency

  // Apply user preferences (depends on user and posts)
  useEffect(() => {
    if (!user || !posts.length) return;

    const savedPreferences = localStorage.getItem(`preferences_${user.id}`);
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, [user, posts.length]); // Note: posts.length instead of posts array

  return (
    <div>
      {user && <h1>Welcome, {user.name}!</h1>}
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  );
}
```

---

## Cleanup Functions and Memory Management

### 1. Event Listener Cleanup

```javascript
function WindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array - setup once

  return (
    <div>
      Window size: {windowSize.width} x {windowSize.height}
    </div>
  );
}
```

### 2. Timer Cleanup

```javascript
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }

    // Cleanup function
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]); // Re-run when isRunning changes

  return (
    <div>
      <p>Seconds: {seconds}</p>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Stop' : 'Start'}
      </button>
      <button onClick={() => setSeconds(0)}>Reset</button>
    </div>
  );
}
```

### 3. WebSocket Cleanup

```javascript
function ChatComponent({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/chat/${roomId}`);
    
    ws.onopen = () => {
      setConnectionStatus('connected');
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };
    
    ws.onclose = () => {
      setConnectionStatus('disconnected');
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('error');
    };

    // Cleanup function
    return () => {
      ws.close();
    };
  }, [roomId]); // Re-connect when room changes

  return (
    <div>
      <p>Status: {connectionStatus}</p>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.text}</div>
        ))}
      </div>
    </div>
  );
}
```

### 4. Race Condition Prevention

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false; // Flag to prevent race conditions

    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        
        // Only update state if component is still mounted and this is the current request
        if (!isCancelled) {
          setUser(userData);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    // Cleanup function
    return () => {
      isCancelled = true; // Cancel any pending state updates
    };
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

---

## Advanced Patterns and Best Practices

### 1. Custom Hook for Data Fetching

```javascript
// Custom hook for API calls with cleanup
function useAsyncData(url, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          signal: controller.signal
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (!isCancelled) {
          setData(result);
        }
      } catch (err) {
        if (!isCancelled && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, dependencies);

  return { data, loading, error };
}

// Usage
function ProductList({ category }) {
  const { data: products, loading, error } = useAsyncData(
    `/api/products?category=${category}`,
    [category]
  );

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products?.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### 2. Effect Composition Pattern

```javascript
// Multiple focused effects instead of one large effect
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState({});

  // Effect 1: Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await fetch(`/api/users/${userId}`).then(r => r.json());
      setUser(userData);
    };

    fetchUser();
  }, [userId]);

  // Effect 2: Fetch notifications
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const notifs = await fetch(`/api/users/${user.id}/notifications`).then(r => r.json());
      setNotifications(notifs);
    };

    fetchNotifications();

    // Set up real-time notifications
    const eventSource = new EventSource(`/api/notifications/${user.id}/stream`);
    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications(prev => [newNotification, ...prev]);
    };

    return () => {
      eventSource.close();
    };
  }, [user]);

  // Effect 3: Load and save preferences
  useEffect(() => {
    if (!user) return;

    const savedPrefs = localStorage.getItem(`prefs_${user.id}`);
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
  }, [user]);

  useEffect(() => {
    if (!user || Object.keys(preferences).length === 0) return;

    localStorage.setItem(`prefs_${user.id}`, JSON.stringify(preferences));
  }, [user, preferences]);

  return (
    <div>
      {user && <h1>Welcome, {user.name}!</h1>}
      {notifications.length > 0 && (
        <div>
          <h2>Notifications</h2>
          {notifications.map(notif => (
            <div key={notif.id}>{notif.message}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 3. Conditional Effects

```javascript
function ConditionalEffects({ isVisible, userId }) {
  const [data, setData] = useState(null);

  // Effect that only runs when certain conditions are met
  useEffect(() => {
    // Early return if conditions aren't met
    if (!isVisible || !userId) {
      return;
    }

    const fetchData = async () => {
      const response = await fetch(`/api/data/${userId}`);
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, [isVisible, userId]); // Effect depends on both conditions

  // Effect with multiple condition checks
  useEffect(() => {
    if (!isVisible) {
      // Hide data when not visible
      setData(null);
      return;
    }

    if (!userId) {
      // Clear data when no user
      setData(null);
      return;
    }

    // Both conditions are met, proceed with effect
    console.log('All conditions met, proceeding...');
  }, [isVisible, userId]);

  return isVisible ? (
    <div>{data ? JSON.stringify(data) : 'Loading...'}</div>
  ) : null;
}
```

---

## Performance Optimization

### 1. Memoizing Effect Dependencies

```javascript
import { useMemo, useCallback } from 'react';

function OptimizedComponent({ items, filterConfig }) {
  const [filteredItems, setFilteredItems] = useState([]);

  // Memoize complex objects to prevent unnecessary effect runs
  const memoizedConfig = useMemo(() => {
    return {
      type: filterConfig.type,
      minPrice: filterConfig.minPrice,
      maxPrice: filterConfig.maxPrice
    };
  }, [filterConfig.type, filterConfig.minPrice, filterConfig.maxPrice]);

  // Memoize callback functions
  const processItems = useCallback((items, config) => {
    return items.filter(item => {
      if (config.type && item.type !== config.type) return false;
      if (config.minPrice && item.price < config.minPrice) return false;
      if (config.maxPrice && item.price > config.maxPrice) return false;
      return true;
    });
  }, []);

  useEffect(() => {
    const filtered = processItems(items, memoizedConfig);
    setFilteredItems(filtered);
  }, [items, memoizedConfig, processItems]);

  return (
    <div>
      {filteredItems.map(item => (
        <div key={item.id}>{item.name} - ${item.price}</div>
      ))}
    </div>
  );
}
```

### 2. Debounced Effects

```javascript
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    // Debounce the search
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce

    // Cleanup function cancels the timeout
    return () => {
      clearTimeout(timeoutId);
      setLoading(false);
    };
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {loading && <div>Searching...</div>}
      <div>
        {results.map(result => (
          <div key={result.id}>{result.title}</div>
        ))}
      </div>
    </div>
  );
}
```

### 3. Effect Batching and Optimization

```javascript
function BatchedEffects({ config }) {
  const [data, setData] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [preferences, setPreferences] = useState(null);

  // Single effect that batches multiple operations
  useEffect(() => {
    let isCancelled = false;

    const fetchAllData = async () => {
      try {
        // Fetch all data in parallel
        const [dataResponse, metadataResponse, prefsResponse] = await Promise.all([
          fetch(`/api/data/${config.id}`),
          fetch(`/api/metadata/${config.id}`),
          fetch(`/api/preferences/${config.id}`)
        ]);

        const [dataResult, metadataResult, prefsResult] = await Promise.all([
          dataResponse.json(),
          metadataResponse.json(),
          prefsResponse.json()
        ]);

        if (!isCancelled) {
          // Batch state updates
          setData(dataResult);
          setMetadata(metadataResult);
          setPreferences(prefsResult);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchAllData();

    return () => {
      isCancelled = true;
    };
  }, [config.id]); // Single dependency

  return (
    <div>
      {data && <div>Data: {JSON.stringify(data)}</div>}
      {metadata && <div>Metadata: {JSON.stringify(metadata)}</div>}
      {preferences && <div>Preferences: {JSON.stringify(preferences)}</div>}
    </div>
  );
}
```

---

## Common Pitfalls and Anti-Patterns

### 1. Missing Dependencies

```javascript
// ❌ Bad: Missing dependency
function BadExample({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(setUser);
  }, []); // Missing userId dependency!

  return <div>{user?.name}</div>;
}

// ✅ Good: All dependencies included
function GoodExample({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(setUser);
  }, [userId]); // userId included

  return <div>{user?.name}</div>;
}
```

### 2. Infinite Re-renders

```javascript
// ❌ Bad: Object dependency causes infinite re-renders
function BadInfiniteLoop({ filters }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const searchFilters = {
      type: filters.type,
      category: filters.category,
      // This creates a new object every render!
      createdAt: new Date()
    };

    fetchResults(searchFilters).then(setResults);
  }, [searchFilters]); // This will cause infinite re-renders!

  return <div>{results.length} results</div>;
}

// ✅ Good: Proper dependency management
function GoodExample({ filters }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const searchFilters = {
      type: filters.type,
      category: filters.category,
      createdAt: new Date()
    };

    fetchResults(searchFilters).then(setResults);
  }, [filters.type, filters.category]); // Specific dependencies

  return <div>{results.length} results</div>;
}
```

### 3. Stale Closures

```javascript
// ❌ Bad: Stale closure issue
function StaleClosureExample() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // This will always use the initial count value (0)
      setCount(count + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array

  return <div>Count: {count}</div>;
}

// ✅ Good: Use functional update
function FixedExample() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Use functional update to get current value
      setCount(c => c + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array is now safe

  return <div>Count: {count}</div>;
}
```

### 4. Unnecessary Effect Dependencies

```javascript
// ❌ Bad: Unnecessary function dependency
function BadFunctionDep({ onUpdate }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(data => {
        setData(data);
        onUpdate(data); // This makes onUpdate a dependency
      });
  }, [onUpdate]); // Effect will re-run every time parent re-renders

  return <div>{data?.name}</div>;
}

// ✅ Good: Use useCallback in parent or avoid dependency
function GoodFunctionHandling({ onUpdate }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(setData);
  }, []); // No unnecessary dependencies

  // Call onUpdate when data changes, not in the fetch effect
  useEffect(() => {
    if (data) {
      onUpdate(data);
    }
  }, [data, onUpdate]);

  return <div>{data?.name}</div>;
}
```

---

## useEffect vs useLayoutEffect

### When to Use Each

```javascript
import { useEffect, useLayoutEffect, useState, useRef } from 'react';

function EffectComparison() {
  const [count, setCount] = useState(0);
  const divRef = useRef();

  // useEffect: Runs after DOM painting (asynchronous)
  useEffect(() => {
    console.log('useEffect: DOM has been painted');
    // Good for: API calls, subscriptions, logging
  }, [count]);

  // useLayoutEffect: Runs before DOM painting (synchronous)
  useLayoutEffect(() => {
    console.log('useLayoutEffect: Before DOM painting');
    
    // Good for: DOM measurements, synchronous DOM updates
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      console.log('Element dimensions:', rect.width, rect.height);
    }
  }, [count]);

  return (
    <div>
      <div ref={divRef}>Count: {count}</div>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### Practical useLayoutEffect Example

```javascript
function Tooltip({ targetRef, children }) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef();

  useLayoutEffect(() => {
    if (targetRef.current && tooltipRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      // Calculate position to avoid viewport overflow
      let top = targetRect.bottom + 5;
      let left = targetRect.left;
      
      if (left + tooltipRect.width > window.innerWidth) {
        left = window.innerWidth - tooltipRect.width - 10;
      }
      
      if (top + tooltipRect.height > window.innerHeight) {
        top = targetRect.top - tooltipRect.height - 5;
      }
      
      setPosition({ top, left });
    }
  }); // No dependency array - runs after every render

  return (
    <div
      ref={tooltipRef}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        background: 'black',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        zIndex: 1000
      }}
    >
      {children}
    </div>
  );
}
```

---

## Modern Alternatives (2025)

### 1. useSyncExternalStore for External Data

```javascript
import { useSyncExternalStore } from 'react';

// Modern pattern for subscribing to external stores
function useWindowSize() {
  return useSyncExternalStore(
    // Subscribe function
    (callback) => {
      const handleResize = () => callback();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    },
    // Get snapshot function
    () => ({ width: window.innerWidth, height: window.innerHeight }),
    // Server snapshot (for SSR)
    () => ({ width: 1024, height: 768 })
  );
}

// Usage
function ResponsiveComponent() {
  const { width, height } = useWindowSize();
  
  return (
    <div>
      Window size: {width} × {height}
    </div>
  );
}
```

### 2. React Query / TanStack Query for Data Fetching

```javascript
import { useQuery } from '@tanstack/react-query';

// Replace data fetching useEffect with React Query
function UserProfile({ userId }) {
  const {
    data: user,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json()),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!userId // Only run if userId exists
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### 3. Suspense for Data Fetching

```javascript
import { Suspense } from 'react';

// Modern data fetching with Suspense
function UserProfileSuspense({ userId }) {
  // Using a library that supports Suspense (like React Query v5+)
  const user = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json())
  });

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// Wrap with Suspense boundary
function App() {
  return (
    <Suspense fallback={<div>Loading user...</div>}>
      <UserProfileSuspense userId="123" />
    </Suspense>
  );
}
```

---

## Advanced Interview Questions

### 1. **Explain the useEffect execution order and timing**

**Answer:**
useEffect has a specific execution order:

1. **Component renders** (JSX is evaluated)
2. **DOM is updated** with the new render
3. **Browser paints** the screen
4. **useEffect callbacks run** (asynchronously)

```javascript
function ExecutionOrder() {
  const [count, setCount] = useState(0);

  console.log('1. Render phase');

  useLayoutEffect(() => {
    console.log('2. useLayoutEffect (before paint)');
  });

  useEffect(() => {
    console.log('3. useEffect (after paint)');
  });

  return (
    <div onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </div>
  );
}
```

**Key points:**
- useEffect is **asynchronous** and doesn't block rendering
- useLayoutEffect is **synchronous** and runs before browser paint
- Cleanup functions run **before** the next effect or unmount

### 2. **How do you handle race conditions in useEffect?**

**Answer:**
Race conditions occur when multiple async operations are in flight and can complete in any order.

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const fetchUser = async () => {
      setLoading(true);
      
      try {
        const response = await fetch(`/api/users/${userId}`, {
          signal: controller.signal
        });
        const userData = await response.json();
        
        // Prevent race condition
        if (!cancelled) {
          setUser(userData);
        }
      } catch (error) {
        if (!cancelled && error.name !== 'AbortError') {
          console.error('Fetch error:', error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    // Cleanup function
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [userId]);

  return loading ? <div>Loading...</div> : <div>{user?.name}</div>;
}
```

**Prevention strategies:**
- Use cleanup flags (`cancelled`)
- Implement AbortController for fetch requests
- Return cleanup functions that cancel ongoing operations

### 3. **What's the difference between useEffect dependency array behavior?**

**Answer:**

```javascript
function DependencyExamples({ prop1, prop2 }) {
  // No dependency array - runs after every render
  useEffect(() => {
    console.log('Runs on every render');
  });

  // Empty dependency array - runs only on mount
  useEffect(() => {
    console.log('Runs only once on mount');
  }, []);

  // Specific dependencies - runs when dependencies change
  useEffect(() => {
    console.log('Runs when prop1 changes');
  }, [prop1]);

  // Multiple dependencies
  useEffect(() => {
    console.log('Runs when prop1 OR prop2 changes');
  }, [prop1, prop2]);

  // Object dependency (problematic)
  const config = { type: 'user', limit: 10 }; // New object every render!
  useEffect(() => {
    console.log('Runs on every render due to new object');
  }, [config]);

  // Fixed object dependency
  const stableConfig = useMemo(() => ({ type: 'user', limit: 10 }), []);
  useEffect(() => {
    console.log('Runs only once due to memoized object');
  }, [stableConfig]);
}
```

### 4. **How do you debug useEffect issues?**

**Answer:**

```javascript
function DebuggableComponent({ userId, filters }) {
  const [data, setData] = useState(null);

  // Debug hook to track dependency changes
  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const prevUserId = usePrevious(userId);
  const prevFilters = usePrevious(filters);

  useEffect(() => {
    console.group('useEffect Debug Info');
    console.log('Current userId:', userId);
    console.log('Previous userId:', prevUserId);
    console.log('UserID changed:', userId !== prevUserId);
    console.log('Current filters:', filters);
    console.log('Previous filters:', prevFilters);
    console.log('Filters changed:', JSON.stringify(filters) !== JSON.stringify(prevFilters));
    console.groupEnd();

    // Your effect logic here
    fetchData(userId, filters).then(setData);
  }, [userId, filters]);

  return <div>{data ? 'Data loaded' : 'Loading...'}</div>;
}
```

**Debugging strategies:**
- Use `console.group()` for organized logging
- Track previous values with custom hooks
- Use React DevTools Profiler
- Add `eslint-plugin-react-hooks` for dependency warnings

### 5. **How do you optimize expensive calculations in useEffect?**

**Answer:**

```javascript
function OptimizedCalculations({ items, complexConfig }) {
  const [processedData, setProcessedData] = useState([]);

  // Memoize expensive calculation outside of useEffect
  const expensiveResult = useMemo(() => {
    return items.filter(item => item.category === complexConfig.category)
                .sort((a, b) => a.priority - b.priority)
                .slice(0, complexConfig.limit);
  }, [items, complexConfig.category, complexConfig.limit]);

  // Use the memoized result in useEffect
  useEffect(() => {
    const processData = async () => {
      // Only do additional async processing
      const enrichedData = await enrichWithMetadata(expensiveResult);
      setProcessedData(enrichedData);
    };

    if (expensiveResult.length > 0) {
      processData();
    }
  }, [expensiveResult]);

  // Debounced effect for frequent updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Expensive operation with debounce
      analyzeData(processedData);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [processedData]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### 6. **Explain useEffect cleanup timing with multiple effects**

**Answer:**

```javascript
function MultipleEffects({ userId, isVisible }) {
  useEffect(() => {
    console.log('Effect 1: Setup');
    return () => console.log('Effect 1: Cleanup');
  }, [userId]);

  useEffect(() => {
    console.log('Effect 2: Setup');
    return () => console.log('Effect 2: Cleanup');
  }, [isVisible]);

  useEffect(() => {
    console.log('Effect 3: Setup (no deps)');
    return () => console.log('Effect 3: Cleanup');
  });

  return <div>Multiple Effects</div>;
}

// When userId changes:
// 1. Effect 1: Cleanup (previous)
// 2. Effect 1: Setup (new)
// 3. Effect 3: Cleanup (previous)
// 4. Effect 3: Setup (new)

// When isVisible changes:
// 1. Effect 2: Cleanup (previous)
// 2. Effect 2: Setup (new)
// 3. Effect 3: Cleanup (previous)
// 4. Effect 3: Setup (new)
```

**Key timing rules:**
- Cleanup functions run **before** new effects
- Each effect has its own cleanup cycle
- Effects run in the order they're defined
- All cleanups run before any new setups

### 7. **How do you handle complex async flows in useEffect?**

**Answer:**

```javascript
function ComplexAsyncFlow({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState({ user: false, posts: false });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let cancelled = false;
    const controllers = {
      user: new AbortController(),
      posts: new AbortController()
    };

    const fetchUserAndPosts = async () => {
      try {
        // Start both operations
        setLoading({ user: true, posts: true });
        setErrors({});

        // Fetch user first
        const userResponse = await fetch(`/api/users/${userId}`, {
          signal: controllers.user.signal
        });

        if (!userResponse.ok) throw new Error('Failed to fetch user');
        const userData = await userResponse.json();

        if (cancelled) return;

        setUser(userData);
        setLoading(prev => ({ ...prev, user: false }));

        // Then fetch posts using user data
        const postsResponse = await fetch(`/api/users/${userData.id}/posts`, {
          signal: controllers.posts.signal
        });

        if (!postsResponse.ok) throw new Error('Failed to fetch posts');
        const postsData = await postsResponse.json();

        if (cancelled) return;

        setPosts(postsData);
        setLoading(prev => ({ ...prev, posts: false }));

      } catch (error) {
        if (!cancelled && error.name !== 'AbortError') {
          setErrors(prev => ({ ...prev, [error.source || 'general']: error.message }));
          setLoading({ user: false, posts: false });
        }
      }
    };

    fetchUserAndPosts();

    return () => {
      cancelled = true;
      controllers.user.abort();
      controllers.posts.abort();
    };
  }, [userId]);

  return (
    <div>
      {loading.user && <div>Loading user...</div>}
      {loading.posts && <div>Loading posts...</div>}
      {errors.general && <div>Error: {errors.general}</div>}
      
      {user && (
        <div>
          <h1>{user.name}</h1>
          <div>
            {posts.map(post => (
              <article key={post.id}>
                <h2>{post.title}</h2>
                <p>{post.content}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### 8. **How do you test components with useEffect?**

**Answer:**

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest'; // or jest

// Mock fetch
global.fetch = vi.fn();

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}

// Test cases
describe('UserProfile', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('shows loading initially', () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ name: 'John Doe' })
      })
    );

    render(<UserProfile userId="123" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays user data after loading', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ name: 'John Doe' })
      })
    );

    render(<UserProfile userId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith('/api/users/123');
  });

  test('refetches when userId changes', async () => {
    fetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({ name: 'John Doe' })
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({ name: 'Jane Smith' })
        })
      );

    const { rerender } = render(<UserProfile userId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    rerender(<UserProfile userId="456" />);
    
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenNthCalledWith(2, '/api/users/456');
  });
});
```

**Testing strategies:**
- Mock external dependencies (fetch, timers, etc.)
- Use `waitFor` for async operations
- Test cleanup behavior with unmounting
- Test dependency changes with rerender
- Use React Testing Library's `act` for state updates

---

## Key Takeaways for 2025

1. **useEff