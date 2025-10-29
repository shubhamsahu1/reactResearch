# JavaScript Modules

## Table of Contents
1. [Introduction](#introduction)
2. [Benefits of Modules](#benefits-of-modules)
3. [Module Syntax](#module-syntax)
4. [Named Exports and Imports](#named-exports-and-imports)
5. [Default Exports and Imports](#default-exports-and-imports)
6. [Mixing Named and Default](#mixing-named-and-default)
7. [Dynamic Imports](#dynamic-imports)
8. [Best Practices](#best-practices)

---

## Introduction

Modules are reusable pieces of code that can be exported from one program and imported for use in another program. They help organize code into separate files, making it more maintainable, testable, and easier to understand.

Before ES6 modules, JavaScript relied on various module systems like CommonJS (Node.js) and AMD. ES6 introduced a standardized module system that works natively in browsers and Node.js.

---

## Benefits of Modules

### Encapsulation
Keep code private by default, expose only what's necessary. This prevents accidental modifications of internal implementation details.

### Reusability
Write once, use in multiple places. Modules can be imported wherever needed without code duplication.

### Maintainability
Easier to find and fix bugs in smaller, focused files. Each module has a single responsibility.

### Namespace Management
Avoid global scope pollution. Module scope is separate from global scope, preventing naming conflicts.

### Dependency Management
Explicit imports make dependencies clear and trackable, improving code understanding.

---

## Module Syntax

### Basic Structure

Every JavaScript file can be a module. By default, everything declared in a module is local to that module unless explicitly exported.

```javascript
// myModule.js
const privateVariable = "I'm private";

function privateFunction() {
  console.log("This is private");
}

// Only exported items are accessible from outside
export const publicVariable = "I'm public";

export function publicFunction() {
  console.log("This is public");
}
```

---

## Named Exports and Imports

### Named Exports

Named exports allow you to export multiple values from a single module. Each export has a specific name.

#### Inline Named Exports

```javascript
// math.js
export const PI = 3.14159;
export const E = 2.71828;

export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export class Calculator {
  constructor() {
    this.result = 0;
  }
  
  add(n) {
    this.result += n;
    return this;
  }
  
  getResult() {
    return this.result;
  }
}
```

#### Export List Syntax

```javascript
// utils.js
function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
}

const MAX_VALUE = 1000;
const MIN_VALUE = 0;

// Export multiple items at once
export { multiply, divide, MAX_VALUE, MIN_VALUE };
```

#### Export with Aliases

```javascript
// strings.js
function internalToUpperCase(str) {
  return str.toUpperCase();
}

function internalToLowerCase(str) {
  return str.toLowerCase();
}

// Export with different names
export { 
  internalToUpperCase as toUpper, 
  internalToLowerCase as toLower 
};
```

### Named Imports

#### Import Specific Items

```javascript
// main.js
import { add, subtract, PI } from './math.js';

console.log(add(5, 3));        // 8
console.log(subtract(10, 4));  // 6
console.log(PI);               // 3.14159
```

#### Import with Aliases

```javascript
// app.js
import { multiply as mult, divide as div } from './utils.js';

console.log(mult(4, 5));  // 20
console.log(div(20, 4));  // 5
```

#### Import All as Namespace

```javascript
// calculator.js
import * as MathUtils from './math.js';

console.log(MathUtils.add(2, 3));      // 5
console.log(MathUtils.PI);             // 3.14159

const calc = new MathUtils.Calculator();
console.log(calc.add(10).add(5).getResult()); // 15
```

#### Import Multiple Items

```javascript
// index.js
import { 
  add, 
  subtract, 
  multiply as mult, 
  divide as div,
  PI,
  E 
} from './math.js';

console.log(add(PI, E)); // 5.85987
```

---

## Default Exports and Imports

### Default Exports

Each module can have **one** default export. Default exports are useful when a module primarily exports a single value, class, or function.

#### Inline Default Export

```javascript
// User.js
export default class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  getInfo() {
    return `${this.name} (${this.email})`;
  }
}
```

#### Separate Default Export

```javascript
// logger.js
class Logger {
  log(message) {
    console.log(`[LOG]: ${message}`);
  }
  
  error(message) {
    console.error(`[ERROR]: ${message}`);
  }
  
  warn(message) {
    console.warn(`[WARN]: ${message}`);
  }
}

export default Logger;
```

#### Default Export with Expression

```javascript
// config.js
export default {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3
};
```

#### Default Function Export

```javascript
// greet.js
export default function greet(name) {
  return `Hello, ${name}!`;
}
```

### Default Imports

When importing a default export, you can name it whatever you want.

```javascript
// app.js
import User from './User.js';
import Logger from './logger.js';
import config from './config.js';
import greet from './greet.js';

const user = new User('John', 'john@example.com');
const logger = new Logger();

logger.log(user.getInfo());
logger.log(greet(user.name));
console.log(config.apiUrl);
```

#### Import Default with Different Name

```javascript
// You can name the default import anything
import MyUser from './User.js';
import MyLogger from './logger.js';

const user = new MyUser('Alice', 'alice@example.com');
```

---

## Mixing Named and Default

A module can have both a default export and named exports.

### Example 1: Class with Constants

```javascript
// user.js
export default class User {
  constructor(name, role) {
    this.name = name;
    this.role = role;
  }
  
  hasRole(role) {
    return this.role === role;
  }
}

export const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
  GUEST: 'guest'
};

export function isAdmin(user) {
  return user.hasRole(USER_ROLES.ADMIN);
}

export function isGuest(user) {
  return user.hasRole(USER_ROLES.GUEST);
}
```

#### Importing Mixed Exports

```javascript
// app.js
import User, { USER_ROLES, isAdmin, isGuest } from './user.js';

const admin = new User('Alice', USER_ROLES.ADMIN);
const guest = new User('Bob', USER_ROLES.GUEST);

console.log(isAdmin(admin));  // true
console.log(isGuest(guest));  // true
```

### Example 2: API Module

```javascript
// api.js
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  
  async get(endpoint) {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  }
  
  async post(endpoint, data) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

export default ApiClient;

export const API_ENDPOINTS = {
  USERS: '/users',
  POSTS: '/posts',
  COMMENTS: '/comments'
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404
};
```

---

## Dynamic Imports

Dynamic imports allow you to load modules on demand at runtime, rather than at the beginning of the file. This is useful for code splitting, lazy loading, and conditional module loading.

### Basic Dynamic Import

```javascript
// Dynamic import returns a Promise
import('./module.js')
  .then(module => {
    module.doSomething();
  })
  .catch(error => {
    console.error('Failed to load module:', error);
  });
```

### With Async/Await

```javascript
async function loadModule() {
  try {
    const module = await import('./module.js');
    module.initialize();
    return module;
  } catch (error) {
    console.error('Module loading failed:', error);
    return null;
  }
}

loadModule();
```

### Conditional Loading

```javascript
// Load different modules based on condition
async function loadFeature(featureName) {
  if (featureName === 'charts') {
    const chartsModule = await import('./charts.js');
    return chartsModule.default;
  } else if (featureName === 'maps') {
    const mapsModule = await import('./maps.js');
    return mapsModule.default;
  }
}
```

### Lazy Loading Components

```javascript
// Load heavy component only when needed
async function showDashboard() {
  const loadingElement = document.getElementById('loading');
  loadingElement.style.display = 'block';
  
  try {
    const dashboardModule = await import('./dashboard.js');
    const Dashboard = dashboardModule.default;
    
    const dashboard = new Dashboard();
    dashboard.render();
  } catch (error) {
    console.error('Failed to load dashboard:', error);
  } finally {
    loadingElement.style.display = 'none';
  }
}

// Trigger on button click
document.getElementById('dashboardBtn').addEventListener('click', showDashboard);
```

### Dynamic Import with Named Exports

```javascript
async function calculate() {
  const math = await import('./math.js');
  
  // Access named exports
  console.log(math.add(5, 3));
  console.log(math.PI);
  
  // Or destructure
  const { add, subtract, PI } = await import('./math.js');
  console.log(add(10, 5));
}
```

### Route-Based Code Splitting

```javascript
// Simple router with dynamic imports
async function navigate(route) {
  switch (route) {
    case '/home':
      const homeModule = await import('./pages/home.js');
      homeModule.default.render();
      break;
      
    case '/about':
      const aboutModule = await import('./pages/about.js');
      aboutModule.default.render();
      break;
      
    case '/contact':
      const contactModule = await import('./pages/contact.js');
      contactModule.default.render();
      break;
      
    default:
      const notFoundModule = await import('./pages/404.js');
      notFoundModule.default.render();
  }
}
```

### Performance Optimization with Preloading

```javascript
// Preload a module without executing it
const modulePromise = import('./heavyModule.js');

// Later, when needed
async function useModule() {
  const module = await modulePromise;
  module.execute();
}

// Or use link preload in HTML
// <link rel="modulepreload" href="./heavyModule.js">
```

---

## Best Practices

### 1. Use Named Exports for Multiple Values

```javascript
// Good: Named exports for utilities
export function formatDate(date) { }
export function parseDate(str) { }
export function isValidDate(date) { }
```

### 2. Use Default Export for Main Class/Function

```javascript
// Good: Default export for primary export
export default class UserService {
  // Main service class
}

export const USER_EVENTS = { }; // Named export for related constants
```

### 3. One Module, One Purpose

```javascript
// Good: Focused module
// user-validator.js
export function validateEmail(email) { }
export function validatePassword(password) { }
export function validateUsername(username) { }

// Bad: Mixing unrelated functionality
// utils.js (too generic, mixing concerns)
export function validateEmail(email) { }
export function fetchData(url) { }
export function formatCurrency(amount) { }
```

### 4. Avoid Default Export for Utilities

```javascript
// Bad: Default export for multiple utilities
export default {
  add(a, b) { return a + b; },
  subtract(a, b) { return a - b; }
};

// Good: Named exports
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
```

### 5. Keep Imports at the Top

```javascript
// Good: All imports at the top
import React from 'react';
import { useState, useEffect } from 'react';
import { formatDate } from './utils.js';

function MyComponent() {
  // Component code
}

// Bad: Imports scattered throughout
function MyComponent() {
  import { something } from './module.js'; // Syntax error
}
```

### 6. Use Absolute Paths for Better Clarity

```javascript
// With module resolution configuration
import { Button } from '@/components/Button';
import { formatDate } from '@/utils/date';

// Instead of relative paths
import { Button } from '../../../components/Button';
```

### 7. Avoid Circular Dependencies

```javascript
// Bad: Circular dependency
// a.js
import { b } from './b.js';
export const a = 'a';

// b.js
import { a } from './a.js'; // Circular!
export const b = 'b';

// Good: Extract shared code to third module
// shared.js
export const shared = 'shared';

// a.js
import { shared } from './shared.js';
export const a = 'a';

// b.js
import { shared } from './shared.js';
export const b = 'b';
```

### 8. Use Barrel Exports for Cleaner Imports

```javascript
// components/index.js (barrel file)
export { Button } from './Button.js';
export { Input } from './Input.js';
export { Modal } from './Modal.js';

// Usage
import { Button, Input, Modal } from './components';

// Instead of
import { Button } from './components/Button.js';
import { Input } from './components/Input.js';
import { Modal } from './components/Modal.js';
```

### 9. Tree Shaking Considerations

```javascript
// Good: Named exports enable tree shaking
export function usedFunction() { }
export function unusedFunction() { } // Will be removed in production

// Bad: Default object export prevents tree shaking
export default {
  usedFunction() { },
  unusedFunction() { } // Both will be included
};
```

### 10. Document Your Module API

```javascript
/**
 * User authentication module
 * @module auth
 */

/**
 * Authenticates a user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<User>} Authenticated user object
 */
export async function login(email, password) {
  // Implementation
}

/**
 * Logs out the current user
 * @returns {Promise<void>}
 */
export async function logout() {
  // Implementation
}
```

---

## Summary

JavaScript modules provide a powerful way to organize and structure code:

- **Named exports** are ideal for multiple values and utility functions
- **Default exports** work best for single primary values or classes
- **Dynamic imports** enable code splitting and lazy loading
- **Best practices** include single responsibility, avoiding circular dependencies, and clear API design

Modules are essential for building maintainable, scalable JavaScript applications in both browser and Node.js environments.