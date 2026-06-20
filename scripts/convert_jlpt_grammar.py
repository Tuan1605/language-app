#!/usr/bin/env python3
"""Convert extracted Anki JLPT grammar notes into the app's RawVocab JSON
format so contentLoader.ts can load them as SM-2 flashcards.

Input:  <notes.json>  (from anki_read.py)
Output: <grammar-anki.json>

Field mapping (Anki note -> RawVocab):
  field0 (pattern)   -> word
  field1 (meaning)   -> definition (primary)
  field2+field3      -> example (Japanese sentence + Vietnamese)
  field6 (usage)     -> appended to definition (cleaned of HTML)
  field7 (formula)   -> appended to definition (cleaned of HTML)
  tags               -> topic
"""
import json
import re
import sys
import html as htmllib


def strip_html(s):
    if not s:
        return ''
    # Convert <br>, <div> boundaries to a newline-ish separator, then strip tags.
    s = re.sub(r'<\s*br\s*/?\s*>', '\n', s, flags=re.I)
    s = re.sub(r'<\s*/?\s*div\s*>', '\n', s, flags=re.I)
    s = re.sub(r'<[^>]+>', '', s)
    s = htmllib.unescape(s)
    # Collapse blank lines and trim each line.
    lines = [ln.strip() for ln in s.splitlines()]
    lines = [ln for ln in lines if ln]
    return ' | '.join(lines)


def clean(s):
    if not s:
        return ''
    return s.strip()


def main():
    notes = json.load(open(sys.argv[1], encoding='utf-8'))
    out = []
    seen = set()
    for i, n in enumerate(notes):
        f = n.get('fields', {})
        pattern = clean(f.get('field0', ''))
        if not pattern:
            continue
        meaning = clean(f.get('field1', ''))
        ex_jp = clean(f.get('field2', ''))
        ex_vi = clean(f.get('field3', ''))
        usage = strip_html(f.get('field6', ''))
        formula = strip_html(f.get('field7', ''))
        tags = n.get('tags', '').strip()

        # Dedupe by pattern; keep first occurrence.
        key = pattern
        if key in seen:
            key = f'{pattern} ({i})'
        seen.add(key)

        # Build a rich definition: meaning + formula + usage notes.
        parts = [p for p in [meaning, ('Công thức: ' + formula) if formula else '',
                             ('Cách dùng: ' + usage) if usage else ''] if p]
        definition = ' — '.join(parts) if parts else meaning

        # Example combines the Japanese sentence with its translation.
        example = ' / '.join([p for p in [ex_jp, ex_vi] if p]) if (ex_jp or ex_vi) else None

        out.append({
            'id': 'n2-gr-anki-%03d' % (i + 1),
            'word': pattern,
            'definition': definition,
            'example': example,
            'difficulty': 'advanced',
            'topic': tags or 'ngữ pháp',
        })

    json.dump(out, sys.stdout if len(sys.argv) <= 2
              else open(sys.argv[2], 'w', encoding='utf-8'),
              ensure_ascii=False, indent=2)
    print('written %d grammar cards' % len(out), file=sys.stderr)


if __name__ == '__main__':
    main()
