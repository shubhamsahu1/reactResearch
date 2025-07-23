# Complete CSS Grid Guide

## What is CSS Grid?

CSS Grid Layout is a two-dimensional layout system that allows you to create complex layouts with rows and columns. Unlike Flexbox, which is one-dimensional, Grid excels at creating layouts where you need to control both horizontal and vertical alignment simultaneously.

## Basic Concepts

### Grid Container and Grid Items

- **Grid Container**: The parent element with `display: grid` or `display: inline-grid`
- **Grid Items**: Direct children of the grid container

### Grid Lines, Tracks, Cells, and Areas

```
Grid Lines (numbered from 1)
    1   2   3   4
1 ┌───┬───┬───┐
  │ A │ B │ C │ ← Grid Track (row)
2 ├───┼───┼───┤
  │ D │ E │ F │ ← Each box is a Grid Cell
3 ├───┼───┼───┤
  │ G │ H │ I │
4 └───┴───┴───┘
  ↑
  Grid Track (column)
```

- **Grid Lines**: The dividing lines that make up the structure
- **Grid Tracks**: The space between two adjacent grid lines (rows or columns)
- **Grid Cells**: The space between four grid lines
- **Grid Areas**: Any rectangular space composed of one or more grid cells

## Grid Container Properties

### 1. display

Creates a grid container and establishes a new grid formatting context.

```css
.container {
  display: grid; /* or inline-grid */
}
```

### 2. grid-template-columns

Defines the columns of the grid with track sizes.

```css
.container {
  /* Fixed sizes */
  grid-template-columns: 100px 200px 100px;
  
  /* Using fr units (fractional units) */
  grid-template-columns: 1fr 2fr 1fr;
  
  /* Mixed units */
  grid-template-columns: 200px 1fr 100px;
  
  /* Using repeat() */
  grid-template-columns: repeat(3, 1fr);
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  
  /* Named grid lines */
  grid-template-columns: [start] 100px [content-start] 1fr [content-end] 100px [end];
}
```

### 3. grid-template-rows

Defines the rows of the grid with track sizes.

```css
.container {
  /* Fixed sizes */
  grid-template-rows: 80px 200px 80px;
  
  /* Using fr units */
  grid-template-rows: 1fr 3fr 1fr;
  
  /* Auto-sized rows */
  grid-template-rows: auto 1fr auto;
  
  /* Using repeat() */
  grid-template-rows: repeat(3, 100px);
  
  /* Named grid lines */
  grid-template-rows: [header-start] 80px [content-start] 1fr [content-end] 80px [footer-end];
}
```

### 4. grid-template-areas

Defines named grid areas for easier item placement.

```css
.container {
  grid-template-areas:
    "header header header"
    "sidebar content content"
    "footer footer footer";
}

/* Use with grid items */
.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer { grid-area: footer; }
```

### 5. grid-template

Shorthand for `grid-template-rows`, `grid-template-columns`, and `grid-template-areas`.

```css
.container {
  grid-template:
    "header header" 80px
    "sidebar content" 1fr
    "footer footer" 60px
    / 200px 1fr;
}

/* Equivalent to: */
/*
grid-template-areas:
  "header header"
  "sidebar content"
  "footer footer";
grid-template-rows: 80px 1fr 60px;
grid-template-columns: 200px 1fr;
*/
```

### 6. gap (grid-gap)

Sets the spacing between grid items.

```css
.container {
  /* Same gap for rows and columns */
  gap: 20px;
  
  /* Different gaps */
  gap: 10px 20px; /* row-gap column-gap */
  
  /* Individual gaps */
  row-gap: 10px;
  column-gap: 20px;
}
```

### 7. justify-items

Aligns grid items along the inline (row) axis.

```css
.container {
  justify-items: stretch; /* default */
  /* justify-items: start; */
  /* justify-items: end; */
  /* justify-items: center; */
}
```

### 8. align-items

Aligns grid items along the block (column) axis.

```css
.container {
  align-items: stretch; /* default */
  /* align-items: start; */
  /* align-items: end; */
  /* align-items: center; */
}
```

### 9. place-items

Shorthand for `align-items` and `justify-items`.

```css
.container {
  place-items: center; /* centers both axes */
  place-items: start end; /* align-items justify-items */
}
```

### 10. justify-content

Aligns the entire grid along the inline (row) axis.

```css
.container {
  justify-content: start; /* default */
  /* justify-content: end; */
  /* justify-content: center; */
  /* justify-content: stretch; */
  /* justify-content: space-around; */
  /* justify-content: space-between; */
  /* justify-content: space-evenly; */
}
```

### 11. align-content

Aligns the entire grid along the block (column) axis.

```css
.container {
  align-content: start; /* default */
  /* align-content: end; */
  /* align-content: center; */
  /* align-content: stretch; */
  /* align-content: space-around; */
  /* align-content: space-between; */
  /* align-content: space-evenly; */
}
```

### 12. place-content

Shorthand for `align-content` and `justify-content`.

```css
.container {
  place-content: center; /* centers entire grid */
  place-content: start end; /* align-content justify-content */
}
```

### 13. grid-auto-columns

Sets the size of implicitly created columns.

```css
.container {
  grid-auto-columns: 100px;
  /* grid-auto-columns: 1fr; */
  /* grid-auto-columns: minmax(100px, 1fr); */
}
```

### 14. grid-auto-rows

Sets the size of implicitly created rows.

```css
.container {
  grid-auto-rows: 100px;
  /* grid-auto-rows: minmax(100px, auto); */
}
```

### 15. grid-auto-flow

Controls how auto-placed items flow in the grid.

```css
.container {
  grid-auto-flow: row; /* default */
  /* grid-auto-flow: column; */
  /* grid-auto-flow: row dense; */
  /* grid-auto-flow: column dense; */
}
```

## Grid Item Properties

### 1. grid-column-start / grid-column-end

Specifies which column line the item starts/ends at.

```css
.item {
  grid-column-start: 1;
  grid-column-end: 3; /* Spans from line 1 to line 3 */
  
  /* Using span */
  grid-column-start: 1;
  grid-column-end: span 2; /* Spans 2 columns */
  
  /* Using named lines */
  grid-column-start: content-start;
  grid-column-end: content-end;
}
```

### 2. grid-row-start / grid-row-end

Specifies which row line the item starts/ends at.

```css
.item {
  grid-row-start: 1;
  grid-row-end: 3; /* Spans from line 1 to line 3 */
  
  /* Using span */
  grid-row-start: 2;
  grid-row-end: span 2; /* Spans 2 rows */
}
```

### 3. grid-column

Shorthand for `grid-column-start` and `grid-column-end`.

```css
.item {
  grid-column: 1 / 3; /* From line 1 to line 3 */
  grid-column: 1 / span 2; /* Start at line 1, span 2 columns */
  grid-column: 1; /* Only specify start line */
}
```

### 4. grid-row

Shorthand for `grid-row-start` and `grid-row-end`.

```css
.item {
  grid-row: 1 / 3; /* From line 1 to line 3 */
  grid-row: 2 / span 2; /* Start at line 2, span 2 rows */
}
```

### 5. grid-area

Specifies the item's location using named areas or line numbers.

```css
.item {
  /* Using named area */
  grid-area: header;
  
  /* Using line numbers: row-start / column-start / row-end / column-end */
  grid-area: 1 / 1 / 3 / 3;
  
  /* Mixed approach */
  grid-area: 1 / content-start / 3 / content-end;
}
```

### 6. justify-self

Aligns the item along the inline (row) axis within its cell.

```css
.item {
  justify-self: stretch; /* default */
  /* justify-self: start; */
  /* justify-self: end; */
  /* justify-self: center; */
}
```

### 7. align-self

Aligns the item along the block (column) axis within its cell.

```css
.item {
  align-self: stretch; /* default */
  /* align-self: start; */
  /* align-self: end; */
  /* align-self: center; */
}
```

### 8. place-self

Shorthand for `align-self` and `justify-self`.

```css
.item {
  place-self: center; /* centers the item in its cell */
  place-self: start end; /* align-self justify-self */
}
```

## Grid Functions and Units

### fr Unit (Fractional Unit)

Represents a fraction of the available space in the grid container.

```css
.container {
  grid-template-columns: 1fr 2fr 1fr; /* 1:2:1 ratio */
}
```

### repeat() Function

Repeats track patterns.

```css
.container {
  /* Repeat 4 columns of 1fr each */
  grid-template-columns: repeat(4, 1fr);
  
  /* Repeat pattern */
  grid-template-columns: repeat(2, 100px 200px); /* 100px 200px 100px 200px */
  
  /* Auto-repeat */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-template-columns: repeat(auto-fill, 200px);
}
```

### minmax() Function

Defines a size range for tracks.

```css
.container {
  /* Column between 100px and 1fr */
  grid-template-columns: minmax(100px, 1fr) 200px minmax(100px, 1fr);
  
  /* Responsive rows */
  grid-template-rows: minmax(100px, auto);
}
```

### fit-content() Function

Clamps track size based on content.

```css
.container {
  grid-template-columns: fit-content(300px) 1fr;
}
```

## Practical Examples

### Example 1: Basic Website Layout

```html
<div class="layout">
  <header class="header">Header</header>
  <nav class="nav">Navigation</nav>
  <main class="content">Main Content</main>
  <aside class="sidebar">Sidebar</aside>
  <footer class="footer">Footer</footer>
</div>
```

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav content sidebar"
    "footer footer footer";
  grid-template-rows: 80px 1fr 60px;
  grid-template-columns: 200px 1fr 200px;
  gap: 10px;
  min-height: 100vh;
}

.header { 
  grid-area: header; 
  background-color: #3498db;
}
.nav { 
  grid-area: nav; 
  background-color: #2ecc71;
}
.content { 
  grid-area: content; 
  background-color: #ecf0f1;
}
.sidebar { 
  grid-area: sidebar; 
  background-color: #e74c3c;
}
.footer { 
  grid-area: footer; 
  background-color: #34495e;
}
```

### Example 2: Responsive Card Grid

```html
<div class="card-grid">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
  <div class="card">Card 5</div>
  <div class="card">Card 6</div>
</div>
```

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}
```

### Example 3: Photo Gallery with Masonry Effect

```html
<div class="gallery">
  <div class="photo tall">Photo 1</div>
  <div class="photo">Photo 2</div>
  <div class="photo wide">Photo 3</div>
  <div class="photo">Photo 4</div>
  <div class="photo tall wide">Photo 5</div>
  <div class="photo">Photo 6</div>
</div>
```

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-rows: 200px;
  gap: 15px;
  padding: 15px;
}

.photo {
  background-color: #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.tall { grid-row: span 2; }
.wide { grid-column: span 2; }
```

### Example 4: Dashboard Layout

```html
<div class="dashboard">
  <div class="widget stats">Statistics</div>
  <div class="widget chart">Chart</div>
  <div class="widget activity">Recent Activity</div>
  <div class="widget todo">Todo List</div>
  <div class="widget calendar">Calendar</div>
</div>
```

```css
.dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 200px);
  gap: 20px;
  padding: 20px;
}

.widget {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.stats { 
  grid-column: span 2; 
  background-color: #3498db;
  color: white;
}
.chart { 
  grid-column: span 2; 
  grid-row: span 2;
  background-color: #2ecc71;
  color: white;
}
.activity { 
  grid-row: span 2;
  background-color: #e74c3c;
  color: white;
}
.todo { 
  background-color: #f39c12;
  color: white;
}
.calendar { 
  background-color: #9b59b6;
  color: white;
}
```

### Example 5: Form Layout

```html
<form class="form-grid">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name">
  
  <label for="email">Email:</label>
  <input type="email" id="email" name="email">
  
  <label for="phone">Phone:</label>
  <input type="tel" id="phone" name="phone">
  
  <label for="message">Message:</label>
  <textarea id="message" name="message"></textarea>
  
  <button type="submit" class="submit-btn">Submit</button>
</form>
```

```css
.form-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 15px 20px;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.form-grid label {
  justify-self: end;
  align-self: center;
  font-weight: bold;
}

.form-grid input,
.form-grid textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-grid textarea {
  grid-column: 2;
  min-height: 100px;
  resize: vertical;
}

.submit-btn {
  grid-column: span 2;
  padding: 12px 24px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  justify-self: center;
}

.submit-btn:hover {
  background-color: #2980b9;
}
```

## Grid vs Flexbox

### When to use CSS Grid:
- Two-dimensional layouts (rows AND columns)
- Complex layouts with multiple areas
- When you need precise control over item placement
- Layout-first design approach

### When to use Flexbox:
- One-dimensional layouts (either rows OR columns)
- Component-level layouts
- When you need flexible item sizing
- Content-first design approach

### Using them together:
```css
.layout {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
}

.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

## Browser Support

CSS Grid is well-supported in modern browsers:
- Chrome 57+
- Firefox 52+
- Safari 10.1+
- Edge 16+
- IE 11 (limited support with `-ms-` prefix)

## Best Practices

1. **Use Grid for page-level layouts, Flexbox for component-level layouts**
2. **Start with `grid-template-areas` for complex layouts** - it's more readable
3. **Use `fr` units for flexible sizing**
4. **Leverage `auto-fit` and `minmax()` for responsive designs**
5. **Use `gap` instead of margins for consistent spacing**
6. **Consider mobile-first responsive design**
7. **Use meaningful names for grid areas**
8. **Test across different screen sizes and browsers**

## Advanced Techniques

### Responsive Grid Areas

```css
.layout {
  display: grid;
  gap: 1rem;
}

/* Mobile */
@media (max-width: 768px) {
  .layout {
    grid-template-areas:
      "header"
      "nav"
      "content"
      "sidebar"
      "footer";
    grid-template-columns: 1fr;
  }
}

/* Desktop */
@media (min-width: 769px) {
  .layout {
    grid-template-areas:
      "header header header"
      "nav content sidebar"
      "footer footer footer";
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
  }
}
```

### Overlapping Grid Items

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.item1 {
  grid-area: 1 / 1 / 3 / 2;
  background-color: rgba(255, 0, 0, 0.5);
}

.item2 {
  grid-area: 1 / 1 / 2 / 3;
  background-color: rgba(0, 255, 0, 0.5);
}
```

CSS Grid is a powerful layout system that gives you precise control over two-dimensional layouts. Combined with Flexbox, it provides all the tools needed for modern web layouts!