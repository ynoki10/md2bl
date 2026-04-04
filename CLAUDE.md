# CLAUDE.md

Markdown → Backlog記法 変換CLIツール (`md2bl`)

## Commands

```bash
pnpm run build       # TypeScript コンパイル (src/ → dist/)
pnpm test            # vitest でテスト一括実行
pnpm run test:watch  # ウォッチモードでテスト実行
pnpm run dev         # tsx でビルドなし実行 (開発用)
pnpm vitest run tests/converter.test.ts  # 単一テスト実行例
pnpm run lint        # Biome lint チェック
pnpm run lint:fix    # Biome lint 自動修正
pnpm run format      # Biome 自動フォーマット
pnpm run format:check  # フォーマットチェック
pnpm run typecheck   # TypeScript 型チェック (tsc --noEmit)
pnpm run check       # lint + format + typecheck 一括
```

ビルド後のバイナリ実行:
```bash
node dist/index.js input.md
node dist/index.js file1.md file2.md
cat input.md | node dist/index.js
node dist/index.js input.md > output.txt
node dist/index.js input.md -c
node dist/index.js input.md --quote-style block
node dist/index.js --help
node dist/index.js --version
```

## アーキテクチャ

変換パイプライン: **stdin/ファイル → `convert(input, options?)` → AST → `compileNode()` → Backlog記法文字列 → stdout（+ clipboard）**

- `src/index.ts` — CLIエントリーポイント。citty (`defineCommand`/`runMain`) で引数パース。ファイル引数（複数可）またはstdinを読み込み、`convert()` を呼んで結果を出力。`--clipboard`, `--quote-style` オプション対応。
- `src/converter.ts` — unified/remark-parse でMarkdownをASTにパース。`ConvertOptions` で変換オプション（`quoteStyle` 等）を受け取る。`remarkGfm`・`remarkFrontmatter` を使用。
- `src/compiler.ts` — ASTノードをBacklog記法文字列に変換するコアロジック。`CompileContext` で再帰処理。`QuoteStyle` で引用出力を制御。
- `src/clipboard.ts` — プラットフォーム検出によるクリップボードコピー機能（macOS/Windows/Linux対応）。
- `src/lib.ts` — ライブラリ公開 API。`convert()`, `ConvertOptions`, `QuoteStyle` を export。

## npm パッケージ

- パッケージ名: `md2bl` / npm: https://www.npmjs.com/package/md2bl
- インストール: `npm install -g md2bl` / `pnpm add -g md2bl`

## 関連ドキュメントの所在

- コーディングルール → `.claude/rules/`
- PR 作成手順 → `.claude/skills/pr-workflow.md`
- 変換ルール → `README.md` / `README.ja.md` の Conversion Rules セクション
- リリース手順 → `docs/release-process.md`
- Backlog記法との差分・対象外項目 → `docs/backlog-notation-gaps.md`
- 類似ツール比較 → `docs/alternatives.md`
