import type { Question, ListeningLesson } from '../types';

export const MOCK_QUESTIONS: Question[] = [
  // --- REAL TOEIC QUESTIONS (ETS 2023-2024) ---
  {
    id: 'toeic-2023-101',
    category: 'toeic',
    text: 'When she held her last meeting, Ms. Toba ________ her sales staff to perform even better next quarter.',
    options: ['encourage', 'is encouraging', 'encouraged', 'was encouraged'],
    correctAnswer: 2,
    subCategory: 'Part 5'
  },
  {
    id: 'toeic-2024-101',
    category: 'toeic',
    text: 'Former CEO Ken Nakata spoke about his ________ career experiences.',
    options: ['extensive', 'extensively', 'extension', 'extend'],
    correctAnswer: 0,
    subCategory: 'Part 5'
  },

  // --- LATEST REAL TOEIC QUESTIONS (ETS 2025) ---
  {
    id: 'toeic-2025-101',
    category: 'toeic',
    text: 'The store donates ________ to local charities each month to help those in need.',
    options: ['they', 'their', 'them', 'themselves'],
    correctAnswer: 2,
    subCategory: 'Part 5'
  },
  {
    id: 'toeic-2025-102',
    category: 'toeic',
    text: '________ the city is repairing Sabo Road, commuters are advised to use alternate routes.',
    options: ['During', 'While', 'Between', 'Among'],
    correctAnswer: 1,
    subCategory: 'Part 5'
  },
  {
    id: 'toeic-2025-106',
    category: 'toeic',
    text: 'The blender includes ________ blades that can easily crush ice and frozen fruits.',
    options: ['sharp', 'sharply', 'sharpen', 'sharpness'],
    correctAnswer: 0,
    subCategory: 'Part 5'
  },
  {
    id: 'toeic-2025-test4-101',
    category: 'toeic',
    text: 'Each participant in the debate will have an ________ amount of speaking time.',
    options: ['equally', 'equalize', 'equality', 'equal'],
    correctAnswer: 3,
    subCategory: 'Part 5'
  },

  // --- REAL JLPT N2 QUESTIONS (2023-2024) ---
  {
    id: 'n2-2023-q1',
    category: 'n2',
    text: '私の３人の兄はみんな料理が苦手で、一番上の兄（　　　）、卵もうまく割れない。',
    options: ['にかけては', 'に至っては', 'に際しては', 'に即しては'],
    correctAnswer: 1,
    subCategory: 'Grammar'
  },

  // --- LATEST REAL JLPT N2 QUESTIONS (2025) ---
  {
    id: 'n2-2025-12-q1',
    category: 'n2',
    text: '今朝は寝坊をしてしまい、朝食（　　　）大学に来た。',
    options: ['抜きで', '反面', 'どころか', 'につき'],
    correctAnswer: 0,
    subCategory: 'Grammar'
  },
  {
    id: 'n2-2025-12-q2',
    category: 'n2',
    text: '新しいコーヒーカップを使い始めて（　　　）、床に落として割ってしまった。',
    options: ['いくらもたたないうちに', 'が早いか', 'そばから', 'なり'],
    correctAnswer: 0,
    subCategory: 'Grammar'
  },
  {
    id: 'n2-2025-12-q3',
    category: 'n2',
    text: '「一日乗車券」は、ご購入いただいた（　　　）、何度でも自由に乗り降りできます。',
    options: ['当日に限り', '当日を問わず', '当日のみならず', '当日を抜きにして'],
    correctAnswer: 0,
    subCategory: 'Grammar'
  },
  {
    id: 'n2-2025-07-q1',
    category: 'n2',
    text: 'この魚は骨が多くて（　　　）。',
    options: ['食べにくい', '食べるべきだ', '食べそうだ', '食べるようだ'],
    correctAnswer: 0,
    subCategory: 'Grammar'
  },
  {
    id: 'n2-2025-07-q2',
    category: 'n2',
    text: '悪いことはもう絶対にしないと（　　　）。',
    options: ['誓った', '願った', '祈った', '頼んだ'],
    correctAnswer: 0,
    subCategory: 'Vocabulary'
  }
];

export const MOCK_LISTENING_LESSONS: ListeningLesson[] = [
  {
    id: 'l1',
    category: 'toeic',
    title: 'TOEIC Part 4: Business Announcement',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder audio
    transcript: [
      { time: 0, text: 'Attention all employees of Glintech Corporation.', translation: 'Chú ý toàn thể nhân viên tập đoàn Glintech.' },
      { time: 5, text: 'Please be advised that the main elevator will be under maintenance tomorrow morning.', translation: 'Vui lòng lưu ý rằng thang máy chính sẽ được bảo trì vào sáng mai.' },
      { time: 12, text: 'The work is expected to be completed by noon.', translation: 'Công việc dự kiến sẽ hoàn thành trước buổi trưa.' },
      { time: 18, text: 'Thank you for your cooperation.', translation: 'Cảm ơn sự hợp tác của các bạn.' }
    ]
  },
  {
    id: 'l2',
    category: 'n2',
    title: 'JLPT N2 Listening: Chotto-shita News',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Placeholder audio
    transcript: [
      { time: 0, text: '次は、新しい市役所の建設についてのニュースです。', translation: 'Tiếp theo là tin tức về việc xây dựng tòa thị chính mới.' },
      { time: 6, text: '来月から、駅の北側で工事が始まることになりました。', translation: 'Từ tháng sau, công trình sẽ được bắt đầu ở phía bắc nhà ga.' },
      { time: 13, text: 'このプロジェクトには、約２年の歳月がかかる見込みです。', translation: 'Dự án này dự kiến sẽ mất khoảng 2 năm.' }
    ]
  }
];
