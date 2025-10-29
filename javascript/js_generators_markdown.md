# JavaScript Generators Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Generator Syntax](#generator-syntax)
3. [How Generators Work](#how-generators-work)
4. [Generator Methods](#generator-methods)
5. [Practical Generator Examples](#practical-generator-examples)
6. [Advanced Patterns](#advanced-patterns)
7. [Async Generators](#async-generators)
8. [Real-World Use Cases](#real-world-use-cases)

---

## Introduction

Generators are special functions that can pause execution and resume later, allowing them to produce a sequence of values over time. They simplify the creation of iterators and enable powerful patterns for handling asynchronous operations, lazy evaluation, and infinite sequences.

### Key Features

- **Pausable Execution**: Can pause and resume using `yield`
- **Automatic Iterators**: Generators automatically implement the iterator protocol
- **State Preservation**: Maintain state between pauses
- **Two-Way Communication**: Can send and receive values
- **Memory Efficient**: Generate values on demand (lazy evaluation)

### Generator vs Regular Function

```javascript
// Regular function - returns once
function regularFunction() {
  return 1;
  return 2; // Never reached
  return 3; // Never reached
}

console.log(regularFunction()); // 1

// Generator function - can yield multiple times
function* generatorFunction() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = generatorFunction();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
console.log(gen.next().value); // 3
```

---

## Generator Syntax

### Function Declaration

```javascript
// Generator function declaration
function* myGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

// Note the asterisk (*) can be placed in different positions
function *myGenerator2() { } // Valid
function* myGenerator3() { } // Valid (preferred)
function * myGenerator4() { } // Valid
```

### Function Expression

```javascript
// Generator function expression
const myGenerator = function*() {
  yield 1;
  yield 2;
};

// Arrow functions cannot be generators
// const myGenerator = *() => { }; // Syntax Error!
```

### Method in Object

```javascript
const obj = {
  // Generator method
  *generatorMethod() {
    yield 1;
    yield 2;
  }
};

for (const value of obj.generatorMethod()) {
  console.log(value); // 1, 2
}
```

### Method in Class

```javascript
class MyClass {
  *generatorMethod() {
    yield 1;
    yield 2;
  }
  
  // Generator as iterator
  *[Symbol.iterator]() {
    yield 'a';
    yield 'b';
    yield 'c';
  }
}

const instance = new MyClass();

// Use the generator method
console.log([...instance.generatorMethod()]); // [1, 2]

// Use as iterable
console.log([...instance]); // ['a', 'b', 'c']
```

---

## How Generators Work

### Basic Execution Flow

```javascript
function* simpleGenerator() {
  console.log('Starting');
  yield 1;
  console.log('After first yield');
  yield 2;
  console.log('After second yield');
  yield 3;
  console.log('Ending');
}

const gen = simpleGenerator();
// Nothing logged yet - generator hasn't started

console.log(gen.next()); 
// Logs: "Starting"
// Returns: { value: 1, done: false }

console.log(gen.next()); 
// Logs: "After first yield"
// Returns: { value: 2, done: false }

console.log(gen.next()); 
// Logs: "After second yield"
// Returns: { value: 3, done: false }

console.log(gen.next()); 
// Logs: "Ending"
// Returns: { value: undefined, done: true }
```

### Generators Are Iterables

```javascript
function* colors() {
  yield 'red';
  yield 'green';
  yield 'blue';
}

// Use with for...of
for (const color of colors()) {
  console.log(color); // red, green, blue
}

// Use with spread operator
console.log([...colors()]); // ['red', 'green', 'blue']

// Use with destructuring
const [first, second, ...rest] = colors();
console.log(first);  // red
console.log(second); // green
console.log(rest);   // ['blue']
```

### Return in Generators

```javascript
function* generatorWithReturn() {
  yield 1;
  yield 2;
  return 3; // Final value
  yield 4;  // Never reached
}

const gen = generatorWithReturn();

console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: true }
console.log(gen.next()); // { value: undefined, done: true }

// Note: for...of doesn't include the return value
console.log([...generatorWithReturn()]); // [1, 2]
```

---

## Generator Methods

### next() - Continue Execution

```javascript
function* parameterizedGenerator() {
  const x = yield 1;
  console.log('Received:', x);
  const y = yield 2;
  console.log('Received:', y);
  return x + y;
}

const gen = parameterizedGenerator();

console.log(gen.next());     // { value: 1, done: false }
console.log(gen.next(10));   // Logs: "Received: 10"
                              // { value: 2, done: false }
console.log(gen.next(20));   // Logs: "Received: 20"
                              // { value: 30, done: true }
```

### return() - Terminate Generator

```javascript
function* generatorWithCleanup() {
  try {
    yield 1;
    yield 2;
    yield 3;
  } finally {
    console.log('Cleaning up...');
  }
}

const gen = generatorWithCleanup();

console.log(gen.next());      // { value: 1, done: false }
console.log(gen.return(999)); // Logs: "Cleaning up..."
                               // { value: 999, done: true }
console.log(gen.next());      // { value: undefined, done: true }
```

### throw() - Inject Error

```javascript
function* errorHandlingGenerator() {
  try {
    yield 1;
    yield 2;
    yield 3;
  } catch (error) {
    console.log('Error caught:', error.message);
    yield 'recovered';
  }
  yield 'continuing';
}

const gen = errorHandlingGenerator();

console.log(gen.next());  // { value: 1, done: false }
console.log(gen.throw(new Error('Something went wrong')));
// Logs: "Error caught: Something went wrong"
// { value: 'recovered', done: false }
console.log(gen.next());  // { value: 'continuing', done: false }
```

---

## Practical Generator Examples

### 1. Range Generator

```javascript
function* range(start, end, step = 1) {
  for (let i = start; i <= end; i += step) {
    yield i;
  }
}

console.log([...range(1, 10)]); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log([...range(0, 20, 5)]); // [0, 5, 10, 15, 20]
console.log([...range(10, 1, -2)]); // [10, 8, 6, 4, 2]
```

### 2. Infinite Sequence Generator

```javascript
function* infiniteSequence(start = 0) {
  let i = start;
  while (true) {
    yield i++;
  }
}

const numbers = infiniteSequence(1);
console.log(numbers.next().value); // 1
console.log(numbers.next().value); // 2
console.log(numbers.next().value); // 3
// Continues infinitely...

// Take first N items
function* take(iterable, n) {
  let count = 0;
  for (const value of iterable) {
    if (count >= n) break;
    yield value;
    count++;
  }
}

console.log([...take(infiniteSequence(0), 5)]); // [0, 1, 2, 3, 4]
```

### 3. Fibonacci Generator

```javascript
function* fibonacci() {
  let [prev, curr] = [0, 1];
  
  while (true) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

// Get first 10 fibonacci numbers
function getFirstN(generator, n) {
  const result = [];
  const gen = generator();
  for (let i = 0; i < n; i++) {
    result.push(gen.next().value);
  }
  return result;
}

console.log(getFirstN(fibonacci, 10));
// [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]

// Or using take function
console.log([...take(fibonacci(), 10)]);
```

### 4. ID Generator

```javascript
function* idGenerator(prefix = 'ID') {
  let id = 1;
  while (true) {
    yield `${prefix}-${String(id).padStart(5, '0')}`;
    id++;
  }
}

const userIds = idGenerator('USER');
console.log(userIds.next().value); // USER-00001
console.log(userIds.next().value); // USER-00002
console.log(userIds.next().value); // USER-00003

const orderIds = idGenerator('ORDER');
console.log(orderIds.next().value); // ORDER-00001
console.log(orderIds.next().value); // ORDER-00002
```

### 5. Random Number Generator

```javascript
function* randomGenerator(min = 0, max = 100) {
  while (true) {
    yield Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

const random = randomGenerator(1, 10);
console.log(random.next().value); // Random number between 1-10
console.log(random.next().value); // Another random number
console.log(random.next().value); // Another random number
```

### 6. Pagination Generator

```javascript
function* paginate(array, pageSize) {
  for (let i = 0; i < array.length; i += pageSize) {
    yield array.slice(i, i + pageSize);
  }
}

const data = Array.from({ length: 25 }, (_, i) => i + 1);
const pages = paginate(data, 10);

console.log(pages.next().value); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log(pages.next().value); // [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
console.log(pages.next().value); // [21, 22, 23, 24, 25]
console.log(pages.next().value); // undefined
```

### 7. Iterator Utilities

```javascript
// Filter generator
function* filter(iterable, predicate) {
  for (const value of iterable) {
    if (predicate(value)) {
      yield value;
    }
  }
}

// Map generator
function* map(iterable, mapper) {
  for (const value of iterable) {
    yield mapper(value);
  }
}

// Usage
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evenNumbers = filter(numbers, n => n % 2 === 0);
const doubled = map(evenNumbers, n => n * 2);

console.log([...doubled]); // [4, 8, 12, 16, 20]
```

---

## Advanced Patterns

### yield* - Generator Delegation

The `yield*` keyword delegates to another iterable or generator.

```javascript
function* generator1() {
  yield 1;
  yield 2;
}

function* generator2() {
  yield 3;
  yield 4;
}

function* combinedGenerator() {
  yield* generator1();
  yield* generator2();
  yield 5;
}

console.log([...combinedGenerator()]); // [1, 2, 3, 4, 5]
```

#### Recursive Tree Traversal

```javascript
class TreeNode {
  constructor(value, children = []) {
    this.value = value;
    this.children = children;
  }
  
  *traverse() {
    yield this.value;
    for (const child of this.children) {
      yield* child.traverse();
    }
  }
}

const tree = new TreeNode('root', [
  new TreeNode('child1', [
    new TreeNode('grandchild1'),
    new TreeNode('grandchild2')
  ]),
  new TreeNode('child2')
]);

console.log([...tree.traverse()]);
// ['root', 'child1', 'grandchild1', 'grandchild2', 'child2']
```

#### Flatten Nested Arrays

```javascript
function* flatten(array) {
  for (const item of array) {
    if (Array.isArray(item)) {
      yield* flatten(item); // Recursive delegation
    } else {
      yield item;
    }
  }
}

const nested = [1, [2, [3, [4, 5]], 6], 7, [8, 9]];
console.log([...flatten(nested)]); 
// [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### Composing Generators

```javascript
function* numbers() {
  yield 1;
  yield 2;
  yield 3;
}

function* letters() {
  yield 'a';
  yield 'b';
  yield 'c';
}

function* zip(gen1, gen2) {
  const iter1 = gen1();
  const iter2 = gen2();
  
  while (true) {
    const result1 = iter1.next();
    const result2 = iter2.next();
    
    if (result1.done || result2.done) break;
    
    yield [result1.value, result2.value];
  }
}

console.log([...zip(numbers, letters)]);
// [[1, 'a'], [2, 'b'], [3, 'c']]
```

### State Machine

```javascript
function* trafficLight() {
  while (true) {
    yield 'red';
    yield 'yellow';
    yield 'green';
  }
}

const light = trafficLight();
console.log(light.next().value); // red
console.log(light.next().value); // yellow
console.log(light.next().value); // green
console.log(light.next().value); // red (cycles back)
```

### Batching

```javascript
function* batch(iterable, batchSize) {
  let batch = [];
  
  for (const item of iterable) {
    batch.push(item);
    if (batch.length === batchSize) {
      yield batch;
      batch = [];
    }
  }
  
  // Yield remaining items
  if (batch.length > 0) {
    yield batch;
  }
}

const numbers = range(1, 10);
for (const group of batch(numbers, 3)) {
  console.log(group);
}
// [1, 2, 3]
// [4, 5, 6]
// [7, 8, 9]
// [10]
```

---

## Async Generators

Async generators combine generators with async/await, allowing you to yield promises.

### Basic Async Generator

```javascript
async function* asyncGenerator() {
  yield await Promise.resolve(1);
  yield await Promise.resolve(2);
  yield await Promise.resolve(3);
}

// Consume with for-await-of
async function consumeAsync() {
  for await (const value of asyncGenerator()) {
    console.log(value); // 1, 2, 3
  }
}

consumeAsync();
```

### Simulated API Calls

```javascript
async function* fetchPages(url, maxPages) {
  for (let page = 1; page <= maxPages; page++) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    yield {
      page,
      data: `Data from ${url}?page=${page}`,
      timestamp: new Date().toISOString()
    };
  }
}

async function loadAllPages() {
  for await (const pageData of fetchPages('https://api.example.com/items', 5)) {
    console.log(`Page ${pageData.page}: ${pageData.data}`);
  }
}

loadAllPages();
```

### Stream Processing

```javascript
async function* numberStream() {
  for (let i = 1; i <= 10; i++) {
    await new Promise(resolve => setTimeout(resolve, 500));
    yield i;
  }
}

async function* processStream(stream) {
  for await (const value of stream) {
    yield value * 2;
  }
}

async function* filterStream(stream, predicate) {
  for await (const value of stream) {
    if (predicate(value)) {
      yield value;
    }
  }
}

// Chain async generators
async function run() {
  const numbers = numberStream();
  const doubled = processStream(numbers);
  const evenOnly = filterStream(doubled, n => n % 4 === 0);
  
  for await (const value of evenOnly) {
    console.log(value); // 4, 8, 12, 16, 20
  }
}

run();
```

### Reading Files in Chunks (Node.js)

```javascript
const fs = require('fs');

async function* readFileInChunks(filePath, chunkSize = 1024) {
  const fileHandle = await fs.promises.open(filePath, 'r');
  const buffer = Buffer.alloc(chunkSize);
  
  try {
    while (true) {
      const { bytesRead } = await fileHandle.read(buffer, 0, chunkSize);
      
      if (bytesRead === 0) break;
      
      yield buffer.slice(0, bytesRead);
    }
  } finally {
    await fileHandle.close();
  }
}

// Usage
async function processFile() {
  for await (const chunk of readFileInChunks('large-file.txt')) {
    console.log('Processing chunk:', chunk.toString());
  }
}
```

---

## Real-World Use Cases

### 1. Unique ID Generator (Singleton)

```javascript
const IDGenerator = (function() {
  function* createGenerator() {
    let id = 1;
    while (true) {
      yield id++;
    }
  }
  
  const generator = createGenerator();
  
  return {
    nextId: () => generator.next().value,
    reset: () => {
      generator = createGenerator();
    }
  };
})();

console.log(IDGenerator.nextId()); // 1
console.log(IDGenerator.nextId()); // 2
console.log(IDGenerator.nextId()); // 3
```

### 2. Lazy Data Loading

```javascript
function* lazyLoadData(dataSource) {
  for (const item of dataSource) {
    // Simulate processing time
    console.log(`Loading ${item}...`);
    yield item;
  }
}

const data = ['item1', 'item2', 'item3', 'item4'];
const loader = lazyLoadData(data);

// Load items one at a time when needed
console.log(loader.next().value); // Loads item1
// ... do something ...
console.log(loader.next().value); // Loads item2
// ... do something ...
console.log(loader.next().value); // Loads item3
```

### 3. Throttled Event Stream

```javascript
async function* throttle(stream, delay) {
  for await (const value of stream) {
    yield value;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

// Usage with user input
async function* userInputEvents() {
  // In a real scenario, this would listen to actual events
  const inputs = ['a', 'b', 'c', 'd', 'e'];
  for (const input of inputs) {
    yield input;
  }
}

async function handleThrottledInput() {
  const throttled = throttle(userInputEvents(), 1000);
  
  for await (const input of throttled) {
    console.log('Processing:', input);
    // Process one input per second
  }
}
```

### 4. Retry Logic

```javascript
async function* retry(operation, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await operation();
      yield { success: true, result, attempt };
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        yield { success: false, error, attempt };
        throw error;
      }
      yield { success: false, error, attempt, retrying: true };
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// Usage
async function fetchData() {
  for await (const result of retry(() => fetch('https://api.example.com/data'))) {
    if (result.success) {
      console.log('Success:', result.result);
    } else if (result.retrying) {
      console.log(`Attempt ${result.attempt} failed, retrying...`);
    } else {
      console.log('All attempts failed');
    }
  }
}
```

### 5. Infinite Scroll Implementation

```javascript
async function* infiniteScroll(fetchPage) {
  let page = 1;
  
  while (true) {
    const data = await fetchPage(page);
    
    if (!data || data.length === 0) {
      return; // No more data
    }
    
    yield data;
    page++;
  }
}

// Usage
async function loadContent() {
  const fetchPage = async (page) => {
    const response = await fetch(`/api/items?page=${page}`);
    return response.json();
  };
  
  for await (const items of infiniteScroll(fetchPage)) {
    items.forEach(item => {
      // Append to DOM
      console.log('Loading item:', item);
    });
    
    // Wait for user to scroll near bottom
    await waitForScroll();
  }
}
```

---

## Summary

JavaScript generators provide powerful capabilities:

- **Lazy Evaluation**: Generate values on demand, saving memory
- **Pausable Execution**: Maintain state between yields
- **Simplified Iterators**: Easy implementation of the iterator protocol
- **Async Support**: Handle asynchronous sequences with async generators
- **Composability**: Combine generators for complex data transformations
- **Infinite Sequences**: Represent unlimited sequences efficiently

Generators are essential for modern JavaScript patterns including:
- Data streaming and processing
- Pagination and infinite scrolling
- State machines
- Async iteration
- Custom iteration logic

Use generators when you need to produce sequences of values, especially when those values are expensive to compute or when dealing with large or infinite datasets.