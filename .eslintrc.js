module.exports = {
  root: true,

  env: {
		browser: true,
		es6: true,
		node: true,
  },

  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    extraFileExtensions: ['.json'],
  },

  ignorePatterns: [
		'.eslintrc.js',
		'**/*.js',
		'**/node_modules/**',
		'**/dist/**',
	],

  plugins: ['eslint-plugin-n8n-nodes-base'],

  extends: ['plugin:n8n-nodes-base/nodes'],

  rules: {
    'n8n-nodes-base/node-dirname-against-convention': 'off',
  },
};