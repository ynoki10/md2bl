---
description: ブランチ戦略と Conventional Commits 規約
---

## ブランチ戦略

新しい作業は必ず feature ブランチで行い、PR 経由で main にマージする。
（main への直 push はブランチ保護により禁止）

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
