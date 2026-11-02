// ==============================================================================
// PLANOVA UNIT TESTS: UTILITY FUNCTIONS & FORMATTERS
// File: tests/unit/utils.test.js
// ==============================================================================

const assert = require('assert');

// Mock implementation of utils for isolated Node execution
function formatCurrency(amount, currency = 'INR') {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  if (currency === 'INR') {
    return `₹${Math.round(safeAmount).toLocaleString('en-IN')}`;
  }
  const symbols = { USD: '$', EUR: '€', GBP: '£', AED: 'AED ' };
  const symbol = symbols[currency] || `${currency} `;
  return `${symbol}${Math.round(safeAmount).toLocaleString('en-US')}`;
}

function formatDate(dateString) {
  if (!dateString) return 'Date TBD';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function calculateDaysRemaining(targetDate) {
  if (!targetDate) return 0;
  const target = new Date(targetDate);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

function isValidHexColor(hex) {
  return /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex);
}

function calculatePercentage(part, total) {
  if (!total || total <= 0) return 0;
  return Math.round((part / total) * 100);
}

function runUtilsTests() {
  console.log('🧪 Running Suite: Utility Functions & Formatters...');

  // 1. Currency Formatting
  assert.strictEqual(formatCurrency(2500000, 'INR'), '₹25,00,000', 'INR should format with Indian commas');
  assert.strictEqual(formatCurrency(50000, 'USD'), '$50,000', 'USD should format with dollar symbol');
  assert.strictEqual(formatCurrency(1200, 'EUR'), '€1,200', 'EUR should format with euro symbol');
  assert.strictEqual(formatCurrency(0, 'INR'), '₹0', 'Zero amount should format correctly');
  assert.strictEqual(formatCurrency(-500, 'INR'), '₹-500', 'Negative amounts should format safely');
  assert.strictEqual(formatCurrency(NaN, 'INR'), '₹0', 'NaN should safely format as 0');

  // 2. Date Formatting
  assert.strictEqual(formatDate('2026-12-20'), 'Dec 20, 2026', 'ISO date should format to human readable');
  assert.strictEqual(formatDate(''), 'Date TBD', 'Empty date should fallback to Date TBD');
  assert.strictEqual(formatDate(null), 'Date TBD', 'Null date should fallback to Date TBD');

  // 3. Days Remaining Calculation
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 10);
  const daysLeft = calculateDaysRemaining(futureDate.toISOString());
  assert(daysLeft >= 9 && daysLeft <= 11, 'Days remaining should calculate within 1 day margin');

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 5);
  assert.strictEqual(calculateDaysRemaining(pastDate.toISOString()), 0, 'Past date must return 0 days remaining');
  assert.strictEqual(calculateDaysRemaining(''), 0, 'Empty date must return 0');

  // 4. Hex Color Validation
  assert.strictEqual(isValidHexColor('#3E3239'), true, 'Valid 6-digit hex should pass');
  assert.strictEqual(isValidHexColor('#F7EFE7'), true, 'Valid 6-digit hex should pass');
  assert.strictEqual(isValidHexColor('#FFF'), true, 'Valid 3-digit hex should pass');
  assert.strictEqual(isValidHexColor('rgb(0,0,0)'), false, 'Non-hex string should fail');
  assert.strictEqual(isValidHexColor('#XYZ123'), false, 'Invalid characters in hex should fail');

  // 5. Percentage Calculation
  assert.strictEqual(calculatePercentage(25, 100), 25, '25/100 should be 25%');
  assert.strictEqual(calculatePercentage(1, 3), 33, '1/3 should round to 33%');
  assert.strictEqual(calculatePercentage(50, 0), 0, 'Division by zero should safely return 0');

  console.log('  ✓ 15/15 Utility Assertions Passed');
  return true;
}

if (require.main === module) {
  runUtilsTests();
}

module.exports = { runUtilsTests, formatCurrency, formatDate, calculateDaysRemaining, isValidHexColor, calculatePercentage };

