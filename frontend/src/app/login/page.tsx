"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { actions } = useAuth();
  const [email, setEmail] = useState("");

  return (
    <main className="container">
      <Card style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <h1 style={{ margin: 0, fontSize: 22, letterSpacing: -0.2 }}>Log in</h1>
        </div>
        <Divider />
        <div style={{ display: "grid", gap: 12 }}>
        <Field label="Email">
            <Input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Password">
            <Input type="password" placeholder="Demo password" />
          </Field>
          <Button
            disabled={!email.includes("@")}
            onClick={() => {
              actions.login({ email });
              router.push("/profile-setup");
            }}
          >
            Log in
          </Button>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            Demo login stores your session locally for this prototype.
          </div>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            New here? <Link href="/signup">Create an account</Link>
          </div>
        </div>
      </Card>
    </main>
  );
}
