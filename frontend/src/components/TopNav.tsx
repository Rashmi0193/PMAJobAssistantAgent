"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={[
        "rounded-xl px-3 py-2 text-[14px] font-semibold transition-colors",
        active ? "bg-[color:var(--surface-2)]" : "hover:bg-[color:var(--surface-2)]",
        "text-[color:var(--muted)] hover:text-[color:var(--text)]"
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

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
          paddingTop: 12,
          paddingBottom: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Link href="/" className="flex items-center gap-3">
          <div
            aria-hidden
            className="h-8 w-8 rounded-xl shadow-[0_12px_30px_rgba(109,94,252,0.22)]"
            style={{
              background: "linear-gradient(135deg, var(--brand), var(--brand-2))"
            }}
          />
          <span className="font-extrabold tracking-[-0.3px]">Job Assistant</span>
        </Link>
        <nav
          style={{
            display: "flex",
            gap: 14,
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "flex-end"
          }}
        >
          <NavLink href="/copilot">Copilot</NavLink>
          <NavLink href="/employers">Employers</NavLink>
          <NavLink href="/latest-jobs">Jobs</NavLink>
          {auth.user ? (
            <>
              <span aria-hidden style={{ width: 1, height: 18, background: "var(--border-2)" }} />
              <NavLink href="/jobs-for-you">Jobs for you</NavLink>
              <NavLink href="/job-tracker">Job Tracker</NavLink>
              <NavLink href="/resume-builder">Resume Builder</NavLink>
            </>
          ) : null}
          <span aria-hidden style={{ width: 1, height: 18, background: "var(--border-2)" }} />
          {auth.user ? (
            <>
              <NavLink href="/profile-setup">Setup</NavLink>
              <Button variant="ghost" onClick={() => authActions.logout()} className="px-3 py-2 text-[13px]">
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="px-3 py-2 text-[13px]">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="px-3 py-2 text-[13px]">Sign up</Button>
              </Link>
            </>
          )}
          <Button variant="ghost" onClick={toggleTheme} className="px-3 py-2 text-[13px]">
            {theme === "dark" ? "Light" : "Dark"}
          </Button>
        </nav>
      </div>
    </header>
  );
}
