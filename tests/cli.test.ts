import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
import { beforeAll, describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const CLI = "dist/index.js";

beforeAll(async () => {
  await execFileAsync("pnpm", ["run", "build"]);
}, 30_000);

describe("CLI", () => {
  it("ファイル引数で変換結果をstdoutに出力", async () => {
    const { stdout } = await execFileAsync("node", [CLI, "tests/test-all-features.md"]);
    expect(stdout).toContain("* ");
    expect(stdout.length).toBeGreaterThan(0);
  });

  it("stdin パイプで変換結果をstdoutに出力", async () => {
    const result = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
      const child = spawn("node", [CLI], {
        stdio: ["pipe", "pipe", "pipe"],
      });
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (chunk: Buffer) => (stdout += chunk));
      child.stderr.on("data", (chunk: Buffer) => (stderr += chunk));
      child.on("close", () => resolve({ stdout, stderr }));
      child.on("error", reject);
      child.stdin.write("# Hello\n");
      child.stdin.end();
    });
    expect(result.stdout).toBe("* Hello\n");
  });

  it("--help でヘルプを表示し exit 0", async () => {
    const { stdout } = await execFileAsync("node", [CLI, "--help"], {
      env: { ...process.env, NO_COLOR: "1" },
    });
    expect(stdout).toContain("md2bl");
    expect(stdout).toContain("USAGE");
  });

  it("--version でバージョンを表示し exit 0", async () => {
    const { stdout } = await execFileAsync("node", [CLI, "--version"]);
    expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("-V でバージョンを表示し exit 0", async () => {
    const { stdout } = await execFileAsync("node", [CLI, "-V"]);
    expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("引数なし + TTY で usage を表示し exit 1", async () => {
    try {
      await execFileAsync(
        "node",
        [
          "--input-type=module",
          "-e",
          `Object.defineProperty(process.stdin,"isTTY",{value:true});await import("./dist/index.js")`,
        ],
        {
          env: { ...process.env, NO_COLOR: "1" },
        },
      );
      expect.fail("should have exited with code 1");
    } catch (err: unknown) {
      const e = err as { code: number; stdout: string; stderr: string };
      expect(e.code).toBe(1);
      expect(e.stdout).toContain("USAGE");
    }
  });

  it("--quote-style line で引用を > 記法で出力", async () => {
    const { stdout } = await execFileAsync("node", [
      CLI,
      "--quote-style",
      "line",
      "tests/test-all-features.md",
    ]);
    expect(stdout).toContain("> ");
  });

  it("-q block で引用を {quote} 記法で出力", async () => {
    const { stdout } = await execFileAsync("node", [
      CLI,
      "-q",
      "block",
      "tests/test-all-features.md",
    ]);
    expect(stdout).toContain("{quote}");
  });

  it("存在しないファイルで error を stderr に出力し exit 1", async () => {
    try {
      await execFileAsync("node", [CLI, "nonexistent-file.md"]);
      expect.fail("should have exited with code 1");
    } catch (err: unknown) {
      const e = err as { code: number; stderr: string };
      expect(e.code).toBe(1);
      expect(e.stderr).toContain('Cannot read file "nonexistent-file.md"');
    }
  });
});
