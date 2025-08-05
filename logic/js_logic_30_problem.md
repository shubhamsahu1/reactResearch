# 30+ JavaScript Interview Logical Problems with Solutions

## Problem 1: Two Sum

### Problem Statement
Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.

### Solution
```javascript
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}

// Example
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
```

### Explanation
- **Time Complexity**: O(n) - single pass through array
- **Space Complexity**: O(n) - hash map storage
- **Logic**: Store each number and its index in a hash map. For each element, check if its complement (target - current) exists in the map.

---

## Problem 2: Valid Palindrome

### Problem Statement
Given a string, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.

### Solution
```javascript
function isPalindrome(s) {
    // Clean string: remove non-alphanumeric and convert to lowercase
    const cleaned = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    
    let left = 0;
    let right = cleaned.length - 1;
    
    while (left < right) {
        if (cleaned[left] !== cleaned[right]) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
}

// Example
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
```

### Explanation
- **Approach**: Two pointers from start and end
- **Key Steps**: 1) Clean string, 2) Compare characters from both ends
- **Edge Cases**: Empty string, single character, special characters

---

## Problem 3: Missing Number

### Problem Statement
Given an array containing n distinct numbers taken from 0, 1, 2, ..., n, find the one that is missing.

### Solution
```javascript
// Method 1: Mathematical approach
function missingNumber(nums) {
    const n = nums.length;
    const expectedSum = (n * (n + 1)) / 2;
    const actualSum = nums.reduce((sum, num) => sum + num, 0);
    return expectedSum - actualSum;
}

// Method 2: XOR approach
function missingNumberXOR(nums) {
    let result = nums.length;
    
    for (let i = 0; i < nums.length; i++) {
        result ^= i ^ nums[i];
    }
    
    return result;
}

// Example
console.log(missingNumber([3, 0, 1])); // 2
console.log(missingNumberXOR([0, 1])); // 2
```

### Explanation
- **Method 1**: Uses sum formula: sum of 0 to n = n(n+1)/2
- **Method 2**: Uses XOR property: a ^ a = 0, a ^ 0 = a
- **Space**: O(1) for both methods

---

## Problem 4: First Non-Repeating Character

### Problem Statement
Given a string, find the first non-repeating character in it and return its index. If it doesn't exist, return -1.

### Solution
```javascript
function firstUniqChar(s) {
    const charCount = new Map();
    
    // Count frequency of each character
    for (let char of s) {
        charCount.set(char, (charCount.get(char) || 0) + 1);
    }
    
    // Find first character with count 1
    for (let i = 0; i < s.length; i++) {
        if (charCount.get(s[i]) === 1) {
            return i;
        }
    }
    
    return -1;
}

// Example
console.log(firstUniqChar("leetcode")); // 0 (l)
console.log(firstUniqChar("loveleetcode")); // 2 (v)
```

### Explanation
- **Two-pass algorithm**: First pass counts frequencies, second pass finds first unique
- **Time**: O(n), **Space**: O(1) since at most 26 lowercase letters
- **Alternative**: Could use array of size 26 for lowercase letters only

---

## Problem 5: Valid Anagram

### Problem Statement
Given two strings s and t, return true if t is an anagram of s, and false otherwise.

### Solution
```javascript
// Method 1: Sorting
function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    
    return s.split('').sort().join('') === t.split('').sort().join('');
}

// Method 2: Character counting
function isAnagramCount(s, t) {
    if (s.length !== t.length) return false;
    
    const charCount = new Map();
    
    // Count characters in s
    for (let char of s) {
        charCount.set(char, (charCount.get(char) || 0) + 1);
    }
    
    // Decrement for characters in t
    for (let char of t) {
        if (!charCount.has(char)) return false;
        charCount.set(char, charCount.get(char) - 1);
        if (charCount.get(char) === 0) {
            charCount.delete(char);
        }
    }
    
    return charCount.size === 0;
}

// Example
console.log(isAnagram("anagram", "nagaram")); // true
console.log(isAnagramCount("rat", "car")); // false
```

### Explanation
- **Method 1**: Simple but O(n log n) due to sorting
- **Method 2**: O(n) time, counts character frequencies
- **Key insight**: Anagrams have same character frequencies

---

## Problem 6: Maximum Subarray (Kadane's Algorithm)

### Problem Statement
Given an integer array nums, find the contiguous subarray with the largest sum and return its sum.

### Solution
```javascript
function maxSubArray(nums) {
    let maxSoFar = nums[0];
    let maxEndingHere = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        // Either extend existing subarray or start new one
        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}

// To also return the subarray indices
function maxSubArrayWithIndices(nums) {
    let maxSum = nums[0];
    let currentSum = nums[0];
    let start = 0, end = 0, tempStart = 0;
    
    for (let i = 1; i < nums.length; i++) {
        if (currentSum < 0) {
            currentSum = nums[i];
            tempStart = i;
        } else {
            currentSum += nums[i];
        }
        
        if (currentSum > maxSum) {
            maxSum = currentSum;
            start = tempStart;
            end = i;
        }
    }
    
    return { maxSum, start, end, subarray: nums.slice(start, end + 1) };
}

// Example
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
console.log(maxSubArrayWithIndices([5, 4, -1, 7, 8])); // {maxSum: 23, start: 0, end: 4}
```

### Explanation
- **Kadane's Algorithm**: Dynamic programming approach
- **Key insight**: At each position, decide whether to extend current subarray or start new one
- **Time**: O(n), **Space**: O(1)

---

## Problem 7: Merge Intervals

### Problem Statement
Given an array of intervals, merge all overlapping intervals.

### Solution
```javascript
function merge(intervals) {
    if (intervals.length <= 1) return intervals;
    
    // Sort intervals by start time
    intervals.sort((a, b) => a[0] - b[0]);
    
    const merged = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const lastMerged = merged[merged.length - 1];
        
        if (current[0] <= lastMerged[1]) {
            // Overlapping intervals, merge them
            lastMerged[1] = Math.max(lastMerged[1], current[1]);
        } else {
            // Non-overlapping, add to result
            merged.push(current);
        }
    }
    
    return merged;
}

// Example
console.log(merge([[1,3],[2,6],[8,10],[15,18]])); 
// [[1,6],[8,10],[15,18]]
```

### Explanation
- **Strategy**: Sort by start time, then merge overlapping intervals
- **Overlap condition**: current start ≤ previous end
- **Time**: O(n log n) for sorting, **Space**: O(1) excluding output

---

## Problem 8: Best Time to Buy and Sell Stock

### Problem Statement
You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit you can achieve.

### Solution
```javascript
function maxProfit(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    
    for (let price of prices) {
        if (price < minPrice) {
            minPrice = price; // Update minimum price seen so far
        } else if (price - minPrice > maxProfit) {
            maxProfit = price - minPrice; // Update max profit
        }
    }
    
    return maxProfit;
}

// With tracking buy and sell days
function maxProfitWithDays(prices) {
    let minPrice = prices[0];
    let maxProfit = 0;
    let buyDay = 0, sellDay = 0;
    
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] < minPrice) {
            minPrice = prices[i];
            buyDay = i;
        } else if (prices[i] - minPrice > maxProfit) {
            maxProfit = prices[i] - minPrice;
            sellDay = i;
        }
    }
    
    return { maxProfit, buyDay, sellDay };
}

// Example
console.log(maxProfit([7, 1, 5, 3, 6, 4])); // 5
console.log(maxProfitWithDays([7, 1, 5, 3, 6, 4])); 
// { maxProfit: 5, buyDay: 1, sellDay: 4 }
```

### Explanation
- **Key insight**: Track minimum price seen so far and maximum profit possible
- **Single pass**: O(n) time, O(1) space
- **Logic**: For each price, either it's a new minimum or potential new maximum profit

---

## Problem 9: Valid Parentheses

### Problem Statement
Given a string containing just parentheses characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

### Solution
```javascript
function isValid(s) {
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

// Enhanced version with error details
function isValidDetailed(s) {
    const stack = [];
    const pairs = { ')': '(', '}': '{', ']': '[' };
    
    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        
        if (char === '(' || char === '{' || char === '[') {
            stack.push({ char, index: i });
        } else if (char === ')' || char === '}' || char === ']') {
            if (stack.length === 0) {
                return { valid: false, error: `Unmatched closing '${char}' at position ${i}` };
            }
            
            const last = stack.pop();
            if (last.char !== pairs[char]) {
                return { 
                    valid: false, 
                    error: `Mismatched brackets: '${last.char}' at ${last.index} and '${char}' at ${i}` 
                };
            }
        }
    }
    
    if (stack.length > 0) {
        return { 
            valid: false, 
            error: `Unmatched opening '${stack[0].char}' at position ${stack[0].index}` 
        };
    }
    
    return { valid: true };
}

// Example
console.log(isValid("()[]{}"));  // true
console.log(isValid("([)]"));    // false
console.log(isValidDetailed("([)]")); 
// { valid: false, error: "Mismatched brackets: '(' at 0 and ']' at 2" }
```

### Explanation
- **Stack-based solution**: LIFO nature perfect for matching brackets
- **Key insight**: Opening brackets go on stack, closing brackets must match top of stack
- **Time**: O(n), **Space**: O(n) for stack

---

## Problem 10: Climbing Stairs

### Problem Statement
You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. How many distinct ways can you climb to the top?

### Solution
```javascript
// Method 1: Dynamic Programming (Bottom-up)
function climbStairs(n) {
    if (n <= 2) return n;
    
    let prev2 = 1; // ways to reach step 1
    let prev1 = 2; // ways to reach step 2
    
    for (let i = 3; i <= n; i++) {
        const current = prev1 + prev2; // ways to reach step i
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}

// Method 2: Recursive with Memoization
function climbStairsMemo(n, memo = {}) {
    if (n in memo) return memo[n];
    if (n <= 2) return n;
    
    memo[n] = climbStairsMemo(n - 1, memo) + climbStairsMemo(n - 2, memo);
    return memo[n];
}

// Method 3: Mathematical (Fibonacci)
function climbStairsFib(n) {
    if (n <= 2) return n;
    
    let a = 1, b = 2;
    for (let i = 3; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}

// Example
console.log(climbStairs(5));     // 8
console.log(climbStairsMemo(5)); // 8
console.log(climbStairsFib(5));  // 8
```

### Explanation
- **Pattern recognition**: This is Fibonacci sequence! F(n) = F(n-1) + F(n-2)
- **Recurrence**: ways(n) = ways(n-1) + ways(n-2)
- **Optimization**: Space optimized DP uses O(1) space instead of O(n)

---

## Problem 11: Longest Common Prefix

### Problem Statement
Write a function to find the longest common prefix string amongst an array of strings.

### Solution
```javascript
// Method 1: Vertical scanning
function longestCommonPrefix(strs) {
    if (!strs || strs.length === 0) return "";
    
    for (let i = 0; i < strs[0].length; i++) {
        const char = strs[0][i];
        
        for (let j = 1; j < strs.length; j++) {
            if (i >= strs[j].length || strs[j][i] !== char) {
                return strs[0].substring(0, i);
            }
        }
    }
    
    return strs[0];
}

// Method 2: Horizontal scanning
function longestCommonPrefixHorizontal(strs) {
    if (!strs || strs.length === 0) return "";
    
    let prefix = strs[0];
    
    for (let i = 1; i < strs.length; i++) {
        while (strs[i].indexOf(prefix) !== 0) {
            prefix = prefix.substring(0, prefix.length - 1);
            if (prefix === "") return "";
        }
    }
    
    return prefix;
}

// Method 3: Divide and Conquer
function longestCommonPrefixDC(strs) {
    if (!strs || strs.length === 0) return "";
    
    function commonPrefix(left, right) {
        let min = Math.min(left.length, right.length);
        for (let i = 0; i < min; i++) {
            if (left[i] !== right[i]) {
                return left.substring(0, i);
            }
        }
        return left.substring(0, min);
    }
    
    function divideConquer(strs, l, r) {
        if (l === r) return strs[l];
        
        const mid = Math.floor((l + r) / 2);
        const lcpLeft = divideConquer(strs, l, mid);
        const lcpRight = divideConquer(strs, mid + 1, r);
        
        return commonPrefix(lcpLeft, lcpRight);
    }
    
    return divideConquer(strs, 0, strs.length - 1);
}

// Example
console.log(longestCommonPrefix(["flower", "flow", "flight"])); // "fl"
console.log(longestCommonPrefixHorizontal(["dog", "racecar", "car"])); // ""
```

### Explanation
- **Vertical scanning**: Compare character by character across all strings
- **Horizontal scanning**: Build prefix incrementally
- **Divide & Conquer**: Split problem and merge results

---

## Problem 12: Roman to Integer

### Problem Statement
Given a roman numeral, convert it to an integer.

### Solution
```javascript
function romanToInt(s) {
    const values = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50,
        'C': 100, 'D': 500, 'M': 1000
    };
    
    let result = 0;
    
    for (let i = 0; i < s.length; i++) {
        const current = values[s[i]];
        const next = values[s[i + 1]];
        
        // If current is less than next, subtract it (e.g., IV = 4)
        if (current < next) {
            result -= current;
        } else {
            result += current;
        }
    }
    
    return result;
}

// Enhanced version with validation
function romanToIntValidated(s) {
    const values = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50,
        'C': 100, 'D': 500, 'M': 1000
    };
    
    // Validate input
    if (!/^[IVXLCDM]+$/.test(s)) {
        throw new Error("Invalid roman numeral");
    }
    
    let result = 0;
    let prevValue = 0;
    
    for (let i = s.length - 1; i >= 0; i--) {
        const currentValue = values[s[i]];
        
        if (currentValue < prevValue) {
            result -= currentValue; // Subtractive case
        } else {
            result += currentValue; // Normal case
        }
        
        prevValue = currentValue;
    }
    
    return result;
}

// Example
console.log(romanToInt("III"));    // 3
console.log(romanToInt("LVIII"));  // 58
console.log(romanToInt("MCMXC"));  // 1990
```

### Explanation
- **Key insight**: When a smaller numeral appears before a larger one, subtract it
- **Rules**: I before V or X, X before L or C, C before D or M
- **Algorithm**: Compare current with next character to decide add/subtract

---

## Problem 13: Integer to Roman

### Problem Statement
Convert an integer to a roman numeral.

### Solution
```javascript
function intToRoman(num) {
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const symbols = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
    
    let result = "";
    
    for (let i = 0; i < values.length; i++) {
        while (num >= values[i]) {
            result += symbols[i];
            num -= values[i];
        }
    }
    
    return result;
}

// Alternative approach with mapping
function intToRomanMap(num) {
    const mapping = [
        [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
        [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
        [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
    ];
    
    let result = "";
    
    for (let [value, symbol] of mapping) {
        const count = Math.floor(num / value);
        if (count > 0) {
            result += symbol.repeat(count);
            num %= value;
        }
    }
    
    return result;
}

// Example
console.log(intToRoman(58));   // "LVIII"
console.log(intToRoman(1994)); // "MCMXCIV"
```

### Explanation
- **Greedy approach**: Use largest possible values first
- **Special cases**: Include subtractive combinations (CM, CD, XC, etc.)
- **Time**: O(1) since max 13 iterations, **Space**: O(1)

---

## Problem 14: Reverse Words in a String

### Problem Statement
Given an input string s, reverse the order of the words.

### Solution
```javascript
// Method 1: Using built-in methods
function reverseWords(s) {
    return s.trim()
            .split(/\s+/)
            .reverse()
            .join(' ');
}

// Method 2: Manual approach
function reverseWordsManual(s) {
    const words = [];
    let word = '';
    
    for (let i = 0; i < s.length; i++) {
        if (s[i] !== ' ') {
            word += s[i];
        } else if (word.length > 0) {
            words.push(word);
            word = '';
        }
    }
    
    if (word.length > 0) {
        words.push(word);
    }
    
    return words.reverse().join(' ');
}

// Method 3: Two-pointer approach (simulate in-place)
function reverseWordsInPlace(s) {
    // Convert to array for "in-place" simulation
    const chars = s.trim().replace(/\s+/g, ' ').split('');
    
    // Reverse entire string
    reverse(chars, 0, chars.length - 1);
    
    // Reverse each word
    let start = 0;
    for (let i = 0; i <= chars.length; i++) {
        if (i === chars.length || chars[i] === ' ') {
            reverse(chars, start, i - 1);
            start = i + 1;
        }
    }
    
    return chars.join('');
}

function reverse(arr, left, right) {
    while (left < right) {
        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++;
        right--;
    }
}

// Example
console.log(reverseWords("  hello world  ")); // "world hello"
console.log(reverseWordsManual("a good   example")); // "example good a"
```

### Explanation
- **Method 1**: Simple but uses built-in methods
- **Method 2**: Manual parsing to handle multiple spaces
- **Method 3**: Simulates in-place reversal (reverse all, then reverse each word)

---

## Problem 15: Group Anagrams

### Problem Statement
Given an array of strings strs, group the anagrams together.

### Solution
```javascript
// Method 1: Sorting approach
function groupAnagrams(strs) {
    const groups = new Map();
    
    for (let str of strs) {
        // Create signature by sorting characters
        const signature = str.split('').sort().join('');
        
        if (!groups.has(signature)) {
            groups.set(signature, []);
        }
        groups.get(signature).push(str);
    }
    
    return Array.from(groups.values());
}

// Method 2: Character frequency approach
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

// Method 3: Prime number approach (for small character sets)
function groupAnagramsPrime(strs) {
    // Assign prime numbers to each letter
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101];
    const groups = new Map();
    
    for (let str of strs) {
        let signature = 1;
        for (let char of str) {
            signature *= primes[char.charCodeAt(0) - 'a'.charCodeAt(0)];
        }
        
        if (!groups.has(signature)) {
            groups.set(signature, []);
        }
        groups.get(signature).push(str);
    }
    
    return Array.from(groups.values());
}

// Example
console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));
// [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
```

### Explanation
- **Method 1**: O(n * k log k) where k is max string length
- **Method 2**: O(n * k) time, uses character frequency as signature
- **Method 3**: Uses prime factorization (unique for each character combination)

---

## Problem 16: Top K Frequent Elements

### Problem Statement
Given an integer array nums and an integer k, return the k most frequent elements.

### Solution
```javascript
// Method 1: Using Map and sorting
function topKFrequent(nums, k) {
    const frequencyMap = new Map();
    
    // Count frequencies
    for (let num of nums) {
        frequencyMap.set(num, (frequencyMap.get(num) || 0) + 1);
    }
    
    // Sort by frequency and return top k
    return Array.from(frequencyMap.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, k)
                .map(entry => entry[0]);
}

// Method 2: Bucket sort approach
function topKFrequentBucket(nums, k) {
    const frequencyMap = new Map();
    const buckets = new Array(nums.length + 1).fill(null).map(() => []);
    
    // Count frequencies
    for (let num of nums) {
        frequencyMap.set(num, (frequencyMap.get(num) || 0) + 1);
    }
    
    // Put numbers in buckets based on frequency
    for (let [num, freq] of frequencyMap) {
        buckets[freq].push(num);
    }
    
    // Collect top k elements
    const result = [];
    for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
        result.push(...buckets[i]);
    }
    
    return result.slice(0, k);
}

// Method 3: Using Min Heap (Priority Queue simulation)
function topKFrequentHeap(nums, k) {
    const frequencyMap = new Map();
    
    // Count frequencies
    for (let num of nums) {
        frequencyMap.set(num, (frequencyMap.get(num) || 0) + 1);
    }
    
    // Use array to simulate min heap of size k
    const heap = [];
    
    for (let [num, freq] of frequencyMap) {
        heap.push([freq, num]);
        
        if (heap.length > k) {
            // Remove minimum frequency element
            heap.sort((a, b) => a[0] - b[0]);
            heap.shift();
        }
    }
    
    return heap.map(item => item[1]);
}

// Example
console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2)); // [1, 2]
console.log(topKFrequentBucket([1], 1)); // [1]
```

### Explanation
- **Method 1**: O(n log n) with sorting
- **Method 2**: O(n) bucket sort approach
- **Method 3**: O(n log k) using heap (simulated with array)

---

## Problem 17: Product of Array Except Self

### Problem Statement
Given an integer array nums, return an array answer such that answer[i] is equal to the product of all elements of nums except nums[i].

### Solution
```javascript
// Method 1: Two-pass approach
function productExceptSelf(nums) {
    const n = nums.length;
    const result = new Array(n);
    
    // First pass: calculate left products
    result[0] = 1;
    for (let i = 1; i < n; i++) {
        result[i] = result[i - 1] * nums[i - 1];
    }
    
    // Second pass: calculate right products and multiply
    let rightProduct = 1;
    for (let i = n - 1; i >= 0; i--) {
        result[i] *= rightProduct;
        rightProduct *= nums[i];
    }
    
    return result;
}

// Method 2: With separate left and right arrays (easier to understand)
function productExceptSelfExplicit(nums) {
    const n = nums.length;
    const left = new Array(n);
    const right = new Array(n);
    const result = new Array(n);
    
    // Calculate left products
    left[0] = 1;
    for (let i = 1; i < n; i++) {
        left[i] = left[i - 1] * nums[i - 1];
    }
    
    // Calculate right products
    right[n - 1] = 1;
    for (let i = n - 2; i >= 0; i--) {
        right[i] = right[i + 1] * nums[i + 1];
    }
    
    // Multiply left and right products
    for (let i = 0; i < n; i++) {
        result[i] = left[i] * right[i];
    }
    
    return result;
}

// Example
console.log(productExceptSelf([1, 2, 3, 4])); // [24, 12, 8, 6]
console.log(productExceptSelf([-1, 1, 0, -3, 3])); // [0, 0, 9, 0, 0]
```

### Explanation
- **Key constraint**: Cannot use division operator
- **Approach**: For each index, multiply all elements to its left and right
- **Space optimization**: Use result array to store left products, then modify in-place

---

## Problem 18: Container With Most Water

### Problem Statement
Given n non-negative integers representing an elevation map where the width of each bar is 1, find two lines that together with the x-axis forms a container that holds the most water.

### Solution
```javascript
function maxArea(height) {
    let left = 0;
    let right = height.length - 1;
    let maxWater = 0;
    
    while (left < right) {
        // Calculate current water area
        const width = right - left;
        const currentHeight = Math.min(height[left], height[right]);
        const area = width * currentHeight;
        
        maxWater = Math.max(maxWater, area);
        
        // Move pointer with smaller height
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxWater;
}

// Enhanced version that returns the indices
function maxAreaWithIndices(height) {
    let left = 0;
    let right = height.length - 1;
    let maxWater = 0;
    let bestLeft = 0, bestRight = 0;
    
    while (left < right) {
        const width = right - left;
        const currentHeight = Math.min(height[left], height[right]);
        const area = width * currentHeight;
        
        if (area > maxWater) {
            maxWater = area;
            bestLeft = left;
            bestRight = right;
        }
        
        // Move pointer with smaller height
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return {
        maxArea: maxWater,
        leftIndex: bestLeft,
        rightIndex: bestRight,
        leftHeight: height[bestLeft],
        rightHeight: height[bestRight]
    };
}

// Example
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49
console.log(maxAreaWithIndices([1, 8, 6, 2, 5, 4, 8, 3, 7]));
// { maxArea: 49, leftIndex: 1, rightIndex: 8, leftHeight: 8, rightHeight: 7 }
```

### Explanation
- **Two pointers approach**: Start from both ends
- **Key insight**: Always move the pointer with smaller height (bottleneck)
- **Why it works**: Moving the taller line can only decrease area since width decreases

---

## Problem 19: 3Sum

### Problem Statement
Given an integer array nums, return all unique triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

### Solution
```javascript
function threeSum(nums) {
    nums.sort((a, b) => a - b);
    const result = [];
    
    for (let i = 0; i < nums.length - 2; i++) {
        // Skip duplicates for first number
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        let left = i + 1;
        let right = nums.length - 1;
        const target = -nums[i];
        
        while (left < right) {
            const sum = nums[left] + nums[right];
            
            if (sum === target) {
                result.push([nums[i], nums[left], nums[right]]);
                
                // Skip duplicates
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                
                left++;
                right--;
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
}

// Alternative: Using Set to handle duplicates
function threeSumSet(nums) {
    nums.sort((a, b) => a - b);
    const result = [];
    const seen = new Set();
    
    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        let left = i + 1;
        let right = nums.length - 1;
        
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            
            if (sum === 0) {
                const triplet = [nums[i], nums[left], nums[right]];
                const key = triplet.join(',');
                
                if (!seen.has(key)) {
                    seen.add(key);
                    result.push(triplet);
                }
                
                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
}

// Example
console.log(threeSum([-1, 0, 1, 2, -1, -4])); 
// [[-1, -1, 2], [-1, 0, 1]]
```

### Explanation
- **Reduce to 2Sum**: Fix first element, find two elements that sum to -first
- **Duplicate handling**: Skip duplicate values to avoid duplicate triplets
- **Time**: O(n²), **Space**: O(1) excluding output

---

## Problem 20: Longest Substring Without Repeating Characters

### Problem Statement
Given a string s, find the length of the longest substring without repeating characters.

### Solution
```javascript
// Method 1: Sliding window with Set
function lengthOfLongestSubstring(s) {
    const seen = new Set();
    let left = 0;
    let maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        // Shrink window while we have duplicates
        while (seen.has(s[right])) {
            seen.delete(s[left]);
            left++;
        }
        
        seen.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

// Method 2: Optimized with Map (stores last seen index)
function lengthOfLongestSubstringOptimized(s) {
    const lastSeen = new Map();
    let left = 0;
    let maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        
        if (lastSeen.has(char) && lastSeen.get(char) >= left) {
            // Jump to position after last occurrence
            left = lastSeen.get(char) + 1;
        }
        
        lastSeen.set(char, right);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}

// Method 3: Return the actual substring
function longestSubstringWithoutRepeating(s) {
    const seen = new Set();
    let left = 0;
    let maxLength = 0;
    let result = "";
    
    for (let right = 0; right < s.length; right++) {
        while (seen.has(s[right])) {
            seen.delete(s[left]);
            left++;
        }
        
        seen.add(s[right]);
        
        if (right - left + 1 > maxLength) {
            maxLength = right - left + 1;
            result = s.substring(left, right + 1);
        }
    }
    
    return { length: maxLength, substring: result };
}

// Example
console.log(lengthOfLongestSubstring("abcabcbb")); // 3 ("abc")
console.log(lengthOfLongestSubstringOptimized("pwwkew")); // 3 ("wke")
console.log(longestSubstringWithoutRepeating("bbbbb")); 
// { length: 1, substring: "b" }
```

### Explanation
- **Sliding window technique**: Expand right, shrink left when needed
- **Method 1**: Uses Set, shrinks window character by character
- **Method 2**: Optimized with Map, jumps directly to position after duplicate

---

## Problem 21: Minimum Window Substring

### Problem Statement
Given two strings s and t, return the minimum window in s which will contain all the characters in t.

### Solution
```javascript
function minWindow(s, t) {
    if (s.length === 0 || t.length === 0) return "";
    
    // Count characters in t
    const tCount = new Map();
    for (let char of t) {
        tCount.set(char, (tCount.get(char) || 0) + 1);
    }
    
    const required = tCount.size; // Number of unique characters in t
    let formed = 0; // Number of unique characters in current window with desired frequency
    
    const windowCounts = new Map();
    let left = 0, right = 0;
    
    // (window length, left, right)
    let ans = [Infinity, 0, 0];
    
    while (right < s.length) {
        const char = s[right];
        windowCounts.set(char, (windowCounts.get(char) || 0) + 1);
        
        if (tCount.has(char) && windowCounts.get(char) === tCount.get(char)) {
            formed++;
        }
        
        // Try to contract the window
        while (left <= right && formed === required) {
            const leftChar = s[left];
            
            // Update answer if this window is smaller
            if (right - left + 1 < ans[0]) {
                ans = [right - left + 1, left, right];
            }
            
            windowCounts.set(leftChar, windowCounts.get(leftChar) - 1);
            if (tCount.has(leftChar) && windowCounts.get(leftChar) < tCount.get(leftChar)) {
                formed--;
            }
            
            left++;
        }
        
        right++;
    }
    
    return ans[0] === Infinity ? "" : s.substring(ans[1], ans[2] + 1);
}

// Simplified version for easier understanding
function minWindowSimple(s, t) {
    const need = new Map();
    const window = new Map();
    
    for (let char of t) {
        need.set(char, (need.get(char) || 0) + 1);
    }
    
    let left = 0, right = 0;
    let valid = 0;
    let start = 0, len = Infinity;
    
    while (right < s.length) {
        const c = s[right];
        right++;
        
        if (need.has(c)) {
            window.set(c, (window.get(c) || 0) + 1);
            if (window.get(c) === need.get(c)) {
                valid++;
            }
        }
        
        while (valid === need.size) {
            if (right - left < len) {
                start = left;
                len = right - left;
            }
            
            const d = s[left];
            left++;
            
            if (need.has(d)) {
                if (window.get(d) === need.get(d)) {
                    valid--;
                }
                window.set(d, window.get(d) - 1);
            }
        }
    }
    
    return len === Infinity ? "" : s.substring(start, start + len);
}

// Example
console.log(minWindow("ADOBECODEBANC", "ABC")); // "BANC"
console.log(minWindow("a", "a")); // "a"
console.log(minWindow("a", "aa")); // ""
```

### Explanation
- **Sliding window with two pointers**: Expand right to include characters, shrink left when valid
- **Tracking**: Count required vs. current character frequencies
- **Optimization**: Only check characters that are in target string

---

## Problem 22: Permutation in String

### Problem Statement
Given two strings s1 and s2, return true if s2 contains any permutation of s1.

### Solution
```javascript
// Method 1: Sliding window with character counts
function checkInclusion(s1, s2) {
    if (s1.length > s2.length) return false;
    
    const s1Count = new Map();
    const windowCount = new Map();
    
    // Count characters in s1
    for (let char of s1) {
        s1Count.set(char, (s1Count.get(char) || 0) + 1);
    }
    
    const windowSize = s1.length;
    
    // Initialize window
    for (let i = 0; i < windowSize; i++) {
        const char = s2[i];
        windowCount.set(char, (windowCount.get(char) || 0) + 1);
    }
    
    // Check if first window matches
    if (mapsEqual(s1Count, windowCount)) return true;
    
    // Slide the window
    for (let i = windowSize; i < s2.length; i++) {
        // Add new character
        const newChar = s2[i];
        windowCount.set(newChar, (windowCount.get(newChar) || 0) + 1);
        
        // Remove old character
        const oldChar = s2[i - windowSize];
        windowCount.set(oldChar, windowCount.get(oldChar) - 1);
        if (windowCount.get(oldChar) === 0) {
            windowCount.delete(oldChar);
        }
        
        if (mapsEqual(s1Count, windowCount)) return true;
    }
    
    return false;
}

function mapsEqual(map1, map2) {
    if (map1.size !== map2.size) return false;
    
    for (let [key, value] of map1) {
        if (map2.get(key) !== value) return false;
    }
    
    return true;
}

// Method 2: Using array for ASCII characters (more efficient)
function checkInclusionArray(s1, s2) {
    if (s1.length > s2.length) return false;
    
    const s1Count = new Array(26).fill(0);
    const windowCount = new Array(26).fill(0);
    
    // Count characters in s1 and initial window
    for (let i = 0; i < s1.length; i++) {
        s1Count[s1.charCodeAt(i) - 97]++;
        windowCount[s2.charCodeAt(i) - 97]++;
    }
    
    if (arraysEqual(s1Count, windowCount)) return true;
    
    // Slide the window
    for (let i = s1.length; i < s2.length; i++) {
        // Add new character
        windowCount[s2.charCodeAt(i) - 97]++;
        
        // Remove old character
        windowCount[s2.charCodeAt(i - s1.length) - 97]--;
        
        if (arraysEqual(s1Count, windowCount)) return true;
    }
    
    return false;
}

function arraysEqual(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

// Method 3: Optimized with matches counter
function checkInclusionOptimized(s1, s2) {
    if (s1.length > s2.length) return false;
    
    const s1Count = new Array(26).fill(0);
    const windowCount = new Array(26).fill(0);
    
    for (let char of s1) {
        s1Count[char.charCodeAt(0) - 97]++;
    }
    
    let matches = 0;
    
    for (let i = 0; i < s2.length; i++) {
        let charIndex = s2.charCodeAt(i) - 97;
        windowCount[charIndex]++;
        
        if (windowCount[charIndex] === s1Count[charIndex]) {
            matches++;
        } else if (windowCount[charIndex] === s1Count[charIndex] + 1) {
            matches--;
        }
        
        // Remove character outside window
        if (i >= s1.length) {
            charIndex = s2.charCodeAt(i - s1.length) - 97;
            windowCount[charIndex]--;
            
            if (windowCount[charIndex] === s1Count[charIndex]) {
                matches++;
            } else if (windowCount[charIndex] === s1Count[charIndex] - 1) {
                matches--;
            }
        }
        
        if (matches === 26) return true;
    }
    
    return false;
}

// Example
console.log(checkInclusion("ab", "eidbaooo")); // true
console.log(checkInclusionArray("ab", "eidboaoo")); // false
console.log(checkInclusionOptimized("adc", "dcda")); // true
```

### Explanation
- **Fixed-size sliding window**: Window size equals s1 length
- **Character frequency matching**: Window must have same character frequencies as s1
- **Optimization**: Use array instead of Map for ASCII characters

---

## Problem 23: Find All Anagrams in a String

### Problem Statement
Given two strings s and p, return an array of all the start indices of p's anagrams in s.

### Solution
```javascript
function findAnagrams(s, p) {
    if (s.length < p.length) return [];
    
    const result = [];
    const pCount = new Array(26).fill(0);
    const windowCount = new Array(26).fill(0);
    
    // Count characters in p
    for (let char of p) {
        pCount[char.charCodeAt(0) - 97]++;
    }
    
    const windowSize = p.length;
    
    // Process first window
    for (let i = 0; i < windowSize; i++) {
        windowCount[s.charCodeAt(i) - 97]++;
    }
    
    if (arraysEqual(pCount, windowCount)) {
        result.push(0);
    }
    
    // Slide window through rest of string
    for (let i = windowSize; i < s.length; i++) {
        // Add new character
        windowCount[s.charCodeAt(i) - 97]++;
        
        // Remove old character
        windowCount[s.charCodeAt(i - windowSize) - 97]--;
        
        if (arraysEqual(pCount, windowCount)) {
            result.push(i - windowSize + 1);
        }
    }
    
    return result;
}

function arraysEqual(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

// Optimized version with matches counter
function findAnagramsOptimized(s, p) {
    if (s.length < p.length) return [];
    
    const result = [];
    const pCount = new Array(26).fill(0);
    const windowCount = new Array(26).fill(0);
    
    // Count characters in p
    for (let char of p) {
        pCount[char.charCodeAt(0) - 97]++;
    }
    
    let matches = 0;
    
    for (let i = 0; i < s.length; i++) {
        // Add character to window
        let charIndex = s.charCodeAt(i) - 97;
        windowCount[charIndex]++;
        
        if (windowCount[charIndex] === pCount[charIndex]) {
            matches++;
        } else if (windowCount[charIndex] === pCount[charIndex] + 1) {
            matches--;
        }
        
        // Remove character from window if window is too large
        if (i >= p.length) {
            charIndex = s.charCodeAt(i - p.length) - 97;
            windowCount[charIndex]--;
            
            if (windowCount[charIndex] === pCount[charIndex]) {
                matches++;
            } else if (windowCount[charIndex] === pCount[charIndex] - 1) {
                matches--;
            }
        }
        
        // Check if we have an anagram
        if (matches === 26) {
            result.push(i - p.length + 1);
        }
    }
    
    return result;
}

// Example
console.log(findAnagrams("abab", "ab")); // [0, 2]
console.log(findAnagrams("abcab", "ab")); // [0, 3]
console.log(findAnagramsOptimized("cbaebabacd", "abc")); // [1, 6]
```

### Explanation
- **Extension of previous problem**: Find all anagram positions instead of just one
- **Sliding window**: Fixed window size equal to pattern length
- **Efficiency**: O(n) time complexity with optimized character counting

---

## Problem 24: Trapping Rain Water

### Problem Statement
Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

### Solution
```javascript
// Method 1: Two-pass approach
function trap(height) {
    if (height.length <= 2) return 0;
    
    const n = height.length;
    const leftMax = new Array(n);
    const rightMax = new Array(n);
    
    // Calculate max height to the left of each position
    leftMax[0] = height[0];
    for (let i = 1; i < n; i++) {
        leftMax[i] = Math.max(leftMax[i - 1], height[i]);
    }
    
    // Calculate max height to the right of each position
    rightMax[n - 1] = height[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        rightMax[i] = Math.max(rightMax[i + 1], height[i]);
    }
    
    // Calculate trapped water
    let totalWater = 0;
    for (let i = 0; i < n; i++) {
        const waterLevel = Math.min(leftMax[i], rightMax[i]);
        if (waterLevel > height[i]) {
            totalWater += waterLevel - height[i];
        }
    }
    
    return totalWater;
}

// Method 2: Two pointers approach (space optimized)
function trapTwoPointers(height) {
    if (height.length <= 2) return 0;
    
    let left = 0, right = height.length - 1;
    let leftMax = 0, rightMax = 0;
    let totalWater = 0;
    
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) {
                leftMax = height[left];
            } else {
                totalWater += leftMax - height[left];
            }
            left++;
        } else {
            if (height[right] >= rightMax) {
                rightMax = height[right];
            } else {
                totalWater += rightMax - height[right];
            }
            right--;
        }
    }
    
    return totalWater;
}

// Method 3: Stack-based approach
function trapStack(height) {
    const stack = [];
    let totalWater = 0;
    
    for (let i = 0; i < height.length; i++) {
        while (stack.length > 0 && height[i] > height[stack[stack.length - 1]]) {
            const top = stack.pop();
            
            if (stack.length === 0) break;
            
            const distance = i - stack[stack.length - 1] - 1;
            const boundedHeight = Math.min(height[i], height[stack[stack.length - 1]]) - height[top];
            
            totalWater += distance * boundedHeight;
        }
        
        stack.push(i);
    }
    
    return totalWater;
}

// Example
console.log(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])); // 6
console.log(trapTwoPointers([4, 2, 0, 3, 2, 5])); // 9
console.log(trapStack([3, 0, 2, 0, 4])); // 10
```

### Explanation
- **Key insight**: Water level at each position = min(max_left, max_right)
- **Method 1**: Precompute left and right maximums
- **Method 2**: Two pointers optimization (O(1) space)
- **Method 3**: Stack-based approach processes by layers

---

## Problem 25: Jump Game

### Problem Statement
Given an array of non-negative integers nums where each element represents your maximum jump length at that position, determine if you can reach the last index.

### Solution
```javascript
// Method 1: Greedy approach
function canJump(nums) {
    let maxReach = 0;
    
    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) {
            return false; // Can't reach this position
        }
        
        maxReach = Math.max(maxReach, i + nums[i]);
        
        if (maxReach >= nums.length - 1) {
            return true; // Can reach the end
        }
    }
    
    return maxReach >= nums.length - 1;
}

// Method 2: Working backwards
function canJumpBackwards(nums) {
    let lastPos = nums.length - 1;
    
    for (let i = nums.length - 1; i >= 0; i--) {
        if (i + nums[i] >= lastPos) {
            lastPos = i;
        }
    }
    
    return lastPos === 0;
}

// Method 3: Dynamic Programming (less efficient but illustrative)
function canJumpDP(nums) {
    const dp = new Array(nums.length).fill(false);
    dp[0] = true;
    
    for (let i = 0; i < nums.length; i++) {
        if (!dp[i]) continue;
        
        for (let j = 1; j <= nums[i] && i + j < nums.length; j++) {
            dp[i + j] = true;
        }
    }
    
    return dp[nums.length - 1];
}

// Enhanced version with path tracking
function canJumpWithPath(nums) {
    const parent = new Array(nums.length).fill(-1);
    const reachable = new Array(nums.length).fill(false);
    reachable[0] = true;
    
    for (let i = 0; i < nums.length; i++) {
        if (!reachable[i]) continue;
        
        for (let j = 1; j <= nums[i] && i + j < nums.length; j++) {
            if (!reachable[i + j]) {
                reachable[i + j] = true;
                parent[i + j] = i;
            }
        }
    }
    
    if (!reachable[nums.length - 1]) {
        return { canReach: false, path: [] };
    }
    
    // Reconstruct path
    const path = [];
    let current = nums.length - 1;
    while (current !== -1) {
        path.unshift(current);
        current = parent[current];
    }
    
    return { canReach: true, path };
}

// Example
console.log(canJump([2, 3, 1, 1, 4])); // true
console.log(canJumpBackwards([3, 2, 1, 0, 4])); // false
console.log(canJumpWithPath([2, 3, 1, 1, 4])); 
// { canReach: true, path: [0, 1, 4] }
```

### Explanation
- **Greedy approach**: Track furthest reachable position
- **Key insight**: If current position > max reachable, impossible to continue
- **Backward approach**: Work from end, find if position 0 can reach end

---

## Problem 26: Jump Game II

### Problem Statement
Given an array of non-negative integers nums where each element represents your maximum jump length at that position, return the minimum number of jumps to reach the last index.

### Solution
```javascript
// Method 1: Greedy approach
function jump(nums) {
    if (nums.length <= 1) return 0;
    
    let jumps = 0;
    let currentEnd = 0;
    let farthest = 0;
    
    for (let i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        
        if (i === currentEnd) {
            jumps++;
            currentEnd = farthest;
        }
    }
    
    return jumps;
}

// Method 2: BFS approach
function jumpBFS(nums) {
    if (nums.length <= 1) return 0;
    
    let jumps = 0;
    let currentLevelEnd = 0;
    let nextLevelEnd = 0;
    
    for (let i = 0; i < nums.length - 1; i++) {
        nextLevelEnd = Math.max(nextLevelEnd, i + nums[i]);
        
        if (i === currentLevelEnd) {
            jumps++;
            currentLevelEnd = nextLevelEnd;
        }
    }
    
    return jumps;
}

// Method 3: Dynamic Programming (less efficient)
function jumpDP(nums) {
    const dp = new Array(nums.length).fill(Infinity);
    dp[0] = 0;
    
    for (let i = 0; i < nums.length; i++) {
        for (let j = 1; j <= nums[i] && i + j < nums.length; j++) {
            dp[i + j] = Math.min(dp[i + j], dp[i] + 1);
        }
    }
    
    return dp[nums.length - 1];
}

// Enhanced version with path tracking
function jumpWithPath(nums) {
    if (nums.length <= 1) return { jumps: 0, path: [0] };
    
    const parent = new Array(nums.length).fill(-1);
    const jumps = new Array(nums.length).fill(Infinity);
    jumps[0] = 0;
    
    for (let i = 0; i < nums.length; i++) {
        if (jumps[i] === Infinity) continue;
        
        for (let j = 1; j <= nums[i] && i + j < nums.length; j++) {
            if (jumps[i] + 1 < jumps[i + j]) {
                jumps[i + j] = jumps[i] + 1;
                parent[i + j] = i;
            }
        }
    }
    
    // Reconstruct path
    const path = [];
    let current = nums.length - 1;
    while (current !== -1) {
        path.unshift(current);
        current = parent[current];
    }
    
    return { jumps: jumps[nums.length - 1], path };
}

// Example
console.log(jump([2, 3, 1, 1, 4])); // 2
console.log(jumpBFS([2, 3, 0, 1, 4])); // 2
console.log(jumpWithPath([2, 3, 1, 1, 4])); 
// { jumps: 2, path: [0, 1, 4] }
```

### Explanation
- **Greedy approach**: At each level, find the farthest reachable position
- **BFS concept**: Each "level" represents positions reachable with same number of jumps
- **Key insight**: Increment jumps only when we've explored all positions at current level

---

## Problem 27: Gas Station

### Problem Statement
There are n gas stations along a circular route. You have a car with unlimited gas tank. Return the starting gas station's index if you can travel around the circuit once, otherwise return -1.

### Solution
```javascript
function canCompleteCircuit(gas, cost) {
    let totalGas = 0;
    let totalCost = 0;
    let currentGas = 0;
    let start = 0;
    
    for (let i = 0; i < gas.length; i++) {
        totalGas += gas[i];
        totalCost += cost[i];
        currentGas += gas[i] - cost[i];
        
        // If we can't reach next station, try starting from next position
        if (currentGas < 0) {
            start = i + 1;
            currentGas = 0;
        }
    }
    
    // Check if total gas is sufficient
    return totalGas >= totalCost ? start : -1;
}

// Enhanced version with detailed analysis
function canCompleteCircuitDetailed(gas, cost) {
    const n = gas.length;
    let totalGas = 0;
    let totalCost = 0;
    
    // Calculate total gas and cost
    for (let i = 0; i < n; i++) {
        totalGas += gas[i];
        totalCost += cost[i];
    }
    
    // If total gas < total cost, impossible to complete circuit
    if (totalGas < totalCost) {
        return { canComplete: false, startIndex: -1, reason: "Insufficient total gas" };
    }
    
    let currentGas = 0;
    let start = 0;
    const journey = [];
    
    for (let i = 0; i < n; i++) {
        currentGas += gas[i] - cost[i];
        journey.push({
            station: i,
            gasAdded: gas[i],
            costToNext: cost[i],
            netGain: gas[i] - cost[i],
            currentGas: currentGas
        });
        
        if (currentGas < 0) {
            start = i + 1;
            currentGas = 0;
            journey.length = 0; // Reset journey tracking
        }
    }
    
    return {
        canComplete: true,
        startIndex: start,
        journey: journey
    };
}

// Alternative: Brute force approach (less efficient)
function canCompleteCircuitBruteForce(gas, cost) {
    const n = gas.length;
    
    for (let start = 0; start < n; start++) {
        let currentGas = 0;
        let stationsVisited = 0;
        
        for (let i = start; stationsVisited < n; i = (i + 1) % n) {
            currentGas += gas[i] - cost[i];
            
            if (currentGas < 0) break;
            
            stationsVisited++;
        }
        
        if (stationsVisited === n) return start;
    }
    
    return -1;
}

// Example
console.log(canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2])); // 3
console.log(canCompleteCircuit([2, 3, 4], [3, 4, 3])); // -1
console.log(canCompleteCircuitDetailed([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]));
```

### Explanation
- **Key insight**: If total gas ≥ total cost, solution exists and is unique
- **Greedy approach**: If we can't reach next station, try starting from that station
- **Why it works**: If we fail at station i starting from j, any start between j and i will also fail

---

## Problem 28: Candy

### Problem Statement
There are n children standing in a line. Each child is assigned a rating value. You are giving candies to these children subjected to requirements: each child must have at least one candy, and children with higher rating get more candies than their neighbors.

### Solution
```javascript
function candy(ratings) {
    const n = ratings.length;
    const candies = new Array(n).fill(1);
    
    // Left to right pass
    for (let i = 1; i < n; i++) {
        if (ratings[i] > ratings[i - 1]) {
            candies[i] = candies[i - 1] + 1;
        }
    }
    
    // Right to left pass
    for (let i = n - 2; i >= 0; i--) {
        if (ratings[i] > ratings[i + 1]) {
            candies[i] = Math.max(candies[i], candies[i + 1] + 1);
        }
    }
    
    return candies.reduce((sum, candy) => sum + candy, 0);
}

// Enhanced version with detailed breakdown
function candyDetailed(ratings) {
    const n = ratings.length;
    const candies = new Array(n).fill(1);
    
    console.log("Initial candies:", [...candies]);
    console.log("Ratings:", ratings);
    
    // Left to right pass
    for (let i = 1; i < n; i++) {
        if (ratings[i] > ratings[i - 1]) {
            candies[i] = candies[i - 1] + 1;
        }
    }
    console.log("After left to right pass:", [...candies]);
    
    // Right to left pass
    for (let i = n - 2; i >= 0; i--) {
        if (ratings[i] > ratings[i + 1]) {
            candies[i] = Math.max(candies[i], candies[i + 1] + 1);
        }
    }
    console.log("After right to left pass:", [...candies]);
    
    const totalCandies = candies.reduce((sum, candy) => sum + candy, 0);
    
    return {
        candyDistribution: candies,
        totalCandies: totalCandies,
        breakdown: ratings.map((rating, i) => ({
            child: i,
            rating: rating,
            candies: candies[i]
        }))
    };
}

// Space-optimized version (single pass with peak detection)
function candyOptimized(ratings) {
    if (ratings.length <= 1) return ratings.length;
    
    let totalCandies = 1;
    let up = 0, down = 0, peak = 0;
    
    for (let i = 1; i < ratings.length; i++) {
        if (ratings[i - 1] < ratings[i]) {
            up++;
            down = 0;
            peak = up;
            totalCandies += 1 + up;
        } else if (ratings[i - 1] > ratings[i]) {
            up = 0;
            down++;
            totalCandies += 1 + down + (down > peak ? 1 : 0);
        } else {
            up = down = peak = 0;
            totalCandies += 1;
        }
    }
    
    return totalCandies;
}

// Example
console.log(candy([1, 0, 2])); // 5
console.log(candy([1, 2, 2])); // 4
console.log(candyDetailed([1, 3, 2, 2, 1]));
// Shows step-by-step candy distribution
```

### Explanation
- **Two-pass algorithm**: Left-to-right ensures increasing sequences, right-to-left ensures decreasing sequences
- **Key insight**: Need to satisfy both left and right neighbor constraints
- **Optimization**: Can be done in one pass by detecting peaks and valleys

---

## Problem 29: Valid Sudoku

### Problem Statement
Determine if a 9x9 Sudoku board is valid. Only filled cells need to be validated according to Sudoku rules.

### Solution
```javascript
function isValidSudoku(board) {
    const rows = Array(9).fill().map(() => new Set());
    const cols = Array(9).fill().map(() => new Set());
    const boxes = Array(9).fill().map(() => new Set());
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = board[i][j];
            
            if (cell === '.') continue;
            
            const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
            
            // Check if number already exists in row, column, or box
            if (rows[i].has(cell) || cols[j].has(cell) || boxes[boxIndex].has(cell)) {
                return false;
            }
            
            // Add to sets
            rows[i].add(cell);
            cols[j].add(cell);
            boxes[boxIndex].add(cell);
        }
    }
    
    return true;
}

// Enhanced version with detailed validation
function isValidSudokuDetailed(board) {
    const rows = Array(9).fill().map(() => new Set());
    const cols = Array(9).fill().map(() => new Set());
    const boxes = Array(9).fill().map(() => new Set());
    const errors = [];
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = board[i][j];
            
            if (cell === '.') continue;
            
            // Validate cell value
            if (!/^[1-9]$/.test(cell)) {
                errors.push(`Invalid character '${cell}' at (${i}, ${j})`);
                continue;
            }
            
            const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
            
            // Check duplicates
            if (rows[i].has(cell)) {
                errors.push(`Duplicate '${cell}' in row ${i} at (${i}, ${j})`);
            }
            if (cols[j].has(cell)) {
                errors.push(`Duplicate '${cell}' in column ${j} at (${i}, ${j})`);
            }
            if (boxes[boxIndex].has(cell)) {
                errors.push(`Duplicate '${cell}' in box ${boxIndex} at (${i}, ${j})`);
            }
            
            // Add to sets
            rows[i].add(cell);
            cols[j].add(cell);
            boxes[boxIndex].add(cell);
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors,
        statistics: {
            filledCells: board.flat().filter(cell => cell !== '.').length,
            emptyCells: board.flat().filter(cell => cell === '.').length
        }
    };
}

// Alternative: Using single pass with bit manipulation
function isValidSudokuBits(board) {
    const rows = new Array(9).fill(0);
    const cols = new Array(9).fill(0);
    const boxes = new Array(9).fill(0);
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = board[i][j];
            
            if (cell === '.') continue;
            
            const num = parseInt(cell);
            const bit = 1 << (num - 1);
            const boxIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
            
            // Check if bit is already set
            if ((rows[i] & bit) || (cols[j] & bit) || (boxes[boxIndex] & bit)) {
                return false;
            }
            
            // Set bits
            rows[i] |= bit;
            cols[j] |= bit;
            boxes[boxIndex] |= bit;
        }
    }
    
    return true;
}

// Example
const validBoard = [
    ["5","3",".",".","7",".",".",".","."],
    ["6",".",".","1","9","5",".",".","."],
    [".","9","8",".",".",".",".","6","."],
    ["8",".",".",".","6",".",".",".","3"],
    ["4",".",".","8",".","3",".",".","1"],
    ["7",".",".",".","2",".",".",".","6"],
    [".","6",".",".",".",".","2","8","."],
    [".",".",".","4","1","9",".",".","5"],
    [".",".",".",".","8",".",".","7","9"]
];

console.log(isValidSudoku(validBoard)); // true
console.log(isValidSudokuDetailed(validBoard));
```

### Explanation
- **Three constraints**: Each row, column, and 3x3 box must contain unique digits
- **Box index calculation**: `Math.floor(i/3) * 3 + Math.floor(j/3)`
- **Optimization**: Use bit manipulation instead of Sets for better performance

---

## Problem 30: Spiral Matrix

### Problem Statement
Given an m x n matrix, return all elements of the matrix in spiral order.

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

// Enhanced version with step tracking
function spiralOrderDetailed(matrix) {
    if (!matrix || matrix.length === 0) return [];
    
    const result = [];
    const steps = [];
    let top = 0, bottom = matrix.length - 1;
    let left = 0, right = matrix[0].length - 1;
    let direction = 'right';
    
    while (top <= bottom && left <= right) {
        switch (direction) {
            case 'right':
                for (let col = left; col <= right; col++) {
                    result.push(matrix[top][col]);
                    steps.push({ value: matrix[top][col], position: [top, col], direction: 'right' });
                }
                top++;
                direction = 'down';
                break;
                
            case 'down':
                for (let row = top; row <= bottom; row++) {
                    result.push(matrix[row][right]);
                    steps.push({ value: matrix[row][right], position: [row, right], direction: 'down' });
                }
                right--;
                direction = 'left';
                break;
                
            case 'left':
                if (top <= bottom) {
                    for (let col = right; col >= left; col--) {
                        result.push(matrix[bottom][col]);
                        steps.push({ value: matrix[bottom][col], position: [bottom, col], direction: 'left' });
                    }
                    bottom--;
                }
                direction = 'up';
                break;
                
            case 'up':
                if (left <= right) {
                    for (let row = bottom; row >= top; row--) {
                        result.push(matrix[row][left]);
                        steps.push({ value: matrix[row][left], position: [row, left], direction: 'up' });
                    }
                    left++;
                }
                direction = 'right';
                break;
        }
    }
    
    return { result, steps };
}

// Alternative: Direction-based approach
function spiralOrderDirection(matrix) {
    if (!matrix || matrix.length === 0) return [];
    
    const m = matrix.length, n = matrix[0].length;
    const result = [];
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // right, down, left, up
    let dirIndex = 0;
    let row = 0, col = 0;
    
    const visited = Array(m).fill().map(() => Array(n).fill(false));
    
    for (let i = 0; i < m * n; i++) {
        result.push(matrix[row][col]);
        visited[row][col] = true;
        
        const nextRow = row + directions[dirIndex][0];
        const nextCol = col + directions[dirIndex][1];
        
        // Check if we need to turn
        if (nextRow < 0 || nextRow >= m || nextCol < 0 || nextCol >= n || visited[nextRow][nextCol]) {
            dirIndex = (dirIndex + 1) % 4;
        }
        
        row += directions[dirIndex][0];
        col += directions[dirIndex][1];
    }
    
    return result;
}

// Example
const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

console.log(spiralOrder(matrix)); // [1, 2, 3, 6, 9, 8, 7, 4, 5]
console.log(spiralOrderDetailed(matrix));
```

### Explanation
- **Four boundaries**: Track top, bottom, left, right boundaries
- **Four directions**: Right → Down → Left → Up, then repeat
- **Boundary conditions**: Check if rows/columns still exist before traversing

---

## Summary of Problem Categories

### **Array/String Manipulation (Problems 1-8)**
- Two Sum, Palindrome, Missing Number, Character frequency
- **Key Patterns**: Hash maps, two pointers, mathematical formulas

### **Dynamic Programming (Problems 6, 10, 25-26)**
- Maximum subarray, climbing stairs, jump games
- **Key Patterns**: Optimal substructure, memoization, bottom-up approach

### **Sliding Window (Problems 20-23)**
- Substring problems, anagram detection
- **Key Patterns**: Two pointers, character frequency, window expansion/contraction

### **Greedy Algorithms (Problems 7-8, 25-28)**
- Interval merging, stock trading, gas station, candy distribution
- **Key Patterns**: Local optimal choices, sorting, mathematical insights

### **Stack/Queue Applications (Problems 9, 24)**
- Parentheses validation, trapping rainwater
- **Key Patterns**: LIFO/FIFO, matching problems, area calculations

### **Matrix Operations (Problems 18, 29-30)**
- Container with water, Sudoku validation, spiral traversal
- **Key Patterns**: Boundary management, direction tracking, constraint validation

### **Time Complexity Summary**
- **O(n)**: Most array/string problems with hash maps or two pointers
- **O(n log n)**: Problems requiring sorting (3Sum, merge intervals)
- **O(n²)**: Dynamic programming solutions, matrix operations
- **O(1) space**: Optimized solutions using mathematical insights

These problems cover the most common patterns and techniques asked in JavaScript interviews, providing a solid foundation for technical interview preparation.