'use client';

import { UserProfile, Currency, EventCategory } from '@/types';

export interface StoredUserCredential {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  profile: UserProfile;
}

export interface AuthSession {
  token: string;
  userId: string;
  expiresAt: number;
}

export interface AuthResult {
  success: boolean;
  user?: UserProfile;
  error?: string;
  lockedUntil?: number;
}

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

const STORAGE_KEYS = {
  ACTIVE_USER: 'planova_user',
  ACTIVE_SESSION: 'planova_auth_session',
  LEGACY_TOKEN: 'planova_auth_token',
  USER_REGISTRY: 'planova_registered_users',
  RATE_LIMIT: 'planova_auth_rate_limit',
};

const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 1000; // 30 seconds

// Cryptographic Utilities using Web Crypto API
async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    // Fallback in environments without Web Crypto (e.g. basic SSR)
    let hash = 0;
    const str = `${salt}:${password}`;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}__PLANOVA_SECURE_SALT__${password}`);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function generateCryptographicSalt(): string {
  const bytes = new Uint8Array(16);
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 32; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function getRegisteredUsers(): StoredUserCredential[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_REGISTRY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load user registry:', e);
    return [];
  }
}

function saveRegisteredUsers(users: StoredUserCredential[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER_REGISTRY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save user registry:', e);
  }
}

function getRateLimitState(): { attempts: number; lockedUntil: number } {
  if (typeof window === 'undefined') return { attempts: 0, lockedUntil: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RATE_LIMIT);
    if (!raw) return { attempts: 0, lockedUntil: 0 };
    return JSON.parse(raw);
  } catch {
    return { attempts: 0, lockedUntil: 0 };
  }
}

function recordFailedAttempt(): { lockedUntil: number; attemptsLeft: number } {
  const state = getRateLimitState();
  const attempts = state.attempts + 1;
  let lockedUntil = 0;
  if (attempts >= MAX_FAILED_ATTEMPTS) {
    lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(
      STORAGE_KEYS.RATE_LIMIT,
      JSON.stringify({ attempts: attempts >= MAX_FAILED_ATTEMPTS ? 0 : attempts, lockedUntil })
    );
  }
  return { lockedUntil, attemptsLeft: Math.max(0, MAX_FAILED_ATTEMPTS - attempts) };
}

function resetRateLimit(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.RATE_LIMIT);
}

// Invalidate and remove any legacy demo user data
function purgeLegacyDemoUser(): void {
  if (typeof window === 'undefined') return;
  try {
    const rawUser = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      if (parsed.email === 'demo@planova.ai' || parsed.id === 'usr_planova_demo_1') {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
        localStorage.removeItem(STORAGE_KEYS.LEGACY_TOKEN);
      }
    }
  } catch {
    // ignore
  }
}

// Execute purge on module load
if (typeof window !== 'undefined') {
  purgeLegacyDemoUser();
}

export const PlanovaAuth = {
  /**
   * Check if a valid session exists and is not expired
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    purgeLegacyDemoUser();

    try {
      const sessionRaw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
      if (!sessionRaw) {
        // Check legacy token if present
        const legacyToken = localStorage.getItem(STORAGE_KEYS.LEGACY_TOKEN);
        const activeUser = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
        return !!(legacyToken && activeUser);
      }

      const session: AuthSession = JSON.parse(sessionRaw);
      if (!session || !session.expiresAt || session.expiresAt <= Date.now()) {
        this.logout();
        return false;
      }

      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get currently authenticated user profile, or null if not signed in
   */
  getUser(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    purgeLegacyDemoUser();

    if (!this.isAuthenticated()) return null;

    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Get user profile or a safe guest fallback for components requiring default UI fields
   */
  getSafeUser(): UserProfile {
    const current = this.getUser();
    if (current) return current;
    return {
      id: 'usr_guest',
      email: '',
      full_name: 'Guest Planner',
      preferred_language: 'English',
      currency: 'INR' as Currency,
      region: 'India',
      planning_interests: ['wedding', 'birthday', 'corporate'],
      created_at: new Date().toISOString(),
    };
  },

  /**
   * Register a new user with password hashing and cryptographic salt
   */
  async register({ email, password, fullName }: RegisterInput): Promise<AuthResult> {
    if (typeof window === 'undefined') {
      return { success: false, error: 'Registration cannot be processed in SSR.' };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    if (!cleanName || cleanName.length < 2) {
      return { success: false, error: 'Please enter a valid full name (at least 2 characters).' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    if (!password || password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    const users = getRegisteredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in instead.',
      };
    }

    // Generate cryptographic salt and hash password
    const salt = generateCryptographicSalt();
    const hash = await hashPasswordWithSalt(password, salt);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const newProfile: UserProfile = {
      id: userId,
      email: normalizedEmail,
      full_name: cleanName,
      preferred_language: 'English',
      currency: 'INR',
      region: 'India',
      planning_interests: ['wedding', 'birthday', 'corporate'],
      created_at: new Date().toISOString(),
    };

    const newCredential: StoredUserCredential = {
      id: userId,
      email: normalizedEmail,
      fullName: cleanName,
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: newProfile.created_at,
      profile: newProfile,
    };

    users.push(newCredential);
    saveRegisteredUsers(users);

    // Create session
    const sessionToken = generateSessionToken();
    const session: AuthSession = {
      token: sessionToken,
      userId,
      expiresAt: Date.now() + SESSION_EXPIRY_MS,
    };

    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
    localStorage.setItem(STORAGE_KEYS.LEGACY_TOKEN, sessionToken);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(newProfile));
    resetRateLimit();

    return { success: true, user: newProfile };
  },

  /**
   * Authenticate a user by verifying hashed password against stored salt and hash
   */
  async login({ email, password }: LoginInput): Promise<AuthResult> {
    if (typeof window === 'undefined') {
      return { success: false, error: 'Login cannot be processed in SSR.' };
    }

    // Rate-limiting check
    const rateLimit = getRateLimitState();
    if (rateLimit.lockedUntil && rateLimit.lockedUntil > Date.now()) {
      const waitSeconds = Math.ceil((rateLimit.lockedUntil - Date.now()) / 1000);
      return {
        success: false,
        error: `Too many failed login attempts. For your security, account access is locked for ${waitSeconds} seconds.`,
        lockedUntil: rateLimit.lockedUntil,
      };
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      return { success: false, error: 'Please enter both your email address and password.' };
    }

    const users = getRegisteredUsers();
    const userRecord = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!userRecord) {
      const { lockedUntil } = recordFailedAttempt();
      if (lockedUntil > Date.now()) {
        return {
          success: false,
          error: 'Too many failed login attempts. Please wait 30 seconds before trying again.',
          lockedUntil,
        };
      }
      return {
        success: false,
        error: 'Invalid email or password. Please verify your credentials or create a new account.',
      };
    }

    // Verify hash
    const computedHash = await hashPasswordWithSalt(password, userRecord.passwordSalt);
    if (computedHash !== userRecord.passwordHash) {
      const { lockedUntil } = recordFailedAttempt();
      if (lockedUntil > Date.now()) {
        return {
          success: false,
          error: 'Too many failed login attempts. Please wait 30 seconds before trying again.',
          lockedUntil,
        };
      }
      return {
        success: false,
        error: 'Invalid email or password. Please verify your credentials or create a new account.',
      };
    }

    // Authentication succeeded - establish session
    resetRateLimit();
    const sessionToken = generateSessionToken();
    const session: AuthSession = {
      token: sessionToken,
      userId: userRecord.id,
      expiresAt: Date.now() + SESSION_EXPIRY_MS,
    };

    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
    localStorage.setItem(STORAGE_KEYS.LEGACY_TOKEN, sessionToken);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(userRecord.profile));

    return { success: true, user: userRecord.profile };
  },

  /**
   * Log out current user and destroy active session
   */
  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    localStorage.removeItem(STORAGE_KEYS.LEGACY_TOKEN);
  },

  /**
   * Update active user profile and update registry record
   */
  updateUserProfile(updated: Partial<UserProfile>): UserProfile | null {
    if (typeof window === 'undefined') return null;
    const current = this.getUser();
    if (!current) return null;

    const merged: UserProfile = { ...current, ...updated };
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(merged));

    // Update in registry
    const users = getRegisteredUsers();
    const index = users.findIndex((u) => u.id === current.id);
    if (index >= 0) {
      users[index].profile = merged;
      users[index].fullName = merged.full_name;
      saveRegisteredUsers(users);
    }

    return merged;
  },
};
