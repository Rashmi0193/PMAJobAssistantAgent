"use client";

import { useMemo, useState } from "react";
import { useAppState } from "@/context/AppStateContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Textarea, Input } from "@/components/ui/Input";
import { Divider } from "@/components/ui/Divider";
import { Badge } from "@/components/ui/Badge";
import { TaskQueue } from "@/components/TaskQueue";
import { GeneratedAnswer } from "@/components/GeneratedAnswer";
import { AutofillAgentPanel } from "@/components/AutofillAgentPanel";

const SAMPLE_RESUME_SNIPPET = `Frontend Engineer | React • TypeScript • Next.js
- Built UI features end-to-end and improved performance.
- Shipped accessible components and validated keyboard navigation.`;

function safeHost(url?: string) {
  if (!url) return undefined;
  try {
    return new URL(url).host;
  } catch {
    return undefined;
  }
}

export function AssistantShell() {
  const { state, actions } = useAppState();
  const [jobTitle, setJobTitle] = useState(state.job.title);
  const [company, setCompany] = useState(state.job.company);
  const [description, setDescription] = useState(state.job.description);
  const [jobUrl, setJobUrl] = useState(state.job.url ?? "");
  const [resumeSnippet, setResumeSnippet] = useState(SAMPLE_RESUME_SNIPPET);
  const [showAutofill, setShowAutofill] = useState(false);

  const jobLooksValid = useMemo(
    () => jobTitle.trim().length > 1 && company.trim().length > 1,
    [jobTitle, company]
  );

  return (
    <div className="grid2">
      <div style={{ display: "grid", gap: 16 }}>
        <Card style={{ boxShadow: "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, letterSpacing: -0.2 }}>Application Assistant</h1>
              <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.5 }}>
              Use AI to analyze job descriptions, generate tailored responses, and prepare your application efficiently.              </p>
            </div>
            <Badge tone={jobLooksValid ? "ok" : "warn"}>{jobLooksValid ? "Job context ready" : "Add job context"}</Badge>
          </div>

          <Divider />

          <div style={{ display: "grid", gap: 10 }}>
            <Field label="Job title">
              <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            </Field>
            <Field label="Company">
              <Input value={company} onChange={(e) => setCompany(e.target.value)} />
            </Field>
            <Field label="Job posting URL" hint="Optional — used by a scraper tool in a real system.">
              <Input value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} placeholder="https://…" />
            </Field>
            <Field label="Job description" hint="In a real product, this would be extracted from the job page.">
              <Textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} />
            </Field>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            <Button
              variant="secondary"
              disabled={!jobLooksValid}
              onClick={() => actions.setJob({ title: jobTitle, company, description, url: jobUrl.trim() || undefined })}
            >
              Save job context
            </Button>
            <Button
              variant="ghost"
              disabled={!jobUrl.trim()}
              onClick={() => actions.scrapeJobFromUrl(jobUrl.trim())}
              title="Extract job details from the provided URL"
              >
            </Button>
          </div>

          <Divider style={{ marginTop: 16 }} />

          <Field
            label="Resume snippet"
            hint="Use the Resume Score page for the full analyzer UI."
          >
            <Textarea
              rows={4}
              value={resumeSnippet}
              onChange={(e) => setResumeSnippet(e.target.value)}
            />
          </Field>

          <div style={{ height: 12 }} />

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button
              variant="secondary"
              disabled={!jobLooksValid}
              onClick={() => actions.runResumeScore(resumeSnippet)}
            >
              Resume score
            </Button>
            <Button disabled={!jobLooksValid} onClick={() => actions.runTailoredAnswer("Why this role?")}>
              Tailored answer
            </Button>
            <Button
              variant="ghost"
              disabled={!jobLooksValid}
              onClick={() => setShowAutofill((s) => !s)}
            >
              Autofill {showAutofill ? "▲" : "▼"}
            </Button>
          </div>
          <p className="mt-3 text-[12px] text-[color:var(--faint)] leading-6">
  Autofill suggestions are generated based on your profile and job context.
  Review and approve before applying.
</p>
        </Card>

        {showAutofill ? (
          <AutofillAgentPanel
            profile={state.profile}
            site={safeHost(state.job.url) ?? "this application site"}
            onApprove={(fields) =>
              actions.runAutofill({
                site: safeHost(state.job.url) ?? "site",
                fields
              })
            }
          />
        ) : null}

        <TaskQueue tasks={state.tasks} />
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        <GeneratedAnswer />

        <Card style={{ boxShadow: "none" }}>
          <h3 style={{ margin: 0, fontSize: 14 }}>Recent Feedback</h3>
          <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.5 }}>
            A simple feedback loop: every output can be rated 👍/👎 with an optional note.
          </p>
          <Divider />
          {state.feedback.length ? (
            <div style={{ display: "grid", gap: 10 }}>
              {state.feedback.slice(0, 6).map((f) => (
                <div
                  key={f.id}
                  style={{
                    padding: 10,
                    borderRadius: 14,
                    border: "1px solid var(--border-1)",
                    background: "var(--surface-2)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ fontWeight: 650 }}>
                      {f.kind} • {f.rating === "up" ? "👍" : "👎"}
                    </div>
                    <div style={{ color: "var(--faint)", fontSize: 12 }}>
                      {new Date(f.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                  {f.note ? (
                    <div style={{ marginTop: 6, color: "var(--muted)", lineHeight: 1.5 }}>{f.note}</div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: "var(--muted)" }}>No feedback yet.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
