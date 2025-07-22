# JavaScript Task Queue and Event Loop: Complete Guide

## What is the Task Queue?

The task queue is part of JavaScript's event loop mechanism that handles asynchronous operations. When asynchronous code needs to be executed, it's placed in different queues based on its type and priority.

JavaScript has a **single-threaded** execution model, but it can handle asynchronous operations through:
- **Call Stack**: Executes synchronous code
- **Web APIs**: Handle asynchronous operations (setTimeout, DOM events, etc.)
- **Task Queues**: Store callbacks waiting to be executed
- **Event Loop**: Manages the execution order

## Types of Task Queues

### 1. Macrotask Queue (Task Queue)
Also known as the "task queue" or "callback queue". Contains callbacks from:
- `setTimeout()`
- `setInterval()`
- `setImmediate()` (Node.js)
- DOM events (click, scroll, etc.)
- HTTP requests
- I/O operations

### 2. Microtask Queue (Job Queue)
Higher priority queue that contains:
- `Promise.then()`, `Promise.catch()`, `Promise.finally()`
- `async/await`
- `queueMicrotask()`
- `MutationObserver`
- `process.nextTick()` (Node.js - highest priority)

## Execution Priority Order

```
1. Call Stack (synchronous code)
2. Microtask Queue (highest priority)
3. Macrotask Queue (lower priority)
4. Render (in browsers)
```

**Key Rule**: The event loop will completely empty the microtask queue before moving to the next macrotask.

## Basic Event Loop Flow

```javascript
console.log("1: Start");

setTimeout(() => {
    console.log("2: Macrotask - setTimeout");
}, 0);

Promise.resolve().then(() => {
    console.log("3: Microtask - Promise");
});

console.log("4: End");

/*
Execution Flow:
1. "Start" - Call Stack (immediate)
2. setTimeout - Callback goes to Macrotask Queue
3. Promise.then - Callback goes to Microtask Queue  
4. "End" - Call Stack (immediate)
5. Event Loop: Check Microtask Queue first
6. "Microtask - Promise" - Execute all microtasks
7. "Macrotask - setTimeout" - Execute next macrotask

Output:
1: Start
4: End
3: Microtask - Promise
2: Macrotask - setTimeout
*/
```

## Detailed Examples

### Example 1: Basic Priority Demonstration

```javascript
console.log("=== Script Start ===");

// Macrotasks
setTimeout(() => console.log("Timeout 1"), 0);
setTimeout(() => console.log("Timeout 2"), 0);

// Microtasks  
Promise.resolve().then(() => console.log("Promise 1"));
Promise.resolve().then(() => console.log("Promise 2"));

// Synchronous
console.log("=== Script End ===");

/*
Output:
=== Script Start ===
=== Script End ===
Promise 1
Promise 2
Timeout 1
Timeout 2

Explanation:
1. Synchronous code executes first
2. All microtasks execute before any macrotask
3. Macrotasks execute in order they were queued
*/
```

### Example 2: Nested Microtasks

```javascript
console.log("Start");

setTimeout(() => {
    console.log("Macrotask 1");
}, 0);

Promise.resolve().then(() => {
    console.log("Microtask 1");
    
    // This creates another microtask
    Promise.resolve().then(() => {
        console.log("Nested Microtask");
    });
    
    // This creates a macrotask
    setTimeout(() => {
        console.log("Nested Macrotask");
    }, 0);
});

setTimeout(() => {
    console.log("Macrotask 2");
}, 0);

console.log("End");

/*
Output:
Start
End
Microtask 1
Nested Microtask
Macrotask 1
Macrotask 2
Nested Macrotask

Explanation:
1. Synchronous code first (Start, End)
2. Original microtask executes (Microtask 1)
3. Nested microtask executes immediately (Nested Microtask)
4. Then macrotasks execute in order
*/
```

### Example 3: Complex Async/Await Example

```javascript
console.log("1");

async function asyncFunction() {
    console.log("2");
    
    await Promise.resolve();
    console.log("3"); // This is a microtask
    
    await Promise.resolve();
    console.log("4"); // This is also a microtask
}

setTimeout(() => {
    console.log("5");
}, 0);

asyncFunction();

Promise.resolve().then(() => {
    console.log("6");
});

console.log("7");

/*
Output:
1
2
7
3
6
4
5

Explanation:
1. "1" - synchronous
2. asyncFunction() called
3. "2" - synchronous part of async function
4. First await - function pauses, continues synchronously
5. "7" - remaining synchronous code
6. Microtasks execute:
   - "3" from first await continuation
   - "6" from Promise.then
   - "4" from second await continuation
7. "5" - macrotask (setTimeout)
*/
```

## JavaScript API Priority Reference

### High Priority (Microtasks)
```javascript
// 1. process.nextTick() - Node.js only (highest)
process.nextTick(() => console.log("nextTick"));

// 2. Promise callbacks
Promise.resolve().then(() => console.log("Promise"));

// 3. async/await continuations
async function example() {
    await somePromise;
    console.log("async continuation");
}

// 4. queueMicrotask()
queueMicrotask(() => console.log("queueMicrotask"));

// 5. MutationObserver
const observer = new MutationObserver(() => {
    console.log("MutationObserver");
});
```

### Low Priority (Macrotasks)
```javascript
// 1. setTimeout/setInterval
setTimeout(() => console.log("setTimeout"), 0);
setInterval(() => console.log("setInterval"), 100);

// 2. setImmediate() - Node.js only
setImmediate(() => console.log("setImmediate"));

// 3. I/O operations
fs.readFile('file.txt', () => console.log("File read"));

// 4. UI Events
button.addEventListener('click', () => console.log("Click"));

// 5. HTTP requests
fetch('/api').then(() => console.log("Fetch complete"));
```

## Advanced Examples

### Example 4: Event Listeners and User Interactions

```javascript
const button = document.createElement('button');
button.textContent = 'Click me';
document.body.appendChild(button);

console.log("Setup start");

button.addEventListener('click', () => {
    console.log("Click handler 1");
    
    Promise.resolve().then(() => {
        console.log("Promise in click handler");
    });
    
    setTimeout(() => {
        console.log("Timeout in click handler");
    }, 0);
});

button.addEventListener('click', () => {
    console.log("Click handler 2");
});

setTimeout(() => {
    console.log("Initial timeout");
    button.click(); // Programmatic click
}, 0);

console.log("Setup end");

/*
Output when button is clicked:
Setup start
Setup end
Initial timeout
Click handler 1
Click handler 2
Promise in click handler
Timeout in click handler

Explanation:
1. Synchronous setup code
2. Initial timeout (macrotask)
3. Both click handlers (synchronous during event processing)
4. Promise from click handler (microtask)
5. Timeout from click handler (macrotask)
*/
```

### Example 5: Multiple Promise Chains

```javascript
console.log("Start");

Promise.resolve()
    .then(() => {
        console.log("Promise 1");
        return Promise.resolve();
    })
    .then(() => {
        console.log("Promise 2");
    });

Promise.resolve()
    .then(() => {
        console.log("Promise 3");
        setTimeout(() => {
            console.log("Timeout from Promise 3");
        }, 0);
    })
    .then(() => {
        console.log("Promise 4");
    });

setTimeout(() => {
    console.log("Timeout 1");
    Promise.resolve().then(() => {
        console.log("Promise in Timeout");
    });
}, 0);

console.log("End");

/*
Output:
Start
End
Promise 1
Promise 3
Promise 2
Promise 4
Timeout 1
Promise in Timeout
Timeout from Promise 3

Explanation:
1. Synchronous code (Start, End)
2. All microtasks execute in registration order
3. First macrotask (Timeout 1) with its microtask
4. Remaining macrotasks
*/
```

## Interview Questions and Outputs

### Question 1: Basic Event Loop

```javascript
console.log("A");

setTimeout(() => {
    console.log("B");
}, 0);

Promise.resolve().then(() => {
    console.log("C");
});

console.log("D");

// What is the output?
```

<details>
<summary>Answer</summary>

```
Output: A, D, C, B

Explanation:
1. "A" - synchronous
2. setTimeout callback → macrotask queue
3. Promise.then callback → microtask queue
4. "D" - synchronous
5. "C" - microtask executes first
6. "B" - macrotask executes last
```
</details>

### Question 2: Nested Async Operations

```javascript
console.log("1");

setTimeout(() => {
    console.log("2");
    Promise.resolve().then(() => {
        console.log("3");
    });
}, 0);

Promise.resolve().then(() => {
    console.log("4");
    setTimeout(() => {
        console.log("5");
    }, 0);
});

setTimeout(() => {
    console.log("6");
}, 0);

console.log("7");

// What is the output?
```

<details>
<summary>Answer</summary>

```
Output: 1, 7, 4, 2, 3, 6, 5

Explanation:
1. "1", "7" - synchronous code
2. "4" - microtask executes first
3. "2" - first macrotask
4. "3" - microtask created inside first macrotask
5. "6" - second macrotask
6. "5" - macrotask created inside microtask
```
</details>

### Question 3: Async/Await with Promises

```javascript
async function async1() {
    console.log("async1 start");
    await async2();
    console.log("async1 end");
}

async function async2() {
    console.log("async2");
}

console.log("script start");

setTimeout(() => {
    console.log("setTimeout");
}, 0);

async1();

new Promise((resolve) => {
    console.log("promise1");
    resolve();
}).then(() => {
    console.log("promise2");
});

console.log("script end");

// What is the output?
```

<details>
<summary>Answer</summary>

```
Output: 
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout

Explanation:
1. "script start" - synchronous
2. setTimeout → macrotask queue
3. async1() called
4. "async1 start" - synchronous part
5. async2() called and executed
6. "async2" - synchronous
7. await pauses async1
8. "promise1" - Promise executor is synchronous
9. "script end" - remaining synchronous code
10. Microtasks: "async1 end" and "promise2"
11. Macrotask: "setTimeout"
```
</details>

### Question 4: Complex Priority Test

```javascript
console.log("Start");

setTimeout(() => console.log("Timeout 1"), 0);

Promise.resolve()
    .then(() => {
        console.log("Promise 1");
        setTimeout(() => console.log("Timeout 2"), 0);
        return Promise.resolve();
    })
    .then(() => {
        console.log("Promise 2");
    });

queueMicrotask(() => {
    console.log("queueMicrotask");
});

setTimeout(() => {
    console.log("Timeout 3");
    Promise.resolve().then(() => console.log("Promise 3"));
}, 0);

console.log("End");

// What is the output?
```

<details>
<summary>Answer</summary>

```
Output:
Start
End
Promise 1
queueMicrotask
Promise 2
Timeout 1
Timeout 3
Promise 3
Timeout 2

Explanation:
1. Synchronous: Start, End
2. Microtasks: Promise 1, queueMicrotask, Promise 2
3. Macrotasks execute in order: Timeout 1, Timeout 3
4. Promise 3 (microtask from Timeout 3)
5. Timeout 2 (macrotask created in Promise 1)
```
</details>

### Question 5: Event Handler Priority

```javascript
const button = document.createElement('button');

button.addEventListener('click', () => {
    console.log("Listener 1");
    Promise.resolve().then(() => console.log("Promise A"));
});

button.addEventListener('click', () => {
    console.log("Listener 2");
    Promise.resolve().then(() => console.log("Promise B"));
});

console.log("Before click");
button.click();
console.log("After click");

// What is the output?
```

<details>
<summary>Answer</summary>

```
Output:
Before click
Listener 1
Listener 2
Promise A
Promise B
After click

Explanation:
1. "Before click" - synchronous
2. button.click() triggers both listeners synchronously
3. "Listener 1", "Listener 2" - event handlers
4. "Promise A", "Promise B" - microtasks from handlers
5. "After click" - remaining synchronous code
```
</details>

## Performance Implications

### Microtask Starvation

```javascript
console.log("Start");

// This can block the event loop!
function createInfiniteMicrotasks() {
    Promise.resolve().then(() => {
        console.log("Microtask");
        createInfiniteMicrotasks(); // Creates another microtask
    });
}

setTimeout(() => {
    console.log("This may never execute!");
}, 0);

// createInfiniteMicrotasks(); // Don't run this!

console.log("End");

/*
Problem: Infinite microtasks prevent macrotasks from executing
Solution: Use setTimeout to yield control back to event loop
*/

function betterAsyncLoop(count) {
    if (count > 0) {
        console.log(`Processing ${count}`);
        setTimeout(() => betterAsyncLoop(count - 1), 0);
    }
}

betterAsyncLoop(5);
```

## Best Practices

### 1. Understand API Categories

```javascript
// Microtasks (higher priority)
Promise.resolve().then(() => {});
async function() { await something; }
queueMicrotask(() => {});

// Macrotasks (lower priority)  
setTimeout(() => {}, 0);
setInterval(() => {}, 100);
element.addEventListener('click', () => {});
```

### 2. Avoid Blocking the Event Loop

```javascript
// Bad: Blocks event loop
function processLargeArray(array) {
    array.forEach(item => {
        // Heavy processing
        heavyComputation(item);
    });
}

// Good: Yields control periodically
async function processLargeArrayAsync(array) {
    for (let i = 0; i < array.length; i++) {
        heavyComputation(array[i]);
        
        // Yield control every 100 items
        if (i % 100 === 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }
}
```

### 3. Testing Async Code

```javascript
// Use proper async testing
describe('Async tests', () => {
    it('should handle promises correctly', async () => {
        const result = await someAsyncFunction();
        expect(result).toBe(expectedValue);
    });
    
    it('should handle timeouts', (done) => {
        setTimeout(() => {
            expect(something).toBe(true);
            done();
        }, 100);
    });
});
```

## Node.js Specific Differences

### process.nextTick() Priority

```javascript
// Node.js only
console.log("Start");

setTimeout(() => console.log("setTimeout"), 0);
setImmediate(() => console.log("setImmediate"));

Promise.resolve().then(() => console.log("Promise"));
process.nextTick(() => console.log("nextTick"));

console.log("End");

/*
Node.js Output:
Start
End
nextTick
Promise
setTimeout
setImmediate

process.nextTick has highest priority among microtasks
*/
```

## Debugging Tips

### 1. Visualizing the Event Loop

```javascript
function logWithTimestamp(message) {
    console.log(`${Date.now()}: ${message}`);
}

logWithTimestamp("Sync 1");

setTimeout(() => logWithTimestamp("Macro 1"), 0);
Promise.resolve().then(() => logWithTimestamp("Micro 1"));

logWithTimestamp("Sync 2");

// Use browser dev tools to see actual timing
```

### 2. Using Performance API

```javascript
performance.mark("start");

setTimeout(() => {
    performance.mark("timeout-executed");
    performance.measure("timeout-delay", "start", "timeout-executed");
    console.log(performance.getEntriesByType("measure"));
}, 0);

Promise.resolve().then(() => {
    performance.mark("promise-executed");
    performance.measure("promise-delay", "start", "promise-executed");
});
```

Understanding the task queue and event loop is crucial for writing efficient JavaScript code and debugging timing-related issues. The key is remembering that microtasks always have priority over macrotasks, and the event loop ensures non-blocking execution of asynchronous operations.