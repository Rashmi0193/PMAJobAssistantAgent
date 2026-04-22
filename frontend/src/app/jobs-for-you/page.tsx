"use client";

import { JobsForYou } from "@/components/JobsForYou";
import { RequireAuth } from "@/components/RequireAuth";

export default function JobsForYouPage() {
  return (
    <main className="container">
      <RequireAuth>
        <JobsForYou />
      </RequireAuth>
    </main>
  );
}

