import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    globals: {
      ...globals.browser,
      ...globals.node,
      Bun: "readonly",
    },
  },
  plugins: { js },
  extends: ["js/recommended"],
  rules: {
    "no-unused-vars": "warn",
    "no-undef": "warn",
  },
});
