import fitz
import re

def extract_answers(pdf_path, is_rc):
    print(f"Reading {pdf_path}")
    doc = fitz.open(pdf_path)
    full_text = ""
    for page in doc:
        full_text += page.get_text("text") + "\n"
        
    tests_data = {}
    current_test = None
    
    # Split text by lines
    lines = full_text.split('\n')
    
    test_pattern = re.compile(r'TEST\s+(\d+)')
    ans_pattern = re.compile(r'\(([A-D])\)')
    num_pattern = re.compile(r'^(\d{1,3})$')
    
    current_num = None
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        test_match = test_pattern.search(line)
        if test_match and len(line) < 15:
            current_test = int(test_match.group(1))
            if current_test not in tests_data:
                tests_data[current_test] = {}
            continue
            
        if current_test:
            num_match = num_pattern.match(line)
            if num_match:
                current_num = int(num_match.group(1))
                continue
                
            ans_match = ans_pattern.search(line)
            if ans_match and current_num:
                letter = ans_match.group(1)
                val = ord(letter) - ord('A')
                tests_data[current_test][current_num] = val
                current_num = None

    return tests_data

def main():
    lc_path = '/mnt/c/Users/Administrator/Downloads/Toeic/ĐÁP ÁN + TRANSCRIPT/ĐÁP ÁN ETS 2024 LC.pdf'
    rc_path = '/mnt/c/Users/Administrator/Downloads/Toeic/ĐÁP ÁN + TRANSCRIPT/ĐÁP ÁN ETS 2024 RC.pdf'
    
    lc_data = extract_answers(lc_path, False)
    rc_data = extract_answers(rc_path, True)
    
    output_file = '/mnt/c/Users/Administrator/code/test/language-app/src/data/toeic2024Pdf.ts'
    # Wait, wsl path for C drive is /mnt/c... but the project is at ~/code/test/language-app
    # Let's use relative or absolute to home
    output_file = 'src/data/toeic2024Pdf.ts'
    
    ts_content = "import type { PdfExam } from '../types';\n\n"
    ts_content += "export const TOEIC_2024_PDF_EXAMS: PdfExam[] = [\n"
    
    for i in range(1, 11):
        lc_answers = lc_data.get(i, {})
        rc_answers = rc_data.get(i, {})
        
        # Combine
        combined_answers = []
        for q in range(1, 201):
            if q <= 100:
                ans = lc_answers.get(q, 0) # default 0 if missing
            else:
                ans = rc_answers.get(q, 0)
            
            combined_answers.append(f"      {{ id: '{q}', correctAnswer: {ans} }}")
            
        answers_str = ",\n".join(combined_answers)
        
        ts_content += f"""  {{
    id: 'toeic-2024-pdf-{i}',
    title: 'TOEIC ETS 2024 - Test {i}',
    year: 2024,
    category: 'toeic',
    timeLimitMinutes: 120,
    pdfUrl_LC: '/pdfs/toeic_2024/TEST_{i}_LC.pdf',
    pdfUrl_RC: '/pdfs/toeic_2024/TEST_{i}_RC.pdf',
    scriptUrl_LC: '/pdfs/toeic_2024/scripts/Script_LC.pdf',
    scriptUrl_RC: '/pdfs/toeic_2024/scripts/Script_RC.pdf',
    audioUrl: '/audio/toeic_2024/Test_{i:02d}.mp3',
    answers: [
{answers_str}
    ]
  }},
"""
    ts_content += "];\n"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(ts_content)
        
    print(f"Successfully generated {output_file} with parsed answers!")

if __name__ == "__main__":
    main()
