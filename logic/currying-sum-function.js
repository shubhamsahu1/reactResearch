// Method 1: Using valueOf() - Most elegant solution
function sum(a) {
  let currentSum = a;
  
  function innerSum(b) {
    if (b === undefined) {
      return currentSum;
    }
    currentSum += b;
    return innerSum;
  }
  
  // Override valueOf to return the sum when converted to number
  innerSum.valueOf = function() {
    return currentSum;
  };
  
  // Override toString for string conversion
  innerSum.toString = function() {
    return currentSum.toString();
  };
  
  return innerSum;
}

// Usage
console.log(+sum(1)(2)(3)); // 6
console.log(+sum(1)(2)(3)(4)); // 10
console.log(+sum(5)(10)(15)(20)); // 50


// Method 2: With explicit call to get result
function sum2(a) {
  let total = a;
  
  function add(b) {
    if (b === undefined) {
      return total;
    }
    total += b;
    return add;
  }
  
  return add;
}

// Usage - call without arguments to get result
console.log(sum2(1)(2)(3)()); // 6
console.log(sum2(1)(2)(3)(4)()); // 10
console.log(sum2(5)(10)(15)()); // 40


// Method 3: Using Proxy (Advanced ES6 approach)
function sum3(initialValue = 0) {
  let total = initialValue;
  
  const handler = {
    get(target, prop) {
      if (prop === 'value') {
        return total;
      }
      if (prop === Symbol.toPrimitive || prop === 'valueOf') {
        return () => total;
      }
      if (prop === 'toString') {
        return () => total.toString();
      }
      return target[prop];
    },
    
    apply(target, thisArg, args) {
      total += args[0];
      return new Proxy(target, handler);
    }
  };
  
  return new Proxy(function() {}, handler);
}

// Usage
console.log(+sum3(1)(2)(3)); // 6
console.log(sum3(1)(2)(3).value); // 6


// Method 4: Simple recursive approach with explicit end
function sum4(...args) {
  const total = args.reduce((acc, val) => acc + val, 0);
  
  const curried = (...nextArgs) => {
    if (nextArgs.length === 0) {
      return total;
    }
    return sum4(total, ...nextArgs);
  };
  
  curried.valueOf = () => total;
  curried.toString = () => total.toString();
  
  return curried;
}

// Usage
console.log(+sum4(1)(2)(3)); // 6
console.log(+sum4(1, 2)(3, 4)(5)); // 15


// Method 5: Infinite currying with different syntax
function infiniteSum(a) {
  return function(b) {
    if (b !== undefined) {
      return infiniteSum(a + b);
    }
    return a;
  };
}

// Usage - call without arguments to get result
console.log(infiniteSum(1)(2)(3)()); // 6
console.log(infiniteSum(10)(20)(30)(40)()); // 100


// Testing all methods
console.log('\n--- Testing Method 1 (valueOf) ---');
console.log(+sum(1)(2)(3)(4)(5)); // 15
console.log(Number(sum(10)(20)(30))); // 60

console.log('\n--- Testing Method 2 (explicit call) ---');
console.log(sum2(1)(2)(3)(4)(5)()); // 15
console.log(sum2(10)(20)(30)()); // 60

console.log('\n--- Testing Method 3 (Proxy) ---');
console.log(+sum3(1)(2)(3)(4)(5)); // 15
console.log(sum3(10)(20)(30).value); // 60

console.log('\n--- Testing Method 4 (Recursive) ---');
console.log(+sum4(1)(2)(3)(4)(5)); // 15
console.log(+sum4(10)(20)(30)); // 60

console.log('\n--- Testing Method 5 (Infinite) ---');
console.log(infiniteSum(1)(2)(3)(4)(5)()); // 15
console.log(infiniteSum(10)(20)(30)()); // 60