---
title: サンプルドキュメント
date: 2026-03-10
---

# プロジェクト概要

これは**md2bl**のサンプルMarkdownファイルです。

## 機能一覧

- Markdown変換
  - 見出し
  - テキスト装飾
- CLI対応
- stdin/ファイル両対応

## 使い方

```bash
# ファイルから変換
md2bl input.md

# パイプで使用
cat input.md | md2bl
```

### コードサンプル

インラインコード: `const x = 1`

```typescript
function hello(name: string): string {
  return `Hello, ${name}!`;
}
```

## テキスト装飾

- **太字テキスト**
- *斜体テキスト*
- ~~取り消し線~~

## リンク

詳細は[Backlog公式サイト](https://backlog.com)を参照してください。

## テーブル

| 機能 | 対応状況 |
| --- | --- |
| 見出し | ✓ |
| リスト | ✓ |
| コード | ✓ |

---

> 注意: 画像はBacklog記法では直接サポートされません。

1. ステップ1
2. ステップ2
   1. サブステップ
3. ステップ3
