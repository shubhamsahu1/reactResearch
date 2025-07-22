# useTransition vs useDeferredValue - Complete Guide

React 18 introduced two powerful hooks for managing performance and user experience during expensive operations: `useTransition` and `useDeferredValue`. While both help with performance optimization, they serve different purposes and use cases.

## Table of Contents
- [Overview](#overview)
- [useTransition Hook](#usetransition-hook)
- [useDeferredValue Hook](#usedeferredvalue-hook)
- [Key Differences](#key-differences)
- [When to Use Which](#when-to-use-which)
- [Advanced Patterns](#advanced-patterns)
- [Performance Considerations](#performance-considerations)

---

## Overview

Both hooks are part of React's Concurrent Features, designed to improve user experience by:
- Keeping the UI responsive during expensive operations
- Allowing urgent updates to interrupt non-urgent ones
- Providing better perceived performance

**Core Concept:** React classifies updates as either **urgent** or **non-urgent** (transitions):
- **Urgent:** Direct user interactions (typing, clicking, hovering)
- **Non-urgent:** Background updates (data fetching, filtering, complex calculations)

---

## useTransition Hook

`useTransition` allows you to mark state updates as non-urgent transitions, keeping the UI responsive.

### Basic Syntax
```javascript
import { useTransition } from 'react';

const [isPending, startTransition] = useTransition();
```

### Key Features
- Returns `[isPending, startTransition]`
- `isPending`: Boolean indicating if transition is in progress
- `startTransition`: Function to wrap non-urgent updates
- **You control** which state updates are marked as transitions

### Example 1: Basic Search Filter
```javascript
import { useState, useTransition } from 'react';

function SearchableList({ items }) {
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value) => {
    // Urgent update - keeps input responsive
    setQuery(value);
    
    // Non-urgent update - expensive filtering
    startTransition(() => {
      const filtered = items.filter(item => 
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(filtered);
    });
  };

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search items..."
      />
      
      {isPending && <div className="loading">Filtering results...</div>}
      
      <div className={isPending ? 'opacity-50' : ''}>
        {filteredItems.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    </div>
  );
}
```

### Example 2: Tab Switching with Heavy Content
```javascript
import { useState, useTransition } from 'react';

function TabContainer() {
  const [activeTab, setActiveTab] = useState('tab1');
  const [isPending, startTransition] = useTransition();

  const handleTabClick = (tabId) => {
    startTransition(() => {
      setActiveTab(tabId);
    });
  };

  return (
    <div>
      <div className="tabs">
        <button 
          onClick={() => handleTabClick('tab1')}
          className={activeTab === 'tab1' ? 'active' : ''}
        >
          Dashboard
        </button>
        <button 
          onClick={() => handleTabClick('tab2')}
          className={activeTab === 'tab2' ? 'active' : ''}
        >
          Heavy Data Table
        </button>
        <button 
          onClick={() => handleTabClick('tab3')}
          className={activeTab === 'tab3' ? 'active' : ''}
        >
          Charts
        </button>
      </div>

      {isPending && <div className="loading-bar" />}

      <div className="tab-content">
        {activeTab === 'tab1' && <Dashboard />}
        {activeTab === 'tab2' && <HeavyDataTable />}
        {activeTab === 'tab3' && <ComplexCharts />}
      </div>
    </div>
  );
}
```

---

## useDeferredValue Hook

`useDeferredValue` creates a deferred version of a value that lags behind the original during transitions.

### Basic Syntax
```javascript
import { useDeferredValue } from 'react';

const deferredValue = useDeferredValue(value);
```

### Key Features
- Takes a value and returns a deferred version
- **React controls** when the deferred value updates
- Useful when you receive props from parent components
- Automatically integrates with transitions

### Example 1: Search Results with Deferred Query
```javascript
import { useState, useDeferredValue, useMemo } from 'react';

function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  
  const results = useMemo(() => {
    // Expensive search operation
    return performExpensiveSearch(deferredQuery);
  }, [deferredQuery]);

  const isStale = query !== deferredQuery;

  return (
    <div>
      <div className={isStale ? 'opacity-50' : ''}>
        {results.map(result => (
          <div key={result.id}>{result.title}</div>
        ))}
      </div>
      {isStale && <div className="loading">Updating results...</div>}
    </div>
  );
}

function App() {
  const [query, setQuery] = useState('');

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <SearchResults query={query} />
    </div>
  );
}
```

### Example 2: Real-time Data Visualization
```javascript
import { useDeferredValue, useMemo } from 'react';

function DataVisualization({ rawData, filters }) {
  const deferredFilters = useDeferredValue(filters);
  
  const processedData = useMemo(() => {
    // Expensive data processing
    return processDataWithFilters(rawData, deferredFilters);
  }, [rawData, deferredFilters]);
  
  const chartConfig = useMemo(() => {
    // Expensive chart configuration
    return generateChartConfig(processedData);
  }, [processedData]);

  const isUpdating = filters !== deferredFilters;

  return (
    <div className="chart-container">
      {isUpdating && (
        <div className="update-indicator">
          Updating visualization...
        </div>
      )}
      <Chart 
        data={processedData} 
        config={chartConfig}
        className={isUpdating ? 'updating' : ''}
      />
    </div>
  );
}
```

---

## Key Differences

| Aspect | useTransition | useDeferredValue |
|--------|---------------|------------------|
| **Control** | You manually wrap updates | React automatically defers values |
| **Use Case** | When you control state updates | When receiving props from parent |
| **Pending State** | Provides `isPending` flag | No built-in pending state |
| **Flexibility** | More control over what's deferred | Less control, more automatic |
| **Best For** | Complex state management | Simple value deferring |

### Side-by-side Comparison

```javascript
// useTransition - Manual control
function ManualTransition() {
  const [input, setInput] = useState('');
  const [list, setList] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (value) => {
    setInput(value); // Urgent
    startTransition(() => {
      setList(generateList(value)); // Non-urgent
    });
  };

  return (
    <div>
      <input onChange={(e) => handleChange(e.target.value)} />
      {isPending && <Spinner />}
      <List items={list} />
    </div>
  );
}

// useDeferredValue - Automatic deferring
function AutomaticDeferring({ searchTerm }) {
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const list = useMemo(() => generateList(deferredSearchTerm), [deferredSearchTerm]);
  const isStale = searchTerm !== deferredSearchTerm;

  return (
    <div>
      {isStale && <Spinner />}
      <List items={list} />
    </div>
  );
}
```

---

## When to Use Which

### Use `useTransition` when:
- **You control the state updates** within your component
- **You need fine-grained control** over which updates are urgent vs non-urgent
- **You want a pending indicator** for better UX
- **Complex state management** with multiple related updates
- **Event handlers** that trigger expensive operations

### Use `useDeferredValue` when:
- **You receive props** from a parent component
- **Simple value deferring** is all you need
- **Working with derived state** based on props
- **You want React to handle** the transition logic automatically
- **Memoized computations** based on frequently changing props

---

## Advanced Patterns

### Combining Both Hooks
```javascript
function AdvancedSearchComponent({ initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [sortOrder, setSortOrder] = useState('asc');
  const [results, setResults] = useState([]);
  
  // useTransition for local state updates
  const [isPending, startTransition] = useTransition();
  
  // useDeferredValue for props
  const deferredInitialQuery = useDeferredValue(initialQuery);
  
  // Sync with parent's initial query changes
  useEffect(() => {
    if (deferredInitialQuery !== query) {
      setQuery(deferredInitialQuery);
    }
  }, [deferredInitialQuery]);
  
  const handleSearch = (newQuery) => {
    setQuery(newQuery); // Urgent - keep input responsive
    
    startTransition(() => {
      // Non-urgent - expensive search
      const searchResults = performSearch(newQuery, sortOrder);
      setResults(searchResults);
    });
  };
  
  const handleSortChange = (newSort) => {
    startTransition(() => {
      setSortOrder(newSort);
      const sortedResults = sortResults(results, newSort);
      setResults(sortedResults);
    });
  };

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
      
      <select onChange={(e) => handleSortChange(e.target.value)}>
        <option value="asc">A-Z</option>
        <option value="desc">Z-A</option>
      </select>
      
      {isPending && <LoadingIndicator />}
      
      <ResultsList 
        results={results} 
        className={isPending ? 'loading' : ''}
      />
    </div>
  );
}
```

### Custom Hook Pattern
```javascript
function useTransitionWithDeferred(initialValue) {
  const [value, setValue] = useState(initialValue);
  const [isPending, startTransition] = useTransition();
  const deferredValue = useDeferredValue(value);
  
  const updateValue = (newValue) => {
    startTransition(() => {
      setValue(newValue);
    });
  };
  
  return {
    value,
    deferredValue,
    updateValue,
    isPending,
    isStale: value !== deferredValue
  };
}

// Usage
function MyComponent() {
  const { 
    value, 
    deferredValue, 
    updateValue, 
    isPending, 
    isStale 
  } = useTransitionWithDeferred('');
  
  const expensiveData = useMemo(() => {
    return computeExpensiveData(deferredValue);
  }, [deferredValue]);
  
  return (
    <div>
      <input 
        value={value}
        onChange={(e) => updateValue(e.target.value)}
      />
      
      {(isPending || isStale) && <Spinner />}
      
      <ExpensiveComponent data={expensiveData} />
    </div>
  );
}
```

---

## Performance Considerations

### Best Practices

1. **Don't overuse transitions**
   ```javascript
   // ❌ Don't wrap every state update
   startTransition(() => {
     setSimpleCounter(count + 1);
   });
   
   // ✅ Only wrap expensive operations
   startTransition(() => {
     setFilteredData(expensiveFilter(data));
   });
   ```

2. **Combine with memoization**
   ```javascript
   const deferredQuery = useDeferredValue(query);
   
   const expensiveResults = useMemo(() => {
     return performExpensiveComputation(deferredQuery);
   }, [deferredQuery]);
   ```

3. **Use appropriate loading states**
   ```javascript
   // ✅ Good UX with loading indicators
   {isPending && <div className="loading-overlay">Processing...</div>}
   {isStale && <div className="updating-badge">Updating...</div>}
   ```

### Common Pitfalls

1. **Forgetting to memoize expensive computations**
2. **Not providing loading feedback to users**
3. **Using transitions for non-expensive operations**
4. **Mixing urgent and non-urgent updates incorrectly**

### Performance Monitoring
```javascript
function usePerformanceMonitor(label) {
  const [isPending, startTransition] = useTransition();
  
  const monitoredStartTransition = useCallback((callback) => {
    performance.mark(`${label}-start`);
    startTransition(() => {
      callback();
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);
    });
  }, [label]);
  
  return [isPending, monitoredStartTransition];
}
```

---

## Summary

- **useTransition**: Manual control over state updates, provides pending state, best for complex state management
- **useDeferredValue**: Automatic value deferring, best for props and simple derived state
- **Both**: Improve perceived performance by keeping urgent updates responsive
- **Choose based on**: Whether you control the state updates or receive values as props
- **Combine when needed**: Use both hooks together for complex scenarios
- **Always**: Provide loading feedback and monitor performance impact