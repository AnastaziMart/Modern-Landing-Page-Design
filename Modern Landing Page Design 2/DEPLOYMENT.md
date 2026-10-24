# Deploying the Anastazi landing page

This repository is a standard static website written in HTML, CSS, and JavaScript.
The camera-based virtual mirror runs entirely in the visitor's browser.

## Source files

- `index.html` — page content and accessible HTML structure
- `src/style.css` — complete responsive styling
- `src/main.js` — navigation, photo upload, and camera mirror behavior
- `public/images/` — local jewelry photography and the transparent try-on overlay

## Build

Install dependencies and create the production files:

```sh
pnpm install
pnpm build
```

The finished website is generated in `dist/`.

## Hosting configuration

Use these settings on any static hosting platform:

- Build command: `pnpm build`
- Publish/output directory: `dist`
- Node.js: version 20 or newer

The virtual mirror requires HTTPS in production because browsers only allow
camera access on secure sites. Visitors who decline camera access can still use
the photo upload option. Camera and uploaded images remain on the visitor's
device and are not sent to a server.
