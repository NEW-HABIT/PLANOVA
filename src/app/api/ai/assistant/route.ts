import { NextRequest, NextResponse } from "next/server";
import { callAIChat, isAIConfigured } from "@/lib/gemini";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { event, messages, userPrompt } = await req.json();

    if (!userPrompt || !userPrompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Normalize event parameters
    const title = event?.title || "Your Celebration";
    const category = event?.category || "celebration";
    const guests = Number(event?.expected_guests || event?.expectedGuests || 150);
    const totalBudget = Number(event?.total_budget || event?.totalBudget || 1000000);
    const currency = event?.currency || "INR";
    const city = event?.city || "your city";
    const location = event?.location || "the venue";
    const date = event?.date || "upcoming";
    const reservePct = Number(event?.emergency_reserve_percentage || 8);
    const reserveAmt = Math.round((totalBudget * reservePct) / 100);
    const isStrict = event?.is_budget_strict ?? true;

    let reply = "";

    if (isAIConfigured()) {
      const systemPrompt = `You are PLANOVA, a thoughtful, polite, warm, and highly capable wedding & event planning consultant.
Current Event Context:
- Celebration: ${title}
- Category: ${category}
- Scheduled Date: ${date}
- Location: ${location}, ${city}
- Expected Guests: ${guests}
- Total Budget: ${currency} ${totalBudget.toLocaleString()} (Strict: ${isStrict ? 'Yes' : 'Flexible'})
- Safety Contingency Buffer: ${reservePct}% (${currency} ${reserveAmt.toLocaleString()})

Communication & Tone Guidelines:
1. Tone: Always be polite, warm, courteous, and speak naturally like a supportive, elegant event planner.
2. NO robotic, military, or overly corporate jargon. NEVER use stiff phrases like "I am locked in and ready to direct", "Production Baseline", "Financial Metrics Baseline", "planning agenda", or "Executive Overview".
3. Friendly Greetings: Greet the user warmly and politely (e.g. "Hello! It's a pleasure to assist you with...", "Warm greetings!").
4. Clear & Readable Formatting: Use neat, friendly bullet points and simple section titles (e.g., "Event Summary", "Budget Overview", "Suggested Next Steps").
5. Financial Tact: When discussing numbers, be helpful and encouraging (e.g., "Working budget", "Safety reserve set aside", "Approx. per-guest allocation").
6. Polite Wrap-up: Close by asking how you can help in a friendly, courteous way (e.g., "What area would you like to explore next? Feel free to ask me anything!").
7. Directly answer whatever the user asks with practical, tasteful, and helpful suggestions.`;

      const aiMessages = [
        { role: "system", content: systemPrompt },
        ...(messages || []).slice(-8).map((m: any) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        })),
        { role: "user", content: userPrompt },
      ];

      try {
        reply = await callAIChat(aiMessages, false);
      } catch (callErr: any) {
        console.warn("Assistant call error:", callErr?.message || callErr);
      }
    }

    if (!reply) {
      reply = "Something went wrong. Please try again in a moment.";
    }

    const lower = userPrompt.toLowerCase().trim();
    let actionType: string | undefined;
    let actionPayload: any;

    if (lower.includes("task") || lower.includes("todo") || lower.includes("finish") || lower.includes("checklist")) {
      actionType = "create_task";
      actionPayload = {
        title: "Finalize " + (userPrompt.replace(/^(what|can you|please|add)\s*/i, '').slice(0, 45)),
        priority: "high",
      };
    } else if (lower.includes("budget") || lower.includes("save") || lower.includes("reduce")) {
      actionType = "update_budget";
    }

    return NextResponse.json({
      content: reply,
      action_type: actionType,
      action_payload: actionPayload,
      isMock: false,
    });
  } catch (err: any) {
    console.error("Error in assistant API:", err);
    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
