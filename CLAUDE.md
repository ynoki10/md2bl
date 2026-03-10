# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build        # TypeScript コンパイル (src/ → dist/)
npm test             # vitest でテスト一括実行
npm run test:watch   # ウォッチモードでテスト実行
npm run dev          # tsx でビルドなし実行 (開発用)

# 単一テストの実行例
npx vitest run tests/converter.test.ts
```

ビルド後のバイナリ実行:
```bash
node dist/index.js input.md
cat input.md | node dist/index.js
```

## アーキテクチャ

変換パイプライン: **stdin/ファイル → `convert()` → AST → `compileNode()` → Backlog記法文字列 → stdout**

- `src/index.ts` — CLIエントリーポイント。ファイル引数またはstdinを読み込み、`convert()` を呼んで結果を stdout に出力。エラーは stderr。
- `src/converter.ts` — unified/remark でMarkdownをASTにパース。`remarkGfm`（GFM対応）と `remarkFrontmatter`（YAML対応）を使用。`compileNode()` に渡すだけ。
- `src/compiler.ts` — ASTノードをBacklog記法文字列に変換するコアロジック。`CompileContext`（リストのネスト深度・順序付きフラグ）をスタックとして渡しながら再帰処理。

ESMプロジェクト (`"type": "module"`) のため、import時は `.js` 拡張子が必要（TypeScriptソースでも同様）。

## 変換ルール早見表

| Markdown | Backlog |
|---|---|
| `# H1` / `## H2` | `* H1` / `** H2` |
| `**bold**` | `''bold''` |
| `*italic*` | `'''italic'''` |
| `~~text~~` | `%%text%%` |
| `` `code` `` | `{code}code{/code}` |
| ` ```lang ` | `{code:lang}...{/code}` |
| `[text](url)` | `[[text:url]]` |
| `---` | `----` |
| `- item` / `  - nested` | `- item` / `-- nested` |
| `1. item` / `   1. nested` | `+ item` / `++ nested` |
| テーブルヘッダー行 | セルに `h ` プレフィックス |
| 改行 (`<br>`) | `&br;` |

未対応要素（画像・HTMLタグ）はstderrに警告を出してスキップ。YAMLフロントマターはそのまま出力。
