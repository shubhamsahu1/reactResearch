# Longest Palindromic Substring - JavaScript Implementation

## Problem Description

Given a string, find the longest palindromic substring. A palindrome is a string that reads the same forward and backward.

## Examples

- Input: "babad" → Output: "bab" or "aba" (both are valid)
- Input: "cbbd" → Output: "bb"  
- Input: "a" → Output: "a"

## Solution: Expand Around Centers Approach

```javascript
function longestPalindrome(s) {
    if (!s || s.length < 1) return "";
    
    let start = 0;
    let maxLength = 1;
    
    // Helper function to expand around center and return length
    function expandAroundCenter(left, right) {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            left--;
            right++;
        }
        return right - left - 1; // Length of palindrome
    }
    
    for (let i = 0; i < s.length; i++) {
        // Check for odd-length palindromes (center is a single character)
        let len1 = expandAroundCenter(i, i);
        
        // Check for even-length palindromes (center is between two characters)
        let len2 = expandAroundCenter(i, i + 1);
        
        // Get the maximum length palindrome centered at current position
        let currentMaxLength = Math.max(len1, len2);
        
        // Update global maximum if we found a longer palindrome
        if (currentMaxLength > maxLength) {
            maxLength = currentMaxLength;
            // Calculate starting position of the palindrome
            start = i - Math.floor((currentMaxLength - 1) / 2);
        }
    }
    
    return s.substring(start, start + maxLength);
}

// Test cases
console.log(longestPalindrome("babad")); // Output: "bab" or "aba"
console.log(longestPalindrome("cbbd"));  // Output: "bb"
console.log(longestPalindrome("a"));     // Output: "a"
console.log(longestPalindrome("ac"));    // Output: "a" or "c"
console.log(longestPalindrome("racecar")); // Output: "racecar"
```

## How It Works

### Algorithm Explanation

1. **Expand Around Centers**: For each possible center in the string, we expand outward to find the longest palindrome centered at that position.

2. **Two Types of Centers**:
   - **Odd-length palindromes**: Center is a single character (e.g., "aba")
   - **Even-length palindromes**: Center is between two characters (e.g., "abba")

3. **Process**:
   - Iterate through each position in the string
   - For each position, check both odd and even-length palindromes
   - Expand outward as long as characters match
   - Keep track of the longest palindrome found

### Step-by-Step Example with "babad"

```
Position 0 ('b'):
- Odd center: expand around 'b' → "b" (length 1)
- Even center: expand between 'b' and 'a' → no match

Position 1 ('a'):
- Odd center: expand around 'a' → "bab" (length 3)
- Even center: expand between 'a' and 'b' → no match

Position 2 ('b'):
- Odd center: expand around 'b' → "aba" (length 3)
- Even center: expand between 'b' and 'a' → no match

... and so on
```

### Key Variables

- `start`: Starting index of the longest palindrome found
- `maxLength`: Length of the longest palindrome found
- `expandAroundCenter()`: Helper function that returns the length of palindrome centered at given position(s)

## Time and Space Complexity

- **Time Complexity**: O(n²) where n is the length of the string
  - We iterate through each position (O(n))
  - For each position, we potentially expand to check the entire string (O(n))

- **Space Complexity**: O(1) - we only use a constant amount of extra space

## Alternative Approaches

### 1. Brute Force (O(n³))
Check every possible substring to see if it's a palindrome.

### 2. Dynamic Programming (O(n²) time, O(n²) space)
Build a 2D table to store palindrome information for all substrings.

### 3. Manacher's Algorithm (O(n))
Advanced algorithm that can solve this in linear time, but more complex to implement.

## Usage

```javascript
// Simple usage
const result = longestPalindrome("babad");
console.log(result); // "bab" or "aba"

// Edge cases
console.log(longestPalindrome(""));     // ""
console.log(longestPalindrome("a"));    // "a"
console.log(longestPalindrome("aa"));   // "aa"
```

The expand-around-centers approach provides a good balance between simplicity and efficiency, making it ideal for most practical applications.