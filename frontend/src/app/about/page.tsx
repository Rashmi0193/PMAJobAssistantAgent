"use client";

import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";

export default function AboutPage() {
  return (
    <main className="container">
      <Card>
        <h1 style={{ margin: 0, fontSize: 22, letterSpacing: -0.2 }}>About</h1>
        <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.6 }}>
          AI-Powered Job Application Assistant demo focused on agentic UX: show the work, require approvals, and capture feedback.
        </p>
        <Divider />
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
          This project is built as a web app (extension-ready UI). Backend intelligence and real scraping/autofill are intentionally mocked for the assignment phase.
        </p>
      </Card>
    </main>
  );
}

