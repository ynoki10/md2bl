# Alternative Tools

md2bl 以外にも Markdown → Backlog記法の変換ツールが存在する。

| ツール | 言語/形態 | 特徴 | 備考 |
|--------|-----------|------|------|
| [md2bg](https://github.com/37108/md2bg) | Node.js | AST変換 | 対応nodeが限定的 |
| [md2backlog](https://github.com/yandod/md2backlog) | Ruby | kramdown利用 | 未対応書式多い |
| [md2bl (Perl)](https://github.com/newnakashima/md2bl) | Perl | 正規表現ベース | 名前が衝突（別プロジェクト） |
| [obsidian-backlog-converter](https://github.com/junpei-takagi/obsidian-backlog-converter) | Obsidian plugin | 双方向変換 | 2025年8月公開、機能充実 |

md2bl（本プロジェクト）の差別化: CLI + ライブラリ両対応、GFM 完全サポート、活発なメンテナンス。
