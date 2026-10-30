import { NextRequest, NextResponse } from "next/server";
import { generateFullEventPlan } from "@/lib/gemini";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await generateFullEventPlan(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in generate-plan route:", error);
    return NextResponse.json(
      { error: "Something went wrong while generating your plan. Please try again." },
      { status: 500 }
    );
  }
}
