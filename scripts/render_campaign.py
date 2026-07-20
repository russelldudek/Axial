from pathlib import Path
from weasyprint import HTML

ROOT = Path(__file__).resolve().parents[1]
DOCS = {
    'resume.html': 'Russell-Dudek-Axial-Fractional-CAIO-Resume.pdf',
    'cover-letter.html': 'Russell-Dudek-Axial-Fractional-CAIO-Cover-Letter.pdf',
    'interview-brief.html': 'Russell-Dudek-Axial-Interview-Thesis-Brief.pdf',
    '120-day-plan.html': 'Russell-Dudek-Axial-120-Day-Entry-Plan.pdf',
    'mandate-charter.html': 'Russell-Dudek-Fractional-AI-Mandate-Charter.pdf',
    'fit-analysis.html': 'Russell-Dudek-Axial-Fractional-CAIO-Fit-Analysis.pdf',
}

def main() -> int:
    docs = ROOT / 'docs'
    docs.mkdir(exist_ok=True)
    for source, target in DOCS.items():
        HTML(filename=str(ROOT / source), base_url=str(ROOT)).write_pdf(str(docs / target))
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
