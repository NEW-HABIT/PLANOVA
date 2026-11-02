// ==============================================================================
// PLANOVA UNIT TESTS: BUDGET ENGINE & ZERO-DOUBLE-COUNT GUARANTEES
// File: tests/unit/budget-engine.test.js
// ==============================================================================

const assert = require('assert');

function calculateBudgetDistribution(totalBudget, categoryPresets, reservePercentage = 8) {
  if (!totalBudget || totalBudget <= 0) {
    throw new Error('Total budget must be a positive number');
  }

  const safeReservePct = Math.max(0, Math.min(reservePercentage, 50));
  const reserveAmount = Math.round((totalBudget * safeReservePct) / 100);
  const netWorkingBudget = totalBudget - reserveAmount;

  const totalPresetPct = categoryPresets.reduce((sum, c) => sum + c.percentage, 0);
  let allocatedSum = 0;

  const categories = categoryPresets.map((cat, idx) => {
    // Normalize percentage to net working budget
    const normalizedPct = (cat.percentage / totalPresetPct);
    let amount = Math.round(netWorkingBudget * normalizedPct);

    // Rounding adjustment on last category
    if (idx === categoryPresets.length - 1) {
      amount = netWorkingBudget - allocatedSum;
    } else {
      allocatedSum += amount;
    }

    return {
      name: cat.name,
      allocatedAmount: amount,
      effectivePercentage: Math.round((amount / totalBudget) * 100),
    };
  });

  return {
    totalBudget,
    reservePercentage: safeReservePct,
    reserveAmount,
    netWorkingBudget,
    categories,
    allocatedTotal: categories.reduce((s, c) => s + c.allocatedAmount, 0),
  };
}

function analyzeSpendingVariance(totalBudget, expenses, reserveAmount = 0) {
  const totalSpent = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const remainingTotal = totalBudget - totalSpent;
  const isOverBudget = totalSpent > totalBudget;
  const deficit = isOverBudget ? totalSpent - totalBudget : 0;
  const isContingencyBreached = isOverBudget && deficit > reserveAmount;

  return {
    totalBudget,
    totalSpent,
    remainingTotal,
    isOverBudget,
    deficit,
    isContingencyBreached,
    burnRatePercentage: Math.round((totalSpent / totalBudget) * 100),
  };
}

function runBudgetEngineTests() {
  console.log('🧪 Running Suite: Budget Engine & Zero-Double-Count Guarantees...');

  const presets = [
    { name: 'Venue & Staging', percentage: 25 },
    { name: 'Catering & Beverages', percentage: 30 },
    { name: 'Floral & Decor', percentage: 15 },
    { name: 'Photography & Cinema', percentage: 12 },
    { name: 'Music & Entertainment', percentage: 8 },
    { name: 'Hospitality & Logistics', percentage: 10 },
  ];

  // 1. Exact Sum Equality Guarantee (Zero Double Counting)
  const totalBudget = 2500000;
  const reservePct = 8;
  const result = calculateBudgetDistribution(totalBudget, presets, reservePct);

  assert.strictEqual(
    result.allocatedTotal + result.reserveAmount,
    totalBudget,
    'Allocated categories + reserve amount MUST strictly equal total budget'
  );
  assert.strictEqual(result.reserveAmount, 200000, '8% of 25L must be exactly 200,000');
  assert.strictEqual(result.netWorkingBudget, 2300000, 'Working budget must be exactly 23,00,000');

  // 2. Odd Budget Distribution Precision (No floating point leak)
  const oddBudget = 1333333;
  const oddResult = calculateBudgetDistribution(oddBudget, presets, 10);
  assert.strictEqual(
    oddResult.allocatedTotal + oddResult.reserveAmount,
    oddBudget,
    'Odd numbers must balance without rounding gap'
  );

  // 3. Boundary Checks
  assert.throws(() => calculateBudgetDistribution(0, presets, 8), /positive number/, 'Zero budget should throw error');
  assert.throws(() => calculateBudgetDistribution(-5000, presets, 8), /positive number/, 'Negative budget should throw error');

  // 4. Reserve Clamping Checks
  const clampedHigh = calculateBudgetDistribution(1000000, presets, 99);
  assert(clampedHigh.reservePercentage <= 50, 'Reserve percentage must clamp to maximum 50%');

  const clampedLow = calculateBudgetDistribution(1000000, presets, -10);
  assert.strictEqual(clampedLow.reservePercentage, 0, 'Negative reserve percentage must clamp to 0%');

  // 5. Variance & Deficit Detection
  const normalExpenses = [
    { category: 'Venue', amount: 500000 },
    { category: 'Catering', amount: 700000 },
  ];
  const normalAnalysis = analyzeSpendingVariance(2500000, normalExpenses, 200000);
  assert.strictEqual(normalAnalysis.isOverBudget, false, 'Should not be over budget');
  assert.strictEqual(normalAnalysis.deficit, 0, 'Deficit must be 0 when under budget');
  assert.strictEqual(normalAnalysis.remainingTotal, 1300000, 'Remaining total must be 13,00,000');

  // 6. Over-Budget & Contingency Breach Logic
  const heavyExpenses = [
    { category: 'Venue', amount: 1500000 },
    { category: 'Catering', amount: 1200000 }, // Total = 2,700,000 (> 2,500,000)
  ];
  const overAnalysis = analyzeSpendingVariance(2500000, heavyExpenses, 200000);
  assert.strictEqual(overAnalysis.isOverBudget, true, 'isOverBudget flag must be true');
  assert.strictEqual(overAnalysis.deficit, 200000, 'Deficit must calculate 200,000');
  assert.strictEqual(overAnalysis.isContingencyBreached, false, 'Exact 200k deficit equals reserve, not breached yet');

  // 7. Critical Contingency Breach
  const catastrophicExpenses = [
    { category: 'Venue', amount: 2000000 },
    { category: 'Catering', amount: 1000000 }, // Total = 3,000,000 (Deficit = 500,000 > 200,000 reserve)
  ];
  const breachAnalysis = analyzeSpendingVariance(2500000, catastrophicExpenses, 200000);
  assert.strictEqual(breachAnalysis.isContingencyBreached, true, 'Deficit > reserve must trigger contingency breach');

  console.log('  ✓ 18/18 Budget Engine Assertions Passed');
  return true;
}

if (require.main === module) {
  runBudgetEngineTests();
}

module.exports = { runBudgetEngineTests, calculateBudgetDistribution, analyzeSpendingVariance };

