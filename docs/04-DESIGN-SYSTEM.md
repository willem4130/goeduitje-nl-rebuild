# Design System

> **Colors, typography, spacing, and design tokens for Goeduitje.nl**

---

## 🎨 Color System

### Color Variables

All colors are defined in `src/app/globals.css` using OKLCH color space for better color manipulation and consistency.

#### Light Mode Colors

```css
:root {
  /* Primary colors */
  --primary: oklch(0.205 0 0); /* Almost black */
  --primary-foreground: oklch(0.985 0 0); /* Almost white */

  /* Secondary colors */
  --secondary: oklch(0.97 0 0); /* Light gray */
  --secondary-foreground: oklch(0.205 0 0); /* Dark text */

  /* Accent colors */
  --accent: oklch(0.97 0 0); /* Light accent */
  --accent-foreground: oklch(0.205 0 0); /* Dark text */

  /* Semantic colors */
  --background: oklch(1 0 0); /* White */
  --foreground: oklch(0.145 0 0); /* Dark gray */

  --muted: oklch(0.97 0 0); /* Light muted */
  --muted-foreground: oklch(0.556 0 0); /* Medium gray */

  --destructive: oklch(0.577 0.245 27.325); /* Red */

  --border: oklch(0.922 0 0); /* Light gray border */
  --input: oklch(0.922 0 0); /* Input border */
  --ring: oklch(0.708 0 0); /* Focus ring */

  /* Card colors */
  --card: oklch(1 0 0); /* White */
  --card-foreground: oklch(0.145 0 0); /* Dark text */

  /* Popover colors */
  --popover: oklch(1 0 0); /* White */
  --popover-foreground: oklch(0.145 0 0); /* Dark text */

  /* Chart colors */
  --chart-1: oklch(0.646 0.222 41.116); /* Orange */
  --chart-2: oklch(0.6 0.118 184.704); /* Cyan */
  --chart-3: oklch(0.398 0.07 227.392); /* Blue */
  --chart-4: oklch(0.828 0.189 84.429); /* Yellow-green */
  --chart-5: oklch(0.769 0.188 70.08); /* Yellow */

  /* Border radius */
  --radius: 0.625rem; /* 10px */
}
```

#### Dark Mode Colors

```css
.dark {
  --background: oklch(0.145 0 0); /* Dark background */
  --foreground: oklch(0.985 0 0); /* Light text */

  --primary: oklch(0.922 0 0); /* Light primary */
  --primary-foreground: oklch(0.205 0 0); /* Dark text */

  --secondary: oklch(0.269 0 0); /* Dark secondary */
  --secondary-foreground: oklch(0.985 0 0); /* Light text */

  --accent: oklch(0.269 0 0); /* Dark accent */
  --accent-foreground: oklch(0.985 0 0); /* Light text */

  --destructive: oklch(0.704 0.191 22.216); /* Light red */

  --border: oklch(1 0 0 / 10%); /* Transparent white */
  --input: oklch(1 0 0 / 15%); /* Transparent white */
  --ring: oklch(0.556 0 0); /* Medium gray */

  /* ... other dark mode colors */
}
```

### Using Colors in Components

```typescript
// In Tailwind classes
<div className="bg-background text-foreground">
  <Button variant="default">Primary Button</Button>
  <Button variant="destructive">Delete</Button>
  <Card className="border-border">Content</Card>
</div>

// Custom colors (to be added for brand)
<div className="bg-brand-primary text-brand-primary-foreground">
  Brand colored section
</div>
```

### Brand Colors (Customizable)

To customize brand colors, update these values in `globals.css`:

```css
:root {
  /* Replace these with Goeduitje brand colors */
  --brand-primary: oklch(0.646 0.222 41.116); /* Brand primary */
  --brand-secondary: oklch(0.6 0.118 184.704); /* Brand secondary */
  --brand-accent: oklch(0.828 0.189 84.429); /* Brand accent */
}
```

---

## 📝 Typography

### Font Families

```css
:root {
  --font-sans: var(--font-geist-sans); /* Geist Sans */
  --font-mono: var(--font-geist-mono); /* Geist Mono */
}
```

### Font Loading

Fonts are loaded using `next/font` in `app/layout.tsx`:

```typescript
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

### Typography Scale

```typescript
// Recommended Tailwind classes for text sizes

// Headings
h1: 'text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl'
h2: 'text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl'
h3: 'text-2xl font-semibold tracking-tight sm:text-3xl'
h4: 'text-xl font-semibold tracking-tight sm:text-2xl'
h5: 'text-lg font-semibold'
h6: 'text-base font-semibold'

// Body text
body-lg: 'text-lg leading-relaxed'
body: 'text-base leading-relaxed'
body-sm: 'text-sm'
body-xs: 'text-xs'

// Display text (hero)
display-xl: 'text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl'
display-lg: 'text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl'
```

### Font Weights

- Light: `font-light` (300)
- Normal: `font-normal` (400)
- Medium: `font-medium` (500)
- Semibold: `font-semibold` (600)
- Bold: `font-bold` (700)

### Usage Example

```typescript
<div>
  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
    Page Title
  </h1>
  <p className="text-lg leading-relaxed text-muted-foreground">
    Subtitle or description text
  </p>
</div>
```

---

## 📏 Spacing System

### Section Spacing

```typescript
// Vertical padding for sections
section-xs: 'py-8 md:py-12'
section-sm: 'py-12 md:py-16'
section-md: 'py-16 md:py-20'
section-lg: 'py-20 md:py-28'
section-xl: 'py-28 md:py-36'
```

### Container

```typescript
// Container classes
container-default: 'container mx-auto px-4 sm:px-6 lg:px-8'
container-narrow: 'mx-auto max-w-3xl px-4 sm:px-6'
container-wide: 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'
```

### Stack Spacing

```typescript
// Vertical spacing between elements
stack-xs: 'space-y-2'
stack-sm: 'space-y-4'
stack-md: 'space-y-6'
stack-lg: 'space-y-8'
stack-xl: 'space-y-12'
```

### Gap Spacing

```typescript
// Gap between flex/grid items
gap-xs: 'gap-2'
gap-sm: 'gap-4'
gap-md: 'gap-6'
gap-lg: 'gap-8'
gap-xl: 'gap-12'
```

---

## 🔲 Border Radius

```css
--radius-sm: calc(var(--radius) - 4px); /* 6px */
--radius-md: calc(var(--radius) - 2px); /* 8px */
--radius-lg: var(--radius); /* 10px */
--radius-xl: calc(var(--radius) + 4px); /* 14px */
```

Usage:

```typescript
<Card className="rounded-lg">...</Card>
<Button className="rounded-md">...</Button>
<Avatar className="rounded-full">...</Avatar>
```

---

## 🌈 Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

Usage:

```typescript
<Card className="shadow-md">...</Card>
<Popover className="shadow-lg">...</Popover>
```

---

## ✨ Animations

### Animation Classes

```typescript
// Fade in
fadeIn: "animate-in fade-in duration-500";

// Slide up
slideUp: "animate-in slide-in-from-bottom-4 duration-500";

// Scale in
scaleIn: "animate-in zoom-in-95 duration-200";

// Slide down (for dropdowns)
slideDown: "animate-in slide-in-from-top-2 duration-200";
```

### Usage

```typescript
<div className="animate-in fade-in duration-500">
  Fades in on mount
</div>

<div className="animate-in slide-in-from-bottom-4">
  Slides up from bottom
</div>
```

---

## 🎯 Design Tokens Configuration

### Theme Configuration File

Create `lib/constants/theme-config.ts`:

```typescript
export const themeConfig = {
  colors: {
    brand: {
      primary: "oklch(0.646 0.222 41.116)",
      secondary: "oklch(0.6 0.118 184.704)",
      accent: "oklch(0.828 0.189 84.429)",
    },
  },

  typography: {
    fontFamily: {
      heading: "var(--font-geist-sans)",
      body: "var(--font-geist-sans)",
      mono: "var(--font-geist-mono)",
    },
    scale: {
      hero: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
      h1: "text-3xl sm:text-4xl md:text-5xl",
      h2: "text-2xl sm:text-3xl md:text-4xl",
      h3: "text-xl sm:text-2xl md:text-3xl",
      body: "text-base",
    },
  },

  spacing: {
    section: {
      sm: "py-12 md:py-16",
      md: "py-16 md:py-20",
      lg: "py-20 md:py-28",
    },
    container: "container mx-auto px-4 sm:px-6 lg:px-8",
  },

  borderRadius: {
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
  },
};
```

---

## 📱 Responsive Design

### Breakpoints

Tailwind CSS default breakpoints:

```typescript
sm: '640px'   // Small devices (tablets)
md: '768px'   // Medium devices (small laptops)
lg: '1024px'  // Large devices (desktops)
xl: '1280px'  // Extra large devices
2xl: '1536px' // 2X large devices
```

### Mobile-First Approach

```typescript
// Starts mobile, scales up
<div className="text-base md:text-lg lg:text-xl">
  Responsive text
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  Responsive grid
</div>
```

---

## ♿ Accessibility

### Color Contrast

All color combinations meet WCAG 2.1 AA standards:

- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- UI components: 3:1 contrast ratio

### Focus States

```typescript
// Focus ring on interactive elements
<Button className="focus:ring-2 focus:ring-ring focus:ring-offset-2">
  Button
</Button>
```

---

## 🔧 Customization Guide

### Changing Brand Colors

1. Open `src/app/globals.css`
2. Update color values in `:root` and `.dark`
3. Test light and dark modes
4. Verify contrast ratios

### Adding New Colors

```css
:root {
  --custom-color: oklch(0.7 0.2 180);
}
```

```typescript
// In tailwind.config.ts
theme: {
  extend: {
    colors: {
      custom: 'var(--custom-color)',
    },
  },
}
```

### Changing Typography

1. Replace fonts in `app/layout.tsx`
2. Update CSS variables in `globals.css`
3. Test across all pages

---

## 📚 Resources

- [OKLCH Color Picker](https://oklch.com/)
- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

**Last Updated**: November 6, 2025
