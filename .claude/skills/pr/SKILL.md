---
name: pr
description: 作業ブランチの変更から、レビューしやすい PR を作る。テスト・型チェックを通し、Issue と docs リポジトリの文書を紐づける。「PRを作って」と言われたとき、または dev-task の最後に使う。
---

# pr：PR を作る

## 手順

### 1. 事前チェック
- 現在のブランチが `main` でないことを確認する
- コミットされていない変更がないか `git status` で確認する。あれば commit スキルでコミットする
- `TODO(you)` が残っていないか検索する。残っていれば私に伝えて止まる
- 次を実行し、すべて通ることを確認する。落ちたら直してから進む
  - 型チェック
  - lint
  - 単体テスト（`npx vitest run`）
  - E2E テスト（`npx playwright test`）
  - インフラの変更がある場合は `npx cdk synth`

### 2. 差分を把握する
- `git log main..HEAD --oneline` と `git diff main...HEAD --stat` で変更の全体を見る
- Issue 番号をブランチ名から取り、`gh issue view <番号>` で完了条件を確認する
- 完了条件をすべて満たしているか確認する。満たしていないものがあれば私に伝える

### 3. PR 本文を書く
- `.github/pull_request_template.md` の形式で書く
- `natural-japanese` スキルに従って書く
- 採用担当者が読むことも想定し、「何を作ったか」と「設計上どう考えたか」がわかるようにする
- docs リポジトリの plan.md・test-cases.md・learning.md へのリンクを入れる
  - リンクの形式：`https://github.com/<owner>/wedding-app-docs/blob/main/tasks/<番号>-<slug>/plan.md`
  - docs リポジトリが push されていなければ、先に push してよいか私に確認する

### 4. 私に確認してから作る
- タイトルと本文を私に見せ、OK をもらう
- push と PR 作成を行う

```bash
git push -u origin <ブランチ名>
gh pr create --title "<タイトル>" --body-file <一時ファイル> --base main
```

- タイトルは `<type>(#<番号>): <要約>` の形式（commit スキルと同じ）
- 本文に `Closes #<番号>` を入れ、マージ時に Issue が閉じるようにする

### 5. 作成後
- `gh pr checks` で CI の状態を確認し、結果を伝える
- PR の URL を伝える
