import type { Question, ListeningLesson, Flashcard, SpeakingLesson, DictationLesson } from '../types';

// --- ULTIMATE REPOSITORY (TOEIC 700+ & JLPT N2) ---

export const MOCK_CARDS: Flashcard[] = [
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
  { id: 'f-1', user_id: 'guest', word: 'あ', definition: 'Hiragana A', language: 'japanese', category: 'n2', difficulty: 'beginner', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: 'f-2', user_id: 'guest', word: 'Hello', definition: 'Xin chào', language: 'english', category: 'toeic', difficulty: 'beginner', repetition: 0, interval: 0, easiness: 2.5, next_review: new Date().toISOString(), created_at: new Date().toISOString() },
];

export const MOCK_QUESTIONS: Question[] = [
  { id: 'tq-1', category: 'toeic', difficulty: 'advanced', text: 'The merger was delayed ________ unforeseen regulatory hurdles.', options: ['because', 'since', 'due to', 'despite'], correctAnswer: 2 },
  { id: 'tq-2', category: 'toeic', difficulty: 'intermediate', text: 'The project will be finished ________ next Friday.', options: ['by', 'until', 'at', 'on'], correctAnswer: 0 },
  { id: 'nq-1', category: 'n2', difficulty: 'advanced', text: 'あんなに一生懸命練習した（　　　）、試合に負けてしまった。', options: ['からには', 'ものだから', 'にかかわらず', 'にもかかわらず'], correctAnswer: 3 },
  { id: 'nq-2', category: 'n2', difficulty: 'beginner', text: 'これは本（　　　）です。', options: ['に', 'は', 'を', 'も'], correctAnswer: 1 },
];

export const MOCK_LISTENING_LESSONS: ListeningLesson[] = [
  { id: 'l-1', category: 'toeic', difficulty: 'advanced', title: 'Earnings Call', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', transcript: [{ time: 0, text: 'Revenue growth exceeded projections.' }] },
  { id: 'l-2', category: 'toeic', difficulty: 'beginner', title: 'Introduction', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', transcript: [{ time: 0, text: 'My name is Alex.' }] },
  { id: 'l-3', category: 'n2', difficulty: 'advanced', title: 'Social Aging', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', transcript: [{ time: 0, text: '少子高齢化社会の課題について。' }] },
  { id: 'l-4', category: 'n2', difficulty: 'beginner', title: 'Greetings', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', transcript: [{ time: 0, text: 'おはようございます。' }] },
];

export const MOCK_SPEAKING_LESSONS: SpeakingLesson[] = [
  { id: 's-1', category: 'toeic', difficulty: 'advanced', targetSentence: 'The board of directors is evaluating the acquisition.', translation: 'HĐQT đang đánh giá vụ thâu tóm.' },
  { id: 's-2', category: 'n2', difficulty: 'advanced', targetSentence: '現状を正確に把握する必要がある。', translation: 'Cần nắm bắt chính xác hiện trạng.' },
  { id: 's-3', category: 'toeic', difficulty: 'beginner', targetSentence: 'How can I help you today?', translation: 'Tôi có thể giúp gì cho bạn?' },
  { id: 's-4', category: 'n2', difficulty: 'beginner', targetSentence: 'よろしくお願いします。', translation: 'Rất mong được giúp đỡ.' },
];

export const MOCK_DICTATION_LESSONS: DictationLesson[] = [
  { id: 'd-1', category: 'toeic', difficulty: 'advanced', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', targetText: 'Unforeseen circumstances led to a significant delay.', translation: 'Các trường hợp không lường trước dẫn đến sự chậm trễ.' },
  { id: 'd-2', category: 'n2', difficulty: 'advanced', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', targetText: '地球温暖化問題の解決には国際的な協力が不可欠だ。', translation: 'Hợp tác quốc tế là không thể thiếu cho vấn đề nóng lên toàn cầu.' },
  { id: 'd-3', category: 'toeic', difficulty: 'beginner', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', targetText: 'I work at a law firm.', translation: 'Tôi làm việc tại một công ty luật.' },
  { id: 'd-4', category: 'n2', difficulty: 'beginner', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', targetText: 'これは新しい本です。', translation: 'Đây là quyển sách mới.' },
];
