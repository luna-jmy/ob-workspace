import { defineConfig } from "eslint/config";
import obsidianmd from "eslint-plugin-obsidianmd";

export default defineConfig(
  { ignores: ["main.js", "node_modules/**", "release/**"] },
  ...obsidianmd.configs.recommended,
  {
    plugins: { obsidianmd },
    languageOptions: {
      parserOptions: {
        projectService: { allowDefaultProject: ["eslint.config.*", "esbuild.config.mjs", "scripts/*.mjs"] }
      }
    },
    rules: {
      "obsidianmd/ui/sentence-case": "off"
    }
  },
  {
    files: ["*.config.mjs", "scripts/*.mjs"],
    plugins: { obsidianmd },
    languageOptions: { globals: { process: "readonly", console: "readonly" } },
    rules: {
      "no-console": "off",
      "obsidianmd/no-nodejs-modules": "off",
      "obsidianmd/rule-custom-message": "off"
    }
  },
  {
    files: ["src/services/script-runner.ts"],
    plugins: { obsidianmd },
    rules: {
      "no-new-func": "off",
      "@typescript-eslint/no-implied-eval": "off",
      "obsidianmd/rule-custom-message": "off"
    }
  }
);
