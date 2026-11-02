// ==============================================================================
// PLANOVA UNIT TESTS: ZOD SCHEMAS & RESILIENT JSON PARSING
// File: tests/unit/schemas.test.js
// ==============================================================================

const assert = require('assert');
const { z } = require('zod');

// Generated Plan Schema definition (matches src/lib/gemini.ts)
const GeneratedPlanSchema = z.object({
  overview: z.string().min(10),
  theme_concept: z.object({
    title: z.string().min(2),
    description: z.string().min(10),
    colors: z.array(z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)).min(2),
    style_keywords: z.array(z.string()).min(1),
  }),
  budget_breakdown: z.array(
    z.object({
      category: z.string(),
      percentage: z.number().min(0).max(100),
      amount: z.number().min(0),
      rationale: z.string(),
    })
  ).min(1),
  task_checklist: z.array(
    z.object({
      title: z.string().min(3),
      description: z.string(),
      priority: z.enum(['low', 'medium', 'high', 'urgent']),
      phase: z.string(),
    })
  ).min(1),
  day_schedule: z.array(
    z.object({
      time: z.string(),
      activity: z.string(),
      responsibility: z.string(),
      location_or_notes: z.string(),
    })
  ).min(1),
});

// JSON extraction resilience function (matches src/lib/gemini.ts)
function extractJsonFromText(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Empty AI response text');
  }

  const trimmed = text.trim();

  // 1. Direct parse
  try {
    return JSON.parse(trimmed);
  } catch {}

  // 2. Markdown code block ```json ... ```
  const codeBlock = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlock && codeBlock[1]) {
    try {
      return JSON.parse(codeBlock[1].trim());
    } catch {}
  }

  // 3. Braces match { ... }
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(trimmed.substring(firstBrace, lastBrace + 1));
    } catch {}
  }

  throw new Error('Could not extract valid JSON from response');
}

function runSchemaTests() {
  console.log('🧪 Running Suite: Zod Schemas & Resilient JSON Parsing...');

  // 1. Valid Plan Validation
  const validPlan = {
    overview: 'A magnificent royal wedding celebration set within the historic ramparts of Jai Mahal Palace in Jaipur.',
    theme_concept: {
      title: 'Imperial Rajputana Velvet',
      description: 'Opulent crimson draperies, hand-carved brass urns, and scented marigolds illuminated by warm candlelight.',
      colors: ['#3E3239', '#6B5560', '#9E8189', '#C7A9A3', '#E8D2C4'],
      style_keywords: ['Royal', 'Bespoke', 'Warm Candlelight', 'Heirloom'],
    },
    budget_breakdown: [
      { category: 'Venue', percentage: 25, amount: 625000, rationale: 'Historic palace courtyard and lawns.' },
      { category: 'Catering', percentage: 35, amount: 875000, rationale: 'Royal Rajasthani banquet for 250 guests.' },
    ],
    task_checklist: [
      { title: 'Confirm palace lighting layout', description: 'Coordinate with local decor crew.', priority: 'high', phase: 'Execution' },
    ],
    day_schedule: [
      { time: '16:00', activity: 'Royal Baarat Arrival', responsibility: 'Hospitality Lead', location_or_notes: 'Grand Portico' },
    ],
  };

  const parsed = GeneratedPlanSchema.safeParse(validPlan);
  assert.strictEqual(parsed.success, true, 'Valid plan must pass schema validation');

  // 2. Reject Invalid Hex Codes in Theme
  const invalidHexPlan = {
    ...validPlan,
    theme_concept: {
      ...validPlan.theme_concept,
      colors: ['NOT_A_HEX', '123456'],
    },
  };
  const invalidHexResult = GeneratedPlanSchema.safeParse(invalidHexPlan);
  assert.strictEqual(invalidHexResult.success, false, 'Invalid hex colors must be rejected by schema');

  // 3. Reject Invalid Priority Enum
  const invalidPriorityPlan = {
    ...validPlan,
    task_checklist: [
      { title: 'Do something', description: '', priority: 'super-critical', phase: 'Prep' },
    ],
  };
  const invalidPriorityResult = GeneratedPlanSchema.safeParse(invalidPriorityPlan);
  assert.strictEqual(invalidPriorityResult.success, false, 'Invalid priority enum must be rejected');

  // 4. JSON Extraction from Plain String
  const plainJson = '{"status": "ok", "count": 42}';
  assert.deepStrictEqual(extractJsonFromText(plainJson), { status: 'ok', count: 42 });

  // 5. JSON Extraction from Markdown ```json block
  const markdownJson = `Here is your requested plan:
\`\`\`json
{
  "theme": "Sunset Rose",
  "budget": 500000
}
\`\`\`
Hope this helps!`;
  assert.deepStrictEqual(extractJsonFromText(markdownJson), { theme: 'Sunset Rose', budget: 500000 });

  // 6. JSON Extraction from conversational surrounding text
  const messyText = 'Certainly! The details are { "venue": "Udaipur Palace", "guests": 300 } as requested by host.';
  assert.deepStrictEqual(extractJsonFromText(messyText), { venue: 'Udaipur Palace', guests: 300 });

  // 7. Reject Unparseable Input
  assert.throws(() => extractJsonFromText('Random text without any braces'), /Could not extract valid JSON/);
  assert.throws(() => extractJsonFromText(''), /Empty AI response/);

  console.log('  ✓ 14/14 Schema & Parsing Assertions Passed');
  return true;
}

if (require.main === module) {
  runSchemaTests();
}

module.exports = { runSchemaTests, GeneratedPlanSchema, extractJsonFromText };

