import fitz
import re
import json

def extract_lc_answers(pdf_path):
    """Extract LC answers (1-100) for all 10 tests.
    
    PDF structure:
    - Page 1: "TEST 01"-"TEST 10" labels (ignored)
    - First answer block (no marker) = Test 1
    - "기출 TEST 1" starts Test 2
    - "기출 TEST 2" starts Test 3
    - ...
    - "기출 TEST 9" starts Test 10
    """
    doc = fitz.open(pdf_path)
    full_text = ""
    for page in doc:
        full_text += page.get_text("text") + "\n"
    
    tests = {i: {} for i in range(1, 11)}
    current_test = 1  # Start with Test 1 for the first block
    
    # Pattern for "기출 TEST X" (offset by 1: "기출 TEST 1" = Test 2)
    gichul_pattern = re.compile(r'기출\s*TEST\s+(\d+)')
    # Pattern for single answer
    ans_pattern = re.compile(r'^\s*(\d{1,3})\s+\(([A-D])\)')
    # Pattern for two answers on same line
    two_ans_pattern = re.compile(r'^\s*(\d{1,3})\s+\(([A-D])\)\s+(\d{1,3})\s+\(([A-D])\)')
    
    for line in full_text.split('\n'):
        line = line.strip()
        if not line:
            continue
        
        # Skip page 1 labels
        if re.match(r'^TEST\s+0?\d$', line):
            continue
        
        # Check for "동영상 강의" separator
        if '동영상' in line:
            continue
        
        # Check for "기출 TEST X" marker
        gichul_match = gichul_pattern.search(line)
        if gichul_match:
            marker_num = int(gichul_match.group(1))
            current_test = marker_num + 1  # Offset: "기출 TEST 1" = Test 2
            continue
        
        # Parse answer
        two_match = two_ans_pattern.match(line)
        if two_match:
            q1 = int(two_match.group(1))
            val1 = ord(two_match.group(2)) - ord('A')
            q2 = int(two_match.group(3))
            val2 = ord(two_match.group(4)) - ord('A')
            tests[current_test][q1] = val1
            tests[current_test][q2] = val2
            continue
        
        ans_match = ans_pattern.match(line)
        if ans_match:
            q_num = int(ans_match.group(1))
            letter = ans_match.group(2)
            val = ord(letter) - ord('A')
            tests[current_test][q_num] = val
    
    return tests

def extract_rc_answers(pdf_path):
    """Extract RC answers (101-200) for all 10 tests.
    
    PDF structure (same offset as LC):
    - Page 1: "TEST 01"-"TEST 10" labels (ignored)
    - First answer block (no marker) = Test 1
    - "기출 TEST 1" (on separate lines) starts Test 2
    - "기출 TEST 2" starts Test 3
    - ...
    - "기출 TEST 9" starts Test 10
    """
    doc = fitz.open(pdf_path)
    full_text = ""
    for page in doc:
        full_text += page.get_text("text") + "\n"
    
    tests = {i: {} for i in range(1, 11)}
    current_test = 1  # Start with Test 1
    
    lines = full_text.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        if not line:
            i += 1
            continue
        
        # Skip page 1 labels
        if re.match(r'^TEST\s+0?\d$', line):
            i += 1
            continue
        
        # Check for "동영상 강의" separator
        if '동영상' in line:
            i += 1
            continue
        
        # Check for "기출" followed by "TEST X" on next non-empty line
        if line == '기출':
            # Look for "TEST X" on the next non-empty line
            j = i + 1
            while j < len(lines) and not lines[j].strip():
                j += 1
            if j < len(lines):
                test_line = lines[j].strip()
                test_match = re.match(r'^TEST\s+(\d+)$', test_line)
                if test_match:
                    marker_num = int(test_match.group(1))
                    current_test = marker_num + 1  # Offset
                    i = j + 1
                    continue
        
        # RC format: number on one line, then space, then (X) on next line
        num_match = re.match(r'^(\d{3})$', line)
        if num_match and current_test:
            q_num = int(num_match.group(1))
            # Skip next line (space), look at the one after
            if i + 2 < len(lines):
                answer_line = lines[i + 2].strip()
                letter_match = re.match(r'^\(([A-D])\)$', answer_line)
                if letter_match:
                    letter = letter_match.group(1)
                    val = ord(letter) - ord('A')
                    tests[current_test][q_num] = val
                    i += 3
                    continue
        
        i += 1
    
    return tests

def main():
    lc_path = '/mnt/c/Users/Administrator/Downloads/Toeic/ĐÁP ÁN + TRANSCRIPT/ĐÁP ÁN ETS 2024 LC.pdf'
    rc_path = '/mnt/c/Users/Administrator/Downloads/Toeic/ĐÁP ÁN + TRANSCRIPT/ĐÁP ÁN ETS 2024 RC.pdf'
    
    print("Extracting LC answers...")
    lc_data = extract_lc_answers(lc_path)
    print(f"LC: Found answers for tests: {sorted(lc_data.keys())}")
    for t in sorted(lc_data.keys()):
        print(f"  Test {t}: {len(lc_data[t])} answers")
    
    print("\nExtracting RC answers...")
    rc_data = extract_rc_answers(rc_path)
    print(f"RC: Found answers for tests: {sorted(rc_data.keys())}")
    for t in sorted(rc_data.keys()):
        print(f"  Test {t}: {len(rc_data[t])} answers")
    
    # Generate TypeScript file
    output_file = 'src/data/toeic2024Pdf.ts'
    
    ts_content = "import type { PdfExam } from '../types';\n\n"
    ts_content += "export const TOEIC_2024_PDF_EXAMS: PdfExam[] = [\n"
    
    for i in range(1, 11):
        lc_answers = lc_data.get(i, {})
        rc_answers = rc_data.get(i, {})
        
        combined_answers = []
        for q in range(1, 201):
            if q <= 100:
                ans = lc_answers.get(q, 0)
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
    
    print(f"\nSuccessfully generated {output_file}")
    
    # Verify
    print("\nVerification - first 5 answers of each test:")
    for i in range(1, 11):
        lc = lc_data.get(i, {})
        rc = rc_data.get(i, {})
        print(f"Test {i}: LC[1-5]={[lc.get(q, '?') for q in range(1,6)]} RC[101-105]={[rc.get(q, '?') for q in range(101,106)]}")

if __name__ == "__main__":
    main()
