import { GET, POST } from '../projects/route'

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

describe('/api/projects', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/projects', () => {
    test('returns projects successfully', async () => {
      const mockProjects = [
        {
          id: 1,
          title: 'Test Project',
          description: 'Test Description',
          category: 'e-commerce',
          technologies: 'React, Node.js',
          featured: 1,
          image_url: 'https://example.com/image.jpg',
          image_public_id: 'test-image'
        }
      ]

      const { getDatabase } = require('../../../../lib/database')
      const mockDb = getDatabase()
      mockDb.prepare().all.mockReturnValue(mockProjects)

      const request = createMockRequest('GET')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockProjects)
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

  describe('POST /api/projects', () => {
    test('creates project successfully', async () => {
      const projectData = {
        title: 'New Project',
        description: 'New Description',
        category: 'Business Platform',
        technologies: 'Vue.js, Express',
        featured: true,
        image_url: 'https://example.com/new-image.jpg',
        image_public_id: 'new-image'
      }

      const { getDatabase } = require('../../../../lib/database')
      const mockDb = getDatabase()
      mockDb.prepare().run.mockReturnValue({ lastInsertRowid: 1 })

      const request = createMockRequest('POST', projectData)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.message).toContain('Project created successfully')
    })

    test('validates required fields', async () => {
      const invalidData = {
        title: '', // Empty title
        description: 'Test Description'
      }

      const request = createMockRequest('POST', invalidData)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Title is required')
    })

    test('handles database error during creation', async () => {
      const projectData = {
        title: 'Test Project',
        description: 'Test Description',
        category: 'E-commerce',
        technologies: 'React',
        featured: false,
        image_url: 'https://example.com/image.jpg',
        image_public_id: 'test-image'
      }

      const { getDatabase } = require('../../../../lib/database')
      const mockDb = getDatabase()
      mockDb.prepare().run.mockImplementation(() => {
        throw new Error('Database error')
      })

      const request = createMockRequest('POST', projectData)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Database error')
    })
  })
})
