# Backlog UI 目視テストガイド

`tests/test-all-features.md` を使って、Backlog UI 上での表示を手動確認する手順。

## 手順

1. 変換を実行する

   ```bash
   npm run build && node dist/index.js tests/test-all-features.md | pbcopy
   ```

2. Backlog記法を利用しているプロジェクトの課題画面を開く

3. クリップボードの内容を貼り付けて、プレビューまたは保存で表示を確認する
