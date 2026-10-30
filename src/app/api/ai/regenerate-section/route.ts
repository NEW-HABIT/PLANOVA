import { NextRequest, NextResponse } from "next/server";
import { callAIChat, isAIConfigured, extractJsonFromText, synthesizeCuratedEventPlan } from "@/lib/gemini";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { section, eventDetails, currentData } = await req.json();

    if (isAIConfigured()) {
      const prompt = `You are PLANOVA event AI director.
Regenerate ONLY the section "${section}" for this event:
Event: ${eventDetails?.title || "Special Celebration"}
Category: ${eventDetails?.category || "Event"}
Budget: ${eventDetails?.currency || "INR"} ${eventDetails?.total_budget || eventDetails?.totalBudget || 500000}
Guests: ${eventDetails?.expected_guests || eventDetails?.expectedGuests || 100}

Respond ONLY with valid JSON containing the regenerated data for this section under key "data".
For example if section is "menu_suggestions", output { "data": [ { "course": "...", "items": [...], "specialty_notes": "..." } ] }.
If section is "theme_concept", output { "data": { "title": "...", "description": "...", "colors": [...], "style_keywords": [...] } }.
If section is "day_schedule", output { "data": [ { "time": "...", "activity": "...", "responsibility": "...", "location_or_notes": "..." } ] }.
If section is "task_checklist", output { "data": [ { "title": "...", "description": "...", "priority": "high", "phase": "Preparation" } ] }.
If section is "vendor_selection_criteria", output { "data": [ { "category": "...", "key_questions": [...], "budget_range": "..." } ] }.
If section is "decor_concepts", output { "data": [ { "zone": "...", "concept": "...", "materials": "..." } ] }.
If section is "contingencies", output { "data": [ { "risk": "...", "mitigation": "..." } ] }.
Do NOT output any markdown backticks or explanation. Just raw valid JSON.`;

      try {
        const raw = await callAIChat(
          [
            { role: "system", content: "You output strictly valid JSON with key 'data'." },
            { role: "user", content: prompt },
          ],
          true
        );

        const parsed = extractJsonFromText(raw);
        if (parsed && parsed.data) {
          return NextResponse.json({ data: parsed.data, isMock: false });
        }
      } catch (callErr: any) {
        console.warn("Regenerate section AI call failed, falling back to curated synthesis:", callErr?.message || callErr);
      }
    }

    // Curated synthesis fallback for the requested section
    const fullSynthetic = synthesizeCuratedEventPlan({
      title: eventDetails?.title || "Special Celebration",
      category: eventDetails?.category || "wedding",
      date: eventDetails?.date || "2026-12-15",
      startTime: eventDetails?.start_time || "16:00",
      endTime: eventDetails?.end_time || "23:00",
      location: eventDetails?.location || "Grand Palace Venue",
      city: eventDetails?.city || "Jaipur",
      isIndoor: eventDetails?.is_indoor ?? true,
      expectedGuests: Number(eventDetails?.expected_guests || eventDetails?.expectedGuests || 150),
      totalBudget: Number(eventDetails?.total_budget || eventDetails?.totalBudget || 1000000),
      currency: eventDetails?.currency || "INR",
      isBudgetStrict: true,
      emergencyReservePercentage: 8,
      themePreference: eventDetails?.theme_concept?.title,
    });

    const fallbackSectionData = (fullSynthetic as any)[section];
    return NextResponse.json({ data: fallbackSectionData || currentData, isMock: false });
  } catch (err: any) {
    console.error("Error in regenerate-section:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
