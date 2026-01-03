MAX_DEPTH = 5
MAX_NODES = 100

import re

ALLOWED_EXTENSIONS = (
    ".py",
    ".txt",
    ".md",
    ".json",
    ".yaml",
    ".yml",
    ".toml",
    ".ini",
    ".env",
    ".sh",
)

ALLOWED_EXTENSIONLESS_FILES = {
    "Dockerfile",
    "Makefile",
}

DOTFILE_PATTERN = re.compile(r"^\.[a-zA-Z0-9._-]+$")


def is_valid_filename(name: str) -> bool:
    # No path traversal
    if "/" in name or "\\" in name or ".." in name:
        return False

    # Allow Dockerfile, Makefile, etc.
    if name in ALLOWED_EXTENSIONLESS_FILES:
        return True

    # Allow dotfiles (.dockerignore, .env.example)
    if DOTFILE_PATTERN.match(name):
        return True

    # Allow normal extensions
    return name.endswith(ALLOWED_EXTENSIONS)


class LayoutValidationError(Exception):
    pass


def validate_structure(structure: dict):
    counter = [0]
    _validate_node(structure, depth=1, counter=counter)


def _validate_node(node: dict, depth: int, counter: list):
    counter[0] += 1
    if counter[0] > MAX_NODES:
        raise LayoutValidationError("Too many nodes")

    if depth > MAX_DEPTH:
        raise LayoutValidationError("Max depth exceeded")

    if node["type"] == "folder":
        for child in node.get("children", []):
            _validate_node(child, depth + 1, counter)
    
    if node["type"] == "folder":
        if "description" not in node:
            raise LayoutValidationError(
                f"Folder '{node.get('name')}' missing description"
            )

    elif node["type"] == "file":
        if not is_valid_filename(node["name"]):
            raise LayoutValidationError(f"Invalid file type: {node['name']}")
    else:
        raise LayoutValidationError(f"Unknown node type: {node['type']}")
