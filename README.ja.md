[English](./README.md) | 日本語

# md2bl

[![npm version](https://badge.fury.io/js/md2bl.svg)](https://www.npmjs.com/package/md2bl)

Markdown を [Backlog 記法](https://support-ja.backlog.com/hc/ja/articles/360035641594-%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88%E6%95%B4%E5%BD%A2%E3%81%AE%E3%83%AB%E3%83%BC%E3%83%AB-Backlog%E8%A8%98%E6%B3%95) に変換する CLI ツール。

Markdown を Backlog の課題・Wiki・PR にそのまま貼れる形式へ変換します。stdin/stdout のパイプに対応しているため、Shell スクリプトや各種ツールに組み込みやすいのが特徴です。

## インストール

Node.js 18 以上が必要です。

```sh
npm install -g md2bl
```

## 使い方

### ファイルを変換する

```sh
md2bl input.md
```

### stdin から受け取る（パイプ）

```sh
cat input.md | md2bl
echo "# Hello" | md2bl
```

### ファイルに書き出す

```sh
md2bl input.md > output.txt
```

## 変換例

**入力（Markdown）:**

````md
# 見出し1

最初の段落。**太字**と*斜体*も使えます。

2つ目の段落（空行が維持されます）。

- リスト1
  - ネスト
- リスト2

1. 番号付き1
2. 番号付き2

[リンク](https://example.com)

| 列A | 列B |
|-----|-----|
| 値1 | 値2 |
````

**出力（Backlog 記法）:**

```
* 見出し1
最初の段落。''太字''と'''斜体'''も使えます。

2つ目の段落（空行が維持されます）。
- リスト1
-- ネスト
- リスト2

+ 番号付き1
+ 番号付き2
[[リンク:https://example.com]]
| 列A | 列B |h
| 値1 | 値2 |
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
| テーブル | ヘッダー行末に `h` を付与 |
| YAML フロントマター | そのまま出力 |

> **注:** ブロック間の空行は原則除去されます。ただし **段落→段落** および **リスト→リスト** の間の空行は維持されます。

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
