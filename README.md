# RPM Generator - IIF SADEWA GOA (Vite + React + Tailwind)

This project wraps the provided single-file React component into a small Vite app with Tailwind CSS.

## Quick start

1. Install dependencies:
```bash
cd rpm-generator-app
npm install
# or: pnpm install / yarn
```

2. Run dev server:
```bash
npm run dev
```

3. Build:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Files of interest
- `src/App.jsx` — your uploaded component (already copied here).
- `src/main.jsx` — app entry.
- `src/index.css` — Tailwind base imports.
- `tailwind.config.cjs`, `postcss.config.cjs` — Tailwind setup.

## Deployment
You can deploy to Vercel/Netlify by connecting the repository and using the `npm run build` output.

If you want, I can:
- Remove the hardcoded admin credentials and add environment-based auth.
- Convert tokens to a simple backend (Express) for persistence.
- Prepare a Git repository and push to GitHub for you.

