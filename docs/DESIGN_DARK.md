---
name: Lexora AI
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#4648d4'
  on-secondary: '#ffffff'
  secondary-container: '#6063ee'
  on-secondary-container: '#fffbff'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  h1:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 24px
  container-max: 1280px
---

## Brand & Style

The design system for Lexora AI focuses on **Functional Minimalism**. It draws inspiration from high-performance productivity tools like Notion and Linear, prioritizing clarity, speed, and focus. The aesthetic is "quietly premium"—achieved through generous whitespace, razor-sharp alignment, and a restrained use of color. 

The brand personality is authoritative yet approachable, positioning Lexora AI as a sophisticated assistant rather than a complex machine. The visual style utilizes **Corporate Modern** principles with subtle **Glassmorphism** in overlays to maintain a sense of depth and lightness. The goal is to evoke a sense of effortless intelligence and calm productivity.

## Colors

The palette is centered around **Indigo**, used sparingly to highlight primary actions and active states. 

- **Primary & Secondary:** A range of Indigo shades provides visual hierarchy. Primary Indigo (#4F46E5) is the core brand touchpoint.
- **Neutrals:** A sophisticated Slate/Zinc scale handles text and UI scaffolding. 
- **Theming:** 
    - **Light Mode:** High-contrast text on white and off-white surfaces with 1px soft borders.
    - **Dark Mode:** Deep charcoal and black backgrounds. Avoid pure black for surfaces; use Zinc-900 or 950 to maintain softness.
- **Accents:** Semantic colors (Success, Warning, Error) are desaturated to maintain the minimal aesthetic.

## Typography

This design system utilizes **Inter** (or Geist) across all levels to maintain a cohesive, utilitarian feel. 

- **Headlines:** Use tighter letter-spacing and semi-bold weights to create a strong visual anchor.
- **Body:** Standardized at 16px for readability, with a generous 1.6 line height to support long-form AI-generated content.
- **Labels:** Used for navigation, tags, and small captions. These should often be set in medium weight for better legibility at small sizes.
- **Mono (Optional):** For code snippets or AI metadata, use a clean monospaced font at 13px.

## Layout & Spacing

The design system employs a **Fixed Grid** model for desktop dashboards and a **Fluid Grid** for content-heavy pages.

- **Grid:** A 12-column grid with a 24px gutter.
- **Rhythm:** An 8pt linear scaling system for all padding and margins. Use 16px (md) for standard component spacing and 24px (lg) for section separation.
- **Margins:** Page margins should be a minimum of 24px on mobile and 40px+ on desktop to reinforce the minimalist, airy aesthetic.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows.

- **Borders:** The primary method of separation. Use `1px solid` borders. In Light mode, use Zinc-200; in Dark mode, use Zinc-800.
- **Surfaces:** Use subtle shifts in background color to denote elevation. A "Level 1" card might be white, while the "Level 0" background is Zinc-50.
- **Shadows:** Use only one "Ambient Shadow" for floating elements (modals, dropdowns). This shadow should be extremely diffused: `0 10px 30px -10px rgba(0,0,0,0.1)`.
- **Blur:** Background blurs (12px to 20px) should be applied to navigation bars and modals to maintain context of the underlying content.

## Shapes

The design system uses a **Rounded** shape language to soften the technical nature of AI.

- **Standard Radius:** 8px (0.5rem) for buttons, inputs, and small widgets.
- **Large Radius (lg):** 16px (1rem) for main cards, containers, and modals.
- **Extra Large (xl):** 24px (1.5rem) for featured sections or large promotional banners.
- **Buttons:** Maintain the 8px radius for a balanced, modern look. Avoid fully pill-shaped buttons unless used for tags/chips.

## Components

- **Buttons:** 
    - *Primary:* Solid Indigo with white text. No gradient. 
    - *Secondary:* Ghost style with a 1px Zinc border. 
    - *Size:* 36px height for standard, 44px for large/CTA.
- **Cards:** 16px corner radius, 1px solid border. No shadow by default. Background should be 1 step lighter/darker than the page background.
- **Input Fields:** 8px radius, 1px Zinc-300 border. On focus, the border transitions to Indigo-500 with a subtle 2px Indigo glow (ring).
- **Chips/Tags:** Small (12px text), 4px radius or pill-shaped. Low-saturation backgrounds (e.g., Indigo-50).
- **Lists:** Clean rows separated by 1px horizontal dividers. Use 12px padding vertical, 16px horizontal.
- **AI Specifics:** 
    - *Message Bubbles:* Soft gray backgrounds for AI, clean white/Indigo for User. 
    - *Progress Bars:* Thin (4px) Indigo lines to indicate "thinking" states.