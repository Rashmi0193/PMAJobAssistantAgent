"use client";

import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";

export default function AboutPage() {
  return (
    <main className="container">
      <Card>
        <h1 style={{ margin: 0, fontSize: 22, letterSpacing: -0.2 }}>
          About
        </h1>

        <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.6 }}>
          This project is an AI-powered job application copilot designed to assist users throughout the application process — from understanding job descriptions to generating tailored responses and safely autofilling forms.
        </p>

        <Divider />

        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
          The core idea behind this project is <b>agentic UX</b> — building AI systems that are transparent, controllable, and user-first. Instead of blindly automating actions, the system focuses on preview-first workflows, requiring user approval before applying changes, and providing clear feedback at every step.
        </p>

        <Divider />

        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
          Key capabilities include:
        </p>

        <ul style={{ marginTop: 8, color: "var(--muted)", lineHeight: 1.7 }}>
          <li>Preview-first autofill with user approval before applying data</li>
          <li>Resume-to-job description matching and scoring</li>
          <li>AI-assisted generation of tailored application responses</li>
          <li>Context-aware interaction with job application pages via browser extension</li>
          <li>Profile-based personalization using stored user data</li>
        </ul>

        <Divider />

        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
        The system is built as a modern web application using <b>Next.js</b> with an extension-ready architecture, enabling seamless integration with real-world job platforms.        </p>

        <Divider />

        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
          This project focuses not only on functionality, but on designing AI interactions that users can trust — emphasizing clarity, safety, and control.
        </p>
      </Card>
    </main>
  );
}