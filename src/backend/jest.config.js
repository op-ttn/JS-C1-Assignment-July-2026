/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/tests/**/*.test.js'],
  setupFiles: ['<rootDir>/tests/setupEnv.js'],
  // Clear module registry between files so DATABASE_URL from setupEnv wins
  // before prisma / app modules are first imported.
  clearMocks: true,
};
