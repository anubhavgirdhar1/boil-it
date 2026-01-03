import * as vscode from "vscode";
import { getHtml } from "./template";
import { runGenerator } from "../backend/runner";

export class BoilItViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "boilItView";

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true
    };

    webviewView.webview.html = getHtml();

    const disposable = webviewView.webview.onDidReceiveMessage((payload) => {
      if (!payload || !Array.isArray(payload.services)) {
        webviewView.webview.postMessage({
          type: "error",
          text: "Invalid request payload"
        });
        return;
      }

      runGenerator(this.context, webviewView.webview, payload);
    });

    this.context.subscriptions.push(disposable);
  }
}
