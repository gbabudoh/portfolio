import { requireAuth, verifyToken } from '../auth'

// Mock Next.js cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn()
  }))
}))

// Mock Next.js redirect
jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}))

describe('Authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Set up environment variables
    process.env.ADMIN_USERNAME = 'admin'
    process.env.ADMIN_PASSWORD = 'password123'
  })

  afterEach(() => {
    delete process.env.ADMIN_USERNAME
    delete process.env.ADMIN_PASSWORD
  })

  describe('verifyToken', () => {
    test('verifies valid token', () => {
      const validToken = Buffer.from('admin:password123').toString('base64')
      const result = verifyToken(validToken)
      
      expect(result).toBe(true)
    })

    test('rejects invalid token', () => {
      const invalidToken = Buffer.from('admin:wrongpassword').toString('base64')
      const result = verifyToken(invalidToken)
      
      expect(result).toBe(false)
    })

    test('rejects malformed token', () => {
      const malformedToken = 'invalid-base64-string'
      const result = verifyToken(malformedToken)
      
      expect(result).toBe(false)
    })

    test('rejects empty token', () => {
      const result = verifyToken('')
      
      expect(result).toBe(false)
    })
  })

  describe('requireAuth', () => {
    test('allows access with valid credentials', () => {
      const validToken = Buffer.from('admin:password123').toString('base64')
      const mockCookies = {
        get: jest.fn().mockReturnValue({ value: validToken })
      }

      const { cookies } = require('next/headers')
      cookies.mockReturnValue(mockCookies)

      expect(() => requireAuth()).not.toThrow()
    })

    test('redirects with invalid credentials', () => {
      const invalidToken = Buffer.from('admin:wrongpassword').toString('base64')
      const mockCookies = {
        get: jest.fn().mockReturnValue({ value: invalidToken })
      }

      const { cookies } = require('next/headers')
      const { redirect } = require('next/navigation')
      
      cookies.mockReturnValue(mockCookies)

      requireAuth()
      
      expect(redirect).toHaveBeenCalledWith('/admin/login')
    })

    test('redirects with missing token', () => {
      const mockCookies = {
        get: jest.fn().mockReturnValue(undefined)
      }

      const { cookies } = require('next/headers')
      const { redirect } = require('next/navigation')
      
      cookies.mockReturnValue(mockCookies)

      requireAuth()
      
      expect(redirect).toHaveBeenCalledWith('/admin/login')
    })
  })
})
