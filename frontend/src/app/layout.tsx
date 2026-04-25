import type { Metadata } from "next";
import "./globals.css";
import { AppStateProvider } from "@/context/AppStateContext";
import { AuthProvider } from "@/context/AuthContext";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "AI Job Assistant – Smart Resume & Application Copilot",
  description:
    "Build resumes, generate tailored answers, and manage applications with an AI-powered job assistant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="min-h-screen">
        <AppStateProvider>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <TopNav />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </AppStateProvider>
      </body>
    </html>
  );
}