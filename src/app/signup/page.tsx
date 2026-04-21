"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { actions } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <main className="container">
      <Card style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <h1 style={{ margin: 0, fontSize: 22, letterSpacing: -0.2 }}>Sign up</h1>
          <Badge>UI-only</Badge>
        </div>
        <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.6 }}>
          Demo page (no real authentication wired up in this assignment).
        </p>
        <Divider />
        <div style={{ display: "grid", gap: 12 }}>
          <Field label="Name">
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label="Email">
            <Input
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Password">
            <Input type="password" placeholder="••••••••" />
          </Field>
          <Button
            disabled={email.trim().length < 4}
            onClick={() => {
              actions.signup({ name, email });
              router.push("/profile-setup");
            }}
          >
            Create account
          </Button>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            Already have an account? <Link href="/login">Log in</Link>
          </div>
        </div>
      </Card>
    </main>
  );
}
