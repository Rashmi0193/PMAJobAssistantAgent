"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const SAMPLE_RESUME = `Jane Doe
Frontend Engineer • SF Bay Area • janedoe@email.com

Experience
- Frontend Engineer, ExampleCo (2023–Present)
  • Built React/TypeScript features end-to-end
  • Improved performance and accessibility
  • Wrote tests for critical flows

Skills
React, TypeScript, Next.js, Accessibility, Testing
`;

function extractBasics(text: string) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const name = lines[0] ?? "";
  const email = (text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i) ?? [])[0] ?? "";
  const skillsLine = lines.find((l) => l.toLowerCase().startsWith("skills")) ?? "";
  const skills = skillsLine.includes(",")
    ? skillsLine.replace(/skills/i, "").replace(":", "").split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  return { name, email, skills };
}

export default function ResumeBuilderPage() {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const basics = useMemo(() => extractBasics(resumeText), [resumeText]);

  return (
    <main className="container">
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, letterSpacing: -0.2 }}>Resume builder (demo)</h1>
            <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.6 }}>
              Paste a resume and preview the extracted fields. In the full product, this powers one-click autofill.
            </p>
          </div>
          <Badge>Mock parsing</Badge>
        </div>

        <Divider />

        <Field label="Resume text">
          <Textarea rows={14} value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
        </Field>

        <Divider />

        <div style={{ display: "grid", gap: 10 }}>
          <h2 style={{ margin: 0, fontSize: 16 }}>Extracted fields</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Badge>Name: {basics.name || "—"}</Badge>
            <Badge>Email: {basics.email || "—"}</Badge>
            <Badge>Skills: {basics.skills.length ? basics.skills.slice(0, 6).join(", ") : "—"}</Badge>
          </div>
          <div style={{ marginTop: 8 }}>
            <Button variant="secondary" onClick={() => setResumeText(SAMPLE_RESUME)}>
              Use sample
            </Button>
          </div>
          <p style={{ margin: "10px 0 0", color: "var(--faint)", lineHeight: 1.55, fontSize: 12 }}>
            Next step (extension): map extracted fields to each site’s form inputs and show an approval preview before filling.
          </p>
        </div>
      </Card>
    </main>
  );
}

