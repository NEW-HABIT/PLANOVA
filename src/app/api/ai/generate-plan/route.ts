import { NextRequest, NextResponse } from "next/server";
import { generateFullEventPlan } from "@/lib/groq";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await generateFullEventPlan(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in generate-plan route:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate event plan" },
      { status: 500 }
    );
  }
}
