// Integration test setup
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

// Set up test database
const TEST_DB_PATH = path.join(process.cwd(), 'test-portfolio.db')

beforeAll(async () => {
  // Create test database
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH)
  }
  
  // Set test environment variables
  process.env.NODE_ENV = 'test'
  process.env.DATABASE_PATH = TEST_DB_PATH
  process.env.ADMIN_USERNAME = 'testadmin'
  process.env.ADMIN_PASSWORD = 'testpassword123'
  process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud'
  process.env.CLOUDINARY_API_KEY = 'test-key'
  process.env.CLOUDINARY_API_SECRET = 'test-secret'
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = 'test-cloud'
})

afterAll(async () => {
  // Clean up test database
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH)
  }
})

// Global test utilities
global.createTestUser = () => ({
  username: 'testadmin',
  password: 'testpassword123'
})

global.createTestProject = () => ({
  title: 'Test Project',
  description: 'A test project for integration testing',
  category: 'E-commerce',
  technologies: 'React, Node.js, SQLite',
  featured: true,
  image_url: 'https://example.com/test-image.jpg',
  image_public_id: 'test-image'
})

global.createTestSkill = () => ({
  name: 'Test Skill',
  category: 'Frontend',
  level: 'Expert',
  icon: '🧪'
})

global.createTestExperience = () => ({
  company: 'Test Company',
  position: 'Test Position',
  description: 'Test experience description',
  start_date: '2023-01-01',
  end_date: '2023-12-31',
  current: false
})

global.createTestContactMessage = () => ({
  name: 'Test User',
  email: 'test@example.com',
  subject: 'Test Subject',
  message: 'This is a test message for integration testing.'
})
