# JavaScript Logic Problems Collection

## Problem 1: Two Sum with Unique Pairs

### Problem Statement
Given an array of integers and a target sum, find all unique pairs of numbers that add up to the target. Each number can only be used once per pair.

**Example:**
- Input: `nums = [1, 2, 3, 4, 5, 6]`, `target = 7`
- Output: `[[1, 6], [2, 5], [3, 4]]`

**Constraints:**
- No duplicate pairs in the result
- Each element used only once
- Return pairs in ascending order

### Solution

```javascript
function twoSumUniquePairs(nums, target) {
    const seen = new Set();
    const result = [];
    const used = new Set();
    
    for (let num of nums) {
        const complement = target - num;
        
        if (seen.has(complement) && !used.has(num) && !used.has(complement)) {
            const pair = [Math.min(num, complement), Math.max(num, complement)];
            result.push(pair);
            used.add(num);
            used.add(complement);
        }
        seen.add(num);
    }
    
    return result.sort((a, b) => a[0] - b[0]);
}

// Test
console.log(twoSumUniquePairs([1, 2, 3, 4, 5, 6], 7)); 
// [[1, 6], [2, 5], [3, 4]]
```

---

## Problem 2: String Pattern Matching

### Problem Statement
Given a pattern and a string, determine if the string follows the pattern. A pattern means a full match, where each letter in the pattern corresponds to a non-empty word in the string.

**Example:**
- Input: `pattern = "abba"`, `str = "dog cat cat dog"`
- Output: `true`
- Input: `pattern = "abba"`, `str = "dog cat cat fish"`
- Output: `false`

### Solution

```javascript
function wordPattern(pattern, str) {
    const words = str.split(' ');
    
    if (pattern.length !== words.length) return false;
    
    const charToWord = new Map();
    const wordToChar = new Map();
    
    for (let i = 0; i < pattern.length; i++) {
        const char = pattern[i];
        const word = words[i];
        
        // Check char -> word mapping
        if (charToWord.has(char)) {
            if (charToWord.get(char) !== word) return false;
        } else {
            charToWord.set(char, word);
        }
        
        // Check word -> char mapping
        if (wordToChar.has(word)) {
            if (wordToChar.get(word) !== char) return false;
        } else {
            wordToChar.set(word, char);
        }
    }
    
    return true;
}

// Test
console.log(wordPattern("abba", "dog cat cat dog")); // true
console.log(wordPattern("abba", "dog cat cat fish")); // false
```

---

## Problem 3: Spiral Matrix Traversal

### Problem Statement
Given an m x n matrix, return all elements of the matrix in spiral order (clockwise from outside to inside).

**Example:**
```
Input: [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]
Output: [1, 2, 3, 6, 9, 8, 7, 4, 5]
```

### Solution

```javascript
function spiralOrder(matrix) {
    if (!matrix || matrix.length === 0) return [];
    
    const result = [];
    let top = 0, bottom = matrix.length - 1;
    let left = 0, right = matrix[0].length - 1;
    
    while (top <= bottom && left <= right) {
        // Traverse right
        for (let col = left; col <= right; col++) {
            result.push(matrix[top][col]);
        }
        top++;
        
        // Traverse down
        for (let row = top; row <= bottom; row++) {
            result.push(matrix[row][right]);
        }
        right--;
        
        // Traverse left (if we still have rows)
        if (top <= bottom) {
            for (let col = right; col >= left; col--) {
                result.push(matrix[bottom][col]);
            }
            bottom--;
        }
        
        // Traverse up (if we still have columns)
        if (left <= right) {
            for (let row = bottom; row >= top; row--) {
                result.push(matrix[row][left]);
            }
            left++;
        }
    }
    
    return result;
}

// Test
const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];
console.log(spiralOrder(matrix)); // [1, 2, 3, 6, 9, 8, 7, 4, 5]
```

---

## Problem 4: Longest Consecutive Sequence

### Problem Statement
Given an unsorted array of integers, find the length of the longest consecutive elements sequence. The algorithm must run in O(n) time complexity.

**Example:**
- Input: `[100, 4, 200, 1, 3, 2]`
- Output: `4` (sequence: 1, 2, 3, 4)

### Solution

```javascript
function longestConsecutive(nums) {
    if (nums.length === 0) return 0;
    
    const numSet = new Set(nums);
    let maxLength = 0;
    
    for (let num of numSet) {
        // Only start counting if this is the beginning of a sequence
        if (!numSet.has(num - 1)) {
            let currentNum = num;
            let currentLength = 1;
            
            // Count consecutive numbers
            while (numSet.has(currentNum + 1)) {
                currentNum++;
                currentLength++;
            }
            
            maxLength = Math.max(maxLength, currentLength);
        }
    }
    
    return maxLength;
}

// Test
console.log(longestConsecutive([100, 4, 200, 1, 3, 2])); // 4
console.log(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])); // 9
```

---

## Problem 5: Valid Parentheses with Multiple Types

### Problem Statement
Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if brackets are opened and closed in the correct order.

**Example:**
- Input: `"()[]{}"`
- Output: `true`
- Input: `"([)]"`
- Output: `false`

### Solution

```javascript
function isValidParentheses(s) {
    const stack = [];
    const pairs = {
        ')': '(',
        '}': '{',
        ']': '['
    };
    
    for (let char of s) {
        if (char === '(' || char === '{' || char === '[') {
            // Opening bracket
            stack.push(char);
        } else if (char === ')' || char === '}' || char === ']') {
            // Closing bracket
            if (stack.length === 0 || stack.pop() !== pairs[char]) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
}

// Test
console.log(isValidParentheses("()[]{}")); // true
console.log(isValidParentheses("([)]")); // false
console.log(isValidParentheses("{[]}")); // true
```

---

## Problem 6: Group Anagrams

### Problem Statement
Given an array of strings, group the anagrams together. You can return the answer in any order.

**Example:**
- Input: `["eat", "tea", "tan", "ate", "nat", "bat"]`
- Output: `[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]`

### Solution

```javascript
function groupAnagrams(strs) {
    const groups = new Map();
    
    for (let str of strs) {
        // Create a signature by sorting characters
        const signature = str.split('').sort().join('');
        
        if (!groups.has(signature)) {
            groups.set(signature, []);
        }
        groups.get(signature).push(str);
    }
    
    return Array.from(groups.values());
}

// Alternative solution using character frequency
function groupAnagramsFreq(strs) {
    const groups = new Map();
    
    for (let str of strs) {
        // Create signature using character frequency
        const freq = new Array(26).fill(0);
        for (let char of str) {
            freq[char.charCodeAt(0) - 'a'.charCodeAt(0)]++;
        }
        const signature = freq.join(',');
        
        if (!groups.has(signature)) {
            groups.set(signature, []);
        }
        groups.get(signature).push(str);
    }
    
    return Array.from(groups.values());
}

// Test
console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));
// [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
```

---

## Problem 7: Product of Array Except Self

### Problem Statement
Given an integer array nums, return an array answer such that answer[i] is equal to the product of all elements of nums except nums[i]. You must solve it without using division and in O(n) time.

**Example:**
- Input: `[1, 2, 3, 4]`
- Output: `[24, 12, 8, 6]`

### Solution

```javascript
function productExceptSelf(nums) {
    const n = nums.length;
    const result = new Array(n);
    
    // Calculate left products
    result[0] = 1;
    for (let i = 1; i < n; i++) {
        result[i] = result[i - 1] * nums[i - 1];
    }
    
    // Calculate right products and multiply with left products
    let rightProduct = 1;
    for (let i = n - 1; i >= 0; i--) {
        result[i] *= rightProduct;
        rightProduct *= nums[i];
    }
    
    return result;
}

// Test
console.log(productExceptSelf([1, 2, 3, 4])); // [24, 12, 8, 6]
console.log(productExceptSelf([-1, 1, 0, -3, 3])); // [0, 0, 9, 0, 0]
```

---

## Problem 8: Meeting Rooms II

### Problem Statement
Given an array of meeting time intervals, find the minimum number of conference rooms required.

**Example:**
- Input: `[[0, 30], [5, 10], [15, 20]]`
- Output: `2`

### Solution

```javascript
function minMeetingRooms(intervals) {
    if (intervals.length === 0) return 0;
    
    // Separate start and end times
    const starts = intervals.map(interval => interval[0]).sort((a, b) => a - b);
    const ends = intervals.map(interval => interval[1]).sort((a, b) => a - b);
    
    let rooms = 0;
    let maxRooms = 0;
    let startPointer = 0;
    let endPointer = 0;
    
    while (startPointer < intervals.length) {
        if (starts[startPointer] < ends[endPointer]) {
            // Meeting starts, need a room
            rooms++;
            startPointer++;
        } else {
            // Meeting ends, free a room
            rooms--;
            endPointer++;
        }
        maxRooms = Math.max(maxRooms, rooms);
    }
    
    return maxRooms;
}

// Test
console.log(minMeetingRooms([[0, 30], [5, 10], [15, 20]])); // 2
console.log(minMeetingRooms([[7, 10], [2, 4]])); // 1
```

## Key Problem-Solving Patterns

1. **Two Pointers**: Problems 1, 8
2. **Hash Maps/Sets**: Problems 1, 2, 4, 6
3. **Stack**: Problem 5
4. **Matrix Traversal**: Problem 3
5. **Array Manipulation**: Problems 4, 7
6. **Sorting & Grouping**: Problems 6, 8
7. **Greedy Algorithms**: Problem 8

Each problem teaches different algorithmic thinking patterns and data structure usage!