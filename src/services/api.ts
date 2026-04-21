import type { GeneratedAnswer, Profile, ResumeAnalysis } from "@/context/AppStateContext";
import { postJson } from "@/services/apiClient";

type AnalyzeInput = {
  profile: Profile;
  job: { title: string; company: string; description: string };
  resumeText: string;
};

type TailoredAnswerInput = {
  profile: Profile;
  job: { title: string; company: string; description: string };
  question: string;
};

type ScrapeJobInput = { url: string };

type AutofillInput = {
  site: string;
  fields: Array<{ key: string; label: string; value: string }>;
};

async function safePost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  try {
    return await postJson<T>(path, body);
  } catch {
    // Fallback for environments where the Next.js route isn't reachable (static-only / preview).
    throw new Error("api_unavailable");
  }
}

export const api = {
  async saveProfile(profile: Profile): Promise<void> {
    await safePost<{ ok: boolean }>("/api/profile", { profile });
  },

  async scrapeJobPosting(input: ScrapeJobInput): Promise<{
    title: string;
    company: string;
    description: string;
    url?: string;
  }> {
    return await safePost("/api/job/scrape", { url: input.url });
  },

  async analyzeResume(input: AnalyzeInput): Promise<ResumeAnalysis> {
    return await safePost("/api/resume/analyze", {
      profile: input.profile,
      job: input.job,
      resumeText: input.resumeText
    });
  },

  async generateTailoredAnswer(input: TailoredAnswerInput): Promise<GeneratedAnswer> {
    return await safePost("/api/answer/generate", {
      profile: input.profile,
      job: input.job,
      question: input.question
    });
  },

  async simulateAutofill(input: AutofillInput): Promise<void> {
    await safePost<{ ok: boolean }>("/api/autofill/simulate", {
      site: input.site,
      fields: input.fields
    });
  }
};
