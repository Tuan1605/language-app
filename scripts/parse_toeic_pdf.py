import fitz  # PyMuPDF
import json
import sys
import re

def extract_text_from_pdf(pdf_path):
    print(f"Extracting text from {pdf_path}...")
    doc = fitz.open(pdf_path)
    full_text = []
    
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text = page.get_text("text")
        full_text.append(text)
        
    return full_text

def basic_parse(pages):
    questions = []
    current_q = None
    
    # Very basic regex for finding question numbers (e.g., "101. " or "1. ")
    q_pattern = re.compile(r'^(\d{1,3})\.\s+(.*)')
    opt_pattern = re.compile(r'^\([A-D]\)\s+(.*)')
    
    for page_text in pages:
        lines = page_text.split('\n')
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            q_match = q_pattern.match(line)
            if q_match:
                if current_q:
                    questions.append(current_q)
                current_q = {
                    "id": f"q-{q_match.group(1)}",
                    "text": q_match.group(2),
                    "options": [],
                    "correctAnswer": 0,
                    "explanation": ""
                }
                continue
            
            if current_q:
                opt_match = opt_pattern.match(line)
                if opt_match:
                    current_q["options"].append(line)
                else:
                    if len(current_q["options"]) == 0:
                        current_q["text"] += " " + line
                        
    if current_q:
        questions.append(current_q)
        
    return questions

def main():
    if len(sys.argv) < 3:
        print("Usage: python parse_toeic_pdf.py <input.pdf> <output.json>")
        sys.exit(1)
        
    input_pdf = sys.argv[1]
    output_json = sys.argv[2]
    
    try:
        pages = extract_text_from_pdf(input_pdf)
        questions = basic_parse(pages)
        
        with open(output_json, 'w', encoding='utf-8') as f:
            json.dump(questions, f, ensure_ascii=False, indent=2)
            
        print(f"Successfully extracted {len(questions)} potential questions to {output_json}")
        print("Note: This is a basic extraction. Manual review and formatting of the JSON is required.")
    except Exception as e:
        print(f"Error processing PDF: {e}")

if __name__ == "__main__":
    main()
