"use client";

import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Badge } from "@/components/ui/Badge";

export default function EmployersPage() {
  return (
    <main className="container">
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, letterSpacing: -0.2 }}>Employers</h1>
            <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.6 }}>
              Placeholder page for an employer view (out of scope for this phase). This is here to complete the landing-page navigation.
            </p>
          </div>
          <Badge>Coming soon</Badge>
        </div>
        <Divider />
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>
          Future ideas: job posting management, applicant pipeline, and structured feedback for candidates.
        </p>
      </Card>
    </main>
  );
}

