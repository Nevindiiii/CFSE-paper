/**
 * Tests: Auth validation logic
 * Covers the same rules used in LoginPage and RegisterPage
 */
import { describe, it, expect } from 'vitest'

// ── Helpers (mirrors the validate() functions in the pages) ──────────────────

interface LoginErrors  { email?: string; password?: string }
interface RegisterErrors extends LoginErrors { name?: string; confirmPassword?: string }

function validateLogin(email: string, password: string): LoginErrors {
  const e: LoginErrors = {}
  if (!email) e.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email'
  if (!password) e.password = 'Password is required'
  else if (password.length < 6) e.password = 'Password must be at least 6 characters'
  return e
}

function validateRegister(name: string, email: string, password: string, confirmPassword: string): RegisterErrors {
  const e: RegisterErrors = {}
  if (!name.trim()) e.name = 'Name is required'
  else if (name.trim().length < 2) e.name = 'Name must be at least 2 characters'
  if (!email) e.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email'
  if (!password) e.password = 'Password is required'
  else if (password.length < 6) e.password = 'Password must be at least 6 characters'
  if (!confirmPassword) e.confirmPassword = 'Please confirm your password'
  else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match'
  return e
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Auth — Login validation', () => {
  it('returns no errors for valid credentials', () => {
    const errors = validateLogin('user@example.com', 'secret123')
    expect(errors).toEqual({})
  })

  it('requires email field', () => {
    const errors = validateLogin('', 'secret123')
    expect(errors.email).toBe('Email is required')
  })

  it('rejects malformed email', () => {
    const errors = validateLogin('not-an-email', 'secret123')
    expect(errors.email).toBe('Enter a valid email')
  })

  it('requires password field', () => {
    const errors = validateLogin('user@example.com', '')
    expect(errors.password).toBe('Password is required')
  })

  it('rejects password shorter than 6 characters', () => {
    const errors = validateLogin('user@example.com', '123')
    expect(errors.password).toBe('Password must be at least 6 characters')
  })
})

describe('Auth — Register validation', () => {
  it('returns no errors for valid registration data', () => {
    const errors = validateRegister('Jane Doe', 'jane@example.com', 'password1', 'password1')
    expect(errors).toEqual({})
  })

  it('requires name field', () => {
    const errors = validateRegister('', 'jane@example.com', 'password1', 'password1')
    expect(errors.name).toBe('Name is required')
  })

  it('rejects name shorter than 2 characters', () => {
    const errors = validateRegister('J', 'jane@example.com', 'password1', 'password1')
    expect(errors.name).toBe('Name must be at least 2 characters')
  })

  it('flags mismatched passwords', () => {
    const errors = validateRegister('Jane', 'jane@example.com', 'password1', 'different')
    expect(errors.confirmPassword).toBe('Passwords do not match')
  })

  it('requires confirm password field', () => {
    const errors = validateRegister('Jane', 'jane@example.com', 'password1', '')
    expect(errors.confirmPassword).toBe('Please confirm your password')
  })
})
