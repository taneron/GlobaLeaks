# GlobaLeaks - Custom Build

This repository contains a customized version of GlobaLeaks with visual/UI modifications.

## Quick Links

- **[Full Customization Guide](CUSTOMIZATION_GUIDE.md)** - Comprehensive documentation for modifying GlobaLeaks builds
- [GlobaLeaks Official Documentation](https://docs.globaleaks.org/)

---

## Quick Start: UI Update Flow

### On Build Server

```bash
cd client
npm install          # First time only
grunt build
zip -r js.zip build/js/*
```

### Transfer to Local Machine

```bash
# Download js.zip from build server
scp -i ~/.ssh/your_key user@build-server:~/GlobaLeaks/client/js.zip ~/Downloads/
```

### Upload to Production Server

```bash
scp -i ~/.ssh/your_key ~/Downloads/js.zip admin@production-server:~/js.zip
```

### Deploy on Production Server

```bash
# Backup current files
sudo cp -r /usr/share/globaleaks/client/js /usr/share/globaleaks/client/js-old

# Remove old files
sudo rm /usr/share/globaleaks/client/js/*

# Extract new files
unzip ~/js.zip -d /usr/share/globaleaks/client/js

# Move to correct location
sudo mv /usr/share/globaleaks/client/js/build/js/* /usr/share/globaleaks/client/js/

# Clean up
rm -rf /usr/share/globaleaks/client/js/build
```

---

## Customizations in This Version

### Custom Pages Added
- `/datenschutz` - Privacy policy page
- `/impressum` - Legal notice page

### UI Modifications
- Simplified footer
- Custom styling via `additional.styles.css`
- Hidden elements for white-labeling

### Files Modified
- `client/app/src/app.routes.ts` - Added custom routes
- `client/app/src/shared/partials/footer/footer.component.html` - Simplified footer
- `client/app/additional.styles.css` - Custom CSS overrides
- `client/app/src/pages/pilgermair/` - Custom page components

---

## Development

```bash
cd client
npm install
ng serve --proxy-config proxy.conf.json
```

Access at `http://localhost:4200`

---

## Production Build

```bash
cd client
npm install
grunt build
```

Output in `client/build/`

---

For detailed instructions, see the **[Customization Guide](CUSTOMIZATION_GUIDE.md)**.
