"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAppState } from "@/context/AppStateContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Divider } from "@/components/ui/Divider";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Step = 1 | 2 | 3;

const INTEREST_PRESETS = [
  "Startups",
  "Big Tech",
  "AI/ML",
  "FinTech",
  "Healthcare",
  "EdTech",
  "Consumer apps",
  "B2B SaaS"
];

export function ProfileSetupWizard() {
  const router = useRouter();
  const { state: auth } = useAuth();
  const { state, actions } = useAppState();

  const [step, setStep] = useState<Step>(1);

  const [targetRole, setTargetRole] = useState(state.profile.targetRole);
  const [workMode, setWorkMode] = useState(state.profile.workMode);
  const [desiredJobTypes, setDesiredJobTypes] = useState(state.profile.desiredJobTypes);
  const [locationPreference, setLocationPreference] = useState(state.profile.locationPreference);
  const [preferredLocations, setPreferredLocations] = useState(state.profile.preferredLocations.join(", "));
  const [salaryMinUsd, setSalaryMinUsd] = useState(state.profile.salaryMinUsd ? String(state.profile.salaryMinUsd) : "");
  const [salaryMaxUsd, setSalaryMaxUsd] = useState(state.profile.salaryMaxUsd ? String(state.profile.salaryMaxUsd) : "");
  const [interests, setInterests] = useState<string[]>(state.profile.interests);
  const [skills, setSkills] = useState(state.profile.skills.join(", "));
  const [summary, setSummary] = useState(
    "I build clean, accessible UI and ship features end-to-end with React/TypeScript."
  );

  const canContinueStep1 = useMemo(() => targetRole.trim().length > 1, [targetRole]);
  const salaryMin = Number(salaryMinUsd || 0) || undefined;
  const salaryMax = Number(salaryMaxUsd || 0) || undefined;

  function toggleInterest(tag: string) {
    setInterests((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [tag, ...prev]));
  }

  function toggleJobType(type: "Full-time" | "Internship" | "Contract") {
    setDesiredJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  function saveToProfile() {
    actions.patchProfile({
      name: auth.user?.name ?? state.profile.name,
      email: auth.user?.email ?? state.profile.email,
      targetRole: targetRole.trim(),
      workMode,
      desiredJobTypes,
      locationPreference,
      preferredLocations: preferredLocations
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      salaryMinUsd: salaryMin,
      salaryMaxUsd: salaryMax,
      interests,
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 25)
    });
    actions.notify("Profile setup saved locally.");
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col gap-1">
          <h1 className="m-0 text-[22px] tracking-[-0.2px]">Profile setup</h1>
          <p className="m-0 text-[14px] leading-6 text-[color:var(--muted)]">
            Answer a few questions so the copilot can tailor scoring, answers, and job suggestions.
          </p>
        </div>
        <Badge>Step {step} / 3</Badge>
      </div>

      <Divider />

      {step === 1 ? (
        <div className="grid gap-12">
          <div className="grid gap-12">
            <Field label="Target role">
              <Input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="Frontend Engineer" />
            </Field>

            <div className="grid gap-12 md:grid-cols-3">
              <Field label="Work mode">
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value as any)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: "var(--surface-2)",
                    border: "1px solid var(--border-1)"
                  }}
                >
                  <option value="Open">Open to all</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </Field>

              <Field label="Job type">
                <div className="flex gap-2 flex-wrap">
                  {(["Full-time", "Internship", "Contract"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleJobType(t)}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 999,
                        border: `1px solid ${desiredJobTypes.includes(t) ? "rgba(109,94,252,0.45)" : "var(--border-1)"}`,
                        background: desiredJobTypes.includes(t) ? "rgba(109,94,252,0.10)" : "transparent",
                        cursor: "pointer"
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Location scope">
                <select
                  value={locationPreference}
                  onChange={(e) => setLocationPreference(e.target.value as any)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: "var(--surface-2)",
                    border: "1px solid var(--border-1)"
                  }}
                >
                  <option value="US">All over the US</option>
                  <option value="Worldwide">All over the world</option>
                  <option value="Specific">Specific locations</option>
                </select>
              </Field>
            </div>

            <Field
              label="Preferred locations (comma separated)"
              hint='Examples: "SF Bay Area, New York, Remote (US)"'
            >
              <Input
                value={preferredLocations}
                onChange={(e) => setPreferredLocations(e.target.value)}
                placeholder="SF Bay Area, Remote (US)"
              />
            </Field>

            <div className="grid gap-12 md:grid-cols-2">
              <Field label="Expected salary min (USD)">
                <Input inputMode="numeric" value={salaryMinUsd} onChange={(e) => setSalaryMinUsd(e.target.value)} placeholder="120000" />
              </Field>
              <Field label="Expected salary max (USD)">
                <Input inputMode="numeric" value={salaryMaxUsd} onChange={(e) => setSalaryMaxUsd(e.target.value)} placeholder="180000" />
              </Field>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap justify-end">
            <Button
              disabled={!canContinueStep1}
              onClick={() => {
                saveToProfile();
                setStep(2);
              }}
              style={{ padding: "12px 14px" }}
            >
              Continue
            </Button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-12">
          <Section
            title="Interests"
            subtitle="These influence job suggestions and tone."
          >
            <div className="flex gap-2 flex-wrap">
              {INTEREST_PRESETS.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleInterest(t)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 999,
                    border: `1px solid ${interests.includes(t) ? "rgba(109,94,252,0.45)" : "var(--border-1)"}`,
                    background: interests.includes(t) ? "rgba(109,94,252,0.10)" : "transparent",
                    cursor: "pointer"
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </Section>

          <Field label="Top skills (comma separated)" hint="Used for resume scoring and tailored answers.">
            <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, TypeScript, Next.js, Accessibility" />
          </Field>

          <div className="flex gap-2 flex-wrap justify-between">
            <Button variant="ghost" onClick={() => setStep(1)} style={{ padding: "12px 14px" }}>
              Back
            </Button>
            <Button
              onClick={() => {
                saveToProfile();
                setStep(3);
              }}
              style={{ padding: "12px 14px" }}
            >
              Continue
            </Button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="grid gap-12">
          <Section title="About you" subtitle="Optional, but helpful for tailored answers.">
            <Field label="Short summary">
              <Textarea rows={5} value={summary} onChange={(e) => setSummary(e.target.value)} />
            </Field>
          </Section>

          <Card style={{ boxShadow: "none", background: "var(--surface-2)" }}>
            <h3 className="m-0 text-[14px]">Preview</h3>
            <p className="mt-2 mb-0 text-[13px] leading-6 text-[color:var(--muted)]">
              Role: <span className="text-[color:var(--text)] font-semibold">{targetRole}</span> • Mode:{" "}
              <span className="text-[color:var(--text)] font-semibold">{workMode}</span> • Scope:{" "}
              <span className="text-[color:var(--text)] font-semibold">{locationPreference}</span>
            </p>
            <p className="mt-2 mb-0 text-[13px] leading-6 text-[color:var(--muted)]">
              Locations:{" "}
              <span className="text-[color:var(--text)] font-semibold">
                {preferredLocations || "—"}
              </span>
            </p>
            <p className="mt-2 mb-0 text-[13px] leading-6 text-[color:var(--muted)]">
              Salary:{" "}
              <span className="text-[color:var(--text)] font-semibold">
                {salaryMinUsd || "—"} - {salaryMaxUsd || "—"}
              </span>
            </p>
          </Card>

          <div className="flex gap-2 flex-wrap justify-between">
            <Button variant="ghost" onClick={() => setStep(2)} style={{ padding: "12px 14px" }}>
              Back
            </Button>
            <Button
              onClick={() => {
                saveToProfile();
                router.push("/copilot");
              }}
              style={{ padding: "12px 14px" }}
            >
              Finish & go to Copilot
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

function Section({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex flex-col gap-1">
        <div className="text-[14px] font-semibold">{title}</div>
        <div className="text-[13px] text-[color:var(--muted)]">{subtitle}</div>
      </div>
      {children}
    </div>
  );
}

