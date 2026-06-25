import fitz
import sys

def dump_text(pdf_path):
    print(f"=== Reading {pdf_path} ===")
    try:
        doc = fitz.open(pdf_path)
        for i in range(min(5, len(doc))):
            print(f"--- Page {i + 1} ---")
            text = doc.load_page(i).get_text("text")
            print(text[:500]) # only print first 500 chars to avoid spam
    except Exception as e:
        print("Error:", e)

dump_text('/mnt/c/Users/Administrator/Downloads/Toeic/ĐÁP ÁN + TRANSCRIPT/Script - ETS 2024 LC.pdf')
