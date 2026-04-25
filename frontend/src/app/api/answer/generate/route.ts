import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY. Check frontend/.env.local and restart npm run dev." },
      { status: 500 }
    );
  }

  try {
    const body = (await req.json().catch(() => ({}))) as {
      profile?: { name?: string; tone?: string; skills?: string[] };
      job?: { title?: string; company?: string; description?: string };
      question?: string;
    };

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const role = body.job?.title || "the role";
    const company = body.job?.company || "the company";
    const tone = body.profile?.tone || "Warm";
    const question = body.question || "Why this role?";
    const skills = body.profile?.skills?.join(", ") || "React, TypeScript, frontend development";
    const jobDescription = body.job?.description || "";

    const prompt = `
    You are a professional job application assistant.
    
    IMPORTANT RULES:
    - The role is "${role}". You MUST refer to it exactly as "${role}".
    - DO NOT change the role.
    - DO NOT say Frontend Engineer unless the role explicitly says so.
    - If you mention the role, it must be "${role}".
    
    Write an answer for:
    
    Question: ${question}
    Company: ${company}
    
    Candidate background:
    ${skills}
    
    Job description:
    ${jobDescription}
    
    Instructions:
    - Write in first person.
    - Keep it under 120 words.
    - Align skills with the role "${role}".
    - Focus on relevant skills from the job description.
    - Avoid bias toward frontend unless explicitly required.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    return NextResponse.json({
      question,
      text: response.text || "No response generated.",
      status: "Generated"
    });
  } catch (error: any) {
    console.error("Gemini answer generation failed:", error);

    return NextResponse.json(
      {
        error: error?.message || "Failed to generate answer."
      },
      { status: 500 }
    );
  }
}