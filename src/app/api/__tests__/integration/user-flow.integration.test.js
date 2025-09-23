import { getDatabase } from '../../../../lib/database'

describe('User Flow Integration Tests', () => {
  let db

  beforeAll(async () => {
    db = getDatabase()
  })

  beforeEach(async () => {
    // Clean up all tables before each test
    const tables = ['projects', 'skills', 'experience', 'contact_messages', 'page_views', 'visitors', 'engagement_metrics', 'about_content']
    
    tables.forEach(table => {
      const deleteStmt = db.prepare(`DELETE FROM ${table}`)
      deleteStmt.run()
    })
  })

  test('should handle complete portfolio data setup', async () => {
    // Setup projects
    const projects = [
      {
        title: 'E-commerce Platform',
        description: 'Modern e-commerce solution with Stripe integration',
        category: 'E-commerce',
        technologies: 'React, Node.js, Stripe, SQLite',
        featured: true,
        image_url: 'https://example.com/ecommerce.jpg',
        image_public_id: 'ecommerce'
      },
      {
        title: 'Business Management System',
        description: 'Comprehensive business platform for SMEs',
        category: 'Business Platform',
        technologies: 'Vue.js, Express, MongoDB',
        featured: true,
        image_url: 'https://example.com/business.jpg',
        image_public_id: 'business'
      }
    ]

    const insertProject = db.prepare(`
      INSERT INTO projects (title, description, category, technologies, featured, image_url, image_public_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    projects.forEach(project => {
      insertProject.run(
        project.title,
        project.description,
        project.category,
        project.technologies,
        project.featured ? 1 : 0,
        project.image_url,
        project.image_public_id
      )
    })

    // Setup skills
    const skills = [
      { name: 'React', category: 'Frontend', level: 'Expert', icon: '⚛️' },
      { name: 'Node.js', category: 'Backend', level: 'Advanced', icon: '🟢' },
      { name: 'JavaScript', category: 'Languages', level: 'Expert', icon: '🟨' }
    ]

    const insertSkill = db.prepare(`
      INSERT INTO skills (name, category, level, icon)
      VALUES (?, ?, ?, ?)
    `)

    skills.forEach(skill => {
      insertSkill.run(skill.name, skill.category, skill.level, skill.icon)
    })

    // Setup experience
    const experiences = [
      {
        company: 'Tech Solutions Inc',
        position: 'Full-Stack Developer',
        description: 'Developed web applications using modern technologies',
        start_date: '2022-01-01',
        end_date: '2023-12-31',
        current: false
      }
    ]

    const insertExperience = db.prepare(`
      INSERT INTO experience (company, position, description, start_date, end_date, current)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    experiences.forEach(exp => {
      insertExperience.run(
        exp.company,
        exp.position,
        exp.description,
        exp.start_date,
        exp.end_date,
        exp.current ? 1 : 0
      )
    })

    // Setup about content
    const aboutContent = [
      {
        section: 'main_description',
        title: 'About Me',
        content: 'I am a passionate full-stack developer with 5 years of experience.'
      },
      {
        section: 'experience_paragraph',
        title: 'Experience',
        content: 'With over 5 years of experience in web development...'
      }
    ]

    const insertAbout = db.prepare(`
      INSERT INTO about_content (section, title, content)
      VALUES (?, ?, ?)
    `)

    aboutContent.forEach(content => {
      insertAbout.run(content.section, content.title, content.content)
    })

    // Verify all data was inserted correctly
    const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get()
    expect(projectCount.count).toBe(2)

    const skillCount = db.prepare('SELECT COUNT(*) as count FROM skills').get()
    expect(skillCount.count).toBe(3)

    const experienceCount = db.prepare('SELECT COUNT(*) as count FROM experience').get()
    expect(experienceCount.count).toBe(1)

    const aboutCount = db.prepare('SELECT COUNT(*) as count FROM about_content').get()
    expect(aboutCount.count).toBe(2)

    // Test data relationships and integrity
    const featuredProjects = db.prepare('SELECT * FROM projects WHERE featured = 1').all()
    expect(featuredProjects).toHaveLength(2)

    const frontendSkills = db.prepare('SELECT * FROM skills WHERE category = ?').all('Frontend')
    expect(frontendSkills).toHaveLength(1)
    expect(frontendSkills[0].name).toBe('React')

    const currentExperience = db.prepare('SELECT * FROM experience WHERE current = 1').all()
    expect(currentExperience).toHaveLength(0) // No current experience in test data
  })

  test('should handle contact form submission flow', async () => {
    const contactData = global.createTestContactMessage()

    const insertContact = db.prepare(`
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `)
    
    const result = insertContact.run(
      contactData.name,
      contactData.email,
      contactData.subject,
      contactData.message
    )
    
    expect(result.lastInsertRowid).toBeDefined()

    // Verify contact message was stored
    const selectContact = db.prepare('SELECT * FROM contact_messages WHERE id = ?')
    const contact = selectContact.get(result.lastInsertRowid)
    
    expect(contact).toBeDefined()
    expect(contact.name).toBe(contactData.name)
    expect(contact.email).toBe(contactData.email)
    expect(contact.subject).toBe(contactData.subject)
    expect(contact.message).toBe(contactData.message)
    expect(contact.read).toBe(0) // Should be unread by default
    expect(contact.created_at).toBeDefined()

    // Test contact message status updates
    const updateStatus = db.prepare('UPDATE contact_messages SET read = 1 WHERE id = ?')
    const updateResult = updateStatus.run(result.lastInsertRowid)
    
    expect(updateResult.changes).toBe(1)

    const updatedContact = selectContact.get(result.lastInsertRowid)
    expect(updatedContact.read).toBe(1)
  })

  test('should handle analytics tracking for user journey', async () => {
    const visitorId = 'visitor_journey_test'
    const userJourney = [
      { page: '/', event_type: 'page_view' },
      { page: '/', event_type: 'scroll', event_data: { depth: 50 } },
      { page: '/about', event_type: 'page_view' },
      { page: '/about', event_type: 'scroll', event_data: { depth: 75 } },
      { page: '/projects', event_type: 'page_view' },
      { page: '/projects', event_type: 'click', event_data: { element: 'project-card' } },
      { page: '/contact', event_type: 'page_view' },
      { page: '/contact', event_type: 'form_submit', event_data: { form: 'contact' } }
    ]

    const insertPageView = db.prepare(`
      INSERT INTO page_views (page, visitor_id, user_agent, referrer, ip_address)
      VALUES (?, ?, ?, ?, ?)
    `)

    const insertEngagement = db.prepare(`
      INSERT INTO engagement_metrics (visitor_id, event_type, event_data, page, timestamp)
      VALUES (?, ?, ?, ?, datetime('now'))
    `)

    const insertVisitor = db.prepare(`
      INSERT OR REPLACE INTO visitors (visitor_id, first_visit, last_visit, total_views)
      VALUES (?, datetime('now'), datetime('now'), 
        (SELECT COALESCE(COUNT(*), 0) + 1 FROM page_views WHERE visitor_id = ?))
    `)

    // Simulate user journey
    userJourney.forEach(step => {
      if (step.event_type === 'page_view') {
        insertPageView.run(step.page, visitorId, 'Test Browser', '', '127.0.0.1')
        insertVisitor.run(visitorId, visitorId)
      } else {
        insertEngagement.run(
          visitorId,
          step.event_type,
          JSON.stringify(step.event_data),
          step.page
        )
      }
    })

    // Verify analytics data
    const pageViews = db.prepare('SELECT * FROM page_views WHERE visitor_id = ?').all(visitorId)
    expect(pageViews).toHaveLength(4) // 4 page views

    const engagements = db.prepare('SELECT * FROM engagement_metrics WHERE visitor_id = ?').all(visitorId)
    expect(engagements).toHaveLength(4) // 4 engagement events

    const visitor = db.prepare('SELECT * FROM visitors WHERE visitor_id = ?').get(visitorId)
    expect(visitor).toBeDefined()
    expect(visitor.total_views).toBe(4)

    // Test analytics aggregations
    const pageStats = db.prepare(`
      SELECT page, COUNT(*) as views 
      FROM page_views 
      WHERE visitor_id = ?
      GROUP BY page
    `).all(visitorId)
    
    expect(pageStats).toHaveLength(4)
    expect(pageStats.find(stat => stat.page === '/').views).toBe(1)
    expect(pageStats.find(stat => stat.page === '/about').views).toBe(1)
    expect(pageStats.find(stat => stat.page === '/projects').views).toBe(1)
    expect(pageStats.find(stat => stat.page === '/contact').views).toBe(1)

    const engagementStats = db.prepare(`
      SELECT event_type, COUNT(*) as count 
      FROM engagement_metrics 
      WHERE visitor_id = ?
      GROUP BY event_type
    `).all(visitorId)
    
    expect(engagementStats).toHaveLength(3)
    expect(engagementStats.find(stat => stat.event_type === 'scroll').count).toBe(2)
    expect(engagementStats.find(stat => stat.event_type === 'click').count).toBe(1)
    expect(engagementStats.find(stat => stat.event_type === 'form_submit').count).toBe(1)
  })

  test('should handle admin workflow with data management', async () => {
    // Setup initial data
    const initialProject = global.createTestProject()
    const insertProject = db.prepare(`
      INSERT INTO projects (title, description, category, technologies, featured, image_url, image_public_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    
    const projectResult = insertProject.run(
      initialProject.title,
      initialProject.description,
      initialProject.category,
      initialProject.technologies,
      initialProject.featured ? 1 : 0,
      initialProject.image_url,
      initialProject.image_public_id
    )
    
    const projectId = projectResult.lastInsertRowid

    // Admin updates project
    const updateProject = db.prepare(`
      UPDATE projects 
      SET title = ?, description = ?, category = ?, updated_at = datetime('now')
      WHERE id = ?
    `)
    
    const updateResult = updateProject.run(
      'Updated Project Title',
      'Updated project description with more details',
      'Business Platform',
      projectId
    )
    
    expect(updateResult.changes).toBe(1)

    // Admin adds new skill
    const newSkill = global.createTestSkill()
    const insertSkill = db.prepare(`
      INSERT INTO skills (name, category, level, icon)
      VALUES (?, ?, ?, ?)
    `)
    
    const skillResult = insertSkill.run(
      newSkill.name,
      newSkill.category,
      newSkill.level,
      newSkill.icon
    )
    
    expect(skillResult.lastInsertRowid).toBeDefined()

    // Admin views contact messages
    const contactMessage = global.createTestContactMessage()
    const insertContact = db.prepare(`
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `)
    
    const contactResult = insertContact.run(
      contactMessage.name,
      contactMessage.email,
      contactMessage.subject,
      contactMessage.message
    )
    
    // Admin marks message as read
    const markAsRead = db.prepare('UPDATE contact_messages SET read = 1 WHERE id = ?')
    const readResult = markAsRead.run(contactResult.lastInsertRowid)
    
    expect(readResult.changes).toBe(1)

    // Verify admin changes
    const updatedProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId)
    expect(updatedProject.title).toBe('Updated Project Title')
    expect(updatedProject.description).toBe('Updated project description with more details')
    expect(updatedProject.category).toBe('Business Platform')

    const newSkillRecord = db.prepare('SELECT * FROM skills WHERE id = ?').get(skillResult.lastInsertRowid)
    expect(newSkillRecord.name).toBe(newSkill.name)
    expect(newSkillRecord.category).toBe(newSkill.category)

    const readContact = db.prepare('SELECT * FROM contact_messages WHERE id = ?').get(contactResult.lastInsertRowid)
    expect(readContact.read).toBe(1)
  })
})
