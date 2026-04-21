"use client";

import { LatestJobs } from "@/components/LatestJobs";

export default function RemoteWorkPage() {
  return (
    <main className="container">
      <LatestJobs preset="remote" />
    </main>
  );
}

