from pathlib import Path

def materialize(node: dict, base_path: Path):
    path = base_path / node["name"]

    if node["type"] == "folder":
        path.mkdir(parents=True, exist_ok=True)

        # 🔥 Auto README per folder
        readme = path / "README.md"
        if not readme.exists():
            readme.write_text(
                f"# {node['name']}\n\n{node.get('description', '')}\n",
                encoding="utf-8"
            )

        for child in node.get("children", []):
            materialize(child, path)

    elif node["type"] == "file":
        path.touch(exist_ok=True)
