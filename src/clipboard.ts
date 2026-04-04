import { execFileSync, execSync } from "node:child_process";

function detectClipboardCommand(): string[] | null {
  if (process.platform === "darwin") {
    return ["pbcopy"];
  }
  if (process.platform === "win32") {
    return ["clip.exe"];
  }
  // Linux: Wayland → X11 の順で検出
  try {
    execSync("which wl-copy", { stdio: "ignore" });
    return ["wl-copy"];
  } catch {
    // wl-copy not found
  }
  try {
    execSync("which xclip", { stdio: "ignore" });
    return ["xclip", "-selection", "clipboard"];
  } catch {
    // xclip not found
  }
  return null;
}

export function copyToClipboard(text: string): void {
  const cmd = detectClipboardCommand();
  if (!cmd) {
    throw new Error(
      "No clipboard command found. Install xclip (X11) or wl-copy (Wayland) on Linux.",
    );
  }
  const [command, ...cmdArgs] = cmd;
  execFileSync(command, cmdArgs, { input: text, stdio: ["pipe", "ignore", "ignore"] });
}
