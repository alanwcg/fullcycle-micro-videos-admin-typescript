/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.(spec|int-spec)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  coverageProvider: 'v8',
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '.interface.ts',
    'shared/testing',
    'shared-module/testing',
    'validator-rules.ts',
    '-fixture.ts',
    '.input.ts',
    '.d.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  testEnvironment: 'node',
  clearMocks: true,
  setupFilesAfterEnv: ['./core/shared/infra/testing/expect-helpers.ts'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/../$1',
  },
};

export default config;
