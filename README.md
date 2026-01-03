
---

# Boil It

**Boil It** is a VS Code extension that helps backend engineers instantly scaffold production-grade FastAPI microservices using AI, without rewriting boilerplate repeatedly.

You describe *what* you want.
Boil It figures out *how it should be structured*.

---

## What Boil It Does

* Generates realistic FastAPI microservice folder structures
* Uses Groq-powered LLMs to design architecture dynamically
* Creates nested folders such as `apis`, `schemas`, `services`, `utils`, `core`, etc.
* Auto-generates `README.md` files in every folder explaining their purpose
* Validates layouts to prevent unsafe or invalid filesystem operations
* Works directly inside VS Code through a clean sidebar interface

This extension is designed to produce layouts suitable for real production backends.

---

## How It Works

1. Open a folder in VS Code
2. Open the **Boil It** sidebar
3. Configure:

   * Microservice name(s)
   * Application type (Traditional or Gen AI)
   * Optional project description
   * Groq API key
4. Click **Create Project**
5. The microservice structure is generated in your workspace

---

## Example Output

```
services/
└── auth/
    ├── core/
    │   ├── app.py
    │   ├── config.py
    │   └── README.md
    ├── apis/
    │   ├── auth.py
    │   ├── users.py
    │   └── README.md
    ├── schemas/
    │   ├── user.py
    │   └── README.md
    ├── services/
    │   ├── auth_service.py
    │   └── README.md
    ├── utils/
    │   ├── jwt.py
    │   └── README.md
    ├── docker/
    │   ├── Dockerfile
    │   └── README.md
    └── README.md
```

Each folder includes documentation describing what belongs inside it and how it is intended to be used.

---

## About the API Key

* The Groq API key is used only during project generation
* It is never stored
* It is never logged
* It is never shared or embedded in generated files

---

## Current Scope (v0.x)

* Architecture: Microservices
* Backend framework: FastAPI
* Focus: Folder structure and documentation generation

Future releases will expand into code generation and previews.

---

## Roadmap

* Generate actual FastAPI boilerplate code
* Preview folder structure before writing to disk
* Multi-service UI with dynamic add/remove
* Optional test scaffolding
* Retry and auto-fix for invalid AI outputs

---

## Contributing

Feedback, ideas, and pull requests are welcome.
The project is opinionated by design and extensible by intent.

---

## Contact

If you want to reach out, collaborate, or provide feedback:

[https://anubhavgirdhar.link/](https://anubhavgirdhar.link/)

---

## License

MIT License © 2026 Anubhav Girdhar

---