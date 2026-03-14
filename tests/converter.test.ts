import { describe, it, expect } from "vitest";
import { convert } from "../src/converter.js";

describe("見出し", () => {
  it("h1", () => expect(convert("# Hello")).toBe("* Hello"));
  it("h2", () => expect(convert("## Hello")).toBe("** Hello"));
  it("h3", () => expect(convert("### Hello")).toBe("*** Hello"));
  it("h4", () => expect(convert("#### Hello")).toBe("**** Hello"));
});

describe("テキスト装飾", () => {
  it("太字", () => expect(convert("**bold**")).toBe("''bold''"));
  it("斜体", () => expect(convert("*italic*")).toBe("'''italic'''"));
  it("取り消し線", () => expect(convert("~~strike~~")).toBe("%%strike%%"));
  it("太字と斜体の組み合わせ", () =>
    expect(convert("**bold** and *italic*")).toBe("''bold'' and '''italic'''"));
});

describe("コードブロック", () => {
  it("インラインコード", () =>
    expect(convert("`code`")).toBe("{code}code{/code}"));
  it("コードブロック（言語なし）", () =>
    expect(convert("```\ncode here\n```")).toBe("{code}\ncode here\n{/code}"));
  it("コードブロック（言語あり）", () =>
    expect(convert("```typescript\nconst x = 1;\n```")).toBe(
      "{code}\nconst x = 1;\n{/code}"
    ));
});

describe("リンク", () => {
  it("テキスト付きリンク", () =>
    expect(convert("[Backlog](https://backlog.com)")).toBe(
      "[[Backlog:https://backlog.com]]"
    ));
  it("テキストがURLと同じ場合はURLのみ", () =>
    expect(convert("[https://backlog.com](https://backlog.com)")).toBe(
      "https://backlog.com"
    ));
  it("裸のURL文字列はリンク化しない", () =>
    expect(convert("Visit https://example.com for details")).toBe(
      "Visit https://example.com for details"
    ));
});

describe("引用", () => {
  it("単一行引用", () =>
    expect(convert("> quote text")).toBe("> quote text"));
  it("複数行引用", () =>
    expect(convert("> line1\n> line2")).toBe("> line1\n> line2"));
});

describe("水平線", () => {
  it("---", () => expect(convert("---")).toBe("----"));
  it("***", () => expect(convert("***")).toBe("----"));
});

describe("リスト", () => {
  it("箇条書きリスト", () =>
    expect(convert("- item1\n- item2")).toBe("- item1\n- item2"));
  it("番号付きリスト", () =>
    expect(convert("1. item1\n2. item2")).toBe("+ item1\n+ item2"));
  it("ネストした箇条書き", () =>
    expect(convert("- item1\n  - nested")).toBe("- item1\n-- nested"));
  it("ネストした番号付きリスト", () =>
    expect(convert("1. item1\n   1. nested")).toBe("+ item1\n++ nested"));
});

describe("テーブル", () => {
  it("シンプルなテーブル", () => {
    const md = `| Name | Age |\n| --- | --- |\n| Alice | 30 |`;
    const expected = `| Name | Age |h\n| Alice | 30 |`;
    expect(convert(md)).toBe(expected);
  });
});

describe("フロントマター", () => {
  it("YAMLフロントマターをそのまま出力", () => {
    const md = `---\ntitle: Test\n---\n\n# Hello`;
    const result = convert(md);
    expect(result).toContain("---");
    expect(result).toContain("title: Test");
    expect(result).toContain("* Hello");
  });
});

describe("段落", () => {
  it("通常テキスト", () =>
    expect(convert("Hello, world!")).toBe("Hello, world!"));
  it("複数段落", () =>
    expect(convert("para1\n\npara2")).toBe("para1\n\npara2"));
});

describe("空行ルール", () => {
  it("段落→段落: 空行維持", () =>
    expect(convert("para1\n\npara2")).toBe("para1\n\npara2"));
  it("見出し→段落: 空行削除", () =>
    expect(convert("# H\n\npara")).toBe("* H\npara"));
  it("段落→見出し: 空行削除", () =>
    expect(convert("para\n\n# H")).toBe("para\n* H"));
  it("リスト→段落: 空行削除", () =>
    expect(convert("- item\n\npara")).toBe("- item\npara"));
  it("コードブロック→段落: 空行削除", () =>
    expect(convert("```\ncode\n```\n\npara")).toBe("{code}\ncode\n{/code}\npara"));
});
