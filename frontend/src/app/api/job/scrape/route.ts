import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { url?: string };
  const url = body.url ?? "";

  return NextResponse.json({
    title: "Frontend Engineer",
    company: "ExampleCo",
    description:
      "Mock scrape result from /api/job/scrape. Replace this with real extraction (DOM parsing or server-side fetch) later.",
    url
  });
}

