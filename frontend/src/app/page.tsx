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
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="m-0 text-[26px] font-semibold leading-tight tracking-[-0.6px] text-white">
        {title}
      </h2>
      <p className="m-0 max-w-[70ch] text-[15px] leading-7 text-[color:var(--muted)]">
        {subtitle}
      </p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[24px] border border-[color:var(--border-1)] bg-[color:var(--surface-2)]/70 px-6 py-7 text-center">
      <div className="text-[20px] font-extrabold tracking-[-0.8px] text-white md:text-[24px]">
        {value}
      </div>
      <div className="mt-2 text-[14px] leading-6 text-[color:var(--muted)]">
        {label}
      </div>
    </div>
  );
}

function HorizontalScroll({ children }: { children: React.ReactNode }) {
  return (
    <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-2 [scroll-snap-type:x_mandatory]">
      {children}
    </div>
  );
}



function FeatureCard({
  eyebrow,
  title,
  desc,
  cta,
  href,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
}) {
  return (
    <Card className="group rounded-[24px] border border-[color:var(--border-1)] bg-[color:var(--surface-2)] p-5 shadow-none transition duration-200 hover:-translate-y-0.5 hover:border-white/20">
      <div className="text-[12px] uppercase tracking-[0.16em] text-[color:var(--faint)]">
        {eyebrow}
      </div>
      <div className="mt-2 text-[18px] font-semibold text-white">{title}</div>
      <div className="mt-3 text-[14px] leading-7 text-[color:var(--muted)]">
        {desc}
      </div>
      <div className="mt-5">
        <Link href={href}>
          <Button className="px-3 py-2 text-[13px]">{cta}</Button>
        </Link>
      </div>
    </Card>
  );
}

function TestimonialCard({
  quote,
  role,
}: {
  quote: string;
  role: string;
}) {
  return (
    <div style={{ minWidth: 320, scrollSnapAlign: "start" }}>
      <Card className="rounded-[24px] border border-[color:var(--border-1)] bg-[color:var(--surface-2)] p-5 shadow-none">
        <div className="text-[15px] leading-7 font-medium text-white">
          “{quote}”
        </div>
        <Divider />
        <div className="text-[13px] text-[color:var(--muted)]">{role}</div>
      </Card>
    </div>
  );
}

export default function HomePage() {
  const { state } = useAppState();

  const profileCompleteness = useMemo(() => {
    const checks = [
      state.profile.name.trim().length > 0,
      state.profile.email.trim().length > 3,
      state.profile.targetRole.trim().length > 1,
      state.profile.skills.length >= 3,
    ];
    return Math.round(
      (checks.filter(Boolean).length / checks.length) * 100
    );
  }, [
    state.profile.email,
    state.profile.name,
    state.profile.skills.length,
    state.profile.targetRole,
  ]);

  return (
<main className="w-full px-4 md:px-8 xl:px-16 pb-16">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#07111f] px-6 py-16 md:px-10 md:py-24">
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(109,94,252,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_28%)]"
  />

  <div className="relative mx-auto flex w-full max-w-[980px] flex-col items-center text-center">
    <div className="flex max-w-[760px] flex-wrap justify-center gap-2">
      <Badge>Smart job matching</Badge>
      <Badge>Resume scoring</Badge>
      <Badge>Autofill with control</Badge>
      <Badge>Application tracking</Badge>
    </div>

    <h1 className="mt-8 max-w-[820px] text-balance text-[48px] font-semibold leading-[0.98] tracking-[-2px] text-white md:text-[72px]">
      Your job search,
      <br />
      finally under control.
    </h1>

    <p className="mt-6 max-w-[760px] text-[18px] leading-8 text-[color:var(--muted)] md:text-[20px]">
      Stop juggling resumes, job boards, and spreadsheets. Use one intelligent
      profile to match with jobs, tailor your resume, autofill applications,
      and track every opportunity in one place.
    </p>

    <div className="mt-10 flex flex-wrap justify-center gap-4">
      <Link href="/signup">
        <Button className="min-w-[220px] px-6 py-3 text-[16px]">
          Get started — it’s free
        </Button>
      </Link>

      <Link href="/login">
        <Button variant="secondary" className="min-w-[140px] px-6 py-3 text-[16px]">
          Log in
        </Button>
      </Link>

      <Link href="/extension">
        <Button variant="ghost" className="min-w-[220px] px-6 py-3 text-[16px]">
          Try extension demo
        </Button>
      </Link>
    </div>

    <div className="mt-12 grid w-full max-w-[1080px] gap-4 md:grid-cols-3">
      <Stat value="1 profile" label="Reuse across every application" />
      <Stat value={`${profileCompleteness}%`} label="Profile readiness" />
      <Stat value="Preview-first" label="You approve before autofill" />
    </div>
  </div>
</section>

      <div className="h-16 md:h-20" />

      {/* CORE FEATURES */}
      <Card className="rounded-[28px] border border-[color:var(--border-1)] p-6 shadow-none">
        <SectionHeader
          title="Everything you need to land interviews — in one place"
          subtitle="No fluff. No scattered tools. Just a faster, smarter way to manage your job search from start to finish."
        />
        <Divider />
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard
            eyebrow="Smart matching"
            title="Find jobs that actually fit you"
            desc="Skip endless scrolling. Surface roles aligned to your experience, target role, skills, and preferences."
            cta="Get matched"
            href="/profile-setup"
          />

          <FeatureCard
            eyebrow="Autofill"
            title="Apply faster without losing control"
            desc="Use your saved profile to preview and autofill common application fields accurately and in seconds."
            cta="Add to Chrome"
            href="/extension"
          />

          <FeatureCard
            eyebrow="Resume optimization"
            title="Fix your resume before it gets ignored"
            desc="Score your resume against a job description and see exactly which keywords and strengths are missing."
            cta="Try scoring"
            href="/resume-score"
          />

          <FeatureCard
            eyebrow="Tracking"
            title="Replace spreadsheets with a real pipeline"
            desc="Track submitted applications, follow-ups, interviews, rejections, and offers in one clean workflow."
            cta="Open tracker"
            href="/job-tracker"
          />
        </div>
      </Card>

      <div className="h-16 md:h-20" />

      {/* DIFFERENTIATORS */}
      <Card className="rounded-[28px] border border-[color:var(--border-1)] bg-[color:var(--surface-1)]/40 p-6 shadow-none">
        <SectionHeader
          title="Why this feels different"
          subtitle="Most job tools solve one small piece. This one gives you a system."
        />
        <Divider />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Not another job board",
              desc: "See opportunities that fit you instead of wading through everything.",
            },
            {
              title: "Not blind AI",
              desc: "You review outputs before they’re used. No black-box autofill nonsense.",
            },
            {
              title: "Not fragmented",
              desc: "Matching, resume help, autofill, and tracking all work together.",
            },
            {
              title: "Not guesswork",
              desc: "Use profile data and job-specific signals to improve every application.",
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="rounded-[22px] border border-[color:var(--border-1)] bg-[color:var(--surface-2)] p-4 shadow-none"
            >
              <div className="text-[16px] font-semibold text-white">
                {item.title}
              </div>
              <div className="mt-2 text-[14px] leading-7 text-[color:var(--muted)]">
                {item.desc}
              </div>
            </Card>
          ))}
        </div>
      </Card>

<div className="h-16 md:h-20" />
      {/* HOW IT WORKS */}
      <Card className="rounded-[28px] border border-[color:var(--border-1)] p-6 shadow-none">
        <SectionHeader
          title="Simple. Fast. Effective."
          subtitle="A modern workflow for a messy process."
        />
        <Divider />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              step: "01",
              title: "Build your profile",
              desc: "Add your experience, skills, links, and preferences once.",
            },
            {
              step: "02",
              title: "Get matched",
              desc: "Discover jobs that align with your background and goals.",
            },
            {
              step: "03",
              title: "Optimize before applying",
              desc: "Improve your resume and responses for the role you want.",
            },
            {
              step: "04",
              title: "Apply and track",
              desc: "Autofill faster, then manage your full pipeline in one place.",
            },
          ].map((item) => (
            <Card
              key={item.step}
              className="rounded-[22px] border border-[color:var(--border-1)] bg-[color:var(--surface-2)] p-5 shadow-none"
            >
              <div className="text-[12px] uppercase tracking-[0.18em] text-[color:var(--faint)]">
                Step {item.step}
              </div>
              <div className="mt-2 text-[17px] font-semibold text-white">
                {item.title}
              </div>
              <div className="mt-2 text-[14px] leading-7 text-[color:var(--muted)]">
                {item.desc}
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <div className="h-16 md:h-20" />
      {/* TESTIMONIALS */}
      <Card className="rounded-[28px] border border-[color:var(--border-1)] p-6 shadow-none">
        <SectionHeader
          title="What users care about most"
          subtitle="Less repetition. Better visibility. More control."
        />
        <Divider />
        <HorizontalScroll>
          <TestimonialCard
            quote="I stopped wasting hours rewriting the same application details over and over."
            role="Software Engineer"
          />
          <TestimonialCard
            quote="The resume score made it obvious why some roles were not converting."
            role="Data Analyst"
          />
          <TestimonialCard
            quote="Autofill plus tracking saved me the most time. It made the whole process manageable."
            role="New Grad Applicant"
          />
          <TestimonialCard
            quote="This finally felt like one workflow instead of five disconnected tools."
            role="Frontend Developer"
          />
        </HorizontalScroll>
      </Card>

      <div className="h-16 md:h-20" />
      {/* EXTRA TOOLS */}
      <Card className="rounded-[28px] border border-[color:var(--border-1)] p-6 shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionHeader
            title="More tools to help you stand out"
            subtitle="Useful additions without turning the homepage into a feature dump."
          />
          <Link href="/copilot">
            <Button variant="secondary" className="px-3 py-2">
              Explore Copilot
            </Button>
          </Link>
        </div>

        <Divider />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Cover letter drafts",
              desc: "Generate tailored first drafts you can edit quickly.",
            },
            {
              title: "Networking assistant",
              desc: "Draft outreach messages to recruiters and hiring managers.",
            },
            {
              title: "Interview prep",
              desc: "Practice answers and tighten your story before interviews.",
            },
            {
              title: "Career journal",
              desc: "Capture wins and convert them into strong resume bullets.",
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="rounded-[22px] border border-[color:var(--border-1)] bg-[color:var(--surface-2)] p-4 shadow-none"
            >
              <div className="text-[16px] font-semibold text-white">
                {item.title}
              </div>
              <div className="mt-2 text-[14px] leading-7 text-[color:var(--muted)]">
                {item.desc}
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <div className="h-16 md:h-20" />
      {/* CURATED JOBS */}
      <Card className="rounded-[28px] border border-[color:var(--border-1)] p-6 shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionHeader
            title="Explore curated opportunities"
            subtitle="Start with focused lists instead of random search results."
          />
          <Link href="/latest-jobs">
            <Button variant="secondary" className="px-3 py-2">
              Explore jobs
            </Button>
          </Link>
        </div>

        <Divider />

        <HorizontalScroll>
          {[
            "Top internships",
            "New grad roles",
            "Frontend jobs",
            "Remote opportunities",
            "Bay Area jobs",
            "Entry-level software roles",
          ].map((name) => (
            <div key={name} style={{ minWidth: 260, scrollSnapAlign: "start" }}>
              <Card className="rounded-[22px] border border-[color:var(--border-1)] bg-[color:var(--surface-2)] p-4 shadow-none">
                <div className="font-semibold text-white">{name}</div>
                <div className="mt-2 text-[13px] text-[color:var(--muted)]">
                  Curated for faster discovery
                </div>
                <div className="mt-4">
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

      <div className="h-16 md:h-20" />
      {/* FAQ */}
      <Faq
        items={[
          {
            q: "How does this work?",
            a: "Create one profile, set your preferences, get matched with jobs, optimize your materials, preview autofill, and track your applications in one place.",
          },
          {
            q: "Does it autofill applications automatically?",
            a: "No. You review and approve autofill before anything is submitted.",
          },
          {
            q: "Is it free?",
            a: "This version is free to use. Future versions may introduce optional paid plans.",
          },
          {
            q: "How is my data handled?",
            a: "In this version, data is stored locally in your browser. A production version can move this to secure backend storage with clear policies.",
          },
        ]}
      />

<div className="h-16 md:h-20" />
      {/* FINAL CTA */}
      <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[#07111f] p-8 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute"
        />
        <h2 className="m-0 text-[32px] font-semibold tracking-[-0.8px] text-white md:text-[40px]">
          Ready to stop wasting time on job applications?
        </h2>
        <p className="mx-auto mt-3 max-w-[60ch] text-[15px] leading-7 text-[color:var(--muted)]">
          Build your profile once. Match smarter. Apply faster. Track everything.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/signup">
            <Button className="px-5 py-3 text-[14px]">
              Get started — it’s free
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" className="px-5 py-3 text-[14px]">
              Log in
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}