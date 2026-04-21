"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAppState } from "@/context/AppStateContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Faq } from "@/components/Faq";

function SectionHeader({
  title,
  subtitle
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-[22px] leading-tight tracking-[-0.4px] m-0">{title}</h2>
      <p className="m-0 text-[15px] leading-7 text-[color:var(--muted)]">{subtitle}</p>
    </div>
  );
}

function FeatureTile({
  title,
  description,
  bullets,
  href,
  badge
}: {
  title: string;
  description: string;
  bullets: string[];
  href: string;
  badge?: string;
}) {
  return (
    <Card style={{ boxShadow: "none", padding: 18 }}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="m-0 text-[16px] tracking-[-0.2px]">{title}</h3>
            {badge ? <Badge>{badge}</Badge> : null}
          </div>
          <p className="m-0 text-[14px] leading-6 text-[color:var(--muted)]">
            {description}
          </p>
        </div>
        <Link href={href}>
          <Button variant="secondary" style={{ padding: "8px 10px" }}>
            Open
          </Button>
        </Link>
      </div>
      <Divider />
      <ul className="m-0 pl-[18px] text-[14px] leading-7 text-[color:var(--muted)]">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </Card>
  );
}

export default function HomePage() {
  const { state, actions } = useAppState();

  const profileCompleteness = useMemo(() => {
    const checks = [
      state.profile.name.trim().length > 0,
      state.profile.email.trim().length > 3,
      state.profile.targetRole.trim().length > 1,
      state.profile.skills.length >= 3
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [state.profile.email, state.profile.name, state.profile.skills.length, state.profile.targetRole]);

  const latestTask = state.tasks[0];
  const latestApplication = state.applications[0];

  return (
    <main className="container">
      <Card
        style={{
          padding: 22,
          background:
            "linear-gradient(180deg, rgba(109,94,252,0.12), rgba(46,196,182,0.06))"
        }}
      >
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr] items-start">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 flex-wrap">
              <Badge>Copilot</Badge>
              <Badge>Autofill preview</Badge>
              <Badge>Resume match score</Badge>
              <Badge>Application tracker</Badge>
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="m-0 text-[40px] leading-[1.05] tracking-[-0.9px]">
                Apply faster with an AI job copilot
              </h1>
              <p className="m-0 text-[15px] leading-7 text-[color:var(--muted)] max-w-[62ch]">
                Upload your resume, paste a job description, and get a focused plan: one-click autofill (with approval),
                tailored answers you can edit, and a match score with actionable improvements.
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link href="/copilot">
                <Button style={{ padding: "12px 14px" }}>Open Copilot</Button>
              </Link>
              <Link href="/signup">
                <Button variant="secondary" style={{ padding: "12px 14px" }}>
                  Sign up
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" style={{ padding: "12px 14px" }}>
                  Log in
                </Button>
              </Link>
            </div>

            <div className="flex gap-3 flex-wrap text-[13px] text-[color:var(--muted)]">
              <span>Preview-first UX</span>
              <span aria-hidden>•</span>
              <span>Approve before actions</span>
              <span aria-hidden>•</span>
              <span>Feedback loop built-in</span>
            </div>
          </div>

          <Card style={{ boxShadow: "none", padding: 18, background: "rgba(0,0,0,0.03)" }}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex flex-col gap-1">
                <h2 className="m-0 text-[14px] tracking-[-0.1px]">Your workspace</h2>
            
              </div>
              <Badge tone={profileCompleteness >= 75 ? "ok" : "warn"}>
                {profileCompleteness}% profile ready
              </Badge>
            </div>
            <Divider />
            <div className="grid gap-2 text-[14px] text-[color:var(--muted)]">
              <div className="flex justify-between gap-3">
                <span>Applications tracked</span>
                <span className="text-[color:var(--text)]">{state.applications.length}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Tasks run</span>
                <span className="text-[color:var(--text)]">{state.tasks.length}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Feedback entries</span>
                <span className="text-[color:var(--text)]">{state.feedback.length}</span>
              </div>
            </div>
            <Divider />
            <div className="grid gap-2 text-[12px] text-[color:var(--faint)]">
              <div>
                Latest task:{" "}
                <span className="text-[color:var(--text)]">
                  {latestTask ? `${latestTask.title} (${latestTask.status})` : "—"}
                </span>
              </div>
              <div>
                Latest application:{" "}
                <span className="text-[color:var(--text)]">
                  {latestApplication ? `${latestApplication.role} @ ${latestApplication.company}` : "—"}
                </span>
              </div>
              <div className="pt-1">
                <Button
                  variant="ghost"
                  onClick={() =>
                    actions.addApplication({
                      company: "ExampleCo",
                      role: "Frontend Engineer",
                      url: "https://example.com/job/frontend",
                      status: "Not Submitted",
                      notes: "Seeded demo entry"
                    })
                  }
                  style={{ padding: "10px 12px", width: "100%" }}
                >
                  + Add a sample application
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Card>

      <div className="h-6" />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-5 flex-wrap">
          <Link href="/job-tracker">
            <Button variant="secondary" style={{ padding: "30px 12px" }}>
              Job Tracker
            </Button>
          </Link>
          <Link href="/resume-builder">
            <Button variant="secondary" style={{ padding: "30px 12px" }}>
              Resume Builder
            </Button>
          </Link>
          <Link href="/latest-jobs">
            <Button variant="secondary" style={{ padding: "30px 12px" }}>
              Latest Jobs
            </Button>
          </Link>
        </div>
      </div>

      <div className="h-4" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <FeatureTile
          title="Copilot"
          badge="Primary"
          description="A sidebar-style assistant that stays with you while you apply."
          bullets={[
            "Paste a JD and run actions in seconds.",
            "See the agent’s steps (show-the-work).",
            "Approve, edit, reject—always in control."
          ]}
          href="/copilot"
        />
        <FeatureTile
          title="Job application tracker"
          description="Track every application status in one place."
          bullets={[
            "Not submitted → submitted → interview → offer.",
            "Add notes and follow-ups per company.",
            "Keep your pipeline visible at a glance."
          ]}
          href="/job-tracker"
        />
        <FeatureTile
          title="Resume builder"
          description="Upload/paste your resume and extract the fields you need."
          bullets={[
            "Extract contact and skill hints (demo).",
            "Use extracted fields to power autofill.",
            "Single source of truth for your profile."
          ]}
          href="/resume-builder"
        />
        <FeatureTile
          title="Resume review (match score)"
          description="Score your resume against a job description."
          bullets={[
            "Get a match score and gaps.",
            "Actionable tips you can apply.",
            "Designed for fast iteration."
          ]}
          href="/resume-score"
        />
        <FeatureTile
          title="Latest jobs"
          description="A feed of roles you can filter quickly."
          bullets={[
            "Senior software jobs at startups (mock).",
            "Internships in SF Bay Area (mock).",
            "Remote work opportunities (mock)."
          ]}
          href="/latest-jobs"
        />
        <FeatureTile
          title="Employers"
          badge="Coming soon"
          description="Future: employer workflows and applicant pipelines."
          bullets={[
            "Post jobs with structured requirements.",
            "Track candidate stages and feedback.",
            "Generate consistent interview notes."
          ]}
          href="/employers"
        />
      </div>

      <div className="h-8" />

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] items-start">
        <Card style={{ boxShadow: "none", padding: 18 }}>
          <SectionHeader
            title="How it works"
            subtitle="Built for trust: the AI proposes, you decide."
          />
          <Divider />
          <ol className="m-0 pl-[18px] text-[14px] leading-7 text-[color:var(--muted)]">
            <li>
              <span className="text-[color:var(--text)] font-semibold">Set your profile</span>{" "}
              (resume + skills + links).
            </li>
            <li>
              <span className="text-[color:var(--text)] font-semibold">Add job context</span>{" "}
              (JD text or job URL).
            </li>
            <li>
              <span className="text-[color:var(--text)] font-semibold">Run agent actions</span>{" "}
              (score, answers, autofill preview).
            </li>
            <li>
              <span className="text-[color:var(--text)] font-semibold">Approve and iterate</span>{" "}
              with feedback 👍/👎.
            </li>
          </ol>
          <div className="h-3" />
          <Link href="/onboarding">
            <Button variant="secondary" style={{ padding: "10px 12px" }}>
              Complete profile
            </Button>
          </Link>
        </Card>

        <Card style={{ boxShadow: "none", padding: 18, background: "rgba(0,0,0,0.03)" }}>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex flex-col gap-1">
              <h3 className="m-0 text-[16px] tracking-[-0.2px]">One-click autofill (preview)</h3>
              <p className="m-0 text-[14px] leading-6 text-[color:var(--muted)]">
                Upload your resume → extract fields → preview what will be filled → approve.
              </p>
            </div>
            <Badge>Demo</Badge>
          </div>
          <Divider />
          <div className="grid gap-3">
            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-3 text-[13px] text-[color:var(--muted)]">
                <span>Detected fields</span>
                <span className="text-[color:var(--text)] font-semibold">8</span>
              </div>
              <div className="h-[10px] rounded-full bg-[color:var(--border-2)] overflow-hidden">
                <div className="h-full w-[76%] bg-[linear-gradient(90deg,var(--brand),var(--brand-2))]" />
              </div>
              <div className="text-[12px] text-[color:var(--faint)]">
                Always requires explicit approval before filling.
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-3 text-[13px] text-[color:var(--muted)]">
                <span>Resume-to-JD match score</span>
                <span className="text-[color:var(--text)] font-semibold">78/100</span>
              </div>
              <div className="h-[10px] rounded-full bg-[color:var(--border-2)] overflow-hidden">
                <div className="h-full w-[78%] bg-[linear-gradient(90deg,var(--brand),var(--brand-2))]" />
              </div>
              <div className="text-[12px] text-[color:var(--faint)]">
                Tips focus on measurable impact and missing keywords.
              </div>
            </div>
          </div>
          <div className="h-3" />
          <div className="flex gap-3 flex-wrap">
            <Link href="/resume-score">
              <Button variant="secondary" style={{ padding: "10px 12px" }}>
                Try resume score
              </Button>
            </Link>
            <Link href="/assistant">
              <Button variant="ghost" style={{ padding: "10px 12px" }}>
                Try autofill preview
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="h-8" />

      <Card style={{ boxShadow: "none", padding: 18 }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <SectionHeader
            title="Explore jobs (mock feed)"
            subtitle="Examples: senior software jobs at startups, internships in SF Bay Area, remote roles."
          />
          <div className="flex gap-2 flex-wrap">
            <Link href="/latest-jobs">
              <Button variant="secondary" style={{ padding: "10px 12px" }}>
                Browse jobs
              </Button>
            </Link>
            <Link href="/internships">
              <Button variant="ghost" style={{ padding: "10px 12px" }}>
                Internships
              </Button>
            </Link>
            <Link href="/remote">
              <Button variant="ghost" style={{ padding: "10px 12px" }}>
                Remote
              </Button>
            </Link>
          </div>
        </div>
        <Divider />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[
            { title: "Senior Software Engineer", company: "Nimbus (Startup)", meta: "SF Bay Area • Hybrid" },
            { title: "Frontend Engineer", company: "Atlas Labs", meta: "Remote (US) • Remote" },
            { title: "Software Engineering Intern", company: "Pinecone Studios", meta: "SF Bay Area • Onsite" }
          ].map((j) => (
            <div
              key={j.title}
              className="rounded-[14px] border border-[color:var(--border-1)] bg-[color:var(--surface-2)] p-3"
            >
              <div className="font-semibold">{j.title}</div>
              <div className="mt-1 text-[14px] text-[color:var(--muted)]">{j.company}</div>
              <div className="mt-2 text-[12px] text-[color:var(--faint)]">{j.meta}</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="h-8" />

      <Faq
        items={[
          {
            q: "How does this application work?",
            a: "You create a profile, add job context (JD), and run agent actions. Outputs are shown step-by-step and are editable. Autofill is previewed and requires your approval."
          },
          {
            q: "Is there a limit to how many applications I can autofill?",
            a: "This demo does not enforce a limit. A real product may add limits for abuse prevention, site restrictions, or plan tiers."
          },
          {
            q: "Are there any charges?",
            a: "This demo has no charges. Production pricing depends on the AI model provider and usage."
          },
          {
            q: "Where is my profile stored?",
            a: "In this demo, your data is stored locally in your browser. Your backend teammate can replace this with secure server storage."
          }
        ]}
      />
    </main>
  );
}

