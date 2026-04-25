"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useAppState } from "@/context/AppStateContext";

export default function DashboardPage() {
  const router = useRouter();
  const { state: auth } = useAuth();
  const { state } = useAppState();

  useEffect(() => {
    if (auth.ready && !auth.user) {
      router.push("/login");
    }
  }, [auth.ready, auth.user, router]);

  const stats = useMemo(() => {
    const total = state.applications.length;
    const interviews = state.applications.filter((app) =>
      app.status.includes("Interview")
    ).length;
    const offers = state.applications.filter(
      (app) => app.status === "Offer" || app.status === "Accepted"
    ).length;
    const rejected = state.applications.filter((app) =>
      app.status.includes("Rejected")
    ).length;

    return { total, interviews, offers, rejected };
  }, [state.applications]);

  if (!auth.ready || !auth.user) return null;

  return (
    <main className="container">
      <div className="grid gap-6">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="m-0 text-[24px] font-bold tracking-[-0.3px]">
                Dashboard
              </h1>
              <p className="mt-2 text-[15px] leading-7 text-[color:var(--muted)]">
                Quick overview of your job search progress, profile readiness,
                and application activity.
              </p>
            </div>
            <Badge>Overview</Badge>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-none">
            <p className="text-[13px] text-[color:var(--muted)]">Total Applications</p>
            <h2 className="mt-2 text-[28px] font-extrabold">{stats.total}</h2>
          </Card>

          <Card className="shadow-none">
            <p className="text-[13px] text-[color:var(--muted)]">Interviews</p>
            <h2 className="mt-2 text-[28px] font-extrabold">{stats.interviews}</h2>
          </Card>

          <Card className="shadow-none">
            <p className="text-[13px] text-[color:var(--muted)]">Offers / Accepted</p>
            <h2 className="mt-2 text-[28px] font-extrabold">{stats.offers}</h2>
          </Card>

          <Card className="shadow-none">
            <p className="text-[13px] text-[color:var(--muted)]">Rejections</p>
            <h2 className="mt-2 text-[28px] font-extrabold">{stats.rejected}</h2>
          </Card>
        </div>

        <Card>
          <h2 className="m-0 text-[18px] font-bold">Next steps</h2>
          <p className="mt-2 text-[14px] leading-7 text-[color:var(--muted)]">
            Continue building your profile, score your resume, and track each
            application from one place.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/profile-setup">
              <Button>Complete profile</Button>
            </Link>

            <Link href="/resume-score">
              <Button variant="secondary">Score resume</Button>
            </Link>

            <Link href="/job-tracker">
              <Button variant="ghost">Open job tracker</Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}