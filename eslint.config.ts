import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  tseslint.configs.recommended as any,
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      ...(eslintPluginPrettier.configs?.recommended as any)?.rules,
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: false,
          trailingComma: 'all',
          arrowParens: 'always',
        },
      ],
    },
  },
  {
    rules: {
      'no-undef': 'off',
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-dynamic-delete': 'off',
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '.env'],
  },
])
