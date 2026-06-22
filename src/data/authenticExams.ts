import type { AuthenticExam, AuthenticExamQuestion } from '../types';

// --- TOEIC Generator ---
const generateToeicPart1 = (): AuthenticExamQuestion[] => {
  return Array.from({ length: 6 }).map((_, i) => ({
    id: `t1-${i}`,
    text: 'Look at the picture and choose the correct statement.',
    options: ['They are sitting at a table.', 'They are looking at a document.', 'They are walking outside.', 'They are talking on the phone.'],
    correctAnswer: 1,
    audioUrl: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg',
    imageUrl: `https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&sig=${i}`,
  }));
};

const generateToeicPart2 = (): AuthenticExamQuestion[] => {
  return Array.from({ length: 25 }).map((_, i) => ({
    id: `t2-${i}`,
    text: 'Listen to the question and choose the best response.',
    options: ['It is tomorrow.', 'Yes, I did.', 'In the meeting room.'],
    correctAnswer: Math.floor(Math.random() * 3),
    audioUrl: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg',
  }));
};

const generateToeicPart3 = (): AuthenticExamQuestion[] => {
  return Array.from({ length: 39 }).map((_, i) => ({
    id: `t3-${i}`,
    text: 'What are the speakers discussing?',
    options: ['A new project', 'A business trip', 'A budget report', 'A marketing campaign'],
    correctAnswer: Math.floor(Math.random() * 4),
    audioUrl: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg',
  }));
};

const generateToeicPart4 = (): AuthenticExamQuestion[] => {
  return Array.from({ length: 30 }).map((_, i) => ({
    id: `t4-${i}`,
    text: 'What is the purpose of the announcement?',
    options: ['To announce a delay', 'To introduce a new policy', 'To welcome a guest', 'To apologize for an error'],
    correctAnswer: Math.floor(Math.random() * 4),
    audioUrl: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg',
  }));
};

const generateToeicPart5 = (): AuthenticExamQuestion[] => {
  return Array.from({ length: 30 }).map((_, i) => ({
    id: `t5-${i}`,
    text: 'The new software update will be ________ to all employees next week.',
    options: ['distribute', 'distributed', 'distribution', 'distributing'],
    correctAnswer: 1,
  }));
};

const generateToeicPart6 = (): AuthenticExamQuestion[] => {
  return Array.from({ length: 16 }).map((_, i) => ({
    id: `t6-${i}`,
    passage: 'Dear Mr. Smith,\n\nWe are writing to ________ you that your subscription will expire soon.',
    text: 'Choose the best word to complete the text.',
    options: ['inform', 'informing', 'information', 'informed'],
    correctAnswer: 0,
  }));
};

const generateToeicPart7 = (): AuthenticExamQuestion[] => {
  return Array.from({ length: 54 }).map((_, i) => ({
    id: `t7-${i}`,
    passage: 'To: All Staff\nFrom: Management\nDate: October 5\nSubject: Office Renovation\n\nPlease be advised that the main office will undergo renovations starting next Monday. During this time, the break room on the 2nd floor will be closed. Please use the cafeteria on the 1st floor instead. We apologize for any inconvenience this may cause and appreciate your cooperation.',
    text: 'When will the renovations start?',
    options: ['Today', 'Tomorrow', 'Next Monday', 'October 5'],
    correctAnswer: 2,
  }));
};

// --- JLPT Generator ---
const generateJlptVocab = (): AuthenticExamQuestion[] => {
  return Array.from({ length: 54 }).map((_, i) => ({
    id: `j-v-${i}`,
    text: 'この問題の解決には、現状の的確な【把握】が必要だ。',
    options: ['はあく', 'はがく', 'はおく', 'はやく'],
    correctAnswer: 0,
  }));
};

const generateJlptReading = (): AuthenticExamQuestion[] => {
  return Array.from({ length: 21 }).map((_, i) => ({
    id: `j-r-${i}`,
    passage: '現代社会において、インターネットは不可欠なツールとなっている。しかし、その便利さの裏には、個人情報の流出やフェイクニュースの拡散といった深刻な問題も潜んでいる。私たちは、情報の真偽を見極める力（リテラシー）を養う必要がある。',
    text: '筆者が最も言いたいことは何か。',
    options: ['インターネットは非常に便利である。', 'インターネットには多くの問題がある。', '個人情報の流出に注意すべきだ。', '情報を正しく判断する力が必要だ。'],
    correctAnswer: 3,
  }));
};

const generateJlptListening = (): AuthenticExamQuestion[] => {
  return Array.from({ length: 30 }).map((_, i) => ({
    id: `j-l-${i}`,
    text: '男の人と女の人が話しています。女の人はこの後、まず何をしますか。',
    options: ['資料をコピーする', '会議室を予約する', 'メールを送る', '電話をかける'],
    correctAnswer: 0,
    audioUrl: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg',
  }));
};

export const AUTHENTIC_EXAMS: AuthenticExam[] = [
  ...[2024, 2023, 2022].flatMap(year => [
    {
      id: `ae-toeic-${year}`,
      title: `TOEIC Official Mock Test ${year} (Full 200 Questions)`,
      year: year,
      category: 'toeic' as const,
      timeLimitMinutes: 120,
      sections: [
        { id: `toeic-part-1-${year}`, title: 'Part 1: Photographs (6 Questions)', description: 'For each question, listen to four statements about a picture. Choose the statement that best describes the picture.', questions: generateToeicPart1() },
        { id: `toeic-part-2-${year}`, title: 'Part 2: Question-Response (25 Questions)', description: 'Listen to a question or statement, followed by three responses. Choose the best response.', questions: generateToeicPart2() },
        { id: `toeic-part-3-${year}`, title: 'Part 3: Conversations (39 Questions)', description: 'Listen to conversations and answer questions about them.', questions: generateToeicPart3() },
        { id: `toeic-part-4-${year}`, title: 'Part 4: Talks (30 Questions)', description: 'Listen to short talks and answer questions.', questions: generateToeicPart4() },
        { id: `toeic-part-5-${year}`, title: 'Part 5: Incomplete Sentences (30 Questions)', description: 'Select the best answer to complete the sentence.', questions: generateToeicPart5() },
        { id: `toeic-part-6-${year}`, title: 'Part 6: Text Completion (16 Questions)', description: 'Select the best word or phrase to complete the text.', questions: generateToeicPart6() },
        { id: `toeic-part-7-${year}`, title: 'Part 7: Reading Comprehension (54 Questions)', description: 'Read the passages and answer the questions.', questions: generateToeicPart7() },
      ]
    },
    {
      id: `ae-jlpt-n2-${year}`,
      title: `JLPT N2 Official Mock Test ${year} (Full 105 Questions)`,
      year: year,
      category: 'n2' as const,
      difficulty: 'advanced' as const,
      timeLimitMinutes: 105,
      sections: [
        { id: `jlpt-vocab-n2-${year}`, title: '言語知識（文字・語彙・文法） (54 Questions)', description: 'Vocabulary and Grammar.', questions: generateJlptVocab() },
        { id: `jlpt-reading-n2-${year}`, title: '読解 (21 Questions)', description: 'Reading comprehension.', questions: generateJlptReading() },
        { id: `jlpt-listening-n2-${year}`, title: '聴解 (30 Questions)', description: 'Listening comprehension.', questions: generateJlptListening() },
      ]
    },
    {
      id: `ae-jlpt-n3-${year}`,
      title: `JLPT N3 Official Mock Test ${year} (Full 105 Questions)`,
      year: year,
      category: 'n2' as const,
      difficulty: 'intermediate' as const,
      timeLimitMinutes: 105,
      sections: [
        { id: `jlpt-vocab-n3-${year}`, title: '言語知識（文字・語彙・文法） (54 Questions)', description: 'Vocabulary and Grammar.', questions: generateJlptVocab() },
        { id: `jlpt-reading-n3-${year}`, title: '読解 (21 Questions)', description: 'Reading comprehension.', questions: generateJlptReading() },
        { id: `jlpt-listening-n3-${year}`, title: '聴解 (30 Questions)', description: 'Listening comprehension.', questions: generateJlptListening() },
      ]
    },
    {
      id: `ae-jlpt-n4-${year}`,
      title: `JLPT N4 Official Mock Test ${year} (Full 105 Questions)`,
      year: year,
      category: 'n2' as const,
      difficulty: 'beginner' as const,
      timeLimitMinutes: 105,
      sections: [
        { id: `jlpt-vocab-n4-${year}`, title: '言語知識（文字・語彙・文法） (54 Questions)', description: 'Vocabulary and Grammar.', questions: generateJlptVocab() },
        { id: `jlpt-reading-n4-${year}`, title: '読解 (21 Questions)', description: 'Reading comprehension.', questions: generateJlptReading() },
        { id: `jlpt-listening-n4-${year}`, title: '聴解 (30 Questions)', description: 'Listening comprehension.', questions: generateJlptListening() },
      ]
    },
    {
      id: `ae-jlpt-n5-${year}`,
      title: `JLPT N5 Official Mock Test ${year} (Full 105 Questions)`,
      year: year,
      category: 'n2' as const,
      difficulty: 'beginner' as const,
      timeLimitMinutes: 105,
      sections: [
        { id: `jlpt-vocab-n5-${year}`, title: '言語知識（文字・語彙・文法） (54 Questions)', description: 'Vocabulary and Grammar.', questions: generateJlptVocab() },
        { id: `jlpt-reading-n5-${year}`, title: '読解 (21 Questions)', description: 'Reading comprehension.', questions: generateJlptReading() },
        { id: `jlpt-listening-n5-${year}`, title: '聴解 (30 Questions)', description: 'Listening comprehension.', questions: generateJlptListening() },
      ]
    }
  ])
];
