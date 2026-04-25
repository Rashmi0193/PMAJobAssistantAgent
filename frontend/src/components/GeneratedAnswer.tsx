"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppState } from "@/context/AppStateContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Input";
import { Divider } from "@/components/ui/Divider";

const COMMON_QUESTIONS = [
  "Why are you interested in this role?",
  "Why do you want to work at this company?",
  "Tell us about a project you are proud of.",
  "Describe a challenging bug you fixed.",
  "How does your experience match this role?",
  "What are your strengths for this position?",
  "Describe your experience working in a team.",
  "What is your experience with accessibility?"
];

export function GeneratedAnswer() {
  const { state, actions } = useAppState();

  const [question, setQuestion] = useState(COMMON_QUESTIONS[0]);
  const [draft, setDraft] = useState("");
  const [feedbackNote, setFeedbackNote] = useState("");

  useEffect(() => {
    if (state.generatedAnswer?.text) {
      setDraft(state.generatedAnswer.text);
    }
  }, [state.generatedAnswer?.text]);

  const status = state.generatedAnswer?.status ?? "Draft";
  const statusTone =
    status === "Approved" ? "ok" : status === "Rejected" ? "danger" : "neutral";

  const canCopy = useMemo(() => draft.trim().length > 0, [draft]);
  const hasAnswer = Boolean(state.generatedAnswer);
  const isGenerating = false;
  async function copy() {
    if (!canCopy) return;

    try {
      await navigator.clipboard.writeText(draft);
      actions.notify("Answer copied to clipboard.");
    } catch {
      actions.notify("Unable to copy. Please copy manually.");
    }
  }

  return (
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
          <h2 style={{ margin: 0, fontSize: 18 }}>Tailored Application Answer</h2>

          <p
            style={{
              margin: "6px 0 0",
              color: "var(--muted)",
              lineHeight: 1.5,
              maxWidth: 520
            }}
          >
            Generate a role-specific draft, review it, edit the wording, and copy
            the final answer into your job application.
          </p>
        </div>

        <Badge tone={statusTone as any}>{status}</Badge>
      </div>

      <Divider />

      <div style={{ display: "grid", gap: 14 }}>
        <Field label="Application question">
          <select
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 12,
              background: "var(--surface-2)",
              border: "1px solid var(--border-1)",
              color: "var(--text)",
              outline: "none"
            }}
          >
            {COMMON_QUESTIONS.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </Field>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Button
            disabled={isGenerating}
            onClick={() => actions.runTailoredAnswer(question)}
          >
            {isGenerating ? "Generating..." : "Generate answer"}
          </Button>

          <Button variant="secondary" disabled={!canCopy} onClick={copy}>
            Copy answer
          </Button>

          <Button
            variant="ghost"
            disabled={!hasAnswer}
            onClick={() => actions.approveAnswer()}
          >
            Approve
          </Button>

          <Button
            variant="danger"
            disabled={!hasAnswer}
            onClick={() => actions.rejectAnswer()}
          >
            Reject
          </Button>
        </div>

        <Field
          label="Editable answer draft"
          hint="Always review before submitting. Make sure the answer matches your real experience."
        >
          <Textarea
            rows={10}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Your generated answer will appear here..."
          />
        </Field>

        <Card style={{ boxShadow: "none", background: "var(--surface-2)" }}>
          <h3 style={{ margin: 0, fontSize: 14 }}>Quality feedback</h3>

          <p
            style={{
              margin: "6px 0 12px",
              color: "var(--muted)",
              fontSize: 13,
              lineHeight: 1.5
            }}
          >
            Use feedback to mark whether the generated answer was useful,
            accurate, and relevant to the job.
          </p>

          <Field label="Feedback note" hint="Example: too generic, missing project details, tone is good, needs more keywords.">
            <Textarea
              rows={3}
              value={feedbackNote}
              onChange={(e) => setFeedbackNote(e.target.value)}
              placeholder="Optional feedback..."
            />
          </Field>

          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <Button
              variant="ghost"
              disabled={!hasAnswer}
              onClick={() =>
                actions.submitFeedback({
                  kind: "GeneratedAnswer",
                  rating: "up",
                  note: feedbackNote || undefined
                })
              }
            >
              Helpful 👍
            </Button>

            <Button
              variant="ghost"
              disabled={!hasAnswer}
              onClick={() =>
                actions.submitFeedback({
                  kind: "GeneratedAnswer",
                  rating: "down",
                  note: feedbackNote || undefined
                })
              }
            >
              Not helpful 👎
            </Button>
          </div>
        </Card>
      </div>
    </Card>
  );
}