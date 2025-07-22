# React Interview Questions: Props Immutability, State Lifting, and Custom Hooks

## Table of Contents
1. [Immutability in Props](#immutability-in-props)
2. [Lifting State Up](#lifting-state-up)
3. [Custom Hooks](#custom-hooks)
4. [Combined Scenarios](#combined-scenarios)
5. [Scoring Guide](#scoring-guide)

---

## Immutability in Props

### Question 1: Basic Immutability Understanding

**Question:** What is immutability in React, and why is it important when passing data as props? Can you explain what happens in this code example?

```javascript
function ParentComponent() {
  const [user, setUser] = useState({ name: 'John', age: 30, hobbies: ['reading', 'gaming'] });
  
  const updateUserAge = () => {
    user.age = 31; // Mutating the object directly
    setUser(user);
  };
  
  return (
    <div>
      <ChildComponent user={user} />
      <button onClick={updateUserAge}>Update Age</button>
    </div>
  );
}

function ChildComponent({ user }) {
  return <div>{user.name} is {user.age} years old</div>;
}
```

**Expected Answer:**
- Immutability means not changing the original data structure
- React uses reference equality (Object.is) to determine if props have changed
- In the example, mutating `user.age` directly doesn't create a new object, so React won't re-render
- The correct approach is to create a new object: `setUser({ ...user, age: 31 })`

**Follow-up:** How would you fix this code?

```javascript
const updateUserAge = () => {
  setUser(prevUser => ({ ...prevUser, age: 31 }));
};
```

### Question 2: Nested Object Immutability

**Question:** You have a complex state object. How would you immutably update a nested property? Fix the bug in this code:

```javascript
function TodoApp() {
  const [state, setState] = useState({
    user: { name: 'Alice', preferences: { theme: 'dark', notifications: true } },
    todos: [
      { id: 1, text: 'Learn React', completed: false, tags: ['work', 'learning'] }
    ]
  });
  
  const toggleNotifications = () => {
    // Bug: This mutates the nested object
    state.user.preferences.notifications = !state.user.preferences.notifications;
    setState({ ...state });
  };
  
  const addTagToTodo = (todoId, newTag) => {
    // How would you implement this immutably?
  };
  
  return (
    <div>
      <UserSettings user={state.user} onToggleNotifications={toggleNotifications} />
      <TodoList todos={state.todos} onAddTag={addTagToTodo} />
    </div>
  );
}
```

**Expected Answer:**

```javascript
const toggleNotifications = () => {
  setState(prevState => ({
    ...prevState,
    user: {
      ...prevState.user,
      preferences: {
        ...prevState.user.preferences,
        notifications: !prevState.user.preferences.notifications
      }
    }
  }));
};

const addTagToTodo = (todoId, newTag) => {
  setState(prevState => ({
    ...prevState,
    todos: prevState.todos.map(todo =>
      todo.id === todoId
        ? { ...todo, tags: [...todo.tags, newTag] }
        : todo
    )
  }));
};
```

### Question 3: React.memo and Immutability

**Question:** Explain why this component isn't optimizing properly and how immutability affects React.memo:

```javascript
const ExpensiveComponent = React.memo(({ items, metadata }) => {
  console.log('ExpensiveComponent rendered');
  
  // Expensive calculation
  const processedItems = items.map(item => ({
    ...item,
    processed: expensiveProcessing(item)
  }));
  
  return (
    <div>
      <h3>{metadata.title}</h3>
      {processedItems.map(item => (
        <div key={item.id}>{item.name}: {item.processed}</div>
      ))}
    </div>
  );
});

function ParentComponent() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', value: 100 },
    { id: 2, name: 'Item 2', value: 200 }
  ]);
  const [count, setCount] = useState(0);
  
  const addItem = () => {
    // Problem: This mutates the array
    items.push({ id: items.length + 1, name: `Item ${items.length + 1}`, value: 50 });
    setItems(items);
  };
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <button onClick={addItem}>Add Item</button>
      <ExpensiveComponent 
        items={items} 
        metadata={{ title: 'My Items', lastUpdated: new Date() }} // Another issue!
      />
    </div>
  );
}
```

**Expected Answer:**
1. The `addItem` function mutates the array, so React.memo won't detect the change
2. The `metadata` prop creates a new object every render, causing unnecessary re-renders
3. Fixed version:

```javascript
const addItem = () => {
  setItems(prevItems => [
    ...prevItems,
    { id: prevItems.length + 1, name: `Item ${prevItems.length + 1}`, value: 50 }
  ]);
};

// Move metadata outside or memoize it
const metadata = useMemo(() => ({ 
  title: 'My Items', 
  lastUpdated: new Date() 
}), []);
```

---

## Lifting State Up

### Question 4: Basic State Lifting

**Question:** In this shopping cart example, there's a problem with state management. How would you lift state up to solve it?

```javascript
function ShoppingApp() {
  return (
    <div>
      <ProductList />
      <Cart />
    </div>
  );
}

function ProductList() {
  const [products] = useState([
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 29 },
  ]);
  
  const addToCart = (product) => {
    // Problem: How do we communicate with Cart component?
    console.log('Add to cart:', product);
  };
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          {product.name} - ${product.price}
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  
  // Problem: cartItems can't be updated from ProductList
  return (
    <div>
      <h3>Cart ({cartItems.length} items)</h3>
      {cartItems.map(item => (
        <div key={item.id}>{item.name} - ${item.price}</div>
      ))}
    </div>
  );
}
```

**Expected Answer:**

```javascript
function ShoppingApp() {
  const [cartItems, setCartItems] = useState([]);
  
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };
  
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  return (
    <div>
      <ProductList onAddToCart={addToCart} />
      <Cart items={cartItems} onRemoveFromCart={removeFromCart} />
    </div>
  );
}

function ProductList({ onAddToCart }) {
  const [products] = useState([
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 29 },
  ]);
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          {product.name} - ${product.price}
          <button onClick={() => onAddToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

function Cart({ items, onRemoveFromCart }) {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return (
    <div>
      <h3>Cart ({items.length} items)</h3>
      {items.map(item => (
        <div key={item.id}>
          {item.name} - ${item.price} x {item.quantity}
          <button onClick={() => onRemoveFromCart(item.id)}>Remove</button>
        </div>
      ))}
      <div>Total: ${total}</div>
    </div>
  );
}
```

### Question 5: Complex State Lifting Scenario

**Question:** You have a form with multiple steps, and each step is a separate component. How would you design the state management? Consider validation, navigation, and data persistence.

```javascript
// Current problematic structure
function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  
  return (
    <div>
      {currentStep === 1 && <PersonalInfoStep />}
      {currentStep === 2 && <AddressStep />}
      {currentStep === 3 && <PaymentStep />}
      {currentStep === 4 && <ReviewStep />}
    </div>
  );
}

function PersonalInfoStep() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  
  // How do we share this data with other steps and the parent?
  // How do we validate before moving to next step?
}
```

**Expected Answer:**

```javascript
function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: { name: '', email: '', phone: '' },
    address: { street: '', city: '', zipCode: '' },
    payment: { cardNumber: '', expiryDate: '', cvv: '' }
  });
  const [errors, setErrors] = useState({});
  
  const updateFormData = (stepName, data) => {
    setFormData(prev => ({
      ...prev,
      [stepName]: { ...prev[stepName], ...data }
    }));
  };
  
  const validateStep = (stepNumber) => {
    let stepErrors = {};
    
    switch (stepNumber) {
      case 1:
        if (!formData.personalInfo.name) stepErrors.name = 'Name is required';
        if (!formData.personalInfo.email) stepErrors.email = 'Email is required';
        break;
      case 2:
        if (!formData.address.street) stepErrors.street = 'Street is required';
        break;
      // Add more validations
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const submitForm = async () => {
    if (validateStep(4)) {
      try {
        await submitFormData(formData);
        // Handle success
      } catch (error) {
        // Handle error
      }
    }
  };
  
  const stepProps = {
    formData,
    updateFormData,
    errors,
    nextStep,
    prevStep,
    submitForm,
    currentStep
  };
  
  return (
    <div>
      <StepIndicator currentStep={currentStep} totalSteps={4} />
      {currentStep === 1 && <PersonalInfoStep {...stepProps} />}
      {currentStep === 2 && <AddressStep {...stepProps} />}
      {currentStep === 3 && <PaymentStep {...stepProps} />}
      {currentStep === 4 && <ReviewStep {...stepProps} />}
    </div>
  );
}

function PersonalInfoStep({ formData, updateFormData, errors, nextStep, currentStep }) {
  const handleChange = (field, value) => {
    updateFormData('personalInfo', { [field]: value });
  };
  
  return (
    <div>
      <h2>Personal Information</h2>
      <input
        type="text"
        placeholder="Name"
        value={formData.personalInfo.name}
        onChange={(e) => handleChange('name', e.target.value)}
      />
      {errors.name && <span className="error">{errors.name}</span>}
      
      <input
        type="email"
        placeholder="Email"
        value={formData.personalInfo.email}
        onChange={(e) => handleChange('email', e.target.value)}
      />
      {errors.email && <span className="error">{errors.email}</span>}
      
      <button onClick={nextStep}>Next</button>
    </div>
  );
}
```

### Question 6: When NOT to Lift State Up

**Question:** Sometimes lifting state up can be overkill. Can you identify when state should remain local vs when it should be lifted? Analyze this example:

```javascript
function UserDashboard() {
  const [user, setUser] = useState(null);
  
  return (
    <div>
      <UserProfile user={user} onUpdateUser={setUser} />
      <UserSettings user={user} onUpdateUser={setUser} />
      <UserNotifications user={user} />
      <SearchBox /> {/* Independent search functionality */}
      <ThemeToggle /> {/* Independent theme toggle */}
    </div>
  );
}
```

**Expected Answer:**

```javascript
function UserDashboard() {
  // Lifted state: Shared between multiple components
  const [user, setUser] = useState(null);
  
  return (
    <div>
      {/* User data is shared, so state is lifted */}
      <UserProfile user={user} onUpdateUser={setUser} />
      <UserSettings user={user} onUpdateUser={setUser} />
      <UserNotifications user={user} />
      
      {/* Independent components keep their own state */}
      <SearchBox /> 
      <ThemeToggle />
    </div>
  );
}

// SearchBox manages its own state - no need to lift
function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  // Search logic here...
  
  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {/* Results display */}
    </div>
  );
}

// ThemeToggle manages its own state unless theme needs to be global
function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  
  return (
    <button onClick={() => setIsDark(!isDark)}>
      {isDark ? 'Light' : 'Dark'} Mode
    </button>
  );
}
```

**Criteria for lifting state:**
1. Multiple components need to access/modify the same data
2. Components need to synchronize their state
3. Parent needs to coordinate between child components
4. State needs to persist across component unmounts

---

## Custom Hooks

### Question 7: Basic Custom Hook Creation

**Question:** You notice this logic is repeated across multiple components. How would you extract it into a custom hook?

```javascript
function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user');
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>Welcome, {user?.name}</div>;
}

function PostsList() {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/posts');
        const postsData = await response.json();
        setPosts(postsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {posts?.map(post => <div key={post.id}>{post.title}</div>)}
    </div>
  );
}
```

**Expected Answer:**

```javascript
// Custom hook for API calls
function useApi(url, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url, ...dependencies]);
  
  const refetch = useCallback(() => {
    fetchData();
  }, [url]);
  
  return { data, loading, error, refetch };
}

// Simplified components
function UserProfile() {
  const { data: user, loading, error } = useApi('/api/user');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>Welcome, {user?.name}</div>;
}

function PostsList() {
  const { data: posts, loading, error } = useApi('/api/posts');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {posts?.map(post => <div key={post.id}>{post.title}</div>)}
    </div>
  );
}
```

### Question 8: Advanced Custom Hook with Dependencies

**Question:** Create a custom hook for form validation that supports multiple validation rules and real-time validation. How would you design it to be reusable?

**Expected Answer:**

```javascript
function useFormValidation(initialValues, validationRules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Validate a single field
  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';
    
    for (const rule of rules) {
      const error = rule(value, values);
      if (error) return error;
    }
    return '';
  }, [validationRules, values]);
  
  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  }, [validateField, values, validationRules]);
  
  // Handle field changes
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation for touched fields
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [validateField, touched]);
  
  // Handle field blur (mark as touched)
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField, values]);
  
  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    reset,
    isValid: Object.keys(errors).length === 0
  };
}

// Validation rules
const required = (message = 'This field is required') => (value) => {
  return !value || value.trim() === '' ? message : '';
};

const email = (message = 'Invalid email format') => (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return value && !emailRegex.test(value) ? message : '';
};

const minLength = (min, message) => (value) => {
  return value && value.length < min ? message || `Minimum ${min} characters required` : '';
};

// Usage example
function ContactForm() {
  const validationRules = {
    name: [required()],
    email: [required(), email()],
    password: [required(), minLength(8, 'Password must be at least 8 characters')],
    confirmPassword: [
      required(),
      (value, values) => value !== values.password ? 'Passwords do not match' : ''
    ]
  };
  
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    reset
  } = useFormValidation({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  }, validationRules);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', values);
      reset();
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={values.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
        />
        {touched.name && errors.name && <span className="error">{errors.name}</span>}
      </div>
      
      <div>
        <input
          type="email"
          placeholder="Email"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
        />
        {touched.email && errors.email && <span className="error">{errors.email}</span>}
      </div>
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Question 9: Custom Hook for Complex State Management

**Question:** Design a custom hook for managing a shopping cart with the following requirements:
- Add/remove items
- Update quantities
- Calculate totals
- Persist to localStorage
- Handle discounts/coupons

**Expected Answer:**

```javascript
function useShoppingCart() {
  const [items, setItems] = useState(() => {
    // Load from localStorage on initialization
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [discounts, setDiscounts] = useState([]);
  
  // Persist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);
  
  // Add item to cart
  const addItem = useCallback((product, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { ...product, quantity }];
    });
  }, []);
  
  // Remove item from cart
  const removeItem = useCallback((productId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);
  
  // Update item quantity
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeItem]);
  
  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
    setDiscounts([]);
  }, []);
  
  // Apply discount
  const applyDiscount = useCallback((discount) => {
    setDiscounts(prev => {
      // Avoid duplicate discounts
      if (prev.some(d => d.code === discount.code)) {
        return prev;
      }
      return [...prev, discount];
    });
  }, []);
  
  // Remove discount
  const removeDiscount = useCallback((discountCode) => {
    setDiscounts(prev => prev.filter(d => d.code !== discountCode));
  }, []);
  
  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const discountAmount = discounts.reduce((sum, discount) => {
      if (discount.type === 'percentage') {
        return sum + (subtotal * discount.value / 100);
      } else if (discount.type === 'fixed') {
        return sum + discount.value;
      }
      return sum;
    }, 0);
    
    const total = Math.max(0, subtotal - discountAmount);
    
    return {
      subtotal: subtotal.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      total: total.toFixed(2),
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
    };
  }, [items, discounts]);
  
  return {
    items,
    discounts,
    totals,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyDiscount,
    removeDiscount
  };
}

// Usage example
function ShoppingCartApp() {
  const {
    items,
    totals,
    addItem,
    removeItem,
    updateQuantity,
    applyDiscount
  } = useShoppingCart();
  
  const sampleProduct = {
    id: 1,
    name: 'Laptop',
    price: 999,
    image: '/laptop.jpg'
  };
  
  const handleApplyDiscount = () => {
    applyDiscount({
      code: 'SAVE10',
      type: 'percentage',
      value: 10
    });
  };
  
  return (
    <div>
      <h2>Shopping Cart ({totals.itemCount} items)</h2>
      
      <button onClick={() => addItem(sampleProduct)}>
        Add Laptop to Cart
      </button>
      
      <div>
        {items.map(item => (
          <div key={item.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '5px' }}>
            <h4>{item.name}</h4>
            <p>Price: ${item.price}</p>
            <p>
              Quantity: 
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              {item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </p>
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </div>
        ))}
      </div>
      
      <div>
        <h3>Cart Summary</h3>
        <p>Subtotal: ${totals.subtotal}</p>
        <p>Discount: -${totals.discountAmount}</p>
        <p><strong>Total: ${totals.total}</strong></p>
        <button onClick={handleApplyDiscount}>Apply 10% Discount</button>
      </div>
    </div>
  );
}
```

---

## Combined Scenarios

### Question 10: Real-World Application

**Question:** You're building a collaborative document editor (like Google Docs). Design the architecture considering:
1. Real-time collaboration with multiple users
2. Document state management
3. User permissions
4. Custom hooks for different concerns
5. Immutable updates for undo/redo functionality

**Expected Answer:**

```javascript
// Custom hook for document collaboration
function useCollaborativeDocument(documentId) {
  const [document, setDocument] = useState(null);
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const ws = useRef(null);
  
  // WebSocket connection for real-time updates
  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:8080/documents/${documentId}`);
    
    ws.current.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);
      
      switch (type) {
        case 'DOCUMENT_UPDATED':
          handleRemoteUpdate(payload);
          break;
        case 'USER_JOINED':
          setUsers(prev => [...prev, payload.user]);
          break;
        case 'USER_LEFT':
          setUsers(prev => prev.filter(u => u.id !== payload.userId));
          break;
      }
    };
    
    return () => {
      ws.current?.close();
    };
  }, [documentId]);
  
  // Handle remote updates (from other users)
  const handleRemoteUpdate = useCallback((update) => {
    setDocument(prevDoc => {
      if (!prevDoc) return update.document;
      
      // Apply operational transformation to resolve conflicts
      const transformedDoc = applyOperationalTransform(prevDoc, update);
      return transformedDoc;
    });
  }, []);
  
  // Local document updates
  const updateDocument = useCallback((updateFn) => {
    setDocument(prevDoc => {
      const newDoc = updateFn(prevDoc);
      
      // Add to history for undo/redo (immutable)
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        return [...newHistory, { ...prevDoc }]; // Store previous state
      });
      setHistoryIndex(prev => prev + 1);
      
      // Send to other users
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          type: 'DOCUMENT_UPDATE',
          payload: { document: newDoc, timestamp: Date.now() }
        }));
      }
      
      return newDoc;
    });
  }, [historyIndex]);
  
  // Undo functionality
  const undo = useCallback(() => {
    if (historyIndex >= 0) {
      const previousState = history[historyIndex];
      setDocument(previousState);
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex]);
  
  // Redo functionality
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setDocument(nextState);
      setHistoryIndex(prev => prev + 1);
    }
  }, [history, historyIndex]);
  
  return {
    document,
    users,
    updateDocument,
    undo,
    redo,
    canUndo: historyIndex >= 0,
    canRedo: historyIndex < history.length - 1
  };
}

// Custom hook for user permissions
function usePermissions(userId, documentId) {
  const [permissions, setPermissions] = useState({
    canEdit: false,
    canComment: false,
    canShare: false,
    isOwner: false
  });
  
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetch(`/api/documents/${documentId}/permissions/${userId}`);
        const userPermissions = await response.json();
        setPermissions(userPermissions);
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
      }
    };
    
    fetchPermissions();
  }, [userId, documentId]);
  
  return permissions;
}

// Custom hook for text editing operations
function useTextEditor(initialContent = '') {
  const [content, setContent] = useState(initialContent);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  
  const insertText = useCallback((text, position = selection.start) => {
    setContent(prev => {
      const before = prev.slice(0, position);
      const after = prev.slice(position);
      return before + text + after;
    });
  }, [selection]);
  
  const deleteText = useCallback((start, end) => {
    setContent(prev => {
      const before = prev.slice(0, start);
      const after = prev.slice(end);
      return before + after;
    });
  }, []);
  
  const formatText = useCallback((start, end, format) => {
    // Implementation for text formatting (bold, italic, etc.)
    const selectedText = content.slice(start, end);
    const formattedText = applyFormat(selectedText, format);
    
    setContent(prev => {
      const before = prev.slice(0, start);
      const after = prev.slice(end);
      return before + formattedText + after;
    });
  }, [content]);
  
  return {
    content,
    selection,
    setSelection,
    insertText,
    deleteText,
    formatText
  };
}

// Main collaborative editor component
function CollaborativeEditor({ documentId, userId }) {
  const permissions = usePermissions(userId, documentId);
  const {
    document,
    users,
    updateDocument,
    undo,
    redo,
    canUndo,
    canRedo
  } = useCollaborativeDocument(documentId);
  
  const {
    content,
    insertText,
    deleteText,
    formatText
  } = useTextEditor(document?.content);
  
  // Sync editor content with document
  useEffect(() => {
    if (document?.content !== content) {
      updateDocument(prev => ({ ...prev, content }));
    }
  }, [content, updateDocument]);
  
  const handleTextChange = (newContent) => {
    if (!permissions.canEdit) return;
    
    // Calculate the difference and create operation
    const operation = calculateTextOperation(content, newContent);
    updateDocument(prev => ({
      ...prev,
      content: newContent,
      lastModified: Date.now(),
      operations: [...(prev.operations || []), operation]
    }));
  };
  
  if (!document) return <div>Loading document...</div>;
  
  return (
    <div className="collaborative-editor">
      <header className="editor-header">
        <h1>{document.title}</h1>
        <div className="editor-controls">
          <button onClick={undo} disabled={!canUndo || !permissions.canEdit}>
            Undo
          </button>
          <button onClick={redo} disabled={!canRedo || !permissions.canEdit}>
            Redo
          </button>
          {permissions.canEdit && (
            <>
              <button onClick={() => formatText(0, content.length, 'bold')}>
                Bold
              </button>
              <button onClick={() => formatText(0, content.length, 'italic')}>
                Italic
              </button>
            </>
          )}
        </div>
        <div className="active-users">
          {users.map(user => (
            <div key={user.id} className="user-avatar">
              {user.name[0]}
            </div>
          ))}
        </div>
      </header>
      
      <main className="editor-content">
        <textarea
          value={content}
          onChange={(e) => handleTextChange(e.target.value)}
          disabled={!permissions.canEdit}
          placeholder={permissions.canEdit ? "Start typing..." : "You don't have edit permissions"}
          className="document-textarea"
        />
      </main>
      
      {!permissions.canEdit && (
        <div className="permission-notice">
          You have read-only access to this document
        </div>
      )}
    </div>
  );
}

// Helper functions (implementation details)
function applyOperationalTransform(document, update) {
  // Implement operational transformation logic
  // This is a complex algorithm for resolving conflicts
  return document;
}

function calculateTextOperation(oldText, newText) {
  // Calculate what operation was performed
  return {
    type: 'INSERT', // or 'DELETE', 'REPLACE'
    position: 0,
    content: newText,
    timestamp: Date.now()
  };
}

function applyFormat(text, format) {
  // Apply formatting to text
  switch (format) {
    case 'bold':
      return `**${text}**`;
    case 'italic':
      return `*${text}*`;
    default:
      return text;
  }
}
```

---

## Scoring Guide

### Immutability in Props (30 points)

**Excellent (26-30 points):**
- Explains why immutability is crucial for React's reconciliation
- Demonstrates understanding of reference vs deep equality
- Shows proper techniques for immutable updates (spread operator, array methods)
- Mentions React.memo and optimization implications
- Can identify and fix mutation bugs

**Good (21-25 points):**
- Understands basic concept of immutability
- Can create immutable updates for simple objects
- Recognizes when mutations cause problems
- Basic understanding of performance implications

**Fair (16-20 points):**
- Basic understanding but struggles with nested objects
- Can identify mutations but unclear on solutions
- Limited understanding of performance impact

**Poor (0-15 points):**
- Doesn't understand immutability concept
- Cannot identify mutation problems
- Suggests incorrect solutions

### Lifting State Up (35 points)

**Excellent (31-35 points):**
- Clear understanding of when to lift state vs keep it local
- Demonstrates proper parent-child communication patterns
- Shows understanding of data flow and component communication
- Can design complex state architectures
- Mentions performance considerations

**Good (26-30 points):**
- Understands basic state lifting concept
- Can implement simple lifting scenarios
- Understands prop drilling issues
- Basic component communication patterns

**Fair (21-25 points):**
- Basic understanding but struggles with complex scenarios
- Can lift state but unclear on when it's necessary
- Limited understanding of component architecture

**Poor (0-20 points):**
- Doesn't understand state lifting concept
- Cannot identify when state should be shared
- Suggests incorrect architectures

### Custom Hooks (35 points)

**Excellent (31-35 points):**
- Creates reusable, well-designed custom hooks
- Understands hook rules and best practices
- Shows proper use of dependencies and cleanup
- Demonstrates complex state management in hooks
- Considers performance and memoization

**Good (26-30 points):**
- Can create basic custom hooks
- Understands reusability concept
- Basic use of useState and useEffect in hooks
- Some understanding of hook dependencies

**Fair (21-25 points):**
- Basic custom hook creation
- Limited understanding of reusability
- Struggles with complex scenarios

**Poor (0-20 points):**
- Cannot create custom hooks
- Doesn't understand the concept
- Violates hook rules

### Interview Tips:

1. **Start Simple**: Begin with basic scenarios and progressively increase complexity
2. **Ask Follow-ups**: "How would you optimize this?" "What if we had 1000 items?"
3. **Real-world Context**: Frame questions in actual application scenarios
4. **Code Quality**: Look for clean, readable, maintainable code
5. **Problem-solving**: Focus on thought process, not just final answers