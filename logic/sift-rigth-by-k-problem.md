# JavaScript Logic Problem: Array Rotation Challenge

## Problem Statement

You are given an array of integers and a number `k`. Your task is to rotate the array to the right by `k` steps.

**Example:**
- Input: `nums = [1, 2, 3, 4, 5, 6, 7]`, `k = 3`
- Output: `[5, 6, 7, 1, 2, 3, 4]`

**Constraints:**
- `1 <= nums.length <= 10^5`
- `-2^31 <= nums[i] <= 2^31 - 1`
- `0 <= k <= 10^5`

**Requirements:**
- Solve it in-place with O(1) extra space
- Try to come up with as many solutions as you can

## Your Task

Write a function `rotate(nums, k)` that rotates the array in-place.

```javascript
function rotate(nums, k) {
    // Your solution here
}
```

---

## Solution

### Approach 1: Using Array Reverse (Optimal - O(n) time, O(1) space)

The key insight is that rotating an array can be achieved by reversing parts of the array:

1. Reverse the entire array
2. Reverse the first k elements
3. Reverse the remaining elements

```javascript
function rotate(nums, k) {
    // Handle cases where k is larger than array length
    k = k % nums.length;
    
    // Helper function to reverse array in place
    function reverse(arr, start, end) {
        while (start < end) {
            [arr[start], arr[end]] = [arr[end], arr[start]];
            start++;
            end--;
        }
    }
    
    // Step 1: Reverse entire array
    reverse(nums, 0, nums.length - 1);
    
    // Step 2: Reverse first k elements
    reverse(nums, 0, k - 1);
    
    // Step 3: Reverse remaining elements
    reverse(nums, k, nums.length - 1);
}
```

**How it works:**
- Original: `[1, 2, 3, 4, 5, 6, 7]`, k = 3
- After step 1: `[7, 6, 5, 4, 3, 2, 1]`
- After step 2: `[5, 6, 7, 4, 3, 2, 1]`
- After step 3: `[5, 6, 7, 1, 2, 3, 4]`

### Approach 2: Using Extra Array (O(n) time, O(n) space)

```javascript
function rotate(nums, k) {
    k = k % nums.length;
    const result = new Array(nums.length);
    
    for (let i = 0; i < nums.length; i++) {
        result[(i + k) % nums.length] = nums[i];
    }
    
    // Copy back to original array
    for (let i = 0; i < nums.length; i++) {
        nums[i] = result[i];
    }
}
```

### Approach 3: Cyclic Replacements (O(n) time, O(1) space)

```javascript
function rotate(nums, k) {
    k = k % nums.length;
    let count = 0;
    
    for (let start = 0; count < nums.length; start++) {
        let current = start;
        let prev = nums[start];
        
        do {
            const next = (current + k) % nums.length;
            [nums[next], prev] = [prev, nums[next]];
            current = next;
            count++;
        } while (start !== current);
    }
}
```

## Test Cases

```javascript
// Test the function
function testRotate() {
    // Test case 1
    let nums1 = [1, 2, 3, 4, 5, 6, 7];
    rotate(nums1, 3);
    console.log(nums1); // [5, 6, 7, 1, 2, 3, 4]
    
    // Test case 2
    let nums2 = [-1, -100, 3, 99];
    rotate(nums2, 2);
    console.log(nums2); // [3, 99, -1, -100]
    
    // Test case 3 (k larger than array length)
    let nums3 = [1, 2];
    rotate(nums3, 3);
    console.log(nums3); // [2, 1]
    
    // Test case 4 (k = 0)
    let nums4 = [1, 2, 3];
    rotate(nums4, 0);
    console.log(nums4); // [1, 2, 3]
}

testRotate();
```

## Key Learning Points

1. **Modulo Operation**: Use `k % nums.length` to handle cases where k is larger than array length
2. **In-place Modification**: The array reverse approach achieves O(1) space complexity
3. **Edge Cases**: Consider k = 0, k > array length, and single-element arrays
4. **Array Destructuring**: Use `[a, b] = [b, a]` for clean element swapping

## Time & Space Complexity

| Approach | Time Complexity | Space Complexity |
|----------|----------------|------------------|
| Array Reverse | O(n) | O(1) |
| Extra Array | O(n) | O(n) |
| Cyclic Replacements | O(n) | O(1) |

The array reverse approach is generally preferred as it's intuitive, efficient, and uses constant extra space.