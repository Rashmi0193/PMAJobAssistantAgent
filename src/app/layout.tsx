import type { Metadata } from "next";
import "./globals.css";
import { AppStateProvider } from "@/context/AppStateContext";
import { AuthProvider } from "@/context/AuthContext";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "AI-Powered Job Application Assistant",
  description: "Agentic UX frontend for an AI Job Assistant"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppStateProvider>
            <TopNav />
            {children}
            <Footer />
          </AppStateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
