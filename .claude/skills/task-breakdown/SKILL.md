---
name: task-breakdown
description: 決まった設計をもとに、1タスク＝1 Issue＝1 PR の粒度に分割し、GitHub Issue と GitHub Projects に登録する。「タスクに分けて」「Issueを作って」「プロジェクトに登録して」と言われたときに使う。
---

# task-breakdown：設計をタスクに分割して登録する

## 前提

- 全体設計は grill-me で決まっていて、決定事項が `../wedding-app-docs/decisions/` にあること
- まだ決まっていなければ、先に grill-me を使うよう私に提案して止まる

## 手順

### 1. 入力を読む
- `../wedding-app-docs/decisions/` の決定事項と CLAUDE.md を読む
- 既存の Issue を `gh issue list --state all --limit 200` で確認し、重複を避ける

### 2. タスクに分割する
粒度の基準：
- 1つの PR でレビューできる大きさ（目安として、差分が数百行以内）
- 完了したかどうかを、テストか画面で確かめられる
- 1つのタスクの中で、新しく学ぶ大きな概念は1〜2個まで
- 「インフラ」「バックエンド」のような層単位ではなく、なるべく縦に切る（例：「参加表明を保存できる」）
  - ただし、最初の土台づくり（プロジェクト作成、CDK の初期化、CI）は例外として先に置いてよい

各タスクに次を決める：
- タイトル（「〜できる」「〜を用意する」の形）
- 目的（なぜ必要か）
- 完了条件（チェックリスト）
- 学ぶ概念（例：リポジトリパターン、依存性逆転、VPC 設計）
- 依存するタスク
- マイルストーン：`招待状MVP（1月中旬）` または `写真共有（4月）`
- ラベル：`infra` / `domain` / `frontend` / `test` / `docs` など

### 3. 私に確認する
- 分割案を表で見せる（列：No、タイトル、マイルストーン、依存、学ぶ概念）
- 招待状の送付（2027年1月下旬）から逆算して、招待状MVPのタスクが1月中旬までに終わる見込みかを一言添える
- 私の承認を得るまで、Issue は作らない

### 4. 登録する
承認後に実行する。

```bash
# マイルストーン・ラベルがなければ作る
gh api repos/{owner}/{repo}/milestones -f title="招待状MVP" -f due_on="2027-01-15T00:00:00Z"
gh label create infra --color 0E8A16

# Issue を作る（本文は下のテンプレート）
gh issue create --title "<タイトル>" --body-file <一時ファイル> --label <ラベル> --milestone "<マイルストーン>"

# Project に追加する
gh project item-add <プロジェクト番号> --owner <owner> --url <Issue URL>
```

- Project 番号がわからないときは `gh project list --owner <owner>` で確認する
- 依存関係は、Issue 本文の「依存」に `#番号` で書く

### Issue 本文テンプレート

```markdown
## 目的
<なぜこのタスクが必要か>

## 完了条件
- [ ] <確かめられる条件>

## 学ぶ概念
- <概念>

## 依存
- #<番号>

## メモ
<設計の決定事項へのリンクなど>
```

Issue の文章は `natural-japanese` スキルに従って書く。
