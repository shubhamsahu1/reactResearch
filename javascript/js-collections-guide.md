# JavaScript Collections: Map, WeakMap, Set, and WeakSet

A comprehensive guide to modern JavaScript collection data structures with practical examples.

---

## Table of Contents
- [Map](#map)
- [WeakMap](#weakmap)
- [Set](#set)
- [WeakSet](#weakset)
- [Comparison Table](#comparison-table)

---

## Map

### Overview
A **Map** is a collection that stores key-value pairs where keys can be of any type. Unlike plain objects, Maps maintain insertion order and provide better performance for frequent additions and deletions.

### Key Features
- Keys can be any data type (objects, functions, primitives)
- Maintains insertion order
- Has a `size` property
- Optimized for frequent additions/removals
- Iterable with `for...of` loop

### Methods
- `set(key, value)` - Adds or updates an entry
- `get(key)` - Retrieves value by key
- `has(key)` - Checks if key exists
- `delete(key)` - Removes an entry
- `clear()` - Removes all entries
- `keys()` - Returns iterator of keys
- `values()` - Returns iterator of values
- `entries()` - Returns iterator of [key, value] pairs
- `forEach(callback)` - Iterates over entries

### Examples

#### Basic Usage
```javascript
const userMap = new Map();

// Adding entries
userMap.set('name', 'Alice');
userMap.set('age', 30);
userMap.set('isAdmin', true);

// Using objects as keys
const user = { id: 1 };
userMap.set(user, 'User metadata');

console.log(userMap.get('name')); // 'Alice'
console.log(userMap.has('age')); // true
console.log(userMap.size); // 4
```

#### Iterating Over Map
```javascript
const scores = new Map([
  ['Alice', 95],
  ['Bob', 87],
  ['Charlie', 92]
]);

// Using for...of
for (let [name, score] of scores) {
  console.log(`${name}: ${score}`);
}

// Using forEach
scores.forEach((score, name) => {
  console.log(`${name} scored ${score}`);
});
```

#### Practical Example: Caching Function Results
```javascript
const cache = new Map();

function expensiveOperation(n) {
  if (cache.has(n)) {
    console.log('Returning cached result');
    return cache.get(n);
  }
  
  console.log('Computing result...');
  const result = n * n; // Simulate expensive calculation
  cache.set(n, result);
  return result;
}

console.log(expensiveOperation(5)); // Computing result... 25
console.log(expensiveOperation(5)); // Returning cached result 25
```

#### Map vs Object
```javascript
// Map advantages
const map = new Map();
map.set(1, 'number key');
map.set('1', 'string key');
map.set(true, 'boolean key');

console.log(map.get(1)); // 'number key'
console.log(map.get('1')); // 'string key'

// Object (keys converted to strings)
const obj = {};
obj[1] = 'number key';
obj['1'] = 'will overwrite';
console.log(obj[1]); // 'will overwrite'
```

---

## WeakMap

### Overview
A **WeakMap** is similar to Map but holds weak references to its keys. If there are no other references to a key object, it can be garbage collected automatically. This prevents memory leaks when storing metadata about objects.

### Key Features
- Keys **must be objects** (not primitives)
- Keys are weakly referenced (garbage collectible)
- Not iterable
- No `size` property
- No `clear()` method
- Perfect for private data and metadata

### Methods
- `set(key, value)` - Adds or updates an entry
- `get(key)` - Retrieves value by key
- `has(key)` - Checks if key exists
- `delete(key)` - Removes an entry

### Examples

#### Basic Usage
```javascript
const weakMap = new WeakMap();

let obj1 = { id: 1 };
let obj2 = { id: 2 };

weakMap.set(obj1, 'Data for obj1');
weakMap.set(obj2, 'Data for obj2');

console.log(weakMap.get(obj1)); // 'Data for obj1'
console.log(weakMap.has(obj2)); // true

// When obj1 is no longer referenced, it can be garbage collected
obj1 = null; // Entry in weakMap will be automatically removed
```

#### Practical Example: Private Data in Classes
```javascript
const privateData = new WeakMap();

class BankAccount {
  constructor(accountNumber, balance) {
    this.accountNumber = accountNumber;
    // Store sensitive data privately
    privateData.set(this, { balance, pin: '1234' });
  }
  
  getBalance() {
    return privateData.get(this).balance;
  }
  
  deposit(amount) {
    const data = privateData.get(this);
    data.balance += amount;
    return data.balance;
  }
  
  withdraw(amount, pin) {
    const data = privateData.get(this);
    if (data.pin !== pin) {
      throw new Error('Invalid PIN');
    }
    if (data.balance < amount) {
      throw new Error('Insufficient funds');
    }
    data.balance -= amount;
    return data.balance;
  }
}

const account = new BankAccount('ACC001', 1000);
console.log(account.getBalance()); // 1000
account.deposit(500); // 1500
account.withdraw(200, '1234'); // 1300

// Can't access private data directly
console.log(account.balance); // undefined
```

#### Practical Example: DOM Node Metadata
```javascript
const domMetadata = new WeakMap();

function attachMetadata(element, data) {
  domMetadata.set(element, data);
}

function getMetadata(element) {
  return domMetadata.get(element);
}

// Usage
const button = document.createElement('button');
attachMetadata(button, { 
  clickCount: 0, 
  created: new Date() 
});

// When button is removed from DOM and no longer referenced,
// the metadata is automatically garbage collected
```

---

## Set

### Overview
A **Set** is a collection of unique values. It automatically removes duplicates and is ideal for storing unique items or checking membership.

### Key Features
- Stores only unique values
- Maintains insertion order
- Values can be any data type
- Has a `size` property
- Iterable with `for...of` loop

### Methods
- `add(value)` - Adds a value
- `has(value)` - Checks if value exists
- `delete(value)` - Removes a value
- `clear()` - Removes all values
- `keys()` / `values()` - Returns iterator of values (same in Set)
- `entries()` - Returns iterator of [value, value] pairs
- `forEach(callback)` - Iterates over values

### Examples

#### Basic Usage
```javascript
const numbers = new Set();

numbers.add(1);
numbers.add(2);
numbers.add(3);
numbers.add(2); // Duplicate, won't be added

console.log(numbers.size); // 3
console.log(numbers.has(2)); // true

numbers.delete(2);
console.log(numbers.has(2)); // false
```

#### Removing Duplicates from Array
```javascript
const arrayWithDuplicates = [1, 2, 2, 3, 4, 4, 5];
const uniqueNumbers = [...new Set(arrayWithDuplicates)];

console.log(uniqueNumbers); // [1, 2, 3, 4, 5]
```

#### Set Operations
```javascript
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

// Union
const union = new Set([...setA, ...setB]);
console.log([...union]); // [1, 2, 3, 4, 5, 6]

// Intersection
const intersection = new Set([...setA].filter(x => setB.has(x)));
console.log([...intersection]); // [3, 4]

// Difference
const difference = new Set([...setA].filter(x => !setB.has(x)));
console.log([...difference]); // [1, 2]
```

#### Practical Example: Tracking Unique Visitors
```javascript
const visitors = new Set();

function recordVisit(userId) {
  visitors.add(userId);
  console.log(`Total unique visitors: ${visitors.size}`);
}

recordVisit('user1'); // Total unique visitors: 1
recordVisit('user2'); // Total unique visitors: 2
recordVisit('user1'); // Total unique visitors: 2 (duplicate)

// Get all unique visitors
console.log([...visitors]); // ['user1', 'user2']
```

#### Practical Example: Tag System
```javascript
class Article {
  constructor(title) {
    this.title = title;
    this.tags = new Set();
  }
  
  addTag(tag) {
    this.tags.add(tag.toLowerCase());
  }
  
  removeTag(tag) {
    this.tags.delete(tag.toLowerCase());
  }
  
  hasTag(tag) {
    return this.tags.has(tag.toLowerCase());
  }
  
  getAllTags() {
    return [...this.tags];
  }
}

const article = new Article('JavaScript Collections');
article.addTag('JavaScript');
article.addTag('Tutorial');
article.addTag('javascript'); // Won't add duplicate

console.log(article.getAllTags()); // ['javascript', 'tutorial']
console.log(article.hasTag('JavaScript')); // true
```

---

## WeakSet

### Overview
A **WeakSet** is similar to Set but holds weak references to its values. Objects in a WeakSet can be garbage collected if there are no other references to them.

### Key Features
- Values **must be objects** (not primitives)
- Values are weakly referenced (garbage collectible)
- Not iterable
- No `size` property
- No `clear()` method
- Ideal for marking/tagging objects

### Methods
- `add(value)` - Adds an object
- `has(value)` - Checks if object exists
- `delete(value)` - Removes an object

### Examples

#### Basic Usage
```javascript
const weakSet = new WeakSet();

let obj1 = { name: 'Alice' };
let obj2 = { name: 'Bob' };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true

// When obj1 is no longer referenced, it can be garbage collected
obj1 = null; // Entry in weakSet will be automatically removed
```

#### Practical Example: Tracking Processed Objects
```javascript
const processedItems = new WeakSet();

function processData(dataObject) {
  if (processedItems.has(dataObject)) {
    console.log('This object has already been processed');
    return;
  }
  
  // Process the data
  console.log('Processing:', dataObject);
  processedItems.add(dataObject);
}

const data1 = { id: 1, value: 'test' };
const data2 = { id: 2, value: 'example' };

processData(data1); // Processing: { id: 1, value: 'test' }
processData(data1); // This object has already been processed
processData(data2); // Processing: { id: 2, value: 'example' }
```

#### Practical Example: DOM Element State Tracking
```javascript
const disabledElements = new WeakSet();

function disableElement(element) {
  element.disabled = true;
  disabledElements.add(element);
}

function isElementDisabled(element) {
  return disabledElements.has(element);
}

function enableElement(element) {
  element.disabled = false;
  disabledElements.delete(element);
}

// Usage
const button = document.createElement('button');
disableElement(button);
console.log(isElementDisabled(button)); // true

// When button is removed from DOM, memory is cleaned up automatically
```

#### Practical Example: Object Validation
```javascript
const validatedObjects = new WeakSet();

function validate(obj) {
  // Perform validation
  if (obj.id && obj.name) {
    validatedObjects.add(obj);
    return true;
  }
  return false;
}

function isValid(obj) {
  return validatedObjects.has(obj);
}

const user1 = { id: 1, name: 'Alice' };
const user2 = { id: 2 }; // Missing name

validate(user1); // true
validate(user2); // false

console.log(isValid(user1)); // true
console.log(isValid(user2)); // false
```

---

## Comparison Table

| Feature | Map | WeakMap | Set | WeakSet |
|---------|-----|---------|-----|---------|
| **Stores** | Key-value pairs | Key-value pairs | Unique values | Unique objects |
| **Key/Value Types** | Any type | Objects only (keys) | Any type | Objects only |
| **References** | Strong | Weak | Strong | Weak |
| **Iterable** | Yes | No | Yes | No |
| **Size Property** | Yes | No | Yes | No |
| **Garbage Collection** | Manual (delete/clear) | Automatic | Manual (delete/clear) | Automatic |
| **Use Cases** | General key-value storage, caching | Private data, metadata | Unique collections, deduplication | Marking objects, tracking state |
| **Performance** | O(1) for operations | O(1) for operations | O(1) for operations | O(1) for operations |

---

## When to Use What?

### Use **Map** when:
- You need key-value pairs with any key type
- Order of insertion matters
- You need to iterate over entries
- You need to know the collection size

### Use **WeakMap** when:
- You need to store metadata about objects
- You want to avoid memory leaks
- You need private data in classes
- Objects should be garbage collected when no longer used

### Use **Set** when:
- You need a collection of unique values
- You need to remove duplicates from arrays
- You need to perform set operations (union, intersection)
- Order of insertion matters

### Use **WeakSet** when:
- You need to mark or tag objects temporarily
- You want to track object state without preventing garbage collection
- Objects should be cleaned up automatically
- You don't need to iterate or count items

---

## Performance Tips

1. **Maps vs Objects**: Use Map for dynamic collections with frequent additions/deletions. Use objects for static structures.

2. **Sets for Membership Testing**: Sets have O(1) lookup time, making them ideal for checking if a value exists.

3. **Weak Collections for Memory Management**: Use WeakMap and WeakSet when dealing with temporary associations to prevent memory leaks.

4. **Avoid Converting to Arrays Unnecessarily**: Use native iteration methods when possible to avoid performance overhead.

---

## Conclusion

Understanding these collection types helps you write more efficient and maintainable JavaScript code. Choose the right collection based on your specific needs regarding garbage collection, iteration requirements, and data structure constraints.