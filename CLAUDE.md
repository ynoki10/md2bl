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
- `src/converter.ts` — unified/remark でMarkdownをASTにパース。`remarkGfm`（GFM対応）と `remarkFrontmatter`（YAML対応）を使用。`compileNode()` で変換後、`/\n(\n+)/g` で連続改行を圧縮して返す。
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
| ` ```lang ` | `{code}...{/code}` (言語指定なし) |
| `[text](url)` (text≠url) | `[[text:url]]` |
| `[url](url)` / 裸の URL | url そのまま出力 |
| `---` | `----` |
| `- item` / `  - nested` | `- item` / `-- nested` |
| `1. item` / `   1. nested` | `+ item` / `++ nested` |
| テーブルヘッダー行 | 行末に `h` を付与 |
| 改行 (`<br>`) | `&br;` |
| ブロック間空行 | 原則除去（段落→段落 の間のみ維持） |

未対応要素（画像・HTMLタグ）はstderrに警告を出してスキップ。YAMLフロントマターはそのまま出力。

## 変換ルール変更時の注意

変換ルールを修正・追加した場合、以下すべてを更新すること:
- `src/compiler.ts` — 実装
- `tests/converter.test.ts` — テスト
- `CLAUDE.md` — 変換ルール早見表
- `README.md` — Conversion Rules 表 + 変換例
- `README.ja.md` — 変換ルール表 + 変換例

## ブランチ戦略・開発ワークフロー

新しい作業は必ず feature ブランチで行い、PR 経由で main にマージする。
（main への直 push はブランチ保護により禁止）

```
main          ← 常にリリース可能な状態
feat/xxx      ← 機能追加
fix/xxx       ← バグ修正
docs/xxx      ← ドキュメントのみの変更
chore/xxx     ← 設定変更・依存更新
```

### コミットメッセージ規約（Conventional Commits）

```
feat: 新機能
fix: バグ修正
docs: ドキュメントのみ
chore: ビルド・設定・依存関係の変更
test: テストのみ
refactor: リファクタリング
```

例: `feat: add support for definition lists`

### PR 作成・マージの流れ

```bash
git switch -c feat/xxx
# ... 変更・コミット ...
git push origin feat/xxx
gh pr create --title "feat: xxx" --body "..."
# CI（GitHub Actions）が通ったらマージ
gh pr merge --squash
```

## リリース手順

```bash
# 1. バージョン更新（package.json の version フィールドを手動編集）
# 2. ビルド
npm run build

# 3. 公開内容を dry-run で確認（dist/, README.md, LICENSE のみ含まれること）
npm publish --dry-run

# 4. 本公開
npm publish
```

## npm パッケージ情報

- パッケージ名: `md2bl`
- npm URL: https://www.npmjs.com/package/md2bl
- インストール: `npm install -g md2bl`
