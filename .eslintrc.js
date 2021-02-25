module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'prettier', 'prettier/react', 'plugin:react/recommended', 'airbnb'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  rules: {
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'linebreak-style': [0],
    'import/no-unresolved': [0],
    'no-unused-vars': [
      1,
      {
        argsIgnorePattern: 'res|next|^err',
      },
    ],
    'no-console': [0],
    'react/jsx-filename-extension': [0],
    'react/prop-types': [0],
    'arrow-body-style': [0],
    'no-return-await': [0],
    'max-len': [0],
    'arrow-parens': [2, 'as-needed'],
    'no-param-reassign': [0],
  },
}
