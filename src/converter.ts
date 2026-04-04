import type { Root } from "mdast";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { compileNode, makeContext, type QuoteStyle } from "./compiler.js";

export type { QuoteStyle };

export type ConvertOptions = {
  quoteStyle?: QuoteStyle;
};

const processor = unified().use(remarkParse).use(remarkGfm).use(remarkFrontmatter, ["yaml"]);

export function convert(markdown: string, options: ConvertOptions = {}): string {
  const tree = processor.parse(markdown) as Root;
  return compileNode(tree, makeContext(options.quoteStyle));
}
