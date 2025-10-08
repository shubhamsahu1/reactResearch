# TypeScript Interview Questions

A comprehensive collection of 10 TypeScript interview questions covering core concepts and advanced features, with detailed answers and code examples.

---

## Question 1: What is the difference between `interface` and `type` in TypeScript? When would you use one over the other?

### Answer

Both `interface` and `type` can be used to define object shapes, but they have important differences:

**Key Differences:**

| Feature | Interface | Type Alias |
|---------|-----------|------------|
| Extension | Uses `extends` | Uses `&` (intersection) |
| Declaration Merging | ✅ Yes | ❌ No |
| Computed Properties | ❌ No | ✅ Yes |
| Union Types | ❌ No | ✅ Yes |
| Primitive Types | ❌ No | ✅ Yes |
| Tuple Types | ❌ Limited | ✅ Yes |
| Performance | Slightly better for objects | Same |

**Examples:**

```typescript
// Interface - Declaration Merging
interface User {
  name: string;
}

interface User {
  age: number;
}

// Both declarations merge into one
const user: User = {
  name: "Alice",
  age: 30
};

// Type - No merging (would error)
type Product = {
  id: number;
};

// type Product = {  // Error: Duplicate identifier
//   price: number;
// };

// Interface - Extension
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// Type - Intersection
type Animal2 = {
  name: string;
};

type Dog2 = Animal2 & {
  breed: string;
};

// Type - Union Types (interface cannot do this)
type Status = "pending" | "approved" | "rejected";
type ID = string | number;

// Type - Primitives and Tuples
type Coordinate = [number, number];
type Callback = (data: string) => void;

// Type - Computed Properties
type Keys = "name" | "age";
type Person = {
  [K in Keys]: string;
};
```

**When to Use:**

- **Use `interface`** when:
  - Defining object shapes and contracts
  - Working with classes and OOP patterns
  - You need declaration merging (e.g., extending third-party types)
  - Building public APIs
  
- **Use `type`** when:
  - Creating union types
  - Creating tuple types
  - Creating utility types with mapped/conditional types
  - Aliasing primitives or complex types
  - Using computed properties

**Best Practice:** For object shapes, prefer `interface` for consistency and better error messages. Use `type` for unions, tuples, and advanced type transformations.

---

## Question 2: Explain `any`, `unknown`, and `never` types. What are the differences and when should each be used?

### Answer

These are special types that handle different scenarios in TypeScript's type system:

### `any` Type

**Definition:** Opts out of type checking - can be anything and do anything.

**Characteristics:**
- Disables all type checking
- Can be assigned to any other type
- Can assign any type to it
- All operations are allowed

```typescript
let value: any = "hello";
value = 42;           // OK
value = true;         // OK
value.foo.bar.baz();  // OK - no type checking (runtime error if invalid)

let str: string = value;  // OK - any can be assigned to anything
```

**When to Use:**
- Migrating JavaScript to TypeScript
- Working with dynamic content (very rare)
- **Avoid when possible** - defeats TypeScript's purpose

### `unknown` Type

**Definition:** Type-safe alternative to `any` - represents unknown type that requires type checking.

**Characteristics:**
- Can assign any value to `unknown`
- Cannot assign `unknown` to other types without type checking
- Cannot perform operations without narrowing
- Forces explicit type checking

```typescript
let value: unknown = "hello";
value = 42;           // OK
value = true;         // OK

// let str: string = value;  // Error: Type 'unknown' is not assignable to type 'string'

// Must narrow the type first
if (typeof value === "string") {
  let str: string = value;  // OK - type narrowed
  console.log(value.toUpperCase());
}

// Type guard example
function processValue(val: unknown) {
  if (typeof val === "string") {
    console.log(val.trim());
  } else if (typeof val === "number") {
    console.log(val.toFixed(2));
  } else {
    console.log("Unknown type");
  }
}
```

**When to Use:**
- Receiving data from external sources (API, user input)
- When type is truly unknown
- Instead of `any` for type safety

### `never` Type

**Definition:** Represents values that never occur - bottom type of TypeScript's type hierarchy.

**Characteristics:**
- No value can be assigned to `never`
- `never` can be assigned to any type
- Used for functions that never return
- Used in exhaustiveness checking

```typescript
// Function that throws error
function throwError(message: string): never {
  throw new Error(message);
}

// Function with infinite loop
function infiniteLoop(): never {
  while (true) {
    // never returns
  }
}

// Exhaustiveness checking
type Shape = "circle" | "square" | "triangle";

function getArea(shape: Shape): number {
  switch (shape) {
    case "circle":
      return Math.PI * 5 ** 2;
    case "square":
      return 5 * 5;
    case "triangle":
      return (5 * 5) / 2;
    default:
      const exhaustiveCheck: never = shape;  // Ensures all cases handled
      throw new Error(`Unhandled shape: ${exhaustiveCheck}`);
  }
}

// Type filtering
type NonNullable<T> = T extends null | undefined ? never : T;

type Result = NonNullable<string | null | undefined>;  // string
```

**When to Use:**
- Functions that always throw errors
- Functions with infinite loops
- Exhaustiveness checking in switch/if statements
- Type-level filtering in conditional types

### Comparison Summary

```typescript
// any - anything goes (unsafe)
let a: any = 5;
a.toUpperCase();  // No error, but runtime crash

// unknown - safe, requires checking
let u: unknown = 5;
// u.toUpperCase();  // Error: must check type first
if (typeof u === "string") {
  u.toUpperCase();  // OK
}

// never - nothing is assignable
let n: never;
// n = 5;  // Error: Type 'number' is not assignable to type 'never'

// Function usage
function handleAny(x: any) { }       // Accepts anything, unsafe
function handleUnknown(x: unknown) { }  // Accepts anything, safe
function returnNever(): never { throw new Error(); }  // Never returns
```

---

## Question 3: What are Generics in TypeScript? Provide examples of generic functions, classes, and constraints.

### Answer

**Generics** allow you to create reusable components that work with multiple types while maintaining type safety. They provide a way to make components type-flexible without using `any`.

### Generic Functions

```typescript
// Basic generic function
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("hello");  // Explicit type
let output2 = identity(42);               // Type inference: number

// Generic function with array
function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

let first = getFirstElement([1, 2, 3]);      // number | undefined
let firstStr = getFirstElement(["a", "b"]);  // string | undefined

// Multiple type parameters
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

let result = pair("age", 30);  // [string, number]

// Generic arrow function
const map = <T, U>(arr: T[], fn: (item: T) => U): U[] => {
  return arr.map(fn);
};

let lengths = map(["hello", "world"], str => str.length);  // number[]
```

### Generic Classes

```typescript
// Generic class
class Box<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }
}

let stringBox = new Box<string>("Hello");
let numberBox = new Box<number>(42);

// Generic class with multiple types
class KeyValuePair<K, V> {
  constructor(public key: K, public value: V) {}

  display(): string {
    return `${this.key}: ${this.value}`;
  }
}

let pair1 = new KeyValuePair<string, number>("age", 30);
let pair2 = new KeyValuePair("name", "Alice");  // Type inference

// Generic class with methods
class DataStore<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  remove(item: T): void {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

  find(predicate: (item: T) => boolean): T | undefined {
    return this.items.find(predicate);
  }

  getAll(): T[] {
    return [...this.items];
  }
}

interface User {
  id: number;
  name: string;
}

const userStore = new DataStore<User>();
userStore.add({ id: 1, name: "Alice" });
userStore.add({ id: 2, name: "Bob" });
```

### Generic Constraints

```typescript
// Constraint using interface
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length);
}

logLength("hello");      // OK - string has length
logLength([1, 2, 3]);    // OK - array has length
// logLength(42);        // Error - number doesn't have length

// Constraint using keyof
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

let person = { name: "Alice", age: 30, city: "NYC" };
let name = getProperty(person, "name");   // string
let age = getProperty(person, "age");     // number
// let invalid = getProperty(person, "invalid");  // Error

// Constraint with class type
class Animal {
  constructor(public name: string) {}
}

class Dog extends Animal {
  bark() {
    console.log("Woof!");
  }
}

function createInstance<T extends Animal>(c: new (name: string) => T, name: string): T {
  return new c(name);
}

let dog = createInstance(Dog, "Buddy");
dog.bark();  // OK

// Multiple constraints
interface Comparable {
  compareTo(other: any): number;
}

interface Serializable {
  serialize(): string;
}

function process<T extends Comparable & Serializable>(item: T): void {
  console.log(item.serialize());
  console.log(item.compareTo(item));
}

// Default generic types
interface Response<T = any> {
  data: T;
  status: number;
  message: string;
}

let response1: Response<string> = {
  data: "Success",
  status: 200,
  message: "OK"
};

let response2: Response = {  // Uses default 'any'
  data: { anything: "goes" },
  status: 200,
  message: "OK"
};
```

### Generic Interfaces

```typescript
interface Repository<T> {
  getById(id: number): T | undefined;
  getAll(): T[];
  add(item: T): void;
  update(id: number, item: T): void;
  delete(id: number): void;
}

class UserRepository implements Repository<User> {
  private users: User[] = [];

  getById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getAll(): User[] {
    return [...this.users];
  }

  add(item: User): void {
    this.users.push(item);
  }

  update(id: number, item: User): void {
    const index = this.users.findIndex(u => u.id === id);
    if (index > -1) {
      this.users[index] = item;
    }
  }

  delete(id: number): void {
    const index = this.users.findIndex(u => u.id === id);
    if (index > -1) {
      this.users.splice(index, 1);
    }
  }
}
```

**Benefits of Generics:**
- Type safety without `any`
- Code reusability
- Better IDE support and autocomplete
- Compile-time type checking
- Self-documenting code

---

## Question 4: Explain Union Types and Intersection Types with practical examples. How do they differ?

### Answer

Union and Intersection types are fundamental TypeScript features for combining types in different ways.

### Union Types (`|`)

**Definition:** A value can be **one of several types** (OR logic).

```typescript
// Basic union
let id: string | number;
id = "ABC123";  // OK
id = 123;       // OK
// id = true;   // Error

// Function with union parameter
function formatId(id: string | number): string {
  if (typeof id === "string") {
    return id.toUpperCase();
  } else {
    return `ID-${id.toString().padStart(6, '0')}`;
  }
}

console.log(formatId("abc123"));  // "ABC123"
console.log(formatId(42));        // "ID-000042"

// Union with literals
type Status = "pending" | "approved" | "rejected";
let orderStatus: Status = "pending";  // OK
// let invalidStatus: Status = "cancelled";  // Error

// Union with objects
interface Success {
  success: true;
  data: any;
}

interface Error {
  success: false;
  error: string;
}

type Result = Success | Error;

function handleResult(result: Result) {
  if (result.success) {
    console.log(result.data);  // Type narrowed to Success
  } else {
    console.log(result.error);  // Type narrowed to Error
  }
}

// Discriminated unions (tagged unions)
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

type Shape = Circle | Square | Rectangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    case "rectangle":
      return shape.width * shape.height;
  }
}

// Array of union types
let mixedArray: (string | number)[] = ["hello", 42, "world", 100];

// Union in return types
function fetchData(useCache: boolean): string | Promise<string> {
  if (useCache) {
    return "cached data";
  }
  return Promise.resolve("fetched data");
}
```

### Intersection Types (`&`)

**Definition:** A value must have **all properties from all types** (AND logic).

```typescript
// Basic intersection
interface Person {
  name: string;
  age: number;
}

interface Employee {
  employeeId: string;
  department: string;
}

type Staff = Person & Employee;

const employee: Staff = {
  name: "Alice",
  age: 30,
  employeeId: "E123",
  department: "Engineering"
  // Must have ALL properties
};

// Multiple intersections
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface Auditable {
  createdBy: string;
  updatedBy: string;
}

interface Deletable {
  deletedAt?: Date;
  deletedBy?: string;
}

type AuditedEntity = Timestamped & Auditable & Deletable;

const record: AuditedEntity = {
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: "admin",
  updatedBy: "admin",
  deletedAt: undefined,
  deletedBy: undefined
};

// Mixin pattern
type Point = { x: number; y: number };
type Colored = { color: string };
type Named = { name: string };

type ColoredPoint = Point & Colored;
type NamedColoredPoint = Point & Colored & Named;

const point: ColoredPoint = {
  x: 10,
  y: 20,
  color: "red"
};

const namedPoint: NamedColoredPoint = {
  x: 10,
  y: 20,
  color: "blue",
  name: "Origin Point"
};

// Intersection with function types
type Logger = {
  log(message: string): void;
};

type ErrorHandler = {
  handleError(error: Error): void;
};

type Service = Logger & ErrorHandler;

const myService: Service = {
  log(message: string) {
    console.log(message);
  },
  handleError(error: Error) {
    console.error(error);
  }
};

// Combining interfaces and types
interface HasId {
  id: number;
}

type WithMetadata = {
  metadata: Record<string, any>;
};

type Entity = HasId & WithMetadata;

const entity: Entity = {
  id: 1,
  metadata: { source: "api", version: "1.0" }
};
```

### Key Differences

```typescript
// Union: Can be ONE of the types
type A = { a: string } | { b: number };
const val1: A = { a: "hello" };  // OK
const val2: A = { b: 42 };       // OK
// const val3: A = { a: "hi", b: 42 };  // Also OK! Satisfies both

// Intersection: Must have ALL properties
type B = { a: string } & { b: number };
const val4: B = { a: "hello", b: 42 };  // OK - must have both
// const val5: B = { a: "hello" };      // Error - missing 'b'

// Union with primitives
type ID = string | number;  // Can be string OR number

// Intersection with primitives (usually results in 'never')
type Impossible = string & number;  // never - nothing can be both

// Practical example: API response
type ApiSuccess = {
  status: 200;
  data: any;
};

type ApiError = {
  status: 400 | 404 | 500;
  error: string;
};

type ApiResponse = ApiSuccess | ApiError;  // Union - one or the other

// Practical example: User permissions
type ReadPermission = { canRead: boolean };
type WritePermission = { canWrite: boolean };
type DeletePermission = { canDelete: boolean };

type AdminUser = ReadPermission & WritePermission & DeletePermission;
// Intersection - must have all permissions

type RegularUser = ReadPermission;  // Only read permission
```

### Comparison Table

| Feature | Union (`A \| B`) | Intersection (`A & B`) |
|---------|------------------|------------------------|
| Logic | OR - one of the types | AND - all of the types |
| Properties | Only common properties accessible | All properties from all types |
| Assignment | Value can match any one type | Value must satisfy all types |
| Use Case | Multiple possible types | Combining multiple types |
| Example | `string \| number` | `Person & Employee` |

### When to Use

**Use Union when:**
- Value can be one of several types
- Function can return different types
- Handling different states (loading, success, error)
- Optional alternative types

**Use Intersection when:**
- Combining multiple interfaces/types
- Creating composite types
- Mixin patterns
- Adding properties to existing types

---

## Question 5: What are Type Guards? Explain different types of type guards with examples.

### Answer

**Type Guards** are runtime checks that allow TypeScript to narrow down types within conditional blocks. They help work safely with union types and ensure type safety.

### 1. `typeof` Type Guard

Used for primitive types.

```typescript
function processValue(value: string | number | boolean) {
  if (typeof value === "string") {
    // TypeScript knows value is string here
    console.log(value.toUpperCase());
    console.log(value.length);
  } else if (typeof value === "number") {
    // TypeScript knows value is number here
    console.log(value.toFixed(2));
    console.log(value * 2);
  } else {
    // TypeScript knows value is boolean here
    console.log(value ? "Yes" : "No");
  }
}

// typeof returns: "string", "number", "boolean", "object", 
//                 "function", "undefined", "symbol", "bigint"
```

### 2. `instanceof` Type Guard

Used for class instances.

```typescript
class Dog {
  bark() {
    console.log("Woof!");
  }
}

class Cat {
  meow() {
    console.log("Meow!");
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();  // TypeScript knows it's Dog
  } else {
    animal.meow();  // TypeScript knows it's Cat
  }
}

// Works with built-in classes too
function processDate(value: Date | string) {
  if (value instanceof Date) {
    console.log(value.getFullYear());
  } else {
    console.log(value.toUpperCase());
  }
}
```

### 3. `in` Operator Type Guard

Used to check if a property exists in an object.

```typescript
interface Car {
  drive(): void;
  wheels: number;
}

interface Boat {
  sail(): void;
  propeller: boolean;
}

function move(vehicle: Car | Boat) {
  if ("drive" in vehicle) {
    vehicle.drive();  // TypeScript knows it's Car
    console.log(vehicle.wheels);
  } else {
    vehicle.sail();  // TypeScript knows it's Boat
    console.log(vehicle.propeller);
  }
}

// Checking for methods
interface Bird {
  fly(): void;
}

interface Fish {
  swim(): void;
}

function moveAnimal(animal: Bird | Fish) {
  if ("fly" in animal) {
    animal.fly();
  } else {
    animal.swim();
  }
}
```

### 4. Custom Type Guard (Type Predicate)

User-defined functions that return type predicates.

```typescript
// Basic custom type guard
interface User {
  type: "user";
  name: string;
  email: string;
}

interface Admin {
  type: "admin";
  name: string;
  permissions: string[];
}

// Type predicate: 'account is Admin'
function isAdmin(account: User | Admin): account is Admin {
  return account.type === "admin";
}

function grantAccess(account: User | Admin) {
  if (isAdmin(account)) {
    // TypeScript knows account is Admin here
    console.log(account.permissions);
  } else {
    // TypeScript knows account is User here
    console.log(account.email);
  }
}

// More complex type guard
interface Response {
  data?: any;
  error?: string;
}

function isSuccessResponse(response: Response): response is { data: any } {
  return response.data !== undefined && response.error === undefined;
}

function handleResponse(response: Response) {
  if (isSuccessResponse(response)) {
    console.log(response.data);  // data is guaranteed to exist
  } else {
    console.log(response.error);  // error might exist
  }
}

// Type guard for arrays
function isStringArray(value: any): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === "string");
}

function processArray(arr: any) {
  if (isStringArray(arr)) {
    arr.forEach(str => console.log(str.toUpperCase()));
  }
}
```

### 5. Discriminated Unions (Tagged Unions)

Using a common property to distinguish between types.

```typescript
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

type Shape = Circle | Square | Rectangle;

function getArea(shape: Shape): number {
  // TypeScript uses 'kind' property to narrow the type
  switch (shape.kind) {
    case "circle":
      // shape is Circle here
      return Math.PI * shape.radius ** 2;
    case "square":
      // shape is Square here
      return shape.sideLength ** 2;
    case "rectangle":
      // shape is Rectangle here
      return shape.width * shape.height;
  }
}

// API response pattern
interface LoadingState {
  status: "loading";
}

interface SuccessState {
  status: "success";
  data: any;
}

interface ErrorState {
  status: "error";
  error: string;
}

type ApiState = LoadingState | SuccessState | ErrorState;

function renderUI(state: ApiState) {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return `Data: ${state.data}`;
    case "error":
      return `Error: ${state.error}`;
  }
}
```

### 6. Truthiness Narrowing

TypeScript narrows types based on truthiness checks.

```typescript
function printLength(value: string | null | undefined) {
  if (value) {
    // value is string here (truthy values)
    console.log(value.length);
  } else {
    console.log("No value");
  }
}

// Falsy values: false, 0, -0, 0n, "", null, undefined, NaN
function processNumber(num: number | null) {
  if (num) {
    // num is number (but could be 0!)
    console.log(num * 2);
  }
}

// Better approach for numbers
function processNumberBetter(num: number | null) {
  if (num != null) {  // or num !== null
    // num is number (including 0)
    console.log(num * 2);
  }
}
```

### 7. Equality Narrowing

Using equality checks to narrow types.

```typescript
function compare(x: string | number, y: string | boolean) {
  if (x === y) {
    // Both x and y are string here (only common type)
    console.log(x.toUpperCase());
    console.log(y.toUpperCase());
  } else {
    console.log(x);  // string | number
    console.log(y);  // string | boolean
  }
}

// Narrowing with null/undefined
function greet(name: string | null | undefined) {
  if (name == null) {  // checks both null and undefined
    console.log("Hello, stranger!");
  } else {
    console.log(`Hello, ${name}!`);
  }
}
```

### 8. `Array.isArray()` Type Guard

Checking if a value is an array.

```typescript
function processInput(input: string | string[]) {
  if (Array.isArray(input)) {
    // input is string[] here
    input.forEach(item => console.log(item.toUpperCase()));
  } else {
    // input is string here
    console.log(input.toUpperCase());
  }
}
```

### 9. Assertion Functions

Functions that throw errors if a condition is not met, narrowing types afterward.

```typescript
// Assertion function
function assertIsString(value: any): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Value must be a string");
  }
}

function processValue(input: unknown) {
  assertIsString(input);
  // TypeScript knows input is string after assertion
  console.log(input.toUpperCase());
}

// Assert with conditions
function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error("Value must be defined");
  }
}

function process(value: string | null) {
  assertIsDefined(value);
  // value is definitely string here
  console.log(value.length);
}
```

### Comparison of Type Guards

| Type Guard | Use Case | Example |
|------------|----------|---------|
| `typeof` | Primitive types | `typeof x === "string"` |
| `instanceof` | Class instances | `x instanceof Date` |
| `in` | Object properties | `"prop" in obj` |
| Custom (Type Predicate) | Complex conditions | `isAdmin(user)` |
| Discriminated Union | Tagged objects | `shape.kind === "circle"` |
| Truthiness | Falsy checks | `if (value)` |
| Equality | Comparing values | `x === y` |
| `Array.isArray()` | Array checks | `Array.isArray(x)` |
| Assertion Functions | Throwing on invalid | `assert(condition)` |

**Best Practices:**
- Use the simplest type guard that works for your case
- Create custom type guards for complex logic
- Prefer discriminated unions for object types
- Use assertion functions for invariants
- Be careful with truthiness (0, "" are falsy)

---

## Question 6: Explain Mapped Types and provide practical examples. How would you create utility types like `Partial`, `Required`, and `Readonly`?

### Answer

**Mapped Types** transform existing types by iterating over their properties and applying transformations. They're the foundation for TypeScript's utility types.

### Basic Syntax

```typescript
type MappedType<T> = {
  [P in keyof T]: T[P];
};
```

### Creating Utility Types

#### 1. Readonly - Make all properties readonly

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface User {
  name: string;
  age: number;
  email: string;
}

type ReadonlyUser = Readonly<User>;
// Result: {
//   readonly name: string;
//   readonly age: number;
//   readonly email: string;
// }

const user: ReadonlyUser = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};

// user.name = "Bob";  // Error: Cannot assign to 'name' because it is a read-only property
```

#### 2. Partial - Make all properties optional

```typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

type PartialProduct = Partial<Product>;
// Result: {
//   id?: number;
//   name?: string;
//   price?: number;
//   description?: string;
// }

// Useful for update operations
function updateProduct(id: number, updates: Partial<Product>) {
  // Only provide properties you want to update
  console.log("Updating product", id, "with", updates);
}

updateProduct(1, { price: 99.99 });  // OK - only updating price
updateProduct(2, { name: "New Name", description: "New desc" });  // OK
```

#### 3. Required - Make all properties required

```typescript
type Required<T> = {
  [P in keyof T]-?: T[P];  // -? removes optional modifier
};

interface Config {
  apiUrl?: string;
  timeout?: number;
  retries?: number;
}

type RequiredConfig = Required<Config>;
// Result: {
//   apiUrl: string;
//   timeout: number;
//   retries: number;
// }

const config: RequiredConfig = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3
  // All properties are now required
};
```

### Advanced Mapped Types

#### 4. Pick - Select subset of properties

```typescript
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

interface Person {
  name: string;
  age: number;
  email: string;
  address: string;
  phone: string;
}

type PersonPreview = Pick<Person, "name" | "email">;
// Result: {
//   name: string;
//   email: string;
// }

const preview: PersonPreview = {
  name: "Alice",
  email: "alice@example.com"
};
```

#### 5. Omit - Exclude properties

```typescript
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type PersonWithoutContact = Omit<Person, "email" | "phone">;
// Result: {
//   name: string;
//   age: number;
//   address: string;
// }
```

#### 6. Record - Create object type with specific keys

```typescript
type Record<K extends string | number | symbol, T> = {
  [P in K]: T;
};

type PageInfo = Record<"home" | "about" | "contact", { title: string; url: string }>;
// Result: {
//   home: { title: string; url: string };
//   about: { title: string; url: string };
//   contact: { title: string; url: string };
// }

const pages: PageInfo = {
  home: { title: "Home", url: "/" },
  about: { title: "About", url: "/about" },
  contact: { title: "Contact", url: "/contact" }
};

// Another example
type HTTPStatusMessages = Record<200 | 404 | 500, string>;
const messages: HTTPStatusMessages = {
  200: "OK",
  404: "Not Found",
  500: "Internal Server Error"
};
```

### Custom Mapped Types

```typescript
// 1. Nullable - Make all properties nullable
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type NullableUser = Nullable<User>;
// Result: {
//   name: string | null;
//   age: number | null;
//   email: string | null;
// }

// 2. Stringify - Convert all properties to strings
type Stringify<T> = {
  [P in keyof T]: string;
};

interface Coordinates {
  x: number;
  y: number;
  z: number;
}

type StringCoordinates = Stringify<Coordinates>;
// Result: { x: string; y: string; z: string; }

// 3. Getters - Create getter methods
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

interface State {
  name: string;
  age: number;
}

type StateGetters = Getters<State>;
// Result: {
//   getName: () => string;
//   getAge: () => number;
// }

// 4. Optional by key - Make specific properties optional
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type UserWithOptionalEmail = Optional<User, "email">;
// email is optional, others are required

// 5. ReadonlyPartial - Combine readonly and optional
type ReadonlyPartial<T> = {
  readonly [P in keyof T]?: T[P];
};

// 6. Mutable - Remove readonly modifier
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

interface ReadonlyPoint {
  readonly x: number;
  readonly y: number;
}

type MutablePoint = Mutable<ReadonlyPoint>;
// Result: { x: number; y: number; }

// 7. Filter properties by type
type FilterByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

interface Mixed {
  name: string;
  age: number;
  email: string;
  active: boolean;
  score: number;
}

type OnlyStrings = FilterByType<Mixed, string>;
// Result: { name: string; email: string; }

type OnlyNumbers = FilterByType<Mixed, number>;
// Result: { age: number; score: number; }
```

### Practical Examples

```typescript
// API Response Mapper
interface ApiUser {
  user_id: number;
  user_name: string;
  user_email: string;
  is_active: boolean;
}

// Convert snake_case to camelCase
type CamelCase<S extends string> = S extends `${infer P}_${infer Q}`
  ? `${P}${Capitalize<CamelCase<Q>>}`
  : S;

type CamelCaseKeys<T> = {
  [K in keyof T as CamelCase<string & K>]: T[K];
};

type FrontendUser = CamelCaseKeys<ApiUser>;
// Result: {
//   userId: number;
//   userName: string;
//   userEmail: string;
//   isActive: boolean;
// }

// Form State Management
type FormField = "firstName" | "lastName" | "email" | "password";

type FormState = {
  [K in FormField as `${K}Value`]: string;
} & {
  [K in FormField as `${K}Error`]: string | null;
} & {
  [K in FormField as `is${Capitalize<K>}Valid`]: boolean;
};

// Result: {
//   firstNameValue: string;
//   firstNameError: string | null;
//   isFirstNameValid: boolean;
//   lastNameValue: string;
//   lastNameError: string | null;
//   isLastNameValid: boolean;
//   ...
// }

// Deep Readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepReadonly<T[P]> 
    : T[P];
};

interface NestedConfig {
  database: {
    host: string;
    port: number;
    credentials: {
      username: string;
      password: string;
    };
  };
}

type ImmutableConfig = DeepReadonly<NestedConfig>;
// All nested properties become readonly

// Proxy type for methods
type Promisify<T> = {
  [P in keyof T]: T[P] extends (...args: infer A) => infer R
    ? (...args: A) => Promise<R>
    : T[P];
};

interface SyncAPI {
  getUser(id: number): User;
  deleteUser(id: number): boolean;
}

type AsyncAPI = Promisify<SyncAPI>;
// Result: {
//   getUser: (id: number) => Promise<User>;
//   deleteUser: (id: number) => Promise<boolean>;
// }
```

**Key Takeaways:**
- Mapped types iterate over keys of a type
- Use `[P in keyof T]` to map over properties
- Modifiers: `?` (optional), `-?` (required), `readonly`, `-readonly` (mutable)
- Combine with conditional types for powerful transformations
- Foundation for TypeScript's built-in utility types
- Enable type-safe transformations without code duplication

---

## Question 7: What are Conditional Types? Explain with examples including type inference with `infer`.

### Answer

**Conditional Types** select one of two possible types based on a condition expressed as a type relationship test. They use the syntax: `T extends U ? X : Y`

### Basic Conditional Types

```typescript
// Basic conditional type
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false
type C = IsString<"hello">; // true (string literal extends string)

// Nested conditional types
type TypeName<T> = 
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends undefined ? "undefined" :
  T extends Function ? "function" :
  "object";

type T1 = TypeName<string>;      // "string"
type T2 = TypeName<42>;          // "number"
type T3 = TypeName<() => void>;  // "function"
type T4 = TypeName<{}>;          // "object"

// Conditional type with constraints
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

interface Email {
  message: string;
}

interface Dog {
  bark(): void;
}

type EmailMessage = MessageOf<Email>;  // string
type DogMessage = MessageOf<Dog>;      // never
```

### Built-in Conditional Utility Types

```typescript
// 1. Exclude - Remove types from union
type Exclude<T, U> = T extends U ? never : T;

type Numbers = 1 | 2 | 3 | 4 | 5;
type NotThree = Exclude<Numbers, 3>;  // 1 | 2 | 4 | 5

type Mixed = string | number | boolean;
type NoBoolean = Exclude<Mixed, boolean>;  // string | number

// 2. Extract - Keep only matching types
type Extract<T, U> = T extends U ? T : never;

type StringsOnly = Extract<Mixed, string>;  // string
type NumbersOrStrings = Extract<Mixed, string | number>;  // string | number

// 3. NonNullable - Remove null and undefined
type NonNullable<T> = T extends null | undefined ? never : T;

type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;  // string

// 4. ReturnType - Extract function return type
type ReturnType<T extends (...args: any) => any> = 
  T extends (...args: any) => infer R ? R : any;

function getUser() {
  return { id: 1, name: "Alice", email: "alice@example.com" };
}

type User = ReturnType<typeof getUser>;
// { id: number; name: string; email: string; }

function add(a: number, b: number): number {
  return a + b;
}

type AddReturn = ReturnType<typeof add>;  // number

// 5. Parameters - Extract function parameter types
type Parameters<T extends (...args: any) => any> = 
  T extends (...args: infer P) => any ? P : never;

function createUser(name: string, age: number, email: string) {
  return { name, age, email };
}

type CreateUserParams = Parameters<typeof createUser>;
// [string, number, string]

// Usage
const params: CreateUserParams = ["Alice", 30, "alice@example.com"];
```

### Type Inference with `infer`

The `infer` keyword allows you to extract types within conditional types.

```typescript
// 1. Extract return type
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Func = () => string;
type Return = GetReturnType<Func>;  // string

// 2. Extract array element type
type Flatten<T> = T extends Array<infer U> ? U : T;

type Str = Flatten<string[]>;   // string
type Num = Flatten<number>;     // number
type Arr = Flatten<boolean[]>;  // boolean

// 3. Extract Promise type
type Awaited<T> = T extends Promise<infer U> ? U : T;

type AsyncString = Awaited<Promise<string>>;  // string
type SyncNumber = Awaited<number>;           // number

async function fetchData(): Promise<{ id: number; name: string }> {
  return { id: 1, name: "Data" };
}

type FetchedData = Awaited<ReturnType<typeof fetchData>>;
// { id: number; name: string; }

// 4. Extract first element of tuple
type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never;

type FirstString = First<[string, number, boolean]>;  // string
type FirstNum = First<[number]>;                      // number

// 5. Extract last element of tuple
type Last<T extends any[]> = T extends [...any[], infer L] ? L : never;

type LastString = Last<[string, number, boolean]>;  // boolean

// 6. Extract function first parameter
type FirstParam<T extends (...args: any[]) => any> = 
  T extends (first: infer P, ...args: any[]) => any ? P : never;

function greet(name: string, age: number): string {
  return `Hello ${name}`;
}

type GreetFirstParam = FirstParam<typeof greet>;  // string

// 7. Unwrap nested arrays recursively
type DeepFlatten<T> = T extends Array<infer U> 
  ? DeepFlatten<U> 
  : T;

type NestedArray = DeepFlatten<number[][][]>;  // number

// 8. Extract object property type
type PropertyType<T, K extends keyof T> = 
  T extends { [key in K]: infer U } ? U : never;

interface Person {
  name: string;
  age: number;
  email: string;
}

type NameType = PropertyType<Person, "name">;  // string
type AgeType = PropertyType<Person, "age">;    // number
```

### Advanced Conditional Types

```typescript
// 1. Distributive conditional types
type ToArray<T> = T extends any ? T[] : never;

type StrOrNumArray = ToArray<string | number>;
// Result: string[] | number[] (distributed over union)

// Non-distributive (wrapped in tuple)
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type Combined = ToArrayNonDist<string | number>;
// Result: (string | number)[]

// 2. Function overload resolution
type UnionToIntersection<U> = 
  (U extends any ? (k: U) => void : never) extends 
  ((k: infer I) => void) ? I : never;

type Union = { a: string } | { b: number };
type Intersection = UnionToIntersection<Union>;
// Result: { a: string } & { b: number }

// 3. Required keys vs optional keys
type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

interface PartialInterface {
  required: string;
  optional?: number;
}

type Required = RequiredKeys<PartialInterface>;  // "required"
type Optional = OptionalKeys<PartialInterface>;  // "optional"

// 4. Extract constructor parameters
type ConstructorParameters<T extends abstract new (...args: any) => any> = 
  T extends abstract new (...args: infer P) => any ? P : never;

class User {
  constructor(public name: string, public age: number) {}
}

type UserConstructorParams = ConstructorParameters<typeof User>;
// [string, number]

// 5. Conditional type for readonly check
type IsReadonly<T, K extends keyof T> = 
  Equal<Pick<T, K>, Readonly<Pick<T, K>>> extends true ? true : false;

// Helper type
type Equal<X, Y> = 
  (<T>() => T extends X ? 1 : 2) extends 
  (<T>() => T extends Y ? 1 : 2) ? true : false;

// 6. Get function names from object
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

interface Example {
  name: string;
  age: number;
  greet(): void;
  calculate(x: number): number;
}

type FunctionProps = FunctionPropertyNames<Example>;
// "greet" | "calculate"

// 7. Promisify sync functions
type Promisify<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => Promise<R>
    : T[K];
};

interface SyncAPI {
  getUser(id: number): User;
  deleteUser(id: number): boolean;
  config: string;
}

type AsyncAPI = Promisify<SyncAPI>;
// {
//   getUser: (id: number) => Promise<User>;
//   deleteUser: (id: number) => Promise<boolean>;
//   config: string;
// }
```

### Practical Examples

```typescript
// 1. API Response Handler
type ApiResponse<T> = T extends { error: any }
  ? { success: false; error: string }
  : { success: true; data: T };

interface UserData {
  id: number;
  name: string;
}

interface ErrorData {
  error: string;
}

type SuccessResult = ApiResponse<UserData>;
// { success: true; data: UserData }

type ErrorResult = ApiResponse<ErrorData>;
// { success: false; error: string }

// 2. Smart Union Type Handler
type SmartUnion<T> = T extends string 
  ? { type: "string"; value: string; length: number }
  : T extends number
  ? { type: "number"; value: number; isEven: boolean }
  : { type: "unknown"; value: T };

function process<T>(value: T): SmartUnion<T> {
  if (typeof value === "string") {
    return { 
      type: "string", 
      value, 
      length: value.length 
    } as SmartUnion<T>;
  }
  if (typeof value === "number") {
    return { 
      type: "number", 
      value, 
      isEven: value % 2 === 0 
    } as SmartUnion<T>;
  }
  return { type: "unknown", value } as SmartUnion<T>;
}

// 3. Deep Partial (recursive)
type DeepPartial<T> = T extends object 
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

interface NestedConfig {
  database: {
    host: string;
    port: number;
    credentials: {
      username: string;
      password: string;
    };
  };
  cache: {
    enabled: boolean;
    ttl: number;
  };
}

type PartialConfig = DeepPartial<NestedConfig>;
// All nested properties become optional

// 4. Type-safe Event Emitter
type EventMap = {
  click: { x: number; y: number };
  focus: { element: string };
  submit: { formData: Record<string, any> };
};

type EventCallback<T extends keyof EventMap> = 
  (data: EventMap[T]) => void;

class TypedEventEmitter {
  on<T extends keyof EventMap>(
    event: T, 
    callback: EventCallback<T>
  ): void {
    // Implementation
  }

  emit<T extends keyof EventMap>(
    event: T, 
    data: EventMap[T]
  ): void {
    // Implementation
  }
}
```

**Key Takeaways:**
- Conditional types enable type-level logic
- `infer` keyword extracts types from other types
- Distributes over unions by default
- Essential for building advanced utility types
- Enables type-safe generic programming
- Foundation for many TypeScript patterns

---

## Question 8: Explain Template Literal Types. How can they be used for type-safe string manipulations?

### Answer

**Template Literal Types** build on string literal types, allowing you to create new string types through template string syntax. They enable powerful compile-time string transformations and pattern matching.

### Basic Template Literal Types

```typescript
// Basic template literal type
type Greeting = `Hello ${string}`;

let greeting1: Greeting = "Hello World";       // OK
let greeting2: Greeting = "Hello TypeScript";  // OK
// let greeting3: Greeting = "Hi there";       // Error

// Combining with unions
type Color = "red" | "blue" | "green";
type Shade = "light" | "dark";
type ColorCombination = `${Shade}-${Color}`;

let color1: ColorCombination = "light-red";   // OK
let color2: ColorCombination = "dark-blue";   // OK
// let color3: ColorCombination = "medium-red"; // Error

// Multiple unions create all combinations
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type APIVersion = "v1" | "v2";
type Endpoint = `/${APIVersion}/users`;
type APIRoute = `${HTTPMethod} ${Endpoint}`;

let route1: APIRoute = "GET /v1/users";   // OK
let route2: APIRoute = "POST /v2/users";  // OK
// Result: "GET /v1/users" | "GET /v2/users" | "POST /v1/users" | ...
```

### Intrinsic String Manipulation Types

TypeScript provides built-in utility types for string transformations:

```typescript
// Uppercase - Convert to uppercase
type Uppercase<S extends string> = intrinsic;

type UpperName = Uppercase<"alice">;  // "ALICE"
type UpperGreet = Uppercase<"hello world">;  // "HELLO WORLD"

// Lowercase - Convert to lowercase
type Lowercase<S extends string> = intrinsic;

type LowerName = Lowercase<"ALICE">;  // "alice"
type LowerGreet = Lowercase<"HELLO WORLD">;  // "hello world"

// Capitalize - Capitalize first letter
type Capitalize<S extends string> = intrinsic;

type CapName = Capitalize<"alice">;   // "Alice"
type CapGreet = Capitalize<"hello">;  // "Hello"

// Uncapitalize - Lowercase first letter
type Uncapitalize<S extends string> = intrinsic;

type UncapName = Uncapitalize<"Alice">;  // "alice"
type UncapClass = Uncapitalize<"MyClass">;  // "myClass"
```

### Practical Examples

#### 1. CSS Variable Names

```typescript
type CSSProperty = 
  | "color" 
  | "background-color" 
  | "font-size" 
  | "border-radius"
  | "padding"
  | "margin";

type CSSVariable = `--${CSSProperty}`;

let primaryColor: CSSVariable = "--color";
let bgColor: CSSVariable = "--background-color";
let fontSize: CSSVariable = "--font-size";

// Usage in React/styled-components
const styles = {
  "--color": "#ff0000",
  "--font-size": "16px"
} as Record<CSSVariable, string>;
```

#### 2. Event Handler Types

```typescript
type EventName = "click" | "focus" | "blur" | "change" | "submit";
type EventHandler = `on${Capitalize<EventName>}`;

// Result: "onClick" | "onFocus" | "onBlur" | "onChange" | "onSubmit"

interface ButtonProps {
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

// Generate event handlers automatically
type EventHandlers<T extends string> = {
  [K in T as `on${Capitalize<K>}`]?: () => void;
};

type AllEventHandlers = EventHandlers<EventName>;
```

#### 3. RESTful API Routes

```typescript
type Resource = "user" | "product" | "order" | "category";
type Action = "create" | "read" | "update" | "delete" | "list";
type APIEndpoint = `/api/${Resource}/${Action}`;

let endpoint1: APIEndpoint = "/api/user/create";
let endpoint2: APIEndpoint = "/api/product/list";
let endpoint3: APIEndpoint = "/api/order/update";

// With ID parameter
type ResourceWithId = `/api/${Resource}/${number}`;
type EndpointWithId = `/api/${Resource}/${Action}/${number}`;

// HTTP Method + Endpoint
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type APIRoute = `${HTTPMethod} ${APIEndpoint}`;
```

#### 4. Database Table Names

```typescript
type TablePrefix = "tbl";
type EntityName = "users" | "products" | "orders" | "categories";
type TableName = `${TablePrefix}_${EntityName}`;

let usersTable: TableName = "tbl_users";
let productsTable: TableName = "tbl_products";

// With environment prefix
type Environment = "dev" | "staging" | "prod";
type FullTableName = `${Environment}_${TableName}`;

let devUsersTable: FullTableName = "dev_tbl_users";
let prodOrdersTable: FullTableName = "prod_tbl_orders";
```

### Advanced Template Literal Patterns

#### 5. Getter/Setter Generation

```typescript
type Property = "name" | "age" | "email" | "status";

type Getter = `get${Capitalize<Property>}`;
type Setter = `set${Capitalize<Property>}`;
type Accessor = Getter | Setter;

// Combine with mapped types
type PropertyAccessors = {
  [K in Property as `get${Capitalize<K>}`]: () => string;
} & {
  [K in Property as `set${Capitalize<K>}`]: (value: string) => void;
};

// Result: {
//   getName: () => string;
//   setName: (value: string) => void;
//   getAge: () => string;
//   setAge: (value: string) => void;
//   ...
// }
```

#### 6. Path Parameter Extraction

```typescript
// Extract path parameters from route string
type ExtractPathParams<T extends string> = 
  T extends `${infer Start}/:${infer Param}/${infer Rest}`
    ? Param | ExtractPathParams<`/${Rest}`>
    : T extends `${infer Start}/:${infer Param}`
      ? Param
      : never;

type Path1 = "/users/:userId/posts/:postId";
type Params1 = ExtractPathParams<Path1>;  // "userId" | "postId"

type Path2 = "/api/:version/resources/:id";
type Params2 = ExtractPathParams<Path2>;  // "version" | "id"

// Type-safe route handler
type RouteParams<T extends string> = {
  [K in ExtractPathParams<T>]: string;
};

function handleRoute<T extends string>(
  path: T,
  handler: (params: RouteParams<T>) => void
) {
  // Implementation
}

handleRoute("/users/:userId/posts/:postId", (params) => {
  params.userId;  // Type-safe access
  params.postId;  // Type-safe access
});
```

#### 7. SQL Query Builder

```typescript
type SQLOperator = "SELECT" | "INSERT" | "UPDATE" | "DELETE";
type SQLClause = "FROM" | "WHERE" | "ORDER BY" | "LIMIT";
type Table = "users" | "products" | "orders";

type SelectQuery = `${Extract<SQLOperator, "SELECT">} * FROM ${Table}`;
type InsertQuery = `${Extract<SQLOperator, "INSERT">} INTO ${Table}`;

let query1: SelectQuery = "SELECT * FROM users";
let query2: InsertQuery = "INSERT INTO products";
```

#### 8. Unit Types

```typescript
type Unit = "px" | "em" | "rem" | "%" | "vh" | "vw" | "vmin" | "vmax";
type CSSValue<T extends number> = `${T}${Unit}`;

let fontSize: CSSValue<16> = "16px";
let width: CSSValue<100> = "100%";
let height: CSSValue<50> = "50vh";

// Color types
type HexDigit = "0"|"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"|"a"|"b"|"c"|"d"|"e"|"f"|"A"|"B"|"C"|"D"|"E"|"F";
type HexColor = `#${string}`;  // Simplified, full version would be verbose

let color1: HexColor = "#ff5733";
let color2: HexColor = "#000000";
```

#### 9. Redux Action Types

```typescript
type EntityType = "USER" | "PRODUCT" | "ORDER" | "CART";
type CRUDAction = "CREATE" | "READ" | "UPDATE" | "DELETE";
type RequestStatus = "REQUEST" | "SUCCESS" | "FAILURE";

type ActionType = `${EntityType}_${CRUDAction}_${RequestStatus}`;

let action1: ActionType = "USER_CREATE_REQUEST";
let action2: ActionType = "PRODUCT_UPDATE_SUCCESS";
let action3: ActionType = "ORDER_DELETE_FAILURE";

// Action creator with type-safe types
interface Action<T extends ActionType> {
  type: T;
  payload?: any;
}

function createAction<T extends ActionType>(type: T, payload?: any): Action<T> {
  return { type, payload };
}

const action = createAction("USER_CREATE_REQUEST", { name: "Alice" });
```

#### 10. Form Field State Management

```typescript
type FormField = "firstName" | "lastName" | "email" | "password";

// Generate complete form state type
type FormState = {
  [K in FormField as `${K}Value`]: string;
} & {
  [K in FormField as `${K}Error`]: string | null;
} & {
  [K in FormField as `is${Capitalize<K>}Valid`]: boolean;
};

// Result: {
//   firstNameValue: string;
//   firstNameError: string | null;
//   isFirstNameValid: boolean;
//   lastNameValue: string;
//   lastNameError: string | null;
//   isLastNameValid: boolean;
//   emailValue: string;
//   emailError: string | null;
//   isEmailValid: boolean;
//   passwordValue: string;
//   passwordError: string | null;
//   isPasswordValid: boolean;
// }

const formState: FormState = {
  firstNameValue: "John",
  firstNameError: null,
  isFirstNameValid: true,
  lastNameValue: "Doe",
  lastNameError: null,
  isLastNameValid: true,
  emailValue: "john@example.com",
  emailError: null,
  isEmailValid: true,
  passwordValue: "secret",
  passwordError: null,
  isPasswordValid: true
};
```

#### 11. React Component Prop Types

```typescript
type Size = "small" | "medium" | "large" | "xl";
type Variant = "primary" | "secondary" | "danger" | "success";