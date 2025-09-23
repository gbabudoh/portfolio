import { GET, POST } from '../skills/route'

// Mock database
jest.mock('../../../../lib/database', () => ({
  getDatabase: jest.fn(() => ({
    prepare: jest.fn(() => ({
      all: jest.fn(),
      run: jest.fn(),
      get: jest.fn()
    }))
  }))
}))

// Mock Next.js request
const createMockRequest = (method, body = null) => ({
  method,
  json: () => Promise.resolve(body),
  headers: new Map()
})

describe('/api/skills', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/skills', () => {
    test('returns skills successfully', async () => {
      const mockSkills = [
        {
          id: 1,
          name: 'React',
          category: 'Frontend',
          level: 'Expert',
          icon: '⚛️'
        },
        {
          id: 2,
          name: 'Node.js',
          category: 'Backend',
          level: 'Advanced',
          icon: '🟢'
        }
      ]

      const { getDatabase } = require('../../../../lib/database')
      const mockDb = getDatabase()
      mockDb.prepare().all.mockReturnValue(mockSkills)

      const request = createMockRequest('GET')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockSkills)
    })

    test('handles database error', async () => {
      const { getDatabase } = require('../../../../lib/database')
      const mockDb = getDatabase()
      mockDb.prepare().all.mockImplementation(() => {
        throw new Error('Database error')
      })

      const request = createMockRequest('GET')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Database error')
    })
  })

  describe('POST /api/skills', () => {
    test('creates skill successfully', async () => {
      const skillData = {
        name: 'Vue.js',
        category: 'Frontend',
        level: 'Advanced',
        icon: '💚'
      }

      const { getDatabase } = require('../../../../lib/database')
      const mockDb = getDatabase()
      mockDb.prepare().run.mockReturnValue({ lastInsertRowid: 1 })

      const request = createMockRequest('POST', skillData)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.message).toContain('Skill created successfully')
    })

    test('validates required fields', async () => {
      const invalidData = {
        name: '', // Empty name
        category: 'Frontend'
      }

      const request = createMockRequest('POST', invalidData)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Name is required')
    })

    test('handles database error during creation', async () => {
      const skillData = {
        name: 'Test Skill',
        category: 'Backend',
        level: 'Intermediate',
        icon: '🔧'
      }

      const { getDatabase } = require('../../../../lib/database')
      const mockDb = getDatabase()
      mockDb.prepare().run.mockImplementation(() => {
        throw new Error('Database error')
      })

      const request = createMockRequest('POST', skillData)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Database error')
    })
  })
})
