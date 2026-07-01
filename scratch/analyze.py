import json
from collections import defaultdict

d=json.load(open('/home/adminstrator/code/test/language-app/src/data/toeic/questions.json'))
last_ids = defaultdict(list)
for q in d:
    last_ids[q.get('subCategory','')].append(q['id'])
for k in sorted(last_ids.keys()):
    ids = last_ids[k]
    print(f'{k}: first={ids[0]}, last={ids[-1]}, count={len(ids)}')

print()
d2=json.load(open('/home/adminstrator/code/test/language-app/src/data/n2/questions.json'))
last_ids2 = defaultdict(list)
for q in d2:
    last_ids2[q.get('subCategory','')].append(q['id'])
for k in sorted(last_ids2.keys()):
    ids = last_ids2[k]
    print(f'{k}: first={ids[0]}, last={ids[-1]}, count={len(ids)}')

print()
d3=json.load(open('/home/adminstrator/code/test/language-app/src/data/n2/questions-supplement.json'))
last_ids3 = defaultdict(list)
for q in d3:
    last_ids3[q.get('subCategory','')].append(q['id'])
for k in sorted(last_ids3.keys()):
    ids = last_ids3[k]
    print(f'{k}: first={ids[0]}, last={ids[-1]}, count={len(ids)}')

print()
d4=json.load(open('/home/adminstrator/code/test/language-app/src/data/n2/flashcards.json'))
print(f'N2 flashcard last ID: {d4[-1]["id"]}')
d5=json.load(open('/home/adminstrator/code/test/language-app/src/data/toeic/flashcards.json'))
print(f'TOEIC flashcard last ID: {d5[-1]["id"]}')
d6=json.load(open('/home/adminstrator/code/test/language-app/src/data/n2/grammar.json'))
print(f'N2 grammar last ID: {d6[-1]["id"]}')
d7=json.load(open('/home/adminstrator/code/test/language-app/src/data/toeic/grammar.json'))
print(f'TOEIC grammar last ID: {d7[-1]["id"]}')
