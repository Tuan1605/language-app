"""
TOEIC Data Scraper - Output đúng format app language-app

Supported output formats:
  1. Listening questions -> src/data/toeic/questions-listening.json
  2. Reading passages    -> src/data/toeic/reading-passages.json
  3. Authentic exam      -> src/data/authentic/toeic-auth-{N}.json
  4. Vocabulary          -> src/data/toeic/flashcards.json

Usage:
  pip install requests beautifulsoup4
  python scrape_toeic.py --mode listening --url <URL>
  python scrape_toeic.py --mode reading --url <URL>
  python scrape_toeic.py --mode exam --url <URL> --exam-id 4
  python scrape_toeic.py --mode vocab --url <URL>
  python scrape_toeic.py --mode generic --url <URL> --config config.json
"""

import argparse
import json
import os
import re
import time
import hashlib
from pathlib import Path
from typing import Any
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup, Tag

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
APP_DATA_DIR = Path(__file__).parent / "src" / "data"
TOEIC_DIR = APP_DATA_DIR / "toeic"
AUTHENTIC_DIR = APP_DATA_DIR / "authentic"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9,vi;q=0.8",
}

DEFAULT_DELAY = 2  # seconds between requests


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def fetch(url: str, session: requests.Session | None = None, delay: float = DEFAULT_DELAY) -> BeautifulSoup | None:
    """GET a URL and return parsed soup. Returns None on failure."""
    s = session or requests.Session()
    try:
        resp = s.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
        time.sleep(delay)
        return BeautifulSoup(resp.text, "html.parser")
    except Exception as e:
        print(f"  [ERROR] Failed to fetch {url}: {e}")
        return None


def make_id(prefix: str, text: str, idx: int) -> str:
    short = hashlib.md5(text.encode()).hexdigest()[:6]
    return f"{prefix}-{short}-{idx}"


def load_existing(path: Path) -> list[dict]:
    if path.exists():
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    return []


def save_json(path: Path, data: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    existing = load_existing(path)
    # Dedupe by id
    existing_ids = {item["id"] for item in existing}
    new_items = [d for d in data if d["id"] not in existing_ids]
    merged = existing + new_items
    with open(path, "w", encoding="utf-8") as f:
        json.dump(merged, f, ensure_ascii=False, indent=2)
    print(f"  [OK] {path.name}: {len(new_items)} new / {len(merged)} total")


def detect_difficulty(idx: int, total: int) -> str:
    ratio = idx / max(total, 1)
    if ratio < 0.4:
        return "beginner"
    if ratio < 0.8:
        return "intermediate"
    return "advanced"


# ---------------------------------------------------------------------------
# Generic CSS-selector scraper
# ---------------------------------------------------------------------------
class GenericScraper:
    """
    Scrape using configurable CSS selectors.
    Config example (JSON file or dict):

    {
      "url": "https://example.com/toeic",
      "mode": "listening",
      "selectors": {
        "container": "div.question-item",
        "text": "p.stem",
        "options": "li.option",
        "correct": "span.correct",
        "passage": "div.passage",
        "audio": "audio source"
      }
    }
    """

    def __init__(self, config: dict):
        self.config = config
        self.session = requests.Session()
        self.sels = config.get("selectors", {})

    def scrape(self) -> list[dict]:
        url = self.config["url"]
        mode = self.config.get("mode", "listening")
        print(f"[Generic] Scraping {mode} from {url}")

        soup = fetch(url, self.session)
        if not soup:
            return []

        containers = soup.select(self.sels.get("container", "div.question"))
        print(f"  Found {len(containers)} question containers")

        results = []
        for idx, container in enumerate(containers):
            item = self._extract_question(container, idx, len(containers), mode)
            if item:
                results.append(item)

        return results

    def _extract_question(self, container: Tag, idx: int, total: int, mode: str) -> dict | None:
        text_el = container.select_one(self.sels.get("text", "p"))
        if not text_el:
            return None
        text = text_el.get_text(strip=True)

        option_els = container.select(self.sels.get("options", "li"))
        options = [o.get_text(strip=True) for o in option_els]
        if not options:
            return None

        correct_idx = -1
        correct_el = container.select_one(self.sels.get("correct", ".correct"))
        if correct_el:
            correct_text = correct_el.get_text(strip=True)
            for i, opt in enumerate(options):
                if correct_text in opt or opt in correct_text:
                    correct_idx = i
                    break

        audio_url = None
        audio_el = container.select_one(self.sels.get("audio", "audio source"))
        if audio_el:
            audio_url = audio_el.get("src")

        passage = None
        passage_el = container.select_one(self.sels.get("passage", ""))
        if passage_el:
            passage = passage_el.get_text("\n", strip=True)

        sub_cat = self.config.get("subCategory", f"Part {self.config.get('part', 5)}")

        if mode == "reading" and passage:
            return {
                "id": make_id("toeic-r", text, idx),
                "subCategory": sub_cat,
                "difficulty": detect_difficulty(idx, total),
                "passage": passage,
                "questions": [
                    {
                        "id": make_id("toeic-r", text, idx) + "-q1",
                        "text": text,
                        "options": options,
                        "correctAnswer": correct_idx,
                        "explanation": None,
                    }
                ],
            }

        return {
            "id": make_id("toeic-l" if mode == "listening" else "toeic-q", text, idx),
            "category": "toeic",
            "difficulty": detect_difficulty(idx, total),
            "subCategory": sub_cat,
            "text": text,
            "options": options,
            "correctAnswer": correct_idx,
            "explanation": None,
            "audioUrl": audio_url,
        }


# ---------------------------------------------------------------------------
# Listening-specific scraper
# ---------------------------------------------------------------------------
def scrape_listening(url: str, part: int = 1, limit: int = 100) -> list[dict]:
    """
    Scrape TOEIC Listening questions.
    Supports common patterns: audio + transcript, question + options.

    Output format matches src/data/toeic/questions-listening.json
    """
    print(f"\n=== Scraping Listening Part {part} from {url} ===")
    soup = fetch(url)
    if not soup:
        return []

    results = []
    sub_category = f"Part {part} - " + {
        1: "Photographs",
        2: "Question-Response",
        3: "Conversations",
        4: "Talks",
    }.get(part, "Listening")

    # Strategy 1: find question blocks
    question_selectors = [
        "div.question", "div.question-item", "div.quiz-question",
        "li.question", "div.q-item", "div.toeic-q",
    ]
    containers = []
    for sel in question_selectors:
        containers = soup.select(sel)
        if containers:
            break

    # Strategy 2: find audio elements and pair with text
    if not containers:
        audio_els = soup.find_all("audio")
        for idx, audio in enumerate(audio_els[:limit]):
            source = audio.find("source")
            if not source:
                continue
            audio_url = source.get("src", "")
            # Look for nearby text
            parent = audio.parent
            text = parent.get_text(" ", strip=True) if parent else f"Question {idx + 1}"

            # Find options nearby (A/B/C/D pattern)
            options = []
            for letter in ["(A)", "(B)", "(C)", "(D)", "A.", "B.", "C.", "D."]:
                opt_match = re.search(rf"{re.escape(letter)}\s*(.+?)(?=\([A-D]\)|$)", text)
                if opt_match:
                    options.append(opt_match.group(0).strip())

            if not options:
                options = ["(A)", "(B)", "(C)", "(D)"]

            results.append({
                "id": make_id("toeic-l", text, idx),
                "category": "toeic",
                "difficulty": detect_difficulty(idx, limit),
                "subCategory": sub_category,
                "text": re.split(r"\([A-D]\)", text)[0].strip()[:500],
                "options": options[:4],
                "correctAnswer": 0,
                "explanation": None,
                "audioUrl": audio_url,
            })

    # Process containers
    for idx, container in enumerate(containers[:limit]):
        text_el = container.find(["p", "div", "span"], class_=re.compile(r"text|stem|question|content"))
        if not text_el:
            text_el = container.find("p") or container.find("div")
        text = text_el.get_text(strip=True) if text_el else container.get_text(strip=True)[:300]

        options = []
        for opt_el in container.find_all(["li", "span", "div"], class_=re.compile(r"option|choice|answer")):
            opt_text = opt_el.get_text(strip=True)
            if opt_text and len(opt_text) < 200:
                options.append(opt_text)

        if not options:
            # Try to find A/B/C/D pattern in text
            opt_matches = re.findall(r"\(([A-D])\)\s*([^()]+)", text)
            if opt_matches:
                options = [f"({letter}) {content.strip()}" for letter, content in opt_matches]

        if not options:
            options = ["(A)", "(B)", "(C)", "(D)"]

        audio_url = None
        audio_el = container.find("audio")
        if audio_el:
            source = audio_el.find("source")
            if source:
                audio_url = source.get("src")

        correct_idx = 0
        correct_el = container.find(class_=re.compile(r"correct|right|answer"))
        if correct_el:
            correct_text = correct_el.get_text(strip=True)
            for i, opt in enumerate(options):
                if correct_text in opt:
                    correct_idx = i

        results.append({
            "id": make_id("toeic-l", text, idx),
            "category": "toeic",
            "difficulty": detect_difficulty(idx, len(containers)),
            "subCategory": sub_category,
            "text": text[:500],
            "options": options[:4] if len(options) >= 4 else options,
            "correctAnswer": correct_idx,
            "explanation": None,
            "audioUrl": audio_url,
        })

    print(f"  Scraped {len(results)} listening questions")
    return results


# ---------------------------------------------------------------------------
# Reading-specific scraper
# ---------------------------------------------------------------------------
def scrape_reading(url: str, limit: int = 50) -> list[dict]:
    """
    Scrape TOEIC Reading passages with comprehension questions.

    Output format matches src/data/toeic/reading-passages.json
    """
    print(f"\n=== Scraping Reading from {url} ===")
    soup = fetch(url)
    if not soup:
        return []

    results = []

    # Find passage containers
    passage_selectors = [
        "div.passage-container", "div.reading-passage", "article",
        "div.question-group", "div.toeic-reading", "section.reading",
    ]
    containers = []
    for sel in passage_selectors:
        containers = soup.select(sel)
        if containers:
            break

    # Fallback: look for long text blocks
    if not containers:
        for div in soup.find_all("div"):
            text = div.get_text(strip=True)
            if len(text) > 200 and len(text) < 5000:
                # Check if it contains question-like content
                if re.search(r"\([A-D]\)", text):
                    containers.append(div)

    for idx, container in enumerate(containers[:limit]):
        # Extract passage text
        passage = ""
        passage_el = container.find(["p", "div"], class_=re.compile(r"passage|text|content|body"))
        if passage_el:
            passage = passage_el.get_text("\n", strip=True)
        else:
            # Take all text before first question
            all_text = container.get_text("\n", strip=True)
            q_match = re.search(r"\d+[\.\)]\s*[A-Z]", all_text)
            if q_match:
                passage = all_text[: q_match.start()].strip()
            else:
                passage = all_text[:500]

        if len(passage) < 20:
            continue

        # Extract questions
        questions = []
        q_els = container.find_all(["div", "li"], class_=re.compile(r"question|q-item"))
        if not q_els:
            # Try to find numbered questions
            q_texts = re.split(r"(?=\d+[\.\)]\s)", passage)
            for q_idx, q_text in enumerate(q_texts[1:], 1):
                q_match = re.match(r"(\d+)[\.\)]\s*(.+?)(?=\([A-D]\))", q_text, re.DOTALL)
                if not q_match:
                    continue
                q_text_clean = q_match.group(2).strip()
                opt_matches = re.findall(r"\(([A-D])\)\s*([^()]+)", q_text)
                options = [f"({l}) {c.strip()}" for l, c in opt_matches]
                if options:
                    questions.append({
                        "id": make_id("toeic-r", q_text_clean, idx) + f"-q{q_idx}",
                        "text": q_text_clean[:300],
                        "options": options[:4],
                        "correctAnswer": 0,
                        "explanation": None,
                    })

        if not questions:
            # Single question per passage
            questions.append({
                "id": make_id("toeic-r", passage, idx) + "-q1",
                "text": f"Reading comprehension for passage {idx + 1}",
                "options": ["(A)", "(B)", "(C)", "(D)"],
                "correctAnswer": 0,
                "explanation": None,
            })

        sub_cat = "Part 7 - Reading Comprehension"
        if len(passage) < 200:
            sub_cat = "Part 6 - Text Completion"
        elif "email" in passage.lower() or "letter" in passage.lower():
            sub_cat = "Part 7 - Single Passages"
        elif "advertisement" in passage.lower() or "notice" in passage.lower():
            sub_cat = "Part 7 - Single Passages"

        results.append({
            "id": make_id("toeic-r", passage, idx),
            "subCategory": sub_cat,
            "difficulty": detect_difficulty(idx, len(containers)),
            "passage": passage[:3000],
            "questions": questions,
        })

    print(f"  Scraped {len(results)} reading passages")
    return results


# ---------------------------------------------------------------------------
# Full exam scraper
# ---------------------------------------------------------------------------
def scrape_full_exam(url: str, exam_id: int = 4) -> dict | None:
    """
    Scrape a full TOEIC exam (all 7 parts) into AuthenticExam format.

    Output format matches src/data/authentic/toeic-auth-{N}.json
    """
    print(f"\n=== Scraping Full Exam from {url} ===")
    soup = fetch(url, delay=1)
    if not soup:
        return None

    # Build sections for each part
    sections = []
    part_configs = [
        (1, "Part 1: Photographs", "Look at the photograph and choose the statement that best describes it.", 6),
        (2, "Part 2: Question-Response", "Listen to a question and 3 possible responses. Choose the best response.", 25),
        (3, "Part 3: Conversations", "Listen to the conversation and answer the questions.", 39),
        (4, "Part 4: Talks", "Listen to the talk and answer the questions.", 30),
        (5, "Part 5: Incomplete Sentences", "Choose the word or phrase that best completes the sentence.", 30),
        (6, "Part 6: Text Completion", "Choose the word or phrase that best completes the passage.", 16),
        (7, "Part 7: Reading Comprehension", "Read the passage and answer the questions.", 54),
    ]

    for part_num, title, desc, expected_count in part_configs:
        part_url = f"{url}?part={part_num}" if "?" not in url else f"{url}&part={part_num}"
        soup_part = fetch(part_url, delay=1)
        if not soup_part:
            continue

        questions = []
        containers = soup_part.find_all("div", class_=re.compile(r"question|item"))
        if not containers:
            containers = soup_part.find_all("div", class_=re.compile(r"q"))

        for idx, container in enumerate(containers[:expected_count]):
            q = _extract_question_from_container(container, part_num, idx, exam_id)
            if q:
                questions.append(q)

        if questions:
            sections.append({
                "id": f"t{exam_id}-sec-{part_num}",
                "title": title,
                "description": desc,
                "questions": questions,
            })

    if not sections:
        print("  [WARN] No sections scraped")
        return None

    total_q = sum(len(s["questions"]) for s in sections)
    exam = {
        "id": f"toeic-auth-{exam_id}",
        "title": f"TOEIC Practice Exam {exam_id}",
        "year": 2024,
        "category": "toeic",
        "difficulty": "intermediate",
        "timeLimitMinutes": 120,
        "sections": sections,
    }
    print(f"  Built exam with {len(sections)} sections, {total_q} questions")
    return exam


def _extract_question_from_container(container: Tag, part: int, idx: int, exam_id: int) -> dict | None:
    """Extract a single question from a container element."""
    prefix = f"t{exam_id}-p{part}"

    text_el = container.find(["p", "div", "span"], class_=re.compile(r"text|stem|question"))
    text = text_el.get_text(strip=True) if text_el else ""

    options = []
    for opt_el in container.find_all(["li", "span", "div"], class_=re.compile(r"option|choice")):
        opt_text = opt_el.get_text(strip=True)
        if opt_text and len(opt_text) < 200:
            options.append(opt_text)

    if not options:
        opt_matches = re.findall(r"\(([A-D])\)\s*([^()]+)", container.get_text())
        options = [f"({l}) {c.strip()}" for l, c in opt_matches]

    if part == 1:
        if not options:
            options = ["(A)", "(B)", "(C)", "(D)"]
        return {
            "id": f"{prefix}-{idx + 1}",
            "text": text or "Look at the picture and choose the correct statement.",
            "options": options[:4],
            "correctAnswer": 0,
            "explanation": None,
            "audioUrl": "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
        }

    if part in [2]:
        if not options:
            options = ["(A)", "(B)", "(C)"]
        return {
            "id": f"{prefix}-{idx + 1}",
            "text": text or f"Question {idx + 1}",
            "options": options[:3],
            "correctAnswer": 0,
            "explanation": None,
            "audioUrl": "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
        }

    # Parts 3-4: passage-based
    passage = ""
    passage_el = container.find(["div", "p"], class_=re.compile(r"passage|transcript"))
    if passage_el:
        passage = passage_el.get_text("\n", strip=True)

    if not options:
        options = ["(A)", "(B)", "(C)", "(D)"]

    q = {
        "id": f"{prefix}-{idx + 1}",
        "text": text or f"Question {idx + 1}",
        "options": options[:4],
        "correctAnswer": 0,
        "explanation": None,
        "audioUrl": "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
    }
    if passage:
        q["passage"] = passage
    return q


# ---------------------------------------------------------------------------
# Vocabulary scraper
# ---------------------------------------------------------------------------
def scrape_vocabulary(url: str, limit: int = 200) -> list[dict]:
    """
    Scrape TOEIC vocabulary from word-list pages.

    Output format matches src/data/toeic/flashcards.json
    """
    print(f"\n=== Scraping Vocabulary from {url} ===")
    soup = fetch(url)
    if not soup:
        return []

    results = []

    # Find word containers
    word_selectors = [
        "div.word-item", "tr.word", "li.vocab", "div.flashcard",
        "div.vocabulary-item", "tr", "li",
    ]
    containers = []
    for sel in word_selectors:
        containers = soup.select(sel)
        # Filter: must contain both word and meaning
        filtered = []
        for c in containers:
            text = c.get_text(strip=True)
            if len(text) > 5 and len(text) < 500:
                filtered.append(c)
        if len(filtered) >= 5:
            containers = filtered
            break

    for idx, container in enumerate(containers[:limit]):
        cells = container.find_all(["td", "span", "div", "p"])
        if len(cells) < 2:
            continue

        word = cells[0].get_text(strip=True)
        definition = cells[1].get_text(strip=True)

        if not word or not definition or len(word) > 50:
            continue

        example = ""
        phonetic = ""
        if len(cells) >= 3:
            example = cells[2].get_text(strip=True)
        if len(cells) >= 4:
            phonetic = cells[3].get_text(strip=True)

        # Extract phonetic from parentheses if present
        phonetic_match = re.search(r"\(/[^)]+\)", definition)
        if phonetic_match:
            phonetic = phonetic_match.group(0)

        results.append({
            "id": make_id("toeic-v", word, idx),
            "word": word,
            "definition": definition,
            "example": example or None,
            "exampleTranslation": None,
            "phonetic": phonetic or None,
            "topic": "TOEIC Vocabulary",
            "difficulty": detect_difficulty(idx, len(containers)),
        })

    print(f"  Scraped {len(results)} vocabulary words")
    return results


# ---------------------------------------------------------------------------
# Main CLI
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="TOEIC Data Scraper for language-app")
    parser.add_argument("--mode", choices=["listening", "reading", "exam", "vocab", "generic"], required=True)
    parser.add_argument("--url", required=True, help="URL to scrape")
    parser.add_argument("--part", type=int, default=1, help="TOEIC part (1-4 for listening)")
    parser.add_argument("--exam-id", type=int, default=4, help="Exam ID for full exam mode")
    parser.add_argument("--limit", type=int, default=100, help="Max items to scrape")
    parser.add_argument("--config", help="JSON config file for generic mode")
    parser.add_argument("--output", help="Custom output file path")
    parser.add_argument("--dry-run", action="store_true", help="Print results without saving")

    args = parser.parse_args()
    results = []

    if args.mode == "listening":
        results = scrape_listening(args.url, part=args.part, limit=args.limit)
        output = Path(args.output) if args.output else TOEIC_DIR / "questions-listening.json"

    elif args.mode == "reading":
        results = scrape_reading(args.url, limit=args.limit)
        output = Path(args.output) if args.output else TOEIC_DIR / "reading-passages.json"

    elif args.mode == "vocab":
        results = scrape_vocabulary(args.url, limit=args.limit)
        output = Path(args.output) if args.output else TOEIC_DIR / "flashcards.json"

    elif args.mode == "exam":
        exam = scrape_full_exam(args.url, exam_id=args.exam_id)
        if exam:
            output = Path(args.output) if args.output else AUTHENTIC_DIR / f"toeic-auth-{args.exam_id}.json"
            if args.dry_run:
                print(json.dumps(exam, ensure_ascii=False, indent=2)[:2000])
            else:
                output.parent.mkdir(parents=True, exist_ok=True)
                with open(output, "w", encoding="utf-8") as f:
                    json.dump(exam, f, ensure_ascii=False, indent=2)
                print(f"  [OK] Saved exam to {output}")
        return

    elif args.mode == "generic":
        if not args.config:
            print("Error: --config required for generic mode")
            return
        with open(args.config, encoding="utf-8") as f:
            config = json.load(f)
        scraper = GenericScraper(config)
        results = scraper.scrape()
        output = Path(args.output) if args.output else TOEIC_DIR / "questions-listening.json"

    if args.dry_run:
        print(json.dumps(results[:3], ensure_ascii=False, indent=2))
        print(f"\n... and {len(results) - 3} more items (dry run, not saved)")
        return

    if results:
        save_json(output, results)
    else:
        print("  [WARN] No data scraped. Check URL and page structure.")


if __name__ == "__main__":
    main()
