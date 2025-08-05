# Complete Guide to JavaScript Object Methods

## Table of Contents
1. [Object Creation Methods](#object-creation-methods)
2. [Property Definition Methods](#property-definition-methods)
3. [Property Access Methods](#property-access-methods)
4. [Property Enumeration Methods](#property-enumeration-methods)
5. [Object Manipulation Methods](#object-manipulation-methods)
6. [Prototype Methods](#prototype-methods)
7. [Object State Methods](#object-state-methods)
8. [Comparison and Conversion Methods](#comparison-and-conversion-methods)

---

## Object Creation Methods

### Object.create()

**Purpose**: Creates a new object with the specified prototype object and properties.

**Syntax**: `Object.create(proto, [propertiesObject])`

```javascript
// Basic usage
const personPrototype = {
    greet() {
        return `Hello, I'm ${this.name}`;
    }
};

const person = Object.create(personPrototype);
person.name = "Alice";
console.log(person.greet()); // "Hello, I'm Alice"

// With property descriptors
const employee = Object.create(personPrototype, {
    name: {
        value: "Bob",
        writable: true,
        enumerable: true,
        configurable: true
    },
    id: {
        value: 123,
        writable: false,
        enumerable: true,
        configurable: false
    }
});

console.log(employee.name); // "Bob"
console.log(employee.id);   // 123
employee.id = 456;          // Won't change because writable: false
console.log(employee.id);   // 123

// Creating object with null prototype
const nullObject = Object.create(null);
console.log(nullObject.toString); // undefined (no inherited methods)

// Inheritance example
const animal = {
    type: "Animal",
    sound() {
        return "Some sound";
    }
};

const dog = Object.create(animal);
dog.type = "Dog";
dog.sound = function() {
    return "Woof!";
};

console.log(dog.sound()); // "Woof!"
console.log(Object.getPrototypeOf(dog) === animal); // true
```

---

## Property Definition Methods

### Object.defineProperty()

**Purpose**: Defines a new property directly on an object, or modifies an existing property.

**Syntax**: `Object.defineProperty(obj, prop, descriptor)`

```javascript
const obj = {};

// Define a simple property
Object.defineProperty(obj, 'name', {
    value: 'John',
    writable: true,
    enumerable: true,
    configurable: true
});

console.log(obj.name); // "John"

// Define a read-only property
Object.defineProperty(obj, 'id', {
    value: 123,
    writable: false,
    enumerable: true,
    configurable: true
});

obj.id = 456; // Won't change
console.log(obj.id); // 123

// Define a getter/setter property
let _age = 0;
Object.defineProperty(obj, 'age', {
    get() {
        console.log('Getting age');
        return _age;
    },
    set(value) {
        console.log(`Setting age to ${value}`);
        if (value >= 0) {
            _age = value;
        }
    },
    enumerable: true,
    configurable: true
});

obj.age = 25; // "Setting age to 25"
console.log(obj.age); // "Getting age", then 25

// Define non-enumerable property
Object.defineProperty(obj, 'secret', {
    value: 'hidden',
    writable: true,
    enumerable: false, // Won't show in for...in or Object.keys()
    configurable: true
});

console.log(Object.keys(obj)); // ['name', 'id', 'age'] (no 'secret')
console.log(obj.secret); // "hidden"

// Define computed property
Object.defineProperty(obj, 'displayName', {
    get() {
        return `${this.name} (ID: ${this.id})`;
    },
    enumerable: true,
    configurable: true
});

console.log(obj.displayName); // "John (ID: 123)"
```

### Object.defineProperties()

**Purpose**: Defines new or modifies existing properties directly on an object.

**Syntax**: `Object.defineProperties(obj, props)`

```javascript
const product = {};

Object.defineProperties(product, {
    name: {
        value: 'Laptop',
        writable: true,
        enumerable: true,
        configurable: true
    },
    price: {
        value: 999.99,
        writable: true,
        enumerable: true,
        configurable: true
    },
    category: {
        value: 'Electronics',
        writable: false,
        enumerable: true,
        configurable: true
    },
    // Computed property
    description: {
        get() {
            return `${this.name} in ${this.category} - $${this.price}`;
        },
        enumerable: true,
        configurable: true
    },
    // Private property
    _internalId: {
        value: Math.random().toString(36),
        writable: false,
        enumerable: false,
        configurable: false
    }
});

console.log(product.description); // "Laptop in Electronics - $999.99"
console.log(Object.keys(product)); // ['name', 'price', 'category', 'description']

// Validation example
const user = {};
Object.defineProperties(user, {
    email: {
        get() {
            return this._email;
        },
        set(value) {
            if (value.includes('@')) {
                this._email = value;
            } else {
                throw new Error('Invalid email format');
            }
        },
        enumerable: true,
        configurable: true
    },
    _email: {
        value: '',
        writable: true,
        enumerable: false,
        configurable: true
    }
});

user.email = 'user@example.com';
console.log(user.email); // "user@example.com"
// user.email = 'invalid'; // Throws Error: Invalid email format
```

---

## Property Access Methods

### Object.getOwnPropertyDescriptor()

**Purpose**: Returns a property descriptor for an own property of an object.

**Syntax**: `Object.getOwnPropertyDescriptor(obj, prop)`

```javascript
const obj = {
    name: 'Alice'
};

Object.defineProperty(obj, 'age', {
    value: 30,
    writable: false,
    enumerable: true,
    configurable: false
});

// Get descriptor for regular property
const nameDescriptor = Object.getOwnPropertyDescriptor(obj, 'name');
console.log(nameDescriptor);
/* {
    value: 'Alice',
    writable: true,
    enumerable: true,
    configurable: true
} */

// Get descriptor for defined property
const ageDescriptor = Object.getOwnPropertyDescriptor(obj, 'age');
console.log(ageDescriptor);
/* {
    value: 30,
    writable: false,
    enumerable: true,
    configurable: false
} */

// Non-existent property returns undefined
const nonExistent = Object.getOwnPropertyDescriptor(obj, 'height');
console.log(nonExistent); // undefined

// Getter/setter example
const circle = {};
Object.defineProperty(circle, 'radius', {
    get() { return this._radius; },
    set(value) { this._radius = value; },
    enumerable: true,
    configurable: true
});

const radiusDescriptor = Object.getOwnPropertyDescriptor(circle, 'radius');
console.log(radiusDescriptor);
/* {
    get: [Function: get],
    set: [Function: set],
    enumerable: true,
    configurable: true
} */
```

### Object.getOwnPropertyDescriptors()

**Purpose**: Returns all own property descriptors of an object.

**Syntax**: `Object.getOwnPropertyDescriptors(obj)`

```javascript
const person = {
    firstName: 'John',
    lastName: 'Doe'
};

Object.defineProperty(person, 'age', {
    value: 25,
    writable: false,
    enumerable: false,
    configurable: true
});

Object.defineProperty(person, 'fullName', {
    get() {
        return `${this.firstName} ${this.lastName}`;
    },
    enumerable: true,
    configurable: true
});

const descriptors = Object.getOwnPropertyDescriptors(person);
console.log(descriptors);
/* {
    firstName: {
        value: 'John',
        writable: true,
        enumerable: true,
        configurable: true
    },
    lastName: {
        value: 'Doe',
        writable: true,
        enumerable: true,
        configurable: true
    },
    age: {
        value: 25,
        writable: false,
        enumerable: false,
        configurable: true
    },
    fullName: {
        get: [Function: get],
        set: undefined,
        enumerable: true,
        configurable: true
    }
} */

// Useful for cloning objects with all descriptors
function cloneWithDescriptors(obj) {
    return Object.create(
        Object.getPrototypeOf(obj),
        Object.getOwnPropertyDescriptors(obj)
    );
}

const clonedPerson = cloneWithDescriptors(person);
console.log(clonedPerson.fullName); // "John Doe"
console.log(Object.getOwnPropertyDescriptor(clonedPerson, 'age').writable); // false
```

---

## Property Enumeration Methods

### Object.keys()

**Purpose**: Returns an array of a given object's own enumerable property names.

**Syntax**: `Object.keys(obj)`

```javascript
const student = {
    name: 'Alice',
    age: 20,
    grade: 'A'
};

Object.defineProperty(student, 'id', {
    value: 123,
    enumerable: false // Non-enumerable
});

console.log(Object.keys(student)); // ['name', 'age', 'grade']

// Array example
const numbers = [10, 20, 30];
console.log(Object.keys(numbers)); // ['0', '1', '2']

// String example
console.log(Object.keys('hello')); // ['0', '1', '2', '3', '4']

// Practical examples
const config = {
    host: 'localhost',
    port: 3000,
    ssl: false,
    timeout: 5000
};

// Iterate over configuration
Object.keys(config).forEach(key => {
    console.log(`${key}: ${config[key]}`);
});

// Filter properties
const settings = {
    theme: 'dark',
    language: 'en',
    notifications: true,
    _internal: 'private'
};

const publicSettings = Object.keys(settings)
    .filter(key => !key.startsWith('_'))
    .reduce((obj, key) => {
        obj[key] = settings[key];
        return obj;
    }, {});

console.log(publicSettings); // { theme: 'dark', language: 'en', notifications: true }
```

### Object.values()

**Purpose**: Returns an array of a given object's own enumerable property values.

**Syntax**: `Object.values(obj)`

```javascript
const scores = {
    math: 95,
    science: 87,
    english: 92,
    history: 89
};

console.log(Object.values(scores)); // [95, 87, 92, 89]

// Calculate average
const average = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.values(scores).length;
console.log(`Average score: ${average}`); // "Average score: 90.75"

// Array example
const fruits = ['apple', 'banana', 'orange'];
console.log(Object.values(fruits)); // ['apple', 'banana', 'orange']

// String example
console.log(Object.values('hello')); // ['h', 'e', 'l', 'l', 'o']

// Practical examples
const inventory = {
    laptops: 15,
    phones: 32,
    tablets: 8,
    accessories: 45
};

// Total items
const totalItems = Object.values(inventory).reduce((sum, count) => sum + count, 0);
console.log(`Total items: ${totalItems}`); // "Total items: 100"

// Find maximum value
const maxStock = Math.max(...Object.values(inventory));
console.log(`Highest stock: ${maxStock}`); // "Highest stock: 45"

// Check if any item is low stock
const lowStock = Object.values(inventory).some(count => count < 10);
console.log(`Has low stock items: ${lowStock}`); // "Has low stock items: true"
```

### Object.entries()

**Purpose**: Returns an array of a given object's own enumerable string-keyed property [key, value] pairs.

**Syntax**: `Object.entries(obj)`

```javascript
const person = {
    name: 'John',
    age: 30,
    city: 'New York',
    occupation: 'Developer'
};

console.log(Object.entries(person));
// [['name', 'John'], ['age', 30], ['city', 'New York'], ['occupation', 'Developer']]

// Convert to Map
const personMap = new Map(Object.entries(person));
console.log(personMap.get('name')); // "John"

// Iterate with destructuring
Object.entries(person).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
});

// Transform object
const uppercasedPerson = Object.entries(person).reduce((obj, [key, value]) => {
    obj[key.toUpperCase()] = typeof value === 'string' ? value.toUpperCase() : value;
    return obj;
}, {});

console.log(uppercasedPerson);
// { NAME: 'JOHN', AGE: 30, CITY: 'NEW YORK', OCCUPATION: 'DEVELOPER' }

// Filter and reconstruct object
const user = {
    id: 1,
    username: 'johndoe',
    email: 'john@example.com',
    password: 'secret123',
    role: 'user'
};

const publicUser = Object.entries(user)
    .filter(([key]) => key !== 'password')
    .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});

console.log(publicUser); // { id: 1, username: 'johndoe', email: 'john@example.com', role: 'user' }

// Array example
const colors = ['red', 'green', 'blue'];
console.log(Object.entries(colors)); // [['0', 'red'], ['1', 'green'], ['2', 'blue']]

// String example
console.log(Object.entries('abc')); // [['0', 'a'], ['1', 'b'], ['2', 'c']]
```

### Object.getOwnPropertyNames()

**Purpose**: Returns an array of all properties (enumerable or not) found directly on a given object.

**Syntax**: `Object.getOwnPropertyNames(obj)`

```javascript
const obj = {
    visible: 'I am enumerable',
    alsoVisible: 'Me too'
};

Object.defineProperty(obj, 'hidden', {
    value: 'I am not enumerable',
    enumerable: false
});

Object.defineProperty(obj, 'secret', {
    value: 'I am also not enumerable',
    enumerable: false
});

console.log(Object.keys(obj)); // ['visible', 'alsoVisible']
console.log(Object.getOwnPropertyNames(obj)); // ['visible', 'alsoVisible', 'hidden', 'secret']

// Array example
const arr = [1, 2, 3];
arr.customProp = 'custom';
console.log(Object.getOwnPropertyNames(arr)); // ['0', '1', '2', 'length', 'customProp']

// Function example
function myFunc() {}
myFunc.customProp = 'test';
console.log(Object.getOwnPropertyNames(myFunc)); 
// ['length', 'name', 'arguments', 'caller', 'prototype', 'customProp']

// Practical example: Debugging object properties
function debugObject(obj, name = 'Object') {
    console.log(`\n=== ${name} Properties ===`);
    
    const enumerable = Object.keys(obj);
    const nonEnumerable = Object.getOwnPropertyNames(obj).filter(prop => !enumerable.includes(prop));
    
    console.log('Enumerable properties:', enumerable);
    console.log('Non-enumerable properties:', nonEnumerable);
    
    // Show descriptors for non-enumerable properties
    nonEnumerable.forEach(prop => {
        const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
        console.log(`${prop}:`, descriptor);
    });
}

debugObject(obj, 'Test Object');
```

### Object.getOwnPropertySymbols()

**Purpose**: Returns an array of all symbol properties found directly on a given object.

**Syntax**: `Object.getOwnPropertySymbols(obj)`

```javascript
const obj = {};
const sym1 = Symbol('symbol1');
const sym2 = Symbol('symbol2');
const sym3 = Symbol.for('symbol3'); // Global symbol

obj[sym1] = 'value1';
obj[sym2] = 'value2';
obj[sym3] = 'value3';
obj.regularProp = 'regular';

console.log(Object.keys(obj)); // ['regularProp']
console.log(Object.getOwnPropertyNames(obj)); // ['regularProp']
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(symbol1), Symbol(symbol2), Symbol(symbol3)]

// Access symbol properties
Object.getOwnPropertySymbols(obj).forEach(sym => {
    console.log(`${sym.toString()}: ${obj[sym]}`);
});

// Practical example: Private-like properties using symbols
const _private = Symbol('private');
const _id = Symbol('id');

class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
        this[_private] = 'secret data';
        this[_id] = Math.random().toString(36);
    }
    
    getPrivateData() {
        return this[_private];
    }
    
    getId() {
        return this[_id];
    }
}

const user = new User('Alice', 'alice@example.com');
console.log(Object.keys(user)); // ['name', 'email']
console.log(Object.getOwnPropertySymbols(user)); // [Symbol(private), Symbol(id)]
console.log(user.getPrivateData()); // "secret data"

// Symbol-based metadata
const metadata = Symbol('metadata');
const cache = Symbol('cache');

const apiService = {
    endpoint: '/api/users',
    [metadata]: {
        version: '1.0',
        author: 'Dev Team'
    },
    [cache]: new Map(),
    
    getData() {
        return 'API data';
    }
};

console.log('Regular properties:', Object.keys(apiService)); // ['endpoint', 'getData']
console.log('Symbol properties:', Object.getOwnPropertySymbols(apiService)); // [Symbol(metadata), Symbol(cache)]
```

---

## Object Manipulation Methods

### Object.assign()

**Purpose**: Copies all enumerable own properties from one or more source objects to a target object.

**Syntax**: `Object.assign(target, ...sources)`

```javascript
// Basic usage
const target = { a: 1, b: 2 };
const source = { b: 3, c: 4 };

const result = Object.assign(target, source);
console.log(result); // { a: 1, b: 3, c: 4 }
console.log(target); // { a: 1, b: 3, c: 4 } (target is modified)

// Multiple sources
const obj1 = { a: 1 };
const obj2 = { b: 2 };
const obj3 = { c: 3 };

const merged = Object.assign({}, obj1, obj2, obj3);
console.log(merged); // { a: 1, b: 2, c: 3 }

// Cloning objects (shallow copy)
const original = {
    name: 'John',
    details: {
        age: 30,
        city: 'NYC'
    }
};

const cloned = Object.assign({}, original);
cloned.name = 'Jane'; // Changes only the clone
cloned.details.age = 25; // Changes both original and clone (shallow copy)

console.log(original.name); // "John"
console.log(original.details.age); // 25 (changed!)

// Merging with default values
function createUser(userData) {
    const defaults = {
        role: 'user',
        active: true,
        permissions: ['read']
    };
    
    return Object.assign({}, defaults, userData);
}

const user1 = createUser({ name: 'Alice', email: 'alice@example.com' });
console.log(user1);
// { role: 'user', active: true, permissions: ['read'], name: 'Alice', email: 'alice@example.com' }

const user2 = createUser({ name: 'Bob', role: 'admin', permissions: ['read', 'write'] });
console.log(user2);
// { role: 'admin', active: true, permissions: ['read', 'write'], name: 'Bob' }

// Practical example: Configuration merging
const defaultConfig = {
    host: 'localhost',
    port: 3000,
    ssl: false,
    timeout: 5000,
    retries: 3
};

const userConfig = {
    host: 'api.example.com',
    ssl: true,
    timeout: 10000
};

const finalConfig = Object.assign({}, defaultConfig, userConfig);
console.log(finalConfig);
// { host: 'api.example.com', port: 3000, ssl: true, timeout: 10000, retries: 3 }

// Only copies enumerable properties
const source2 = { a: 1 };
Object.defineProperty(source2, 'b', {
    value: 2,
    enumerable: false
});

const target2 = Object.assign({}, source2);
console.log(target2); // { a: 1 } (b is not copied because it's non-enumerable)
```

### Object.freeze()

**Purpose**: Freezes an object: other code can't delete or change its properties.

**Syntax**: `Object.freeze(obj)`

```javascript
const obj = {
    name: 'Alice',
    age: 30,
    details: {
        city: 'NYC',
        country: 'USA'
    }
};

Object.freeze(obj);

// Attempting to modify properties
obj.name = 'Bob'; // Silently fails in non-strict mode
obj.newProp = 'new'; // Silently fails
delete obj.age; // Silently fails

console.log(obj); // { name: 'Alice', age: 30, details: { city: 'NYC', country: 'USA' } }

// Check if object is frozen
console.log(Object.isFrozen(obj)); // true

// Nested objects are not frozen (shallow freeze)
obj.details.city = 'LA'; // This works!
console.log(obj.details.city); // "LA"

// Deep freeze implementation
function deepFreeze(obj) {
    // Get property names
    const propNames = Object.getOwnPropertyNames(obj);
    
    // Freeze properties before freezing self
    propNames.forEach(name => {
        const value = obj[name];
        if (value && typeof value === 'object') {
            deepFreeze(value);
        }
    });
    
    return Object.freeze(obj);
}

const deepObj = {
    level1: {
        level2: {
            value: 'test'
        }
    }
};

deepFreeze(deepObj);
deepObj.level1.level2.value = 'changed'; // Silently fails
console.log(deepObj.level1.level2.value); // "test"

// Practical example: Constants
const API_ENDPOINTS = Object.freeze({
    USERS: '/api/users',
    PRODUCTS: '/api/products',
    ORDERS: '/api/orders'
});

// API_ENDPOINTS.USERS = '/new/path'; // Won't work

// Freezing arrays
const numbers = [1, 2, 3, 4, 5];
Object.freeze(numbers);

numbers.push(6); // TypeError in strict mode, silently fails in non-strict
numbers[0] = 10; // Won't work
console.log(numbers); // [1, 2, 3, 4, 5]

// Configuration object
const CONFIG = Object.freeze({
    VERSION: '1.0.0',
    MAX_RETRIES: 3,
    TIMEOUT: 5000,
    ENDPOINTS: Object.freeze({
        API: 'https://api.example.com',
        AUTH: 'https://auth.example.com'
    })
});
```

### Object.seal()

**Purpose**: Seals an object, preventing new properties from being added and marking all existing properties as non-configurable.

**Syntax**: `Object.seal(obj)`

```javascript
const obj = {
    name: 'Alice',
    age: 30
};

Object.seal(obj);

// Can modify existing properties
obj.name = 'Bob'; // This works
obj.age = 25; // This works

// Cannot add new properties
obj.email = 'bob@example.com'; // Silently fails
console.log(obj.email); // undefined

// Cannot delete properties
delete obj.age; // Silently fails
console.log(obj.age); // 25

// Cannot reconfigure properties
Object.defineProperty(obj, 'name', {
    enumerable: false
}); // TypeError: Cannot redefine property

console.log(Object.isSealed(obj)); // true
console.log(Object.keys(obj)); // ['name', 'age']

// Comparison with freeze
const frozenObj = Object.freeze({ x: 1 });
const sealedObj = Object.seal({ x: 1 });

frozenObj.x = 2; // Won't work
sealedObj.x = 2; // Works

console.log(frozenObj.x); // 1
console.log(sealedObj.x); // 2

// Practical example: Protecting object structure while allowing value changes
class Counter {
    constructor(initialValue = 0) {
        this.value = initialValue;
        this.increment = () => this.value++;
        this.decrement = () => this.value--;
        this.reset = () => this.value = 0;
        
        // Seal to prevent adding/removing methods but allow value changes
        Object.seal(this);
    }
}

const counter = new Counter(5);
counter.value = 10; // Works
counter.increment(); // Works
console.log(counter.value); // 11

counter.newMethod = () => {}; // Won't work
delete counter.increment; // Won't work

// Array sealing
const arr = [1, 2, 3];
Object.seal(arr);

arr[0] = 10; // Works
arr.push(4); // TypeError: Cannot add property 3
arr.length = 2; // Works (modifying existing property)
console.log(arr); // [10, 2]
```

### Object.preventExtensions()

**Purpose**: Prevents new properties from being added to an object.

**Syntax**: `Object.preventExtensions(obj)`

```javascript
const obj = {
    name: 'Alice',
    age: 30
};

Object.preventExtensions(obj);

// Can modify existing properties
obj.name = 'Bob'; // Works
obj.age = 25; // Works

// Cannot add new properties
obj.email = 'bob@example.com'; // Silently fails
console.log(obj.email); // undefined

// Can delete existing properties (unlike seal)
delete obj.age; // Works
console.log(obj); // { name: 'Bob' }

// Can reconfigure existing properties (unlike seal)
Object.defineProperty(obj, 'name', {
    enumerable: false
}); // Works

console.log(Object.isExtensible(obj)); // false

// Practical example: Plugin system with fixed API
class PluginManager {
    constructor() {
        this.plugins = [];
        this.register = (plugin) => this.plugins.push(plugin);
        this.unregister = (name) => {
            this.plugins = this.plugins.filter(p => p.name !== name);
        };
        this.execute = (name, ...args) => {
            const plugin = this.plugins.find(p => p.name === name);
            return plugin ? plugin.execute(...args) : null;
        };
        
        // Prevent adding new methods but allow internal modifications
        Object.preventExtensions(this);
    }
}

const manager = new PluginManager();
manager.register({ name: 'logger', execute: (msg) => console.log(msg) });

// This works - modifying existing property
manager.plugins.push({ name: 'validator', execute: (data) => !!data });

// This won't work - adding new property
manager.newMethod = () => {}; // Silently fails

console.log(manager.plugins.length); // 2
console.log('newMethod' in manager); // false

// Comparison of restriction levels
const obj1 = { x: 1 };
const obj2 = { x: 1 };
const obj3 = { x: 1 };

Object.preventExtensions(obj1);
Object.seal(obj2);
Object.freeze(obj3);

// Adding properties
obj1.y = 2; // Fails
obj2.y = 2; // Fails
obj3.y = 2; // Fails

// Modifying properties
obj1.x = 2; // Works
obj2.x = 2; // Works
obj3.x = 2; // Fails

// Deleting properties
delete obj1.x; // Works
delete obj2.x; // Fails
delete obj3.x; // Fails

console.log(obj1); // {}
console.log(obj2); // { x: 2 }
console.log(obj3); // { x: 1 }
```

---

## Prototype Methods

### Object.getPrototypeOf()

**Purpose**: Returns the prototype (i.e., the value of the internal [[Prototype]] property) of the specified object.

**Syntax**: `Object.getPrototypeOf(obj)`

```javascript
// Basic usage
const obj = {};
console.log(Object.getPrototypeOf(obj) === Object.prototype); // true

const arr = [];
console.log(Object.getPrototypeOf(arr) === Array.prototype); // true

// Function prototype
function Person(name) {
    this.name = name;
}

Person.prototype.greet = function() {
    return `Hello, I'm ${this.name}`;
};

const person = new Person('Alice');
console.log(Object.getPrototypeOf(person) === Person.prototype); // true
console.log(person.greet()); // "Hello, I'm Alice"

// Inheritance chain
const animal = {
    type: 'Animal',
    sound() {
        return 'Some sound';
    }
};

const dog = Object.create(animal);
dog.breed = 'Labrador';

console.log(Object.getPrototypeOf(dog) === animal); // true
console.log(Object.getPrototypeOf(animal) === Object.prototype); // true

// Class inheritance
class Vehicle {
    constructor(type) {
        this.type = type;
    }
    
    start() {
        return `${this.type} is starting`;
    }
}

class Car extends Vehicle {
    constructor(brand, model) {
        super('Car');
        this.brand = brand;
        this.model = model;
    }
}

const myCar = new Car('Toyota', 'Camry');
console.log(Object.getPrototypeOf(myCar) === Car.prototype); // true
console.log(Object.getPrototypeOf(Car.prototype) === Vehicle.prototype); // true

// Null prototype
const nullObj = Object.create(null);
console.log(Object.getPrototypeOf(nullObj)); // null

// Practical example: Prototype chain inspection
function inspectPrototypeChain(obj) {
    const chain = [];
    let current = obj;
    
    while (current !== null) {
        chain.push(current.constructor ? current.constructor.name : 'Object');
        current = Object.getPrototypeOf(current);
    }
    
    return chain;
}

console.log(inspectPrototypeChain(myCar)); // ['Car', 'Vehicle', 'Object']
console.log(inspectPrototypeChain([])); // ['Array', 'Object']
console.log(inspectPrototypeChain('')); // ['String', 'Object']

// Method resolution
function findMethod(obj, methodName) {
    let current = obj;
    
    while (current !== null) {
        if (current.hasOwnProperty(methodName)) {
            return {
                found: true,
                location: current.constructor ? current.constructor.name : 'Object',
                method: current[methodName]
            };
        }
        current = Object.getPrototypeOf(current);
    }
    
    return { found: false };
}

const result = findMethod(myCar, 'start');
console.log(result); // { found: true, location: 'Vehicle', method: [Function] }
```

### Object.setPrototypeOf()

**Purpose**: Sets the prototype (i.e., the internal [[Prototype]] property) of a specified object.

**Syntax**: `Object.setPrototypeOf(obj, prototype)`

```javascript
// Basic usage
const obj = {};
const proto = { x: 10 };

Object.setPrototypeOf(obj, proto);
console.log(obj.x); // 10
console.log(Object.getPrototypeOf(obj) === proto); // true

// Dynamic inheritance
const animal = {
    type: 'Animal',
    sound() {
        return `${this.name} makes a sound`;
    }
};

const bird = {
    type: 'Bird',
    sound() {
        return `${this.name} chirps`;
    },
    fly() {
        return `${this.name} is flying`;
    }
};

const pet = {
    name: 'Buddy'
};

// Initially, pet inherits from Object
console.log(pet.sound); // undefined

// Change prototype to animal
Object.setPrototypeOf(pet, animal);
console.log(pet.sound()); // "Buddy makes a sound"

// Change prototype to bird
Object.setPrototypeOf(pet, bird);
console.log(pet.sound()); // "Buddy chirps"
console.log(pet.fly()); // "Buddy is flying"

// Mixin pattern
const CanWalk = {
    walk() {
        return `${this.name} is walking`;
    }
};

const CanSwim = {
    swim() {
        return `${this.name} is swimming`;
    }
};

const CanFly = {
    fly() {
        return `${this.name} is flying`;
    }
};

// Create a duck with multiple abilities
const duck = { name: 'Donald' };

// Chain prototypes for multiple inheritance-like behavior
Object.setPrototypeOf(CanFly, CanSwim);
Object.setPrototypeOf(CanSwim, CanWalk);
Object.setPrototypeOf(duck, CanFly);

console.log(duck.walk()); // "Donald is walking"
console.log(duck.swim()); // "Donald is swimming"
console.log(duck.fly()); // "Donald is flying"

// Performance warning: Changing prototypes is slow
// Better to use Object.create() when possible
console.warn('Object.setPrototypeOf() can be slow. Prefer Object.create() when possible.');

// Practical example: Plugin system
class BasePlugin {
    constructor(name) {
        this.name = name;
        this.enabled = true;
    }
    
    enable() {
        this.enabled = true;
    }
    
    disable() {
        this.enabled = false;
    }
}

class LoggerPlugin extends BasePlugin {
    log(message) {
        if (this.enabled) {
            console.log(`[${this.name}] ${message}`);
        }
    }
}

// Upgrade existing object to have plugin capabilities
const existingObject = {
    data: 'some data'
};

// Add plugin functionality
Object.setPrototypeOf(existingObject, LoggerPlugin.prototype);
LoggerPlugin.call(existingObject, 'DataLogger');

existingObject.log('Data processed'); // "[DataLogger] Data processed"

// Prototype switching for state pattern
const stateA = {
    behavior() {
        return 'Behaving like state A';
    }
};

const stateB = {
    behavior() {
        return 'Behaving like state B';
    }
};

const stateMachine = {};

function switchState(machine, state) {
    Object.setPrototypeOf(machine, state);
}

switchState(stateMachine, stateA);
console.log(stateMachine.behavior()); // "Behaving like state A"

switchState(stateMachine, stateB);
console.log(stateMachine.behavior()); // "Behaving like state B"
```

### Object.isPrototypeOf()

**Purpose**: Checks if an object exists in another object's prototype chain.

**Syntax**: `prototypeObj.isPrototypeOf(object)`

```javascript
// Basic usage
const animal = {
    type: 'Animal'
};

const dog = Object.create(animal);
console.log(animal.isPrototypeOf(dog)); // true
console.log(Object.prototype.isPrototypeOf(dog)); // true

// Constructor functions
function Vehicle(type) {
    this.type = type;
}

function Car(brand) {
    Vehicle.call(this, 'Car');
    this.brand = brand;
}

Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.constructor = Car;

const myCar = new Car('Toyota');

console.log(Vehicle.prototype.isPrototypeOf(myCar)); // true
console.log(Car.prototype.isPrototypeOf(myCar)); // true
console.log(Object.prototype.isPrototypeOf(myCar)); // true

// Classes
class Animal {
    constructor(name) {
        this.name = name;
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);
        this.breed = breed;
    }
}

const myDog = new Dog('Buddy', 'Labrador');

console.log(Dog.prototype.isPrototypeOf(myDog)); // true
console.log(Animal.prototype.isPrototypeOf(myDog)); // true
console.log(Object.prototype.isPrototypeOf(myDog)); // true

// Built-in types
const arr = [1, 2, 3];
const str = 'hello';
const num = 42;

console.log(Array.prototype.isPrototypeOf(arr)); // true
console.log(String.prototype.isPrototypeOf(str)); // true
console.log(Number.prototype.isPrototypeOf(num)); // true

// Null prototype
const nullObj = Object.create(null);
console.log(Object.prototype.isPrototypeOf(nullObj)); // false

// Practical example: Type checking utility
function getTypeHierarchy(obj) {
    const hierarchy = [];
    
    // Check built-in types
    const types = [
        [Array.prototype, 'Array'],
        [String.prototype, 'String'],
        [Number.prototype, 'Number'],
        [Boolean.prototype, 'Boolean'],
        [Date.prototype, 'Date'],
        [RegExp.prototype, 'RegExp'],
        [Function.prototype, 'Function']
    ];
    
    types.forEach(([prototype, name]) => {
        if (prototype.isPrototypeOf(obj)) {
            hierarchy.push(name);
        }
    });
    
    if (Object.prototype.isPrototypeOf(obj)) {
        hierarchy.push('Object');
    }
    
    return hierarchy;
}

console.log(getTypeHierarchy([])); // ['Array', 'Object']
console.log(getTypeHierarchy('test')); // ['String', 'Object']
console.log(getTypeHierarchy(new Date())); // ['Date', 'Object']

// Validation function
function validateInstance(obj, expectedClass) {
    if (!expectedClass.prototype.isPrototypeOf(obj)) {
        throw new Error(`Expected instance of ${expectedClass.name}, got ${obj.constructor.name}`);
    }
    return true;
}

try {
    validateInstance(myCar, Car); // OK
    validateInstance(myCar, Vehicle); // OK
    validateInstance(myCar, Animal); // Throws error
} catch (error) {
    console.log(error.message); // "Expected instance of Animal, got Car"
}

// Mixin detection
const Flyable = {
    fly() {
        return 'Flying';
    }
};

const Swimmable = {
    swim() {
        return 'Swimming';
    }
};

const duck = Object.create(Flyable);
Object.setPrototypeOf(Flyable, Swimmable);

console.log(Flyable.isPrototypeOf(duck)); // true
console.log(Swimmable.isPrototypeOf(duck)); // true

function canFly(obj) {
    return Flyable.isPrototypeOf(obj);
}

function canSwim(obj) {
    return Swimmable.isPrototypeOf(obj);
}

console.log(canFly(duck)); // true
console.log(canSwim(duck)); // true
```

---

## Object State Methods

### Object.isFrozen()

**Purpose**: Determines if an object is frozen.

**Syntax**: `Object.isFrozen(obj)`

```javascript
// Basic usage
const obj = { x: 1 };
console.log(Object.isFrozen(obj)); // false

Object.freeze(obj);
console.log(Object.isFrozen(obj)); // true

// Empty object is considered frozen
const empty = {};
console.log(Object.isFrozen(empty)); // false
Object.freeze(empty);
console.log(Object.isFrozen(empty)); // true

// Non-extensible but not frozen
const obj2 = { x: 1 };
Object.preventExtensions(obj2);
console.log(Object.isFrozen(obj2)); // false (can still modify existing properties)

// Sealed but not frozen
const obj3 = { x: 1 };
Object.seal(obj3);
console.log(Object.isFrozen(obj3)); // false (can still modify existing properties)

// Array example
const arr = [1, 2, 3];
console.log(Object.isFrozen(arr)); // false
Object.freeze(arr);
console.log(Object.isFrozen(arr)); // true

// Practical example: Configuration validation
function createConfig(options) {
    const config = Object.assign({
        host: 'localhost',
        port: 3000,
        ssl: false
    }, options);
    
    return Object.freeze(config);
}

function validateConfig(config) {
    if (!Object.isFrozen(config)) {
        throw new Error('Configuration must be frozen to prevent accidental modifications');
    }
    
    // Additional validation...
    return true;
}

const config = createConfig({ host: 'api.example.com' });
console.log(validateConfig(config)); // true

// State management example
class ImmutableState {
    constructor(initialState) {
        this._state = Object.freeze({ ...initialState });
    }
    
    getState() {
        return this._state;
    }
    
    setState(updates) {
        if (Object.isFrozen(this._state)) {
            this._state = Object.freeze({
                ...this._state,
                ...updates
            });
        } else {
            throw new Error('State corruption detected - state is not frozen');
        }
    }
    
    isStateFrozen() {
        return Object.isFrozen(this._state);
    }
}

const state = new ImmutableState({ count: 0, user: null });
console.log(state.isStateFrozen()); // true
state.setState({ count: 1 });
console.log(state.getState()); // { count: 1, user: null }
```

### Object.isSealed()

**Purpose**: Determines if an object is sealed.

**Syntax**: `Object.isSealed(obj)`

```javascript
// Basic usage
const obj = { x: 1 };
console.log(Object.isSealed(obj)); // false

Object.seal(obj);
console.log(Object.isSealed(obj)); // true

// Frozen objects are also sealed
const frozenObj = Object.freeze({ y: 2 });
console.log(Object.isSealed(frozenObj)); // true

// Empty object
const empty = {};
console.log(Object.isSealed(empty)); // false
Object.seal(empty);
console.log(Object.isSealed(empty)); // true

// Non-extensible but not sealed
const obj2 = { x: 1 };
Object.preventExtensions(obj2);
console.log(Object.isSealed(obj2)); // false

// Make it sealed by making all properties non-configurable
Object.defineProperty(obj2, 'x', { configurable: false });
console.log(Object.isSealed(obj2)); // true

// Practical example: API response protection
class APIResponse {
    constructor(data, status = 200) {
        this.data = data;
        this.status = status;
        this.timestamp = new Date().toISOString();
        
        // Seal to prevent structure changes but allow value updates
        Object.seal(this);
    }
    
    updateData(newData) {
        if (Object.isSealed(this)) {
            // Can only update existing properties
            this.data = newData;
            this.timestamp = new Date().toISOString();
        }
    }
    
    isProtected() {
        return Object.isSealed(this);
    }
}

const response = new APIResponse({ users: [] });
console.log(response.isProtected()); // true

response.updateData({ users: [{ id: 1, name: 'Alice' }] }); // Works
response.extraField = 'not allowed'; // Silently fails

console.log(response.data); // { users: [{ id: 1, name: 'Alice' }] }
console.log(response.extraField); // undefined

// Validation utility
function checkObjectState(obj) {
    return {
        extensible: Object.isExtensible(obj),
        sealed: Object.isSealed(obj),
        frozen: Object.isFrozen(obj)
    };
}

const testObj = { a: 1, b: 2 };
console.log('Initial:', checkObjectState(testObj));
// { extensible: true, sealed: false, frozen: false }

Object.preventExtensions(testObj);
console.log('After preventExtensions:', checkObjectState(testObj));
// { extensible: false, sealed: false, frozen: false }

Object.seal(testObj);
console.log('After seal:', checkObjectState(testObj));
// { extensible: false, sealed: true, frozen: false }

Object.freeze(testObj);
console.log('After freeze:', checkObjectState(testObj));
// { extensible: false, sealed: true, frozen: true }
```

### Object.isExtensible()

**Purpose**: Determines if an object is extensible (whether new properties can be added to it).

**Syntax**: `Object.isExtensible(obj)`

```javascript
// Basic usage
const obj = { x: 1 };
console.log(Object.isExtensible(obj)); // true

Object.preventExtensions(obj);
console.log(Object.isExtensible(obj)); // false

// Sealed objects are not extensible
const sealedObj = Object.seal({ y: 2 });
console.log(Object.isExtensible(sealedObj)); // false

// Frozen objects are not extensible
const frozenObj = Object.freeze({ z: 3 });
console.log(Object.isExtensible(frozenObj)); // false

// Arrays
const arr = [1, 2, 3];
console.log(Object.isExtensible(arr)); // true

Object.preventExtensions(arr);
console.log(Object.isExtensible(arr)); // false

// Functions
function myFunc() {}
console.log(Object.isExtensible(myFunc)); // true

myFunc.customProp = 'test';
console.log(myFunc.customProp); // "test"

Object.preventExtensions(myFunc);
myFunc.anotherProp = 'test2'; // Silently fails
console.log(myFunc.anotherProp); // undefined

// Practical example: Secure object builder
class SecureBuilder {
    constructor() {
        this._properties = {};
        this._locked = false;
    }
    
    addProperty(key, value) {
        if (this._locked) {
            throw new Error('Builder is locked - cannot add more properties');
        }
        this._properties[key] = value;
        return this;
    }
    
    lock() {
        this._locked = true;
        Object.preventExtensions(this._properties);
        return this;
    }
    
    build() {
        if (Object.isExtensible(this._properties)) {
            console.warn('Building unlocked object - consider calling lock() first');
        }
        return { ...this._properties };
    }
    
    isLocked() {
        return !Object.isExtensible(this._properties);
    }
}

const builder = new SecureBuilder();
builder.addProperty('name', 'Alice')
       .addProperty('age', 30)
       .lock();

console.log(builder.isLocked()); // true

try {
    builder.addProperty('email', 'alice@example.com'); // Throws error
} catch (error) {
    console.log(error.message); // "Builder is locked - cannot add more properties"
}

// Plugin system with controlled extensibility
class PluginManager {
    constructor() {
        this.plugins = new Map();
        this._allowNewPlugins = true;
    }
    
    register(name, plugin) {
        if (!this._allowNewPlugins && !this.plugins.has(name)) {
            throw new Error('New plugin registration is disabled');
        }
        this.plugins.set(name, plugin);
    }
    
    lockRegistration() {
        this._allowNewPlugins = false;
        Object.preventExtensions(this);
    }
    
    canAddNewPlugins() {
        return this._allowNewPlugins && Object.isExtensible(this);
    }
}

const manager = new PluginManager();
manager.register('logger', { log: (msg) => console.log(msg) });

console.log(manager.canAddNewPlugins()); // true

manager.lockRegistration();
console.log(manager.canAddNewPlugins()); // false

// Extensibility state tracker
function trackExtensibilityChanges(obj, name) {
    console.log(`${name} initial extensibility:`, Object.isExtensible(obj));
    
    const original = {
        preventExtensions: Object.preventExtensions,
        seal: Object.seal,
        freeze: Object.freeze
    };
    
    // Override methods to track changes
    Object.preventExtensions = function(target) {
        if (target === obj) {
            console.log(`${name} extensibility changed by preventExtensions`);
        }
        return original.preventExtensions(target);
    };
    
    Object.seal = function(target) {
        if (target === obj) {
            console.log(`${name} extensibility changed by seal`);
        }
        return original.seal(target);
    };
    
    Object.freeze = function(target) {
        if (target === obj) {
            console.log(`${name} extensibility changed by freeze`);
        }
        return original.freeze(target);
    };
}

const trackedObj = { test: 'value' };
trackExtensibilityChanges(trackedObj, 'TrackedObject');

Object.preventExtensions(trackedObj); // Logs: "TrackedObject extensibility changed by preventExtensions"
```

---

## Comparison and Conversion Methods

### Object.is()

**Purpose**: Determines whether two values are the same value.

**Syntax**: `Object.is(value1, value2)`

```javascript
// Basic comparisons
console.log(Object.is(25, 25)); // true
console.log(Object.is('foo', 'foo')); // true
console.log(Object.is('foo', 'bar')); // false
console.log(Object.is(null, null)); // true
console.log(Object.is(undefined, undefined)); // true

// Difference from === operator
console.log(Object.is(0, -0)); // false
console.log(0 === -0); // true

console.log(Object.is(NaN, NaN)); // true
console.log(NaN === NaN); // false

console.log(Object.is(Number.NaN, NaN)); // true
console.log(Number.NaN === NaN); // false

// Object comparisons (reference equality)
const obj1 = { x: 1 };
const obj2 = { x: 1 };
const obj3 = obj1;

console.log(Object.is(obj1, obj2)); // false (different objects)
console.log(Object.is(obj1, obj3)); // true (same reference)

// Array comparisons
const arr1 = [1, 2, 3];
const arr2 = [1, 2, 3];
const arr3 = arr1;

console.log(Object.is(arr1, arr2)); // false
console.log(Object.is(arr1, arr3)); // true

// Special cases
console.log(Object.is(+0, -0)); // false
console.log(Object.is(-0, -0)); // true
console.log(Object.is(Infinity, Infinity)); // true
console.log(Object.is(-Infinity, -Infinity)); // true
console.log(Object.is(Infinity, -Infinity)); // false

// Practical example: Deep equality checker
function deepEqual(a, b) {
    // Use Object.is for primitive comparison
    if (Object.is(a, b)) {
        return true;
    }
    
    // Check for null/undefined
    if (a == null || b == null) {
        return false;
    }
    
    // Check if both are objects
    if (typeof a !== 'object' || typeof b !== 'object') {
        return false;
    }
    
    // Check if both are arrays
    if (Array.isArray(a) !== Array.isArray(b)) {
        return false;
    }
    
    // Get keys
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    // Check key count
    if (keysA.length !== keysB.length) {
        return false;
    }
    
    // Check each key and value
    for (let key of keysA) {
        if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
            return false;
        }
    }
    
    return true;
}

console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })); // true
console.log(deepEqual([1, [2, 3]], [1, [2, 3]])); // true
console.log(deepEqual({ a: NaN }, { a: NaN })); // true (handles NaN correctly)

// Value comparison utility
function compareValues(a, b) {
    return {
        objectIs: Object.is(a, b),
        strictEqual: a === b,
        looseEqual: a == b,
        bothNaN: Number.isNaN(a) && Number.isNaN(b),
        bothZero: (a === 0) && (b === 0),
        sameSign: Math.sign(a) === Math.sign(b)
    };
}

console.log(compareValues(NaN, NaN));
// { objectIs: true, strictEqual: false, looseEqual: false, bothNaN: true, bothZero: false, sameSign: false }

console.log(compareValues(0, -0));
// { objectIs: false, strictEqual: true, looseEqual: true, bothNaN: false, bothZero: true, sameSign: false }

// Array includes with Object.is semantics
function includesWithObjectIs(array, searchElement) {
    return array.some(element => Object.is(element, searchElement));
}

const testArray = [1, 2, NaN, 4, -0];
console.log(testArray.includes(NaN)); // false (regular includes doesn't find NaN)
console.log(includesWithObjectIs(testArray, NaN)); // true

console.log(testArray.includes(-0)); // true
console.log(testArray.includes(0)); // true (because 0 === -0)
console.log(includesWithObjectIs(testArray, 0)); // false (because Object.is(0, -0) is false)

// Map key comparison
const map1 = new Map();
const map2 = new Map();

// Map uses Object.is semantics for key comparison
map1.set(NaN, 'NaN value');
map1.set(0, 'zero value');
map1.set(-0, 'negative zero value');

console.log(map1.get(NaN)); // "NaN value"
console.log(map1.get(0)); // "zero value" 
console.log(map1.get(-0)); // "zero value" (0 and -0 are the same key in Map)

// Set membership
const set = new Set();
set.add(NaN);
set.add(0);
set.add(-0); // Won't add because 0 and -0 are considered the same

console.log(set.has(NaN)); // true
console.log(set.size); // 2 (NaN and 0/-0)
```

### Object.hasOwnProperty()

**Purpose**: Returns a boolean indicating whether the object has the specified property as its own property.

**Note**: This is actually a method on Object.prototype, but commonly used for object property checking.

```javascript
// Basic usage
const obj = {
    name: 'Alice',
    age: 30
};

console.log(obj.hasOwnProperty('name')); // true
console.log(obj.hasOwnProperty('age')); // true
console.log(obj.hasOwnProperty('toString')); // false (inherited from Object.prototype)

// Prototype chain example
const parent = { inherited: 'value' };
const child = Object.create(parent);
child.own = 'child value';

console.log(child.hasOwnProperty('own')); // true
console.log(child.hasOwnProperty('inherited')); // false (inherited property)
console.log('inherited' in child); // true (in operator checks prototype chain)

// Safe hasOwnProperty usage
// Problem: objects with null prototype don't have hasOwnProperty
const nullObj = Object.create(null);
nullObj.prop = 'value';

// This would throw an error:
// console.log(nullObj.hasOwnProperty('prop')); // TypeError

// Safe approaches:
console.log(Object.prototype.hasOwnProperty.call(nullObj, 'prop')); // true
console.log(Object.hasOwn(nullObj, 'prop')); // true (ES2022)

// Practical example: Object filtering
function filterOwnProperties(obj) {
    const filtered = {};
    
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            filtered[key] = obj[key];
        }
    }
    
    return filtered;
}

const parentObj = { shared: 'inherited' };
const testObj = Object.create(parentObj);
testObj.own1 = 'value1';
testObj.own2 = 'value2';

console.log(filterOwnProperties(testObj)); // { own1: 'value1', own2: 'value2' }

// JSON serialization comparison
function objectToJSON(obj) {
    const result = {};
    
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[key] = obj[key];
        }
    }
    
    return JSON.stringify(result);
}

console.log(objectToJSON(testObj)); // '{"own1":"value1","own2":"value2"}'
console.log(JSON.stringify(testObj)); // '{"own1":"value1","own2":"value2"}' (same result)

// Property counting
function countOwnProperties(obj) {
    let count = 0;
    
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            count++;
        }
    }
    
    return count;
}

console.log(countOwnProperties(testObj)); // 2
console.log(Object.keys(testObj).length); // 2 (equivalent)

// Secure property checking
function secureHasOwnProperty(obj, prop) {
    // Handles objects with null prototype and potential hasOwnProperty overrides
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

// Example with overridden hasOwnProperty
const trickObj = {
    hasOwnProperty: () => false, // Overridden!
    realProp: 'value'
};

console.log(trickObj.hasOwnProperty('realProp')); // false (lying!)
console.log(secureHasOwnProperty(trickObj, 'realProp')); // true (correct)

// Class property checking
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        return `Hello, I'm ${this.name}`;
    }
}

const person = new Person('Bob', 25);
console.log(person.hasOwnProperty('name')); // true
console.log(person.hasOwnProperty('age')); // true
console.log(person.hasOwnProperty('greet')); // false (method is on prototype)
console.log(Person.prototype.hasOwnProperty('greet')); // true

// Modern alternative: Object.hasOwn() (ES2022)
if (Object.hasOwn) {
    console.log(Object.hasOwn(person, 'name')); // true
    console.log(Object.hasOwn(nullObj, 'prop')); // true
}
```

### Object.propertyIsEnumerable()

**Purpose**: Returns a boolean indicating whether the specified property is enumerable and is the object's own property.

```javascript
// Basic usage
const obj = {
    enumerable: 'visible',
    alsoEnumerable: 'also visible'
};

Object.defineProperty(obj, 'notEnumerable', {
    value: 'hidden',
    enumerable: false
});

console.log(obj.propertyIsEnumerable('enumerable')); // true
console.log(obj.propertyIsEnumerable('notEnumerable')); // false
console.log(obj.propertyIsEnumerable('toString')); // false (inherited)

// Array properties
const arr = ['a', 'b', 'c'];
arr.customProp = 'custom';

console.log(arr.propertyIsEnumerable(0)); // true (array indices are enumerable)
console.log(arr.propertyIsEnumerable('length')); // false (length is not enumerable)
console.log(arr.propertyIsEnumerable('customProp')); // true

// Object.keys() vs propertyIsEnumerable
function getEnumerableProperties(obj) {
    const enumerable = [];
    
    for (let key in obj) {
        if (obj.propertyIsEnumerable(key)) {
            enumerable.push(key);
        }
    }
    
    return enumerable;
}

const testObj = Object.create({ inherited: 'parent' });
testObj.own = 'child';
Object.defineProperty(testObj, 'hidden', {
    value: 'secret',
    enumerable: false
});

console.log(getEnumerableProperties(testObj)); // ['own']
console.log(Object.keys(testObj)); // ['own'] (same result)

// Class properties
class Example {
    constructor() {
        this.instanceProp = 'instance';
    }
    
    prototypeMethod() {
        return 'method';
    }
}

Example.prototype.prototypeProp = 'prototype';

const example = new Example();
console.log(example.propertyIsEnumerable('instanceProp')); // true
console.log(example.propertyIsEnumerable('prototypeMethod')); // false
console.log(example.propertyIsEnumerable('prototypeProp')); // false

// Property descriptor analysis
function analyzeProperty(obj, prop) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    
    return {
        exists: descriptor !== undefined,
        own: obj.hasOwnProperty(prop),
        enumerable: obj.propertyIsEnumerable(prop),
        descriptor: descriptor
    };
}

console.log(analyzeProperty(obj, 'enumerable'));
// { exists: true, own: true, enumerable: true, descriptor: {...} }

console.log(analyzeProperty(obj, 'notEnumerable'));
// { exists: true, own: true, enumerable: false, descriptor: {...} }

// Safe enumeration utility
function safePropertyIsEnumerable(obj, prop) {
    // Handle objects with null prototype
    try {
        return obj.propertyIsEnumerable(prop);
    } catch (error) {
        return Object.prototype.propertyIsEnumerable.call(obj, prop);
    }
}

const nullProtoObj = Object.create(null);
nullProtoObj.prop = 'value';

console.log(safePropertyIsEnumerable(nullProtoObj, 'prop')); // true

// JSON serialization behavior
function explainJSONSerialization(obj) {
    console.log('Object:', obj);
    console.log('JSON.stringify result:', JSON.stringify(obj));
    
    console.log('\nProperty analysis:');
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            console.log(`${key}: enumerable=${obj.propertyIsEnumerable(key)}, included=${JSON.stringify(obj).includes(key)}`);
        }
    }
}

const jsonTest = {
    visible: 'shown',
    alsoVisible: 'also shown'
};

Object.defineProperty(jsonTest, 'hidden', {
    value: 'not shown',
    enumerable: false
});

explainJSONSerialization(jsonTest);
// JSON only includes enumerable own properties
```

### Object.toString()

**Purpose**: Returns a string representation of the object.

```javascript
// Basic usage
const obj = { name: 'Alice', age: 30 };
console.log(obj.toString()); // "[object Object]"

// Different object types
console.log([1, 2, 3].toString()); // "1,2,3"
console.log(new Date().toString()); // "Mon Jan 01 2024 12:00:00 GMT+0000 (UTC)"
console.log(function() {}.toString()); // "function() {}"
console.log(/pattern/.toString()); // "/pattern/"

// Custom toString implementation
const person = {
    name: 'John',
    age: 25,
    toString() {
        return `Person(name: ${this.name}, age: ${this.age})`;
    }
};

console.log(person.toString()); // "Person(name: John, age: 25)"
console.log(String(person)); // "Person(name: John, age: 25)"
console.log(`${person}`); // "Person(name: John, age: 25)"

// Object.prototype.toString for type detection
function getObjectType(obj) {
    return Object.prototype.toString.call(obj);
}

console.log(getObjectType([])); // "[object Array]"
console.log(getObjectType({})); // "[object Object]"
console.log(getObjectType(new Date())); // "[object Date]"
console.log(getObjectType(/regex/)); // "[object RegExp]"
console.log(getObjectType(null)); // "[object Null]"
console.log(getObjectType(undefined)); // "[object Undefined]"
console.log(getObjectType(42)); // "[object Number]"
console.log(getObjectType('string')); // "[object String]"

// Utility function for precise type checking
function getPreciseType(value) {
    const type = Object.prototype.toString.call(value);
    return type.slice(8, -1).toLowerCase(); // Extract type name
}

console.log(getPreciseType(new Map())); // "map"
console.log(getPreciseType(new Set())); // "set"
console.log(getPreciseType(new WeakMap())); // "weakmap"
console.log(getPreciseType(Promise.resolve())); // "promise"

// Class with custom toString
class Product {
    constructor(name, price, category) {
        this.name = name;
        this.price = price;
        this.category = category;
    }
    
    toString() {
        return `${this.name} (${this.price}) - ${this.category}`;
    }
    
    // Also implement valueOf for complete conversion support
    valueOf() {
        return this.price;
    }
}

const laptop = new Product('Laptop', 999, 'Electronics');
console.log(laptop.toString()); // "Laptop ($999) - Electronics"
console.log(+laptop); // 999 (uses valueOf)

// Array-like object with custom toString
const arrayLike = {
    0: 'first',
    1: 'second',
    2: 'third',
    length: 3,
    toString() {
        const items = [];
        for (let i = 0; i < this.length; i++) {
            items.push(this[i]);
        }
        return `[${items.join(', ')}]`;
    }
};

console.log(arrayLike.toString()); // "[first, second, third]"

// Debugging utility with enhanced toString
function createDebuggableObject(data, name = 'Object') {
    return {
        ...data,
        toString() {
            const props = Object.keys(this)
                .filter(key => key !== 'toString')
                .map(key => `${key}: ${JSON.stringify(this[key])}`)
                .join(', ');
            return `${name}(${props})`;
        }
    };
}

const debugObj = createDebuggableObject({
    id: 123,
    name: 'Test',
    active: true
}, 'DebugObject');

console.log(debugObj.toString()); // "DebugObject(id: 123, name: "Test", active: true)"

// Symbol.toStringTag for custom type detection
class CustomClass {
    constructor(value) {
        this.value = value;
    }
    
    get [Symbol.toStringTag]() {
        return 'CustomClass';
    }
    
    toString() {
        return `CustomClass(${this.value})`;
    }
}

const custom = new CustomClass('test');
console.log(Object.prototype.toString.call(custom)); // "[object CustomClass]"
console.log(custom.toString()); // "CustomClass(test)"

// Error objects with custom toString
class APIError extends Error {
    constructor(message, code, details) {
        super(message);
        this.name = 'APIError';
        this.code = code;
        this.details = details;
    }
    
    toString() {
        return `${this.name} [${this.code}]: ${this.message}${this.details ? ` (${JSON.stringify(this.details)})` : ''}`;
    }
}

const apiError = new APIError('User not found', 404, { userId: 123 });
console.log(apiError.toString()); // "APIError [404]: User not found ({"userId":123})"
```

### Object.valueOf()

**Purpose**: Returns the primitive value of the specified object.

```javascript
// Basic usage - most objects return themselves
const obj = { x: 1 };
console.log(obj.valueOf() === obj); // true

// Built-in types with meaningful valueOf
const num = new Number(42);
const str = new String('hello');
const bool = new Boolean(true);
const date = new Date();

console.log(num.valueOf()); // 42
console.log(str.valueOf()); // "hello"
console.log(bool.valueOf()); // true
console.log(date.valueOf()); // timestamp number

// Arrays and valueOf
const arr = [1, 2, 3];
console.log(arr.valueOf() === arr); // true (returns itself)

// Custom valueOf implementation
const temperature = {
    celsius: 25,
    valueOf() {
        return this.celsius;
    },
    toString() {
        return `${this.celsius}°C`;
    }
};

console.log(temperature + 10); // 35 (uses valueOf)
console.log(`Temperature: ${temperature}`); // "Temperature: 25°C" (uses toString)
console.log(Number(temperature)); // 25 (uses valueOf)

// Comparison operations use valueOf
const obj1 = {
    value: 10,
    valueOf() { return this.value; }
};

const obj2 = {
    value: 20,
    valueOf() { return this.value; }
};

console.log(obj1 < obj2); // true (10 < 20)
console.log(obj1 + obj2); // 30 (10 + 20)

// Date comparisons
const date1 = new Date('2023-01-01');
const date2 = new Date('2023-12-31');

console.log(date1 < date2); // true (compares timestamps)
console.log(date1.valueOf()); // 1672531200000
console.log(date2.valueOf()); // 1703980800000

// Custom currency class
class Money {
    constructor(amount, currency = 'USD') {
        this.amount = amount;
        this.currency = currency;
    }
    
    valueOf() {
        return this.amount;
    }
    
    toString() {
        return `${this.amount} ${this.currency}`;
    }
    
    // Custom comparison methods
    equals(other) {
        return this.amount === other.amount && this.currency === other.currency;
    }
    
    add(other) {
        if (this.currency !== other.currency) {
            throw new Error('Cannot add different currencies');
        }
        return new Money(this.amount + other.amount, this.currency);
    }
}

const price1 = new Money(100);
const price2 = new Money(50);

console.log(price1 > price2); // true (100 > 50)
console.log(price1 + price2); // 150 (uses valueOf)
console.log(`Total: ${price1}`); // "Total: 100 USD" (uses toString)

// Complex number example
class Complex {
    constructor(real, imaginary) {
        this.real = real;
        this.imaginary = imaginary;
    }
    
    valueOf() {
        // Return magnitude for numerical operations
        return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
    }
    
    toString() {
        const sign = this.imaginary >= 0 ? '+' : '';
        return `${this.real}${sign}${this.imaginary}i`;
    }
}

const complex1 = new Complex(3, 4);
const complex2 = new Complex(1, 1);

console.log(complex1.valueOf()); // 5 (magnitude)
console.log(complex1 > complex2); // true (5 > √2)
console.log(`Complex number: ${complex1}`); // "Complex number: 3+4i"

// Conversion priority demonstration
const conversionTest = {
    valueOf() {
        console.log('valueOf called');
        return 42;
    },
    toString() {
        console.log('toString called');
        return 'forty-two';
    }
};

console.log(Number(conversionTest)); // valueOf called, then 42
console.log(String(conversionTest)); // toString called, then "forty-two"
console.log(conversionTest + 0); // valueOf called, then 42
console.log(conversionTest + ''); // valueOf called, then "42"

// Preventing automatic conversion
const strictObject = {
    value: 100,
    valueOf() {
        throw new Error('Automatic numeric conversion not allowed');
    },
    toString() {
        throw new Error('Automatic string conversion not allowed');
    },
    getValue() {
        return this.value;
    }
};

try {
    console.log(strictObject + 10); // Throws error
} catch (error) {
    console.log(error.message); // "Automatic numeric conversion not allowed"
}

console.log(strictObject.getValue() + 10); // 110 (explicit access works)

// Symbol.toPrimitive for complete control
class SmartConversion {
    constructor(value) {
        this.value = value;
    }
    
    [Symbol.toPrimitive](hint) {
        console.log(`Conversion hint: ${hint}`);
        
        switch (hint) {
            case 'number':
                return this.value;
            case 'string':
                return `Value: ${this.value}`;
            case 'default':
                return this.value;
            default:
                return this.value;
        }
    }
}

const smart = new SmartConversion(123);
console.log(+smart); // "Conversion hint: number", then 123
console.log(`${smart}`); // "Conversion hint: string", then "Value: 123"
console.log(smart == 123); // "Conversion hint: default", then true
```

---

## Summary

### Object Creation and Property Definition
- **Object.create()**: Create objects with specific prototypes
- **Object.defineProperty()**: Define single property with descriptors
- **Object.defineProperties()**: Define multiple properties with descriptors

### Property Access and Enumeration
- **Object.keys()**: Get enumerable own property names
- **Object.values()**: Get enumerable own property values
- **Object.entries()**: Get enumerable own property [key, value] pairs
- **Object.getOwnPropertyNames()**: Get all own property names (including non-enumerable)
- **Object.getOwnPropertySymbols()**: Get all own symbol properties
- **Object.getOwnPropertyDescriptor()**: Get property descriptor for single property
- **Object.getOwnPropertyDescriptors()**: Get all property descriptors

### Object Manipulation and Protection
- **Object.assign()**: Copy enumerable properties from source to target
- **Object.freeze()**: Make object immutable
- **Object.seal()**: Prevent adding/removing properties but allow modifications
- **Object.preventExtensions()**: Prevent adding new properties

### Prototype Management
- **Object.getPrototypeOf()**: Get object's prototype
- **Object.setPrototypeOf()**: Set object's prototype
- **Object.isPrototypeOf()**: Check if object is in prototype chain

### Object State Testing
- **Object.isFrozen()**: Check if object is frozen
- **Object.isSealed()**: Check if object is sealed
- **Object.isExtensible()**: Check if object is extensible

### Comparison and Conversion
- **Object.is()**: Same-value equality comparison
- **Object.hasOwnProperty()**: Check for own property
- **Object.propertyIsEnumerable()**: Check if property is enumerable and own
- **Object.toString()**: String representation
- **Object.valueOf()**: Primitive value

### Best Practices

1. **Use Object.create()** for prototype-based inheritance
2. **Use Object.assign()** for shallow copying and merging
3. **Use Object.freeze()** for immutable objects
4. **Use Object.keys/values/entries()** for iteration
5. **Use Object.is()** for precise equality checking
6. **Use Object.hasOwn()** (ES2022) instead of hasOwnProperty when available
7. **Use property descriptors** for fine-grained property control
8. **Use Symbol.toPrimitive** for custom conversion logic

This comprehensive guide covers all major JavaScript object methods with practical examples and use cases for each method.