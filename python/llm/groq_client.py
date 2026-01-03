import json
from groq import Groq


class GroqClient:
    def __init__(self, api_key: str):
        self.client = Groq(api_key=api_key)

    def generate_layout(self, prompt: str) -> dict:
        response = self.client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1
        )

        raw = response.choices[0].message.content.strip()

        print("----- GROQ RAW RESPONSE -----")
        print(raw)
        print("----- END RESPONSE -----")

        return json.loads(raw)
