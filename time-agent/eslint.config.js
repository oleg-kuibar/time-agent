// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import drizzlePlugin from "eslint-plugin-drizzle";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

// Add type declarations for modules without types
/** @type {any} */
const drizzle = drizzlePlugin;
/** @type {any} */
const reactHooks = reactHooksPlugin;
/** @type {any} */
const next = nextPlugin;

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      drizzle,
      react: reactPlugin,
      "react-hooks": reactHooks,
      "@next/next": next,
    },
    rules: {
      // Base ESLint rules
      "no-unused-vars": "off", // TypeScript handles this
      "no-console": ["warn", { allow: ["warn", "error"] }],
      
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      
      // React rules
      "react/react-in-jsx-scope": "off", // Not needed in Next.js
      "react/prop-types": "off", // We use TypeScript
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      
      // Next.js rules
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "warn",
      
      // Drizzle rules
      "drizzle/enforce-delete-with-where": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    ignores: [
      "node_modules/",
      ".next/",
      "dist/",
      "public/",
      "**/*.config.js",
      "**/*.config.mjs",
    ],
  }
); 