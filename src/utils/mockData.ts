import type { Question, ListeningLesson, Flashcard, SpeakingLesson, DictationLesson, FullExam, SessionTask, WritingLesson } from '../types';

// --- ULTIMATE REPOSITORY (TOEIC 700+ & JLPT N2) ---
// Original practice material only. Not copied from official exams.

const BASE_CARDS: Flashcard[] = [
  // --- TOEIC HIGH-FREQUENCY ---
  { id: 't-1', user_id: 'guest', word: 'Incentive', definition: 'Sự khuyến khích, ưu đãi', example: 'The bonus serves as an incentive.', imageUrl: 'https://picsum.photos/seed/Incentive/400/300', language: 'english', category: 'toeic', difficulty: 'intermediate', topic: 'Business', state: 'New', reps: 0, lapses: 0, stability: 0, fsrs_difficulty: 0, next_review: null, created_at: new Date().toISOString() },
  { id: 't-2', user_id: 'guest', word: 'Delegate', definition: 'Ủy thác, giao phó', example: 'Managers must delegate tasks effectively.', imageUrl: 'https://picsum.photos/seed/Delegate/400/300', language: 'english', category: 'toeic', difficulty: 'intermediate', topic: 'Business', state: 'New', reps: 0, lapses: 0, stability: 0, fsrs_difficulty: 0, next_review: null, created_at: new Date().toISOString() },
  { id: 't-3', user_id: 'guest', word: 'Requirement', definition: 'Yêu cầu bắt buộc', imageUrl: 'https://picsum.photos/seed/Requirement/400/300', language: 'english', category: 'toeic', difficulty: 'beginner', topic: 'General', state: 'New', reps: 0, lapses: 0, stability: 0, fsrs_difficulty: 0, next_review: null, created_at: new Date().toISOString() },
  { id: 't-4', user_id: 'guest', word: 'Procedure', definition: 'Quy trình, thủ tục', imageUrl: 'https://picsum.photos/seed/Procedure/400/300', language: 'english', category: 'toeic', difficulty: 'beginner', topic: 'Office', state: 'New', reps: 0, lapses: 0, stability: 0, fsrs_difficulty: 0, next_review: null, created_at: new Date().toISOString() },
  { id: 't-5', user_id: 'guest', word: 'Compliance', definition: 'Sự tuân thủ', imageUrl: 'https://picsum.photos/seed/Compliance/400/300', language: 'english', category: 'toeic', difficulty: 'advanced', topic: 'Legal', state: 'New', reps: 0, lapses: 0, stability: 0, fsrs_difficulty: 0, next_review: null, created_at: new Date().toISOString() },
  { id: 't-6', user_id: 'guest', word: 'Acquisition', definition: 'Sự thâu tóm/mua lại', imageUrl: 'https://picsum.photos/seed/Acquisition/400/300', language: 'english', category: 'toeic', difficulty: 'advanced', topic: 'Business', state: 'New', reps: 0, lapses: 0, stability: 0, fsrs_difficulty: 0, next_review: null, created_at: new Date().toISOString() },

  // --- JLPT N2 CORE ---
  { id: 'n-1', user_id: 'guest', word: '把握 (はあく)', definition: 'Nắm bắt, thấu hiểu', imageUrl: 'https://picsum.photos/seed/haaku/400/300', language: 'japanese', category: 'n2', difficulty: 'intermediate', topic: 'Academic', state: 'New', reps: 0, lapses: 0, stability: 0, fsrs_difficulty: 0, next_review: null, created_at: new Date().toISOString() },
  { id: 'n-2', user_id: 'guest', word: '考慮 (こうりょ)', definition: 'Xem xét, cân nhắc', imageUrl: 'https://picsum.photos/seed/kouryo/400/300', language: 'japanese', category: 'n2', difficulty: 'intermediate', topic: 'Academic', state: 'New', reps: 0, lapses: 0, stability: 0, fsrs_difficulty: 0, next_review: null, created_at: new Date().toISOString() },
  { id: 'n-3', user_id: 'guest', word: '徹底 (てってい)', definition: 'Triệt để', imageUrl: 'https://picsum.photos/seed/tettei/400/300', language: 'japanese', category: 'n2', difficulty: 'advanced', topic: 'Work', state: 'New', reps: 0, lapses: 0, stability: 0, fsrs_difficulty: 0, next_review: null, created_at: new Date().toISOString() },
  { id: 'n-4', user_id: 'guest', word: '迅速 (じんそく)', definition: 'Nhanh chóng', imageUrl: 'https://picsum.photos/seed/jinsoku/400/300', language: 'japanese', category: 'n2', difficulty: 'advanced', topic: 'Work', state: 'New', reps: 0, lapses: 0, stability: 0, fsrs_difficulty: 0, next_review: null, created_at: new Date().toISOString() },

  // --- BEGINNER ---
  { id: 'f-2', user_id: 'guest', word: 'Hello', definition: 'Xin chào', imageUrl: 'https://picsum.photos/seed/Hello/400/300', language: 'english', category: 'toeic', difficulty: 'beginner', topic: 'Daily Life', state: 'New', reps: 0, lapses: 0, stability: 0, fsrs_difficulty: 0, next_review: null, created_at: new Date().toISOString() },
];

// Combine the small built-in demo cards with the larger JSON seed library.
export const MOCK_CARDS: Flashcard[] = [...BASE_CARDS];

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
  { id: 'nq-3', category: 'n2', difficulty: 'intermediate', text: '大雨（　　　）試合は中止された。', options: ['によって', 'によると', 'のせいで', 'のおかげで'], correctAnswer: 2, subCategory: 'Grammar' },
  { id: 'nq-4', category: 'n2', difficulty: 'advanced', text: 'この問題は、一晩考え（　　　）末、ようやく解決できた。', options: ['ぬいた', 'きった', 'あげた', 'とおした'], correctAnswer: 0, subCategory: 'Grammar' },
  { id: 'nq-5', category: 'n2', difficulty: 'intermediate', text: '彼の話は（　　　）ばかりで、内容がない。', options: ['うそ', 'ほんと', '冗談', '事実'], correctAnswer: 0, subCategory: 'Vocabulary' },
  { id: 'nq-6', category: 'n2', difficulty: 'advanced', text: '文章を読んで、筆者の主張を答えなさい。[...]', options: ['A', 'B', 'C', 'D'], correctAnswer: 2, subCategory: 'Reading' },
];

// Combine built-in demo questions with the larger JSON seed bank.
export const MOCK_QUESTIONS: Question[] = [...BASE_QUESTIONS];

export const MOCK_LISTENING_LESSONS: ListeningLesson[] = [
  // ═══════════════════════════════════════════════════════════════
  //  TOEIC BEGINNER (20 lessons)
  // ═══════════════════════════════════════════════════════════════
  { id: 'l-t-b1', category: 'toeic', difficulty: 'beginner', title: 'Self Introduction', transcript: [{ time: 0, text: 'Hello, my name is John Smith.' }, { time: 3, text: 'I am a marketing manager.' }, { time: 6, text: 'Nice to meet you.' }] },
  { id: 'l-t-b2', category: 'toeic', difficulty: 'beginner', title: 'Daily Routine', transcript: [{ time: 0, text: 'I wake up at 7 AM every day.' }, { time: 3, text: 'I take the bus to work.' }, { time: 6, text: 'I start work at 9 AM.' }] },
  { id: 'l-t-b3', category: 'toeic', difficulty: 'beginner', title: 'Office Basics', transcript: [{ time: 0, text: 'This is my desk.' }, { time: 3, text: 'I use a computer for my work.' }, { time: 6, text: 'The office is on the second floor.' }] },
  { id: 'l-t-b4', category: 'toeic', difficulty: 'beginner', title: 'Asking Directions', transcript: [{ time: 0, text: 'Excuse me, where is the restroom?' }, { time: 3, text: 'It is down the hall on the left.' }, { time: 6, text: 'Thank you very much.' }] },
  { id: 'l-t-b5', category: 'toeic', difficulty: 'beginner', title: 'At the Restaurant', transcript: [{ time: 0, text: 'Can I see the menu, please?' }, { time: 3, text: 'I would like a coffee and a sandwich.' }, { time: 6, text: 'How much is the total?' }] },
  { id: 'l-t-b6', category: 'toeic', difficulty: 'beginner', title: 'Shopping', transcript: [{ time: 0, text: 'How much does this shirt cost?' }, { time: 3, text: 'It costs twenty-five dollars.' }, { time: 6, text: 'I will take it. Thank you.' }] },
  { id: 'l-t-b7', category: 'toeic', difficulty: 'beginner', title: 'Weather', transcript: [{ time: 0, text: 'What is the weather like today?' }, { time: 3, text: 'It is sunny and warm.' }, { time: 6, text: 'It might rain tomorrow.' }] },
  { id: 'l-t-b8', category: 'toeic', difficulty: 'beginner', title: 'Phone Call', transcript: [{ time: 0, text: 'Hello, may I speak to Mr. Brown?' }, { time: 3, text: 'He is not in the office right now.' }, { time: 6, text: 'Can I take a message?' }] },
  { id: 'l-t-b9', category: 'toeic', difficulty: 'beginner', title: 'Time and Date', transcript: [{ time: 0, text: 'What time does the meeting start?' }, { time: 3, text: 'The meeting starts at 2 PM.' }, { time: 6, text: 'It is on Monday, March 5th.' }] },
  { id: 'l-t-b10', category: 'toeic', difficulty: 'beginner', title: 'Transportation', transcript: [{ time: 0, text: 'How do you get to work?' }, { time: 3, text: 'I usually take the subway.' }, { time: 6, text: 'It takes about 30 minutes.' }] },
  { id: 'l-t-b11', category: 'toeic', difficulty: 'beginner', title: 'Booking a Room', transcript: [{ time: 0, text: 'I would like to book a conference room.' }, { time: 3, text: 'Which day do you need it?' }, { time: 6, text: 'I need it for Friday afternoon.' }] },
  { id: 'l-t-b12', category: 'toeic', difficulty: 'beginner', title: 'Hotel Check-in', transcript: [{ time: 0, text: 'I have a reservation under the name Smith.' }, { time: 3, text: 'Your room is on the third floor.' }, { time: 6, text: 'Breakfast is served from 7 to 9 AM.' }] },
  { id: 'l-t-b13', category: 'toeic', difficulty: 'beginner', title: 'Post Office', transcript: [{ time: 0, text: 'I would like to send this package.' }, { time: 3, text: 'Where is it going?' }, { time: 6, text: 'It should arrive in three to five days.' }] },
  { id: 'l-t-b14', category: 'toeic', difficulty: 'beginner', title: 'Bank Visit', transcript: [{ time: 0, text: 'I need to open a savings account.' }, { time: 3, text: 'Please fill out this form.' }, { time: 6, text: 'You will need two forms of identification.' }] },
  { id: 'l-t-b15', category: 'toeic', difficulty: 'beginner', title: 'Doctor Appointment', transcript: [{ time: 0, text: 'I would like to make an appointment.' }, { time: 3, text: 'Is next Tuesday at 10 AM okay?' }, { time: 6, text: 'Yes, that works for me.' }] },
  { id: 'l-t-b16', category: 'toeic', difficulty: 'beginner', title: 'Library', transcript: [{ time: 0, text: 'Can I borrow this book?' }, { time: 3, text: 'You can keep it for two weeks.' }, { time: 6, text: 'There is a late fee of one dollar per day.' }] },
  { id: 'l-t-b17', category: 'toeic', difficulty: 'beginner', title: 'Airport', transcript: [{ time: 0, text: 'Flight 305 to London is now boarding.' }, { time: 3, text: 'Please have your boarding pass ready.' }, { time: 6, text: 'The gate closes in 15 minutes.' }] },
  { id: 'l-t-b18', category: 'toeic', difficulty: 'beginner', title: 'Gym Membership', transcript: [{ time: 0, text: 'I am interested in joining the gym.' }, { time: 3, text: 'We have monthly and yearly plans.' }, { time: 6, text: 'The monthly plan is forty dollars.' }] },
  { id: 'l-t-b19', category: 'toeic', difficulty: 'beginner', title: 'Taxi Ride', transcript: [{ time: 0, text: 'Can you take me to the train station?' }, { time: 3, text: 'It will take about 15 minutes.' }, { time: 6, text: 'The fare is twelve dollars.' }] },
  { id: 'l-t-b20', category: 'toeic', difficulty: 'beginner', title: 'Supermarket', transcript: [{ time: 0, text: 'Where can I find the dairy products?' }, { time: 3, text: 'They are in aisle 5.' }, { time: 6, text: 'We also have a sale on bread today.' }] },

  // ═══════════════════════════════════════════════════════════════
  //  TOEIC INTERMEDIATE (20 lessons)
  // ═══════════════════════════════════════════════════════════════
  { id: 'l-t-i1', category: 'toeic', difficulty: 'intermediate', title: 'Team Meeting', transcript: [{ time: 0, text: 'Good morning everyone, let us begin the meeting.' }, { time: 4, text: 'We need to discuss the quarterly sales report.' }, { time: 8, text: 'The marketing team has prepared a presentation.' }, { time: 12, text: 'Let us go through the key findings together.' }] },
  { id: 'l-t-i2', category: 'toeic', difficulty: 'intermediate', title: 'Business Trip', transcript: [{ time: 0, text: 'I will be traveling to New York next week.' }, { time: 4, text: 'The flight departs at 8:30 AM.' }, { time: 8, text: 'I have meetings scheduled for Monday and Tuesday.' }, { time: 12, text: 'I will return on Wednesday evening.' }] },
  { id: 'l-t-i3', category: 'toeic', difficulty: 'intermediate', title: 'Customer Service', transcript: [{ time: 0, text: 'Thank you for calling our customer service line.' }, { time: 4, text: 'How can I assist you today?' }, { time: 8, text: 'I will check the status of your order right away.' }, { time: 12, text: 'Your order should arrive within three business days.' }] },
  { id: 'l-t-i4', category: 'toeic', difficulty: 'intermediate', title: 'Project Update', transcript: [{ time: 0, text: 'The project is currently on schedule.' }, { time: 4, text: 'We have completed the first two phases.' }, { time: 8, text: 'The next phase involves user testing.' }, { time: 12, text: 'We expect to finish by the end of the quarter.' }] },
  { id: 'l-t-i5', category: 'toeic', difficulty: 'intermediate', title: 'Job Interview', transcript: [{ time: 0, text: 'Tell me about your previous work experience.' }, { time: 4, text: 'I worked as an account manager for five years.' }, { time: 8, text: 'I was responsible for handling key client relationships.' }, { time: 12, text: 'I increased client retention by 20 percent.' }] },
  { id: 'l-t-i6', category: 'toeic', difficulty: 'intermediate', title: 'Office Announcement', transcript: [{ time: 0, text: 'Attention all employees.' }, { time: 3, text: 'The company picnic has been rescheduled to next Saturday.' }, { time: 7, text: 'Please sign up at the front desk if you plan to attend.' }, { time: 11, text: 'Families are welcome to join.' }] },
  { id: 'l-t-i7', category: 'toeic', difficulty: 'intermediate', title: 'Training Session', transcript: [{ time: 0, text: 'Today we will cover the new software system.' }, { time: 4, text: 'First, I will demonstrate the basic features.' }, { time: 8, text: 'Then you will have time to practice on your own.' }, { time: 12, text: 'Please do not hesitate to ask questions.' }] },
  { id: 'l-t-i8', category: 'toeic', difficulty: 'intermediate', title: 'Budget Discussion', transcript: [{ time: 0, text: 'We need to review our departmental budget.' }, { time: 4, text: 'Travel expenses have exceeded the forecast.' }, { time: 8, text: 'We should consider reducing non-essential spending.' }, { time: 12, text: 'I will prepare a revised budget proposal by Friday.' }] },
  { id: 'l-t-i9', category: 'toeic', difficulty: 'intermediate', title: 'Product Launch', transcript: [{ time: 0, text: 'The new product line will launch next month.' }, { time: 4, text: 'Marketing materials are being finalized.' }, { time: 8, text: 'We have received positive feedback from beta testers.' }, { time: 12, text: 'Pre-orders are now available on our website.' }] },
  { id: 'l-t-i10', category: 'toeic', difficulty: 'intermediate', title: 'Quarterly Review', transcript: [{ time: 0, text: 'Sales increased by 12 percent compared to last quarter.' }, { time: 4, text: 'Our strongest market was the Asia-Pacific region.' }, { time: 8, text: 'However, European sales were slightly below target.' }, { time: 12, text: 'We need to focus on improving our European strategy.' }] },
  { id: 'l-t-i11', category: 'toeic', difficulty: 'intermediate', title: 'Supply Chain Update', transcript: [{ time: 0, text: 'There is a delay in our supply chain.' }, { time: 4, text: 'The main supplier has reported a shortage of raw materials.' }, { time: 8, text: 'We are working with alternative suppliers.' }, { time: 12, text: 'We expect normal delivery to resume in two weeks.' }] },
  { id: 'l-t-i12', category: 'toeic', difficulty: 'intermediate', title: 'HR Policy Changes', transcript: [{ time: 0, text: 'There are several changes to our HR policies.' }, { time: 4, text: 'Remote work will now be available three days a week.' }, { time: 8, text: 'The dress code has been updated to business casual.' }, { time: 12, text: 'Please review the updated employee handbook.' }] },
  { id: 'l-t-i13', category: 'toeic', difficulty: 'intermediate', title: 'Client Feedback', transcript: [{ time: 0, text: 'We received feedback from our largest client.' }, { time: 4, text: 'They are generally satisfied with our services.' }, { time: 8, text: 'However, they would like faster response times.' }, { time: 12, text: 'We should implement a priority support system.' }] },
  { id: 'l-t-i14', category: 'toeic', difficulty: 'intermediate', title: 'Trade Show', transcript: [{ time: 0, text: 'Our company will exhibit at the trade show next month.' }, { time: 4, text: 'We need volunteers to staff the booth.' }, { time: 8, text: 'Product demonstrations will run every hour.' }, { time: 12, text: 'Marketing will provide the promotional materials.' }] },
  { id: 'l-t-i15', category: 'toeic', difficulty: 'intermediate', title: 'Warehouse Tour', transcript: [{ time: 0, text: 'Welcome to our main distribution center.' }, { time: 4, text: 'This facility processes over 10,000 orders daily.' }, { time: 8, text: 'We recently upgraded our sorting system.' }, { time: 12, text: 'Safety equipment must be worn at all times.' }] },
  { id: 'l-t-i16', category: 'toeic', difficulty: 'intermediate', title: 'Contract Negotiation', transcript: [{ time: 0, text: 'We would like to discuss the terms of the contract.' }, { time: 4, text: 'The payment schedule needs to be adjusted.' }, { time: 8, text: 'We propose a 60-day payment term instead of 30.' }, { time: 12, text: 'We are open to negotiation on this point.' }] },
  { id: 'l-t-i17', category: 'toeic', difficulty: 'intermediate', title: 'Technology Upgrade', transcript: [{ time: 0, text: 'The IT department will be upgrading all computers.' }, { time: 4, text: 'The upgrades will take place over the weekend.' }, { time: 8, text: 'Please save all your work before Friday evening.' }, { time: 12, text: 'New software will be installed on Monday morning.' }] },
  { id: 'l-t-i18', category: 'toeic', difficulty: 'intermediate', title: 'Shipping Inquiry', transcript: [{ time: 0, text: 'I am calling about an order I placed last week.' }, { time: 4, text: 'Could you provide me with the tracking number?' }, { time: 8, text: 'The package was shipped on Tuesday.' }, { time: 12, text: 'It should be delivered by this Friday.' }] },
  { id: 'l-t-i19', category: 'toeic', difficulty: 'intermediate', title: 'Performance Review', transcript: [{ time: 0, text: 'Let us discuss your performance this quarter.' }, { time: 4, text: 'You have met all your sales targets.' }, { time: 8, text: 'Your teamwork skills have been excellent.' }, { time: 12, text: 'I would like to discuss your goals for next quarter.' }] },
  { id: 'l-t-i20', category: 'toeic', difficulty: 'intermediate', title: 'Conference Call', transcript: [{ time: 0, text: 'Can everyone hear me clearly?' }, { time: 3, text: 'I would like to share my screen.' }, { time: 6, text: 'Let me walk you through the proposal.' }, { time: 10, text: 'Please hold your questions until the end.' }] },

  // ═══════════════════════════════════════════════════════════════
  //  TOEIC ADVANCED (20 lessons)
  // ═══════════════════════════════════════════════════════════════
  { id: 'l-t-a1', category: 'toeic', difficulty: 'advanced', title: 'Earnings Call', transcript: [{ time: 0, text: 'Revenue growth exceeded projections by 15 percent.' }, { time: 5, text: 'The acquisition of our competitor has strengthened our market position.' }, { time: 10, text: 'We anticipate continued expansion into Asian markets.' }, { time: 15, text: 'Operating margins improved due to cost optimization initiatives.' }] },
  { id: 'l-t-a2', category: 'toeic', difficulty: 'advanced', title: 'Strategic Planning', transcript: [{ time: 0, text: 'Our long-term strategy focuses on sustainable growth.' }, { time: 5, text: 'We will streamline operations to reduce overhead costs.' }, { time: 10, text: 'Stakeholder engagement remains our top priority.' }, { time: 15, text: 'We are exploring strategic partnerships in emerging markets.' }] },
  { id: 'l-t-a3', category: 'toeic', difficulty: 'advanced', title: 'Board Presentation', transcript: [{ time: 0, text: 'The quarterly results demonstrate significant improvement.' }, { time: 5, text: 'Our compliance department has implemented new procedures.' }, { time: 10, text: 'The depreciation of assets has been properly accounted for.' }, { time: 15, text: 'Shareholder value has increased by 18 percent year over year.' }] },
  { id: 'l-t-a4', category: 'toeic', difficulty: 'advanced', title: 'Merger Discussion', transcript: [{ time: 0, text: 'The proposed merger would create the largest firm in the sector.' }, { time: 5, text: 'Due diligence has revealed no significant liabilities.' }, { time: 10, text: 'Regulatory approval is expected within six months.' }, { time: 15, text: 'Integration planning will begin immediately after approval.' }] },
  { id: 'l-t-a5', category: 'toeic', difficulty: 'advanced', title: 'Risk Assessment', transcript: [{ time: 0, text: 'Our risk management framework has been updated.' }, { time: 5, text: 'Currency fluctuations pose the greatest threat to our margins.' }, { time: 10, text: 'We have implemented hedging strategies to mitigate exposure.' }, { time: 15, text: 'Cybersecurity risks are being addressed through new protocols.' }] },
  { id: 'l-t-a6', category: 'toeic', difficulty: 'advanced', title: 'Market Analysis', transcript: [{ time: 0, text: 'Consumer spending patterns have shifted significantly.' }, { time: 5, text: 'E-commerce now accounts for 40 percent of total retail sales.' }, { time: 10, text: 'Brands that fail to adapt will lose market share rapidly.' }, { time: 15, text: 'Our digital transformation initiative is well positioned for this trend.' }] },
  { id: 'l-t-a7', category: 'toeic', difficulty: 'advanced', title: 'Sustainability Report', transcript: [{ time: 0, text: 'Our carbon emissions decreased by 25 percent this year.' }, { time: 5, text: 'We have transitioned to renewable energy in all major facilities.' }, { time: 10, text: 'The sustainability committee will publish its annual findings.' }, { time: 15, text: 'Investors are increasingly prioritizing environmental stewardship.' }] },
  { id: 'l-t-a8', category: 'toeic', difficulty: 'advanced', title: 'Legal Compliance', transcript: [{ time: 0, text: 'The new data privacy regulations take effect next quarter.' }, { time: 5, text: 'All departments must complete the mandatory compliance training.' }, { time: 10, text: 'Failure to comply may result in substantial penalties.' }, { time: 15, text: 'Our legal team has drafted updated terms of service.' }] },
  { id: 'l-t-a9', category: 'toeic', difficulty: 'advanced', title: 'Investor Relations', transcript: [{ time: 0, text: 'We hosted an investor day last week to discuss our five-year plan.' }, { time: 5, text: 'Analysts responded positively to our diversification strategy.' }, { time: 10, text: 'The stock price rose three percent following the announcement.' }, { time: 15, text: 'We remain committed to returning value to our shareholders.' }] },
  { id: 'l-t-a10', category: 'toeic', difficulty: 'advanced', title: 'International Expansion', transcript: [{ time: 0, text: 'We are opening three new offices in Southeast Asia.' }, { time: 5, text: 'Local partnerships will facilitate market entry.' }, { time: 10, text: 'We expect to generate revenue within the first year of operations.' }, { time: 15, text: 'Hiring for key leadership positions is already underway.' }] },
  { id: 'l-t-a11', category: 'toeic', difficulty: 'advanced', title: 'Financial Audit', transcript: [{ time: 0, text: 'The external audit has been completed without major findings.' }, { time: 5, text: 'Minor discrepancies were identified in the accounts receivable.' }, { time: 10, text: 'These have been rectified and documented accordingly.' }, { time: 15, text: 'The auditors have issued an unqualified opinion.' }] },
  { id: 'l-t-a12', category: 'toeic', difficulty: 'advanced', title: 'Corporate Restructuring', transcript: [{ time: 0, text: 'As part of our restructuring plan, two divisions will be consolidated.' }, { time: 5, text: 'Affected employees will be offered redeployment opportunities.' }, { time: 10, text: 'We anticipate annual savings of twelve million dollars.' }, { time: 15, text: 'The restructuring should be completed by the end of this fiscal year.' }] },
  { id: 'l-t-a13', category: 'toeic', difficulty: 'advanced', title: 'Patent Filing', transcript: [{ time: 0, text: 'Our research team has developed a breakthrough technology.' }, { time: 5, text: 'We have filed for patent protection in 15 countries.' }, { time: 10, text: 'This innovation could disrupt the entire industry.' }, { time: 15, text: 'Licensing agreements are already being negotiated.' }] },
  { id: 'l-t-a14', category: 'toeic', difficulty: 'advanced', title: 'Supply Chain Resilience', transcript: [{ time: 0, text: 'Recent disruptions have highlighted vulnerabilities in our supply chain.' }, { time: 5, text: 'We are diversifying our supplier base to reduce concentration risk.' }, { time: 10, text: 'Inventory buffers have been increased for critical components.' }, { time: 15, text: 'A dedicated task force is monitoring geopolitical developments.' }] },
  { id: 'l-t-a15', category: 'toeic', difficulty: 'advanced', title: 'Employee Engagement', transcript: [{ time: 0, text: 'Our annual employee engagement survey showed a satisfaction rate of 82 percent.' }, { time: 5, text: 'Areas for improvement include career development opportunities.' }, { time: 10, text: 'We are launching a mentorship program for high-potential employees.' }, { time: 15, text: 'Flexible work arrangements will be expanded further.' }] },
  { id: 'l-t-a16', category: 'toeic', difficulty: 'advanced', title: 'Competitive Landscape', transcript: [{ time: 0, text: 'Our primary competitor has announced a major product launch.' }, { time: 5, text: 'Market intelligence suggests they are targeting our customer base.' }, { time: 10, text: 'We must accelerate our own product development timeline.' }, { time: 15, text: 'Customer loyalty programs will be critical for retention.' }] },
  { id: 'l-t-a17', category: 'toeic', difficulty: 'advanced', title: 'Digital Transformation', transcript: [{ time: 0, text: 'Our digital transformation is progressing ahead of schedule.' }, { time: 5, text: 'Cloud migration has been completed for all core systems.' }, { time: 10, text: 'Automation has reduced processing times by 40 percent.' }, { time: 15, text: 'The return on investment exceeded initial projections.' }] },
  { id: 'l-t-a18', category: 'toeic', difficulty: 'advanced', title: 'Corporate Governance', transcript: [{ time: 0, text: 'The board has approved new governance guidelines.' }, { time: 5, text: 'Independent directors now constitute a majority of the board.' }, { time: 10, text: 'Executive compensation will be tied more closely to performance.' }, { time: 15, text: 'These changes align with best practices in corporate governance.' }] },
  { id: 'l-t-a19', category: 'toeic', difficulty: 'advanced', title: 'Crisis Management', transcript: [{ time: 0, text: 'A product recall has been initiated due to a manufacturing defect.' }, { time: 5, text: 'Our crisis communication team is managing media inquiries.' }, { time: 10, text: 'Customer safety is our top priority.' }, { time: 15, text: 'We have identified the root cause and implemented corrective measures.' }] },
  { id: 'l-t-a20', category: 'toeic', difficulty: 'advanced', title: 'Talent Acquisition', transcript: [{ time: 0, text: 'Attracting top talent remains a key strategic priority.' }, { time: 5, text: 'We are strengthening our employer brand through campus outreach.' }, { time: 10, text: 'The average time to fill positions has decreased by 30 percent.' }, { time: 15, text: 'Diversity and inclusion metrics have improved across all departments.' }] },

  // ═══════════════════════════════════════════════════════════════
  //  N2 BEGINNER (20 lessons)
  // ═══════════════════════════════════════════════════════════════
  { id: 'l-n-b1', category: 'n2', difficulty: 'beginner', title: 'Greetings', transcript: [{ time: 0, text: 'おはようございます。' }, { time: 3, text: '今日はいい天気ですね。' }, { time: 6, text: 'よろしくお願いします。' }] },
  { id: 'l-n-b2', category: 'n2', difficulty: 'beginner', title: 'Self Introduction', transcript: [{ time: 0, text: 'はじめまして、田中です。' }, { time: 3, text: '東京で働いています。' }, { time: 6, text: '趣味は読書です。' }] },
  { id: 'l-n-b3', category: 'n2', difficulty: 'beginner', title: 'Daily Shopping', transcript: [{ time: 0, text: 'すみません、りんごはどこですか。' }, { time: 4, text: 'ありがとうございます。' }, { time: 7, text: 'これをお願いします。' }] },
  { id: 'l-n-b4', category: 'n2', difficulty: 'beginner', title: 'At the Station', transcript: [{ time: 0, text: '東京駅まで、いくらですか。' }, { time: 3, text: '片道200円です。' }, { time: 6, text: '次の電車は何時ですか。' }] },
  { id: 'l-n-b5', category: 'n2', difficulty: 'beginner', title: 'Weather Talk', transcript: [{ time: 0, text: '今日は暑いですね。' }, { time: 3, text: '明日は雨が降るそうです。' }, { time: 6, text: '傘を持って行った方がいいですよ。' }] },
  { id: 'l-n-b6', category: 'n2', difficulty: 'beginner', title: 'Restaurant Order', transcript: [{ time: 0, text: 'いらっしゃいませ。何名様ですか。' }, { time: 3, text: '2人です。ラーメンを二つお願いします。' }, { time: 6, text: 'かしこまりました。少々お待ちください。' }] },
  { id: 'l-n-b7', category: 'n2', difficulty: 'beginner', title: 'Asking for Help', transcript: [{ time: 0, text: 'すみません、トイレはどこですか。' }, { time: 3, text: 'あちらの右側にあります。' }, { time: 6, text: 'ありがとうございます。' }] },
  { id: 'l-n-b8', category: 'n2', difficulty: 'beginner', title: 'Hobby Talk', transcript: [{ time: 0, text: '趣味は何ですか。' }, { time: 3, text: '映画を見ることが好きです。' }, { time: 6, text: '最近、日本の映画にはまっています。' }] },
  { id: 'l-n-b9', category: 'n2', difficulty: 'beginner', title: 'Family Introduction', transcript: [{ time: 0, text: '家族は4人です。' }, { time: 3, text: '父と母と妹がいます。' }, { time: 6, text: '妹は大学生です。' }] },
  { id: 'l-n-b10', category: 'n2', difficulty: 'beginner', title: 'Shopping for Clothes', transcript: [{ time: 0, text: 'このTシャツはいくらですか。' }, { time: 3, text: '2,500円です。' }, { time: 6, text: 'もう少し安いのはありますか。' }] },
  { id: 'l-n-b11', category: 'n2', difficulty: 'beginner', title: 'At the Post Office', transcript: [{ time: 0, text: 'この手紙をアメリカに送りたいです。' }, { time: 3, text: '航空便で一週間ぐらいかかります。' }, { time: 6, text: '切手はいくらですか。' }] },
  { id: 'l-n-b12', category: 'n2', difficulty: 'beginner', title: 'Convenience Store', transcript: [{ time: 0, text: '袋はいりますか。' }, { time: 3, text: 'はい、お願いします。' }, { time: 6, text: 'お支払いは現金ですか、カードですか。' }] },
  { id: 'l-n-b13', category: 'n2', difficulty: 'beginner', title: 'Morning Routine', transcript: [{ time: 0, text: '毎朝6時に起きます。' }, { time: 3, text: 'シャワーを浴びて、朝ごはんを食べます。' }, { time: 6, text: '8時に家を出ます。' }] },
  { id: 'l-n-b14', category: 'n2', difficulty: 'beginner', title: 'Weekend Plans', transcript: [{ time: 0, text: '週末は何をしますか。' }, { time: 3, text: '友達と公園に行きます。' }, { time: 6, text: 'お弁当を持って行く予定です。' }] },
  { id: 'l-n-b15', category: 'n2', difficulty: 'beginner', title: 'At the Hospital', transcript: [{ time: 0, text: '頭が痛いです。' }, { time: 3, text: 'いつからですか。' }, { time: 6, text: '昨日の夜からです。' }] },
  { id: 'l-n-b16', category: 'n2', difficulty: 'beginner', title: 'Taking a Bus', transcript: [{ time: 0, text: 'このバスは新宿に行きますか。' }, { time: 3, text: 'いいえ、渋谷行きです。' }, { time: 6, text: '新宿行きは3番乗り場です。' }] },
  { id: 'l-n-b17', category: 'n2', difficulty: 'beginner', title: 'Lost Item', transcript: [{ time: 0, text: '財布をなくしました。' }, { time: 3, text: 'どこでなくしましたか。' }, { time: 6, text: '電車の中だと思います。' }] },
  { id: 'l-n-b18', category: 'n2', difficulty: 'beginner', title: 'Phone Call', transcript: [{ time: 0, text: 'もしもし、山田です。' }, { time: 3, text: '明日の約束の時間を変更してもいいですか。' }, { time: 6, text: '3時から5時に変更お願いします。' }] },
  { id: 'l-n-b19', category: 'n2', difficulty: 'beginner', title: 'At the Library', transcript: [{ time: 0, text: 'この本を借りたいのですが。' }, { time: 3, text: 'カードをお持ちですか。' }, { time: 6, text: '2週間で返してください。' }] },
  { id: 'l-n-b20', category: 'n2', difficulty: 'beginner', title: 'Directions', transcript: [{ time: 0, text: '駅はどこですか。' }, { time: 3, text: 'まっすぐ行って、右に曲がってください。' }, { time: 6, text: '5分ぐらいで着きます。' }] },

  // ═══════════════════════════════════════════════════════════════
  //  N2 INTERMEDIATE (20 lessons)
  // ═══════════════════════════════════════════════════════════════
  { id: 'l-n-i1', category: 'n2', difficulty: 'intermediate', title: 'Office Conversation', transcript: [{ time: 0, text: '来週の会議の資料は準備できましたか。' }, { time: 5, text: 'はい、昨日のうちに完成させました。' }, { time: 10, text: 'では、メールで送ってください。' }, { time: 14, text: '承知いたしました。本日中にお送りします。' }] },
  { id: 'l-n-i2', category: 'n2', difficulty: 'intermediate', title: 'Making Plans', transcript: [{ time: 0, text: '今週末は何をするつもりですか。' }, { time: 5, text: '友達と映画を見に行く予定です。' }, { time: 10, text: 'それから、レストランで食事をします。' }, { time: 14, text: '楽しそうですね。いい週末を。' }] },
  { id: 'l-n-i3', category: 'n2', difficulty: 'intermediate', title: 'Telephone Call', transcript: [{ time: 0, text: 'もしもし、田中さんですか。' }, { time: 5, text: 'はい、そうです。何かご用ですか。' }, { time: 10, text: '明日の会議についてお聞きしたいのですが。' }, { time: 14, text: '会議は午後2時から始まる予定です。' }] },
  { id: 'l-n-i4', category: 'n2', difficulty: 'intermediate', title: 'Travel Planning', transcript: [{ time: 0, text: '夏休みに北海道に行こうと思っています。' }, { time: 5, text: 'いいですね。飛行機で行きますか。' }, { time: 10, text: '新幹線で行くつもりです。景色を楽しみたいので。' }, { time: 14, text: 'ホテルはもう予約しましたか。' }] },
  { id: 'l-n-i5', category: 'n2', difficulty: 'intermediate', title: 'Apartment Hunting', transcript: [{ time: 0, text: '新しいアパートを探しています。' }, { time: 5, text: '駅から近い方がいいですか。' }, { time: 10, text: 'はい、徒歩10分以内が理想です。' }, { time: 14, text: '家賃の予算はいくらぐらいですか。' }] },
  { id: 'l-n-i6', category: 'n2', difficulty: 'intermediate', title: 'Job Search', transcript: [{ time: 0, text: '転職を考えているのですが。' }, { time: 5, text: 'どんな仕事に興味がありますか。' }, { time: 10, text: 'マーケティング関係の仕事を探しています。' }, { time: 14, text: '履歴書と職務経歴書を準備してください。' }] },
  { id: 'l-n-i7', category: 'n2', difficulty: 'intermediate', title: 'Company Introduction', transcript: [{ time: 0, text: '弊社は1990年に設立されました。' }, { time: 5, text: '主にITソリューションを提供しています。' }, { time: 10, text: '従業員は約500名です。' }, { time: 14, text: '東京と大阪にオフィスがあります。' }] },
  { id: 'l-n-i8', category: 'n2', difficulty: 'intermediate', title: 'Health Check-up', transcript: [{ time: 0, text: '定期健康診断の結果が出ました。' }, { time: 5, text: '血圧は正常値でした。' }, { time: 10, text: 'ただ、コレステロール値が少し高いです。' }, { time: 14, text: '食生活を見直す必要がありますね。' }] },
  { id: 'l-n-i9', category: 'n2', difficulty: 'intermediate', title: 'Asking Permission', transcript: [{ time: 0, text: '来週の水曜日にお休みをいただきたいのですが。' }, { time: 5, text: '理由を教えていただけますか。' }, { time: 10, text: '病院に行く必要がありまして。' }, { time: 14, text: 'わかりました。申請書を出してください。' }] },
  { id: 'l-n-i10', category: 'n2', difficulty: 'intermediate', title: 'Book Recommendation', transcript: [{ time: 0, text: '最近読んだ本でおすすめはありますか。' }, { time: 5, text: 'この小説がとても面白かったです。' }, { time: 10, text: '日本の文化について深く書かれています。' }, { time: 14, text: '今度図書館で借りてみます。' }] },
  { id: 'l-n-i11', category: 'n2', difficulty: 'intermediate', title: 'Event Planning', transcript: [{ time: 0, text: '来月の送別会の準備をしましょう。' }, { time: 5, text: '場所はどこにしますか。' }, { time: 10, text: '駅前のレストランはどうでしょうか。' }, { time: 14, text: '予算は一人3,000円ぐらいがいいと思います。' }] },
  { id: 'l-n-i12', category: 'n2', difficulty: 'intermediate', title: 'Complaint', transcript: [{ time: 0, text: '注文した商品が届いていないのですが。' }, { time: 5, text: '申し訳ございません。確認いたします。' }, { time: 10, text: '配送中のトラブルがあったようです。' }, { time: 14, text: '明日中に再配送いたします。' }] },
  { id: 'l-n-i13', category: 'n2', difficulty: 'intermediate', title: 'New Employee', transcript: [{ time: 0, text: '本日から入社した鈴木です。' }, { time: 5, text: '前職では営業をしていました。' }, { time: 10, text: '早く仕事に慣れるよう頑張ります。' }, { time: 14, text: 'ご指導よろしくお願いいたします。' }] },
  { id: 'l-n-i14', category: 'n2', difficulty: 'intermediate', title: 'Project Discussion', transcript: [{ time: 0, text: 'このプロジェクトの締め切りはいつですか。' }, { time: 5, text: '今月末までに完了する必要があります。' }, { time: 10, text: '人手が足りないかもしれません。' }, { time: 14, text: '必要であれば、応援を頼みましょう。' }] },
  { id: 'l-n-i15', category: 'n2', difficulty: 'intermediate', title: 'Cultural Exchange', transcript: [{ time: 0, text: '日本のお祭りに参加したことがありますか。' }, { time: 5, text: 'はい、去年花火大会に行きました。' }, { time: 10, text: '浴衣を着て、とても楽しかったです。' }, { time: 14, text: '今年は盆踊りにも参加してみたいです。' }] },
  { id: 'l-n-i16', category: 'n2', difficulty: 'intermediate', title: 'Moving Out', transcript: [{ time: 0, text: '来月引っ越す予定です。' }, { time: 5, text: '引っ越し業者はもう決めましたか。' }, { time: 10, text: 'まだです。おすすめはありますか。' }, { time: 14, text: 'この会社が安くて丁寧ですよ。' }] },
  { id: 'l-n-i17', category: 'n2', difficulty: 'intermediate', title: 'Cooking Lesson', transcript: [{ time: 0, text: '今日は肉じゃがの作り方を教えます。' }, { time: 5, text: 'まず、じゃがいもと玉ねぎを切ってください。' }, { time: 10, text: '鍋に油を入れて、肉を炒めます。' }, { time: 14, text: '醤油とみりんで味付けをします。' }] },
  { id: 'l-n-i18', category: 'n2', difficulty: 'intermediate', title: 'Recommendation Letter', transcript: [{ time: 0, text: '推薦状をお願いしたいのですが。' }, { time: 5, text: '何のための推薦状ですか。' }, { time: 10, text: '大学院への進学のためです。' }, { time: 14, text: 'わかりました。来週までに書きますね。' }] },
  { id: 'l-n-i19', category: 'n2', difficulty: 'intermediate', title: 'Volunteering', transcript: [{ time: 0, text: '地域のボランティア活動に参加しませんか。' }, { time: 5, text: 'どんな活動ですか。' }, { time: 10, text: '公園の清掃活動です。毎月第一日曜日に行います。' }, { time: 14, text: '興味があります。参加したいです。' }] },
  { id: 'l-n-i20', category: 'n2', difficulty: 'intermediate', title: 'Study Abroad', transcript: [{ time: 0, text: '来年留学する予定です。' }, { time: 5, text: 'どこの国に行くんですか。' }, { time: 10, text: 'オーストラリアに1年間行きます。' }, { time: 14, text: '英語力を伸ばすのが目標です。' }] },

  // ═══════════════════════════════════════════════════════════════
  //  N2 ADVANCED (20 lessons)
  // ═══════════════════════════════════════════════════════════════
  { id: 'l-n-a1', category: 'n2', difficulty: 'advanced', title: 'Social Issues', transcript: [{ time: 0, text: '少子高齢化社会の課題について考えます。' }, { time: 5, text: '労働力の減少は大きな問題です。' }, { time: 10, text: '国際的な協力が不可欠です。' }, { time: 15, text: '政府は対策を急ぐ必要があります。' }] },
  { id: 'l-n-a2', category: 'n2', difficulty: 'advanced', title: 'Business Meeting', transcript: [{ time: 0, text: '今回のプロジェクトについて報告いたします。' }, { time: 5, text: '予算の把握と進捗管理が重要です。' }, { time: 10, text: '迅速に対応する必要があります。' }, { time: 15, text: '来週までに改善案を提出してください。' }] },
  { id: 'l-n-a3', category: 'n2', difficulty: 'advanced', title: 'Academic Lecture', transcript: [{ time: 0, text: '今日の講義は環境問題についてです。' }, { time: 5, text: '地球温暖化の影響は深刻です。' }, { time: 10, text: '解決策を模索する必要があります。' }, { time: 15, text: '一人一人の意識改革が求められています。' }] },
  { id: 'l-n-a4', category: 'n2', difficulty: 'advanced', title: 'Economic Analysis', transcript: [{ time: 0, text: '日本の経済成長率は過去10年間低迷しています。' }, { time: 5, text: '構造改革なくして成長は見込めません。' }, { time: 10, text: 'イノベーションの推進が鍵となります。' }, { time: 15, text: '海外市場への進出も重要な戦略です。' }] },
  { id: 'l-n-a5', category: 'n2', difficulty: 'advanced', title: 'Medical Conference', transcript: [{ time: 0, text: '新しい治療法の臨床試験の結果を発表します。' }, { time: 5, text: '患者の回復率は従来の方法と比べて30%向上しました。' }, { time: 10, text: '副作用は最小限に抑えられています。' }, { time: 15, text: '今後はさらなる研究が必要です。' }] },
  { id: 'l-n-a6', category: 'n2', difficulty: 'advanced', title: 'Legal Discussion', transcript: [{ time: 0, text: '今回の契約書には注意すべき条項があります。' }, { time: 5, text: '賠償責任の範囲が曖昧です。' }, { time: 10, text: '相手方と再交渉する必要があります。' }, { time: 15, text: '法務部門の意見を聞いてから判断しましょう。' }] },
  { id: 'l-n-a7', category: 'n2', difficulty: 'advanced', title: 'Technology Trends', transcript: [{ time: 0, text: 'AIの発展は社会に大きな変革をもたらしています。' }, { time: 5, text: '自動化によって労働市場が変わりつつあります。' }, { time: 10, text: '新しいスキルの習得が求められています。' }, { time: 15, text: 'テクノロジーと共存する社会を目指すべきです。' }] },
  { id: 'l-n-a8', category: 'n2', difficulty: 'advanced', title: 'Education Reform', transcript: [{ time: 0, text: '教育制度の改革が議論されています。' }, { time: 5, text: '詰め込み式の教育には限界があります。' }, { time: 10, text: '批判的思考力を育てることが重要です。' }, { time: 15, text: 'グローバル人材の育成が急務です。' }] },
  { id: 'l-n-a9', category: 'n2', difficulty: 'advanced', title: 'Disaster Preparedness', transcript: [{ time: 0, text: '日本は自然災害が多い国です。' }, { time: 5, text: '地震や台風に対する備えが欠かせません。' }, { time: 10, text: '避難訓練を定期的に実施すべきです。' }, { time: 15, text: '防災意識を高めることが何よりも大切です。' }] },
  { id: 'l-n-a10', category: 'n2', difficulty: 'advanced', title: 'Corporate Strategy', transcript: [{ time: 0, text: '当社の中期経営計画を発表いたします。' }, { time: 5, text: '海外売上比率を50%に引き上げることを目標とします。' }, { time: 10, text: 'そのために、現地法人の設立を進めます。' }, { time: 15, text: '人材の多様化も重要な課題です。' }] },
  { id: 'l-n-a11', category: 'n2', difficulty: 'advanced', title: 'Environmental Policy', transcript: [{ time: 0, text: '企業の環境への取り組みが注目されています。' }, { time: 5, text: 'CO2排出量の削減目標を設定しました。' }, { time: 10, text: '再生可能エネルギーの導入を推進します。' }, { time: 15, text: 'サステナビリティは経営の根幹です。' }] },
  { id: 'l-n-a12', category: 'n2', difficulty: 'advanced', title: 'International Relations', transcript: [{ time: 0, text: '国際関係は複雑化しています。' }, { time: 5, text: '貿易摩擦が世界経済に影響を与えています。' }, { time: 10, text: '多国間協調の重要性が増しています。' }, { time: 15, text: '外交努力を続けることが平和への道です。' }] },
  { id: 'l-n-a13', category: 'n2', difficulty: 'advanced', title: 'Research Presentation', transcript: [{ time: 0, text: '本研究の目的と方法について説明します。' }, { time: 5, text: 'データは過去5年間の調査に基づいています。' }, { time: 10, text: '分析の結果、有意な相関関係が認められました。' }, { time: 15, text: '今後の課題としてサンプル数の拡大が挙げられます。' }] },
  { id: 'l-n-a14', category: 'n2', difficulty: 'advanced', title: 'Labor Issues', transcript: [{ time: 0, text: '働き方改革が進められています。' }, { time: 5, text: '長時間労働の是正が最大のテーマです。' }, { time: 10, text: 'テレワークの普及が加速しています。' }, { time: 15, text: '生産性の向上と両立させることが課題です。' }] },
  { id: 'l-n-a15', category: 'n2', difficulty: 'advanced', title: 'Media Literacy', transcript: [{ time: 0, text: 'SNSの普及により情報の取り扱いが変わりました。' }, { time: 5, text: 'フェイクニュースの問題が深刻化しています。' }, { time: 10, text: '情報を批判的に判断する能力が必要です。' }, { time: 15, text: 'メディアリテラシー教育の充実が求められています。' }] },
  { id: 'l-n-a16', category: 'n2', difficulty: 'advanced', title: 'Healthcare System', transcript: [{ time: 0, text: '日本の医療制度は世界的に高く評価されています。' }, { time: 5, text: 'しかし、医師不足が深刻な問題となっています。' }, { time: 10, text: '地方の医療格差を解消する必要があります。' }, { time: 15, text: '遠隔医療の導入が一つの解決策です。' }] },
  { id: 'l-n-a17', category: 'n2', difficulty: 'advanced', title: 'Urban Development', transcript: [{ time: 0, text: '都市の再開発が各地で進んでいます。' }, { time: 5, text: 'コンパクトシティの概念が注目されています。' }, { time: 10, text: '住みやすい街づくりには住民の参加が不可欠です。' }, { time: 15, text: '歴史的景観の保存と開発のバランスが重要です。' }] },
  { id: 'l-n-a18', category: 'n2', difficulty: 'advanced', title: 'Food Safety', transcript: [{ time: 0, text: '食品の安全性に対する関心が高まっています。' }, { time: 5, text: '産地偽装や添加物の問題が話題になっています。' }, { time: 10, text: '消費者は正しい情報を求めています。' }, { time: 15, text: 'トレーサビリティの確保が重要な課題です。' }] },
  { id: 'l-n-a19', category: 'n2', difficulty: 'advanced', title: 'Cultural Heritage', transcript: [{ time: 0, text: '文化遺産の保護は国の責任です。' }, { time: 5, text: '観光と保存の両立が課題となっています。' }, { time: 10, text: '地域住民の理解と協力が欠かせません。' }, { time: 15, text: '次世代に受け継ぐための取り組みが必要です。' }] },
  { id: 'l-n-a20', category: 'n2', difficulty: 'advanced', title: 'Aging Society', transcript: [{ time: 0, text: '高齢者の社会参加が重要になっています。' }, { time: 5, text: '定年後も働き続ける人が増えています。' }, { time: 10, text: '介護サービスの充実が急がれています。' }, { time: 15, text: '世代間の理解と支え合いが大切です。' }] },
];

export const MOCK_SPEAKING_LESSONS: SpeakingLesson[] = [
  // ═══════════════════════════════════════════════════════════════
  //  TOEIC BEGINNER (10 lessons)
  // ═══════════════════════════════════════════════════════════════
  { id: 's-t-b1', category: 'toeic', difficulty: 'beginner', targetSentence: 'How can I help you today?', translation: 'Tôi có thể giúp gì cho bạn?' },
  { id: 's-t-b2', category: 'toeic', difficulty: 'beginner', targetSentence: 'Nice to meet you.', translation: 'Rất vui được gặp bạn.' },
  { id: 's-t-b3', category: 'toeic', difficulty: 'beginner', targetSentence: 'Where is the meeting room?', translation: 'Phòng họp ở đâu?' },
  { id: 's-t-b4', category: 'toeic', difficulty: 'beginner', targetSentence: 'What time does the store open?', translation: 'Cửa hàng mở cửa lúc mấy giờ?' },
  { id: 's-t-b5', category: 'toeic', difficulty: 'beginner', targetSentence: 'I would like to order a coffee, please.', translation: 'Tôi muốn gọi một ly cà phê.' },
  { id: 's-t-b6', category: 'toeic', difficulty: 'beginner', targetSentence: 'Can you repeat that, please?', translation: 'Bạn có thể nhắc lại được không?' },
  { id: 's-t-b7', category: 'toeic', difficulty: 'beginner', targetSentence: 'I am sorry, I do not understand.', translation: 'Xin lỗi, tôi không hiểu.' },
  { id: 's-t-b8', category: 'toeic', difficulty: 'beginner', targetSentence: 'Where is the nearest bus stop?', translation: 'Trạm xe buýt gần nhất ở đâu?' },
  { id: 's-t-b9', category: 'toeic', difficulty: 'beginner', targetSentence: 'I need to make a phone call.', translation: 'Tôi cần gọi điện thoại.' },
  { id: 's-t-b10', category: 'toeic', difficulty: 'beginner', targetSentence: 'Could you show me the way to the office?', translation: 'Bạn có thể chỉ đường đến văn phòng được không?' },

  // ═══════════════════════════════════════════════════════════════
  //  TOEIC INTERMEDIATE (10 lessons)
  // ═══════════════════════════════════════════════════════════════
  { id: 's-t-i1', category: 'toeic', difficulty: 'intermediate', targetSentence: 'Could you please send me the report by Friday?', translation: 'Bạn có thể gửi cho tôi báo cáo trước thứ Sáu được không?' },
  { id: 's-t-i2', category: 'toeic', difficulty: 'intermediate', targetSentence: 'I would like to schedule a meeting with the manager.', translation: 'Tôi muốn sắp xếp cuộc họp với quản lý.' },
  { id: 's-t-i3', category: 'toeic', difficulty: 'intermediate', targetSentence: 'The project deadline has been extended to next month.', translation: 'Hạn chót dự án đã được gia hạn đến tháng sau.' },
  { id: 's-t-i4', category: 'toeic', difficulty: 'intermediate', targetSentence: 'We need to discuss the budget before the meeting.', translation: 'Chúng ta cần thảo luận ngân sách trước cuộc họp.' },
  { id: 's-t-i5', category: 'toeic', difficulty: 'intermediate', targetSentence: 'I have been working on this project for three months.', translation: 'Tôi đã làm dự án này được ba tháng.' },
  { id: 's-t-i6', category: 'toeic', difficulty: 'intermediate', targetSentence: 'The sales figures show a significant improvement.', translation: 'Các con số bán hàng cho thấy sự cải thiện đáng kể.' },
  { id: 's-t-i7', category: 'toeic', difficulty: 'intermediate', targetSentence: 'Please let me know if you have any questions.', translation: 'Vui lòng cho tôi biết nếu bạn có câu hỏi nào.' },
  { id: 's-t-i8', category: 'toeic', difficulty: 'intermediate', targetSentence: 'The training session will be held next Wednesday.', translation: 'Buổi đào tạo sẽ được tổ chức vào thứ Tư tuần sau.' },
  { id: 's-t-i9', category: 'toeic', difficulty: 'intermediate', targetSentence: 'Our team has exceeded the quarterly sales target.', translation: 'Đội của chúng tôi đã vượt mục tiêu bán hàng quý.' },
  { id: 's-t-i10', category: 'toeic', difficulty: 'intermediate', targetSentence: 'I recommend that we postpone the product launch.', translation: 'Tôi đề nghị chúng ta hoãn ra mắt sản phẩm.' },
  { id: 's-t-i21', category: 'toeic', difficulty: 'intermediate', targetSentence: 'Could you walk me through the presentation slides?', translation: 'Bạn có thể hướng dẫn tôi qua các trang trình bày không?' },
  { id: 's-t-i22', category: 'toeic', difficulty: 'intermediate', targetSentence: 'We should delegate this task to someone with more experience.', translation: 'Chúng ta nên giao nhiệm vụ này cho người có nhiều kinh nghiệm hơn.' },
  { id: 's-t-i23', category: 'toeic', difficulty: 'intermediate', targetSentence: 'The contract needs both parties signatures before Friday.', translation: 'Hợp đồng cần chữ ký của cả hai bên trước thứ Sáu.' },
  { id: 's-t-i24', category: 'toeic', difficulty: 'intermediate', targetSentence: 'Our competitors have lowered their prices significantly.', translation: 'Đối thủ của chúng tôi đã giảm giá đáng kể.' },
  { id: 's-t-i25', category: 'toeic', difficulty: 'intermediate', targetSentence: 'I would like to request a transfer to the finance department.', translation: 'Tôi muốn xin chuyển sang bộ phận tài chính.' },
  { id: 's-t-i26', category: 'toeic', difficulty: 'intermediate', targetSentence: 'The supplier has agreed to extend the payment terms.', translation: 'Nhà cung cấp đã đồng ý gia hạn điều khoản thanh toán.' },
  { id: 's-t-i27', category: 'toeic', difficulty: 'intermediate', targetSentence: 'Please forward the meeting minutes to all team members.', translation: 'Vui lòng chuyển biên bản họp cho tất cả thành viên nhóm.' },
  { id: 's-t-i28', category: 'toeic', difficulty: 'intermediate', targetSentence: 'We are currently reviewing applications for the open position.', translation: 'Chúng tôi hiện đang xem xét đơn tuyển cho vị trí trống.' },
  { id: 's-t-i29', category: 'toeic', difficulty: 'intermediate', targetSentence: 'The product warranty covers defects for up to two years.', translation: 'Bảo hành sản phẩm bao gồm lỗi trong vòng hai năm.' },
  { id: 's-t-i30', category: 'toeic', difficulty: 'intermediate', targetSentence: 'I believe we can improve efficiency by automating this process.', translation: 'Tôi tin rằng chúng ta có thể cải thiện hiệu quả bằng cách tự động hóa quy trình này.' },
  { id: 's-t-i31', category: 'toeic', difficulty: 'intermediate', targetSentence: 'The invoice has been processed and will be paid next week.', translation: 'Hóa đơn đã được xử lý và sẽ được thanh toán tuần sau.' },
  { id: 's-t-i32', category: 'toeic', difficulty: 'intermediate', targetSentence: 'Could you provide an update on the marketing campaign?', translation: 'Bạn có thể cập nhật về chiến dịch marketing không?' },
  { id: 's-t-i33', category: 'toeic', difficulty: 'intermediate', targetSentence: 'The office will be closed for maintenance this Saturday.', translation: 'Văn phòng sẽ đóng cửa để bảo trì vào thứ Bảy này.' },
  { id: 's-t-i34', category: 'toeic', difficulty: 'intermediate', targetSentence: 'We need to align our goals with the company vision.', translation: 'Chúng ta cần đồng bộ hóa mục tiêu với tầm nhìn công ty.' },
  { id: 's-t-i35', category: 'toeic', difficulty: 'intermediate', targetSentence: 'The employee training program will start next Monday.', translation: 'Chương trình đào tạo nhân viên sẽ bắt đầu vào thứ Hai tuần sau.' },

  // ═══════════════════════════════════════════════════════════════
  //  TOEIC ADVANCED (15 lessons)
  // ═══════════════════════════════════════════════════════════════
  { id: 's-t-a1', category: 'toeic', difficulty: 'advanced', targetSentence: 'The board of directors is evaluating the acquisition proposal.', translation: 'Hội đồng quản trị đang đánh giá đề xuất thâu tóm.' },
  { id: 's-t-a2', category: 'toeic', difficulty: 'advanced', targetSentence: 'We need to streamline our operational processes.', translation: 'Chúng ta cần tinh giản quy trình vận hành.' },
  { id: 's-t-a3', category: 'toeic', difficulty: 'advanced', targetSentence: 'The depreciation of assets must be reported accurately.', translation: 'Sự khấu hao tài sản phải được báo cáo chính xác.' },
  { id: 's-t-a4', category: 'toeic', difficulty: 'advanced', targetSentence: 'Due diligence revealed potential liabilities in the subsidiary.', translation: 'Thẩm tra cho thấy các khoản nợ tiềm ẩn trong công ty con.' },
  { id: 's-t-a5', category: 'toeic', difficulty: 'advanced', targetSentence: 'The quarterly earnings exceeded analyst expectations significantly.', translation: 'Thu nhập quý đã vượt đáng kể kỳ vọng của các nhà phân tích.' },
  { id: 's-t-a6', category: 'toeic', difficulty: 'advanced', targetSentence: 'We must ensure full compliance with international regulations.', translation: 'Chúng ta phải đảm bảo tuân thủ đầy đủ các quy định quốc tế.' },
  { id: 's-t-a7', category: 'toeic', difficulty: 'advanced', targetSentence: 'The restructuring plan is expected to yield substantial cost savings.', translation: 'Kế hoạch tái cấu trúc dự kiến sẽ mang lại tiết kiệm chi phí đáng kể.' },
  { id: 's-t-a8', category: 'toeic', difficulty: 'advanced', targetSentence: 'Stakeholder engagement is crucial for the success of this initiative.', translation: 'Sự tham gia của các bên liên quan là rất quan trọng cho sự thành công.' },
  { id: 's-t-a9', category: 'toeic', difficulty: 'advanced', targetSentence: 'The merger will consolidate our position in the global marketplace.', translation: 'Việc sáp nhập sẽ củng cố vị thế của chúng ta trên thị trường toàn cầu.' },
  { id: 's-t-a10', category: 'toeic', difficulty: 'advanced', targetSentence: 'Innovation drives competitive advantage in a rapidly evolving industry.', translation: 'Đổi mới thúc đẩy lợi thế cạnh tranh trong ngành phát triển nhanh.' },
  { id: 's-t-a11', category: 'toeic', difficulty: 'advanced', targetSentence: 'The negotiation yielded a mutually beneficial agreement for both parties.', translation: 'Cuộc đàm phán đã đạt được thỏa thuận có lợi cho cả hai bên.' },
  { id: 's-t-a12', category: 'toeic', difficulty: 'advanced', targetSentence: 'We must anticipate potential disruptions in the supply chain.', translation: 'Chúng ta phải dự đoán các sự gián đoạn tiềm ẩn trong chuỗi cung ứng.' },
  { id: 's-t-a13', category: 'toeic', difficulty: 'advanced', targetSentence: 'The chief financial officer presented a comprehensive risk assessment.', translation: 'Giám đốc tài chính đã trình bày đánh giá rủi ro toàn diện.' },
  { id: 's-t-a14', category: 'toeic', difficulty: 'advanced', targetSentence: 'Our intellectual property portfolio has grown substantially this year.', translation: 'Danh mục sở hữu trí tuệ của chúng tôi đã tăng đáng kể trong năm nay.' },
  { id: 's-t-a15', category: 'toeic', difficulty: 'advanced', targetSentence: 'Sustainable business practices are essential for long-term profitability.', translation: 'Các hoạt động kinh doanh bền vững là thiết yếu cho lợi nhuận lâu dài.' },

  // ═══════════════════════════════════════════════════════════════
  //  N2 BEGINNER (10 lessons)
  // ═══════════════════════════════════════════════════════════════
  { id: 's-n-b1', category: 'n2', difficulty: 'beginner', targetSentence: 'よろしくお願いします。', translation: 'Rất mong được giúp đỡ.' },
  { id: 's-n-b2', category: 'n2', difficulty: 'beginner', targetSentence: 'ありがとうございます。', translation: 'Cảm ơn bạn.' },
  { id: 's-n-b3', category: 'n2', difficulty: 'beginner', targetSentence: 'すみません、これはいくらですか。', translation: 'Xin lỗi, cái này giá bao nhiêu?' },
  { id: 's-n-b4', category: 'n2', difficulty: 'beginner', targetSentence: 'お名前は何ですか。', translation: 'Tên bạn là gì?' },
  { id: 's-n-b5', category: 'n2', difficulty: 'beginner', targetSentence: '日本語を勉強しています。', translation: 'Tôi đang học tiếng Nhật.' },
  { id: 's-n-b6', category: 'n2', difficulty: 'beginner', targetSentence: 'トイレはどこですか。', translation: 'Nhà vệ sinh ở đâu?' },
  { id: 's-n-b7', category: 'n2', difficulty: 'beginner', targetSentence: '水をください。', translation: 'Cho tôi nước.' },
  { id: 's-n-b8', category: 'n2', difficulty: 'beginner', targetSentence: '明日は何曜日ですか。', translation: 'Ngày mai là thứ mấy?' },
  { id: 's-n-b9', category: 'n2', difficulty: 'beginner', targetSentence: '東京駅まで行きたいです。', translation: 'Tôi muốn đi đến ga Tokyo.' },
  { id: 's-n-b10', category: 'n2', difficulty: 'beginner', targetSentence: 'もう一度言ってください。', translation: 'Hãy nói lại một lần nữa.' },

  // ═══════════════════════════════════════════════════════════════
  //  N2 INTERMEDIATE (10 lessons)
  // ═══════════════════════════════════════════════════════════════
  { id: 's-n-i1', category: 'n2', difficulty: 'intermediate', targetSentence: '来週の月曜日に会議があります。', translation: 'Có cuộc họp vào thứ Hai tuần sau.' },
  { id: 's-n-i2', category: 'n2', difficulty: 'intermediate', targetSentence: 'この資料を確認していただけますか。', translation: 'Bạn có thể kiểm tra tài liệu này được không?' },
  { id: 's-n-i3', category: 'n2', difficulty: 'intermediate', targetSentence: '予算を考慮する必要があります。', translation: 'Cần phải xem xét ngân sách.' },
  { id: 's-n-i4', category: 'n2', difficulty: 'intermediate', targetSentence: '提出期限は今月末までです。', translation: 'Hạn nộp là cuối tháng này.' },
  { id: 's-n-i5', category: 'n2', difficulty: 'intermediate', targetSentence: 'ご不明な点がございましたらお知らせください。', translation: 'Nếu có điểm nào chưa rõ xin hãy cho biết.' },
  { id: 's-n-i6', category: 'n2', difficulty: 'intermediate', targetSentence: '先週のレポートについて質問があります。', translation: 'Tôi có câu hỏi về báo cáo tuần trước.' },
  { id: 's-n-i7', category: 'n2', difficulty: 'intermediate', targetSentence: '新しいシステムの使い方を教えてください。', translation: 'Xin hãy chỉ cho tôi cách sử dụng hệ thống mới.' },
  { id: 's-n-i8', category: 'n2', difficulty: 'intermediate', targetSentence: '日本の文化に興味を持っています。', translation: 'Tôi có hứng thú với văn hóa Nhật Bản.' },
  { id: 's-n-i9', category: 'n2', difficulty: 'intermediate', targetSentence: 'このプロジェクトは順調に進んでいます。', translation: 'Dự án này đang tiến triển thuận lợi.' },
  { id: 's-n-i10', category: 'n2', difficulty: 'intermediate', targetSentence: '来月から新しい部署に異動になりました。', translation: 'Từ tháng sau tôi chuyển sang bộ phận mới.' },
  { id: 's-n-i21', category: 'n2', difficulty: 'intermediate', targetSentence: 'この件について上司と相談する必要があります。', translation: 'Cần phải tham khảo ý kiến cấp trên về vấn đề này.' },
  { id: 's-n-i22', category: 'n2', difficulty: 'intermediate', targetSentence: '来週までに企画書を完成させるつもりです。', translation: 'Tôi dự định hoàn thành bản kế hoạch trước tuần sau.' },
  { id: 's-n-i23', category: 'n2', difficulty: 'intermediate', targetSentence: '会議室を予約したいのですが、空いていますか。', translation: 'Tôi muốn đặt phòng họp, phòng còn trống không?' },
  { id: 's-n-i24', category: 'n2', difficulty: 'intermediate', targetSentence: '給料日は毎月25日です。', translation: 'Ngày nhận lương là ngày 25 hàng tháng.' },
  { id: 's-n-i25', category: 'n2', difficulty: 'intermediate', targetSentence: 'このプロジェクトの責任者は誰ですか。', translation: 'Ai là người chịu trách nhiệm cho dự án này?' },
  { id: 's-n-i26', category: 'n2', difficulty: 'intermediate', targetSentence: '出張の交通費は会社が負担します。', translation: 'Chi phí đi lại cho công tác sẽ do công ty chi trả.' },
  { id: 's-n-i27', category: 'n2', difficulty: 'intermediate', targetSentence: '新しい規則について説明会があります。', translation: 'Có buổi họp hướng dẫn về quy tắc quản lý mới.' },
  { id: 's-n-i28', category: 'n2', difficulty: 'intermediate', targetSentence: '顧客からのクレームに対応する必要があります。', translation: 'Cần xử lý khiếu nại từ khách hàng.' },
  { id: 's-n-i29', category: 'n2', difficulty: 'intermediate', targetSentence: '在庫が不足している商品があります。', translation: 'Có một số mặt hàng tồn kho đang bị thiếu.' },
  { id: 's-n-i30', category: 'n2', difficulty: 'intermediate', targetSentence: '来月の売上目標を設定する必要があります。', translation: 'Cần đặt mục tiêu doanh thu cho tháng sau.' },
  { id: 's-n-i31', category: 'n2', difficulty: 'intermediate', targetSentence: '経費精算の方法を教えてください。', translation: 'Xin hãy chỉ cho tôi cách quyết toán chi phí.' },
  { id: 's-n-i32', category: 'n2', difficulty: 'intermediate', targetSentence: '取引先との打ち合わせは午後からです。', translation: 'Buổi họp với đối tác bắt đầu từ buổi chiều.' },
  { id: 's-n-i33', category: 'n2', difficulty: 'intermediate', targetSentence: 'この書類は印鑑が必要です。', translation: 'Tài liệu này cần con dấu.' },
  { id: 's-n-i34', category: 'n2', difficulty: 'intermediate', targetSentence: '残業が多いので、体調管理に気をつけてください。', translation: 'Vì thường xuyên tăng ca, xin hãy chú ý sức khỏe.' },
  { id: 's-n-i35', category: 'n2', difficulty: 'intermediate', targetSentence: '新人研修は来週の月曜日から始まります。', translation: 'Khóa đào tạo nhân viên mới bắt đầu từ thứ Hai tuần sau.' },

  // ═══════════════════════════════════════════════════════════════
  //  N2 ADVANCED (15 lessons)
  // ═══════════════════════════════════════════════════════════════
  { id: 's-n-a1', category: 'n2', difficulty: 'advanced', targetSentence: '現状を正確に把握する必要がある。', translation: 'Cần nắm bắt chính xác hiện trạng.' },
  { id: 's-n-a2', category: 'n2', difficulty: 'advanced', targetSentence: '迅速に対応するための措置を講じます。', translation: 'Sẽ thực hiện các biện pháp để ứng phó nhanh chóng.' },
  { id: 's-n-a3', category: 'n2', difficulty: 'advanced', targetSentence: '国際的な協力なくして解決は不可能だ。', translation: 'Không có hợp tác quốc tế thì giải quyết là không thể.' },
  { id: 's-n-a4', category: 'n2', difficulty: 'advanced', targetSentence: '少子高齢化問題への対策が急がれている。', translation: 'Các biện pháp đối phó vấn đề già hóa dân số đang cấp bách.' },
  { id: 's-n-a5', category: 'n2', difficulty: 'advanced', targetSentence: '持続可能な社会を実現するために努力すべきだ。', translation: 'Cần nỗ lực để thực hiện xã hội bền vững.' },
  { id: 's-n-a6', category: 'n2', difficulty: 'advanced', targetSentence: '経済のグローバル化は避けて通れない課題です。', translation: 'Toàn cầu hóa kinh tế là vấn đề không thể tránh khỏi.' },
  { id: 's-n-a7', category: 'n2', difficulty: 'advanced', targetSentence: '環境問題に対する意識を高めることが重要です。', translation: 'Nâng cao nhận thức về vấn đề môi trường là quan trọng.' },
  { id: 's-n-a8', category: 'n2', difficulty: 'advanced', targetSentence: '技術革新が産業構造を根本から変えつつある。', translation: 'Đổi mới công nghệ đang thay đổi cấu trúc ngành từ gốc.' },
  { id: 's-n-a9', category: 'n2', difficulty: 'advanced', targetSentence: '異文化理解は国際社会において不可欠な能力だ。', translation: 'Hiểu biết đa văn hóa là năng lực không thể thiếu trong xã hội quốc tế.' },
  { id: 's-n-a10', category: 'n2', difficulty: 'advanced', targetSentence: '人材育成こそが企業の競争力の源泉である。', translation: 'Đào tạo nhân tài chính là nguồn lực cạnh tranh của doanh nghiệp.' },
  { id: 's-n-a11', category: 'n2', difficulty: 'advanced', targetSentence: '企業の社会的責任を果たすことが期待されている。', translation: 'Đang được kỳ vọng thực hiện trách nhiệm xã hội của doanh nghiệp.' },
  { id: 's-n-a12', category: 'n2', difficulty: 'advanced', targetSentence: 'デジタル変革がビジネスモデルに大きな影響を与えている。', translation: 'Chuyển đổi kỹ thuật số đang có ảnh hưởng lớn đến mô hình kinh doanh.' },
  { id: 's-n-a13', category: 'n2', difficulty: 'advanced', targetSentence: '将来を見据えた戦略的な意思決定が求められている。', translation: 'Đang được yêu cầu ra quyết định chiến lược nhìn về tương lai.' },
  { id: 's-n-a14', category: 'n2', difficulty: 'advanced', targetSentence: '顧客満足度を向上させるための取り組みを強化する必要がある。', translation: 'Cần tăng cường các nỗ lực nhằm nâng cao mức độ hài lòng của khách hàng.' },
  { id: 's-n-a15', category: 'n2', difficulty: 'advanced', targetSentence: '組織の風通しを良くすることが管理の基本である。', translation: 'Cải thiện sự thông thoáng trong tổ chức là nền tảng của quản lý.' },
];

export const MOCK_DICTATION_LESSONS: DictationLesson[] = [
  // ═══════════════════════════════════════════════════════════════
  //  TOEIC BEGINNER (10 lessons)
  // ═══════════════════════════════════════════════════════════════
  { id: 'd-t-b1', category: 'toeic', difficulty: 'beginner', targetText: 'I work at a law firm.', translation: 'Tôi làm việc tại một công ty luật.' },
  { id: 'd-t-b2', category: 'toeic', difficulty: 'beginner', targetText: 'The meeting is at 3 PM.', translation: 'Cuộc họp lúc 3 giờ chiều.' },
  { id: 'd-t-b3', category: 'toeic', difficulty: 'beginner', targetText: 'Please send me the email.', translation: 'Vui lòng gửi cho tôi email.' },
  { id: 'd-t-b4', category: 'toeic', difficulty: 'beginner', targetText: 'The office is on the second floor.', translation: 'Văn phòng ở tầng hai.' },
  { id: 'd-t-b5', category: 'toeic', difficulty: 'beginner', targetText: 'I have a meeting at ten o clock.', translation: 'Tôi có cuộc họp lúc 10 giờ.' },
  { id: 'd-t-b6', category: 'toeic', difficulty: 'beginner', targetText: 'She is the new manager.', translation: 'Cô ấy là quản lý mới.' },
  { id: 'd-t-b7', category: 'toeic', difficulty: 'beginner', targetText: 'The store closes at nine PM.', translation: 'Cửa hàng đóng cửa lúc 9 giờ tối.' },
  { id: 'd-t-b8', category: 'toeic', difficulty: 'beginner', targetText: 'Please sign the document here.', translation: 'Vui lòng ký tài liệu ở đây.' },
  { id: 'd-t-b9', category: 'toeic', difficulty: 'beginner', targetText: 'The train leaves at seven thirty.', translation: 'Tàu khởi hành lúc 7 giờ rưỡi.' },
  { id: 'd-t-b10', category: 'toeic', difficulty: 'beginner', targetText: 'I need to buy some office supplies.', translation: 'Tôi cần mua một số văn phòng phẩm.' },

  // ═══════════════════════════════════════════════════════════════
  //  TOEIC INTERMEDIATE (10 lessons)
  // ═══════════════════════════════════════════════════════════════
  { id: 'd-t-i1', category: 'toeic', difficulty: 'intermediate', targetText: 'The quarterly report needs to be reviewed.', translation: 'Báo cáo quý cần được xem xét.' },
  { id: 'd-t-i2', category: 'toeic', difficulty: 'intermediate', targetText: 'We have to submit the proposal by Friday.', translation: 'Chúng ta phải nộp đề xuất trước thứ Sáu.' },
  { id: 'd-t-i3', category: 'toeic', difficulty: 'intermediate', targetText: 'The client requested additional information.', translation: 'Khách hàng yêu cầu thêm thông tin.' },
  { id: 'd-t-i4', category: 'toeic', difficulty: 'intermediate', targetText: 'Please confirm your attendance by Wednesday.', translation: 'Vui lòng xác nhận tham dự trước thứ Tư.' },
  { id: 'd-t-i5', category: 'toeic', difficulty: 'intermediate', targetText: 'The marketing team presented their findings yesterday.', translation: 'Đội marketing đã trình bày kết quả của họ hôm qua.' },
  { id: 'd-t-i6', category: 'toeic', difficulty: 'intermediate', targetText: 'We are looking for candidates with management experience.', translation: 'Chúng tôi đang tìm ứng viên có kinh nghiệm quản lý.' },
  { id: 'd-t-i7', category: 'toeic', difficulty: 'intermediate', targetText: 'The workshop will cover effective communication skills.', translation: 'Buổi hội thảo sẽ bao gồm kỹ năng giao tiếp hiệu quả.' },
  { id: 'd-t-i8', category: 'toeic', difficulty: 'intermediate', targetText: 'Our new policy takes effect at the beginning of next month.', translation: 'Chính sách mới có hiệu lực vào đầu tháng sau.' },
  { id: 'd-t-i9', category: 'toeic', difficulty: 'intermediate', targetText: 'The customer satisfaction survey showed positive results.', translation: 'Khảo sát hài lòng khách hàng cho thấy kết quả tích cực.' },
  { id: 'd-t-i10', category: 'toeic', difficulty: 'intermediate', targetText: 'All employees must complete the safety training by next week.', translation: 'Tất cả nhân viên phải hoàn thành đào tạo an toàn trước tuần sau.' },
  { id: 'd-t-i21', category: 'toeic', difficulty: 'intermediate', targetText: 'The project manager will brief the team on Monday.', translation: 'Quản lý dự án sẽ họp nhóm vào thứ Hai.' },
  { id: 'd-t-i22', category: 'toeic', difficulty: 'intermediate', targetText: 'We need to finalize the budget before the board meeting.', translation: 'Chúng ta cần hoàn thiện ngân sách trước cuộc họp hội đồng.' },
  { id: 'd-t-i23', category: 'toeic', difficulty: 'intermediate', targetText: 'The new employee orientation is scheduled for tomorrow.', translation: 'Buổi giới thiệu nhân viên mới được lên lịch cho ngày mai.' },
  { id: 'd-t-i24', category: 'toeic', difficulty: 'intermediate', targetText: 'Please review the attached document and provide feedback.', translation: 'Vui lòng xem xét tài liệu đính kèm và đưa ra phản hồi.' },
  { id: 'd-t-i25', category: 'toeic', difficulty: 'intermediate', targetText: 'The company picnic has been moved to next weekend.', translation: 'Buổi dã ngoại công ty đã được chuyển sang cuối tuần sau.' },
  { id: 'd-t-i26', category: 'toeic', difficulty: 'intermediate', targetText: 'Our office will be undergoing renovations starting Monday.', translation: 'Văn phòng chúng tôi sẽ bắt đầu tu sửa từ thứ Hai.' },
  { id: 'd-t-i27', category: 'toeic', difficulty: 'intermediate', targetText: 'The hiring manager wants to schedule a second interview.', translation: 'Quản lý tuyển dụng muốn sắp xếp vòng phỏng vấn thứ hai.' },
  { id: 'd-t-i28', category: 'toeic', difficulty: 'intermediate', targetText: 'The vendor has delivered the equipment ahead of schedule.', translation: 'Nhà cung cấp đã giao thiết bị sớm hơn dự kiến.' },
  { id: 'd-t-i29', category: 'toeic', difficulty: 'intermediate', targetText: 'We are conducting a survey on employee satisfaction.', translation: 'Chúng tôi đang thực hiện khảo sát về sự hài lòng của nhân viên.' },
  { id: 'd-t-i30', category: 'toeic', difficulty: 'intermediate', targetText: 'The annual sales conference will be held in Chicago this year.', translation: 'Hội nghị bán hàng thường niên sẽ được tổ chức ở Chicago năm nay.' },
  { id: 'd-t-i31', category: 'toeic', difficulty: 'intermediate', targetText: 'Please make sure all reports are submitted by end of day.', translation: 'Vui lòng đảm bảo tất cả báo cáo được nộp trước cuối ngày.' },
  { id: 'd-t-i32', category: 'toeic', difficulty: 'intermediate', targetText: 'The IT department will perform system maintenance tonight.', translation: 'Bộ phận IT sẽ thực hiện bảo trì hệ thống tối nay.' },
  { id: 'd-t-i33', category: 'toeic', difficulty: 'intermediate', targetText: 'We have received approval to hire two additional staff.', translation: 'Chúng tôi đã nhận được phê duyệt để tuyển hai nhân viên bổ sung.' },
  { id: 'd-t-i34', category: 'toeic', difficulty: 'intermediate', targetText: 'The client meeting has been rescheduled to Thursday.', translation: 'Cuộc họp khách hàng đã được đổi lịch sang thứ Năm.' },
  { id: 'd-t-i35', category: 'toeic', difficulty: 'intermediate', targetText: 'Our team is preparing a proposal for the government tender.', translation: 'Đội của chúng tôi đang chuẩn bị đề xuất cho đấu thầu chính phủ.' },

  // ═══════════════════════════════════════════════════════════════
  //  TOEIC ADVANCED (15 lessons)
  // ═══════════════════════════════════════════════════════════════
  { id: 'd-t-a1', category: 'toeic', difficulty: 'advanced', targetText: 'Unforeseen circumstances led to a significant delay.', translation: 'Các trường hợp không lường trước dẫn đến sự chậm trễ.' },
  { id: 'd-t-a2', category: 'toeic', difficulty: 'advanced', targetText: 'The acquisition expanded the firm market share.', translation: 'Vụ thâu tóm đã mở rộng thị phần của công ty.' },
  { id: 'd-t-a3', category: 'toeic', difficulty: 'advanced', targetText: 'Compliance with regulations is mandatory.', translation: 'Tuân thủ các quy định là bắt buộc.' },
  { id: 'd-t-a4', category: 'toeic', difficulty: 'advanced', targetText: 'The restructuring resulted in significant cost reductions.', translation: 'Tái cấu trúc đã mang lại giảm chi phí đáng kể.' },
  { id: 'd-t-a5', category: 'toeic', difficulty: 'advanced', targetText: 'Revenue projections for the next fiscal year are optimistic.', translation: 'Dự báo doanh thu cho năm tài chính tới rất lạc quan.' },
  { id: 'd-t-a6', category: 'toeic', difficulty: 'advanced', targetText: 'The board approved the allocation of funds for research.', translation: 'Hội đồng phê duyệt phân bổ ngân sách cho nghiên cứu.' },
  { id: 'd-t-a7', category: 'toeic', difficulty: 'advanced', targetText: 'Diversifying our portfolio will mitigate potential risks.', translation: 'Đa dạng hóa danh mục sẽ giảm thiểu rủi ro tiềm ẩn.' },
  { id: 'd-t-a8', category: 'toeic', difficulty: 'advanced', targetText: 'The intellectual property rights must be protected at all costs.', translation: 'Quyền sở hữu trí tuệ phải được bảo vệ bằng mọi giá.' },
  { id: 'd-t-a9', category: 'toeic', difficulty: 'advanced', targetText: 'Shareholder confidence has been restored following the announcement.', translation: 'Niềm tin cổ đông đã phục hồi sau thông báo.' },
  { id: 'd-t-a10', category: 'toeic', difficulty: 'advanced', targetText: 'The subsidiary will operate independently under the new structure.', translation: 'Công ty con sẽ hoạt động độc lập theo cấu trúc mới.' },
  { id: 'd-t-a11', category: 'toeic', difficulty: 'advanced', targetText: 'The auditor flagged several areas requiring immediate attention.', translation: 'Kiểm toán viên đã chỉ ra nhiều lĩnh vực cần chú ý ngay lập tức.' },
  { id: 'd-t-a12', category: 'toeic', difficulty: 'advanced', targetText: 'Market volatility has prompted a reassessment of our investment strategy.', translation: 'Biến động thị trường đã khiến phải đánh giá lại chiến lược đầu tư.' },
  { id: 'd-t-a13', category: 'toeic', difficulty: 'advanced', targetText: 'The patent filing process requires meticulous documentation.', translation: 'Quy trình nộp bằng sáng chế yêu cầu tài liệu tỉ mỉ.' },
  { id: 'd-t-a14', category: 'toeic', difficulty: 'advanced', targetText: 'Cross-functional collaboration has improved project delivery times.', translation: 'Sự hợp tác liên phòng ban đã cải thiện thời gian thực hiện dự án.' },
  { id: 'd-t-a15', category: 'toeic', difficulty: 'advanced', targetText: 'The company is implementing a new cybersecurity framework.', translation: 'Công ty đang triển khai khung an ninh mạng mới.' },

  // ═══════════════════════════════════════════════════════════════
  //  N2 BEGINNER (10 lessons)
  // ═══════════════════════════════════════════════════════════════
  { id: 'd-n-b1', category: 'n2', difficulty: 'beginner', targetText: 'これは新しい本です。', translation: 'Đây là quyển sách mới.' },
  { id: 'd-n-b2', category: 'n2', difficulty: 'beginner', targetText: '明日は学校です。', translation: 'Ngày mai là ngày đi học.' },
  { id: 'd-n-b3', category: 'n2', difficulty: 'beginner', targetText: 'コーヒーを飲みませんか。', translation: 'Bạn có muốn uống cà phê không?' },
  { id: 'd-n-b4', category: 'n2', difficulty: 'beginner', targetText: '駅はここから近いです。', translation: 'Nhà ga gần đây.' },
  { id: 'd-n-b5', category: 'n2', difficulty: 'beginner', targetText: '毎日日本語を練習します。', translation: 'Mỗi ngày tôi luyện tập tiếng Nhật.' },
  { id: 'd-n-b6', category: 'n2', difficulty: 'beginner', targetText: '昨日映画を見ました。', translation: 'Hôm qua tôi đã xem phim.' },
  { id: 'd-n-b7', category: 'n2', difficulty: 'beginner', targetText: '日曜日は休みです。', translation: 'Chủ nhật là ngày nghỉ.' },
  { id: 'd-n-b8', category: 'n2', difficulty: 'beginner', targetText: 'この電車は東京に行きます。', translation: 'Chuyến tàu này đi Tokyo.' },
  { id: 'd-n-b9', category: 'n2', difficulty: 'beginner', targetText: '友達と公園で遊びました。', translation: 'Tôi đã chơi với bạn ở công viên.' },
  { id: 'd-n-b10', category: 'n2', difficulty: 'beginner', targetText: 'お母さんは料理が上手です。', translation: 'Mẹ nấu ăn giỏi.' },

  // ═══════════════════════════════════════════════════════════════
  //  N2 INTERMEDIATE (10 lessons)
  // ═══════════════════════════════════════════════════════════════
  { id: 'd-n-i1', category: 'n2', difficulty: 'intermediate', targetText: '来週の会議に参加してください。', translation: 'Vui lòng tham gia cuộc họp tuần sau.' },
  { id: 'd-n-i2', category: 'n2', difficulty: 'intermediate', targetText: 'この問題を解決する必要があります。', translation: 'Cần giải quyết vấn đề này.' },
  { id: 'd-n-i3', category: 'n2', difficulty: 'intermediate', targetText: '予算を確認してから判断します。', translation: 'Sẽ quyết định sau khi kiểm tra ngân sách.' },
  { id: 'd-n-i4', category: 'n2', difficulty: 'intermediate', targetText: '新しい方針について説明させていただきます。', translation: 'Tôi xin phép được giải thích về phương châm mới.' },
  { id: 'd-n-i5', category: 'n2', difficulty: 'intermediate', targetText: '締め切りまでに提出しなければなりません。', translation: 'Phải nộp trước hạn chót.' },
  { id: 'd-n-i6', category: 'n2', difficulty: 'intermediate', targetText: '彼は日本語が話せるようになりました。', translation: 'Anh ấy đã có thể nói tiếng Nhật.' },
  { id: 'd-n-i7', category: 'n2', difficulty: 'intermediate', targetText: '最近、物価が上がっているそうです。', translation: 'Nghe nói gần đây giá cả đang tăng.' },
  { id: 'd-n-i8', category: 'n2', difficulty: 'intermediate', targetText: '地下鉄の方がバスより速いです。', translation: 'Tàu điện ngầm nhanh hơn xe buýt.' },
  { id: 'd-n-i9', category: 'n2', difficulty: 'intermediate', targetText: '留学の経験は就職に役立ちます。', translation: 'Kinh nghiệm du học có ích cho việc tìm việc.' },
  { id: 'd-n-i10', category: 'n2', difficulty: 'intermediate', targetText: '今年の目標を達成できるように頑張ります。', translation: 'Tôi sẽ cố gắng để đạt mục tiêu năm nay.' },
  { id: 'd-n-i21', category: 'n2', difficulty: 'intermediate', targetText: '会議の議事録をメールで共有してください。', translation: 'Vui lòng chia sẻ biên bản họp qua email.' },
  { id: 'd-n-i22', category: 'n2', difficulty: 'intermediate', targetText: '出張費の精算は経理部門に提出してください。', translation: 'Vui lòng nộp quyết toán chi phí công tác cho bộ phận kế toán.' },
  { id: 'd-n-i23', category: 'n2', difficulty: 'intermediate', targetText: 'この商品の納期はいつになりますか。', translation: 'Thời gian giao hàng của sản phẩm này là khi nào?' },
  { id: 'd-n-i24', category: 'n2', difficulty: 'intermediate', targetText: '来月から新しい取引先との契約が始まります。', translation: 'Từ tháng sau hợp đồng với đối tác mới sẽ bắt đầu.' },
  { id: 'd-n-i25', category: 'n2', difficulty: 'intermediate', targetText: '従業員の福利厚生を充実させる方針です。', translation: 'Đây là chính sách tăng cường phúc lợi cho nhân viên.' },
  { id: 'd-n-i26', category: 'n2', difficulty: 'intermediate', targetText: '営業部から新商品の販売計画が発表されました。', translation: 'Bộ phận kinh doanh đã công bố kế hoạch bán hàng sản phẩm mới.' },
  { id: 'd-n-i27', category: 'n2', difficulty: 'intermediate', targetText: '社内のコミュニケーションを改善する取り組みを始めます。', translation: 'Sẽ bắt đầu các nỗ lực cải thiện giao tiếp trong công ty.' },
  { id: 'd-n-i28', category: 'n2', difficulty: 'intermediate', targetText: '予算の執行状況を毎月報告する必要があります。', translation: 'Cần báo cáo tình hình thực thi ngân sách mỗi tháng.' },
  { id: 'd-n-i29', category: 'n2', difficulty: 'intermediate', targetText: 'この企画書の内容について議論しましょう。', translation: 'Hãy thảo luận về nội dung bản kế hoạch này.' },
  { id: 'd-n-i30', category: 'n2', difficulty: 'intermediate', targetText: '来週のプレゼンテーションの準備を進めています。', translation: 'Đang tiến hành chuẩn bị bài thuyết trình tuần sau.' },
  { id: 'd-n-i31', category: 'n2', difficulty: 'intermediate', targetText: '社長の挨拶から会議が始まります。', translation: 'Cuộc họp bắt đầu từ lời phát biểu của giám đốc.' },
  { id: 'd-n-i32', category: 'n2', difficulty: 'intermediate', targetText: 'この書類には代表者の署名が必要です。', translation: 'Tài liệu này cần chữ ký của người đại diện.' },
  { id: 'd-n-i33', category: 'n2', difficulty: 'intermediate', targetText: '従業員向けの健康診断が来月あります。', translation: 'Có buổi khám sức khỏe định kỳ cho nhân viên vào tháng sau.' },
  { id: 'd-n-i34', category: 'n2', difficulty: 'intermediate', targetText: '交通費は実費精算となります。', translation: 'Chi phí đi lại sẽ được quyết toán theo thực tế.' },
  { id: 'd-n-i35', category: 'n2', difficulty: 'intermediate', targetText: 'このプロジェクトには跨部門チームを結成します。', translation: 'Sẽ thành lập nhóm liên phòng ban cho dự án này.' },

  // ═══════════════════════════════════════════════════════════════
  //  N2 ADVANCED (15 lessons)
  // ═══════════════════════════════════════════════════════════════
  { id: 'd-n-a1', category: 'n2', difficulty: 'advanced', targetText: '地球温暖化問題の解決には国際的な協力が不可欠だ。', translation: 'Hợp tác quốc tế là không thể thiếu cho vấn đề nóng lên toàn cầu.' },
  { id: 'd-n-a2', category: 'n2', difficulty: 'advanced', targetText: '経済に大きな影響を与える政策だ。', translation: 'Đây là chính sách có ảnh hưởng lớn đến nền kinh tế.' },
  { id: 'd-n-a3', category: 'n2', difficulty: 'advanced', targetText: '制度の改革は避けて通れない。', translation: 'Cải cách hệ thống là không thể tránh khỏi.' },
  { id: 'd-n-a4', category: 'n2', difficulty: 'advanced', targetText: '科学技術の発展が社会を根本から変えつつある。', translation: 'Sự phát triển khoa học kỹ thuật đang thay đổi xã hội từ gốc.' },
  { id: 'd-n-a5', category: 'n2', difficulty: 'advanced', targetText: '多様性を尊重する社会の実現が求められている。', translation: 'Xã hội yêu cầu thực hiện sự tôn trọng đa dạng.' },
  { id: 'd-n-a6', category: 'n2', difficulty: 'advanced', targetText: '教育改革なくして人材育成は成り立たない。', translation: 'Không có cải cách giáo dục thì không thể đào tạo nhân tài.' },
  { id: 'd-n-a7', category: 'n2', difficulty: 'advanced', targetText: '情報化社会において個人情報の保護は最重要課題だ。', translation: 'Bảo vệ thông tin cá nhân là vấn đề quan trọng nhất trong xã hội thông tin.' },
  { id: 'd-n-a8', category: 'n2', difficulty: 'advanced', targetText: '異文化間の相互理解がグローバル社会の基盤となる。', translation: 'Hiểu biết lẫn nhau giữa các nền văn hóa là nền tảng của xã hội toàn cầu.' },
  { id: 'd-n-a9', category: 'n2', difficulty: 'advanced', targetText: '格差社会の是正には構造的な改革が不可欠である。', translation: 'Để khắc phục xã hội bất bình đẳng cần cải cách mang tính cấu trúc.' },
  { id: 'd-n-a10', category: 'n2', difficulty: 'advanced', targetText: '持続可能な開発目標の達成に向けた取り組みが加速している。', translation: 'Nỗ lực hướng tới đạt các mục tiêu phát triển bền vững đang tăng tốc.' },
  { id: 'd-n-a11', category: 'n2', difficulty: 'advanced', targetText: '企業のガバナンス改革が急務となっている。', translation: 'Cải cách quản trị doanh nghiệp trở thành nhiệm vụ cấp bách.' },
  { id: 'd-n-a12', category: 'n2', difficulty: 'advanced', targetText: '社会保障制度の持続可能性について議論が行われている。', translation: 'Đang diễn ra thảo luận về tính bền vững của hệ thống an sinh xã hội.' },
  { id: 'd-n-a13', category: 'n2', difficulty: 'advanced', targetText: '労働市場の柔軟性を高める改革が必要だ。', translation: 'Cần cải cách nhằm tăng tính linh hoạt của thị trường lao động.' },
  { id: 'd-n-a14', category: 'n2', difficulty: 'advanced', targetText: '科学的根拠に基づいた意思決定が求められている。', translation: 'Đang được yêu cầu ra quyết định dựa trên bằng chứng khoa học.' },
  { id: 'd-n-a15', category: 'n2', difficulty: 'advanced', targetText: '地域間の格差是正に向けた政策が展開されている。', translation: 'Chính sách nhằm thu hẹp khoảng cách giữa các khu vực đang được triển khai.' },
];

// Helper to build a large mock exam with progressive difficulty (easy → hard)
function buildExamTasks(
  category: 'toeic' | 'n2',
  count: number,
  startOffset: number,
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
): SessionTask[] {
  const cat = category;
  const diffOrder = (d: string) => d === 'beginner' ? 0 : d === 'intermediate' ? 1 : 2;
  const sortByDiff = <T extends { difficulty: string }>(arr: T[]) =>
    [...arr].sort((a, b) => diffOrder(a.difficulty) - diffOrder(b.difficulty));

  let qList = MOCK_QUESTIONS.filter(q => q.category === cat);
  let lList = MOCK_LISTENING_LESSONS.filter(l => l.category === cat);
  let sList = MOCK_SPEAKING_LESSONS.filter(s => s.category === cat);
  let dList = MOCK_DICTATION_LESSONS.filter(d => d.category === cat);

  if (difficulty) {
    qList = qList.filter(q => q.difficulty === difficulty);
    lList = lList.filter(l => l.difficulty === difficulty);
    sList = sList.filter(s => s.difficulty === difficulty);
    dList = dList.filter(d => d.difficulty === difficulty);
  }

  const questions = sortByDiff(qList);
  const listening = sortByDiff(lList);
  const speaking = sortByDiff(sList);
  const dictation = sortByDiff(dList);

  const tasks: SessionTask[] = [];
  let qIdx = startOffset;
  let lIdx = startOffset;
  let sIdx = startOffset;
  let dIdx = startOffset;

  for (let i = 0; i < count; i++) {
    const mod = i % 5;
    if (mod === 0 && listening.length > 0)
      tasks.push({ type: 'listening', data: listening[lIdx++ % listening.length] });
    else if (mod === 3 && speaking.length > 0)
      tasks.push({ type: 'speaking', data: speaking[sIdx++ % speaking.length] });
    else if (mod === 4 && dictation.length > 0)
      tasks.push({ type: 'dictation', data: dictation[dIdx++ % dictation.length] });
    else if (questions.length > 0)
      tasks.push({ type: 'quiz', data: questions[qIdx++ % questions.length] });
  }
  return tasks;
}

export const MOCK_WRITING_LESSONS: WritingLesson[] = [
  // ═══════════════════════════════════════════════════════════════
  //  TOEIC BEGINNER (8 lessons) — simple sentences
  // ═══════════════════════════════════════════════════════════════
  { id: 'w-t-3', category: 'toeic', difficulty: 'beginner', sourceText: 'Please submit the report by Friday.', targetText: 'Vui lòng nộp báo cáo trước thứ Sáu.', hint: 'submit = nộp, report = báo cáo' },
  { id: 'w-t-4', category: 'toeic', difficulty: 'beginner', sourceText: 'The meeting is scheduled for Monday at 10 AM.', targetText: 'Cuộc họp được lên lịch vào thứ Hai lúc 10 giờ sáng.', hint: 'scheduled = được lên lịch' },
  { id: 'w-t-5', category: 'toeic', difficulty: 'beginner', sourceText: 'Where is the nearest restroom?', targetText: 'Nhà vệ sinh gần nhất ở đâu?', hint: 'restroom = nhà vệ sinh' },
  { id: 'w-t-6', category: 'toeic', difficulty: 'beginner', sourceText: 'I would like to introduce myself. My name is John.', targetText: 'Tôi muốn tự giới thiệu. Tôi tên là John.', hint: 'introduce = giới thiệu' },
  { id: 'w-t-7', category: 'toeic', difficulty: 'beginner', sourceText: 'Could you please repeat that?', targetText: 'Bạn có thể nhắc lại được không?', hint: 'repeat = nhắc lại' },
  { id: 'w-t-8', category: 'toeic', difficulty: 'beginner', sourceText: 'The office is on the second floor.', targetText: 'Văn phòng ở tầng hai.', hint: 'floor = tầng' },
  { id: 'w-t-9', category: 'toeic', difficulty: 'beginner', sourceText: 'Turn left at the corner.', targetText: 'Rẽ trái ở góc đường.', hint: 'turn left = rẽ trái' },
  { id: 'w-t-10', category: 'toeic', difficulty: 'beginner', sourceText: 'I need to purchase some office supplies.', targetText: 'Tôi cần mua một số văn phòng phẩm.', hint: 'purchase = mua, supplies = vật tư' },

  // ═══════════════════════════════════════════════════════════════
  //  TOEIC INTERMEDIATE (8 new + 1 existing = 9 total)
  // ═══════════════════════════════════════════════════════════════
  { id: 'w-t-1', category: 'toeic', difficulty: 'intermediate', sourceText: 'Công ty sẽ mở rộng hoạt động sang châu Á vào năm tới.', targetText: 'The company will expand its operations to Asia next year.' },
  { id: 'w-t-11', category: 'toeic', difficulty: 'intermediate', sourceText: 'We would like to schedule a meeting to discuss the project timeline.', targetText: 'Chúng tôi muốn lên lịch họp để thảo luận về timeline dự án.', hint: 'schedule = lên lịch, timeline = thời gian biểu' },
  { id: 'w-t-12', category: 'toeic', difficulty: 'intermediate', sourceText: 'Thank you for your email. I will review the document and get back to you shortly.', targetText: 'Cảm ơn email của bạn. Tôi sẽ xem xét tài liệu và phản hồi bạn sớm.', hint: 'review = xem xét, get back to = phản hồi' },
  { id: 'w-t-13', category: 'toeic', difficulty: 'intermediate', sourceText: 'Please confirm your attendance by the end of this week.', targetText: 'Vui lòng xác nhận tham dự trước cuối tuần này.', hint: 'confirm = xác nhận, attendance = sự tham dự' },
  { id: 'w-t-14', category: 'toeic', difficulty: 'intermediate', sourceText: 'The deadline for the proposal has been extended to next month.', targetText: 'Hạn chót cho đề xuất đã được gia hạn đến tháng sau.', hint: 'deadline = hạn chót, extended = gia hạn' },
  { id: 'w-t-15', category: 'toeic', difficulty: 'intermediate', sourceText: 'Our team has been working hard to meet the quarterly targets.', targetText: 'Đội của chúng tôi đã nỗ lực hết mình để đạt các mục tiêu quý.', hint: 'quarterly = hàng quý, targets = mục tiêu' },
  { id: 'w-t-16', category: 'toeic', difficulty: 'intermediate', sourceText: 'I would appreciate it if you could provide an update on the progress.', targetText: 'Tôi rất mong bạn có thể cung cấp thông tin cập nhật về tiến độ.', hint: 'appreciate = trân trọng, progress = tiến độ' },
  { id: 'w-t-17', category: 'toeic', difficulty: 'intermediate', sourceText: 'The training session will cover customer service best practices.', targetText: 'Buổi đào tạo sẽ đề cập đến các phương pháp tốt nhất về phục vụ khách hàng.', hint: 'best practices = phương pháp tốt nhất' },
  { id: 'w-t-18', category: 'toeic', difficulty: 'intermediate', sourceText: 'Due to budget constraints, we need to reduce operational costs.', targetText: 'Do hạn chế về ngân sách, chúng ta cần giảm chi phí vận hành.', hint: 'constraints = hạn chế, operational = vận hành' },

  // ═══════════════════════════════════════════════════════════════
  //  TOEIC ADVANCED (8 new + 1 existing = 8 total)
  // ═══════════════════════════════════════════════════════════════
  { id: 'w-t-2', category: 'toeic', difficulty: 'advanced', sourceText: 'Mặc dù có những trở ngại không lường trước, dự án đã hoàn thành đúng hạn.', targetText: 'Despite unforeseen hurdles, the project was completed on time.' },
  { id: 'w-t-19', category: 'toeic', difficulty: 'advanced', sourceText: 'The board of directors has unanimously approved the acquisition proposal.', targetText: 'Hội đồng quản trị đã nhất trí phê duyệt đề xuất thâu tóm.', hint: 'unanimously = nhất trí, acquisition = thâu tóm' },
  { id: 'w-t-20', category: 'toeic', difficulty: 'advanced', sourceText: 'In accordance with the regulatory framework, all transactions must be documented.', targetText: 'Theo quy định khung pháp lý, tất cả giao dịch phải được ghi chép đầy đủ.', hint: 'in accordance with = theo, framework = khung' },
  { id: 'w-t-21', category: 'toeic', difficulty: 'advanced', sourceText: 'Our sustainability initiatives have yielded measurable improvements in carbon emissions.', targetText: 'Các sáng kiến bền vững của chúng tôi đã mang lại những cải thiện có thể đo lường về lượng phát thải carbon.', hint: 'sustainability = bền vững, yields = mang lại' },
  { id: 'w-t-22', category: 'toeic', difficulty: 'advanced', sourceText: 'The restructuring plan is designed to optimize resource allocation across all departments.', targetText: 'Kế hoạch tái cấu trúc được thiết kế để tối ưu hóa phân bổ nguồn lực trên tất cả các phòng ban.', hint: 'restructure = tái cấu trúc, allocation = phân bổ' },
  { id: 'w-t-23', category: 'toeic', difficulty: 'advanced', sourceText: 'We must ensure compliance with international trade regulations to avoid penalties.', targetText: 'Chúng ta phải đảm bảo tuân thủ các quy định thương mại quốc tế để tránh phạt.', hint: 'compliance = sự tuân thủ, penalties = hình phạt' },
  { id: 'w-t-24', category: 'toeic', difficulty: 'advanced', sourceText: 'The quarterly earnings report indicates a significant improvement in operating margins.', targetText: 'Báo cáo thu nhập quý cho thấy sự cải thiện đáng kể về biên lợi nhuận vận hành.', hint: 'operating margins = biên lợi nhuận vận hành' },
  { id: 'w-t-25', category: 'toeic', difficulty: 'advanced', sourceText: 'Stakeholder engagement remains integral to the success of our strategic initiatives.', targetText: 'Sự tham gia của các bên liên quan vẫn là yếu tố không thể thiếu cho sự thành công của các sáng kiến chiến lược.', hint: 'stakeholder = bên liên quan, integral = không thể thiếu' },

  // ═══════════════════════════════════════════════════════════════
  //  N2 BEGINNER (8 lessons) — simple Japanese
  // ═══════════════════════════════════════════════════════════════
  { id: 'w-n-3', category: 'n2', difficulty: 'beginner', sourceText: '明日は午後から雨が降るでしょう。', targetText: 'Ngày mai trời sẽ mưa từ buổi chiều.', hint: '午後 = buổi chiều, 降る = rơi/mưa' },
  { id: 'w-n-4', category: 'n2', difficulty: 'beginner', sourceText: '毎朝コーヒーを一杯飲みます。', targetText: 'Mỗi sáng tôi uống một ly cà phê.', hint: '毎朝 = mỗi sáng, 一杯 = một ly' },
  { id: 'w-n-5', category: 'n2', difficulty: 'beginner', sourceText: '週末は友達と公園で散歩しました。', targetText: 'Cuối tuần tôi đã đi dạo ở công viên với bạn.', hint: '散歩する = đi dạo, 友達 = bạn' },
  { id: 'w-n-6', category: 'n2', difficulty: 'beginner', sourceText: 'この映画はとても面白かったです。', targetText: 'Bộ phim này rất thú vị.', hint: '面白い = thú vị' },
  { id: 'w-n-7', category: 'n2', difficulty: 'beginner', sourceText: '東京の天気は今日とても暑いです。', targetText: 'Thời tiết ở Tokyo hôm nay rất nóng.', hint: '天気 = thời tiết, 暑い = nóng' },
  { id: 'w-n-8', category: 'n2', difficulty: 'beginner', sourceText: '来週の月曜日に会議があります。', targetText: 'Có cuộc họp vào thứ Hai tuần sau.', hint: '会議 = cuộc họp, 来週 = tuần sau' },
  { id: 'w-n-9', category: 'n2', difficulty: 'beginner', sourceText: '私は毎日日本語を勉強しています。', targetText: 'Tôi đang học tiếng Nhật mỗi ngày.', hint: '勉強する = học, 毎日 = mỗi ngày' },
  { id: 'w-n-10', category: 'n2', difficulty: 'beginner', sourceText: '新しいアパートは駅から近いです。', targetText: 'Căn hộ mới gần ga tàu.', hint: '近い = gần, 駅 = ga' },

  // ═══════════════════════════════════════════════════════════════
  //  N2 INTERMEDIATE (8 new + 1 existing = 9 total)
  // ═══════════════════════════════════════════════════════════════
  { id: 'w-n-1', category: 'n2', difficulty: 'intermediate', sourceText: 'Anh ấy luôn đến trễ mặc dù đã hứa sẽ đến đúng giờ.', targetText: '彼は時間通りに来ると約束したにもかかわらず、いつも遅刻する。' },
  { id: 'w-n-11', category: 'n2', difficulty: 'intermediate', sourceText: 'この計画の実現には、チーム全体の協力が必要です。', targetText: 'Để thực hiện kế hoạch này, cần sự hợp tác của toàn bộ đội ngũ.', hint: '実現 = thực hiện, 協力 = hợp tác' },
  { id: 'w-n-12', category: 'n2', difficulty: 'intermediate', sourceText: '新しい方針について、来週の会議で説明させていただきます。', targetText: 'Về phương châm mới, tôi xin phép giải thích tại cuộc họp tuần sau.', hint: '方針 = phương chích, 説明 = giải thích' },
  { id: 'w-n-13', category: 'n2', difficulty: 'intermediate', sourceText: 'このプロジェクトの進捗状況を報告いたします。', targetText: 'Tôi xin báo cáo tình hình tiến độ dự án này.', hint: '進捗 = tiến độ, 報告 = báo cáo' },
  { id: 'w-n-14', category: 'n2', difficulty: 'intermediate', sourceText: '今月の売上は前月比で15%増加しました。', targetText: 'Doanh thu tháng này tăng 15% so với tháng trước.', hint: '売上 = doanh thu, 増加 = tăng' },
  { id: 'w-n-15', category: 'n2', difficulty: 'intermediate', sourceText: '海外進出を検討する必要があります。', targetText: 'Cần phải cân nhắc việc mở rộng ra thị trường nước ngoài.', hint: '検討 = cân nhắc, 進出 = mở rộng' },
  { id: 'w-n-16', category: 'n2', difficulty: 'intermediate', sourceText: '質問がございましたら、お気軽にご連絡ください。', targetText: 'Nếu có câu hỏi, xin vui lòng liên hệ.', hint: 'ご連絡 = liên hệ, お気軽に = vui lòng' },
  { id: 'w-n-17', category: 'n2', difficulty: 'intermediate', sourceText: '来月から新しいプロジェクトに参加いたします。', targetText: 'Từ tháng sau tôi sẽ tham gia dự án mới.', hint: '参加 = tham gia, 新しい = mới' },
  { id: 'w-n-18', category: 'n2', difficulty: 'intermediate', sourceText: 'この問題を解決するための最善の方法を模索しています。', targetText: 'Chúng tôi đang tìm kiếm phương pháp tốt nhất để giải quyết vấn đề này.', hint: '解決 = giải quyết, 模索 = tìm kiếm' },

  // ═══════════════════════════════════════════════════════════════
  //  N2 ADVANCED (8 new + 1 existing = 9 total)
  // ═══════════════════════════════════════════════════════════════
  { id: 'w-n-2', category: 'n2', difficulty: 'advanced', sourceText: 'Sau một thời gian dài suy nghĩ, tôi quyết định đổi việc.', targetText: '長い時間考え抜いた末、転職することに決めた。' },
  { id: 'w-n-19', category: 'n2', difficulty: 'advanced', sourceText: '持続可能な社会の実現に向けて、企業の社会的責任が問われている。', targetText: 'Hướng tới thực hiện xã hội bền vững, trách nhiệm xã hội của doanh nghiệp đang được đặt ra.', hint: '持続可能 = bền vững, 社会的責任 = trách nhiệm xã hội' },
  { id: 'w-n-20', category: 'n2', difficulty: 'advanced', sourceText: 'グローバル化の進展に伴い、異文化間コミュニケーションの重要性が増している。', targetText: 'Kéo theo sự tiến bộ của toàn cầu hóa, tầm quan trọng của giao tiếp liên văn hóa đang ngày càng tăng.', hint: 'グローバル化 = toàn cầu hóa, 伴い = kéo theo' },
  { id: 'w-n-21', category: 'n2', difficulty: 'advanced', sourceText: '本研究の結果は、従来の学説とは異なる見解を示唆している。', targetText: 'Kết quả nghiên cứu này cho thấy quan điểm khác với lý thuyết trước đây.', hint: '学説 = lý thuyết, 示唆 = gợi ý/cho thấy' },
  { id: 'w-n-22', category: 'n2', difficulty: 'advanced', sourceText: '企業のガバナンス強化は、 investor relations の観点からも不可欠である。', targetText: 'Cải thiện quản trị doanh nghiệp cũng không thể thiếu từ góc độ quan hệ nhà đầu tư.', hint: 'ガバナンス = quản trị, 不可欠 = không thể thiếu' },
  { id: 'w-n-23', category: 'n2', difficulty: 'advanced', sourceText: 'この問題については、多角的なアプローチが求められている。', targetText: 'Vấn đề này đòi hỏi phương pháp tiếp cận đa chiều.', hint: '多角的 = đa chiều, 求められている = đang được đòi hỏi' },
  { id: 'w-n-24', category: 'n2', difficulty: 'advanced', sourceText: '制度の根本的な改革なくして、抜本的な解決は望めない。', targetText: 'Không có cải cách căn bản hệ thống thì không thể mong đợi giải quyết triệt để.', hint: '根本的 = căn bản, 抜本的 = triệt để' },
  { id: 'w-n-25', category: 'n2', difficulty: 'advanced', sourceText: '技術革新がもたらす社会変革に対して、適切な規制の整備が急務である。', targetText: 'Đối với sự thay đổi xã hội do đổi mới công nghệ mang lại, việc hoàn thiện quy định phù hợp là nhiệm vụ cấp bách.', hint: '規制 = quy định, 急務 = nhiệm vụ cấp bách' }
];

export const MOCK_FULL_EXAMS: FullExam[] = [
  // ═══════════════════════════════════════════════════════════════
  //  TOEIC FULL EXAMS (Beginner to Advanced)
  // ═══════════════════════════════════════════════════════════════
  // --- Beginner ---
  { id: 'fe-tb-24', title: 'TOEIC Beginner 2024', year: 2024, category: 'toeic', difficulty: 'beginner', tasks: buildExamTasks('toeic', 20, 0, 'beginner') },
  { id: 'fe-tb-23', title: 'TOEIC Beginner 2023', year: 2023, category: 'toeic', difficulty: 'beginner', tasks: buildExamTasks('toeic', 20, 15, 'beginner') },
  { id: 'fe-tb-22', title: 'TOEIC Beginner 2022', year: 2022, category: 'toeic', difficulty: 'beginner', tasks: buildExamTasks('toeic', 20, 30, 'beginner') },
  // --- Intermediate ---
  { id: 'fe-ti-24', title: 'TOEIC Intermediate 2024', year: 2024, category: 'toeic', difficulty: 'intermediate', tasks: buildExamTasks('toeic', 25, 0, 'intermediate') },
  { id: 'fe-ti-23', title: 'TOEIC Intermediate 2023', year: 2023, category: 'toeic', difficulty: 'intermediate', tasks: buildExamTasks('toeic', 25, 20, 'intermediate') },
  { id: 'fe-ti-22', title: 'TOEIC Intermediate 2022', year: 2022, category: 'toeic', difficulty: 'intermediate', tasks: buildExamTasks('toeic', 25, 40, 'intermediate') },
  // --- Advanced ---
  { id: 'fe-ta-24', title: 'TOEIC Advanced 2024', year: 2024, category: 'toeic', difficulty: 'advanced', tasks: buildExamTasks('toeic', 30, 0, 'advanced') },
  { id: 'fe-ta-23', title: 'TOEIC Advanced 2023', year: 2023, category: 'toeic', difficulty: 'advanced', tasks: buildExamTasks('toeic', 30, 25, 'advanced') },
  { id: 'fe-ta-22', title: 'TOEIC Advanced 2022', year: 2022, category: 'toeic', difficulty: 'advanced', tasks: buildExamTasks('toeic', 30, 50, 'advanced') },

  // ═══════════════════════════════════════════════════════════════
  //  JLPT FULL EXAMS (N5 to N2)
  // ═══════════════════════════════════════════════════════════════
  // --- N5 ---
  { id: 'fe-n5-24', title: 'JLPT N5 模試 2024', year: 2024, category: 'n2', difficulty: 'beginner', tasks: buildExamTasks('n2', 15, 0, 'beginner') },
  { id: 'fe-n5-23', title: 'JLPT N5 模試 2023', year: 2023, category: 'n2', difficulty: 'beginner', tasks: buildExamTasks('n2', 15, 10, 'beginner') },
  { id: 'fe-n5-22', title: 'JLPT N5 模試 2022', year: 2022, category: 'n2', difficulty: 'beginner', tasks: buildExamTasks('n2', 15, 20, 'beginner') },
  // --- N4 ---
  { id: 'fe-n4-24', title: 'JLPT N4 模試 2024', year: 2024, category: 'n2', difficulty: 'beginner', tasks: buildExamTasks('n2', 15, 30, 'beginner') },
  { id: 'fe-n4-23', title: 'JLPT N4 模試 2023', year: 2023, category: 'n2', difficulty: 'beginner', tasks: buildExamTasks('n2', 15, 40, 'beginner') },
  { id: 'fe-n4-22', title: 'JLPT N4 模試 2022', year: 2022, category: 'n2', difficulty: 'beginner', tasks: buildExamTasks('n2', 15, 50, 'beginner') },
  // --- N3 ---
  { id: 'fe-n3-24', title: 'JLPT N3 模試 2024', year: 2024, category: 'n2', difficulty: 'intermediate', tasks: buildExamTasks('n2', 20, 0, 'intermediate') },
  { id: 'fe-n3-23', title: 'JLPT N3 模試 2023', year: 2023, category: 'n2', difficulty: 'intermediate', tasks: buildExamTasks('n2', 20, 15, 'intermediate') },
  { id: 'fe-n3-22', title: 'JLPT N3 模試 2022', year: 2022, category: 'n2', difficulty: 'intermediate', tasks: buildExamTasks('n2', 20, 30, 'intermediate') },
  // --- N2 ---
  { id: 'fe-n2-24', title: 'JLPT N2 模試 2024', year: 2024, category: 'n2', difficulty: 'advanced', tasks: buildExamTasks('n2', 25, 0, 'advanced') },
  { id: 'fe-n2-23', title: 'JLPT N2 模試 2023', year: 2023, category: 'n2', difficulty: 'advanced', tasks: buildExamTasks('n2', 25, 20, 'advanced') },
  { id: 'fe-n2-22', title: 'JLPT N2 模試 2022', year: 2022, category: 'n2', difficulty: 'advanced', tasks: buildExamTasks('n2', 25, 40, 'advanced') },
];
