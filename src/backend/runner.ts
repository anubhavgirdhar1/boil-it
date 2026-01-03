import * as vscode from "vscode";
import { spawn } from "child_process";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";

export function runGenerator(
  context: vscode.ExtensionContext,
  webview: vscode.Webview,
  payload: any
) {
  const workspace = vscode.workspace.workspaceFolders?.[0];
  if (!workspace) {
    webview.postMessage({
      type: "error",
      text: "No workspace folder open."
    });
    return;
  }

  // Attach workspace root
  payload.rootPath = workspace.uri.fsPath;

  // 🔐 Write payload to temp file
  const tmpFile = path.join(
    os.tmpdir(),
    `boil-it-${Date.now()}.json`
  );

  fs.writeFileSync(tmpFile, JSON.stringify(payload, null, 2));

  const scriptPath = path.join(
    context.extensionPath,
    "python",
    "generate.py"
  );

  webview.postMessage({
    type: "log",
    text: "Starting project generation..."
  });

  // ✅ Use spawn (stream-safe)
  const child = spawn("python", [scriptPath, tmpFile], {
    cwd: workspace.uri.fsPath
  });

  child.stdout.on("data", (data) => {
    webview.postMessage({
      type: "log",
      text: data.toString().trim()
    });
  });

  child.stderr.on("data", (data) => {
    webview.postMessage({
      type: "error",
      text: data.toString().trim()
    });
  });

  child.on("close", (code) => {
    fs.unlink(tmpFile, () => {}); // cleanup

    if (code === 0) {
      webview.postMessage({ type: "done" });
    } else {
      webview.postMessage({
        type: "error",
        text: "Generation failed"
      });
    }
  });
}
