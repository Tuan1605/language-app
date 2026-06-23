import type { AuthenticExam } from '../types';

export const AUTHENTIC_EXAMS: AuthenticExam[] = [
  {
    id: 'toeic-mock-1',
    title: 'TOEIC Mock Exam - ETS Format',
    year: 2024,
    category: 'toeic',
    timeLimitMinutes: 120,
    sections: [
      {
        id: 'sec-t-1',
        title: 'Part 1: Photographs',
        description: 'Listen to 4 statements about a picture and choose the best one.',
        questions: [
          {
            id: 't-1-1',
            text: 'Look at the picture and choose the correct statement.',
            imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400',
            options: ['A. They are reading a book.', 'B. They are sitting around a table.', 'C. They are cooking food.', 'D. They are driving a car.'],
            correctAnswer: 1,
            explanation: 'B is correct because the people are sitting at a conference table.'
          }
        ]
      },
      {
        id: 'sec-t-2',
        title: 'Part 2: Question-Response',
        description: 'Listen to a question and 3 possible responses. Choose the best response.',
        questions: [
          {
            id: 't-2-1',
            text: 'When is the project deadline?',
            options: ['A. Yes, it is.', 'B. By next Friday.', 'C. In the meeting room.'],
            correctAnswer: 1,
            explanation: 'The question asks for a time (When).'
          }
        ]
      },
      {
        id: 'sec-t-3',
        title: 'Part 3: Conversations',
        description: 'Listen to a conversation and answer 3 questions.',
        questions: [
          {
            id: 't-3-1',
            passage: '[Audio Transcript Mock] \nMan: Hi, I have an appointment with Dr. Smith at 3 PM.\nWoman: Please take a seat. He is finishing up with a patient.',
            text: 'Where does this conversation likely take place?',
            options: ['A. At a restaurant', 'B. At a clinic', 'C. At a bank', 'D. At a post office'],
            correctAnswer: 1,
            explanation: 'The mention of "Dr. Smith" and "patient" suggests a clinic.'
          }
        ]
      },
      {
        id: 'sec-t-4',
        title: 'Part 4: Talks',
        description: 'Listen to a short talk and answer questions.',
        questions: [
          {
            id: 't-4-1',
            passage: 'Attention all passengers. Flight 402 to Tokyo is now boarding at Gate 12.',
            text: 'Who is the intended audience of this announcement?',
            options: ['A. Train commuters', 'B. Airline passengers', 'C. Hotel guests', 'D. Store customers'],
            correctAnswer: 1,
            explanation: 'The announcement mentions "Flight 402" and "boarding".'
          }
        ]
      },
      {
        id: 'sec-t-5',
        title: 'Part 5: Incomplete Sentences',
        description: 'Choose the word that best completes the sentence.',
        questions: [
          {
            id: 't-5-1',
            text: 'The new software is _____ easier to use than the old version.',
            options: ['A. much', 'B. many', 'C. more', 'D. most'],
            correctAnswer: 0,
            explanation: '"Much" is used to emphasize comparative adjectives.'
          }
        ]
      },
      {
        id: 'sec-t-6',
        title: 'Part 6: Text Completion',
        description: 'Choose the best word or phrase to complete the text.',
        questions: [
          {
            id: 't-6-1',
            passage: 'To all staff:\nPlease note that the cafeteria will be _____ for renovations next week.',
            text: 'Choose the correct word.',
            options: ['A. close', 'B. closed', 'C. closing', 'D. closes'],
            correctAnswer: 1,
            explanation: 'Passive voice: will be + V3/ed.'
          }
        ]
      },
      {
        id: 'sec-t-7',
        title: 'Part 7: Reading Comprehension',
        description: 'Read the passage and answer the questions.',
        questions: [
          {
            id: 't-7-1',
            passage: 'We are pleased to announce that Mr. John Doe has been promoted to Vice President of Sales. He has been with the company for 10 years and has consistently exceeded his targets.',
            text: 'How long has Mr. Doe worked at the company?',
            options: ['A. 5 years', 'B. 10 years', 'C. 15 years', 'D. 20 years'],
            correctAnswer: 1,
            explanation: 'The text states: "He has been with the company for 10 years".'
          }
        ]
      }
    ]
  },
  {
    id: 'jlpt-n2-mock-1',
    title: 'JLPT N2 Mock Exam',
    year: 2024,
    category: 'n2',
    timeLimitMinutes: 105,
    sections: [
      {
        id: 'sec-n-1',
        title: '言語知識（文字・語彙・文法）',
        description: 'Kiến thức ngôn ngữ (Chữ Hán, Từ vựng, Ngữ pháp)',
        questions: [
          {
            id: 'n-1-1',
            text: 'この文章の【把握】の読み方として最も適切なものを一つ選びなさい。',
            options: ['A. はあく', 'B. はやく', 'C. ばあく', 'D. ばやく'],
            correctAnswer: 0,
            explanation: '把握 đọc là はあく (nắm bắt).'
          },
          {
            id: 'n-1-2',
            text: '雨が降っている【　　】、試合は決行される。',
            options: ['A. にもかかわらず', 'B. とともに', 'C. からには', 'D. にきまっている'],
            correctAnswer: 0,
            explanation: 'にもかかわらず mang nghĩa "mặc dù".'
          }
        ]
      },
      {
        id: 'sec-n-2',
        title: '読解 (Đọc hiểu)',
        description: 'Đọc đoạn văn và trả lời câu hỏi.',
        questions: [
          {
            id: 'n-2-1',
            passage: '現代社会において、スマートフォンの普及は人々の生活を大きく変えた。しかし、それに伴う問題も少なくない。',
            text: '筆者の考えとして最も適切なものはどれか。',
            options: ['A. スマホは問題だらけだ', 'B. スマホは便利だが課題もある', 'C. スマホは生活を変えなかった', 'D. スマホは必要ない'],
            correctAnswer: 1,
            explanation: 'Tác giả nói smartphone làm thay đổi lớn (tiện lợi) nhưng cũng có nhiều vấn đề đi kèm.'
          }
        ]
      },
      {
        id: 'sec-n-3',
        title: '聴解 (Nghe hiểu)',
        description: 'Nghe đoạn hội thoại và chọn đáp án.',
        questions: [
          {
            id: 'n-3-1',
            passage: '男：明日の会議、何時からだっけ？\n女：10時からだよ。でも部長が15分前に集まるようにって。',
            text: '男の人は明日、何時に集まらなければなりませんか。',
            options: ['A. 9時45分', 'B. 10時', 'C. 10時15分', 'D. 9時30分'],
            correctAnswer: 0,
            explanation: 'Họp lúc 10h, tập trung trước 15 phút -> 9h45.'
          }
        ]
      }
    ]
  }
];
