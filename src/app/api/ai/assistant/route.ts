import { NextRequest, NextResponse } from "next/server";
import { callGroqChat } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { event, messages, userPrompt } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey) {
      const systemPrompt = `You are PLANOVA, an expert AI Event Planner & Production Manager.
Current Event Context:
- Title: ${event.title}
- Category: ${event.category}
- Date: ${event.date}
- Location: ${event.location}, ${event.city}
- Guests: ${event.expectedGuests}
- Total Budget: ${event.currency} ${event.totalBudget?.toLocaleString()}
- Strictness: ${event.is_budget_strict ? 'Strict' : 'Flexible'}
- Reserve: ${event.emergency_reserve_percentage}%

Rules:
1. Provide highly structured, practical, actionable advice.
2. Respect the budget and guest count strictly.
3. Identify assumptions and avoid claiming prices are confirmed unless noted as contracted.
4. If the user asks to add a task, formulate a clear title and priority.
5. Keep your tone supportive, polished, and professional.`;

      const groqMessages = [
        { role: "system", content: systemPrompt },
        ...messages.slice(-6).map((m: any) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        })),
        { role: "user", content: userPrompt },
      ];

      const reply = await callGroqChat(groqMessages, false);

      // Check for possible action suggestions
      let actionType: string | undefined;
      let actionPayload: any;

      if (userPrompt.toLowerCase().includes("task") || userPrompt.toLowerCase().includes("todo")) {
        actionType = "create_task";
        actionPayload = {
          title: "Follow up on " + (userPrompt.slice(0, 30) + "..."),
          priority: "high",
        };
      } else if (userPrompt.toLowerCase().includes("budget") || userPrompt.toLowerCase().includes("save")) {
        actionType = "update_budget";
      }

      return NextResponse.json({
        content: reply,
        action_type: actionType,
        action_payload: actionPayload,
        isMock: false,
      });
    }

    // Context-rich fallback assistant response
    let mockContent = `Based on your event **${event.title}** (${event.expectedGuests} guests, ${event.currency} ${event.totalBudget?.toLocaleString()} budget):\n\n`;

    const lower = userPrompt.toLowerCase();
    if (lower.includes("budget") || lower.includes("cost") || lower.includes("save") || lower.includes("reduce")) {
      mockContent += `Here is an actionable cost-saving strategy:\n1. **Catering Rationalization**: Transition from 24 extensive buffet options to 4 signature live stations. This reduces preparation surplus by ~15% while enhancing guest engagement.\n2. **Lighting Architecture**: High-efficiency LED pinspots and amber washes transform venue ambiance with 40% less expenditure than complex hanging floral trusses.\n3. **Preserve Reserve**: Keep your ${event.emergency_reserve_percentage || 8}% contingency fund intact for last-minute guest count adjustments.`;
      return NextResponse.json({
        content: mockContent,
        action_type: "update_budget",
        isMock: true,
      });
    } else if (lower.includes("task") || lower.includes("schedule") || lower.includes("deadline")) {
      mockContent += `Recommended immediate priorities for this week:\n- Finalize stage & audio technician call sheet.\n- Review dietary allergy lists with your catering captain.\n- Send 48-hour RSVP confirmation reminders to pending guests.\n\nWould you like me to add these as tracked items in your Timeline Checklist?`;
      return NextResponse.json({
        content: mockContent,
        action_type: "create_task",
        action_payload: {
          title: "Send 48-hour RSVP confirmation reminder to guests",
          priority: "urgent",
        },
        isMock: true,
      });
    } else if (lower.includes("vendor") || lower.includes("photographer") || lower.includes("decor")) {
      mockContent += `When interviewing vendors for ${event.title}, always verify:\n1. Backup equipment guarantees (e.g., dual memory card cameras, backup power generator).\n2. Load-in and teardown timeline allowances with the venue management.\n3. Structured payment schedule (never pay more than 50% upfront before milestones are met).`;
      return NextResponse.json({
        content: mockContent,
        action_type: "suggest_vendor",
        isMock: true,
      });
    }

    mockContent += `I have reviewed your parameters. To achieve an unforgettable experience for your ${event.expectedGuests} guests, we should balance ambient flow with efficient schedule transitions.\n\nWhat specific dimension would you like to refine next? I can help with:\n- Detailed event day minute-by-minute schedule\n- Customized guest invitations & social announcements\n- Budget reallocation between categories\n- Vendor interview questionnaire`;

    return NextResponse.json({
      content: mockContent,
      isMock: true,
    });
  } catch (err: any) {
    console.error("Error in assistant API:", err);
    return NextResponse.json({ error: err.message || "Failed to process chat" }, { status: 500 });
  }
}
