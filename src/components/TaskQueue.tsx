"use client";

import { AgentTask } from "@/context/AppStateContext";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

function statusTone(status: AgentTask["status"]) {
  if (status === "Done") return "ok";
  if (status === "NeedsReview") return "warn";
  if (status === "Failed") return "danger";
  return "neutral";
}

export function TaskQueue({ tasks }: { tasks: AgentTask[] }) {
  if (!tasks.length) {
    return (
      <Card style={{ boxShadow: "none" }}>
        <h3 style={{ margin: 0, fontSize: 14 }}>Task queue</h3>
        <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.5 }}>
          No tasks yet. Run an agent action to see progress, previews, and review states.
        </p>
      </Card>
    );
  }

  return (
    <Card style={{ boxShadow: "none" }}>
      <h3 style={{ margin: 0, fontSize: 14 }}>Task queue</h3>
      <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
        {tasks.slice(0, 5).map((t) => (
          <div
            key={t.id}
            style={{
              borderRadius: 14,
              border: "1px solid var(--border-1)",
              background: "var(--surface-2)",
              padding: 12
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div>
                <div style={{ fontWeight: 650 }}>{t.title}</div>
                <div style={{ color: "var(--faint)", fontSize: 12, marginTop: 2 }}>
                  {t.type} • Updated {new Date(t.updatedAt).toLocaleTimeString()}
                </div>
              </div>
              <Badge tone={statusTone(t.status) as any}>{t.status}</Badge>
            </div>
            <ol style={{ margin: "10px 0 0", paddingLeft: 18, color: "var(--muted)", lineHeight: 1.6 }}>
              {t.steps.map((s, idx) => (
                <li key={idx}>
                  {s.label}{" "}
                  <span style={{ color: "var(--faint)" }}>
                    ({s.status === "doing" ? "in progress" : s.status})
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </Card>
  );
}
