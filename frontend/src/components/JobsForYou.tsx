"use client";

import { useMemo, useState } from "react";
import { useAppState } from "@/context/AppStateContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Divider } from "@/components/ui/Divider";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import type { JobPost } from "@/components/LatestJobs";
import Link from "next/link";

function normalize(s: string) {
  return (s || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function roleTokens(role: string) {
  return normalize(role)
    .split(" ")
    .filter((t) => t.length >= 3 && t.length <= 18)
    .slice(0, 6);
}

function overlapsSalary(
  jobMin?: number,
  jobMax?: number,
  desiredMin?: number,
  desiredMax?: number
) {
  if (!jobMin && !jobMax) return true;
  if (!desiredMin && !desiredMax) return true;
  const aMin = jobMin ?? 0;
  const aMax = jobMax ?? Number.POSITIVE_INFINITY;
  const bMin = desiredMin ?? 0;
  const bMax = desiredMax ?? Number.POSITIVE_INFINITY;
  return Math.max(aMin, bMin) <= Math.min(aMax, bMax);
}

function matchScore(
  job: JobPost,
  input: {
    role: string;
    mode: string;
    locations: string[];
    salaryMin?: number;
    salaryMax?: number;
    preferredSkills: string[];
  }
) {
  let score = 0;

  // Role/title match
  const tokens = roleTokens(input.role);
  if (tokens.length) {
    const title = normalize(job.title);
    const hits = tokens.filter((t) => title.includes(t)).length;
    score += Math.min(40, hits * 14);
  } else {
    score += 10;
  }

  // Work mode match
  if (input.mode === "Open") score += 12;
  else if (normalize(job.mode) === normalize(input.mode)) score += 18;
  else score += 4;

  // Location match
  if (!input.locations.length) score += 10;
  else {
    const loc = normalize(job.location);
    const hits = input.locations.filter((l) => loc.includes(normalize(l))).length;
    score += hits ? 18 : loc.includes("remote") ? 10 : 3;
  }

  // Salary overlap
  score += overlapsSalary(job.salaryMinUsd, job.salaryMaxUsd, input.salaryMin, input.salaryMax) ? 18 : 0;

  // Preferred skills boost (if job tags mention them)
  if (input.preferredSkills.length) {
    const tags = new Set(job.tags.map((t) => normalize(t)));
    const hits = input.preferredSkills.map(normalize).filter((s) => tags.has(s)).length;
    score += Math.min(16, hits * 6);
  }

  // Tag boost
  score += Math.min(14, job.tags.length * 2);

  return Math.min(100, score);
}

function fmtSalary(job: JobPost) {
  if (!job.salaryMinUsd && !job.salaryMaxUsd) return undefined;
  const min = job.salaryMinUsd ? `$${job.salaryMinUsd.toLocaleString()}` : "—";
  const max = job.salaryMaxUsd ? `$${job.salaryMaxUsd.toLocaleString()}` : "—";
  return `${min} - ${max}`;
}

export function JobsForYou() {
  const { state } = useAppState();
  const p = state.profile;

  const [role, setRole] = useState(p.targetRole);
  const [workMode, setWorkMode] = useState(p.workMode);
  const [locations, setLocations] = useState(p.preferredLocations.join(", "));
  const [salaryMin, setSalaryMin] = useState(p.salaryMinUsd ? String(p.salaryMinUsd) : "");
  const [salaryMax, setSalaryMax] = useState(p.salaryMaxUsd ? String(p.salaryMaxUsd) : "");

  const locationList = useMemo(
    () =>
      locations
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 8),
    [locations]
  );

  // We reuse LatestJobs' mock data by rendering the component below when "Browse all".
  // For "For you", we build a small list locally using the same mock feed via an import-time shared list is not exposed,
  // so we create a minimal curated set here by linking users to Latest Jobs for full browsing.
  //
  // Frontend-only: the backend teammate will replace this with GET /api/jobs?filters=... later.
  const curated: JobPost[] = useMemo(
    () => [
      {
        id: "fy-1",
        title: "Frontend Engineer",
        company: "Atlas Labs",
        location: "Remote (US)",
        type: "Full-time",
        mode: "Remote",
        level: "Mid",
        salaryMinUsd: 150000,
        salaryMaxUsd: 210000,
        tags: ["Next.js", "Design systems", "A11y"]
      },
      {
        id: "fy-2",
        title: "Senior Software Engineer",
        company: "Nimbus (Startup)",
        location: "SF Bay Area",
        type: "Full-time",
        mode: "Hybrid",
        level: "Senior",
        salaryMinUsd: 190000,
        salaryMaxUsd: 260000,
        tags: ["React", "TypeScript", "Performance"]
      },
      {
        id: "fy-3",
        title: "Software Engineering Intern",
        company: "Pinecone Studios",
        location: "SF Bay Area",
        type: "Internship",
        mode: "Onsite",
        level: "Junior",
        salaryMinUsd: 35000,
        salaryMaxUsd: 55000,
        tags: ["JavaScript", "React", "Mentorship"]
      },
      {
        id: "fy-4",
        title: "Backend Engineer",
        company: "Relay",
        location: "Remote (Global)",
        type: "Full-time",
        mode: "Remote",
        level: "Senior",
        salaryMinUsd: 180000,
        salaryMaxUsd: 250000,
        tags: ["APIs", "Postgres", "Observability"]
      },
      {
        id: "fy-5",
        title: "Data Scientist",
        company: "Beacon AI",
        location: "SF Bay Area",
        type: "Full-time",
        mode: "Hybrid",
        level: "Mid",
        salaryMinUsd: 165000,
        salaryMaxUsd: 230000,
        tags: ["LLMs", "Prompting", "Evaluation"]
      }
    ],
    []
  );

  const ranked = useMemo(() => {
    const desiredMin = Number(salaryMin || 0) || undefined;
    const desiredMax = Number(salaryMax || 0) || undefined;
    return curated
      .map((j) => ({
        job: j,
        score: matchScore(j, {
          role,
          mode: workMode,
          locations: locationList,
          salaryMin: desiredMin,
          salaryMax: desiredMax,
          preferredSkills: p.skillsPreferred
        })
      }))
      .sort((a, b) => b.score - a.score);
  }, [curated, locationList, p.skillsPreferred, role, salaryMax, salaryMin, workMode]);

  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex flex-col gap-1">
            <h1 className="m-0 text-[22px] tracking-[-0.2px]">Jobs for you</h1>
            <p className="m-0 text-[14px] leading-6 text-[color:var(--muted)]">
            Personalized job recommendations based on your role, location, salary, and work preferences.            </p>
          </div>
          <Badge>{ranked.length} matches</Badge>
        </div>

        <Divider />

        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Target role">
            <Input value={role} onChange={(e) => setRole(e.target.value)} />
          </Field>
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
        </div>

        <div className="h-3" />

        <Field label="Preferred locations (comma separated)">
          <Input value={locations} onChange={(e) => setLocations(e.target.value)} />
        </Field>

        <div className="h-3" />

        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Salary min (USD)">
            <Input inputMode="numeric" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} />
          </Field>
          <Field label="Salary max (USD)">
            <Input inputMode="numeric" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} />
          </Field>
        </div>

        <div className="h-3" />

        <div className="flex gap-2 flex-wrap">
          <Badge>Updates live</Badge>
          <Button
            variant="ghost"
            onClick={() => {
              setRole(p.targetRole);
              setWorkMode(p.workMode);
              setLocations(p.preferredLocations.join(", "));
              setSalaryMin(p.salaryMinUsd ? String(p.salaryMinUsd) : "");
              setSalaryMax(p.salaryMaxUsd ? String(p.salaryMaxUsd) : "");
            }}
          >
            Reset to my profile
          </Button>
        </div>
      </Card>

      <div className="grid gap-3">
        {ranked.map(({ job, score }) => (
          <Card key={job.id} style={{ boxShadow: "none", padding: 16 }}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="font-semibold">{job.title}</div>
                <div className="mt-1 text-[14px] text-[color:var(--muted)]">
                  {job.company} • {job.location}
                </div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <Badge>{job.type}</Badge>
                  <Badge>{job.mode}</Badge>
                  <Badge>{job.level}</Badge>
                  {fmtSalary(job) ? <Badge>{fmtSalary(job)}</Badge> : null}
                </div>
              </div>
              <Badge tone={score >= 80 ? "ok" : score >= 60 ? "warn" : "neutral"}>
                {score}% match
              </Badge>
            </div>
            <Divider />
            <div className="flex gap-2 flex-wrap">
              {job.tags.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
            <div className="mt-3 flex gap-2 flex-wrap">
              <Link href="/copilot">
                <Button style={{ padding: "8px 10px" }}>Open in Copilot</Button>
              </Link>
              <Link href="/job-tracker">
                <Button variant="ghost" style={{ padding: "8px 10px" }}>
                  Add to tracker
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ boxShadow: "none" }}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="font-semibold">Want to browse everything?</div>
            <div className="mt-1 text-[14px] text-[color:var(--muted)]">
              Use the full jobs page (same mock feed, more filters).
            </div>
          </div>
          <Link href="/latest-jobs">
            <Button variant="secondary">Browse all</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
