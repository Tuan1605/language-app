import json

questions = []
q_id = 501 # Start ID to avoid conflicts

# N2 Reading Passages (Dokkai)
# 1. Short Passages (Mondai 10)
# 2. Medium Passages (Mondai 11)
# 3. Information Retrieval (Mondai 14)

dokkai_passages = [
    {
        "type": "reading-comprehension",
        "title": "Đoản văn 1: Về việc đọc sách",
        "text": "最近、若者の「活字離れ」が問題視されている。確かに、インターネットやスマートフォンの普及により、動画や短いテキストで情報を得る機会が増え、分厚い本を読む人は減ったのかもしれない。しかし、読書から得られるものは単なる情報だけではない。著者の深い思考のプロセスを辿り、自分自身の価値観と照らし合わせながら想像力を膨らませるという体験は、即物的な情報収集とは一線を画すものだ。だからこそ、どんなに便利なツールが登場しても、本を読むという行為の価値が失われることはないだろう。",
        "translation": "Gần đây, việc giới trẻ 'xa rời chữ in' (ít đọc sách) đang được xem là một vấn đề. Quả thực, do sự phổ biến của internet và điện thoại thông minh, cơ hội tiếp nhận thông tin qua video hoặc văn bản ngắn tăng lên, và có lẽ số người đọc những cuốn sách dày đã giảm đi. Tuy nhiên, những gì nhận được từ việc đọc sách không chỉ đơn thuần là thông tin. Trải nghiệm theo sát quá trình suy nghĩ sâu sắc của tác giả, đối chiếu với giá trị quan của bản thân và mở rộng trí tưởng tượng, là điều hoàn toàn khác biệt so với việc thu thập thông tin một cách thực dụng. Chính vì vậy, dù có xuất hiện những công cụ tiện lợi đến đâu, giá trị của hành động đọc sách có lẽ sẽ không bao giờ mất đi.",
        "questions": [
            {
                "question": "筆者が本を読む行為について最も言いたいことは何か。",
                "options": [
                    "スマートフォンよりも本の方が情報を早く集められる。",
                    "読書は想像力を養うため、他の手段では代用できない価値がある。",
                    "活字離れが進んでいるため、若者はもっと本を読むべきだ。",
                    "情報収集のためには、動画よりも分厚い本を読む方が良い。"
                ],
                "correctAnswer": 1,
                "explanation": "Tác giả nói rằng trải nghiệm mở rộng trí tưởng tượng khi đọc sách khác biệt hoàn toàn với thu thập thông tin (即物的な情報収集とは一線を画すものだ) và do đó giá trị của nó không bị mất đi. Đáp án 1 phản ánh đúng ý này: 'Đọc sách nuôi dưỡng trí tưởng tượng nên có giá trị không thể thay thế bằng phương tiện khác'."
            }
        ]
    },
    {
        "type": "reading-comprehension",
        "title": "Đoản văn 2: Lời xin lỗi trong công việc",
        "text": "仕事でミスをした時、すぐに謝ることはもちろん大切だ。しかし、ただ「すみませんでした」と頭を下げるだけでは不十分な場合もある。ミスによって相手にどのような迷惑をかけたのかを正確に把握し、その原因と今後の再発防止策をセットで伝えることが求められる。相手が本当に求めているのは、形式的な謝罪ではなく、「二度と同じミスを起こさない」という誠意と具体的な行動なのだ。",
        "translation": "Khi mắc lỗi trong công việc, việc xin lỗi ngay lập tức tất nhiên là rất quan trọng. Tuy nhiên, có những trường hợp chỉ cúi đầu nói 'Tôi xin lỗi' là không đủ. Bạn cần phải nắm bắt chính xác việc mình mắc lỗi đã gây rắc rối gì cho đối phương, đồng thời truyền đạt nguyên nhân cùng với biện pháp ngăn ngừa tái diễn. Điều đối phương thực sự mong muốn không phải là lời xin lỗi mang tính hình thức, mà là sự thành ý và hành động cụ thể cho thấy 'sẽ không bao giờ lặp lại lỗi đó lần thứ hai'.",
        "questions": [
            {
                "question": "仕事でミスをした際、相手が最も求めているものは何か。",
                "options": [
                    "ミスをした直後にすぐ謝りに来ること。",
                    "自分のミスがどれだけ大きかったかを反省すること。",
                    "同じミスを繰り返さないための具体的な対策と誠意。",
                    "迷惑をかけた相手に対して何度も頭を下げること。"
                ],
                "correctAnswer": 2,
                "explanation": "Câu cuối bài viết rõ: '相手が本当に求めているのは...「二度と同じミスを起こさない」という誠意と具体的な行動なのだ' (Điều đối phương thực sự muốn là thành ý và hành động cụ thể để không lặp lại lỗi). Đáp án 2 hoàn toàn trùng khớp với ý này."
            }
        ]
    },
    {
        "type": "reading-comprehension",
        "title": "Trung văn 1: Giao tiếp ở nơi làm việc",
        "text": "　職場におけるコミュニケーションの重要性は、いくら強調してもしすぎることはない。しかし、「コミュニケーションを取っている」という認識が、上司と部下でズレているケースは少なくない。\n　上司は「普段から部下に声をかけている」と思っていても、それが単なる業務の指示や確認にとどまっている場合、部下はコミュニケーションとは感じていないことが多い。部下が求めているのは、自分の意見に耳を傾けてもらえたり、業務以外の他愛もない会話を通じて人間関係を築いたりすることである。\n　一方で、上司の側からすれば、忙しい業務の中で一人ひとりの部下とじっくり話す時間を取るのは容易ではない。そのため、効率を重視するあまり、結果として「一方通行の指示」ばかりになってしまうのだ。\n　この認識のズレを埋めるためには、上司が意識的に「聞く時間」を作ることが必要だ。例えば、定期的な1対1の面談（1on1）を導入し、業務の進捗だけでなく、部下の悩みや将来の目標について話す機会を持つことが有効である。",
        "translation": "Tầm quan trọng của giao tiếp ở nơi làm việc dù có nhấn mạnh bao nhiêu cũng không thừa. Tuy nhiên, không hiếm trường hợp có sự lệch pha trong nhận thức về việc 'đang giao tiếp' giữa cấp trên và cấp dưới.\nCấp trên thường nghĩ rằng 'bình thường mình vẫn hay bắt chuyện với cấp dưới', nhưng nếu đó chỉ dừng lại ở việc chỉ thị hay xác nhận công việc, thì cấp dưới thường không cảm thấy đó là giao tiếp. Điều cấp dưới mong muốn là được lắng nghe ý kiến của mình, hoặc xây dựng mối quan hệ con người thông qua những cuộc nói chuyện phiếm ngoài công việc.\nMặt khác, từ góc độ của cấp trên, trong lúc công việc bận rộn, việc dành thời gian để nói chuyện thấu đáo với từng nhân viên không phải là điều dễ dàng. Do đó, vì quá coi trọng tính hiệu quả, kết quả là chỉ toàn đưa ra 'chỉ thị một chiều'.\nĐể lấp đầy khoảng trống nhận thức này, cấp trên cần phải có ý thức tạo ra 'thời gian lắng nghe'. Ví dụ, việc áp dụng các buổi nói chuyện 1-1 định kỳ (1on1), tạo cơ hội để nói không chỉ về tiến độ công việc mà còn về những trăn trở hay mục tiêu tương lai của cấp dưới là một phương pháp hiệu quả.",
        "questions": [
            {
                "question": "上司と部下のコミュニケーションに対する認識のズレとは、どのようなことか。",
                "options": [
                    "上司は雑談をしているつもりでも、部下はそれを業務の指示だと思い込んでいること。",
                    "上司は業務上の指示をコミュニケーションだと思っているが、部下はそう感じていないこと。",
                    "上司は部下の話を聞いているつもりでも、部下はもっと指示を出してほしいと思っていること。",
                    "上司は1対1の面談を重視しているが、部下はそれを時間の無駄だと感じていること。"
                ],
                "correctAnswer": 1,
                "explanation": "Đoạn 2 nêu rõ: Cấp trên nghĩ mình đang bắt chuyện (giao tiếp), nhưng nếu chỉ là chỉ thị công việc thì cấp dưới không coi đó là giao tiếp. Đáp án 1 diễn đạt chính xác ý này."
            },
            {
                "question": "筆者はこの問題を解決するために、上司に何を提案しているか。",
                "options": [
                    "業務の指示を減らし、雑談だけの時間を増やすこと。",
                    "効率を重視せず、すべての部下と毎日長く話すこと。",
                    "1対1の面談を設け、部下の話を聞く機会を作ること。",
                    "部下が将来の目標について上司に報告する義務を作ること。"
                ],
                "correctAnswer": 2,
                "explanation": "Đoạn cuối tác giả gợi ý: '上司が意識的に「聞く時間」を作ることが必要だ。例えば、定期的な1対1の面談（1on1）を導入し...' (Cấp trên cần tạo thời gian lắng nghe, ví dụ áp dụng gặp 1-1). Đáp án 2 phản ánh đúng đề xuất này."
            }
        ]
    },
    {
        "type": "reading-comprehension",
        "title": "Trung văn 2: Khái niệm về sự thành công",
        "text": "　私たちは子供の頃から、「努力すれば必ず成功する」と教えられてきた。学校のテストでも、スポーツの試合でも、一生懸命頑張った者が報われるというストーリーが好まれる。しかし、大人になって社会に出ると、この法則が必ずしも当てはまらないことに気づく。\n　ビジネスの世界では、どれだけ努力しても、タイミングや運、あるいは社会の状況によって失敗することがある。また、あまり努力をしていないように見える人が、時代に合ったアイデアを思いついて大成功を収めることもある。つまり、成功と努力は正比例するわけではないのだ。\n　だからといって、「努力しても無駄だ」と言うつもりはない。成功が保証されていなくても、努力の過程で得られるスキルや経験、そして忍耐力は、必ず自分自身の財産になる。結果としての「成功」だけを目標にするのではなく、成長していく自分自身を認めることが、より豊かな人生を送るための鍵なのではないだろうか。",
        "translation": "Từ khi còn nhỏ, chúng ta đã được dạy rằng 'nếu nỗ lực, chắc chắn sẽ thành công'. Dù là trong bài kiểm tra ở trường hay trận đấu thể thao, câu chuyện về người cố gắng hết mình sẽ được đền đáp luôn được yêu thích. Tuy nhiên, khi lớn lên và bước ra ngoài xã hội, ta nhận ra rằng quy luật này không phải lúc nào cũng đúng.\nTrong thế giới kinh doanh, dù nỗ lực đến đâu, bạn vẫn có thể thất bại do thời điểm, vận may hay tình hình xã hội. Mặt khác, cũng có những người có vẻ không nỗ lực nhiều nhưng lại nảy ra một ý tưởng hợp thời và đạt được thành công lớn. Nói cách khác, thành công và nỗ lực không tỷ lệ thuận với nhau.\nDù vậy, tôi không có ý định nói rằng 'nỗ lực cũng vô ích'. Ngay cả khi thành công không được đảm bảo, những kỹ năng, kinh nghiệm và lòng kiên nhẫn có được trong quá trình nỗ lực chắc chắn sẽ trở thành tài sản của chính bạn. Việc không chỉ lấy 'thành công' làm mục tiêu duy nhất, mà biết ghi nhận sự trưởng thành của bản thân, có lẽ chính là chìa khóa để sống một cuộc đời phong phú hơn.",
        "questions": [
            {
                "question": "筆者が「この法則が必ずしも当てはまらない」と言っているのはなぜか。",
                "options": [
                    "社会に出ると、誰も一生懸命頑張らなくなるから。",
                    "ビジネスの世界では、運や時代の状況も結果に大きく影響するから。",
                    "努力しなくても成功できる人がほとんどだから。",
                    "子供の頃のテストやスポーツとはルールが違うから。"
                ],
                "correctAnswer": 1,
                "explanation": "Đoạn 2 nêu rõ: 'タイミングや運、あるいは社会の状況によって失敗することがある...成功と努力は正比例するわけではない' (Có thể thất bại do vận may, tình hình xã hội... thành công và nỗ lực không tỷ lệ thuận). Do đó đáp án 1 là chính xác."
            },
            {
                "question": "筆者が最も伝えたいことはどれか。",
                "options": [
                    "成功するためには、努力よりも運やタイミングを見極めることが重要だ。",
                    "結果が出なくても、努力の過程で得られる成長自体を大切にするべきだ。",
                    "社会に出たら、子供の頃に教わったことはすべて忘れた方が良い。",
                    "成功が保証されていないので、無理に努力する必要はない。"
                ],
                "correctAnswer": 1,
                "explanation": "Câu cuối bài chốt lại ý chính: '結果としての「成功」だけを目標にするのではなく、成長していく自分自身を認めることが...豊かな人生を送るための鍵' (Không chỉ nhắm đến kết quả thành công, mà việc ghi nhận sự trưởng thành của bản thân mới là chìa khóa...). Đáp án 1 thể hiện đúng ý nghĩa này."
            }
        ]
    },
    {
        "type": "reading-comprehension",
        "title": "Mondai 14: Tìm kiếm thông tin - Biển thông báo Thư viện",
        "text": "【市立図書館からのお知らせ：年末年始の休館と貸出期間の延長について】\n\n平素より市立図書館をご利用いただきありがとうございます。\n誠に勝手ながら、当館は以下の期間、年末年始の休館とさせていただきます。\n\n休館期間：12月28日（木）～ 1月4日（木）\n※1月5日（金）午前9時より、通常通り開館いたします。\n\n◆貸出期間の延長について◆\n休館に伴い、本の貸出期間を通常の「2週間」から「3週間」に延長いたします。\n・対象期間：12月14日（木）～ 12月27日（水）に借りた本\n\n◆本の返却について◆\n休館中に本を返却される場合は、図書館入り口の横にある「返却ポスト」をご利用ください。\nただし、CDやDVDなどの視聴覚資料は、破損の恐れがあるためポストには入れず、開館後に直接カウンターへお返しください。\n\nご不便をおかけしますが、ご理解のほどよろしくお願いいたします。",
        "translation": "[Thông báo từ Thư viện Thành phố: Về việc đóng cửa dịp cuối năm - đầu năm và kéo dài thời gian mượn sách]\n\nCảm ơn quý khách đã luôn sử dụng Thư viện Thành phố.\nThư viện xin phép đóng cửa trong dịp cuối năm và đầu năm theo khoảng thời gian sau:\n\nThời gian đóng cửa: Ngày 28 tháng 12 (Thứ Năm) ~ Ngày 4 tháng 1 (Thứ Năm)\n*Thư viện sẽ mở cửa bình thường trở lại từ 9h sáng ngày 5 tháng 1 (Thứ Sáu).\n\n◆ Về việc kéo dài thời gian mượn ◆\nDo thư viện đóng cửa, thời gian mượn sách sẽ được kéo dài từ '2 tuần' như thường lệ lên '3 tuần'.\n- Thời gian áp dụng: Sách mượn từ ngày 14/12 (Thứ Năm) ~ 27/12 (Thứ Tư)\n\n◆ Về việc trả sách ◆\nNếu muốn trả sách trong thời gian đóng cửa, vui lòng sử dụng 'Hộp trả sách' bên cạnh lối vào thư viện.\nTuy nhiên, đối với các tài liệu nghe nhìn như CD và DVD, vì có nguy cơ hư hỏng nên tuyệt đối không bỏ vào hộp, mà hãy trả trực tiếp tại quầy sau khi thư viện mở cửa trở lại.\n\nXin lỗi vì sự bất tiện này, mong quý khách thông cảm.",
        "questions": [
            {
                "question": "12月20日に本を3冊とCDを1枚借りました。返却について正しい説明はどれか。",
                "options": [
                    "本もCDも、1月10日までに返却ポストに入れなければならない。",
                    "本は1月10日までに返却ポストに入れるかカウンターに返す。CDは開館後にカウンターに返す。",
                    "本もCDも、通常のルール通り1月3日までに返却ポストに入れなければならない。",
                    "本は1月3日までに返却ポストに返し、CDは1月5日以降にカウンターに返す。"
                ],
                "correctAnswer": 1,
                "explanation": "Ngày 20/12 nằm trong khoảng được mượn 3 tuần (14/12-27/12), nên hạn trả là 10/1 (20/12 + 21 ngày). Trong thời gian thư viện đóng cửa (đến 4/1) hoặc sau đó, Sách có thể bỏ vào hộp trả sách (hoặc trả ở quầy nếu mở cửa). Tuy nhiên CD không được bỏ vào hộp mà phải trả ở quầy khi mở cửa. Đáp án 1 mô tả đúng quy định này."
            }
        ]
    }
]

for p in dokkai_passages:
    passage_text = f"【Dịch nghĩa & Giải thích】\n\n{p['translation']}\n\n---\n\n{p['text']}"
    for i, q in enumerate(p["questions"]):
        questions.append({
            "id": f"nq-r-{q_id}",
            "type": p["type"],
            "category": "n2",
            "subCategory": "Đọc hiểu (Dokkai)",
            "passage": passage_text,
            "question": q["question"],
            "options": q["options"],
            "correctAnswer": q["correctAnswer"],
            "explanation": q["explanation"],
            "difficulty": "advanced",
            "tags": ["N2", "reading", "dokkai"]
        })
        q_id += 1

with open('/home/adminstrator/code/test/language-app/src/data/n2/questions-reading.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"Created n2/questions-reading.json with {len(questions)} reading questions.")

# N2 Listening Passages (Choukai)
listening_questions = []
l_id = 601

choukai_passages = [
    {
        "audio_transcript": "男の人と女の人が話しています。男の人はこの後、まず何をしますか。\n男：会議の資料、コピー終わった？\n女：あ、ごめん。今やろうと思ってたんだけど、プリンターのトナーが切れちゃって。\n男：えっ、本当？予備のトナー、倉庫にあったかな。\n女：さっき探したんだけど、見当たらなくて。総務に電話して注文してもらわないと。\n男：わかった。じゃあ、俺が総務に連絡しておくよ。君は急いで会議室のセッティングをお願い。\n女：了解。あ、ついでにお茶も準備しておいた方がいいよね。\n男：そうだね、それも頼む。じゃあ、まずは総務だな。\n\n男の人はこの後、まず何をしますか。",
        "translation": "Người nam và người nữ đang nói chuyện. Người nam sau đây sẽ làm gì ĐẦU TIÊN?\nNam: Tài liệu họp, copy xong chưa?\nNữ: A, xin lỗi. Tôi đang định làm thì máy in hết mực.\nNam: Hả, thật á? Mực dự phòng trong kho còn không nhỉ?\nNữ: Nãy tôi tìm rồi nhưng không thấy. Chắc phải gọi điện cho bộ phận Tổng vụ nhờ họ đặt mua thôi.\nNam: Hiểu rồi. Vậy để tôi liên lạc với Tổng vụ cho. Cô nhanh chóng setup phòng họp giúp tôi nhé.\nNữ: Rõ rồi. À, tiện thể chuẩn bị sẵn trà luôn thì tốt nhỉ.\nNam: Đúng rồi, nhờ cô việc đó luôn. Vậy, trước tiên là (gọi) Tổng vụ đã.\n\nNgười nam sau đây sẽ làm gì ĐẦU TIÊN?",
        "options": [
            "会議の資料をコピーする",
            "プリンターのトナーを探す",
            "総務に電話をしてトナーを注文する",
            "会議室のセッティングをする"
        ],
        "correctAnswer": 2,
        "explanation": "Người nam nói '俺が総務に連絡しておくよ' (Tôi sẽ liên lạc với Tổng vụ) và chốt lại là 'まずは総務だな' (Trước tiên là Tổng vụ đã). Do đó việc đầu tiên anh ta làm là gọi Tổng vụ để đặt mực in."
    },
    {
        "audio_transcript": "会社で女の人と男の人が話しています。男の人はなぜ遅刻しましたか。\n女：山田さん、今日は随分遅かったですね。会議、始まってますよ。\n男：本当にすみません。いつも乗る電車が人身事故で止まっちゃって。\n女：ああ、それで。でも、振替輸送のバスがあったんじゃないですか？\n男：はい、それに乗ろうと思ってバス停まで走ったんですけど、途中で財布を落としたことに気づいて...\n女：ええっ、見つかったんですか？\n男：ええ、駅の窓口に届けられていました。ただ、手続きに時間がかかってしまって。本当にご迷惑をおかけしました。\n\n男の人はなぜ遅刻しましたか。",
        "translation": "Người nữ và người nam đang nói chuyện ở công ty. Tại sao người nam lại đến muộn?\nNữ: Anh Yamada, hôm nay anh đến trễ quá đấy. Cuộc họp bắt đầu rồi.\nNam: Thành thật xin lỗi. Chuyến tàu tôi hay đi bị dừng do có tai nạn.\nNữ: À ra vậy. Nhưng chẳng phải có xe buýt chuyên chở thay thế sao?\nNam: Vâng, tôi cũng định lên chuyến đó nên đã chạy đến trạm xe buýt, nhưng giữa đường lại nhận ra mình làm rơi ví...\nNữ: Hả, thế có tìm thấy không?\nNam: Có, nó được giao đến quầy nhà ga rồi. Chỉ là làm thủ tục nhận lại tốn thời gian quá. Thực sự xin lỗi vì đã làm phiền.\n\nTại sao người nam lại đến muộn?",
        "options": [
            "電車が事故で止まってしまったから",
            "振替輸送のバスに乗り遅れたから",
            "落とした財布を受け取るのに時間がかかったから",
            "駅の窓口で道を聞いていたから"
        ],
        "correctAnswer": 2,
        "explanation": "Tuy ban đầu tàu bị dừng, nhưng lý do chính yếu khiến anh ta mất thời gian và đi trễ là vì phải làm thủ tục nhận lại chiếc ví bị rơi ('手続きに時間がかかってしまって'). Đáp án 2 mô tả đúng điều này."
    }
]

for q in choukai_passages:
    listening_questions.append({
        "id": f"nq-l-{l_id}",
        "type": "multiple-choice",
        "category": "n2",
        "subCategory": "Nghe hiểu (Choukai)",
        "question": q["audio_transcript"],
        "options": q["options"],
        "correctAnswer": q["correctAnswer"],
        "explanation": f"【Dịch nghĩa】\n{q['translation']}\n\n【Giải thích】\n{q['explanation']}",
        "difficulty": "advanced",
        "tags": ["N2", "listening", "choukai"]
    })
    l_id += 1

with open('/home/adminstrator/code/test/language-app/src/data/n2/questions-listening.json', 'w', encoding='utf-8') as f:
    json.dump(listening_questions, f, ensure_ascii=False, indent=2)

print(f"Created n2/questions-listening.json with {len(listening_questions)} listening questions.")
