import { NextResponse } from "next/server";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function mockScore(resumeText: string, skills: string[]) {
  const text = (resumeText || "").toLowerCase();
  const hits = (skills || []).filter((s) => text.includes(String(s).toLowerCase())).length;
  return clamp(55 + hits * 7, 30, 96);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    profile?: { skills?: string[] };
    resumeText?: string;
  };

  const skills = body.profile?.skills ?? [];
  const score = mockScore(body.resumeText ?? "", skills);

  return NextResponse.json({
    score,
    strengths: skills.slice(0, 3),
    gaps: ["Accessibility", "Testing strategy", "Performance metrics"],
    tips: [
      "Add 2–3 quantified impact bullets (e.g., reduced bundle size by X%).",
      "Mention accessibility work (keyboard nav, ARIA, contrast).",
      "Include testing examples (unit, integration, e2e) and what you validated."
    ]
  });
}

