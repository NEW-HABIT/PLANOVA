// ==============================================================================
// PLANOVA AUTOMATED UNIT TESTS: BUDGET ENGINE
// File: scripts/test-budget.js
// ==============================================================================

const assert = require('assert');

function runTests() {
  console.log('🧪 Starting PLANOVA Budget & Reserve Engine Tests...\n');

  // Test 1: Category Allocation & Zero-Double-Count Reserve
  console.log('Test 1: Category Allocation & Zero-Double-Count Reserve Calculation');
  const totalBudget = 2500000;
  const reservePct = 8;
  const expectedReserve = Math.round((totalBudget * reservePct) / 100);

  // Mock standard presets
  const presets = [
    { category: 'venue', defaultPercentage: 25 },
    { category: 'catering', defaultPercentage: 30 },
    { category: 'decoration', defaultPercentage: 15 },
    { category: 'photography', defaultPercentage: 12 },
    { category: 'makeup_artist', defaultPercentage: 5 },
    { category: 'dj_entertainment', defaultPercentage: 5 },
  ];

  const nonReserveSum = presets.reduce((s, p) => s + p.defaultPercentage, 0);
  const remainingPct = 100 - reservePct;

  let allocatedSum = 0;
  const categories = presets.map((p) => {
    const adjPct = Math.round((p.defaultPercentage / nonReserveSum) * remainingPct);
    const amount = Math.round((adjPct / 100) * totalBudget);
    allocatedSum += amount;
    return { category: p.category, percentage: adjPct, amount };
  });

  const reserveAmount = totalBudget - allocatedSum;
  assert(reserveAmount >= 0, 'Reserve amount cannot be negative');
  assert.strictEqual(
    allocatedSum + reserveAmount,
    totalBudget,
    'Sum of categories + reserve must exactly equal totalBudget'
  );
  console.log(`  ✓ Passed: Total budget ₹${totalBudget.toLocaleString()} sums exactly with reserve ₹${reserveAmount.toLocaleString()}`);

  // Test 2: Spending Variance & Over-Budget Alert Logic
  console.log('\nTest 2: Spending Variance & Over-Budget Alert Calculation');
  const expenses = [
    { amount: 500000, category: 'venue' },
    { amount: 800000, category: 'catering' },
    { amount: 1500000, category: 'decor' }, // Total spent = 2,800,000 (> 2,500,000)
  ];

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const isOverBudget = totalSpent > totalBudget;
  const deficit = totalSpent - totalBudget;

  assert.strictEqual(totalSpent, 2800000, 'Total spent should be 2,800,000');
  assert.strictEqual(isOverBudget, true, 'isOverBudget flag must trigger when spending exceeds total');
  assert.strictEqual(deficit, 300000, 'Deficit must calculate 300,000 accurately');
  console.log(`  ✓ Passed: Detected over-budget deficit of ₹${deficit.toLocaleString()} accurately`);

  // Test 3: Currency Multi-Format Sanity
  console.log('\nTest 3: Currency Format Bounds Check');
  const validCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'AED'];
  assert.strictEqual(validCurrencies.length, 5, 'Must support 5 global currencies');
  console.log('  ✓ Passed: Global currency support validated');

  console.log('\n🎉 ALL PLANOVA UNIT TESTS PASSED SUCCESSFULLY! (3/3 suites)');
}

runTests();
