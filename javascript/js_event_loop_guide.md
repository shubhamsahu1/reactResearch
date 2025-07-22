# JavaScript Event Loop: Complete Guide

## What is the Event Loop?

The **Event Loop** is the core mechanism that enables JavaScript to perform non-blocking, asynchronous operations despite being single-threaded. It's responsible for coordinating the execution of code, handling events, and managing asynchronous operations.

Think of the Event Loop as a **traffic controller** that manages the flow of code execution, ensuring that:
- Synchronous code runs immediately
- Asynchronous operations don't block the main thread
- Callbacks are executed at the right time
- The application remains responsive

## JavaScript's Single-Threaded Nature

JavaScript runs on a **single main thread**, which means:
- Only one piece of code can execute at a time
- Long-running operations would freeze the entire application
- The Event Loop enables concurrency through asynchronous operations

```javascript
// This would block everything if JavaScript didn't have the Event Loop
console.log("Start");

// Without Event Loop, this would freeze the browser
for (let i = 0; i < 1000000000; i++) {
    // Heavy computation
}

console.log("This would be delayed without proper async handling");
```

## Event Loop Components

### 1. Call Stack
- Executes synchronous code
- LIFO (Last In, First Out) structure
- Contains function execution contexts

### 2. Web APIs (Browser) / C++ APIs (Node.js)
- Handle asynchronous operations
- Examples: setTimeout, DOM events, HTTP requests, file I/O

### 3. Callback Queues
- **Macrotask Queue**: setTimeout, setInterval, I/O operations
- **Microtask Queue**: Promises, queueMicrotask, MutationObserver

### 4. Event Loop
- Continuously monitors and coordinates execution
- Moves callbacks from queues to call stack

## Event Loop Phases

### Basic Event Loop Cycle

```
1. Execute all synchronous code (Call Stack)
2. Process all microtasks (Microtask Queue)
3. Process one macrotask (Macrotask Queue)
4. Process all microtasks again
5. Render (in browsers)
6. Repeat from step 3
```

### Visual Representation

```
┌─────────────────┐
│   Call Stack    │ ← Execute synchronous code
└─────────────────┘
         ↑
┌─────────────────┐
│   Event Loop    │ ← Coordinator
└─────────────────┘
         ↑
┌─────────────────┐
│ Microtask Queue │ ← High priority (Promises)
└─────────────────┘
         ↑
┌─────────────────┐
│ Macrotask Queue │ ← Lower priority (setTimeout)
└─────────────────┘
         ↑
┌─────────────────┐
│    Web APIs     │ ← Async operations
└─────────────────┘
```

## Event Loop in Action

### Example 1: Basic Event Loop Flow

```javascript
console.log("=== Event Loop Demo ===");

// 1. Synchronous code
console.log("1: Synchronous start");

// 2. Macrotask (Timer API)
setTimeout(() => {
    console.log("4: Macrotask - setTimeout");
}, 0);

// 3. Microtask (Promise)
Promise.resolve().then(() => {
    console.log("3: Microtask - Promise");
});

// 4. More synchronous code
console.log("2: Synchronous end");

/*
Event Loop Execution:
1. Call Stack: Execute synchronous code
   - "1: Synchronous start"
   - setTimeout → Web API → Macrotask Queue
   - Promise.then → Microtask Queue
   - "2: Synchronous end"

2. Call Stack empty → Check Microtask Queue
   - Execute "3: Microtask - Promise"

3. Microtask Queue empty → Check Macrotask Queue
   - Execute "4: Macrotask - setTimeout"

Output:
=== Event Loop Demo ===
1: Synchronous start
2: Synchronous end
3: Microtask - Promise
4: Macrotask - setTimeout
*/
```

### Example 2: Multiple Iterations

```javascript
console.log("Start");

setTimeout(() => {
    console.log("Timeout 1");
    
    // This creates a microtask during macrotask execution
    Promise.resolve().then(() => {
        console.log("Promise in Timeout 1");
    });
}, 0);

setTimeout(() => {
    console.log("Timeout 2");
}, 0);

Promise.resolve().then(() => {
    console.log("Promise 1");
    
    // Nested microtask
    Promise.resolve().then(() => {
        console.log("Nested Promise");
    });
});

console.log("End");

/*
Event Loop Iterations:

Iteration 1:
- Call Stack: "Start", "End"
- Microtask Queue: Promise 1, Nested Promise
- Macrotask Queue: Timeout 1, Timeout 2

Iteration 2:
- Process all microtasks: "Promise 1", "Nested Promise"
- Process one macrotask: "Timeout 1"
- New microtask created: "Promise in Timeout 1"

Iteration 3:
- Process microtask: "Promise in Timeout 1"
- Process next macrotask: "Timeout 2"

Output:
Start
End
Promise 1
Nested Promise
Timeout 1
Promise in Timeout 1
Timeout 2
*/
```

## Advanced Event Loop Concepts

### 1. Event Loop with User Interactions

```javascript
// Setup button
const button = document.createElement('button');
button.textContent = 'Click Me';
document.body.appendChild(button);

console.log("Setup complete");

// Event listener
button.addEventListener('click', () => {
    console.log("Button clicked");
    
    // Macrotask from event handler
    setTimeout(() => {
        console.log("Timeout from click handler");
    }, 0);
    
    // Microtask from event handler
    Promise.resolve().then(() => {
        console.log("Promise from click handler");
    });
    
    console.log("Click handler ending");
});

// Programmatic click
setTimeout(() => {
    console.log("About to trigger click");
    button.click();
    console.log("Click triggered");
}, 100);

/*
Event Loop Flow:
1. Synchronous setup
2. setTimeout schedules programmatic click
3. When timer fires:
   - "About to trigger click"
   - Click event processed synchronously
   - "Button clicked", "Click handler ending"
   - "Click triggered"
4. Microtasks: "Promise from click handler"
5. Macrotasks: "Timeout from click handler"
*/
```

### 2. Async/Await and Event Loop

```javascript
console.log("1: Script start");

async function asyncFunction() {
    console.log("2: Async function start");
    
    // This creates a microtask
    await new Promise(resolve => {
        console.log("3: Promise executor");
        resolve();
    });
    
    console.log("5: After first await");
    
    // Another microtask
    await Promise.resolve();
    console.log("7: After second await");
}

setTimeout(() => {
    console.log("8: Timeout callback");
}, 0);

asyncFunction();

console.log("4: Script end");

/*
Event Loop Analysis:

Phase 1 - Synchronous Execution:
- "1: Script start"
- asyncFunction() called
- "2: Async function start"
- Promise executor runs synchronously: "3: Promise executor"
- Function pauses at first await
- "4: Script end"

Phase 2 - Microtasks:
- First await resolves: "5: After first await"
- Function pauses at second await

Phase 3 - More Microtasks:
- Second await resolves: "7: After second await"

Phase 4 - Macrotasks:
- "8: Timeout callback"

Output:
1: Script start
2: Async function start
3: Promise executor
4: Script end
5: After first await
7: After second await
8: Timeout callback
*/
```

### 3. Event Loop with Fetch API

```javascript
console.log("Starting fetch demo");

// Simulate fetch with Promise
function simulateFetch(url, delay = 1000) {
    return new Promise(resolve => {
        console.log(`Initiating fetch to ${url}`);
        setTimeout(() => {
            resolve(`Response from ${url}`);
        }, delay);
    });
}

async function fetchData() {
    try {
        console.log("Fetch function start");
        
        const response = await simulateFetch("/api/data", 0);
        console.log("Response received:", response);
        
        // Process response
        return response.toUpperCase();
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// Start async operation
fetchData().then(result => {
    console.log("Final result:", result);
});

console.log("Fetch initiated");

setTimeout(() => {
    console.log("Timeout after fetch");
}, 0);

/*
Event Loop Coordination:

1. Synchronous Phase:
   - "Starting fetch demo"
   - fetchData() starts
   - "Fetch function start"
   - "Initiating fetch to /api/data"
   - Function pauses at await
   - "Fetch initiated"

2. Timer Phase:
   - simulateFetch setTimeout goes to macrotask queue
   - Regular setTimeout goes to macrotask queue

3. Macrotask Processing:
   - First macrotask: simulateFetch resolution
   - This creates microtask for await continuation

4. Microtask Processing:
   - "Response received: Response from /api/data"
   - Return creates another microtask

5. More Microtasks:
   - "Final result: RESPONSE FROM /API/DATA"

6. Next Macrotask:
   - "Timeout after fetch"
*/
```

## Event Loop in Different Environments

### Browser Event Loop

```javascript
// Browser-specific APIs and Event Loop

// Animation frames (special queue)
requestAnimationFrame(() => {
    console.log("Animation frame");
});

// User interactions
document.addEventListener('click', (event) => {
    console.log("Document clicked");
});

// Page lifecycle
window.addEventListener('load', () => {
    console.log("Page loaded");
});

// Intersection Observer (microtask)
const observer = new IntersectionObserver((entries) => {
    console.log("Intersection observed");
});

// Mutation Observer (microtask)
const mutationObserver = new MutationObserver((mutations) => {
    console.log("DOM mutated");
});

/*
Browser Event Loop Phases:
1. JavaScript execution
2. Style calculation
3. Layout
4. Paint
5. Composite
6. requestAnimationFrame callbacks
7. Intersection Observer callbacks
8. Resize Observer callbacks
*/
```

### Node.js Event Loop

```javascript
// Node.js specific Event Loop phases

console.log("Node.js Event Loop Demo");

// Timer phase
setTimeout(() => {
    console.log("Timer phase - setTimeout");
}, 0);

setImmediate(() => {
    console.log("Check phase - setImmediate");
});

// I/O callbacks phase
const fs = require('fs');
fs.readFile(__filename, () => {
    console.log("I/O phase - file read");
    
    setTimeout(() => {
        console.log("Timer from I/O");
    }, 0);
    
    setImmediate(() => {
        console.log("setImmediate from I/O");
    });
});

// Microtasks (process all between phases)
process.nextTick(() => {
    console.log("Process nextTick - highest priority");
});

Promise.resolve().then(() => {
    console.log("Promise - microtask");
});

/*
Node.js Event Loop Phases:
1. Timer phase (setTimeout, setInterval)
2. Pending callbacks phase
3. Idle, prepare phase
4. Poll phase (I/O operations)
5. Check phase (setImmediate)
6. Close callbacks phase

Between each phase: process all microtasks
process.nextTick has highest priority
*/
```

## Event Loop Performance Implications

### 1. Blocking the Event Loop

```javascript
// ❌ BAD: Blocks the event loop
function blockingOperation() {
    console.log("Starting blocking operation");
    
    const start = Date.now();
    while (Date.now() - start < 5000) {
        // This blocks the event loop for 5 seconds!
    }
    
    console.log("Blocking operation complete");
}

// ✅ GOOD: Non-blocking operation
async function nonBlockingOperation() {
    console.log("Starting non-blocking operation");
    
    const start = Date.now();
    while (Date.now() - start < 5000) {
        // Yield control periodically
        if ((Date.now() - start) % 100 === 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }
    
    console.log("Non-blocking operation complete");
}

// ✅ BETTER: Use Web Workers for heavy computation
function useWebWorker() {
    const worker = new Worker('heavy-computation-worker.js');
    
    worker.postMessage({ type: 'START_COMPUTATION', data: heavyData });
    
    worker.onmessage = (event) => {
        console.log("Computation result:", event.data);
    };
}
```

### 2. Optimizing Async Operations

```javascript
// ❌ Sequential execution (slower)
async function sequentialFetch() {
    const start = performance.now();
    
    const result1 = await fetch('/api/data1');
    const result2 = await fetch('/api/data2');
    const result3 = await fetch('/api/data3');
    
    console.log(`Sequential: ${performance.now() - start}ms`);
    return [result1, result2, result3];
}

// ✅ Parallel execution (faster)
async function parallelFetch() {
    const start = performance.now();
    
    const [result1, result2, result3] = await Promise.all([
        fetch('/api/data1'),
        fetch('/api/data2'),
        fetch('/api/data3')
    ]);
    
    console.log(`Parallel: ${performance.now() - start}ms`);
    return [result1, result2, result3];
}

// ✅ Batched processing
async function batchProcess(items) {
    const BATCH_SIZE = 10;
    const results = [];
    
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const batch = items.slice(i, i + BATCH_SIZE);
        
        // Process batch in parallel
        const batchResults = await Promise.all(
            batch.map(item => processItem(item))
        );
        
        results.push(...batchResults);
        
        // Yield control after each batch
        if (i + BATCH_SIZE < items.length) {
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }
    
    return results;
}
```

## Event Loop Debugging and Monitoring

### 1. Performance Monitoring

```javascript
// Monitor Event Loop lag
function measureEventLoopLag() {
    const start = process.hrtime.bigint();
    
    setImmediate(() => {
        const lag = Number(process.hrtime.bigint() - start) / 1000000; // Convert to ms
        console.log(`Event Loop lag: ${lag.toFixed(2)}ms`);
        
        // Continue monitoring
        setTimeout(measureEventLoopLag, 1000);
    });
}

// Start monitoring
measureEventLoopLag();

// Performance marks for debugging
function performanceDebug() {
    performance.mark('operation-start');
    
    setTimeout(() => {
        performance.mark('timeout-executed');
        performance.measure('timeout-delay', 'operation-start', 'timeout-executed');
        
        const measures = performance.getEntriesByType('measure');
        console.log('Performance measures:', measures);
    }, 0);
    
    Promise.resolve().then(() => {
        performance.mark('promise-executed');
        performance.measure('promise-delay', 'operation-start', 'promise-executed');
    });
}
```

### 2. Event Loop Visualization Tools

```javascript
// Custom Event Loop tracker
class EventLoopTracker {
    constructor() {
        this.events = [];
    }
    
    track(name, type = 'sync') {
        const timestamp = performance.now();
        this.events.push({ name, type, timestamp });
        console.log(`[${timestamp.toFixed(2)}ms] ${type.toUpperCase()}: ${name}`);
    }
    
    trackAsync(name, callback) {
        this.track(`${name} - start`, 'async');
        
        return (...args) => {
            this.track(`${name} - callback`, 'async');
            return callback(...args);
        };
    }
    
    report() {
        console.table(this.events);
    }
}

// Usage
const tracker = new EventLoopTracker();

tracker.track("Script start");

setTimeout(tracker.trackAsync("setTimeout", () => {
    console.log("Timer executed");
}), 0);

Promise.resolve().then(tracker.trackAsync("Promise", () => {
    console.log("Promise resolved");
}));

tracker.track("Script end");

setTimeout(() => tracker.report(), 100);
```

## Common Event Loop Patterns

### 1. Debouncing with Event Loop

```javascript
function debounce(func, delay) {
    let timeoutId;
    
    return function (...args) {
        // Clear previous timeout
        clearTimeout(timeoutId);
        
        // Schedule new execution
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Usage
const debouncedHandler = debounce((event) => {
    console.log("Debounced event:", event.type);
}, 300);

document.addEventListener('scroll', debouncedHandler);
```

### 2. Throttling with Event Loop

```javascript
function throttle(func, limit) {
    let inThrottle;
    
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

// Usage
const throttledHandler = throttle((event) => {
    console.log("Throttled event:", event.type);
}, 100);

document.addEventListener('mousemove', throttledHandler);
```

### 3. Cooperative Scheduling

```javascript
async function cooperativeScheduling(tasks) {
    const TASKS_PER_FRAME = 5;
    let taskIndex = 0;
    
    while (taskIndex < tasks.length) {
        const endIndex = Math.min(taskIndex + TASKS_PER_FRAME, tasks.length);
        
        // Process batch of tasks
        for (let i = taskIndex; i < endIndex; i++) {
            await tasks[i]();
        }
        
        taskIndex = endIndex;
        
        // Yield control to browser for rendering
        if (taskIndex < tasks.length) {
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }
}

// Usage
const heavyTasks = Array.from({ length: 100 }, (_, i) => 
    () => {
        console.log(`Processing task ${i + 1}`);
        // Simulate work
        for (let j = 0; j < 1000000; j++) {}
    }
);

cooperativeScheduling(heavyTasks);
```

## Event Loop Best Practices

### 1. Avoid Blocking Operations

```javascript
// ❌ Don't do this
function badExample() {
    const result = synchronousHeavyOperation(); // Blocks event loop
    updateUI(result);
}

// ✅ Do this instead
async function goodExample() {
    const result = await asynchronousHeavyOperation();
    updateUI(result);
}
```

### 2. Proper Error Handling

```javascript
// ❌ Unhandled promise rejection
Promise.resolve().then(() => {
    throw new Error("Oops!");
}); // This can crash the process

// ✅ Proper error handling
Promise.resolve()
    .then(() => {
        throw new Error("Oops!");
    })
    .catch(error => {
        console.error("Handled error:", error.message);
    });

// ✅ Global error handlers
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault(); // Prevent default behavior
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
```

### 3. Memory Management

```javascript
// ❌ Memory leaks with event listeners
function badEventHandling() {
    const button = document.createElement('button');
    
    button.addEventListener('click', () => {
        // This creates a closure that holds references
        heavyObjectThatShouldBeGarbageCollected.process();
    });
}

// ✅ Proper cleanup
function goodEventHandling() {
    const button = document.createElement('button');
    
    const clickHandler = () => {
        // Handle click
    };
    
    button.addEventListener('click', clickHandler);
    
    // Cleanup when done
    return () => {
        button.removeEventListener('click', clickHandler);
    };
}
```

## Testing Event Loop Behavior

```javascript
// Testing async behavior
describe('Event Loop Tests', () => {
    it('should execute in correct order', async () => {
        const executionOrder = [];
        
        // Synchronous
        executionOrder.push('sync1');
        
        // Macrotask
        setTimeout(() => {
            executionOrder.push('macro1');
        }, 0);
        
        // Microtask
        Promise.resolve().then(() => {
            executionOrder.push('micro1');
        });
        
        // More synchronous
        executionOrder.push('sync2');
        
        // Wait for all async operations
        await new Promise(resolve => setTimeout(resolve, 10));
        
        expect(executionOrder).toEqual([
            'sync1',
            'sync2', 
            'micro1',
            'macro1'
        ]);
    });
    
    it('should handle nested async operations', async () => {
        const results = [];
        
        await new Promise(resolve => {
            results.push('start');
            
            setTimeout(() => {
                results.push('timeout');
                resolve();
            }, 0);
            
            Promise.resolve().then(() => {
                results.push('promise');
            });
        });
        
        expect(results).toEqual(['start', 'promise', 'timeout']);
    });
});
```

The Event Loop is the heart of JavaScript's asynchronous execution model. Understanding how it coordinates between synchronous code, microtasks, and macrotasks is crucial for writing efficient, non-blocking applications and debugging timing-related issues. Remember that the Event Loop ensures JavaScript remains responsive by managing the execution order and preventing any single operation from blocking the entire application.