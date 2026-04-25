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

export function AssistantShell() {
  const { state, actions } = useAppState();
  const [tab, setTab] = useState<Tab>("Autofill");

  const [jobUrl, setJobUrl] = useState(state.job.url ?? "");
  const [jobTitle, setJobTitle] = useState(state.job.title);
  const [company, setCompany] = useState(state.job.company);
  const [description, setDescription] = useState(state.job.description);

  const [resumeText, setResumeText] = useState(
    `Software Engineer | React • TypeScript • Node.js • APIs

- Built full-stack features across frontend and backend workflows.
- Integrated APIs and improved application reliability.
- Improved performance, accessibility, and user experience.`
  );

  const jobLooksValid = useMemo(
    () =>
      jobTitle.trim().length > 1 &&
      company.trim().length > 1 &&
      description.trim().length > 20,
    [jobTitle, company, description]
  );

  const canSaveToTracker = jobTitle.trim().length > 1 && company.trim().length > 1;

  const host = useMemo(() => {
    if (!jobUrl.trim()) return "application site";

    try {
      return new URL(jobUrl).host;
    } catch {
      return "application site";
    }
  }, [jobUrl]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 390px",
        gap: 16,
        alignItems: "start"
      }}
    >
      {/* Job application workspace */}
      <Card
        style={{
          minHeight: 720,
          boxShadow: "none",
          padding: 0,
          overflow: "hidden"
        }}
      >
        <div
          style={{
            padding: "10px 14px",
            borderBottom: "1px solid var(--border-1)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--surface-2)"
          }}
        >
          <span>🔴</span>
          <span>🟡</span>
          <span>🟢</span>

          <div
            style={{
              marginLeft: 10,
              flex: 1,
              padding: "8px 12px",
              borderRadius: 999,
              background: "var(--surface-1)",
              border: "1px solid var(--border-1)",
              color: "var(--muted)",
              fontSize: 13
            }}
          >
            {jobUrl || "Enter a job posting URL"}
          </div>
        </div>

        <div style={{ padding: 22, display: "grid", gap: 16 }}>
          <Badge>{host}</Badge>

          <div>
            <h2 style={{ margin: 0, fontSize: 28 }}>
              {jobTitle || "Job title"}
            </h2>
            <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>
              {company || "Company"}
            </p>
          </div>

          <Divider />

          <Field label="Job posting URL">
            <Input
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://..."
            />
          </Field>

          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
            <Field label="Job title">
              <Input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Software Engineer"
              />
            </Field>

            <Field label="Company">
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company name"
              />
            </Field>
          </div>

          <Field label="Job description">
            <Textarea
              rows={14}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste the job description here..."
            />
          </Field>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button
              variant="secondary"
              disabled={!jobLooksValid}
              onClick={() =>
                actions.setJob({
                  title: jobTitle.trim(),
                  company: company.trim(),
                  description: description.trim(),
                  url: jobUrl.trim() || undefined
                })
              }
            >
              Save job context
            </Button>

            <Button
              variant="ghost"
              disabled={!jobUrl.trim()}
              onClick={() => actions.scrapeJobFromUrl(jobUrl.trim())}
            >
              Import job details
            </Button>
          </div>
        </div>
      </Card>

      {/* Application assistant sidebar */}
      <aside
        style={{
          position: "sticky",
          top: 16,
          height: "calc(100vh - 32px)",
          display: "grid"
        }}
      >
        <Card
          style={{
            boxShadow: "var(--shadow)",
            height: "100%",
            overflow: "hidden",
            padding: 0,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div
            style={{
              padding: 14,
              borderBottom: "1px solid var(--border-1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 16 }}>Application Assistant</h2>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 12,
                  color: "var(--muted)"
                }}
              >
                Review, tailor, and track your application
              </p>
            </div>

            <Badge>{jobLooksValid ? "Ready" : "Needs JD"}</Badge>
          </div>

          <div style={{ padding: 12, borderBottom: "1px solid var(--border-1)" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 6
              }}
            >
              {(["Autofill", "Answers", "Score", "Tracker"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setTab(item)}
                  style={{
                    padding: "8px 6px",
                    borderRadius: 12,
                    border: `1px solid ${
                      tab === item ? "rgba(109,94,252,0.45)" : "var(--border-1)"
                    }`,
                    background:
                      tab === item ? "rgba(109,94,252,0.12)" : "transparent",
                    color: "var(--text)",
                    cursor: "pointer",
                    fontSize: 12
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: 14,
              overflowY: "auto",
              flex: 1,
              display: "grid",
              gap: 12,
              alignContent: "start"
            }}
          >
            <Card style={{ boxShadow: "none", background: "var(--surface-2)" }}>
              <h3 style={{ margin: 0, fontSize: 13 }}>Suggested next step</h3>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 13,
                  color: "var(--muted)",
                  lineHeight: 1.5
                }}
              >
                {jobLooksValid
                  ? "Prepare autofill details, generate tailored answers, or score your resume against this job."
                  : "Add the job title, company, and job description to begin."}
              </p>
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
                <h3 style={{ margin: 0, fontSize: 14 }}>Resume match</h3>
                <Divider />

                <Field label="Resume text">
                  <Textarea
                    rows={7}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                  />
                </Field>

                <Button
                  disabled={!jobLooksValid || !resumeText.trim()}
                  onClick={() => actions.runResumeScore(resumeText)}
                >
                  Score vs JD
                </Button>
              </Card>
            ) : null}

            {tab === "Tracker" ? (
              <Card style={{ boxShadow: "none" }}>
                <h3 style={{ margin: 0, fontSize: 14 }}>Application tracker</h3>
                <p style={{ color: "var(--muted)", fontSize: 13 }}>
                  Save this role to your application pipeline.
                </p>

                <Button
                  disabled={!canSaveToTracker}
                  onClick={() =>
                    actions.addApplication({
                      company: company.trim(),
                      role: jobTitle.trim(),
                      url: jobUrl.trim() || undefined,
                      status: "Not Submitted",
                      notes: "Added from Application Assistant"
                    })
                  }
                >
                  Add to tracker
                </Button>
              </Card>
            ) : null}
          </div>
        </Card>
      </aside>
    </div>
  );
}