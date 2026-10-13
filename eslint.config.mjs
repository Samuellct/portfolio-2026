import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    // Build output, generated types and local working folders kept out of git.
    ignores: [
      ".next/**",
      ".open-next/**",
      ".wrangler/**",
      "next-env.d.ts",
      "cloudflare-env.d.ts",
      ".claude/**",
      ".impeccable/**",
      "TODO_V6/**",
      "rapports markdown/**",
      "Redaction_projets/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

export default eslintConfig;
