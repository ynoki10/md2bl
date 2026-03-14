# 変換ルール早見表

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
