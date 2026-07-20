from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
INTERNAL_NAME = "".join(("ro", "le", "fo", "rge"))
FORBIDDEN = re.compile(INTERNAL_NAME[:4] + r"[\s_-]*" + INTERNAL_NAME[4:], re.IGNORECASE)
EXPECTED_PAGES = {
    "Russell-Dudek-Axial-Fractional-CAIO-Resume.pdf": 2,
    "Russell-Dudek-Axial-Fractional-CAIO-Cover-Letter.pdf": 1,
    "Russell-Dudek-Axial-Interview-Thesis-Brief.pdf": 4,
    "Russell-Dudek-Axial-120-Day-Entry-Plan.pdf": 3,
    "Russell-Dudek-Fractional-AI-Mandate-Charter.pdf": 2,
    "Russell-Dudek-Axial-Fractional-CAIO-Fit-Analysis.pdf": 2,
}
TEXT_EXTENSIONS = {".html", ".css", ".js", ".json", ".md", ".txt", ".svg", ".yml", ".yaml", ".py"}


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    raise SystemExit(1)


def verify_manifest() -> None:
    manifest = json.loads((ROOT / "artifact-manifest.json").read_text(encoding="utf-8"))
    for group in ("routes", "source_files", "pdfs"):
        for relative in manifest[group]:
            path = ROOT / relative
            if not path.exists() or path.stat().st_size == 0:
                fail(f"Missing or empty manifest item: {relative}")


def verify_confidentiality() -> None:
    matches = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in TEXT_EXTENSIONS:
            continue
        if ".git" in path.parts:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        if FORBIDDEN.search(text) or FORBIDDEN.search(str(path.relative_to(ROOT))):
            matches.append(str(path.relative_to(ROOT)))
    for path in (ROOT / "docs").glob("*.pdf"):
        reader = PdfReader(str(path))
        text = "\n".join((page.extract_text() or "") for page in reader.pages)
        metadata = " ".join(str(value) for value in (reader.metadata or {}).values())
        if FORBIDDEN.search(text) or FORBIDDEN.search(metadata) or FORBIDDEN.search(path.name):
            matches.append(str(path.relative_to(ROOT)))
    if matches:
        fail("Forbidden internal-name matches: " + ", ".join(matches))


def verify_pdfs() -> None:
    for name, count in EXPECTED_PAGES.items():
        path = ROOT / "docs" / name
        if not path.exists():
            fail(f"Missing PDF: {name}")
        reader = PdfReader(str(path))
        if len(reader.pages) != count:
            fail(f"{name} has {len(reader.pages)} pages; expected {count}")
        extracted = "\n".join((page.extract_text() or "") for page in reader.pages)
        if "Russell Dudek" not in extracted:
            fail(f"Candidate name not extractable from {name}")
        if name.startswith("Russell-Dudek-Axial-Fractional-CAIO-Resume"):
            required = ["412.287.8640", "russelldudek@gmail.com", "linkedin.com/in/russelldudek", "https://russelldudek.github.io/Axial/"]
            for value in required:
                if value not in extracted:
                    fail(f"Resume PDF missing contact value: {value}")
        if "Cover-Letter" in name:
            required = ["412.287.8640", "russelldudek@gmail.com", "linkedin.com/in/russelldudek", "https://russelldudek.github.io/Axial/"]
            for value in required:
                if value not in extracted:
                    fail(f"Cover letter PDF missing contact value: {value}")


def verify_source_links() -> None:
    for page in ROOT.glob("*.html"):
        text = page.read_text(encoding="utf-8")
        for target in re.findall(r'(?:href|src)="([^"]+)"', text):
            parsed = urlparse(target)
            if parsed.scheme or target.startswith("#") or target.startswith("mailto:") or target.startswith("tel:"):
                continue
            relative = target.split("#", 1)[0].split("?", 1)[0]
            if not relative:
                continue
            if not (ROOT / relative).exists():
                fail(f"Broken local reference in {page.name}: {target}")


def main() -> int:
    verify_manifest()
    verify_confidentiality()
    verify_pdfs()
    verify_source_links()
    print("PASS: manifest, page counts, contact integrity, confidentiality, PDF extraction, and local links")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
