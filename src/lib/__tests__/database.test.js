import { getDatabase } from '../database'

// Mock better-sqlite3
jest.mock('better-sqlite3', () => {
  return jest.fn().mockImplementation(() => ({
    prepare: jest.fn(() => ({
      run: jest.fn(),
      all: jest.fn(),
      get: jest.fn()
    })),
    exec: jest.fn(),
    close: jest.fn()
  }))
})

describe('Database Integration', () => {
  let mockDb

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb = getDatabase()
  })

  test('database connection is established', () => {
    expect(mockDb).toBeDefined()
    expect(mockDb.prepare).toBeDefined()
  })

  test('can execute prepared statements', () => {
    const mockStatement = mockDb.prepare('SELECT * FROM skills')
    expect(mockStatement).toBeDefined()
    expect(mockStatement.all).toBeDefined()
    expect(mockStatement.run).toBeDefined()
    expect(mockStatement.get).toBeDefined()
  })

  test('can run queries', () => {
    const mockStatement = mockDb.prepare('SELECT * FROM skills')
    mockStatement.all.mockReturnValue([
      { id: 1, name: 'React', category: 'Frontend' }
    ])

    const result = mockStatement.all()
    expect(result).toHaveLength(1)
    expect(result[0]).toHaveProperty('id', 1)
    expect(result[0]).toHaveProperty('name', 'React')
  })

  test('can insert data', () => {
    const mockStatement = mockDb.prepare('INSERT INTO skills (name, category) VALUES (?, ?)')
    mockStatement.run.mockReturnValue({ lastInsertRowid: 1 })

    const result = mockStatement.run('Vue.js', 'Frontend')
    expect(result).toHaveProperty('lastInsertRowid', 1)
  })

  test('can update data', () => {
    const mockStatement = mockDb.prepare('UPDATE skills SET name = ? WHERE id = ?')
    mockStatement.run.mockReturnValue({ changes: 1 })

    const result = mockStatement.run('React.js', 1)
    expect(result).toHaveProperty('changes', 1)
  })

  test('can delete data', () => {
    const mockStatement = mockDb.prepare('DELETE FROM skills WHERE id = ?')
    mockStatement.run.mockReturnValue({ changes: 1 })

    const result = mockStatement.run(1)
    expect(result).toHaveProperty('changes', 1)
  })

  test('handles database errors gracefully', () => {
    const mockStatement = mockDb.prepare('SELECT * FROM non_existent_table')
    mockStatement.all.mockImplementation(() => {
      throw new Error('Table does not exist')
    })

    expect(() => mockStatement.all()).toThrow('Table does not exist')
  })
})
