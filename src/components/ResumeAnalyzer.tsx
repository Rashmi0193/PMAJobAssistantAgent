"use client";

import { useMemo, useState } from "react";
import { useAppState } from "@/context/AppStateContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Divider } from "@/components/ui/Divider";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Input";

const SAMPLE_RESUME = `Frontend Engineer | React • TypeScript • Next.js

- Built reusable component library and improved UI consistency across 6 products.
- Reduced bundle size by 18% via code splitting and dependency audit.
- Collaborated with design to ship accessible flows (keyboard, ARIA, contrast).
- Added integration tests for critical checkout paths.
`;

function scoreLabel(score: number) {
  if (score >= 85) return "Great fit";
  if (score >= 70) return "Good fit";
  if (score >= 55) return "Some gaps";
  return "Needs work";
}

function scoreTone(score: number) {
  if (score >= 85) return "ok";
  if (score >= 70) return "ok";
  if (score >= 55) return "warn";
  return "danger";
}

export function ResumeAnalyzer() {
  const { state, actions } = useAppState();
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const [feedbackNote, setFeedbackNote] = useState("");

  const analysis = state.resumeAnalysis;
  const canAnalyze = useMemo(() => resumeText.trim().length > 30, [resumeText]);

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, letterSpacing: -0.2 }}>Resume analyzer</h1>
          <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.5 }}>
            Mock scoring UI: shows match score, strengths, gaps, and actionable tips.
          </p>
        </div>
        {analysis ? (
          <Badge tone={scoreTone(analysis.score) as any}>
            {analysis.score}/100 • {scoreLabel(analysis.score)}
          </Badge>
        ) : (
          <Badge>Not analyzed</Badge>
        )}
      </div>

      <Divider />

      <Field
        label="Paste your resume text"
        hint="For this assignment, we use dummy/mock analysis — no backend needed."
      >
        <Textarea rows={10} value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
      </Field>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
        <Button disabled={!canAnalyze} onClick={() => actions.runResumeScore(resumeText)}>
          Analyze
        </Button>
        <Button variant="secondary" onClick={() => setResumeText(SAMPLE_RESUME)}>
          Use sample
        </Button>
        <div style={{ flex: 1 }} />
        <Button
          variant="ghost"
          disabled={!analysis}
          onClick={() => actions.submitFeedback({ kind: "ResumeTip", rating: "up", note: feedbackNote || undefined })}
        >
          👍 Tips
        </Button>
        <Button
          variant="ghost"
          disabled={!analysis}
          onClick={() => actions.submitFeedback({ kind: "ResumeTip", rating: "down", note: feedbackNote || undefined })}
        >
          👎 Tips
        </Button>
      </div>

      <div style={{ height: 12 }} />
      <Field label="Feedback note (optional)">
        <Textarea rows={2} value={feedbackNote} onChange={(e) => setFeedbackNote(e.target.value)} />
      </Field>

      {analysis ? (
        <>
          <Divider />
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr", alignItems: "start" }}>
            <Card style={{ background: "var(--surface-2)", boxShadow: "none" }}>
              <h2 style={{ margin: 0, fontSize: 16 }}>Strengths</h2>
              <ul style={{ margin: "10px 0 0", color: "var(--muted)", lineHeight: 1.6 }}>
                {analysis.strengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </Card>
            <Card style={{ background: "var(--surface-2)", boxShadow: "none" }}>
              <h2 style={{ margin: 0, fontSize: 16 }}>Gaps</h2>
              <ul style={{ margin: "10px 0 0", color: "var(--muted)", lineHeight: 1.6 }}>
                {analysis.gaps.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </Card>
            <Card style={{ background: "var(--surface-2)", boxShadow: "none" }}>
              <h2 style={{ margin: 0, fontSize: 16 }}>Improvement tips</h2>
              <ol style={{ margin: "10px 0 0", color: "var(--muted)", lineHeight: 1.6 }}>
                {analysis.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ol>
            </Card>
          </div>
        </>
      ) : null}
    </Card>
  );
}
