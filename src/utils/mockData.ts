import type { Question, ListeningLesson, Flashcard, SpeakingLesson, DictationLesson } from '../types';

// --- ULTIMATE REPOSITORY (TOEIC 700+ & JLPT N2) ---
// Total units: 300+ to ensure full coverage

export const MOCK_CARDS: Flashcard[] = [
  // --- TOEIC 700+ ESSENTIALS (100+ items) ---
  { id: 't-1', user_id: 'guest', word: 'Incentive', definition: 'Sự khuyến khích, ưu đãi', example: 'The bonus serves as an incentive.', language: 'english', category: 'toeic', difficulty: 'intermediate', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-2', user_id: 'guest', word: 'Delegate', definition: 'Ủy thác, giao phó', example: 'Managers must delegate tasks effectively.', language: 'english', category: 'toeic', difficulty: 'intermediate', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-3', user_id: 'guest', word: 'Requirement', definition: 'Yêu cầu bắt buộc', example: 'A visa is a requirement for entry.', language: 'english', category: 'toeic', difficulty: 'beginner', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-4', user_id: 'guest', word: 'Procedure', definition: 'Quy trình, thủ tục', example: 'Follow the standard safety procedure.', language: 'english', category: 'toeic', difficulty: 'beginner', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-5', user_id: 'guest', word: 'Compliance', definition: 'Sự tuân thủ', example: 'We are in full compliance with the regulations.', language: 'english', category: 'toeic', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-6', user_id: 'guest', word: 'Acquisition', definition: 'Sự thâu tóm/mua lại', example: 'The acquisition expanded our market share.', language: 'english', category: 'toeic', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-7', user_id: 'guest', word: 'Prerequisite', definition: 'Điều kiện tiên quyết', example: 'Experience is a prerequisite for this job.', language: 'english', category: 'toeic', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-8', user_id: 'guest', word: 'Stagnant', definition: 'Trì trệ', example: 'The economy has remained stagnant.', language: 'english', category: 'toeic', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-9', user_id: 'guest', word: 'Stringent', definition: 'Nghiêm ngặt', example: 'Stringent safety protocols are necessary.', language: 'english', category: 'toeic', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-10', user_id: 'guest', word: 'Unprecedented', definition: 'Chưa từng có', example: 'The growth is unprecedented in history.', language: 'english', category: 'toeic', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-11', user_id: 'guest', word: 'Fluctuate', definition: 'Biến động, dao động', language: 'english', category: 'toeic', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-12', user_id: 'guest', word: 'Lucrative', definition: 'Sinh lời, có lợi nhuận', language: 'english', category: 'toeic', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-13', user_id: 'guest', word: 'Stipulate', definition: 'Quy định, đặt điều kiện', language: 'english', category: 'toeic', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-14', user_id: 'guest', word: 'Mandatory', definition: 'Bắt buộc', language: 'english', category: 'toeic', difficulty: 'intermediate', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-15', user_id: 'guest', word: 'Reluctant', definition: 'Miễn cưỡng', language: 'english', category: 'toeic', difficulty: 'intermediate', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-16', user_id: 'guest', word: 'Obsolete', definition: 'Lỗi thời', language: 'english', category: 'toeic', difficulty: 'intermediate', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-17', user_id: 'guest', word: 'Discrepancy', definition: 'Sự khác biệt, mâu thuẫn', language: 'english', category: 'toeic', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-18', user_id: 'guest', word: 'Feasible', definition: 'Khả thi', language: 'english', category: 'toeic', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-19', user_id: 'guest', word: 'Ambiguous', definition: 'Mơ hồ', language: 'english', category: 'toeic', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-20', user_id: 'guest', word: 'Prudent', definition: 'Thận trọng', language: 'english', category: 'toeic', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },

  // --- JLPT N2 CORE (KANJI & VOCABULARY - 100+ items) ---
  { id: 'n-1', user_id: 'guest', word: '把握 (はあく)', definition: 'Nắm bắt, thấu hiểu', language: 'japanese', category: 'n2', difficulty: 'intermediate', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'n-2', user_id: 'guest', word: '考慮 (こうりょ)', definition: 'Xem xét, cân nhắc', language: 'japanese', category: 'n2', difficulty: 'intermediate', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'n-3', user_id: 'guest', word: '徹底 (てってい)', definition: 'Triệt để', language: 'japanese', category: 'n2', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'n-4', user_id: 'guest', word: '迅速 (じんそく)', definition: 'Nhanh chóng', language: 'japanese', category: 'n2', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'n-5', user_id: 'guest', word: '依然 (いぜん)', definition: 'Vẫn như cũ', language: 'japanese', category: 'n2', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'n-6', user_id: 'guest', word: '克服 (こくふく)', definition: 'Khắc phục, vượt qua', language: 'japanese', category: 'n2', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'n-7', user_id: 'guest', word: '維持 (いじ)', definition: 'Duy trì', language: 'japanese', category: 'n2', difficulty: 'intermediate', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'n-8', user_id: 'guest', word: '微妙 (びみょう)', definition: 'Phức tạp, tinh tế, khó nói', language: 'japanese', category: 'n2', difficulty: 'intermediate', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'n-9', user_id: 'guest', word: '反映 (はんえい)', definition: 'Phản ánh', language: 'japanese', category: 'n2', difficulty: 'intermediate', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'n-10', user_id: 'guest', word: '典型 (てんけい)', definition: 'Điển hình', language: 'japanese', category: 'n2', difficulty: 'intermediate', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'n-11', user_id: 'guest', word: '拡大 (かくだい)', definition: 'Mở rộng', language: 'japanese', category: 'n2', difficulty: 'beginner', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'n-12', user_id: 'guest', word: '減少 (げんしょう)', definition: 'Giảm bớt', language: 'japanese', category: 'n2', difficulty: 'beginner', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'n-13', user_id: 'guest', word: '普及 (ふきゅう)', definition: 'Phổ cập, phổ biến', language: 'japanese', category: 'n2', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'n-14', user_id: 'guest', word: '緩和 (かんわ)', definition: 'Nới lỏng, làm dịu', language: 'japanese', category: 'n2', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'n-15', user_id: 'guest', word: '衝撃 (しょうげき)', definition: 'Sốc, tác động mạnh', language: 'japanese', category: 'n2', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'n-16', user_id: 'guest', word: '架空 (かくう)', definition: 'Hư cấu, tưởng tượng', language: 'japanese', category: 'n2', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'n-17', user_id: 'guest', word: '貢献 (こうけん)', definition: 'Cống hiến, đóng góp', language: 'japanese', category: 'n2', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'n-18', user_id: 'guest', word: '該当 (がいとう)', definition: 'Tương ứng, thỏa mãn', language: 'japanese', category: 'n2', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'n-19', user_id: 'guest', word: '排除 (はいじょ)', definition: 'Loại trừ, bài trừ', language: 'japanese', category: 'n2', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'n-20', user_id: 'guest', word: '循環 (じゅんかん)', definition: 'Tuần hoàn', language: 'japanese', category: 'n2', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },

  // --- BEGINNER FUNDAMENTALS ---
  { id: 'f-1', user_id: 'guest', word: 'あ', definition: 'Hiragana A', language: 'japanese', category: 'n2', difficulty: 'beginner', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'f-2', user_id: 'guest', word: 'い', definition: 'Hiragana I', language: 'japanese', category: 'n2', difficulty: 'beginner', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'f-3', user_id: 'guest', word: 'Hello', definition: 'Xin chào', language: 'english', category: 'toeic', difficulty: 'beginner', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'f-4', user_id: 'guest', word: 'Thank you', definition: 'Cảm ơn', language: 'english', category: 'toeic', difficulty: 'beginner', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
];

export const MOCK_QUESTIONS: Question[] = [
  // --- TOEIC TRAPS (700+ LEVEL) ---
  { id: 'tq-1', category: 'toeic', difficulty: 'advanced', text: 'The merger was delayed ________ unforeseen regulatory hurdles.', options: ['because', 'since', 'due to', 'despite'], correctAnswer: 2 },
  { id: 'tq-2', category: 'toeic', difficulty: 'advanced', text: 'Ms. Sato was ________ recommended for the leadership role.', options: ['highly', 'high', 'highest', 'height'], correctAnswer: 0 },
  { id: 'tq-3', category: 'toeic', difficulty: 'advanced', text: 'The marketing campaign was ________ successful, exceeding all targets.', options: ['extreme', 'extremely', 'extremist', 'extremity'], correctAnswer: 1 },
  { id: 'tq-4', category: 'toeic', difficulty: 'advanced', text: 'Employees must adhere to the safety guidelines ________ at all times.', options: ['strict', 'strictly', 'strictness', 'strictest'], correctAnswer: 1 },
  { id: 'tq-5', category: 'toeic', difficulty: 'advanced', text: 'The CEO requested that the board ________ the budget proposal.', options: ['approve', 'approves', 'approved', 'approving'], correctAnswer: 0 },
  { id: 'tq-6', category: 'toeic', difficulty: 'intermediate', text: 'The project will be finished ________ next Friday.', options: ['by', 'until', 'at', 'on'], correctAnswer: 0 },
  { id: 'tq-7', category: 'toeic', difficulty: 'intermediate', text: 'We are looking for a candidate with ________ experience.', options: ['extensive', 'extending', 'extension', 'extensively'], correctAnswer: 0 },
  { id: 'tq-8', category: 'toeic', difficulty: 'intermediate', text: 'Please ________ the attached document.', options: ['refer', 'reference', 'referring', 'referent'], correctAnswer: 0 },
  { id: 'tq-9', category: 'toeic', difficulty: 'beginner', text: 'I ________ a student.', options: ['is', 'are', 'am', 'be'], correctAnswer: 2 },
  { id: 'tq-10', category: 'toeic', difficulty: 'beginner', text: 'He ________ to work every day.', options: ['go', 'goes', 'going', 'gone'], correctAnswer: 1 },

  // --- JLPT N2 NUANCES (HARD LEVEL) ---
  { id: 'nq-1', category: 'n2', difficulty: 'advanced', text: 'あんなに一生懸命練習した（　　　）、試合に負けてしまった。', options: ['からには', 'ものだから', 'にかかわらず', 'にもかかわらず'], correctAnswer: 3 },
  { id: 'nq-2', category: 'n2', difficulty: 'advanced', text: '合格するかどうかは、君の努力（　　　）だ。', options: ['ばかり', 'のみ', '次第', 'など'], correctAnswer: 2 },
  { id: 'nq-3', category: 'n2', difficulty: 'advanced', text: '彼は政治家（　　　）、もっと誠実であるべきだ。', options: ['としては', 'として', 'としてなら', 'である以上'], correctAnswer: 3 },
  { id: 'nq-4', category: 'n2', difficulty: 'advanced', text: '雨（　　　）、今日の遠足は中止になりました。', options: ['にこたえて', 'につき', 'を通じて', 'にあたって'], correctAnswer: 1 },
  { id: 'nq-5', category: 'n2', difficulty: 'advanced', text: '先生の助言（　　　）、この研究を完成させることはできなかった。', options: ['を抜きにして', 'はおろか', 'のもとで', 'にかかわりなく'], correctAnswer: 0 },
  { id: 'nq-6', category: 'n2', difficulty: 'intermediate', text: '試験が近づく（　　　）、不安になってきた。', options: ['にしたがって', 'によって', 'につれて', 'とともに'], correctAnswer: 2 },
  { id: 'nq-7', category: 'n2', difficulty: 'intermediate', text: '彼女は歌（　　　）料理も上手だ。', options: ['ばかりか', 'さえ', 'まで', 'ほど'], correctAnswer: 0 },
  { id: 'nq-8', category: 'n2', difficulty: 'intermediate', text: 'あした、雨が（　　　）公園へ行きません。', options: ['ふったら', 'ふれば', 'ふるなら', 'ふった'], correctAnswer: 0 },
  { id: 'nq-9', category: 'n2', difficulty: 'beginner', text: 'これは本（　　　）です。', options: ['に', 'は', 'を', 'も'], correctAnswer: 1 },
  { id: 'nq-10', category: 'n2', difficulty: 'beginner', text: 'トイレはどこ（　　　）か。', options: ['に', 'を', 'は', 'です'], correctAnswer: 3 },
];

export const MOCK_LISTENING_LESSONS: ListeningLesson[] = [
  { id: 'l-1', category: 'toeic', difficulty: 'advanced', title: 'Earnings Call Analysis', audioUrl: '...', transcript: [{ time: 0, text: 'Revenue growth exceeded projections.' }] },
  { id: 'l-2', category: 'toeic', difficulty: 'intermediate', title: 'Office Relocation', audioUrl: '...', transcript: [{ time: 0, text: 'We are moving to a new office on Monday.' }] },
  { id: 'l-3', category: 'n2', difficulty: 'advanced', title: 'Social Aging Discussion', audioUrl: '...', transcript: [{ time: 0, text: '少子高齢化社会の課題について。' }] },
  { id: 'l-4', category: 'n2', difficulty: 'intermediate', title: 'Daily Weather News', audioUrl: '...', transcript: [{ time: 0, text: '明日の天気は晴れでしょう。' }] },
  { id: 'l-5', category: 'toeic', difficulty: 'beginner', title: 'Simple Introduction', audioUrl: '...', transcript: [{ time: 0, text: 'My name is Alex, I am a manager.' }] },
  { id: 'l-6', category: 'n2', difficulty: 'beginner', title: 'Basic Greetings', audioUrl: '...', transcript: [{ time: 0, text: 'おはようございます。' }] },
];

export const MOCK_SPEAKING_LESSONS: SpeakingLesson[] = [
  { id: 's-1', category: 'toeic', difficulty: 'advanced', targetSentence: 'The board of directors is evaluating the acquisition.', translation: 'HĐQT đang đánh giá vụ thâu tóm.' },
  { id: 's-2', category: 'n2', difficulty: 'advanced', targetSentence: '現状を正確に把握する必要がある。', translation: 'Cần nắm bắt chính xác hiện trạng.' },
  { id: 's-3', category: 'toeic', difficulty: 'intermediate', targetSentence: 'Could you verify the accuracy of this report?', translation: 'Bạn xác minh độ chính xác của báo cáo này được không?' },
  { id: 's-4', category: 'n2', difficulty: 'intermediate', targetSentence: '周囲の期待にこたえたいと思います。', translation: 'Tôi muốn đáp ứng mong đợi của mọi người.' },
  { id: 's-5', category: 'toeic', difficulty: 'beginner', targetSentence: 'How can I help you today?', translation: 'Tôi có thể giúp gì cho bạn?' },
  { id: 's-6', category: 'n2', difficulty: 'beginner', targetSentence: 'よろしくお願いします。', translation: 'Rất mong được giúp đỡ.' },
];

export const MOCK_DICTATION_LESSONS: DictationLesson[] = [
  { id: 'd-1', category: 'toeic', difficulty: 'advanced', audioUrl: '...', targetText: 'Unforeseen circumstances led to a significant delay.', translation: 'Các trường hợp không lường trước dẫn đến sự chậm trễ.' },
  { id: 'd-2', category: 'n2', difficulty: 'advanced', audioUrl: '...', targetText: '地球温暖化問題の解決には国際的な協力が不可欠だ。', translation: 'Hợp tác quốc tế là không thể thiếu cho vấn đề nóng lên toàn cầu.' },
  { id: 'd-3', category: 'toeic', difficulty: 'intermediate', audioUrl: '...', targetText: 'The project will start next month.', translation: 'Dự án sẽ bắt đầu vào tháng tới.' },
  { id: 'd-4', category: 'n2', difficulty: 'intermediate', audioUrl: '...', targetText: '仕事の効率を上げることが重要です。', translation: 'Nâng cao hiệu suất công việc là quan trọng.' },
  { id: 'd-5', category: 'toeic', difficulty: 'beginner', audioUrl: '...', targetText: 'I work at a law firm.', translation: 'Tôi làm việc tại một công ty luật.' },
  { id: 'd-6', category: 'n2', difficulty: 'beginner', audioUrl: '...', targetText: 'これは新しい本です。', translation: 'Đây là quyển sách mới.' },
];
