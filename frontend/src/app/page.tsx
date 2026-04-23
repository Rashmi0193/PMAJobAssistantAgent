"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useAppState } from "@/context/AppStateContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.1,
      ease: "easeOut",
    },
  }),
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white/90 px-6 py-6 text-center dark:border-white/10 dark:bg-white/5">
      <div className="text-[22px] font-extrabold tracking-[-0.8px] text-slate-900 dark:text-white">
        {value}
      </div>
      <div className="mt-2 text-[14px] text-slate-600 dark:text-slate-300">
        {label}
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  href,
  cta,
  index,
}: {
  icon: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -4, scale: 1.015 }}
    >
      <Card className="h-full rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/5">
        <div className="text-[34px]">{icon}</div>
        <h3 className="mt-4 text-[20px] font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-3 text-[15px] leading-7 text-slate-600 dark:text-slate-300">
          {desc}
        </p>
        <div className="mt-6">
          <Link href={href}>
            <Button variant="secondary" className="px-4 py-2 text-[14px]">
              {cta}
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
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
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [
    state.profile.email,
    state.profile.name,
    state.profile.targetRole,
    state.profile.skills.length,
  ]);

  const features = [
    {
      icon: "🎯",
      title: "Smart Job Matching",
      desc: "Discover jobs that actually fit your skills, experience, and goals instead of scrolling endlessly through irrelevant listings.",
      href: "/profile-setup",
      cta: "Get matched",
    },
    {
      icon: "⚡",
      title: "Application Autofill",
      desc: "Use your saved profile to speed through repetitive application fields while staying fully in control of what gets filled.",
      href: "/extension",
      cta: "Try autofill",
    },
    {
      icon: "📄",
      title: "Resume Scoring",
      desc: "See how well your resume aligns with a job description and improve it before sending another application out.",
      href: "/resume-score",
      cta: "Check score",
    },
    {
      icon: "📌",
      title: "Application Tracker",
      desc: "Track applications, interviews, follow-ups, and outcomes in one clean workflow without juggling spreadsheets.",
      href: "/job-tracker",
      cta: "Open tracker",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-slate-900 dark:from-[#03101d] dark:via-[#07111f] dark:to-[#071827] dark:text-white">
      {/* HERO */}
      <motion.section
        className="px-6 py-20 md:px-10 md:py-28"
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="mx-auto max-w-6xl text-center ">
          <div className="flex flex-wrap justify-center gap-4 ">
          <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
Smart job matching</Badge>
<Badge className="bg-indigo-100 text-indigo-700
dark:bg-indigo-500/20 dark:text-indigo-300">
Resume scoring</Badge>
<Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
Autofill with control</Badge>
<Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
Application tracking</Badge>
          </div>

          <h1 className="mx-auto mt-8 max-w-4xl text-[44px] font-extrabold leading-[1.02] tracking-[-2px] text-slate-900 md:text-[72px] dark:text-white">
            Your job search,
            <span className="block text-indigo-600 dark:text-indigo-300">
              finally under control.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-[18px] leading-8 text-slate-600 md:text-[20px] dark:text-slate-300">
            Stop juggling resumes, job boards, and spreadsheets. Use one profile
            to match with jobs, improve your resume, autofill applications, and
            track everything in one place.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/signup">
              <Button className="min-w-[220px] px-6 py-3 text-[16px]">
                Get started — it’s free
              </Button>
            </Link>

            <Link href="/extension">
              <Button variant="secondary" className="min-w-[220px] px-6 py-3 text-[16px]">
                Try extension demo
              </Button>
            </Link>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-3">
            <Stat value="1 profile" label="Reuse across every application" />
            <Stat value={`${profileCompleteness}%`} label="Profile readiness" />
            <Stat value="Preview-first" label="You approve before autofill" />
          </div>
        </div>
      </motion.section>

      {/* FEATURES */}
      <section className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="text-[34px] font-extrabold tracking-[-1px] text-slate-900 dark:text-white md:text-[42px]">
              Explore the core tools
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-[17px] leading-8 text-slate-600 dark:text-slate-300">
              Keep the homepage simple. Go deeper only when you need to.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} index={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-slate-200 bg-white/80 p-8 shadow-sm dark:border-white/10 dark:bg-white/5 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-center"
          >
            <h2 className="text-[32px] font-extrabold tracking-[-1px] text-slate-900 dark:text-white">
              How it works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-7 text-slate-600 dark:text-slate-300">
              A simple workflow for a messy process.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create your profile",
                desc: "Add your skills, experience, and target roles once.",
              },
              {
                step: "02",
                title: "Choose your tool",
                desc: "Get job matches, optimize your resume, or autofill faster.",
              },
              {
                step: "03",
                title: "Track progress",
                desc: "Manage applications and follow-ups without chaos.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-[24px] border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-black/10"
              >
                <div className="text-[12px] font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">
                  Step {item.step}
                </div>
                <h3 className="mt-3 text-[20px] font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-slate-600 dark:text-slate-300">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <motion.section
        className="px-6 py-20 md:px-10 md:py-24"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
      >
        <div className="mx-auto max-w-5xl rounded-[32px] bg-gradient-to-r from-indigo-600 to-sky-500 px-8 py-14 text-center text-white shadow-lg">
          <h2 className="text-[32px] font-extrabold tracking-[-1px] md:text-[40px]">
            Ready to simplify your job search?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-8 text-white/90">
            Start with one profile, move faster, and keep your applications
            organized from day one.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/signup">
              <Button
                variant="secondary"
                className="bg-white px-6 py-3 text-[16px] font-semibold text-sky-700 hover:bg-slate-100"
              >
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>
    </main>
  );
}