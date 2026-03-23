## difit レビューのタイミング

### subagent-driven-development (SDD) ワークフロー

- implementer サブエージェントの worktree 内コミットでは difit **不要**（worktree は main から隔離されており安全）
- 全タスク完了後、`finishing-a-development-branch` を実行する**前に** difit でブランチ全体をレビューする
  ```bash
  difit @ main    # feature branch 全体の差分をレビュー
  ```
- ユーザーのレビューコメントがあれば修正してからブランチ統合に進む
- コメントなし（サーバーを閉じただけ）の場合は承認とみなし、そのまま進む

### 通常作業（SDD 以外）

- コミット前に `difit .` で未コミット変更をレビューする（従来通り）
- レビュー承認後にコミットする
