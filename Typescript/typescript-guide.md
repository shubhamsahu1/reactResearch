# TypeScript Comprehensive Guide

A complete guide covering core TypeScript concepts and advanced features with theoretical explanations and practical pseudo code examples.

---

## Table of Contents

### Part 1: Core TypeScript Concepts
1. [Primitive Types](#1-primitive-types)
2. [Interfaces](#2-interfaces)
3. [Classes](#3-classes)
4. [Enums](#4-enums)
5. [Generics](#5-generics)
6. [Type Annotations](#6-type-annotations)
7. [Type Inference](#7-type-inference)
8. [Type Guards](#8-type-guards)

### Part 2: Advanced TypeScript Features
1. [Union Types](#1-union-types)
2. [Intersection Types](#2-intersection-types)
3. [Mapped Types](#3-mapped-types)
4. [Conditional Types](#4-conditional-types)
5. [Template Literal Types](#5-template-literal-types)

---

# Part 1: Core TypeScript Concepts

## 1. Primitive Types

### Theory
TypeScript extends JavaScript by adding static types. The primitive types include:
- `string` - textual data
- `number` - numeric values (integers and floats)
- `boolean` - true/false values
- `null` - intentional absence of value
- `undefined` - uninitialized value
- `symbol` - unique identifiers
- `bigint` - large integers

### Pseudo Code Examples

```typescript
// Basic primitive types
let username: string = "Alice";
let age: number = 30;
let isActive: boolean = true;
let data: null = null;
let notAssigned: undefined = undefined;

// Number can be integer or float
let integer: number = 42;
let float: number = 3.14;
let hex: number = 0xf00d;
let binary: number = 0b1010;

// String with template literals
let greeting: string = `Hello, ${username}!`;

// Arrays of primitives
let numbers: number[] = [1, 2, 3, 4, 5];
let names: Array<string> = ["Alice", "Bob", "Charlie"];

// Tuple - fixed length array with specific types
let person: [string, number] = ["Alice", 30];

// Any - opt-out of type checking (use sparingly)
let flexible: any = "can be anything";
flexible = 42;
flexible = true;

// Unknown - safer alternative to any
let uncertain: unknown = "some value";
if (typeof uncertain === "string") {
  console.log(uncertain.toUpperCase());
}

// Void - absence of return value
function logMessage(message: string): void {
  console.log(message);
}

// Never - function never returns
function throwError(message: string): never {
  throw new Error(message);
}
```

---

## 2. Interfaces

### Theory
Interfaces define the structure of objects. They describe the shape of data and can be used to enforce contracts in your code. Interfaces support:
- Property definitions
- Optional properties (`?`)
- Readonly properties
- Method signatures
- Index signatures
- Extension (inheritance)

### Pseudo Code Examples

```typescript
// Basic interface
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

// Optional properties
interface Product {
  id: number;
  name: string;
  description?: string; // Optional
  price: number;
}

const product: Product = {
  id: 101,
  name: "Laptop",
  price: 999.99
  // description is optional
};

// Readonly properties
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}

const config: Config = {
  apiUrl: "https://api.example.com",
  timeout: 5000
};
// config.apiUrl = "new url"; // Error: Cannot assign to readonly property

// Method signatures
interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
}

const calc: Calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// Index signatures - for dynamic properties
interface StringDictionary {
  [key: string]: string;
}

const translations: StringDictionary = {
  hello: "Hola",
  goodbye: "Adiós",
  thanks: "Gracias"
};

// Interface extension (inheritance)
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;
  bark(): void;
}

const myDog: Dog = {
  name: "Buddy",
  age: 5,
  breed: "Golden Retriever",
  bark: () => console.log("Woof!")
};

// Multiple interface extension
interface Walkable {
  walk(): void;
}

interface Swimmable {
  swim(): void;
}

interface Amphibian extends Walkable, Swimmable {
  name: string;
}

const frog: Amphibian = {
  name: "Kermit",
  walk: () => console.log("Hopping"),
  swim: () => console.log("Swimming")
};
```

---

## 3. Classes

### Theory
Classes in TypeScript provide a way to create objects with shared structure and behavior. They support:
- Properties and methods
- Access modifiers (public, private, protected)
- Constructors
- Inheritance
- Abstract classes
- Static members
- Getters and setters

### Pseudo Code Examples

```typescript
// Basic class
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): string {
    return `Hello, I'm ${this.name}`;
  }
}

const person = new Person("Alice", 30);
console.log(person.greet());

// Access modifiers
class BankAccount {
  public accountNumber: string;
  private balance: number;
  protected accountType: string;

  constructor(accountNumber: string, initialBalance: number) {
    this.accountNumber = accountNumber;
    this.balance = initialBalance;
    this.accountType = "Savings";
  }

  public deposit(amount: number): void {
    this.balance += amount;
  }

  public getBalance(): number {
    return this.balance;
  }

  private calculateInterest(): number {
    return this.balance * 0.05;
  }
}

// Shorthand constructor
class User {
  constructor(
    public id: number,
    public name: string,
    private password: string
  ) {}

  authenticate(pwd: string): boolean {
    return this.password === pwd;
  }
}

// Inheritance
class Employee extends Person {
  employeeId: string;
  department: string;

  constructor(name: string, age: number, employeeId: string, department: string) {
    super(name, age);
    this.employeeId = employeeId;
    this.department = department;
  }

  greet(): string {
    return `${super.greet()}, I work in ${this.department}`;
  }
}

// Abstract classes
abstract class Shape {
  abstract getArea(): number;
  abstract getPerimeter(): number;

  describe(): string {
    return `This shape has an area of ${this.getArea()}`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }

  getPerimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

// Static members
class MathUtils {
  static PI: number = 3.14159;

  static calculateCircleArea(radius: number): number {
    return MathUtils.PI * radius ** 2;
  }
}

console.log(MathUtils.calculateCircleArea(5));

// Getters and setters
class Temperature {
  private _celsius: number = 0;

  get celsius(): number {
    return this._celsius;
  }

  set celsius(value: number) {
    if (value < -273.15) {
      throw new Error("Temperature below absolute zero");
    }
    this._celsius = value;
  }

  get fahrenheit(): number {
    return (this._celsius * 9/5) + 32;
  }

  set fahrenheit(value: number) {
    this._celsius = (value - 32) * 5/9;
  }
}

// Implementing interfaces
interface Printable {
  print(): void;
}

class Document implements Printable {
  constructor(private content: string) {}

  print(): void {
    console.log(this.content);
  }
}
```

---

## 4. Enums

### Theory
Enums allow you to define a set of named constants. They make code more readable and maintainable. Types include:
- Numeric enums (default)
- String enums
- Heterogeneous enums (mixed)
- Const enums (compile-time only)

### Pseudo Code Examples

```typescript
// Numeric enum (auto-incremented from 0)
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right  // 3
}

let playerDirection: Direction = Direction.Up;

// Numeric enum with custom values
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalServerError = 500
}

function handleResponse(status: HttpStatus): string {
  switch (status) {
    case HttpStatus.OK:
      return "Success";
    case HttpStatus.NotFound:
      return "Resource not found";
    default:
      return "Error occurred";
  }
}

// String enum
enum LogLevel {
  Error = "ERROR",
  Warning = "WARNING",
  Info = "INFO",
  Debug = "DEBUG"
}

function log(message: string, level: LogLevel): void {
  console.log(`[${level}] ${message}`);
}

log("Application started", LogLevel.Info);

// Heterogeneous enum (not recommended)
enum Mixed {
  No = 0,
  Yes = "YES"
}

// Const enum (removed at compile time for performance)
const enum Colors {
  Red,
  Green,
  Blue
}

let favoriteColor: Colors = Colors.Blue;

// Reverse mapping (only for numeric enums)
enum Status {
  Active = 1,
  Inactive = 2
}

console.log(Status.Active);    // 1
console.log(Status[1]);        // "Active"

// Using enums as types
interface Task {
  title: string;
  priority: Priority;
  status: TaskStatus;
}

enum Priority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4
}

enum TaskStatus {
  Todo = "TODO",
  InProgress = "IN_PROGRESS",
  Done = "DONE"
}

const task: Task = {
  title: "Fix bug",
  priority: Priority.High,
  status: TaskStatus.InProgress
};
```

---

## 5. Generics

### Theory
Generics allow you to create reusable components that work with multiple types while maintaining type safety. They provide a way to create flexible, type-safe abstractions.

### Pseudo Code Examples

```typescript
// Basic generic function
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("hello");
let output2 = identity<number>(42);

// Type inference with generics
let output3 = identity("world"); // TypeScript infers type as string

// Generic with multiple type parameters
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

let result = pair<string, number>("age", 30);

// Generic interfaces
interface Container<T> {
  value: T;
  getValue(): T;
  setValue(value: T): void;
}

class Box<T> implements Container<T> {
  constructor(public value: T) {}

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }
}

let stringBox = new Box<string>("Hello");
let numberBox = new Box<number>(42);

// Generic classes
class DataStore<T> {
  private data: T[] = [];

  add(item: T): void {
    this.data.push(item);
  }

  remove(item: T): void {
    const index = this.data.indexOf(item);
    if (index > -1) {
      this.data.splice(index, 1);
    }
  }

  getAll(): T[] {
    return [...this.data];
  }
}

let userStore = new DataStore<User>();
userStore.add({ id: 1, name: "Alice", email: "alice@example.com" });

// Generic constraints
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length);
}

logLength("hello");      // Works: string has length
logLength([1, 2, 3]);    // Works: array has length
// logLength(123);       // Error: number doesn't have length

// Using keyof constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

let person = { name: "Alice", age: 30 };
let name = getProperty(person, "name");  // string
let age = getProperty(person, "age");    // number
// let invalid = getProperty(person, "invalid"); // Error

// Generic utility functions
function filter<T>(array: T[], predicate: (item: T) => boolean): T[] {
  return array.filter(predicate);
}

let numbers = [1, 2, 3, 4, 5];
let evenNumbers = filter(numbers, n => n % 2 === 0);

// Default generic types
interface Response<T = any> {
  data: T;
  status: number;
  message: string;
}

let apiResponse: Response<User> = {
  data: { id: 1, name: "Alice", email: "alice@example.com" },
  status: 200,
  message: "Success"
};

// Generic type aliases
type Nullable<T> = T | null;
type Callback<T> = (data: T) => void;
type Dictionary<T> = { [key: string]: T };

let userDict: Dictionary<User> = {
  "user1": { id: 1, name: "Alice", email: "alice@example.com" },
  "user2": { id: 2, name: "Bob", email: "bob@example.com" }
};
```

---

## 6. Type Annotations

### Theory
Type annotations explicitly specify the type of a variable, parameter, or return value. They provide clear contracts and enable better IDE support and compile-time checking.

### Pseudo Code Examples

```typescript
// Variable annotations
let username: string = "Alice";
let age: number = 30;
let isAdmin: boolean = false;

// Function parameter and return type annotations
function add(a: number, b: number): number {
  return a + b;
}

function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Arrow function annotations
const multiply = (a: number, b: number): number => a * b;

// Optional parameters
function buildName(firstName: string, lastName?: string): string {
  return lastName ? `${firstName} ${lastName}` : firstName;
}

// Default parameters
function createUser(name: string, role: string = "user"): void {
  console.log(`Creating ${role}: ${name}`);
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

// Object type annotations
let user: { name: string; age: number; email: string } = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};

// Function type annotations
let calculate: (a: number, b: number) => number;
calculate = (x, y) => x + y;

// Array annotations
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["Alice", "Bob"];
let matrix: number[][] = [[1, 2], [3, 4]];

// Object with method annotations
let calculator: {
  add: (a: number, b: number) => number;
  subtract: (a: number, b: number) => number;
} = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// Union type annotations
let id: string | number;
id = "abc123";
id = 123;

// Literal type annotations
let status: "pending" | "approved" | "rejected";
status = "approved";

// Type assertions
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
// Alternative syntax
let strLength2: number = (<string>someValue).length;

// Const assertions
let config = {
  apiUrl: "https://api.example.com",
  timeout: 5000
} as const;
// config.apiUrl = "new url"; // Error: readonly
```

---

## 7. Type Inference

### Theory
TypeScript can automatically infer types based on the assigned values. This reduces verbosity while maintaining type safety. The compiler analyzes the code context to determine the most appropriate type.

### Pseudo Code Examples

```typescript
// Basic type inference
let name = "Alice";        // Inferred as string
let age = 30;              // Inferred as number
let isActive = true;       // Inferred as boolean

// Array inference
let numbers = [1, 2, 3];   // Inferred as number[]
let mixed = [1, "two", 3]; // Inferred as (string | number)[]

// Object inference
let user = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};
// Type inferred as { id: number; name: string; email: string; }

// Function return type inference
function add(a: number, b: number) {
  return a + b;  // Return type inferred as number
}

function getUser(id: number) {
  return {
    id: id,
    name: "User" + id
  };
  // Return type inferred as { id: number; name: string; }
}

// Contextual typing
window.addEventListener("click", (event) => {
  // event is inferred as MouseEvent
  console.log(event.clientX, event.clientY);
});

const numbers = [1, 2, 3];
numbers.map(n => n * 2); // n is inferred as number

// Best common type
let items = [1, 2, "three"]; // Inferred as (string | number)[]
let values = [null, 42, "hello"]; // Inferred as (string | number | null)[]

// Inference with generics
function identity<T>(arg: T): T {
  return arg;
}

let output = identity("hello"); // T is inferred as string

// Complex inference
class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Dog extends Animal {
  breed: string;
  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }
}

let pets = [new Dog("Buddy", "Labrador"), new Animal("Generic")];
// Inferred as Animal[] (best common type)

// Inference from usage
let x = 3;
// x = "hello"; // Error: Type 'string' is not assignable to type 'number'

// Inference with destructuring
const person = { name: "Alice", age: 30 };
const { name, age } = person; // name: string, age: number

// Inference in callbacks
function process(items: number[], callback: (item: number) => void) {
  items.forEach(callback);
}

process([1, 2, 3], (item) => {
  console.log(item); // item is inferred as number
});

// When inference fails - explicit annotation needed
let value; // Inferred as any (implicit any)
value = "hello";
value = 42;

// Better approach
let value2: string | number;
value2 = "hello";
value2 = 42;
```

---

## 8. Type Guards

### Theory
Type guards are runtime checks that allow TypeScript to narrow down types within conditional blocks. They help in working with union types and ensuring type safety when dealing with multiple possible types.

### Pseudo Code Examples

```typescript
// typeof type guard
function processValue(value: string | number) {
  if (typeof value === "string") {
    // TypeScript knows value is string here
    console.log(value.toUpperCase());
  } else {
    // TypeScript knows value is number here
    console.log(value.toFixed(2));
  }
}

// instanceof type guard
class Dog {
  bark() { console.log("Woof!"); }
}

class Cat {
  meow() { console.log("Meow!"); }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}

// in operator type guard
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
    vehicle.drive();
  } else {
    vehicle.sail();
  }
}

// Custom type guard (type predicate)
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

// Nullish type guards
function processName(name: string | null | undefined) {
  if (name != null) {
    // name is string here (not null or undefined)
    console.log(name.toUpperCase());
  }
}

// Truthiness narrowing
function printLength(value: string | null) {
  if (value) {
    // value is string here
    console.log(value.length);
  } else {
    console.log("No value provided");
  }
}

// Equality narrowing
function compare(x: string | number, y: string | boolean) {
  if (x === y) {
    // x and y are both string here
    console.log(x.toUpperCase(), y.toUpperCase());
  }
}

// Type assertion with type guards
function processInput(input: unknown) {
  if (typeof input === "string") {
    console.log(input.toUpperCase());
  } else if (typeof input === "number") {
    console.log(input.toFixed(2));
  } else if (Array.isArray(input)) {
    console.log(input.length);
  }
}

// Control flow analysis
function example(x: string | number | boolean) {
  if (typeof x === "string") {
    return x.length;
  }
  
  // x is number | boolean here
  if (typeof x === "number") {
    return x.toFixed(2);
  }
  
  // x is boolean here
  return x ? "yes" : "no";
}

// Assertion functions
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Value must be a string");
  }
}

function processValue2(input: unknown) {
  assertIsString(input);
  // TypeScript knows input is string after assertion
  console.log(input.toUpperCase());
}
```

---

# Part 2: Advanced TypeScript Features

## 1. Union Types

### Theory
Union types allow a value to be one of several types. They are created using the `|` operator and are fundamental for expressing values that can have multiple possible types. TypeScript uses type guards to narrow union types to specific members.

**Key Concepts:**
- A value can be any of the types in the union
- Can combine any types (primitives, objects, custom types)
- TypeScript narrows the type through control flow analysis
- Only common properties/methods are accessible without narrowing

### Pseudo Code Examples

```typescript
// Basic union types
let id: string | number;
id = "ABC123";
id = 123;

// Union with literals
type Status = "pending" | "approved" | "rejected";
let orderStatus: Status = "pending";

// Union with objects
interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

type Pet = Bird | Fish;

function getPet(): Pet {
  // Returns either Bird or Fish
  return Math.random() > 0.5 
    ? { fly: () => {}, layEggs: () => {} }
    : { swim: () => {}, layEggs: () => {} };
}

let pet = getPet();
pet.layEggs(); // OK - common to both types
// pet.fly();  // Error - not common

// Working with union types
function formatValue(value: string | number | boolean): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else if (typeof value === "number") {
    return value.toFixed(2);
  } else {
    return value ? "Yes" : "No";
  }
}

// Array of union types
let mixedArray: (string | number)[] = ["hello", 42, "world", 100];

// Function accepting union types
function printId(id: string | number) {
  console.log(`ID: ${id}`);
}

// Union in function return types
function getResponse(success: boolean): { data: string } | { error: string } {
  if (success) {
    return { data: "Success message" };
  }
  return { error: "Error occurred" };
}

// Complex union with interfaces
interface Success {
  success: true;
  data: any;
}

interface Failure {
  success: false;
  error: string;
}

type Result = Success | Failure;

function handleResult(result: Result) {
  if (result.success) {
    console.log(result.data);
  } else {
    console.log(result.error);
  }
}

// Union with null/undefined
type Nullable<T> = T | null | undefined;
let username: Nullable<string> = "Alice";
username = null;
username = undefined;

// Discriminated union pattern
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

---

## 2. Intersection Types

### Theory
Intersection types combine multiple types into one. A value must satisfy all types in the intersection. Created using the `&` operator, they're useful for composing types and creating complex type definitions.

**Key Concepts:**
- Value must have all properties from all types
- Commonly used for mixins and composition
- Can combine interfaces, type aliases, and object types
- Resulting type has all members of constituent types

### Pseudo Code Examples

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
};

// Multiple intersections
interface Printable {
  print(): void;
}

interface Loggable {
  log(): void;
}

interface Serializable {
  serialize(): string;
}

type Document = Printable & Loggable & Serializable;

const doc: Document = {
  print: () => console.log("Printing..."),
  log: () => console.log("Logging..."),
  serialize: () => "serialized data"
};

// Intersection with type aliases
type Point = { x: number; y: number };
type Colored = { color: string };
type ColoredPoint = Point & Colored;

const point: ColoredPoint = {
  x: 10,
  y: 20,
  color: "red"
};

// Mixin pattern with intersections
function mixin<T, U>(first: T, second: U): T & U {
  return { ...first, ...second };
}

const person = { name: "Alice", age: 30 };
const contact = { email: "alice@example.com", phone: "123-456" };
const personWithContact = mixin(person, contact);
// Type: { name: string; age: number; email: string; phone: string; }

// Intersection in function parameters
interface Timestamped {
  timestamp: Date;
}

interface Tagged {
  tags: string[];
}

function processData(data: Timestamped & Tagged) {
  console.log(data.timestamp, data.tags);
}

// Complex intersection
interface HasId {
  id: number;
}

interface HasName {
  name: string;
}

interface HasEmail {
  email: string;
}

type User = HasId & HasName & HasEmail;

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

// Intersection with methods
interface CanRead {
  read(): string;
}

interface CanWrite {
  write(data: string): void;
}

type ReadWrite = CanRead & CanWrite;

class FileHandler implements ReadWrite {
  read(): string {
    return "file content";
  }
  
  write(data: string): void {
    console.log("Writing:", data);
  }
}

// Intersection creating narrower types
type Admin = {
  role: "admin";
  permissions: string[];
};

type SuperUser = {
  role: "admin";
  canAccessAll: boolean;
};

type SuperAdmin = Admin & SuperUser;
// role must be "admin" in both, combined result

// Conditional logic with intersections
function extend<T, U>(obj: T, extension: U): T & U {
  return Object.assign({}, obj, extension);
}

const base = { a: 1, b: 2 };
const extended = extend(base, { c: 3, d: 4 });
// extended has type { a: number; b: number; c: number; d: number; }
```

---

## 3. Mapped Types

### Theory
Mapped types create new types by transforming properties of existing types. They iterate over keys of a type and apply transformations. Essential for creating utility types and variations of existing types.

**Key Concepts:**
- Transform each property in a type
- Can add/remove modifiers (readonly, optional)
- Use `keyof` to iterate over keys
- Can create variations like Partial, Required, Readonly

### Pseudo Code Examples

```typescript
// Basic mapped type
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
// Result: { readonly name: string; readonly age: number; }

// Making properties optional
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type PartialUser = Partial<User>;
// Result: { name?: string; age?: number; }

// Making properties required
type Required<T> = {
  [P in keyof T]-?: T[P];
};

interface PartialProduct {
  name?: string;
  price?: number;
}

type CompleteProduct = Required<PartialProduct>;
// Result: { name: string; price: number; }

// Pick - select subset of properties
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

interface Person {
  name: string;
  age: number;
  email: string;
  address: string;
}

type PersonPreview = Pick<Person, "name" | "email">;
// Result: { name: string; email: string; }

// Omit - exclude properties
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type PersonWithoutAddress = Omit<Person, "address">;
// Result: { name: string; age: number; email: string; }

// Record - create object type with specific keys
type Record<K extends string | number | symbol, T> = {
  [P in K]: T;
};

type PageInfo = Record<"home" | "about" | "contact", { title: string; url: string }>;
// Result: {
//   home: { title: string; url: string };
//   about: { title: string; url: string };
//   contact: { title: string; url: string };
// }

// Custom mapped type - nullify all properties
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type NullableUser = Nullable<User>;
// Result: { name: string | null; age: number | null; }

// Mapped type with conditional types
type ReadonlyPartial<T> = {
  readonly [P in keyof T]?: T[P];
};

// Mapping to different types
type Stringify<T> = {
  [P in keyof T]: string;
};

interface Config {
  timeout: number;
  retries: number;
  debug: boolean;
}

type StringConfig = Stringify<Config>;
// Result: { timeout: string; retries: string; debug: string; }

// Mapped type with key remapping (TypeScript 4.1+)
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

interface State {
  name: string;
  age: number;
}

type StateGetters = Getters<State>;
// Result: { getName: () => string; getAge: () => number; }

// Mapped type filtering keys
type OnlyStrings<T> = {
  [P in keyof T as T[P] extends string ? P : never]: T[P];
};

interface Mixed {
  name: string;
  age: number;
  email: string;
  active: boolean;
}

type StringFields = OnlyStrings<Mixed>;
// Result: { name: string; email: string; }

// Deep readonly mapped type
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

interface NestedData {
  user: {
    name: string;
    settings: {
      theme: string;
    };
  };
}

type ImmutableData = DeepReadonly<NestedData>;
// All nested properties become readonly

// Practical example: API response mapper
interface ApiUser {
  user_id: number;
  user_name: string;
  user_email: string;
}

type CamelCaseKeys<T> = {
  [P in keyof T as P extends `${infer Start}_${infer End}` 
    ? `${Start}${Capitalize<End>}` 
    : P]: T[P];
};

type FrontendUser = CamelCaseKeys<ApiUser>;
// Result: { userId: number; userName: string; userEmail: string; }
```

---

## 4. Conditional Types

### Theory
Conditional types select one of two possible types based on a condition. They use the `extends` keyword to test types and enable powerful type-level logic and transformations.

**Syntax:** `T extends U ? X : Y`

**Key Concepts:**
- Type-level if-else statements
- Can extract types from other types
- Used extensively in utility types
- Enable generic type constraints and inference

### Pseudo Code Examples

```typescript
// Basic conditional type
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// Conditional type with inference
type ExtractReturn<T> = T extends (...args: any[]) => infer R ? R : never;

type FunctionType = () => string;
type ReturnValue = ExtractReturn<FunctionType>;  // string

// Exclude - remove types from union
type Exclude<T, U> = T extends U ? never : T;

type Numbers = 1 | 2 | 3 | 4 | 5;
type NotThree = Exclude<Numbers, 3>;  // 1 | 2 | 4 | 5

type Mixed = string | number | boolean;
type OnlyNumbers = Exclude<Mixed, string | boolean>;  // number

// Extract - keep only matching types
type Extract<T, U> = T extends U ? T : never;

type StringsOnly = Extract<Mixed, string>;  // string

// NonNullable - remove null and undefined
type NonNullable<T> = T extends null | undefined ? never : T;

type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;  // string

// ReturnType utility
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

function getUser() {
  return { id: 1, name: "Alice" };
}

type UserType = ReturnType<typeof getUser>;
// Result: { id: number; name: string; }

// Parameters utility
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

function createUser(name: string, age: number, email: string) {
  return { name, age, email };
}

type CreateUserParams = Parameters<typeof createUser>;
// Result: [string, number, string]

// Nested conditional types
type TypeName<T> = 
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends undefined ? "undefined" :
  T extends Function ? "function" :
  "object";

type T1 = TypeName<string>;    // "string"
type T2 = TypeName<number>;    // "number"
type T3 = TypeName<() => void>; // "function"

// Conditional types with objects
type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

interface Example {
  name: string;
  age: number;
  greet(): void;
  calculate(x: number): number;
}

type DataProperties = NonFunctionPropertyNames<Example>;
// Result: "name" | "age"

// Conditional type for flattening arrays
type Flatten<T> = T extends Array<infer U> ? U : T;

type Str = Flatten<string[]>;    // string
type Num = Flatten<number>;      // number

// Advanced: Unwrap Promise type
type Awaited<T> = T extends Promise<infer U> ? U : T;

type AsyncString = Awaited<Promise<string>>;  // string
type SyncNumber = Awaited<number>;           // number

// Recursive conditional type
type DeepFlatten<T> = T extends Array<infer U> 
  ? DeepFlatten<U> 
  : T;

type NestedArray = DeepFlatten<number[][][]>;  // number

// Conditional type with constraints
type GetProperty<T, K extends keyof T> = T[K] extends infer P 
  ? P extends Function 
    ? never 
    : P
  : never;

// Distributive conditional types
type ToArray<T> = T extends any ? T[] : never;

type StrOrNumArray = ToArray<string | number>;
// Result: string[] | number[] (distributed over union)

// Non-distributive (wrapped in tuple)
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type Combined = ToArrayNonDist<string | number>;
// Result: (string | number)[]

// Practical example: API result type
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
// Result: { success: true; data: UserData }

type ErrorResult = ApiResponse<ErrorData>;
// Result: { success: false; error: string }

// Conditional type for readonly
type IfReadonly<T, Y, N> = T extends Readonly<T> ? Y : N;

// Conditional mapping
type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

interface PartialInterface {
  required: string;
  optional?: number;
}

type OptionalProperties = OptionalKeys<PartialInterface>;  // "optional"
type RequiredProperties = RequiredKeys<PartialInterface>;  // "required"
```

---

## 5. Template Literal Types

### Theory
Template literal types build on string literal types, allowing you to create new string literal types through concatenation and manipulation. They enable powerful string-based type transformations and pattern matching.

**Key Concepts:**
- Create types from string patterns
- Combine with unions for multiple variations
- Use with mapped types for key transformations
- Support intrinsic string manipulation utilities

### Pseudo Code Examples

```typescript
// Basic template literal type
type Greeting = `Hello ${string}`;

let greeting1: Greeting = "Hello World";  // OK
let greeting2: Greeting = "Hello TypeScript";  // OK
// let greeting3: Greeting = "Hi there";  // Error

// Combining with unions
type Direction = "top" | "bottom" | "left" | "right";
type Margin = `margin-${Direction}`;

let margin: Margin = "margin-top";  // OK
// let invalid: Margin = "margin-center";  // Error

// Multiple substitutions
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type APIVersion = "v1" | "v2";
type Endpoint = `/${APIVersion}/${string}`;
type APIRoute = `${HTTPMethod} ${Endpoint}`;

let route: APIRoute = "GET /v1/users";  // OK
let createRoute: APIRoute = "POST /v2/products";  // OK

// Intrinsic string manipulation types
type Uppercase<S extends string> = intrinsic;
type Lowercase<S extends string> = intrinsic;
type Capitalize<S extends string> = intrinsic;
type Uncapitalize<S extends string> = intrinsic;

type UpperName = Uppercase<"alice">;  // "ALICE"
type LowerName = Lowercase<"ALICE">;  // "alice"
type CapName = Capitalize<"alice">;   // "Alice"
type UncapName = Uncapitalize<"Alice">;  // "alice"

// Practical: CSS properties
type CSSProperty = 
  | "color" 
  | "background-color" 
  | "font-size" 
  | "border-radius";

type CSSVariable = `--${CSSProperty}`;

let primaryColor: CSSVariable = "--color";
let bgColor: CSSVariable = "--background-color";

// Event handler types
type EventName = "click" | "focus" | "blur" | "change";
type EventHandler = `on${Capitalize<EventName>}`;

type Handler = EventHandler;  
// "onClick" | "onFocus" | "onBlur" | "onChange"

// Combining with mapped types
type Events = {
  click: MouseEvent;
  focus: FocusEvent;
  blur: FocusEvent;
};

type EventHandlers = {
  [K in keyof Events as `on${Capitalize<string & K>}`]: (event: Events[K]) => void;
};
// Result: {
//   onClick: (event: MouseEvent) => void;
//   onFocus: (event: FocusEvent) => void;
//   onBlur: (event: FocusEvent) => void;
// }

// API endpoint builder
type Resource = "user" | "product" | "order";
type Action = "create" | "read" | "update" | "delete";
type APIEndpoint = `/api/${Resource}/${Action}`;

let endpoint: APIEndpoint = "/api/user/create";

// Database table names
type TablePrefix = "tbl";
type EntityName = "users" | "products" | "orders";
type TableName = `${TablePrefix}_${EntityName}`;

let tableName: TableName = "tbl_users";

// Getter/Setter generation
type Property = "name" | "age" | "email";
type Getter = `get${Capitalize<Property>}`;
type Setter = `set${Capitalize<Property>}`;

type AccessorMethod = Getter | Setter;
// "getName" | "getAge" | "getEmail" | "setName" | "setAge" | "setEmail"

// Path parameter extraction
type ExtractPathParams<T extends string> = 
  T extends `${infer Start}/:${infer Param}/${infer Rest}`
    ? Param | ExtractPathParams<`/${Rest}`>
    : T extends `${infer Start}/:${infer Param}`
      ? Param
      : never;

type Path = "/users/:userId/posts/:postId";
type Params = ExtractPathParams<Path>;  // "userId" | "postId"

// SQL query builder types
type SQLOperator = "SELECT" | "INSERT" | "UPDATE" | "DELETE";
type SQLClause = "FROM" | "WHERE" | "ORDER BY";
type SQLQuery = `${SQLOperator} * ${SQLClause} ${string}`;

let query: SQLQuery = "SELECT * FROM users";

// Unit types
type Unit = "px" | "em" | "rem" | "%" | "vh" | "vw";
type CSSValue<T extends number> = `${T}${Unit}`;

let fontSize: CSSValue<16> = "16px";
let width: CSSValue<100> = "100%";

// Color types
type HexDigit = "0"|"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"|"a"|"b"|"c"|"d"|"e"|"f";
type HexColor = `#${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}`;

let color: HexColor = "#ff5733";

// React component prop types
type Size = "small" | "medium" | "large";
type Variant = "primary" | "secondary" | "danger";
type ButtonClass = `btn-${Size}-${Variant}`;

let buttonClass: ButtonClass = "btn-small-primary";

// Redux action types
type EntityType = "USER" | "PRODUCT" | "ORDER";
type CRUDAction = "CREATE" | "READ" | "UPDATE" | "DELETE";
type ActionType = `${EntityType}_${CRUDAction}_REQUEST` 
                | `${EntityType}_${CRUDAction}_SUCCESS` 
                | `${EntityType}_${CRUDAction}_FAILURE`;

let action: ActionType = "USER_CREATE_REQUEST";

// File path types
type FileExtension = "ts" | "js" | "tsx" | "jsx";
type FileName<T extends string> = `${T}.${FileExtension}`;

let file: FileName<"App"> = "App.tsx";

// Complex pattern matching
type RoutePattern = `/${string}` | `/${string}/${string}`;
type APIRouteWithMethod = `${HTTPMethod} ${RoutePattern}`;

// Combining multiple features
type HttpStatusCode = 200 | 201 | 400 | 401 | 404 | 500;
type StatusMessage<T extends HttpStatusCode> = 
  T extends 200 ? "OK" :
  T extends 201 ? "Created" :
  T extends 400 ? "Bad Request" :
  T extends 401 ? "Unauthorized" :
  T extends 404 ? "Not Found" :
  T extends 500 ? "Internal Server Error" :
  never;

type Status200 = StatusMessage<200>;  // "OK"
type Status404 = StatusMessage<404>;  // "Not Found"

// Practical: Form field names
type FormField = "firstName" | "lastName" | "email" | "password";
type FieldError = `${FormField}Error`;
type FieldValue = `${FormField}Value`;
type FieldValid = `is${Capitalize<FormField>}Valid`;

// Result types for complete form state
type FormState = {
  [K in FormField as `${K}Value`]: string;
} & {
  [K in FormField as `${K}Error`]: string | null;
} & {
  [K in FormField as `is${Capitalize<K>}Valid`]: boolean;
};

// Navigation types
type NavItem = "home" | "about" | "contact" | "products";
type NavPath = `/${NavItem}` | "/";
type NavWithQuery = `${NavPath}?${string}`;

let navPath: NavPath = "/home";
let navWithQuery: NavWithQuery = "/products?category=electronics";
```

---

## Summary

This guide covers both fundamental and advanced TypeScript concepts:

**Core Concepts** provide the foundation:
- Type safety through primitives, interfaces, and classes
- Code organization with enums and generics
- Type checking with annotations, inference, and guards

**Advanced Features** enable powerful abstractions:
- Union types for flexible value types
- Intersection types for type composition
- Mapped types for type transformations
- Conditional types for type-level logic
- Template literal types for string-based type patterns

Together, these features make TypeScript a powerful tool for building maintainable, type-safe applications while providing excellent developer experience through IntelliSense and compile-time error checking.