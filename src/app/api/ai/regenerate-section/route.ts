import { NextRequest, NextResponse } from "next/server";
import { callGroqChat } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { section, eventDetails, currentData } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey) {
      const prompt = `You are PLANOVA event AI director.
Regenerate ONLY the section "${section}" for this event:
Event: ${eventDetails?.title || "Special Celebration"}
Category: ${eventDetails?.category || "Event"}
Budget: ${eventDetails?.currency || "INR"} ${eventDetails?.totalBudget || 500000}
Guests: ${eventDetails?.expectedGuests || 100}

Respond ONLY with valid JSON containing the regenerated data for this section under key "data".
For example if section is "menu_suggestions", output { "data": [ { "course": "...", "items": [...], "specialty_notes": "..." } ] }.
If section is "theme_concept", output { "data": { "title": "...", "description": "...", "colors": [...], "style_keywords": [...] } }.
If section is "day_schedule", output { "data": [ { "time": "...", "activity": "...", "responsibility": "...", "location_or_notes": "..." } ] }.`;

      const raw = await callGroqChat(
        [
          { role: "system", content: "You output strictly valid JSON with key 'data'." },
          { role: "user", content: prompt },
        ],
        true
      );

      const parsed = JSON.parse(raw);
      return NextResponse.json({ data: parsed.data, isMock: false });
    }

    // Contextual fallback response for section
    if (section === "theme_concept") {
      return NextResponse.json({
        data: {
          title: "Velvet Twilight & Starlight Amber",
          description: "A reimagined atmospheric aesthetic with deep indigo tones, shimmering amber candelabras, and fragrant white florals creating an intimate, timeless ambiance.",
          colors: ["#1E1B4B", "#4338CA", "#F59E0B", "#FDF4FF"],
          style_keywords: ["Intimate", "Refined", "Luminous", "Couture"],
        },
        isMock: true,
      });
    }

    if (section === "menu_suggestions") {
      return NextResponse.json({
        data: [
          {
            course: "Welcome Infusions",
            items: ["Hibiscus Pomegranate Cooler", "Spiced Kokum Spritzer", "Artisanal Lemongrass Soda"],
            specialty_notes: "Crafted with locally sourced organic herbs and smoked dry ice.",
          },
          {
            course: "Gourmet Small Plates",
            items: ["Truffle Scented Edamame Dumplings", "Galouti Kebab Sliders on Sheermal", "Crispy Avocado Sev Puri"],
            specialty_notes: "Served with micro-cilantro and tangy gooseberry reduction.",
          },
          {
            course: "Main Course Celebration",
            items: ["Kashmiri Rogan Josh with Lotus Root", "Paneer Lababdar with Sun-dried Tomatoes", "Awadhi Dum Biryani", "Zafrani Taftan"],
            specialty_notes: "Slow cooked over fragrant firewood.",
          },
          {
            course: "Dessert Grandeur",
            items: ["Deconstructed Rasmalai Tres Leches", "Dark Chocolate Hazelnut Samosa", "Saffron Pistachio Gelato"],
            specialty_notes: "Finished with 24k edible gold leaf.",
          },
        ],
        isMock: true,
      });
    }

    return NextResponse.json({ data: currentData, isMock: true });
  } catch (err: any) {
    console.error("Error in regenerate-section:", err);
    return NextResponse.json({ error: err.message || "Failed to regenerate section" }, { status: 500 });
  }
}
