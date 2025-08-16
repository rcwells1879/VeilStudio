# VeilStudio Website

A modern, privacy-focused landing page for VeilStudio built with Next.js 14+ and Tailwind CSS.

## Features

- 🎨 **Modern Design**: Dark theme with bold gradients and clean typography
- 📱 **Mobile-First**: Responsive design optimized for all screen sizes
- ⚡ **Performance**: Built with Next.js App Router for optimal performance
- 🎭 **Animations**: Subtle, tasteful animations and hover effects
- 🔒 **Privacy-Focused**: Emphasizes VeilStudio's privacy-first approach

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **Typography**: Inter font family
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout component
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── sections/         # Page sections (Hero, Features, Footer)
│   ├── ui/              # Reusable UI components
│   └── Navigation.tsx   # Main navigation component
├── lib/                  # Utility functions
├── public/              # Static assets
└── styles/             # Additional styles
```

## Key Components

- **Hero Section**: Privacy-first tagline with CTA and hero image
- **Features Section**: Three-column grid highlighting key differentiators
- **Navigation**: Responsive navigation with mobile menu
- **Footer**: Multi-column footer with links and social media

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## Brand Guidelines

**VeilStudio** develops powerful, beautiful AI-integrated applications with:
- **Privacy First**: Local model support and data control
- **Bring Your Own Key**: API key flexibility
- **Agentic Power**: Advanced tool integration

See `CLAUDE.md` for detailed project guidelines and architecture decisions.