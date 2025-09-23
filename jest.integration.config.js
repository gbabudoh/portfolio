const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  displayName: 'Integration Tests',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/integration/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.integration.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testTimeout: 30000, // 30 seconds for integration tests
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.d.ts',
    '!src/app/layout.js',
    '!src/app/page.js',
  ],
}

module.exports = createJestConfig(customJestConfig)
