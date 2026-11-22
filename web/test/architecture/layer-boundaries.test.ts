// 層の境界のルール（eslint.config.mjs の許可リスト）が効いているかを確かめるテスト。
import { createRequire } from "node:module";
import path from "node:path";
import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

const webRoot = path.resolve(__dirname, "../..");
const fixturesRoot = path.join(__dirname, "fixtures");

// @/ の行き先をサンプルのフォルダで探すように、TypeScript 用の解決の設定を差し替える
const require = createRequire(path.join(webRoot, "package.json"));
const tsResolver = createRequire(require.resolve("eslint-config-next")).resolve(
  "eslint-import-resolver-typescript",
);

const eslint = new ESLint({
  cwd: fixturesRoot,
  overrideConfigFile: path.join(webRoot, "eslint.config.mjs"),
  overrideConfig: {
    settings: {
      // パスを数え始める場所。ここを基準に "src/composition-root.ts" などを判定する
      "boundaries/root-path": fixturesRoot,
      "import/resolver": {
        [tsResolver]: { project: path.join(fixturesRoot, "tsconfig.json") },
      },
    },
  },
});

/** from のファイルに `import ... from importPath` を書いたとき、境界のルールに違反するか */
async function violatesBoundary(from: string, importPath: string) {
  const code = `import * as dependency from "${importPath}";\nexport const used = dependency;\n`;
  const [result] = await eslint.lintText(code, {
    filePath: path.join(fixturesRoot, from),
  });
  return result.messages.some((m) => m.ruleId === "boundaries/dependencies");
}

// "ok"：エラーにならない / "error"：エラーになる
type Expected = "ok" | "error";

const cases: {
  id: string;
  from: string;
  importPath: string;
  expected: Expected;
}[] = [
  // U-04 は U-03 と同じ組み合わせを、@/ ではなく相対パスで書いたもの
  { id: "U-01", from: "src/domain/new.ts", importPath: "@/domain/entity", expected: "ok" },
  { id: "U-02", from: "src/domain/new.ts", importPath: "@/application/use-case", expected: "error" },
  { id: "U-03", from: "src/domain/new.ts", importPath: "@/infrastructure/repository", expected: "error" },
  { id: "U-04", from: "src/domain/new.ts", importPath: "../infrastructure/repository", expected: "error" },
  { id: "U-05", from: "src/application/new.ts", importPath: "@/domain/entity", expected: "ok" },
  { id: "U-06", from: "src/application/new.ts", importPath: "@/infrastructure/repository", expected: "error" },
  { id: "U-07", from: "src/infrastructure/new.ts", importPath: "@/application/use-case", expected: "ok" },
  { id: "U-08", from: "src/presentation/new.ts", importPath: "@/application/use-case", expected: "ok" },
  { id: "U-09", from: "src/presentation/new.ts", importPath: "@/infrastructure/repository", expected: "error" },
  { id: "U-10", from: "src/app/new.ts", importPath: "@/presentation/component", expected: "ok" },
  { id: "U-11", from: "src/app/new.ts", importPath: "@/infrastructure/repository", expected: "error" },
  { id: "U-12", from: "src/composition-root.ts", importPath: "@/infrastructure/repository", expected: "ok" },
  { id: "U-13", from: "src/application/new.ts", importPath: "@/composition-root", expected: "error" },
  { id: "U-14", from: "src/presentation/new.ts", importPath: "@/composition-root", expected: "ok" },
  { id: "U-15", from: "src/app/new.ts", importPath: "@/composition-root", expected: "error" },
  { id: "U-16", from: "src/composition-root.ts", importPath: "@/presentation/component", expected: "error" },
];

describe("層の境界のルール", () => {
  it.each(cases)(
    "$id $from から $importPath を import すると $expected",
    async ({ from, importPath, expected }) => {
      const violated = await violatesBoundary(from, importPath);
      expect(violated ? "error" : "ok").toBe(expected);
    },
  );
});
