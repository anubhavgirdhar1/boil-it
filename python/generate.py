import json
import sys
from pathlib import Path

from llm.groq_client import GroqClient
from validators.layout_validator import validate_structure
from materializers.filesystem import materialize


def main():
    payload_path = sys.argv[1]

    with open(payload_path, "r", encoding="utf-8") as f:
        payload = json.load(f)

    root = Path(payload["rootPath"])
    services = payload["services"]
    app_type = payload["appType"]
    description = payload.get("description", "")
    api_key = payload["apiKey"]

    print("Starting project generation...")

    # Python still owns the common services folder
    services_root = root / "services"
    services_root.mkdir(exist_ok=True)

    client = GroqClient(api_key)

    for svc in services:
        service_name = svc["name"]
        print(f"> Generating {service_name}")

        prompt = build_service_prompt(
            service_name=service_name,
            app_type=app_type,
            description=description
        )

        layout = client.generate_layout(prompt)

        # Validate the FULL structure returned by LLM
        validate_structure(layout["structure"])

        # 🔥 FIX: DO NOT create service folder in Python
        # Let the LLM-created root folder be materialized directly
        materialize(layout["structure"], services_root)

    print("Done.")


def build_service_prompt(service_name: str, app_type: str, description: str) -> str:
    template = Path(__file__).parent / "prompts" / "service_layout.txt"
    text = template.read_text(encoding="utf-8")

    return (
        text
        .replace("{service_name}", service_name)
        .replace("{app_type}", app_type)
        .replace("{description}", description)
    )


if __name__ == "__main__":
    main()
