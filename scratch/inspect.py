import json
d=json.load(open('/home/adminstrator/code/test/language-app/src/data/n2/grammar.json'))
targets = ['ng-004','ng-008','ng-009','ng-010','ng-011','ng-013','ng-059','ng-072','ng-075','ng-096','ng-098','ng-099','ng-110']
for g in d:
    if g['id'] in targets:
        print(f"=== {g['id']} ===")
        print(f"  meaning: {g.get('meaning','')}")
        print(f"  exampleTranslation: {g.get('exampleTranslation','')}")
        print()
