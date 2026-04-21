import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { profile?: unknown };
  return NextResponse.json({ ok: true, received: body.profile ?? null });
}

