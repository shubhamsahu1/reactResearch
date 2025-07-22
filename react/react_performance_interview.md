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

## Expected Answers Summary

**For Virtualization:**
- Understands windowing concept
- Knows libraries like react-window/react-virtualized
- Can explain viewport calculations
- Understands trade-offs (complexity vs performance)

**For Code Splitting:**
- Knows React.lazy() and Suspense
- Understands dynamic imports
- Can implement route-based and component-based splitting
- Understands webpack chunks and loading strategies

**For useTransition:**
- Understands concurrent features
- Knows difference between urgent/non-urgent updates
- Can implement proper loading states
- Understands startTransition and isPending

**For Performance Identification:**
- Knows common anti-patterns
- Can use React DevTools Profiler
- Understands memoization techniques
- Can identify expensive operations in render cycles