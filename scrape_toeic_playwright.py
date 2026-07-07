"""
TOEIC Scraper using Playwright - Xử lý trang JavaScript render
Hỗ trợ englishteststore.net và các trang tương tự

Cài đặt:
  pip install playwright
  playwright install chromium

Usage:
  python3 scrape_toeic_playwright.py --url "URL" --mode listening
  python3 scrape_toeic_playwright.py --url "URL" --mode reading
  python3 scrape_toeic_playwright.py --url "URL" --mode full
"""

import argparse
import json
import hashlib
import re
import time
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

APP_DATA_DIR = Path(__file__).parent / "src" / "data"
TOEIC_DIR = APP_DATA_DIR / "toeic"
AUTHENTIC_DIR = APP_DATA_DIR / "authentic"


def make_id(prefix: str, text: str, idx: int) -> str:
    short = hashlib.md5(text.encode()).hexdigest()[:6]
    return f"{prefix}-{short}-{idx}"


def detect_difficulty(idx: int, total: int) -> str:
    ratio = idx / max(total, 1)
    if ratio < 0.4:
        return "beginner"
    if ratio < 0.8:
        return "intermediate"
    return "advanced"


class PlaywrightTOEICScraper:
    def __init__(self):
        self.browser = None
        self.page = None

    def start(self):
        self.pw = sync_playwright().start()
        self.browser = self.pw.chromium.launch(headless=True)
        self.page = self.browser.new_page()

    def stop(self):
        if self.browser:
            self.browser.close()
        if self.pw:
            self.pw.stop()

    def scrape_page(self, url: str, wait_ms: int = 5000) -> dict:
        """Scrape a single TOEIC test page"""
        print(f"  Loading: {url}")
        try:
            self.page.goto(url, wait_until="networkidle", timeout=30000)
            self.page.wait_for_timeout(wait_ms)
        except PlaywrightTimeout:
            print(f"  Timeout loading {url}, continuing...")

        # Try to find iframe with quiz
        iframe = self.page.frame_locator("iframe").first
        if iframe:
            print("  Found iframe, extracting quiz data...")
            return self._extract_from_iframe(iframe)

        # Fallback: extract from main page
        return self._extract_from_main_page()

    def _extract_from_iframe(self, iframe) -> dict:
        """Extract quiz data from iSpring iframe"""
        result = {"questions": [], "type": "unknown"}

        try:
            # Wait for quiz to load
            time.sleep(3)

            # Try to find question elements
            questions = iframe.locator(".quiz-question, .slide-text, .question-text").all()
            if not questions:
                questions = iframe.locator("[class*='question']").all()

            for idx, q in enumerate(questions):
                text = q.inner_text()
                if text and len(text) > 5:
                    result["questions"].append({
                        "id": f"q-{idx}",
                        "text": text[:500],
                        "options": [],
                        "correctAnswer": 0
                    })

            # Try to find answer options
            options = iframe.locator(".choice-text, .answer-text, [class*='choice']").all()
            if options and result["questions"]:
                current_q = result["questions"][-1]
                for opt in options:
                    opt_text = opt.inner_text()
                    if opt_text:
                        current_q["options"].append(opt_text)

        except Exception as e:
            print(f"  Error extracting from iframe: {e}")

        return result

    def _extract_from_main_page(self) -> dict:
        """Extract from main page content"""
        content = self.page.content()
        return {"html": content[:5000], "questions": []}

    def scrape_category_page(self, url: str) -> list[str]:
        """Scrape a category page to get test URLs"""
        print(f"  Loading category: {url}")
        try:
            self.page.goto(url, wait_until="networkidle", timeout=30000)
            self.page.wait_for_timeout(3000)
        except PlaywrightTimeout:
            pass

        # Find test links
        links = []
        for a in self.page.locator("a[href]").all():
            href = a.get_attribute("href")
            if href and ("test" in href.lower() or "practice" in href.lower()):
                if not href.startswith("http"):
                    href = f"https://englishteststore.net{href}"
                links.append(href)

        return list(set(links))

    def scrape_toeic_listening_part5(self, base_url: str = "https://englishteststore.net", limit: int = 10):
        """Scrape TOEIC Reading Part 5 (Incomplete Sentences)"""
        print("\n=== Scraping TOEIC Reading Part 5 ===")

        # Part 5 category
        category_url = f"{base_url}/index.php?option=com_content&view=category&layout=blog&id=412&Itemid=580"
        test_links = self.scrape_category_page(category_url)
        print(f"  Found {len(test_links)} test links")

        all_questions = []
        for idx, link in enumerate(test_links[:limit]):
            print(f"\n  [{idx+1}/{min(limit, len(test_links))}] {link}")
            result = self.scrape_page(link)
            for q in result.get("questions", []):
                q["id"] = make_id("toeic-p5", q.get("text", ""), len(all_questions))
                q["subCategory"] = "Part 5 - Incomplete Sentences"
                q["category"] = "toeic"
                q["difficulty"] = detect_difficulty(len(all_questions), limit * 10)
                all_questions.append(q)

        return all_questions

    def scrape_toeic_reading_part7(self, base_url: str = "https://englishteststore.net", limit: int = 10):
        """Scrape TOEIC Reading Part 7 (Reading Comprehension)"""
        print("\n=== Scraping TOEIC Reading Part 7 ===")

        category_url = f"{base_url}/index.php?option=com_content&view=category&id=683&Itemid=450"
        test_links = self.scrape_category_page(category_url)
        print(f"  Found {len(test_links)} test links")

        all_passages = []
        for idx, link in enumerate(test_links[:limit]):
            print(f"\n  [{idx+1}/{min(limit, len(test_links))}] {link}")
            result = self.scrape_page(link)
            questions = result.get("questions", [])
            if questions:
                all_passages.append({
                    "id": make_id("toeic-r", link, len(all_passages)),
                    "subCategory": "Part 7 - Reading Comprehension",
                    "difficulty": detect_difficulty(len(all_passages), limit),
                    "passage": "",  # Would need to extract from page
                    "questions": questions
                })

        return all_passages


def main():
    parser = argparse.ArgumentParser(description="TOEIC Scraper with Playwright")
    parser.add_argument("--url", required=True, help="URL to scrape")
    parser.add_argument("--mode", choices=["listening", "reading", "full", "category"], default="reading")
    parser.add_argument("--limit", type=int, default=5, help="Max tests to scrape")
    parser.add_argument("--output", help="Output file path")
    parser.add_argument("--dry-run", action="store_true")

    args = parser.parse_args()

    scraper = PlaywrightTOEICScraper()
    try:
        scraper.start()

        if args.mode == "category":
            links = scraper.scrape_category_page(args.url)
            print(f"\nFound {len(links)} test links:")
            for link in links[:20]:
                print(f"  {link}")
            return

        if args.mode == "reading":
            # Try Part 5
            questions = scraper.scrape_toeic_listening_part5(limit=args.limit)
            output = Path(args.output) if args.output else TOEIC_DIR / "questions-part5.json"

            if args.dry_run:
                print(json.dumps(questions[:3], ensure_ascii=False, indent=2))
            else:
                output.parent.mkdir(parents=True, exist_ok=True)
                with open(output, "w", encoding="utf-8") as f:
                    json.dump(questions, f, ensure_ascii=False, indent=2)
                print(f"\nSaved {len(questions)} questions to {output}")

    finally:
        scraper.stop()


if __name__ == "__main__":
    main()
