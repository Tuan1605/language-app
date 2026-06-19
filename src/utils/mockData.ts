import type { Question, ListeningLesson, Flashcard, SpeakingLesson, DictationLesson, FullExam } from '../types';
import { SEED_CARDS, SEED_QUESTIONS } from '../data/contentLoader';

// --- ULTIMATE REPOSITORY (TOEIC 700+ & JLPT N2) ---
// Original practice material only. Not copied from official exams.

const BASE_CARDS: Flashcard[] = [
  // --- TOEIC HIGH-FREQUENCY ---
  { id: 't-1', user_id: 'guest', word: 'Incentive', definition: 'Sự khuyến khích, ưu đãi', example: 'The bonus serves as an incentive.', language: 'english', category: 'toeic', difficulty: 'intermediate', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-2', user_id: 'guest', word: 'Delegate', definition: 'Ủy thác, giao phó', example: 'Managers must delegate tasks effectively.', language: 'english', category: 'toeic', difficulty: 'intermediate', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-3', user_id: 'guest', word: 'Requirement', definition: 'Yêu cầu bắt buộc', language: 'english', category: 'toeic', difficulty: 'beginner', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-4', user_id: 'guest', word: 'Procedure', definition: 'Quy trình, thủ tục', language: 'english', category: 'toeic', difficulty: 'beginner', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-5', user_id: 'guest', word: 'Compliance', definition: 'Sự tuân thủ', language: 'english', category: 'toeic', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 't-6', user_id: 'guest', word: 'Acquisition', definition: 'Sự thâu tóm/mua lại', language: 'english', category: 'toeic', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },

  // --- JLPT N2 CORE ---
  { id: 'n-1', user_id: 'guest', word: '把握 (はあく)', definition: 'Nắm bắt, thấu hiểu', language: 'japanese', category: 'n2', difficulty: 'intermediate', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'n-2', user_id: 'guest', word: '考慮 (こうりょ)', definition: 'Xem xét, cân nhắc', language: 'japanese', category: 'n2', difficulty: 'intermediate', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'n-3', user_id: 'guest', word: '徹底 (てってい)', definition: 'Triệt để', language: 'japanese', category: 'n2', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'n-4', user_id: 'guest', word: '迅速 (じんそく)', definition: 'Nhanh chóng', language: 'japanese', category: 'n2', difficulty: 'advanced', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },

  // --- BEGINNER ---
  { id: 'f-2', user_id: 'guest', word: 'Hello', definition: 'Xin chào', language: 'english', category: 'toeic', difficulty: 'beginner', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
];

// Combine the small built-in demo cards with the larger JSON seed library.
export const MOCK_CARDS: Flashcard[] = [...BASE_CARDS, ...SEED_CARDS];

const BASE_QUESTIONS: Question[] = [
  // --- TOEIC ---
  { id: 'tq-1', category: 'toeic', difficulty: 'advanced', text: 'The merger was delayed ________ unforeseen regulatory hurdles.', options: ['because', 'since', 'due to', 'despite'], correctAnswer: 2, subCategory: 'Grammar' },
  { id: 'tq-2', category: 'toeic', difficulty: 'intermediate', text: 'The project will be finished ________ next Friday.', options: ['by', 'until', 'at', 'on'], correctAnswer: 0, subCategory: 'Grammar' },
  { id: 'tq-3', category: 'toeic', difficulty: 'beginner', text: 'Which of the following is a synonym for "happy"?', options: ['Sad', 'Joyful', 'Angry', 'Tired'], correctAnswer: 1, subCategory: 'Vocabulary' },
  { id: 'tq-4', category: 'toeic', difficulty: 'intermediate', text: 'She is ________ to her new role quickly.', options: ['adapting', 'adopting', 'adepting', 'accepting'], correctAnswer: 0, subCategory: 'Vocabulary' },
  { id: 'tq-5', category: 'toeic', difficulty: 'advanced', text: 'The company decided to ________ its operations to Asia.', options: ['expand', 'expend', 'extend', 'expose'], correctAnswer: 0, subCategory: 'Business' },
  { id: 'tq-6', category: 'toeic', difficulty: 'advanced', text: 'Read the passage and answer the question. [...] Who is the new CEO?', options: ['John Doe', 'Jane Smith', 'Peter Pan', 'Tony Stark'], correctAnswer: 1, subCategory: 'Reading' },
  
  // --- JLPT N2 ---
  { id: 'nq-1', category: 'n2', difficulty: 'advanced', text: 'あんなに一生懸命練習した（　　　）、試合に負けてしまった。', options: ['からには', 'ものだから', 'にかかわらず', 'にもかかわらず'], correctAnswer: 3, subCategory: 'Grammar' },
  { id: 'nq-2', category: 'n2', difficulty: 'beginner', text: 'これは本（　　　）です。', options: ['に', 'は', 'を', 'も'], correctAnswer: 1, subCategory: 'Grammar' },
  { id: 'nq-3', category: 'n2', difficulty: 'intermediate', text: '大雨（　　　）試合は中止された。', options: ['によって', 'によると', 'のせいで', 'のおかげで'], correctAnswer: 0, subCategory: 'Grammar' },
  { id: 'nq-4', category: 'n2', difficulty: 'advanced', text: 'この問題は、一晩考え（　　　）末、ようやく解決できた。', options: ['ぬいた', 'きった', 'あげた', 'とおした'], correctAnswer: 0, subCategory: 'Grammar' },
  { id: 'nq-5', category: 'n2', difficulty: 'intermediate', text: '彼の話は（　　　）ばかりで、内容がない。', options: ['うそ', 'ほんと', '冗談', '事実'], correctAnswer: 0, subCategory: 'Vocabulary' },
  { id: 'nq-6', category: 'n2', difficulty: 'advanced', text: '文章を読んで、筆者の主張を答えなさい。[...]', options: ['A', 'B', 'C', 'D'], correctAnswer: 2, subCategory: 'Reading' },
];

// Combine built-in demo questions with the larger JSON seed bank.
export const MOCK_QUESTIONS: Question[] = [...BASE_QUESTIONS, ...SEED_QUESTIONS];

export const MOCK_LISTENING_LESSONS: ListeningLesson[] = [
  // TOEIC BEGINNER
  { id: 'l-t-b1', category: 'toeic', difficulty: 'beginner', title: 'Self Introduction', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', transcript: [{ time: 0, text: 'Hello, my name is John Smith.' }, { time: 3, text: 'I am a marketing manager.' }, { time: 6, text: 'Nice to meet you.' }] },
  { id: 'l-t-b2', category: 'toeic', difficulty: 'beginner', title: 'Daily Routine', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', transcript: [{ time: 0, text: 'I wake up at 7 AM every day.' }, { time: 3, text: 'I take the bus to work.' }, { time: 6, text: 'I start work at 9 AM.' }] },
  { id: 'l-t-b3', category: 'toeic', difficulty: 'beginner', title: 'Office Basics', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', transcript: [{ time: 0, text: 'This is my desk.' }, { time: 3, text: 'I use a computer for my work.' }, { time: 6, text: 'The office is on the second floor.' }] },
  // TOEIC INTERMEDIATE
  { id: 'l-t-i1', category: 'toeic', difficulty: 'intermediate', title: 'Team Meeting', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', transcript: [{ time: 0, text: 'Good morning everyone, let us begin the meeting.' }, { time: 4, text: 'We need to discuss the quarterly sales report.' }, { time: 8, text: 'The marketing team has prepared a presentation.' }] },
  { id: 'l-t-i2', category: 'toeic', difficulty: 'intermediate', title: 'Business Trip', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', transcript: [{ time: 0, text: 'I will be traveling to New York next week.' }, { time: 4, text: 'The flight departs at 8:30 AM.' }, { time: 8, text: 'I have meetings scheduled for Monday and Tuesday.' }] },
  { id: 'l-t-i3', category: 'toeic', difficulty: 'intermediate', title: 'Customer Service', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', transcript: [{ time: 0, text: 'Thank you for calling our customer service line.' }, { time: 4, text: 'How can I assist you today?' }, { time: 8, text: 'I will check the status of your order right away.' }] },
  // TOEIC ADVANCED
  { id: 'l-t-a1', category: 'toeic', difficulty: 'advanced', title: 'Earnings Call', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', transcript: [{ time: 0, text: 'Revenue growth exceeded projections by 15 percent.' }, { time: 5, text: 'The acquisition of our competitor has strengthened our market position.' }, { time: 10, text: 'We anticipate continued expansion into Asian markets.' }] },
  { id: 'l-t-a2', category: 'toeic', difficulty: 'advanced', title: 'Strategic Planning', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', transcript: [{ time: 0, text: 'Our long-term strategy focuses on sustainable growth.' }, { time: 5, text: 'We will streamline operations to reduce overhead costs.' }, { time: 10, text: 'Stakeholder engagement remains our top priority.' }] },
  { id: 'l-t-a3', category: 'toeic', difficulty: 'advanced', title: 'Board Presentation', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', transcript: [{ time: 0, text: 'The quarterly results demonstrate significant improvement.' }, { time: 5, text: 'Our compliance department has implemented new procedures.' }, { time: 10, text: 'The depreciation of assets has been properly accounted for.' }] },
  // N2 BEGINNER
  { id: 'l-n-b1', category: 'n2', difficulty: 'beginner', title: 'Greetings', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', transcript: [{ time: 0, text: 'おはようございます。' }, { time: 3, text: '今日はいい天気ですね。' }, { time: 6, text: 'よろしくお願いします。' }] },
  { id: 'l-n-b2', category: 'n2', difficulty: 'beginner', title: 'Self Introduction', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', transcript: [{ time: 0, text: 'はじめまして、田中です。' }, { time: 3, text: '東京で働いています。' }, { time: 6, text: '趣味は読書です。' }] },
  { id: 'l-n-b3', category: 'n2', difficulty: 'beginner', title: 'Daily Shopping', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', transcript: [{ time: 0, text: 'すみません、りんごはどこですか。' }, { time: 4, text: 'ありがとうございます。' }, { time: 7, text: 'これをお願いします。' }] },
  // N2 INTERMEDIATE
  { id: 'l-n-i1', category: 'n2', difficulty: 'intermediate', title: 'Office Conversation', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', transcript: [{ time: 0, text: '来週の会議の資料は準備できましたか。' }, { time: 5, text: 'はい、昨日のうちに完成させました。' }, { time: 10, text: 'では、メールで送ってください。' }] },
  { id: 'l-n-i2', category: 'n2', difficulty: 'intermediate', title: 'Making Plans', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', transcript: [{ time: 0, text: '今週末は何をするつもりですか。' }, { time: 5, text: '友達と映画を見に行く予定です。' }, { time: 10, text: 'それから、レストランで dinner をします。' }] },
  { id: 'l-n-i3', category: 'n2', difficulty: 'intermediate', title: 'Telephone Call', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', transcript: [{ time: 0, text: 'もしもし、田中さんですか。' }, { time: 5, text: 'はい、そうです。何かご用ですか。' }, { time: 10, text: '明日の会議についてお聞きしたいのですが。' }] },
  // N2 ADVANCED
  { id: 'l-n-a1', category: 'n2', difficulty: 'advanced', title: 'Social Issues', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', transcript: [{ time: 0, text: '少子高齢化社会の課題について考えます。' }, { time: 5, text: '労働力の減少は大きな問題です。' }, { time: 10, text: '国際的な協力が不可欠です。' }] },
  { id: 'l-n-a2', category: 'n2', difficulty: 'advanced', title: 'Business Meeting', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', transcript: [{ time: 0, text: '今回のプロジェクトについて報告いたします。' }, { time: 5, text: '予算の把握と進捗管理が重要です。' }, { time: 10, text: '迅速に対応する必要があります。' }] },
  { id: 'l-n-a3', category: 'n2', difficulty: 'advanced', title: 'Academic Lecture', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', transcript: [{ time: 0, text: '今日の講義は環境問題についてです。' }, { time: 5, text: '地球温暖化の影響は深刻です。' }, { time: 10, text: '解決策を模索する必要があります。' }] },
];

export const MOCK_SPEAKING_LESSONS: SpeakingLesson[] = [
  // TOEIC BEGINNER
  { id: 's-t-b1', category: 'toeic', difficulty: 'beginner', targetSentence: 'How can I help you today?', translation: 'Tôi có thể giúp gì cho bạn?' },
  { id: 's-t-b2', category: 'toeic', difficulty: 'beginner', targetSentence: 'Nice to meet you.', translation: 'Rất vui được gặp bạn.' },
  { id: 's-t-b3', category: 'toeic', difficulty: 'beginner', targetSentence: 'Where is the meeting room?', translation: 'Phòng họp ở đâu?' },
  // TOEIC INTERMEDIATE
  { id: 's-t-i1', category: 'toeic', difficulty: 'intermediate', targetSentence: 'Could you please send me the report by Friday?', translation: 'Bạn có thể gửi cho tôi báo cáo trước thứ Sáu được không?' },
  { id: 's-t-i2', category: 'toeic', difficulty: 'intermediate', targetSentence: 'I would like to schedule a meeting with the manager.', translation: 'Tôi muốn sắp xếp cuộc họp với quản lý.' },
  { id: 's-t-i3', category: 'toeic', difficulty: 'intermediate', targetSentence: 'The project deadline has been extended to next month.', translation: 'Hạn chót dự án đã được gia hạn đến tháng sau.' },
  // TOEIC ADVANCED
  { id: 's-t-a1', category: 'toeic', difficulty: 'advanced', targetSentence: 'The board of directors is evaluating the acquisition proposal.', translation: 'Hội đồng quản trị đang đánh giá đề xuất thâu tóm.' },
  { id: 's-t-a2', category: 'toeic', difficulty: 'advanced', targetSentence: 'We need to streamline our operational processes.', translation: 'Chúng ta cần tinh giản quy trình vận hành.' },
  { id: 's-t-a3', category: 'toeic', difficulty: 'advanced', targetSentence: 'The depreciation of assets must be reported accurately.', translation: 'Sự khấu hao tài sản phải được báo cáo chính xác.' },
  // N2 BEGINNER
  { id: 's-n-b1', category: 'n2', difficulty: 'beginner', targetSentence: 'よろしくお願いします。', translation: 'Rất mong được giúp đỡ.' },
  { id: 's-n-b2', category: 'n2', difficulty: 'beginner', targetSentence: 'ありがとうございます。', translation: 'Cảm ơn bạn.' },
  { id: 's-n-b3', category: 'n2', difficulty: 'beginner', targetSentence: 'すみません、これはいくらですか。', translation: 'Xin lỗi, cái này giá bao nhiêu?' },
  // N2 INTERMEDIATE
  { id: 's-n-i1', category: 'n2', difficulty: 'intermediate', targetSentence: '来週の月曜日に会議があります。', translation: 'Có cuộc họp vào thứ Hai tuần sau.' },
  { id: 's-n-i2', category: 'n2', difficulty: 'intermediate', targetSentence: 'この資料を確認していただけますか。', translation: 'Bạn có thể kiểm tra tài liệu này được không?' },
  { id: 's-n-i3', category: 'n2', difficulty: 'intermediate', targetSentence: '予算を考慮する必要があります。', translation: 'Cần phải xem xét ngân sách.' },
  // N2 ADVANCED
  { id: 's-n-a1', category: 'n2', difficulty: 'advanced', targetSentence: '現状を正確に把握する必要がある。', translation: 'Cần nắm bắt chính xác hiện trạng.' },
  { id: 's-n-a2', category: 'n2', difficulty: 'advanced', targetSentence: '迅速に対応するための措置を講じます。', translation: 'Sẽ thực hiện các biện pháp để ứng phó nhanh chóng.' },
  { id: 's-n-a3', category: 'n2', difficulty: 'advanced', targetSentence: '国際的な協力なくして解決は不可能だ。', translation: 'Không có hợp tác quốc tế thì giải quyết là không thể.' },
];

export const MOCK_DICTATION_LESSONS: DictationLesson[] = [
  // TOEIC BEGINNER
  { id: 'd-t-b1', category: 'toeic', difficulty: 'beginner', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', targetText: 'I work at a law firm.', translation: 'Tôi làm việc tại một công ty luật.' },
  { id: 'd-t-b2', category: 'toeic', difficulty: 'beginner', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', targetText: 'The meeting is at 3 PM.', translation: 'Cuộc họp lúc 3 giờ chiều.' },
  { id: 'd-t-b3', category: 'toeic', difficulty: 'beginner', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', targetText: 'Please send me the email.', translation: 'Vui lòng gửi cho tôi email.' },
  // TOEIC INTERMEDIATE
  { id: 'd-t-i1', category: 'toeic', difficulty: 'intermediate', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', targetText: 'The quarterly report needs to be reviewed.', translation: 'Báo cáo quý cần được xem xét.' },
  { id: 'd-t-i2', category: 'toeic', difficulty: 'intermediate', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', targetText: 'We have to submit the proposal by Friday.', translation: 'Chúng ta phải nộp đề xuất trước thứ Sáu.' },
  { id: 'd-t-i3', category: 'toeic', difficulty: 'intermediate', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', targetText: 'The client requested additional information.', translation: 'Khách hàng yêu cầu thêm thông tin.' },
  // TOEIC ADVANCED
  { id: 'd-t-a1', category: 'toeic', difficulty: 'advanced', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', targetText: 'Unforeseen circumstances led to a significant delay.', translation: 'Các trường hợp không lường trước dẫn đến sự chậm trễ.' },
  { id: 'd-t-a2', category: 'toeic', difficulty: 'advanced', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', targetText: 'The acquisition expanded the firm market share.', translation: 'Vụ thâu tóm đã mở rộng thị phần của công ty.' },
  { id: 'd-t-a3', category: 'toeic', difficulty: 'advanced', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', targetText: 'Compliance with regulations is mandatory.', translation: 'Tuân thủ các quy định là bắt buộc.' },
  // N2 BEGINNER
  { id: 'd-n-b1', category: 'n2', difficulty: 'beginner', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', targetText: 'これは新しい本です。', translation: 'Đây là quyển sách mới.' },
  { id: 'd-n-b2', category: 'n2', difficulty: 'beginner', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', targetText: '明日は学校です。', translation: 'Ngày mai là ngày đi học.' },
  { id: 'd-n-b3', category: 'n2', difficulty: 'beginner', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', targetText: 'コーヒーを飲みませんか。', translation: 'Bạn có muốn uống cà phê không?' },
  // N2 INTERMEDIATE
  { id: 'd-n-i1', category: 'n2', difficulty: 'intermediate', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', targetText: '来週の会議に参加してください。', translation: 'Vui lòng tham gia cuộc họp tuần sau.' },
  { id: 'd-n-i2', category: 'n2', difficulty: 'intermediate', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', targetText: 'この問題を解決する必要があります。', translation: 'Cần giải quyết vấn đề này.' },
  { id: 'd-n-i3', category: 'n2', difficulty: 'intermediate', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', targetText: '予算を確認してから判断します。', translation: 'Sẽ quyết định sau khi kiểm tra ngân sách.' },
  // N2 ADVANCED
  { id: 'd-n-a1', category: 'n2', difficulty: 'advanced', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', targetText: '地球温暖化問題の解決には国際的な協力が不可欠だ。', translation: 'Hợp tác quốc tế là không thể thiếu cho vấn đề nóng lên toàn cầu.' },
  { id: 'd-n-a2', category: 'n2', difficulty: 'advanced', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', targetText: '経済に大きな影響を与える政策だ。', translation: 'Đây là chính sách có ảnh hưởng lớn đến nền kinh tế.' },
  { id: 'd-n-a3', category: 'n2', difficulty: 'advanced', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3', targetText: '制度の改革は避けて通れない。', translation: 'Cải cách hệ thống là không thể tránh khỏi.' },
];

export const MOCK_FULL_EXAMS: FullExam[] = [
  {
    id: 'fe-1',
    title: 'TOEIC Full Test 2023',
    year: 2023,
    category: 'toeic',
    tasks: [
      { type: 'listening', data: MOCK_LISTENING_LESSONS.find(l => l.id === 'l-t-a1')! },
      { type: 'quiz', data: MOCK_QUESTIONS[0] },
      { type: 'speaking', data: MOCK_SPEAKING_LESSONS.find(s => s.id === 's-t-a1')! },
      { type: 'dictation', data: MOCK_DICTATION_LESSONS.find(d => d.id === 'd-t-a1')! },
      { type: 'quiz', data: MOCK_QUESTIONS[1] },
      { type: 'quiz', data: MOCK_QUESTIONS[4] },
    ]
  },
  {
    id: 'fe-2',
    title: 'TOEIC Mini Test 2022',
    year: 2022,
    category: 'toeic',
    tasks: [
      { type: 'listening', data: MOCK_LISTENING_LESSONS.find(l => l.id === 'l-t-b1')! },
      { type: 'quiz', data: MOCK_QUESTIONS[2] },
      { type: 'speaking', data: MOCK_SPEAKING_LESSONS.find(s => s.id === 's-t-b1')! },
    ]
  },
  {
    id: 'fe-3',
    title: 'JLPT N2 Full Mock 2023',
    year: 2023,
    category: 'n2',
    tasks: [
      { type: 'listening', data: MOCK_LISTENING_LESSONS.find(l => l.id === 'l-n-a1')! },
      { type: 'quiz', data: MOCK_QUESTIONS[6] },
      { type: 'speaking', data: MOCK_SPEAKING_LESSONS.find(s => s.id === 's-n-a1')! },
      { type: 'dictation', data: MOCK_DICTATION_LESSONS.find(d => d.id === 'd-n-a1')! },
      { type: 'quiz', data: MOCK_QUESTIONS[8] },
    ]
  },
];
