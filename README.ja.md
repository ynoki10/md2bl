[English](./README.md) | 日本語

# md2bl

[![npm version](https://badge.fury.io/js/md2bl.svg)](https://www.npmjs.com/package/md2bl)

Markdown を [Backlog 記法](https://support-ja.backlog.com/hc/ja/articles/360035641594-%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88%E6%95%B4%E5%BD%A2%E3%81%AE%E3%83%AB%E3%83%BC%E3%83%AB-Backlog%E8%A8%98%E6%B3%95) に変換する CLI ツール & ライブラリ。

Markdown を Backlog記法を利用しているBacklogプロジェクト の課題・Wiki・PR にそのまま貼れる形式へ変換します。stdin/stdout のパイプに対応しているため、Shell スクリプトや各種ツールに組み込みやすいのが特徴です。Node.js/TypeScript プロジェクトからライブラリとしても利用できます。

## インストール

Node.js 20 以上が必要です。

```sh
npm install -g md2bl
# or
pnpm add -g md2bl
```

## 使い方

### CLI オプション

| オプション | 説明 |
|-----------|------|
| `<files...>` | 変換する Markdown ファイル（複数指定で連結出力） |
| `-c, --clipboard` | 変換結果をクリップボードにコピー（stdout 出力も維持） |
| `-q, --quote-style <style>` | 引用スタイル: `auto`（デフォルト）, `line`, `block` |
| `-h, --help` | ヘルプを表示 |
| `-V, --version` | バージョンを表示 |

### ファイルを変換する

```sh
md2bl input.md
```

### stdin から受け取る（パイプ）

```sh
cat input.md | md2bl
echo "# Hello" | md2bl
```

### 複数ファイルを変換する

```sh
md2bl file1.md file2.md
md2bl docs/*.md
```

### クリップボードにコピーする

```sh
md2bl input.md -c
md2bl input.md -c > output.txt  # ファイル + クリップボード
```

### 引用スタイル

```sh
md2bl input.md --quote-style line   # 常に > 記法を使用
md2bl input.md -q block             # 常に {quote} 記法を使用
```

### ファイルに書き出す

```sh
md2bl input.md > output.txt
```

### ライブラリとして使う

Node.js/TypeScript プロジェクトからプログラムで利用できます:

```sh
npm install md2bl
# or
pnpm add md2bl
```

```ts
import { convert, type ConvertOptions } from 'md2bl';

const backlog = convert('# Hello **world**');
// => * Hello ''world''

// With options
const result = convert('> line1\n> line2', { quoteStyle: 'block' });
// => {quote}\nline1\nline2\n{/quote}
```

## 変換例

**入力（Markdown）:**

````md
[toc]

# 見出し1

最初の段落。**太字**と*斜体*も使えます。

2つ目の段落（空行が維持されます）。

- リスト1
  - ネスト
- リスト2

1. 番号付き1
2. 番号付き2

- 最初の段落

  2つ目の段落（ルーズリスト）

- コードを含む項目:

  ```java
  System.out.println("hello");
  ```

[リンク](https://example.com)

| 列A | 列B |
|-----|-----|
| 値1 | 値2 |
````

**出力（Backlog 記法）:**

```
#contents
* 見出し1
最初の段落。''太字''と'''斜体'''も使えます。

2つ目の段落（空行が維持されます）。
- リスト1
-- ネスト
- リスト2

+ 番号付き1
+ 番号付き2
- 最初の段落&br;2つ目の段落（ルーズリスト）
- コードを含む項目:
{code:java}
System.out.println("hello");
{/code}
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
| ` ```lang` ... ` ``` ` | `{code}` ... `{/code}` (`java`/`cs` → `{code:lang}`) |
| `[テキスト](URL)` (テキスト≠URL) | `[[テキスト:URL]]` |
| `[URL](URL)` / 裸の URL | URL をそのまま出力 |
| `> 引用`（1行） | `> 引用` |
| `> 引用`（複数行、デフォルト `auto`） | `{quote}...{/quote}` |
| `---` | `----` |
| `- 箇条書き` | `- 箇条書き` |
| `- ネスト` (2階層) | `-- ネスト` |
| `1. 番号付き` | `+ 番号付き` |
| `1. ネスト` (2階層) | `++ ネスト` |
| `- [ ] テキスト` / `- [x] テキスト` | `- [ ] テキスト` / `- [x] テキスト` |
| `1. [ ] テキスト` / `1. [x] テキスト` | `+ [ ] テキスト` / `+ [x] テキスト` |
| ルーズリスト（複数段落） | `&br;` で結合 |
| リスト項目内のコードブロック（1行） | `{code}...{/code}` でインライン化し `&br;` で結合 |
| リスト項目内のコードブロック（複数行） | バレットなしで `{code}` ブロック出力 |
| リスト項目内の引用・水平線・テーブル | バレットなしで出力 |
| `![alt](url)` | `#image(url)` |
| `[toc]` | `#contents` |
| テーブル | ヘッダー行末に `h` を付与 |
| YAML フロントマター | そのまま出力 |

> **注:** ブロック間の空行は原則除去されます。ただし **段落→段落** および **リスト→リスト** の間の空行は維持されます。

> **注:** Backlog記法でシンタックスハイライトに対応している言語は `java` と `cs`（C#）のみです。それ以外の言語はハイライトなしの `{code}` にフォールバックします。

### 未対応要素

以下の要素は変換をスキップし、`stderr` に警告を出力します。

- 生 HTML
- 脚注

## 開発

```sh
pnpm run dev         # tsx で直接実行（ビルド不要）
pnpm test            # vitest でテスト実行
pnpm run build       # TypeScript をビルド
pnpm run lint        # Biome で lint チェック
pnpm run lint:fix    # Biome で lint 自動修正
pnpm run format      # Biome でフォーマット
pnpm run format:check  # フォーマットチェック
pnpm run typecheck   # tsc --noEmit で型チェック
pnpm run check       # lint + format + typecheck 一括実行
```

## 技術スタック

- TypeScript / Node.js (ESM)
- [unified](https://unifiedjs.com/) / [remark-parse](https://github.com/remarkjs/remark-parse) — Markdown の AST パース
- [remark-gfm](https://github.com/remarkjs/remark-gfm) — GitHub Flavored Markdown 対応
- [remark-frontmatter](https://github.com/remarkjs/remark-frontmatter) — YAML フロントマター対応
- [vitest](https://vitest.dev/) — テスト
- [citty](https://github.com/unjs/citty) — CLI 引数パース
- [Biome](https://biomejs.dev/) — Lint & フォーマット

## ライセンス

MIT
