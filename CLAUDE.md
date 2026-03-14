# CLAUDE.md

Markdown → Backlog記法 変換CLIツール (`md2bl`)

## Commands

```bash
npm run build        # TypeScript コンパイル (src/ → dist/)
npm test             # vitest でテスト一括実行
npm run test:watch   # ウォッチモードでテスト実行
npm run dev          # tsx でビルドなし実行 (開発用)
npx vitest run tests/converter.test.ts  # 単一テスト実行例
```

## アーキテクチャ

変換パイプライン: **stdin/ファイル → `convert()` → AST → `compileNode()` → Backlog記法文字列 → stdout**

- `src/index.ts` — CLIエントリーポイント。ファイル引数またはstdinを読み込み、`convert()` を呼んで結果を stdout に出力。
- `src/converter.ts` — unified/remark でMarkdownをASTにパース。`remarkGfm`・`remarkFrontmatter` を使用。
- `src/compiler.ts` — ASTノードをBacklog記法文字列に変換するコアロジック。`CompileContext` で再帰処理。

## npm パッケージ

- パッケージ名: `md2bl` / npm: https://www.npmjs.com/package/md2bl
- インストール: `npm install -g md2bl`

## 関連ドキュメントの所在

- コーディングルール → `.claude/rules/`
- PR 作成手順 → `.claude/skills/pr-workflow.md`
- 変換ルール早見表 → `docs/conversion-rules.md`
- リリース手順 → `docs/release-process.md`
