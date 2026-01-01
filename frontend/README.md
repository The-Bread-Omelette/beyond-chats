# BeyondChats — Frontend

This frontend is a React + Vite dashboard for managing and auditing AI-enhanced blog content. It uses a dark glassmorphism theme and provides an overview of scraped articles and enhancement status.

Core stack
- Framework: React 19
- Build tool: Vite
- UI: Material UI (MUI) v7
- Animations: Framer Motion
- Styling: Emotion with design tokens

Features
- Content dashboard with filtering by enhancement status
- Queue management and enhancement job monitoring
- Version comparison: original vs enhanced content
- Accessibility options (reduced motion, high-contrast dark mode)

Project structure (important folders)
- `src/api` — Axios client and endpoint definitions
- `src/components` — UI components (articles, layout, reusable UI)
- `src/hooks` — Data fetching and enhancement helpers
- `src/styles` — Theme and global styles

Setup
1. Ensure Node.js 18+ is installed.
2. Start the backend (locally or accessible host).
3. In this folder run:

```bash
cd frontend
npm install
cp .env.template .env
# edit VITE_API_BASE_URL in .env
npm run dev
```

Scripts
- `npm run dev` — start dev server
- `npm run build` — build production assets
- `npm run lint` — run ESLint
- `npm run preview` — serve production build locally