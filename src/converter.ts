import type { Root } from "mdast";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { compileNode } from "./compiler.js";

const processor = unified().use(remarkParse).use(remarkGfm).use(remarkFrontmatter, ["yaml"]);

export function convert(markdown: string): string {
  const tree = processor.parse(markdown) as Root;
  return compileNode(tree);
}
