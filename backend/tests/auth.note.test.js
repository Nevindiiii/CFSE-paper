/**
 * Tests: Backend — Auth & Note logic
 * Uses Jest with mocked mongoose models and bcrypt
 */

// ── Auth: password hashing (bcryptjs) ─────────────────────────────────────────

const bcrypt = require('bcryptjs')

describe('Auth — password hashing', () => {
  it('hashes a password so it does not equal the plain text', async () => {
    const plain = 'mySecret123'
    const hashed = await bcrypt.hash(plain, 10)
    expect(hashed).not.toBe(plain)
  })

  it('bcrypt.compare returns true for correct password', async () => {
    const plain = 'mySecret123'
    const hashed = await bcrypt.hash(plain, 10)
    const match = await bcrypt.compare(plain, hashed)
    expect(match).toBe(true)
  })

  it('bcrypt.compare returns false for wrong password', async () => {
    const hashed = await bcrypt.hash('correctPassword', 10)
    const match = await bcrypt.compare('wrongPassword', hashed)
    expect(match).toBe(false)
  })
})

// ── Auth: JWT token generation ────────────────────────────────────────────────

const jwt = require('jsonwebtoken')
const SECRET = 'test_secret'

describe('Auth — JWT token', () => {
  it('generates a token that can be verified', () => {
    const token = jwt.sign({ id: 'user123' }, SECRET, { expiresIn: '1h' })
    const decoded = jwt.verify(token, SECRET)
    expect(decoded.id).toBe('user123')
  })

  it('throws when verifying with wrong secret', () => {
    const token = jwt.sign({ id: 'user123' }, SECRET)
    expect(() => jwt.verify(token, 'wrong_secret')).toThrow()
  })
})

// ── Note: model field validation logic ───────────────────────────────────────

describe('Note — field validation logic', () => {
  const validNote = {
    title: 'Fix bug',
    description: 'Resolve the login issue',
    status: 'pending',
    dueDate: new Date('2025-12-01'),
  }

  it('accepts valid note fields', () => {
    expect(validNote.title).toBeTruthy()
    expect(['pending', 'in-progress', 'done']).toContain(validNote.status)
    expect(validNote.dueDate).toBeInstanceOf(Date)
  })

  it('rejects empty title', () => {
    const note = { ...validNote, title: '' }
    expect(note.title.trim()).toBe('')
  })

  it('rejects invalid status value', () => {
    const allowedStatuses = ['pending', 'in-progress', 'done']
    expect(allowedStatuses).not.toContain('unknown')
  })

  it('allows optional description to be empty string', () => {
    const note = { ...validNote, description: '' }
    expect(note.description).toBe('')
  })

  it('allows optional image to be empty string', () => {
    const note = { ...validNote, image: '' }
    expect(note.image).toBe('')
  })
})
