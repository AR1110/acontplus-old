// @ts-check
const js = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
  // Global ignores
  {
    ignores: ['**/node_modules/**', 'dist/**', 'build/**', '.angular/**', 'coverage/**'],
  },

  // Base configs for TypeScript
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ...angular.configs.tsRecommended,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    processor: angular.processInlineTemplates,
    rules: {
      // Angular specific rules
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app', // 👈 Cambia esto según tu proyecto
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app', // 👈 Cambia esto según tu proyecto
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/prefer-standalone': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'warn',
      '@angular-eslint/no-empty-lifecycle-method': 'error',
      '@angular-eslint/use-lifecycle-interface': 'error',
      '@angular-eslint/no-conflicting-lifecycle': 'error',

      // TypeScript rules
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'none',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-var-requires': 'error',

      // General code quality rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
      'no-useless-assignment': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'linebreak-style': ['error', 'unix'],

      // Disabled in favor of Prettier
      indent: 'off',
      quotes: 'off',
      semi: 'off',
    },
  },

  // HTML template files configuration
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: angular.templateParser,
    },
    plugins: {
      // @ts-ignore - Type incompatibility between angular-eslint and eslint core
      '@angular-eslint/template': angular.templatePlugin,
    },
    rules: {
      // Angular template recommended rules
      '@angular-eslint/template/no-negated-async': 'error',
      '@angular-eslint/template/no-call-expression': ['off'],
      '@angular-eslint/template/use-track-by-function': 'error',
      '@angular-eslint/template/no-any': 'error',
      '@angular-eslint/template/i18n': 'off',
      '@angular-eslint/template/banana-in-box': 'error',
      '@angular-eslint/template/prefer-self-closing-tags': 'error',
      '@angular-eslint/template/prefer-control-flow': 'error',

      // Angular template accessibility rules
      '@angular-eslint/template/click-events-have-key-events': 'warn',
      '@angular-eslint/template/interactive-supports-focus': 'warn',
      '@angular-eslint/template/mouse-events-have-key-events': 'warn',
      '@angular-eslint/template/no-positive-tabindex': 'error',
      '@angular-eslint/template/elements-content': 'error',
      '@angular-eslint/template/label-has-associated-control': 'error',
      '@angular-eslint/template/no-autofocus': 'error',
    },
  },

  // Test files configuration
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-useless-assignment': 'off',
    },
  },
]);
