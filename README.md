# AI-Powered Job Application Assistant

Frontend Engineer assignment implementation (frontend-only). The UI is inspired by Simplify-style UX patterns (not copied).

## Tech stack (frontend)

- **Framework:** Next.js 14 (App Router)
- **UI:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS + global CSS (`frontend/src/app/globals.css`)
- **State management:** React Context + hooks + `localStorage` persistence
- **API layer (stubbed):** `frontend/src/services/api.ts` (ready to point to your teammate’s backend)
- **Linting:** ESLint (Next.js config)

## What’s included (frontend-only)

- Marketing-style landing page (hero, feature sections, curated lists, FAQ)
- Demo auth (login/signup) using `localStorage` (no real backend yet)
- Profile setup wizard (industries, skills, salary, locations)
- “Jobs for you” page that filters/ranks a mock job feed based on preferences
- Job application tracker dashboard (mock data)
- Copilot demo (mock agent flow), resume scoring UI, tailored answer UI (mock)
- Extension scaffold (Manifest V3) with a demo autofill flow (heuristic; local-only)

## Repo structure

- `frontend/` – Next.js app, docs, and extension (all frontend work lives here)
- `backend/` – (reserved for your teammate; not implemented here)

## Getting started

1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Open http://localhost:3000

## Browser extension (frontend-only demo)

Extension code lives in `frontend/extension/`.

Install (Chrome):
1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select `frontend/extension/`
