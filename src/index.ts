#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { defineCommand, runMain, showUsage } from "citty";
import { convert } from "./converter.js";

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

const main = defineCommand({
  meta: {
    name: "md2bl",
    version,
    description: "Convert Markdown to Backlog notation",
  },
  args: {
    file: {
      type: "positional",
      description: "Markdown file to convert",
      required: false,
    },
  },
  async run({ args }) {
    let input: string;

    if (args.file) {
      try {
        input = readFileSync(args.file, "utf8");
      } catch {
        process.stderr.write(`Error: Cannot read file "${args.file}"\n`);
        process.exit(1);
      }
    } else if (!process.stdin.isTTY) {
      input = await readStdin();
    } else {
      await showUsage(main);
      process.exit(1);
    }

    process.stdout.write(`${convert(input)}\n`);
  },
});

const rawArgs = process.argv.slice(2).map((arg) => (arg === "-V" ? "--version" : arg));
runMain(main, { rawArgs });
