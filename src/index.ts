#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { defineCommand, runMain, showUsage } from "citty";
import { copyToClipboard } from "./clipboard.js";
import { convert, type QuoteStyle } from "./converter.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

/** rawArgs からオプション引数を除外し、positional 引数（ファイルパス）を抽出する */
function extractFiles(rawArgs: string[]): string[] {
  const files: string[] = [];
  const optionsWithValue = new Set(["-q", "--quote-style"]);
  let skipNext = false;
  for (const arg of rawArgs) {
    if (skipNext) {
      skipNext = false;
      continue;
    }
    if (optionsWithValue.has(arg)) {
      skipNext = true;
      continue;
    }
    if (arg.startsWith("-")) {
      continue;
    }
    files.push(arg);
  }
  return files;
}

const main = defineCommand({
  meta: {
    name: "md2bl",
    version,
    description: "Convert Markdown to Backlog notation",
  },
  args: {
    file: {
      type: "positional",
      description: "Markdown file(s) to convert",
      required: false,
    },
    clipboard: {
      type: "boolean",
      alias: "c",
      description: "Copy output to clipboard",
      default: false,
    },
    "quote-style": {
      type: "string",
      alias: "q",
      description: 'Quote style: "auto", "line", or "block" (default: "auto")',
      default: "auto",
    },
  },
  async run({ args, rawArgs }) {
    const quoteStyle = args["quote-style"] as QuoteStyle;
    const options = { quoteStyle };
    const files = extractFiles(rawArgs ?? []);

    let result: string;

    if (files.length > 0) {
      const outputs: string[] = [];
      for (const file of files) {
        try {
          const content = readFileSync(file, "utf8");
          outputs.push(convert(content, options));
        } catch {
          process.stderr.write(`Error: Cannot read file "${file}"\n`);
          process.exit(1);
        }
      }
      result = outputs.join("\n\n");
    } else if (!process.stdin.isTTY) {
      const input = await readStdin();
      result = convert(input, options);
    } else {
      await showUsage(main);
      process.exit(1);
    }

    const output = `${result}\n`;

    if (args.clipboard) {
      try {
        copyToClipboard(output);
      } catch (err) {
        process.stderr.write(`Error: ${(err as Error).message}\n`);
        process.exit(1);
      }
    }

    process.stdout.write(output);
  },
});

const rawArgs = process.argv.slice(2).map((arg) => (arg === "-V" ? "--version" : arg));
runMain(main, { rawArgs });
