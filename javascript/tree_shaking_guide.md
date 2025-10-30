# JavaScript Tree Shaking

## What is Tree Shaking?

Tree shaking is a dead code elimination technique used in modern JavaScript bundlers (like Webpack, Rollup, and Vite) to remove unused code from your final bundle. The term comes from the mental model of shaking a tree to remove dead leaves.

The primary goal is to reduce bundle size by eliminating code that is exported but never imported or used in your application.

## How Tree Shaking Works

Tree shaking relies on the static structure of ES6 module syntax (import/export). Unlike CommonJS modules (require/module.exports), ES6 modules are statically analyzable, meaning bundlers can determine what's used and what's not at build time.

### Key Requirements

1. **ES6 Modules**: Use `import` and `export` statements
2. **Static Imports**: Avoid dynamic imports for tree shaking
3. **Production Build**: Most bundlers only tree shake in production mode
4. **Side-Effect Free Code**: Mark code as side-effect free in package.json

## Example: Before Tree Shaking

### utils.js
```javascript
// Multiple utility functions exported
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

export function divide(a, b) {
  return a / b;
}

export function power(a, b) {
  return Math.pow(a, b);
}
```

### main.js
```javascript
// Only importing what we need
import { add, multiply } from './utils.js';

console.log(add(5, 3));        // 8
console.log(multiply(4, 2));   // 8
```

### Result
Without tree shaking, the final bundle would include ALL functions from utils.js (add, subtract, multiply, divide, power).

With tree shaking, the final bundle only includes `add` and `multiply` functions, eliminating `subtract`, `divide`, and `power`.

## Example: Named vs Default Exports

### Named Exports (Better for Tree Shaking)
```javascript
// math.js
export const PI = 3.14159;
export const E = 2.71828;

export function calculateCircleArea(radius) {
  return PI * radius * radius;
}

export function calculateCircumference(radius) {
  return 2 * PI * radius;
}
```

```javascript
// app.js
import { calculateCircleArea, PI } from './math.js';
// calculateCircumference and E will be tree shaken
console.log(calculateCircleArea(5));
```

### Default Exports (Harder to Tree Shake)
```javascript
// math.js
const math = {
  PI: 3.14159,
  E: 2.71828,
  calculateCircleArea(radius) {
    return this.PI * radius * radius;
  },
  calculateCircumference(radius) {
    return 2 * this.PI * radius;
  }
};

export default math;
```

```javascript
// app.js
import math from './math.js';
// The ENTIRE math object is imported
// Even if you only use math.calculateCircleArea()
console.log(math.calculateCircleArea(5));
```

## Real-World Example: Lodash

### Bad (No Tree Shaking)
```javascript
import _ from 'lodash';
// Entire lodash library (~70KB) is bundled
const result = _.uniq([1, 2, 2, 3, 4, 4]);
```

### Good (Tree Shaking Works)
```javascript
import uniq from 'lodash-es/uniq';
// Only the uniq function is bundled
const result = uniq([1, 2, 2, 3, 4, 4]);
```

### Better (Direct Named Import)
```javascript
import { uniq } from 'lodash-es';
// Tree shaking removes unused lodash functions
const result = uniq([1, 2, 2, 3, 4, 4]);
```

## Side Effects and package.json

Bundlers need to know if your code has side effects to safely tree shake it.

### Marking Your Package as Side-Effect Free
```json
{
  "name": "my-library",
  "version": "1.0.0",
  "sideEffects": false
}
```

### Specifying Files with Side Effects
```json
{
  "name": "my-library",
  "sideEffects": [
    "*.css",
    "*.scss",
    "src/polyfills.js"
  ]
}
```

## Common Tree Shaking Pitfalls

### 1. Side Effects in Code
```javascript
// This prevents tree shaking
export function logMessage(msg) {
  console.log(msg); // Side effect!
  return msg;
}

// Even if unused, this might not be tree shaken
```

### 2. CommonJS Syntax
```javascript
// Tree shaking DOES NOT work with CommonJS
const utils = require('./utils');
module.exports = { myFunction };
```

### 3. Importing Entire Modules
```javascript
// Bad - imports everything
import * as utils from './utils';
utils.add(1, 2);

// Good - imports only what's needed
import { add } from './utils';
add(1, 2);
```

### 4. Using Getters or Dynamic Property Access
```javascript
export const config = {
  get apiUrl() {
    return process.env.API_URL;
  }
};
// Getters are considered side effects
```

## Webpack Configuration for Tree Shaking

```javascript
// webpack.config.js
module.exports = {
  mode: 'production', // Enables tree shaking
  optimization: {
    usedExports: true, // Mark unused exports
    minimize: true,    // Remove dead code
    sideEffects: true  // Respect sideEffects in package.json
  }
};
```

## Verifying Tree Shaking

### Using Webpack Bundle Analyzer
```bash
npm install --save-dev webpack-bundle-analyzer
```

```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};
```

### Checking Bundle Size
```bash
# Build and check size
npm run build
ls -lh dist/

# Or use bundlesize
npm install --save-dev bundlesize
```

## Best Practices

1. **Use ES6 modules exclusively** - Avoid mixing CommonJS and ES6 modules
2. **Import only what you need** - Use named imports instead of namespace imports
3. **Avoid side effects** - Keep functions pure when possible
4. **Configure package.json** - Set `sideEffects: false` when appropriate
5. **Use production mode** - Tree shaking is most effective in production builds
6. **Prefer named exports** - They're more tree-shakeable than default exports
7. **Check your bundle** - Use tools like webpack-bundle-analyzer to verify
8. **Update dependencies** - Use modern libraries that support tree shaking (e.g., lodash-es instead of lodash)

## Summary

Tree shaking is a powerful optimization technique that can significantly reduce your JavaScript bundle size. By understanding how it works and following best practices, you can ensure your applications ship only the code they actually use, resulting in faster load times and better performance.

Key takeaways:
- Use ES6 module syntax (import/export)
- Import only what you need
- Mark packages as side-effect free when appropriate
- Build in production mode
- Verify your bundles are actually being optimized