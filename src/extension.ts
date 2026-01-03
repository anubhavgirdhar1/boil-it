import * as vscode from "vscode";
import { BoilItViewProvider } from "./view/boilItView";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      BoilItViewProvider.viewType,
      new BoilItViewProvider(context)
    )
  );
}

export function deactivate() {}