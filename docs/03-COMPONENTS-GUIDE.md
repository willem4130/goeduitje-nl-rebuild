# Components Guide

> **Complete reference for all components in the Goeduitje.nl project**

---

## 📚 Component Library Overview

The project includes 24+ pre-built shadcn/ui components plus custom components specific to Goeduitje.nl.

---

## 🎨 UI Components (shadcn/ui)

Located in `src/components/ui/`

### Core Components

#### Button

```typescript
import { Button } from "@/components/ui/button"

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

#### Card

```typescript
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### Input

```typescript
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Email" />
</div>
```

### Form Components

#### Form (React Hook Form Integration)

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const form = useForm({
  resolver: zodResolver(formSchema),
})

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="email@example.com" {...field} />
          </FormControl>
          <FormDescription>
            We'll never share your email.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

### Data Display

#### Table

```typescript
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

<Table>
  <TableCaption>A list of your recent bookings.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Date</TableHead>
      <TableHead>Activity</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {bookings.map((booking) => (
      <TableRow key={booking.id}>
        <TableCell>{booking.date}</TableCell>
        <TableCell>{booking.activity}</TableCell>
        <TableCell>{booking.status}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Navigation

#### Tabs

```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    Overview content
  </TabsContent>
  <TabsContent value="details">
    Details content
  </TabsContent>
</Tabs>
```

### Feedback

#### Toast (Sonner)

```typescript
import { toast } from "sonner";

// Success
toast.success("Booking confirmed!");

// Error
toast.error("Something went wrong");

// Custom
toast("Custom message", {
  description: "Additional details",
  action: {
    label: "Undo",
    onClick: () => console.log("Undo"),
  },
});
```

#### Skeleton

```typescript
import { Skeleton } from "@/components/ui/skeleton"

<div>
  <Skeleton className="h-12 w-12 rounded-full" />
  <Skeleton className="h-4 w-[250px]" />
  <Skeleton className="h-4 w-[200px]" />
</div>
```

---

## 🏗️ Custom Components

### Layout Components

Located in `src/components/layout/` (to be created)

#### SiteHeader

```typescript
// components/layout/site-header.tsx
import { MainNav } from "@/components/navigation/main-nav"
import { MobileNav } from "@/components/navigation/mobile-nav"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95">
      <div className="container flex h-16 items-center">
        <MainNav />
        <MobileNav />
      </div>
    </header>
  )
}
```

#### SiteFooter

```typescript
// components/layout/site-footer.tsx
export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="container py-12">
        {/* Footer content */}
      </div>
    </footer>
  )
}
```

### Section Components

Located in `src/components/sections/` (to be created)

#### HeroSection

```typescript
// components/sections/hero/hero-default.tsx
interface HeroSectionProps {
  title: string
  subtitle: string
  cta?: React.ReactNode
  image?: string
}

export function HeroSection({ title, subtitle, cta, image }: HeroSectionProps) {
  return (
    <section className="container py-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold md:text-6xl">{title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
        {cta && <div className="mt-8">{cta}</div>}
      </div>
    </section>
  )
}
```

### Form Components

#### ContactForm (Existing)

```typescript
// components/contact-form.tsx
'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactFormSchema } from "@/lib/validations/forms"

export function ContactForm() {
  const form = useForm({
    resolver: zodResolver(contactFormSchema),
  })

  const onSubmit = async (data) => {
    // Handle form submission
  }

  return (
    <Form {...form}>
      {/* Form fields */}
    </Form>
  )
}
```

### Media Components

#### ImageOptimized

```typescript
// components/media/image-optimized.tsx
import Image from "next/image"

interface ImageOptimizedProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
}

export function ImageOptimized({
  src,
  alt,
  priority = false,
  ...props
}: ImageOptimizedProps) {
  return (
    <Image
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      {...props}
    />
  )
}
```

---

## 🎯 Component Development Guidelines

### File Naming

- Use kebab-case: `hero-section.tsx`
- One component per file
- Co-locate types in the same file

### Component Structure

```typescript
// 1. Imports
import { ComponentProps } from "react"

// 2. Types
interface MyComponentProps {
  title: string
  optional?: boolean
}

// 3. Component
export function MyComponent({ title, optional }: MyComponentProps) {
  // Component logic
  return <div>{title}</div>
}

// 4. Default export (if needed)
export default MyComponent
```

### Props Best Practices

- Use TypeScript interfaces
- Provide sensible defaults
- Use `ComponentProps<"div">` for extending native elements
- Document complex props with JSDoc

### Styling Best Practices

- Use Tailwind utility classes
- Use `cn()` helper for conditional classes
- Avoid inline styles (except for dynamic values)
- Use design tokens from `globals.css`

---

## 📦 Component Composition

### Compound Components

```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

### Composition Pattern

```typescript
// Good: Composable
<Section>
  <Container>
    <Heading>Title</Heading>
    <Text>Content</Text>
  </Container>
</Section>

// Avoid: Monolithic
<SectionWithContent title="Title" content="Content" />
```

---

## 🧪 Testing Components

### Unit Tests

```typescript
import { render, screen } from "@testing-library/react"
import { Button } from "@/components/ui/button"

describe("Button", () => {
  it("renders button text", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })
})
```

---

## 📚 Component Documentation Template

When creating new components, document them using this template:

```markdown
## ComponentName

Brief description of what the component does.

### Props

| Prop  | Type    | Default | Description |
| ----- | ------- | ------- | ----------- |
| prop1 | string  | -       | Description |
| prop2 | boolean | false   | Description |

### Usage

\`\`\`typescript
<ComponentName prop1="value" prop2={true} />
\`\`\`

### Examples

#### Basic

\`\`\`typescript
<ComponentName />
\`\`\`

#### With Props

\`\`\`typescript
<ComponentName prop1="custom" />
\`\`\`

### Notes

Any additional notes or warnings.
```

---

## 🔗 Related Documentation

- [UI Components](./components/UI-COMPONENTS.md) - Detailed component catalog
- [Custom Components](./components/CUSTOM-COMPONENTS.md) - Project-specific components
- [Design System](./04-DESIGN-SYSTEM.md) - Design tokens and patterns

---

**Last Updated**: November 6, 2025
