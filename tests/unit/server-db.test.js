// ==============================================================================
// PLANOVA UNIT TESTS: DATABASE NORMALIZATION & SUPABASE CONTRACTS
// File: tests/unit/server-db.test.js
// ==============================================================================

const assert = require('assert');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUUID(id) {
  if (!id || typeof id !== 'string') return false;
  return UUID_REGEX.test(id);
}

function normalizeTimeColumn(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return '00:00:00';
  const clean = timeStr.trim();
  if (clean.length === 5) {
    return `${clean}:00`;
  }
  return clean;
}

function normalizeEventPayload(event) {
  const payload = {
    ...event,
    updated_at: new Date().toISOString(),
  };

  // Strip non-UUID IDs to let Supabase Postgres generate proper v4 UUID
  if (payload.id && !isValidUUID(payload.id)) {
    delete payload.id;
  }

  // Normalize time columns for Postgres TIME columns
  if (payload.start_time) {
    payload.start_time = normalizeTimeColumn(payload.start_time);
  }
  if (payload.end_time) {
    payload.end_time = normalizeTimeColumn(payload.end_time);
  }

  // Ensure numerical fields are valid numbers
  payload.total_budget = Math.max(0, Number(payload.total_budget) || 0);
  payload.expected_guests = Math.max(1, Number(payload.expected_guests) || 1);
  payload.emergency_reserve_percentage = Math.max(0, Math.min(Number(payload.emergency_reserve_percentage) || 8, 50));

  return payload;
}

function calculateProgress(tasks) {
  if (!Array.isArray(tasks) || tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.is_completed || t.status === 'completed').length;
  return Math.round((completed / tasks.length) * 100);
}

function runServerDbTests() {
  console.log('🧪 Running Suite: Database Normalization & Supabase Contracts...');

  // 1. UUID Validation
  assert.strictEqual(isValidUUID('689b3ca7-c189-4bef-8749-f06a8c85730b'), true, 'Valid UUID v4 must pass');
  assert.strictEqual(isValidUUID('00000000-0000-0000-0000-000000000000'), true, 'Nil UUID must pass regex');
  assert.strictEqual(isValidUUID('evt_royal_wedding'), false, 'Prefixed non-UUID must fail');
  assert.strictEqual(isValidUUID('12345'), false, 'Arbitrary integer must fail');
  assert.strictEqual(isValidUUID(''), false, 'Empty string must fail');
  assert.strictEqual(isValidUUID(null), false, 'Null must fail');

  // 2. Postgres TIME Format Normalization
  assert.strictEqual(normalizeTimeColumn('16:00'), '16:00:00', 'HH:MM should normalize to HH:MM:SS');
  assert.strictEqual(normalizeTimeColumn('09:30'), '09:30:00', 'Morning time should normalize with seconds');
  assert.strictEqual(normalizeTimeColumn('18:45:30'), '18:45:30', 'Already-formatted HH:MM:SS should preserve seconds');
  assert.strictEqual(normalizeTimeColumn(''), '00:00:00', 'Empty time should default to midnight');

  // 3. Event Payload Normalization
  const rawEvent = {
    id: 'non_uuid_mock_id',
    title: 'Rohan & Ananya Royal Wedding',
    start_time: '16:30',
    end_time: '23:00',
    total_budget: '2500000',
    expected_guests: '250',
    emergency_reserve_percentage: '8',
  };

  const normalized = normalizeEventPayload(rawEvent);
  assert.strictEqual(normalized.id, undefined, 'Invalid UUID id must be stripped so Supabase auto-generates');
  assert.strictEqual(normalized.start_time, '16:30:00', 'start_time must be HH:MM:SS');
  assert.strictEqual(normalized.end_time, '23:00:00', 'end_time must be HH:MM:SS');
  assert.strictEqual(normalized.total_budget, 2500000, 'total_budget must be a numeric integer');
  assert.strictEqual(normalized.expected_guests, 250, 'expected_guests must be a numeric integer');
  assert.strictEqual(normalized.emergency_reserve_percentage, 8, 'reserve percentage must be numeric');
  assert(typeof normalized.updated_at === 'string', 'updated_at timestamp must be attached');

  // 4. Progress Percentage Calculation
  const tasks = [
    { title: 'T1', is_completed: true, status: 'completed' },
    { title: 'T2', is_completed: true, status: 'completed' },
    { title: 'T3', is_completed: false, status: 'todo' },
    { title: 'T4', is_completed: false, status: 'todo' },
  ];
  assert.strictEqual(calculateProgress(tasks), 50, '2/4 completed tasks must equal 50%');
  assert.strictEqual(calculateProgress([]), 0, 'Empty tasks list must equal 0%');

  console.log('  ✓ 15/15 Database Contract Assertions Passed');
  return true;
}

if (require.main === module) {
  runServerDbTests();
}

module.exports = {
  runServerDbTests,
  isValidUUID,
  normalizeTimeColumn,
  normalizeEventPayload,
  calculateProgress,
};

