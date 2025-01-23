module.exports = {
    testEnvironment: 'jsdom', // Required for React tests
    setupFilesAfterEnv: ['@testing-library/jest-dom'], // Optional, for better matchers
      testMatch: [
        '<rootDir>/tests/**/*.test.js',
        '<rootDir>/src/**/*.test.js',
      ],
  };