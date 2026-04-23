# AI-Powered Job Application Assistant

A frontend-driven prototype of an AI copilot that assists users throughout the job application process — from capturing job context to generating answers, autofilling applications, and tracking progress.
Built with a focus on extension-like UX, preview-first interactions, and user-controlled AI workflows.

## Key Features

Extension-style sidebar UI simulating real browser workflows
Job context capture (URL, title, company, description)
Preview-first autofill flow (user approves before applying)
AI-generated answers interface (mock integration)
Resume-to-job match scoring UI
Application tracking dashboard
Personalized job recommendations (mock ranking)

## Tech stack (frontend)

- **Framework:** Next.js 14 (App Router)
- **UI:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS + global CSS (`frontend/src/app/globals.css`)
- **State management:** React Context + hooks + `localStorage` persistence
- **API layer (stubbed):** `frontend/src/services/api.ts`
- **Linting:** ESLint (Next.js config)

## How it works

- User inputs job details or URL
- Job context is stored locally
- Copilot sidebar provides actions:
- Autofill application fields
- Generate tailored answers
- Score resume against job description
- Save job to tracker
- All outputs are previewed before user action

## Frontend Scope

- Designed and implemented extension-like UI architecture
- Built reusable components (Card, Field, Input, Tabs, etc.)
- Developed multi-step profile setup and preference system
- Implemented state management using React Context + localStorage
- Created interactive workflows for AI-assisted features
- Designed preview-first UX to maintain user control

## Repo structure

- `frontend/` – Next.js app, docs, and extension (all frontend work lives here)
- `backend/` – (reserved for teammate)

## Getting started

1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Open http://localhost:3000

## Browser extension (frontend-only demo)

Extension code located in `frontend/extension/`.

Install (Chrome):

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select `frontend/extension/`

## Future Improvements

- Integrate real LLM for answer generation
- Enhance autofill with DOM-based field detection
- Add real job scraping and ranking
- Improve personalization using user behavior
