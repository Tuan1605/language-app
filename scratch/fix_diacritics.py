import json

with open('/home/adminstrator/code/test/language-app/src/data/n2/grammar.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

fixes = {
    'ng-004': {
        'exampleTranslation': 'Phong tục khác nhau tùy theo vùng miền.'
    },
    'ng-008': {
        'exampleTranslation': 'Nếu chưa xác nhận thì không thể trả lời.'
    },
    'ng-009': {
        'exampleTranslation': 'Chỉ vì chểnh mảng nên đã gây ra tai nạn.'
    },
    'ng-010': {
        'meaning': 'Cùng với～, đồng thời～',
        'exampleTranslation': 'Cuộc sống thay đổi cùng với sự tiến bộ của công nghệ.'
    },
    'ng-011': {
        'meaning': 'Một mặt thì～, mặt khác thì～ (hai mặt trái ngược)',
    },
    'ng-013': {
        'exampleTranslation': 'Chỉ cần có tiền thì có thể mua bất cứ thứ gì.'
    },
    'ng-059': {
        'meaning': 'Không phân biệt～; bất kể～',
        'exampleTranslation': 'Không phân biệt ngày đêm, công trình vẫn tiến hành.'
    },
    'ng-072': {
        'exampleTranslation': 'Đáp ứng tiếng nói người tiêu dùng nên đã cải tiến sản phẩm.'
    },
    'ng-075': {
        'exampleTranslation': 'Tiến hành công trình theo kế hoạch.'
    },
    'ng-096': {
        'exampleTranslation': 'Không cần phải vay tiền để đi du lịch.'
    },
    'ng-098': {
        'meaning': '～là có nghĩa là～',
        'exampleTranslation': 'N2 có nghĩa là cấp 2 của kỳ thi năng lực tiếng Nhật.'
    },
    'ng-099': {
        'meaning': 'Khi nói đến～;～đó nhé',
        'exampleTranslation': 'Khi nói đến món ăn Nhật Bản thì sushi là nổi tiếng.'
    },
    'ng-110': {
        'meaning': 'Mà nói～ thì; thực ra là～',
        'exampleTranslation': 'Thực ra muốn đi nhưng không có tiền.'
    }
}

for entry in data:
    if entry['id'] in fixes:
        for key, value in fixes[entry['id']].items():
            entry[key] = value
        print(f"Fixed {entry['id']}")

with open('/home/adminstrator/code/test/language-app/src/data/n2/grammar.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Done! All diacritics fixed.")
