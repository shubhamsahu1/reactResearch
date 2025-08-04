# JavaScript Recursion Problems Collection

## Problem 1: Fibonacci with Memoization

### Problem Statement
Calculate the nth Fibonacci number using recursion. Optimize it with memoization to avoid redundant calculations.

**Example:**
- Input: `n = 10`
- Output: `55`
- Sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55

### Solution

```javascript
// Naive recursion (exponential time complexity)
function fibonacciNaive(n) {
    if (n <= 1) return n;
    return fibonacciNaive(n - 1) + fibonacciNaive(n - 2);
}

// Optimized with memoization
function fibonacci(n, memo = {}) {
    if (n in memo) return memo[n];
    if (n <= 1) return n;
    
    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
    return memo[n];
}

// Alternative: Using closure for memoization
function createFibonacci() {
    const cache = {};
    
    function fib(n) {
        if (n in cache) return cache[n];
        if (n <= 1) return n;
        
        cache[n] = fib(n - 1) + fib(n - 2);
        return cache[n];
    }
    
    return fib;
}

// Test
console.log(fibonacci(10)); // 55
console.log(fibonacci(20)); // 6765

const fib = createFibonacci();
console.log(fib(30)); // 832040
```

---

## Problem 2: Binary Tree Traversals

### Problem Statement
Implement recursive traversals for a binary tree: preorder, inorder, and postorder.

**Tree Structure:**
```
    1
   / \
  2   3
 / \
4   5
```

### Solution

```javascript
class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

// Preorder: Root -> Left -> Right
function preorderTraversal(root, result = []) {
    if (root === null) return result;
    
    result.push(root.val);
    preorderTraversal(root.left, result);
    preorderTraversal(root.right, result);
    
    return result;
}

// Inorder: Left -> Root -> Right
function inorderTraversal(root, result = []) {
    if (root === null) return result;
    
    inorderTraversal(root.left, result);
    result.push(root.val);
    inorderTraversal(root.right, result);
    
    return result;
}

// Postorder: Left -> Right -> Root
function postorderTraversal(root, result = []) {
    if (root === null) return result;
    
    postorderTraversal(root.left, result);
    postorderTraversal(root.right, result);
    result.push(root.val);
    
    return result;
}

// Test
const root = new TreeNode(1,
    new TreeNode(2, new TreeNode(4), new TreeNode(5)),
    new TreeNode(3)
);

console.log(preorderTraversal(root));  // [1, 2, 4, 5, 3]
console.log(inorderTraversal(root));   // [4, 2, 5, 1, 3]
console.log(postorderTraversal(root)); // [4, 5, 2, 3, 1]
```

---

## Problem 3: Generate All Permutations

### Problem Statement
Given an array of distinct integers, return all possible permutations using recursion and backtracking.

**Example:**
- Input: `[1, 2, 3]`
- Output: `[[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]`

### Solution

```javascript
function permute(nums) {
    const result = [];
    
    function backtrack(currentPermutation, remaining) {
        // Base case: no more elements to add
        if (remaining.length === 0) {
            result.push([...currentPermutation]);
            return;
        }
        
        // Try each remaining element
        for (let i = 0; i < remaining.length; i++) {
            const element = remaining[i];
            const newRemaining = remaining.filter((_, index) => index !== i);
            
            // Choose
            currentPermutation.push(element);
            
            // Explore
            backtrack(currentPermutation, newRemaining);
            
            // Unchoose (backtrack)
            currentPermutation.pop();
        }
    }
    
    backtrack([], nums);
    return result;
}

// Alternative implementation using indices
function permuteIndices(nums) {
    const result = [];
    
    function backtrack(path) {
        if (path.length === nums.length) {
            result.push(path.map(i => nums[i]));
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (path.includes(i)) continue;
            
            path.push(i);
            backtrack(path);
            path.pop();
        }
    }
    
    backtrack([]);
    return result;
}

// Test
console.log(permute([1, 2, 3]));
// [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
```

---

## Problem 4: Power Function

### Problem Statement
Implement a function to calculate x^n using recursion. Optimize it using the "fast exponentiation" technique.

**Example:**
- Input: `x = 2, n = 10`
- Output: `1024`

### Solution

```javascript
// Naive approach - O(n) time
function powerNaive(x, n) {
    if (n === 0) return 1;
    if (n < 0) return 1 / powerNaive(x, -n);
    
    return x * powerNaive(x, n - 1);
}

// Optimized approach - O(log n) time
function power(x, n) {
    if (n === 0) return 1;
    if (n < 0) return 1 / power(x, -n);
    
    // If n is even: x^n = (x^(n/2))^2
    // If n is odd: x^n = x * x^(n-1)
    if (n % 2 === 0) {
        const half = power(x, n / 2);
        return half * half;
    } else {
        return x * power(x, n - 1);
    }
}

// Alternative optimized version
function powerFast(x, n) {
    function helper(x, n) {
        if (n === 0) return 1;
        if (n === 1) return x;
        
        if (n % 2 === 0) {
            const half = helper(x, n / 2);
            return half * half;
        } else {
            return x * helper(x, n - 1);
        }
    }
    
    if (n < 0) {
        return 1 / helper(x, -n);
    }
    return helper(x, n);
}

// Test
console.log(power(2, 10)); // 1024
console.log(power(3, 4));  // 81
console.log(power(2, -3)); // 0.125
```

---

## Problem 5: Flatten Nested Array

### Problem Statement
Given a nested array with arbitrary depth, flatten it into a single-level array using recursion.

**Example:**
- Input: `[1, [2, 3], [4, [5, 6]], 7]`
- Output: `[1, 2, 3, 4, 5, 6, 7]`

### Solution

```javascript
function flattenArray(arr) {
    const result = [];
    
    function flatten(element) {
        if (Array.isArray(element)) {
            // Recursively flatten each element in the array
            for (let item of element) {
                flatten(item);
            }
        } else {
            // Base case: add non-array element to result
            result.push(element);
        }
    }
    
    flatten(arr);
    return result;
}

// Alternative: Return new array without modifying external state
function flattenArrayPure(arr) {
    if (!Array.isArray(arr)) return [arr];
    
    let result = [];
    for (let element of arr) {
        result = result.concat(flattenArrayPure(element));
    }
    return result;
}

// Using reduce for more functional approach
function flattenArrayReduce(arr) {
    if (!Array.isArray(arr)) return [arr];
    
    return arr.reduce((acc, element) => {
        return acc.concat(flattenArrayReduce(element));
    }, []);
}

// Test
const nested = [1, [2, 3], [4, [5, 6]], 7];
console.log(flattenArray(nested)); // [1, 2, 3, 4, 5, 6, 7]

const deepNested = [1, [2, [3, [4, [5]]]]];
console.log(flattenArrayPure(deepNested)); // [1, 2, 3, 4, 5]
```

---

## Problem 6: Generate All Subsets (Power Set)

### Problem Statement
Given a set of unique integers, return all possible subsets (the power set) using recursion.

**Example:**
- Input: `[1, 2, 3]`
- Output: `[[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]`

### Solution

```javascript
function subsets(nums) {
    const result = [];
    
    function backtrack(index, currentSubset) {
        // Base case: we've considered all elements
        if (index === nums.length) {
            result.push([...currentSubset]);
            return;
        }
        
        // Choice 1: Don't include current element
        backtrack(index + 1, currentSubset);
        
        // Choice 2: Include current element
        currentSubset.push(nums[index]);
        backtrack(index + 1, currentSubset);
        currentSubset.pop(); // backtrack
    }
    
    backtrack(0, []);
    return result;
}

// Alternative: More explicit inclusion/exclusion
function subsetsExplicit(nums) {
    if (nums.length === 0) return [[]];
    
    const firstElement = nums[0];
    const restElements = nums.slice(1);
    
    // Get all subsets without the first element
    const subsetsWithoutFirst = subsetsExplicit(restElements);
    
    // Get all subsets with the first element
    const subsetsWithFirst = subsetsWithoutFirst.map(subset => 
        [firstElement, ...subset]
    );
    
    // Combine both
    return [...subsetsWithoutFirst, ...subsetsWithFirst];
}

// Using bit manipulation concept recursively
function subsetsBinary(nums, index = 0, current = [], result = []) {
    if (index === nums.length) {
        result.push([...current]);
        return result;
    }
    
    // Don't include current element
    subsetsBinary(nums, index + 1, current, result);
    
    // Include current element
    current.push(nums[index]);
    subsetsBinary(nums, index + 1, current, result);
    current.pop();
    
    return result;
}

// Test
console.log(subsets([1, 2, 3]));
// [[], [3], [2], [2,3], [1], [1,3], [1,2], [1,2,3]]
```

---

## Problem 7: Tower of Hanoi

### Problem Statement
Solve the classic Tower of Hanoi problem: move n disks from source rod to destination rod using an auxiliary rod, following the rules that larger disks cannot be placed on smaller ones.

**Example:**
- Input: `n = 3, source = 'A', destination = 'C', auxiliary = 'B'`
- Output: Sequence of moves to solve the puzzle

### Solution

```javascript
function towerOfHanoi(n, source, destination, auxiliary) {
    const moves = [];
    
    function hanoi(n, from, to, aux) {
        if (n === 1) {
            // Base case: move single disk
            moves.push(`Move disk 1 from ${from} to ${to}`);
            return;
        }
        
        // Step 1: Move n-1 disks from source to auxiliary
        hanoi(n - 1, from, aux, to);
        
        // Step 2: Move the largest disk from source to destination
        moves.push(`Move disk ${n} from ${from} to ${to}`);
        
        // Step 3: Move n-1 disks from auxiliary to destination
        hanoi(n - 1, aux, to, from);
    }
    
    hanoi(n, source, destination, auxiliary);
    return moves;
}

// Count minimum moves needed
function towerOfHanoiCount(n) {
    if (n === 1) return 1;
    return 2 * towerOfHanoiCount(n - 1) + 1;
}

// Mathematical formula: 2^n - 1
function towerOfHanoiCountFormula(n) {
    return Math.pow(2, n) - 1;
}

// Test
console.log(towerOfHanoi(3, 'A', 'C', 'B'));
/*
[
  "Move disk 1 from A to C",
  "Move disk 2 from A to B", 
  "Move disk 1 from C to B",
  "Move disk 3 from A to C",
  "Move disk 1 from B to A",
  "Move disk 2 from B to C",
  "Move disk 1 from A to C"
]
*/

console.log(towerOfHanoiCount(3)); // 7
console.log(towerOfHanoiCountFormula(4)); // 15
```

---

## Problem 8: Binary Search (Recursive)

### Problem Statement
Implement binary search using recursion to find a target value in a sorted array.

**Example:**
- Input: `arr = [1, 3, 5, 7, 9, 11], target = 7`
- Output: `3` (index of target)

### Solution

```javascript
function binarySearch(arr, target, left = 0, right = arr.length - 1) {
    // Base case: element not found
    if (left > right) return -1;
    
    const mid = Math.floor((left + right) / 2);
    
    // Base case: element found
    if (arr[mid] === target) return mid;
    
    // Recursive cases
    if (arr[mid] > target) {
        // Search in left half
        return binarySearch(arr, target, left, mid - 1);
    } else {
        // Search in right half
        return binarySearch(arr, target, mid + 1, right);
    }
}

// Alternative: Return boolean instead of index
function binarySearchExists(arr, target, left = 0, right = arr.length - 1) {
    if (left > right) return false;
    
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return true;
    
    return arr[mid] > target 
        ? binarySearchExists(arr, target, left, mid - 1)
        : binarySearchExists(arr, target, mid + 1, right);
}

// Find insertion point for target
function binarySearchInsertPosition(arr, target, left = 0, right = arr.length - 1) {
    if (left > right) return left;
    
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    
    if (arr[mid] > target) {
        return binarySearchInsertPosition(arr, target, left, mid - 1);
    } else {
        return binarySearchInsertPosition(arr, target, mid + 1, right);
    }
}

// Test
const sortedArr = [1, 3, 5, 7, 9, 11, 13];
console.log(binarySearch(sortedArr, 7));  // 3
console.log(binarySearch(sortedArr, 4));  // -1
console.log(binarySearchExists(sortedArr, 9));  // true
console.log(binarySearchInsertPosition(sortedArr, 6));  // 3
```

---

## Problem 9: JSON Path Finder

### Problem Statement
Given a nested JSON object and a target value, find all paths to that value using recursion.

**Example:**
```javascript
const obj = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 1,
      f: 3
    }
  },
  g: [1, 2, {h: 1}]
};
// Find all paths to value 1
// Output: ["a", "b.d.e", "g.0", "g.2.h"]
```

### Solution

```javascript
function findPaths(obj, target, currentPath = "", result = []) {
    if (obj === target) {
        result.push(currentPath || "root");
        return result;
    }
    
    if (obj === null || typeof obj !== "object") {
        return result;
    }
    
    if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
            const newPath = currentPath ? `${currentPath}.${index}` : `${index}`;
            findPaths(item, target, newPath, result);
        });
    } else {
        Object.keys(obj).forEach(key => {
            const newPath = currentPath ? `${currentPath}.${key}` : key;
            findPaths(obj[key], target, newPath, result);
        });
    }
    
    return result;
}

// Find path to first occurrence only
function findFirstPath(obj, target, currentPath = "") {
    if (obj === target) {
        return currentPath || "root";
    }
    
    if (obj === null || typeof obj !== "object") {
        return null;
    }
    
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            const newPath = currentPath ? `${currentPath}.${i}` : `${i}`;
            const result = findFirstPath(obj[i], target, newPath);
            if (result !== null) return result;
        }
    } else {
        for (let key of Object.keys(obj)) {
            const newPath = currentPath ? `${currentPath}.${key}` : key;
            const result = findFirstPath(obj[key], target, newPath);
            if (result !== null) return result;
        }
    }
    
    return null;
}

// Get value at specific path
function getValueAtPath(obj, path) {
    if (!path) return obj;
    
    const keys = path.split('.');
    
    function traverse(current, keyIndex) {
        if (keyIndex >= keys.length) return current;
        if (current === null || typeof current !== "object") return undefined;
        
        const key = keys[keyIndex];
        const nextValue = Array.isArray(current) ? current[parseInt(key)] : current[key];
        
        return traverse(nextValue, keyIndex + 1);
    }
    
    return traverse(obj, 0);
}

// Test
const testObj = {
    a: 1,
    b: {
        c: 2,
        d: {
            e: 1,
            f: 3
        }
    },
    g: [1, 2, {h: 1}]
};

console.log(findPaths(testObj, 1)); // ["a", "b.d.e", "g.0", "g.2.h"]
console.log(findFirstPath(testObj, 1)); // "a"
console.log(getValueAtPath(testObj, "b.d.e")); // 1
console.log(getValueAtPath(testObj, "g.2.h")); // 1
```

## Key Recursion Patterns

1. **Base Cases**: Always define clear stopping conditions
2. **Divide and Conquer**: Break problems into smaller subproblems (Binary Search, Power)
3. **Backtracking**: Make choices, explore, then undo (Permutations, Subsets)
4. **Tree Traversal**: Navigate hierarchical structures (Binary Trees, JSON)
5. **Memoization**: Cache results to avoid redundant calculations (Fibonacci)
6. **Tail Recursion**: Optimize recursive calls (some examples can be converted)

**Time & Space Complexity Considerations:**
- Recursive depth affects stack space
- Memoization trades space for time
- Some problems have both recursive and iterative solutions
- Understanding call stack is crucial for debugging

Each problem demonstrates different aspects of recursive thinking and problem decomposition!