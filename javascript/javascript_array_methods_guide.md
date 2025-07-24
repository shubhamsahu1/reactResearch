# Complete JavaScript Array Methods Guide

## Table of Contents
1. [Array Creation](#array-creation)
2. [Mutating Methods (Modify Original Array)](#mutating-methods)
3. [Non-Mutating Methods (Return New Array)](#non-mutating-methods)
4. [Iteration Methods](#iteration-methods)
5. [Search and Test Methods](#search-and-test-methods)
6. [Reduction Methods](#reduction-methods)
7. [Static Methods](#static-methods)
8. [ES6+ Modern Methods](#es6-modern-methods)
9. [Performance Comparison](#performance-comparison)
10. [Best Practices](#best-practices)

## Array Creation

### Creating Arrays

```javascript
// Array literal (most common)
const fruits = ['apple', 'banana', 'orange'];

// Array constructor
const numbers = new Array(1, 2, 3, 4, 5);
const empty = new Array(5); // Creates array with 5 empty slots

// Array.from() - creates array from iterable
const fromString = Array.from('hello'); // ['h', 'e', 'l', 'l', 'o']
const fromSet = Array.from(new Set([1, 2, 3])); // [1, 2, 3]

// Array.of() - creates array from arguments
const mixed = Array.of(1, 'two', true); // [1, 'two', true]

// Using spread operator
const spread = [...'abc']; // ['a', 'b', 'c']
```

## Mutating Methods (Modify Original Array)

These methods change the original array and return a specific value.

### push()
Adds elements to the end of array. Returns new length.

```javascript
const fruits = ['apple', 'banana'];
const newLength = fruits.push('orange', 'grape');
console.log(fruits); // ['apple', 'banana', 'orange', 'grape']
console.log(newLength); // 4

// Performance: O(1) - very fast
```

### pop()
Removes and returns the last element.

```javascript
const fruits = ['apple', 'banana', 'orange'];
const lastFruit = fruits.pop();
console.log(lastFruit); // 'orange'
console.log(fruits); // ['apple', 'banana']

// Performance: O(1) - very fast
```

### unshift()
Adds elements to the beginning of array. Returns new length.

```javascript
const fruits = ['banana', 'orange'];
const newLength = fruits.unshift('apple', 'grape');
console.log(fruits); // ['apple', 'grape', 'banana', 'orange']
console.log(newLength); // 4

// Performance: O(n) - slower for large arrays
```

### shift()
Removes and returns the first element.

```javascript
const fruits = ['apple', 'banana', 'orange'];
const firstFruit = fruits.shift();
console.log(firstFruit); // 'apple'
console.log(fruits); // ['banana', 'orange']

// Performance: O(n) - slower for large arrays
```

### splice()
Changes array by removing/replacing existing elements and/or adding new elements.

```javascript
const fruits = ['apple', 'banana', 'orange', 'grape'];

// Remove elements
const removed = fruits.splice(1, 2); // Remove 2 elements starting at index 1
console.log(removed); // ['banana', 'orange']
console.log(fruits); // ['apple', 'grape']

// Add elements
fruits.splice(1, 0, 'kiwi', 'mango'); // Add at index 1, remove 0
console.log(fruits); // ['apple', 'kiwi', 'mango', 'grape']

// Replace elements
fruits.splice(1, 2, 'pear'); // Replace 2 elements at index 1 with 'pear'
console.log(fruits); // ['apple', 'pear', 'grape']

// Performance: O(n) - depends on position and number of elements
```

### sort()
Sorts elements in place. Default sort is lexicographical.

```javascript
const fruits = ['banana', 'apple', 'orange'];
fruits.sort();
console.log(fruits); // ['apple', 'banana', 'orange']

// Custom sort function
const numbers = [10, 5, 40, 25, 1000, 1];
numbers.sort((a, b) => a - b); // Ascending
console.log(numbers); // [1, 5, 10, 25, 40, 1000]

// Descending
numbers.sort((a, b) => b - a);
console.log(numbers); // [1000, 40, 25, 10, 5, 1]

// Sort objects
const people = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
  { name: 'Bob', age: 35 }
];
people.sort((a, b) => a.age - b.age);
console.log(people); // Sorted by age ascending

// Performance: O(n log n)
```

### reverse()
Reverses array in place.

```javascript
const numbers = [1, 2, 3, 4, 5];
numbers.reverse();
console.log(numbers); // [5, 4, 3, 2, 1]

// Performance: O(n)
```

### fill()
Fills array elements with a static value.

```javascript
const arr = [1, 2, 3, 4, 5];
arr.fill(0); // Fill all with 0
console.log(arr); // [0, 0, 0, 0, 0]

// Fill with start and end positions
const arr2 = [1, 2, 3, 4, 5];
arr2.fill('x', 1, 4); // Fill from index 1 to 4 (exclusive)
console.log(arr2); // [1, 'x', 'x', 'x', 5]

// Performance: O(n)
```

### copyWithin()
Shallow copies part of array to another location in same array.

```javascript
const arr = [1, 2, 3, 4, 5];
arr.copyWithin(0, 3, 4); // Copy from index 3 to 4, paste at index 0
console.log(arr); // [4, 2, 3, 4, 5]

// More examples
const arr2 = [1, 2, 3, 4, 5];
arr2.copyWithin(2, 0); // Copy from index 0 to end, paste at index 2
console.log(arr2); // [1, 2, 1, 2, 3]

// Performance: O(n)
```

## Non-Mutating Methods (Return New Array)

These methods don't change the original array but return a new array.

### concat()
Merges arrays and returns new array.

```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const arr3 = [7, 8, 9];

const combined = arr1.concat(arr2, arr3);
console.log(combined); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(arr1); // [1, 2, 3] - unchanged

// With spread operator (modern alternative)
const modern = [...arr1, ...arr2, ...arr3];
console.log(modern); // [1, 2, 3, 4, 5, 6, 7, 8, 9]

// Performance: O(n)
```

### slice()
Returns shallow copy of portion of array.

```javascript
const fruits = ['apple', 'banana', 'orange', 'grape', 'kiwi'];

const citrus = fruits.slice(2, 4); // From index 2 to 4 (exclusive)
console.log(citrus); // ['orange', 'grape']

const lastTwo = fruits.slice(-2); // Last 2 elements
console.log(lastTwo); // ['grape', 'kiwi']

const copy = fruits.slice(); // Full copy
console.log(copy); // ['apple', 'banana', 'orange', 'grape', 'kiwi']

// Performance: O(n)
```

### join()
Joins array elements into string.

```javascript
const fruits = ['apple', 'banana', 'orange'];

const withCommas = fruits.join(); // Default separator is comma
console.log(withCommas); // 'apple,banana,orange'

const withSpaces = fruits.join(' ');
console.log(withSpaces); // 'apple banana orange'

const withDash = fruits.join(' - ');
console.log(withDash); // 'apple - banana - orange'

const noSeparator = fruits.join('');
console.log(noSeparator); // 'applebananaorange'

// Performance: O(n)
```

### toString()
Converts array to string (comma-separated).

```javascript
const numbers = [1, 2, 3, 4, 5];
const str = numbers.toString();
console.log(str); // '1,2,3,4,5'
console.log(typeof str); // 'string'

// Performance: O(n)
```

## Iteration Methods

These methods iterate through array elements.

### forEach()
Executes function for each array element.

```javascript
const numbers = [1, 2, 3, 4, 5];

numbers.forEach((num, index, array) => {
  console.log(`Index ${index}: ${num}`);
});
// Index 0: 1
// Index 1: 2
// Index 2: 3
// Index 3: 4
// Index 4: 5

// Practical example
const fruits = ['apple', 'banana', 'orange'];
const uppercased = [];
fruits.forEach(fruit => {
  uppercased.push(fruit.toUpperCase());
});
console.log(uppercased); // ['APPLE', 'BANANA', 'ORANGE']

// Performance: O(n)
// Note: Cannot break out early, use for...of or for loop if needed
```

### map()
Creates new array with results of calling function for every element.

```javascript
const numbers = [1, 2, 3, 4, 5];

// Square each number
const squared = numbers.map(num => num * num);
console.log(squared); // [1, 4, 9, 16, 25]

// Transform objects
const people = [
  { firstName: 'John', lastName: 'Doe' },
  { firstName: 'Jane', lastName: 'Smith' }
];

const fullNames = people.map(person => `${person.firstName} ${person.lastName}`);
console.log(fullNames); // ['John Doe', 'Jane Smith']

// With index
const withIndex = numbers.map((num, index) => `${index}: ${num}`);
console.log(withIndex); // ['0: 1', '1: 2', '2: 3', '3: 4', '4: 5']

// Performance: O(n)
```

### filter()
Creates new array with elements that pass the test function.

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Filter even numbers
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4, 6, 8, 10]

// Filter objects
const people = [
  { name: 'John', age: 25 },
  { name: 'Jane', age: 30 },
  { name: 'Bob', age: 17 }
];

const adults = people.filter(person => person.age >= 18);
console.log(adults); // [{ name: 'John', age: 25 }, { name: 'Jane', age: 30 }]

// Filter with multiple conditions
const youngAdults = people.filter(person => person.age >= 18 && person.age < 30);
console.log(youngAdults); // [{ name: 'John', age: 25 }]

// Performance: O(n)
```

## Search and Test Methods

### find()
Returns first element that satisfies testing function.

```javascript
const numbers = [1, 2, 3, 4, 5];
const found = numbers.find(num => num > 3);
console.log(found); // 4

// Find object
const people = [
  { name: 'John', age: 25 },
  { name: 'Jane', age: 30 },
  { name: 'Bob', age: 17 }
];

const person = people.find(p => p.name === 'Jane');
console.log(person); // { name: 'Jane', age: 30 }

const notFound = people.find(p => p.name === 'Alice');
console.log(notFound); // undefined

// Performance: O(n) - stops at first match
```

### findIndex()
Returns index of first element that satisfies testing function.

```javascript
const numbers = [1, 2, 3, 4, 5];
const index = numbers.findIndex(num => num > 3);
console.log(index); // 3

const people = [
  { name: 'John', age: 25 },
  { name: 'Jane', age: 30 }
];

const janeIndex = people.findIndex(p => p.name === 'Jane');
console.log(janeIndex); // 1

const notFoundIndex = people.findIndex(p => p.name === 'Alice');
console.log(notFoundIndex); // -1

// Performance: O(n) - stops at first match
```

### findLast() and findLastIndex() (ES2022)
Find from the end of the array.

```javascript
const numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1];

const lastEven = numbers.findLast(num => num % 2 === 0);
console.log(lastEven); // 2

const lastEvenIndex = numbers.findLastIndex(num => num % 2 === 0);
console.log(lastEvenIndex); // 7

// Performance: O(n) - searches from end
```

### indexOf()
Returns first index of specified element.

```javascript
const fruits = ['apple', 'banana', 'orange', 'banana'];

console.log(fruits.indexOf('banana')); // 1
console.log(fruits.indexOf('grape')); // -1 (not found)

// With start position
console.log(fruits.indexOf('banana', 2)); // 3 (search from index 2)

// Performance: O(n)
```

### lastIndexOf()
Returns last index of specified element.

```javascript
const fruits = ['apple', 'banana', 'orange', 'banana'];

console.log(fruits.lastIndexOf('banana')); // 3
console.log(fruits.lastIndexOf('grape')); // -1 (not found)

// Performance: O(n)
```

### includes()
Determines if array includes certain element.

```javascript
const fruits = ['apple', 'banana', 'orange'];

console.log(fruits.includes('banana')); // true
console.log(fruits.includes('grape')); // false

// With start position
console.log(fruits.includes('apple', 1)); // false (search from index 1)

// Works with NaN
const numbers = [1, 2, NaN, 4];
console.log(numbers.includes(NaN)); // true

// Performance: O(n)
```

### some()
Tests if at least one element passes the test.

```javascript
const numbers = [1, 2, 3, 4, 5];

const hasEven = numbers.some(num => num % 2 === 0);
console.log(hasEven); // true

const hasNegative = numbers.some(num => num < 0);
console.log(hasNegative); // false

// With objects
const people = [
  { name: 'John', age: 25 },
  { name: 'Jane', age: 17 }
];

const hasMinor = people.some(person => person.age < 18);
console.log(hasMinor); // true

// Performance: O(n) - stops at first match
```

### every()
Tests if all elements pass the test.

```javascript
const numbers = [2, 4, 6, 8, 10];

const allEven = numbers.every(num => num % 2 === 0);
console.log(allEven); // true

const allPositive = numbers.every(num => num > 0);
console.log(allPositive); // true

const allLarge = numbers.every(num => num > 5);
console.log(allLarge); // false

// Performance: O(n) - stops at first failure
```

## Reduction Methods

### reduce()
Reduces array to single value by executing reducer function.

```javascript
const numbers = [1, 2, 3, 4, 5];

// Sum all numbers
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(sum); // 15

// Find maximum
const max = numbers.reduce((acc, curr) => curr > acc ? curr : acc);
console.log(max); // 5

// Count occurrences
const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
console.log(count); // { apple: 3, banana: 2, orange: 1 }

// Flatten array
const nested = [[1, 2], [3, 4], [5, 6]];
const flattened = nested.reduce((acc, curr) => acc.concat(curr), []);
console.log(flattened); // [1, 2, 3, 4, 5, 6]

// Group by property
const people = [
  { name: 'John', age: 25, city: 'New York' },
  { name: 'Jane', age: 30, city: 'London' },
  { name: 'Bob', age: 25, city: 'New York' }
];

const groupedByAge = people.reduce((acc, person) => {
  const age = person.age;
  if (!acc[age]) acc[age] = [];
  acc[age].push(person);
  return acc;
}, {});
console.log(groupedByAge);

// Performance: O(n)
```

### reduceRight()
Reduces array from right to left.

```javascript
const numbers = [1, 2, 3, 4, 5];

// Concatenate from right
const rightConcat = numbers.reduceRight((acc, curr) => acc + curr, '');
console.log(rightConcat); // '54321'

// Useful for operations where order matters
const operations = [(x) => x + 1, (x) => x * 2, (x) => x - 3];
const result = operations.reduceRight((acc, operation) => operation(acc), 5);
console.log(result); // (5 - 3) * 2 + 1 = 5

// Performance: O(n)
```

## Static Methods

### Array.isArray()
Determines if value is an array.

```javascript
console.log(Array.isArray([1, 2, 3])); // true
console.log(Array.isArray('not array')); // false
console.log(Array.isArray({ 0: 'a', 1: 'b', length: 2 })); // false

// Useful for type checking
function processArray(input) {
  if (!Array.isArray(input)) {
    throw new Error('Input must be an array');
  }
  return input.map(x => x * 2);
}
```

### Array.from()
Creates array from array-like or iterable object.

```javascript
// From string
const fromString = Array.from('hello');
console.log(fromString); // ['h', 'e', 'l', 'l', 'o']

// From Set
const fromSet = Array.from(new Set([1, 2, 3, 3, 4]));
console.log(fromSet); // [1, 2, 3, 4]

// From NodeList
// const divs = Array.from(document.querySelectorAll('div'));

// With mapping function
const doubled = Array.from([1, 2, 3], x => x * 2);
console.log(doubled); // [2, 4, 6]

// Create array with specific length and values
const zeros = Array.from({ length: 5 }, () => 0);
console.log(zeros); // [0, 0, 0, 0, 0]

const sequence = Array.from({ length: 5 }, (_, i) => i + 1);
console.log(sequence); // [1, 2, 3, 4, 5]
```

### Array.of()
Creates array from arguments.

```javascript
// Difference from Array constructor
const arr1 = Array(3); // [empty × 3]
const arr2 = Array.of(3); // [3]

const mixed = Array.of(1, 'two', true, null);
console.log(mixed); // [1, 'two', true, null]

// Useful for consistent array creation
function createArray(...args) {
  return Array.of(...args);
}
```

## ES6+ Modern Methods

### flat()
Flattens nested arrays.

```javascript
const nested = [1, [2, 3], [4, [5, 6]]];

// Flatten one level (default)
const flat1 = nested.flat();
console.log(flat1); // [1, 2, 3, 4, [5, 6]]

// Flatten specific depth
const flat2 = nested.flat(2);
console.log(flat2); // [1, 2, 3, 4, 5, 6]

// Flatten all levels
const deepNested = [1, [2, [3, [4, [5]]]]];
const flatAll = deepNested.flat(Infinity);
console.log(flatAll); // [1, 2, 3, 4, 5]

// Performance: O(n) where n is total number of elements
```

### flatMap()
Maps each element and flattens result.

```javascript
const sentences = ['Hello world', 'How are you', 'Fine thanks'];

// Split into words
const words = sentences.flatMap(sentence => sentence.split(' '));
console.log(words); // ['Hello', 'world', 'How', 'are', 'you', 'Fine', 'thanks']

// Compare with map + flat
const mapFlat = sentences.map(s => s.split(' ')).flat();
console.log(mapFlat); // Same result but less efficient

// Remove empty values
const numbers = [1, 2, 3, 4];
const filtered = numbers.flatMap(n => n % 2 === 0 ? [n] : []);
console.log(filtered); // [2, 4]

// Performance: O(n)
```

### at() (ES2022)
Returns element at specified index (supports negative indexing).

```javascript
const fruits = ['apple', 'banana', 'orange', 'grape'];

console.log(fruits.at(0)); // 'apple'
console.log(fruits.at(-1)); // 'grape' (last element)
console.log(fruits.at(-2)); // 'orange' (second to last)

// Compare with bracket notation
console.log(fruits[fruits.length - 1]); // 'grape' (verbose)
console.log(fruits.at(-1)); // 'grape' (clean)

// Performance: O(1)
```

### with() (ES2023 - Proposal)
Returns new array with element at index replaced.

```javascript
// Note: Limited browser support
const fruits = ['apple', 'banana', 'orange'];
const newFruits = fruits.with(1, 'grape');
console.log(newFruits); // ['apple', 'grape', 'orange']
console.log(fruits); // ['apple', 'banana', 'orange'] - unchanged
```

## Performance Comparison

### Big O Complexity Summary

| Method | Time Complexity | Space Complexity | Notes |
|--------|-----------------|------------------|-------|
| push() | O(1) | O(1) | Fastest way to add to end |
| pop() | O(1) | O(1) | Fastest way to remove from end |
| unshift() | O(n) | O(1) | Slow for large arrays |
| shift() | O(n) | O(1) | Slow for large arrays |
| splice() | O(n) | O(1) | Depends on position |
| indexOf() | O(n) | O(1) | Linear search |
| includes() | O(n) | O(1) | Linear search |
| find() | O(n) | O(1) | Stops at first match |
| map() | O(n) | O(n) | Creates new array |
| filter() | O(n) | O(n) | Creates new array |
| reduce() | O(n) | O(1) | Single pass |
| sort() | O(n log n) | O(1) | In-place sorting |

### Performance Tips

```javascript
// ✅ Good: Use push() for adding to end
const arr = [];
for (let i = 0; i < 1000; i++) {
  arr.push(i);
}

// ❌ Bad: Using unshift() for adding to beginning
const arr2 = [];
for (let i = 0; i < 1000; i++) {
  arr2.unshift(i); // O(n) operation in loop = O(n²)
}

// ✅ Good: Build array then reverse if needed
const arr3 = [];
for (let i = 0; i < 1000; i++) {
  arr3.push(i);
}
arr3.reverse(); // O(n) operation once

// ✅ Good: Use appropriate method for task
const numbers = [1, 2, 3, 4, 5];

// Finding single item
const found = numbers.find(n => n > 3); // Stops at first match

// Checking existence
const exists = numbers.includes(4); // Direct lookup

// Transforming all items
const doubled = numbers.map(n => n * 2); // Purpose-built for transformation
```

## Best Practices

### 1. Choose the Right Method

```javascript
// ✅ Use specific methods for their purpose
const numbers = [1, 2, 3, 4, 5];

// Transform data - use map()
const doubled = numbers.map(n => n * 2);

// Filter data - use filter()
const evens = numbers.filter(n => n % 2 === 0);

// Find single item - use find()
const found = numbers.find(n => n > 3);

// Check existence - use includes()
const hasThree = numbers.includes(3);

// Aggregate data - use reduce()
const sum = numbers.reduce((a, b) => a + b, 0);
```

### 2. Method Chaining

```javascript
const people = [
  { name: 'John', age: 25, salary: 50000 },
  { name: 'Jane', age: 30, salary: 60000 },
  { name: 'Bob', age: 35, salary: 55000 },
  { name: 'Alice', age: 28, salary: 65000 }
];

// Chain methods for complex operations
const result = people
  .filter(person => person.age > 25) // Filter adults over 25
  .map(person => ({ ...person, bonus: person.salary * 0.1 })) // Add bonus
  .sort((a, b) => b.salary - a.salary) // Sort by salary descending
  .slice(0, 2); // Take top 2

console.log(result);
```

### 3. Immutable Operations

```javascript
// ✅ Good: Don't mutate original arrays
const original = [1, 2, 3];
const newArray = [...original, 4]; // Use spread operator
const filtered = original.filter(n => n > 1); // Creates new array

// ❌ Bad: Mutating when you need immutable operations
// original.push(4); // Mutates original
```

### 4. Handle Edge Cases

```javascript
function safeOperation(arr) {
  // Check if input is array
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array');
  }
  
  // Handle empty arrays
  if (arr.length === 0) {
    return [];
  }
  
  // Proceed with operation
  return arr.map(item => item * 2);
}

// Safe find operation
function safeFindIndex(arr, predicate) {
  const index = arr.findIndex(predicate);
  return index !== -1 ? index : null;
}
```

### 5. Memory Considerations

```javascript
// ✅ Good: Process data in chunks for large datasets
function processLargeArray(largeArray) {
  const chunkSize = 1000;
  const results = [];
  
  for (let i = 0; i < largeArray.length; i += chunkSize) {
    const chunk = largeArray.slice(i, i + chunkSize);
    const processed = chunk.map(item => expensiveOperation(item));
    results.push(...processed);
  }
  
  return results;
}

// ✅ Good: Use appropriate data structures
const uniqueItems = [...new Set(arrayWithDuplicates)]; // Remove duplicates efficiently
```

### 6. Modern Array Patterns

```javascript
// Destructuring with arrays
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(rest); // [3, 4, 5]

// Array from range
const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);
console.log(range(1, 5)); // [1, 2, 3, 4, 5]

// Conditional array spreading
const baseArray = [1, 2, 3];
const conditionalArray = [
  ...baseArray,
  ...(condition ? [4, 5] : []),
  6
];

// Object to array conversions
const obj = { a: 1, b: 2, c: 3 };
const keys = Object.keys(obj); // ['a', 'b', 'c']
const values = Object.values(obj); // [1, 2, 3]
const entries = Object.entries(obj); // [['a', 1], ['b', 2], ['c', 3]]
```

## Common Patterns and Use Cases

### Data Processing Pipeline

```javascript
const rawData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 25, active: true },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 30, active: false },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, active: true }
];

const processedData = rawData
  .filter(user => user.active) // Only active users
  .map(user => ({
    ...user,
    displayName: user.name.toUpperCase(),
    emailDomain: user.email.split('@')[1]
  }))
  .sort((a, b) => a.age - b.age); // Sort by age

console.log(processedData);
```

### Array Utilities

```javascript
// Remove duplicates
const removeDuplicates = arr => [...new Set(arr)];

// Chunk array
const chunk = (arr, size) => 
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

// Shuffle array
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

// Group by property
const groupBy = (arr, key) => 
  arr.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});

// Usage examples
console.log(removeDuplicates([1, 2, 2, 3, 3, 4])); // [1, 2, 3, 4]
console.log(chunk([1, 2, 3, 4, 5, 6], 2)); // [[1, 2], [3, 4], [5, 6]]
console.log(groupBy([{age: 25}, {age: 30}, {age: 25}], 'age')); // {25: [...], 30: [...]}
```

This comprehensive guide covers all major JavaScript array methods with practical examples and performance considerations. Master these methods to become proficient in array manipulation and data processing!