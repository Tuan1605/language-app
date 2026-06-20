#!/usr/bin/env python3
"""Read an Anki collection.anki2 database and dump structure + sample notes."""
import sqlite3
import sys

DB = sys.argv[1] if len(sys.argv) > 1 else '/tmp/apkg_jlpt/collection.anki2'

conn = sqlite3.connect(DB)
cur = conn.cursor()

print('=== TABLES ===')
for r in cur.execute("SELECT name FROM sqlite_master WHERE type='table'"):
    print(' ', r[0])

print('\n=== NOTES COLUMNS ===')
cur.execute('PRAGMA table_info(notes)')
for r in cur.fetchall():
    print(' ', r)

print('\n=== NOTE COUNT ===')
cur.execute('SELECT COUNT(*) FROM notes')
print(' ', cur.fetchone()[0])

print('\n=== MODELS (mid -> name) ===')
cur.execute('SELECT models FROM col')
models_blob = cur.fetchone()[0]
import json
try:
    models = json.loads(models_blob)
    for mid, m in models.items():
        flds = [f['name'] for f in m.get('flds', [])]
        name = m.get('name')
        print('  mid=%s  name=%s  fields=%s' % (mid, name, flds))
except Exception as e:
    print('  (could not parse models:', e, ')')

print('\n=== SAMPLE 5 NOTES ===')
cur.execute('SELECT id, mid, flds, tags FROM notes LIMIT 5')
for nid, mid, flds, tags in cur.fetchall():
    print(f'--- id={nid} mid={mid} tags={tags} ---')
    print(' ', repr(flds[:600]))

conn.close()
