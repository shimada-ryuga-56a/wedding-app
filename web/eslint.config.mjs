import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

// 許可の書き方を短くするための部品
// 「これらの層（フォルダ）を import してよい」
const toLayers = (types) => ({ to: { element: { types } } });
// 「コンポジションルートを import してよい」
const toCompositionRoot = { to: { file: { categories: "composition-root" } } };

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
    rules: {
      // どの層が、どの層を import してよいか（許可リスト）
      // default: "disallow" なので、ここに書いていない組み合わせはすべてエラーになる
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          policies: [
            // 依存してよいのは、自分より内側の層と、自分と同じ層だけ。
            // 実装の組み立てはコンポジションルートだけが行い、presentation はそこから受け取る
            {
              from: { element: { type: "domain" } },
              allow: [toLayers(["domain"])],
            },
            {
              from: { element: { type: "application" } },
              allow: [toLayers(["domain", "application"])],
            },
            {
              from: { element: { type: "infrastructure" } },
              allow: [toLayers(["domain", "application", "infrastructure"])],
            },
            {
              from: { element: { type: "presentation" } },
              allow: [
                toLayers(["domain", "application", "presentation"]),
                toCompositionRoot,
              ],
            },
            {
              from: { element: { type: "app" } },
              allow: [toLayers(["presentation", "app"])],
            },
            {
              from: { file: { categories: "composition-root" } },
              allow: [toLayers(["infrastructure", "application", "domain"])],
            },
          ],
        },
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
