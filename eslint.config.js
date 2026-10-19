import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import stylistic from '@stylistic/eslint-plugin';
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
        plugins: { react, '@stylistic': stylistic },
        // Version fixée plutôt que `detect` : la détection automatique du
        // plugin s'appuie sur une API d'ESLint 9 et échoue sous ESLint 10.
        settings: { react: { version: '19.2' } },
        rules: {
            // React 19 ne valide plus les `propTypes` à l'exécution : une prop
            // erronée ne produit plus aucun avertissement en console. Le contrôle
            // est donc confié à ESLint, qui le fait plus tôt — avant même de lancer
            // l'application.
            'react/prop-types': 'error',
            // Règles de mise en forme, prises dans @stylistic : celles du cœur
            // d'ESLint (`semi`, `indent`…) sont dépréciées depuis ESLint 9.
            // Point-virgule obligatoire et indentation à 4 espaces, JSX compris.
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/indent': ['error', 4],
            '@stylistic/jsx-indent-props': ['error', 4],
        },
    },
]);
