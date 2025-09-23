import { getDatabase } from '../../../../lib/database'

describe('Skills API Integration Tests', () => {
  let db

  beforeAll(async () => {
    db = getDatabase()
  })

  beforeEach(async () => {
    // Clean up skills table before each test
    const deleteStmt = db.prepare('DELETE FROM skills')
    deleteStmt.run()
  })

  test('should create, read, update, and delete a skill', async () => {
    // Create skill
    const skillData = global.createTestSkill()
    const insertStmt = db.prepare(`
      INSERT INTO skills (name, category, level, icon)
      VALUES (?, ?, ?, ?)
    `)
    
    const result = insertStmt.run(
      skillData.name,
      skillData.category,
      skillData.level,
      skillData.icon
    )
    
    expect(result.lastInsertRowid).toBeDefined()
    const skillId = result.lastInsertRowid

    // Read skill
    const selectStmt = db.prepare('SELECT * FROM skills WHERE id = ?')
    const skill = selectStmt.get(skillId)
    
    expect(skill).toBeDefined()
    expect(skill.name).toBe(skillData.name)
    expect(skill.category).toBe(skillData.category)
    expect(skill.level).toBe(skillData.level)
    expect(skill.icon).toBe(skillData.icon)

    // Update skill
    const updateStmt = db.prepare(`
      UPDATE skills 
      SET name = ?, level = ?
      WHERE id = ?
    `)
    
    const updateResult = updateStmt.run(
      'Updated Test Skill',
      'Advanced',
      skillId
    )
    
    expect(updateResult.changes).toBe(1)

    // Verify update
    const updatedSkill = selectStmt.get(skillId)
    expect(updatedSkill.name).toBe('Updated Test Skill')
    expect(updatedSkill.level).toBe('Advanced')

    // Delete skill
    const deleteStmt = db.prepare('DELETE FROM skills WHERE id = ?')
    const deleteResult = deleteStmt.run(skillId)
    
    expect(deleteResult.changes).toBe(1)

    // Verify deletion
    const deletedSkill = selectStmt.get(skillId)
    expect(deletedSkill).toBeUndefined()
  })

  test('should handle skills with different categories', async () => {
    const skills = [
      { name: 'React', category: 'Frontend', level: 'Expert', icon: '⚛️' },
      { name: 'Node.js', category: 'Backend', level: 'Advanced', icon: '🟢' },
      { name: 'JavaScript', category: 'Languages', level: 'Expert', icon: '🟨' },
      { name: 'SQLite', category: 'Database', level: 'Intermediate', icon: '🗄️' },
      { name: 'React Native', category: 'Mobile', level: 'Advanced', icon: '📱' }
    ]

    const insertStmt = db.prepare(`
      INSERT INTO skills (name, category, level, icon)
      VALUES (?, ?, ?, ?)
    `)

    skills.forEach(skill => {
      insertStmt.run(skill.name, skill.category, skill.level, skill.icon)
    })

    // Test filtering by category
    const frontendStmt = db.prepare('SELECT * FROM skills WHERE category = ?')
    const frontendSkills = frontendStmt.all('Frontend')
    expect(frontendSkills).toHaveLength(1)
    expect(frontendSkills[0].name).toBe('React')

    // Test expert level skills
    const expertStmt = db.prepare('SELECT * FROM skills WHERE level = ?')
    const expertSkills = expertStmt.all('Expert')
    expect(expertSkills).toHaveLength(2)
    expect(expertSkills.map(s => s.name)).toContain('React')
    expect(expertSkills.map(s => s.name)).toContain('JavaScript')

    // Test all skills count
    const countStmt = db.prepare('SELECT COUNT(*) as count FROM skills')
    const countResult = countStmt.get()
    expect(countResult.count).toBe(5)
  })

  test('should handle skill with all required fields', async () => {
    const skillData = {
      name: 'Complete Test Skill',
      category: 'Frontend',
      level: 'Expert',
      icon: '🧪'
    }

    const insertStmt = db.prepare(`
      INSERT INTO skills (name, category, level, icon)
      VALUES (?, ?, ?, ?)
    `)
    
    const result = insertStmt.run(
      skillData.name,
      skillData.category,
      skillData.level,
      skillData.icon
    )
    
    expect(result.lastInsertRowid).toBeDefined()

    const selectStmt = db.prepare('SELECT * FROM skills WHERE id = ?')
    const skill = selectStmt.get(result.lastInsertRowid)
    
    expect(skill.name).toBe(skillData.name)
    expect(skill.category).toBe(skillData.category)
    expect(skill.level).toBe(skillData.level)
    expect(skill.icon).toBe(skillData.icon)
    expect(skill.created_at).toBeDefined()
    expect(skill.updated_at).toBeDefined()
  })

  test('should handle duplicate skill names gracefully', async () => {
    const skillData = global.createTestSkill()
    
    const insertStmt = db.prepare(`
      INSERT INTO skills (name, category, level, icon)
      VALUES (?, ?, ?, ?)
    `)
    
    // Insert first skill
    const result1 = insertStmt.run(
      skillData.name,
      skillData.category,
      skillData.level,
      skillData.icon
    )
    
    expect(result1.lastInsertRowid).toBeDefined()

    // Try to insert duplicate skill (should work as we don't have unique constraint)
    const result2 = insertStmt.run(
      skillData.name,
      skillData.category,
      skillData.level,
      skillData.icon
    )
    
    expect(result2.lastInsertRowid).toBeDefined()
    expect(result2.lastInsertRowid).not.toBe(result1.lastInsertRowid)

    // Verify both skills exist
    const selectStmt = db.prepare('SELECT * FROM skills WHERE name = ?')
    const skills = selectStmt.all(skillData.name)
    expect(skills).toHaveLength(2)
  })
})
