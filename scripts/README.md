# Dataset Conversion Scripts

Hướng dẫn chuyển đổi datasets TOEIC và JLPT vào app Lingomaster Ultimate.

## Cài đặt

```bash
# Cài tsx để chạy TypeScript scripts
npm install -g tsx
```

## Bước 1: Tải datasets

```bash
# Tải tất cả datasets từ GitHub
npx tsx scripts/download-datasets.ts
```

Hoặc tải thủ công:
- **TOEIC 600 Words**: https://github.com/tranngocminhhieu/toeic-600-words-dataset
- **JLPT Kanji**: https://github.com/davidluzgouveia/kanji-data
- **JLPT Grammar**: https://github.com/junyoung9394/jlpt-grammar-dataset
- **TOEIC Vocab (HF)**: https://huggingface.co/datasets/kknono668/toeic-vocab-tw

Đặt các file dataset vào thư mục `scripts/datasets/`.

## Bước 2: Chuyển đổi datasets

```bash
# Chuyển đổi TOEIC 600 Words
npx tsx scripts/convert-toeic-600.ts ./scripts/datasets/toeic-600-words.json

# Chuyển đổi JLPT Kanji
npx tsx scripts/convert-kanji-jlpt.ts ./scripts/datasets/kanji.json

# Chuyển đổi JLPT Grammar
npx tsx scripts/convert-grammar-jlpt.ts ./scripts/datasets/grammar.json

# Chuyển đổi TOEIC Vocabulary từ HuggingFace
npx tsx scripts/convert-toeic-vocab-hf.ts ./scripts/datasets/toeic-vocab-tw.json
```

## Bước 3: Merge vào app

```bash
# Merge tất cả dataset đã chuyển đổi vào app
npx tsx scripts/merge-all-datasets.ts
```

## Bước 4: Reset database (nếu cần)

Nếu app đã chạy trước đó, cần reset database:
1. Mở app trong browser
2. Vào Settings > Reset Data
3. Hoặc xóa localStorage trong DevTools

## Output Files

| Script | Output |
|--------|--------|
| `convert-toeic-600.ts` | `src/data/toeic/flashcards-toeic600.json` |
| `convert-kanji-jlpt.ts` | `src/data/n2/kanji-jlpt-levels.json` |
| `convert-grammar-jlpt.ts` | `src/data/n2/grammar-jlpt-extended.json` |
| `convert-toeic-vocab-hf.ts` | `src/data/toeic/flashcards-toeic-vocab-hf.json` |

## Định dạng output

### Flashcard
```json
{
  "id": "toeic600-1",
  "word": "negotiate",
  "definition": "đàm phán",
  "example": "...",
  "phonetic": "/nəˈɡoʊʃieɪt/",
  "topic": "TOEIC 600 Essential",
  "difficulty": "beginner"
}
```

### Kanji
```json
{
  "id": "kanji-jlpt-1",
  "kanji": "亜",
  "on_reading": "ア",
  "kun_reading": "つ.ぐ",
  "meaning": "Á, châu Á",
  "jlpt_level": "N2",
  "difficulty": "intermediate"
}
```

### Grammar
```json
{
  "id": "grammar-jlpt-1",
  "pattern": "～にもかかわらず",
  "meaning": "Mặc dù～",
  "example": "...",
  "difficulty": "advanced"
}
```

## Troubleshooting

### File not found
- Đảm bảo đã clone/download datasets vào `scripts/datasets/`
- Kiểm tra tên file trong script có đúng không

### Duplicate data
- Scripts tự động bỏ qua duplicates dựa trên word/kanji/pattern
- Có thể xóa file output và chạy lại

### App không load data mới
- Reset database trong app
- Hoặc xóa file `src/data/db.ts` IndexedDB trong DevTools
