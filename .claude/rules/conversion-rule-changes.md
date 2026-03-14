---
description: 変換ルールを修正・追加した場合に更新すべきファイル一覧
globs:
  - "src/compiler.ts"
  - "tests/**"
---

変換ルールを修正・追加した場合、以下すべてを更新すること:

- `src/compiler.ts` — 実装
- `tests/converter.test.ts` — テスト
- `docs/conversion-rules.md` — 変換ルール早見表
- `README.md` — Conversion Rules 表 + 変換例
- `README.ja.md` — 変換ルール表 + 変換例
