import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

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
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      // React Compiler rules arrived with Next 16 (react-hooks 7): the 8 existing
      // cases (About ratchet, effects that sync state) are reworked in V7.
      "react-hooks/immutability": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default eslintConfig;
