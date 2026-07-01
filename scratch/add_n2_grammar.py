import json

with open('/home/adminstrator/code/test/language-app/src/data/n2/grammar.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

new_grammar = [
  # === Nhóm ～わけ系 ===
  {"id": "ng-126", "pattern": "～わけではない", "structure": "V・A・Na・N + わけではない", "meaning": "Không hẳn là～; không phải là～", "example": "日本語が話せないわけではないが、まだ上手ではない。", "exampleTranslation": "Không phải là không nói được tiếng Nhật, nhưng chưa giỏi.", "difficulty": "intermediate"},
  {"id": "ng-127", "pattern": "～わけにはいかない", "structure": "V-る + わけにはいかない", "meaning": "Không thể～ được (vì lý do đạo đức/xã hội)", "example": "友達との約束があるから、休むわけにはいかない。", "exampleTranslation": "Vì có hẹn với bạn nên không thể nghỉ được.", "difficulty": "advanced"},
  {"id": "ng-128", "pattern": "～わけがない", "structure": "V・A・Na・N + わけがない", "meaning": "Không thể nào～; không có lý do để～", "example": "あんなに練習したのに、負けるわけがない。", "exampleTranslation": "Luyện tập nhiều như thế, không thể nào thua được.", "difficulty": "intermediate"},
  {"id": "ng-129", "pattern": "～ないわけにはいかない", "structure": "V-ない + わけにはいかない", "meaning": "Không thể không～; bắt buộc phải～", "example": "招待されたのだから、行かないわけにはいかない。", "exampleTranslation": "Vì đã được mời nên không thể không đi.", "difficulty": "advanced"},

  # === Nhóm ～から系 ===
  {"id": "ng-130", "pattern": "～からして", "structure": "N + からして", "meaning": "Ngay từ～ đã; xét từ～", "example": "あの店は外観からして高級そうだ。", "exampleTranslation": "Cửa hàng kia ngay từ vẻ bề ngoài đã có vẻ sang trọng.", "difficulty": "advanced"},
  {"id": "ng-131", "pattern": "～からすると / からすれば", "structure": "N + からすると", "meaning": "Xét từ góc độ～; theo quan điểm của～", "example": "親からすれば、子供の安全が一番大事だ。", "exampleTranslation": "Từ góc độ cha mẹ, an toàn của con cái là quan trọng nhất.", "difficulty": "advanced"},
  {"id": "ng-132", "pattern": "～からといって", "structure": "V・A・Na・N + からといって", "meaning": "Không phải vì～ mà (có thể)～", "example": "お金があるからといって、幸せとは限らない。", "exampleTranslation": "Không phải vì có tiền mà chắc chắn sẽ hạnh phúc.", "difficulty": "intermediate"},
  {"id": "ng-133", "pattern": "～からこそ", "structure": "V・A・Na・N + からこそ", "meaning": "Chính vì～ nên; chính bởi vì～", "example": "あなたのことが好きだからこそ、厳しいことを言うのだ。", "exampleTranslation": "Chính vì thích bạn nên mới nói những điều nghiêm khắc.", "difficulty": "intermediate"},

  # === Nhóm ～もの系 ===
  {"id": "ng-134", "pattern": "～ものなら", "structure": "V-る（可能形） + ものなら", "meaning": "Nếu có thể～ thì (muốn)～", "example": "できるものなら、もう一度やり直したい。", "exampleTranslation": "Nếu có thể được, tôi muốn làm lại một lần nữa.", "difficulty": "advanced"},
  {"id": "ng-135", "pattern": "～ものの", "structure": "V・A・Na・N + ものの", "meaning": "Tuy rằng～ nhưng; mặc dù～", "example": "買ったものの、一度も使っていない。", "exampleTranslation": "Tuy đã mua nhưng chưa dùng lần nào.", "difficulty": "intermediate"},
  {"id": "ng-136", "pattern": "～ものがある", "structure": "V・A + ものがある", "meaning": "Có điều gì đó～; thật sự là～", "example": "彼の演技には感動させるものがある。", "exampleTranslation": "Trong diễn xuất của anh ấy có điều gì đó thật sự cảm động.", "difficulty": "advanced"},
  {"id": "ng-137", "pattern": "～ものだ（感嘆）", "structure": "V・A + ものだ", "meaning": "Thật là～ (cảm thán); ngày xưa hay～", "example": "子供の頃、よくこの公園で遊んだものだ。", "exampleTranslation": "Hồi nhỏ hay chơi ở công viên này.", "difficulty": "intermediate"},

  # === Nhóm ～ことは系 ===
  {"id": "ng-138", "pattern": "～ことはない", "structure": "V-る + ことはない", "meaning": "Không cần phải～; không có chuyện～", "example": "そんなに心配することはない。", "exampleTranslation": "Không cần phải lo lắng nhiều như thế.", "difficulty": "intermediate"},
  {"id": "ng-139", "pattern": "～ことか", "structure": "V・A + ことか", "meaning": "Biết bao～; biết chừng nào～ (cảm thán)", "example": "合格の知らせを聞いて、どんなに嬉しかったことか。", "exampleTranslation": "Nghe tin đỗ, biết bao là vui sướng.", "difficulty": "advanced"},
  {"id": "ng-140", "pattern": "～ことだ", "structure": "V-る / V-ない + ことだ", "meaning": "Nên～; tốt nhất là～ (khuyên nhủ)", "example": "健康のためには、早く寝ることだ。", "exampleTranslation": "Vì sức khỏe, tốt nhất là nên ngủ sớm.", "difficulty": "intermediate"},
  {"id": "ng-141", "pattern": "～ことなく", "structure": "V-る + ことなく", "meaning": "Mà không～; không hề～", "example": "彼は諦めることなく、最後まで頑張った。", "exampleTranslation": "Anh ấy không hề bỏ cuộc, cố gắng đến cuối cùng.", "difficulty": "advanced"},
  {"id": "ng-142", "pattern": "～ことから", "structure": "V・A・Na・N + ことから", "meaning": "Vì～ nên; do～ mà (nguồn gốc)", "example": "形が富士山に似ていることから、この名前がついた。", "exampleTranslation": "Vì hình dáng giống núi Phú Sĩ nên được đặt tên này.", "difficulty": "intermediate"},
  {"id": "ng-143", "pattern": "～ことになっている", "structure": "V-る + ことになっている", "meaning": "Được quy định là～; theo quy tắc thì～", "example": "この会社では、毎朝8時に出社することになっている。", "exampleTranslation": "Ở công ty này, theo quy định thì phải đến lúc 8 giờ sáng.", "difficulty": "intermediate"},

  # === Nhóm cảm xúc/mức độ ===
  {"id": "ng-144", "pattern": "～てたまらない", "structure": "V-て / A-くて / Na-で + たまらない", "meaning": "～không chịu nổi; ～quá đi", "example": "明日の試験のことが心配でたまらない。", "exampleTranslation": "Lo lắng về bài thi ngày mai không chịu nổi.", "difficulty": "intermediate"},
  {"id": "ng-145", "pattern": "～てならない", "structure": "V-て / A-くて / Na-で + ならない", "meaning": "～vô cùng; không thể ngừng～ (cảm xúc tự nhiên)", "example": "故郷のことが懐かしくてならない。", "exampleTranslation": "Nhớ quê hương vô cùng.", "difficulty": "intermediate"},
  {"id": "ng-146", "pattern": "～てしょうがない / しかたがない", "structure": "V-て / A-くて / Na-で + しょうがない", "meaning": "～không thể chịu được; ～quá đỗi", "example": "眠くてしょうがない。", "exampleTranslation": "Buồn ngủ quá không chịu được.", "difficulty": "intermediate"},
  {"id": "ng-147", "pattern": "～かねない", "structure": "V-ます(bỏ ます) + かねない", "meaning": "Có thể～; e rằng～ (kết quả xấu)", "example": "このまま放っておくと、大きな問題になりかねない。", "exampleTranslation": "Nếu cứ bỏ mặc thế này, e rằng sẽ thành vấn đề lớn.", "difficulty": "advanced"},
  {"id": "ng-148", "pattern": "～かねる", "structure": "V-ます(bỏ ます) + かねる", "meaning": "Khó có thể～; không thể～ được", "example": "その要求にはお答えしかねます。", "exampleTranslation": "Yêu cầu đó tôi khó có thể trả lời được.", "difficulty": "advanced"},

  # === Nhóm giới hạn/phạm vi ===
  {"id": "ng-149", "pattern": "～に限って", "structure": "N + に限って", "meaning": "Chỉ riêng～ thì; cứ vào lúc～", "example": "急いでいる時に限って、電車が遅れる。", "exampleTranslation": "Cứ lúc đang vội thì tàu lại bị trễ.", "difficulty": "intermediate"},
  {"id": "ng-150", "pattern": "～に限り", "structure": "N + に限り", "meaning": "Chỉ giới hạn ở～; chỉ dành cho～", "example": "本日に限り、全品半額です。", "exampleTranslation": "Chỉ trong ngày hôm nay, tất cả hàng giảm giá 50%.", "difficulty": "intermediate"},
  {"id": "ng-151", "pattern": "～に限らず", "structure": "N + に限らず", "meaning": "Không chỉ giới hạn ở～; không chỉ～", "example": "日本に限らず、世界中で環境問題が起きている。", "exampleTranslation": "Không chỉ Nhật Bản, trên toàn thế giới đang xảy ra vấn đề môi trường.", "difficulty": "intermediate"},
  {"id": "ng-152", "pattern": "～きり / っきり", "structure": "V-た / N + きり", "meaning": "Chỉ～ rồi thôi; kể từ～ thì không～ nữa", "example": "彼とは去年会ったきり、連絡がない。", "exampleTranslation": "Gặp anh ấy từ năm ngoái rồi thôi, không liên lạc nữa.", "difficulty": "intermediate"},

  # === Nhóm khẳng định/phủ định mạnh ===
  {"id": "ng-153", "pattern": "～にほかならない", "structure": "N / V・A + にほかならない", "meaning": "Không gì khác ngoài～; chính là～", "example": "彼の成功は努力の結果にほかならない。", "exampleTranslation": "Thành công của anh ấy không gì khác ngoài kết quả của sự nỗ lực.", "difficulty": "advanced"},
  {"id": "ng-154", "pattern": "～に違いない", "structure": "V・A・Na・N + に違いない", "meaning": "Chắc chắn là～; nhất định là～", "example": "彼は日本に住んでいたに違いない。日本語がとても上手だ。", "exampleTranslation": "Chắc chắn anh ấy đã từng sống ở Nhật. Tiếng Nhật rất giỏi.", "difficulty": "intermediate"},
  {"id": "ng-155", "pattern": "～に決まっている", "structure": "V・A・Na・N + に決まっている", "meaning": "Chắc chắn là～; đương nhiên là～", "example": "あんなに食べたら、太るに決まっている。", "exampleTranslation": "Ăn nhiều như thế thì đương nhiên sẽ béo.", "difficulty": "intermediate"},
  {"id": "ng-156", "pattern": "～にすぎない", "structure": "V・N + にすぎない", "meaning": "Chỉ là～ mà thôi; không hơn～", "example": "これは私の個人的な意見にすぎない。", "exampleTranslation": "Đây chỉ là ý kiến cá nhân của tôi mà thôi.", "difficulty": "intermediate"},

  # === Nhóm trạng thái/tính chất ===
  {"id": "ng-157", "pattern": "～だらけ", "structure": "N + だらけ", "meaning": "Đầy～; toàn là～ (tiêu cực)", "example": "この部屋はほこりだらけだ。", "exampleTranslation": "Căn phòng này đầy bụi.", "difficulty": "intermediate"},
  {"id": "ng-158", "pattern": "～向き", "structure": "N + 向き", "meaning": "Phù hợp cho～; dành cho～", "example": "この本は初心者向きです。", "exampleTranslation": "Cuốn sách này phù hợp cho người mới bắt đầu.", "difficulty": "intermediate"},
  {"id": "ng-159", "pattern": "～向け", "structure": "N + 向け", "meaning": "Hướng đến～; thiết kế cho～", "example": "これは子供向けの番組です。", "exampleTranslation": "Đây là chương trình dành cho trẻ em.", "difficulty": "intermediate"},
  {"id": "ng-160", "pattern": "～気味", "structure": "V-ます(bỏ ます) / N + 気味", "meaning": "Hơi có vẻ～; có chiều hướng～", "example": "最近、風邪気味なので、早く寝ます。", "exampleTranslation": "Gần đây hơi có vẻ cảm nên đi ngủ sớm.", "difficulty": "intermediate"},
  {"id": "ng-161", "pattern": "～がち", "structure": "V-ます(bỏ ます) / N + がち", "meaning": "Hay～; có xu hướng～ (tiêu cực)", "example": "冬は運動不足になりがちだ。", "exampleTranslation": "Mùa đông hay bị thiếu vận động.", "difficulty": "intermediate"},

  # === Nhóm quan hệ/liên quan ===
  {"id": "ng-162", "pattern": "～をめぐって", "structure": "N + をめぐって", "meaning": "Xung quanh vấn đề～; về～", "example": "新しい法律をめぐって議論が続いている。", "exampleTranslation": "Cuộc tranh luận xung quanh luật mới vẫn tiếp tục.", "difficulty": "advanced"},
  {"id": "ng-163", "pattern": "～を通じて / を通して", "structure": "N + を通じて", "meaning": "Thông qua～; trong suốt～", "example": "インターネットを通じて世界中の情報を得ることができる。", "exampleTranslation": "Có thể thu thập thông tin trên toàn thế giới thông qua internet.", "difficulty": "intermediate"},
  {"id": "ng-164", "pattern": "～をもとに", "structure": "N + をもとに", "meaning": "Dựa trên～; lấy～ làm cơ sở", "example": "実際の事件をもとに、小説を書いた。", "exampleTranslation": "Dựa trên vụ việc thực tế để viết tiểu thuyết.", "difficulty": "intermediate"},
  {"id": "ng-165", "pattern": "～に基づいて", "structure": "N + に基づいて", "meaning": "Dựa trên～; căn cứ vào～", "example": "法律に基づいて判断する。", "exampleTranslation": "Phán đoán dựa trên luật pháp.", "difficulty": "intermediate"},
  {"id": "ng-166", "pattern": "～にわたって", "structure": "N + にわたって", "meaning": "Trải dài～; kéo dài suốt～", "example": "10年にわたって研究を続けてきた。", "exampleTranslation": "Đã tiếp tục nghiên cứu suốt 10 năm.", "difficulty": "intermediate"},

  # === Nhóm so sánh/đánh giá ===
  {"id": "ng-167", "pattern": "～に反して", "structure": "N + に反して", "meaning": "Trái ngược với～; ngược lại với～", "example": "予想に反して、試験は簡単だった。", "exampleTranslation": "Trái ngược với dự đoán, bài thi dễ.", "difficulty": "intermediate"},
  {"id": "ng-168", "pattern": "～に比べて", "structure": "N + に比べて", "meaning": "So với～", "example": "去年に比べて、今年の夏は暑い。", "exampleTranslation": "So với năm ngoái, mùa hè năm nay nóng hơn.", "difficulty": "intermediate"},
  {"id": "ng-169", "pattern": "～というより", "structure": "V・A・Na・N + というより", "meaning": "Hơn là～; đúng hơn là～", "example": "彼は歌手というより俳優だ。", "exampleTranslation": "Anh ấy đúng hơn là diễn viên chứ không phải ca sĩ.", "difficulty": "intermediate"},
  {"id": "ng-170", "pattern": "～どころか", "structure": "V・A・Na・N + どころか", "meaning": "Đừng nói là～; không những không～ mà～", "example": "漢字どころか、ひらがなも読めない。", "exampleTranslation": "Đừng nói là kanji, ngay cả hiragana cũng không đọc được.", "difficulty": "advanced"},
  {"id": "ng-171", "pattern": "～くらい / ぐらい～はない", "structure": "N + くらい～はない", "meaning": "Không có gì～ bằng～; ～nhất là～", "example": "健康くらい大切なものはない。", "exampleTranslation": "Không có gì quý bằng sức khỏe.", "difficulty": "intermediate"},

  # === Nhóm thời gian/biến đổi ===
  {"id": "ng-172", "pattern": "～つつある", "structure": "V-ます(bỏ ます) + つつある", "meaning": "Đang dần～; đang trong quá trình～", "example": "地球の気温は上昇しつつある。", "exampleTranslation": "Nhiệt độ trái đất đang dần tăng lên.", "difficulty": "advanced"},
  {"id": "ng-173", "pattern": "～て以来", "structure": "V-て + 以来", "meaning": "Kể từ khi～; từ khi～ đến nay", "example": "日本に来て以来、毎日日本語を勉強している。", "exampleTranslation": "Kể từ khi đến Nhật, mỗi ngày đều học tiếng Nhật.", "difficulty": "intermediate"},
  {"id": "ng-174", "pattern": "～次第", "structure": "V-ます(bỏ ます) + 次第", "meaning": "Ngay khi～ thì sẽ～", "example": "届き次第、ご連絡いたします。", "exampleTranslation": "Ngay khi nhận được, tôi sẽ liên lạc.", "difficulty": "advanced"},
  {"id": "ng-175", "pattern": "～次第で / 次第だ", "structure": "N + 次第で", "meaning": "Tùy thuộc vào～; phụ thuộc vào～", "example": "結果は努力次第だ。", "exampleTranslation": "Kết quả tùy thuộc vào sự nỗ lực.", "difficulty": "intermediate"},

  # === Nhóm mục đích/kết quả ===
  {"id": "ng-176", "pattern": "～うえに", "structure": "V・A・Na・N + うえに", "meaning": "Hơn nữa～; không chỉ～ mà còn～", "example": "彼は頭がいいうえに、スポーツもできる。", "exampleTranslation": "Anh ấy không chỉ thông minh mà còn giỏi thể thao.", "difficulty": "intermediate"},
  {"id": "ng-177", "pattern": "～末に / 末の", "structure": "V-た / N の + 末に", "meaning": "Sau khi～ cuối cùng; kết quả là～", "example": "長い話し合いの末に、結論が出た。", "exampleTranslation": "Sau cuộc thảo luận dài, cuối cùng đã ra kết luận.", "difficulty": "advanced"},
  {"id": "ng-178", "pattern": "～あげく", "structure": "V-た / N の + あげく", "meaning": "Cuối cùng thì～ (kết quả xấu)", "example": "散々悩んだあげく、辞めることにした。", "exampleTranslation": "Sau khi phiền não đủ điều, cuối cùng quyết định nghỉ.", "difficulty": "advanced"},
  {"id": "ng-179", "pattern": "～おかげで / おかげだ", "structure": "V・A・Na・N + おかげで", "meaning": "Nhờ～ mà; nhờ có～", "example": "先生のおかげで、N2に合格できた。", "exampleTranslation": "Nhờ thầy/cô mà đã thi đỗ N2.", "difficulty": "intermediate"},
  {"id": "ng-180", "pattern": "～せいで / せいだ", "structure": "V・A・Na・N + せいで", "meaning": "Tại vì～; do lỗi của～ (tiêu cực)", "example": "台風のせいで、飛行機が欠航になった。", "exampleTranslation": "Tại vì bão nên máy bay bị hủy chuyến.", "difficulty": "intermediate"},

  # === Nhóm đối xử/thái độ ===
  {"id": "ng-181", "pattern": "～として", "structure": "N + として", "meaning": "Với tư cách là～; trong vai trò～", "example": "私は留学生として日本に来ました。", "exampleTranslation": "Tôi đến Nhật với tư cách là du học sinh.", "difficulty": "intermediate"},
  {"id": "ng-182", "pattern": "～にとって", "structure": "N + にとって", "meaning": "Đối với～", "example": "この本は日本語学習者にとって、とても役に立つ。", "exampleTranslation": "Đối với người học tiếng Nhật, cuốn sách này rất có ích.", "difficulty": "intermediate"},
  {"id": "ng-183", "pattern": "～に対して", "structure": "N + に対して", "meaning": "Đối với～; hướng về～", "example": "先輩に対して、敬語を使うべきだ。", "exampleTranslation": "Đối với tiền bối, nên sử dụng kính ngữ.", "difficulty": "intermediate"},
  {"id": "ng-184", "pattern": "～にかけては", "structure": "N + にかけては", "meaning": "Về mặt～ thì; nói về～", "example": "料理にかけては、彼女に勝てる人はいない。", "exampleTranslation": "Nói về nấu ăn thì không ai thắng được cô ấy.", "difficulty": "advanced"},
  {"id": "ng-185", "pattern": "～をはじめ / をはじめとして", "structure": "N + をはじめ", "meaning": "Bắt đầu từ～; đứng đầu là～", "example": "東京をはじめ、大阪や京都も訪れた。", "exampleTranslation": "Bắt đầu từ Tokyo, cũng đã đến Osaka và Kyoto.", "difficulty": "intermediate"},

  # === Nhóm giả định/điều kiện ===
  {"id": "ng-186", "pattern": "～としたら / とすれば", "structure": "V・A・Na・N + としたら", "meaning": "Nếu giả sử～ thì", "example": "もし留学するとしたら、どこに行きたいですか。", "exampleTranslation": "Nếu giả sử du học thì bạn muốn đi đâu?", "difficulty": "intermediate"},
  {"id": "ng-187", "pattern": "～ようでは / ようじゃ", "structure": "V-る + ようでは", "meaning": "Nếu mà cứ～ thì (không tốt)", "example": "毎日遅刻するようでは、クビになるよ。", "exampleTranslation": "Nếu mà cứ đi muộn mỗi ngày thì sẽ bị sa thải đó.", "difficulty": "advanced"},
  {"id": "ng-188", "pattern": "～ないことには", "structure": "V-ない + ことには", "meaning": "Nếu không～ thì không thể～", "example": "実際に見ないことには、判断できない。", "exampleTranslation": "Nếu không thực tế xem thì không thể phán đoán được.", "difficulty": "advanced"},

  # === Nhóm nhấn mạnh ===
  {"id": "ng-189", "pattern": "～こそ", "structure": "N / V-て + こそ", "meaning": "Chính～ mới là; ～mới thật sự", "example": "失敗してこそ、成長できるのだ。", "exampleTranslation": "Chính vì thất bại mới có thể trưởng thành.", "difficulty": "intermediate"},
  {"id": "ng-190", "pattern": "～さえ", "structure": "N + さえ", "meaning": "Ngay cả～; thậm chí～", "example": "忙しくて、食事をする時間さえない。", "exampleTranslation": "Bận đến mức ngay cả thời gian ăn cơm cũng không có.", "difficulty": "intermediate"},
  {"id": "ng-191", "pattern": "～すら", "structure": "N + すら", "meaning": "Ngay cả～ cũng (văn viết)", "example": "その事件のことは名前すら知らない。", "exampleTranslation": "Về vụ việc đó, ngay cả tên cũng không biết.", "difficulty": "advanced"},
  {"id": "ng-192", "pattern": "～たところで", "structure": "V-た + ところで", "meaning": "Cho dù có～ cũng; dù～ đi nữa", "example": "今から走ったところで、もう間に合わない。", "exampleTranslation": "Bây giờ có chạy đi nữa cũng không kịp rồi.", "difficulty": "advanced"},

  # === Nhóm bổ sung N2 quan trọng ===
  {"id": "ng-193", "pattern": "～っこない", "structure": "V-ます(bỏ ます) + っこない", "meaning": "Không thể nào～; chắc chắn không～", "example": "そんな難しい試験、受かりっこない。", "exampleTranslation": "Kỳ thi khó như vậy, không thể nào đỗ được.", "difficulty": "intermediate"},
  {"id": "ng-194", "pattern": "～てはいられない", "structure": "V-て + はいられない", "meaning": "Không thể cứ～ mãi được", "example": "いつまでも泣いてはいられない。前を向こう。", "exampleTranslation": "Không thể cứ khóc mãi được. Hãy nhìn về phía trước.", "difficulty": "intermediate"},
  {"id": "ng-195", "pattern": "～ぬきで / ぬきに", "structure": "N + ぬきで", "meaning": "Bỏ qua～; không có～", "example": "冗談ぬきで、真剣に話そう。", "exampleTranslation": "Bỏ đùa sang một bên, hãy nói chuyện nghiêm túc.", "difficulty": "advanced"},
  {"id": "ng-196", "pattern": "～をこめて", "structure": "N + をこめて", "meaning": "Với tất cả～; dồn hết～ vào", "example": "心をこめて手紙を書いた。", "exampleTranslation": "Viết thư với tất cả tấm lòng.", "difficulty": "intermediate"},
  {"id": "ng-197", "pattern": "～はもちろん", "structure": "N + はもちろん", "meaning": "～đương nhiên rồi; không chỉ～", "example": "日本語はもちろん、英語も話せる。", "exampleTranslation": "Tiếng Nhật đương nhiên rồi, tiếng Anh cũng nói được.", "difficulty": "intermediate"},
  {"id": "ng-198", "pattern": "～はともかく", "structure": "N + はともかく", "meaning": "～thì tạm không nói; tạm gác～ sang một bên", "example": "結果はともかく、一生懸命やったことが大事だ。", "exampleTranslation": "Kết quả tạm không nói, quan trọng là đã cố gắng hết sức.", "difficulty": "intermediate"},
  {"id": "ng-199", "pattern": "～かと思うと / かと思ったら", "structure": "V-た + かと思うと", "meaning": "Vừa mới～ thì đã (bất ngờ)～", "example": "晴れたかと思ったら、急に雨が降り出した。", "exampleTranslation": "Vừa tưởng trời tạnh thì bất ngờ mưa lại đổ xuống.", "difficulty": "advanced"},
  {"id": "ng-200", "pattern": "～にしろ～にしろ / にせよ～にせよ", "structure": "V・N + にしろ～にしろ", "meaning": "Dù là～ hay～ đi nữa", "example": "賛成にしろ反対にしろ、意見を言ってください。", "exampleTranslation": "Dù là tán thành hay phản đối, xin hãy nêu ý kiến.", "difficulty": "advanced"}
]

data.extend(new_grammar)
print(f"Total N2 grammar points: {len(data)}")

with open('/home/adminstrator/code/test/language-app/src/data/n2/grammar.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Done! Added 75 new N2 grammar patterns.")
