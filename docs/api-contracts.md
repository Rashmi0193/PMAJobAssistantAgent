# API contracts (JSON)

These endpoints are implemented as **Next.js route handlers** under `src/app/api/*` and are called from `src/services/api.ts`.

## 1) Save profile
**POST** `/api/profile`

Request:
```json
{ "profile": { "name": "...", "email": "...", "skills": ["React"] } }
```

Response:
```json
{ "ok": true, "received": { "name": "...", "email": "...", "skills": ["React"] } }
```

## 2) Scrape job posting (tool use)
**POST** `/api/job/scrape`

Request:
```json
{ "url": "https://example.com/job/123" }
```

Response:
```json
{ "title": "Frontend Engineer", "company": "ExampleCo", "description": "…", "url": "https://…" }
```

## 3) Resume scoring agent
**POST** `/api/resume/analyze`

Request:
```json
{ "profile": { "skills": ["React","TypeScript"] }, "job": { "title": "…", "company": "…", "description": "…" }, "resumeText": "…" }
```

Response:
```json
{ "score": 78, "strengths": ["React"], "gaps": ["Accessibility"], "tips": ["Add quantified impact…"] }
```

## 4) Tailored answer agent
**POST** `/api/answer/generate`

Request:
```json
{ "profile": { "name": "…", "tone": "Warm" }, "job": { "title": "…", "company": "…" }, "question": "Why this role?" }
```

Response:
```json
{ "question": "Why this role?", "text": "…", "status": "Draft" }
```

## 5) Autofill agent (simulated)
**POST** `/api/autofill/simulate`

Request:
```json
{ "site": "boards.greenhouse.io", "fields": [{ "key": "email", "label": "Email", "value": "you@email.com" }] }
```

Response:
```json
{ "ok": true }
```

