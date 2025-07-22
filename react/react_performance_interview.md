# React Performance Interview Questions

## 1. Virtualization and Large Datasets

### Basic Level
**Question:** What is virtualization in the context of React applications, and why would you use it?

**Follow-up:** Can you explain the difference between rendering 10,000 DOM elements vs using a virtualized list for the same data?

### Intermediate Level
**Question:** You have a table with 50,000 rows of data. Users are complaining about slow scrolling and initial render times. How would you approach this problem using virtualization?

**Technical Deep Dive:** 
- Which libraries have you used for virtualization? (react-window, react-virtualized, etc.)
- How does windowing work under the hood?
- What are the trade-offs of using virtualization?

**Code Challenge:**
```javascript
// Given this component that renders a large list, how would you optimize it?
function ProductList({ products }) {
  return (
    <div className="product-list">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

## 2. Code Splitting and Initial Load Time

### Basic Level
**Question:** What is code splitting and how does it help with application performance?

**Follow-up:** Explain the difference between static and dynamic imports in JavaScript.

### Intermediate Level
**Question:** You have a React application with multiple routes. The initial bundle size is 2MB, causing slow load times. How would you implement code splitting to improve this?

**Scenario-based Question:** 
Your e-commerce app has:
- Home page (always needed)
- Product catalog (frequently used)
- Admin dashboard (rarely used by most users)
- Checkout flow (used occasionally)

How would you structure your code splitting strategy?

**Technical Implementation:**
```javascript
// How would you optimize this routing setup?
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/checkout" element={<CheckoutFlow />} />
    </Routes>
  );
}
```

### Advanced Level
**Question:** How do you handle loading states and error boundaries with code-split components? What happens if a chunk fails to load?

---

## 3. useTransition Hook and Perceived Performance

### Basic Level
**Question:** What is the `useTransition` hook and when would you use it?

**Follow-up:** Explain the difference between urgent and non-urgent updates in React 18.

### Intermediate Level
**Scenario Question:** You have a search interface where users type in a search box, and results are filtered in real-time. Users are experiencing lag while typing. How would `useTransition` help here?

**Code Implementation:**
```javascript
// How would you optimize this search component?
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    // Heavy filtering operation
    const filteredResults = heavyFilter(allData, query);
    setResults(filteredResults);
  }, [query]);
  
  return (
    <div>
      {results.map(result => <ResultItem key={result.id} item={result} />)}
    </div>
  );
}
```

### Advanced Level
**Question:** How does `useTransition` work with Concurrent Features? What's the difference between `useTransition` and `useDeferredValue`?

**Complex Scenario:** You have a dashboard with multiple widgets that update based on date range selection. Some widgets load quickly (charts), others are expensive (data tables). How would you use `useTransition` to prioritize the user experience?

---

## 4. Identifying Expensive Computations in Render Functions

### Basic Level
**Question:** What are some common performance anti-patterns you should avoid in React render functions?

**Code Review:** What's wrong with this component from a performance perspective?
```javascript
function UserProfile({ user, allUsers }) {
  const friends = allUsers.filter(u => user.friendIds.includes(u.id));
  const sortedFriends = friends.sort((a, b) => a.name.localeCompare(b.name));
  
  return (
    <div>
      <h1>{user.name}</h1>
      {sortedFriends.map(friend => (
        <div key={friend.id}>{friend.name}</div>
      ))}
    </div>
  );
}
```

### Intermediate Level
**Question:** How would you use React DevTools Profiler to identify performance bottlenecks? Walk me through the process.

**Optimization Challenge:** 
```javascript
function ExpensiveComponent({ data, filterType, sortOrder }) {
  // This component re-renders frequently
  const processedData = data
    .filter(item => item.type === filterType)
    .map(item => ({
      ...item,
      displayName: formatName(item.firstName, item.lastName),
      age: calculateAge(item.birthDate)
    }))
    .sort((a, b) => sortOrder === 'asc' ? a.age - b.age : b.age - a.age);
  
  return (
    <div>
      {processedData.map(item => (
        <UserCard key={item.id} user={item} />
      ))}
    </div>
  );
}
```

How would you optimize this component?

### Advanced Level
**Question:** Explain the performance implications of:
- Object creation in render functions
- Inline function definitions as props
- Complex calculations without memoization
- Conditional rendering patterns

**Real-world Scenario:** You're debugging a complex form component that becomes sluggish with more than 20 fields. The form has real-time validation, dependent fields, and auto-save functionality. How would you approach identifying and fixing the performance issues?

**Tool Usage:** Besides React DevTools, what other tools and techniques would you use to identify performance problems in React applications?

---

## Bonus Questions

### Memory Leaks and Cleanup
**Question:** How do you identify and prevent memory leaks in React applications? Give examples of common scenarios.

### Bundle Analysis
**Question:** You notice your React app's bundle size has grown significantly. How would you analyze and optimize it?

### Measuring Performance
**Question:** How do you measure the actual performance impact of your optimizations? What metrics do you track?

---

## Detailed Answers

### 1. Virtualization and Large Datasets - Answers

**Basic Level Answer:**
Virtualization (or windowing) is a technique where only the visible items in a list are rendered to the DOM, rather than rendering all items at once. For large datasets, this dramatically improves performance by:
- Reducing initial render time
- Minimizing DOM nodes
- Improving scroll performance
- Reducing memory usage

The difference between 10,000 DOM elements vs virtualized:
- **Without virtualization:** All 10,000 elements exist in DOM, causing high memory usage and slow interactions
- **With virtualization:** Only ~20-50 visible elements exist in DOM, with virtual scrolling simulating the full list

**Intermediate Level Answer:**
For 50,000 rows, I would:
1. **Implement react-window or react-virtualized**
2. **Calculate item height** (fixed or dynamic)
3. **Determine viewport size** and visible items
4. **Add buffer items** above/below viewport for smooth scrolling

```javascript
import { FixedSizeList as List } from 'react-window';

function VirtualizedTable({ data }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ProductCard product={data[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={data.length}
      itemSize={80}
      overscanCount={5}
    >
      {Row}
    </List>
  );
}
```

**Libraries and Trade-offs:**
- **react-window:** Lighter, better performance
- **react-virtualized:** More features, heavier
- **Trade-offs:** Complexity vs performance, loss of native scrolling features, SEO challenges

---

### 2. Code Splitting and Initial Load Time - Answers

**Basic Level Answer:**
Code splitting divides your bundle into smaller chunks that load on-demand, improving initial load time by:
- Reducing initial bundle size
- Loading only necessary code upfront
- Lazy loading features when needed

**Static vs Dynamic imports:**
```javascript
// Static import - included in initial bundle
import HomePage from './HomePage';

// Dynamic import - creates separate chunk
const HomePage = lazy(() => import('./HomePage'));
```

**Intermediate Level Answer:**
For 2MB bundle optimization:

```javascript
import { lazy, Suspense } from 'react';

// Route-based splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CheckoutFlow = lazy(() => import('./pages/CheckoutFlow'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/checkout" element={<CheckoutFlow />} />
      </Routes>
    </Suspense>
  );
}
```

**E-commerce Splitting Strategy:**
1. **Home page:** Keep in main bundle (always needed)
2. **Product catalog:** Separate chunk (frequently used)
3. **Admin dashboard:** Separate chunk with preload for admin users
4. **Checkout flow:** Separate chunk, preload on cart interaction

**Advanced Level Answer:**
Error handling and chunk loading:

```javascript
const LazyComponent = lazy(() => 
  import('./Component').catch(() => ({
    default: () => <div>Failed to load component</div>
  }))
);

// Error boundary for chunk failures
class ChunkErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. <button onClick={() => window.location.reload()}>Reload</button></div>;
    }
    return this.props.children;
  }
}
```

---

### 3. useTransition Hook and Perceived Performance - Answers

**Basic Level Answer:**
`useTransition` is a React 18 hook that lets you mark state updates as non-urgent transitions, improving perceived performance by:
- Keeping the UI responsive during expensive updates
- Allowing urgent updates (like typing) to interrupt non-urgent ones
- Providing loading states for better UX

**Urgent vs Non-urgent updates:**
- **Urgent:** User interactions like typing, clicking, hovering
- **Non-urgent:** Data fetching, filtering large lists, complex calculations

**Intermediate Level Answer:**
For the search interface lag:

```javascript
import { useTransition, useDeferredValue, useState } from 'react';

function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);
  
  useEffect(() => {
    startTransition(() => {
      const filteredResults = heavyFilter(allData, deferredQuery);
      setResults(filteredResults);
    });
  }, [deferredQuery]);
  
  return (
    <div>
      {isPending && <div>Updating results...</div>}
      {results.map(result => <ResultItem key={result.id} item={result} />)}
    </div>
  );
}
```

**Advanced Level Answer:**
`useTransition` vs `useDeferredValue`:
- **useTransition:** Wraps state updates, provides isPending flag
- **useDeferredValue:** Defers a value, useful for props from parent components

Dashboard implementation:
```javascript
function Dashboard({ dateRange }) {
  const [isPending, startTransition] = useTransition();
  const [quickData, setQuickData] = useState(null);
  const [expensiveData, setExpensiveData] = useState(null);
  
  useEffect(() => {
    // Urgent update for quick widgets
    setQuickData(getQuickData(dateRange));
    
    // Non-urgent update for expensive widgets
    startTransition(() => {
      setExpensiveData(getExpensiveData(dateRange));
    });
  }, [dateRange]);
  
  return (
    <div>
      <QuickCharts data={quickData} />
      {isPending ? (
        <div>Updating tables...</div>
      ) : (
        <ExpensiveDataTable data={expensiveData} />
      )}
    </div>
  );
}
```

---

### 4. Identifying Expensive Computations - Answers

**Basic Level Answer:**
Common performance anti-patterns:
- Creating objects/arrays in render
- Inline function definitions as props
- Complex calculations without memoization
- Unnecessary re-renders due to reference changes

**Code Review Answer:**
Problems with the UserProfile component:
- `filter()` and `sort()` run on every render
- Creates new arrays each time
- No memoization

**Fixed version:**
```javascript
function UserProfile({ user, allUsers }) {
  const sortedFriends = useMemo(() => {
    const friends = allUsers.filter(u => user.friendIds.includes(u.id));
    return friends.sort((a, b) => a.name.localeCompare(b.name));
  }, [allUsers, user.friendIds]);
  
  return (
    <div>
      <h1>{user.name}</h1>
      {sortedFriends.map(friend => (
        <div key={friend.id}>{friend.name}</div>
      ))}
    </div>
  );
}
```

**Intermediate Level Answer:**
Using React DevTools Profiler:
1. Open React DevTools → Profiler tab
2. Click record and interact with your app
3. Stop recording and analyze the flame graph
4. Look for components with long render times
5. Identify components that render frequently
6. Check "why did this render" information

**Optimization for ExpensiveComponent:**
```javascript
function ExpensiveComponent({ data, filterType, sortOrder }) {
  const processedData = useMemo(() => {
    return data
      .filter(item => item.type === filterType)
      .map(item => ({
        ...item,
        displayName: formatName(item.firstName, item.lastName),
        age: calculateAge(item.birthDate)
      }))
      .sort((a, b) => sortOrder === 'asc' ? a.age - b.age : b.age - a.age);
  }, [data, filterType, sortOrder]);
  
  return (
    <div>
      {processedData.map(item => (
        <UserCard key={item.id} user={item} />
      ))}
    </div>
  );
}
```

**Advanced Level Answer:**
Performance implications:
- **Object creation:** `style={{color: 'red'}}` creates new object each render
- **Inline functions:** `onClick={() => handleClick()}` creates new function each render
- **Complex calculations:** Should be memoized with `useMemo`
- **Conditional rendering:** Use `&&` carefully, prefer early returns

**Form Component Debugging:**
1. **Use React Profiler** to identify slow components
2. **Check for unnecessary re-renders** in field components
3. **Memoize validation functions** with `useCallback`
4. **Debounce auto-save** functionality
5. **Split form into smaller components** with `memo()`
6. **Use uncontrolled components** where possible

**Tools and Techniques:**
- React DevTools Profiler
- Chrome DevTools Performance tab
- Lighthouse audits
- Bundle analyzers (webpack-bundle-analyzer)
- Performance.mark() and Performance.measure()
- React.memo(), useMemo(), useCallback()

---

## Bonus Questions - Answers

### Memory Leaks and Cleanup
**Common scenarios and solutions:**
```javascript
// Event listeners
useEffect(() => {
  const handler = () => {};
  window.addEventListener('scroll', handler);
  return () => window.removeEventListener('scroll', handler);
}, []);

// Timers
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);
}, []);

// Subscriptions
useEffect(() => {
  const subscription = api.subscribe(callback);
  return () => subscription.unsubscribe();
}, []);
```

### Bundle Analysis
```bash
# Analyze bundle size
npx webpack-bundle-analyzer build/static/js/*.js

# Check for duplicate dependencies
npm ls --depth=0

# Use source-map-explorer
npx source-map-explorer build/static/js/*.js
```

### Measuring Performance
**Key metrics to track:**
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Bundle size and chunks
- Memory usage over time
- React component render times