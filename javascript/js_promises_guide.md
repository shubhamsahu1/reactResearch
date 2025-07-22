# JavaScript Promises: A Complete Guide

## What is a Promise?

A Promise is a JavaScript object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value. It's a way to handle asynchronous code more elegantly than traditional callback functions.

A Promise can be in one of three states:
- **Pending**: Initial state, neither fulfilled nor rejected
- **Fulfilled**: Operation completed successfully
- **Rejected**: Operation failed

## Creating a Promise

```javascript
const myPromise = new Promise((resolve, reject) => {
  // Asynchronous operation
  const success = true;
  
  if (success) {
    resolve("Operation successful!");
  } else {
    reject("Operation failed!");
  }
});
```

## Promise Methods

### 1. `.then()`

Executes when the promise is fulfilled. It takes up to two arguments: callback functions for success and failure cases.

```javascript
const fetchData = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Data fetched successfully!");
  }, 2000);
});

fetchData
  .then(result => {
    console.log(result); // "Data fetched successfully!"
    return "Processed data";
  })
  .then(processedResult => {
    console.log(processedResult); // "Processed data"
  });
```

### 2. `.catch()`

Handles rejected promises or errors thrown in the promise chain.

```javascript
const riskyOperation = new Promise((resolve, reject) => {
  const random = Math.random();
  
  if (random > 0.5) {
    resolve("Success!");
  } else {
    reject("Something went wrong!");
  }
});

riskyOperation
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error("Error:", error);
  });
```

### 3. `.finally()`

Executes regardless of whether the promise is fulfilled or rejected. Useful for cleanup operations.

```javascript
const apiCall = fetch('https://jsonplaceholder.typicode.com/posts/1');

apiCall
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error))
  .finally(() => {
    console.log('API call completed');
    // Cleanup code here
  });
```

## Static Promise Methods

### 1. `Promise.resolve()`

Creates a resolved promise with a given value.

```javascript
const resolvedPromise = Promise.resolve("Immediate success!");

resolvedPromise.then(value => {
  console.log(value); // "Immediate success!"
});

// Useful for converting non-promise values to promises
const convertToPromise = (value) => {
  return Promise.resolve(value);
};
```

### 2. `Promise.reject()`

Creates a rejected promise with a given reason.

```javascript
const rejectedPromise = Promise.reject("Immediate failure!");

rejectedPromise.catch(error => {
  console.error(error); // "Immediate failure!"
});
```

### 3. `Promise.all()`

Waits for all promises to resolve. If any promise rejects, the entire `Promise.all()` rejects.

```javascript
const promise1 = Promise.resolve(10);
const promise2 = Promise.resolve(20);
const promise3 = Promise.resolve(30);

Promise.all([promise1, promise2, promise3])
  .then(results => {
    console.log(results); // [10, 20, 30]
    const sum = results.reduce((acc, val) => acc + val, 0);
    console.log("Sum:", sum); // Sum: 60
  })
  .catch(error => {
    console.error("One or more promises failed:", error);
  });

// Example with API calls
const fetchUser = fetch('https://jsonplaceholder.typicode.com/users/1');
const fetchPosts = fetch('https://jsonplaceholder.typicode.com/posts');

Promise.all([fetchUser, fetchPosts])
  .then(responses => Promise.all(responses.map(r => r.json())))
  .then(([user, posts]) => {
    console.log("User:", user);
    console.log("Posts count:", posts.length);
  });
```

### 4. `Promise.allSettled()`

Waits for all promises to settle (either resolve or reject), returning results for all.

```javascript
const promises = [
  Promise.resolve("Success 1"),
  Promise.reject("Error 1"),
  Promise.resolve("Success 2"),
  Promise.reject("Error 2")
];

Promise.allSettled(promises)
  .then(results => {
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`Promise ${index + 1} succeeded:`, result.value);
      } else {
        console.log(`Promise ${index + 1} failed:`, result.reason);
      }
    });
  });
```

### 5. `Promise.race()`

Returns the first promise that settles (either resolves or rejects).

```javascript
const slowPromise = new Promise(resolve => {
  setTimeout(() => resolve("Slow result"), 3000);
});

const fastPromise = new Promise(resolve => {
  setTimeout(() => resolve("Fast result"), 1000);
});

Promise.race([slowPromise, fastPromise])
  .then(result => {
    console.log(result); // "Fast result"
  });

// Practical example: Timeout implementation
const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => reject("Request timeout"), 5000);
});

const apiRequest = fetch('https://jsonplaceholder.typicode.com/posts/1');

Promise.race([apiRequest, timeoutPromise])
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 6. `Promise.any()`

Returns the first fulfilled promise. If all promises reject, it returns an AggregateError.

```javascript
const promises = [
  Promise.reject("Error 1"),
  Promise.resolve("Success!"),
  Promise.reject("Error 2")
];

Promise.any(promises)
  .then(result => {
    console.log(result); // "Success!"
  })
  .catch(error => {
    console.error("All promises rejected:", error);
  });
```

## Practical Examples

### 1. Chaining Promises

```javascript
function fetchUserData(userId) {
  return fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('User not found');
      }
      return response.json();
    })
    .then(user => {
      console.log('User:', user.name);
      return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
    })
    .then(response => response.json())
    .then(posts => {
      console.log(`User has ${posts.length} posts`);
      return posts;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

fetchUserData(1);
```

### 2. Promise with Error Handling

```javascript
function divideNumbers(a, b) {
  return new Promise((resolve, reject) => {
    if (b === 0) {
      reject(new Error("Division by zero is not allowed"));
    } else {
      resolve(a / b);
    }
  });
}

divideNumbers(10, 2)
  .then(result => console.log("Result:", result)) // Result: 5
  .catch(error => console.error("Error:", error.message));

divideNumbers(10, 0)
  .then(result => console.log("Result:", result))
  .catch(error => console.error("Error:", error.message)); // Error: Division by zero is not allowed
```

### 3. Converting Callback to Promise

```javascript
// Traditional callback function
function readFileCallback(filename, callback) {
  setTimeout(() => {
    if (filename === 'valid.txt') {
      callback(null, 'File content here');
    } else {
      callback(new Error('File not found'), null);
    }
  }, 1000);
}

// Promise wrapper
function readFilePromise(filename) {
  return new Promise((resolve, reject) => {
    readFileCallback(filename, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

// Usage
readFilePromise('valid.txt')
  .then(content => console.log('File content:', content))
  .catch(error => console.error('Error:', error.message));
```

## Async/Await vs Promises

While Promises are powerful, async/await provides a more readable syntax:

```javascript
// Using Promises
function fetchDataWithPromises() {
  return fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(response => response.json())
    .then(data => {
      console.log('Title:', data.title);
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

// Using async/await
async function fetchDataWithAsync() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    const data = await response.json();
    console.log('Title:', data.title);
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

## Best Practices

1. **Always handle errors**: Use `.catch()` or try/catch with async/await
2. **Chain promises properly**: Return promises from `.then()` handlers
3. **Use `Promise.all()` for parallel operations**: When you need multiple independent async operations
4. **Prefer async/await for readability**: Especially for complex promise chains
5. **Don't mix callbacks and promises**: Choose one approach and stick with it
6. **Handle promise rejections**: Unhandled promise rejections can crash your application

## Common Pitfalls

```javascript
// ❌ Wrong: Not returning promise in chain
promise
  .then(result => {
    fetch('/api/data'); // Missing return!
  })
  .then(response => {
    // response will be undefined
  });

// ✅ Correct: Return promise
promise
  .then(result => {
    return fetch('/api/data');
  })
  .then(response => {
    // response is the fetch response
  });

// ❌ Wrong: Creating unnecessary promise
function getData() {
  return new Promise((resolve, reject) => {
    fetch('/api/data')
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}

// ✅ Correct: Return existing promise
function getData() {
  return fetch('/api/data');
}
```

Understanding Promises is crucial for modern JavaScript development, as they form the foundation for async/await and are used extensively in APIs, file operations, network requests, and many other asynchronous operations.