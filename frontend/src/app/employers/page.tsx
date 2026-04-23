"use client";

import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Badge } from "@/components/ui/Badge";

export default function EmployersPage() {
  
  const features = [
    {
      title: "Smarter applicant review",
      text: "Help employers quickly understand candidate fit by comparing resumes against role requirements."
    },
    {
      title: "Structured candidate insights",
      text: "Highlight strengths, missing skills, and role-alignment signals in a clear format."
    },
    {
      title: "Better candidate experience",
      text: "Encourage applicants to submit stronger, more relevant applications before they apply."
    }
  ];

  const workflow = [
    "Post or import a job description",
    "Review candidate profiles and resume match signals",
    "Identify strengths, gaps, and follow-up questions",
    "Move qualified candidates into the next hiring stage"
  ];

  return (
    <main className="container">
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "flex-start"
          }}
        >
          <div>
            <Badge>Employer tools</Badge>
            <h1 style={{ margin: "12px 0 0", fontSize: 28, letterSpacing: -0.4 }}>
              Hire with clearer candidate signals
            </h1>
            <p style={{ margin: "10px 0 0", color: "var(--muted)", lineHeight: 1.7, maxWidth: 1020}}>
              The employer view is designed to help hiring teams understand candidate fit faster using
              resume-to-job matching, structured insights, and application context.
            </p>
          </div>
        </div>

        <Divider />

        <section>
          <h2 style={{ margin: 0, fontSize: 18 }}>What employers can do</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              marginTop: 14
            }}
          >
            {features.map((feature) => (
              <div
                key={feature.title}
                style={{
                  padding: 16,
                  border: "1px solid var(--border-1)",
                  borderRadius: 16,
                  background: "var(--surface-1)"
                }}
              >
                <h3 style={{ margin: 0, fontSize: 16 }}>{feature.title}</h3>
                <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.6 }}>
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        <section>
          <h2 style={{ margin: 0, fontSize: 18 }}>Planned workflow</h2>
          <ol style={{ margin: "12px 0 0", paddingLeft: 20, color: "var(--muted)", lineHeight: 1.8 }}>
            {workflow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <Divider />

        <section
          style={{
            padding: 18,
            borderRadius: 18,
            background: "var(--surface-2)",
            border: "1px solid var(--border-2)"
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18 }}>Current project scope</h2>
          <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.7 }}>
            This phase focuses mainly on the candidate-side experience: profile setup, job tracking,
            resume scoring, tailored answer generation, and preview-first autofill. The employer view
            is included to show how the product could expand into a two-sided hiring platform.
          </p>
        </section>
      </Card>
    </main>
  );
}