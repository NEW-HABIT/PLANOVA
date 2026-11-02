// ==============================================================================
// PLANOVA UNIT TESTS: AUTHENTICATION, RATE LIMITING & SECURITY
// File: tests/unit/auth-security.test.js
// ==============================================================================

const assert = require('assert');
const crypto = require('crypto');

function hashPasswordWithSalt(password, salt) {
  if (!password || !salt) {
    throw new Error('Password and salt are required');
  }
  return crypto
    .createHash('sha256')
    .update(`${salt}__PLANOVA_SECURE_SALT__${password}`)
    .digest('hex');
}

function generateCryptographicSalt() {
  return crypto.randomBytes(16).toString('hex');
}

function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // Strip script injection brackets
    .trim();
}

function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim().toLowerCase());
}

function checkRateLimit(attempts, maxAttempts = 5, lockoutDurationMs = 30000) {
  if (attempts >= maxAttempts) {
    return {
      isLocked: true,
      lockedUntil: Date.now() + lockoutDurationMs,
      attemptsRemaining: 0,
    };
  }
  return {
    isLocked: false,
    lockedUntil: 0,
    attemptsRemaining: maxAttempts - attempts,
  };
}

function runAuthSecurityTests() {
  console.log('🧪 Running Suite: Authentication, Rate Limiting & Security...');

  // 1. Salt & Password Hashing
  const salt = generateCryptographicSalt();
  assert.strictEqual(salt.length, 32, 'Salt should be 32 hex characters (16 bytes)');

  const hash1 = hashPasswordWithSalt('SecretPassword123!', salt);
  const hash2 = hashPasswordWithSalt('SecretPassword123!', salt);
  assert.strictEqual(hash1, hash2, 'Identical password + salt must produce identical hash');

  const differentSalt = generateCryptographicSalt();
  const hashDiff = hashPasswordWithSalt('SecretPassword123!', differentSalt);
  assert.notStrictEqual(hash1, hashDiff, 'Different salt must produce completely distinct hash');

  // 2. Session Token Generation
  const token1 = generateSessionToken();
  const token2 = generateSessionToken();
  assert.strictEqual(token1.length, 64, 'Session token should be 64 hex characters (32 bytes)');
  assert.notStrictEqual(token1, token2, 'Consecutive tokens must be cryptographically unique');

  // 3. Email Validation
  assert.strictEqual(validateEmail('host@planova.app'), true, 'Valid email must return true');
  assert.strictEqual(validateEmail('user.name+tag@sub.domain.co'), true, 'Complex valid email must return true');
  assert.strictEqual(validateEmail('invalid-email'), false, 'Email without @ must return false');
  assert.strictEqual(validateEmail('user@'), false, 'Incomplete email must return false');
  assert.strictEqual(validateEmail(''), false, 'Empty string must return false');
  assert.strictEqual(validateEmail(null), false, 'Null must return false');

  // 4. Rate Limiting Protection (Brute Force Defense)
  const attempt1 = checkRateLimit(1, 5);
  assert.strictEqual(attempt1.isLocked, false);
  assert.strictEqual(attempt1.attemptsRemaining, 4);

  const attempt4 = checkRateLimit(4, 5);
  assert.strictEqual(attempt4.isLocked, false);
  assert.strictEqual(attempt4.attemptsRemaining, 1);

  const attempt5 = checkRateLimit(5, 5);
  assert.strictEqual(attempt5.isLocked, true, '5th failed attempt must trigger lockout');
  assert(attempt5.lockedUntil > Date.now(), 'lockedUntil timestamp must be in the future');

  // 5. Input Sanitization (XSS Defense)
  const maliciousScript = '<script>alert("XSS")</script>Hello Royal Celebration';
  const sanitized = sanitizeInput(maliciousScript);
  assert.strictEqual(sanitized.includes('<'), false, 'Sanitizer must remove opening angle brackets');
  assert.strictEqual(sanitized.includes('>'), false, 'Sanitizer must remove closing angle brackets');
  assert.strictEqual(sanitized, 'scriptalert("XSS")/scriptHello Royal Celebration');

  console.log('  ✓ 16/16 Auth & Security Assertions Passed');
  return true;
}

if (require.main === module) {
  runAuthSecurityTests();
}

module.exports = {
  runAuthSecurityTests,
  hashPasswordWithSalt,
  generateCryptographicSalt,
  generateSessionToken,
  sanitizeInput,
  validateEmail,
  checkRateLimit,
};

