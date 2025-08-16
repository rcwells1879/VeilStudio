import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  // Import the relevant helpers
})

export default [
  ...compat.extends('next/core-web-vitals'),
  {
    rules: {
      // Add any custom rules here
    },
  },
]