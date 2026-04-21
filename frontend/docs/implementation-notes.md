# Implementation notes / anticipated challenges

## Agentic UX pitfalls
- **Over-automation**: users want previews + explicit approvals, especially for “autofill/submit”.
- **Ambiguous states**: “working” must show a plan/steps, not a spinner-only experience.
- **Hallucinated edits**: show diffs and let users accept/reject per change (future enhancement).

## Data handling & security
- Storing profile/resume data requires clear boundaries (local-only vs server) and good UX copy.
- For real integrations, add consent screens and field-level data usage explanations.

## Asynchrony + trust
- Multi-step tasks should remain inspectable and recoverable after refresh (persist task state).
- Errors must be actionable (“what to do next”), not generic.

## Quality loop
- Thumbs up/down alone is low-signal; add optional categories (tone/accuracy/completeness) later.
- Connect feedback to the exact output + input context for effective iteration.

