// eslint.config.js

import { fileURLToPath } from 'url';
import path from 'path';
import eslintJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    ignores: [
      'dist/**',
      'build/**',
      'coverage/**',
      'node_modules/**',
      '.turbo/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      '*.d.ts',
      'jest.setup.ts',
      'jest.config.ts',
      'scripts/**',
      'test/setup.ts'
    ]
  },
  // Include eslint:recommended
  eslintJs.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module'
      },
      globals: {
        // These globals are for Node.js environment
        node: true,
        // Note: Jest globals are handled in a separate config for test files
        process: true,
        console: true,
        fetch: true,
        __dirname: true,
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...tseslint.configs['recommended-requiring-type-checking'].rules,
      ...tseslint.configs.strict.rules,
      ...tseslint.configs.stylistic.rules,
      ...prettier.rules,
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  },
  // Configuration specifically for Jest test files
  {
    files: ['**/*.spec.ts', '**/*.test.ts', '**/*.spec.tsx', '**/*.test.tsx', '**/test/**/*.ts'],
    languageOptions: {
      globals: {
        // These are Jest's global variables
        jest: true,
        describe: true,
        test: true,
        it: true,
        expect: true,
        beforeAll: true,
        beforeEach: true,
        afterAll: true,
        afterEach: true,
        __dirname: true,
        process: true
      }
    },
    rules: {
      // You might want to override or add specific rules for test files
    }
  }
];