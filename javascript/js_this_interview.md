# JavaScript Interview Questions - Function Calls and 'this' Keyword

## Part 1: Theoretical Questions - Different Ways Functions Can Be Called

### Question 1: Explain the four different ways a function can be called in JavaScript and how each affects the value of `this`.

**Answer:**

#### 1. Normal Function Call (Function Invocation)
```javascript
function greet() {
    console.log(this);
}

greet(); // In non-strict mode: window object, in strict mode: undefined
```
- In non-strict mode: `this` refers to the global object (window in browsers)
- In strict mode: `this` is `undefined`

#### 2. Method Call (Method Invocation)
```javascript
const person = {
    name: 'John',
    greet: function() {
        console.log(this.name);
    }
};

person.greet(); // 'John' - this refers to the person object
```
- `this` refers to the object that owns the method (the object before the dot)

#### 3. Constructor Call (Constructor Invocation)
```javascript
function Person(name) {
    this.name = name;
    this.greet = function() {
        console.log(this.name);
    };
}

const john = new Person('John'); // this refers to the newly created object
john.greet(); // 'John'
```
- `this` refers to the newly created object instance
- The `new` keyword creates a new object and binds it to `this`

#### 4. Indirect Call (using call, apply, bind)
```javascript
function greet() {
    console.log(`Hello, ${this.name}`);
}

const person1 = { name: 'Alice' };
const person2 = { name: 'Bob' };

greet.call(person1);  // 'Hello, Alice' - this is person1
greet.apply(person2); // 'Hello, Bob' - this is person2

const boundGreet = greet.bind(person1);
boundGreet(); // 'Hello, Alice' - this is permanently bound to person1
```
- `call()` and `apply()` immediately invoke the function with specified `this`
- `bind()` returns a new function with permanently bound `this`

---

### Question 2: What's the difference between `call`, `apply`, and `bind`?

**Answer:**

```javascript
function introduce(greeting, punctuation) {
    console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

const person = { name: 'Sarah' };

// call() - arguments passed individually
introduce.call(person, 'Hello', '!'); // "Hello, I'm Sarah!"

// apply() - arguments passed as array
introduce.apply(person, ['Hi', '.']); // "Hi, I'm Sarah."

// bind() - returns new function, doesn't execute immediately
const boundIntroduce = introduce.bind(person, 'Hey');
boundIntroduce('!!!'); // "Hey, I'm Sarah!!!"
```

**Key Differences:**
- **call()**: Executes immediately, arguments passed individually
- **apply()**: Executes immediately, arguments passed as array
- **bind()**: Returns new function, doesn't execute, allows partial application

---

### Question 3: How does `this` behave in arrow functions vs regular functions?

**Answer:**

```javascript
const obj = {
    name: 'Test',
    
    // Regular function - has its own 'this'
    regularMethod: function() {
        console.log('Regular:', this.name); // 'Test'
        
        function innerFunction() {
            console.log('Inner regular:', this.name); // undefined (strict) or global
        }
        innerFunction();
    },
    
    // Arrow function - inherits 'this' from lexical scope
    arrowMethod: () => {
        console.log('Arrow:', this.name); // undefined (inherits from global scope)
    },
    
    mixedMethod: function() {
        console.log('Outer:', this.name); // 'Test'
        
        const innerArrow = () => {
            console.log('Inner arrow:', this.name); // 'Test' (inherits from outer)
        };
        innerArrow();
    }
};
```

**Key Points:**
- Arrow functions don't have their own `this` - they inherit from lexical scope
- Regular functions have dynamic `this` binding based on how they're called
- Arrow functions ignore `call`, `apply`, and `bind` for `this` binding

---

## Part 2: Practical Questions - Nested Functions and Context Preservation

### Question 4: What will be the output of this code? Explain why.

```javascript
const counter = {
    count: 0,
    increment: function() {
        console.log('Before:', this.count);
        
        function inner() {
            this.count++;
            console.log('Inside inner:', this.count);
        }
        
        inner();
        console.log('After:', this.count);
    }
};

counter.increment();
```

**Expected Answer:**

```
Before: 0
Inside inner: NaN (or error in strict mode)
After: 0
```

**Explanation:**
- In the `inner()` function, `this` refers to the global object (or undefined in strict mode)
- `this.count++` tries to increment a property that doesn't exist on the global object
- The outer `this.count` remains unchanged because the inner function doesn't modify the counter object

---

### Question 5: Fix the above code using three different techniques to preserve the correct `this` context.

**Expected Answers:**

#### Solution 1: Using `var self = this` (Closure)
```javascript
const counter = {
    count: 0,
    increment: function() {
        console.log('Before:', this.count);
        var self = this; // Preserve reference
        
        function inner() {
            self.count++;
            console.log('Inside inner:', self.count);
        }
        
        inner();
        console.log('After:', this.count);
    }
};
```

#### Solution 2: Using Arrow Function
```javascript
const counter = {
    count: 0,
    increment: function() {
        console.log('Before:', this.count);
        
        const inner = () => { // Arrow function inherits 'this'
            this.count++;
            console.log('Inside inner:', this.count);
        };
        
        inner();
        console.log('After:', this.count);
    }
};
```

#### Solution 3: Using `bind()`
```javascript
const counter = {
    count: 0,
    increment: function() {
        console.log('Before:', this.count);
        
        function inner() {
            this.count++;
            console.log('Inside inner:', this.count);
        }
        
        inner.bind(this)(); // Bind and immediately invoke
        console.log('After:', this.count);
    }
};
```

#### Solution 4: Using `call()` or `apply()`
```javascript
const counter = {
    count: 0,
    increment: function() {
        console.log('Before:', this.count);
        
        function inner() {
            this.count++;
            console.log('Inside inner:', this.count);
        }
        
        inner.call(this); // Explicitly set 'this'
        console.log('After:', this.count);
    }
};
```

---

### Question 6: What's the output of this callback scenario? How would you fix it?

```javascript
class Timer {
    constructor() {
        this.seconds = 0;
    }
    
    start() {
        setInterval(function() {
            this.seconds++;
            console.log(`Timer: ${this.seconds} seconds`);
        }, 1000);
    }
}

const timer = new Timer();
timer.start();
```

**Problem:** The callback function loses the `this` context. `this.seconds` will be `undefined` or refer to the global object.

**Expected Fixes:**

#### Fix 1: Arrow Function
```javascript
class Timer {
    constructor() {
        this.seconds = 0;
    }
    
    start() {
        setInterval(() => { // Arrow function preserves 'this'
            this.seconds++;
            console.log(`Timer: ${this.seconds} seconds`);
        }, 1000);
    }
}
```

#### Fix 2: Using `bind()`
```javascript
class Timer {
    constructor() {
        this.seconds = 0;
    }
    
    start() {
        setInterval(function() {
            this.seconds++;
            console.log(`Timer: ${this.seconds} seconds`);
        }.bind(this), 1000); // Bind 'this' to the callback
    }
}
```

#### Fix 3: Storing Reference
```javascript
class Timer {
    constructor() {
        this.seconds = 0;
    }
    
    start() {
        const self = this;
        setInterval(function() {
            self.seconds++;
            console.log(`Timer: ${self.seconds} seconds`);
        }, 1000);
    }
}
```

---

### Question 7: Advanced - What happens in this complex scenario?

```javascript
const obj = {
    name: 'Object',
    
    method1: function() {
        console.log('Method1:', this.name);
        
        const method2 = function() {
            console.log('Method2:', this.name);
            
            const method3 = () => {
                console.log('Method3:', this.name);
            };
            
            method3();
        };
        
        method2.call(this);
    }
};

obj.method1();
```

**Expected Answer:**
```
Method1: Object
Method2: Object
Method3: Object
```

**Explanation:**
- `method1` is called as a method, so `this` is `obj`
- `method2` is called with `call(this)`, so `this` is explicitly set to `obj`
- `method3` is an arrow function inside `method2`, so it inherits `this` from `method2` (which is `obj`)

---

### Question 8: Event Handlers - Common Pitfall

```javascript
class Button {
    constructor(element) {
        this.element = element;
        this.clickCount = 0;
        this.setupEventListener();
    }
    
    handleClick() {
        this.clickCount++;
        console.log(`Button clicked ${this.clickCount} times`);
    }
    
    setupEventListener() {
        this.element.addEventListener('click', this.handleClick);
    }
}

// What's wrong with this code? How do you fix it?
```

**Problem:** In the event handler, `this` will refer to the DOM element, not the Button instance.

**Fixes:**

#### Fix 1: Arrow Function
```javascript
setupEventListener() {
    this.element.addEventListener('click', () => this.handleClick());
}
```

#### Fix 2: Bind
```javascript
setupEventListener() {
    this.element.addEventListener('click', this.handleClick.bind(this));
}
```

#### Fix 3: Arrow Method
```javascript
handleClick = () => {
    this.clickCount++;
    console.log(`Button clicked ${this.clickCount} times`);
}
```

---

## Bonus Questions for Senior Developers

### Question 9: Implement a function that can change the context of any method permanently

```javascript
function changeContext(fn, newContext) {
    // Implement this function
}

const obj1 = { name: 'Object1' };
const obj2 = { name: 'Object2' };

function greet() {
    console.log(`Hello from ${this.name}`);
}

const newGreet = changeContext(greet, obj2);
newGreet(); // Should output: "Hello from Object2"
newGreet.call(obj1); // Should still output: "Hello from Object2"
```

**Answer:**
```javascript
function changeContext(fn, newContext) {
    return function(...args) {
        return fn.apply(newContext, args);
    };
}

// Or using arrow function
const changeContext = (fn, newContext) => (...args) => fn.apply(newContext, args);
```

### Question 10: What's the output and why?

```javascript
const obj = {
    x: 1,
    getX: function() {
        return this.x;
    }
};

console.log(obj.getX()); // ?
const getX = obj.getX;
console.log(getX()); // ?
console.log((obj.getX)()); // ?
console.log((obj.getX = obj.getX)()); // ?
```

**Answer:**
```javascript
console.log(obj.getX()); // 1 (method call)
const getX = obj.getX;
console.log(getX()); // undefined (function call, 'this' is global/undefined)
console.log((obj.getX)()); // 1 (still a method call)
console.log((obj.getX = obj.getX)()); // undefined (assignment returns function, then called as function)
```

---

## Evaluation Criteria

### For Theoretical Questions:
- **Understanding of the four calling patterns**
- **Knowledge of how `this` is determined in each case**
- **Understanding of `call`, `apply`, `bind` differences**
- **Arrow function vs regular function behavior**

### For Practical Questions:
- **Ability to identify `this` context issues**
- **Knowledge of multiple solutions (closures, arrow functions, bind)**
- **Understanding of real-world scenarios (events, callbacks, timers)**
- **Ability to debug and fix context-related bugs**

### Scoring:
- **Junior (0-3 correct)**: Basic understanding, needs guidance
- **Mid-level (4-6 correct)**: Good practical knowledge, can handle most scenarios
- **Senior (7-10 correct)**: Deep understanding, can handle complex edge cases