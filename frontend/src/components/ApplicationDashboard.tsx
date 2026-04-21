"use client";

import { useMemo, useState } from "react";
import { ApplicationStatus, Application } from "@/context/AppStateContext";
import { useAppState } from "@/context/AppStateContext";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Divider } from "@/components/ui/Divider";

const STATUSES: ApplicationStatus[] = [
  "Not Submitted",
  "Submitted",
  "Initial Response",
  "Interview Requested",
  "Onsite/Video Interview Requested",
  "Offer",
  "Accepted",
  "Rejected",
  "Rejected After Interview",
  "Withdrawn"
];

function statusTone(status: ApplicationStatus) {
  if (status === "Offer" || status === "Accepted") return "ok";
  if (status.includes("Rejected")) return "danger";
  if (status.includes("Interview") || status === "Initial Response") return "warn";
  return "neutral";
}

function groupByStatus(applications: Application[]) {
  const map = new Map<ApplicationStatus, Application[]>();
  for (const s of STATUSES) map.set(s, []);
  for (const a of applications) map.get(a.status)?.push(a);
  return map;
}

export function ApplicationDashboard() {
  const { state, actions } = useAppState();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");

  const canAdd = useMemo(() => company.trim().length > 1 && role.trim().length > 1, [company, role]);
  const grouped = useMemo(() => groupByStatus(state.applications), [state.applications]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, letterSpacing: -0.2 }}>Application dashboard</h1>
            <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.5 }}>
              Track where each application is in the pipeline and keep lightweight notes.
            </p>
          </div>
          <Badge>Tracked: {state.applications.length}</Badge>
        </div>

        <Divider />

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr", alignItems: "start" }}>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
            <Field label="Company (required)">
              <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme" />
            </Field>
            <Field label="Role (required)">
              <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Frontend Engineer" />
            </Field>
          </div>
          <Field label="Job URL (optional)">
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
          </Field>
          <Field label="Notes (optional)">
            <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Recruiter name, timeline, next steps…" />
          </Field>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button
              disabled={!canAdd}
              onClick={() => {
                actions.addApplication({
                  company: company.trim(),
                  role: role.trim(),
                  url: url.trim() || undefined,
                  notes: notes.trim() || undefined,
                  status: "Not Submitted"
                });
                setCompany("");
                setRole("");
                setUrl("");
                setNotes("");
              }}
            >
              Add application
            </Button>
            <Button variant="ghost" onClick={() => actions.notify("Tip: use Assistant to generate tailored answers for each application.")}>
              Tip
            </Button>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gap: 16 }}>
        {STATUSES.map((status) => {
          const items = grouped.get(status) ?? [];
          if (!items.length) return null;
          return (
            <Card key={status} style={{ boxShadow: "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <h2 style={{ margin: 0, fontSize: 16 }}>{status}</h2>
                <Badge tone={statusTone(status) as any}>{items.length}</Badge>
              </div>
              <Divider />
              <div style={{ display: "grid", gap: 10 }}>
                {items.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      padding: 12,
                      borderRadius: 14,
                      border: "1px solid var(--border-1)",
                      background: "var(--surface-2)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>
                          {a.role} @ {a.company}
                        </div>
                        <div style={{ color: "var(--faint)", fontSize: 12, marginTop: 3 }}>
                          Updated {new Date(a.updatedAt).toLocaleString()}
                          {a.url ? ` • ${a.url}` : ""}
                        </div>
                      </div>
                      <select
                        value={a.status}
                        onChange={(e) =>
                          actions.updateApplication(a.id, {
                            status: e.target.value as ApplicationStatus
                          })
                        }
                        style={{
                          padding: "8px 10px",
                          borderRadius: 12,
                          background: "var(--surface-2)",
                          border: "1px solid var(--border-1)"
                        }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    {a.notes ? (
                      <div style={{ marginTop: 10, color: "var(--muted)", lineHeight: 1.6 }}>
                        {a.notes}
                      </div>
                    ) : null}
                    <div style={{ marginTop: 10 }}>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          actions.updateApplication(a.id, {
                            notes: a.notes ? `${a.notes}\n• Follow-up: ` : "• Follow-up: "
                          })
                        }
                      >
                        Add follow-up note
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}

        {!state.applications.length ? (
          <Card style={{ boxShadow: "none" }}>
            <h2 style={{ margin: 0, fontSize: 16 }}>No applications yet</h2>
            <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.6 }}>
              Add one above to start tracking statuses like Submitted, Interview Requested, Offer, etc.
            </p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
