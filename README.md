# AI-Powered Job Application Assistant 

Frontend Engineer assignment implementation using **React + Next.js (App Router) + TypeScript**.
Styling uses **Tailwind CSS + global CSS**.

## Tech stack

- **Framework:** Next.js 14 (App Router)
- **UI:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS + `src/app/globals.css`
- **State management:** React Context + hooks + `localStorage` persistence
- **API layer:** Next.js Route Handlers (`src/app/api/*/route.ts`) + `fetch` client (`src/services/api.ts`)
- **Linting:** ESLint (Next.js config)

## What’s included

- **Onboarding / Profile**: a form to capture user history, skills, links, and preferences.
- **Main Assistant UI**: “agentic” panel with tasks, progress, previews, and user approval controls.
- **Resume Analyzer**: mock resume score, match breakdown, and improvement tips.
- **Generated Answer**: suggested answer editor with copy + approve/reject + thumbs feedback.
- **Dashboard**: track application status across a simple pipeline.
- **State management**: React Context + hooks.
- **API layer**: `src/services/api.ts` (fetches Next.js route handlers under `src/app/api/*`).
- **UX docs**: agentic UX principles, user flows, and low-fi wireframes under `docs/`.
  - Extra notes: `docs/implementation-notes.md`
  - API contracts: `docs/api-contracts.md`

## Getting started

1. Install dependencies:
   - `npm install`
2. Run dev server:
   - `npm run dev`
3. Open:
   - http://localhost:3000

## Browser extension (frontend-only demo)

This repo includes a Chrome **Manifest V3** extension scaffold under `extension/` that demonstrates:
- local profile storage (extension storage)
- form field detection + preview
- user approval + autofill on the current page (heuristic-based)
- mock resume-to-JD scoring + mock tailored answers (local-only)

Install (Chrome):
1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the folder `extension/`

Use:
- Click the extension icon → fill **Profile** → **Open Copilot**
- On an application form page, click **Refresh** to detect fields → **Approve & fill**

## Project structure

- `src/app/` – Next.js routes and pages
- `src/components/` – UI + feature components
- `src/context/` – App state context and hooks
- `src/services/` – API service functions (mocked)
- `docs/` – UX research synthesis + flows + wireframes
