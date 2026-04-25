"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";

type FaqItem = {
  q: string;
  a: string;
};

export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Card style={{ boxShadow: "none" }}>
      <h2 style={{ margin: 0, fontSize: 18, letterSpacing: -0.2 }}>FAQ</h2>

      <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.6 }}>
        Common questions about how Copilot helps with applications.
      </p>

      <Divider />

      <div style={{ display: "grid", gap: 10 }}>
        {items.map((it, idx) => {
          const isOpen = open === idx;

          return (
            <div
              key={it.q}
              style={{
                borderRadius: 14,
                border: "1px solid var(--border-1)",
                background: "var(--surface-2)",
                padding: 12,
              }}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : idx)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: "var(--text)",
                  fontWeight: 650,
                }}
              >
                <span>{it.q}</span>
                <span style={{ color: "var(--muted)" }}>{isOpen ? "−" : "+"}</span>
              </button>

              {isOpen ? (
                <p
                  style={{
                    margin: "10px 0 0",
                    color: "var(--muted)",
                    lineHeight: 1.65,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {it.a}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
}