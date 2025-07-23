# Complete CSS Media Queries Guide

## What are Media Queries?

Media Queries are a CSS feature that allows you to apply different styles based on various characteristics of the device or viewport, such as screen size, resolution, orientation, and more. They are the foundation of responsive web design, enabling websites to adapt to different devices and screen sizes.

## Syntax

The basic syntax of a media query consists of:

```css
@media media-type and (media-feature) {
  /* CSS rules */
}
```

### Components:
- **@media**: The at-rule that starts a media query
- **media-type**: The type of device (optional)
- **and**: Logical operator to combine conditions
- **media-feature**: The condition to test (in parentheses)

## Media Types

Media types describe the general category of device:

```css
/* All devices (default) */
@media all {
  /* styles */
}

/* Screen devices (monitors, tablets, phones) */
@media screen {
  /* styles */
}

/* Print devices */
@media print {
  /* styles */
}

/* Speech synthesizers */
@media speech {
  /* styles */
}
```

**Note**: `all` is the default and can be omitted. Most modern responsive design focuses on `screen`.

## Media Features

Media features test specific characteristics of the device or viewport.

### Width and Height Features

```css
/* Exact width */
@media (width: 768px) {
  /* styles */
}

/* Minimum width */
@media (min-width: 768px) {
  /* styles */
}

/* Maximum width */
@media (max-width: 767px) {
  /* styles */
}

/* Width range */
@media (min-width: 768px) and (max-width: 1199px) {
  /* styles */
}

/* Height features work similarly */
@media (min-height: 600px) {
  /* styles */
}

@media (max-height: 500px) {
  /* styles */
}
```

### Device Width and Height

```css
/* Device dimensions (less commonly used) */
@media (min-device-width: 768px) {
  /* styles */
}

@media (max-device-width: 480px) {
  /* styles */
}
```

### Orientation

```css
/* Portrait orientation (height > width) */
@media (orientation: portrait) {
  /* styles */
}

/* Landscape orientation (width > height) */
@media (orientation: landscape) {
  /* styles */
}
```

### Aspect Ratio

```css
/* Specific aspect ratio */
@media (aspect-ratio: 16/9) {
  /* styles */
}

/* Minimum aspect ratio */
@media (min-aspect-ratio: 4/3) {
  /* styles */
}

/* Maximum aspect ratio */
@media (max-aspect-ratio: 16/9) {
  /* styles */
}
```

### Resolution

```css
/* High-resolution displays (Retina, etc.) */
@media (min-resolution: 2dppx) {
  /* styles for high-DPI displays */
}

@media (min-resolution: 192dpi) {
  /* styles for high-DPI displays */
}

/* Standard resolution */
@media (max-resolution: 1dppx) {
  /* styles for standard displays */
}
```

### Color and Display Features

```css
/* Color support */
@media (color) {
  /* styles for color displays */
}

/* Minimum color depth */
@media (min-color: 8) {
  /* styles for displays with at least 8-bit color */
}

/* Monochrome displays */
@media (monochrome) {
  /* styles for monochrome displays */
}
```

### Pointer and Hover

```css
/* Touch devices */
@media (pointer: coarse) {
  /* styles for touch devices */
}

/* Mouse/trackpad devices */
@media (pointer: fine) {
  /* styles for precise pointing devices */
}

/* Devices that can hover */
@media (hover: hover) {
  /* styles for devices that support hover */
}

/* Devices that cannot hover */
@media (hover: none) {
  /* styles for touch devices that don't support hover */
}
```

### Reduced Motion

```css
/* Users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  /* Remove or reduce animations */
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Users who don't mind motion */
@media (prefers-reduced-motion: no-preference) {
  /* Normal animations */
}
```

### Color Scheme Preference

```css
/* Dark mode preference */
@media (prefers-color-scheme: dark) {
  /* Dark theme styles */
  body {
    background-color: #121212;
    color: #ffffff;
  }
}

/* Light mode preference */
@media (prefers-color-scheme: light) {
  /* Light theme styles */
  body {
    background-color: #ffffff;
    color: #000000;
  }
}
```

## Logical Operators

### AND Operator

Combines multiple conditions (all must be true):

```css
@media screen and (min-width: 768px) and (max-width: 1199px) {
  /* styles for tablets */
}

@media (min-width: 768px) and (orientation: landscape) {
  /* styles for landscape tablets and larger */
}
```

### OR Operator (Comma)

Creates multiple conditions (any can be true):

```css
@media (max-width: 767px), (orientation: portrait) {
  /* styles for mobile OR portrait orientation */
}

@media screen, print {
  /* styles for screen OR print */
}
```

### NOT Operator

Negates a condition:

```css
@media not screen {
  /* styles for everything except screens */
}

@media not (min-width: 768px) {
  /* styles for viewports smaller than 768px */
}
```

### ONLY Operator

Hides styles from older browsers that don't support media queries:

```css
@media only screen and (min-width: 768px) {
  /* styles that older browsers will ignore */
}
```

## Common Breakpoints

Standard breakpoints for responsive design:

```css
/* Extra small devices (phones) */
@media (max-width: 575.98px) {
  /* XS styles */
}

/* Small devices (landscape phones) */
@media (min-width: 576px) and (max-width: 767.98px) {
  /* SM styles */
}

/* Medium devices (tablets) */
@media (min-width: 768px) and (max-width: 991.98px) {
  /* MD styles */
}

/* Large devices (desktops) */
@media (min-width: 992px) and (max-width: 1199.98px) {
  /* LG styles */
}

/* Extra large devices (large desktops) */
@media (min-width: 1200px) {
  /* XL styles */
}
```

## Mobile-First vs Desktop-First

### Mobile-First Approach (Recommended)

Start with mobile styles and add complexity for larger screens:

```css
/* Base styles for mobile */
.container {
  width: 100%;
  padding: 15px;
}

.grid {
  display: block;
}

.grid-item {
  width: 100%;
  margin-bottom: 20px;
}

/* Tablet styles */
@media (min-width: 768px) {
  .container {
    max-width: 750px;
    margin: 0 auto;
  }
  
  .grid {
    display: flex;
    flex-wrap: wrap;
  }
  
  .grid-item {
    width: 48%;
    margin-right: 2%;
    margin-bottom: 20px;
  }
}

/* Desktop styles */
@media (min-width: 1200px) {
  .container {
    max-width: 1170px;
  }
  
  .grid-item {
    width: 31.33%;
    margin-right: 2%;
  }
}
```

### Desktop-First Approach

Start with desktop styles and simplify for smaller screens:

```css
/* Base styles for desktop */
.container {
  max-width: 1170px;
  margin: 0 auto;
}

.grid {
  display: flex;
  flex-wrap: wrap;
}

.grid-item {
  width: 31.33%;
  margin-right: 2%;
}

/* Tablet styles */
@media (max-width: 1199px) {
  .container {
    max-width: 750px;
  }
  
  .grid-item {
    width: 48%;
  }
}

/* Mobile styles */
@media (max-width: 767px) {
  .container {
    width: 100%;
    padding: 15px;
  }
  
  .grid {
    display: block;
  }
  
  .grid-item {
    width: 100%;
    margin-right: 0;
    margin-bottom: 20px;
  }
}
```

## Practical Examples

### Example 1: Responsive Navigation

```html
<nav class="navbar">
  <div class="nav-brand">Logo</div>
  <button class="nav-toggle">☰</button>
  <ul class="nav-menu">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Services</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>
```

```css
/* Mobile-first navigation */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #333;
  color: white;
}

.nav-toggle {
  display: block;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.nav-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #333;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-direction: column;
}

.nav-menu.active {
  display: flex;
}

.nav-menu li {
  border-top: 1px solid #555;
}

.nav-menu a {
  display: block;
  padding: 1rem;
  color: white;
  text-decoration: none;
}

/* Desktop navigation */
@media (min-width: 768px) {
  .nav-toggle {
    display: none;
  }
  
  .nav-menu {
    display: flex !important;
    position: static;
    width: auto;
    background: none;
    flex-direction: row;
  }
  
  .nav-menu li {
    border: none;
  }
  
  .nav-menu a {
    padding: 0 1rem;
  }
}
```

### Example 2: Responsive Grid Layout

```html
<div class="gallery">
  <div class="gallery-item">Item 1</div>
  <div class="gallery-item">Item 2</div>
  <div class="gallery-item">Item 3</div>
  <div class="gallery-item">Item 4</div>
  <div class="gallery-item">Item 5</div>
  <div class="gallery-item">Item 6</div>
</div>
```

```css
.gallery {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.gallery-item {
  background-color: #f0f0f0;
  padding: 2rem;
  text-align: center;
  border-radius: 8px;
}

/* Mobile: 1 column */
@media (max-width: 575.98px) {
  .gallery {
    grid-template-columns: 1fr;
  }
}

/* Small tablets: 2 columns */
@media (min-width: 576px) and (max-width: 767.98px) {
  .gallery {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Large tablets: 3 columns */
@media (min-width: 768px) and (max-width: 991.98px) {
  .gallery {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Desktop: 4 columns */
@media (min-width: 992px) {
  .gallery {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Example 3: Responsive Typography

```css
/* Base mobile typography */
body {
  font-family: 'Arial', sans-serif;
  font-size: 16px;
  line-height: 1.4;
}

h1 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 0.875rem;
}

p {
  margin-bottom: 1rem;
}

/* Tablet typography */
@media (min-width: 768px) {
  body {
    font-size: 18px;
    line-height: 1.5;
  }
  
  h1 {
    font-size: 2.25rem;
  }
  
  h2 {
    font-size: 1.875rem;
  }
}

/* Desktop typography */
@media (min-width: 1200px) {
  body {
    font-size: 20px;
    line-height: 1.6;
  }
  
  h1 {
    font-size: 3rem;
  }
  
  h2 {
    font-size: 2.25rem;
  }
}
```

### Example 4: Dark Mode Implementation

```css
/* Light mode (default) */
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --accent-color: #3498db;
  --border-color: #e0e0e0;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

.card {
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  padding: 1rem;
  border-radius: 8px;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #121212;
    --text-color: #ffffff;
    --accent-color: #64b5f6;
    --border-color: #333333;
  }
  
  .card {
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
  }
}
```

### Example 5: Print Styles

```css
/* Screen styles */
.no-print {
  display: block;
}

.print-only {
  display: none;
}

/* Print styles */
@media print {
  /* Hide unnecessary elements */
  .no-print,
  nav,
  .sidebar,
  button,
  .advertisement {
    display: none !important;
  }
  
  /* Show print-specific content */
  .print-only {
    display: block !important;
  }
  
  /* Optimize for printing */
  body {
    font-size: 12pt;
    line-height: 1.4;
    color: black;
    background: white;
  }
  
  /* Avoid page breaks inside elements */
  h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid;
  }
  
  p, blockquote {
    page-break-inside: avoid;
  }
  
  /* Show URLs for links */
  a[href]:after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: #666;
  }
  
  /* Remove unnecessary margins */
  * {
    box-shadow: none !important;
    text-shadow: none !important;
  }
}
```

### Example 6: Touch-Friendly Design

```css
/* Base button styles */
.button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

/* Hover effects for devices that support hover */
@media (hover: hover) {
  .button:hover {
    background-color: #2980b9;
  }
}

/* Touch-friendly sizing for coarse pointers */
@media (pointer: coarse) {
  .button {
    padding: 12px 24px;
    font-size: 16px;
    min-height: 44px; /* Apple's recommended minimum touch target */
    min-width: 44px;
  }
  
  /* Increase spacing between interactive elements */
  .button + .button {
    margin-left: 10px;
  }
}

/* Fine pointer devices (mouse, trackpad) */
@media (pointer: fine) {
  .button {
    padding: 6px 12px;
    font-size: 14px;
  }
}
```

## Advanced Techniques

### Container Queries (Future)

Container queries allow styling based on container size rather than viewport size:

```css
/* Future CSS feature - limited browser support */
@container (min-width: 400px) {
  .card {
    display: flex;
  }
}
```

### Custom Media Queries with CSS Custom Properties

```css
:root {
  --mobile: (max-width: 767px);
  --tablet: (min-width: 768px) and (max-width: 1199px);
  --desktop: (min-width: 1200px);
}

/* Note: This syntax is not yet supported in browsers */
/* @media var(--mobile) {
  .container {
    padding: 1rem;
  }
} */
```

### Media Query Ranges (Level 4 Syntax)

```css
/* Future syntax - limited browser support */
@media (width >= 768px) {
  /* styles */
}

@media (768px <= width <= 1199px) {
  /* styles */
}
```

## Testing Media Queries

### Browser Developer Tools
1. Open browser developer tools (F12)
2. Click the device toolbar icon (📱)
3. Select different device presets or set custom dimensions
4. Test your media queries across various screen sizes

### Popular Testing Resolutions
- **320px**: iPhone SE (portrait)
- **375px**: iPhone 6/7/8 (portrait)
- **414px**: iPhone 6/7/8 Plus (portrait)
- **768px**: iPad (portrait)
- **1024px**: iPad (landscape)
- **1366px**: Common laptop screen
- **1920px**: Full HD desktop

## Best Practices

### 1. Use Relative Units
```css
/* Good */
@media (min-width: 48em) { /* 768px at 16px base font size */
  /* styles */
}

/* Avoid */
@media (min-width: 768px) {
  /* styles */
}
```

### 2. Organize Media Queries
```css
/* Option 1: Group by component */
.header {
  /* mobile styles */
}

@media (min-width: 768px) {
  .header {
    /* tablet styles */
  }
}

@media (min-width: 1200px) {
  .header {
    /* desktop styles */
  }
}

/* Option 2: Group by breakpoint */
@media (min-width: 768px) {
  .header { /* tablet header */ }
  .nav { /* tablet nav */ }
  .main { /* tablet main */ }
}
```

### 3. Use Mobile-First Approach
```css
/* Mobile first - recommended */
.container { width: 100%; }
@media (min-width: 768px) { .container { max-width: 750px; } }
@media (min-width: 1200px) { .container { max-width: 1170px; } }
```

### 4. Avoid Overlapping Breakpoints
```css
/* Good */
@media (max-width: 767px) { /* mobile */ }
@media (min-width: 768px) and (max-width: 1199px) { /* tablet */ }
@media (min-width: 1200px) { /* desktop */ }

/* Avoid */
@media (max-width: 768px) { /* mobile */ }
@media (min-width: 768px) { /* tablet/desktop */ }
/* 768px matches both queries */
```

### 5. Consider Performance
```css
/* Combine related media queries */
@media (min-width: 768px) {
  .header { /* styles */ }
  .nav { /* styles */ }
  .main { /* styles */ }
}

/* Rather than separate queries */
@media (min-width: 768px) { .header { /* styles */ } }
@media (min-width: 768px) { .nav { /* styles */ } }
@media (min-width: 768px) { .main { /* styles */ } }
```

## Browser Support

Media queries have excellent browser support:
- **All modern browsers**: Full support
- **IE 9+**: Full support
- **IE 8**: Partial support with polyfills

For older browser support, consider using a polyfill like Respond.js.

## Common Pitfalls

1. **Not including viewport meta tag**:
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

2. **Using device-specific breakpoints**: Design for content, not devices

3. **Forgetting about landscape orientation on mobile**

4. **Not testing on real devices**

5. **Overcomplicating breakpoints**: Keep it simple and maintainable

Media queries are essential for creating responsive, accessible, and user-friendly websites that work across all devices and preferences!