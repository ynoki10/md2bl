English | [日本語](./README.ja.md)

# md2bl

[![npm version](https://badge.fury.io/js/md2bl.svg)](https://www.npmjs.com/package/md2bl)

A CLI tool and library to convert Markdown to [Backlog notation](https://support.nulab.com/hc/en-us/articles/8775439725721-Backlog-text-formatting-rules).

Converts Markdown into a format that can be pasted directly into issues, Wikis, and PRs in Backlog projects that use Backlog notation. Supports stdin/stdout piping, making it easy to integrate into shell scripts and other tools. Also usable as a library in Node.js/TypeScript projects.

## Installation

Requires Node.js 20 or later.

```sh
npm install -g md2bl
# or
pnpm add -g md2bl
```

## Usage

### CLI Options

| Option | Description |
|--------|-------------|
| `<files...>` | Markdown file(s) to convert (multiple files are concatenated) |
| `-c, --clipboard` | Copy output to clipboard (in addition to stdout) |
| `-q, --quote-style <style>` | Quote style: `auto` (default), `line`, or `block` |
| `-h, --help` | Show help |
| `-V, --version` | Show version |

### Convert a file

```sh
md2bl input.md
```

### Read from stdin (pipe)

```sh
cat input.md | md2bl
echo "# Hello" | md2bl
```

### Convert multiple files

```sh
md2bl file1.md file2.md
md2bl docs/*.md
```

### Copy to clipboard

```sh
md2bl input.md -c
md2bl input.md -c > output.txt  # file + clipboard
```

### Quote style

```sh
md2bl input.md --quote-style line   # always use > notation
md2bl input.md -q block             # always use {quote} notation
```

### Write to a file

```sh
md2bl input.md > output.txt
```

### Programmatic Usage

You can also use md2bl as a library in your Node.js/TypeScript project:

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

## Conversion Example

**Input (Markdown):**

````md
[toc]

# Heading 1

First paragraph. You can use **bold** and *italic* text.

Second paragraph (blank lines between paragraphs are preserved).

- List item 1
  - Nested item
- List item 2

1. Ordered item 1
2. Ordered item 2

- First paragraph

  Second paragraph (loose list item)

- Item with code:

  ```java
  System.out.println("hello");
  ```

[Link](https://example.com)

| Col A | Col B |
|-------|-------|
| Val 1 | Val 2 |
````

**Output (Backlog notation):**

```
#contents
* Heading 1
First paragraph. You can use ''bold'' and '''italic''' text.

Second paragraph (blank lines between paragraphs are preserved).
- List item 1
-- Nested item
- List item 2

+ Ordered item 1
+ Ordered item 2
- First paragraph&br;Second paragraph (loose list item)
- Item with code:
{code:java}
System.out.println("hello");
{/code}
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
| ` ```lang` ... ` ``` ` | `{code}` ... `{/code}` (`java`/`cs` → `{code:lang}`) |
| `[text](URL)` (text≠URL) | `[[text:URL]]` |
| `[URL](URL)` / bare URL | URL output as-is |
| `> blockquote` (single line) | `> blockquote` |
| `> blockquote` (multi-line, default `auto`) | `{quote}...{/quote}` |
| `---` | `----` |
| `- item` | `- item` |
| `- nested` (2 levels) | `-- nested` |
| `1. item` | `+ item` |
| `1. nested` (2 levels) | `++ nested` |
| `- [ ] text` / `- [x] text` | `- [ ] text` / `- [x] text` |
| `1. [ ] text` / `1. [x] text` | `+ [ ] text` / `+ [x] text` |
| Loose list item (multiple paragraphs) | Joined with `&br;` |
| Code block in list item (single line) | `{code}...{/code}` inline with `&br;` |
| Code block in list item (multi-line) | `{code}` block without bullet |
| Blockquote / HR / table in list item | Output without bullet |
| `![alt](url)` | `#image(url)` |
| `[toc]` | `#contents` |
| Table | Header row ends with `h` suffix |
| YAML front matter | Output as-is |

> **Note:** Blank lines between blocks are removed by default. Only blank lines between **paragraph → paragraph** and **list → list** are preserved.

> **Note:** Backlog notation only supports syntax highlighting for `java` and `cs` (C#). Other languages fall back to `{code}` without highlighting.

### Unsupported Elements

The following elements are skipped with a warning output to `stderr`.

- Raw HTML
- Footnotes

## Development

```sh
pnpm run dev         # Run directly with tsx (no build required)
pnpm test            # Run tests with vitest
pnpm run build       # Build TypeScript
pnpm run lint        # Lint with Biome
pnpm run lint:fix    # Lint and auto-fix with Biome
pnpm run format      # Format with Biome
pnpm run format:check  # Check formatting
pnpm run typecheck   # Type check with tsc --noEmit
pnpm run check       # Run lint + format + typecheck
```

## Tech Stack

- TypeScript / Node.js (ESM)
- [unified](https://unifiedjs.com/) / [remark-parse](https://github.com/remarkjs/remark-parse) — Markdown AST parsing
- [remark-gfm](https://github.com/remarkjs/remark-gfm) — GitHub Flavored Markdown support
- [remark-frontmatter](https://github.com/remarkjs/remark-frontmatter) — YAML front matter support
- [vitest](https://vitest.dev/) — Testing
- [citty](https://github.com/unjs/citty) — CLI argument parsing
- [Biome](https://biomejs.dev/) — Linting & Formatting

## License

MIT
