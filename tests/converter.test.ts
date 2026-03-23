import { describe, it, expect, vi } from "vitest";
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
  it("コードブロック（java）", () =>
    expect(convert("```java\npublic class Main {}\n```")).toBe(
      "{code:java}\npublic class Main {}\n{/code}"
    ));
  it("コードブロック（cs）", () =>
    expect(convert("```cs\nvar x = 1;\n```")).toBe(
      "{code:cs}\nvar x = 1;\n{/code}"
    ));
  it("コードブロック（サポート外言語）", () =>
    expect(convert("```typescript\nconst x = 1;\n```")).toBe(
      "{code}\nconst x = 1;\n{/code}"
    ));
  it("コードブロック（大文字言語名も正規化）", () =>
    expect(convert("```Java\ncode\n```")).toBe(
      "{code:java}\ncode\n{/code}"
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

describe("チェックリスト", () => {
  it("未チェック", () =>
    expect(convert("- [ ] todo")).toBe("- [ ] todo"));
  it("チェック済み", () =>
    expect(convert("- [x] done")).toBe("- [x] done"));
  it("チェックリストと通常リストの混在", () =>
    expect(convert("- [ ] todo\n- normal")).toBe("- [ ] todo\n- normal"));
  it("ネストしたチェックリスト", () =>
    expect(convert("- [ ] parent\n  - [x] child")).toBe("- [ ] parent\n-- [x] child"));
  it("番号付きチェックリスト", () =>
    expect(convert("1. [ ] ordered task")).toBe("+ [ ] ordered task"));
  it("loose list item では段落を &br; で結合", () =>
    expect(convert("- [ ] item1\n\n  continued")).toBe(
      "- [ ] item1&br;continued"));
});

describe("ルーズリスト（複数段落）", () => {
  it("箇条書きの複数段落を &br; で結合", () =>
    expect(convert("- item1\n\n  continued")).toBe("- item1&br;continued"));
  it("番号付きリストの複数段落を &br; で結合", () =>
    expect(convert("1. item1\n\n   continued")).toBe("+ item1&br;continued"));
  it("チェックリストの複数段落を &br; で結合", () =>
    expect(convert("- [x] item1\n\n  continued")).toBe(
      "- [x] item1&br;continued"));
  it("3段落以上も &br; で結合", () =>
    expect(convert("- para1\n\n  para2\n\n  para3")).toBe(
      "- para1&br;para2&br;para3"));
  it("ルーズ項目と通常項目の混在", () =>
    expect(convert("- item1\n\n  continued\n\n- item2")).toBe(
      "- item1&br;continued\n- item2"));
});

describe("リスト項目内のブロック要素", () => {
  it("複数行コードブロックはバレットなしで出力", () =>
    expect(
      convert("- item\n\n  ```java\n  line1\n  line2\n  ```")
    ).toBe("- item\n{code:java}\nline1\nline2\n{/code}"));
  it("1行コードブロックは {code} でインライン化", () =>
    expect(
      convert("- item\n\n  ```java\n  one-liner\n  ```")
    ).toBe("- item&br;{code}one-liner{/code}"));
  it("引用はバレットなしで出力", () =>
    expect(convert("- item\n\n  > quote text")).toBe(
      "- item\n> quote text"));
  it("水平線はバレットなしで出力", () =>
    expect(convert("- item\n\n  ---")).toBe("- item\n----"));
  it("テーブルはバレットなしで出力", () =>
    expect(
      convert("- item\n\n  | A | B |\n  | - | - |\n  | 1 | 2 |")
    ).toBe("- item\n| A | B |h\n| 1 | 2 |"));
  it("段落 + コードブロック + 段落（後続段落はバレットなし）", () =>
    expect(
      convert("- text\n\n  ```\n  line1\n  line2\n  ```\n\n  after")
    ).toBe("- text\n{code}\nline1\nline2\n{/code}\nafter"));
  it("チェックリスト + コードブロック", () =>
    expect(
      convert("- [ ] item\n\n  ```\n  code\n  code\n  ```")
    ).toBe("- [ ] item\n{code}\ncode\ncode\n{/code}"));
  it("番号付きリスト + 引用", () =>
    expect(convert("1. item\n\n   > quote")).toBe("+ item\n> quote"));
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
  it("リスト→リスト: 空行維持", () =>
    expect(convert("- item1\n\n1. item2")).toBe("- item1\n\n+ item2"));
});

describe("画像", () => {
  it("画像をBacklog記法に変換", () =>
    expect(convert("![alt text](https://example.com/image.png)")).toBe(
      "#image(https://example.com/image.png)"
    ));
  it("altなし画像", () =>
    expect(convert("![](https://example.com/image.png)")).toBe(
      "#image(https://example.com/image.png)"
    ));
  it("インライン画像", () =>
    expect(convert("text ![img](https://example.com/a.png) more")).toBe(
      "text #image(https://example.com/a.png) more"
    ));
});

describe("目次 [toc]", () => {
  it("[toc] を #contents に変換", () =>
    expect(convert("[toc]")).toBe("#contents"));
  it("[toc] と見出しの組み合わせ", () =>
    expect(convert("[toc]\n\n# Heading 1\n## Heading 1-1")).toBe(
      "#contents\n* Heading 1\n** Heading 1-1"
    ));
  it("段落中の [toc] は変換しない", () =>
    expect(convert("See [toc] for details")).toBe("See [toc] for details"));
  it("[TOC] は変換しない（小文字のみ対象）", () =>
    expect(convert("[TOC]")).toBe("[TOC]"));
  it("[Toc] は変換しない（小文字のみ対象）", () =>
    expect(convert("[Toc]")).toBe("[Toc]"));
});

describe("未対応要素の警告", () => {
  it("画像変換時にwarningを出力しない", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    convert("![alt](https://example.com/img.png)");
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
  it("HTML変換時にwarningを出力する", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    convert("<div>html</div>");
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
