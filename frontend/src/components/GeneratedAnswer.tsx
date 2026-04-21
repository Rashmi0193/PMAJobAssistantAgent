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
  "Why this role?",
  "Why this company?",
  "Describe a challenging bug you fixed.",
  "Tell me about a project you’re proud of.",
  "What’s your experience with accessibility?"
];

export function GeneratedAnswer() {
  const { state, actions } = useAppState();
  const [question, setQuestion] = useState(COMMON_QUESTIONS[0]);
  const [draft, setDraft] = useState("");
  const [feedbackNote, setFeedbackNote] = useState("");

  useEffect(() => {
    if (state.generatedAnswer?.text) setDraft(state.generatedAnswer.text);
  }, [state.generatedAnswer?.text]);

  const status = state.generatedAnswer?.status ?? "Draft";
  const statusTone = status === "Approved" ? "ok" : status === "Rejected" ? "danger" : "neutral";

  const canCopy = useMemo(() => draft.trim().length > 0, [draft]);

  async function copy() {
    if (!canCopy) return;
    try {
      await navigator.clipboard.writeText(draft);
      actions.notify("Copied to clipboard.");
    } catch {
      actions.notify("Clipboard failed (browser permission).");
    }
  }

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18 }}>Generated answer</h2>
          <p style={{ margin: "6px 0 0", color: "var(--muted)", lineHeight: 1.5 }}>
            The agent drafts; you review, edit, and approve. Feedback improves quality over time.
          </p>
        </div>
        <Badge tone={statusTone as any}>Status: {status}</Badge>
      </div>

      <Divider />

      <div style={{ display: "grid", gap: 12 }}>
        <Field label="Question">
          <select
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 12,
              background: "var(--surface-2)",
              border: "1px solid var(--border-1)"
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
          <Button onClick={() => actions.runTailoredAnswer(question)}>Generate</Button>
          <Button variant="secondary" disabled={!canCopy} onClick={copy}>
            Copy
          </Button>
          <Button variant="ghost" onClick={() => actions.approveAnswer()} disabled={!state.generatedAnswer}>
            Approve
          </Button>
          <Button variant="danger" onClick={() => actions.rejectAnswer()} disabled={!state.generatedAnswer}>
            Reject
          </Button>
          <div style={{ flex: 1 }} />
          <Button
            variant="ghost"
            disabled={!state.generatedAnswer}
            onClick={() => actions.submitFeedback({ kind: "GeneratedAnswer", rating: "up", note: feedbackNote || undefined })}
          >
            👍
          </Button>
          <Button
            variant="ghost"
            disabled={!state.generatedAnswer}
            onClick={() => actions.submitFeedback({ kind: "GeneratedAnswer", rating: "down", note: feedbackNote || undefined })}
          >
            👎
          </Button>
        </div>

        <Field label="Draft (editable)">
          <Textarea
            rows={9}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Generate an answer to edit it here…"
          />
        </Field>

        <Field label="Feedback note (optional)" hint="What was good/bad? Tone? Accuracy? Missing details?">
          <Textarea rows={2} value={feedbackNote} onChange={(e) => setFeedbackNote(e.target.value)} />
        </Field>
      </div>
    </Card>
  );
}
