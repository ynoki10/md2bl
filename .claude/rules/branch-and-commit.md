---
description: ブランチ戦略と Conventional Commits 規約
---

## ブランチ戦略

新しい作業は必ず feature ブランチで行い、PR 経由で main にマージする。
（main への直 push はブランチ保護により禁止）

Claude が新しい作業を始める場合は worktree を使用すること（詳細は `worktree-lifecycle.md` 参照）。

```
main          ← 常にリリース可能な状態
feat/xxx      ← 機能追加
fix/xxx       ← バグ修正
docs/xxx      ← ドキュメントのみの変更
chore/xxx     ← 設定変更・依存更新
```

## コミットメッセージ規約（Conventional Commits）

```
feat: 新機能
fix: バグ修正
docs: ドキュメントのみ
chore: ビルド・設定・依存関係の変更
test: テストのみ
refactor: リファクタリング
```

例: `feat: add support for definition lists`

## ブランチの削除

- GitHub の「Automatically delete head branches」が有効化済み。PR マージ時にリモートブランチは自動削除される
- PR マージ後、ローカルブランチも削除する:
  ```
  git branch -d <branch-name>
  ```
- worktree 内で作業していた場合は worktree も先に削除する（`worktree-lifecycle.md` 参照）
