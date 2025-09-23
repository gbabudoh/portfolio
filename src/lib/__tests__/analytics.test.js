import { initialize, trackPageView, trackEngagement, getOrCreateVisitorId } from '../analytics'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock fetch
global.fetch = jest.fn()

describe('Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    })
  })

  describe('getOrCreateVisitorId', () => {
    test('creates new visitor ID when none exists', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const visitorId = getOrCreateVisitorId()
      
      expect(visitorId).toBeDefined()
      expect(visitorId).toMatch(/^visitor_\d+$/)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('portfolio_visitor_id', visitorId)
    })

    test('returns existing visitor ID', () => {
      const existingId = 'visitor_12345'
      localStorageMock.getItem.mockReturnValue(existingId)
      
      const visitorId = getOrCreateVisitorId()
      
      expect(visitorId).toBe(existingId)
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
    })
  })

  describe('initialize', () => {
    test('initializes analytics in browser environment', () => {
      // Mock browser environment
      Object.defineProperty(window, 'location', {
        value: {
          pathname: '/',
          href: 'http://localhost:3000/'
        },
        writable: true
      })

      initialize()
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('portfolio_visitor_id')
    })

    test('does not initialize in server environment', () => {
      // Mock server environment
      const originalWindow = global.window
      delete global.window

      initialize()
      
      expect(localStorageMock.getItem).not.toHaveBeenCalled()
      
      // Restore window
      global.window = originalWindow
    })
  })

  describe('trackPageView', () => {
    test('tracks page view successfully', async () => {
      const mockResponse = { ok: true, json: () => Promise.resolve({ success: true }) }
      global.fetch.mockResolvedValue(mockResponse)

      await trackPageView('/test-page')

      expect(global.fetch).toHaveBeenCalledWith('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('"type":"page_view"')
      })
    })

    test('handles API errors gracefully', async () => {
      global.fetch.mockRejectedValue(new Error('API Error'))

      // Should not throw
      await expect(trackPageView('/test-page')).resolves.not.toThrow()
    })

    test('respects rate limiting', async () => {
      const mockResponse = { ok: true, json: () => Promise.resolve({ success: true }) }
      global.fetch.mockResolvedValue(mockResponse)

      // First call should work
      await trackPageView('/test-page')
      expect(global.fetch).toHaveBeenCalledTimes(1)

      // Second call immediately should be rate limited
      await trackPageView('/test-page')
      expect(global.fetch).toHaveBeenCalledTimes(1) // Still 1, not 2
    })
  })

  describe('trackEngagement', () => {
    test('tracks engagement successfully', async () => {
      const mockResponse = { ok: true, json: () => Promise.resolve({ success: true }) }
      global.fetch.mockResolvedValue(mockResponse)

      await trackEngagement('scroll', { depth: 50 })

      expect(global.fetch).toHaveBeenCalledWith('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('"type":"engagement"')
      })
    })

    test('handles API errors gracefully', async () => {
      global.fetch.mockRejectedValue(new Error('API Error'))

      await expect(trackEngagement('click', { element: 'button' })).resolves.not.toThrow()
    })

    test('respects rate limiting', async () => {
      const mockResponse = { ok: true, json: () => Promise.resolve({ success: true }) }
      global.fetch.mockResolvedValue(mockResponse)

      // First call should work
      await trackEngagement('scroll', { depth: 50 })
      expect(global.fetch).toHaveBeenCalledTimes(1)

      // Second call immediately should be rate limited
      await trackEngagement('scroll', { depth: 75 })
      expect(global.fetch).toHaveBeenCalledTimes(1) // Still 1, not 2
    })
  })
})
