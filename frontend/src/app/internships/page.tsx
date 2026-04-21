"use client";

import { LatestJobs } from "@/components/LatestJobs";

export default function InternshipsPage() {
  return (
    <main className="container">
      <LatestJobs preset="internships" />
    </main>
  );
}

