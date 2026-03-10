#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { convert } from "./converter.js";

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  let input: string;

  if (args.length > 0 && !args[0].startsWith("-")) {
    // ファイルパスが渡された場合
    const filePath = args[0];
    try {
      input = readFileSync(filePath, "utf8");
    } catch (err) {
      process.stderr.write(`[md2bl] ERROR: cannot read file "${filePath}"\n`);
      process.exit(1);
    }
  } else if (!process.stdin.isTTY) {
    // stdin からパイプされた場合
    input = await readStdin();
  } else {
    process.stderr.write(
      "Usage: md2bl <file.md>\n       cat file.md | md2bl\n"
    );
    process.exit(1);
  }

  const result = convert(input);
  process.stdout.write(result + "\n");
}

main().catch((err) => {
  process.stderr.write(`[md2bl] ERROR: ${err.message}\n`);
  process.exit(1);
});
