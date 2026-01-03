export function getHtml(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />

  <style>
    :root {
      --bg: var(--vscode-sideBar-background);
      --fg: var(--vscode-sideBar-foreground);
      --border: var(--vscode-sideBar-border);
      --input-bg: var(--vscode-input-background);
      --input-fg: var(--vscode-input-foreground);
      --button-bg: var(--vscode-button-background);
      --button-fg: var(--vscode-button-foreground);
      --button-hover: var(--vscode-button-hoverBackground);
      --muted: var(--vscode-descriptionForeground);
    }

    body {
      background: var(--bg);
      color: var(--fg);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      padding: 14px;
    }

    .container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .subtitle {
      font-size: 12px;
      color: var(--muted);
    }

    .card {
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    label {
      font-size: 12px;
      font-weight: 600;
    }

    input,
    textarea {
      background: var(--input-bg);
      color: var(--input-fg);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 8px;
      font-size: 13px;
      width: 100%;
      box-sizing: border-box;
    }

    textarea {
      resize: vertical;
      min-height: 60px;
    }

    .radio-group {
      display: flex;
      gap: 16px;
      font-size: 13px;
    }

    .hint {
      font-size: 11px;
      color: var(--muted);
    }

    button {
      background: var(--button-bg);
      color: var(--button-fg);
      border: none;
      border-radius: 6px;
      padding: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    button:hover {
      background: var(--button-hover);
    }

    .service-row {
      display: flex;
      gap: 8px;
    }

    .service-row input {
      flex: 1;
    }

    .service-row button {
      padding: 6px 10px;
      font-size: 12px;
    }

    pre {
      background: var(--vscode-editor-background);
      border-radius: 6px;
      padding: 8px;
      font-size: 11px;
      max-height: 120px;
      overflow-y: auto;
      white-space: pre-wrap;
    }
  </style>
</head>

<body>
  <div class="container">
    <div>
      <h2>🔥 Boil It</h2>
      <div class="subtitle">
        Opinionated FastAPI microservice boilerplate generator
      </div>
    </div>

    <div class="card">
      <label>Architecture Type</label>
      <input value="Microservice" disabled />
      <div class="hint">More architectures coming soon</div>
    </div>

    <!-- ✅ MICROSERVICES -->
    <div class="card">
      <label>Microservices</label>

      <div id="services"></div>

      <button id="addServiceBtn" type="button">+ Add Service</button>
      <div class="hint">Use lowercase names (e.g. auth, billing)</div>
    </div>

    <div class="card">
      <label>Application Type</label>
      <div class="radio-group">
        <label>
          <input type="radio" name="appType" value="Traditional" checked />
          Traditional
        </label>
        <label>
          <input type="radio" name="appType" value="Gen AI" />
          Gen AI
        </label>
      </div>
    </div>

    <div class="card">
      <label>Groq API Key</label>
      <input type="password" id="apiKey" placeholder="gsk_..." />
      <div class="hint">Used only during generation</div>
    </div>

    <div class="card">
      <label>Description (optional)</label>
      <textarea id="description"></textarea>
    </div>

    <div class="card">
      <label>Logs</label>
      <pre id="logs">Ready.</pre>
    </div>

    <button id="createBtn">Create Project</button>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    const logs = document.getElementById("logs");
    const btn = document.getElementById("createBtn");
    const servicesEl = document.getElementById("services");
    const addBtn = document.getElementById("addServiceBtn");

    function log(msg) {
      const t = new Date().toLocaleTimeString();
      logs.textContent += "\\n[" + t + "] " + msg;
      logs.scrollTop = logs.scrollHeight;
    }

    function addService(name = "") {
      const row = document.createElement("div");
      row.className = "service-row";

      row.innerHTML = \`
        <input type="text" placeholder="service-name" value="\${name}" />
        <button type="button">✕</button>
      \`;

      row.querySelector("button").onclick = () => row.remove();
      servicesEl.appendChild(row);
    }

    // defaults
    addService("auth");
    addService("billing");
    addService("gateway");

    addBtn.onclick = () => addService();

    btn.addEventListener("click", () => {
      logs.textContent = "Starting...";
      btn.disabled = true;

      const appType =
        document.querySelector('input[name="appType"]:checked').value;

      const services = [...servicesEl.querySelectorAll("input")]
        .map(i => i.value.trim())
        .filter(Boolean)
        .map(name => ({ name }));

      if (!services.length) {
        log("ERROR: Add at least one service");
        btn.disabled = false;
        return;
      }

      vscode.postMessage({
        architecture: "Microservice",
        backend: "FastAPI",
        services,
        appType,
        apiKey: document.getElementById("apiKey").value,
        description: document.getElementById("description").value
      });
    });

    window.addEventListener("message", (event) => {
      const msg = event.data;

      if (msg.type === "log") log(msg.text);
      if (msg.type === "error") {
        log("ERROR: " + msg.text);
        btn.disabled = false;
      }
      if (msg.type === "done") {
        log("Done.");
        btn.disabled = false;
      }
    });
  </script>
</body>
</html>
`;
}
