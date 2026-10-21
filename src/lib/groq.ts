import { z } from "zod";
import { GeneratedPlan, Priority } from "@/types";

// Zod schemas for validation
export const GeneratedPlanSchema = z.object({
  overview: z.string(),
  theme_concept: z.object({
    title: z.string(),
    description: z.string(),
    colors: z.array(z.string()),
    style_keywords: z.array(z.string()),
  }),
  budget_breakdown: z.array(
    z.object({
      category: z.string(),
      percentage: z.number(),
      amount: z.number(),
      rationale: z.string(),
    })
  ),
  milestones: z.array(
    z.object({
      title: z.string(),
      due_week: z.string(),
      description: z.string(),
      priority: z.enum(['low', 'medium', 'high', 'urgent'] as [Priority, ...Priority[]]),
    })
  ),
  vendor_selection_criteria: z.array(
    z.object({
      category: z.string(),
      key_questions: z.array(z.string()),
      budget_range: z.string(),
    })
  ),
  task_checklist: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      priority: z.enum(['low', 'medium', 'high', 'urgent'] as [Priority, ...Priority[]]),
      phase: z.string(),
    })
  ),
  day_schedule: z.array(
    z.object({
      time: z.string(),
      activity: z.string(),
      responsibility: z.string(),
      location_or_notes: z.string(),
    })
  ),
  menu_suggestions: z.array(
    z.object({
      course: z.string(),
      items: z.array(z.string()),
      specialty_notes: z.string(),
    })
  ),
  decor_concepts: z.array(
    z.object({
      zone: z.string(),
      concept: z.string(),
      materials: z.string(),
    })
  ),
  contingencies: z.array(
    z.object({
      risk: z.string(),
      mitigation: z.string(),
    })
  ),
});

interface EventInputDetails {
  title: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  city: string;
  isIndoor: boolean;
  expectedGuests: number;
  totalBudget: number;
  currency: string;
  isBudgetStrict: boolean;
  emergencyReservePercentage: number;
  themePreference?: string;
  style?: string;
  foodPreferences?: string[];
  culturalPreferences?: string;
  specialRequests?: string;
}

export async function callGroqChat(messages: Array<{ role: string; content: string }>, jsonMode: boolean = false) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured in environment variables.");
  }

  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 3500,
      response_format: jsonMode ? { type: "json_object" } : undefined,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

export async function generateFullEventPlan(details: EventInputDetails): Promise<{ plan: GeneratedPlan; isMock: boolean }> {
  const apiKey = process.env.GROQ_API_KEY;

  if (apiKey) {
    try {
      const prompt = `You are PLANOVA, an elite Generative AI event-planning director.
Create a complete, masterfully structured event plan for the following event details:
Event Name: ${details.title}
Category: ${details.category}
Date: ${details.date} (from ${details.startTime} to ${details.endTime})
Location: ${details.location}, ${details.city} (${details.isIndoor ? 'Indoor' : 'Outdoor'})
Guest Count: ${details.expectedGuests} guests
Total Budget: ${details.currency} ${details.totalBudget.toLocaleString()} (Strict: ${details.isBudgetStrict ? 'Yes' : 'Flexible'})
Emergency Reserve: ${details.emergencyReservePercentage}%
Theme/Vibe Preference: ${details.themePreference || 'Elegant & Memorable'}
Design Style: ${details.style || 'Elegant'}
Food Preferences: ${details.foodPreferences?.join(', ') || 'Multi-cuisine'}
Cultural Nuances: ${details.culturalPreferences || 'Contemporary with traditional touches'}
Special Requests: ${details.specialRequests || 'Flawless guest experience'}

Respond ONLY with a valid JSON object matching this schema:
{
  "overview": "A compelling 3-4 sentence narrative summarizing the vision and atmosphere of this event.",
  "theme_concept": {
    "title": "Name of theme",
    "description": "Visual and aesthetic description",
    "colors": ["#HEX1", "#HEX2", "#HEX3", "#HEX4"],
    "style_keywords": ["Keyword1", "Keyword2", "Keyword3"]
  },
  "budget_breakdown": [
    { "category": "Category name", "percentage": number, "amount": number, "rationale": "Brief reason" }
  ],
  "milestones": [
    { "title": "Milestone title", "due_week": "T-X weeks", "description": "Action details", "priority": "high|urgent|medium|low" }
  ],
  "vendor_selection_criteria": [
    { "category": "Venue/Catering/etc", "key_questions": ["Question 1", "Question 2"], "budget_range": "Estimated range" }
  ],
  "task_checklist": [
    { "title": "Task title", "description": "Details", "priority": "high|urgent|medium|low", "phase": "Preparation|Execution" }
  ],
  "day_schedule": [
    { "time": "HH:MM", "activity": "Activity name", "responsibility": "Who manages it", "location_or_notes": "Key details" }
  ],
  "menu_suggestions": [
    { "course": "Welcome Drinks / Appetizers / Main / Dessert", "items": ["Dish 1", "Dish 2"], "specialty_notes": "Chef highlights" }
  ],
  "decor_concepts": [
    { "zone": "Entrance / Stage / Dining", "concept": "Visual treatment", "materials": "Fabrics, flora, lighting" }
  ],
  "contingencies": [
    { "risk": "Potential challenge", "mitigation": "Prepared response" }
  ]
}`;

      const rawJson = await callGroqChat(
        [
          { role: "system", content: "You are PLANOVA's principal event production AI. Output strictly valid JSON." },
          { role: "user", content: prompt },
        ],
        true
      );

      const parsed = JSON.parse(rawJson);
      const validated = GeneratedPlanSchema.parse(parsed);
      return { plan: validated, isMock: false };
    } catch (err) {
      console.warn("Groq API call failed or schema validation failed, falling back to smart generator:", err);
    }
  }

  // Smart Context-Aware Fallback Generator (Ensures 100% reliability and speed)
  return { plan: buildSmartContextualPlan(details), isMock: true };
}

function buildSmartContextualPlan(details: EventInputDetails): GeneratedPlan {
  const budget = details.totalBudget;
  const reservePct = details.emergencyReservePercentage || 8;
  const reserveAmt = Math.round((budget * reservePct) / 100);
  const operationalBudget = budget - reserveAmt;

  const isWedding = details.category === "wedding" || details.category === "engagement";
  const isCorporate = details.category === "corporate";
  const isFest = details.category === "college_fest";

  return {
    overview: `A bespoke ${details.style || 'luxurious'} ${details.category} celebration designed for ${details.expectedGuests} cherished guests in ${details.city}. Blending seamless hospitality with captivating aesthetics, this event is curated to evoke lasting memories while strictly honoring the ${details.currency} ${budget.toLocaleString()} budget with an untouched ${reservePct}% contingency safety reserve.`,
    theme_concept: {
      title: details.themePreference || (isWedding ? "Celestial Royalty & Heritage Glow" : isCorporate ? "Modern Nexus: Velocity & Vision" : "Cosmic Symphony & Vibrant Horizons"),
      description: `A curated sensory experience featuring layered ambient illumination, tactile velvet and organza drapery, and signature focal points tailored for ${details.location}.`,
      colors: isWedding ? ["#4338CA", "#7C3AED", "#D97706", "#FDF2F8"] : ["#0F172A", "#6366F1", "#06B6D4", "#F8FAFC"],
      style_keywords: [details.style || "Sophisticated", "Warm Ambient", "High Touch", "Seamless Flow"],
    },
    budget_breakdown: [
      {
        category: "Venue & Infrastructure",
        percentage: 30,
        amount: Math.round(operationalBudget * 0.30),
        rationale: "Secures premier space, staged audio-visuals, climate control, and guest comfort.",
      },
      {
        category: "Catering & Gourmet Hospitality",
        percentage: 35,
        amount: Math.round(operationalBudget * 0.35),
        rationale: `Artisanal dining tailored for ${details.expectedGuests} guests with signature interactive counters.`,
      },
      {
        category: "Decor, Florals & Ambient Light",
        percentage: 15,
        amount: Math.round(operationalBudget * 0.15),
        rationale: "Focal installations, stage backdrop, entrance gateway, and table styling.",
      },
      {
        category: "Photography & Cinematography",
        percentage: 12,
        amount: Math.round(operationalBudget * 0.12),
        rationale: "High-definition candid captures, drone flyover, and 48-hour social teaser reel.",
      },
      {
        category: "Entertainment & Experiences",
        percentage: 8,
        amount: Math.round(operationalBudget * 0.08),
        rationale: "Live artist acoustics, custom emcee coordination, and sound reinforcement.",
      },
      {
        category: "Emergency Reserve",
        percentage: reservePct,
        amount: reserveAmt,
        rationale: "Safeguarded against unforeseen logistics, over-runs, or weather adjustments.",
      },
    ],
    milestones: [
      {
        title: "Secure Venue Contract & License Approvals",
        due_week: "T-8 Weeks",
        description: "Review sound limits, electrical load capacity, and parking valet clearance.",
        priority: "urgent",
      },
      {
        title: "Food Tasting & Signature Menu Lockdown",
        due_week: "T-5 Weeks",
        description: "Sample appetizers and finalize dietary options with catering executive.",
        priority: "high",
      },
      {
        title: "Dispatch Digital & Physical Invitations",
        due_week: "T-4 Weeks",
        description: "Enable RSVP collection links to lock accurate attendance counts.",
        priority: "high",
      },
      {
        title: "Final Technical Run-through & Cue Sheet",
        due_week: "T-1 Week",
        description: "Align sound technicians, emcees, and photographers on minute-by-minute timeline.",
        priority: "medium",
      },
    ],
    vendor_selection_criteria: [
      {
        category: "Venue",
        key_questions: [
          "Is power backup 100% generator covered for the entire duration?",
          "What are the precise sound cut-off hours for outdoor spaces?",
        ],
        budget_range: `${details.currency} ${(operationalBudget * 0.28).toLocaleString()} - ${(operationalBudget * 0.32).toLocaleString()}`,
      },
      {
        category: "Catering",
        key_questions: [
          "What is the staff-to-guest ratio for live food counters?",
          "Are dietary requirements (Jain/Vegan/Nut-free) prepared in segregated zones?",
        ],
        budget_range: `${details.currency} ${(operationalBudget * 0.32).toLocaleString()} - ${(operationalBudget * 0.36).toLocaleString()}`,
      },
    ],
    task_checklist: [
      {
        title: "Confirm floor plan and seating layout",
        description: "Verify emergency exits and unobstructed camera sightlines.",
        priority: "high",
        phase: "Preparation",
      },
      {
        title: "Distribute vendor load-in schedule",
        description: "Ensure decor crew arrives 4 hours ahead of sound check.",
        priority: "urgent",
        phase: "Execution",
      },
      {
        title: "Designate VIP welcome host & hospitality desk",
        description: "Assign 2 point persons for greeting and baggage assistance.",
        priority: "medium",
        phase: "Execution",
      },
    ],
    day_schedule: [
      {
        time: details.startTime || "16:00",
        activity: "Guest Welcome & Refreshment Welcome Drink",
        responsibility: "Hospitality Lead",
        location_or_notes: "Grand Foyer & Welcome Arch",
      },
      {
        time: "17:30",
        activity: "Main Ceremony / Keynote Addresses",
        responsibility: "Production Lead & Emcee",
        location_or_notes: "Central Stage with Focused Spotlight",
      },
      {
        time: "19:30",
        activity: "Gourmet Banquet Service & Live Performances",
        responsibility: "Head Chef & Entertainment Coordinator",
        location_or_notes: "Dining Pavilion",
      },
      {
        time: details.endTime || "22:30",
        activity: "Closing Mementos, Photographs & Farewell",
        responsibility: "Event Host",
        location_or_notes: "Photo Backdrop Zone",
      },
    ],
    menu_suggestions: [
      {
        course: "Welcome Sips & Elixirs",
        items: ["Artisanal Saffron Badam Thandai", "Cucumber Mint Sparkling Cooler", "Berry Blush Spritz"],
        specialty_notes: "Served in chilled vintage crystalware with edible floral garnish.",
      },
      {
        course: "Live Appetizer Theatres",
        items: ["Smoked Paneer Tikka with Basil Chutney", "Crispy Lotus Stem in Sweet Tamarind Glaze", "Amritsari Fish Or Crispy Mushroom Filo Bites"],
        specialty_notes: "Prepared fresh-to-order on live charcoal teppanyaki grills.",
      },
      {
        course: "The Grand Feast",
        items: ["Slow-Simmered Dal Maharani", "Royal Shahi Korma", "Dum Pukht Fragrant Biryani with Burani Raita", "Assorted Artisanal Kulchas"],
        specialty_notes: "Traditional copper degchi presentation with micro-herb garnishes.",
      },
      {
        course: "Dessert Symphony",
        items: ["Warm Saffron Jalebi with Baked Rabri", "Pistachio Baklava Triangles", "Smoked Belgian Chocolate Mousse"],
        specialty_notes: "Paired with warm artisanal filter coffee & Kashmiri Kahwa.",
      },
    ],
    decor_concepts: [
      {
        zone: "Grand Entrance Foyer",
        concept: "Tunnel of cascading micro-fairy lights and fragrance-infused floral arches.",
        materials: "Warm 2700K fairy lights, deep indigo velvet ribbons, fresh brass urns with marigolds.",
      },
      {
        zone: "Central Stage & Backdrop",
        concept: "Architectural arches framed with ombré floral gradient and geometric brass filigree.",
        materials: "Matte blush backdrops, champagne gold metallic arches, uplights with amber diffusers.",
      },
      {
        zone: "Dining Pavilion",
        concept: "Warm banqueting with low crystal centerpieces allowing unobstructed guest conversation.",
        materials: "Raw silk runners, tapered soy candles in wind-proof glass flutes.",
      },
    ],
    contingencies: [
      {
        risk: "Sudden precipitation or heavy wind for outdoor segments",
        mitigation: "Pre-contracted high-peak waterproof marquee canopy with 90-minute deployment guarantee.",
      },
      {
        risk: "Guest count surge beyond 10% tolerance",
        mitigation: "Catering buffer of +15% plates pre-arranged with kitchen manager on 30-min notice.",
      },
    ],
  };
}
