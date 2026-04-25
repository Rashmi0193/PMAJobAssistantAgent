"use client";

import { useMemo, useState } from "react";
import { useAppState } from "@/context/AppStateContext";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Badge } from "@/components/ui/Badge";

export function ProfileForm() {
  const { state, actions } = useAppState();
  const [skillDraft, setSkillDraft] = useState("");

  const canSave = useMemo(() => {
    return state.profile.email.trim().length > 3 && state.profile.targetRole.trim().length > 1;
  }, [state.profile.email, state.profile.targetRole]);

  function addSkill() {
    const skill = skillDraft.trim();
    if (!skill) return;
    if (state.profile.skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      setSkillDraft("");
      return;
    }
    actions.patchProfile({ skills: [skill, ...state.profile.skills] });
    setSkillDraft("");
  }

  function removeSkill(skill: string) {
    actions.patchProfile({ skills: state.profile.skills.filter((s) => s !== skill) });
  }

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, letterSpacing: -0.2 }}>Profile</h1>
          <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.5 }}>
          Manage the profile details used to personalize job matches, resume scoring, and tailored application answers.    
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Badge tone={canSave ? "ok" : "warn"}>{canSave ? "Ready to save" : "Missing required fields"}</Badge>
          <Button disabled={!canSave} onClick={() => actions.saveProfile()}>
            Save
          </Button>
        </div>
      </div>

      <Divider />

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr", alignItems: "start" }}>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr", alignItems: "start" }}>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
            <Field label="Name">
              <Input
                value={state.profile.name}
                onChange={(e) => actions.patchProfile({ name: e.target.value })}
                placeholder="Your name"
              />
            </Field>
            <Field label="Email (required)">
              <Input
                value={state.profile.email}
                onChange={(e) => actions.patchProfile({ email: e.target.value })}
                placeholder="you@email.com"
              />
            </Field>
          </div>

          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 180px 180px" }}>
            <Field label="Target role (required)">
              <Input
                value={state.profile.targetRole}
                onChange={(e) => actions.patchProfile({ targetRole: e.target.value })}
                placeholder="Frontend Engineer"
              />
            </Field>
            <Field label="Years experience">
              <Input
                inputMode="numeric"
                value={String(state.profile.yearsExperience)}
                onChange={(e) =>
                  actions.patchProfile({ yearsExperience: Number(e.target.value || 0) })
                }
              />
            </Field>
            <Field label="Seniority">
              <select
                value={state.profile.seniority}
                onChange={(e) => actions.patchProfile({ seniority: e.target.value as any })}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: "var(--surface-2)",
                  border: "1px solid var(--border-1)"
                }}
              >
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
              </select>
            </Field>
          </div>

          <Field label="Preferred tone (used for generated answers)">
            <select
              value={state.profile.tone}
              onChange={(e) => actions.patchProfile({ tone: e.target.value as any })}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 12,
                background: "var(--surface-2)",
                border: "1px solid var(--border-1)"
              }}
            >
              <option value="Warm">Warm</option>
              <option value="Direct">Direct</option>
              <option value="Confident">Confident</option>
            </select>
          </Field>
        </div>

        <Divider />

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
          <Field label="LinkedIn">
            <Input
              value={state.profile.links.linkedin ?? ""}
              onChange={(e) =>
                actions.patchProfile({ links: { ...state.profile.links, linkedin: e.target.value } })
              }
              placeholder="https://linkedin.com/in/…"
            />
          </Field>
          <Field label="GitHub">
            <Input
              value={state.profile.links.github ?? ""}
              onChange={(e) =>
                actions.patchProfile({ links: { ...state.profile.links, github: e.target.value } })
              }
              placeholder="https://github.com/…"
            />
          </Field>
          <Field label="Portfolio">
            <Input
              value={state.profile.links.portfolio ?? ""}
              onChange={(e) =>
                actions.patchProfile({
                  links: { ...state.profile.links, portfolio: e.target.value }
                })
              }
              placeholder="https://…"
            />
          </Field>
        </div>

        <Divider />

        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 16 }}>Skills</h2>
              <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>
                These influence scoring and tailored answers.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Input
                value={skillDraft}
                onChange={(e) => setSkillDraft(e.target.value)}
                placeholder="Add a skill (e.g., Accessibility)"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button variant="secondary" onClick={addSkill}>
                Add
              </Button>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {state.profile.skills.map((skill) => (
              <button
                key={skill}
                onClick={() => removeSkill(skill)}
                title="Remove skill"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border-1)",
                  color: "var(--text)",
                  borderRadius: 999,
                  padding: "6px 10px",
                  cursor: "pointer"
                }}
              >
                {skill} <span style={{ opacity: 0.7, marginLeft: 6 }}>×</span>
              </button>
            ))}
          </div>
        </div>

        <Divider />

        <div style={{ display: "grid", gap: 10 }}>
          <h2 style={{ margin: 0, fontSize: 16 }}>Work history</h2>
          {state.profile.workHistory.map((item, idx) => (
            <Card key={idx} style={{ background: "var(--surface-2)", boxShadow: "none" }}>
              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr 1fr" }}>
                <Field label="Company">
                  <Input
                    value={item.company}
                    onChange={(e) => {
                      const next = [...state.profile.workHistory];
                      next[idx] = { ...next[idx], company: e.target.value };
                      actions.patchProfile({ workHistory: next });
                    }}
                  />
                </Field>
                <Field label="Title">
                  <Input
                    value={item.title}
                    onChange={(e) => {
                      const next = [...state.profile.workHistory];
                      next[idx] = { ...next[idx], title: e.target.value };
                      actions.patchProfile({ workHistory: next });
                    }}
                  />
                </Field>
                <Field label="Dates">
                  <Input
                    value={item.dates}
                    onChange={(e) => {
                      const next = [...state.profile.workHistory];
                      next[idx] = { ...next[idx], dates: e.target.value };
                      actions.patchProfile({ workHistory: next });
                    }}
                  />
                </Field>
              </div>
              <div style={{ height: 10 }} />
              <Field label="Highlights">
                <Textarea
                  rows={3}
                  value={item.highlights}
                  onChange={(e) => {
                    const next = [...state.profile.workHistory];
                    next[idx] = { ...next[idx], highlights: e.target.value };
                    actions.patchProfile({ workHistory: next });
                  }}
                />
              </Field>
            </Card>
          ))}
          <div>
            <Button
              variant="ghost"
              onClick={() =>
                actions.patchProfile({
                  workHistory: [
                    ...state.profile.workHistory,
                    { company: "", title: "", dates: "", highlights: "" }
                  ]
                })
              }
            >
              + Add another role
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
