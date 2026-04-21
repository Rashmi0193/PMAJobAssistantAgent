"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export function TopNav() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { state: auth, actions: authActions } = useAuth();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("theme");
      const initial = saved === "dark" ? "dark" : "light";
      setTheme(initial);
      document.documentElement.dataset.theme = initial;
    } catch {
      // ignore
    }
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      // ignore
    }
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        backdropFilter: "blur(14px)",
        background: "linear-gradient(to bottom, var(--nav-bg), rgba(0,0,0,0))",
        borderBottom: "1px solid var(--nav-border)"
      }}
    >
      <div
        className="container"
        style={{
          paddingTop: 14,
          paddingBottom: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            aria-hidden
            style={{
              width: 28,
              height: 28,
              borderRadius: 10,
              background:
                "linear-gradient(135deg, var(--brand), var(--brand-2))",
              boxShadow: "0 10px 30px rgba(109,94,252,0.18)"
            }}
          />
          <span style={{ fontWeight: 700, letterSpacing: -0.2 }}>
            Job Application Assistant
          </span>
        </Link>
        <nav
          style={{
            display: "flex",
            gap: 14,
            color: "var(--muted)",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "flex-end"
          }}
        >
          <Link href="/copilot">Copilot</Link>
          <Link href="/job-tracker">Job Tracker</Link>
          <Link href="/resume-builder">Resume Builder</Link>
          <Link href="/latest-jobs">Latest Jobs</Link>
          <Link href="/employers">Employers</Link>
          <span aria-hidden style={{ width: 1, height: 18, background: "var(--border-2)" }} />
          {auth.user ? (
            <>
              <Link href="/profile-setup" style={{ color: "var(--muted)" }}>
                Setup
              </Link>
              <Button
                variant="ghost"
                onClick={() => authActions.logout()}
                style={{ padding: "8px 10px" }}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" style={{ padding: "8px 10px" }}>
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button style={{ padding: "8px 10px" }}>Sign up</Button>
              </Link>
            </>
          )}
          <Button variant="ghost" onClick={toggleTheme} style={{ padding: "8px 10px" }}>
            {theme === "dark" ? "Light" : "Dark"}
          </Button>
        </nav>
      </div>
    </header>
  );
}
