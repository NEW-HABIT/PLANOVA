import { BudgetCategoryItem, EventCategory, VendorCategory } from "@/types";

export interface CategoryAllocationPreset {
  category: VendorCategory | 'emergency_reserve' | 'miscellaneous';
  name: string;
  defaultPercentage: number;
  color: string;
}

export const CATEGORY_COLORS: Record<string, string> = {
  venue: '#4338CA', // Deep indigo
  catering: '#7C3AED', // Electric violet
  decoration: '#EC4899', // Pink
  photography: '#3B82F6', // Blue
  videography: '#06B6D4', // Cyan
  makeup_artist: '#F43F5E', // Rose
  dj_entertainment: '#8B5CF6', // Purple
  transportation: '#10B981', // Emerald
  accommodation: '#F59E0B', // Amber
  invitations: '#6366F1', // Indigo light
  gifts: '#14B8A6', // Teal
  emergency_reserve: '#EF4444', // Red / Warning
  miscellaneous: '#64748B', // Slate
  other: '#94A3B8',
};

export const DEFAULT_CATEGORY_PRESETS: Record<EventCategory, CategoryAllocationPreset[]> = {
  wedding: [
    { category: 'venue', name: 'Venue & Staging', defaultPercentage: 25, color: CATEGORY_COLORS.venue },
    { category: 'catering', name: 'Catering & Beverages', defaultPercentage: 30, color: CATEGORY_COLORS.catering },
    { category: 'decoration', name: 'Floral & Decor', defaultPercentage: 15, color: CATEGORY_COLORS.decoration },
    { category: 'photography', name: 'Photo & Videography', defaultPercentage: 12, color: CATEGORY_COLORS.photography },
    { category: 'makeup_artist', name: 'Bridal & Groom Styling', defaultPercentage: 4, color: CATEGORY_COLORS.makeup_artist },
    { category: 'dj_entertainment', name: 'Music & Entertainment', defaultPercentage: 4, color: CATEGORY_COLORS.dj_entertainment },
    { category: 'invitations', name: 'Invitations & Favors', defaultPercentage: 3, color: CATEGORY_COLORS.invitations },
    { category: 'emergency_reserve', name: 'Emergency Contingency', defaultPercentage: 7, color: CATEGORY_COLORS.emergency_reserve },
  ],
  birthday: [
    { category: 'venue', name: 'Venue Rental', defaultPercentage: 20, color: CATEGORY_COLORS.venue },
    { category: 'catering', name: 'Food, Cake & Drinks', defaultPercentage: 35, color: CATEGORY_COLORS.catering },
    { category: 'decoration', name: 'Theme Decor & Balloons', defaultPercentage: 18, color: CATEGORY_COLORS.decoration },
    { category: 'dj_entertainment', name: 'Games & Entertainment', defaultPercentage: 12, color: CATEGORY_COLORS.dj_entertainment },
    { category: 'photography', name: 'Photography', defaultPercentage: 7, color: CATEGORY_COLORS.photography },
    { category: 'emergency_reserve', name: 'Emergency Contingency', defaultPercentage: 8, color: CATEGORY_COLORS.emergency_reserve },
  ],
  corporate: [
    { category: 'venue', name: 'Conference Venue & AV', defaultPercentage: 35, color: CATEGORY_COLORS.venue },
    { category: 'catering', name: 'Corporate Dining & Coffee', defaultPercentage: 25, color: CATEGORY_COLORS.catering },
    { category: 'photography', name: 'Media & Recording', defaultPercentage: 10, color: CATEGORY_COLORS.photography },
    { category: 'decoration', name: 'Branding & Signage', defaultPercentage: 10, color: CATEGORY_COLORS.decoration },
    { category: 'dj_entertainment', name: 'Keynote & Hosts', defaultPercentage: 10, color: CATEGORY_COLORS.dj_entertainment },
    { category: 'emergency_reserve', name: 'Emergency Contingency', defaultPercentage: 10, color: CATEGORY_COLORS.emergency_reserve },
  ],
  anniversary: [
    { category: 'venue', name: 'Dinner Venue', defaultPercentage: 30, color: CATEGORY_COLORS.venue },
    { category: 'catering', name: 'Fine Dining & Drinks', defaultPercentage: 35, color: CATEGORY_COLORS.catering },
    { category: 'decoration', name: 'Ambient Florals & Lights', defaultPercentage: 15, color: CATEGORY_COLORS.decoration },
    { category: 'photography', name: 'Portraits & Memories', defaultPercentage: 12, color: CATEGORY_COLORS.photography },
    { category: 'emergency_reserve', name: 'Emergency Reserve', defaultPercentage: 8, color: CATEGORY_COLORS.emergency_reserve },
  ],
  engagement: [
    { category: 'venue', name: 'Banquet Venue', defaultPercentage: 30, color: CATEGORY_COLORS.venue },
    { category: 'catering', name: 'Buffet & Appetizers', defaultPercentage: 30, color: CATEGORY_COLORS.catering },
    { category: 'decoration', name: 'Stage & Rings Backdrop', defaultPercentage: 16, color: CATEGORY_COLORS.decoration },
    { category: 'photography', name: 'Couple Photography', defaultPercentage: 12, color: CATEGORY_COLORS.photography },
    { category: 'dj_entertainment', name: 'Music System & DJ', defaultPercentage: 5, color: CATEGORY_COLORS.dj_entertainment },
    { category: 'emergency_reserve', name: 'Emergency Reserve', defaultPercentage: 7, color: CATEGORY_COLORS.emergency_reserve },
  ],
  college_fest: [
    { category: 'venue', name: 'Stage, Truss & Sound', defaultPercentage: 30, color: CATEGORY_COLORS.venue },
    { category: 'dj_entertainment', name: 'Celebrity/Artist & Band', defaultPercentage: 35, color: CATEGORY_COLORS.dj_entertainment },
    { category: 'decoration', name: 'Stalls, Lights & Banners', defaultPercentage: 12, color: CATEGORY_COLORS.decoration },
    { category: 'photography', name: 'Campus Coverage & Video', defaultPercentage: 8, color: CATEGORY_COLORS.photography },
    { category: 'catering', name: 'Guest & Crew Refreshments', defaultPercentage: 8, color: CATEGORY_COLORS.catering },
    { category: 'emergency_reserve', name: 'Safety & Reserve', defaultPercentage: 7, color: CATEGORY_COLORS.emergency_reserve },
  ],
  community: [
    { category: 'venue', name: 'Community Center / Ground', defaultPercentage: 25, color: CATEGORY_COLORS.venue },
    { category: 'catering', name: 'Community Feast / Snacks', defaultPercentage: 35, color: CATEGORY_COLORS.catering },
    { category: 'decoration', name: 'Pandal & Lighting', defaultPercentage: 20, color: CATEGORY_COLORS.decoration },
    { category: 'dj_entertainment', name: 'Cultural Programs & Sound', defaultPercentage: 10, color: CATEGORY_COLORS.dj_entertainment },
    { category: 'emergency_reserve', name: 'Emergency Fund', defaultPercentage: 10, color: CATEGORY_COLORS.emergency_reserve },
  ],
  other: [
    { category: 'venue', name: 'Venue', defaultPercentage: 30, color: CATEGORY_COLORS.venue },
    { category: 'catering', name: 'Food & Drinks', defaultPercentage: 30, color: CATEGORY_COLORS.catering },
    { category: 'decoration', name: 'Decor', defaultPercentage: 15, color: CATEGORY_COLORS.decoration },
    { category: 'photography', name: 'Media', defaultPercentage: 10, color: CATEGORY_COLORS.photography },
    { category: 'emergency_reserve', name: 'Contingency', defaultPercentage: 15, color: CATEGORY_COLORS.emergency_reserve },
  ],
};

export function generateInitialBudgetCategories(
  eventId: string,
  totalBudget: number,
  category: EventCategory,
  customReservePercentage?: number
): BudgetCategoryItem[] {
  const presets = DEFAULT_CATEGORY_PRESETS[category] || DEFAULT_CATEGORY_PRESETS.other;
  
  const reservePct = typeof customReservePercentage === 'number' && customReservePercentage >= 0
    ? customReservePercentage
    : 8;

  // Normalize percentages so sum equals 100%
  const nonReservePresets = presets.filter(p => p.category !== 'emergency_reserve');
  const totalPresetNonReserve = nonReservePresets.reduce((sum, p) => sum + p.defaultPercentage, 0);
  const remainingPct = 100 - reservePct;

  const result: BudgetCategoryItem[] = [];

  let allocatedSum = 0;

  nonReservePresets.forEach((p, idx) => {
    const adjustedPct = Math.round((p.defaultPercentage / totalPresetNonReserve) * remainingPct);
    const amount = Math.round((adjustedPct / 100) * totalBudget);
    allocatedSum += amount;

    result.push({
      id: `cat_${eventId}_${idx + 1}`,
      event_id: eventId,
      name: p.name,
      category: p.category,
      percentage: adjustedPct,
      allocated_amount: amount,
      spent_amount: 0,
      color: p.color,
    });
  });

  // Emergency reserve gets the remaining amount so exact sum equals totalBudget
  const reserveAmount = Math.max(0, totalBudget - allocatedSum);
  const calculatedReservePct = totalBudget > 0 ? Math.round((reserveAmount / totalBudget) * 100) : reservePct;

  result.push({
    id: `cat_${eventId}_reserve`,
    event_id: eventId,
    name: 'Emergency Reserve',
    category: 'emergency_reserve',
    percentage: calculatedReservePct,
    allocated_amount: reserveAmount,
    spent_amount: 0,
    color: CATEGORY_COLORS.emergency_reserve,
  });

  return result;
}

export function calculateBudgetMetrics(
  totalBudget: number,
  categories: BudgetCategoryItem[],
  expenses: { amount: number; category_id: string }[]
) {
  const totalAllocated = categories.reduce((sum, c) => sum + (c.allocated_amount || 0), 0);
  const totalSpent = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const remainingBudget = totalBudget - totalSpent;
  const isOverBudget = totalSpent > totalBudget;
  const spentPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  // Breakdown by category
  const categoriesWithSpending = categories.map((cat) => {
    const catExpenses = expenses.filter((e) => e.category_id === cat.id);
    const catSpent = catExpenses.reduce((sum, e) => sum + e.amount, 0);
    const catRemaining = cat.allocated_amount - catSpent;
    const catIsOver = catSpent > cat.allocated_amount;
    const catSpentPct = cat.allocated_amount > 0 ? Math.round((catSpent / cat.allocated_amount) * 100) : 0;

    return {
      ...cat,
      spent_amount: catSpent,
      remaining_amount: catRemaining,
      is_over: catIsOver,
      spent_percentage: catSpentPct,
    };
  });

  return {
    totalBudget,
    totalAllocated,
    totalSpent,
    remainingBudget,
    isOverBudget,
    spentPercentage,
    categoriesWithSpending,
  };
}

export function generateCostSavingRecommendations(
  categoriesWithSpending: ReturnType<typeof calculateBudgetMetrics>['categoriesWithSpending'],
  currency: string = 'INR'
) {
  const tips: { category: string; saving: string; tip: string; potentialSavingsPercent: number }[] = [];

  categoriesWithSpending.forEach((cat) => {
    if (cat.category === 'catering') {
      tips.push({
        category: 'Catering',
        saving: 'Up to 15% reduction',
        tip: 'Consider a live buffet counter with fewer overlapping dessert varieties; seasonal produce significantly drops per-plate costs.',
        potentialSavingsPercent: 15,
      });
    } else if (cat.category === 'decoration') {
      tips.push({
        category: 'Decoration',
        saving: 'Up to 20% reduction',
        tip: 'Prioritize focal photo points (backdrop, entrance) rather than uniform heavy florals across every aisle. Utilize LED ambient lighting.',
        potentialSavingsPercent: 20,
      });
    } else if (cat.category === 'invitations') {
      tips.push({
        category: 'Invitations',
        saving: 'Up to 80% reduction',
        tip: 'Adopt digital animated invitations with WhatsApp RSVP tracking and keep physical printed cards limited to close elders.',
        potentialSavingsPercent: 80,
      });
    } else if (cat.category === 'photography') {
      tips.push({
        category: 'Photography',
        saving: 'Up to 12% reduction',
        tip: 'Book combined photo-cinematography packages instead of separate teams to avoid duplicate equipment and crew logistics fees.',
        potentialSavingsPercent: 12,
      });
    }
  });

  return tips;
}
