---
name: pr-workflow
description: PR 作成・マージの流れ
user_invocable: true
---

## PR 作成・マージの流れ

```bash
git switch -c feat/xxx
# ... 変更・コミット ...
git push origin feat/xxx
gh pr create --title "feat: xxx" --body "..."
# CI（GitHub Actions）が通ったらマージ
gh pr merge --squash
```
