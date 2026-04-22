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

type Step = 1 | 2 | 3 | 4;

const STEP_PERCENT: Record<Step, number> = { 1: 60, 2: 70, 3: 80, 4: 90 };

const INDUSTRY_PRESETS = [
  "Aerospace",
  "AI & Machine Learning",
  "Automotive & Transportation",
  "Biotechnology",
  "Consulting",
  "Consumer Goods",
  "Consumer Software",
  "Crypto & Web3",
  "Cybersecurity",
  "Data & Analytics",
  "Defense",
  "Design",
  "Education",
  "Energy",
  "Enterprise Software",
  "Entertainment",
  "Financial Services",
  "Fintech",
  "Food & Agriculture",
  "Gaming",
  "Government & Public Sector",
  "Hardware",
  "Healthcare",
  "Industrial & Manufacturing",
  "Legal",
  "Quantitative Finance",
  "Real Estate",
  "Robotics & Automation",
  "Social Impact",
  "Venture Capital",
  "VR & AR"
];

const SKILL_PRESETS = [
  "React",
  "TypeScript",
  "Next.js",
  "JavaScript",
  "HTML/CSS",
  "Accessibility",
  "Testing",
  "Jest",
  "Cypress",
  "Playwright",
  "Node.js",
  "REST APIs",
  "GraphQL",
  "Git",
  "Design Systems",
  "Figma",
  "Performance",
  "Web Security",
  "Python",
  "SQL"
];

function chipStyle(active: boolean) {
  return {
    padding: "8px 10px",
    borderRadius: 999,
    border: `1px solid ${active ? "rgba(109,94,252,0.45)" : "var(--border-1)"}`,
    background: active ? "rgba(109,94,252,0.10)" : "transparent",
    cursor: "pointer"
  } as const;
}

function formatUsdCompact(value: number) {
  if (value >= 1000) return `$${Math.round(value / 1000)}k`;
  return `$${value}`;
}

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
  const [salaryMinUsd, setSalaryMinUsd] = useState<number>(state.profile.salaryMinUsd ?? 0);
  const [salaryMaxUsd, setSalaryMaxUsd] = useState<number | undefined>(state.profile.salaryMaxUsd);
  const [industries, setIndustries] = useState<string[]>(state.profile.interests);
  const [industriesAvoid, setIndustriesAvoid] = useState<string[]>(state.profile.interestsAvoid);

  const [skillSearch, setSkillSearch] = useState("");
  const [skillsSelected, setSkillsSelected] = useState<string[]>(state.profile.skills);
  const [skillsPreferred, setSkillsPreferred] = useState<string[]>(state.profile.skillsPreferred);
  const [skillsAvoid, setSkillsAvoid] = useState<string[]>(state.profile.skillsAvoid);
  const [skillsAvoidSearch, setSkillsAvoidSearch] = useState("");

  const [summary, setSummary] = useState(
    "I build clean, accessible UI and ship features end-to-end with React/TypeScript."
  );

  const canContinueStep1 = useMemo(() => targetRole.trim().length > 1, [targetRole]);

  const filteredSkills = useMemo(() => {
    const q = skillSearch.trim().toLowerCase();
    const base = [...new Set([...SKILL_PRESETS, ...skillsSelected])];
    if (!q) return base;
    return base.filter((s) => s.toLowerCase().includes(q));
  }, [skillSearch, skillsSelected]);

  const filteredAvoidSkills = useMemo(() => {
    const q = skillsAvoidSearch.trim().toLowerCase();
    const base = [...new Set([...SKILL_PRESETS, ...skillsAvoid])];
    if (!q) return base;
    return base.filter((s) => s.toLowerCase().includes(q));
  }, [skillsAvoid, skillsAvoidSearch]);

  function toggleIndustryInclude(tag: string) {
    setIndustries((prev) => {
      const next = prev.includes(tag) ? prev.filter((t) => t !== tag) : [tag, ...prev];
      return next;
    });
    setIndustriesAvoid((prev) => prev.filter((t) => t !== tag));
  }

  function toggleIndustryAvoid(tag: string) {
    setIndustriesAvoid((prev) => {
      const next = prev.includes(tag) ? prev.filter((t) => t !== tag) : [tag, ...prev];
      return next;
    });
    setIndustries((prev) => prev.filter((t) => t !== tag));
  }

  function toggleSkillSelected(skill: string) {
    setSkillsSelected((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
    setSkillsAvoid((prev) => prev.filter((s) => s !== skill));
  }

  function toggleSkillAvoid(skill: string) {
    setSkillsAvoid((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
    setSkillsSelected((prev) => prev.filter((s) => s !== skill));
    setSkillsPreferred((prev) => prev.filter((s) => s !== skill));
  }

  function toggleSkillPreferred(skill: string) {
    if (!skillsSelected.includes(skill)) return;
    setSkillsPreferred((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [skill, ...prev]
    );
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
      salaryMinUsd: salaryMinUsd || undefined,
      salaryMaxUsd,
      interests: industries.slice(0, 20),
      interestsAvoid: industriesAvoid.slice(0, 20),
      skills: skillsSelected.slice(0, 25),
      skillsPreferred: skillsPreferred.filter((s) => skillsSelected.includes(s)).slice(0, 10),
      skillsAvoid: skillsAvoid.slice(0, 25)
    });
    actions.notify("Profile setup saved locally.");
  }

  return (
    <Card>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={() => {
            if (step === 1) {
              router.push("/");
              return;
            }
            setStep(step === 2 ? 1 : step === 3 ? 2 : 3);
          }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            color: "var(--muted)",
            display: "flex",
            alignItems: "center",
            gap: 8
          }}
        >
          <span aria-hidden>←</span> Back
        </button>
        <div className="flex items-center gap-10 min-w-[260px] flex-1 justify-end">
          <div
            aria-hidden
            style={{
              height: 8,
              flex: 1,
              maxWidth: 360,
              background: "var(--border-2)",
              borderRadius: 999,
              overflow: "hidden"
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${STEP_PERCENT[step]}%`,
                background: "linear-gradient(90deg, var(--brand), var(--brand-2))"
              }}
            />
          </div>
          <div style={{ color: "var(--muted)", fontWeight: 650 }}>{STEP_PERCENT[step]}%</div>
        </div>
      </div>

      <div className="h-10" />

      <div className="flex flex-col gap-2 text-center">
        <h1 className="m-0 text-[28px] tracking-[-0.5px]">Set your preferences</h1>
        <p className="m-0 text-[14px] leading-6 text-[color:var(--muted)]">
          This helps the copilot recommend jobs and tailor your application materials.
        </p>
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
          <div className="text-center">
            <h2 className="m-0 text-[22px] tracking-[-0.4px]">What industries are exciting to you?</h2>
          </div>

          <div className="grid gap-12">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-[14px] text-[color:var(--muted)]">
                <span aria-hidden>✅</span>
                <span>First, what industries are exciting to you?</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {INDUSTRY_PRESETS.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleIndustryInclude(t)}
                    style={chipStyle(industries.includes(t))}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <Card style={{ boxShadow: "none", background: "var(--surface-2)" }}>
              <div className="flex items-center gap-2 text-[14px] text-[color:var(--muted)]">
                <span aria-hidden>⛔</span>
                <span>Second, are there any industries you don’t want to work in?</span>
              </div>
              <div className="h-10" />
              <div className="flex gap-2 flex-wrap">
                {INDUSTRY_PRESETS.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleIndustryAvoid(t)}
                    style={chipStyle(industriesAvoid.includes(t))}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Card>
          </div>

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
          <div className="text-center">
            <h2 className="m-0 text-[22px] tracking-[-0.4px]">What skills do you have or enjoy working with?</h2>
            <p className="mt-2 mb-0 text-[14px] text-[color:var(--muted)]">Select all that apply</p>
          </div>

          <Card style={{ boxShadow: "none", background: "var(--surface-2)" }}>
            <div className="flex items-center gap-2 text-[13px] text-[color:var(--muted)]">
              <span aria-hidden>💙</span>
              <span>Heart a skill to prefer roles that utilize that skill.</span>
            </div>
          </Card>

          <Field label="Search skills">
            <Input
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              placeholder="Search all skills…"
            />
          </Field>

          <div className="flex gap-2 flex-wrap">
            {filteredSkills.slice(0, 36).map((s) => (
              <button
                key={s}
                onClick={() => toggleSkillSelected(s)}
                style={chipStyle(skillsSelected.includes(s))}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="grid gap-2">
            <div className="text-[13px] text-[color:var(--muted)] font-semibold">Selected skills</div>
            <div className="flex gap-2 flex-wrap">
              {skillsSelected.length ? (
                skillsSelected.slice(0, 30).map((s) => (
                  <div
                    key={s}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 10px",
                      borderRadius: 999,
                      border: "1px solid var(--border-1)",
                      background: "var(--surface-2)"
                    }}
                  >
                    <button
                      onClick={() => toggleSkillPreferred(s)}
                      title="Prefer roles with this skill"
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        color: skillsPreferred.includes(s) ? "var(--brand)" : "var(--muted)"
                      }}
                    >
                      {skillsPreferred.includes(s) ? "♥" : "♡"}
                    </button>
                    <span>{s}</span>
                    <button
                      onClick={() => toggleSkillSelected(s)}
                      title="Remove"
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        color: "var(--muted)"
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-[13px] text-[color:var(--faint)]">No skills selected yet.</div>
              )}
            </div>
          </div>

          <Card style={{ boxShadow: "none", background: "var(--surface-2)" }}>
            <div className="flex items-center gap-2 text-[14px] text-[color:var(--muted)]">
              <span aria-hidden>⛔</span>
              <span>Are there any skills you don’t want to work with?</span>
            </div>
            <div className="h-10" />
            <Field label="Skills to filter out">
              <Input
                value={skillsAvoidSearch}
                onChange={(e) => setSkillsAvoidSearch(e.target.value)}
                placeholder="Search skills to filter out…"
              />
            </Field>
            <div className="flex gap-2 flex-wrap">
              {filteredAvoidSkills.slice(0, 28).map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSkillAvoid(s)}
                  style={chipStyle(skillsAvoid.includes(s))}
                >
                  {s}
                </button>
              ))}
            </div>
          </Card>

          <div className="flex gap-2 flex-wrap justify-between">
            <Button variant="ghost" onClick={() => setStep(2)} style={{ padding: "12px 14px" }}>
              Back
            </Button>
            <Button
              onClick={() => {
                saveToProfile();
                setStep(4);
              }}
              style={{ padding: "12px 14px" }}
            >
              Continue
            </Button>
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="grid gap-12">
          <div className="text-center">
            <h2 className="m-0 text-[22px] tracking-[-0.4px]">What is your minimum expected salary?</h2>
            <p className="mt-2 mb-0 text-[14px] text-[color:var(--muted)]">
              We only use this to match you with jobs and will not share this data.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <div
              style={{
                width: 190,
                height: 190,
                borderRadius: "50%",
                border: "1px solid var(--border-1)",
                background: "var(--surface-2)",
                display: "grid",
                placeItems: "center"
              }}
            >
              <div className="text-center">
                <div className="text-[13px] text-[color:var(--muted)]">At least</div>
                <div className="text-[34px] font-extrabold tracking-[-0.6px]">
                  {formatUsdCompact(salaryMinUsd)}
                </div>
                <div
                  style={{
                    margin: "6px auto 0",
                    width: 46,
                    padding: "4px 8px",
                    borderRadius: 999,
                    border: "1px solid var(--border-1)",
                    background: "var(--surface-2)",
                    fontSize: 12,
                    color: "var(--muted)"
                  }}
                >
                  USD
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: "0 10px" }}>
            <input
              type="range"
              min={0}
              max={300000}
              step={5000}
              value={salaryMinUsd}
              onChange={(e) => setSalaryMinUsd(Number(e.target.value))}
              style={{ width: "100%" }}
            />
            <div className="flex justify-between text-[12px] text-[color:var(--faint)]">
              <span>$0</span>
              <span>$300k+</span>
            </div>
          </div>

          <div className="grid gap-12 md:grid-cols-2">
            <Field label="Optional salary max (USD)">
              <Input
                inputMode="numeric"
                value={salaryMaxUsd ? String(salaryMaxUsd) : ""}
                onChange={(e) => setSalaryMaxUsd(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="180000"
              />
            </Field>
            <Field label="Short summary (optional)" hint="Used for tailored answers.">
              <Textarea rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} />
            </Field>
          </div>

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
                {salaryMinUsd ? `$${salaryMinUsd.toLocaleString()}` : "—"} -{" "}
                {salaryMaxUsd ? `$${salaryMaxUsd.toLocaleString()}` : "—"}
              </span>
            </p>
          </Card>

          <div className="flex gap-2 flex-wrap justify-between">
            <Button variant="ghost" onClick={() => setStep(3)} style={{ padding: "12px 14px" }}>
              Back
            </Button>
            <Button
              onClick={() => {
                saveToProfile();
                router.push("/jobs-for-you");
              }}
              style={{ padding: "12px 14px" }}
            >
              Finish & see jobs
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
