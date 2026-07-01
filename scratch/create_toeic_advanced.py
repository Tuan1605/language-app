import json

questions = []
q_id = 701 # Start ID for advanced TOEIC questions

# TOEIC Part 7: Double Passages
double_passage_text = """
[Email 1]
To: All Employees
From: Human Resources
Date: May 12
Subject: Annual Health Check-up

This is a reminder that the annual company health check-up will take place next Wednesday, May 20, in the first-floor conference room from 9:00 AM to 3:00 PM. Please review the attached schedule to find your designated time slot. If you have a scheduling conflict, contact HR by May 15.

Attachment: checkup_schedule.pdf

---

[Email 2]
To: Human Resources
From: Sarah Jenkins
Date: May 14
Subject: Re: Annual Health Check-up

I am scheduled for my health check-up at 10:30 AM on May 20. However, I have an important client meeting from 10:00 AM to 11:30 AM that I cannot reschedule. Is it possible for me to come in the afternoon instead? I am free any time after 1:00 PM.
"""

questions.extend([
    {
        "id": f"tq-adv-{q_id}",
        "type": "reading-comprehension",
        "category": "toeic",
        "subCategory": "Đọc hiểu đoạn kép (Part 7)",
        "passage": double_passage_text,
        "question": "What is the purpose of the first email?",
        "options": [
            "To announce a new health insurance policy",
            "To remind employees about an upcoming event",
            "To request a meeting with the HR department",
            "To provide the results of a medical exam"
        ],
        "correctAnswer": 1,
        "explanation": "The first email states 'This is a reminder that the annual company health check-up will take place...'"
    },
    {
        "id": f"tq-adv-{q_id+1}",
        "type": "reading-comprehension",
        "category": "toeic",
        "subCategory": "Đọc hiểu đoạn kép (Part 7)",
        "passage": double_passage_text,
        "question": "What does Sarah Jenkins want to do?",
        "options": [
            "Cancel her health check-up entirely",
            "Change the time of her appointment",
            "Reschedule her client meeting",
            "Meet with the HR manager at 1:00 PM"
        ],
        "correctAnswer": 1,
        "explanation": "Sarah writes 'Is it possible for me to come in the afternoon instead?' indicating she wants to change her appointment time."
    },
    {
        "id": f"tq-adv-{q_id+2}",
        "type": "reading-comprehension",
        "category": "toeic",
        "subCategory": "Đọc hiểu đoạn kép (Part 7)",
        "passage": double_passage_text,
        "question": "Did Sarah Jenkins contact HR before the deadline mentioned in the first email?",
        "options": [
            "Yes, because she sent her email on May 14.",
            "Yes, because her meeting is on May 20.",
            "No, because the deadline was May 12.",
            "No, because she needs an afternoon slot."
        ],
        "correctAnswer": 0,
        "explanation": "The first email says to contact HR by May 15. Sarah sent her email on May 14, so she met the deadline."
    }
])
q_id += 3


# TOEIC Part 3: Graphic Questions
graphic_listening_text = """
[Audio Transcript - For TTS System]
Man: Hi, I'm looking for the departure gate for flight QZ442 to London. My ticket says Gate 15, but there's no one there.
Woman: Let me check the system for you. Ah, I see. There was a gate change announced 10 minutes ago. Flight QZ442 has been moved due to a maintenance issue at Gate 15.
Man: Oh, I see. Where do I need to go now?
Woman: Please look at the departures board over there. It will show you the updated gate number. It's in Terminal B.

[Graphic on Screen]
DEPARTURES
Destination | Flight | Time  | Gate
Paris       | AF102  | 10:00 | 12
Tokyo       | JL305  | 10:30 | 14
London      | QZ442  | 11:00 | 22
New York    | UA998  | 11:15 | 18
"""

questions.extend([
    {
        "id": f"tq-adv-{q_id}",
        "type": "multiple-choice",
        "category": "toeic",
        "subCategory": "Nghe hiểu có hình ảnh (Part 3)",
        "passage": graphic_listening_text,
        "question": "Look at the graphic. Which gate does the man need to go to?",
        "options": ["Gate 12", "Gate 14", "Gate 15", "Gate 22"],
        "correctAnswer": 3,
        "explanation": "The man is looking for flight QZ442 to London. The graphic shows that flight QZ442 departs from Gate 22."
    },
    {
        "id": f"tq-adv-{q_id+1}",
        "type": "multiple-choice",
        "category": "toeic",
        "subCategory": "Nghe hiểu có hình ảnh (Part 3)",
        "passage": graphic_listening_text,
        "question": "Why was the gate changed?",
        "options": [
            "Because the flight was delayed",
            "Because of a maintenance issue",
            "Because the plane was too large",
            "Because of bad weather"
        ],
        "correctAnswer": 1,
        "explanation": "The woman says the flight was moved 'due to a maintenance issue at Gate 15'."
    }
])

with open('/home/adminstrator/code/test/language-app/src/data/toeic/questions-advanced.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"Created toeic/questions-advanced.json with {len(questions)} advanced TOEIC questions.")
