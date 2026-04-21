"use client";

import { RequireAuth } from "@/components/RequireAuth";
import { ProfileSetupWizard } from "@/components/ProfileSetupWizard";

export default function ProfileSetupPage() {
  return (
    <main className="container">
      <RequireAuth>
        <ProfileSetupWizard />
      </RequireAuth>
    </main>
  );
}

