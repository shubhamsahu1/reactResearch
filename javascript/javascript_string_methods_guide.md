# Complete JavaScript String Methods Guide

## Table of Contents
1. [String Basics](#string-basics)
2. [Character Access Methods](#character-access-methods)
3. [Search and Test Methods](#search-and-test-methods)
4. [Extraction Methods](#extraction-methods)
5. [Case Conversion Methods](#case-conversion-methods)
6. [Modification and Replacement Methods](#modification-and-replacement-methods)
7. [Split and Join Operations](#split-and-join-operations)
8. [Whitespace and Padding Methods](#whitespace-and-padding-methods)
9. [Comparison Methods](#comparison-methods)
10. [Template Literal Methods](#template-literal-methods)
11. [ES6+ Modern Methods](#es6-modern-methods)
12. [Regular Expression Methods](#regular-expression-methods)
13. [Unicode and Encoding Methods](#unicode-and-encoding-methods)
14. [Performance Tips](#performance-tips)
15. [Best Practices](#best-practices)

## String Basics

### Creating Strings

```javascript
// String literals (most common)
const str1 = 'Hello World';
const str2 = "Hello World";
const str3 = `Hello World`; // Template literal

// String constructor
const str4 = new String('Hello World'); // Returns String object, not primitive
const str5 = String(42); // Converts to string primitive

// From other types
const numStr = String(123); // '123'
const boolStr = String(true); // 'true'
const objStr = String({name: 'John'}); // '[object Object]'

console.log(typeof str1); // 'string'
console.log(typeof str4); // 'object'
```

### String Properties

```javascript
const text = 'Hello World';

// Length property
console.log(text.length); // 11

// Strings are immutable
text[0] = 'h'; // No error in non-strict mode, but doesn't change the string
console.log(text); // 'Hello World' - unchanged

// Index access
console.log(text[0]); // 'H'
console.log(text[text.length - 1]); // 'd'
```

## Character Access Methods

### charAt()
Returns character at specified index.

```javascript
const text = 'Hello World';

console.log(text.charAt(0)); // 'H'
console.log(text.charAt(6)); // 'W'
console.log(text.charAt(20)); // '' (empty string for out of bounds)

// Equivalent to bracket notation
console.log(text[0]); // 'H'
console.log(text[20]); // undefined (for out of bounds)

// Performance: O(1)
```

### charCodeAt()
Returns Unicode code point of character at specified index.

```javascript
const text = 'Hello';

console.log(text.charCodeAt(0)); // 72 (Unicode for 'H')
console.log(text.charCodeAt(1)); // 101 (Unicode for 'e')
console.log(text.charCodeAt(10)); // NaN (out of bounds)

// Useful for character comparisons
const isUpperCase = (char) => {
  const code = char.charCodeAt(0);
  return code >= 65 && code <= 90; // A-Z range
};

console.log(isUpperCase('H')); // true
console.log(isUpperCase('h')); // false

// Performance: O(1)
```

### codePointAt() (ES6)
Returns Unicode code point value at specified position.

```javascript
const text = 'Hello 𝒳'; // Contains a mathematical script X

console.log(text.codePointAt(0)); // 72 ('H')
console.log(text.codePointAt(6)); // 120001 (𝒳)

// Difference from charCodeAt for surrogate pairs
const emoji = '😀';
console.log(emoji.charCodeAt(0)); // 55357 (high surrogate)
console.log(emoji.codePointAt(0)); // 128512 (actual emoji code point)

// Performance: O(1)
```

## Search and Test Methods

### indexOf()
Returns first index of specified substring.

```javascript
const text = 'Hello World Hello';

console.log(text.indexOf('Hello')); // 0
console.log(text.indexOf('World')); // 6
console.log(text.indexOf('hello')); // -1 (case sensitive)
console.log(text.indexOf('xyz')); // -1 (not found)

// With starting position
console.log(text.indexOf('Hello', 1)); // 12 (search from index 1)

// Check if string contains substring
const hasSubstring = text.indexOf('World') !== -1;
console.log(hasSubstring); // true

// Performance: O(n*m) where n is string length, m is search term length
```

### lastIndexOf()
Returns last index of specified substring.

```javascript
const text = 'Hello World Hello Universe';

console.log(text.lastIndexOf('Hello')); // 12
console.log(text.lastIndexOf('World')); // 6
console.log(text.lastIndexOf('xyz')); // -1

// With starting position (searches backwards from this position)
console.log(text.lastIndexOf('Hello', 10)); // 0

// Performance: O(n*m)
```

### includes() (ES6)
Determines if string contains specified substring.

```javascript
const text = 'Hello World';

console.log(text.includes('World')); // true
console.log(text.includes('world')); // false (case sensitive)
console.log(text.includes('xyz')); // false

// With starting position
console.log(text.includes('World', 7)); // false (search from index 7)

// More readable than indexOf
if (text.includes('Hello')) {
  console.log('Found Hello!');
}

// Performance: O(n*m)
```

### startsWith() (ES6)
Determines if string starts with specified substring.

```javascript
const text = 'Hello World';

console.log(text.startsWith('Hello')); // true
console.log(text.startsWith('World')); // false
console.log(text.startsWith('hello')); // false (case sensitive)

// With starting position
console.log(text.startsWith('World', 6)); // true (check from index 6)

// Practical use cases
const url = 'https://example.com';
if (url.startsWith('https://')) {
  console.log('Secure URL');
}

const filename = 'document.pdf';
if (filename.startsWith('temp_')) {
  console.log('Temporary file');
}

// Performance: O(m) where m is search term length
```

### endsWith() (ES6)
Determines if string ends with specified substring.

```javascript
const text = 'Hello World';

console.log(text.endsWith('World')); // true
console.log(text.endsWith('Hello')); // false
console.log(text.endsWith('world')); // false (case sensitive)

// With length parameter (consider only first n characters)
console.log(text.endsWith('Hello', 5)); // true (check first 5 chars)

// Practical use cases
const filename = 'document.pdf';
if (filename.endsWith('.pdf')) {
  console.log('PDF file');
}

const email = 'user@gmail.com';
if (email.endsWith('@gmail.com')) {
  console.log('Gmail address');
}

// Performance: O(m) where m is search term length
```

### search()
Searches for match using regular expression.

```javascript
const text = 'Hello World 123';

console.log(text.search('World')); // 6
console.log(text.search(/world/i)); // 6 (case insensitive regex)
console.log(text.search(/\d+/)); // 12 (first digit)
console.log(text.search(/xyz/)); // -1 (not found)

// Unlike indexOf, search() only accepts regex or converts to regex
console.log(text.search('W')); // 6
console.log(text.search(/W/)); // 6 (same result)

// Performance: O(n) for simple patterns, varies with regex complexity
```

## Extraction Methods

### substring()
Extracts characters between two indices.

```javascript
const text = 'Hello World';

console.log(text.substring(0, 5)); // 'Hello'
console.log(text.substring(6)); // 'World' (from index 6 to end)
console.log(text.substring(6, 11)); // 'World'

// Swaps arguments if start > end
console.log(text.substring(5, 0)); // 'Hello' (same as substring(0, 5))

// Negative numbers treated as 0
console.log(text.substring(-3, 5)); // 'Hello' (same as substring(0, 5))

// Performance: O(n) where n is length of extracted string
```

### substr() (Deprecated)
Extracts characters starting from specified index for specified length.

```javascript
const text = 'Hello World';

console.log(text.substr(0, 5)); // 'Hello'
console.log(text.substr(6, 5)); // 'World'
console.log(text.substr(6)); // 'World' (from index 6 to end)

// Negative start index counts from end
console.log(text.substr(-5, 5)); // 'World'

// Note: Deprecated in favor of substring() and slice()
// Performance: O(n)
```

### slice()
Extracts section of string and returns new string.

```javascript
const text = 'Hello World';

console.log(text.slice(0, 5)); // 'Hello'
console.log(text.slice(6)); // 'World'
console.log(text.slice(6, 11)); // 'World'

// Negative indices count from end
console.log(text.slice(-5)); // 'World' (last 5 characters)
console.log(text.slice(0, -6)); // 'Hello' (exclude last 6 characters)
console.log(text.slice(-11, -6)); // 'Hello'

// Unlike substring, doesn't swap arguments
console.log(text.slice(5, 0)); // '' (empty string)

// Performance: O(n)
```

## Case Conversion Methods

### toLowerCase()
Converts string to lowercase.

```javascript
const text = 'Hello WORLD';

console.log(text.toLowerCase()); // 'hello world'
console.log(text); // 'Hello WORLD' (original unchanged)

// Useful for case-insensitive comparisons
const email1 = 'USER@EXAMPLE.COM';
const email2 = 'user@example.com';
console.log(email1.toLowerCase() === email2.toLowerCase()); // true

// Performance: O(n)
```

### toUpperCase()
Converts string to uppercase.

```javascript
const text = 'Hello world';

console.log(text.toUpperCase()); // 'HELLO WORLD'

// Practical use case
const shout = (message) => message.toUpperCase() + '!!!';
console.log(shout('hello')); // 'HELLO!!!'

// Performance: O(n)
```

### toLocaleLowerCase()
Converts to lowercase according to locale.

```javascript
const text = 'İstanbul'; // Turkish capital İ

console.log(text.toLowerCase()); // 'i̇stanbul' (may not be correct for Turkish)
console.log(text.toLocaleLowerCase('tr-TR')); // 'istanbul' (correct Turkish lowercase)

// For most cases, toLowerCase() is sufficient
const normal = 'HELLO';
console.log(normal.toLocaleLowerCase()); // 'hello'

// Performance: O(n)
```

### toLocaleUpperCase()
Converts to uppercase according to locale.

```javascript
const text = 'istanbul';

console.log(text.toUpperCase()); // 'ISTANBUL'
console.log(text.toLocaleUpperCase('tr-TR')); // 'İSTANBUL' (Turkish İ)

// Performance: O(n)
```

## Modification and Replacement Methods

### replace()
Replaces first occurrence of pattern with replacement.

```javascript
const text = 'Hello World Hello Universe';

// String replacement (only first occurrence)
console.log(text.replace('Hello', 'Hi')); // 'Hi World Hello Universe'

// Regular expression replacement
console.log(text.replace(/Hello/g, 'Hi')); // 'Hi World Hi Universe' (global)
console.log(text.replace(/hello/i, 'Hi')); // 'Hi World Hello Universe' (case insensitive)

// With function replacement
const result = text.replace(/\b\w{5}\b/g, (match) => match.toUpperCase());
console.log(result); // 'HELLO WORLD HELLO Universe'

// Capture groups
const dateText = '2023-12-25';
const formatted = dateText.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1');
console.log(formatted); // '25/12/2023'

// Performance: O(n) for simple replacements, varies with regex
```

### replaceAll() (ES2021)
Replaces all occurrences of pattern with replacement.

```javascript
const text = 'Hello World Hello Universe';

// Replace all occurrences
console.log(text.replaceAll('Hello', 'Hi')); // 'Hi World Hi Universe'

// With regex (must use global flag)
console.log(text.replaceAll(/Hello/g, 'Hi')); // 'Hi World Hi Universe'

// Error if regex without global flag
// console.log(text.replaceAll(/Hello/, 'Hi')); // TypeError

// Before replaceAll(), you had to use replace with global regex
console.log(text.replace(/Hello/g, 'Hi')); // Same result

// Performance: O(n)
```

## Split and Join Operations

### split()
Splits string into array of substrings.

```javascript
const text = 'apple,banana,orange,grape';

// Split by delimiter
console.log(text.split(',')); // ['apple', 'banana', 'orange', 'grape']

// Split by regex
const sentence = 'Hello   world  JavaScript';
console.log(sentence.split(/\s+/)); // ['Hello', 'world', 'JavaScript']

// Limit number of splits
console.log(text.split(',', 2)); // ['apple', 'banana']

// Split into individual characters
const word = 'Hello';
console.log(word.split('')); // ['H', 'e', 'l', 'l', 'o']

// Split without delimiter returns array with original string
console.log(text.split()); // ['apple,banana,orange,grape']

// Empty string delimiter
console.log('abc'.split('')); // ['a', 'b', 'c']

// Performance: O(n)
```

## Whitespace and Padding Methods

### trim()
Removes whitespace from both ends.

```javascript
const text = '  Hello World  ';

console.log(text.trim()); // 'Hello World'
console.log(`"${text}"`); // "  Hello World  "
console.log(`"${text.trim()}"`); // "Hello World"

// Practical use case - form input validation
const userInput = '  john.doe@example.com  ';
const cleanEmail = userInput.trim().toLowerCase();
console.log(cleanEmail); // 'john.doe@example.com'

// Performance: O(n)
```

### trimStart() / trimLeft()
Removes whitespace from beginning.

```javascript
const text = '  Hello World  ';

console.log(text.trimStart()); // 'Hello World  '
console.log(text.trimLeft()); // 'Hello World  ' (alias for trimStart)

// Useful for preserving trailing spaces
const code = '    console.log("Hello");  ';
console.log(code.trimStart()); // 'console.log("Hello");  '

// Performance: O(n)
```

### trimEnd() / trimRight()
Removes whitespace from end.

```javascript
const text = '  Hello World  ';

console.log(text.trimEnd()); // '  Hello World'
console.log(text.trimRight()); // '  Hello World' (alias for trimEnd)

// Performance: O(n)
```

### padStart() (ES2017)
Pads string from start to specified length.

```javascript
const