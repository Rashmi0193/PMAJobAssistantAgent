"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Divider } from "@/components/ui/Divider";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export type JobPost = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Internship";
  mode: "Remote" | "Hybrid" | "Onsite";
  level: "Junior" | "Mid" | "Senior";
  salaryMinUsd?: number;
  salaryMaxUsd?: number;
  tags: string[];
};

const JOBS: JobPost[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "Nimbus",
    location: "SF Bay Area",
    type: "Full-time",
    mode: "Hybrid",
    level: "Senior",
    salaryMinUsd: 190000,
    salaryMaxUsd: 260000,
    tags: ["React", "TypeScript", "Performance"],
  },
  {
    id: "2",
    title: "Frontend Engineer",
    company: "Atlas Labs",
    location: "Remote (US)",
    type: "Full-time",
    mode: "Remote",
    level: "Mid",
    salaryMinUsd: 150000,
    salaryMaxUsd: 210000,
    tags: ["Next.js", "Design Systems", "Accessibility"],
  },
  {
    id: "3",
    title: "Software Engineering Intern",
    company: "Pinecone Studios",
    location: "SF Bay Area",
    type: "Internship",
    mode: "Onsite",
    level: "Junior",
    salaryMinUsd: 35000,
    salaryMaxUsd: 55000,
    tags: ["JavaScript", "React", "Mentorship"],
  },
  {
    id: "4",
    title: "Backend Engineer",
    company: "Relay",
    location: "Remote (Global)",
    type: "Full-time",
    mode: "Remote",
    level: "Senior",
    salaryMinUsd: 180000,
    salaryMaxUsd: 250000,
    tags: ["APIs", "Postgres", "Observability"],
  },
  {
    id: "5",
    title: "Data Scientist",
    company: "Beacon AI",
    location: "SF Bay Area",
    type: "Full-time",
    mode: "Hybrid",
    level: "Mid",
    salaryMinUsd: 165000,
    salaryMaxUsd: 230000,
    tags: ["LLMs", "Prompting", "Evaluation"],
  },
];

function formatSalary(job: JobPost) {
  if (!job.salaryMinUsd && !job.salaryMaxUsd) return "Salary not listed";

  const min = job.salaryMinUsd ? `$${job.salaryMinUsd.toLocaleString()}` : "—";
  const max = job.salaryMaxUsd ? `$${job.salaryMaxUsd.toLocaleString()}` : "—";

  return `${min} - ${max}`;
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "8px 10px",
        borderRadius: 999,
        border: `1px solid ${
          active ? "rgba(109,94,252,0.45)" : "var(--border-1)"
        }`,
        background: active ? "rgba(109,94,252,0.10)" : "transparent",
        cursor: "pointer",
        color: "var(--text)",
      }}
    >
      {children}
    </button>
  );
}

export function LatestJobs({
  preset,
}: {
  preset?: "remote" | "internships";
}) {
  const [q, setQ] = useState("");
  const [onlyRemote, setOnlyRemote] = useState(preset === "remote");
  const [onlyInternships, setOnlyInternships] = useState(
    preset === "internships"
  );
  const [bayArea, setBayArea] = useState(false);
  const [seniorOnly, setSeniorOnly] = useState(false);

  const jobs = useMemo(() => {
    const query = q.trim().toLowerCase();

    return JOBS.filter((job) => {
      if (onlyRemote && job.mode !== "Remote") return false;
      if (onlyInternships && job.type !== "Internship") return false;
      if (bayArea && !job.location.toLowerCase().includes("sf bay area"))
        return false;
      if (seniorOnly && job.level !== "Senior") return false;

      if (!query) return true;

      const searchableText = `
        ${job.title}
        ${job.company}
        ${job.location}
        ${job.type}
        ${job.mode}
        ${job.level}
        ${job.tags.join(" ")}
      `.toLowerCase();

      return searchableText.includes(query);
    });
  }, [q, onlyRemote, onlyInternships, bayArea, seniorOnly]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 22, letterSpacing: -0.2 }}>
              Latest Jobs
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                color: "var(--muted)",
                lineHeight: 1.6,
                maxWidth: 620,
              }}
            >
              Browse curated job opportunities and filter by role, work mode,
              location, and experience level.
            </p>
          </div>

          <Badge>{jobs.length} results</Badge>
        </div>

        <Divider />

        <div style={{ display: "grid", gap: 12 }}>
          <Field label="Search jobs">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by role, company, skill, or location..."
            />
          </Field>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Chip active={onlyRemote} onClick={() => setOnlyRemote((v) => !v)}>
              Remote
            </Chip>

            <Chip
              active={onlyInternships}
              onClick={() => setOnlyInternships((v) => !v)}
            >
              Internships
            </Chip>

            <Chip active={bayArea} onClick={() => setBayArea((v) => !v)}>
              SF Bay Area
            </Chip>

            <Chip active={seniorOnly} onClick={() => setSeniorOnly((v) => !v)}>
              Senior roles
            </Chip>

            <Button
              variant="ghost"
              onClick={() => {
                setQ("");
                setOnlyRemote(false);
                setOnlyInternships(false);
                setBayArea(false);
                setSeniorOnly(false);
              }}
              style={{ padding: "8px 10px" }}
            >
              Clear filters
            </Button>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gap: 10 }}>
        {jobs.length === 0 ? (
          <Card style={{ boxShadow: "none" }}>
            <h3 style={{ margin: 0 }}>No matching jobs found</h3>
            <p
              style={{
                margin: "8px 0 0",
                color: "var(--muted)",
                lineHeight: 1.6,
              }}
            >
              Try removing a filter or searching with a broader keyword.
            </p>
          </Card>
        ) : (
          jobs.map((job) => (
            <Card key={job.id} style={{ boxShadow: "none" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontWeight: 750, fontSize: 16 }}>
                    {job.title}
                  </div>

                  <div
                    style={{
                      marginTop: 4,
                      color: "var(--muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    {job.company} • {job.location}
                  </div>

                  <div
                    style={{
                      marginTop: 6,
                      color: "var(--muted)",
                      fontSize: 13,
                    }}
                  >
                    {formatSalary(job)}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <Badge>{job.type}</Badge>
                  <Badge>{job.mode}</Badge>
                  <Badge>{job.level}</Badge>
                </div>
              </div>

              <Divider />

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {job.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>

              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <Link href="/assistant">
                  <Button style={{ padding: "8px 10px" }}>
                    Open in Assistant
                  </Button>
                </Link>

                <Link href="/job-tracker">
                  <Button variant="ghost" style={{ padding: "8px 10px" }}>
                    Add to Tracker
                  </Button>
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}