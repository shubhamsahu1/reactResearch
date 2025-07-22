# React useRef Complete Guide with Examples

## Table of Contents
1. [Introduction to useRef](#introduction-to-useref)
2. [What is useRef?](#what-is-useref)
3. [Basic Syntax and Usage](#basic-syntax-and-usage)
4. [useRef vs useState](#useref-vs-usestate)
5. [DOM Manipulation Examples](#dom-manipulation-examples)
6. [Storing Mutable Values](#storing-mutable-values)
7. [Advanced Use Cases](#advanced-use-cases)
8. [Performance Optimization](#performance-optimization)
9. [Common Patterns](#common-patterns)
10. [Best Practices](#best-practices)
11. [Common Pitfalls](#common-pitfalls)
12. [Interview Questions](#interview-questions)

---

## Introduction to useRef

The `useRef` hook is one of React's most versatile and powerful hooks, yet it's often misunderstood or underutilized by developers. Unlike `useState` or `useEffect`, `useRef` doesn't cause re-renders when its value changes, making it perfect for scenarios where you need to:

- **Access DOM elements directly**
- **Store mutable values that persist across renders**
- **Keep references to timers, intervals, or other objects**
- **Track previous values without triggering re-renders**

---

## What is useRef?

`useRef` is a React hook that returns a mutable ref object whose `.current` property is initialized to the passed argument. The returned object will persist for the full lifetime of the component.

### Key Characteristics

1. **Mutable**: You can change the `.current` property
2. **Persistent**: Values persist across renders
3. **No re-renders**: Changing the ref doesn't trigger re-renders
4. **Reference equality**: Returns the same object on every render

```javascript
import { useRef } from 'react';

function MyComponent() {
  const myRef = useRef(initialValue);
  
  // myRef.current holds the actual value
  // You can read and write to myRef.current
  
  return <div>Component content</div>;
}
```

---

## Basic Syntax and Usage

### Creating a Ref

```javascript
import React, { useRef } from 'react';

function BasicExample() {
  // Create a ref with initial value of null
  const inputRef = useRef(null);
  
  // Create a ref with initial value of 0
  const countRef = useRef(0);
  
  // Create a ref with an object
  const dataRef = useRef({ name: 'John', age: 30 });
  
  return (
    <div>
      <input ref={inputRef} type="text" />
      <p>Count: {countRef.current}</p>
    </div>
  );
}
```

### Accessing and Modifying Ref Values

```javascript
function RefOperations() {
  const valueRef = useRef(10);
  
  const handleIncrement = () => {
    // Reading the current value
    console.log('Current value:', valueRef.current);
    
    // Modifying the current value
    valueRef.current += 1;
    
    // This won't trigger a re-render!
    console.log('New value:', valueRef.current);
  };
  
  return (
    <div>
      <p>Value: {valueRef.current}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
}
```

---

## useRef vs useState

Understanding the difference between `useRef` and `useState` is crucial for choosing the right tool for your needs.

### Comparison Example

```javascript
import React, { useState, useRef } from 'react';

function ComparisonExample() {
  // useState - triggers re-render when changed
  const [stateCount, setStateCount] = useState(0);
  
  // useRef - does NOT trigger re-render when changed
  const refCount = useRef(0);
  
  const incrementState = () => {
    setStateCount(prev => prev + 1);
    console.log('State incremented, component will re-render');
  };
  
  const incrementRef = () => {
    refCount.current += 1;
    console.log('Ref incremented, but no re-render:', refCount.current);
  };
  
  console.log('Component rendered!');
  
  return (
    <div>
      <h3>useState vs useRef Comparison</h3>
      
      <div>
        <p>State Count: {stateCount}</p>
        <button onClick={incrementState}>Increment State</button>
      </div>
      
      <div>
        <p>Ref Count: {refCount.current}</p>
        <button onClick={incrementRef}>Increment Ref (No Re-render)</button>
      </div>
      
      <div>
        <button onClick={() => setStateCount(prev => prev)}>
          Force Re-render to see Ref value
        </button>
      </div>
    </div>
  );
}
```

### Key Differences Table

| Feature | useState | useRef |
|---------|----------|---------|
| **Triggers re-render** | ✅ Yes | ❌ No |
| **Mutable** | ❌ No (immutable updates) | ✅ Yes |
| **Persists across renders** | ✅ Yes | ✅ Yes |
| **Use for UI data** | ✅ Yes | ❌ No |
| **Use for non-UI data** | ❌ Not recommended | ✅ Yes |
| **Async updates** | ✅ Yes | ❌ No (synchronous) |

---

## DOM Manipulation Examples

One of the most common uses of `useRef` is to access and manipulate DOM elements directly.

### 1. Focus Management

```javascript
import React, { useRef, useEffect } from 'react';

function FocusExample() {
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  
  // Auto-focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const focusInput = () => {
    inputRef.current?.focus();
  };
  
  const focusButton = () => {
    buttonRef.current?.focus();
  };
  
  return (
    <div>
      <h3>Focus Management</h3>
      <input 
        ref={inputRef}
        type="text" 
        placeholder="This input auto-focuses on mount"
      />
      
      <button ref={buttonRef} onClick={focusInput}>
        Focus Input
      </button>
      
      <button onClick={focusButton}>
        Focus Previous Button
      </button>
    </div>
  );
}
```

### 2. Scroll to Element

```javascript
import React, { useRef } from 'react';

function ScrollExample() {
  const topRef = useRef(null);
  const middleRef = useRef(null);
  const bottomRef = useRef(null);
  
  const scrollToElement = (elementRef) => {
    elementRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  };
  
  return (
    <div>
      <div ref={topRef}>
        <h3>Top Section</h3>
        <button onClick={() => scrollToElement(middleRef)}>
          Scroll to Middle
        </button>
        <button onClick={() => scrollToElement(bottomRef)}>
          Scroll to Bottom
        </button>
      </div>
      
      <div style={{ height: '100vh', backgroundColor: '#f0f0f0' }}>
        <p>Spacer content...</p>
      </div>
      
      <div ref={middleRef} style={{ backgroundColor: '#e0ffe0', padding: '20px' }}>
        <h3>Middle Section</h3>
        <button onClick={() => scrollToElement(topRef)}>
          Scroll to Top
        </button>
        <button onClick={() => scrollToElement(bottomRef)}>
          Scroll to Bottom
        </button>
      </div>
      
      <div style={{ height: '100vh', backgroundColor: '#f0f0f0' }}>
        <p>More spacer content...</p>
      </div>
      
      <div ref={bottomRef} style={{ backgroundColor: '#ffe0e0', padding: '20px' }}>
        <h3>Bottom Section</h3>
        <button onClick={() => scrollToElement(topRef)}>
          Scroll to Top
        </button>
        <button onClick={() => scrollToElement(middleRef)}>
          Scroll to Middle
        </button>
      </div>
    </div>
  );
}
```

### 3. Measuring DOM Elements

```javascript
import React, { useRef, useState, useLayoutEffect } from 'react';

function MeasurementExample() {
  const elementRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [content, setContent] = useState('Short text');
  
  useLayoutEffect(() => {
    if (elementRef.current) {
      const { offsetWidth, offsetHeight } = elementRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [content]); // Re-measure when content changes
  
  const changeContent = () => {
    setContent(prev => 
      prev === 'Short text' 
        ? 'This is much longer text that will change the dimensions of the element significantly' 
        : 'Short text'
    );
  };
  
  return (
    <div>
      <h3>Element Measurement</h3>
      
      <div 
        ref={elementRef}
        style={{ 
          border: '2px solid #333', 
          padding: '10px', 
          maxWidth: '300px',
          backgroundColor: '#f9f9f9'
        }}
      >
        {content}
      </div>
      
      <div style={{ marginTop: '10px' }}>
        <p>Width: {dimensions.width}px</p>
        <p>Height: {dimensions.height}px</p>
        <button onClick={changeContent}>Change Content</button>
      </div>
    </div>
  );
}
```

### 4. Form Validation and Control

```javascript
import React, { useRef, useState } from 'react';

function FormExample() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    // Get current values
    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    
    // Validation logic
    if (!name || name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      nameRef.current?.focus();
    }
    
    if (!email || !email.includes('@')) {
      newErrors.email = 'Please enter a valid email';
      if (!newErrors.name) emailRef.current?.focus();
    }
    
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      if (!newErrors.name && !newErrors.email) passwordRef.current?.focus();
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      alert('Form submitted successfully!');
      // Clear form
      nameRef.current.value = '';
      emailRef.current.value = '';
      passwordRef.current.value = '';
      setErrors({});
    }
  };
  
  const clearForm = () => {
    nameRef.current.value = '';
    emailRef.current.value = '';
    passwordRef.current.value = '';
    setErrors({});
    nameRef.current?.focus();
  };
  
  return (
    <div>
      <h3>Form with useRef</h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input
            ref={nameRef}
            type="text"
            placeholder="Name"
            style={{ 
              padding: '8px',
              border: errors.name ? '2px solid red' : '1px solid #ccc'
            }}
          />
          {errors.name && <div style={{ color: 'red', fontSize: '12px' }}>{errors.name}</div>}
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <input
            ref={emailRef}
            type="email"
            placeholder="Email"
            style={{ 
              padding: '8px',
              border: errors.email ? '2px solid red' : '1px solid #ccc'
            }}
          />
          {errors.email && <div style={{ color: 'red', fontSize: '12px' }}>{errors.email}</div>}
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            style={{ 
              padding: '8px',
              border: errors.password ? '2px solid red' : '1px solid #ccc'
            }}
          />
          {errors.password && <div style={{ color: 'red', fontSize: '12px' }}>{errors.password}</div>}
        </div>
        
        <button type="submit" style={{ marginRight: '10px' }}>Submit</button>
        <button type="button" onClick={clearForm}>Clear</button>
      </form>
    </div>
  );
}
```

---

## Storing Mutable Values

`useRef` is perfect for storing values that need to persist across renders but don't need to trigger re-renders when changed.

### 1. Timer and Interval Management

```javascript
import React, { useRef, useState, useEffect } from 'react';

function TimerExample() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      startTimeRef.current = Date.now() - seconds * 1000;
      
      intervalRef.current = setInterval(() => {
        setSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 100); // Update every 100ms for smoother display
    }
  };
  
  const stopTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  const resetTimer = () => {
    stopTimer();
    setSeconds(0);
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div>
      <h3>Stopwatch Timer</h3>
      <div style={{ fontSize: '2rem', fontFamily: 'monospace', margin: '20px 0' }}>
        {formatTime(seconds)}
      </div>
      
      <div>
        {!isRunning ? (
          <button onClick={startTimer}>Start</button>
        ) : (
          <button onClick={stopTimer}>Stop</button>
        )}
        <button onClick={resetTimer} style={{ marginLeft: '10px' }}>
          Reset
        </button>
      </div>
    </div>
  );
}
```

### 2. Tracking Previous Values

```javascript
import React, { useRef, useState, useEffect } from 'react';

function PreviousValueExample() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  // Custom hook to track previous value
  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };
  
  const previousCount = usePrevious(count);
  const previousName = usePrevious(name);
  
  return (
    <div>
      <h3>Previous Value Tracking</h3>
      
      <div>
        <p>Current count: {count}</p>
        <p>Previous count: {previousCount}</p>
        <button onClick={() => setCount(c => c + 1)}>Increment</button>
        <button onClick={() => setCount(c => c - 1)}>Decrement</button>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <p>Current name: {name}</p>
        <p>Previous name: {previousName}</p>
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>
    </div>
  );
}
```

### 3. Caching Expensive Calculations

```javascript
import React, { useRef, useState, useMemo } from 'react';

function CachingExample() {
  const [input, setInput] = useState('');
  const [forceUpdate, setForceUpdate] = useState(0);
  const cacheRef = useRef(new Map());
  
  // Simulate expensive calculation
  const expensiveCalculation = (value) => {
    console.log(`Calculating for: ${value}`);
    
    // Check cache first
    if (cacheRef.current.has(value)) {
      console.log('Cache hit!');
      return cacheRef.current.get(value);
    }
    
    // Simulate expensive work
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.sin(i) * Math.cos(i);
    }
    
    // Add input length to make it somewhat meaningful
    result += value.length;
    
    // Cache the result
    cacheRef.current.set(value, result);
    console.log('Calculated and cached');
    
    return result;
  };
  
  const result = useMemo(() => expensiveCalculation(input), [input]);
  
  const clearCache = () => {
    cacheRef.current.clear();
    console.log('Cache cleared');
    setForceUpdate(prev => prev + 1); // Force recalculation
  };
  
  return (
    <div>
      <h3>Calculation Caching</h3>
      
      <div>
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to calculate"
        />
        <button onClick={clearCache} style={{ marginLeft: '10px' }}>
          Clear Cache
        </button>
      </div>
      
      <div style={{ marginTop: '10px' }}>
        <p>Result: {result.toFixed(4)}</p>
        <p>Cache size: {cacheRef.current.size}</p>
        <p>Check console for cache hit/miss information</p>
      </div>
    </div>
  );
}
```

---

## Advanced Use Cases

### 1. Component Instance Tracking

```javascript
import React, { useRef, useEffect, useState } from 'react';

function InstanceTracker() {
  const instanceIdRef = useRef(Math.random().toString(36).substr(2, 9));
  const renderCountRef = useRef(0);
  const [stateUpdate, setStateUpdate] = useState(0);
  
  // Increment render count on every render
  renderCountRef.current += 1;
  
  useEffect(() => {
    console.log(`Instance ${instanceIdRef.current} mounted`);
    
    return () => {
      console.log(`Instance ${instanceIdRef.current} unmounted`);
    };
  }, []);
  
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '5px' }}>
      <h4>Component Instance: {instanceIdRef.current}</h4>
      <p>Render count: {renderCountRef.current}</p>
      <p>State updates: {stateUpdate}</p>
      <button onClick={() => setStateUpdate(prev => prev + 1)}>
        Trigger Re-render
      </button>
    </div>
  );
}

function InstanceTrackingExample() {
  const [showComponents, setShowComponents] = useState(true);
  const [componentCount, setComponentCount] = useState(2);
  
  return (
    <div>
      <h3>Component Instance Tracking</h3>
      
      <div>
        <button onClick={() => setShowComponents(!showComponents)}>
          {showComponents ? 'Hide' : 'Show'} Components
        </button>
        <button 
          onClick={() => setComponentCount(prev => prev + 1)}
          style={{ marginLeft: '10px' }}
        >
          Add Component
        </button>
        <button 
          onClick={() => setComponentCount(prev => Math.max(1, prev - 1))}
          style={{ marginLeft: '10px' }}
        >
          Remove Component
        </button>
      </div>
      
      {showComponents && (
        <div style={{ marginTop: '10px' }}>
          {Array.from({ length: componentCount }, (_, index) => (
            <InstanceTracker key={index} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### 2. Event Listener Management

```javascript
import React, { useRef, useEffect, useState } from 'react';

function EventListenerExample() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTracking, setIsTracking] = useState(false);
  const listenerRef = useRef(null);
  
  const startTracking = () => {
    if (isTracking) return;
    
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };
    
    // Store the listener function in ref for cleanup
    listenerRef.current = handleMouseMove;
    
    window.addEventListener('mousemove', handleMouseMove);
    setIsTracking(true);
  };
  
  const stopTracking = () => {
    if (listenerRef.current) {
      window.removeEventListener('mousemove', listenerRef.current);
      listenerRef.current = null;
    }
    setIsTracking(false);
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (listenerRef.current) {
        window.removeEventListener('mousemove', listenerRef.current);
      }
    };
  }, []);
  
  return (
    <div>
      <h3>Mouse Position Tracker</h3>
      
      <div>
        <p>Mouse Position: ({position.x}, {position.y})</p>
        <p>Status: {isTracking ? 'Tracking' : 'Not tracking'}</p>
        
        {!isTracking ? (
          <button onClick={startTracking}>Start Tracking</button>
        ) : (
          <button onClick={stopTracking}>Stop Tracking</button>
        )}
      </div>
      
      {isTracking && (
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          Move your mouse around the screen to see position updates
        </div>
      )}
    </div>
  );
}
```

### 3. Imperative API with forwardRef

```javascript
import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';

// Custom input component with imperative API
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);
  const [isValid, setIsValid] = useState(true);
  
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    clear: () => {
      if (inputRef.current) {
        inputRef.current.value = '';
        setIsValid(true);
      }
    },
    validate: () => {
      const value = inputRef.current?.value || '';
      const valid = value.length >= 3;
      setIsValid(valid);
      return valid;
    },
    getValue: () => {
      return inputRef.current?.value || '';
    },
    setValue: (value) => {
      if (inputRef.current) {
        inputRef.current.value = value;
      }
    }
  }));
  
  return (
    <input
      ref={inputRef}
      {...props}
      style={{
        ...props.style,
        border: isValid ? '1px solid #ccc' : '2px solid red',
        padding: '8px'
      }}
    />
  );
});

function ImperativeExample() {
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  
  const handleFocusFirst = () => {
    input1Ref.current?.focus();
  };
  
  const handleValidateAll = () => {
    const input1Valid = input1Ref.current?.validate();
    const input2Valid = input2Ref.current?.validate();
    
    if (input1Valid && input2Valid) {
      alert('All inputs are valid!');
    } else {
      alert('Please check your inputs');
    }
  };
  
  const handleClearAll = () => {
    input1Ref.current?.clear();
    input2Ref.current?.clear();
  };
  
  const handleFillSample = () => {
    input1Ref.current?.setValue('Sample Name');
    input2Ref.current?.setValue('sample@email.com');
  };
  
  return (
    <div>
      <h3>Imperative Component API</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <FancyInput 
          ref={input1Ref}
          placeholder="Name (min 3 chars)"
          style={{ marginRight: '10px' }}
        />
        <FancyInput 
          ref={input2Ref}
          placeholder="Email (min 3 chars)"
        />
      </div>
      
      <div>
        <button onClick={handleFocusFirst}>Focus First</button>
        <button onClick={handleValidateAll} style={{ marginLeft: '10px' }}>
          Validate All
        </button>
        <button onClick={handleClearAll} style={{ marginLeft: '10px' }}>
          Clear All
        </button>
        <button onClick={handleFillSample} style={{ marginLeft: '10px' }}>
          Fill Sample
        </button>
      </div>
    </div>
  );
}
```

---

## Performance Optimization

### 1. Avoiding Expensive Re-calculations

```javascript
import React, { useRef, useState, useCallback } from 'react';

function PerformanceOptimizationExample() {
  const [items, setItems] = useState(Array.from({ length: 1000 }, (_, i) => i));
  const [filter, setFilter] = useState('');
  const expensiveOperationRef = useRef(null);
  
  // Cache expensive filtered results
  const getFilteredItems = useCallback(() => {
    // Use ref to cache the last result
    const cacheKey = filter;
    
    if (expensiveOperationRef.current?.key === cacheKey) {
      console.log('Using cached result');
      return expensiveOperationRef.current.result;
    }
    
    console.log('Performing expensive filtering...');
    
    // Simulate expensive operation
    const start = performance.now();
    
    const filtered = items.filter(item => {
      // Simulate expensive work per item
      for (let i = 0; i < 1000; i++) {
        Math.random();
      }
      return item.toString().includes(filter);
    });
    
    const end = performance.now();
    console.log(`Filtering took ${end - start} milliseconds`);
    
    // Cache the result
    expensiveOperationRef.current = {
      key: cacheKey,
      result: filtered
    };
    
    return filtered;
  }, [items, filter]);
  
  const filteredItems = getFilteredItems();
  
  const addRandomItems = () => {
    const newItems = Array.from({ length: 100 }, () => Math.floor(Math.random() * 10000));
    setItems(prev => [...prev, ...newItems]);
    // Clear cache when items change
    expensiveOperationRef.current = null;
  };
  
  return (
    <div>
      <h3>Performance Optimization with Caching</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <input 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter numbers..."
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button onClick={addRandomItems}>Add 100 Random Items</button>
      </div>
      
      <div>
        <p>Total items: {items.length}</p>
        <p>Filtered items: {filteredItems.length}</p>
        <p>Check console for performance logs</p>
      </div>
      
      <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc' }}>
        {filteredItems.slice(0, 50).map((item, index) => (
          <div key={`${item}-${index}`} style={{ padding: '2px 8px' }}>
            {item}
          </div>
        ))}
        {filteredItems.length > 50 && (
          <div style={{ padding: '8px', fontStyle: 'italic' }}>
            ...and {filteredItems.length - 50} more items
          </div>
        )}
      </div>
    </div>
  );
}
```

### 2. Debouncing with useRef

```javascript
import React, { useRef, useState, useCallback } from 'react';

function DebounceExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef(null);
  const requestRef = useRef(null);
  
  // Mock search function
  const performSearch = async (query) => {
    // Cancel previous request
    if (requestRef.current) {
      requestRef.current.cancelled = true;
    }
    
    // Create new request tracker
    const currentRequest = { cancelled: false };
    requestRef.current = currentRequest;
    
    setIsSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if this request was cancelled
    if (currentRequest.cancelled) {
      return;
    }
    
    // Mock search results
    const mockResults = query ? [
      `Result 1 for "${query}"`,
      `Result 2 for "${query}"`,
      `Result 3 for "${query}"`,
    ] : [];
    
    setSearchResults(mockResults);
    setIsSearching(false);
  };
  
  const debouncedSearch = useCallback((query) => {
    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Set new timeout
    debounceRef.current = setTimeout(() => {
      performSearch(query);
    }, 300); // 300ms delay
  }, []);
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };
  
  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (requestRef.current) {
        requestRef.current.cancelled = true;
      }
    };
  }, []);
  
  return (
    <div>
      <h3>Debounced Search</h3>
      
      <input 
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search something..."
        style={{ padding: '8px', width: '300px' }}
      />
      
      <div style={{ marginTop: '10px' }}>
        {isSearching ? (
          <p>Searching...</p>
        ) : (
          <div>
            {searchResults.length > 0 ? (
              <ul>
                {searchResults.map((result, index) => (
                  <li key={index}>{result}</li>
                ))}
              </ul>
            ) : searchTerm ? (
              <p>No results found</p>
            ) : (
              <p>Enter a search term to see results</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Common Patterns

### 1. Custom Hook for Local Storage

```javascript
import React, { useRef, useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  // Use ref to track if we're setting value to avoid infinite loops
  const isSettingRef = useRef(false);
  
  const setValue = (value) => {
    try {
      isSettingRef.current = true;
      setStoredValue(value);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    } finally {
      isSettingRef.current = false;
    }
  };
  
  // Listen for changes to localStorage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && !isSettingRef.current) {
        try {
          setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
        } catch (error) {
          console.error(`Error parsing localStorage key "${key}":`, error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);
  
  return [storedValue, setValue];
}

function LocalStorageExample() {
  const [name, setName] = useLocalStorage('userName', '');
  const [preferences, setPreferences] = useLocalStorage('userPreferences', {
    theme: 'light',
    notifications: true
  });
  
  const updateTheme = (newTheme) => {
    setPreferences(prev => ({ ...prev, theme: newTheme }));
  };
  
  const toggleNotifications = () => {
    setPreferences(prev => ({ ...prev, notifications: !prev.notifications }));
  };
  
  return (
    <div>
      <h3>LocalStorage Integration</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          Name: 
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginLeft: '10px', padding: '4px' }}
          />
        </label>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Preferences</h4>
        <div>
          <label>
            Theme: 
            <select 
              value={preferences.theme}
              onChange={(e) => updateTheme(e.target.value)}
              style={{ marginLeft: '10px' }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
        
        <div style={{ marginTop: '10px' }}>
          <label>
            <input 
              type="checkbox"
              checked={preferences.notifications}
              onChange={toggleNotifications}
            />
            <span style={{ marginLeft: '5px' }}>Enable notifications</span>
          </label>
        </div>
      </div>
      
      <div style={{ padding: '10px', backgroundColor: '#f5f5f5' }}>
        <p><strong>Current Values:</strong></p>
        <p>Name: {name || 'Not set'}</p>
        <p>Theme: {preferences.theme}</p>
        <p>Notifications: {preferences.notifications ? 'Enabled' : 'Disabled'}</p>
        <p><em>Open this page in another tab to see real-time synchronization!</em></p>
      </div>
    </div>
  );
}
```

### 2. Infinite Scroll Implementation

```javascript
import React, { useRef, useState, useEffect, useCallback } from 'react';

function InfiniteScrollExample() {
  const [items, setItems] = useState(Array.from({ length: 20 }, (_, i) => i + 1));
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(null);
  const observerRef = useRef(null);
  
  const loadMoreItems = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const currentLength = items.length;
    const newItems = Array.from({ length: 20 }, (_, i) => currentLength + i + 1);
    
    setItems(prev => [...prev, ...newItems]);
    setIsLoading(false);
    
    // Stop loading more after 200 items
    if (currentLength + newItems.length >= 200) {
      setHasMore(false);
    }
  }, [isLoading, hasMore, items.length]);
  
  useEffect(() => {
    const currentLoadingRef = loadingRef.current;
    
    if (!currentLoadingRef) return;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreItems();
        }
      },
      { threshold: 1.0 }
    );
    
    observerRef.current.observe(currentLoadingRef);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreItems, hasMore, isLoading]);
  
  return (
    <div>
      <h3>Infinite Scroll</h3>
      
      <div style={{ 
        height: '400px', 
        overflowY: 'auto', 
        border: '1px solid #ccc',
        padding: '10px'
      }}>
        {items.map(item => (
          <div 
            key={item}
            style={{ 
              padding: '10px', 
              margin: '5px 0', 
              backgroundColor: '#f9f9f9',
              borderRadius: '4px'
            }}
          >
            Item {item}
          </div>
        ))}
        
        {hasMore && (
          <div 
            ref={loadingRef}
            style={{ 
              padding: '20px', 
              textAlign: 'center',
              color: '#666'
            }}
          >
            {isLoading ? 'Loading more items...' : 'Scroll to load more'}
          </div>
        )}
        
        {!hasMore && (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center', 
            color: '#999',
            fontStyle: 'italic'
          }}>
            No more items to load
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Best Practices

### 1. Initialization Patterns

```javascript
import React, { useRef, useState } from 'react';

function InitializationPatternsExample() {
  // ✅ Good: Simple initial value
  const simpleRef = useRef(0);
  
  // ✅ Good: Lazy initialization for expensive objects
  const expensiveRef = useRef(null);
  
  // Initialize expensive object only when needed
  const getExpensiveObject = () => {
    if (expensiveRef.current === null) {
      console.log('Creating expensive object...');
      expensiveRef.current = {
        data: new Array(1000000).fill(0).map(() => Math.random()),
        createdAt: Date.now()
      };
    }
    return expensiveRef.current;
  };
  
  // ✅ Good: Function initialization for complex scenarios
  const complexRef = useRef(() => {
    // This function runs only once
    return {
      id: Math.random().toString(36),
      timestamp: Date.now(),
      config: { theme: 'default', debug: false }
    };
  });
  
  // Get the actual value (call the function if it's a function)
  const complexValue = typeof complexRef.current === 'function' 
    ? complexRef.current() 
    : complexRef.current;
  
  const [triggerExpensive, setTriggerExpensive] = useState(false);
  
  return (
    <div>
      <h3>Initialization Patterns</h3>
      
      <div>
        <h4>Simple Ref</h4>
        <p>Value: {simpleRef.current}</p>
        <button onClick={() => simpleRef.current++}>
          Increment (no re-render)
        </button>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h4>Expensive Object (Lazy Loading)</h4>
        <p>Status: {expensiveRef.current ? 'Created' : 'Not created yet'}</p>
        <button onClick={() => setTriggerExpensive(!triggerExpensive)}>
          {expensiveRef.current ? 'Access' : 'Create'} Expensive Object
        </button>
        {triggerExpensive && expensiveRef.current && (
          <p>Created at: {new Date(expensiveRef.current.createdAt).toLocaleTimeString()}</p>
        )}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h4>Complex Initialization</h4>
        <p>ID: {complexValue.id}</p>
        <p>Timestamp: {new Date(complexValue.timestamp).toLocaleString()}</p>
        <p>Config: {JSON.stringify(complexValue.config)}</p>
      </div>
    </div>
  );
}
```

### 2. Cleanup Patterns

```javascript
import React, { useRef, useEffect, useState } from 'react';

function CleanupPatternsExample() {
  const [isActive, setIsActive] = useState(false);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const animationFrameRef = useRef(null);
  const observerRef = useRef(null);
  const elementRef = useRef(null);
  
  // Cleanup function that clears all refs
  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  };
  
  const startOperations = () => {
    setIsActive(true);
    
    // Set timeout
    timeoutRef.current = setTimeout(() => {
      console.log('Timeout executed');
    }, 5000);
    
    // Set interval
    intervalRef.current = setInterval(() => {
      console.log('Interval tick');
    }, 1000);
    
    // Animation frame
    const animate = () => {
      console.log('Animation frame');
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Intersection Observer
    if (elementRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        console.log('Element visibility changed');
      });
      observerRef.current.observe(elementRef.current);
    }
  };
  
  const stopOperations = () => {
    setIsActive(false);
    cleanup();
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, []);
  
  return (
    <div>
      <h3>Cleanup Patterns</h3>
      
      <div ref={elementRef} style={{ 
        padding: '20px', 
        backgroundColor: isActive ? '#e8f5e8' : '#f5f5f5',
        marginBottom: '10px'
      }}>
        <p>Observed Element - Status: {isActive ? 'Active' : 'Inactive'}</p>
      </div>
      
      <div>
        {!isActive ? (
          <button onClick={startOperations}>Start Operations</button>
        ) : (
          <button onClick={stopOperations}>Stop Operations</button>
        )}
      </div>
      
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        Check the console to see the various operations running
      </div>
    </div>
  );
}
```

---

## Common Pitfalls

### 1. Accessing Ref During Render

```javascript
import React, { useRef, useState, useEffect } from 'react';

function PitfallsExample() {
  const [count, setCount] = useState(0);
  const inputRef = useRef(null);
  const renderCountRef = useRef(0);
  
  // ❌ Bad: Accessing ref during render
  // This can cause issues because the ref might not be set yet
  console.log('During render - input value:', inputRef.current?.value);
  
  // ✅ Good: Access ref in effects or event handlers
  useEffect(() => {
    console.log('In effect - input value:', inputRef.current?.value);
  });
  
  // ❌ Bad: Modifying ref during render (causes side effects)
  // renderCountRef.current++; // Don't do this!
  
  // ✅ Good: Modify ref in effects or event handlers
  useEffect(() => {
    renderCountRef.current++;
  });
  
  const handleButtonClick = () => {
    // ✅ Good: Access ref in event handler
    if (inputRef.current) {
      inputRef.current.focus();
      console.log('Button clicked - input value:', inputRef.current.value);
    }
    
    setCount(prev => prev + 1);
  };
  
  // ❌ Bad: Using ref for state that affects rendering
  const badCountRef = useRef(0);
  
  const incrementBadRef = () => {
    badCountRef.current++; // This won't trigger re-render!
    // UI won't update to show new value
  };
  
  return (
    <div>
      <h3>Common Pitfalls</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>✅ Correct Usage</h4>
        <input ref={inputRef} type="text" placeholder="Type something..." />
        <button onClick={handleButtonClick}>Focus Input & Count</button>
        <p>Count (useState): {count}</p>
        <p>Render Count: {renderCountRef.current}</p>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>❌ Incorrect Usage Example</h4>
        <p>Bad Count (useRef): {badCountRef.current}</p>
        <button onClick={incrementBadRef}>
          Increment Bad Ref (Won't Update UI)
        </button>
        <p style={{ fontSize: '12px', color: '#666' }}>
          Click the button above - the UI won't update even though the ref value changes
        </p>
      </div>
    </div>
  );
}
```

### 2. Memory Leaks and Stale Closures

```javascript
import React, { useRef, useState, useEffect, useCallback } from 'react';

function MemoryLeakExample() {
  const [isVisible, setIsVisible] = useState(true);
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h3>Memory Leak Prevention</h3>
      
      <div>
        <button onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? 'Hide' : 'Show'} Component
        </button>
        <button onClick={() => setCount(c => c + 1)} style={{ marginLeft: '10px' }}>
          Count: {count}
        </button>
      </div>
      
      {isVisible && <LeakyComponent count={count} />}
    </div>
  );
}

function LeakyComponent({ count }) {
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const listenerRef = useRef(null);
  const [internalCount, setInternalCount] = useState(0);
  
  // ❌ Bad: Not cleaning up properly
  const startBadInterval = () => {
    setInterval(() => {
      console.log('Bad interval tick - potential memory leak!');
    }, 1000);
    // No reference stored, can't be cleaned up!
  };
  
  // ✅ Good: Proper cleanup
  const startGoodInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      setInternalCount(prev => {
        console.log('Good interval tick, count:', prev + 1);
        return prev + 1;
      });
    }, 1000);
  }, []);
  
  // ❌ Bad: Stale closure problem
  const startBadTimeout = () => {
    timeoutRef.current = setTimeout(() => {
      // This captures the current value of count, creating a stale closure
      console.log('Stale count value:', count);
    }, 3000);
  };
  
  // ✅ Good: Using ref to avoid stale closure
  const countRef = useRef(count);
  countRef.current = count; // Always keep it updated
  
  const startGoodTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      // This always gets the latest value
      console.log('Fresh count value:', countRef.current);
    }, 3000);
  };
  
  // Event listener management
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        console.log('Escape pressed, current count:', countRef.current);
      }
    };
    
    listenerRef.current = handleKeyPress;
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []); // Empty dependency array is fine here
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log('Cleaned up interval');
      }
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        console.log('Cleaned up timeout');
      }
    };
  }, []);
  
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px 0' }}>
      <h4>Component with Cleanup Examples</h4>
      <p>External Count: {count}</p>
      <p>Internal Count: {internalCount}</p>
      
      <div>
        <button onClick={startBadInterval} style={{ marginRight: '10px' }}>
          Start Bad Interval ❌
        </button>
        <button onClick={startGoodInterval} style={{ marginRight: '10px' }}>
          Start Good Interval ✅
        </button>
      </div>
      
      <div style={{ marginTop: '10px' }}>
        <button onClick={startBadTimeout} style={{ marginRight: '10px' }}>
          Start Bad Timeout ❌
        </button>
        <button onClick={startGoodTimeout}>
          Start Good Timeout ✅
        </button>
      </div>
      
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        Try hiding/showing this component and pressing Escape key. 
        Check console for messages.
      </p>
    </div>
  );
}
```

---

## Interview Questions

### Common useRef Interview Questions with Detailed Answers

#### 1. **What is useRef and how does it differ from useState?**

**Answer:**
```javascript
// useRef example
const countRef = useRef(0);
countRef.current++; // No re-render

// useState example
const [count, setCount] = useState(0);
setCount(count + 1); // Triggers re-render
```

**Key Differences:**
- **useRef**: Mutable, no re-render, synchronous updates
- **useState**: Immutable, triggers re-render, asynchronous updates
- **useRef**: For non-UI data, DOM references
- **useState**: For UI state that affects rendering

#### 2. **When would you use useRef instead of useState?**

**Answer:**
```javascript
function ExampleUseCases() {
  // ✅ Use useRef for:
  const inputRef = useRef(null); // DOM element access
  const timerRef = useRef(null); // Timer/interval IDs
  const previousValueRef = useRef(); // Previous state values
  const renderCountRef = useRef(0); // Render counting
  const cacheRef = useRef(new Map()); // Caching data
  
  // ✅ Use useState for:
  const [visible, setVisible] = useState(false); // UI state
  const [userInput, setUserInput] = useState(''); // Form data
  const [loading, setLoading] = useState(false); // Loading states
  
  return <div>Example component</div>;
}
```

#### 3. **How do you implement a timer with useRef?**

**Answer:**
```javascript
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
  };
  
  const stopTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  const resetTimer = () => {
    stopTimer();
    setSeconds(0);
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return (
    <div>
      <p>Time: {seconds}s</p>
      <button onClick={startTimer} disabled={isRunning}>Start</button>
      <button onClick={stopTimer} disabled={!isRunning}>Stop</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}
```

#### 4. **How do you track previous values with useRef?**

**Answer:**
```javascript
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

function ComponentWithPreviousValue() {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);
  
  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {previousCount}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}
```

#### 5. **What are the potential pitfalls of using useRef?**

**Answer:**
```javascript
function PitfallExamples() {
  const ref = useRef(0);
  
  // ❌ Pitfall 1: Using ref for UI state
  const incrementBad = () => {
    ref.current++; // UI won't update!
  };
  
  // ❌ Pitfall 2: Accessing ref during render
  console.log(ref.current); // Avoid this in render
  
  // ❌ Pitfall 3: Not cleaning up
  useEffect(() => {
    const timer = setInterval(() => {}, 1000);
    // Missing cleanup!
  }, []);
  
  // ✅ Correct approach
  const [uiState, setUiState] = useState(0);
  const timerRef = useRef(null);
  
  useEffect(() => {
    timerRef.current = setInterval(() => {
      console.log('Timer tick');
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  return <div>Component content</div>;
}
```

#### 6. **How does useRef work with forwardRef?**

**Answer:**
```javascript
const CustomInput = forwardRef((props, ref) => {
  const internalRef = useRef(null);
  
  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    focus: () => {
      internalRef.current?.focus();
    },
    clear: () => {
      if (internalRef.current) {
        internalRef.current.value = '';
      }
    },
    getValue: () => {
      return internalRef.current?.value || '';
    }
  }));
  
  return <input ref={internalRef} {...props} />;
});

function ParentComponent() {
  const inputRef = useRef(null);
  
  const handleFocus = () => {
    inputRef.current?.focus();
  };
  
  const handleClear = () => {
    inputRef.current?.clear();
  };
  
  return (
    <div>
      <CustomInput ref={inputRef} placeholder="Custom input" />
      <button onClick={handleFocus}>Focus</button>
      <button onClick={handleClear}>Clear</button>
    </div>
  );
}
```

---

## Conclusion

The `useRef` hook is a powerful and versatile tool in React that serves multiple purposes:

### Key Takeaways

1. **DOM Access**: Perfect for focusing inputs, scrolling, measuring elements
2. **Mutable Storage**: Store values that persist across renders without causing re-renders
3. **Performance**: Avoid expensive recalculations and prevent unnecessary re-renders
4. **Cleanup**: Essential for managing timers, intervals, and event listeners
5. **Previous Values**: Track changes between renders

### When to Use useRef

- ✅ **DOM manipulation and access**
- ✅ **Storing mutable values (timers, counters, caches)**
- ✅ **Avoiding stale closures**
- ✅ **Performance optimization**
- ✅ **Cleanup operations**

### When NOT to Use useRef

- ❌ **UI state that affects rendering** (use useState instead)
- ❌ **Data that should trigger re-renders**
- ❌ **As a replacement for proper state management**

### Best Practices Summary

1. **Always clean up**: Clear timers, intervals, and event listeners
2. **Use TypeScript**: Get better type safety with refs
3. **Avoid during render**: Don't access refs during the render phase
4. **Combine wisely**: Use with useState and useEffect when needed
5. **Test thoroughly**: Especially cleanup behavior and edge cases

By mastering `useRef`, you'll be able to build more performant and interactive React applications while avoiding common pitfalls and memory leaks.