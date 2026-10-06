import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react },
    // Version fixée plutôt que `detect` : la détection automatique du
    // plugin s'appuie sur une API d'ESLint 9 et échoue sous ESLint 10.
    settings: { react: { version: '19.2' } },
    rules: {
      // React 19 ne valide plus les `propTypes` à l'exécution : une prop
      // erronée ne produit plus aucun avertissement en console. Le contrôle
      // est donc confié à ESLint, qui le fait plus tôt — avant même de lancer
      // l'application.
      'react/prop-types': 'error',
      // Point-virgule obligatoire en fin d'instruction, pour un style
      // uniforme sur tout le projet.
      semi: ['error', 'always'],
    },
  },
]);
