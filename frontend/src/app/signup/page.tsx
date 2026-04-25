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

export default function SignupPage() {
  const router = useRouter();
  const { actions } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValidName = name.trim().length >= 2;
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isValidPassword = password.length >= 8;

  const isFormValid = isValidName && isValidEmail && isValidPassword;

  const handleSignup = () => {
    if (!isFormValid) return;

    // Demo/local signup for frontend flow testing.
    // Replace this with backend /auth/signup API call once backend is ready.
    actions.signup({
      name: name.trim(),
      email: email.trim(),
    });

    router.push("/profile-setup");
  };

  return (
    <main className="container">
      <Card style={{ maxWidth: 520, margin: "0 auto" }}>
        <h1 style={{ margin: 0, fontSize: 22, letterSpacing: -0.2 }}>
          Sign up
        </h1>

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
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field label="Password">
            <Input
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <Button disabled={!isFormValid} onClick={handleSignup}>
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