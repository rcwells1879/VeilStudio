# VeilStudio Website Documentation

Welcome to the documentation for the VeilStudio website. This document provides an overview of the project's structure, instructions for use, and information about the tools and frameworks used.

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Prerequisites](#prerequisites)
5. [Getting Started](#getting-started)
6. [Project Structure](#project-structure)
7. [Styling and Theming](#styling-and-theming)
8. [Development Commands](#development-commands)
9. [Configuration Files](#configuration-files)
10. [Troubleshooting](#troubleshooting)
11. [Additional Deployment Options](#additional-deployment-options)
12. [Support](#support)
13. [License](#license)

## Introduction
The VeilStudio website is a modern, privacy-focused landing page designed to showcase the company's commitment to user privacy and security. Built with Next.js 14+ and Tailwind CSS, it features automated deployment, a working contact form, and comprehensive security documentation.

## Features
- **Modern Design**: Dark theme with bold gradients and clean typography.
- **Mobile-First**: Responsive design optimized for all screen sizes.
- **Performance**: Built with Next.js App Router and static export.
- **Animations**: Subtle, tasteful animations and hover effects.
- **Privacy-Focused**: Emphasizes VeilStudio's privacy-first approach.
- **Working Contact Form**: Integrated with Formspree for reliable email delivery.
- **Security Page**: Comprehensive documentation of security features.
- **Automated Deployment**: GitHub Actions with FTP deployment to cPanel.

## Tech Stack
- **Framework**: Next.js 14+ with App Router and Static Export.
- **Styling**: Tailwind CSS with custom gradients and animations.
- **Typography**: Inter font family for clean, modern aesthetics.
- **Icons**: Lucide React for consistent iconography.
- **Language**: TypeScript for type safety.
- **Forms**: Formspree integration for contact form submissions.
- **Deployment**: GitHub Actions with FTP Deploy Action.
- **Hosting**: cPanel hosting with Cloudflare proxy.

## Prerequisites
Before you begin, ensure you have the following installed:
- Node.js: Version 18.0.0 or higher.
- npm: Comes with Node.js.
- Git: For version control.
- cPanel Hosting: With FTP access.
- Formspree Account: For contact form functionality.

## Getting Started
### Local Development
1. Clone the repository:
    ```bash
    git clone https://github.com/rcwells1879/VeilStudio.git
    cd VeilStudio
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create environment file (optional):
    ```bash
    cp .env.local.example .env.local
    ```
4. Run the development server:
    ```bash
    npm run dev
    ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
The project is configured for static export to work with cPanel hosting:
```bash
# Build the static site
npm run build

# The built files will be in the 'out' directory
# These files are automatically deployed via GitHub Actions
```

## Project Structure
The project follows a typical Next.js structure with additional sections for API routes, global styles, and navigation components.
```
├── app/                          # Next.js App Router
│   ├── api/contact/             # Contact form API (deprecated)
│   ├── security/                # Security page
│   ├── globals.css              # Global styles and Tailwind
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Home page
├── components/                   # React components
│   ├── sections/                # Page sections
│   │   ├── ContactSection.tsx   # Contact form with Formspree
│   │   ├── Features.tsx         # Feature grid (links to security)
│   │   ├── Footer.tsx           # Footer with links
│   │   └── Hero.tsx             # Hero section with image
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx           # Gradient buttons
│   │   ├── Card.tsx            # Feature cards
│   │   └── Container.tsx        # Responsive containers
│   └── Navigation.tsx           # Main navigation
├── .github/workflows/           # GitHub Actions
│   └── deploy.yml              # Automated FTP deployment
├── public/                      # Static assets
│   └── images/                 # Hero images and assets
├── .cpanel.yml                 # cPanel deployment config (unused)
├── .env.local                  # Environment variables (local)
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── README.md                   # This file
```

## Styling and Theming
### Color Palette
- **Background**: Very dark grey/off-black (`#121212`).
- **Primary Gradient**: Blue to purple (`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`).
- **Secondary Gradient**: Warm orange (`linear-gradient(135deg, #ff8a80 0%, #ff5722 100%)`).
- **Text**: High contrast whites and greys for accessibility.

### Custom CSS Classes
```css
.btn-primary          # Primary gradient button
.btn-secondary        # Secondary gradient button  
.gradient-text        # Gradient text effect
.section-padding      # Consistent section spacing
.container-custom     # Responsive container
```

### Responsive Design
- **Mobile-first approach** with Tailwind breakpoints.
- **Flexible grid layouts** that adapt to screen size.
- **Touch-friendly** interactive elements.
- **Optimized images** with Next.js Image component.

## Development Commands
```bash
# Development
npm run dev              # Start development server (port 0 for auto-assignment)
npm run build           # Build for production (creates 'out' folder)
npm run start           # Start production server (not used with static export)

# Quality Assurance  
npm run lint            # Run ESLint for code quality
npm run type-check      # Run TypeScript compiler checks

# Utility
npm run kill-ports      # Kill common development ports
npm run clean-dev       # Kill ports and start development server
```

## Configuration Files
### next.config.js
Configured for static export to work with cPanel hosting:
```javascript
const nextConfig = {
  output: 'export',           // Generate static files
  trailingSlash: true,        // Ensure proper routing
  images: {
    unoptimized: true,        # Disable image optimization for static export
  },
}
```

### tailwind.config.js
Extended with custom colors, gradients, and animations for VeilStudio branding.

## Troubleshooting
### Common Build Issues
**Problem**: ESLint errors about unescaped entities
```bash
Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`
```
**Solution**: Replace apostrophes with `&apos;` or use double quotes instead of single quotes in JSX.

**Problem**: API routes not working in production
```bash
POST /api/contact 404 (Not Found)
```
**Solution**: API routes don't work with static export. Use Formspree or external service instead.

### Deployment Issues
**Problem**: FTP connection timeout
```bash
Error: connect ETIMEDOUT
```
**Solution**:
- Check FTP server address (use IP instead of domain)
- Verify FTP credentials in GitHub secrets
- Ensure hosting provider supports FTP connections

**Problem**: Files not updating after deployment
```bash
Deployment successful but changes not visible
```
**Solution**:
- Hard refresh browser (Ctrl+Shift+R)
- Check if Cloudflare cache needs clearing
- Verify deployment uploaded to correct directory

### Contact Form Issues
**Problem**: Form submissions not working
```bash
Failed to send message
```
**Solution**:
- Verify Formspree form ID in `ContactSection.tsx`
- Check Formspree dashboard for form status
- Ensure email address is verified in Formspree

**Problem**: Success message showing HTML entities
```bash
Message sent successfully! We&apos;ll get back to you soon.
```
**Solution**: Use double quotes instead of `&apos;` in success message strings.

## Additional Deployment Options
### Subdirectory Protection
The deployment workflow protects subdirectories for additional apps:
```yaml
exclude-glob-from-server: |
  /public_html/veilchat/**
  /public_html/apps/**