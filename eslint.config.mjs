import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["src/**/*.ts", "test/**/*.ts"],
  },
  {
    ignores: [
      'build/**',
      'dist/**',
      'demo/**',
      'docs/**',
      "**/*.mjs",
      "index.d.ts",
      "jest.config.js",
      "rollup.config.js",
    ],
  },
  {
    languageOptions: { globals: globals.node }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      "max-params": ["error", 5],
    },
  },

  {
    files: ["test/**/*.ts"],
    rules: {
      "max-params": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-explicit-any": "off"
    },
  },
];
