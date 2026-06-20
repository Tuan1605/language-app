#!/usr/bin/env python3
"""Convert extracted Anki vocabulary notes into the app's RawVocab JSON format.

Generic vocab decks here use:
  field1 -> word (the target-language term, e.g. Japanese/English)
  field0 -> definition (the native-language meaning, e.g. Vietnamese)
  other fields -> example if present
  tags   -> topic

Usage: python convert_vocab.py <notes.json> <out.json> <id_prefix> <difficulty>
"""
import json
import sys


def clean(s):
    return (s or '').strip()


def main():
    notes = json.load(open(sys.argv[1], encoding='utf-8'))
    out_path = sys.argv[2]
    prefix = sys.argv[3] if len(sys.argv) > 3 else 'anki'
    difficulty = sys.argv[4] if len(sys.argv) > 4 else 'intermediate'
    out = []
    seen = set()
    for i, n in enumerate(notes):
        f = n.get('fields', {})
        # field1 holds the target term, field0 the meaning.
        word = clean(f.get('field1', ''))
        definition = clean(f.get('field0', ''))
        if not word:
            # Some decks swap order; fall back to any non-empty field.
            word = clean(f.get('field0', ''))
            definition = clean(f.get('field1', ''))
        if not word:
            continue
        example = None
        for k in ('field2', 'field3', 'field4'):
            v = clean(f.get(k, ''))
            if v:
                example = v if not example else example + ' / ' + v
                break
        tags = (n.get('tags') or '').strip()
        # Dedupe by word; keep first.
        if word in seen:
            continue
        seen.add(word)
        out.append({
            'id': '%s-%04d' % (prefix, i + 1),
            'word': word,
            'definition': definition or word,
            'example': example,
            'difficulty': difficulty,
            'topic': tags or None,
        })
    with open(out_path, 'w', encoding='utf-8') as fh:
        json.dump(out, fh, ensure_ascii=False, indent=2)
    print('written %d vocab cards (deduped from %d notes)' % (len(out), len(notes)),
          file=sys.stderr)


if __name__ == '__main__':
    main()
