import { getDatabase } from '../../../../lib/database'

describe('Projects API Integration Tests', () => {
  let db

  beforeAll(async () => {
    db = getDatabase()
  })

  beforeEach(async () => {
    // Clean up projects table before each test
    const deleteStmt = db.prepare('DELETE FROM projects')
    deleteStmt.run()
  })

  test('should create, read, update, and delete a project', async () => {
    // Create project
    const projectData = global.createTestProject()
    const insertStmt = db.prepare(`
      INSERT INTO projects (title, description, category, technologies, featured, image_url, image_public_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    
    const result = insertStmt.run(
      projectData.title,
      projectData.description,
      projectData.category,
      projectData.technologies,
      projectData.featured ? 1 : 0,
      projectData.image_url,
      projectData.image_public_id
    )
    
    expect(result.lastInsertRowid).toBeDefined()
    const projectId = result.lastInsertRowid

    // Read project
    const selectStmt = db.prepare('SELECT * FROM projects WHERE id = ?')
    const project = selectStmt.get(projectId)
    
    expect(project).toBeDefined()
    expect(project.title).toBe(projectData.title)
    expect(project.description).toBe(projectData.description)
    expect(project.category).toBe(projectData.category)
    expect(project.technologies).toBe(projectData.technologies)
    expect(project.featured).toBe(projectData.featured ? 1 : 0)

    // Update project
    const updateStmt = db.prepare(`
      UPDATE projects 
      SET title = ?, description = ?, category = ?
      WHERE id = ?
    `)
    
    const updateResult = updateStmt.run(
      'Updated Test Project',
      'Updated description',
      'Business Platform',
      projectId
    )
    
    expect(updateResult.changes).toBe(1)

    // Verify update
    const updatedProject = selectStmt.get(projectId)
    expect(updatedProject.title).toBe('Updated Test Project')
    expect(updatedProject.description).toBe('Updated description')
    expect(updatedProject.category).toBe('Business Platform')

    // Delete project
    const deleteStmt = db.prepare('DELETE FROM projects WHERE id = ?')
    const deleteResult = deleteStmt.run(projectId)
    
    expect(deleteResult.changes).toBe(1)

    // Verify deletion
    const deletedProject = selectStmt.get(projectId)
    expect(deletedProject).toBeUndefined()
  })

  test('should handle multiple projects with different categories', async () => {
    const projects = [
      { ...global.createTestProject(), category: 'E-commerce' },
      { ...global.createTestProject(), title: 'Business App', category: 'Business Platform' },
      { ...global.createTestProject(), title: 'Mobile App', category: 'Mobile App' }
    ]

    const insertStmt = db.prepare(`
      INSERT INTO projects (title, description, category, technologies, featured, image_url, image_public_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    projects.forEach(project => {
      insertStmt.run(
        project.title,
        project.description,
        project.category,
        project.technologies,
        project.featured ? 1 : 0,
        project.image_url,
        project.image_public_id
      )
    })

    // Test filtering by category
    const ecommerceStmt = db.prepare('SELECT * FROM projects WHERE category = ?')
    const ecommerceProjects = ecommerceStmt.all('E-commerce')
    expect(ecommerceProjects).toHaveLength(1)
    expect(ecommerceProjects[0].category).toBe('E-commerce')

    // Test featured projects
    const featuredStmt = db.prepare('SELECT * FROM projects WHERE featured = 1')
    const featuredProjects = featuredStmt.all()
    expect(featuredProjects).toHaveLength(3) // All test projects are featured

    // Test project count
    const countStmt = db.prepare('SELECT COUNT(*) as count FROM projects')
    const countResult = countStmt.get()
    expect(countResult.count).toBe(3)
  })

  test('should handle project with all required fields', async () => {
    const projectData = {
      title: 'Complete Test Project',
      description: 'A comprehensive test project with all fields',
      category: 'E-commerce',
      technologies: 'React, Node.js, SQLite, Stripe',
      featured: true,
      image_url: 'https://example.com/complete-test.jpg',
      image_public_id: 'complete-test'
    }

    const insertStmt = db.prepare(`
      INSERT INTO projects (title, description, category, technologies, featured, image_url, image_public_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    
    const result = insertStmt.run(
      projectData.title,
      projectData.description,
      projectData.category,
      projectData.technologies,
      projectData.featured ? 1 : 0,
      projectData.image_url,
      projectData.image_public_id
    )
    
    expect(result.lastInsertRowid).toBeDefined()

    const selectStmt = db.prepare('SELECT * FROM projects WHERE id = ?')
    const project = selectStmt.get(result.lastInsertRowid)
    
    expect(project.title).toBe(projectData.title)
    expect(project.description).toBe(projectData.description)
    expect(project.category).toBe(projectData.category)
    expect(project.technologies).toBe(projectData.technologies)
    expect(project.featured).toBe(1)
    expect(project.image_url).toBe(projectData.image_url)
    expect(project.image_public_id).toBe(projectData.image_public_id)
    expect(project.created_at).toBeDefined()
    expect(project.updated_at).toBeDefined()
  })
})
