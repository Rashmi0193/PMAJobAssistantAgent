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
        "text-[color:var(--muted)] hover:text-[color:var(--text)]",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export function TopNav() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { state: auth, actions: authActions } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("theme");
      const initial = saved === "dark" ? "dark" : "light";
      setTheme(initial);

      if (initial === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    function handleClickOutside() {
      setOpen(false);
    }
  
    if (open) {
      document.addEventListener("click", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    try {
      window.localStorage.setItem("theme", nextTheme);

      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch {
      // ignore
    }
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        backdropFilter: "blur(14px)",
        background: "linear-gradient(to bottom, var(--nav-bg), rgba(0,0,0,0))",
        borderBottom: "1px solid var(--nav-border)",
      }}
    >
      <div
        className="container"
        style={{
          paddingTop: 12,
          paddingBottom: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link href="/" className="flex items-center gap-3">
          <div
            aria-hidden
            className="h-8 w-8 rounded-xl shadow-[0_12px_30px_rgba(109,94,252,0.22)]"
            style={{
              background: "linear-gradient(135deg, var(--brand), var(--brand-2))",
            }}
          />
          <span className="font-extrabold tracking-[-0.3px] text-[color:var(--text)]">
            Job Assistant Agent
          </span>
        </Link>

        <nav
          style={{
            display: "flex",
            gap: 14,
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <NavLink href="/copilot">Copilot</NavLink>
          {!auth.user && <NavLink href="/employers">For Employers</NavLink>}
          <NavLink href="/latest-jobs">Jobs</NavLink>

          {auth.user ? (
            <>
              <span aria-hidden style={{ width: 1, height: 18, background: "var(--border-2)" }} />
              <NavLink href="/jobs-for-you">Jobs for you</NavLink>
              <NavLink href="/job-tracker">Job Tracker</NavLink>
              <NavLink href="/resume-parser">Resume Parser</NavLink>
            </>
          ) : null}

          <span aria-hidden style={{ width: 1, height: 18, background: "var(--border-2)" }} />
          {auth.user ? (
  <div style={{ position: "relative" }}
  onClick={(e) => e.stopPropagation()}
>
    <Button
      variant="ghost"
      onClick={() => setOpen((prev) => !prev)}
      className="px-3 py-2 text-[13px]"
    >
      Profile ▾
    </Button>

    {open && (
      <div
        style={{
          position: "absolute",
          right: 0,
          top: "110%",
          background: "var(--surface-1)",
          border: "1px solid var(--border-1)",
          borderRadius: 12,
          padding: 8,
          minWidth: 160,
          boxShadow: "var(--shadow-soft)",
          zIndex: 50,
        }}
      >
        <Link href="/dashboard">
          <div
            className="px-3 py-2 rounded-lg hover:bg-[color:var(--surface-2)] cursor-pointer text-[14px]"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </div>
        </Link>

        <Link href="/profile-setup">
          <div
            className="px-3 py-2 rounded-lg hover:bg-[color:var(--surface-2)] cursor-pointer text-[14px]"
            onClick={() => setOpen(false)}
          >
            Profile
          </div>
        </Link>

        <div
          className="px-3 py-2 rounded-lg hover:bg-[color:var(--surface-2)] cursor-pointer text-[14px]"
          onClick={() => {
            setOpen(false);
            authActions.logout();
          }}
        >
          Log out
        </div>
      </div>
    )}
  </div>
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

          <Button
            variant="ghost"
            onClick={toggleTheme}
            className="px-3 py-2 text-[13px]"
          >
            {theme === "dark" ? "🔆" : "🔅"}
          </Button>
        </nav>
      </div>
    </header>
  );
}