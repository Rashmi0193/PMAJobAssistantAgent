"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { state } = useAuth();

  if (!state.ready) {
    return (
      <Card style={{ boxShadow: "none" }}>
        <Badge>Loading…</Badge>
      </Card>
    );
  }

  if (!state.user) {
    return (
      <Card style={{ boxShadow: "none", padding: 18 }}>
        <h1 style={{ margin: 0, fontSize: 20, letterSpacing: -0.2 }}>Log in required</h1>
        <p style={{ margin: "10px 0 0", color: "var(--muted)", lineHeight: 1.6 }}>
          This page is part of the “after login” experience. Use the demo auth flow to continue.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          <Link href="/login">
            <Button>Log in</Button>
          </Link>
          <Link href="/signup">
            <Button variant="secondary">Sign up</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return <>{children}</>;
}

