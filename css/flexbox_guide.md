# Complete Flexbox Guide

## What is Flexbox?

Flexbox (Flexible Box Layout) is a CSS layout method that provides an efficient way to arrange, distribute, and align items in a container, even when their size is unknown or dynamic. It's particularly useful for creating responsive designs and solving common layout problems.

## Basic Concepts

### Flex Container and Flex Items

- **Flex Container**: The parent element with `display: flex` or `display: inline-flex`
- **Flex Items**: Direct children of the flex container

### Main Axis and Cross Axis

- **Main Axis**: The primary axis along which flex items are laid out
- **Cross Axis**: The axis perpendicular to the main axis

```
Main Axis (horizontal by default)
←―――――――――――――――――――――――――――――――→
↑                               ↑
|          [Item 1]             |
|          [Item 2]             | Cross Axis
|          [Item 3]             | (vertical)
↓                               ↓
```

## Flex Container Properties

### 1. display

Defines a flex container and enables flexbox for its direct children.

```css
.container {
  display: flex; /* or inline-flex */
}
```

**Example:**
```html
<div class="container">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
</div>
```

### 2. flex-direction

Defines the direction of the main axis.

```css
.container {
  flex-direction: row; /* default */
  /* flex-direction: row-reverse; */
  /* flex-direction: column; */
  /* flex-direction: column-reverse; */
}
```

**Values:**
- `row`: Left to right (default)
- `row-reverse`: Right to left
- `column`: Top to bottom
- `column-reverse`: Bottom to top

### 3. flex-wrap

Controls whether flex items wrap to new lines.

```css
.container {
  flex-wrap: nowrap; /* default */
  /* flex-wrap: wrap; */
  /* flex-wrap: wrap-reverse; */
}
```

**Values:**
- `nowrap`: All items on one line (default)
- `wrap`: Items wrap to new lines as needed
- `wrap-reverse`: Items wrap to new lines in reverse order

### 4. flex-flow

Shorthand for `flex-direction` and `flex-wrap`.

```css
.container {
  flex-flow: row wrap;
  /* Same as: */
  /* flex-direction: row; */
  /* flex-wrap: wrap; */
}
```

### 5. justify-content

Aligns items along the main axis.

```css
.container {
  justify-content: flex-start; /* default */
  /* justify-content: flex-end; */
  /* justify-content: center; */
  /* justify-content: space-between; */
  /* justify-content: space-around; */
  /* justify-content: space-evenly; */
}
```

**Values:**
- `flex-start`: Items align to start of container
- `flex-end`: Items align to end of container
- `center`: Items align in center
- `space-between`: Even spacing between items
- `space-around`: Equal space around each item
- `space-evenly`: Equal space between and around items

### 6. align-items

Aligns items along the cross axis.

```css
.container {
  align-items: stretch; /* default */
  /* align-items: flex-start; */
  /* align-items: flex-end; */
  /* align-items: center; */
  /* align-items: baseline; */
}
```

**Values:**
- `stretch`: Items stretch to fill container (default)
- `flex-start`: Items align to start of cross axis
- `flex-end`: Items align to end of cross axis
- `center`: Items align in center of cross axis
- `baseline`: Items align along their text baseline

### 7. align-content

Aligns wrapped lines along the cross axis.

```css
.container {
  align-content: stretch; /* default */
  /* align-content: flex-start; */
  /* align-content: flex-end; */
  /* align-content: center; */
  /* align-content: space-between; */
  /* align-content: space-around; */
  /* align-content: space-evenly; */
}
```

**Note:** Only works when `flex-wrap: wrap` is used and there are multiple lines.

### 8. gap

Sets spacing between flex items.

```css
.container {
  gap: 20px; /* Same gap for rows and columns */
  /* gap: 10px 20px; */ /* Different gap for rows and columns */
  /* row-gap: 10px; */ /* Gap between rows only */
  /* column-gap: 20px; */ /* Gap between columns only */
}
```

## Flex Item Properties

### 1. order

Controls the order of flex items without changing HTML structure.

```css
.item {
  order: 0; /* default */
}

.item-1 { order: 3; }
.item-2 { order: 1; }
.item-3 { order: 2; }
```

### 2. flex-grow

Defines how much a flex item should grow relative to other items.

```css
.item {
  flex-grow: 0; /* default */
}

.item-1 { flex-grow: 1; }
.item-2 { flex-grow: 2; } /* This item will be twice as wide */
.item-3 { flex-grow: 1; }
```

### 3. flex-shrink

Defines how much a flex item should shrink relative to other items.

```css
.item {
  flex-shrink: 1; /* default */
}

.item-1 { flex-shrink: 0; } /* Won't shrink */
.item-2 { flex-shrink: 2; } /* Shrinks twice as much */
.item-3 { flex-shrink: 1; } /* Normal shrinking */
```

### 4. flex-basis

Defines the initial size of a flex item before free space is distributed.

```css
.item {
  flex-basis: auto; /* default */
  /* flex-basis: 200px; */
  /* flex-basis: 20%; */
  /* flex-basis: content; */
}
```

### 5. flex

Shorthand for `flex-grow`, `flex-shrink`, and `flex-basis`.

```css
.item {
  flex: 0 1 auto; /* default */
  /* flex: 1; */ /* Same as: flex: 1 1 0%; */
  /* flex: 2 1 100px; */ /* grow: 2, shrink: 1, basis: 100px */
}
```

**Common values:**
- `flex: 1`: Equal distribution of available space
- `flex: none`: Same as `flex: 0 0 auto` (inflexible)
- `flex: auto`: Same as `flex: 1 1 auto` (flexible)

### 6. align-self

Overrides the `align-items` value for individual items.

```css
.item {
  align-self: auto; /* default */
  /* align-self: flex-start; */
  /* align-self: flex-end; */
  /* align-self: center; */
  /* align-self: baseline; */
  /* align-self: stretch; */
}
```

## Practical Examples

### Example 1: Basic Navigation Bar

```html
<nav class="navbar">
  <div class="logo">Logo</div>
  <ul class="nav-links">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
  <div class="auth">
    <button>Login</button>
  </div>
</nav>
```

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #333;
  color: white;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}
```

### Example 2: Responsive Card Layout

```html
<div class="card-container">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
</div>
```

```css
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
}

.card {
  flex: 1 1 300px; /* Grow, shrink, min-width of 300px */
  padding: 2rem;
  background-color: #f0f0f0;
  border-radius: 8px;
  text-align: center;
}
```

### Example 3: Centered Content

```html
<div class="center-container">
  <div class="centered-content">
    <h2>Centered Content</h2>
    <p>This content is perfectly centered!</p>
  </div>
</div>
```

```css
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #e0e0e0;
}

.centered-content {
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}
```

### Example 4: Sidebar Layout

```html
<div class="layout">
  <aside class="sidebar">Sidebar</aside>
  <main class="main-content">Main Content</main>
</div>
```

```css
.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  flex: 0 0 250px; /* Fixed width sidebar */
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
}

.main-content {
  flex: 1; /* Takes remaining space */
  padding: 1rem;
  background-color: #ecf0f1;
}
```

## Browser Support

Flexbox is well-supported across all modern browsers:
- Chrome 29+
- Firefox 28+
- Safari 9+
- Edge 12+
- IE 11 (with some limitations)

## Best Practices

1. **Use flexbox for one-dimensional layouts** (either rows or columns)
2. **Prefer CSS Grid for two-dimensional layouts**
3. **Use `flex: 1` for equal-width items**
4. **Combine with CSS Grid for complex layouts**
5. **Test across different screen sizes**
6. **Use `gap` instead of margins for spacing when possible**

## Common Flexbox Patterns

### Equal Height Columns
```css
.container {
  display: flex;
}
.column {
  flex: 1;
}
```

### Sticky Footer
```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
main {
  flex: 1;
}
```

### Media Object
```css
.media {
  display: flex;
  gap: 1rem;
}
.media-object {
  flex-shrink: 0;
}
.media-content {
  flex: 1;
}
```

This guide covers the essential concepts and properties of Flexbox. Practice with these examples and experiment with different combinations to master flexible layouts!