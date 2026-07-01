import json

questions = []
q_id = 701 # Start ID for advanced N2 questions

# N2 Mondai 9 (Ngữ pháp đục lỗ)
passage_m9 = """
以下は、ある雑誌の記事である。

　最近、「タイムパフォーマンス（タイパ）」という言葉をよく耳にするようになった。映画を早送りで見たり、要約動画だけを見て済ませたりする若者が増えているという。限られた時間を有効に使いたいという気持ちは理解できる。（　1　）、効率だけを追い求める姿勢には疑問を感じざるを得ない。
　映画や小説には、物語が展開していく「間」や「無駄」と思われる部分にこそ、作者のメッセージが込められていることが多い。それらを飛ばして結論だけを知ることは、果たして本当に「作品を味わった」と（　2　）。
　もちろん、情報収集を目的とするならばタイパを重視するのも一つの手だ。しかし、芸術や娯楽においては、時間をかけてゆっくりと向き合うことで（　3　）得られる感動があるはずだ。
"""

questions.extend([
    {
        "id": f"nq-adv-{q_id}",
        "type": "grammar",
        "category": "n2",
        "subCategory": "Ngữ pháp đục lỗ (Mondai 9)",
        "passage": passage_m9,
        "question": "（　1　）に入る最もよいものはどれか。",
        "options": ["だが", "なぜなら", "つまり", "さらに"],
        "correctAnswer": 0,
        "explanation": "Câu trước thể hiện sự thấu hiểu (hiểu được cảm giác muốn dùng thời gian hiệu quả). Câu sau thể hiện sự phản đối (không khỏi cảm thấy nghi ngờ thái độ chỉ chạy theo hiệu quả). Do đó cần liên từ trái nghĩa 'だが' (tuy nhiên)."
    },
    {
        "id": f"nq-adv-{q_id+1}",
        "type": "grammar",
        "category": "n2",
        "subCategory": "Ngữ pháp đục lỗ (Mondai 9)",
        "passage": passage_m9,
        "question": "（　2　）に入る最もよいものはどれか。",
        "options": ["言えるだろう", "言えるのだろうか", "言えないだろう", "言えないわけがない"],
        "correctAnswer": 1,
        "explanation": "Tác giả đang đặt câu hỏi tu từ: 'Liệu có thể nói là thực sự đã thưởng thức tác phẩm hay không?'. Đuôi câu hỏi tu từ mang sắc thái hoài nghi là '～と言えるのだろうか'."
    },
    {
        "id": f"nq-adv-{q_id+2}",
        "type": "grammar",
        "category": "n2",
        "subCategory": "Ngữ pháp đục lỗ (Mondai 9)",
        "passage": passage_m9,
        "question": "（　3　）に入る最もよいものはどれか。",
        "options": ["はじめて", "ばかりに", "からこそ", "からして"],
        "correctAnswer": 0,
        "explanation": "Cấu trúc 'Vてはじめて' (chỉ sau khi làm V thì mới...). Ở đây là 'chỉ khi dành thời gian từ từ đối mặt thì mới có được sự cảm động'."
    }
])
q_id += 3

# N2 Mondai 13 (Đọc hiểu so sánh A & B)
passage_m13 = """
【A】
　現代社会において、失敗を避ける風潮が強まっている。学校教育でもビジネスでも、「正解」を最短距離で導き出すことが評価されるからだ。しかし、革新的なアイデアや本質的な成長は、失敗を経験し、そこから学ぶプロセスの中にこそ存在する。失敗を恐れて安全な道ばかり選んでいれば、現状維持はできても、それ以上の飛躍は望めないだろう。

【B】
　「失敗から学ぶ」という言葉は美しいが、ビジネスの現場ではそう簡単に言っていられない。一つの大きな失敗が企業の存続を危うくすることもあるからだ。もちろん挑戦は必要だが、それは綿密な計画とリスク管理に基づいた「計算されたリスク」を取るべきであり、無謀な失敗は単なる準備不足に過ぎない。失敗を美化するのではなく、いかに失敗を防ぐかという視点が不可欠である。
"""

questions.extend([
    {
        "id": f"nq-adv-{q_id}",
        "type": "reading-comprehension",
        "category": "n2",
        "subCategory": "Đọc hiểu so sánh (Mondai 13)",
        "passage": passage_m13,
        "question": "「失敗」について、AとBの筆者はどのように述べているか。",
        "options": [
            "AもBも、失敗は成長のために必要不可欠なものだと肯定している。",
            "AもBも、失敗は避けるべきものであり、リスク管理が重要だと主張している。",
            "Aは失敗を恐れず経験すべきだとし、Bは無謀な失敗を避けリスクを管理すべきだとしている。",
            "Aは失敗を避ける風潮を肯定し、Bは失敗から学ぶことの重要性を強調している。"
        ],
        "correctAnswer": 2,
        "explanation": "Tác giả A cho rằng sự trưởng thành nằm trong quá trình trải nghiệm thất bại và phê phán việc sợ thất bại. Tác giả B cho rằng thất bại là nguy hiểm cho doanh nghiệp, cần quản lý rủi ro và không được làm đẹp cho thất bại bừa bãi. Do đó đáp án 3 phản ánh chính xác lập trường của cả hai."
    },
    {
        "id": f"nq-adv-{q_id+1}",
        "type": "reading-comprehension",
        "category": "n2",
        "subCategory": "Đọc hiểu so sánh (Mondai 13)",
        "passage": passage_m13,
        "question": "AとBの筆者が共通して必要だと考えていることは何か。",
        "options": [
            "現状を維持すること",
            "新しいことに挑戦すること",
            "失敗を事前に完全に防ぐこと",
            "最短距離で正解を出すこと"
        ],
        "correctAnswer": 1,
        "explanation": "A nói rằng nếu chỉ chọn con đường an toàn thì không thể tiến xa (ủng hộ thử thách). B nói rằng 'もちろん挑戦は必要だが' (Tất nhiên thử thách là cần thiết, nhưng phải có tính toán). Vậy cả hai đều công nhận việc thử thách là cần thiết."
    }
])

with open('/home/adminstrator/code/test/language-app/src/data/n2/questions-advanced.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"Created n2/questions-advanced.json with {len(questions)} advanced N2 questions.")
