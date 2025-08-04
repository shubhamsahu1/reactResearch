# JavaScript Search Algorithms with Detailed Explanations

## Problem 1: Binary Search Variations

### Explanation
Binary search is a divide-and-conquer algorithm that works on sorted arrays. It repeatedly divides the search interval in half, comparing the target with the middle element to eliminate half of the remaining elements.

**Key Concepts:**
- **Prerequisite**: Array must be sorted
- **Time Complexity**: O(log n) - eliminates half the elements each iteration
- **Space Complexity**: O(1) for iterative, O(log n) for recursive (due to call stack)
- **Core Idea**: If target equals middle element, found! If target is smaller, search left half; if larger, search right half

### Problem Statement
Implement various binary search algorithms for different scenarios.

**Scenarios:**
1. Find exact target in sorted array
2. Find first occurrence of target
3. Find last occurrence of target
4. Find insertion position
5. Search in rotated sorted array

### Solution

```javascript
// 1. Classic Binary Search
// Explanation: Standard binary search to find exact match
// When to use: When you need to find if an element exists and get its index
function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;
    
    while (left <= right) {
        // Use Math.floor to avoid integer overflow in other languages
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) return mid;
        else if (arr[mid] < target) left = mid + 1; // Search right half
        else right = mid - 1; // Search left half
    }
    
    return -1; // Element not found
}

// 2. Find First Occurrence
// Explanation: When array has duplicates, find the leftmost occurrence
// Key insight: Even after finding target, continue searching left to find first occurrence
function findFirst(arr, target) {
    let left = 0, right = arr.length - 1;
    let result = -1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            result = mid;
            right = mid - 1; // Continue searching left for first occurrence
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}

// 3. Find Last Occurrence
// Explanation: Find the rightmost occurrence of target in array with duplicates
// Key insight: After finding target, continue searching right to find last occurrence
function findLast(arr, target) {
    let left = 0, right = arr.length - 1;
    let result = -1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            result = mid;
            left = mid + 1; // Continue searching right for last occurrence
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}

// 4. Find Insertion Position
// Explanation: Find the index where target should be inserted to maintain sorted order
// Returns the leftmost position where target can be inserted
function searchInsert(arr, target) {
    let left = 0, right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    // When loop ends, left is the insertion position
    return left;
}

// 5. Search in Rotated Sorted Array
// Explanation: Array was sorted but rotated at some pivot point
// Key insight: At least one half of the array is always sorted
// Example: [4,5,6,7,0,1,2] - rotated version of [0,1,2,4,5,6,7]
function searchRotated(nums, target) {
    let left = 0, right = nums.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] === target) return mid;
        
        // Determine which half is sorted
        if (nums[left] <= nums[mid]) {
            // Left half is sorted
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1; // Target is in sorted left half
            } else {
                left = mid + 1; // Target is in right half
            }
        } else {
            // Right half is sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1; // Target is in sorted right half
            } else {
                right = mid - 1; // Target is in left half
            }
        }
    }
    
    return -1;
}

// Test
console.log(binarySearch([1, 3, 5, 7, 9], 5)); // 2
console.log(findFirst([1, 2, 2, 2, 3], 2)); // 1
console.log(findLast([1, 2, 2, 2, 3], 2)); // 3
console.log(searchInsert([1, 3, 5, 6], 4)); // 2
console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 0)); // 4
```

---

## Problem 2: Two Pointers Search

### Explanation
Two pointers technique uses two pointers moving toward each other or in the same direction to solve problems efficiently. It's particularly powerful for sorted arrays and can reduce time complexity from O(n²) to O(n).

**Key Concepts:**
- **Convergent Pointers**: Start from opposite ends, move toward center
- **Parallel Pointers**: Both move in same direction at different speeds
- **Time Complexity**: Usually O(n) instead of O(n²)
- **Prerequisites**: Often requires sorted data
- **Applications**: Pair finding, triplet problems, subarray problems

### Problem Statement
Use two pointers technique to solve various search problems efficiently.

### Solution

```javascript
// 1. Two Sum in Sorted Array
// Explanation: Find two numbers that add up to target in sorted array
// Why it works: If sum is too small, move left pointer right (increase sum)
//               If sum is too large, move right pointer left (decrease sum)
function twoSumSorted(numbers, target) {
    let left = 0, right = numbers.length - 1;
    
    while (left < right) {
        const sum = numbers[left] + numbers[right];
        
        if (sum === target) {
            return [left + 1, right + 1]; // 1-indexed as per problem requirement
        } else if (sum < target) {
            left++; // Need larger sum, move left pointer right
        } else {
            right--; // Need smaller sum, move right pointer left
        }
    }
    
    return []; // No solution found
}

// 2. Three Sum (find triplets that sum to zero)
// Explanation: Fix first element, then use two pointers for remaining two elements
// Time: O(n²) - O(n) for outer loop, O(n) for two pointers
// Space: O(1) excluding output array
function threeSum(nums) {
    nums.sort((a, b) => a - b); // Sort array first
    const result = [];
    
    for (let i = 0; i < nums.length - 2; i++) {
        // Skip duplicates for first number to avoid duplicate triplets
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        let left = i + 1, right = nums.length - 1;
        const target = -nums[i]; // We want nums[left] + nums[right] = -nums[i]
        
        while (left < right) {
            const sum = nums[left] + nums[right];
            
            if (sum === target) {
                result.push([nums[i], nums[left], nums[right]]);
                
                // Skip duplicates for second and third numbers
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                
                left++;
                right--;
            } else if (sum < target) {
                left++; // Need larger sum
            } else {
                right--; // Need smaller sum
            }
        }
    }
    
    return result;
}

// 3. Container With Most Water
// Explanation: Find two lines that form container with maximum water area
// Key insight: Always move the pointer with smaller height (bottleneck)
// Why: Moving the taller line can only decrease area since width decreases
function maxArea(height) {
    let left = 0, right = height.length - 1;
    let maxWater = 0;
    
    while (left < right) {
        const width = right - left;
        const currentHeight = Math.min(height[left], height[right]);
        const area = width * currentHeight;
        
        maxWater = Math.max(maxWater, area);
        
        // Move pointer with smaller height (bottleneck principle)
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxWater;
}

// 4. Remove Duplicates from Sorted Array
// Explanation: Use two pointers - read pointer scans array, write pointer places unique elements
// In-place algorithm: modify array without using extra space
function removeDuplicates(nums) {
    if (nums.length === 0) return 0;
    
    let writeIndex = 1; // Position to write next unique element
    
    for (let readIndex = 1; readIndex < nums.length; readIndex++) {
        // If current element is different from previous, it's unique
        if (nums[readIndex] !== nums[readIndex - 1]) {
            nums[writeIndex] = nums[readIndex];
            writeIndex++;
        }
    }
    
    return writeIndex; // New length of array with unique elements
}

// Test
console.log(twoSumSorted([2, 7, 11, 15], 9)); // [1, 2]
console.log(threeSum([-1, 0, 1, 2, -1, -4])); // [[-1, -1, 2], [-1, 0, 1]]
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49
```

---

## Problem 3: Depth-First Search (DFS) in Graphs

### Explanation
DFS explores a graph by going as deep as possible along each branch before backtracking. It uses a stack (either explicit or call stack for recursion) to keep track of vertices to visit.

**Key Concepts:**
- **Stack-based**: Uses LIFO (Last In, First Out) principle
- **Time Complexity**: O(V + E) where V = vertices, E = edges
- **Space Complexity**: O(V) for visited set and stack/recursion
- **Applications**: Topological sorting, cycle detection, connected components, maze solving
- **Traversal Order**: Goes deep first, then backtracks

### Problem Statement
Implement DFS to solve various graph problems.

### Solution

```javascript
class Graph {
    constructor() {
        this.adjacencyList = {};
    }
    
    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) {
            this.adjacencyList[vertex] = [];
        }
    }
    
    addEdge(vertex1, vertex2) {
        this.adjacencyList[vertex1].push(vertex2);
        this.adjacencyList[vertex2].push(vertex1);
    }
    
    // 1. DFS Traversal (Recursive)
    // Explanation: Uses call stack for recursion, naturally implements DFS
    // Good for: When recursion depth is manageable
    dfsRecursive(start, visited = new Set(), result = []) {
        visited.add(start);
        result.push(start);
        
        // Visit all unvisited neighbors
        for (let neighbor of this.adjacencyList[start]) {
            if (!visited.has(neighbor)) {
                this.dfsRecursive(neighbor, visited, result);
            }
        }
        
        return result;
    }
    
    // 2. DFS Traversal (Iterative)
    // Explanation: Uses explicit stack, avoids recursion depth issues
    // Good for: Deep graphs where recursion might cause stack overflow
    dfsIterative(start) {
        const stack = [start];
        const visited = new Set();
        const result = [];
        
        while (stack.length > 0) {
            const vertex = stack.pop(); // LIFO - Last In, First Out
            
            if (!visited.has(vertex)) {
                visited.add(vertex);
                result.push(vertex);
                
                // Add neighbors to stack (note: order affects traversal)
                for (let neighbor of this.adjacencyList[vertex]) {
                    if (!visited.has(neighbor)) {
                        stack.push(neighbor);
                    }
                }
            }
        }
        
        return result;
    }
    
    // 3. Find Connected Components
    // Explanation: Groups of vertices connected to each other
    // Application: Social network clustering, image segmentation
    findConnectedComponents() {
        const visited = new Set();
        const components = [];
        
        // Check each vertex to find separate components
        for (let vertex in this.adjacencyList) {
            if (!visited.has(vertex)) {
                const component = [];
                this.dfsComponent(vertex, visited, component);
                components.push(component);
            }
        }
        
        return components;
    }
    
    dfsComponent(vertex, visited, component) {
        visited.add(vertex);
        component.push(vertex);
        
        for (let neighbor of this.adjacencyList[vertex]) {
            if (!visited.has(neighbor)) {
                this.dfsComponent(neighbor, visited, component);
            }
        }
    }
    
    // 4. Detect Cycle in Undirected Graph
    // Explanation: If we visit a vertex that's already visited and it's not our parent, there's a cycle
    // Key insight: In undirected graph, back edge indicates cycle
    hasCycle() {
        const visited = new Set();
        
        // Check each component separately
        for (let vertex in this.adjacencyList) {
            if (!visited.has(vertex)) {
                if (this.dfsHasCycle(vertex, visited, null)) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    dfsHasCycle(vertex, visited, parent) {
        visited.add(vertex);
        
        for (let neighbor of this.adjacencyList[vertex]) {
            if (!visited.has(neighbor)) {
                // Recursively check neighbor
                if (this.dfsHasCycle(neighbor, visited, vertex)) {
                    return true;
                }
            } else if (neighbor !== parent) {
                // Found visited vertex that's not parent = back edge = cycle
                return true;
            }
        }
        
        return false;
    }
    
    // 5. Find Path Between Two Vertices
    // Explanation: DFS with backtracking to find path from start to end
    // Returns one possible path (not necessarily shortest)
    findPath(start, end, visited = new Set(), path = []) {
        visited.add(start);
        path.push(start);
        
        if (start === end) {
            return [...path]; // Return copy of path
        }
        
        for (let neighbor of this.adjacencyList[start]) {
            if (!visited.has(neighbor)) {
                const result = this.findPath(neighbor, end, visited, path);
                if (result) return result; // Path found
            }
        }
        
        // Backtrack: remove current vertex from path and visited
        path.pop();
        visited.delete(start);
        return null; // No path found
    }
}

// Test
const graph = new Graph();
['A', 'B', 'C', 'D', 'E', 'F'].forEach(v => graph.addVertex(v));
graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('B', 'D');
graph.addEdge('C', 'E');
graph.addEdge('D', 'E');
graph.addEdge('D', 'F');

console.log(graph.dfsRecursive('A')); // ['A', 'B', 'D', 'C', 'E', 'F']
console.log(graph.findConnectedComponents());
console.log(graph.hasCycle()); // true
console.log(graph.findPath('A', 'F')); // ['A', 'B', 'D', 'F']
```

---

## Problem 4: Breadth-First Search (BFS)

### Explanation
BFS explores a graph level by level, visiting all vertices at the current depth before moving to vertices at the next depth. It uses a queue (FIFO) to process vertices.

**Key Concepts:**
- **Queue-based**: Uses FIFO (First In, First Out) principle
- **Level-order**: Visits vertices level by level
- **Shortest Path**: Guarantees shortest path in unweighted graphs
- **Time Complexity**: O(V + E)
- **Space Complexity**: O(V) for queue and visited set
- **Applications**: Shortest path, level-order traversal, web crawling

### Problem Statement
Implement BFS for various scenarios including shortest path and level-order traversal.

### Solution

```javascript
// 1. BFS Graph Traversal
// Explanation: Visit all vertices level by level using queue
// Queue ensures we process vertices in order of their distance from start
function bfsGraph(graph, start) {
    const queue = [start];
    const visited = new Set([start]);
    const result = [];
    
    while (queue.length > 0) {
        const vertex = queue.shift(); // FIFO - First In, First Out
        result.push(vertex);
        
        // Add all unvisited neighbors to queue
        for (let neighbor of graph[vertex]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
    
    return result;
}

// 2. BFS Shortest Path (unweighted graph)
// Explanation: BFS guarantees shortest path in unweighted graphs
// Why: We explore all paths of length k before exploring paths of length k+1
function shortestPath(graph, start, end) {
    const queue = [[start, [start]]]; // [vertex, path_to_vertex]
    const visited = new Set([start]);
    
    while (queue.length > 0) {
        const [vertex, path] = queue.shift();
        
        if (vertex === end) {
            return path; // First path found is shortest
        }
        
        for (let neighbor of graph[vertex]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push([neighbor, [...path, neighbor]]);
            }
        }
    }
    
    return null; // No path found
}

// 3. BFS Level Order Traversal (Binary Tree)
// Explanation: Process tree level by level, useful for many tree problems
// Applications: Print levels, find level with maximum sum, etc.
class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function levelOrder(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length; // Important: capture size before loop
        const currentLevel = [];
        
        // Process all nodes at current level
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);
            
            // Add children for next level
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
    }
    
    return result;
}

// 4. BFS in 2D Grid (Find shortest path)
// Explanation: Treat grid as graph where each cell connects to adjacent cells
// Common in: Maze solving, game pathfinding, image processing
function shortestPathInGrid(grid, start, end) {
    const [rows, cols] = [grid.length, grid[0].length];
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;
    
    // 4-directional movement: up, down, left, right
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    const queue = [[startRow, startCol, 0]]; // [row, col, distance]
    const visited = new Set([`${startRow},${startCol}`]);
    
    while (queue.length > 0) {
        const [row, col, distance] = queue.shift();
        
        if (row === endRow && col === endCol) {
            return distance; // Shortest distance found
        }
        
        // Explore all 4 directions
        for (let [dRow, dCol] of directions) {
            const newRow = row + dRow;
            const newCol = col + dCol;
            const key = `${newRow},${newCol}`;
            
            // Check bounds, obstacles, and if already visited
            if (newRow >= 0 && newRow < rows && 
                newCol >= 0 && newCol < cols && 
                grid[newRow][newCol] === 0 && // 0 = empty, 1 = obstacle
                !visited.has(key)) {
                
                visited.add(key);
                queue.push([newRow, newCol, distance + 1]);
            }
        }
    }
    
    return -1; // No path found
}

// 5. Word Ladder (BFS for transformation)
// Explanation: Find shortest transformation sequence from beginWord to endWord
// Each transformation changes exactly one character
// Classic BFS application for finding shortest sequence
function ladderLength(beginWord, endWord, wordList) {
    const wordSet = new Set(wordList);
    if (!wordSet.has(endWord)) return 0;
    
    const queue = [[beginWord, 1]]; // [word, transformations]
    const visited = new Set([beginWord]);
    
    while (queue.length > 0) {
        const [word, level] = queue.shift();
        
        if (word === endWord) return level;
        
        // Try changing each character to every possible letter
        for (let i = 0; i < word.length; i++) {
            for (let c = 'a'.charCodeAt(0); c <= 'z'.charCodeAt(0); c++) {
                const char = String.fromCharCode(c);
                const newWord = word.slice(0, i) + char + word.slice(i + 1);
                
                if (wordSet.has(newWord) && !visited.has(newWord)) {
                    visited.add(newWord);
                    queue.push([newWord, level + 1]);
                }
            }
        }
    }
    
    return 0; // No transformation possible
}

// Test
const graphExample = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'E'],
    'D': ['B', 'E'],
    'E': ['C', 'D']
};

console.log(bfsGraph(graphExample, 'A')); // ['A', 'B', 'C', 'D', 'E']
console.log(shortestPath(graphExample, 'A', 'E')); // ['A', 'C', 'E']

const grid = [
    [0, 0, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 1],
    [0, 1, 0, 0]
];
console.log(shortestPathInGrid(grid, [0, 0], [3, 3])); // 6
```

---

## Problem 5: Advanced Search Patterns

### Explanation
Advanced search algorithms are optimizations or specialized techniques for specific scenarios. They often improve upon basic linear or binary search for particular data distributions or requirements.

### Solution

```javascript
// 1. Interpolation Search
// Explanation: Improvement over binary search for uniformly distributed data
// Key insight: Instead of always checking middle, estimate position based on value
// Time: O(log log n) for uniform data, O(n) worst case
// When to use: Large sorted arrays with uniformly distributed values
function interpolationSearch(arr, target) {
    let low = 0, high = arr.length - 1;
    
    while (low <= high && target >= arr[low] && target <= arr[high]) {
        if (low === high) {
            return arr[low] === target ? low : -1;
        }
        
        // Interpolation formula: estimate position based on value distribution
        // pos = low + [(target - arr[low]) / (arr[high] - arr[low])] * (high - low)
        const pos = low + Math.floor(
            ((target - arr[low]) / (arr[high] - arr[low])) * (high - low)
        );
        
        if (arr[pos] === target) return pos;
        else if (arr[pos] < target) low = pos + 1;
        else high = pos - 1;
    }
    
    return -1;
}

// 2. Jump Search
// Explanation: Block-based search algorithm that jumps ahead by fixed steps
// Optimal jump size: √n
// Time: O(√n), Space: O(1)
// When to use: When binary search overhead is too much, but linear search is too slow
function jumpSearch(arr, target) {
    const n = arr.length;
    const step = Math.floor(Math.sqrt(n)); // Optimal jump size
    let prev = 0;
    
    // Jump ahead to find the block containing target
    while (arr[Math.min(step, n) - 1] < target) {
        prev = step;
        step += Math.floor(Math.sqrt(n));
        if (prev >= n) return -1; // Target not in array
    }
    
    // Linear search within the identified block
    while (arr[prev] < target) {
        prev++;
        if (prev === Math.min(step, n)) return -1;
    }
    
    return arr[prev] === target ? prev : -1;
}

// 3. Exponential Search
// Explanation: Find range where target exists, then use binary search
// Steps: 1) Find range by doubling index, 2) Binary search in range
// Time: O(log n), Space: O(1)
// When to use: Unbounded/infinite arrays, or when target is close to beginning
function exponentialSearch(arr, target) {
    if (arr[0] === target) return 0;
    
    // Find range for binary search by doubling
    let i = 1;
    while (i < arr.length && arr[i] <= target) {
        i *= 2; // Exponential growth
    }
    
    // Binary search in found range [i/2, min(i, arr.length-1)]
    return binarySearchRange(arr, target, i / 2, Math.min(i, arr.length - 1));
}

function binarySearchRange(arr, target, left, right) {
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

// 4. Ternary Search
// Explanation: Divide array into three parts instead of two
// Time: O(log₃ n) ≈ O(log n), but with more comparisons than binary search
// When to use: Rarely used for arrays; more useful for unimodal functions
function ternarySearch(arr, target) {
    let left = 0, right = arr.length - 1;
    
    while (left <= right) {
        // Divide into three parts
        const mid1 = left + Math.floor((right - left) / 3);
        const mid2 = right - Math.floor((right - left) / 3);
        
        if (arr[mid1] === target) return mid1;
        if (arr[mid2] === target) return mid2;
        
        // Determine which third to search
        if (target < arr[mid1]) {
            right = mid1 - 1; // Search first third
        } else if (target > arr[mid2]) {
            left = mid2 + 1; // Search last third
        } else {
            left = mid1 + 1; // Search middle third
            right = mid2 - 1;
        }
    }
    
    return -1;
}

// 5. Search in 2D Matrix (sorted row and column)
// Explanation: Treat 2D matrix as 1D array for binary search
// Conversion: matrix[mid/cols][mid%cols] maps 1D index to 2D
// Time: O(log(m*n)), Space: O(1)
function searchMatrix(matrix, target) {
    if (!matrix || matrix.length === 0) return false;
    
    const rows = matrix.length;
    const cols = matrix[0].length;
    let left = 0, right = rows * cols - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        // Convert 1D index to 2D coordinates
        const midValue = matrix[Math.floor(mid / cols)][mid % cols];
        
        if (midValue === target) return true;
        else if (midValue < target) left = mid + 1;
        else right = mid - 1;
    }
    
    return false;
}

// 6. Search in Sorted Matrix (rows and columns individually sorted)
// Explanation: Start from top-right (or bottom-left) corner
// Key insight: From top-right, can eliminate either row or column in each step
// Time: O(m + n), Space: O(1)
function searchSortedMatrix(matrix, target) {
    if (!matrix || matrix.length === 0) return false;
    
    let row = 0;
    let col = matrix[0].length - 1; // Start from top-right corner
    
    while (row < matrix.length && col >= 0) {
        if (matrix[row][col] === target) return true;
        else if (matrix[row][col] > target) col--; // Eliminate column
        else row++; // Eliminate row
    }
    
    return false;
}

// Test
const uniformArr = [10, 20, 30, 40, 50, 60, 70, 80, 90];
console.log(interpolationSearch(uniformArr, 50)); // 4
console.log(jumpSearch(uniformArr, 70)); // 6
console.log(exponentialSearch(uniformArr, 40)); // 3

const matrix2D = [
    [1,  4,  7,  11],
    [2,  5,  8,  12],
    [3,  6,  9,  16],
    [10, 13, 14, 17]
];
console.log(searchSortedMatrix(matrix2D, 5)); // true
```

---

## Problem 6: String Search Algorithms

### Explanation
String search algorithms find occurrences of a pattern within a text. Different algorithms have different strengths based on pattern characteristics, alphabet size, and preprocessing requirements.

### Solution

```javascript
// 1. Naive String Search
// Explanation: Check pattern at every possible position in text
// Time: O(n*m) where n=text length, m=pattern length
// Space: O(1)
// When to use: Small patterns, when simplicity is preferred
function naiveSearch(text, pattern) {
    const matches = [];
    
    // Check every possible starting position
    for (let i = 0; i <= text.length - pattern.length; i++) {
        let j;
        // Check if pattern matches at position i
        for (j = 0; j < pattern.length; j++) {
            if (text[i + j] !== pattern[j]) break;
        }
        if (j === pattern.length) {
            matches.push(i); // Full match found
        }
    }
    
    return matches;
}

// 2. KMP (Knuth-Morris-Pratt) Algorithm
// Explanation: Uses preprocessing to avoid redundant comparisons
// Key insight: When mismatch occurs, use partial match info to skip characters
// Time: O(n + m), Space: O(m) for LPS array
// When to use: When pattern has repeating substrings, multiple searches with same pattern
function kmpSearch(text, pattern) {
    const lps = computeLPS(pattern); // Longest Proper Prefix which is also Suffix
    const matches = [];
    let i = 0; // text index
    let j = 0; // pattern index
    
    while (i < text.length) {
        if (pattern[j] === text[i]) {
            i++;
            j++;
        }
        
        if (j === pattern.length) {
            matches.push(i - j); // Match found
            j = lps[j - 1]; // Use LPS to avoid redundant checks
        } else if (i < text.length && pattern[j] !== text[i]) {
            if (j !== 0) {
                j = lps[j - 1]; // Skip characters using LPS
            } else {
                i++;
            }
        }
    }
    
    return matches;
}

// LPS Array: For each position, length of longest proper prefix that's also suffix
// Example: pattern "ABABCAB" -> LPS [0,0,1,2,0,1,2]
function computeLPS(pattern) {
    const lps = new Array(pattern.length).fill(0);
    let len = 0; // Length of previous longest prefix suffix
    let i = 1;
    
    while (i < pattern.length) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1]; // Try shorter prefix
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    
    return lps;
}

// 3. Boyer-Moore Algorithm (simplified - bad character heuristic only)
// Explanation: Scan pattern from right to left, skip based on mismatched character
// Key insight: When mismatch occurs, skip based on last occurrence of mismatched char
// Time: O(n*m) worst case, O(n/m) best case, Space: O(k) where k=alphabet size
// When to use: Large alphabets, long patterns, natural language text
function boyerMooreSearch(text, pattern) {
    const badChar = buildBadCharTable(pattern);
    const matches = [];
    let shift = 0;
    
    while (shift <= text.length - pattern.length) {
        let j = pattern.length - 1;
        
        // Match pattern from right to left
        while (j >= 0 && pattern[j] === text[shift + j]) {
            j--;
        }
        
        if (j < 0) {
            matches.push(shift); // Match found
            // Skip based on next character in text (if exists)
            shift += (shift + pattern.length < text.length) ?
                pattern.length - (badChar[text.charCodeAt(shift + pattern.length)] || -1) :
                1;
        } else {
            // Skip based on bad character heuristic
            shift += Math.max(1, j - (badChar[text.charCodeAt(shift + j)] || -1));
        }
    }
    
    return matches;
}

// Bad Character Table: For each character, store its rightmost position in pattern
function buildBadCharTable(pattern) {
    const table = {};
    for (let i = 0; i < pattern.length; i++) {
        table[pattern.charCodeAt(i)] = i;
    }
    return table;
}

// 4. Rabin-Karp Algorithm
// Explanation: Uses rolling hash to quickly compare pattern with text substrings
// Key insight: If hashes match, then check characters; if not, skip
// Time: O(n + m) average case, O(n*m) worst case, Space: O(1)
// When to use: Multiple pattern search, when hash collisions are rare
function rabinKarpSearch(text, pattern) {
    const base = 256; // Number of characters in alphabet
    const prime = 101; // A prime number for hash calculation
    const patternLength = pattern.length;
    const textLength = text.length;
    const matches = [];
    
    let patternHash = 0;
    let textHash = 0;
    let h = 1; // base^(patternLength-1) % prime
    
    // Calculate h = base^(patternLength-1) % prime
    for (let i = 0; i < patternLength - 1; i++) {
        h = (h * base) % prime;
    }
    
    // Calculate hash for pattern and first window of text
    for (let i = 0; i < patternLength; i++) {
        patternHash = (base * patternHash + pattern.charCodeAt(i)) % prime;
        textHash = (base * textHash + text.charCodeAt(i)) % prime;
    }
    
    // Slide pattern over text one by one
    for (let i = 0; i <= textLength - patternLength; i++) {
        // Check if hashes match
        if (patternHash === textHash) {
            // Hash collision possible, check characters
            let j;
            for (j = 0; j < patternLength; j++) {
                if (text[i + j] !== pattern[j]) break;
            }
            if (j === patternLength) {
                matches.push(i);
            }
        }
        
        // Calculate hash for next window using rolling hash
        if (i < textLength - patternLength) {
            textHash = (base * (textHash - text.charCodeAt(i) * h) + 
                       text.charCodeAt(i + patternLength)) % prime;
            
            // Handle negative hash values
            if (textHash < 0) textHash += prime;
        }
    }
    
    return matches;
}

// Test
const text = "ABABDABACDABABCABCABCABCABC";
const pattern = "ABABCAB";

console.log("Naive:", naiveSearch(text, pattern));
console.log("KMP:", kmpSearch(text, pattern));
console.log("Boyer-Moore:", boyerMooreSearch(text, pattern));
console.log("Rabin-Karp:", rabinKarpSearch(text, pattern));
```

## Algorithm Selection Guide

### When to Use Which Search Algorithm:

**Linear Search:**
- Unsorted data
- Small datasets
- One-time searches
- Simple implementation needed

**Binary Search:**
- Sorted data
- Large datasets
- Repeated searches
- Guaranteed O(log n) performance

**Interpolation Search:**
- Uniformly distributed sorted data
- Large datasets
- Better than binary search for uniform data

**Jump Search:**
- Sorted data
- When binary search overhead is too much
- Block-based processing preferred

**DFS:**
- Tree/graph traversal
- Pathfinding where any path is acceptable
- Topological sorting
- Cycle detection

**BFS:**
- Shortest path in unweighted graphs
- Level-order processing
- Finding minimum steps/distance

**String Search Selection:**
- **Naive**: Small patterns, simple implementation
- **KMP**: Patterns with repetitive structure, multiple searches
- **Boyer-Moore**: Large alphabets, long patterns
- **Rabin-Karp**: Multiple pattern search, good hash distribution

## Complexity Summary

| Algorithm | Time (Avg) | Time (Worst) | Space | Best Use Case |
|-----------|------------|--------------|-------|---------------|
| Linear | O(n) | O(n) | O(1) | Unsorted data |
| Binary | O(log n) | O(log n) | O(1) | Sorted data |
| Interpolation | O(log log n) | O(n) | O(1) | Uniform distribution |
| Jump | O(√n) | O(√n) | O(1) | Large sorted arrays |
| DFS | O(V+E) | O(V+E) | O(V) | Graph traversal |
| BFS | O(V+E) | O(V+E) | O(V) | Shortest path |
| KMP | O(n+m) | O(n+m) | O(m) | Pattern repetition |
| Boyer-Moore | O(n/m) | O(n*m) | O(k) | Large alphabets |

Understanding these algorithms and their trade-offs helps you choose the right tool for each specific problem!