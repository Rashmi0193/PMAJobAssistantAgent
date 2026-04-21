# Agentic UX principles (synthesis)

This project’s UI follows core “agentic UX” ideas:

## Trust & control
- Always show **what the agent will do** before it does it (plan/preview).
- Require explicit **user approval** for irreversible actions (submit, autofill, send).
- Provide **undo/revert** patterns where possible (restore previous text).

## Transparency & status
- Communicate agent state with clear statuses: **Queued → Running → Needs review → Done / Failed**.
- Keep an **activity log** of what the agent did and what data it used (high level).
- Surface confidence and uncertainty in human terms (e.g., “Needs confirmation”).

## Feedback loops
- Add lightweight feedback for every output: **thumbs up/down** + optional note.
- Separate “bad output” from “bad input” (ask: “Was the job post incomplete?”).

## Progressive disclosure
- Keep the primary UI minimal (top actions + current suggestion).
- Provide details on demand (expandable sections for evidence, tips, sources).

## Safety for user data
- Make the “Profile/Settings” page the canonical place for stored user data.
- Show which fields are required and how they’re used (plain language).

