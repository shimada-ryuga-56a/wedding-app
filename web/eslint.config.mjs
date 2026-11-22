import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // オニオンアーキテクチャの層の境界
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      // どのフォルダが、どの層か
      "boundaries/elements": [
        { type: "domain", pattern: "src/domain" },
        { type: "application", pattern: "src/application" },
        { type: "infrastructure", pattern: "src/infrastructure" },
        { type: "presentation", pattern: "src/presentation" },
        { type: "app", pattern: "src/app" },
      ],
      // コンポジションルートはフォルダではなくファイル1つなので、ファイルとして登録する
      "boundaries/files": [
        { pattern: "src/composition-root.ts", category: "composition-root" },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
