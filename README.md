# wedding-app

2027年4月の結婚式で使う、Web 招待状と写真共有のアプリです。

## できること

- 招待状
  - ローディングのあと、トップからスクロールして式の情報を読み、参加表明フォームを送れる
  - 参加を表明したゲストに、会費の事前決済（Stripe）のリンクをメールで送る
  - 管理画面：新郎新婦と式場スタッフがログインし、参加表明と支払い状況を確認できる
- 写真共有（予定）：式の当日に撮った写真をゲストと共有する

招待状は2027年1月に公開します。運用費は月1万円以内を目標にしています。

## 技術スタック

| 分類 | 使うもの |
|---|---|
| アプリ | Next.js（TypeScript）、Tailwind CSS、Motion |
| インフラ | AWS（CloudFront、Lambda、S3、DynamoDB、SES、Cognito、Route 53）、IaC は AWS CDK（TypeScript） |
| 決済 | Stripe |
| テスト | 単体は Vitest、E2E は Playwright |
| CI/CD | GitHub Actions |
| タスク管理 | GitHub Projects（1タスク＝1 Issue＝1 PR） |

## アーキテクチャ

オニオンアーキテクチャで実装します。

- 層は domain → application → infrastructure / presentation の順に外側へ広がる
- 依存の向きは常に内側（domain）へ向ける。domain は、ほかの層・フレームワーク・AWS SDK を import しない
- 外部サービス（DB、Stripe、SES など）は、application 層にインターフェースを置き、infrastructure 層で実装する

```
wedding-app/
├── web/                      Next.js アプリ
│   └── src/
│       ├── domain/           エンティティ・値オブジェクト・ドメインのルール
│       ├── application/      ユースケースと、外部サービスのインターフェース
│       ├── infrastructure/   DynamoDB・SES・Stripe・Cognito の実装
│       ├── presentation/     画面のコンポーネント、Server Actions、Route Handlers
│       └── app/              Next.js の App Router（ルーティングだけを置く）
└── infra/                    AWS CDK
```

ディレクトリは、実装を進めながら順に作っていきます。

## 開発の始め方

Node.js 24 と corepack を使います。pnpm のバージョンは、ルートの `package.json` で固定しています。

```bash
corepack enable pnpm
pnpm install
pnpm --filter web exec playwright install chromium   # E2E テスト用のブラウザ
```

## コマンド

どのコマンドも、リポジトリのルートで実行します。ルートのコマンドは、同じ名前のコマンドを持つすべてのパッケージで実行されます。

| コマンド | やること |
|---|---|
| `pnpm dev` | 開発用のサーバーを起動する（http://localhost:3000） |
| `pnpm build` | 本番用にビルドする |
| `pnpm test` | 単体テスト（Vitest）を実行する |
| `pnpm test:e2e` | E2E テスト（Playwright）を実行する。テストの前に、アプリをビルドして起動する |
| `pnpm lint` | ESLint で検査する。層をまたぐ import の向きの誤りも、ここでエラーになる |
| `pnpm typecheck` | TypeScript の型を検査する |
