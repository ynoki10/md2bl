import type {
  Root,
  Heading,
  Paragraph,
  Text,
  Strong,
  Emphasis,
  Delete,
  InlineCode,
  Code,
  Link,
  Blockquote,
  ThematicBreak,
  Table,
  TableRow,
  TableCell,
  List,
  ListItem,
  Break,
  Image,
  Html,
  Node,
} from "mdast";

type CompileContext = {
  listDepth: number;
  listOrdered: boolean[];
};

function makeContext(): CompileContext {
  return { listDepth: 0, listOrdered: [] };
}

function compileChildren(
  nodes: Node[],
  ctx: CompileContext
): string {
  return nodes.map((n) => compileNode(n, ctx)).join("");
}

export function compileNode(node: Node, ctx: CompileContext = makeContext()): string {
  switch (node.type) {
    case "root":
      return compileRoot(node as Root, ctx);
    case "heading":
      return compileHeading(node as Heading, ctx);
    case "paragraph":
      return compileParagraph(node as Paragraph, ctx);
    case "text":
      return (node as Text).value;
    case "strong":
      return compileStrong(node as Strong, ctx);
    case "emphasis":
      return compileEmphasis(node as Emphasis, ctx);
    case "delete":
      return compileDelete(node as Delete, ctx);
    case "inlineCode":
      return `{code}${(node as InlineCode).value}{/code}`;
    case "code":
      return compileCode(node as Code);
    case "link":
      return compileLink(node as Link, ctx);
    case "blockquote":
      return compileBlockquote(node as Blockquote, ctx);
    case "thematicBreak":
      return compileThematicBreak(node as ThematicBreak);
    case "table":
      return compileTable(node as Table, ctx);
    case "list":
      return compileList(node as List, ctx);
    case "listItem":
      return compileListItem(node as ListItem, ctx);
    case "break":
      return "&br;";
    case "image":
      return compileImage(node as Image);
    case "html":
      return compileHtml(node as Html);
    case "yaml":
      // フロントマターはそのまま出力
      return `---\n${(node as unknown as { value: string }).value}\n---`;
    default:
      process.stderr.write(
        `[md2bl] WARNING: unsupported node type "${node.type}" — skipped\n`
      );
      return "";
  }
}

function compileRoot(node: Root, ctx: CompileContext): string {
  const parts: string[] = [];
  const types: string[] = [];

  for (const child of node.children) {
    const compiled = compileNode(child, ctx);
    if (compiled !== "") {
      parts.push(compiled);
      types.push(child.type);
    }
  }

  return parts.reduce((acc, part, i) => {
    if (i === 0) return part;
    const prevType = types[i - 1];
    const currType = types[i];
    const separator = prevType === "paragraph" && currType === "paragraph" ? "\n\n" : "\n";
    return acc + separator + part;
  }, "");
}

function compileHeading(node: Heading, ctx: CompileContext): string {
  const stars = "*".repeat(node.depth);
  const content = compileChildren(node.children, ctx);
  return `${stars} ${content}`;
}

function compileParagraph(node: Paragraph, ctx: CompileContext): string {
  return compileChildren(node.children, ctx);
}

function compileStrong(node: Strong, ctx: CompileContext): string {
  return `''${compileChildren(node.children, ctx)}''`;
}

function compileEmphasis(node: Emphasis, ctx: CompileContext): string {
  return `'''${compileChildren(node.children, ctx)}'''`;
}

function compileDelete(node: Delete, ctx: CompileContext): string {
  return `%%${compileChildren(node.children, ctx)}%%`;
}

function compileCode(node: Code): string {
  return `{code}\n${node.value}\n{/code}`;
}

function compileLink(node: Link, ctx: CompileContext): string {
  const text = compileChildren(node.children, ctx);
  if (text && text !== node.url) {
    return `[[${text}:${node.url}]]`;
  }
  return node.url;
}

function compileBlockquote(node: Blockquote, ctx: CompileContext): string {
  const inner = node.children
    .map((child) => compileNode(child, ctx))
    .join("\n");
  return inner
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
}

function compileThematicBreak(_node: ThematicBreak): string {
  return "----";
}

function compileTable(node: Table, ctx: CompileContext): string {
  const rows = node.children as TableRow[];
  return rows
    .map((row, rowIndex) => compileTableRow(row, rowIndex === 0, ctx))
    .join("\n");
}

function compileTableRow(
  node: TableRow,
  isHeader: boolean,
  ctx: CompileContext
): string {
  const cells = node.children as TableCell[];
  const compiled = cells.map((cell) => compileChildren(cell.children, ctx));
  return `| ${compiled.join(" | ")} |${isHeader ? "h" : ""}`;
}

function compileList(node: List, ctx: CompileContext): string {
  const newCtx: CompileContext = {
    listDepth: ctx.listDepth + 1,
    listOrdered: [...ctx.listOrdered, node.ordered ?? false],
  };
  return node.children
    .map((item) => compileNode(item, newCtx))
    .join("\n");
}

function compileListItem(node: ListItem, ctx: CompileContext): string {
  const depth = ctx.listDepth;
  const ordered = ctx.listOrdered[ctx.listOrdered.length - 1] ?? false;
  const bullet = ordered ? "+".repeat(depth) : "-".repeat(depth);

  const lines: string[] = [];
  for (const child of node.children) {
    if (child.type === "paragraph") {
      lines.push(`${bullet} ${compileChildren((child as Paragraph).children, ctx)}`);
    } else if (child.type === "list") {
      lines.push(compileList(child as List, ctx));
    } else {
      lines.push(`${bullet} ${compileNode(child, ctx)}`);
    }
  }
  return lines.join("\n");
}

function compileImage(node: Image): string {
  process.stderr.write(
    `[md2bl] WARNING: image "${node.url}" is not supported in Backlog notation — skipped\n`
  );
  return "";
}

function compileHtml(node: Html): string {
  process.stderr.write(
    `[md2bl] WARNING: raw HTML is not supported in Backlog notation — skipped\n`
  );
  return "";
}
