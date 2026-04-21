"use client";

import { useMemo, useState } from "react";
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
  tags: string[];
};

const MOCK_JOBS: JobPost[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "Nimbus (Startup)",
    location: "SF Bay Area",
    type: "Full-time",
    mode: "Hybrid",
    level: "Senior",
    tags: ["React", "TypeScript", "Performance"]
  },
  {
    id: "2",
    title: "Frontend Engineer",
    company: "Atlas Labs",
    location: "Remote (US)",
    type: "Full-time",
    mode: "Remote",
    level: "Mid",
    tags: ["Next.js", "Design systems", "A11y"]
  },
  {
    id: "3",
    title: "Software Engineering Intern",
    company: "Pinecone Studios",
    location: "SF Bay Area",
    type: "Internship",
    mode: "Onsite",
    level: "Junior",
    tags: ["JavaScript", "React", "Mentorship"]
  },
  {
    id: "4",
    title: "Backend Engineer",
    company: "Relay",
    location: "Remote (Global)",
    type: "Full-time",
    mode: "Remote",
    level: "Senior",
    tags: ["APIs", "Postgres", "Observability"]
  },
  {
    id: "5",
    title: "Data Scientist",
    company: "Beacon AI",
    location: "SF Bay Area",
    type: "Full-time",
    mode: "Hybrid",
    level: "Mid",
    tags: ["LLMs", "Prompting", "Evaluation"]
  }
];

function Chip({
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
        background: active ? "rgba(109,94,252,0.10)" : "transparent",
        cursor: "pointer",
        color: "var(--text)"
      }}
    >
      {children}
    </button>
  );
}

export function LatestJobs({ preset }: { preset?: "remote" | "internships" }) {
  const [q, setQ] = useState("");
  const [onlyRemote, setOnlyRemote] = useState(preset === "remote");
  const [onlyInternships, setOnlyInternships] = useState(preset === "internships");
  const [bayArea, setBayArea] = useState(false);
  const [seniorOnly, setSeniorOnly] = useState(false);

  const jobs = useMemo(() => {
    const query = q.trim().toLowerCase();
    return MOCK_JOBS.filter((j) => {
      if (onlyRemote && j.mode !== "Remote") return false;
      if (onlyInternships && j.type !== "Internship") return false;
      if (bayArea && !j.location.toLowerCase().includes("sf bay area")) return false;
      if (seniorOnly && j.level !== "Senior") return false;
      if (!query) return true;
      const blob = `${j.title} ${j.company} ${j.location} ${j.tags.join(" ")}`.toLowerCase();
      return blob.includes(query);
    });
  }, [q, onlyRemote, onlyInternships, bayArea, seniorOnly]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, letterSpacing: -0.2 }}>Latest jobs</h1>
            <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.6 }}>
              Demo job feed (mock). In the real product, this would be crawled/aggregated from job boards.
            </p>
          </div>
          <Badge>{jobs.length} results</Badge>
        </div>

        <Divider />

        <div style={{ display: "grid", gap: 12 }}>
          <Field label="Search">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search role, company, location…" />
          </Field>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Chip active={onlyRemote} onClick={() => setOnlyRemote((v) => !v)}>
              Remote
            </Chip>
            <Chip active={onlyInternships} onClick={() => setOnlyInternships((v) => !v)}>
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
              Clear
            </Button>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gap: 10 }}>
        {jobs.map((j) => (
          <Card key={j.id} style={{ boxShadow: "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 750 }}>{j.title}</div>
                <div style={{ marginTop: 4, color: "var(--muted)" }}>
                  {j.company} • {j.location}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <Badge>{j.type}</Badge>
                <Badge>{j.mode}</Badge>
                <Badge>{j.level}</Badge>
              </div>
            </div>
            <Divider />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {j.tags.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

