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

export const MOCK_FULL_EXAMS: FullExam[] = [
  {
    id: 'fe-1',
    title: 'TOEIC Full Test 2023',
    year: 2023,
    category: 'toeic',
    tasks: [
      { type: 'listening', data: MOCK_LISTENING_LESSONS[0] },
      { type: 'quiz', data: MOCK_QUESTIONS[0] },
      { type: 'speaking', data: MOCK_SPEAKING_LESSONS[0] },
      { type: 'dictation', data: MOCK_DICTATION_LESSONS[0] },
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
      { type: 'listening', data: MOCK_LISTENING_LESSONS[1] },
      { type: 'quiz', data: MOCK_QUESTIONS[2] },
      { type: 'speaking', data: MOCK_SPEAKING_LESSONS[2] },
    ]
  },
  {
    id: 'fe-3',
    title: 'JLPT N2 Full Mock 2023',
    year: 2023,
    category: 'n2',
    tasks: [
      { type: 'listening', data: MOCK_LISTENING_LESSONS[2] },
      { type: 'quiz', data: MOCK_QUESTIONS[6] },
      { type: 'speaking', data: MOCK_SPEAKING_LESSONS[1] },
      { type: 'dictation', data: MOCK_DICTATION_LESSONS[1] },
      { type: 'quiz', data: MOCK_QUESTIONS[8] },
    ]
  },
];
