# GlobaLeaks Customization and Build Guide

A comprehensive guide to modifying GlobaLeaks builds for your organization's needs. This guide covers visual/UI changes, adding custom pages, modifying styles, and deploying your customized version.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Repository Structure](#repository-structure)
3. [Build Process Overview](#build-process-overview)
4. [Making UI Customizations](#making-ui-customizations)
   - [Adding Custom CSS](#adding-custom-css)
   - [Modifying Existing Styles](#modifying-existing-styles)
   - [Hiding UI Elements](#hiding-ui-elements)
5. [Adding Custom Pages](#adding-custom-pages)
   - [Creating a New Component](#creating-a-new-component)
   - [Registering Routes](#registering-routes)
6. [Modifying the Footer](#modifying-the-footer)
7. [Building the Client](#building-the-client)
8. [Deploying to Server](#deploying-to-server)
9. [Quick Reference Commands](#quick-reference-commands)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed on your build machine:

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **Git**
- **Grunt CLI** (install globally: `npm install -g grunt-cli`)

For deployment, you'll also need:
- SSH access to your server
- `scp` or similar file transfer tool
- `unzip` utility on the server

---

## Repository Structure

Understanding the GlobaLeaks directory structure is essential for customization:

```
GlobaLeaks/
├── client/                          # Frontend Angular application
│   ├── app/                         # Application source code
│   │   ├── css/                     # Stylesheets
│   │   │   ├── main.css             # Main application styles
│   │   │   └── components/          # Component-specific styles
│   │   ├── src/                     # TypeScript source files
│   │   │   ├── app.routes.ts        # Application routing definitions
│   │   │   ├── pages/               # Page components
│   │   │   │   ├── pilgermair/      # Custom pages (example)
│   │   │   │   ├── dashboard/       # Dashboard pages
│   │   │   │   └── whistleblower/   # Whistleblower-facing pages
│   │   │   └── shared/              # Shared components and services
│   │   │       └── partials/        # Reusable UI partials (header, footer)
│   │   ├── images/                  # Image assets
│   │   ├── fonts/                   # Custom fonts
│   │   └── viewer/                  # PDF viewer files
│   ├── Gruntfile.js                 # Grunt build configuration
│   ├── angular.json                 # Angular CLI configuration
│   ├── package.json                 # Node.js dependencies
│   └── build/                       # Generated build output
├── backend/                         # Python backend (not covered here)
├── scripts/                         # Build and install scripts
│   ├── build.sh                     # Debian package builder
│   └── install.sh                   # Installation script
└── README.md                        # Project readme
```

---

## Build Process Overview

GlobaLeaks uses a multi-stage build process:

1. **Angular Build** (`ng build`) - Compiles TypeScript, bundles JavaScript, processes CSS
2. **Grunt Package** - Copies and organizes files for distribution
3. **String Replacements** - Updates paths and fixes certain patterns
4. **PostCSS Processing** - Generates RTL styles and minifies CSS
5. **Brotli Compression** - Compresses assets for faster delivery

### Build Tasks (defined in `Gruntfile.js`)

| Task | Description |
|------|-------------|
| `grunt build` | Full production build |
| `grunt build_for_testing` | Build with instrumentation for testing |
| `grunt shell:serve` | Run development server |
| `grunt clean` | Remove build artifacts |

---

## Making UI Customizations

### Adding Custom CSS

#### Method 1: Site-Level CSS (Recommended for Simple Changes)

Create or modify `client/app/additional.styles.css` for custom styles that can be uploaded to the site configuration:

```css
/* client/app/additional.styles.css */

/* Hide the privacy badge */
#PrivacyBadge {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
}

/* Hide the attribution clause */
.public #AttributionClause {
  display: none !important;
}

/* Custom header styling */
#HeaderBox1 {
  display: flex !important;
  gap: 1rem;
  align-items: center !important;
  height: 50px;
}

/* Custom logo sizing */
#HeaderBox1 #LogoBox img {
  height: 40px;
  object-fit: contain;
}

/* Hide language picker (if single language) */
#language-picker-select {
  display: none !important;
}
```

#### Method 2: Modify Core Styles

For deeper customizations, modify `client/app/css/main.css`:

```css
/* Customize colors */
a, a:hover, .nav-link-custom, a:focus {
  color: #103253;  /* Change primary link color */
  outline: 0;
  font-weight: bold;
  text-decoration: none;
}

/* Footer styling */
#FooterBox {
  background-color: #f5f7fa;
  text-align: center;
}

/* Body font configuration */
body {
  background-color: #fff;
  color: #1d1f2a;
  font-family: "Inter Variable", sans-serif;
  font-size: 16px;
}
```

### Modifying Existing Styles

To customize Bootstrap or component styles, check these locations:

- **Bootstrap overrides**: `client/app/css/components/overrides/bootstrap.css`
- **Component styles**: `client/app/css/components/`
- **Date picker**: `client/app/css/components/libs/ng-bootstrap/datepicker/`

### Hiding UI Elements

Common UI elements to hide for white-labeling:

```css
/* Hide page title */
#TitleBox #PageTitle {
  display: none !important;
}

/* Hide title separator */
#TitleBox .TitleSeparator {
  display: none !important;
}

/* Hide whistleblowing question */
#HomePageBox #WhistleblowingQuestion {
  display: none !important;
}

/* Custom tooltip styling */
.tooltip-inner {
  text-align: left !important;
  background-color: #2866a2 !important;
}
```

---

## Adding Custom Pages

### Creating a New Component

1. **Create the directory structure**:

```bash
mkdir -p client/app/src/pages/yourcompany/yourpage
```

2. **Create the component TypeScript file** (`home.component.ts`):

```typescript
// client/app/src/pages/yourcompany/yourpage/home.component.ts

import {Component, OnInit, inject} from "@angular/core";
import {AppDataService} from "@app/app-data.service";
import {preferenceResolverModel} from "@app/models/resolvers/preference-resolver-model";
import {PreferenceResolver} from "@app/shared/resolvers/preference.resolver";
import {UtilsService} from "@app/shared/services/utils.service";
import {MarkdownComponent} from "ngx-markdown";
import {StripHtmlPipe} from "@app/shared/pipes/strip-html.pipe";

@Component({
    selector: "src-yourpage-home",
    templateUrl: "./home.component.html",
    standalone: true,
    imports: [MarkdownComponent, StripHtmlPipe]
})
export class HomeComponent implements OnInit {
  protected appDataService = inject(AppDataService);
  private utilsService = inject(UtilsService);
  private preference = inject(PreferenceResolver);

  preferenceData: preferenceResolverModel;
  currentYear = new Date().getFullYear();

  ngOnInit(): void {
    if (this.preference.dataModel) {
      this.preferenceData = this.preference.dataModel;
    }
  }
}
```

3. **Create the component HTML template** (`home.component.html`):

```html
<!-- client/app/src/pages/yourcompany/yourpage/home.component.html -->

<div id="yourpage">
  <div data-ng-switch="page">
    <!-- Render markdown content from node configuration -->
    <markdown [data]="appDataService.public.node.description"></markdown>

    <!-- Or add custom HTML content -->
    <div class="custom-content">
      <h1>Your Custom Page</h1>
      <p>This is your custom page content.</p>
      <p>&copy; {{ currentYear }} Your Company</p>
    </div>
  </div>
</div>
```

### Registering Routes

Edit `client/app/src/app.routes.ts` to add your new page:

```typescript
// Add your route after the home route
{
  path: "your-page-url",
  canActivate: [Pageguard],
  loadComponent: () => import('@app/pages/yourcompany/yourpage/home.component').then(m => m.HomeComponent),
  data: {pageTitle: "Your Page Title"},
  pathMatch: "full",
  resolve: {
    // Add resolvers if needed
  }
},
```

**Example: Adding Datenschutz (Privacy Policy) and Impressum (Legal Notice) pages:**

```typescript
// client/app/src/app.routes.ts

export const appRoutes: Routes = [
  // ... existing routes ...

  {
    path: "datenschutz",
    canActivate: [Pageguard],
    loadComponent: () => import('@app/pages/pilgermair/datenschutz/home.component').then(m => m.HomeComponent),
    data: {pageTitle: "Datenschutz"},
    pathMatch: "full",
    resolve: {}
  },
  {
    path: "impressum",
    canActivate: [Pageguard],
    loadComponent: () => import('@app/pages/pilgermair/impressum/home.component').then(m => m.HomeComponent),
    data: {pageTitle: "Impressum"},
    pathMatch: "full",
    resolve: {}
  },

  // ... rest of routes ...
  {path: "**", redirectTo: ""}  // This must be last
];
```

---

## Modifying the Footer

The footer is located at `client/app/src/shared/partials/footer/footer.component.html`.

### Minimal Footer (Current Implementation)

```html
<!-- client/app/src/shared/partials/footer/footer.component.html -->

<footer id="FooterBox">
  @if (appDataService.public.node) {
    @if (appDataService.public.node.footer) {
      <markdown id="CustomFooter" class="vcenter preformatted mb-1" [data]="appDataService.public.node.footer"></markdown>
    }
  }
</footer>
```

### Extended Footer with Custom Links

```html
<footer id="FooterBox">
  @if (appDataService.public.node) {
    <div class="footer-content">
      @if (appDataService.public.node.footer) {
        <markdown id="CustomFooter" class="vcenter preformatted mb-1" [data]="appDataService.public.node.footer"></markdown>
      }

      <div class="footer-links">
        <a routerLink="/datenschutz">Datenschutz</a> |
        <a routerLink="/impressum">Impressum</a>
      </div>
    </div>
  }
</footer>
```

**Note**: If adding `routerLink`, you'll need to import `RouterLink` in the footer component's TypeScript file.

---

## Building the Client

### Development Build

For testing changes locally:

```bash
cd client
npm install                    # Install dependencies (first time only)
ng serve --proxy-config proxy.conf.json   # Start dev server
```

The development server runs at `http://localhost:4200` with live reload.

### Production Build

```bash
cd client
npm install                    # Install dependencies (first time only)
grunt build                    # Full production build
```

This creates the optimized build in `client/build/`.

### Creating a Deployable JS Archive

After building, create a zip file for deployment:

```bash
cd client
grunt build                    # Build first
zip -r js.zip build/js/*       # Create zip of JS files
```

---

## Deploying to Server

### Quick Update Flow (UI Changes Only)

This workflow is for updating the client-side JavaScript after UI changes:

#### 1. Build on Development Machine

```bash
cd client
grunt build
zip -r js.zip build/js/*
```

#### 2. Download the js.zip File

If building on a remote server, download via:
- VS Code: drag and drop from remote explorer
- Command line: `scp user@build-server:~/GlobaLeaks/client/js.zip ~/Downloads/`

#### 3. Upload to Production Server

```bash
scp -i ~/.ssh/your_key ~/Downloads/js.zip admin@your-server:~/js.zip
```

#### 4. Deploy on Production Server

```bash
# SSH into production server
ssh -i ~/.ssh/your_key admin@your-server

# Backup existing files
sudo cp -r /usr/share/globaleaks/client/js /usr/share/globaleaks/client/js-old

# Remove old files
sudo rm /usr/share/globaleaks/client/js/*

# Extract new files
unzip ~/js.zip -d /usr/share/globaleaks/client/js

# Move files to correct location (if nested)
sudo mv /usr/share/globaleaks/client/js/build/js/* /usr/share/globaleaks/client/js/

# Clean up
rm -rf /usr/share/globaleaks/client/js/build

# Optional: Restart GlobaLeaks service
sudo systemctl restart globaleaks
```

### Full Client Update

If you need to update more than just JS files (CSS, images, etc.):

```bash
# After grunt build
cd client

# Create full client archive
tar -czvf client-build.tar.gz build/

# Upload to server
scp client-build.tar.gz admin@your-server:~/

# On server:
sudo tar -xzvf client-build.tar.gz -C /usr/share/globaleaks/client/ --strip-components=1
```

### Server File Locations

| Content | Server Path |
|---------|-------------|
| Client root | `/usr/share/globaleaks/client/` |
| JavaScript | `/usr/share/globaleaks/client/js/` |
| CSS | `/usr/share/globaleaks/client/css/` |
| Images | `/usr/share/globaleaks/client/images/` |
| Fonts | `/usr/share/globaleaks/client/fonts/` |

---

## Quick Reference Commands

### Build Commands

```bash
# Full production build
cd client && grunt build

# Development server
cd client && ng serve --proxy-config proxy.conf.json

# Clean build artifacts
cd client && grunt clean

# Build for testing (with instrumentation)
cd client && grunt build_for_testing
```

### Deployment Commands

```bash
# Create JS zip
cd client && zip -r js.zip build/js/*

# Upload to server
scp -i ~/.ssh/key js.zip user@server:~/js.zip

# Server-side deployment
sudo cp -r /usr/share/globaleaks/client/js /usr/share/globaleaks/client/js-backup
sudo rm /usr/share/globaleaks/client/js/*
unzip ~/js.zip -d /tmp/js-new
sudo mv /tmp/js-new/build/js/* /usr/share/globaleaks/client/js/
```

### Rollback Commands

```bash
# Restore from backup
sudo rm -rf /usr/share/globaleaks/client/js
sudo mv /usr/share/globaleaks/client/js-old /usr/share/globaleaks/client/js
sudo systemctl restart globaleaks
```

---

## Troubleshooting

### Build Errors

**Error: `grunt: command not found`**
```bash
npm install -g grunt-cli
```

**Error: Module not found**
```bash
cd client && npm install
```

**Error: Angular build fails**
```bash
# Clear Angular cache
rm -rf client/.angular/cache
cd client && npm install && grunt build
```

### Deployment Issues

**Files not updating after deployment**
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Ensure Brotli-compressed files were updated (.br files)
- Restart the GlobaLeaks service: `sudo systemctl restart globaleaks`

**Permission denied errors**
```bash
sudo chown -R globaleaks:globaleaks /usr/share/globaleaks/client/
sudo chmod -R 755 /usr/share/globaleaks/client/
```

**Page not found (404) for custom routes**
- Ensure route is added before the `{path: "**", redirectTo: ""}` catch-all route
- Rebuild and redeploy after adding new routes

### Styling Issues

**Styles not applying**
- Use `!important` for overrides in additional.styles.css
- Check for CSS specificity conflicts
- Inspect element to verify CSS is loaded

**RTL styles broken**
- Ensure PostCSS ran during build (check for RTL rules in styles.css)
- Verify `postcss-rtlcss` is installed

---

## Best Practices

1. **Version Control**: Always commit your changes before building
2. **Backup**: Always backup production files before deploying
3. **Test**: Use the development server to test changes before production build
4. **Minimal Changes**: Keep customizations minimal to ease future upgrades
5. **Documentation**: Document your customizations for team members

---

## Additional Resources

- [GlobaLeaks Documentation](https://docs.globaleaks.org/)
- [Angular Documentation](https://angular.io/docs)
- [GlobaLeaks GitHub Issues](https://github.com/globaleaks/globaleaks-whistleblowing-software/issues)

---

*This guide is based on GlobaLeaks version 5.0.63*
