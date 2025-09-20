# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 + TypeScript + Vite frontend application for a Bangumi-like website. The project uses:

- Vue 3 with Composition API (`<script setup>`)
- TypeScript for type safety
- Vite as the build tool
- Tailwind CSS for styling
- Vue Router for navigation
- pnpm as the package manager

## Project Structure

```
src/
├── App.vue # Root component
├── main.ts # Application entry point
├── assets/ # Static assets
├── components/ # Reusable components
├── pages/ # Page components
│ └── Home/ # Home page
│ ├── index.vue
│ └── components/
├── router/ # Vue Router configuration
└── style.css # Global styles
```

## Development Commands

- **Start development server**: `pnpm run dev`
- **Build for production**: `pnpm run build`
- **Preview production build**: `pnpm run preview`
- **Lint code**: `pnpm run lint` (if configured)

## Key Configuration Files

- `vite.config.ts` - Vite configuration with Vue plugin and path aliases
- `tsconfig.json` - TypeScript configuration
- `tsconfig.app.json` - TypeScript config for application code
- `tsconfig.node.json` - TypeScript config for Node.js environment
- `eslint.config.ts` - ESLint configuration
- `package.json` - Project dependencies and scripts

## Routing

The application uses Vue Router with memory history. Routes are defined in `src/router/index.ts`. The home page is at `/` and loads the Home component.

## Component Architecture

Components use Vue 3's Composition API with `<script setup>` syntax. The project follows a component-based architecture where:

- Pages are in the `src/pages/` directory
- Reusable components are in `src/components/` or within page-specific component directories
- Components use Tailwind CSS for styling

## Path Aliases

The project uses `@` as an alias for the `src/` directory, configured in `vite.config.ts` and `tsconfig.app.json`.

## Style Guide

The visual style of this project takes inspiration from **Bilibili** (简洁、活泼) and **Bangumi** (轻量、清爽). The key guidelines are:

### General Design

- **Overall**: Light, minimal, clean layout with soft accent colors.
- **Color Palette**:
  - Primary: Light blue (`#00A1D6` like Bilibili)
  - Secondary: Soft orange or pink as highlights
  - Background: White or light gray
  - Text: Dark gray (`#333`) for readability
- **Typography**:
  - Use clean sans-serif fonts (e.g., `"Inter", "Noto Sans SC", system-ui`)
  - Headings: Slightly bolder, larger size for hierarchy
  - Body text: Comfortable line-height for readability

### Components

- **Cards & Panels**:
  - Rounded corners (`rounded-2xl`)
  - Soft shadow (`shadow-md` or `shadow-lg`)
  - Padding (`p-4` or `p-6`)
- **Buttons**:
  - Rounded (`rounded-full` or `rounded-lg`)
  - Clear hover/focus states (`hover:bg-blue-100`, `focus:ring`)
  - Primary buttons: Blue background with white text
  - Secondary buttons: Outline style with hover fill
- **Navigation**:
  - Fixed or sticky top bar for easy access
  - Active route highlighted with accent color
- **Lists (e.g., anime list, episodes)**:
  - Use grid or flex layouts
  - Consistent spacing (`gap-4` or `gap-6`)
  - Cover images have rounded corners and subtle hover zoom (`hover:scale-105 transition`)

### Interactions

- **Animations**:
  - Use smooth, subtle transitions (`transition-all duration-300`)
  - Avoid overly flashy effects
- **Hover/Focus States**:
  - Always provide feedback (color shift, shadow, or scale)
- **Mobile Responsiveness**:
  - Layouts adapt using Tailwind's responsive utilities (`sm:`, `md:`, `lg:` breakpoints)
  - Navigation collapses into a menu on smaller screens

### Icons & Visual Elements

- Prefer **line-style icons** (e.g., `lucide-react`, `Heroicons`) for clarity
- Use icons sparingly for navigation, actions, or status indicators
- Keep images lightweight and optimized
