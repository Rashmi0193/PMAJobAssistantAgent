import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    profile?: { name?: string; tone?: string };
    job?: { title?: string; company?: string };
    question?: string;
  };

  const name = body.profile?.name?.trim() || "I";
  const role = body.job?.title || "the role";
  const company = body.job?.company || "the company";
  const tone = body.profile?.tone || "Warm";

  const opener =
    tone === "Direct"
      ? `I'm excited about the ${role} role at ${company} because it matches how I build product-focused, reliable UIs.`
      : tone === "Confident"
        ? `The ${role} role at ${company} is a strong fit for me because I consistently ship high-quality UI with measurable impact.`
        : `I’m excited about the ${role} role at ${company} because it’s a great match for how I like to build thoughtful, user-centered interfaces.`;

  const bodyText = `In my recent work, I’ve built React/TypeScript features end-to-end—partnering with design, refining UX details, and keeping performance and accessibility in mind. I’d bring that same approach to ${company}: ship incrementally, measure outcomes, and keep the experience polished for users.`;

  const closer = `${name === "I" ? "I’m" : `${name} is`} especially interested in collaborating cross-functionally and turning product requirements into clean, maintainable UI.`;

  return NextResponse.json({
    question: body.question ?? "Why this role?",
    text: `${opener}\n\n${bodyText}\n\n${closer}`,
    status: "Draft"
  });
}

