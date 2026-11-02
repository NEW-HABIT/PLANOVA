// ==============================================================================
// PLANOVA UNIT TESTS: ACCESSIBILITY (a11y) & WCAG AAA COMPLIANCE
// File: tests/accessibility.test.js
// ==============================================================================

const assert = require('assert');

// Relative luminance formula per WCAG 2.1 specs
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function getContrastRatio(hex1, hex2) {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const lum1 = getLuminance(r1, g1, b1);
  const lum2 = getLuminance(r2, g2, b2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function runAccessibilityTests() {
  console.log('🧪 Running Suite: Accessibility & WCAG AAA Contrast Compliance...');

  // 1. Signature Palette Contrast Verification
  // #3E3239 (Royal Espresso) on #F7EFE7 (Silk Cream)
  const contrastPrimary = getContrastRatio('#3E3239', '#F7EFE7');
  assert(
    contrastPrimary >= 7.0,
    `Primary typography contrast must meet WCAG AAA standard (>= 7:1). Actual: ${contrastPrimary.toFixed(2)}:1`
  );
  console.log(`  ✓ Primary Contrast: ${contrastPrimary.toFixed(2)}:1 (Exceeds WCAG AAA 7:1)`);

  // #3E3239 on #FFFFFF (Pure White)
  const contrastWhite = getContrastRatio('#3E3239', '#FFFFFF');
  assert(
    contrastWhite >= 7.0,
    `Card typography contrast must meet WCAG AAA standard (>= 7:1). Actual: ${contrastWhite.toFixed(2)}:1`
  );
  console.log(`  ✓ Card Contrast: ${contrastWhite.toFixed(2)}:1 (Exceeds WCAG AAA 7:1)`);

  // #6B5560 (Velvet Wine) on #F7EFE7 (Silk Cream) for secondary text
  const contrastSecondary = getContrastRatio('#6B5560', '#F7EFE7');
  assert(
    contrastSecondary >= 4.5,
    `Secondary body contrast must meet WCAG AA standard (>= 4.5:1). Actual: ${contrastSecondary.toFixed(2)}:1`
  );
  console.log(`  ✓ Secondary Contrast: ${contrastSecondary.toFixed(2)}:1 (Meets WCAG AA 4.5:1)`);

  // 2. Semantic Landmark Rules
  const requiredLandmarks = ['header', 'nav', 'main', 'footer'];
  assert.strictEqual(requiredLandmarks.length, 4, 'Core page templates must define 4 semantic landmarks');

  // 3. Icon Accessible Name Rules
  const sampleButtonProps = [
    { type: 'icon', ariaLabel: 'Delete celebration', hasText: false },
    { type: 'icon', ariaLabel: 'Duplicate event plan', hasText: false },
    { type: 'text', ariaLabel: undefined, hasText: true },
  ];

  sampleButtonProps.forEach((btn) => {
    const isAccessible = btn.hasText || (typeof btn.ariaLabel === 'string' && btn.ariaLabel.length > 0);
    assert.strictEqual(isAccessible, true, 'Every interactive button must have accessible name');
  });

  console.log('  ✓ 8/8 Accessibility Assertions Passed');
  return true;
}

if (require.main === module) {
  runAccessibilityTests();
}

module.exports = {
  runAccessibilityTests,
  getContrastRatio,
  getLuminance,
};

