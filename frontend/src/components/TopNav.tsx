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
        active ? "bg-[color:var(--surface-2)] text-[color:var(--text)]" : "text-[color:var(--muted)] hover:text-[color:var(--text)] hover:bg-[color:var(--surface-2)]",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export function TopNav() {
  const { state: auth, actions: authActions } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    const initial = saved === "dark" ? "dark" : "light";
    setTheme(initial);

    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest("#profile-menu")) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);

    window.localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
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
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-xl"
            style={{
              background: "linear-gradient(135deg, var(--brand), var(--brand-2))",
            }}
          />
          <span className="font-extrabold tracking-[-0.3px] text-[color:var(--text)]">
            Job Assistant
          </span>
        </Link>

        {/* Nav */}
        <nav
          style={{
            display: "flex",
            gap: 14,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <NavLink href="/latest-jobs">Jobs</NavLink>
          <NavLink href="/copilot">Copilot</NavLink>
          {!auth.user && <NavLink href="/employers">For Employers</NavLink>}

          {auth.user && (
            <>
              <span style={{ width: 1, height: 18, background: "var(--border-2)" }} />

            </>
          )}

          <span style={{ width: 1, height: 18, background: "var(--border-2)" }} />

          {/* Auth */}
          {auth.user ? (
            <div id="profile-menu" style={{ position: "relative" }}>
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((prev) => !prev);
                }}
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
                    <div className="px-3 py-2 rounded-lg hover:bg-[color:var(--surface-2)] cursor-pointer">
                      Dashboard
                    </div>
                  </Link>

                  <Link href="/profile-setup">
                    <div className="px-3 py-2 rounded-lg hover:bg-[color:var(--surface-2)] cursor-pointer">
                      Profile
                    </div>
                  </Link>

                  <Link href="/job-tracker">
                    <div className="px-3 py-2 rounded-lg hover:bg-[color:var(--surface-2)] cursor-pointer">
                      Job Tracker
                    </div>
                  </Link>

                  <Link href="/jobs-for-you">
                  <div className="px-3 py-2 rounded-lg hover:bg-[color:var(--surface-2)] cursor-pointer">
                    Jobs For You 
                    </div>
                  </Link>


                  <div
                    className="px-3 py-2 rounded-lg hover:bg-[color:var(--surface-2)] cursor-pointer"
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
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            </>
          )}

          {/* Theme toggle */}
          <Button variant="ghost" onClick={toggleTheme}>
            {theme === "dark" ? "🌙" : "☀️"}
          </Button>
        </nav>
      </div>
    </header>
  );
}