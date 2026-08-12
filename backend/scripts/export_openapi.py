"""Export the FastAPI OpenAPI schema to the shared contracts folder.

Run from backend/:
    uv run python -m scripts.export_openapi

Regenerate contracts/openapi.json after any backend API change so the parallel
frontend session can consume the updated contract without running the server.
"""

import json
from pathlib import Path

from app.main import app

PROJECT_ROOT = Path(__file__).resolve().parents[2]
OUTPUT = PROJECT_ROOT / "contracts" / "openapi.json"


def main() -> None:
    spec = app.openapi()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(spec, indent=2) + "\n", encoding="utf-8")
    print(f"OpenAPI schema written to {OUTPUT}")


if __name__ == "__main__":
    main()
