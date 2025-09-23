import { getDatabase } from '../../../../lib/database'

describe('Analytics Integration Tests', () => {
  let db

  beforeAll(async () => {
    db = getDatabase()
  })

  beforeEach(async () => {
    // Clean up analytics tables before each test
    const deletePageViews = db.prepare('DELETE FROM page_views')
    const deleteVisitors = db.prepare('DELETE FROM visitors')
    const deleteEngagement = db.prepare('DELETE FROM engagement_metrics')
    
    deletePageViews.run()
    deleteVisitors.run()
    deleteEngagement.run()
  })

  test('should track page views and create visitor records', async () => {
    const pageViewData = {
      page: '/',
      visitor_id: 'visitor_12345',
      user_agent: 'Mozilla/5.0 (Test Browser)',
      referrer: 'https://google.com',
      ip_address: '127.0.0.1'
    }

    // Insert page view
    const insertPageView = db.prepare(`
      INSERT INTO page_views (page, visitor_id, user_agent, referrer, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `)
    
    const pageViewResult = insertPageView.run(
      pageViewData.page,
      pageViewData.visitor_id,
      pageViewData.user_agent,
      pageViewData.referrer,
      pageViewData.ip_address
    )
    
    expect(pageViewResult.lastInsertRowid).toBeDefined()

    // Insert visitor record
    const insertVisitor = db.prepare(`
      INSERT INTO visitors (visitor_id, first_visit, last_visit, total_views)
      VALUES (?, datetime('now'), datetime('now'), 1)
    `)
    
    const visitorResult = insertVisitor.run(pageViewData.visitor_id)
    expect(visitorResult.lastInsertRowid).toBeDefined()

    // Verify page view was recorded
    const selectPageView = db.prepare('SELECT * FROM page_views WHERE id = ?')
    const pageView = selectPageView.get(pageViewResult.lastInsertRowid)
    
    expect(pageView).toBeDefined()
    expect(pageView.page).toBe(pageViewData.page)
    expect(pageView.visitor_id).toBe(pageViewData.visitor_id)
    expect(pageView.user_agent).toBe(pageViewData.user_agent)
    expect(pageView.referrer).toBe(pageViewData.referrer)
    expect(pageView.ip_address).toBe(pageViewData.ip_address)
    expect(pageView.timestamp).toBeDefined()

    // Verify visitor was recorded
    const selectVisitor = db.prepare('SELECT * FROM visitors WHERE visitor_id = ?')
    const visitor = selectVisitor.get(pageViewData.visitor_id)
    
    expect(visitor).toBeDefined()
    expect(visitor.visitor_id).toBe(pageViewData.visitor_id)
    expect(visitor.total_views).toBe(1)
    expect(visitor.first_visit).toBeDefined()
    expect(visitor.last_visit).toBeDefined()
  })

  test('should track engagement metrics', async () => {
    const engagementData = {
      visitor_id: 'visitor_67890',
      event_type: 'scroll',
      event_data: JSON.stringify({ depth: 75, page: '/' }),
      page: '/',
      timestamp: new Date().toISOString()
    }

    const insertEngagement = db.prepare(`
      INSERT INTO engagement_metrics (visitor_id, event_type, event_data, page, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `)
    
    const result = insertEngagement.run(
      engagementData.visitor_id,
      engagementData.event_type,
      engagementData.event_data,
      engagementData.page,
      engagementData.timestamp
    )
    
    expect(result.lastInsertRowid).toBeDefined()

    // Verify engagement was recorded
    const selectEngagement = db.prepare('SELECT * FROM engagement_metrics WHERE id = ?')
    const engagement = selectEngagement.get(result.lastInsertRowid)
    
    expect(engagement).toBeDefined()
    expect(engagement.visitor_id).toBe(engagementData.visitor_id)
    expect(engagement.event_type).toBe(engagementData.event_type)
    expect(engagement.event_data).toBe(engagementData.event_data)
    expect(engagement.page).toBe(engagementData.page)
    expect(engagement.timestamp).toBe(engagementData.timestamp)
  })

  test('should handle multiple page views for same visitor', async () => {
    const visitorId = 'visitor_multi'
    const pages = ['/', '/about', '/projects', '/contact']

    const insertPageView = db.prepare(`
      INSERT INTO page_views (page, visitor_id, user_agent, referrer, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `)

    const insertVisitor = db.prepare(`
      INSERT OR REPLACE INTO visitors (visitor_id, first_visit, last_visit, total_views)
      VALUES (?, datetime('now'), datetime('now'), 
        (SELECT COALESCE(COUNT(*), 0) + 1 FROM page_views WHERE visitor_id = ?))
    `)

    // Insert multiple page views
    pages.forEach(page => {
      insertPageView.run(page, visitorId, 'Test Browser', '', '127.0.0.1')
      insertVisitor.run(visitorId, visitorId)
    })

    // Verify all page views were recorded
    const selectPageViews = db.prepare('SELECT * FROM page_views WHERE visitor_id = ?')
    const pageViews = selectPageViews.all(visitorId)
    
    expect(pageViews).toHaveLength(4)
    expect(pageViews.map(pv => pv.page)).toEqual(expect.arrayContaining(pages))

    // Verify visitor total views
    const selectVisitor = db.prepare('SELECT * FROM visitors WHERE visitor_id = ?')
    const visitor = selectVisitor.get(visitorId)
    
    expect(visitor).toBeDefined()
    expect(visitor.total_views).toBe(4)
  })

  test('should aggregate analytics data correctly', async () => {
    // Insert test data
    const visitors = ['visitor_1', 'visitor_2', 'visitor_3']
    const pages = ['/', '/about', '/projects']

    const insertPageView = db.prepare(`
      INSERT INTO page_views (page, visitor_id, user_agent, referrer, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `)

    const insertVisitor = db.prepare(`
      INSERT OR REPLACE INTO visitors (visitor_id, first_visit, last_visit, total_views)
      VALUES (?, datetime('now'), datetime('now'), 1)
    `)

    // Create test data
    visitors.forEach(visitorId => {
      pages.forEach(page => {
        insertPageView.run(page, visitorId, 'Test Browser', '', '127.0.0.1')
      })
      insertVisitor.run(visitorId, visitorId)
    })

    // Test aggregations
    const totalPageViews = db.prepare('SELECT COUNT(*) as count FROM page_views').get()
    expect(totalPageViews.count).toBe(9) // 3 visitors × 3 pages

    const uniqueVisitors = db.prepare('SELECT COUNT(*) as count FROM visitors').get()
    expect(uniqueVisitors.count).toBe(3)

    const pageViewStats = db.prepare(`
      SELECT page, COUNT(*) as views 
      FROM page_views 
      GROUP BY page 
      ORDER BY views DESC
    `).all()
    
    expect(pageViewStats).toHaveLength(3)
    pageViewStats.forEach(stat => {
      expect(stat.views).toBe(3) // Each page viewed by 3 visitors
    })

    const topPages = db.prepare(`
      SELECT page, COUNT(*) as views 
      FROM page_views 
      GROUP BY page 
      ORDER BY views DESC 
      LIMIT 5
    `).all()
    
    expect(topPages).toHaveLength(3)
    expect(topPages[0].page).toBeDefined()
    expect(topPages[0].views).toBe(3)
  })

  test('should handle engagement metrics aggregation', async () => {
    const engagementEvents = [
      { visitor_id: 'visitor_1', event_type: 'scroll', page: '/' },
      { visitor_id: 'visitor_1', event_type: 'click', page: '/' },
      { visitor_id: 'visitor_2', event_type: 'scroll', page: '/about' },
      { visitor_id: 'visitor_2', event_type: 'scroll', page: '/about' },
      { visitor_id: 'visitor_3', event_type: 'click', page: '/projects' }
    ]

    const insertEngagement = db.prepare(`
      INSERT INTO engagement_metrics (visitor_id, event_type, event_data, page, timestamp)
      VALUES (?, ?, ?, ?, datetime('now'))
    `)

    engagementEvents.forEach(event => {
      insertEngagement.run(
        event.visitor_id,
        event.event_type,
        JSON.stringify({ test: 'data' }),
        event.page
      )
    })

    // Test engagement aggregations
    const totalEngagements = db.prepare('SELECT COUNT(*) as count FROM engagement_metrics').get()
    expect(totalEngagements.count).toBe(5)

    const eventTypeStats = db.prepare(`
      SELECT event_type, COUNT(*) as count 
      FROM engagement_metrics 
      GROUP BY event_type
    `).all()
    
    expect(eventTypeStats).toHaveLength(2)
    const scrollEvents = eventTypeStats.find(stat => stat.event_type === 'scroll')
    const clickEvents = eventTypeStats.find(stat => stat.event_type === 'click')
    
    expect(scrollEvents.count).toBe(3)
    expect(clickEvents.count).toBe(2)

    const pageEngagement = db.prepare(`
      SELECT page, COUNT(*) as engagements 
      FROM engagement_metrics 
      GROUP BY page 
      ORDER BY engagements DESC
    `).all()
    
    expect(pageEngagement).toHaveLength(3)
    expect(pageEngagement[0].engagements).toBeGreaterThanOrEqual(1)
  })
})
