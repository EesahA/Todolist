module.exports = {
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/src/tests/**/*.test.js'
  ],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios)/)'
  ],
  moduleNameMapper: {
    '^axios$': '<rootDir>/node_modules/axios/dist/axios.js'
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.js'
  ],
  moduleDirectories: ['node_modules', 'src']
}; 