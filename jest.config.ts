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
  testEnvironment: 'node',
  clearMocks: true,
  setupFilesAfterEnv: ['./core/shared/infra/testing/expect-helpers.ts'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/../$1',
  },
};

export default config;
