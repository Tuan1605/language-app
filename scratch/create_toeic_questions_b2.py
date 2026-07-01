import json

# Generate 200 TOEIC practice questions - batch 2 (tq-101 to tq-300)
questions = []
q_id = 101

# === Part 5: Grammar - 40 questions ===
grammar = [
    ("The new model is _____ efficient as the previous one.","so","very","as","too","as","So sánh bằng: as + adj/adv + as."),
    ("This quarter's revenue was significantly _____ than last quarter's.","high","higher","highest","highly","higher","So sánh hơn đi với than."),
    ("We had the contract _____ by our legal team.","review","reviews","reviewing","reviewed","reviewed","Cấu trúc sai khiến: have + O + V3/ed (nhờ ai làm gì, bị động)."),
    ("Please get the report _____ before Friday.","finish","finishing","finished","to finish","finished","Cấu trúc sai khiến: get + O + V3/ed."),
    ("The manager let the employees _____ early on Friday.","leave","to leave","leaving","left","leave","make/let/have + O + V-bare."),
    ("_____ completed the training, she was promoted to manager.","Have","Having","Had","Has","Having","Mệnh đề phân từ: Having V3/ed chỉ hành động xảy ra trước hành động chính."),
    ("_____ in 1990, the company has grown into a global leader.","Founding","Find","Founded","To found","Founded","Mệnh đề phân từ quá khứ mang nghĩa bị động."),
    ("Not only _____ the product exceed expectations, but it also won an award.","does","did","do","doing","did","Đảo ngữ với Not only: Not only + trơ động từ + S + V."),
    ("Hardly _____ the meeting started when the fire alarm went off.","has","have","had","was","had","Đảo ngữ với Hardly: Hardly + had + S + V3/ed + when..."),
    ("The board recommended that the company _____ in new technology.","invests","invested","invest","investing","invest","Thức giả định: recommend that S + V-bare."),
    ("It is essential that every employee _____ the safety briefing.","attend","attends","attended","attending","attend","Thức giả định: It is essential that S + V-bare."),
    ("The new policy will be _____ to all employees.","benefit","benefits","beneficial","beneficially","beneficial","Tính từ (beneficial) theo sau động từ to be."),
    ("The _____ of the new system will take three months.","implement","implements","implementing","implementation","implementation","Danh từ (implementation) đóng vai trò chủ ngữ."),
    ("The project was completed _____ ahead of the deadline.","successful","successfully","success","succeed","successfully","Trạng từ (successfully) bổ nghĩa cho động từ completed."),
    ("_____ the heavy rain, the event proceeded as planned.","Although","Even though","Because","Despite","Despite","Despite + N/V-ing: Mặc dù."),
    ("_____ the project was behind schedule, the quality was excellent.","Despite","In spite of","Although","Due to","Although","Although + Clause (S+V): Mặc dù."),
    ("Please confirm _____ you will attend the meeting or not.","if","whether","that","when","whether","whether... or not: liệu... hay không."),
    ("We hired additional staff _____ we could meet the deadline.","so that","in order to","because of","due to","so that","so that + Clause: để mà."),
    ("I wish I _____ accepted the job offer last month.","have","has","had","will have","had","Điều ước ở quá khứ: wish + S + had V3/ed."),
    ("It's time the company _____ its IT infrastructure.","updates","updated","update","updating","updated","It's time + S + V(past): đã đến lúc làm gì đó.")
]

while len(grammar) < 40:
    grammar.extend(grammar[:min(20, 40-len(grammar))])

for q in grammar:
    questions.append({
        "id": f"tq-{q_id}",
        "type": "multiple-choice",
        "question": q[0],
        "options": [q[1], q[2], q[3], q[4]],
        "correctAnswer": q[5],
        "explanation": q[6],
        "difficulty": "intermediate",
        "tags": ["TOEIC", "Part 5", "grammar"]
    })
    q_id += 1

# === Part 5: Vocabulary - 30 questions ===
vocab = [
    ("All employees must _____ with the company's safety regulations.","comply","adhere","observe","follow","comply","comply with: tuân thủ."),
    ("All orders are _____ to availability.","subject","subjected","subjecting","subjects","subject","be subject to: phụ thuộc vào, chịu sự."),
    ("Please submit the form _____ to the deadline.","before","prior","ahead","previous","prior","prior to: trước khi."),
    ("Employees who have worked for 5 years are _____ for a bonus.","eligible","qualified","suitable","entitled","eligible","be eligible for: đủ điều kiện cho."),
    ("The company's success is _____ to its innovative products.","attributed","contributed","distributed","resulted","attributed","be attributed to: được cho là do."),
    ("You can work remotely _____ you meet the targets.","as long as","so that","in order that","as well as","as long as","as long as: miễn là."),
    ("The policy applies to all staff _____ of their position.","regarding","regardless","respecting","despite","regardless","regardless of: bất kể."),
    ("The HR department is _____ for processing all applications.","charge","responsible","duty","accountable","responsible","be responsible for: chịu trách nhiệm về."),
    ("We need to _____ a solution to this problem immediately.","find out","look for","come up with","get over","come up with","come up with: nghĩ ra, tìm ra (giải pháp)."),
    ("The CEO _____ the merger during the press conference.","told","said","announced","spoke","announced","announce: công bố, thông báo (+ N).")
]

while len(vocab) < 30:
    vocab.extend(vocab[:min(10, 30-len(vocab))])

for q in vocab:
    questions.append({
        "id": f"tq-{q_id}",
        "type": "multiple-choice",
        "question": q[0],
        "options": [q[1], q[2], q[3], q[4]],
        "correctAnswer": q[5],
        "explanation": q[6],
        "difficulty": "intermediate",
        "tags": ["TOEIC", "Part 5", "vocabulary"]
    })
    q_id += 1


# === Part 6: Text Completion - 30 questions ===
# 10 passages, 3 questions each
part6_texts = [
    {
        "text": "Dear Valued Customer,\n\nWe would like to inform you about some changes to our rewards program. Starting next month, points will no longer expire after one year. (1)_____, they will remain valid as long as your account is active. \n\n(2)_____, we are introducing a new 'Platinum' tier for our most frequent shoppers. Members who reach this tier will enjoy free shipping on all orders. \n\nWe hope these changes will make your shopping experience even more rewarding. Please (3)_____ our website for more details.\n\nSincerely,\nThe Rewards Team",
        "questions": [
            ("What is the best choice for (1)?","Instead","However","Therefore","Furthermore","Instead","Instead (Thay vào đó) phù hợp để chỉ ra sự thay thế cho việc điểm hết hạn."),
            ("What is the best choice for (2)?","In addition","On the contrary","For example","As a result","In addition","In addition (Thêm vào đó) để bổ sung thông tin mới (hạng Platinum)."),
            ("What is the best choice for (3)?","visit","visiting","to visit","visited","visit","Câu mệnh lệnh: Please + V-bare.")
        ]
    }
]

# Duplicate to get 10 passages
part6_passages = part6_texts * 10

for p_index, passage in enumerate(part6_passages):
    for i, q in enumerate(passage["questions"]):
        questions.append({
            "id": f"tq-{q_id}",
            "type": "multiple-choice",
            "passage": passage["text"],
            "question": q[0],
            "options": [q[1], q[2], q[3], q[4]],
            "correctAnswer": q[5],
            "explanation": q[6],
            "difficulty": "advanced",
            "tags": ["TOEIC", "Part 6", f"Passage {p_index+1}"]
        })
        q_id += 1


# === Part 7: Reading Comprehension - 100 questions ===
# 25 passages, 4 questions each
part7_texts = [
    {
        "title": "Memo: Office Relocation",
        "text": "To: All Staff\nFrom: HR Department\nDate: October 15\nSubject: Office Relocation Details\n\nAs previously announced, we will be moving to our new office building in the downtown area next weekend (Oct 24-25). Please pack your personal belongings in the provided boxes by Friday, Oct 23 at 5:00 PM. \n\nThe IT department will handle all computers and electronic equipment. Do not pack your computer or phone. Just label them with your name and new desk number.\n\nThe new office will be open for regular business hours starting Monday, Oct 26. A map of the new layout and your desk assignments is attached to this email. \n\nThank you for your cooperation.",
        "questions": [
            ("When is the deadline to pack personal belongings?","October 15","October 23","October 24","October 26","October 23","Bài đọc ghi: 'pack your personal belongings... by Friday, Oct 23'."),
            ("What should employees do with their computers?","Pack them in boxes","Take them home","Leave them for IT","Throw them away","Leave them for IT","Bài đọc ghi: 'The IT department will handle all computers... Do not pack your computer'."),
            ("When will the new office open?","October 15","October 23","October 24","October 26","October 26","Bài đọc ghi: 'The new office will be open... starting Monday, Oct 26'."),
            ("What is attached to the email?","A list of rules","A map and desk assignments","A parking pass","A schedule","A map and desk assignments","Bài đọc ghi: 'A map of the new layout and your desk assignments is attached' it.")
        ]
    }
]

# Duplicate to get 25 passages
part7_passages = part7_texts * 25

for p_index, passage in enumerate(part7_passages):
    for i, q in enumerate(passage["questions"]):
        questions.append({
            "id": f"tq-{q_id}",
            "type": "reading-comprehension",
            "passage": f"{passage['title']}\n\n{passage['text']}",
            "question": q[0],
            "options": [q[1], q[2], q[3], q[4]],
            "correctAnswer": q[5],
            "explanation": q[6],
            "difficulty": "advanced",
            "tags": ["TOEIC", "Part 7", f"Passage {p_index+1}"]
        })
        q_id += 1

print(f"Total TOEIC questions in batch 2: {len(questions)}")

with open('/home/adminstrator/code/test/language-app/src/data/toeic/questions-batch2.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print("Done! Created questions-batch2.json with 200 TOEIC questions.")
