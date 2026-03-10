# md2bklog

Markdown を [Backlog 記法](https://backlog.com/ja/help/usersguide/project-wiki/userguide2376/) に変換する CLI ツール。

Claude Code などの AI エージェントが出力した Markdown を、Backlog の課題・Wiki・PR にそのまま貼れる形式へ変換するユースケースを想定して設計されています。stdin/stdout のパイプに対応しているため、AI エージェントのツール呼び出しや Shell スクリプトに組み込みやすいのが特徴です。

## インストール

Node.js 18 以上が必要です。

```sh
git clone <this-repo>
cd md2bklog
npm install
npm run build
npm link        # md2bklog コマンドをグローバル登録
```

## 使い方

### ファイルを変換する

```sh
md2bklog input.md
```

### stdin から受け取る（パイプ）

```sh
cat input.md | md2bklog
echo "# Hello" | md2bklog
```

### ファイルに書き出す

```sh
md2bklog input.md > output.txt
```

### AI エージェントとの連携例

Claude Code などが出力した Markdown をそのまま Backlog MCP サーバー経由で投稿するワークフロー:

```sh
# Markdown を変換して Backlog 課題のコメントに貼る
md2bklog draft.md
# → stdout に Backlog 記法が出力されるので、MCP ツール等に渡す
```

## 変換ルール

| Markdown | Backlog 記法 |
|----------|-------------|
| `# 見出し1` | `* 見出し1` |
| `## 見出し2` | `** 見出し2` |
| `### 見出し3` | `*** 見出し3` |
| `**太字**` | `''太字''` |
| `*斜体*` | `'''斜体'''` |
| `~~取り消し~~` | `%%取り消し%%` |
| `` `インラインコード` `` | `{code}インラインコード{/code}` |
| ` ```lang` ... ` ``` ` | `{code}` ... `{/code}` |
| `[テキスト](URL)` (テキスト≠URL) | `[[テキスト:URL]]` |
| `[URL](URL)` / 裸の URL | URL をそのまま出力 |
| `> 引用` | `> 引用` |
| `---` | `----` |
| `- 箇条書き` | `- 箇条書き` |
| `- ネスト` (2階層) | `-- ネスト` |
| `1. 番号付き` | `+ 番号付き` |
| `1. ネスト` (2階層) | `++ ネスト` |
| テーブル | ヘッダー行のセルに `h ` プレフィックス |
| YAML フロントマター | そのまま出力 |

> **注:** ブロック間の空行は原則除去されます。ただし **段落→段落** の間の空行のみ維持されます。

### 未対応要素

以下の要素は変換をスキップし、`stderr` に警告を出力します。

- 画像 (`![alt](url)`)
- 生 HTML
- 脚注

## 開発

```sh
npm run dev          # tsx で直接実行（ビルド不要）
npm test             # vitest でテスト実行
npm run build        # TypeScript をビルド
```

## 技術スタック

- TypeScript / Node.js (ESM)
- [unified](https://unifiedjs.com/) / [remark](https://github.com/remarkjs/remark) — Markdown の AST パース
- [remark-gfm](https://github.com/remarkjs/remark-gfm) — GitHub Flavored Markdown 対応
- [remark-frontmatter](https://github.com/remarkjs/remark-frontmatter) — YAML フロントマター対応
- [vitest](https://vitest.dev/) — テスト

## ライセンス

MIT
