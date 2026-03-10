import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import { compileNode } from "./compiler.js";
import type { Root } from "mdast";

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkFrontmatter, ["yaml"]);

export function convert(markdown: string): string {
  const tree = processor.parse(markdown) as Root;
  const output = compileNode(tree);
  return output.replace(/\n(\n+)/g, "$1");
}
