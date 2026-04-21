"use client";

import { useMemo, useState } from "react";
import type { Profile } from "@/context/AppStateContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Divider } from "@/components/ui/Divider";

type FieldItem = { key: string; label: string; value: string };

function buildSuggestedFields(profile: Profile): FieldItem[] {
  const firstJob = profile.workHistory[0];
  return [
    { key: "full_name", label: "Full name", value: profile.name || "—" },
    { key: "email", label: "Email", value: profile.email || "—" },
    { key: "linkedin", label: "LinkedIn", value: profile.links.linkedin || "—" },
    { key: "github", label: "GitHub", value: profile.links.github || "—" },
    { key: "portfolio", label: "Portfolio", value: profile.links.portfolio || "—" },
    { key: "target_role", label: "Target role", value: profile.targetRole || "—" },
    { key: "latest_company", label: "Most recent company", value: firstJob?.company || "—" },
    { key: "latest_title", label: "Most recent title", value: firstJob?.title || "—" }
  ];
}

export function AutofillAgentPanel({
  profile,
  site,
  onApprove
}: {
  profile: Profile;
  site: string;
  onApprove: (fields: FieldItem[]) => void;
}) {
  const suggested = useMemo(() => buildSuggestedFields(profile), [profile]);
  const [selected, setSelected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(suggested.map((f) => [f.key, f.value !== "—"]))
  );

  const selectedFields = useMemo(
    () => suggested.filter((f) => selected[f.key] && f.value !== "—"),
    [suggested, selected]
  );

  return (
    <Card style={{ boxShadow: "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 14 }}>Autofill agent (preview)</h3>
          <p style={{ margin: "6px 0 0", color: "var(--muted)", lineHeight: 1.5 }}>
            The agent proposes which fields to fill on <span style={{ color: "var(--text)" }}>{site}</span>. You control what gets applied.
          </p>
        </div>
        <Badge>Needs approval</Badge>
      </div>

      <Divider />

      <div style={{ display: "grid", gap: 10 }}>
        {suggested.map((f) => (
          <label
            key={f.key}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              padding: 10,
              borderRadius: 14,
              border: "1px solid var(--border-1)",
              background: "var(--surface-2)"
            }}
          >
            <input
              type="checkbox"
              checked={!!selected[f.key]}
              onChange={(e) => setSelected((s) => ({ ...s, [f.key]: e.target.checked }))}
              disabled={f.value === "—"}
              style={{ marginTop: 3 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 650 }}>{f.label}</div>
              <div style={{ marginTop: 4, color: "var(--muted)", lineHeight: 1.4, whiteSpace: "pre-wrap" }}>
                {f.value}
              </div>
            </div>
          </label>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
        <Button
          disabled={!selectedFields.length}
          onClick={() => onApprove(selectedFields)}
        >
          Approve & simulate fill
        </Button>
        <Button variant="ghost" onClick={() => setSelected(Object.fromEntries(suggested.map((f) => [f.key, false])))}>
          Clear
        </Button>
      </div>

      <p style={{ margin: "10px 0 0", color: "var(--faint)", lineHeight: 1.5, fontSize: 12 }}>
        In a real browser extension, a content script would map these keys to the site’s inputs and fill them after approval.
      </p>
    </Card>
  );
}
