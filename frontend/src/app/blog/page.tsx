"use client";

import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Badge } from "@/components/ui/Badge";

export default function BlogPage() {
  return (
    <main className="container">
      <Card>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex flex-col gap-1">
            <h1 className="m-0 text-[22px] tracking-[-0.2px]">Blog</h1>
            <p className="m-0 text-[14px] leading-6 text-[color:var(--muted)]">
              Placeholder page for product updates, job search tips, and agentic UX writeups.
            </p>
          </div>
          <Badge>Coming soon</Badge>
        </div>
        <Divider />
        <p className="m-0 text-[14px] leading-7 text-[color:var(--muted)]">
          Suggested posts: “How to tailor resumes quickly”, “How the Copilot stays trustworthy”, and “What gets tracked in the job application dashboard”.
        </p>
      </Card>
    </main>
  );
}

