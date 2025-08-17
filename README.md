# VeilStudio Website

A modern, privacy-focused landing page for VeilStudio built with Next.js 14+ and Tailwind CSS. Features automated deployment, working contact form, and comprehensive security documentation.

## 🚀 Features

- 🎨 **Modern Design**: Dark theme with bold gradients and clean typography
- 📱 **Mobile-First**: Responsive design optimized for all screen sizes
- ⚡ **Performance**: Built with Next.js App Router and static export
- 🎭 **Animations**: Subtle, tasteful animations and hover effects
- 🔒 **Privacy-Focused**: Emphasizes VeilStudio's privacy-first approach
- 📧 **Working Contact Form**: Integrated with Formspree for reliable email delivery
- 🛡️ **Security Page**: Comprehensive documentation of security features
- 🚀 **Automated Deployment**: GitHub Actions with FTP deployment to cPanel

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with App Router and Static Export
- **Styling**: Tailwind CSS with custom gradients and animations
- **Typography**: Inter font family for clean, modern aesthetics
- **Icons**: Lucide React for consistent iconography
- **Language**: TypeScript for type safety
- **Forms**: Formspree integration for contact form submissions
- **Deployment**: GitHub Actions with FTP Deploy Action
- **Hosting**: cPanel hosting with Cloudflare proxy

## 📋 Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Comes with Node.js
- **Git**: For version control
- **cPanel Hosting**: With FTP access
- **Formspree Account**: For contact form functionality

## 🚀 Getting Started

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rcwells1879/VeilStudio.git
   cd VeilStudio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file** (optional):
   ```bash
   # Create .env.local for local development
   cp .env.local.example .env.local
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

### Building for Production

The project is configured for static export to work with cPanel hosting:

```bash
# Build the static site
npm run build

# The built files will be in the 'out' directory
# These files are automatically deployed via GitHub Actions
```

## 🔄 Deployment Workflow

### Automated Deployment

The website uses **GitHub Actions** for automated deployment to cPanel hosting via FTP:

1. **Push to main branch** triggers automatic deployment
2. **GitHub Actions** builds the Next.js site 
3. **FTP Deploy Action** uploads files to your cPanel hosting
4. **Live site** is updated at veilstudio.io

### Required GitHub Secrets

Configure these secrets in your GitHub repository (Settings → Secrets → Actions):

- `FTP_SERVER`: Your cPanel server IP (e.g., `66.29.132.172`)
- `FTP_USERNAME`: Your cPanel username (e.g., `veilcszl`)
- `FTP_PASSWORD`: Your cPanel password

### Deployment Process

```bash
# Make your changes locally
git add .
git commit -m "Your commit message"
git push origin main

# GitHub Actions automatically:
# 1. Installs dependencies (npm ci)
# 2. Builds the site (npm run build)
# 3. Deploys to /public_html/ via FTP
# 4. Preserves subdirectories like /veilchat/
```

### Monitoring Deployments

- **GitHub Actions Tab**: View real-time deployment progress
- **Deployment time**: ~15-20 seconds for typical changes
- **Files deployed**: All contents of the `out` folder
- **Protected directories**: Subdirectories like `/veilchat/` are preserved

## 📧 Contact Form Integration

### Formspree Setup

The contact form uses **Formspree** for reliable email delivery:

1. **Sign up** at [formspree.io](https://formspree.io) (free tier: 50 submissions/month)
2. **Create a new form** and set delivery email to your address
3. **Copy the form ID** (looks like `xdkdvdol`)
4. **Update the form endpoint** in the code:

```typescript
// In components/sections/ContactSection.tsx
const formspreeResponse = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
```

### Form Features

- ✅ **Validation**: Client-side validation for required fields
- ✅ **Success/Error States**: Visual feedback for form submissions
- ✅ **Spam Protection**: Built-in Formspree spam filtering
- ✅ **Mobile Responsive**: Optimized for all device sizes
- ✅ **Accessibility**: Proper labels and keyboard navigation

### Testing the Contact Form

1. **Visit the live site** and scroll to the contact section
2. **Fill out the form** with test data
3. **Submit the form** and verify success message
4. **Check your email** for the submission
5. **Verify in Formspree dashboard** that submission was recorded

## 🛡️ Security Page

### Features Documented

The security page (`/security`) covers VeilStudio's comprehensive security approach:

- **Prompt Injection Protection**: Multi-layered defense against malicious prompts
- **Code Injection Prevention**: Sandboxed execution environments
- **Private Search**: Local search processing with zero logging
- **Local Storage Encryption**: Military-grade encryption for sensitive data
- **Offline Capability**: Complete functionality without internet connectivity
- **Cookie-Free Experience**: Zero tracking cookies or persistent identifiers
- **Input/Output Validation**: Industry-leading validation protocols
- **Read-Only Tool Access**: Restricted permissions for local tool servers

### Updating Security Content

Security features are defined in `app/security/page.tsx`:

```typescript
const securityFeatures = [
  {
    icon: Shield,
    title: 'Feature Name',
    description: 'Feature description...',
    details: ['Detail 1', 'Detail 2', 'Detail 3']
  }
  // Add new features here
]
```

## 📁 Project Structure

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

## 🎨 Styling and Theming

### Color Palette

- **Background**: Very dark grey/off-black (`#121212`)
- **Primary Gradient**: Blue to purple (`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`)
- **Secondary Gradient**: Warm orange (`linear-gradient(135deg, #ff8a80 0%, #ff5722 100%)`)
- **Text**: High contrast whites and greys for accessibility

### Custom CSS Classes

```css
.btn-primary          # Primary gradient button
.btn-secondary        # Secondary gradient button  
.gradient-text        # Gradient text effect
.section-padding      # Consistent section spacing
.container-custom     # Responsive container
```

### Responsive Design

- **Mobile-first approach** with Tailwind breakpoints
- **Flexible grid layouts** that adapt to screen size
- **Touch-friendly** interactive elements
- **Optimized images** with Next.js Image component

## 🧪 Development Commands

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

## 🔧 Configuration Files

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

## 🐛 Troubleshooting

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

## 🚢 Additional Deployment Options

### Subdirectory Protection

The deployment workflow protects subdirectories for additional apps:

```yaml
exclude-glob-from-server: |
  /public_html/veilchat/**
  /public_html/apps/**
```

### Setting Up Additional Apps

1. **Create subdirectory** in `/public_html/` (e.g., `/veilchat/`)
2. **Deploy app separately** via FTP or additional GitHub Actions
3. **Access app** at `veilstudio.io/veilchat/`
4. **Protected from overwrites** by main site deployments

## 📞 Support

### Getting Help

- **GitHub Issues**: [Create an issue](https://github.com/rcwells1879/VeilStudio/issues) for bugs or feature requests
- **Formspree Support**: [Formspree Help Center](https://help.formspree.io/) for form-related issues
- **Hosting Support**: Contact your cPanel hosting provider for server issues

### Useful Resources

- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **GitHub Actions**: [docs.github.com/actions](https://docs.github.com/en/actions)
- **Formspree Documentation**: [formspree.io/docs](https://formspree.io/docs)

## 📄 License

This project is private and proprietary to VeilStudio. All rights reserved.

---

**VeilStudio** - Your AI, Your Keys, Your Control