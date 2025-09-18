# GEMINI.md

## Project Overview

This project is the official website for VeilStudio, a company focused on developing powerful, beautiful AI-integrated applications with privacy and security as core principles. The website is a modern, responsive, single-page landing page with a dedicated security section.

**Tagline:** "Your AI, Your Keys, Your Control"

**Mission:** Developing powerful, beautiful AI-integrated applications with privacy and security as core principles.

**Differentiators:**

*   **Total Privacy:** Local model support (Ollama, LM Studio).
*   **Limitless Flexibility:** BYOK (Bring Your Own Key) approach.
*   **Agentic Power:** Advanced tool integration for complex tasks.
*   **Modular & Open Architecture:** Flexible and extensible.

## Architecture & Technology Stack

*   **Framework:** Next.js 14+ (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Deployment:** Statically exported and deployed to cPanel via GitHub Actions.
*   **Forms:** Contact form integrated with Formspree.

The project uses the Next.js App Router, with a clear separation of concerns between pages, components, and sections. The application is configured for static site generation (`output: 'export'`), meaning the `npm run build` command produces a set of static HTML, CSS, and JavaScript files in the `out` directory. This is ideal for deployment on traditional web hosting like cPanel.

## Design System

*   **Theme:** Dark theme with gradient accents.
*   **Color Palette:**
    *   **Background:** Very dark grey/off-black (`#121212`)
    *   **Primary Gradient:** Blue to purple (`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`)
    *   **Secondary Gradient:** Warm orange (`linear-gradient(135deg, #ff8a80 0%, #ff5722 100%)`)
    *   **Text:** High contrast whites and greys for accessibility.
*   **Typography:**
    *   **Font:** Inter
    *   **Headlines:** Large, bold typography for impact.
    *   **Subheadlines:** Medium weight for supporting information.
    *   **Body:** Clean, readable text with proper line spacing.

## Building and Running

### Development

To run the website in a local development environment:

1.  **Install dependencies:**
    ```powershell
    npm install
    ```
2.  **Run the development server:**
    ```powershell
    npm run dev
    ```
    This will start the development server on an available port, usually `http://localhost:3000`.

### Production Build

To build the website for production:

```powershell
npm run build
```

This command will generate the static website in the `out` directory. These are the files that are deployed to the web server.

### Linting and Type-Checking

To ensure code quality, you can run the following commands in PowerShell:

*   **ESLint:**
    ```powershell
    npm run lint
    ```
*   **TypeScript:**
    ```powershell
    npm run type-check
    ```

## Development Conventions

*   **Mobile-First:** Design and develop for mobile, then scale up.
*   **Styling:** The project uses Tailwind CSS for all styling. Customizations, including the color palette, gradients, and animations, are defined in `tailwind.config.js`.
*   **Components:** Reusable components are located in the `components` directory, with a further breakdown into `sections` (for larger page areas) and `ui` (for smaller, general-purpose components).
*   **Static Site Generation:** The project is configured for static export. This means that server-side rendering (SSR) and API routes are not used in production. The contact form relies on a third-party service (Formspree) for this reason.
*   **Deployment:** Deployment is automated via GitHub Actions. Pushing to the `main` branch triggers a workflow that builds the site and deploys it to a cPanel server using FTP. The workflow is defined in `.github/workflows/deploy.yml`.
*   **Code Quality:** Write clean, well-commented, and reusable components.
*   **Accessibility:** Maintain high contrast ratios and use proper semantic HTML.
*   **Animations:** Use subtle, tasteful animations like fade-in-on-scroll and hover effects.

## Environment Configuration

*   The VeilStudio project is running entirely in Windows, not in WSL.
*   Do not attempt to install any dependencies inside a bash terminal that are needed for the app to run.
*   All commands should be run in PowerShell.
