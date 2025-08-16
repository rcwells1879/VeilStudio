# VeilStudio Website Project

## Project Overview

VeilStudio website is a modern, privacy-focused landing page built with Next.js 14+ and Tailwind CSS. The site showcases VeilStudio's AI-integrated applications with emphasis on privacy, security, and user control.

## Architecture & Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS with custom utility classes
- **Typography**: Inter or Satoshi for clean, modern aesthetics
- **Theme**: Dark theme with gradient accents
- **Design**: Mobile-first responsive design

## Design System

### Color Palette
- **Background**: Very dark grey/off-black (#121212)
- **Primary Gradient**: Bold, vibrant gradient for CTAs and highlights
- **Secondary Gradient**: Warm orange-inspired gradient for secondary elements
- **Text**: High contrast whites and greys for accessibility

### Typography Hierarchy
- **Headlines**: Large, bold typography for impact
- **Subheadlines**: Medium weight for supporting information
- **Body**: Clean, readable text with proper line spacing
- **Tags**: Small pill-shaped elements with gradient backgrounds

## Component Structure

### Core Components (`/components`)
- **Navigation**: Sticky header with logo and navigation links
- **Hero**: Two-column layout with tagline, headline, CTA, and hero image
- **Features**: Three-column grid showcasing key differentiators
- **Footer**: Multi-column layout with links and branding

### UI Components (`/components/ui`)
- **Button**: Gradient CTA buttons with hover effects
- **Card**: Feature cards with icons and descriptions
- **Container**: Responsive container wrapper

## Key Features to Highlight

1. **Total Privacy**: Local model support (Ollama, LM Studio)
2. **Limitless Flexibility**: BYOK (Bring Your Own Key) approach
3. **Agentic Power**: Advanced tool integration for complex tasks

## Development Guidelines

- **Mobile-First**: Design and develop for mobile, then scale up
- **Performance**: Optimize images, use Next.js Image component
- **Accessibility**: Maintain high contrast ratios, proper semantic HTML
- **Animations**: Subtle, tasteful animations (fade-in-on-scroll, hover effects)
- **Code Quality**: Clean, well-commented, reusable components

## File Structure
```
/app                    # Next.js App Router pages
/components
  /sections            # Page sections (Hero, Features, etc.)
  /ui                  # Reusable UI components
/lib                   # Utility functions and configurations
/public
  /images             # Static assets
/styles                # Global styles and Tailwind config
```

## Brand Guidelines

**Company**: VeilStudio
**Tagline**: "Your AI, Your Keys, Your Control"
**Mission**: Developing powerful, beautiful AI-integrated applications with privacy and security as core principles
**Differentiators**: BYOK, Local-first, Powerful backend, Modular & open architecture

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Important Notes

- Never compromise on privacy messaging
- Maintain clean, minimalist aesthetic
- Ensure all components are fully responsive
- Follow Next.js App Router best practices
- Use Tailwind utility classes effectively

## Environment Configuration

- Claude code is running in WSL on a windows machine
- VeilStudio is running entirely in windows and not in WSL
- Do not attempt to install any dependencies inside the bash terminal that are needed for the app to run
- Provide instructions to run tests in PowerShell