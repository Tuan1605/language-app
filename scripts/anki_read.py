#!/usr/bin/env python3
"""Extract notes from a modern Anki .apkg.

Modern Anki (23.10+) ships a zstd-compressed SQLite DB as collection.anki21b
with a newer schema (notetypes/notes/fields tables instead of the legacy
notes.flds blob). This script:

  1. Decompresses collection.anki21b (zstd) to a temp .sqlite file.
  2. Reads notes joined to their notetype fields.
  3. Prints JSON: [{model_name, fields:{name:value}, tags}, ...]

Usage: python anki_read.py <extracted_apkg_dir>
"""
import json
import os
import sqlite3
import sys
import tempfile

import zstandard


def decompress_db(work_dir):
    """Return path to a decompressed SQLite file from collection.anki21b."""
    proto = os.path.join(work_dir, 'collection.anki21b')
    if os.path.exists(proto):
        with open(proto, 'rb') as f:
            raw = zstandard.ZstdDecompressor().stream_reader(f).read()
        tmp = proto + '.sqlite'
        with open(tmp, 'wb') as f:
            f.write(raw)
        return tmp
    legacy = os.path.join(work_dir, 'collection.anki2')
    return legacy if os.path.exists(legacy) else None


def read_notes(db_path):
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    # Map notetype id -> (name, [field names in order])
    nt = {}
    try:
        cur.execute('SELECT ntid, name FROM notetypes')
        nt_names = {r['ntid']: r['name'] for r in cur.fetchall()}
        cur.execute('SELECT ntid, ord, name FROM fields ORDER BY ntid, ord')
        fld_map = {}
        for r in cur.fetchall():
            fld_map.setdefault(r['ntid'], []).append((r['ord'], r['name']))
        for ntid, pairs in fld_map.items():
            pairs.sort()
            nt[ntid] = (nt_names.get(ntid, '?'), [n for _, n in pairs])
    except sqlite3.OperationalError:
        # Legacy schema: notes table has flds blob + col.models
        return read_legacy(conn)

    notes = []
    # Modern notes table: columns include ntid (notetype id) and flds.
    cur.execute('SELECT ntid, flds, tags FROM notes')
    for r in cur.fetchall():
        ntid = r['ntid']
        name, fnames = nt.get(ntid, ('?', []))
        values = (r['flds'] or '').split('\x1f')
        fields = {fnames[i] if i < len(fnames) else ('field%d' % i): values[i]
                  for i in range(len(values))}
        tags = (r['tags'] or '').strip()
        notes.append({'model_name': name, 'fields': fields, 'tags': tags})
    conn.close()
    return notes


def read_legacy(conn):
    cur = conn.cursor()
    cur.execute('SELECT models FROM col')
    models = json.loads(cur.fetchone()[0] or '{}')
    notes = []
    fnames_cache = {}
    cur.execute('SELECT mid, flds, tags FROM notes')
    for mid, flds, tags in cur.fetchall():
        m = models.get(str(mid)) or models.get(mid) or {}
        fnames = fnames_cache.get(mid)
        if fnames is None:
            fnames = [f['name'] for f in m.get('flds', [])]
            fnames_cache[mid] = fnames
        values = (flds or '').split('\x1f')
        fields = {fnames[i] if i < len(fnames) else ('field%d' % i): values[i]
                  for i in range(len(values))}
        notes.append({'model_name': m.get('name'), 'fields': fields,
                      'tags': (tags or '').strip()})
    return notes


def main():
    work_dir = sys.argv[1] if len(sys.argv) > 1 else '.'
    db_path = decompress_db(work_dir)
    if not db_path:
        print('No database found in ' + work_dir, file=sys.stderr)
        sys.exit(1)
    notes = read_notes(db_path)
    # Filter out Anki's placeholder upgrade notice.
    notes = [n for n in notes
             if not next(iter(n['fields'].values()), '').startswith('Please update')]
    print('total real notes: %d' % len(notes), file=sys.stderr)
    json.dump(notes, sys.stdout, ensure_ascii=False, indent=2)


if __name__ == '__main__':
    main()
