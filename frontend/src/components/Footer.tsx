"use client";

import Link from "next/link";
import { Divider } from "@/components/ui/Divider";

export function Footer() {
  return (
    <footer className="container" style={{ paddingTop: 18, paddingBottom: 28 }}>
      <Divider style={{ margin: "10px 0 16px" }} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          color: "var(--muted)",
          fontSize: 13
        }}
      >
        <div>AI-Powered Job Application Assistant</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/job-tracker">Job Tracker</Link>
          <Link href="/resume-builder">Resume Builder</Link>
          <Link href="/resume-score">Resume Review</Link>
          <Link href="/latest-jobs">Latest Jobs</Link>
          <Link href="/remote">Remote Work</Link>
          <Link href="/internships">Internships</Link>
          <Link href="/about">About</Link>
        </div>
      </div>
    </footer>
  );
}
