"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAppState } from "@/context/AppStateContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Faq } from "@/components/Faq";

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="m-0 text-[22px] leading-tight tracking-[-0.4px]">{title}</h2>
      <p className="m-0 text-[15px] leading-7 text-[color:var(--muted)]">{subtitle}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-[20px] font-extrabold tracking-[-0.5px]">{value}</div>
      <div className="text-[13px] text-[color:var(--muted)]">{label}</div>
    </div>
  );
}

function HorizontalScroll({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="hide-scrollbar flex gap-3 overflow-x-auto pb-2 [scroll-snap-type:x_mandatory]"
    >
      {children}
    </div>
  );
}

function HeroPreview({ readiness }: { readiness: number }) {
  return (
    <div className="relative animate-[floaty_9s_ease-in-out_infinite]">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 rounded-[32px] bg-gradient-to-br from-[color:var(--brand)]/25 via-transparent to-[color:var(--brand-2)]/25 blur-2xl"
      />

      <div className="relative rounded-[24px] border border-white/20 bg-[color:var(--surface-1)]/60 p-4 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.18)]" />
            <span className="text-[12px] font-semibold text-[color:var(--muted)]">Live preview</span>
          </div>
          <Badge>{readiness}% ready</Badge>
        </div>

        <Divider className="my-4" />

        <div className="grid gap-3">
          <div className="rounded-2xl border border-[color:var(--border-1)] bg-[color:var(--surface-2)] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[12px] text-[color:var(--muted)]">Job match</div>
                <div className="mt-1 font-semibold leading-6">Frontend Engineer</div>
                <div className="mt-1 text-[13px] text-[color:var(--muted)]">Remote (US) • $150k–$210k</div>
              </div>
              <Badge tone="ok">86%</Badge>
            </div>
            <div className="mt-3 flex gap-2 flex-wrap">
              {["React", "Next.js", "A11y"].map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[color:var(--border-1)] bg-[color:var(--surface-2)] p-3">
            <div className="text-[12px] text-[color:var(--muted)]">Autofill preview</div>
            <div className="mt-2 grid gap-2">
              {[
                { k: "Full name", v: "Rashmi P." },
                { k: "Email", v: "rashmi@example.com" },
                { k: "LinkedIn", v: "linkedin.com/in/…" }
              ].map((r) => (
                <div key={r.k} className="flex items-center justify-between gap-3 rounded-xl border border-[color:var(--border-2)] bg-[color:var(--surface-1)] px-3 py-2">
                  <span className="text-[12px] text-[color:var(--muted)]">{r.k}</span>
                  <span className="text-[12px] font-semibold">{r.v}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Button className="px-3 py-2 text-[13px]">Approve & fill</Button>
              <Button variant="secondary" className="px-3 py-2 text-[13px]">
                Edit
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-[color:var(--border-1)] bg-gradient-to-br from-[color:var(--brand)]/12 to-[color:var(--brand-2)]/10 p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-[12px] text-[color:var(--muted)]">Resume score</div>
              <div className="mt-1 font-semibold">ATS alignment</div>
            </div>
            <div className="text-[20px] font-extrabold tracking-[-0.4px]">78</div>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/30">
            <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-[color:var(--brand)] to-[color:var(--brand-2)]" />
          </div>
          <div className="mt-2 text-[12px] text-[color:var(--muted)]">Missing: “design systems”, “performance profiling”</div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  desc,
  cta,
  href,
  meta
}: {
  title: string;
  desc: string;
  cta: string;
  href: string;
  meta?: string;
}) {
  return (
    <Card className="shadow-none bg-[color:var(--surface-2)] p-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="font-semibold">{title}</div>
          {meta ? <div className="mt-1 text-[12px] text-[color:var(--faint)]">{meta}</div> : null}
          <div className="mt-2 text-[14px] leading-7 text-[color:var(--muted)]">{desc}</div>
        </div>
        <Link href={href}>
          <Button className="px-3 py-2 text-[13px]">{cta}</Button>
        </Link>
      </div>
    </Card>
  );
}

export default function HomePage() {
  const { state } = useAppState();

  const profileCompleteness = useMemo(() => {
    const checks = [
      state.profile.name.trim().length > 0,
      state.profile.email.trim().length > 3,
      state.profile.targetRole.trim().length > 1,
      state.profile.skills.length >= 3
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [state.profile.email, state.profile.name, state.profile.skills.length, state.profile.targetRole]);

  return (
    <main className="container">
      <Card
        className="p-7"
        style={{ background: "linear-gradient(180deg, rgba(109,94,252,0.18), rgba(46,196,182,0.08))" }}
      >
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-start">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 flex-wrap">
              <Badge>Job matches</Badge>
              <Badge>Copilot extension</Badge>
              <Badge>Resume score</Badge>
              <Badge>Tracker</Badge>
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="m-0 text-[44px] leading-[1.02] tracking-[-1.2px]">
                Your job search portal.
                <br />
                Powered by one profile.
              </h1>
              <p className="m-0 text-[15px] leading-7 text-[color:var(--muted)] max-w-[64ch]">
                Get personalized job recommendations, craft tailored resumes, autofill and track applications, and
                generate answers you can edit—without losing control.
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link href="/signup">
                <Button className="px-4 py-3">Join now — it’s free</Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" className="px-4 py-3">
                  Log in
                </Button>
              </Link>
              <Link href="/extension">
                <Button variant="ghost" className="px-4 py-3">
                  Add extension (demo)
                </Button>
              </Link>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <Stat value="1 profile" label="Reuse everywhere you apply" />
              <Stat value={`${profileCompleteness}%`} label="Your profile readiness" />
              <Stat value="Preview-first" label="Approve before autofill" />
            </div>
          </div>
          <HeroPreview readiness={profileCompleteness} />
        </div>
      </Card>

      <div className="h-6" />

      <Card className="shadow-none p-4 bg-[color:var(--surface-1)]/70" style={{ backdropFilter: "blur(10px)" }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="text-[13px] text-[color:var(--muted)]">
            Built for people applying across startups, big tech, and everything in between.
          </div>
          <div className="flex gap-2 flex-wrap">
            {["Atlas", "Nimbus", "Beacon", "Relay", "Pinecone", "Acme"].map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        </div>
      </Card>

      <div className="h-8" />

      <Card className="shadow-none p-5">
        <SectionHeader
          title="We’re here for every step of your search"
          subtitle="Tell us your preferences and dealbreakers. We’ll match you with roles, help you tailor materials, and track progress."
        />
        <Divider />
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            title="Job matches"
            meta="Personalized"
            desc="Stop endlessly scrolling. Set preferences and get a curated list of roles that fit."
            cta="Get matched"
            href="/profile-setup"
          />
          <FeatureCard
            title="Autofill applications"
            meta="Extension demo"
            desc="Detect common fields, preview values from your profile, then approve autofill in one click."
            cta="Add to Chrome"
            href="/extension"
          />
          <FeatureCard
            title="AI resume builder + score"
            meta="Resume-to-JD"
            desc="Score your resume against a JD and get actionable tips to improve alignment."
            cta="Try scoring"
            href="/resume-score"
          />
          <FeatureCard
            title="Job application tracker"
            meta="Pipeline"
            desc="Track statuses like Submitted, Interview Requested, Rejected, Offer—with notes and follow-ups."
            cta="Open tracker"
            href="/job-tracker"
          />
        </div>
      </Card>

      <div className="h-8" />

      <Card className="shadow-none p-5">
        <SectionHeader
          title="What people say"
          subtitle="Placeholder testimonials to show layout (swap with real quotes later)."
        />
        <Divider />
        <HorizontalScroll>
          {[
            { role: "Software Engineer", quote: "The tracker kept me sane—no more spreadsheets.", outcome: "Stayed organized" },
            { role: "Marketing Intern", quote: "Job matches surfaced roles I wouldn’t have found.", outcome: "Found an internship" },
            { role: "Data Scientist", quote: "Resume scoring made missing keywords obvious.", outcome: "Improved ATS alignment" },
            { role: "Backend Engineer", quote: "Autofill preview saved a lot of repetitive typing.", outcome: "Saved time" },
            { role: "Product Manager", quote: "Tailored answers gave me a clean first draft.", outcome: "More consistent apps" }
          ].map((t) => (
            <div key={t.role} style={{ minWidth: 320, scrollSnapAlign: "start" }}>
              <Card className="shadow-none bg-[color:var(--surface-2)] p-4">
                <div className="text-[13px] text-[color:var(--muted)]">{t.role}</div>
                <div className="mt-2 text-[15px] leading-7 font-semibold">“{t.quote}”</div>
                <Divider />
                <div className="text-[13px] text-[color:var(--muted)]">{t.outcome}</div>
              </Card>
            </div>
          ))}
        </HorizontalScroll>
      </Card>

      <div className="h-8" />

      <Card className="shadow-none p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <SectionHeader
            title="More tools to help you stand out"
            subtitle="Extra feature ideas (frontend UX placeholders)."
          />
          <Link href="/copilot">
            <Button variant="secondary" className="px-3 py-2">
              Explore Copilot
            </Button>
          </Link>
        </div>
        <Divider />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            { title: "Resume ATS score", desc: "See what to fix and why it matters." },
            { title: "Cover letter generator", desc: "Draft cover letters + recruiter emails." },
            { title: "Career journal", desc: "Track wins and turn them into resume bullets." },
            { title: "Networking copilot", desc: "Find hiring managers and draft outreach." },
            { title: "Handpicked job lists", desc: "Curated opportunities updated regularly." },
            { title: "Interview prep", desc: "Practice answers and refine your story." }
          ].map((c) => (
            <Card key={c.title} className="shadow-none bg-[color:var(--surface-2)] p-4">
              <div className="font-semibold">{c.title}</div>
              <div className="mt-2 text-[14px] leading-7 text-[color:var(--muted)]">{c.desc}</div>
              <div className="mt-3">
                <Badge>Coming soon</Badge>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <div className="h-8" />

      <Card className="shadow-none p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <SectionHeader
            title="Explore curated job lists"
            subtitle="Examples like internships, senior roles at startups, and remote opportunities."
          />
          <div className="flex gap-2 flex-wrap">
            <Link href="/latest-jobs">
              <Button variant="secondary" className="px-3 py-2">
                Search jobs
              </Button>
            </Link>
            <Link href="/internships">
              <Button variant="ghost" className="px-3 py-2">
                Internships
              </Button>
            </Link>
            <Link href="/remote">
              <Button variant="ghost" className="px-3 py-2">
                Remote work
              </Button>
            </Link>
          </div>
        </div>
        <Divider />
        <HorizontalScroll>
          {[
            "Top summer internships",
            "Senior software jobs @ startups",
            "New grad jobs",
            "Entry-level remote jobs",
            "Internships in the SF Bay Area",
            "Top marketing internships",
            "UI/UX design roles"
          ].map((name) => (
            <div key={name} style={{ minWidth: 260, scrollSnapAlign: "start" }}>
              <Card className="shadow-none bg-[color:var(--surface-2)] p-4">
                <div className="font-semibold">{name}</div>
                <div className="mt-2 text-[13px] text-[color:var(--muted)]">Updated regularly (demo)</div>
                <div className="mt-3">
                  <Link href="/latest-jobs">
                    <Button variant="secondary" className="px-3 py-2 text-[13px]">
                      Explore
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          ))}
        </HorizontalScroll>
      </Card>

      <div className="h-8" />

      <Faq
        items={[
          {
            q: "How does this application work?",
            a: "You create a profile, set preferences, and run Copilot actions. Outputs are shown step-by-step and are editable. Autofill is previewed and requires your approval."
          },
          {
            q: "Is there a limit to how many applications I can autofill?",
            a: "This demo does not enforce a limit. A real product may add limits for abuse prevention, site restrictions, or plan tiers."
          },
          {
            q: "Is it free?",
            a: "This project is a demo and does not charge. Production pricing depends on the AI model provider and usage."
          },
          {
            q: "How is my data handled?",
            a: "In this demo, your data is stored locally in your browser. Your backend teammate can replace this with secure server storage and clear data policies."
          }
        ]}
      />
    </main>
  );
}
