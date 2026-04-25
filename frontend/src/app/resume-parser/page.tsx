"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";

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

  const email =
    (text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i) ?? [])[0] ?? "";

  const skillsIndex = lines.findIndex((l) =>
    l.toLowerCase().includes("skills")
  );

  let skills: string[] = [];

  if (skillsIndex >= 0) {
    const possibleLines = lines.slice(skillsIndex + 1, skillsIndex + 4);

    skills = possibleLines
      .join(" ")
      .replace(/[:•]/g, "")
      .split(/,|\||\/|-/)
      .map((s) => s.trim())
      .filter((s) => s.length > 2);
  }

  return { name, email, skills };
}

export default function ResumeBuilderPage() {
  const router = useRouter();
  const { actions } = useAuth();

  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const basics = useMemo(() => extractBasics(resumeText), [resumeText]);

  const saveToProfile = () => {
    actions.login({
      email: basics.email || "",
      name: basics.name || "",
      skills: basics.skills || []
    });

    router.push("/profile-setup"); // redirect after saving
  };

  return (
    <main className="container">
      <Card>
        <div>
          <Badge>Auto-detected details</Badge>

          <h1 className="text-2xl font-bold mt-3">
            Extract profile details from your resume
          </h1>

          <p className="mt-2 text-muted leading-relaxed max-w-2xl">
            Paste your resume below. The assistant will identify key details like
            name, email, and skills so you can quickly set up your profile and
            use autofill features.
          </p>
        </div>

        <Divider />

        <div className="grid md:grid-cols-2 gap-6">
          {/* LEFT SIDE */}
          <section>
            <Field label="Resume text">
              <Textarea
                rows={16}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume here..."
              />
            </Field>

            <div className="mt-3 flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setResumeText(SAMPLE_RESUME)}
              >
                Try sample resume
              </Button>

              <Button
                variant="ghost"
                onClick={() => setResumeText("")}
              >
                Clear
              </Button>
            </div>
          </section>

          {/* RIGHT SIDE */}
          <section className="border rounded-2xl p-4 bg-[var(--surface-1)]">
            <h2 className="text-lg font-semibold">Extracted profile</h2>

            <p className="text-muted text-sm mt-1">
              Review and save detected details to your profile.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <div className="text-xs text-[var(--faint)]">Name</div>
                <div className="font-medium">
                  {basics.name || "Not detected"}
                </div>
              </div>

              <div>
                <div className="text-xs text-[var(--faint)]">Email</div>
                <div className="font-medium">
                  {basics.email || "Not detected"}
                </div>
              </div>

              <div>
                <div className="text-xs text-[var(--faint)]">Skills</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {basics.skills.length ? (
                    basics.skills.map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))
                  ) : (
                    <span className="text-muted">
                      Not detected
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5">
              <Button onClick={saveToProfile} className="w-full">
                Save extracted details to profile
              </Button>
            </div>
          </section>
        </div>

        <Divider />
      </Card>
    </main>
  );
}