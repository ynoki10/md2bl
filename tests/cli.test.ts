import { describe, it, expect, beforeAll } from "vitest";
import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const CLI = "dist/index.js";

beforeAll(async () => {
  await execFileAsync("npm", ["run", "build"]);
}, 30_000);

describe("CLI", () => {
  it("ファイル引数で変換結果をstdoutに出力", async () => {
    const { stdout } = await execFileAsync("node", [
      CLI,
      "tests/test-all-features.md",
    ]);
    expect(stdout).toContain("* ");
    expect(stdout.length).toBeGreaterThan(0);
  });

  it("stdin パイプで変換結果をstdoutに出力", async () => {
    const result = await new Promise<{ stdout: string; stderr: string }>(
      (resolve, reject) => {
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
      }
    );
    expect(result.stdout).toBe("* Hello\n");
  });

  it("引数なし + TTY で usage を stderr に出力し exit 1", async () => {
    try {
      await execFileAsync("node", [
        "--input-type=module",
        "-e",
        `Object.defineProperty(process.stdin,"isTTY",{value:true});await import("./dist/index.js")`,
      ]);
      expect.fail("should have exited with code 1");
    } catch (err: unknown) {
      const e = err as { code: number; stderr: string };
      expect(e.code).toBe(1);
      expect(e.stderr).toContain("Usage:");
    }
  });

  it("存在しないファイルで error を stderr に出力し exit 1", async () => {
    try {
      await execFileAsync("node", [CLI, "nonexistent-file.md"]);
      expect.fail("should have exited with code 1");
    } catch (err: unknown) {
      const e = err as { code: number; stderr: string };
      expect(e.code).toBe(1);
      expect(e.stderr).toContain("[md2bl] ERROR: cannot read file");
    }
  });

  it.todo("main() の予期しない例外で catch ハンドラが動作");
});
