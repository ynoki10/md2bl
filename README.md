English | [日本語](./README.ja.md)

# md2bl

[![npm version](https://badge.fury.io/js/md2bl.svg)](https://www.npmjs.com/package/md2bl)

A CLI tool to convert Markdown to [Backlog notation](https://support.nulab.com/hc/en-us/articles/8775439725721-Backlog-text-formatting-rules).

Converts Markdown into a format that can be pasted directly into Backlog issues, Wikis, and PRs. Supports stdin/stdout piping, making it easy to integrate into shell scripts and other tools.

## Installation

Requires Node.js 18 or later.

```sh
npm install -g md2bl
```

## Usage

### Convert a file

```sh
md2bl input.md
```

### Read from stdin (pipe)

```sh
cat input.md | md2bl
echo "# Hello" | md2bl
```

### Write to a file

```sh
md2bl input.md > output.txt
```

## Conversion Example

**Input (Markdown):**

````md
# Heading 1

First paragraph. You can use **bold** and *italic* text.

Second paragraph (blank lines between paragraphs are preserved).

- List item 1
  - Nested item
- List item 2

1. Ordered item 1
2. Ordered item 2

[Link](https://example.com)

| Col A | Col B |
|-------|-------|
| Val 1 | Val 2 |
````

**Output (Backlog notation):**

```
* Heading 1
First paragraph. You can use ''bold'' and '''italic''' text.

Second paragraph (blank lines between paragraphs are preserved).
- List item 1
-- Nested item
- List item 2
+ Ordered item 1
+ Ordered item 2
[[Link:https://example.com]]
| Col A | Col B |h
| Val 1 | Val 2 |
```

## Conversion Rules

| Markdown | Backlog Notation |
|----------|-----------------|
| `# Heading 1` | `* Heading 1` |
| `## Heading 2` | `** Heading 2` |
| `### Heading 3` | `*** Heading 3` |
| `**bold**` | `''bold''` |
| `*italic*` | `'''italic'''` |
| `~~strikethrough~~` | `%%strikethrough%%` |
| `` `inline code` `` | `{code}inline code{/code}` |
| ` ```lang` ... ` ``` ` | `{code}` ... `{/code}` |
| `[text](URL)` (text≠URL) | `[[text:URL]]` |
| `[URL](URL)` / bare URL | URL output as-is |
| `> blockquote` | `> blockquote` |
| `---` | `----` |
| `- item` | `- item` |
| `- nested` (2 levels) | `-- nested` |
| `1. item` | `+ item` |
| `1. nested` (2 levels) | `++ nested` |
| Table | Header row ends with `h` suffix |
| YAML front matter | Output as-is |

> **Note:** Blank lines between blocks are removed by default. Only blank lines between **paragraph → paragraph** are preserved.

### Unsupported Elements

The following elements are skipped with a warning output to `stderr`.

- Images (`![alt](url)`)
- Raw HTML
- Footnotes

## Development

```sh
npm run dev          # Run directly with tsx (no build required)
npm test             # Run tests with vitest
npm run build        # Build TypeScript
```

## Tech Stack

- TypeScript / Node.js (ESM)
- [unified](https://unifiedjs.com/) / [remark](https://github.com/remarkjs/remark) — Markdown AST parsing
- [remark-gfm](https://github.com/remarkjs/remark-gfm) — GitHub Flavored Markdown support
- [remark-frontmatter](https://github.com/remarkjs/remark-frontmatter) — YAML front matter support
- [vitest](https://vitest.dev/) — Testing

## License

MIT
