import fitz
import sys

def dump_text(pdf_path):
    print(f"=== Reading {pdf_path} ===")
    doc = fitz.open(pdf_path)
    for i in range(min(3, len(doc))):
        print(f"--- Page {i + 1} ---")
        text = doc.load_page(i).get_text("text")
        print(text)

dump_text('/mnt/c/Users/Administrator/Downloads/Toeic/ĐÁP ÁN + TRANSCRIPT/ĐÁP ÁN ETS 2024 LC.pdf')
dump_text('/mnt/c/Users/Administrator/Downloads/Toeic/ĐÁP ÁN + TRANSCRIPT/ĐÁP ÁN ETS 2024 RC.pdf')
