## Worktree のライフサイクル

- worktree は `.worktrees/` に作成する
- PR がマージされるまで worktree は残しておく（レビュー修正に備える）
- PR マージ後に削除する:
  ```bash
  git worktree remove .worktrees/<name>
  git branch -d <branch-name>
  ```
