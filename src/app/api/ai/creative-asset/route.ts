import { NextRequest, NextResponse } from "next/server";
import { callAIChat, isAIConfigured, extractJsonFromText } from "@/lib/huggingface";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { type, event } = await req.json();

    if (!isAIConfigured()) {
      return NextResponse.json(
        {
          error: "Something went wrong. Please try again in a moment.",
        },
        { status: 400 }
      );
    }

    const title = event?.title || "Special Celebration";
    const category = event?.category || "celebration";
    const location = event?.location || "the venue";
    const city = event?.city || "our city";
    const date = event?.date || "an upcoming date";
    const time = event?.start_time || "17:00";
    const guests = event?.expected_guests || 150;

    let instructions = "";
    if (type === "invitation") {
      instructions = `Create a captivating, elegant, and warm digital invitation copy for WhatsApp, email, or physical cards. Include event name, date, time, venue, RSVP prompt, and dress code.`;
    } else if (type === "social_post") {
      instructions = `Create a high-energy, viral-ready Instagram and LinkedIn teaser countdown announcement with exciting highlights and hashtags.`;
    } else if (type === "speech") {
      instructions = `Create a heartfelt, memorable 2-minute opening welcome speech and toast for the host, expressing sincere gratitude to guests and setting a wonderful mood.`;
    } else if (type === "schedule") {
      instructions = `Create a professional minute-by-minute VIP emcee cue sheet and transition announcement script with timestamps.`;
    } else {
      instructions = `Create creative, high-touch event copywriting suitable for ${type}.`;
    }

    const prompt = `You are PLANOVA's creative director and copywriter.
Generate a creative asset for the following event:
Event Name: ${title}
Category: ${category}
Date: ${date} at ${time}
Location: ${location}, ${city}
Guests: ${guests} guests

Task: ${instructions}

Respond ONLY with valid JSON matching this schema:
{
  "title": "A short, catchy title for this asset",
  "content": "The complete, polished copy text with formatting and emojis where appropriate",
  "tags": ["Tag1", "Tag2", "Tag3"]
}
Do NOT include markdown code blocks or surrounding commentary. Output raw JSON only.`;

    const raw = await callAIChat(
      [
        { role: "system", content: "You output strictly valid JSON matching the schema." },
        { role: "user", content: prompt },
      ],
      true
    );

    const parsed = extractJsonFromText(raw);
    if (!parsed || !parsed.title || !parsed.content) {
      throw new Error("AI returned incomplete creative asset data.");
    }

    return NextResponse.json({
      title: parsed.title,
      content: parsed.content,
      tags: Array.isArray(parsed.tags) ? parsed.tags : ["Celebration"],
      isMock: false,
    });
  } catch (err: any) {
    console.error("Error in creative-asset API:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
