"use client";

import { useMemo, useState } from "react";
import { useAppState } from "@/context/AppStateContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Divider } from "@/components/ui/Divider";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { GeneratedAnswer } from "@/components/GeneratedAnswer";
import { AutofillAgentPanel } from "@/components/AutofillAgentPanel";

type Tab = "Autofill" | "Answers" | "Score" | "Tracker";

function TabButton({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 10px",
        borderRadius: 999,
        border: `1px solid ${active ? "rgba(109,94,252,0.45)" : "var(--border-1)"}`,
        background: active ? "rgba(109,94,252,0.12)" : "transparent",
        color: "var(--text)",
        cursor: "pointer"
      }}
    >
      {children}
    </button>
  );
}

export function CopilotDemo() {
  const { state, actions } = useAppState();
  const [tab, setTab] = useState<Tab>("Autofill");

  const [jobUrl, setJobUrl] = useState(state.job.url ?? "");
  const [jobTitle, setJobTitle] = useState(state.job.title);
  const [company, setCompany] = useState(state.job.company);
  const [description, setDescription] = useState(state.job.description);

  const [resumeText, setResumeText] = useState(
    `Frontend Engineer | React • TypeScript • Next.js\n\n- Shipped UI features end-to-end with strong UX.\n- Improved performance and accessibility.\n- Wrote tests for critical flows.`
  );

  const jobLooksValid = useMemo(
    () => jobTitle.trim().length > 1 && company.trim().length > 1 && description.trim().length > 20,
    [jobTitle, company, description]
  );

  const host = useMemo(() => {
    if (!jobUrl.trim()) return "application site";
    try {
      return new URL(jobUrl).host;
    } catch {
      return "application site";
    }
  }, [jobUrl]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card
        style={{
          padding: 18,
          background:
            "linear-gradient(180deg, rgba(109,94,252,0.12), rgba(46,196,182,0.06))"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              <Badge>Copilot demo</Badge>
              <Badge>Sidebar UX</Badge>
              <Badge>Preview-first</Badge>
            </div>
            <h1 style={{ margin: 0, fontSize: 34, letterSpacing: -0.6 }}>
              Your AI copilot for job applications
            </h1>
            <p style={{ marginTop: 10, color: "var(--muted)", lineHeight: 1.6 }}>
              This page simulates a browser-extension sidebar: you keep the job page open while the copilot drafts answers,
              previews autofill values, and helps you tailor your application.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
              <Button onClick={() => actions.notify("Extension install is out of scope for Phase 2; this is the UI demo.")}>
                Install extension (demo)
              </Button>
              <Button variant="secondary" onClick={() => actions.notify("Tip: fill out Profile for best results.")}>
                How it works
              </Button>
            </div>
          </div>
          <Card style={{ boxShadow: "none", background: "rgba(0,0,0,0.03)", minWidth: 280 }}>
            <h2 style={{ margin: 0, fontSize: 14 }}>Quick setup</h2>
            <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.5 }}>
              Add a job URL (optional), paste the JD, then run agents in the sidebar.
            </p>
            <Divider />
            <div style={{ display: "grid", gap: 8, color: "var(--muted)", fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Job context</span>
                <span style={{ color: "var(--text)" }}>{jobLooksValid ? "Ready" : "Incomplete"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Profile</span>
                <span style={{ color: "var(--text)" }}>{state.profile.email.trim() ? "Saved locally" : "Needs email"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Tasks run</span>
                <span style={{ color: "var(--text)" }}>{state.tasks.length}</span>
              </div>
            </div>
          </Card>
        </div>
      </Card>

      <div
        className="copilotGrid"
      >
        <div style={{ display: "grid", gap: 16 }}>
          <Card style={{ boxShadow: "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 16 }}>Job page (preview)</h2>
                <p style={{ margin: "6px 0 0", color: "var(--muted)", lineHeight: 1.5 }}>
                  In a real extension, this is the website you’re applying on.
                </p>
              </div>
              <Badge>{host}</Badge>
            </div>
            <Divider />
            <div style={{ display: "grid", gap: 10 }}>
              <Field label="Job posting URL (optional)">
                <Input value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} placeholder="https://…" />
              </Field>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button
                  variant="ghost"
                  disabled={!jobUrl.trim()}
                  onClick={() => actions.scrapeJobFromUrl(jobUrl.trim())}
                  title="Mock tool: demonstrates 'scrape job URL' pattern"
                >
                  Scrape from URL (mock)
                </Button>
                <Button
                  variant="secondary"
                  disabled={!jobLooksValid && description.trim().length < 10}
                  onClick={() => actions.setJob({ title: jobTitle, company, description, url: jobUrl.trim() || undefined })}
                >
                  Save job context
                </Button>
              </div>
              <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
                <Field label="Job title">
                  <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                </Field>
                <Field label="Company">
                  <Input value={company} onChange={(e) => setCompany(e.target.value)} />
                </Field>
              </div>
              <Field label="Job description">
                <Textarea rows={10} value={description} onChange={(e) => setDescription(e.target.value)} />
              </Field>
            </div>
          </Card>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <Card style={{ boxShadow: "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 16 }}>Copilot sidebar</h2>
                <p style={{ margin: "6px 0 0", color: "var(--muted)", lineHeight: 1.5 }}>
                  Switch between actions. Everything is previewable and user-approved.
                </p>
              </div>
              <Badge>Agent actions</Badge>
            </div>
            <Divider />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <TabButton active={tab === "Autofill"} onClick={() => setTab("Autofill")}>
                Autofill
              </TabButton>
              <TabButton active={tab === "Answers"} onClick={() => setTab("Answers")}>
                Answers
              </TabButton>
              <TabButton active={tab === "Score"} onClick={() => setTab("Score")}>
                Resume score
              </TabButton>
              <TabButton active={tab === "Tracker"} onClick={() => setTab("Tracker")}>
                Tracker
              </TabButton>
            </div>
          </Card>

          {tab === "Autofill" ? (
            <AutofillAgentPanel
              profile={state.profile}
              site={host}
              onApprove={(fields) => actions.runAutofill({ site: host, fields })}
            />
          ) : null}

          {tab === "Answers" ? <GeneratedAnswer /> : null}

          {tab === "Score" ? (
            <Card style={{ boxShadow: "none" }}>
              <h3 style={{ margin: 0, fontSize: 14 }}>Resume-to-JD score (quick)</h3>
              <p style={{ margin: "6px 0 0", color: "var(--muted)", lineHeight: 1.5 }}>
                Paste a resume snippet and run the scoring agent. See full view in Resume Score page.
              </p>
              <Divider />
              <Field label="Resume text">
                <Textarea rows={7} value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
              </Field>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                <Button disabled={!jobLooksValid} onClick={() => actions.runResumeScore(resumeText)}>
                  Score vs JD
                </Button>
                <Button variant="secondary" onClick={() => setResumeText((t) => t + "\n- Added another impact bullet.")}>
                  Add bullet (demo)
                </Button>
              </div>
              <p style={{ margin: "10px 0 0", color: "var(--faint)", lineHeight: 1.5, fontSize: 12 }}>
                UX pattern: the agent runs in the sidebar and produces a reviewable output; users decide what to apply.
              </p>
            </Card>
          ) : null}

          {tab === "Tracker" ? (
            <Card style={{ boxShadow: "none" }}>
              <h3 style={{ margin: 0, fontSize: 14 }}>Application tracker</h3>
              <p style={{ margin: "6px 0 0", color: "var(--muted)", lineHeight: 1.5 }}>
                Track your pipeline in Dashboard. This tab is a shortcut.
              </p>
              <Divider />
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button
                  onClick={() =>
                    actions.addApplication({
                      company: company.trim() || "ExampleCo",
                      role: jobTitle.trim() || "Frontend Engineer",
                      url: jobUrl.trim() || undefined,
                      status: "Not Submitted",
                      notes: "Added from copilot"
                    })
                  }
                >
                  Add to tracker
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => actions.notify("Open Dashboard from the top nav to edit statuses.")}
                >
                  Open dashboard
                </Button>
              </div>
            </Card>
          ) : null}
        </div>
      </div>

    </div>
  );
}
