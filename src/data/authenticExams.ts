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
  },
  {
    id: 'toeic-auth-2',
    title: 'TOEIC Practice Exam 2',
    difficulty: 'intermediate',
    year: 2024,
    category: 'toeic',
    timeLimitMinutes: 120,
    sections: [
      {
        id: 't2-sec-1',
        title: 'Part 1: Photographs',
        description: 'Look at the photograph and choose the statement that best describes it.',
        questions: [
          {
            id: 't2-p1-1',
            text: 'Look at the picture and choose the correct statement.',
            imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=400',
            options: ['A. The woman is typing on a laptop.', 'B. The man is presenting to an audience.', 'C. They are shaking hands across a desk.', 'D. Workers are assembling products on a line.'],
            correctAnswer: 1,
            explanation: 'Mô tả đúng là người đàn ông đang trình bày trước khán giả.'
          },
          {
            id: 't2-p1-2',
            text: 'Look at the picture and choose the correct statement.',
            imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400',
            options: ['A. A receptionist is greeting a visitor.', 'B. Employees are eating lunch in a cafeteria.', 'C. A group is sitting around a conference table.', 'D. A janitor is cleaning the floors.'],
            correctAnswer: 2,
            explanation: 'Hình ảnh cho thấy một nhóm người ngồi quanh bàn họp.'
          },
          {
            id: 't2-p1-3',
            text: 'Look at the picture and choose the correct statement.',
            imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400',
            options: ['A. The shelves are fully stocked with products.', 'B. The cashier is scanning items at the register.', 'C. A customer is examining a product label.', 'D. A forklift is moving pallets in a warehouse.'],
            correctAnswer: 0,
            explanation: 'Các kệ hàng được trưng bày đầy đủ sản phẩm.'
          },
          {
            id: 't2-p1-4',
            text: 'Look at the picture and choose the correct statement.',
            imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=400',
            options: ['A. People are boarding an airplane.', 'B. An employee is working at a desk.', 'C. Colleagues are chatting near a water cooler.', 'D. A courier is delivering a package.'],
            correctAnswer: 2,
            explanation: 'Nhân viên đang trò chuyện gần máy nước uống.'
          },
          {
            id: 't2-p1-5',
            text: 'Look at the picture and choose the correct statement.',
            imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400',
            options: ['A. The chef is preparing food in the kitchen.', 'B. A worker is reviewing documents on a desk.', 'C. Passengers are waiting at the gate.', 'D. The gardener is trimming the hedges.'],
            correctAnswer: 1,
            explanation: 'Người lao động đang xem xét tài liệu trên bàn.'
          },
          {
            id: 't2-p1-6',
            text: 'Look at the picture and choose the correct statement.',
            imageUrl: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&q=80&w=400',
            options: ['A. A technician is repairing equipment.', 'B. The lobby has modern furniture and decor.', 'C. A salesperson is demonstrating a product.', 'D. Workers are loading trucks at the dock.'],
            correctAnswer: 1,
            explanation: 'Sảnh có nội thất và trang trí hiện đại.'
          }
        ]
      },
      {
        id: 't2-sec-2',
        title: 'Part 2: Question-Response',
        description: 'Listen to a question and 3 possible responses. Choose the best response.',
        questions: [
          {
            id: 't2-p2-1',
            text: 'Where should I submit the quarterly report?',
            options: ['A. By email to the HR department.', 'B. Yes, I submitted it yesterday.', 'C. It was due last Monday.'],
            correctAnswer: 0,
            explanation: 'Câu hỏi "Where" yêu cầu nơi chốn. Đáp án A nêu rõ địa điểm.'
          },
          {
            id: 't2-p2-2',
            text: 'Who is responsible for the marketing budget?',
            options: ['A. The budget meeting is at noon.', 'B. The director of marketing handles it.', 'C. It was approved last week.'],
            correctAnswer: 1,
            explanation: 'Câu hỏi "Who" yêu cầu người. Đáp án B nêu người phụ trách.'
          },
          {
            id: 't2-p2-3',
            text: 'How often are performance reviews conducted?',
            options: ['A. They are held twice a year.', 'B. Yes, mine went very well.', 'C. In the conference room.'],
            correctAnswer: 0,
            explanation: 'Câu hỏi "How often" yêu cầu tần suất.'
          },
          {
            id: 't2-p2-4',
            text: 'Can you send me the updated client list?',
            options: ['A. It was sent this morning.', 'B. Sure, I will forward it right away.', 'C. The clients are on the third floor.'],
            correctAnswer: 1,
            explanation: 'Đáp án B chấp nhận yêu cầu và hứa gửi ngay.'
          },
          {
            id: 't2-p2-5',
            text: 'What time does the training session start?',
            options: ['A. In the training center.', 'B. It starts at two o\'clock.', 'C. Yes, I attended it.'],
            correctAnswer: 1,
            explanation: 'Câu hỏi "What time" yêu cầu thời gian.'
          },
          {
            id: 't2-p2-6',
            text: 'Has the shipment arrived yet?',
            options: ['A. It should be here by Thursday.', 'B. To the warehouse on Elm Street.', 'C. I shipped it last week.'],
            correctAnswer: 0,
            explanation: 'Đáp án A trả lời về thời gian lô hàng đến.'
          },
          {
            id: 't2-p2-7',
            text: 'Why was the meeting postponed?',
            options: ['A. The meeting room is booked.', 'B. Because the manager is traveling.', 'C. It will last about an hour.'],
            correctAnswer: 1,
            explanation: 'Câu hỏi "Why" yêu cầu lý do. Đáp án B đưa ra nguyên nhân.'
          },
          {
            id: 't2-p2-8',
            text: 'Do you know when the office closes today?',
            options: ['A. At six o\'clock, as usual.', 'B. Yes, I closed the window.', 'C. The office is on Park Avenue.'],
            correctAnswer: 0,
            explanation: 'Đáp án A cho biết giờ đóng cửa.'
          },
          {
            id: 't2-p2-9',
            text: 'Which department should handle this complaint?',
            options: ['A. The complaint was filed last week.', 'B. Customer service takes care of it.', 'C. I handled it personally.'],
            correctAnswer: 1,
            explanation: 'Câu hỏi "Which department" yêu cầu bộ phận. Đáp án B nêu rõ.'
          },
          {
            id: 't2-p2-10',
            text: 'Are there any vacancies for a sales associate?',
            options: ['A. The salary is competitive.', 'B. Yes, we have two open positions.', 'C. I enjoy working in sales.'],
            correctAnswer: 1,
            explanation: 'Đáp án B trả lời trực tiếp "yes" và cho biết số vị trí trống.'
          },
          {
            id: 't2-p2-11',
            text: 'How much does the annual subscription cost?',
            options: ['A. It costs 200 dollars per year.', 'B. I subscribed last month.', 'C. It auto-renews annually.'],
            correctAnswer: 0,
            explanation: 'Câu hỏi "How much" yêu cầu giá tiền.'
          },
          {
            id: 't2-p2-12',
            text: 'Would you like to attend the workshop?',
            options: ['A. It was a great workshop.', 'B. The workshop is on Friday.', 'C. Yes, I would love to.'],
            correctAnswer: 2,
            explanation: 'Đáp án C chấp nhận lời mời một cách lịch sự.'
          },
          {
            id: 't2-p2-13',
            text: 'When is the deadline for the proposal?',
            options: ['A. Submit it to the project manager.', 'B. Next Wednesday at noon.', 'C. The proposal looks good.'],
            correctAnswer: 1,
            explanation: 'Câu hỏi "When" yêu cầu thời hạn.'
          },
          {
            id: 't2-p2-14',
            text: 'Who approved the purchase order?',
            options: ['A. It was approved by the finance director.', 'B. The purchase was made yesterday.', 'C. In the accounting department.'],
            correctAnswer: 0,
            explanation: 'Câu hỏi "Who" yêu cầu người. Đáp án A nêu rõ người phê duyệt.'
          },
          {
            id: 't2-p2-15',
            text: 'Is there a parking garage near the office?',
            options: ['A. Yes, there is one on Maple Street.', 'B. I parked near the entrance.', 'C. The garage is being renovated.'],
            correctAnswer: 0,
            explanation: 'Đáp án A xác nhận có bãi đỗ xe và cho biết vị trí.'
          },
          {
            id: 't2-p2-16',
            text: 'How do I connect to the office Wi-Fi?',
            options: ['A. I am connected already.', 'B. Use the guest network and enter the password on the board.', 'C. The Wi-Fi router is in the corner.'],
            correctAnswer: 1,
            explanation: 'Đáp án B hướng dẫn cách kết nối.'
          },
          {
            id: 't2-p2-17',
            text: 'What will the new software update include?',
            options: ['A. It will include better security features.', 'B. I updated it last night.', 'C. The software is compatible with all devices.'],
            correctAnswer: 0,
            explanation: 'Câu hỏi "What" yêu cầu thông tin. Đáp án A mô tả nội dung cập nhật.'
          },
          {
            id: 't2-p2-18',
            text: 'Where can I find the supply closet?',
            options: ['A. I need more supplies.', 'B. It is next to the break room.', 'C. The supplies arrived this morning.'],
            correctAnswer: 1,
            explanation: 'Câu hỏi "Where" yêu cầu nơi chốn.'
          },
          {
            id: 't2-p2-19',
            text: 'Did you receive the contract revisions?',
            options: ['A. I reviewed them this morning.', 'B. The contract is 20 pages long.', 'C. I will receive them by courier.'],
            correctAnswer: 0,
            explanation: 'Đáp án A xác nhận đã nhận và xem xét.'
          },
          {
            id: 't2-p2-20',
            text: 'Why was the order canceled?',
            options: ['A. Because the supplier was out of stock.', 'B. The order was placed online.', 'C. We placed a new order.'],
            correctAnswer: 0,
            explanation: 'Câu hỏi "Why" yêu cầu lý do. Đáp án A đưa ra nguyên nhân.'
          },
          {
            id: 't2-p2-21',
            text: 'How long is the probationary period?',
            options: ['A. It is on the ninth floor.', 'B. Three months, according to the handbook.', 'C. I am still in my probation.'],
            correctAnswer: 1,
            explanation: 'Câu hỏi "How long" yêu cầu thời gian. Đáp án B cho biết 3 tháng.'
          },
          {
            id: 't2-p2-22',
            text: 'Can the vendor deliver by Friday?',
            options: ['A. The vendor is located downtown.', 'B. They said they could deliver Thursday instead.', 'C. We have ordered from them before.'],
            correctAnswer: 1,
            explanation: 'Đáp án B trả lời về khả năng giao hàng.'
          },
          {
            id: 't2-p2-23',
            text: 'Where did you put the filing cabinet?',
            options: ['A. I put it in the corner of the office.', 'B. It arrived last Tuesday.', 'C. I filed the documents already.'],
            correctAnswer: 0,
            explanation: 'Câu hỏi "Where" yêu cầu nơi đặt tủ hồ sơ.'
          },
          {
            id: 't2-p2-24',
            text: 'Have the taxes been filed yet?',
            options: ['A. The tax office is nearby.', 'B. Yes, the accountant filed them yesterday.', 'C. The taxes are quite high this year.'],
            correctAnswer: 1,
            explanation: 'Đáp án B xác nhận đã nộp thuế và cho biết thời gian.'
          },
          {
            id: 't2-p2-25',
            text: 'Who should I contact about the invoice error?',
            options: ['A. The invoice was sent on Monday.', 'B. Contact the accounts payable department.', 'C. The error was minor.'],
            correctAnswer: 1,
            explanation: 'Đáp án B hướng dẫn liên hệ bộ phận kế toán thanh toán.'
          }
        ]
      },
      {
        id: 't2-sec-3',
        title: 'Part 3: Conversations',
        description: 'Listen to a conversation and answer 3 questions.',
        questions: [
          {
            id: 't2-p3-1',
            passage: 'Man: Have you seen the new project guidelines? They arrived this morning.\nWoman: Yes, I printed them out. There are some significant changes to the timeline.\nMan: Really? I thought we were on schedule.\nWoman: The client wants to move the launch date up by two weeks.',
            text: 'What are the speakers discussing?',
            options: ['A. A client meeting', 'B. New project guidelines', 'C. A printing error', 'D. The office schedule'],
            correctAnswer: 1,
            explanation: 'Họ đang thảo luận về các hướng dẫn dự án mới.'
          },
          {
            id: 't2-p3-2',
            passage: 'Man: Have you seen the new project guidelines? They arrived this morning.\nWoman: Yes, I printed them out. There are some significant changes to the timeline.\nMan: Really? I thought we were on schedule.\nWoman: The client wants to move the launch date up by two weeks.',
            text: 'What change does the client want?',
            options: ['A. A bigger budget', 'B. A different team', 'C. An earlier launch date', 'D. More testing time'],
            correctAnswer: 2,
            explanation: 'Khách hàng muốn đẩy ngày ra mắt lên sớm hơn hai tuần.'
          },
          {
            id: 't2-p3-3',
            passage: 'Man: Have you seen the new project guidelines? They arrived this morning.\nWoman: Yes, I printed them out. There are some significant changes to the timeline.\nMan: Really? I thought we were on schedule.\nWoman: The client wants to move the launch date up by two weeks.',
            text: 'How does the man initially react?',
            options: ['A. He is excited about the changes.', 'B. He is surprised by the news.', 'C. He already knew about it.', 'D. He is angry at the client.'],
            correctAnswer: 1,
            explanation: 'Người đàn ông tỏ ra ngạc nhiên vì nghĩ rằng dự án đang đúng tiến độ.'
          },
          {
            id: 't2-p3-4',
            passage: 'Woman: Good morning, this is Greenfield Hotel. How may I help you?\nMan: I\'d like to book a conference room for next Thursday, please.\nWoman: For how many people?\nMan: About thirty. We also need a projector and a microphone.',
            text: 'What is the man\'s purpose?',
            options: ['A. To check in at the hotel', 'B. To cancel a reservation', 'C. To reserve a conference room', 'D. To order room service'],
            correctAnswer: 2,
            explanation: 'Người đàn ông muốn đặt phòng hội nghị.'
          },
          {
            id: 't2-p3-5',
            passage: 'Woman: Good morning, this is Greenfield Hotel. How may I help you?\nMan: I\'d like to book a conference room for next Thursday, please.\nWoman: For how many people?\nMan: About thirty. We also need a projector and a microphone.',
            text: 'What equipment does the man need?',
            options: ['A. A printer and scanner', 'B. A projector and microphone', 'C. A whiteboard and markers', 'D. A coffee machine and cups'],
            correctAnswer: 1,
            explanation: 'Ông ấy cần máy chiếu và micro.'
          },
          {
            id: 't2-p3-6',
            passage: 'Woman: Good morning, this is Greenfield Hotel. How may I help you?\nMan: I\'d like to book a conference room for next Thursday, please.\nWoman: For how many people?\nMan: About thirty. We also need a projector and a microphone.',
            text: 'How many people will attend?',
            options: ['A. About ten', 'B. About twenty', 'C. About thirty', 'D. About forty'],
            correctAnswer: 2,
            explanation: 'Ông ấy nói có khoảng ba mươi người.'
          },
          {
            id: 't2-p3-7',
            passage: 'Man: Hi, I\'m calling about my order number 5520. It was supposed to arrive yesterday.\nWoman: Let me look that up for you. It seems there was a delay at the shipping facility.\nMan: I need it by tomorrow. Can you expedite the delivery?\nWoman: I\'ll see what I can do. Can you hold for a moment?',
            text: 'What is the man calling about?',
            options: ['A. Placing a new order', 'B. A late delivery', 'C. A billing issue', 'D. Returning a product'],
            correctAnswer: 1,
            explanation: 'Ông ấy gọi về việc giao hàng bị trễ.'
          },
          {
            id: 't2-p3-8',
            passage: 'Man: Hi, I\'m calling about my order number 5520. It was supposed to arrive yesterday.\nWoman: Let me look that up for you. It seems there was a delay at the shipping facility.\nMan: I need it by tomorrow. Can you expedite the delivery?\nWoman: I\'ll see what I can do. Can you hold for a moment?',
            text: 'Why was the order delayed?',
            options: ['A. The item was out of stock.', 'B. There was a shipping facility delay.', 'C. The man entered the wrong address.', 'D. The courier lost the package.'],
            correctAnswer: 1,
            explanation: 'Đơn hàng bị trễ do chậm trễ tại cơ sở vận chuyển.'
          },
          {
            id: 't2-p3-9',
            passage: 'Man: Hi, I\'m calling about my order number 5520. It was supposed to arrive yesterday.\nWoman: Let me look that up for you. It seems there was a delay at the shipping facility.\nMan: I need it by tomorrow. Can you expedite the delivery?\nWoman: I\'ll see what I can do. Can you hold for a moment?',
            text: 'What does the woman ask the man to do?',
            options: ['A. Provide his credit card number', 'B. Wait on the line', 'C. Call back later', 'D. Visit the store in person'],
            correctAnswer: 1,
            explanation: 'Người phụ nữ yêu cầu người đàn ông giữ máy trong giây lát.'
          },
          {
            id: 't2-p3-10',
            passage: 'Woman: Do you have the sales figures for last quarter?\nMan: Yes, they are in the shared drive under the Finance folder.\nWoman: Great. I need to include them in my presentation for the board meeting.\nMan: The numbers look good. Revenue is up twelve percent.',
            text: 'Where can the woman find the figures?',
            options: ['A. In the Finance folder on the shared drive', 'B. On the company\'s website', 'C. In the marketing department', 'D. In the printed newsletter'],
            correctAnswer: 0,
            explanation: 'Số liệu nằm trong thư mục Finance trên ổ đĩa chung.'
          },
          {
            id: 't2-p3-11',
            passage: 'Woman: Do you have the sales figures for last quarter?\nMan: Yes, they are in the shared drive under the Finance folder.\nWoman: Great. I need to include them in my presentation for the board meeting.\nMan: The numbers look good. Revenue is up twelve percent.',
            text: 'What is the revenue change?',
            options: ['A. Down 12%', 'B. Up 12%', 'C. Up 20%', 'D. No change'],
            correctAnswer: 1,
            explanation: 'Doanh thu tăng 12%.'
          },
          {
            id: 't2-p3-12',
            passage: 'Woman: Do you have the sales figures for last quarter?\nMan: Yes, they are in the shared drive under the Finance folder.\nWoman: Great. I need to include them in my presentation for the board meeting.\nMan: The numbers look good. Revenue is up twelve percent.',
            text: 'Why does the woman need the figures?',
            options: ['A. To file taxes', 'B. To prepare for a board meeting', 'C. To update the website', 'D. To train new employees'],
            correctAnswer: 1,
            explanation: 'Cô ấy cần số liệu cho bài thuyết trình họp hội đồng quản trị.'
          },
          {
            id: 't2-p3-13',
            passage: 'Man: Excuse me, I think there\'s a mistake on my paycheck.\nWoman: What seems to be the problem?\nMan: I was paid for forty hours, but I worked fifty this week.\nWoman: I\'ll have to check with the payroll department. Can you submit a timesheet correction form?',
            text: 'What is the problem?',
            options: ['A. The man was overpaid.', 'B. The paycheck is missing overtime hours.', 'C. The paycheck was lost.', 'D. The man did not work this week.'],
            correctAnswer: 1,
            explanation: 'Phiếu lương thiếu giờ làm thêm.'
          },
          {
            id: 't2-p3-14',
            passage: 'Man: Excuse me, I think there\'s a mistake on my paycheck.\nWoman: What seems to be the problem?\nMan: I was paid for forty hours, but I worked fifty this week.\nWoman: I\'ll have to check with the payroll department. Can you submit a timesheet correction form?',
            text: 'How many hours did the man actually work?',
            options: ['A. 40 hours', 'B. 50 hours', 'C. 60 hours', 'D. 45 hours'],
            correctAnswer: 1,
            explanation: 'Ông ấy đã làm việc 50 giờ.'
          },
          {
            id: 't2-p3-15',
            passage: 'Man: Excuse me, I think there\'s a mistake on my paycheck.\nWoman: What seems to be the problem?\nMan: I was paid for forty hours, but I worked fifty this week.\nWoman: I\'ll have to check with the payroll department. Can you submit a timesheet correction form?',
            text: 'What does the woman ask the man to do?',
            options: ['A. Call the bank', 'B. Submit a timesheet correction form', 'C. Wait for his next paycheck', 'D. Speak to his manager'],
            correctAnswer: 1,
            explanation: 'Cô ấy yêu cầu ông ấy nộp đơn chỉnh sửa bảng chấm công.'
          },
          {
            id: 't2-p3-16',
            passage: 'Woman: Welcome to the interview. Please have a seat.\nMan: Thank you. I\'m very excited about this opportunity.\nWoman: Let\'s start. Tell me about your previous experience in project management.\nMan: I managed a team of ten people for three years at my last company.',
            text: 'What is the purpose of this conversation?',
            options: ['A. A job interview', 'B. A team meeting', 'C. A performance review', 'D. A client presentation'],
            correctAnswer: 0,
            explanation: 'Đây là một cuộc phỏng vấn việc làm.'
          },
          {
            id: 't2-p3-17',
            passage: 'Woman: Welcome to the interview. Please have a seat.\nMan: Thank you. I\'m very excited about this opportunity.\nWoman: Let\'s start. Tell me about your previous experience in project management.\nMan: I managed a team of ten people for three years at my last company.',
            text: 'How long did the man manage a team?',
            options: ['A. One year', 'B. Two years', 'C. Three years', 'D. Five years'],
            correctAnswer: 2,
            explanation: 'Ông ấy quản lý đội nhóm trong ba năm.'
          },
          {
            id: 't2-p3-18',
            passage: 'Woman: Welcome to the interview. Please have a seat.\nMan: Thank you. I\'m very excited about this opportunity.\nWoman: Let\'s start. Tell me about your previous experience in project management.\nMan: I managed a team of ten people for three years at my last company.',
            text: 'How large was the team the man managed?',
            options: ['A. 5 people', 'B. 8 people', 'C. 10 people', 'D. 15 people'],
            correctAnswer: 2,
            explanation: 'Ông ấy quản lý một đội gồm mười người.'
          },
          {
            id: 't2-p3-19',
            passage: 'Man: Hi, I need to return this printer. It\'s been malfunctioning since I bought it.\nWoman: I\'m sorry to hear that. Do you have the receipt?\nMan: Yes, here it is. I purchased it last week.\nWoman: I can offer you a replacement or a full refund. Which would you prefer?',
            text: 'Why does the man want to return the printer?',
            options: ['A. It was too expensive.', 'B. It is not working properly.', 'C. He found a better one.', 'D. He does not need it anymore.'],
            correctAnswer: 1,
            explanation: 'Máy in gặp sự cố từ khi mua.'
          },
          {
            id: 't2-p3-20',
            passage: 'Man: Hi, I need to return this printer. It\'s been malfunctioning since I bought it.\nWoman: I\'m sorry to hear that. Do you have the receipt?\nMan: Yes, here it is. I purchased it last week.\nWoman: I can offer you a replacement or a full refund. Which would you prefer?',
            text: 'What does the woman offer?',
            options: ['A. A discount on a new purchase', 'B. A store credit', 'C. A replacement or full refund', 'D. A repair service'],
            correctAnswer: 2,
            explanation: 'Cô ấy đề xuất đổi hàng hoặc hoàn tiền.'
          },
          {
            id: 't2-p3-21',
            passage: 'Man: Hi, I need to return this printer. It\'s been malfunctioning since I bought it.\nWoman: I\'m sorry to hear that. Do you have the receipt?\nMan: Yes, here it is. I purchased it last week.\nWoman: I can offer you a replacement or a full refund. Which would you prefer?',
            text: 'When did the man purchase the printer?',
            options: ['A. Today', 'B. Last week', 'C. Last month', 'D. Two weeks ago'],
            correctAnswer: 1,
            explanation: 'Ông ấy mua máy in vào tuần trước.'
          },
          {
            id: 't2-p3-22',
            passage: 'Woman: Have you finished the budget proposal for next year?\nMan: Almost. I\'m still working on the research and development section.\nWoman: The deadline is Friday. Can you have it done by then?\nMan: Yes, I just need to verify the numbers with the accounting team.',
            text: 'What is the man working on?',
            options: ['A. A marketing plan', 'B. A budget proposal', 'C. A customer survey', 'D. An employee handbook'],
            correctAnswer: 1,
            explanation: 'Ông ấy đang làm bản đề xuất ngân sách.'
          },
          {
            id: 't2-p3-23',
            passage: 'Woman: Have you finished the budget proposal for next year?\nMan: Almost. I\'m still working on the research and development section.\nWoman: The deadline is Friday. Can you have it done by then?\nMan: Yes, I just need to verify the numbers with the accounting team.',
            text: 'When is the deadline?',
            options: ['A. Monday', 'B. Wednesday', 'C. Friday', 'D. Next week'],
            correctAnswer: 2,
            explanation: 'Hạn chót là thứ Sáu.'
          },
          {
            id: 't2-p3-24',
            passage: 'Woman: Have you finished the budget proposal for next year?\nMan: Almost. I\'m still working on the research and development section.\nWoman: The deadline is Friday. Can you have it done by then?\nMan: Yes, I just need to verify the numbers with the accounting team.',
            text: 'Who does the man need to check the numbers with?',
            options: ['A. The marketing team', 'B. The HR department', 'C. The accounting team', 'D. The legal department'],
            correctAnswer: 2,
            explanation: 'Ông ấy cần xác nhận số liệu với đội kế toán.'
          },
          {
            id: 't2-p3-25',
            passage: 'Man: Good afternoon, I have a reservation under the name Martinez.\nWoman: Welcome, Mr. Martinez. We have you in a deluxe suite on the eighth floor.\nMan: Wonderful. Is the gym open late tonight?\nWoman: Yes, the fitness center is open until midnight.',
            text: 'What type of room was reserved?',
            options: ['A. Standard room', 'B. Deluxe suite', 'C. Penthouse', 'D. Twin room'],
            correctAnswer: 1,
            explanation: 'Phòng đặt là phòng hạng sang (deluxe suite).'
          },
          {
            id: 't2-p3-26',
            passage: 'Man: Good afternoon, I have a reservation under the name Martinez.\nWoman: Welcome, Mr. Martinez. We have you in a deluxe suite on the eighth floor.\nMan: Wonderful. Is the gym open late tonight?\nWoman: Yes, the fitness center is open until midnight.',
            text: 'What floor is the room on?',
            options: ['A. Fifth', 'B. Sixth', 'C. Eighth', 'D. Tenth'],
            correctAnswer: 2,
            explanation: 'Phòng ở tầng tám.'
          },
          {
            id: 't2-p3-27',
            passage: 'Man: Good afternoon, I have a reservation under the name Martinez.\nWoman: Welcome, Mr. Martinez. We have you in a deluxe suite on the eighth floor.\nMan: Wonderful. Is the gym open late tonight?\nWoman: Yes, the fitness center is open until midnight.',
            text: 'Until what time is the gym open?',
            options: ['A. 10:00 PM', 'B. 11:00 PM', 'C. Midnight', 'D. 1:00 AM'],
            correctAnswer: 2,
            explanation: 'Phòng tập mở cửa đến nửa đêm.'
          },
          {
            id: 't2-p3-28',
            passage: 'Woman: I heard the company is planning to expand overseas.\nMan: Yes, the CEO announced it at the all-hands meeting.\nWoman: Will there be positions available for employees to transfer?\nMan: They said internal candidates will get priority.',
            text: 'What is the company planning?',
            options: ['A. A merger', 'B. Overseas expansion', 'C. A new product launch', 'D. Office relocation'],
            correctAnswer: 1,
            explanation: 'Công ty đang lên kế hoạch mở rộng ra nước ngoài.'
          },
          {
            id: 't2-p3-29',
            passage: 'Woman: I heard the company is planning to expand overseas.\nMan: Yes, the CEO announced it at the all-hands meeting.\nWoman: Will there be positions available for employees to transfer?\nMan: They said internal candidates will get priority.',
            text: 'Who will have priority for transfer positions?',
            options: ['A. External applicants', 'B. Recent graduates', 'C. Internal employees', 'D. Managers only'],
            correctAnswer: 2,
            explanation: 'Ứng viên nội bộ sẽ được ưu tiên.'
          },
          {
            id: 't2-p3-30',
            passage: 'Woman: I heard the company is planning to expand overseas.\nMan: Yes, the CEO announced it at the all-hands meeting.\nWoman: Will there be positions available for employees to transfer?\nMan: They said internal candidates will get priority.',
            text: 'Where was this announced?',
            options: ['A. In an email', 'B. At an all-hands meeting', 'C. On the company website', 'D. In a press release'],
            correctAnswer: 1,
            explanation: 'Thông báo được đưa ra tại cuộc họp toàn công ty.'
          },
          {
            id: 't2-p3-31',
            passage: 'Man: Could you help me set up the conference room for the 3 o\'clock meeting?\nWoman: Sure. How many attendees are expected?\nMan: About fifteen. We\'ll need a projector screen and some water bottles.\nWoman: I\'ll also set up name tags and notepads at each seat.',
            text: 'What is being set up?',
            options: ['A. A break room', 'B. A conference room', 'C. A training area', 'D. A reception desk'],
            correctAnswer: 1,
            explanation: 'Họ đang chuẩn bị phòng họp.'
          },
          {
            id: 't2-p3-32',
            passage: 'Man: Could you help me set up the conference room for the 3 o\'clock meeting?\nWoman: Sure. How many attendees are expected?\nMan: About fifteen. We\'ll need a projector screen and some water bottles.\nWoman: I\'ll also set up name tags and notepads at each seat.',
            text: 'What additional items will the woman set up?',
            options: ['A. Coffee cups and snacks', 'B. Name tags and notepads', 'C. Chairs and tables', 'D. Microphones and speakers'],
            correctAnswer: 1,
            explanation: 'Cô ấy sẽ chuẩn bị thẻ tên và sổ tay.'
          },
          {
            id: 't2-p3-33',
            passage: 'Man: Could you help me set up the conference room for the 3 o\'clock meeting?\nWoman: Sure. How many attendees are expected?\nMan: About fifteen. We\'ll need a projector screen and some water bottles.\nWoman: I\'ll also set up name tags and notepads at each seat.',
            text: 'What time is the meeting?',
            options: ['A. 2:00 PM', 'B. 2:30 PM', 'C. 3:00 PM', 'D. 3:30 PM'],
            correctAnswer: 2,
            explanation: 'Cuộc họp lúc 3 giờ chiều.'
          },
          {
            id: 't2-p3-34',
            passage: 'Woman: Our website traffic has increased by thirty percent this month.\nMan: That\'s great news! What do you think caused the increase?\nWoman: The new SEO strategy is working, and the social media campaign helped too.\nMan: We should keep investing in digital marketing.',
            text: 'What has increased?',
            options: ['A. Product sales', 'B. Website traffic', 'C. Employee count', 'D. Office space'],
            correctAnswer: 1,
            explanation: 'Lưu lượng truy cập website đã tăng.'
          },
          {
            id: 't2-p3-35',
            passage: 'Woman: Our website traffic has increased by thirty percent this month.\nMan: That\'s great news! What do you think caused the increase?\nWoman: The new SEO strategy is working, and the social media campaign helped too.\nMan: We should keep investing in digital marketing.',
            text: 'What strategies contributed to the increase?',
            options: ['A. TV advertising and radio spots', 'B. Email marketing and direct mail', 'C. SEO strategy and social media campaign', 'D. Billboard ads and print media'],
            correctAnswer: 2,
            explanation: 'Chiến lược SEO và chiến dịch mạng xã hội đã giúp tăng.'
          },
          {
            id: 't2-p3-36',
            passage: 'Woman: Our website traffic has increased by thirty percent this month.\nMan: That\'s great news! What do you think caused the increase?\nWoman: The new SEO strategy is working, and the social media campaign helped too.\nMan: We should keep investing in digital marketing.',
            text: 'What does the man suggest?',
            options: ['A. Reduce the marketing budget', 'B. Hire more staff', 'C. Continue investing in digital marketing', 'D. Focus on traditional advertising'],
            correctAnswer: 2,
            explanation: 'Ông ấy đề xuất tiếp tục đầu tư vào tiếp thị kỹ thuật số.'
          },
          {
            id: 't2-p3-37',
            passage: 'Man: I need to file an insurance claim for the water damage in the office.\nWoman: What happened?\nMan: A pipe burst over the weekend and flooded the storage room.\nWoman: I\'ll contact the insurance company right away. Do you have photos of the damage?',
            text: 'What is the man trying to do?',
            options: ['A. Repair the pipe', 'B. File an insurance claim', 'C. Move to a new office', 'D. Replace the storage room'],
            correctAnswer: 1,
            explanation: 'Ông ấy đang cố nộp yêu cầu bảo hiểm.'
          },
          {
            id: 't2-p3-38',
            passage: 'Man: I need to file an insurance claim for the water damage in the office.\nWoman: What happened?\nMan: A pipe burst over the weekend and flooded the storage room.\nWoman: I\'ll contact the insurance company right away. Do you have photos of the damage?',
            text: 'When did the incident occur?',
            options: ['A. Yesterday', 'B. Over the weekend', 'C. Last month', 'D. This morning'],
            correctAnswer: 1,
            explanation: 'Sự cố xảy ra vào cuối tuần.'
          },
          {
            id: 't2-p3-39',
            passage: 'Man: I need to file an insurance claim for the water damage in the office.\nWoman: What happened?\nMan: A pipe burst over the weekend and flooded the storage room.\nWoman: I\'ll contact the insurance company right away. Do you have photos of the damage?',
            text: 'What does the woman ask for?',
            options: ['A. A written report', 'B. Photos of the damage', 'C. A doctor\'s note', 'D. The maintenance log'],
            correctAnswer: 1,
            explanation: 'Cô ấy yêu cầu ảnh chụp thiệt hại.'
          }
        ]
      },
      {
        id: 't2-sec-4',
        title: 'Part 4: Short Talks',
        description: 'Listen to a short talk and answer questions.',
        questions: [
          {
            id: 't2-p4-1',
            passage: 'Good morning, everyone. I\'d like to remind you that the annual company picnic will be held this Saturday at Riverside Park. Activities will begin at 10 AM and include a barbecue, games, and a raffle. Please bring your families. We look forward to seeing you there.',
            text: 'When will the picnic be held?',
            options: ['A. This Friday', 'B. This Saturday', 'C. Next Saturday', 'D. Next Sunday'],
            correctAnswer: 1,
            explanation: 'Đi dã ngoại sẽ được tổ chức vào thứ Bảy này.'
          },
          {
            id: 't2-p4-2',
            passage: 'Good morning, everyone. I\'d like to remind you that the annual company picnic will be held this Saturday at Riverside Park. Activities will begin at 10 AM and include a barbecue, games, and a raffle. Please bring your families. We look forward to seeing you there.',
            text: 'What activity is NOT mentioned?',
            options: ['A. A barbecue', 'B. Games', 'C. Swimming', 'D. A raffle'],
            correctAnswer: 2,
            explanation: 'Bơi lội không được đề cập.'
          },
          {
            id: 't2-p4-3',
            passage: 'Good morning, everyone. I\'d like to remind you that the annual company picnic will be held this Saturday at Riverside Park. Activities will begin at 10 AM and include a barbecue, games, and a raffle. Please bring your families. We look forward to seeing you there.',
            text: 'Who is invited to attend?',
            options: ['A. Only managers', 'B. Only new employees', 'C. Employees and their families', 'D. External clients only'],
            correctAnswer: 2,
            explanation: 'Nhân viên và gia đình được mời tham dự.'
          },
          {
            id: 't2-p4-4',
            passage: 'Attention all employees. The elevators on the east side of the building will be out of service tomorrow from 8 AM to 4 PM for scheduled maintenance. Please use the west elevators during this time. We apologize for the inconvenience.',
            text: 'Why are the elevators out of service?',
            options: ['A. A power outage', 'B. Scheduled maintenance', 'C. Overcrowding', 'D. An elevator accident'],
            correctAnswer: 1,
            explanation: 'Thang máy dừng hoạt động để bảo trì theo lịch.'
          },
          {
            id: 't2-p4-5',
            passage: 'Attention all employees. The elevators on the east side of the building will be out of service tomorrow from 8 AM to 4 PM for scheduled maintenance. Please use the west elevators during this time. We apologize for the inconvenience.',
            text: 'Until what time will the elevators be unavailable?',
            options: ['A. 2 PM', 'B. 3 PM', 'C. 4 PM', 'D. 5 PM'],
            correctAnswer: 2,
            explanation: 'Thang máy sẽ không hoạt động đến 4 giờ chiều.'
          },
          {
            id: 't2-p4-6',
            passage: 'Attention all employees. The elevators on the east side of the building will be out of service tomorrow from 8 AM to 4 PM for scheduled maintenance. Please use the west elevators during this time. We apologize for the inconvenience.',
            text: 'Which elevators should employees use?',
            options: ['A. The east elevators', 'B. The west elevators', 'C. The freight elevator', 'D. The stairs only'],
            correctAnswer: 1,
            explanation: 'Nhân viên nên sử dụng thang máy phía tây.'
          },
          {
            id: 't2-p4-7',
            passage: 'Thank you for calling Tech Solutions. Our office is currently closed. Our regular business hours are Monday through Friday, 9 AM to 6 PM. If you have an urgent matter, please press 1 to leave a message, or visit our website for online support.',
            text: 'When is the office open?',
            options: ['A. Monday to Saturday, 9 to 5', 'B. Monday to Friday, 9 AM to 6 PM', 'C. Weekends only', 'D. 24 hours a day'],
            correctAnswer: 1,
            explanation: 'Giờ làm việc từ thứ Hai đến thứ Sáu, 9 giờ sáng đến 6 giờ tối.'
          },
          {
            id: 't2-p4-8',
            passage: 'Thank you for calling Tech Solutions. Our office is currently closed. Our regular business hours are Monday through Friday, 9 AM to 6 PM. If you have an urgent matter, please press 1 to leave a message, or visit our website for online support.',
            text: 'What should callers do for urgent matters?',
            options: ['A. Call back during business hours', 'B. Send a fax', 'C. Press 1 to leave a message', 'D. Visit the office in person'],
            correctAnswer: 2,
            explanation: 'Người gọi nên nhấn 1 để để lại tin nhắn cho vấn đề khẩn cấp.'
          },
          {
            id: 't2-p4-9',
            passage: 'Thank you for calling Tech Solutions. Our office is currently closed. Our regular business hours are Monday through Friday, 9 AM to 6 PM. If you have an urgent matter, please press 1 to leave a message, or visit our website for online support.',
            text: 'What is the name of the company?',
            options: ['A. Tech World', 'B. Tech Solutions', 'C. Tech Support', 'D. Tech Services'],
            correctAnswer: 1,
            explanation: 'Tên công ty là Tech Solutions.'
          },
          {
            id: 't2-p4-10',
            passage: 'This is a reminder that the parking lot on Oak Street will be closed this weekend for resurfacing. Employees who normally park there should use the garage on Pine Avenue instead. Sorry for any inconvenience.',
            text: 'Why is the parking lot closing?',
            options: ['A. A special event', 'B. Road construction', 'C. Resurfacing', 'D. Safety inspection'],
            correctAnswer: 2,
            explanation: 'Bãi đỗ xe đóng cửa để trải lại bề mặt.'
          },
          {
            id: 't2-p4-11',
            passage: 'This is a reminder that the parking lot on Oak Street will be closed this weekend for resurfacing. Employees who normally park there should use the garage on Pine Avenue instead. Sorry for any inconvenience.',
            text: 'Where should employees park instead?',
            options: ['A. On Oak Street', 'B. On Elm Street', 'C. The garage on Pine Avenue', 'D. In the visitor lot'],
            correctAnswer: 2,
            explanation: 'Nhân viên nên đỗ xe tại gara trên đại lộ Pine.'
          },
          {
            id: 't2-p4-12',
            passage: 'This is a reminder that the parking lot on Oak Street will be closed this weekend for resurfacing. Employees who normally park there should use the garage on Pine Avenue instead. Sorry for any inconvenience.',
            text: 'When will the parking lot be closed?',
            options: ['A. This week', 'B. This weekend', 'C. Next week', 'D. All month'],
            correctAnswer: 1,
            explanation: 'Bãi đỗ xe sẽ đóng cửa vào cuối tuần này.'
          },
          {
            id: 't2-p4-13',
            passage: 'Good afternoon. I\'m pleased to announce that starting next month, all employees will have access to our new wellness program. The program includes gym memberships, mental health counseling, and nutritional consultations. Sign-up details will be sent by email this Friday.',
            text: 'What does the wellness program include?',
            options: ['A. Free lunch and parking', 'B. Gym memberships, counseling, and consultations', 'C. Travel vouchers and discounts', 'D. Childcare and tutoring services'],
            correctAnswer: 1,
            explanation: 'Chương trình bao gồm thẻ tập gym, tư vấn tâm lý và tư vấn dinh dưỡng.'
          },
          {
            id: 't2-p4-14',
            passage: 'Good afternoon. I\'m pleased to announce that starting next month, all employees will have access to our new wellness program. The program includes gym memberships, mental health counseling, and nutritional consultations. Sign-up details will be sent by email this Friday.',
            text: 'When will the program start?',
            options: ['A. This month', 'B. Next month', 'C. Next quarter', 'D. Next year'],
            correctAnswer: 1,
            explanation: 'Chương trình bắt đầu từ tháng sau.'
          },
          {
            id: 't2-p4-15',
            passage: 'Good afternoon. I\'m pleased to announce that starting next month, all employees will have access to our new wellness program. The program includes gym memberships, mental health counseling, and nutritional consultations. Sign-up details will be sent by email this Friday.',
            text: 'How will sign-up information be distributed?',
            options: ['A. Through a company meeting', 'B. By email', 'C. On the company bulletin board', 'D. Through the HR office'],
            correctAnswer: 1,
            explanation: 'Thông tin đăng ký sẽ được gửi qua email.'
          },
          {
            id: 't2-p4-16',
            passage: 'Attention shoppers. We are having a store-wide clearance sale this weekend. All items are twenty to fifty percent off. This is a great opportunity to get holiday gifts at reduced prices. The sale ends Sunday at closing time.',
            text: 'What is being announced?',
            options: ['A. A new store opening', 'B. A clearance sale', 'C. A product recall', 'D. A change in store hours'],
            correctAnswer: 1,
            explanation: 'Đang thông báo về chương trình khuyến mãi thanh lý.'
          },
          {
            id: 't2-p4-17',
            passage: 'Attention shoppers. We are having a store-wide clearance sale this weekend. All items are twenty to fifty percent off. This is a great opportunity to get holiday gifts at reduced prices. The sale ends Sunday at closing time.',
            text: 'How much can customers save?',
            options: ['A. 10 to 20%', 'B. 20 to 50%', 'C. 50 to 70%', 'D. Up to 90%'],
            correctAnswer: 1,
            explanation: 'Khách hàng tiết kiệm từ 20 đến 50%.'
          },
          {
            id: 't2-p4-18',
            passage: 'Attention shoppers. We are having a store-wide clearance sale this weekend. All items are twenty to fifty percent off. This is a great opportunity to get holiday gifts at reduced prices. The sale ends Sunday at closing time.',
            text: 'When does the sale end?',
            options: ['A. Saturday evening', 'B. Sunday morning', 'C. Sunday at closing time', 'D. Monday morning'],
            correctAnswer: 2,
            explanation: 'Chương trình kết thúc vào lúc đóng cửa chủ nhật.'
          },
          {
            id: 't2-p4-19',
            passage: 'This is your captain speaking. We have just taken off from JFK Airport and are headed to London Heathrow. Our flight time will be approximately seven hours. We expect some turbulence over the Atlantic, so please keep your seatbelts fastened when the sign is on.',
            text: 'Where is the flight headed?',
            options: ['A. Paris', 'B. London Heathrow', 'C. Tokyo', 'D. Dubai'],
            correctAnswer: 1,
            explanation: 'Chuyến bay đang hướng đến London Heathrow.'
          },
          {
            id: 't2-p4-20',
            passage: 'This is your captain speaking. We have just taken off from JFK Airport and are headed to London Heathrow. Our flight time will be approximately seven hours. We expect some turbulence over the Atlantic, so please keep your seatbelts fastened when the sign is on.',
            text: 'How long is the flight expected to take?',
            options: ['A. 5 hours', 'B. 6 hours', 'C. 7 hours', 'D. 8 hours'],
            correctAnswer: 2,
            explanation: 'Thời gian bay dự kiến khoảng bảy tiếng.'
          },
          {
            id: 't2-p4-21',
            passage: 'This is your captain speaking. We have just taken off from JFK Airport and are headed to London Heathrow. Our flight time will be approximately seven hours. We expect some turbulence over the Atlantic, so please keep your seatbelts fastened when the sign is on.',
            text: 'What does the captain ask passengers to do?',
            options: ['A. Close their window shades', 'B. Fasten their seatbelts', 'C. Return to their seats', 'D. Turn off all devices'],
            correctAnswer: 1,
            explanation: 'Phi công yêu cầu hành khách thắt dây an toàn.'
          },
          {
            id: 't2-p4-22',
            passage: 'Ladies and gentlemen, welcome to the Grandview Conference Center. The keynote session will begin at 9 AM in the main ballroom. Workshop sessions will follow at 10:30 AM. A complimentary lunch will be served at noon in the dining hall. Please pick up your agenda at the registration desk.',
            text: 'What time does the keynote session start?',
            options: ['A. 8:00 AM', 'B. 8:30 AM', 'C. 9:00 AM', 'D. 9:30 AM'],
            correctAnswer: 2,
            explanation: 'Phiên keynote bắt đầu lúc 9 giờ sáng.'
          },
          {
            id: 't2-p4-23',
            passage: 'Ladies and gentlemen, welcome to the Grandview Conference Center. The keynote session will begin at 9 AM in the main ballroom. Workshop sessions will follow at 10:30 AM. A complimentary lunch will be served at noon in the dining hall. Please pick up your agenda at the registration desk.',
            text: 'Where will lunch be served?',
            options: ['A. In the ballroom', 'B. In the dining hall', 'C. In the parking lot', 'D. At the registration desk'],
            correctAnswer: 1,
            explanation: 'Bữa trưa sẽ được phục vụ tại hội trường ăn uống.'
          },
          {
            id: 't2-p4-24',
            passage: 'Ladies and gentlemen, welcome to the Grandview Conference Center. The keynote session will begin at 9 AM in the main ballroom. Workshop sessions will follow at 10:30 AM. A complimentary lunch will be served at noon in the dining hall. Please pick up your agenda at the registration desk.',
            text: 'What can attendees pick up at the registration desk?',
            options: ['A. Name badges', 'B. An agenda', 'C. A meal ticket', 'D. A parking pass'],
            correctAnswer: 1,
            explanation: 'Người tham dự có thể nhận lịch trình tại quầy đăng ký.'
          },
          {
            id: 't2-p4-25',
            passage: 'This is a public service announcement. The city will be conducting a water main repair on Elm Street starting Monday. Residents in the area may experience low water pressure for two to three days. Bottled water will be available at City Hall.',
            text: 'What is being repaired?',
            options: ['A. A road', 'B. A water main', 'C. A power line', 'D. A sewer system'],
            correctAnswer: 1,
            explanation: 'Đang sửa chữa đường ống nước chính.'
          },
          {
            id: 't2-p4-26',
            passage: 'This is a public service announcement. The city will be conducting a water main repair on Elm Street starting Monday. Residents in the area may experience low water pressure for two to three days. Bottled water will be available at City Hall.',
            text: 'How long may residents experience low water pressure?',
            options: ['A. One day', 'B. Two to three days', 'C. A week', 'D. Two weeks'],
            correctAnswer: 1,
            explanation: 'Cư dân có thể bị giảm áp suất nước trong hai đến ba ngày.'
          },
          {
            id: 't2-p4-27',
            passage: 'This is a public service announcement. The city will be conducting a water main repair on Elm Street starting Monday. Residents in the area may experience low water pressure for two to three days. Bottled water will be available at City Hall.',
            text: 'Where can residents get bottled water?',
            options: ['A. At the local store', 'B. At City Hall', 'C. At the hospital', 'D. At the police station'],
            correctAnswer: 1,
            explanation: 'Cư dân có thể lấy nước đóng chai tại Tòa thị chính.'
          },
          {
            id: 't2-p4-28',
            passage: 'Hello, everyone. I\'m calling to let you know that our office will be closed on Monday for the holiday. Regular business will resume on Tuesday. If you need emergency assistance, please call our after-hours hotline at 555-0199.',
            text: 'Why is the office closed?',
            options: ['A. Due to bad weather', 'B. For a holiday', 'C. For employee training', 'D. Due to a building issue'],
            correctAnswer: 1,
            explanation: 'Văn phòng đóng cửa nghỉ lễ.'
          },
          {
            id: 't2-p4-29',
            passage: 'Hello, everyone. I\'m calling to let you know that our office will be closed on Monday for the holiday. Regular business will resume on Tuesday. If you need emergency assistance, please call our after-hours hotline at 555-0199.',
            text: 'What number should be called for emergencies?',
            options: ['A. 555-0188', 'B. 555-0199', 'C. 555-0200', 'D. 555-0100'],
            correctAnswer: 1,
            explanation: 'Số điện thoại khẩn cấp là 555-0199.'
          },
          {
            id: 't2-p4-30',
            passage: 'Hello, everyone. I\'m calling to let you know that our office will be closed on Monday for the holiday. Regular business will resume on Tuesday. If you need emergency assistance, please call our after-hours hotline at 555-0199.',
            text: 'When will the office reopen?',
            options: ['A. Monday', 'B. Tuesday', 'C. Wednesday', 'D. Thursday'],
            correctAnswer: 1,
            explanation: 'Văn phòng mở cửa lại vào thứ Ba.'
          }
        ]
      },
      {
        id: 't2-sec-5',
        title: 'Part 5: Incomplete Sentences',
        description: 'Choose the word that best completes the sentence.',
        questions: [
          {
            id: 't2-p5-1',
            text: 'The manager asked the team to submit their reports _____ the end of the week.',
            options: ['A. in', 'B. at', 'C. by', 'D. until'],
            correctAnswer: 2,
            explanation: '"By" có nghĩa "trước thời điểm", dùng với deadline.'
          },
          {
            id: 't2-p5-2',
            text: 'Due to the increase in demand, the factory has decided to _____ production by twenty percent.',
            options: ['A. reduce', 'B. expand', 'C. delay', 'D. cancel'],
            correctAnswer: 1,
            explanation: 'Nhu cầu tăng nên cần mở rộng sản xuất.'
          },
          {
            id: 't2-p5-3',
            text: 'The company will _____ a new training program for all new hires.',
            options: ['A. introduce', 'B. reduce', 'C. remove', 'D. decrease'],
            correctAnswer: 0,
            explanation: 'Giới thiệu chương trình đào tạo mới.'
          },
          {
            id: 't2-p5-4',
            text: 'Please make sure all documents are _____ before submitting them to the client.',
            options: ['A. proofread', 'B. proofreading', 'C. proofreads', 'D. proofreaded'],
            correctAnswer: 0,
            explanation: 'Cấu trúc bị động: are + V3 (proofread).'
          },
          {
            id: 't2-p5-5',
            text: 'The seminar was very _____; I learned several useful techniques.',
            options: ['A. informative', 'B. inform', 'C. information', 'D. informally'],
            correctAnswer: 0,
            explanation: 'Cần tính từ "informative" sau động từ "was".'
          },
          {
            id: 't2-p5-6',
            text: 'She has been working in the finance department _____ over ten years.',
            options: ['A. since', 'B. for', 'C. during', 'D. while'],
            correctAnswer: 1,
            explanation: '"For" dùng với khoảng thời gian (over ten years).'
          },
          {
            id: 't2-p5-7',
            text: 'The new policy will take _____ on the first of January.',
            options: ['A. place', 'B. effect', 'C. part', 'D. action'],
            correctAnswer: 1,
            explanation: '"Take effect" nghĩa là "có hiệu lực".'
          },
          {
            id: 't2-p5-8',
            text: 'All employees must wear _____ badges when entering the building.',
            options: ['A. identifying', 'B. identified', 'C. identification', 'D. identify'],
            correctAnswer: 2,
            explanation: '"Identification badges" = thẻ nhận dạng.'
          },
          {
            id: 't2-p5-9',
            text: 'The board of directors will _____ the proposal at next month\'s meeting.',
            options: ['A. consider', 'B. considering', 'C. consideration', 'D. considered'],
            correctAnswer: 0,
            explanation: 'Động từ nguyên形 sau "will".'
          },
          {
            id: 't2-p5-10',
            text: 'We appreciate your _____ in completing the survey.',
            options: ['A. participate', 'B. participating', 'C. participation', 'D. participant'],
            correctAnswer: 2,
            explanation: 'Cần danh từ sau possessive pronoun "your".'
          },
          {
            id: 't2-p5-11',
            text: 'The shipment will arrive _____ than expected due to the weather.',
            options: ['A. later', 'B. latest', 'C. late', 'D. latter'],
            correctAnswer: 0,
            explanation: '"Later" là so sánh hơn của "late".'
          },
          {
            id: 't2-p5-12',
            text: 'Ms. Tanaka has been appointed _____ the head of the international division.',
            options: ['A. for', 'B. as', 'C. to', 'D. with'],
            correctAnswer: 1,
            explanation: '"Appointed as" = được bổ nhiệm làm.'
          },
          {
            id: 't2-p5-13',
            text: 'Customers are advised to _____ their reservations at least 48 hours in advance.',
            options: ['A. confirm', 'B. confirmly', 'C. confirmation', 'D. confirmed'],
            correctAnswer: 0,
            explanation: 'Động từ nguyên形 sau "to".'
          },
          {
            id: 't2-p5-14',
            text: 'The annual report provides a _____ overview of the company\'s financial performance.',
            options: ['A. comprehensively', 'B. comprehensive', 'C. comprehended', 'D. comprehending'],
            correctAnswer: 1,
            explanation: 'Cần tính từ "comprehensive"修饰 noun "overview".'
          },
          {
            id: 't2-p5-15',
            text: 'The meeting was rescheduled _____ a conflict with the director\'s calendar.',
            options: ['A. because', 'B. because of', 'C. since to', 'D. due'],
            correctAnswer: 1,
            explanation: '"Because of" + noun phrase.'
          },
          {
            id: 't2-p5-16',
            text: 'Please ensure that all equipment is _____ maintained and inspected regularly.',
            options: ['A. proper', 'B. properly', 'C. propriety', 'D. properness'],
            correctAnswer: 1,
            explanation: 'Cần trạng từ "properly"修饰 động từ "maintained".'
          },
          {
            id: 't2-p5-17',
            text: 'The conference room on the fifth floor is _____ for private meetings only.',
            options: ['A. reserve', 'B. reserved', 'C. reserving', 'D. reservation'],
            correctAnswer: 1,
            explanation: 'Cấu trúc bị động: is + V3 (reserved).'
          },
          {
            id: 't2-p5-18',
            text: 'If you have any questions, please do not hesitate to _____ us.',
            options: ['A. contact', 'B. contacting', 'C. contacted', 'D. contacts'],
            correctAnswer: 0,
            explanation: 'Động từ nguyên形 sau "do not hesitate to".'
          },
          {
            id: 't2-p5-19',
            text: 'The results of the survey were _____ with great interest by the management team.',
            options: ['A. receive', 'B. received', 'C. receiving', 'D. receives'],
            correctAnswer: 1,
            explanation: 'Cấu trúc bị động: were + V3 (received).'
          },
          {
            id: 't2-p5-20',
            text: 'Our company offers _____ benefits to all full-time employees.',
            options: ['A. competitiveness', 'B. competitive', 'C. competed', 'D. competing'],
            correctAnswer: 1,
            explanation: 'Tính từ "competitive"修饰名词 "benefits".'
          },
          {
            id: 't2-p5-21',
            text: 'The CEO will _____ step down at the end of this fiscal year.',
            options: ['A. formal', 'B. formally', 'C. formality', 'D. formalized'],
            correctAnswer: 1,
            explanation: 'Trạng từ "formally"修饰 động từ "step down".'
          },
          {
            id: 't2-p5-22',
            text: 'The company has a strict _____ regarding the use of personal devices at work.',
            options: ['A. procedure', 'B. policy', 'C. agreement', 'D. contract'],
            correctAnswer: 1,
            explanation: '"Policy" = chính sách, quy định.'
          },
          {
            id: 't2-p5-23',
            text: 'We need to _____ the budget before we can proceed with the project.',
            options: ['A. approve', 'B. approved', 'C. approving', 'D. approval'],
            correctAnswer: 0,
            explanation: 'Động từ nguyên形 sau "need to".'
          },
          {
            id: 't2-p5-24',
            text: 'The supplier was unable to _____ the order on time.',
            options: ['A. delivery', 'B. deliver', 'C. delivered', 'D. delivering'],
            correctAnswer: 1,
            explanation: 'Động từ nguyên形 sau "was unable to".'
          },
          {
            id: 't2-p5-25',
            text: 'The office is equipped with state-of-the-art _____ to ensure a comfortable working environment.',
            options: ['A. facilities', 'B. faculty', 'C. factors', 'D. favors'],
            correctAnswer: 0,
            explanation: '"Facilities" = cơ sở vật chất.'
          },
          {
            id: 't2-p5-26',
            text: 'Due to budget constraints, the project was _____ to a smaller team.',
            options: ['A. assign', 'B. assigned', 'C. assigning', 'D. assignment'],
            correctAnswer: 1,
            explanation: 'Cấu trúc bị động: was + V3 (assigned).'
          },
          {
            id: 't2-p5-27',
            text: 'The employee handbook contains _____ information about company procedures.',
            options: ['A. detail', 'B. detailed', 'C. detailing', 'D. details'],
            correctAnswer: 1,
            explanation: 'Tính từ "detailed"修饰名词 "information".'
          },
          {
            id: 't2-p5-28',
            text: '_____ submitting your application, please attach your résumé and cover letter.',
            options: ['A. Before', 'B. Since', 'C. Although', 'D. Unless'],
            correctAnswer: 0,
            explanation: '"Before" = trước khi, hợp lý nhất trong ngữ cảnh.'
          },
          {
            id: 't2-p5-29',
            text: 'The manager decided to _____ the meeting until the following week.',
            options: ['A. postpone', 'B. cancel', 'C. advance', 'D. proceed'],
            correctAnswer: 0,
            explanation: '"Postpone" = hoãn lại.'
          },
          {
            id: 't2-p5-30',
            text: 'It is _____ that all staff members attend the mandatory safety training.',
            options: ['A. required', 'B. requiring', 'C. requirement', 'D. requires'],
            correctAnswer: 0,
            explanation: 'Cấu trúc bị động: It is required that...'
          }
        ]
      },
      {
        id: 't2-sec-6',
        title: 'Part 6: Text Completion',
        description: 'Choose the best word or phrase to complete the text.',
        questions: [
          {
            id: 't2-p6-1',
            passage: 'To: All Employees\nFrom: Human Resources\n\nAll staff members are required to complete their annual performance self-evaluations by March 31st. Please log in to the company portal and _____ the self-assessment form.',
            text: 'Choose the correct word.',
            options: ['A. complete', 'B. completed', 'C. completing', 'D. completion'],
            correctAnswer: 0,
            explanation: 'Động từ nguyên形 sau "and" nối tiếp với "log in".'
          },
          {
            id: 't2-p6-2',
            passage: 'To: All Employees\nFrom: Human Resources\n\nAll staff members are required to complete their annual performance self-evaluations by March 31st. Please log in to the company portal and complete the self-assessment form. _____ you need assistance, please contact the HR helpdesk.',
            text: 'Choose the correct word.',
            options: ['A. Unless', 'B. Although', 'C. If', 'D. While'],
            correctAnswer: 2,
            explanation: '"If" = nếu, tạo câu điều kiện hợp lý.'
          },
          {
            id: 't2-p6-3',
            passage: 'To: All Employees\nFrom: Human Resources\n\nAll staff members are required to complete their annual performance self-evaluations by March 31st. Please log in to the company portal and complete the self-assessment form. If you need assistance, please contact the HR helpdesk. Failure to submit on time may _____ your annual review.',
            text: 'Choose the correct word.',
            options: ['A. effect', 'B. affect', 'C. infect', 'D. perfect'],
            correctAnswer: 1,
            explanation: '"Affect" = ảnh hưởng (động từ). "Effect" là danh từ.'
          },
          {
            id: 't2-p6-4',
            passage: 'To: All Employees\nFrom: Human Resources\n\nAll staff members are required to complete their annual performance self-evaluations by March 31st. Please log in to the company portal and complete the self-assessment form. If you need assistance, please contact the HR helpdesk. Failure to submit on time may affect your annual review. Your cooperation is greatly _____.',
            text: 'Choose the correct word.',
            options: ['A. appreciate', 'B. appreciated', 'C. appreciating', 'D. appreciation'],
            correctAnswer: 1,
            explanation: 'Cấu trúc bị động: is + V3 (appreciated).'
          },
          {
            id: 't2-p6-5',
            passage: 'Dear Valued Customer,\n\nThank you for your recent purchase. We are writing to inform you that your order has been shipped and is expected to arrive within 5-7 business days. You can track your package using the _____ number provided below.',
            text: 'Choose the correct word.',
            options: ['A. track', 'B. tracking', 'C. tracked', 'D. tracker'],
            correctAnswer: 1,
            explanation: '"Tracking number" = mã theo dõi.'
          },
          {
            id: 't2-p6-6',
            passage: 'Dear Valued Customer,\n\nThank you for your recent purchase. We are writing to inform you that your order has been shipped and is expected to arrive within 5-7 business days. You can track your package using the tracking number provided below. If you have any questions or concerns, please do not hesitate to contact our customer service team, _____ is available 24/7.',
            text: 'Choose the correct word.',
            options: ['A. who', 'B. whom', 'C. which', 'D. where'],
            correctAnswer: 2,
            explanation: '"Which" thay thế cho "customer service team" (vật/thứ).'
          },
          {
            id: 't2-p6-7',
            passage: 'Dear Valued Customer,\n\nThank you for your recent purchase. We are writing to inform you that your order has been shipped and is expected to arrive within 5-7 business days. You can track your package using the tracking number provided below. If you have any questions or concerns, please do not hesitate to contact our customer service team, which is available 24/7. We _____ to serving you.',
            text: 'Choose the correct word.',
            options: ['A. look forward', 'B. look ahead', 'C. look up', 'D. look into'],
            correctAnswer: 0,
            explanation: '"Look forward to" = mong đợi.'
          },
          {
            id: 't2-p6-8',
            passage: 'Dear Valued Customer,\n\nThank you for your recent purchase. We are writing to inform you that your order has been shipped and is expected to arrive within 5-7 business days. You can track your package using the tracking number provided below. If you have any questions or concerns, please do not hesitate to contact our customer service team, which is available 24/7. We look forward to serving you. Thank you for choosing our _____.',
            text: 'Choose the correct word.',
            options: ['A. company', 'B. business', 'C. store', 'D. products'],
            correctAnswer: 1,
            explanation: '"Choosing our business" = chọn dịch vụ của chúng tôi.'
          },
          {
            id: 't2-p6-9',
            passage: 'MEMORANDUM\n\nTo: Department Managers\nFrom: Facilities Management\n\nPlease be advised that the building\'s heating system will undergo maintenance this weekend. As a _____, temperatures in the office may be lower than usual on Monday morning.',
            text: 'Choose the correct word.',
            options: ['A. result', 'B. fact', 'C. rule', 'D. chance'],
            correctAnswer: 0,
            explanation: '"As a result" = do đó.'
          },
          {
            id: 't2-p6-10',
            passage: 'MEMORANDUM\n\nTo: Department Managers\nFrom: Facilities Management\n\nPlease be advised that the building\'s heating system will undergo maintenance this weekend. As a result, temperatures in the office may be lower than usual on Monday morning. We recommend that employees _____ warm clothing.',
            text: 'Choose the correct word.',
            options: ['A. put on', 'B. wear', 'C. bring', 'D. carry'],
            correctAnswer: 1,
            explanation: '"Wear warm clothing" = mặc quần áo ấm.'
          },
          {
            id: 't2-p6-11',
            passage: 'MEMORANDUM\n\nTo: Department Managers\nFrom: Facilities Management\n\nPlease be advised that the building\'s heating system will undergo maintenance this weekend. As a result, temperatures in the office may be lower than usual on Monday morning. We recommend that employees wear warm clothing. The heating system is expected to be fully _____ by Tuesday.',
            text: 'Choose the correct word.',
            options: ['A. operate', 'B. operated', 'C. operating', 'D. operational'],
            correctAnswer: 3,
            explanation: '"Fully operational" = hoạt động đầy đủ (tính từ).'
          },
          {
            id: 't2-p6-12',
            passage: 'NOTICE TO ALL STAFF\n\nThe company has recently upgraded its computer network to improve security and performance. All employees are _____ to update their passwords by the end of this month.',
            text: 'Choose the correct word.',
            options: ['A. request', 'B. requested', 'C. requesting', 'D. requests'],
            correctAnswer: 1,
            explanation: 'Cấu trúc bị động: are + V3 (requested).'
          },
          {
            id: 't2-p6-13',
            passage: 'NOTICE TO ALL STAFF\n\nThe company has recently upgraded its computer network to improve security and performance. All employees are requested to update their passwords by the end of this month. New passwords must be at least eight characters long and include a _____ of letters, numbers, and symbols.',
            text: 'Choose the correct word.',
            options: ['A. mixing', 'B. mixture', 'C. mixed', 'D. mix'],
            correctAnswer: 1,
            explanation: '"A mixture of" = hỗn hợp của.'
          },
          {
            id: 't2-p6-14',
            passage: 'NOTICE TO ALL STAFF\n\nThe company has recently upgraded its computer network to improve security and performance. All employees are requested to update their passwords by the end of this month. New passwords must be at least eight characters long and include a mixture of letters, numbers, and symbols. Employees who fail to comply may _____ access to company systems.',
            text: 'Choose the correct word.',
            options: ['A. lose', 'B. loose', 'C. lost', 'D. losing'],
            correctAnswer: 0,
            explanation: 'Động từ "lose" = mất. "Loose" = lỏng lẻo.'
          },
          {
            id: 't2-p6-15',
            passage: 'INVITATION\n\nYou are cordially invited to attend the Grand Opening of our new branch office. The event will take place on Saturday, April 15th, from 2:00 PM to 5:00 PM at 123 Business Avenue. Light refreshments will be _____.',
            text: 'Choose the correct word.',
            options: ['A. provided', 'B. produce', 'C. profit', 'D. promote'],
            correctAnswer: 0,
            explanation: '"Will be provided" = sẽ được cung cấp (bị động).'
          },
          {
            id: 't2-p6-16',
            passage: 'INVITATION\n\nYou are cordially invited to attend the Grand Opening of our new branch office. The event will take place on Saturday, April 15th, from 2:00 PM to 5:00 PM at 123 Business Avenue. Light refreshments will be provided. Please RSVP by April 10th to _____ your attendance.',
            text: 'Choose the correct word.',
            options: ['A. confirm', 'B. conform', 'C. confine', 'D. confide'],
            correctAnswer: 0,
            explanation: '"Confirm your attendance" = xác nhận sự tham dự.'
          }
        ]
      },
      {
        id: 't2-sec-7',
        title: 'Part 7: Reading Comprehension',
        description: 'Read the passage and answer the questions.',
        questions: [
          {
            id: 't2-p7-1',
            passage: 'Greenfield Industries is pleased to announce the opening of its new regional office in Singapore. The new office, located in the central business district, will serve as the company\'s hub for Southeast Asian operations. The Singapore team will focus on business development, client relations, and regional marketing efforts. The office will initially employ 25 staff members, with plans to expand to 50 within the next two years.',
            text: 'Where is the new office located?',
            options: ['A. In Tokyo', 'B. In the central business district of Singapore', 'C. In Hong Kong', 'D. In downtown Sydney'],
            correctAnswer: 1,
            explanation: 'Văn phòng mới nằm ở trung tâm thương mại Singapore.'
          },
          {
            id: 't2-p7-2',
            passage: 'Greenfield Industries is pleased to announce the opening of its new regional office in Singapore. The new office, located in the central business district, will serve as the company\'s hub for Southeast Asian operations. The Singapore team will focus on business development, client relations, and regional marketing efforts. The office will initially employ 25 staff members, with plans to expand to 50 within the next two years.',
            text: 'What will the Singapore team focus on?',
            options: ['A. Manufacturing and production', 'B. Business development, client relations, and marketing', 'C. Human resources and training', 'D. Research and development'],
            correctAnswer: 1,
            explanation: 'Đội Singapore tập trung vào phát triển kinh doanh, quan hệ khách hàng và tiếp thị.'
          },
          {
            id: 't2-p7-3',
            passage: 'Greenfield Industries is pleased to announce the opening of its new regional office in Singapore. The new office, located in the central business district, will serve as the company\'s hub for Southeast Asian operations. The Singapore team will focus on business development, client relations, and regional marketing efforts. The office will initially employ 25 staff members, with plans to expand to 50 within the next two years.',
            text: 'How many employees will the office have initially?',
            options: ['A. 10', 'B. 25', 'C. 50', 'D. 75'],
            correctAnswer: 1,
            explanation: 'Văn phòng sẽ có ban đầu 25 nhân viên.'
          },
          {
            id: 't2-p7-4',
            passage: 'Dear Valued Partner,\n\nWe are writing to inform you of an important update to our terms of service, effective April 1st. The revised terms include adjustments to pricing structures for bulk orders, extended warranty coverage for select products, and new guidelines for return and exchange policies.\n\nA detailed summary of the changes has been attached to this email. We encourage you to review the document carefully before the new terms take effect. If you have questions, please contact your account representative.\n\nThank you for your continued partnership.',
            text: 'When do the new terms take effect?',
            options: ['A. March 1st', 'B. April 1st', 'C. May 1st', 'D. June 1st'],
            correctAnswer: 1,
            explanation: 'Điều khoản mới có hiệu lực từ ngày 1 tháng 4.'
          },
          {
            id: 't2-p7-5',
            passage: 'Dear Valued Partner,\n\nWe are writing to inform you of an important update to our terms of service, effective April 1st. The revised terms include adjustments to pricing structures for bulk orders, extended warranty coverage for select products, and new guidelines for return and exchange policies.\n\nA detailed summary of the changes has been attached to this email. We encourage you to review the document carefully before the new terms take effect. If you have questions, please contact your account representative.\n\nThank you for your continued partnership.',
            text: 'Which of the following is NOT mentioned as a change?',
            options: ['A. Pricing adjustments for bulk orders', 'B. Extended warranty coverage', 'C. New employee benefits', 'D. New return and exchange guidelines'],
            correctAnswer: 2,
            explanation: 'Quyền lợi nhân viên mới không được đề cập.'
          },
          {
            id: 't2-p7-6',
            passage: 'Dear Valued Partner,\n\nWe are writing to inform you of an important update to our terms of service, effective April 1st. The revised terms include adjustments to pricing structures for bulk orders, extended warranty coverage for select products, and new guidelines for return and exchange policies.\n\nA detailed summary of the changes has been attached to this email. We encourage you to review the document carefully before the new terms take effect. If you have questions, please contact your account representative.\n\nThank you for your continued partnership.',
            text: 'Who should partners contact with questions?',
            options: ['A. The CEO', 'B. The marketing department', 'C. Their account representative', 'D. The legal team'],
            correctAnswer: 2,
            explanation: 'Đối tác nên liên hệ với đại diện tài khoản.'
          },
          {
            id: 't2-p7-7',
            passage: 'Sunrise Hotel is currently seeking experienced hospitality professionals to join our team. We are hiring for the following positions:\n\n• Front Desk Agent: Requires 2+ years of customer service experience. Must be fluent in English and at least one other language.\n• Housekeeping Supervisor: Requires 3+ years of housekeeping experience and strong organizational skills.\n• Restaurant Server: Prior food service experience preferred. Must have flexible availability, including weekends and holidays.\n\nInterested candidates should submit a résumé and cover letter to careers@sunrisehotel.com by March 31st.',
            text: 'How many positions are being advertised?',
            options: ['A. Two', 'B. Three', 'C. Four', 'D. Five'],
            correctAnswer: 1,
            explanation: 'Có ba vị trí đang tuyển dụng.'
          },
          {
            id: 't2-p7-8',
            passage: 'Sunrise Hotel is currently seeking experienced hospitality professionals to join our team. We are hiring for the following positions:\n\n• Front Desk Agent: Requires 2+ years of customer service experience. Must be fluent in English and at least one other language.\n• Housekeeping Supervisor: Requires 3+ years of housekeeping experience and strong organizational skills.\n• Restaurant Server: Prior food service experience preferred. Must have flexible availability, including weekends and holidays.\n\nInterested candidates should submit a résumé and cover letter to careers@sunrisehotel.com by March 31st.',
            text: 'What is required for the Front Desk Agent position?',
            options: ['A. 3+ years of experience', 'B. Fluency in two languages', 'C. A college degree', 'D. Weekend availability only'],
            correctAnswer: 1,
            explanation: 'Vị trí lễ tần yêu cầu thành thạo hai ngôn ngữ.'
          },
          {
            id: 't2-p7-9',
            passage: 'Sunrise Hotel is currently seeking experienced hospitality professionals to join our team. We are hiring for the following positions:\n\n• Front Desk Agent: Requires 2+ years of customer service experience. Must be fluent in English and at least one other language.\n• Housekeeping Supervisor: Requires 3+ years of housekeeping experience and strong organizational skills.\n• Restaurant Server: Prior food service experience preferred. Must have flexible availability, including weekends and holidays.\n\nInterested candidates should submit a résumé and cover letter to careers@sunrisehotel.com by March 31st.',
            text: 'By what date should applications be submitted?',
            options: ['A. February 28th', 'B. March 31st', 'C. April 1st', 'D. May 15th'],
            correctAnswer: 1,
            explanation: 'Đơn phải nộp trước ngày 31 tháng 3.'
          },
          {
            id: 't2-p7-10',
            passage: 'City Times Weekly\nMarch 15, 2024\n\nTechCorp Announces Major Expansion\n\nTechCorp, a leading software company based in Portland, has announced plans to open three new offices across Europe. The expansion is expected to create over 500 new jobs in the coming year. CEO Sarah Mitchell stated that the move is driven by growing demand for the company\'s cloud computing services. The new offices will be located in Berlin, Amsterdam, and Dublin.',
            text: 'What type of company is TechCorp?',
            options: ['A. A manufacturing firm', 'B. A software company', 'C. A retail chain', 'D. A consulting firm'],
            correctAnswer: 1,
            explanation: 'TechCorp là công ty phần mềm.'
          },
          {
            id: 't2-p7-11',
            passage: 'City Times Weekly\nMarch 15, 2024\n\nTechCorp Announces Major Expansion\n\nTechCorp, a leading software company based in Portland, has announced plans to open three new offices across Europe. The expansion is expected to create over 500 new jobs in the coming year. CEO Sarah Mitchell stated that the move is driven by growing demand for the company\'s cloud computing services. The new offices will be located in Berlin, Amsterdam, and Dublin.',
            text: 'How many new jobs will be created?',
            options: ['A. Over 200', 'B. Over 300', 'C. Over 500', 'D. Over 1,000'],
            correctAnswer: 2,
            explanation: 'Expansion sẽ tạo ra hơn 500 việc làm mới.'
          },
          {
            id: 't2-p7-12',
            passage: 'City Times Weekly\nMarch 15, 2024\n\nTechCorp Announces Major Expansion\n\nTechCorp, a leading software company based in Portland, has announced plans to open three new offices across Europe. The expansion is expected to create over 500 new jobs in the coming year. CEO Sarah Mitchell stated that the move is driven by growing demand for the company\'s cloud computing services. The new offices will be located in Berlin, Amsterdam, and Dublin.',
            text: 'What is driving the expansion?',
            options: ['A. Lower costs in Europe', 'B. Government incentives', 'C. Growing demand for cloud computing services', 'D. A merger with another company'],
            correctAnswer: 2,
            explanation: 'Sự mở rộng được thúc đẩy bởi nhu cầu tăng đối với dịch vụ điện toán đám mây.'
          },
          {
            id: 't2-p7-13',
            passage: 'Riverside Business Park\n\nOffice Space Available for Lease\n\nRiverside Business Park is offering newly renovated office spaces for lease. Units range from 500 to 5,000 square feet and are suitable for businesses of all sizes. Features include high-speed internet, 24-hour security, covered parking, and access to shared conference rooms. Located just five minutes from the interstate, the park offers convenient access to downtown.\n\nFor leasing inquiries, contact James Wright at (555) 234-5678 or jwright@riversidepark.com.',
            text: 'What is the largest office space available?',
            options: ['A. 500 square feet', 'B. 2,500 square feet', 'C. 5,000 square feet', 'D. 10,000 square feet'],
            correctAnswer: 2,
            explanation: 'Không gian văn phòng lớn nhất là 5.000 feet vuông.'
          },
          {
            id: 't2-p7-14',
            passage: 'Riverside Business Park\n\nOffice Space Available for Lease\n\nRiverside Business Park is offering newly renovated office spaces for lease. Units range from 500 to 5,000 square feet and are suitable for businesses of all sizes. Features include high-speed internet, 24-hour security, covered parking, and access to shared conference rooms. Located just five minutes from the interstate, the park offers convenient access to downtown.\n\nFor leasing inquiries, contact James Wright at (555) 234-5678 or jwright@riversidepark.com.',
            text: 'Which amenity is NOT listed?',
            options: ['A. High-speed internet', 'B. A gym and fitness center', 'C. 24-hour security', 'D. Covered parking'],
            correctAnswer: 1,
            explanation: 'Phòng tập thể dục không được liệt kê.'
          },
          {
            id: 't2-p7-15',
            passage: 'Riverside Business Park\n\nOffice Space Available for Lease\n\nRiverside Business Park is offering newly renovated office spaces for lease. Units range from 500 to 5,000 square feet and are suitable for businesses of all sizes. Features include high-speed internet, 24-hour security, covered parking, and access to shared conference rooms. Located just five minutes from the interstate, the park offers convenient access to downtown.\n\nFor leasing inquiries, contact James Wright at (555) 234-5678 or jwright@riversidepark.com.',
            text: 'How far is the park from the interstate?',
            options: ['A. One minute', 'B. Five minutes', 'C. Ten minutes', 'D. Fifteen minutes'],
            correctAnswer: 1,
            explanation: 'Khu công nghiệp cách xa đường cao tốc năm phút.'
          },
          {
            id: 't2-p7-16',
            passage: 'Global Logistics Weekly\n\nSupply Chain Disruptions Expected to Ease\n\nIndustry experts predict that global supply chain disruptions, which have plagued businesses since 2020, will begin to ease in the second half of 2024. According to a report released by the International Trade Association, port congestion has decreased by 35% compared to last year, and shipping costs have stabilized. However, the report also warns that geopolitical tensions and rising fuel prices remain potential risks.',
            text: 'According to the report, by how much has port congestion decreased?',
            options: ['A. 15%', 'B. 25%', 'C. 35%', 'D. 50%'],
            correctAnswer: 2,
            explanation: 'Tắc nghẽn cảng đã giảm 35% so với năm ngoái.'
          },
          {
            id: 't2-p7-17',
            passage: 'Global Logistics Weekly\n\nSupply Chain Disruptions Expected to Ease\n\nIndustry experts predict that global supply chain disruptions, which have plagued businesses since 2020, will begin to ease in the second half of 2024. According to a report released by the International Trade Association, port congestion has decreased by 35% compared to last year, and shipping costs have stabilized. However, the report also warns that geopolitical tensions and rising fuel prices remain potential risks.',
            text: 'What are mentioned as potential risks?',
            options: ['A. Labor strikes and new regulations', 'B. Geopolitical tensions and rising fuel prices', 'C. Natural disasters and pandemics', 'D. Currency fluctuations and tariffs'],
            correctAnswer: 1,
            explanation: 'Căng thẳng địa chính trị và giá nhiên liệu tăng là rủi ro tiềm ẩn.'
          },
          {
            id: 't2-p7-18',
            passage: 'Global Logistics Weekly\n\nSupply Chain Disruptions Expected to Ease\n\nIndustry experts predict that global supply chain disruptions, which have plagued businesses since 2020, will begin to ease in the second half of 2024. According to a report released by the International Trade Association, port congestion has decreased by 35% compared to last year, and shipping costs have stabilized. However, the report also warns that geopolitical tensions and rising fuel prices remain potential risks.',
            text: 'What is the main topic of the article?',
            options: ['A. New trade agreements', 'B. The recovery of global supply chains', 'C. Rising shipping costs', 'D. Port construction projects'],
            correctAnswer: 1,
            explanation: 'Chủ đề chính là sự phục hồi của chuỗi cung ứng toàn cầu.'
          },
          {
            id: 't2-p7-19',
            passage: 'Apex Marketing Group is pleased to announce the promotion of three valued team members:\n\n• Lisa Chen has been promoted to Senior Account Manager. Lisa has been with the company for seven years and has led several successful campaigns.\n• David Park has been promoted to Creative Director. David joined the company three years ago and has been recognized for his innovative design work.\n• Rachel Torres has been promoted to VP of Client Services. Rachel has been with the company for twelve years and has built lasting relationships with key clients.\n\nPlease join us in congratulating them on their well-deserved promotions.',
            text: 'How many promotions are announced?',
            options: ['A. Two', 'B. Three', 'C. Four', 'D. Five'],
            correctAnswer: 1,
            explanation: 'Có ba sự thăng chức được thông báo.'
          },
          {
            id: 't2-p7-20',
            passage: 'Apex Marketing Group is pleased to announce the promotion of three valued team members:\n\n• Lisa Chen has been promoted to Senior Account Manager. Lisa has been with the company for seven years and has led several successful campaigns.\n• David Park has been promoted to Creative Director. David joined the company three years ago and has been recognized for his innovative design work.\n• Rachel Torres has been promoted to VP of Client Services. Rachel has been with the company for twelve years and has built lasting relationships with key clients.\n\nPlease join us in congratulating them on their well-deserved promotions.',
            text: 'Who has been at the company the longest?',
            options: ['A. Lisa Chen', 'B. David Park', 'C. Rachel Torres', 'D. They all joined at the same time'],
            correctAnswer: 2,
            explanation: 'Rachel Torres đã làm việc ở công ty lâu nhất (12 năm).'
          },
          {
            id: 't2-p7-21',
            passage: 'Apex Marketing Group is pleased to announce the promotion of three valued team members:\n\n• Lisa Chen has been promoted to Senior Account Manager. Lisa has been with the company for seven years and has led several successful campaigns.\n• David Park has been promoted to Creative Director. David joined the company three years ago and has been recognized for his innovative design work.\n• Rachel Torres has been promoted to VP of Client Services. Rachel has been with the company for twelve years and has built lasting relationships with key clients.\n\nPlease join us in congratulating them on their well-deserved promotions.',
            text: 'What is David Park known for?',
            options: ['A. Building client relationships', 'B. Leading successful campaigns', 'C. Innovative design work', 'D. Managing budgets'],
            correctAnswer: 2,
            explanation: 'David Park nổi tiếng với công việc thiết kế sáng tạo.'
          },
          {
            id: 't2-p7-22',
            passage: 'IMPORTANT NOTICE\n\nTo: All Warehouse Employees\nFrom: Operations Department\n\nEffective immediately, the following changes will be implemented in our warehouse operations:\n\n1. All forklift operators must complete a safety refresher course by the end of this month.\n2. Loading dock procedures have been updated. Please review the new manual available on the intranet.\n3. The night shift schedule has been adjusted. Updated schedules are posted on the break room bulletin board.\n\nFailure to comply with these changes may result in disciplinary action.',
            text: 'What must forklift operators do?',
            options: ['A. Purchase new safety gear', 'B. Complete a safety refresher course', 'C. Work overtime', 'D. Transfer to another department'],
            correctAnswer: 1,
            explanation: 'Tất cả người vận hành xe nâng phải hoàn thành khóa học ôn tập an toàn.'
          },
          {
            id: 't2-p7-23',
            passage: 'IMPORTANT NOTICE\n\nTo: All Warehouse Employees\nFrom: Operations Department\n\nEffective immediately, the following changes will be implemented in our warehouse operations:\n\n1. All forklift operators must complete a safety refresher course by the end of this month.\n2. Loading dock procedures have been updated. Please review the new manual available on the intranet.\n3. The night shift schedule has been adjusted. Updated schedules are posted on the break room bulletin board.\n\nFailure to comply with these changes may result in disciplinary action.',
            text: 'Where can employees find the updated loading dock procedures?',
            options: ['A. In the HR office', 'B. On the intranet', 'C. In the break room', 'D. From their supervisor'],
            correctAnswer: 1,
            explanation: 'Quy trình cập nhật có trên mạng nội bộ (intranet).'
          },
          {
            id: 't2-p7-24',
            passage: 'IMPORTANT NOTICE\n\nTo: All Warehouse Employees\nFrom: Operations Department\n\nEffective immediately, the following changes will be implemented in our warehouse operations:\n\n1. All forklift operators must complete a safety refresher course by the end of this month.\n2. Loading dock procedures have been updated. Please review the new manual available on the intranet.\n3. The night shift schedule has been adjusted. Updated schedules are posted on the break room bulletin board.\n\nFailure to comply with these changes may result in disciplinary action.',
            text: 'What happens if employees do not comply?',
            options: ['A. They will be fired', 'B. They may face disciplinary action', 'C. They will lose their bonuses', 'D. They will be moved to day shift'],
            correctAnswer: 1,
            explanation: 'Không tuân thủ có thể dẫn đến hành động kỷ luật.'
          },
          {
            id: 't2-p7-25',
            passage: 'MIDWEST MANUFACTURING NEWS\n\nPlant Expansion on Track\n\nMidwest Manufacturing Inc. has confirmed that its plant expansion project in Indiana is on schedule. The $15 million project, which broke ground last June, will add 50,000 square feet of production space to the existing facility. The expanded plant is expected to be operational by Q4 of this year and will create approximately 120 new jobs.',
            text: 'When did construction begin?',
            options: ['A. Last January', 'B. Last June', 'C. This March', 'D. This June'],
            correctAnswer: 1,
            explanation: 'Xây dựng bắt đầu vào tháng Sáu năm ngoái.'
          },
          {
            id: 't2-p7-26',
            passage: 'MIDWEST MANUFACTURING NEWS\n\nPlant Expansion on Track\n\nMidwest Manufacturing Inc. has confirmed that its plant expansion project in Indiana is on schedule. The $15 million project, which broke ground last June, will add 50,000 square feet of production space to the existing facility. The expanded plant is expected to be operational by Q4 of this year and will create approximately 120 new jobs.',
            text: 'How much is the expansion project costing?',
            options: ['A. $5 million', 'B. $10 million', 'C. $15 million', 'D. $20 million'],
            correctAnswer: 2,
            explanation: 'Dự án mở rộng tốn 15 triệu đô la.'
          },
          {
            id: 't2-p7-27',
            passage: 'MIDWEST MANUFACTURING NEWS\n\nPlant Expansion on Track\n\nMidwest Manufacturing Inc. has confirmed that its plant expansion project in Indiana is on schedule. The $15 million project, which broke ground last June, will add 50,000 square feet of production space to the existing facility. The expanded plant is expected to be operational by Q4 of this year and will create approximately 120 new jobs.',
            text: 'How many jobs will the expansion create?',
            options: ['A. About 50', 'B. About 80', 'C. About 120', 'D. About 200'],
            correctAnswer: 2,
            explanation: 'Mở rộng sẽ tạo ra khoảng 120 việc làm mới.'
          },
          {
            id: 't2-p7-28',
            passage: 'Summit Insurance Company\n\nNew Insurance Policy Features\n\nEffective May 1st, Summit Insurance will offer enhanced coverage options for small business clients. Key features of the new policies include:\n\n• Extended liability coverage up to $2 million\n• Cybersecurity insurance for data breach protection\n• Business interruption coverage for natural disasters\n• 24/7 claims support via phone and online portal\n\nSmall business owners interested in learning more can attend a free informational webinar on April 20th. Register at summitinsurance.com/webinar.',
            text: 'When do the new policy features take effect?',
            options: ['A. April 1st', 'B. April 20th', 'C. May 1st', 'D. June 1st'],
            correctAnswer: 2,
            explanation: 'Các tính năng mới có hiệu lực từ ngày 1 tháng 5.'
          },
          {
            id: 't2-p7-29',
            passage: 'Summit Insurance Company\n\nNew Insurance Policy Features\n\nEffective May 1st, Summit Insurance will offer enhanced coverage options for small business clients. Key features of the new policies include:\n\n• Extended liability coverage up to $2 million\n• Cybersecurity insurance for data breach protection\n• Business interruption coverage for natural disasters\n• 24/7 claims support via phone and online portal\n\nSmall business owners interested in learning more can attend a free informational webinar on April 20th. Register at summitinsurance.com/webinar.',
            text: 'What is the maximum liability coverage?',
            options: ['A. $500,000', 'B. $1 million', 'C. $2 million', 'D. $5 million'],
            correctAnswer: 2,
            explanation: 'Mức bảo hiểm trách nhiệm tối đa là 2 triệu đô la.'
          },
          {
            id: 't2-p7-30',
            passage: 'Summit Insurance Company\n\nNew Insurance Policy Features\n\nEffective May 1st, Summit Insurance will offer enhanced coverage options for small business clients. Key features of the new policies include:\n\n• Extended liability coverage up to $2 million\n• Cybersecurity insurance for data breach protection\n• Business interruption coverage for natural disasters\n• 24/7 claims support via phone and online portal\n\nSmall business owners interested in learning more can attend a free informational webinar on April 20th. Register at summitinsurance.com/webinar.',
            text: 'How can business owners learn more about the new policies?',
            options: ['A. By visiting the office', 'B. By attending a free webinar', 'C. By calling a hotline', 'D. By reading a newsletter'],
            correctAnswer: 1,
            explanation: 'Chủ doanh nghiệp có thể tìm hiểu thêm qua webinar miễn phí.'
          },
          {
            id: 't2-p7-31',
            passage: 'CITY COUNCIL MEETING MINUTES\nMarch 10, 2024\n\nThe city council approved a proposal to build a new public library in the Westwood neighborhood. The project, estimated at $8 million, will be funded through a combination of municipal bonds and private donations. Construction is expected to begin in fall 2024 and be completed by spring 2026. The library will feature a community meeting room, a children\'s section, and a digital media lab.',
            text: 'How will the library project be funded?',
            options: ['A. Only through taxes', 'B. Through municipal bonds and private donations', 'C. Through a federal grant', 'D. Through crowdfunding'],
            correctAnswer: 1,
            explanation: 'Dự án được tài trợ qua trái phiếu thành phố và đóng góp tư nhân.'
          },
          {
            id: 't2-p7-32',
            passage: 'CITY COUNCIL MEETING MINUTES\nMarch 10, 2024\n\nThe city council approved a proposal to build a new public library in the Westwood neighborhood. The project, estimated at $8 million, will be funded through a combination of municipal bonds and private donations. Construction is expected to begin in fall 2024 and be completed by spring 2026. The library will feature a community meeting room, a children\'s section, and a digital media lab.',
            text: 'When is the library expected to be completed?',
            options: ['A. Fall 2024', 'B. Spring 2025', 'C. Fall 2025', 'D. Spring 2026'],
            correctAnswer: 3,
            explanation: 'Thư viện dự kiến hoàn thành vào mùa xuân năm 2026.'
          },
          {
            id: 't2-p7-33',
            passage: 'CITY COUNCIL MEETING MINUTES\nMarch 10, 2024\n\nThe city council approved a proposal to build a new public library in the Westwood neighborhood. The project, estimated at $8 million, will be funded through a combination of municipal bonds and private donations. Construction is expected to begin in fall 2024 and be completed by spring 2026. The library will feature a community meeting room, a children\'s section, and a digital media lab.',
            text: 'Which feature is NOT mentioned for the new library?',
            options: ['A. A community meeting room', 'B. A digital media lab', 'C. A rooftop garden', 'D. A children\'s section'],
            correctAnswer: 2,
            explanation: 'Sân thượng có vườn không được đề cập.'
          },
          {
            id: 't2-p7-34',
            passage: 'FRESH MART GROCERY\nEmployment Opportunities\n\nFresh Mart is hiring for multiple positions at our three downtown locations:\n\n• Cashier: Part-time and full-time positions available. Must be 18 or older. Cash handling experience is a plus.\n• Deli Associate: Full-time position. Food handler\'s certification required.\n• Stock Clerk: Overnight shifts available. Must be able to lift up to 50 pounds.\n\nApply in person at any Fresh Mart location or online at freshmart.com/careers.',
            text: 'How many locations does Fresh Mart have downtown?',
            options: ['A. Two', 'B. Three', 'C. Four', 'D. Five'],
            correctAnswer: 1,
            explanation: 'Fresh Mart có ba chi nhánh ở trung tâm thành phố.'
          },
          {
            id: 't2-p7-35',
            passage: 'FRESH MART GROCERY\nEmployment Opportunities\n\nFresh Mart is hiring for multiple positions at our three downtown locations:\n\n• Cashier: Part-time and full-time positions available. Must be 18 or older. Cash handling experience is a plus.\n• Deli Associate: Full-time position. Food handler\'s certification required.\n• Stock Clerk: Overnight shifts available. Must be able to lift up to 50 pounds.\n\nApply in person at any Fresh Mart location or online at freshmart.com/careers.',
            text: 'What is required for the Deli Associate position?',
            options: ['A. Must be 18 or older', 'B. Food handler\'s certification', 'C. Ability to lift 50 pounds', 'D. Overnight availability'],
            correctAnswer: 1,
            explanation: 'Vị trí Deli Associate yêu cầu chứng chỉ xử lý thực phẩm.'
          },
          {
            id: 't2-p7-36',
            passage: 'FRESH MART GROCERY\nEmployment Opportunities\n\nFresh Mart is hiring for multiple positions at our three downtown locations:\n\n• Cashier: Part-time and full-time positions available. Must be 18 or older. Cash handling experience is a plus.\n• Deli Associate: Full-time position. Food handler\'s certification required.\n• Stock Clerk: Overnight shifts available. Must be able to lift up to 50 pounds.\n\nApply in person at any Fresh Mart location or online at freshmart.com/careers.',
            text: 'How can interested applicants apply?',
            options: ['A. By phone only', 'B. In person or online', 'C. By mail only', 'D. Through a job fair'],
            correctAnswer: 1,
            explanation: 'Ứng viên có thể nộp đơn trực tiếp hoặc trực tuyến.'
          },
          {
            id: 't2-p7-37',
            passage: 'Skyline Airlines is introducing a new loyalty program called SkyRewards, effective June 1st. Members will earn one point for every dollar spent on flights. Points can be redeemed for free flights, seat upgrades, and lounge access. Silver tier members (earned after 25,000 points) will enjoy priority boarding and extra baggage allowance. Gold tier members (earned after 50,000 points) will receive complimentary first-class upgrades and priority check-in.',
            text: 'When does the new loyalty program begin?',
            options: ['A. May 1st', 'B. June 1st', 'C. July 1st', 'D. August 1st'],
            correctAnswer: 1,
            explanation: 'Chương trình khách hàng thân thiết mới bắt đầu từ ngày 1 tháng 6.'
          },
          {
            id: 't2-p7-38',
            passage: 'Skyline Airlines is introducing a new loyalty program called SkyRewards, effective June 1st. Members will earn one point for every dollar spent on flights. Points can be redeemed for free flights, seat upgrades, and lounge access. Silver tier members (earned after 25,000 points) will enjoy priority boarding and extra baggage allowance. Gold tier members (earned after 50,000 points) will receive complimentary first-class upgrades and priority check-in.',
            text: 'How many points are needed for Silver tier status?',
            options: ['A. 10,000', 'B. 25,000', 'C. 50,000', 'D. 100,000'],
            correctAnswer: 1,
            explanation: 'Cần 25.000 điểm để đạt hạng Silver.'
          },
          {
            id: 't2-p7-39',
            passage: 'Skyline Airlines is introducing a new loyalty program called SkyRewards, effective June 1st. Members will earn one point for every dollar spent on flights. Points can be redeemed for free flights, seat upgrades, and lounge access. Silver tier members (earned after 25,000 points) will enjoy priority boarding and extra baggage allowance. Gold tier members (earned after 50,000 points) will receive complimentary first-class upgrades and priority check-in.',
            text: 'What benefit do Gold tier members receive that Silver tier members do not?',
            options: ['A. Extra baggage allowance', 'B. Priority boarding', 'C. Complimentary first-class upgrades', 'D. Lounge access'],
            correctAnswer: 2,
            explanation: 'Gold tier nhận nâng cấp hạng nhất miễn phí, Silver không có.'
          },
          {
            id: 't2-p7-40',
            passage: 'URGENT: PRODUCT RECALL NOTICE\n\nBrand: ProClean Washing Machines\nModel: PC-4500 and PC-4600\n\nProClean is voluntarily recalling all PC-4500 and PC-4600 washing machines manufactured between January and September 2023 due to a potential electrical defect. The defect may cause the machine to overheat during use, posing a fire risk.\n\nOwners of affected models should stop using the machine immediately and contact ProClean at 1-800-555-0123 for a free repair. Do not attempt to repair the machine yourself.\n\nFor more information, visit recall.proclean.com.',
            text: 'Why are the washing machines being recalled?',
            options: ['A. Water leakage issues', 'B. A potential electrical defect that may cause overheating', 'C. Excessive noise during operation', 'D. Failure to start'],
            correctAnswer: 1,
            explanation: 'Máy giặt bị thu hồi do lỗi điện có thể gây quá nhiệt.'
          },
          {
            id: 't2-p7-41',
            passage: 'URGENT: PRODUCT RECALL NOTICE\n\nBrand: ProClean Washing Machines\nModel: PC-4500 and PC-4600\n\nProClean is voluntarily recalling all PC-4500 and PC-4600 washing machines manufactured between January and September 2023 due to a potential electrical defect. The defect may cause the machine to overheat during use, posing a fire risk.\n\nOwners of affected models should stop using the machine immediately and contact ProClean at 1-800-555-0123 for a free repair. Do not attempt to repair the machine yourself.\n\nFor more information, visit recall.proclean.com.',
            text: 'Which models are affected?',
            options: ['A. PC-4400 and PC-4500', 'B. PC-4500 and PC-4600', 'C. PC-4600 and PC-4700', 'D. PC-4700 and PC-4800'],
            correctAnswer: 1,
            explanation: 'Các mẫu PC-4500 và PC-4600 bị ảnh hưởng.'
          },
          {
            id: 't2-p7-42',
            passage: 'URGENT: PRODUCT RECALL NOTICE\n\nBrand: ProClean Washing Machines\nModel: PC-4500 and PC-4600\n\nProClean is voluntarily recalling all PC-4500 and PC-4600 washing machines manufactured between January and September 2023 due to a potential electrical defect. The defect may cause the machine to overheat during use, posing a fire risk.\n\nOwners of affected models should stop using the machine immediately and contact ProClean at 1-800-555-0123 for a free repair. Do not attempt to repair the machine yourself.\n\nFor more information, visit recall.proclean.com.',
            text: 'What should owners do with the affected machines?',
            options: ['A. Return them to the store for a refund', 'B. Stop using them and contact ProClean for a free repair', 'C. Continue using them carefully', 'D. Dispose of them at a recycling center'],
            correctAnswer: 1,
            explanation: 'Chủ sở hữu nên ngừng sử dụng và liên hệ ProClean để sửa chữa miễn phí.'
          },
          {
            id: 't2-p7-43',
            passage: 'WESTEND BUSINESS JOURNAL\n\nCo-Working Space Trend Grows\n\nThe demand for co-working spaces in major cities has grown by 40% in the past year, according to a new industry report. The trend is being driven by freelancers, startups, and remote workers seeking flexible, affordable office solutions. Leading providers such as WeWork and Regus have reported record occupancy rates. Industry analysts predict the co-working market will continue to grow as more companies adopt hybrid work models.',
            text: 'By how much has demand for co-working spaces grown?',
            options: ['A. 20%', 'B. 30%', 'C. 40%', 'D. 50%'],
            correctAnswer: 2,
            explanation: 'Nhu cầu không gian làm việc chung tăng 40%.'
          },
          {
            id: 't2-p7-44',
            passage: 'WESTEND BUSINESS JOURNAL\n\nCo-Working Space Trend Grows\n\nThe demand for co-working spaces in major cities has grown by 40% in the past year, according to a new industry report. The trend is being driven by freelancers, startups, and remote workers seeking flexible, affordable office solutions. Leading providers such as WeWork and Regus have reported record occupancy rates. Industry analysts predict the co-working market will continue to grow as more companies adopt hybrid work models.',
            text: 'Who is driving the demand for co-working spaces?',
            options: ['A. Large corporations', 'B. Government agencies', 'C. Freelancers, startups, and remote workers', 'D. Real estate developers'],
            correctAnswer: 2,
            explanation: 'Freelancer, startup và nhân viên làm từ xa đang thúc đẩy nhu cầu.'
          },
          {
            id: 't2-p7-45',
            passage: 'WESTEND BUSINESS JOURNAL\n\nCo-Working Space Trend Grows\n\nThe demand for co-working spaces in major cities has grown by 40% in the past year, according to a new industry report. The trend is being driven by freelancers, startups, and remote workers seeking flexible, affordable office solutions. Leading providers such as WeWork and Regus have reported record occupancy rates. Industry analysts predict the co-working market will continue to grow as more companies adopt hybrid work models.',
            text: 'What do analysts predict about the future of co-working?',
            options: ['A. It will decline', 'B. It will stay the same', 'C. It will continue to grow', 'D. It will be replaced by remote work'],
            correctAnswer: 2,
            explanation: 'Nhà phân tích dự đoán thị trường không gian làm việc chung sẽ tiếp tục tăng.'
          },
          {
            id: 't2-p7-46',
            passage: 'Metro Transit Authority\n\nService Alert - Effective March 20\n\nDue to scheduled track maintenance, the Blue Line will operate on a modified schedule between Oakwood and Harbor stations from March 20 to April 5. During this period:\n\n• Trains will run every 15 minutes instead of the usual 8 minutes.\n• A free shuttle bus service will operate between affected stations.\n• Late-night service will end at 11 PM instead of midnight.\n\nWe apologize for the inconvenience and recommend allowing extra travel time.',
            text: 'How long will the modified schedule be in effect?',
            options: ['A. One week', 'B. Two weeks', 'C. About two and a half weeks', 'D. One month'],
            correctAnswer: 2,
            explanation: 'Lịch trình sửa đổi có hiệu lực từ 20/3 đến 5/4, khoảng 2,5 tuần.'
          },
          {
            id: 't2-p7-47',
            passage: 'Metro Transit Authority\n\nService Alert - Effective March 20\n\nDue to scheduled track maintenance, the Blue Line will operate on a modified schedule between Oakwood and Harbor stations from March 20 to April 5. During this period:\n\n• Trains will run every 15 minutes instead of the usual 8 minutes.\n• A free shuttle bus service will operate between affected stations.\n• Late-night service will end at 11 PM instead of midnight.\n\nWe apologize for the inconvenience and recommend allowing extra travel time.',
            text: 'How often will trains run during the maintenance period?',
            options: ['A. Every 5 minutes', 'B. Every 8 minutes', 'C. Every 15 minutes', 'D. Every 20 minutes'],
            correctAnswer: 2,
            explanation: 'Tàu sẽ chạy mỗi 15 phút thay vì mỗi 8 phút.'
          },
          {
            id: 't2-p7-48',
            passage: 'Metro Transit Authority\n\nService Alert - Effective March 20\n\nDue to scheduled track maintenance, the Blue Line will operate on a modified schedule between Oakwood and Harbor stations from March 20 to April 5. During this period:\n\n• Trains will run every 15 minutes instead of the usual 8 minutes.\n• A free shuttle bus service will operate between affected stations.\n• Late-night service will end at 11 PM instead of midnight.\n\nWe apologize for the inconvenience and recommend allowing extra travel time.',
            text: 'What alternative transportation is provided?',
            options: ['A. Free taxi service', 'B. Free shuttle bus service', 'C. Discounted ride-sharing', 'D. Bicycle rentals'],
            correctAnswer: 1,
            explanation: 'Dịch vụ xe buýt đưa đón miễn phí được cung cấp.'
          },
          {
            id: 't2-p7-49',
            passage: 'GREEN VALLEY ORGANICS\nProduct Catalog Update\n\nGreen Valley Organics is expanding its product line with five new organic food items launching next month:\n\n1. Organic Granola Clusters (12 oz) - $6.99\n2. Cold-Pressed Olive Oil (500 ml) - $12.99\n3. Raw Honey (16 oz) - $9.49\n4. Quinoa Pasta (8 oz) - $4.99\n5. Dark Chocolate Bars (3.5 oz) - $3.99\n\nAll products are USDA certified organic and will be available at participating retailers nationwide.',
            text: 'How many new products are being launched?',
            options: ['A. Three', 'B. Four', 'C. Five', 'D. Six'],
            correctAnswer: 2,
            explanation: 'Có năm sản phẩm mới được ra mắt.'
          },
          {
            id: 't2-p7-50',
            passage: 'GREEN VALLEY ORGANICS\nProduct Catalog Update\n\nGreen Valley Organics is expanding its product line with five new organic food items launching next month:\n\n1. Organic Granola Clusters (12 oz) - $6.99\n2. Cold-Pressed Olive Oil (500 ml) - $12.99\n3. Raw Honey (16 oz) - $9.49\n4. Quinoa Pasta (8 oz) - $4.99\n5. Dark Chocolate Bars (3.5 oz) - $3.99\n\nAll products are USDA certified organic and will be available at participating retailers nationwide.',
            text: 'Which product is the most expensive?',
            options: ['A. Organic Granola Clusters', 'B. Cold-Pressed Olive Oil', 'C. Raw Honey', 'D. Dark Chocolate Bars'],
            correctAnswer: 1,
            explanation: 'Dầu ô liu ép lạnh có giá cao nhất: $12.99.'
          },
          {
            id: 't2-p7-51',
            passage: 'GREEN VALLEY ORGANICS\nProduct Catalog Update\n\nGreen Valley Organics is expanding its product line with five new organic food items launching next month:\n\n1. Organic Granola Clusters (12 oz) - $6.99\n2. Cold-Pressed Olive Oil (500 ml) - $12.99\n3. Raw Honey (16 oz) - $9.49\n4. Quinoa Pasta (8 oz) - $4.99\n5. Dark Chocolate Bars (3.5 oz) - $3.99\n\nAll products are USDA certified organic and will be available at participating retailers nationwide.',
            text: 'Where will the products be sold?',
            options: ['A. Only online', 'B. At Green Valley stores only', 'C. At participating retailers nationwide', 'D. At farmers\' markets only'],
            correctAnswer: 2,
            explanation: 'Sản phẩm sẽ được bán tại các cửa hàng tham gia trên toàn quốc.'
          },
          {
            id: 't2-p7-52',
            passage: 'PERFORMANCE REPORT Q3 2024\nBrightway Solutions Inc.\n\nRevenue: $12.5 million (up 18% from Q3 2023)\nNet Profit: $2.1 million (up 12%)\nNew Clients Acquired: 85\nEmployee Retention Rate: 94%\n\nHighlights:\n- Signed a multi-year contract with TechNova Inc., valued at $3.2 million.\n- Expanded into the healthcare sector with three new client partnerships.\n- Launched a redesigned customer portal that improved client satisfaction scores by 22%.',
            text: 'What was the revenue for Q3 2024?',
            options: ['A. $8.5 million', 'B. $10.5 million', 'C. $12.5 million', 'D. $15.5 million'],
            correctAnswer: 2,
            explanation: 'Doanh thu Q3 2024 là 12,5 triệu đô la.'
          },
          {
            id: 't2-p7-53',
            passage: 'PERFORMANCE REPORT Q3 2024\nBrightway Solutions Inc.\n\nRevenue: $12.5 million (up 18% from Q3 2023)\nNet Profit: $2.1 million (up 12%)\nNew Clients Acquired: 85\nEmployee Retention Rate: 94%\n\nHighlights:\n- Signed a multi-year contract with TechNova Inc., valued at $3.2 million.\n- Expanded into the healthcare sector with three new client partnerships.\n- Launched a redesigned customer portal that improved client satisfaction scores by 22%.',
            text: 'What was the value of the TechNova contract?',
            options: ['A. $1.2 million', 'B. $2.2 million', 'C. $3.2 million', 'D. $4.2 million'],
            correctAnswer: 2,
            explanation: 'Hợp đồng TechNova có giá trị 3,2 triệu đô la.'
          },
          {
            id: 't2-p7-54',
            passage: 'PERFORMANCE REPORT Q3 2024\nBrightway Solutions Inc.\n\nRevenue: $12.5 million (up 18% from Q3 2023)\nNet Profit: $2.1 million (up 12%)\nNew Clients Acquired: 85\nEmployee Retention Rate: 94%\n\nHighlights:\n- Signed a multi-year contract with TechNova Inc., valued at $3.2 million.\n- Expanded into the healthcare sector with three new client partnerships.\n- Launched a redesigned customer portal that improved client satisfaction scores by 22%.',
            text: 'By how much did client satisfaction scores improve?',
            options: ['A. 12%', 'B. 18%', 'C. 22%', 'D. 94%'],
            correctAnswer: 2,
            explanation: 'Điểm hài lòng khách hàng cải thiện 22%.'
          }
        ]
      }
    ]
  },
  {
    id: 'toeic-auth-3',
    title: 'TOEIC Practice Exam 3',
    difficulty: 'advanced',
    year: 2024,
    category: 'toeic',
    timeLimitMinutes: 120,
    sections: [
      {
        id: 't3-sec-1',
        title: 'Part 1: Photographs',
        description: 'Look at the photograph and choose the statement that best describes it.',
        questions: [
          {
            id: 't3-p1-1',
            text: 'Look at the picture and choose the correct statement.',
            imageUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=400',
            options: ['A. The building is under construction.', 'B. A businessman is walking toward the entrance.', 'C. Vehicles are parked in front of the building.', 'D. There is a large sign on the roof.'],
            correctAnswer: 1,
            explanation: 'Một doanh nhân đang đi về phía lối vào tòa nhà.'
          },
          {
            id: 't3-p1-2',
            text: 'Look at the picture and choose the correct statement.',
            imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=400',
            options: ['A. Workers are operating heavy machinery.', 'B. A team is collaborating around a laptop.', 'C. A receptionist is answering the phone.', 'D. Customers are browsing products.'],
            correctAnswer: 1,
            explanation: 'Một nhóm đang phối hợp làm việc xung quanh máy tính xách tay.'
          },
          {
            id: 't3-p1-3',
            text: 'Look at the picture and choose the correct statement.',
            imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400',
            options: ['A. Shelves are stocked with various products.', 'B. A forklift is lifting a heavy load.', 'C. Workers are packing boxes on an assembly line.', 'D. Trucks are being loaded at the dock.'],
            correctAnswer: 0,
            explanation: 'Các kệ được trưng bày đầy đủ sản phẩm.'
          },
          {
            id: 't3-p1-4',
            text: 'Look at the picture and choose the correct statement.',
            imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=400',
            options: ['A. People are seated at individual desks.', 'B. A group is having a meal together.', 'C. An employee is writing on a whiteboard.', 'D. A janitor is cleaning the floor.'],
            correctAnswer: 2,
            explanation: 'Một nhân viên đang viết trên bảng trắng.'
          },
          {
            id: 't3-p1-5',
            text: 'Look at the picture and choose the correct statement.',
            imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=400',
            options: ['A. A salesperson is showing a product.', 'B. Two colleagues are shaking hands.', 'C. A chef is cooking in a kitchen.', 'D. Passengers are boarding a plane.'],
            correctAnswer: 1,
            explanation: 'Hai đồng nghiệp đang bắt tay.'
          },
          {
            id: 't3-p1-6',
            text: 'Look at the picture and choose the correct statement.',
            imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=400',
            options: ['A. A team is meeting in a conference room.', 'B. A worker is inspecting equipment.', 'C. Customers are waiting in line.', 'D. A manager is giving a presentation.'],
            correctAnswer: 3,
            explanation: 'Một quản lý đang thuyết trình.'
          }
        ]
      },
      {
        id: 't3-sec-2',
        title: 'Part 2: Question-Response',
        description: 'Listen to a question and 3 possible responses. Choose the best response.',
        questions: [
          {
            id: 't3-p2-1',
            text: 'What qualifications are needed for the senior analyst position?',
            options: ['A. The position is on the fourth floor.', 'B. A master\'s degree and five years of experience.', 'C. The salary is competitive.'],
            correctAnswer: 1,
            explanation: 'Câu hỏi "What qualifications" yêu cầu bằng cấp/kinh nghiệm.'
          },
          {
            id: 't3-p2-2',
            text: 'When will the quarterly earnings report be released?',
            options: ['A. To the shareholders.', 'B. It was very positive.', 'C. Next Tuesday at 9 AM.'],
            correctAnswer: 2,
            explanation: 'Câu hỏi "When" yêu cầu thời gian.'
          },
          {
            id: 't3-p2-3',
            text: 'How do I apply for the employee discount program?',
            options: ['A. Through the HR portal online.', 'B. I already applied last month.', 'C. The discount is 15%.'],
            correctAnswer: 0,
            explanation: 'Câu hỏi "How" yêu cầu phương pháp.'
          },
          {
            id: 't3-p2-4',
            text: 'Who oversees the compliance department?',
            options: ['A. The compliance report is due Friday.', 'B. Ms. Nakamura is the director.', 'C. In the east wing of the building.'],
            correctAnswer: 1,
            explanation: 'Câu hỏi "Who" yêu cầu người.'
          },
          {
            id: 't3-p2-5',
            text: 'Where can I find the employee handbook?',
            options: ['A. I need to read the handbook.', 'B. On the company intranet under HR resources.', 'C. The handbook was updated last year.'],
            correctAnswer: 1,
            explanation: 'Câu hỏi "Where" yêu cầu nơi chốn.'
          },
          {
            id: 't3-p2-6',
            text: 'Did the board approve the merger?',
            options: ['A. The merger involves two companies.', 'B. Yes, unanimously at yesterday\'s meeting.', 'C. They will merge next quarter.'],
            correctAnswer: 1,
            explanation: 'Đáp án B xác nhận hội đồng đã phê duyệt sáp nhập.'
          },
          {
            id: 't3-p2-7',
            text: 'What prompted the change in company policy?',
            options: ['A. New industry regulations were enacted.', 'B. The policy is in the employee handbook.', 'C. I agree with the change.'],
            correctAnswer: 0,
            explanation: 'Đáp án A giải thích lý do thay đổi chính sách.'
          },
          {
            id: 't3-p2-8',
            text: 'How many delegates are expected at the conference?',
            options: ['A. The conference is in March.', 'B. Approximately 500 attendees.', 'C. It is an annual event.'],
            correctAnswer: 1,
            explanation: 'Câu hỏi "How many" yêu cầu số lượng.'
          },
          {
            id: 't3-p2-9',
            text: 'Which department handles international shipping?',
            options: ['A. The logistics department manages it.', 'B. Shipping costs have increased.', 'C. We ship to 30 countries.'],
            correctAnswer: 0,
            explanation: 'Câu hỏi "Which department" yêu cầu bộ phận.'
          },
          {
            id: 't3-p2-10',
            text: 'Could you clarify the reimbursement process?',
            options: ['A. I submitted my expenses yesterday.', 'B. Sure, you submit receipts through the finance portal within 30 days.', 'C. Reimbursements are processed monthly.'],
            correctAnswer: 1,
            explanation: 'Đáp án B giải thích quy trình hoàn tiền.'
          },
          {
            id: 't3-p2-11',
            text: 'Will the company be attending the trade show in Berlin?',
            options: ['A. Berlin is in Germany.', 'B. Yes, we have a booth in the main exhibition hall.', 'C. The trade show lasts three days.'],
            correctAnswer: 1,
            explanation: 'Đáp án B xác nhận công ty sẽ tham dự.'
          },
          {
            id: 't3-p2-12',
            text: 'What are the main deliverables for this project?',
            options: ['A. A feasibility report, a prototype, and a market analysis.', 'B. The project starts next week.', 'C. We need five team members.'],
            correctAnswer: 0,
            explanation: 'Câu hỏi "What" yêu cầu sản phẩm cần bàn giao.'
          },
          {
            id: 't3-p2-13',
            text: 'Where should I park when visiting the downtown office?',
            options: ['A. The parking fee is $10.', 'B. Use the garage on Main Street and bring your visitor pass.', 'C. The downtown office is on Fifth Avenue.'],
            correctAnswer: 1,
            explanation: 'Đáp án B hướng dẫn nơi đỗ xe.'
          },
          {
            id: 't3-p2-14',
            text: 'How long is the probationary period for new managers?',
            options: ['A. Managers report to the VP.', 'B. Six months, with a review at the midpoint.', 'C. The position is based in Chicago.'],
            correctAnswer: 1,
            explanation: 'Câu hỏi "How long" yêu cầu thời gian.'
          },
          {
            id: 't3-p2-15',
            text: 'Do we have exclusivity rights for this product in the region?',
            options: ['A. The product was launched last year.', 'B. Yes, our contract grants us exclusive distribution rights.', 'C. The region includes five states.'],
            correctAnswer: 1,
            explanation: 'Đáp án B xác nhận có quyền phân phối độc quyền.'
          },
          {
            id: 't3-p2-16',
            text: 'Why was the marketing campaign postponed?',
            options: ['A. Because the creative team needed more time to finalize the designs.', 'B. The campaign targets young adults.', 'C. It will run for six weeks.'],
            correctAnswer: 0,
            explanation: 'Câu hỏi "Why" yêu cầu lý do. Đáp án A giải thích nguyên nhân.'
          },
          {
            id: 't3-p2-17',
            text: 'What is the turnaround time for the audit report?',
            options: ['A. The audit team consists of four members.', 'B. Ten business days from the start date.', 'C. The report goes to the CFO.'],
            correctAnswer: 1,
            explanation: 'Câu hỏi yêu cầu thời gian xử lý.'
          },
          {
            id: 't3-p2-18',
            text: 'Can you brief me on the status of the Henderson account?',
            options: ['A. Henderson is our largest client.', 'B. Sure, they signed the renewal last Friday.', 'C. The account is managed by Lisa.'],
            correctAnswer: 1,
            explanation: 'Đáp án B cập nhật tình trạng tài khoản Henderson.'
          },
          {
            id: 't3-p2-19',
            text: 'Who should coordinate the press release?',
            options: ['A. The press release is on the website.', 'B. The communications director will handle it.', 'C. It was issued this morning.'],
            correctAnswer: 1,
            explanation: 'Câu hỏi "Who" yêu cầu người phụ trách.'
          },
          {
            id: 't3-p2-20',
            text: 'Where are the expense receipts stored after processing?',
            options: ['A. Receipts are kept for seven years.', 'B. In the digital archive system under the Finance tab.', 'C. They are shredded after six months.'],
            correctAnswer: 1,
            explanation: 'Câu hỏi "Where" yêu cầu nơi lưu trữ.'
          },
          {
            id: 't3-p2-21',
            text: 'How does the company determine employee bonuses?',
            options: ['A. Bonuses are paid in December.', 'B. Based on individual performance metrics and company profitability.', 'C. The bonus pool is $500,000.'],
            correctAnswer: 1,
            explanation: 'Đáp án B giải thích cách tính thưởng.'
          },
          {
            id: 't3-p2-22',
            text: 'When is the deadline for submitting the annual budget?',
            options: ['A. The budget includes all departments.', 'B. November 15th.', 'C. The CFO reviews it first.'],
            correctAnswer: 1,
            explanation: 'Câu hỏi "When" yêu cầu hạn chót.'
          },
          {
            id: 't3-p2-23',
            text: 'What security measures are in place for remote access?',
            options: ['A. Remote access is available to all staff.', 'B. VPN, two-factor authentication, and encrypted connections.', 'C. IT support is available 24/7.'],
            correctAnswer: 1,
            explanation: 'Đáp án B liệt kê các biện pháp bảo mật.'
          },
          {
            id: 't3-p2-24',
            text: 'Has the new ERP system been fully implemented?',
            options: ['A. The ERP system cost $2 million.', 'B. Yes, all departments are now using it.', 'C. It was purchased from SAP.'],
            correctAnswer: 1,
            explanation: 'Đáp án B xác nhận hệ thống ERP đã được triển khai đầy đủ.'
          },
          {
            id: 't3-p2-25',
            text: 'Which vendors are approved for the procurement list?',
            options: ['A. The procurement list is confidential.', 'B. Only vendors on the approved supplier registry may be used.', 'C. We work with 20 vendors.'],
            correctAnswer: 1,
            explanation: 'Đáp án B cho biết chỉ nhà cung cấp trong danh sách được phê duyệt.'
          }
        ]
      },
      {
        id: 't3-sec-3',
        title: 'Part 3: Conversations',
        description: 'Listen to a conversation and answer 3 questions.',
        questions: [
          {
            id: 't3-p3-1',
            passage: 'Man: I\'ve reviewed the quarterly financial report, and there are some discrepancies in the operating expenses.\nWoman: Where did you find the issues?\nMan: The travel expenses for the sales team seem inflated compared to last quarter.\nWoman: Let me cross-reference with the receipts. I may have miscategorized some entries.',
            text: 'What is the man reviewing?',
            options: ['A. An employee contract', 'B. The quarterly financial report', 'C. A marketing proposal', 'D. A client invoice'],
            correctAnswer: 1,
            explanation: 'Ông ấy đang xem xét báo cáo tài trợ quý.'
          },
          {
            id: 't3-p3-2',
            passage: 'Man: I\'ve reviewed the quarterly financial report, and there are some discrepancies in the operating expenses.\nWoman: Where did you find the issues?\nMan: The travel expenses for the sales team seem inflated compared to last quarter.\nWoman: Let me cross-reference with the receipts. I may have miscategorized some entries.',
            text: 'Which expenses seem inflated?',
            options: ['A. Office supplies', 'B. Employee salaries', 'C. Travel expenses for the sales team', 'D. Marketing costs'],
            correctAnswer: 2,
            explanation: 'Chi phí đi lại của đội bán hàng có vẻ cao bất thường.'
          },
          {
            id: 't3-p3-3',
            passage: 'Man: I\'ve reviewed the quarterly financial report, and there are some discrepancies in the operating expenses.\nWoman: Where did you find the issues?\nMan: The travel expenses for the sales team seem inflated compared to last quarter.\nWoman: Let me cross-reference with the receipts. I may have miscategorized some entries.',
            text: 'What might have caused the discrepancy?',
            options: ['A. Fraudulent spending', 'B. A system error', 'C. Miscategorized entries', 'D. A budget increase'],
            correctAnswer: 2,
            explanation: 'Có thể do phân loại sai mục nhập.'
          },
          {
            id: 't3-p3-4',
            passage: 'Woman: Have you had a chance to look at the new vendor proposal?\nMan: Yes, I compared their pricing with three other suppliers.\nWoman: And?\nMan: Their unit cost is 12% lower, but the lead time is longer. We need to weigh the trade-off.',
            text: 'What did the man compare?',
            options: ['A. Two different products', 'B. Pricing from four suppliers', 'C. Last year\'s budget vs. this year\'s', 'D. Online vs. in-store prices'],
            correctAnswer: 1,
            explanation: 'Ông ấy so sánh giá từ bốn nhà cung cấp.'
          },
          {
            id: 't3-p3-5',
            passage: 'Woman: Have you had a chance to look at the new vendor proposal?\nMan: Yes, I compared their pricing with three other suppliers.\nWoman: And?\nMan: Their unit cost is 12% lower, but the lead time is longer. We need to weigh the trade-off.',
            text: 'How much cheaper is the new vendor?',
            options: ['A. 5%', 'B. 8%', 'C. 12%', 'D. 15%'],
            correctAnswer: 2,
            explanation: 'Đơn giá thấp hơn 12%.'
          },
          {
            id: 't3-p3-6',
            passage: 'Woman: Have you had a chance to look at the new vendor proposal?\nMan: Yes, I compared their pricing with three other suppliers.\nWoman: And?\nMan: Their unit cost is 12% lower, but the lead time is longer. We need to weigh the trade-off.',
            text: 'What is the disadvantage of the new vendor?',
            options: ['A. Higher prices', 'B. Poor quality', 'C. Longer lead time', 'D. Limited product range'],
            correctAnswer: 2,
            explanation: 'Nhược điểm là thời gian giao hàng lâu hơn.'
          },
          {
            id: 't3-p3-7',
            passage: 'Man: The client wants to renegotiate the terms of our service agreement.\nWoman: What specific changes are they requesting?\nMan: They want a 10% reduction in pricing and an expanded scope of services.\nWoman: That\'s going to affect our margins significantly. We should prepare a counter-offer.',
            text: 'What does the client want?',
            options: ['A. To cancel the agreement', 'B. Lower pricing and expanded services', 'C. A longer contract term', 'D. More frequent meetings'],
            correctAnswer: 1,
            explanation: 'Khách hàng muốn giảm giá 10% và mở rộng phạm vi dịch vụ.'
          },
          {
            id: 't3-p3-8',
            passage: 'Man: The client wants to renegotiate the terms of our service agreement.\nWoman: What specific changes are they requesting?\nMan: They want a 10% reduction in pricing and an expanded scope of services.\nWoman: That\'s going to affect our margins significantly. We should prepare a counter-offer.',
            text: 'What is the woman concerned about?',
            options: ['A. Losing the client', 'B. The impact on profit margins', 'C. Legal implications', 'D. Employee workload'],
            correctAnswer: 1,
            explanation: 'Cô ấy lo ngại về tác động đến biên lợi nhuận.'
          },
          {
            id: 't3-p3-9',
            passage: 'Man: The client wants to renegotiate the terms of our service agreement.\nWoman: What specific changes are they requesting?\nMan: They want a 10% reduction in pricing and an expanded scope of services.\nWoman: That\'s going to affect our margins significantly. We should prepare a counter-offer.',
            text: 'What do they plan to do?',
            options: ['A. Accept the terms', 'B. Prepare a counter-offer', 'C. Reject the request immediately', 'D. Hire a mediator'],
            correctAnswer: 1,
            explanation: 'Họ dự định chuẩn bị đề nghị phản biện.'
          },
          {
            id: 't3-p3-10',
            passage: 'Woman: I noticed our website bounce rate has increased significantly this month.\nMan: By how much?\nWoman: It went up from 35% to 52%.\nMan: That\'s alarming. Let\'s check if the site speed has degraded or if there\'s an issue with the landing page.',
            text: 'What metric has worsened?',
            options: ['A. Conversion rate', 'B. Website bounce rate', 'C. Social media engagement', 'D. Email open rate'],
            correctAnswer: 1,
            explanation: 'Tỷ lệ thoát website đã tăng đáng kể.'
          },
          {
            id: 't3-p3-11',
            passage: 'Woman: I noticed our website bounce rate has increased significantly this month.\nMan: By how much?\nWoman: It went up from 35% to 52%.\nMan: That\'s alarming. Let\'s check if the site speed has degraded or if there\'s an issue with the landing page.',
            text: 'What was the previous bounce rate?',
            options: ['A. 25%', 'B. 35%', 'C. 42%', 'D. 52%'],
            correctAnswer: 1,
            explanation: 'Tỷ lệ thoát trước đó là 35%.'
          },
          {
            id: 't3-p3-12',
            passage: 'Woman: I noticed our website bounce rate has increased significantly this month.\nMan: By how much?\nWoman: It went up from 35% to 52%.\nMan: That\'s alarming. Let\'s check if the site speed has degraded or if there\'s an issue with the landing page.',
            text: 'What two things do they plan to investigate?',
            options: ['A. Content quality and SEO', 'B. Site speed and landing page issues', 'C. Server location and hosting provider', 'D. Ad campaigns and email marketing'],
            correctAnswer: 1,
            explanation: 'Họ sẽ kiểm tra tốc độ trang web và vấn đề trang đích.'
          },
          {
            id: 't3-p3-13',
            passage: 'Man: We need to finalize the speaker lineup for the annual conference.\nWoman: I\'ve confirmed two keynote speakers so far. Dr. Rivera and Mr. Tanaka.\nMan: Good. We still need someone from the technology sector.\nWoman: I\'ll reach out to some contacts at the major tech firms this week.',
            text: 'What are they planning?',
            options: ['A. A company retreat', 'B. An annual conference', 'C. A product launch', 'D. A training workshop'],
            correctAnswer: 1,
            explanation: 'Họ đang lên kế hoạch hội nghị thường niên.'
          },
          {
            id: 't3-p3-14',
            passage: 'Man: We need to finalize the speaker lineup for the annual conference.\nWoman: I\'ve confirmed two keynote speakers so far. Dr. Rivera and Mr. Tanaka.\nMan: Good. We still need someone from the technology sector.\nWoman: I\'ll reach out to some contacts at the major tech firms this week.',
            text: 'Who are the confirmed speakers?',
            options: ['A. Dr. Rivera and Ms. Lee', 'B. Mr. Tanaka and Dr. Park', 'C. Dr. Rivera and Mr. Tanaka', 'D. Ms. Lee and Mr. Tanaka'],
            correctAnswer: 2,
            explanation: 'Hai diễn giả đã xác nhận là Dr. Rivera và Mr. Tanaka.'
          },
          {
            id: 't3-p3-15',
            passage: 'Man: We need to finalize the speaker lineup for the annual conference.\nWoman: I\'ve confirmed two keynote speakers so far. Dr. Rivera and Mr. Tanaka.\nMan: Good. We still need someone from the technology sector.\nWoman: I\'ll reach out to some contacts at the major tech firms this week.',
            text: 'What type of speaker do they still need?',
            options: ['A. A finance expert', 'B. A marketing professional', 'C. A technology sector representative', 'D. A government official'],
            correctAnswer: 2,
            explanation: 'Họ vẫn cần một người từ ngành công nghệ.'
          },
          {
            id: 't3-p3-16',
            passage: 'Man: Have you seen the latest customer satisfaction survey results?\nWoman: Yes, the overall score dropped by 8 points.\nMan: What were the main complaints?\nWoman: Long wait times and unresolved issues were the top two concerns.',
            text: 'What happened to the satisfaction score?',
            options: ['A. It increased', 'B. It stayed the same', 'C. It dropped by 8 points', 'D. It dropped by 15 points'],
            correctAnswer: 2,
            explanation: 'Điểm hài lòng giảm 8 điểm.'
          },
          {
            id: 't3-p3-17',
            passage: 'Man: Have you seen the latest customer satisfaction survey results?\nWoman: Yes, the overall score dropped by 8 points.\nMan: What were the main complaints?\nWoman: Long wait times and unresolved issues were the top two concerns.',
            text: 'What was the number one complaint?',
            options: ['A. Product quality', 'B. High prices', 'C. Long wait times', 'D. Rude staff'],
            correctAnswer: 2,
            explanation: 'Phản hồi số một là thời gian chờ đợi lâu.'
          },
          {
            id: 't3-p3-18',
            passage: 'Man: Have you seen the latest customer satisfaction survey results?\nWoman: Yes, the overall score dropped by 8 points.\nMan: What were the main complaints?\nWoman: Long wait times and unresolved issues were the top two concerns.',
            text: 'What was the second main complaint?',
            options: ['A. Website errors', 'B. Unresolved issues', 'C. Missing features', 'D. Delivery delays'],
            correctAnswer: 1,
            explanation: 'Phản hồi thứ hai là vấn đề chưa được giải quyết.'
          },
          {
            id: 't3-p3-19',
            passage: 'Woman: I\'m preparing the proposal for the Johnson account renewal.\nMan: What\'s the proposed contract value?\nWoman: $1.2 million for a three-year term. That\'s a 15% increase from the current contract.\nMan: Make sure to highlight the ROI metrics from the past two years.',
            text: 'What is the woman preparing?',
            options: ['A. A budget report', 'B. A contract renewal proposal', 'C. A marketing plan', 'D. An employee review'],
            correctAnswer: 1,
            explanation: 'Cô ấy đang chuẩn bị đề nghị gia hạn hợp đồng.'
          },
          {
            id: 't3-p3-20',
            passage: 'Woman: I\'m preparing the proposal for the Johnson account renewal.\nMan: What\'s the proposed contract value?\nWoman: $1.2 million for a three-year term. That\'s a 15% increase from the current contract.\nMan: Make sure to highlight the ROI metrics from the past two years.',
            text: 'How long is the proposed contract term?',
            options: ['A. One year', 'B. Two years', 'C. Three years', 'D. Five years'],
            correctAnswer: 2,
            explanation: 'Thời hạn hợp đồng đề xuất là ba năm.'
          },
          {
            id: 't3-p3-21',
            passage: 'Woman: I\'m preparing the proposal for the Johnson account renewal.\nMan: What\'s the proposed contract value?\nWoman: $1.2 million for a three-year term. That\'s a 15% increase from the current contract.\nMan: Make sure to highlight the ROI metrics from the past two years.',
            text: 'What does the man suggest including?',
            options: ['A. Competitor pricing', 'B. Employee testimonials', 'C. ROI metrics from the past two years', 'D. A new product roadmap'],
            correctAnswer: 2,
            explanation: 'Ông ấy gợi ý bao gồm các chỉ số ROI hai năm qua.'
          },
          {
            id: 't3-p3-22',
            passage: 'Man: The building management notified us about a power outage this Saturday.\nWoman: From what time?\nMan: From 6 AM to 2 PM. We need to make sure all servers are backed up.\nWoman: I\'ll contact IT to arrange an uninterruptible power supply for the server room.',
            text: 'What is happening on Saturday?',
            options: ['A. A fire drill', 'B. A power outage', 'C. A building inspection', 'D. A holiday closure'],
            correctAnswer: 1,
            explanation: 'Sẽ có mất điện vào thứ Bảy.'
          },
          {
            id: 't3-p3-23',
            passage: 'Man: The building management notified us about a power outage this Saturday.\nWoman: From what time?\nMan: From 6 AM to 2 PM. We need to make sure all servers are backed up.\nWoman: I\'ll contact IT to arrange an uninterruptible power supply for the server room.',
            text: 'How long will the power outage last?',
            options: ['A. 4 hours', 'B. 6 hours', 'C. 8 hours', 'D. 10 hours'],
            correctAnswer: 2,
            explanation: 'Mất điện từ 6h sáng đến 2h chiều, tổng cộng 8 tiếng.'
          },
          {
            id: 't3-p3-24',
            passage: 'Man: The building management notified us about a power outage this Saturday.\nWoman: From what time?\nMan: From 6 AM to 2 PM. We need to make sure all servers are backed up.\nWoman: I\'ll contact IT to arrange an uninterruptible power supply for the server room.',
            text: 'What will the woman arrange?',
            options: ['A. A backup generator', 'B. An uninterruptible power supply', 'C. A server migration', 'D. Off-site data storage'],
            correctAnswer: 1,
            explanation: 'Cô ấy sẽ sắp xếp nguồn điện dự phòng (UPS).'
          },
          {
            id: 't3-p3-25',
            passage: 'Woman: Have you started working on the sustainability report?\nMan: Yes, I\'ve gathered data on energy consumption and waste reduction.\nWoman: The board wants to see concrete targets for the next five years.\nMan: I\'ll draft a section on carbon neutrality goals and renewable energy adoption.',
            text: 'What is the man working on?',
            options: ['A. A financial forecast', 'B. A sustainability report', 'C. An employee handbook', 'D. A product catalog'],
            correctAnswer: 1,
            explanation: 'Ông ấy đang làm báo cáo phát triển bền vững.'
          },
          {
            id: 't3-p3-26',
            passage: 'Woman: Have you started working on the sustainability report?\nMan: Yes, I\'ve gathered data on energy consumption and waste reduction.\nWoman: The board wants to see concrete targets for the next five years.\nMan: I\'ll draft a section on carbon neutrality goals and renewable energy adoption.',
            text: 'What timeframe does the board want targets for?',
            options: ['A. One year', 'B. Three years', 'C. Five years', 'D. Ten years'],
            correctAnswer: 2,
            explanation: 'Hội đồng muốn thấy mục tiêu cho năm năm tới.'
          },
          {
            id: 't3-p3-27',
            passage: 'Woman: Have you started working on the sustainability report?\nMan: Yes, I\'ve gathered data on energy consumption and waste reduction.\nWoman: The board wants to see concrete targets for the next five years.\nMan: I\'ll draft a section on carbon neutrality goals and renewable energy adoption.',
            text: 'What topics will the man cover?',
            options: ['A. Employee wellness and benefits', 'B. Carbon neutrality and renewable energy', 'C. Market expansion and sales growth', 'D. Technology upgrades and IT infrastructure'],
            correctAnswer: 1,
            explanation: 'Ông ấy sẽ viết về mục tiêu trung hòa carbon và năng lượng tái tạo.'
          },
          {
            id: 't3-p3-28',
            passage: 'Man: The new regulatory framework will affect how we handle customer data.\nWoman: Do we need to update our privacy policy?\nMan: Yes, and we also need to implement consent tracking for all data collection.\nWoman: I\'ll schedule a meeting with the legal team to review the requirements.',
            text: 'What is changing?',
            options: ['A. The company logo', 'B. Data handling regulations', 'C. Employee benefits', 'D. Office locations'],
            correctAnswer: 1,
            explanation: 'Quy định xử lý dữ liệu khách hàng đang thay đổi.'
          },
          {
            id: 't3-p3-29',
            passage: 'Man: The new regulatory framework will affect how we handle customer data.\nWoman: Do we need to update our privacy policy?\nMan: Yes, and we also need to implement consent tracking for all data collection.\nWoman: I\'ll schedule a meeting with the legal team to review the requirements.',
            text: 'What else needs to be implemented?',
            options: ['A. A new IT system', 'B. Consent tracking for data collection', 'C. A customer loyalty program', 'D. An employee training module'],
            correctAnswer: 1,
            explanation: 'Cần triển khai theo dõi sự đồng ý cho việc thu thập dữ liệu.'
          },
          {
            id: 't3-p3-30',
            passage: 'Man: The new regulatory framework will affect how we handle customer data.\nWoman: Do we need to update our privacy policy?\nMan: Yes, and we also need to implement consent tracking for all data collection.\nWoman: I\'ll schedule a meeting with the legal team to review the requirements.',
            text: 'Who will the woman meet with?',
            options: ['A. The IT department', 'B. The marketing team', 'C. The legal team', 'D. The customer support team'],
            correctAnswer: 2,
            explanation: 'Cô ấy sẽ gặp nhóm pháp lý.'
          },
          {
            id: 't3-p3-31',
            passage: 'Woman: The results from the A/B test are in.\nMan: Which version performed better?\nWoman: Version B had a 23% higher conversion rate than Version A.\nMan: Excellent. Let\'s roll out Version B across all our campaigns.',
            text: 'What are they discussing?',
            options: ['A. A new product design', 'B. Results from an A/B test', 'C. Customer feedback', 'D. Employee performance'],
            correctAnswer: 1,
            explanation: 'Họ đang thảo luận kết quả thử nghiệm A/B.'
          },
          {
            id: 't3-p3-32',
            passage: 'Woman: The results from the A/B test are in.\nMan: Which version performed better?\nWoman: Version B had a 23% higher conversion rate than Version A.\nMan: Excellent. Let\'s roll out Version B across all our campaigns.',
            text: 'How much better did Version B perform?',
            options: ['A. 13% higher', 'B. 18% higher', 'C. 23% higher', 'D. 30% higher'],
            correctAnswer: 2,
            explanation: 'Phiên bản B tốt hơn 23%.'
          },
          {
            id: 't3-p3-33',
            passage: 'Woman: The results from the A/B test are in.\nMan: Which version performed better?\nWoman: Version B had a 23% higher conversion rate than Version A.\nMan: Excellent. Let\'s roll out Version B across all our campaigns.',
            text: 'What decision do they make?',
            options: ['A. Run another test', 'B. Use Version A instead', 'C. Roll out Version B across all campaigns', 'D. Discard both versions'],
            correctAnswer: 2,
            explanation: 'Họ quyết định triển khai phiên bản B cho tất cả chiến dịch.'
          },
          {
            id: 't3-p3-34',
            passage: 'Man: Have you had any updates from the customs broker about the shipment?\nWoman: Yes, there\'s a delay. The container is stuck at port due to new inspection requirements.\nMan: How long is the delay?\nWoman: They estimate an additional 5 to 7 business days.',
            text: 'What is causing the delay?',
            options: ['A. Weather conditions', 'B. New inspection requirements', 'C. Labor shortage', 'D. Documentation errors'],
            correctAnswer: 1,
            explanation: 'Sự chậm trễ do yêu cầu kiểm tra mới.'
          },
          {
            id: 't3-p3-35',
            passage: 'Man: Have you had any updates from the customs broker about the shipment?\nWoman: Yes, there\'s a delay. The container is stuck at port due to new inspection requirements.\nMan: How long is the delay?\nWoman: They estimate an additional 5 to 7 business days.',
            text: 'How long is the estimated additional delay?',
            options: ['A. 1 to 3 days', 'B. 3 to 5 days', 'C. 5 to 7 business days', 'D. 7 to 10 business days'],
            correctAnswer: 2,
            explanation: 'Sự chậm trễ ước tính thêm 5 đến 7 ngày làm việc.'
          },
          {
            id: 't3-p3-36',
            passage: 'Man: Have you had any updates from the customs broker about the shipment?\nWoman: Yes, there\'s a delay. The container is stuck at port due to new inspection requirements.\nMan: How long is the delay?\nWoman: They estimate an additional 5 to 7 business days.',
            text: 'Where is the container currently located?',
            options: ['A. At the warehouse', 'B. On a cargo ship', 'C. At port', 'D. At the customs office'],
            correctAnswer: 2,
            explanation: 'Container đang bị mắc kẹt tại cảng.'
          },
          {
            id: 't3-p3-37',
            passage: 'Woman: I\'m concerned about the data breach that happened at our competitor.\nMan: We should review our own cybersecurity protocols.\nWoman: Agreed. I\'ll have the IT team conduct a vulnerability assessment.\nMan: Let\'s also brief all staff on phishing awareness.',
            text: 'What prompted their discussion?',
            options: ['A. An internal audit', 'B. A competitor\'s data breach', 'C. A new cybersecurity law', 'D. A customer complaint'],
            correctAnswer: 1,
            explanation: 'Cuộc thảo luận được kích hoạt bởi vụ vi phạm dữ liệu của đối thủ.'
          },
          {
            id: 't3-p3-38',
            passage: 'Woman: I\'m concerned about the data breach that happened at our competitor.\nMan: We should review our own cybersecurity protocols.\nWoman: Agreed. I\'ll have the IT team conduct a vulnerability assessment.\nMan: Let\'s also brief all staff on phishing awareness.',
            text: 'What will the IT team conduct?',
            options: ['A. A security audit', 'B. A vulnerability assessment', 'C. A penetration test', 'D. A compliance review'],
            correctAnswer: 1,
            explanation: 'Nhóm IT sẽ tiến hành đánh giá lỗ hổng.'
          },
          {
            id: 't3-p3-39',
            passage: 'Woman: I\'m concerned about the data breach that happened at our competitor.\nMan: We should review our own cybersecurity protocols.\nWoman: Agreed. I\'ll have the IT team conduct a vulnerability assessment.\nMan: Let\'s also brief all staff on phishing awareness.',
            text: 'What additional action do they plan?',
            options: ['A. Hire a security consultant', 'B. Upgrade all hardware', 'C. Brief staff on phishing awareness', 'D. Implement two-factor authentication'],
            correctAnswer: 2,
            explanation: 'Họ cũng sẽ hướng dẫn nhân viên nhận biết lừa đảo trực tuyến.'
          }
        ]
      },
      {
        id: 't3-sec-4',
        title: 'Part 4: Short Talks',
        description: 'Listen to a short talk and answer questions.',
        questions: [
          {
            id: 't3-p4-1',
            passage: 'Good afternoon, employees. I\'m pleased to announce that our company has been named one of the Top 50 Employers in the country by Business Weekly magazine. This recognition reflects our commitment to fostering a positive workplace culture, offering competitive benefits, and investing in employee development. Congratulations to all of you for making this possible.',
            text: 'What was the company recognized for?',
            options: ['A. Highest revenue', 'B. Being a top employer', 'C. Innovation award', 'D. Environmental leadership'],
            correctAnswer: 1,
            explanation: 'Công ty được công nhận là một trong những nhà tuyển dụng hàng đầu.'
          },
          {
            id: 't3-p4-2',
            passage: 'Good afternoon, employees. I\'m pleased to announce that our company has been named one of the Top 50 Employers in the country by Business Weekly magazine. This recognition reflects our commitment to fostering a positive workplace culture, offering competitive benefits, and investing in employee development. Congratulations to all of you for making this possible.',
            text: 'Who gave the company this recognition?',
            options: ['A. The government', 'B. A customer association', 'C. Business Weekly magazine', 'D. An industry board'],
            correctAnswer: 2,
            explanation: 'Tạp chí Business Weekly đã trao giải thưởng.'
          },
          {
            id: 't3-p4-3',
            passage: 'Good afternoon, employees. I\'m pleased to announce that our company has been named one of the Top 50 Employers in the country by Business Weekly magazine. This recognition reflects our commitment to fostering a positive workplace culture, offering competitive benefits, and investing in employee development. Congratulations to all of you for making this possible.',
            text: 'What factors contributed to the recognition?',
            options: ['A. Low prices and fast delivery', 'B. Workplace culture, benefits, and employee development', 'C. High stock prices and profit margins', 'D. International expansion and partnerships'],
            correctAnswer: 1,
            explanation: 'Văn hóa làm việc, phúc lợi và phát triển nhân viên là yếu tố đóng góp.'
          },
          {
            id: 't3-p4-4',
            passage: 'This is a notice from the IT department. We will be performing a system-wide software update this Saturday between 2 AM and 6 AM. During this time, all internal systems including email, the intranet, and the project management platform will be temporarily unavailable. Please save your work before leaving the office on Friday.',
            text: 'What will happen on Saturday?',
            options: ['A. A network outage', 'B. A software update', 'C. A security breach', 'D. A hardware replacement'],
            correctAnswer: 1,
            explanation: 'Sẽ có cập nhật phần mềm toàn hệ thống vào thứ Bảy.'
          },
          {
            id: 't3-p4-5',
            passage: 'This is a notice from the IT department. We will be performing a system-wide software update this Saturday between 2 AM and 6 AM. During this time, all internal systems including email, the intranet, and the project management platform will be temporarily unavailable. Please save your work before leaving the office on Friday.',
            text: 'How long will systems be unavailable?',
            options: ['A. 2 hours', 'B. 4 hours', 'C. 6 hours', 'D. 8 hours'],
            correctAnswer: 1,
            explanation: 'Hệ thống sẽ không khả dụng trong 4 tiếng (từ 2h đến 6h).'
          },
          {
            id: 't3-p4-6',
            passage: 'This is a notice from the IT department. We will be performing a system-wide software update this Saturday between 2 AM and 6 AM. During this time, all internal systems including email, the intranet, and the project management platform will be temporarily unavailable. Please save your work before leaving the office on Friday.',
            text: 'What are employees asked to do on Friday?',
            options: ['A. Work overtime', 'B. Update their passwords', 'C. Save their work', 'D. Restart their computers'],
            correctAnswer: 2,
            explanation: 'Nhân viên được yêu cầu lưu công việc trước khi rời văn phòng.'
          },
          {
            id: 't3-p4-7',
            passage: 'Attention all sales representatives. Our quarterly sales kickoff meeting has been rescheduled from March 12th to March 19th. The agenda will include a review of Q1 performance, the introduction of new product lines, and a training session on our updated CRM system. Attendance is mandatory for all sales staff.',
            text: 'When is the rescheduled meeting?',
            options: ['A. March 5th', 'B. March 12th', 'C. March 19th', 'D. March 26th'],
            correctAnswer: 2,
            explanation: 'Cuộc họp dời sang ngày 19 tháng 3.'
          },
          {
            id: 't3-p4-8',
            passage: 'Attention all sales representatives. Our quarterly sales kickoff meeting has been rescheduled from March 12th to March 19th. The agenda will include a review of Q1 performance, the introduction of new product lines, and a training session on our updated CRM system. Attendance is mandatory for all sales staff.',
            text: 'Which topic will NOT be covered?',
            options: ['A. Q1 performance review', 'B. New product lines', 'C. CRM system training', 'D. Budget allocation for next year'],
            correctAnswer: 3,
            explanation: 'Phân bổ ngân sách cho năm tới không được đề cập.'
          },
          {
            id: 't3-p4-9',
            passage: 'Attention all sales representatives. Our quarterly sales kickoff meeting has been rescheduled from March 12th to March 19th. The agenda will include a review of Q1 performance, the introduction of new product lines, and a training session on our updated CRM system. Attendance is mandatory for all sales staff.',
            text: 'Who must attend the meeting?',
            options: ['A. Only managers', 'B. All sales staff', 'C. The executive team', 'D. External partners'],
            correctAnswer: 1,
            explanation: 'Tất cả nhân viên bán hàng phải tham dự.'
          },
          {
            id: 't3-p4-10',
            passage: 'Thank you for calling GreenEarth Consulting. Our offices will be closed on Monday, April 15th, in observance of the national holiday. Normal operations will resume on Tuesday. For urgent inquiries during the closure, please email support@greenearth.com and we will respond within 24 hours.',
            text: 'Why will the offices be closed?',
            options: ['A. Building maintenance', 'B. A national holiday', 'C. A team-building event', 'D. Power outage'],
            correctAnswer: 1,
            explanation: 'Văn phòng đóng cửa nghỉ lễ quốc gia.'
          },
          {
            id: 't3-p4-11',
            passage: 'Thank you for calling GreenEarth Consulting. Our offices will be closed on Monday, April 15th, in observance of the national holiday. Normal operations will resume on Tuesday. For urgent inquiries during the closure, please email support@greenearth.com and we will respond within 24 hours.',
            text: 'How should urgent inquiries be directed?',
            options: ['A. By phone', 'B. By email', 'C. Through social media', 'D. In person'],
            correctAnswer: 1,
            explanation: 'Câu hỏi khẩn cấp nên được gửi qua email.'
          },
          {
            id: 't3-p4-12',
            passage: 'Thank you for calling GreenEarth Consulting. Our offices will be closed on Monday, April 15th, in observance of the national holiday. Normal operations will resume on Tuesday. For urgent inquiries during the closure, please email support@greenearth.com and we will respond within 24 hours.',
            text: 'When will normal operations resume?',
            options: ['A. Monday afternoon', 'B. Tuesday', 'C. Wednesday', 'D. The following Monday'],
            correctAnswer: 1,
            explanation: 'Hoạt động bình thường trở lại vào thứ Ba.'
          },
          {
            id: 't3-p4-13',
            passage: 'Ladies and gentlemen, welcome to the Meridian Hotel. This is your front desk manager speaking. I\'d like to inform all guests that the rooftop pool will be closed tomorrow from 9 AM to noon for routine maintenance. The indoor pool on the second floor remains open and available for your use. We apologize for any inconvenience.',
            text: 'Why is the rooftop pool closing?',
            options: ['A. Bad weather', 'B. A private event', 'C. Routine maintenance', 'D. Safety concerns'],
            correctAnswer: 2,
            explanation: 'Hồ bơi trên sân thượng đóng cửa để bảo trì định kỳ.'
          },
          {
            id: 't3-p4-14',
            passage: 'Ladies and gentlemen, welcome to the Meridian Hotel. This is your front desk manager speaking. I\'d like to inform all guests that the rooftop pool will be closed tomorrow from 9 AM to noon for routine maintenance. The indoor pool on the second floor remains open and available for your use. We apologize for any inconvenience.',
            text: 'Which alternative is available?',
            options: ['A. The gym', 'B. The indoor pool', 'C. The spa', 'D. The sauna'],
            correctAnswer: 1,
            explanation: 'Hồ bơi trong nhà vẫn mở cửa.'
          },
          {
            id: 't3-p4-15',
            passage: 'Ladies and gentlemen, welcome to the Meridian Hotel. This is your front desk manager speaking. I\'d like to inform all guests that the rooftop pool will be closed tomorrow from 9 AM to noon for routine maintenance. The indoor pool on the second floor remains open and available for your use. We apologize for any inconvenience.',
            text: 'Until what time will the rooftop pool be closed?',
            options: ['A. 9 AM', 'B. 10 AM', 'C. Noon', 'D. 2 PM'],
            correctAnswer: 2,
            explanation: 'Hồ bơi đóng cửa đến trưa.'
          },
          {
            id: 't3-p4-16',
            passage: 'This is an important announcement for all warehouse staff. Effective immediately, all personnel working in the warehouse must wear high-visibility vests at all times while on the floor. This policy has been implemented in response to recent safety audits. Vests can be picked up from the safety office on the ground floor.',
            text: 'What must warehouse staff now wear?',
            options: ['A. Hard hats', 'B. High-visibility vests', 'C. Steel-toed boots', 'D. Gloves'],
            correctAnswer: 1,
            explanation: 'Nhân viên kho phải mặc áo phản quang mọi lúc.'
          },
          {
            id: 't3-p4-17',
            passage: 'This is an important announcement for all warehouse staff. Effective immediately, all personnel working in the warehouse must wear high-visibility vests at all times while on the floor. This policy has been implemented in response to recent safety audits. Vests can be picked up from the safety office on the ground floor.',
            text: 'Why was this policy implemented?',
            options: ['A. Customer request', 'B. Government regulation', 'C. Recent safety audits', 'D. Insurance requirements'],
            correctAnswer: 2,
            explanation: 'Chính sách được thực hiện do các đợt kiểm tra an toàn gần đây.'
          },
          {
            id: 't3-p4-18',
            passage: 'This is an important announcement for all warehouse staff. Effective immediately, all personnel working in the warehouse must wear high-visibility vests at all times while on the floor. This policy has been implemented in response to recent safety audits. Vests can be picked up from the safety office on the ground floor.',
            text: 'Where can staff get their vests?',
            options: ['A. From their supervisor', 'B. From the safety office', 'C. From the HR department', 'D. From the security desk'],
            correctAnswer: 1,
            explanation: 'Nhân viên có thể nhận áo tại văn phòng an toàn.'
          },
          {
            id: 't3-p4-19',
            passage: 'Good evening. This is your hotel operator. I\'d like to remind all guests that the complimentary breakfast buffet is served daily from 6:30 AM to 10:00 AM in the Garden Room on the first floor. Room service is also available 24 hours a day for an additional charge. Enjoy your stay.',
            text: 'What time does breakfast end?',
            options: ['A. 8:00 AM', 'B. 9:00 AM', 'C. 10:00 AM', 'D. 11:00 AM'],
            correctAnswer: 2,
            explanation: 'Bữa sáng tự chọn kết thúc lúc 10 giờ sáng.'
          },
          {
            id: 't3-p4-20',
            passage: 'Good evening. This is your hotel operator. I\'d like to remind all guests that the complimentary breakfast buffet is served daily from 6:30 AM to 10:00 AM in the Garden Room on the first floor. Room service is also available 24 hours a day for an additional charge. Enjoy your stay.',
            text: 'Where is breakfast served?',
            options: ['A. In the guest rooms', 'B. On the rooftop', 'C. In the Garden Room', 'D. By the pool'],
            correctAnswer: 2,
            explanation: 'Bữa sáng được phục vụ tại Garden Room ở tầng một.'
          },
          {
            id: 't3-p4-21',
            passage: 'Good evening. This is your hotel operator. I\'d like to remind all guests that the complimentary breakfast buffet is served daily from 6:30 AM to 10:00 AM in the Garden Room on the first floor. Room service is also available 24 hours a day for an additional charge. Enjoy your stay.',
            text: 'Is room service free of charge?',
            options: ['A. Yes, it is included in the room rate.', 'B. No, there is an additional charge.', 'C. Only for suite guests.', 'D. Only on weekdays.'],
            correctAnswer: 1,
            explanation: 'Dịch vụ phòng có phụ phí.'
          },
          {
            id: 't3-p4-22',
            passage: 'This is a reminder to all project managers. The deadline for submitting your Q2 project proposals has been extended to April 28th. All proposals must include a detailed budget breakdown, a project timeline, and a risk assessment. Submissions should be made through the project management portal.',
            text: 'What was extended?',
            options: ['A. The project timeline', 'B. The Q2 proposal deadline', 'C. The budget approval', 'D. The hiring process'],
            correctAnswer: 1,
            explanation: 'Hạn chót nộp đề xuất dự án Q2 đã được gia hạn.'
          },
          {
            id: 't3-p4-23',
            passage: 'This is a reminder to all project managers. The deadline for submitting your Q2 project proposals has been extended to April 28th. All proposals must include a detailed budget breakdown, a project timeline, and a risk assessment. Submissions should be made through the project management portal.',
            text: 'What must all proposals include?',
            options: ['A. Employee biographies', 'B. Budget breakdown, timeline, and risk assessment', 'C. Marketing materials', 'D. Client testimonials'],
            correctAnswer: 1,
            explanation: 'Tất cả đề xuất phải bao gồm phân tích ngân sách, lịch trình và đánh giá rủi ro.'
          },
          {
            id: 't3-p4-24',
            passage: 'This is a reminder to all project managers. The deadline for submitting your Q2 project proposals has been extended to April 28th. All proposals must include a detailed budget breakdown, a project timeline, and a risk assessment. Submissions should be made through the project management portal.',
            text: 'How should proposals be submitted?',
            options: ['A. By email', 'B. In person', 'C. Through the project management portal', 'D. By postal mail'],
            correctAnswer: 2,
            explanation: 'Đề xuất phải được nộp qua cổng quản lý dự án.'
          },
          {
            id: 't3-p4-25',
            passage: 'Attention all travelers. Due to severe weather conditions, all flights departing from Terminal 3 have been delayed until further notice. Passengers should check the departure boards for updated gate information and times. We recommend contacting your airline for rebooking options.',
            text: 'Why are flights delayed?',
            options: ['A. A security threat', 'B. Staff shortage', 'C. Severe weather conditions', 'D. A system outage'],
            correctAnswer: 2,
            explanation: 'Chuyến bay bị trì hoãn do điều kiện thời tiết khắc nghiệt.'
          },
          {
            id: 't3-p4-26',
            passage: 'Attention all travelers. Due to severe weather conditions, all flights departing from Terminal 3 have been delayed until further notice. Passengers should check the departure boards for updated gate information and times. We recommend contacting your airline for rebooking options.',
            text: 'Which terminal is affected?',
            options: ['A. Terminal 1', 'B. Terminal 2', 'C. Terminal 3', 'D. Terminal 4'],
            correctAnswer: 2,
            explanation: 'Ga 3 bị ảnh hưởng.'
          },
          {
            id: 't3-p4-27',
            passage: 'Attention all travelers. Due to severe weather conditions, all flights departing from Terminal 3 have been delayed until further notice. Passengers should check the departure boards for updated gate information and times. We recommend contacting your airline for rebooking options.',
            text: 'What should passengers do?',
            options: ['A. Leave the airport', 'B. Check departure boards and contact their airline', 'C. Go to the lost luggage counter', 'D. Proceed to their gate immediately'],
            correctAnswer: 1,
            explanation: 'Hành khách nên kiểm tra bảng thông báo và liên hệ hãng hàng không.'
          },
          {
            id: 't3-p4-28',
            passage: 'This is the HR department. We are pleased to announce that enrollment for the 2024 employee benefits program is now open. This year, we are introducing a new dental plan, expanded vision coverage, and a wellness reimbursement account. Please review the benefits guide sent to your email and make your selections by May 15th.',
            text: 'What new benefit is being introduced?',
            options: ['A. Life insurance', 'B. A dental plan', 'C. Stock options', 'D. Retirement matching'],
            correctAnswer: 1,
            explanation: 'Kế hoạch nha khoa mới được giới thiệu.'
          },
          {
            id: 't3-p4-29',
            passage: 'This is the HR department. We are pleased to announce that enrollment for the 2024 employee benefits program is now open. This year, we are introducing a new dental plan, expanded vision coverage, and a wellness reimbursement account. Please review the benefits guide sent to your email and make your selections by May 15th.',
            text: 'What is the enrollment deadline?',
            options: ['A. April 30th', 'B. May 1st', 'C. May 15th', 'D. May 31st'],
            correctAnswer: 2,
            explanation: 'Hạn chót đăng ký là ngày 15 tháng 5.'
          },
          {
            id: 't3-p4-30',
            passage: 'This is the HR department. We are pleased to announce that enrollment for the 2024 employee benefits program is now open. This year, we are introducing a new dental plan, expanded vision coverage, and a wellness reimbursement account. Please review the benefits guide sent to your email and make your selections by May 15th.',
            text: 'Where can employees find the benefits guide?',
            options: ['A. On the company intranet', 'B. In their email', 'C. At the HR office', 'D. In the employee handbook'],
            correctAnswer: 1,
            explanation: 'Hướng dẫn phúc lợi được gửi qua email.'
          }
        ]
      },
      {
        id: 't3-sec-5',
        title: 'Part 5: Incomplete Sentences',
        description: 'Choose the word that best completes the sentence.',
        questions: [
          {
            id: 't3-p5-1',
            text: 'The board of directors unanimously _____ the proposed acquisition during yesterday\'s meeting.',
            options: ['A. rejected', 'B. approved', 'C. ignored', 'D. delayed'],
            correctAnswer: 1,
            explanation: '"Approved" = phê duyệt, hợp lý nhất với "unanimously".'
          },
          {
            id: 't3-p5-2',
            text: 'The company\'s market share has been _____ steadily over the past five years.',
            options: ['A. declining', 'B. decline', 'C. declined', 'D. declines'],
            correctAnswer: 0,
            explanation: 'Cấu trúc hiện tại tiếp diễn bị động: has been + V-ing.'
          },
          {
            id: 't3-p5-3',
            text: 'The contract was _____ to a third party without the client\'s consent.',
            options: ['A. assigned', 'B. assign', 'C. assigning', 'D. assignment'],
            correctAnswer: 0,
            explanation: 'Cấu trúc bị động: was + V3 (assigned).'
          },
          {
            id: 't3-p5-4',
            text: 'We need to _____ the feasibility of expanding into the Asian market.',
            options: ['A. assess', 'B. accessed', 'C. accessing', 'D. assessment'],
            correctAnswer: 0,
            explanation: 'Động từ nguyên形 sau "need to".'
          },
          {
            id: 't3-p5-5',
            text: 'The CEO\'s resignation came as a _____ to many employees.',
            options: ['A. surprise', 'B. surprised', 'C. surprising', 'D. surprisingly'],
            correctAnswer: 0,
            explanation: '"Came as a surprise" = gây bất ngờ.'
          },
          {
            id: 't3-p5-6',
            text: 'All employees are required to complete the _____ training program before their first day.',
            options: ['A. orientation', 'B. oriented', 'C. orient', 'D. orienting'],
            correctAnswer: 0,
            explanation: '"Orientation training" = chương trình đào tạo định hướng.'
          },
          {
            id: 't3-p5-7',
            text: 'The new regulations will have a significant _____ on the way we conduct business.',
            options: ['A. affect', 'B. effect', 'C. effort', 'D. afford'],
            correctAnswer: 1,
            explanation: '"Effect" = tác động (danh từ). "Have an effect on" = có tác động đến.'
          },
          {
            id: 't3-p5-8',
            text: 'Despite the economic downturn, the company managed to _____ a profit this quarter.',
            options: ['A. generate', 'B. generated', 'C. generating', 'D. generation'],
            correctAnswer: 0,
            explanation: 'Động từ nguyên形 sau "managed to".'
          },
          {
            id: 't3-p5-9',
            text: 'The marketing department has developed an _____ campaign to promote the new product.',
            options: ['A. innovate', 'B. innovative', 'C. innovation', 'D. innovatively'],
            correctAnswer: 1,
            explanation: 'Tính từ "innovative"修饰名词 "campaign".'
          },
          {
            id: 't3-p5-10',
            text: 'The project was completed _____ schedule and under budget.',
            options: ['A. behind', 'B. ahead of', 'C. beneath', 'D. outside of'],
            correctAnswer: 1,
            explanation: '"Ahead of schedule" = trước lịch trình.'
          },
          {
            id: 't3-p5-11',
            text: 'The company has decided to _____ the manufacturing process to reduce waste.',
            options: ['A. streamline', 'B. stricten', 'C. strengthen', 'D. shorten'],
            correctAnswer: 0,
            explanation: '"Streamline" = tinh giản.'
          },
          {
            id: 't3-p5-12',
            text: 'The annual general meeting will be held _____ the last week of March.',
            options: ['A. at', 'B. on', 'C. during', 'D. by'],
            correctAnswer: 2,
            explanation: '"During" = trong suốt, dùng với khoảng thời gian.'
          },
          {
            id: 't3-p5-13',
            text: 'The firm has a reputation for providing _____ customer service.',
            options: ['A. exceptionally', 'B. exceptional', 'C. except', 'D. exception'],
            correctAnswer: 1,
            explanation: 'Tính từ "exceptional"修饰名词 "customer service".'
          },
          {
            id: 't3-p5-14',
            text: 'The new employee demonstrated a high level of _____ during her first week.',
            options: ['A. competence', 'B. competent', 'C. competently', 'D. competing'],
            correctAnswer: 0,
            explanation: 'Danh từ "competence" = năng lực.'
          },
          {
            id: 't3-p5-15',
            text: 'Please submit your expense reports _____ the end of each month.',
            options: ['A. in', 'B. on', 'C. at', 'D. by'],
            correctAnswer: 3,
            explanation: '"By the end of" = trước cuối tháng.'
          },
          {
            id: 't3-p5-16',
            text: 'The acquisition was valued at approximately $450 million, making it the largest deal in the company\'s _____.',
            options: ['A. history', 'B. historic', 'C. historian', 'D. historically'],
            correctAnswer: 0,
            explanation: '"In the company\'s history" = trong lịch sử công ty.'
          },
          {
            id: 't3-p5-17',
            text: 'The audit revealed several _____ that needed to be addressed immediately.',
            options: ['A. discrepancies', 'B. discrete', 'C. discretion', 'D. discrete'],
            correctAnswer: 0,
            explanation: '"Discrepancies" = sự khác biệt/bất thường.'
          },
          {
            id: 't3-p5-18',
            text: 'We are looking for candidates who are both _____ and team-oriented.',
            options: ['A. self-motivated', 'B. self-motivate', 'C. self-motivating', 'D. self-motivation'],
            correctAnswer: 0,
            explanation: '"Self-motivated" = tự chủ động (tính từ).'
          },
          {
            id: 't3-p5-19',
            text: 'The manager\'s _____ approach to problem-solving has earned her the respect of her peers.',
            options: ['A. methodical', 'B. method', 'C. methodology', 'D. methods'],
            correctAnswer: 0,
            explanation: '"Methodical" = có phương pháp, có hệ thống.'
          },
          {
            id: 't3-p5-20',
            text: 'The results of the feasibility study were _____ with the management team on Friday.',
            options: ['A. shared', 'B. share', 'C. sharing', 'D. shares'],
            correctAnswer: 0,
            explanation: 'Cấu trúc bị động: were + V3 (shared).'
          },
          {
            id: 't3-p5-21',
            text: 'The company plans to _____ its workforce by 15% over the next two years.',
            options: ['A. downsize', 'B. upsize', 'C. resize', 'D. revise'],
            correctAnswer: 0,
            explanation: '"Downsize" = cắt giảm nhân sự.'
          },
          {
            id: 't3-p5-22',
            text: 'The proposal was _____ by the committee after a thorough review.',
            options: ['A. turned down', 'B. turned up', 'C. turned off', 'D. turned out'],
            correctAnswer: 0,
            explanation: '"Turned down" = bị từ chối.'
          },
          {
            id: 't3-p5-23',
            text: 'Our competitive _____ is what sets us apart from other firms in the industry.',
            options: ['A. advantage', 'B. advance', 'C. adventure', 'D. adversary'],
            correctAnswer: 0,
            explanation: '"Competitive advantage" = lợi thế cạnh tranh.'
          },
          {
            id: 't3-p5-24',
            text: 'The firm has implemented a new _____ management system to track employee performance.',
            options: ['A. talent', 'B. talented', 'C. talentless', 'D. talenting'],
            correctAnswer: 0,
            explanation: '"Talent management" = quản lý nhân tài.'
          },
          {
            id: 't3-p5-25',
            text: 'All contractors must _____ to the company\'s code of conduct while on-site.',
            options: ['A. adhere', 'B. adhere to', 'C. adhered', 'D. adhering'],
            correctAnswer: 0,
            explanation: '"Adhere to" = tuân thủ. Câu đã có "to" nên chọn "adhere".'
          },
          {
            id: 't3-p5-26',
            text: 'The firm was recognized for its _____ to corporate social responsibility.',
            options: ['A. commitment', 'B. committed', 'C. committing', 'D. commits'],
            correctAnswer: 0,
            explanation: 'Danh từ "commitment" = cam kết.'
          },
          {
            id: 't3-p5-27',
            text: 'The company\'s stock price surged following the _____ of the quarterly earnings report.',
            options: ['A. release', 'B. released', 'C. releasing', 'D. releases'],
            correctAnswer: 0,
            explanation: 'Danh từ "release" = sự phát hành.'
          },
          {
            id: 't3-p5-28',
            text: 'The new regulations require companies to _____ their carbon emissions by 30% by 2030.',
            options: ['A. reduce', 'B. produce', 'C. deduce', 'D. induce'],
            correctAnswer: 0,
            explanation: '"Reduce" = giảm. "Carbon emissions" cần được giảm.'
          },
          {
            id: 't3-p5-29',
            text: 'The board is expected to _____ the appointment at the next meeting.',
            options: ['A. ratify', 'B. verify', 'C. certify', 'D. justify'],
            correctAnswer: 0,
            explanation: '"Ratify" = phê chuẩn, hợp lý với bối cảnh hội đồng.'
          },
          {
            id: 't3-p5-30',
            text: 'The company has seen a _____ increase in online sales since launching the new website.',
            options: ['A. substantial', 'B. substance', 'C. substantive', 'D. substantially'],
            correctAnswer: 0,
            explanation: 'Tính từ "substantial" = đáng kể,修饰名词 "increase".'
          }
        ]
      },
      {
        id: 't3-sec-6',
        title: 'Part 6: Text Completion',
        description: 'Choose the best word or phrase to complete the text.',
        questions: [
          {
            id: 't3-p6-1',
            passage: 'Dear Valued Investor,\n\nWe are writing to provide you with an update on our company\'s strategic initiatives for the coming fiscal year. Our primary objective is to _____ growth through innovation and strategic partnerships.',
            text: 'Choose the correct word.',
            options: ['A. sustain', 'B. sustainably', 'C. sustained', 'D. sustainability'],
            correctAnswer: 0,
            explanation: 'Động từ nguyên形 sau "is to".'
          },
          {
            id: 't3-p6-2',
            passage: 'Dear Valued Investor,\n\nWe are writing to provide you with an update on our company\'s strategic initiatives for the coming fiscal year. Our primary objective is to sustain growth through innovation and strategic partnerships. To achieve this, we plan to invest $200 million in research and development over the next three years, focusing on artificial intelligence and sustainable energy solutions.',
            text: 'Choose the correct word.',
            options: ['A. invest', 'B. invested', 'C. investing', 'D. investment'],
            correctAnswer: 0,
            explanation: 'Động từ nguyên形 sau "plan to".'
          },
          {
            id: 't3-p6-3',
            passage: 'Dear Valued Investor,\n\nWe are writing to provide you with an update on our company\'s strategic initiatives for the coming fiscal year. Our primary objective is to sustain growth through innovation and strategic partnerships. To achieve this, we plan to invest $200 million in research and development over the next three years, focusing on artificial intelligence and sustainable energy solutions. These investments are expected to drive significant revenue growth and strengthen our _____ in key markets.',
            text: 'Choose the correct word.',
            options: ['A. position', 'B. positioned', 'C. positioning', 'D. positions'],
            correctAnswer: 0,
            explanation: '"Strengthen our position" = củng cố vị thế.'
          },
          {
            id: 't3-p6-4',
            passage: 'Dear Valued Investor,\n\nWe are writing to provide you with an update on our company\'s strategic initiatives for the coming fiscal year. Our primary objective is to sustain growth through innovation and strategic partnerships. To achieve this, we plan to invest $200 million in research and development over the next three years, focusing on artificial intelligence and sustainable energy solutions. These investments are expected to drive significant revenue growth and strengthen our position in key markets. We are confident that these initiatives will deliver long-term value to our shareholders.',
            text: 'Choose the correct word.',
            options: ['A. confident', 'B. confidence', 'C. confidently', 'D. confide'],
            correctAnswer: 0,
            explanation: '"Are confident that" = tin tưởng rằng.'
          },
          {
            id: 't3-p6-5',
            passage: 'EMPLOYEE MEMORANDUM\n\nThe Executive Committee has approved a new remote work policy effective April 1st. Under this policy, eligible employees may work from home up to three days per week, subject to manager _____.',
            text: 'Choose the correct word.',
            options: ['A. approval', 'B. approve', 'C. approved', 'D. approving'],
            correctAnswer: 0,
            explanation: '"Subject to manager approval" = cần sự phê duyệt của quản lý.'
          },
          {
            id: 't3-p6-6',
            passage: 'EMPLOYEE MEMORANDUM\n\nThe Executive Committee has approved a new remote work policy effective April 1st. Under this policy, eligible employees may work from home up to three days per week, subject to manager approval. To qualify, employees must have completed their probationary period and maintained a satisfactory performance rating for at least _____.',
            text: 'Choose the correct word.',
            options: ['A. one year', 'B. six months', 'C. three months', 'D. two years'],
            correctAnswer: 1,
            explanation: 'Yêu cầu duy trì đánh giá hiệu suất satisfactory ít nhất sáu tháng.'
          },
          {
            id: 't3-p6-7',
            passage: 'EMPLOYEE MEMORANDUM\n\nThe Executive Committee has approved a new remote work policy effective April 1st. Under this policy, eligible employees may work from home up to three days per week, subject to manager approval. To qualify, employees must have completed their probationary period and maintained a satisfactory performance rating for at least six months. Employees are expected to remain _____ during core business hours and be available for virtual meetings.',
            text: 'Choose the correct word.',
            options: ['A. responsive', 'B. responded', 'C. responding', 'D. response'],
            correctAnswer: 0,
            explanation: '"Remain responsive" = duy trì khả năng phản hồi.'
          },
          {
            id: 't3-p6-8',
            passage: 'NOTICE TO ALL DEPARTMENTS\n\nAs part of our ongoing efforts to improve operational efficiency, the company will be transitioning to a new enterprise resource planning (ERP) system. The migration is scheduled to begin on May 15th and will be completed in three phases. During the transition, some _____ may experience temporary disruptions.',
            text: 'Choose the correct word.',
            options: ['A. processes', 'B. process', 'C. processed', 'D. processing'],
            correctAnswer: 0,
            explanation: '"Some processes" = một số quy trình.'
          },
          {
            id: 't3-p6-9',
            passage: 'NOTICE TO ALL DEPARTMENTS\n\nAs part of our ongoing efforts to improve operational efficiency, the company will be transitioning to a new enterprise resource planning (ERP) system. The migration is scheduled to begin on May 15th and will be completed in three phases. During the transition, some processes may experience temporary disruptions. Department heads are asked to identify critical tasks and develop contingency plans to minimize any _____ to business operations.',
            text: 'Choose the correct word.',
            options: ['A. impact', 'B. impact on', 'C. impacts', 'D. impacted'],
            correctAnswer: 2,
            explanation: '"Any impacts to" = bất kỳ tác động nào đến.'
          },
          {
            id: 't3-p6-10',
            passage: 'NOTICE TO ALL DEPARTMENTS\n\nAs part of our ongoing efforts to improve operational efficiency, the company will be transitioning to a new enterprise resource planning (ERP) system. The migration is scheduled to begin on May 15th and will be completed in three phases. During the transition, some processes may experience temporary disruptions. Department heads are asked to identify critical tasks and develop contingency plans to minimize any impacts to business operations. Comprehensive training sessions for the new system will be provided by the IT department beginning April 20th. Attendance is _____ for all users.',
            text: 'Choose the correct word.',
            options: ['A. required', 'B. requiring', 'C. requirement', 'D. requires'],
            correctAnswer: 0,
            explanation: '"Attendance is required" = việc tham dự là bắt buộc.'
          },
          {
            id: 't3-p6-11',
            passage: 'NEWSLETTER ARTICLE\n\nOur company\'s annual charity fundraiser was a resounding success, raising over $500,000 for local education programs. The event, held at the Riverside Convention Center, attracted more than 800 attendees and featured live entertainment, a silent auction, and keynote remarks from renowned educator Dr. Michelle Adams.',
            text: 'Choose the correct word.',
            options: ['A. raising', 'B. raised', 'C. raise', 'D. raises'],
            correctAnswer: 0,
            explanation: 'Hiện tại phân từ "raising" bổ nghĩa cho sự kiện.'
          },
          {
            id: 't3-p6-12',
            passage: 'NEWSLETTER ARTICLE\n\nOur company\'s annual charity fundraiser was a resounding success, raising over $500,000 for local education programs. The event, held at the Riverside Convention Center, attracted more than 800 attendees and featured live entertainment, a silent auction, and keynote remarks from renowned educator Dr. Michelle Adams. All proceeds will be _____ to five local schools and two scholarship funds.',
            text: 'Choose the correct word.',
            options: ['A. distributed', 'B. distribute', 'C. distributing', 'D. distribution'],
            correctAnswer: 0,
            explanation: '"Will be distributed" = sẽ được phân phối (bị động).'
          },
          {
            id: 't3-p6-13',
            passage: 'NEWSLETTER ARTICLE\n\nOur company\'s annual charity fundraiser was a resounding success, raising over $500,000 for local education programs. The event, held at the Riverside Convention Center, attracted more than 800 attendees and featured live entertainment, a silent auction, and keynote remarks from renowned educator Dr. Michelle Adams. All proceeds will be distributed to five local schools and two scholarship funds. We are grateful for the _____ support of our employees, partners, and community members.',
            text: 'Choose the correct word.',
            options: ['A. generous', 'B. generosity', 'C. generously', 'D. generate'],
            correctAnswer: 0,
            explanation: 'Tính từ "generous" = hào phóng,修饰 "support".'
          },
          {
            id: 't3-p6-14',
            passage: 'CUSTOMER LETTER\n\nWe regret to inform you that due to unforeseen supply chain disruptions, delivery of your order may be _____ by 5 to 10 business days. We sincerely apologize for the inconvenience and are working diligently to resolve the situation.',
            text: 'Choose the correct word.',
            options: ['A. delayed', 'B. delay', 'C. delaying', 'D. delays'],
            correctAnswer: 0,
            explanation: '"May be delayed" = có thể bị trì hoãn (bị động).'
          },
          {
            id: 't3-p6-15',
            passage: 'CUSTOMER LETTER\n\nWe regret to inform you that due to unforeseen supply chain disruptions, delivery of your order may be delayed by 5 to 10 business days. We sincerely apologize for the inconvenience and are working diligently to resolve the situation. As a gesture of goodwill, we would like to offer you a 10% discount on your next purchase. Please use the promo code BELOW10 at _____ time.',
            text: 'Choose the correct word.',
            options: ['A. any', 'B. every', 'C. each', 'D. some'],
            correctAnswer: 0,
            explanation: '"At any time" = bất cứ lúc nào.'
          },
          {
            id: 't3-p6-16',
            passage: 'CUSTOMER LETTER\n\nWe regret to inform you that due to unforeseen supply chain disruptions, delivery of your order may be delayed by 5 to 10 business days. We sincerely apologize for the inconvenience and are working diligently to resolve the situation. As a gesture of goodwill, we would like to offer you a 10% discount on your next purchase. Please use the promo code BELOW10 at any time. We value your _____ and look forward to continuing to serve you.',
            text: 'Choose the correct word.',
            options: ['A. loyalty', 'B. loyal', 'C. loyally', 'D. loyalist'],
            correctAnswer: 0,
            explanation: '"Your loyalty" = sự trung thành của bạn.'
          }
        ]
      },
      {
        id: 't3-sec-7',
        title: 'Part 7: Reading Comprehension',
        description: 'Read the passage and answer the questions.',
        questions: [
          {
            id: 't3-p7-1',
            passage: 'Pacific Rim Holdings has announced a strategic partnership with European tech firm Nordic Innovations. The collaboration, valued at approximately $780 million, aims to develop next-generation cloud computing solutions for the financial services industry. Under the terms of the agreement, both companies will contribute proprietary technology and share intellectual property rights. The partnership is expected to create approximately 200 new jobs across both companies within the first two years.',
            text: 'What is the total value of the partnership?',
            options: ['A. $280 million', 'B. $580 million', 'C. $780 million', 'D. $980 million'],
            correctAnswer: 2,
            explanation: 'Tổng giá trị partnership là khoảng 780 triệu đô la.'
          },
          {
            id: 't3-p7-2',
            passage: 'Pacific Rim Holdings has announced a strategic partnership with European tech firm Nordic Innovations. The collaboration, valued at approximately $780 million, aims to develop next-generation cloud computing solutions for the financial services industry. Under the terms of the agreement, both companies will contribute proprietary technology and share intellectual property rights. The partnership is expected to create approximately 200 new jobs across both companies within the first two years.',
            text: 'What industry will the solutions target?',
            options: ['A. Healthcare', 'B. Financial services', 'C. Retail', 'D. Manufacturing'],
            correctAnswer: 1,
            explanation: 'Các giải pháp nhắm vào ngành dịch vụ tài chính.'
          },
          {
            id: 't3-p7-3',
            passage: 'Pacific Rim Holdings has announced a strategic partnership with European tech firm Nordic Innovations. The collaboration, valued at approximately $780 million, aims to develop next-generation cloud computing solutions for the financial services industry. Under the terms of the agreement, both companies will contribute proprietary technology and share intellectual property rights. The partnership is expected to create approximately 200 new jobs across both companies within the first two years.',
            text: 'How many new jobs are expected to be created?',
            options: ['A. Approximately 100', 'B. Approximately 150', 'C. Approximately 200', 'D. Approximately 300'],
            correctAnswer: 2,
            explanation: 'Dự kiến tạo ra khoảng 200 việc làm mới.'
          },
          {
            id: 't3-p7-4',
            passage: 'NORTHERN TRUST BANK\nImportant Notice Regarding Account Security\n\nIn our ongoing commitment to protecting your financial information, Northern Trust Bank is implementing enhanced security measures for all online banking accounts, effective immediately.\n\nAll customers will be required to:\n1. Update passwords to meet new complexity requirements (minimum 12 characters, including uppercase, lowercase, numbers, and special characters)\n2. Enable two-factor authentication for all online transactions\n3. Register trusted devices through the mobile app\n\nCustomers who do not comply within 30 days will have their online banking access temporarily suspended until the requirements are met. For assistance, contact our dedicated support line at 1-800-555-0147.',
            text: 'What is the minimum password length required?',
            options: ['A. 8 characters', 'B. 10 characters', 'C. 12 characters', 'D. 16 characters'],
            correctAnswer: 2,
            explanation: 'Độ dài mật khẩu tối thiểu là 12 ký tự.'
          },
          {
            id: 't3-p7-5',
            passage: 'NORTHERN TRUST BANK\nImportant Notice Regarding Account Security\n\nIn our ongoing commitment to protecting your financial information, Northern Trust Bank is implementing enhanced security measures for all online banking accounts, effective immediately.\n\nAll customers will be required to:\n1. Update passwords to meet new complexity requirements (minimum 12 characters, including uppercase, lowercase, numbers, and special characters)\n2. Enable two-factor authentication for all online transactions\n3. Register trusted devices through the mobile app\n\nCustomers who do not comply within 30 days will have their online banking access temporarily suspended until the requirements are met. For assistance, contact our dedicated support line at 1-800-555-0147.',
            text: 'What happens to customers who do not comply within 30 days?',
            options: ['A. Their accounts will be closed', 'B. Their online banking access will be temporarily suspended', 'C. They will be charged a fee', 'D. They will be required to visit a branch'],
            correctAnswer: 1,
            explanation: 'Truy cập ngân hàng trực tuyến sẽ bị tạm đình chỉ.'
          },
          {
            id: 't3-p7-6',
            passage: 'NORTHERN TRUST BANK\nImportant Notice Regarding Account Security\n\nIn our ongoing commitment to protecting your financial information, Northern Trust Bank is implementing enhanced security measures for all online banking accounts, effective immediately.\n\nAll customers will be required to:\n1. Update passwords to meet new complexity requirements (minimum 12 characters, including uppercase, lowercase, numbers, and special characters)\n2. Enable two-factor authentication for all online transactions\n3. Register trusted devices through the mobile app\n\nCustomers who do not comply within 30 days will have their online banking access temporarily suspended until the requirements are met. For assistance, contact our dedicated support line at 1-800-555-0147.',
            text: 'Which of the following is NOT a new requirement?',
            options: ['A. Updated passwords', 'B. Two-factor authentication', 'C. Biometric login', 'D. Device registration'],
            correctAnswer: 2,
            explanation: 'Đăng nhập sinh trắc học không phải yêu cầu mới.'
          },
          {
            id: 't3-p7-7',
            passage: 'MERIDIAN CONSULTING GROUP\nCareer Opportunities\n\nMeridian Consulting Group is expanding its operations and seeking experienced professionals for the following roles:\n\nSenior Management Consultant\nRequirements: MBA or equivalent; 7+ years of consulting experience; strong analytical and leadership skills; willingness to travel up to 50%.\n\nData Analytics Lead\nRequirements: Master\'s degree in data science or related field; 5+ years of experience with Python, SQL, and visualization tools; experience managing a team of analysts.\n\nBusiness Development Manager\nRequirements: Bachelor\'s degree required; 5+ years of B2B sales experience; proven track record of meeting revenue targets; strong networking skills.\n\nCompetitive salary, performance bonuses, and comprehensive benefits package included. Submit applications to careers@meridianconsulting.com.',
            text: 'How many positions are being advertised?',
            options: ['A. Two', 'B. Three', 'C. Four', 'D. Five'],
            correctAnswer: 1,
            explanation: 'Có ba vị trí đang tuyển dụng.'
          },
          {
            id: 't3-p7-8',
            passage: 'MERIDIAN CONSULTING GROUP\nCareer Opportunities\n\nMeridian Consulting Group is expanding its operations and seeking experienced professionals for the following roles:\n\nSenior Management Consultant\nRequirements: MBA or equivalent; 7+ years of consulting experience; strong analytical and leadership skills; willingness to travel up to 50%.\n\nData Analytics Lead\nRequirements: Master\'s degree in data science or related field; 5+ years of experience with Python, SQL, and visualization tools; experience managing a team of analysts.\n\nBusiness Development Manager\nRequirements: Bachelor\'s degree required; 5+ years of B2B sales experience; proven track record of meeting revenue targets; strong networking skills.\n\nCompetitive salary, performance bonuses, and comprehensive benefits package included. Submit applications to careers@meridianconsulting.com.',
            text: 'What is required for the Senior Management Consultant position?',
            options: ['A. A Bachelor\'s degree', 'B. An MBA or equivalent', 'C. A PhD', 'D. No degree required'],
            correctAnswer: 1,
            explanation: 'Vị trí yêu cầu MBA hoặc tương đương.'
          },
          {
            id: 't3-p7-9',
            passage: 'MERIDIAN CONSULTING GROUP\nCareer Opportunities\n\nMeridian Consulting Group is expanding its operations and seeking experienced professionals for the following roles:\n\nSenior Management Consultant\nRequirements: MBA or equivalent; 7+ years of consulting experience; strong analytical and leadership skills; willingness to travel up to 50%.\n\nData Analytics Lead\nRequirements: Master\'s degree in data science or related field; 5+ years of experience with Python, SQL, and visualization tools; experience managing a team of analysts.\n\nBusiness Development Manager\nRequirements: Bachelor\'s degree required; 5+ years of B2B sales experience; proven track record of meeting revenue targets; strong networking skills.\n\nCompetitive salary, performance bonuses, and comprehensive benefits package included. Submit applications to careers@meridianconsulting.com.',
            text: 'How much travel is required for the Senior Management Consultant?',
            options: ['A. Up to 25%', 'B. Up to 50%', 'C. Up to 75%', 'D. No travel required'],
            correctAnswer: 1,
            explanation: 'Yêu cầu đi công tác lên đến 50%.'
          },
          {
            id: 't3-p7-10',
            passage: 'GLOBAL TECH INDUSTRY REPORT\n\nCloud Computing Market to Reach $1.2 Trillion by 2028\n\nThe global cloud computing market is projected to grow from $591 billion in 2023 to $1.2 trillion by 2028, representing a compound annual growth rate (CAGR) of 16.2%. The growth is being driven by increasing digital transformation across industries, the expansion of artificial intelligence applications, and the growing adoption of hybrid cloud strategies.\n\nNorth America currently accounts for 38% of the global market, followed by Europe at 25% and Asia-Pacific at 22%. Enterprise adoption of multi-cloud environments is accelerating, with 76% of organizations now using two or more cloud providers.',
            text: 'What is the projected market size by 2028?',
            options: ['A. $591 billion', 'B. $800 billion', 'C. $1 trillion', 'D. $1.2 trillion'],
            correctAnswer: 3,
            explanation: 'Quy mô thị trường dự kiến đạt 1,2 nghìn tỷ đô la.'
          },
          {
            id: 't3-p7-11',
            passage: 'GLOBAL TECH INDUSTRY REPORT\n\nCloud Computing Market to Reach $1.2 Trillion by 2028\n\nThe global cloud computing market is projected to grow from $591 billion in 2023 to $1.2 trillion by 2028, representing a compound annual growth rate (CAGR) of 16.2%. The growth is being driven by increasing digital transformation across industries, the expansion of artificial intelligence applications, and the growing adoption of hybrid cloud strategies.\n\nNorth America currently accounts for 38% of the global market, followed by Europe at 25% and Asia-Pacific at 22%. Enterprise adoption of multi-cloud environments is accelerating, with 76% of organizations now using two or more cloud providers.',
            text: 'Which region has the largest market share?',
            options: ['A. Europe', 'B. Asia-Pacific', 'C. North America', 'D. Latin America'],
            correctAnswer: 2,
            explanation: 'Bắc Mỹ chiếm thị phần lớn nhất: 38%.'
          },
          {
            id: 't3-p7-12',
            passage: 'GLOBAL TECH INDUSTRY REPORT\n\nCloud Computing Market to Reach $1.2 Trillion by 2028\n\nThe global cloud computing market is projected to grow from $591 billion in 2023 to $1.2 trillion by 2028, representing a compound annual growth rate (CAGR) of 16.2%. The growth is being driven by increasing digital transformation across industries, the expansion of artificial intelligence applications, and the growing adoption of hybrid cloud strategies.\n\nNorth America currently accounts for 38% of the global market, followed by Europe at 25% and Asia-Pacific at 22%. Enterprise adoption of multi-cloud environments is accelerating, with 76% of organizations now using two or more cloud providers.',
            text: 'What percentage of organizations use multiple cloud providers?',
            options: ['A. 56%', 'B. 66%', 'C. 76%', 'D. 86%'],
            correctAnswer: 2,
            explanation: '76% tổ chức sử dụng nhiều hơn một nhà cung cấp đám mây.'
          },
          {
            id: 't3-p7-13',
            passage: 'CITY BUSINESS TRIBUNE\nInnovatech Wins Landmark Patent Case\n\nInnovatech, a leading biotech company, has won a major patent infringement lawsuit against rival BioPharm Solutions. The federal court ruled that BioPharm\'s gene therapy technology infringed on two of Innovatech\'s patented processes. BioPharm has been ordered to pay $340 million in damages and cease the use of the disputed technology.\n\nInnovatech\'s CEO, Dr. Amanda Chen, stated that the ruling "validates years of research and innovation." BioPharm\'s legal team has indicated they plan to appeal the decision.',
            text: 'Who won the lawsuit?',
            options: ['A. BioPharm Solutions', 'B. Innovatech', 'C. Both companies', 'D. The ruling was undecided'],
            correctAnswer: 1,
            explanation: 'Innovatech đã thắng vụ kiện.'
          },
          {
            id: 't3-p7-14',
            passage: 'CITY BUSINESS TRIBUNE\nInnovatech Wins Landmark Patent Case\n\nInnovatech, a leading biotech company, has won a major patent infringement lawsuit against rival BioPharm Solutions. The federal court ruled that BioPharm\'s gene therapy technology infringed on two of Innovatech\'s patented processes. BioPharm has been ordered to pay $340 million in damages and cease the use of the disputed technology.\n\nInnovatech\'s CEO, Dr. Amanda Chen, stated that the ruling "validates years of research and innovation." BioPharm\'s legal team has indicated they plan to appeal the decision.',
            text: 'How much must BioPharm pay in damages?',
            options: ['A. $240 million', 'B. $340 million', 'C. $440 million', 'D. $540 million'],
            correctAnswer: 1,
            explanation: 'BioPharm phải bồi thường 340 triệu đô la.'
          },
          {
            id: 't3-p7-15',
            passage: 'CITY BUSINESS TRIBUNE\nInnovatech Wins Landmark Patent Case\n\nInnovatech, a leading biotech company, has won a major patent infringement lawsuit against rival BioPharm Solutions. The federal court ruled that BioPharm\'s gene therapy technology infringed on two of Innovatech\'s patented processes. BioPharm has been ordered to pay $340 million in damages and cease the use of the disputed technology.\n\nInnovatech\'s CEO, Dr. Amanda Chen, stated that the ruling "validates years of research and innovation." BioPharm\'s legal team has indicated they plan to appeal the decision.',
            text: 'What does BioPharm plan to do?',
            options: ['A. Accept the ruling', 'B. Appeal the decision', 'C. Settle out of court', 'D. File for bankruptcy'],
            correctAnswer: 1,
            explanation: 'BioPharm có kế hoạch kháng cáo quyết định.'
          },
          {
            id: 't3-p7-16',
            passage: 'INTERNATIONAL TRADE PUBLICATION\n\nEU Implements New Carbon Border Tax\n\nThe European Union has officially implemented its Carbon Border Adjustment Mechanism (CBAM), imposing a levy on carbon-intensive imports from countries with less stringent climate policies. The tax applies to imports of steel, aluminum, cement, fertilizers, and electricity.\n\nUnder the new framework, importers must purchase carbon certificates corresponding to the carbon price that would have been paid under the EU\'s emissions trading system. The phased implementation began in October 2023 with reporting requirements, with full financial charges starting in 2026.',
            text: 'What is the CBAM?',
            options: ['A. A trade agreement', 'B. A carbon border tax', 'C. An environmental subsidy', 'D. A certification program'],
            correctAnswer: 1,
            explanation: 'CBAM là thuế biên giới carbon.'
          },
          {
            id: 't3-p7-17',
            passage: 'INTERNATIONAL TRADE PUBLICATION\n\nEU Implements New Carbon Border Tax\n\nThe European Union has officially implemented its Carbon Border Adjustment Mechanism (CBAM), imposing a levy on carbon-intensive imports from countries with less stringent climate policies. The tax applies to imports of steel, aluminum, cement, fertilizers, and electricity.\n\nUnder the new framework, importers must purchase carbon certificates corresponding to the carbon price that would have been paid under the EU\'s emissions trading system. The phased implementation began in October 2023 with reporting requirements, with full financial charges starting in 2026.',
            text: 'Which products are affected by the CBAM?',
            options: ['A. Electronics and textiles', 'B. Steel, aluminum, cement, fertilizers, and electricity', 'C. Agricultural products and food', 'D. Vehicles and machinery'],
            correctAnswer: 1,
            explanation: 'Các sản phẩm bị ảnh hưởng gồm thép, nhôm, xi măng, phân bón và điện.'
          },
          {
            id: 't3-p7-18',
            passage: 'INTERNATIONAL TRADE PUBLICATION\n\nEU Implements New Carbon Border Tax\n\nThe European Union has officially implemented its Carbon Border Adjustment Mechanism (CBAM), imposing a levy on carbon-intensive imports from countries with less stringent climate policies. The tax applies to imports of steel, aluminum, cement, fertilizers, and electricity.\n\nUnder the new framework, importers must purchase carbon certificates corresponding to the carbon price that would have been paid under the EU\'s emissions trading system. The phased implementation began in October 2023 with reporting requirements, with full financial charges starting in 2026.',
            text: 'When do full financial charges begin?',
            options: ['A. October 2023', 'B. January 2024', 'C. 2025', 'D. 2026'],
            correctAnswer: 3,
            explanation: 'Phí tài chính đầy đủ bắt đầu từ năm 2026.'
          },
          {
            id: 't3-p7-19',
            passage: 'BRIDGEPORT MANUFACTURING\nAnnual Quality Report Summary\n\nBridgeport Manufacturing achieved a 99.7% product defect rate reduction over the past year through the implementation of Six Sigma methodology and advanced quality control systems. Key metrics include:\n\n• Customer complaints reduced by 45%\n• Product returns decreased by 38%\n• Production yield improved to 98.2%\n• Average time to resolution: 4.2 hours\n• Employee quality training hours: 12,000+ annually\n\nThe company attributes its success to investment in employee training, automation of inspection processes, and a commitment to continuous improvement.',
            text: 'What was the defect rate reduction?',
            options: ['A. 38%', 'B. 45%', 'C. 98.2%', 'D. 99.7%'],
            correctAnswer: 3,
            explanation: 'Tỷ lệ lỗi sản phẩm giảm 99,7%.'
          },
          {
            id: 't3-p7-20',
            passage: 'BRIDGEPORT MANUFACTURING\nAnnual Quality Report Summary\n\nBridgeport Manufacturing achieved a 99.7% product defect rate reduction over the past year through the implementation of Six Sigma methodology and advanced quality control systems. Key metrics include:\n\n• Customer complaints reduced by 45%\n• Product returns decreased by 38%\n• Production yield improved to 98.2%\n• Average time to resolution: 4.2 hours\n• Employee quality training hours: 12,000+ annually\n\nThe company attributes its success to investment in employee training, automation of inspection processes, and a commitment to continuous improvement.',
            text: 'What methodology was implemented?',
            options: ['A. Lean manufacturing', 'B. Total Quality Management', 'C. Six Sigma', 'D. Kaizen'],
            correctAnswer: 2,
            explanation: 'Phương pháp Six Sigma đã được triển khai.'
          },
          {
            id: 't3-p7-21',
            passage: 'BRIDGEPORT MANUFACTURING\nAnnual Quality Report Summary\n\nBridgeport Manufacturing achieved a 99.7% product defect rate reduction over the past year through the implementation of Six Sigma methodology and advanced quality control systems. Key metrics include:\n\n• Customer complaints reduced by 45%\n• Product returns decreased by 38%\n• Production yield improved to 98.2%\n• Average time to resolution: 4.2 hours\n• Employee quality training hours: 12,000+ annually\n\nThe company attributes its success to investment in employee training, automation of inspection processes, and a commitment to continuous improvement.',
            text: 'How many training hours were logged annually?',
            options: ['A. 5,000+', 'B. 8,000+', 'C. 10,000+', 'D. 12,000+'],
            correctAnswer: 3,
            explanation: 'Hơn 12.000 giờ đào tạo mỗi năm.'
          },
          {
            id: 't3-p7-22',
            passage: 'METROPOLITAN BUSINESS JOURNAL\nReal Estate Market Update\n\nCommercial real estate in the metropolitan area has shown resilience despite economic headwinds. Office vacancy rates declined to 12.3% in Q3, down from 14.8% a year ago. The strongest demand came from technology and healthcare companies seeking modern, flexible workspaces.\n\nRent prices remained stable, averaging $38.50 per square foot for Class A office space. The industrial sector continued to outperform, with warehouse vacancy rates at a historic low of 3.2%. Analysts predict continued strength in logistics and data center demand.',
            text: 'What is the current office vacancy rate?',
            options: ['A. 3.2%', 'B. 12.3%', 'C. 14.8%', 'D. 38.5%'],
            correctAnswer: 1,
            explanation: 'Tỷ lệ văn phòng trống hiện tại là 12,3%.'
          },
          {
            id: 't3-p7-23',
            passage: 'METROPOLITAN BUSINESS JOURNAL\nReal Estate Market Update\n\nCommercial real estate in the metropolitan area has shown resilience despite economic headwinds. Office vacancy rates declined to 12.3% in Q3, down from 14.8% a year ago. The strongest demand came from technology and healthcare companies seeking modern, flexible workspaces.\n\nRent prices remained stable, averaging $38.50 per square foot for Class A office space. The industrial sector continued to outperform, with warehouse vacancy rates at a historic low of 3.2%. Analysts predict continued strength in logistics and data center demand.',
            text: 'Which sectors are driving demand?',
            options: ['A. Finance and retail', 'B. Technology and healthcare', 'C. Manufacturing and agriculture', 'D. Education and government'],
            correctAnswer: 1,
            explanation: 'Công nghệ và chăm sóc sức khỏe đang thúc đẩy nhu cầu.'
          },
          {
            id: 't3-p7-24',
            passage: 'METROPOLITAN BUSINESS JOURNAL\nReal Estate Market Update\n\nCommercial real estate in the metropolitan area has shown resilience despite economic headwinds. Office vacancy rates declined to 12.3% in Q3, down from 14.8% a year ago. The strongest demand came from technology and healthcare companies seeking modern, flexible workspaces.\n\nRent prices remained stable, averaging $38.50 per square foot for Class A office space. The industrial sector continued to outperform, with warehouse vacancy rates at a historic low of 3.2%. Analysts predict continued strength in logistics and data center demand.',
            text: 'What is the warehouse vacancy rate?',
            options: ['A. 3.2%', 'B. 12.3%', 'C. 14.8%', 'D. 38.5%'],
            correctAnswer: 0,
            explanation: 'Tỷ lệ kho trống là 3,2% - mức thấp lịch sử.'
          },
          {
            id: 't3-p7-25',
            passage: 'WORLDWIDE INSURANCE REVIEW\nCyber Insurance Premiums Set to Double\n\nThe global cyber insurance market is expected to see premiums double by 2027, driven by the increasing frequency and severity of cyberattacks. According to industry estimates, cybercrime damages will exceed $10.5 trillion annually by 2025.\n\nCompanies with robust cybersecurity frameworks — including multi-factor authentication, endpoint detection, and incident response plans — may qualify for premium reductions of up to 15%. Insurers are increasingly requiring risk assessments before issuing policies.',
            text: 'By how much are cyber insurance premiums expected to increase?',
            options: ['A. 50%', 'B. 75%', 'C. Double', 'D. Triple'],
            correctAnswer: 2,
            explanation: 'Phí bảo hiểm mạng dự kiến tăng gấp đôi.'
          },
          {
            id: 't3-p7-26',
            passage: 'WORLDWIDE INSURANCE REVIEW\nCyber Insurance Premiums Set to Double\n\nThe global cyber insurance market is expected to see premiums double by 2027, driven by the increasing frequency and severity of cyberattacks. According to industry estimates, cybercrime damages will exceed $10.5 trillion annually by 2025.\n\nCompanies with robust cybersecurity frameworks — including multi-factor authentication, endpoint detection, and incident response plans — may qualify for premium reductions of up to 15%. Insurers are increasingly requiring risk assessments before issuing policies.',
            text: 'How much could companies save on premiums with strong security?',
            options: ['A. Up to 5%', 'B. Up to 10%', 'C. Up to 15%', 'D. Up to 20%'],
            correctAnswer: 2,
            explanation: 'Công ty có thể tiết kiệm đến 15% phí bảo hiểm.'
          },
          {
            id: 't3-p7-27',
            passage: 'WORLDWIDE INSURANCE REVIEW\nCyber Insurance Premiums Set to Double\n\nThe global cyber insurance market is expected to see premiums double by 2027, driven by the increasing frequency and severity of cyberattacks. According to industry estimates, cybercrime damages will exceed $10.5 trillion annually by 2025.\n\nCompanies with robust cybersecurity frameworks — including multi-factor authentication, endpoint detection, and incident response plans — may qualify for premium reductions of up to 15%. Insurers are increasingly requiring risk assessments before issuing policies.',
            text: 'What are insurers increasingly requiring?',
            options: ['A. Annual audits', 'B. Risk assessments', 'C. Employee background checks', 'D. Board-level approval'],
            correctAnswer: 1,
            explanation: 'Công ty bảo hiểm ngày càng yêu cầu đánh giá rủi ro.'
          },
          {
            id: 't3-p7-28',
            passage: 'SILICON VALLEY BUSINESS TIMES\nVenture Capital Funding Rebounds\n\nAfter a challenging 2023, venture capital funding in the technology sector rebounded strongly in Q1 2024, with total investments reaching $48.2 billion — a 35% increase from the previous quarter. AI startups attracted the largest share, accounting for 42% of total funding.\n\nNotable deals include a $2.1 billion Series D round for autonomous vehicle company AutoDrive and a $800 million Series C for AI-powered drug discovery platform BioGenix. Early-stage funding also showed improvement, with seed and Series A rounds increasing by 28%.',
            text: 'How much VC funding was invested in Q1 2024?',
            options: ['A. $35.7 billion', 'B. $48.2 billion', 'C. $52.5 billion', 'D. $65.8 billion'],
            correctAnswer: 1,
            explanation: 'Tổng đầu tư VC Q1 2024 là 48,2 tỷ đô la.'
          },
          {
            id: 't3-p7-29',
            passage: 'SILICON VALLEY BUSINESS TIMES\nVenture Capital Funding Rebounds\n\nAfter a challenging 2023, venture capital funding in the technology sector rebounded strongly in Q1 2024, with total investments reaching $48.2 billion — a 35% increase from the previous quarter. AI startups attracted the largest share, accounting for 42% of total funding.\n\nNotable deals include a $2.1 billion Series D round for autonomous vehicle company AutoDrive and a $800 million Series C for AI-powered drug discovery platform BioGenix. Early-stage funding also showed improvement, with seed and Series A rounds increasing by 28%.',
            text: 'What percentage of funding went to AI startups?',
            options: ['A. 28%', 'B. 35%', 'C. 42%', 'D. 50%'],
            correctAnswer: 2,
            explanation: 'AI startup chiếm 42% tổng vốn đầu tư.'
          },
          {
            id: 't3-p7-30',
            passage: 'SILICON VALLEY BUSINESS TIMES\nVenture Capital Funding Rebounds\n\nAfter a challenging 2023, venture capital funding in the technology sector rebounded strongly in Q1 2024, with total investments reaching $48.2 billion — a 35% increase from the previous quarter. AI startups attracted the largest share, accounting for 42% of total funding.\n\nNotable deals include a $2.1 billion Series D round for autonomous vehicle company AutoDrive and a $800 million Series C for AI-powered drug discovery platform BioGenix. Early-stage funding also showed improvement, with seed and Series A rounds increasing by 28%.',
            text: 'How much did AutoDrive raise?',
            options: ['A. $800 million', 'B. $1.2 billion', 'C. $2.1 billion', 'D. $3.5 billion'],
            correctAnswer: 2,
            explanation: 'AutoDrive huy động được 2,1 tỷ đô la.'
          },
          {
            id: 't3-p7-31',
            passage: 'PUBLIC WORKS DEPARTMENT\nRoad Improvement Project Update\n\nPhase 2 of the Downtown Road Improvement Project is now 60% complete. The project, which includes resurfacing Main Street from 1st to 12th Avenue, adding protected bike lanes, and upgrading traffic signals, is on track for completion by September 2024.\n\nResidents should be aware of the following traffic changes:\n• Main Street between 5th and 8th Avenue will be reduced to one lane in each direction starting Monday\n• Temporary signal lights have been installed at the intersection of Main and 6th\n• Night work will be conducted between 10 PM and 5 AM on weekdays\n\nThe total project cost is $18.5 million, funded through a combination of federal infrastructure grants and local bonds.',
            text: 'What phase is the project currently in?',
            options: ['A. Phase 1', 'B. Phase 2', 'C. Phase 3', 'D. Phase 4'],
            correctAnswer: 1,
            explanation: 'Dự án đang trong Giai đoạn 2.'
          },
          {
            id: 't3-p7-32',
            passage: 'PUBLIC WORKS DEPARTMENT\nRoad Improvement Project Update\n\nPhase 2 of the Downtown Road Improvement Project is now 60% complete. The project, which includes resurfacing Main Street from 1st to 12th Avenue, adding protected bike lanes, and upgrading traffic signals, is on track for completion by September 2024.\n\nResidents should be aware of the following traffic changes:\n• Main Street between 5th and 8th Avenue will be reduced to one lane in each direction starting Monday\n• Temporary signal lights have been installed at the intersection of Main and 6th\n• Night work will be conducted between 10 PM and 5 AM on weekdays\n\nThe total project cost is $18.5 million, funded through a combination of federal infrastructure grants and local bonds.',
            text: 'When is the project expected to be completed?',
            options: ['A. June 2024', 'B. July 2024', 'C. September 2024', 'D. December 2024'],
            correctAnswer: 2,
            explanation: 'Dự án dự kiến hoàn thành tháng 9 năm 2024.'
          },
          {
            id: 't3-p7-33',
            passage: 'PUBLIC WORKS DEPARTMENT\nRoad Improvement Project Update\n\nPhase 2 of the Downtown Road Improvement Project is now 60% complete. The project, which includes resurfacing Main Street from 1st to 12th Avenue, adding protected bike lanes, and upgrading traffic signals, is on track for completion by September 2024.\n\nResidents should be aware of the following traffic changes:\n• Main Street between 5th and 8th Avenue will be reduced to one lane in each direction starting Monday\n• Temporary signal lights have been installed at the intersection of Main and 6th\n• Night work will be conducted between 10 PM and 5 AM on weekdays\n\nThe total project cost is $18.5 million, funded through a combination of federal infrastructure grants and local bonds.',
            text: 'What is the total cost of the project?',
            options: ['A. $8.5 million', 'B. $12.5 million', 'C. $18.5 million', 'D. $25 million'],
            correctAnswer: 2,
            explanation: 'Tổng chi phí dự án là 18,5 triệu đô la.'
          },
          {
            id: 't3-p7-34',
            passage: 'PREMIUM RETAIL GROUP\nQuarterly Earnings Summary\n\nPremium Retail Group reported record Q3 earnings, with revenue of $8.3 billion — up 14% year-over-year. Same-store sales grew by 9.2%, driven by strong performance in the luxury apparel and home goods categories.\n\nKey highlights:\n• E-commerce sales grew 28%, representing 32% of total revenue\n• Customer acquisition cost decreased by 12%\n• Customer retention rate improved to 78%\n• Opened 15 new stores in emerging markets\n\nCEO Robert Harrison attributed the growth to "our omnichannel strategy and focus on premium customer experiences."',
            text: 'What was the total revenue for Q3?',
            options: ['A. $5.3 billion', 'B. $6.8 billion', 'C. $8.3 billion', 'D. $9.7 billion'],
            correctAnswer: 2,
            explanation: 'Tổng doanh thu Q3 là 8,3 tỷ đô la.'
          },
          {
            id: 't3-p7-35',
            passage: 'PREMIUM RETAIL GROUP\nQuarterly Earnings Summary\n\nPremium Retail Group reported record Q3 earnings, with revenue of $8.3 billion — up 14% year-over-year. Same-store sales grew by 9.2%, driven by strong performance in the luxury apparel and home goods categories.\n\nKey highlights:\n• E-commerce sales grew 28%, representing 32% of total revenue\n• Customer acquisition cost decreased by 12%\n• Customer retention rate improved to 78%\n• Opened 15 new stores in emerging markets\n\nCEO Robert Harrison attributed the growth to "our omnichannel strategy and focus on premium customer experiences."',
            text: 'How many new stores were opened?',
            options: ['A. 5', 'B. 10', 'C. 15', 'D. 20'],
            correctAnswer: 2,
            explanation: 'Đã mở 15 cửa hàng mới.'
          },
          {
            id: 't3-p7-36',
            passage: 'PREMIUM RETAIL GROUP\nQuarterly Earnings Summary\n\nPremium Retail Group reported record Q3 earnings, with revenue of $8.3 billion — up 14% year-over-year. Same-store sales grew by 9.2%, driven by strong performance in the luxury apparel and home goods categories.\n\nKey highlights:\n• E-commerce sales grew 28%, representing 32% of total revenue\n• Customer acquisition cost decreased by 12%\n• Customer retention rate improved to 78%\n• Opened 15 new stores in emerging markets\n\nCEO Robert Harrison attributed the growth to "our omnichannel strategy and focus on premium customer experiences."',
            text: 'What percentage of revenue came from e-commerce?',
            options: ['A. 14%', 'B. 28%', 'C. 32%', 'D. 42%'],
            correctAnswer: 2,
            explanation: 'Thương mại điện tử chiếm 32% tổng doanh thu.'
          },
          {
            id: 't3-p7-37',
            passage: 'HEALTH & WELLNESS NEWS\nCorporate Wellness Programs Show ROI\n\nA comprehensive study by the Health Economics Institute found that companies with employee wellness programs see an average return on investment of $3.27 for every $1 spent. The study, which analyzed data from 450 companies over five years, found that wellness programs led to:\n\n• 25% reduction in sick days\n• 32% decrease in workers\' compensation claims\n• 18% improvement in employee satisfaction scores\n• 15% reduction in healthcare costs\n\nThe most effective programs included mental health support, fitness incentives, and nutritional counseling.',
            text: 'What is the average ROI for wellness programs?',
            options: ['A. $1.50 per $1', 'B. $2.27 per $1', 'C. $3.27 per $1', 'D. $4.27 per $1'],
            correctAnswer: 2,
            explanation: 'ROI trung bình là 3,27 đô la cho mỗi 1 đô la đầu tư.'
          },
          {
            id: 't3-p7-38',
            passage: 'HEALTH & WELLNESS NEWS\nCorporate Wellness Programs Show ROI\n\nA comprehensive study by the Health Economics Institute found that companies with employee wellness programs see an average return on investment of $3.27 for every $1 spent. The study, which analyzed data from 450 companies over five years, found that wellness programs led to:\n\n• 25% reduction in sick days\n• 32% decrease in workers\' compensation claims\n• 18% improvement in employee satisfaction scores\n• 15% reduction in healthcare costs\n\nThe most effective programs included mental health support, fitness incentives, and nutritional counseling.',
            text: 'By how much did healthcare costs decrease?',
            options: ['A. 10%', 'B. 15%', 'C. 18%', 'D. 25%'],
            correctAnswer: 1,
            explanation: 'Chi phí chăm sóc sức khỏe giảm 15%.'
          },
          {
            id: 't3-p7-39',
            passage: 'HEALTH & WELLNESS NEWS\nCorporate Wellness Programs Show ROI\n\nA comprehensive study by the Health Economics Institute found that companies with employee wellness programs see an average return on investment of $3.27 for every $1 spent. The study, which analyzed data from 450 companies over five years, found that wellness programs led to:\n\n• 25% reduction in sick days\n• 32% decrease in workers\' compensation claims\n• 18% improvement in employee satisfaction scores\n• 15% reduction in healthcare costs\n\nThe most effective programs included mental health support, fitness incentives, and nutritional counseling.',
            text: 'Which type of program was NOT mentioned as most effective?',
            options: ['A. Mental health support', 'B. Fitness incentives', 'C. On-site childcare', 'D. Nutritional counseling'],
            correctAnswer: 2,
            explanation: 'Chăm sóc trẻ em tại chỗ không được đề cập.'
          },
          {
            id: 't3-p7-40',
            passage: 'URGENT: SECURITY ADVISORY\n\nTo: All Employees\nFrom: Chief Information Security Officer\n\nA sophisticated phishing campaign targeting our industry has been detected. Several companies have already reported compromised email accounts. Please be vigilant for emails that:\n\n• Request immediate action or threaten account suspension\n• Contain suspicious links or attachments\n• Come from addresses that closely resemble known contacts but with subtle differences\n\nIf you receive a suspicious email, do not click any links or download attachments. Report it immediately to security@ourcompany.com or by calling the IT security hotline at ext. 5555.\n\nAll employees are required to complete the updated phishing awareness training module by Friday.',
            text: 'What is the main threat described?',
            options: ['A. A ransomware attack', 'B. A phishing campaign', 'C. A data center outage', 'D. An insider threat'],
            correctAnswer: 1,
            explanation: 'Mối đe dọa chính là chiến dịch lừa đảo trực tuyến.'
          },
          {
            id: 't3-p7-41',
            passage: 'URGENT: SECURITY ADVISORY\n\nTo: All Employees\nFrom: Chief Information Security Officer\n\nA sophisticated phishing campaign targeting our industry has been detected. Several companies have already reported compromised email accounts. Please be vigilant for emails that:\n\n• Request immediate action or threaten account suspension\n• Contain suspicious links or attachments\n• Come from addresses that closely resemble known contacts but with subtle differences\n\nIf you receive a suspicious email, do not click any links or download attachments. Report it immediately to security@ourcompany.com or by calling the IT security hotline at ext. 5555.\n\nAll employees are required to complete the updated phishing awareness training module by Friday.',
            text: 'What should you do if you receive a suspicious email?',
            options: ['A. Forward it to your manager', 'B. Delete it immediately', 'C. Report it to security', 'D. Reply to the sender'],
            correctAnswer: 2,
            explanation: 'Báo cáo cho bộ phận an ninh.'
          },
          {
            id: 't3-p7-42',
            passage: 'URGENT: SECURITY ADVISORY\n\nTo: All Employees\nFrom: Chief Information Security Officer\n\nA sophisticated phishing campaign targeting our industry has been detected. Several companies have already reported compromised email accounts. Please be vigilant for emails that:\n\n• Request immediate action or threaten account suspension\n• Contain suspicious links or attachments\n• Come from addresses that closely resemble known contacts but with subtle differences\n\nIf you receive a suspicious email, do not click any links or download attachments. Report it immediately to security@ourcompany.com or by calling the IT security hotline at ext. 5555.\n\nAll employees are required to complete the updated phishing awareness training module by Friday.',
            text: 'By when must the training module be completed?',
            options: ['A. Today', 'B. By the end of the week', 'C. By the end of the month', 'D. Within 30 days'],
            correctAnswer: 1,
            explanation: 'Module đào tạo phải hoàn thành vào cuối tuần (thứ Sáu).'
          },
          {
            id: 't3-p7-43',
            passage: 'HARBOUR VIEW HOTEL\nGuest Satisfaction Survey Results\n\nOur most recent guest satisfaction survey received over 2,400 responses, with an overall satisfaction score of 4.6 out of 5. Key findings:\n\n• Room cleanliness: 4.8/5\n• Staff friendliness: 4.7/5\n• Check-in/check-out efficiency: 4.3/5\n• Dining quality: 4.5/5\n• Value for money: 4.1/5\n\nThe most common suggestions for improvement were faster Wi-Fi speeds, more variety in the breakfast menu, and extended checkout times. Management has already begun implementing these changes.',
            text: 'How many survey responses were received?',
            options: ['A. Over 1,000', 'B. Over 1,500', 'C. Over 2,000', 'D. Over 2,400'],
            correctAnswer: 3,
            explanation: 'Hơn 2.400 phản hồi khảo sát đã được nhận.'
          },
          {
            id: 't3-p7-44',
            passage: 'HARBOUR VIEW HOTEL\nGuest Satisfaction Survey Results\n\nOur most recent guest satisfaction survey received over 2,400 responses, with an overall satisfaction score of 4.6 out of 5. Key findings:\n\n• Room cleanliness: 4.8/5\n• Staff friendliness: 4.7/5\n• Check-in/check-out efficiency: 4.3/5\n• Dining quality: 4.5/5\n• Value for money: 4.1/5\n\nThe most common suggestions for improvement were faster Wi-Fi speeds, more variety in the breakfast menu, and extended checkout times. Management has already begun implementing these changes.',
            text: 'Which category scored the highest?',
            options: ['A. Staff friendliness', 'B. Room cleanliness', 'C. Dining quality', 'D. Value for money'],
            correctAnswer: 1,
            explanation: 'Vệ sinh phòng đạt điểm cao nhất: 4,8/5.'
          },
          {
            id: 't3-p7-45',
            passage: 'HARBOUR VIEW HOTEL\nGuest Satisfaction Survey Results\n\nOur most recent guest satisfaction survey received over 2,400 responses, with an overall satisfaction score of 4.6 out of 5. Key findings:\n\n• Room cleanliness: 4.8/5\n• Staff friendliness: 4.7/5\n• Check-in/check-out efficiency: 4.3/5\n• Dining quality: 4.5/5\n• Value for money: 4.1/5\n\nThe most common suggestions for improvement were faster Wi-Fi speeds, more variety in the breakfast menu, and extended checkout times. Management has already begun implementing these changes.',
            text: 'What was the lowest-scoring category?',
            options: ['A. Dining quality', 'B. Check-in/check-out efficiency', 'C. Value for money', 'D. Staff friendliness'],
            correctAnswer: 2,
            explanation: 'Giá trị đồng tiền đạt điểm thấp nhất: 4,1/5.'
          },
          {
            id: 't3-p7-46',
            passage: 'TECH INNOVATION DAILY\nStartup Funding Trends: AI Dominates\n\nArtificial intelligence startups dominated the venture capital landscape in 2024, attracting $67.3 billion in total funding — a 78% increase from 2023. The surge was fueled by breakthroughs in generative AI, large language models, and AI-powered automation tools.\n\nThe top five funded AI subsectors were:\n1. Enterprise AI tools: $18.2B\n2. Healthcare AI: $14.7B\n3. Autonomous systems: $12.1B\n4. AI security: $8.9B\n5. AI-powered content creation: $7.4B\n\nIndustry experts note that while funding is abundant, investor expectations for revenue generation and path to profitability have become more stringent.',
            text: 'How much did AI startups raise in total?',
            options: ['A. $35.6 billion', 'B. $52.1 billion', 'C. $67.3 billion', 'D. $82.5 billion'],
            correctAnswer: 2,
            explanation: 'AI startup huy động tổng cộng 67,3 tỷ đô la.'
          },
          {
            id: 't3-p7-47',
            passage: 'TECH INNOVATION DAILY\nStartup Funding Trends: AI Dominates\n\nArtificial intelligence startups dominated the venture capital landscape in 2024, attracting $67.3 billion in total funding — a 78% increase from 2023. The surge was fueled by breakthroughs in generative AI, large language models, and AI-powered automation tools.\n\nThe top five funded AI subsectors were:\n1. Enterprise AI tools: $18.2B\n2. Healthcare AI: $14.7B\n3. Autonomous systems: $12.1B\n4. AI security: $8.9B\n5. AI-powered content creation: $7.4B\n\nIndustry experts note that while funding is abundant, investor expectations for revenue generation and path to profitability have become more stringent.',
            text: 'Which AI subsector received the most funding?',
            options: ['A. Healthcare AI', 'B. Enterprise AI tools', 'C. Autonomous systems', 'D. AI security'],
            correctAnswer: 1,
            explanation: 'Công cụ AI doanh nghiệp nhận nhiều vốn nhất: 18,2 tỷ.'
          },
          {
            id: 't3-p7-48',
            passage: 'TECH INNOVATION DAILY\nStartup Funding Trends: AI Dominates\n\nArtificial intelligence startups dominated the venture capital landscape in 2024, attracting $67.3 billion in total funding — a 78% increase from 2023. The surge was fueled by breakthroughs in generative AI, large language models, and AI-powered automation tools.\n\nThe top five funded AI subsectors were:\n1. Enterprise AI tools: $18.2B\n2. Healthcare AI: $14.7B\n3. Autonomous systems: $12.1B\n4. AI security: $8.9B\n5. AI-powered content creation: $7.4B\n\nIndustry experts note that while funding is abundant, investor expectations for revenue generation and path to profitability have become more stringent.',
            text: 'What have investor expectations become?',
            options: ['A. More relaxed', 'B. More stringent', 'C. Less focused on revenue', 'D. More diverse'],
            correctAnswer: 1,
            explanation: 'Kỳ vọng của nhà đầu tư đã trở nên khắt khe hơn.'
          },
          {
            id: 't3-p7-49',
            passage: 'CHAMBER OF COMMERCE\nAnnual Economic Outlook Report\n\nThe local Chamber of Commerce released its 2024 Economic Outlook Report, projecting 3.8% GDP growth for the region. Key economic indicators include:\n\n• Unemployment rate: 4.1% (down from 4.8% in 2023)\n• New business registrations: Up 22% year-over-year\n• Average household income: $72,500 (up 4.3%)\n• Consumer confidence index: 112 (up from 98)\n\nThe report highlights technology, healthcare, and renewable energy as the fastest-growing sectors, while traditional retail and hospitality continue to face challenges from shifting consumer behavior.',
            text: 'What is the projected GDP growth?',
            options: ['A. 2.5%', 'B. 3.2%', 'C. 3.8%', 'D. 4.5%'],
            correctAnswer: 2,
            explanation: 'Tăng trưởng GDP dự kiến là 3,8%.'
          },
          {
            id: 't3-p7-50',
            passage: 'CHAMBER OF COMMERCE\nAnnual Economic Outlook Report\n\nThe local Chamber of Commerce released its 2024 Economic Outlook Report, projecting 3.8% GDP growth for the region. Key economic indicators include:\n\n• Unemployment rate: 4.1% (down from 4.8% in 2023)\n• New business registrations: Up 22% year-over-year\n• Average household income: $72,500 (up 4.3%)\n• Consumer confidence index: 112 (up from 98)\n\nThe report highlights technology, healthcare, and renewable energy as the fastest-growing sectors, while traditional retail and hospitality continue to face challenges from shifting consumer behavior.',
            text: 'How much did new business registrations increase?',
            options: ['A. 12%', 'B. 18%', 'C. 22%', 'D. 28%'],
            correctAnswer: 2,
            explanation: 'Đăng ký doanh nghiệp mới tăng 22%.'
          },
          {
            id: 't3-p7-51',
            passage: 'CHAMBER OF COMMERCE\nAnnual Economic Outlook Report\n\nThe local Chamber of Commerce released its 2024 Economic Outlook Report, projecting 3.8% GDP growth for the region. Key economic indicators include:\n\n• Unemployment rate: 4.1% (down from 4.8% in 2023)\n• New business registrations: Up 22% year-over-year\n• Average household income: $72,500 (up 4.3%)\n• Consumer confidence index: 112 (up from 98)\n\nThe report highlights technology, healthcare, and renewable energy as the fastest-growing sectors, while traditional retail and hospitality continue to face challenges from shifting consumer behavior.',
            text: 'Which sectors are growing the fastest?',
            options: ['A. Retail and hospitality', 'B. Manufacturing and agriculture', 'C. Technology, healthcare, and renewable energy', 'D. Finance and real estate'],
            correctAnswer: 2,
            explanation: 'Công nghệ, chăm sóc sức khỏe và năng lượng tái tạo tăng trưởng nhanh nhất.'
          },
          {
            id: 't3-p7-52',
            passage: 'SUPPLY CHAIN WEEKLY\nLogistics Costs Expected to Stabilize\n\nAfter two years of significant volatility, global logistics costs are expected to stabilize in 2024, with ocean freight rates declining 28% from their 2022 peaks. However, air freight rates remain elevated due to limited cargo capacity.\n\nKey trends affecting supply chains:\n• Near-shoring is accelerating, with 43% of companies diversifying manufacturing away from single-country dependence\n• Automation in warehouses is increasing productivity by 35%\n• Last-mile delivery costs have risen 18% due to labor shortages\n• Sustainable packaging adoption has grown 42% year-over-year',
            text: 'By how much have ocean freight rates declined?',
            options: ['A. 18%', 'B. 28%', 'C. 35%', 'D. 42%'],
            correctAnswer: 1,
            explanation: 'Cước vận tải biển giảm 28%.'
          },
          {
            id: 't3-p7-53',
            passage: 'SUPPLY CHAIN WEEKLY\nLogistics Costs Expected to Stabilize\n\nAfter two years of significant volatility, global logistics costs are expected to stabilize in 2024, with ocean freight rates declining 28% from their 2022 peaks. However, air freight rates remain elevated due to limited cargo capacity.\n\nKey trends affecting supply chains:\n• Near-shoring is accelerating, with 43% of companies diversifying manufacturing away from single-country dependence\n• Automation in warehouses is increasing productivity by 35%\n• Last-mile delivery costs have risen 18% due to labor shortages\n• Sustainable packaging adoption has grown 42% year-over-year',
            text: 'What percentage of companies are diversifying manufacturing?',
            options: ['A. 23%', 'B. 33%', 'C. 43%', 'D. 53%'],
            correctAnswer: 2,
            explanation: '43% công ty đang đa dạng hóa sản xuất.'
          },
          {
            id: 't3-p7-54',
            passage: 'SUPPLY CHAIN WEEKLY\nLogistics Costs Expected to Stabilize\n\nAfter two years of significant volatility, global logistics costs are expected to stabilize in 2024, with ocean freight rates declining 28% from their 2022 peaks. However, air freight rates remain elevated due to limited cargo capacity.\n\nKey trends affecting supply chains:\n• Near-shoring is accelerating, with 43% of companies diversifying manufacturing away from single-country dependence\n• Automation in warehouses is increasing productivity by 35%\n• Last-mile delivery costs have risen 18% due to labor shortages\n• Sustainable packaging adoption has grown 42% year-over-year',
            text: 'Why have last-mile delivery costs risen?',
            options: ['A. Fuel price increases', 'B. Labor shortages', 'C. Regulatory changes', 'D. Infrastructure damage'],
            correctAnswer: 1,
            explanation: 'Chi phí giao hàng chặng cuối tăng do thiếu hụt lao động.'
          }
        ]
      }
    ]
  },
  {
    id: 'n2-auth-2',
    title: 'JLPT N2 Practice Exam 2',
    difficulty: 'intermediate',
    year: 2024,
    category: 'n2',
    timeLimitMinutes: 105,
    sections: [
      {
        id: 'n2a2-sec-1',
        title: '言語知識（文字・語彙）',
        description: 'Kiến thức ngôn ngữ: Chữ Hán và Từ vựng (60 câu hỏi, 25 phút)',
        questions: [
          { id: 'n2a2-v1', text: 'この計画の【実現】の読み方として最も適切なものはどれか。', options: ['A. じつげん', 'B. じっけん', 'C. しつげん', 'D. じつけん'], correctAnswer: 0, explanation: '実現 = じつげん (hiện thực hóa).' },
          { id: 'n2a2-v2', text: '彼女はいつも冷静で、どんな状況でも【動じ】ない。', options: ['A. うごじ', 'B. どうじ', 'C. どうどう', 'D. うご'], correctAnswer: 1, explanation: '動じる = どうじる (hoảng sợ).' },
          { id: 'n2a2-v3', text: '会議の【議題】を確認してください。', options: ['A. ぎだい', 'B. ぎてい', 'C. ぎもん', 'D. ぎけん'], correctAnswer: 0, explanation: '議題 = ぎだい (chương trình nghị sự).' },
          { id: 'n2a2-v4', text: 'この料理は【微妙】な味がする。', options: ['A. びみじょう', 'B. びみょう', 'C. ひみょう', 'D. びみん'], correctAnswer: 1, explanation: '微妙 = びみょう (tinh tế).' },
          { id: 'n2a2-v5', text: '彼は新しいプロジェクトの【担】い手として期待されている。', options: ['A. にない', 'B. たない', 'C. せない', 'D. かない'], correctAnswer: 0, explanation: '担い手 = にないて (người gánh vác).' },
          { id: 'n2a2-v6', text: 'この商品は海外でも【人気】がある。', options: ['A. ひとけ', 'B. にんき', 'C. ひとき', 'D. にんげん'], correctAnswer: 1, explanation: '人気 = にんき (sự phổ biến).' },
          { id: 'n2a2-v7', text: '彼は周囲の人に【感銘】を受けた。', options: ['A. かんべん', 'B. かんめい', 'C. かんえい', 'D. かんれん'], correctAnswer: 1, explanation: '感銘 = かんめい (ấn tượng sâu sắc).' },
          { id: 'n2a2-v8', text: '試験の結果が【予想】を上回った。', options: ['A. よもと', 'B. よそう', 'C. よもう', 'D. よぞう'], correctAnswer: 1, explanation: '予想 = よそう (dự đoán).' },
          { id: 'n2a2-v9', text: '彼女は很有能で、会社から【信頼】されている。', options: ['A. しんらい', 'B. しんれい', 'C. しんり', 'D. しんねん'], correctAnswer: 0, explanation: '信頼 = しんらい (sự tin tưởng).' },
          { id: 'n2a2-v10', text: '彼は自分の意見を【主張】し続けた。', options: ['A. しゅちょう', 'B. しゅじょう', 'C. しゅしょう', 'D. しゅぎょう'], correctAnswer: 0, explanation: '主張 = しゅちょう (khẳng định).' },
          { id: 'n2a2-v11', text: 'この問題について【識者】の意見を聞きましょう。', options: ['A. しきしゃ', 'B. しきじゃ', 'C. しつしゃ', 'D. しつじゃ'], correctAnswer: 0, explanation: '識者 = しきしゃ (chuyên gia).' },
          { id: 'n2a2-v12', text: '彼は非常に【穏や】かな性格だ。', options: ['A. おだや', 'B. おどろ', 'C. おだ', 'D. おだる'], correctAnswer: 0, explanation: '穏やか = おだやか (ôn hòa).' },
          { id: 'n2a2-v13', text: '新製品の【開発】には多くの費用がかかった。', options: ['A. かいはつ', 'B. かいはつう', 'C. かいつつ', 'D. かいはつん'], correctAnswer: 0, explanation: '開発 = かいはつ (phát triển).' },
          { id: 'n2a2-v14', text: '彼は自分の過ちを【認】めた。', options: ['A. みと', 'B. みとめ', 'C. にん', 'D. にんめ'], correctAnswer: 0, explanation: '認める = みとめる (thừa nhận).' },
          { id: 'n2a2-v15', text: 'この地域は交通が【不便】だ。', options: ['A. ふべん', 'B. ふびん', 'C. ふべんう', 'D. ふびんう'], correctAnswer: 0, explanation: '不便 = ふべん (bất tiện).' },
          { id: 'n2a2-v16', text: '彼女は毎日遅くまで勉強に【励】んでいる。', options: ['A. はげ', 'B. はげみ', 'C. はげん', 'D. はげだ'], correctAnswer: 0, explanation: '励む = はげむ (nỗ lực).' },
          { id: 'n2a2-v17', text: '会議の【結論】をまとめるのが難しい。', options: ['A. けつろん', 'B. けつりん', 'C. けつねん', 'D. けつおん'], correctAnswer: 0, explanation: '結論 = けつろん (kết luận).' },
          { id: 'n2a2-v18', text: '彼の【発言】は非常に説得力がある。', options: ['A. はつげん', 'B. はつぎん', 'C. はつねん', 'D. はつおん'], correctAnswer: 0, explanation: '発言 = はつげん (phát biểu).' },
          { id: 'n2a2-v19', text: '彼は会社の【方針】に従って行動する。', options: ['A. ほうしん', 'B. ほうじん', 'C. ぼうしん', 'D. ほうぎん'], correctAnswer: 0, explanation: '方針 = ほうしん (phương châm).' },
          { id: 'n2a2-v20', text: 'この本は読み【応え】がある。', options: ['A. こたえ', 'B. おうえ', 'C. こたえう', 'D. おうえう'], correctAnswer: 0, explanation: '読み応え = よみごたえ (đáng đọc).' },
          { id: 'n2a2-v21', text: '彼女はいつも真面目で、仕事に【熱心】だ。', options: ['A. ねっしん', 'B. ねつしん', 'C. ねっしんう', 'D. ねつしんう'], correctAnswer: 0, explanation: '熱心 = ねっしん (nhiệt tình).' },
          { id: 'n2a2-v22', text: '新しい法律が【施行】された。', options: ['A. しこう', 'B. しこうう', 'C. しけう', 'D. しけいう'], correctAnswer: 0, explanation: '施行 = しこう (ban hành).' },
          { id: 'n2a2-v23', text: '彼は海外での【経験】が豊富だ。', options: ['A. けいけん', 'B. けいれん', 'C. けいねん', 'D. けいげん'], correctAnswer: 0, explanation: '経験 = けいけん (kinh nghiệm).' },
          { id: 'n2a2-v24', text: 'この件については【詳細】を調査する必要がある。', options: ['A. しょうさい', 'B. しょうし', 'C. じょうさい', 'D. じょうし'], correctAnswer: 0, explanation: '詳細 = しょうさい (chi tiết).' },
          { id: 'n2a2-v25', text: '彼女は会議で【活躍】した。', options: ['A. かつやく', 'B. かつやくう', 'C. かちやく', 'D. かちやくう'], correctAnswer: 0, explanation: '活躍 = かつやく (nổi bật).' },
          { id: 'n2a2-v26', text: 'この計画は資金不足のため【挫折】した。', options: ['A. ざせつ', 'B. させつ', 'C. ざせつう', 'D. させつう'], correctAnswer: 0, explanation: '挫折 = ざせつ (thất bại).' },
          { id: 'n2a2-v27', text: '彼は非常に【優秀】な人材だ。', options: ['A. ゆうしゅう', 'B. ゆうしゅうう', 'C. ゆうしゅう', 'D. ゆうしゅうう'], correctAnswer: 0, explanation: '優秀 = ゆうしゅう (xuất sắc).' },
          { id: 'n2a2-v28', text: '彼女の【発想】はいつも斬新だ。', options: ['A. はっそう', 'B. はっそうう', 'C. はつぞう', 'D. はつぞうう'], correctAnswer: 0, explanation: '発想 = はっそう (ý tưởng).' },
          { id: 'n2a2-v29', text: 'この仕事には【忍耐】力が求められる。', options: ['A. にんたい', 'B. にんたいう', 'C. にんだい', 'D. にんだいう'], correctAnswer: 0, explanation: '忍耐 = にんたい (kiên nhẫn).' },
          { id: 'n2a2-v30', text: '彼はその分野で【権威】的存在だ。', options: ['A. けんい', 'B. けんいう', 'C. けんい', 'D. けんいう'], correctAnswer: 0, explanation: '権威 = けんい (uy quyền).' },
          { id: 'n2a2-v31', text: 'この会社は【革新】を重視している。', options: ['A. かくしん', 'B. かくしんう', 'C. かくしん', 'D. かくしんう'], correctAnswer: 0, explanation: '革新 = かくしん (đổi mới).' },
          { id: 'n2a2-v32', text: '彼は自分の【怠慢】を認めた。', options: ['A. たいまん', 'B. たいまんう', 'C. たいまん', 'D. たいまんう'], correctAnswer: 0, explanation: '怠慢 = たいまん (lười biếng).' },
          { id: 'n2a2-v33', text: '彼女は常に【前向き】な姿勢を保っている。', options: ['A. まえむき', 'B. まえむきう', 'C. まえむき', 'D. まえむきう'], correctAnswer: 0, explanation: '前向き = まえむき (tích cực).' },
          { id: 'n2a2-v34', text: 'この地域の【景観】を守ることが重要だ。', options: ['A. けいかん', 'B. けいかんう', 'C. けいかん', 'D. けいかんう'], correctAnswer: 0, explanation: '景観 = けいかん (phong cảnh).' },
          { id: 'n2a2-v35', text: '彼は非常に【器用】な人だ。', options: ['A. きよう', 'B. きようう', 'C. きよう', 'D. きようう'], correctAnswer: 0, explanation: '器用 = きよう (khéo léo).' },
          { id: 'n2a2-v36', text: '彼の【持論】は多くの人に支持されている。', options: ['A. じろん', 'B. じろんう', 'C. じろん', 'D. じろんう'], correctAnswer: 0, explanation: '持論 = じろん (luận điểm).' },
          { id: 'n2a2-v37', text: 'この仕事は【地道】な努力が必要だ。', options: ['A. じみち', 'B. じみちう', 'C. じみち', 'D. じみちう'], correctAnswer: 0, explanation: '地道 = じみち (tích lũy dần).' },
          { id: 'n2a2-v38', text: '彼女は【冷静】な対応で問題を解決した。', options: ['A. れいせい', 'B. れいせいう', 'C. れいせい', 'D. れいせいう'], correctAnswer: 0, explanation: '冷静 = れいせい (bình tĩnh).' },
          { id: 'n2a2-v39', text: '彼は【慎重】な判断を下した。', options: ['A. しんちょう', 'B. しんちょうう', 'C. しんちょう', 'D. しんちょうう'], correctAnswer: 0, explanation: '慎重 = しんちょう (cẩn trọng).' },
          { id: 'n2a2-v40', text: '彼女は常に【誠実】な対応をしている。', options: ['A. せいじつ', 'B. せいじつう', 'C. せいじつ', 'D. せいじつう'], correctAnswer: 0, explanation: '誠実 = せいじつ (chính trực).' },
          { id: 'n2a2-v41', text: '彼は非常に【謙虚】な態度を保っている。', options: ['A. けんきょ', 'B. けんぎょ', 'C. けんきょう', 'D. けんぎょう'], correctAnswer: 0, explanation: '謙虚 = けんきょ (khiêm tốn).' },
          { id: 'n2a2-v42', text: 'この地域は【脆弱】なインフラが課題となっている。', options: ['A. ぜいじゃく', 'B. ぜいじゃくう', 'C. ぜいじゃく', 'D. ぜいじゃくう'], correctAnswer: 0, explanation: '脆弱 = ぜいじゃく (mong manh).' },
          { id: 'n2a2-v43', text: '彼は非常に【思慮】深い人物だ。', options: ['A. しりょ', 'B. しりょう', 'C. しりょ', 'D. しりょう'], correctAnswer: 0, explanation: '思慮深い = しりょぶかい (sâu sắc).' },
          { id: 'n2a2-v44', text: '政府は経済【低迷】からの脱却を目指している。', options: ['A. ていたい', 'B. ていたいう', 'C. ていたい', 'D. ていたいう'], correctAnswer: 0, explanation: '低迷 = ていたい (suy thoái).' },
          { id: 'n2a2-v45', text: '彼の【独創】的なアイデアは高く評価された。', options: ['A. どくそう', 'B. どくそうう', 'C. どくそう', 'D. どくそうう'], correctAnswer: 0, explanation: '独創 = どくそう (độc đáo).' },
          { id: 'n2a2-v46', text: 'この計画の【実行】に当たっては、多くの協力が必要だ。', options: ['A. じっこう', 'B. じっこうう', 'C. じっこう', 'D. じっこうう'], correctAnswer: 0, explanation: '実行 = じっこう (thực hiện).' },
          { id: 'n2a2-v47', text: '彼女は【繊細】な感性の持ち主だ。', options: ['A. せんさい', 'B. せんさいう', 'C. せんさい', 'D. せんさいう'], correctAnswer: 0, explanation: '繊細 = せんさい (tinh tế).' },
          { id: 'n2a2-v48', text: 'この問題に対する【解決策】を提案してほしい。', options: ['A. かいけつさく', 'B. かいけつさくう', 'C. かいけつさく', 'D. かいけつさくう'], correctAnswer: 0, explanation: '解決策 = かいけつさく (giải pháp).' },
          { id: 'n2a2-v49', text: '彼は会議で自分の【見解】を述べた。', options: ['A. けんかい', 'B. けんかいう', 'C. けんかい', 'D. けんかいう'], correctAnswer: 0, explanation: '見解 = けんかい (quan điểm).' },
          { id: 'n2a2-v50', text: 'この技術の【応用】範囲は非常に広い。', options: ['A. おうよう', 'B. おうようう', 'C. おうよう', 'D. おうようう'], correctAnswer: 0, explanation: '応用 = おうよう (ứng dụng).' },
          { id: 'n2a2-v51', text: '彼は常日頃から【研鑽】を怠らない。', options: ['A. けんさん', 'B. けんさんう', 'C. けんさん', 'D. けんさんう'], correctAnswer: 0, explanation: '研鑽 = けんさん (nghiên cứu).' },
          { id: 'n2a2-v52', text: '彼の【卓越】した技術には誰もが感嘆した。', options: ['A. たくえつ', 'B. じょうえつ', 'C. たつえつ', 'D. じゅくえつ'], correctAnswer: 0, explanation: '卓越 = たくえつ (xuất sắc).' },
          { id: 'n2a2-v53', text: '彼はその【先見】の明がある。', options: ['A. せんけん', 'B. せんけんう', 'C. せんけん', 'D. せんけんう'], correctAnswer: 0, explanation: '先見 = せんけん (nhìn xa).' },
          { id: 'n2a2-v54', text: 'この件については慎重な【判断】が必要だ。', options: ['A. はんだん', 'B. はんだんう', 'C. はんだん', 'D. はんだんう'], correctAnswer: 0, explanation: '判断 = はんだん (phán đoán).' },
          { id: 'n2a2-v55', text: '彼は自らの【信念】に従って行動した。', options: ['A. しんねん', 'B. しんねんう', 'C. しんねん', 'D. しんねんう'], correctAnswer: 0, explanation: '信念 = しんねん (tín niệm).' },
          { id: 'n2a2-v56', text: '彼女は【豊富】な経験を持っている。', options: ['A. ほうふ', 'B. ほうふう', 'C. ほうふ', 'D. ほうふう'], correctAnswer: 0, explanation: '豊富 = ほうふ (phong phú).' },
          { id: 'n2a2-v57', text: 'この地域は【急速】な成長を遂げた。', options: ['A. きゅうそく', 'B. きゅうそくう', 'C. きゅうそく', 'D. きゅうそくう'], correctAnswer: 0, explanation: '急速 = きゅうそく (nhanh chóng).' },
          { id: 'n2a2-v58', text: '彼は【大胆】な計画を立てた。', options: ['A. だいたん', 'B. だいたんう', 'C. だいたん', 'D. だいたんう'], correctAnswer: 0, explanation: '大胆 = だいたん (táo bạo).' },
          { id: 'n2a2-v59', text: '彼女は常に【柔軟】な対応ができる。', options: ['A. じゅうなん', 'B. じゅうなんう', 'C. じゅうなん', 'D. じゅうなんう'], correctAnswer: 0, explanation: '柔軟 = じゅうなん (linh hoạt).' },
          { id: 'n2a2-v60', text: '彼はその仕事に【情熱】を注いでいる。', options: ['A. じょうねつ', 'B. じょうねつう', 'C. じょうねつ', 'D. じょうねつう'], correctAnswer: 0, explanation: '情熱 = じょうねつ (nhiệt huyết).' }
        ]
      },
      {
        id: 'n2a2-sec-2',
        title: '言語知識（文法）・読解',
        description: 'Kiến thức ngôn ngữ: Ngữ pháp và Đọc hiểu (60 câu hỏi, 50 phút)',
        questions: [
          { id: 'n2a2-g1', text: '彼の発言は周囲に大きな【　　】を与えた。', options: ['A. 影響を', 'B. 影響に', 'C. 影響の', 'D. 影響と'], correctAnswer: 0, explanation: '影響を与える = gây ảnh hưởng.' },
          { id: 'n2a2-g2', text: 'この件についての決定は、部長に【　　】されることになった。', options: ['A. 任される', 'B. 任されるを', 'C. 任されるに', 'D. 任されるの'], correctAnswer: 0, explanation: '部長に任される = được giao phó.' },
          { id: 'n2a2-g3', text: '会議の日程は来週に【　　】されました。', options: ['A. 変更', 'B. 変更し', 'C. 変更を', 'D. 変更と'], correctAnswer: 0, explanation: '日程が変更された = lịch trình thay đổi.' },
          { id: 'n2a2-g4', text: '新しいプロジェクトは、チーム全体の【　　】で進める。', options: ['A. 協力で', 'B. 協力に', 'C. 協力の', 'D. 協力と'], correctAnswer: 0, explanation: 'チーム全体の協力で = với sự hợp tác.' },
          { id: 'n2a2-g5', text: 'この問題を解決するには、まず原因を【　　】する必要がある。', options: ['A. 分析', 'B. 分析を', 'C. 分析に', 'D. 分析の'], correctAnswer: 0, explanation: '原因を分析する = phân tích nguyên nhân.' },
          { id: 'n2a2-g6', text: '来月の販売【　　】を達成できるかどうかは、今週のキャンペーン次第だ。', options: ['A. 目標', 'B. 目標を', 'C. 目標に', 'D. 目標の'], correctAnswer: 0, explanation: '販売目標 = mục tiêu bán hàng.' },
          { id: 'n2a2-g7', text: '会社の【　　】に従い、この件を処理してください。', options: ['A. 規則に', 'B. 規則を', 'C. 規則の', 'D. 規則と'], correctAnswer: 0, explanation: '規則に従い = theo quy tắc.' },
          { id: 'n2a2-g8', text: '彼の提案は全員の【　　】を得た。', options: ['A. 賛成を', 'B. 賛成に', 'C. 賛成の', 'D. 賛成と'], correctAnswer: 0, explanation: '賛成を得た = nhận tán thành.' },
          { id: 'n2a2-g9', text: 'この地域は、自然環境の【　　】が著しい。', options: ['A. 変化', 'B. 変化を', 'C. 変化に', 'D. 変化の'], correctAnswer: 0, explanation: '自然環境の変化 = thay đổi môi trường.' },
          { id: 'n2a2-g10', text: '新製品の【　　】は来月に予定されている。', options: ['A. 発売', 'B. 発売を', 'C. 発売に', 'D. 発売の'], correctAnswer: 0, explanation: '新製品の発売 = ra mắt sản phẩm.' },
          { id: 'n2a2-g11', text: '彼女は海外での【　　】を通じて、多くのことを学んだ。', options: ['A. 経験', 'B. 経験を', 'C. 経験に', 'D. 経験の'], correctAnswer: 0, explanation: '経験を通じて = thông qua kinh nghiệm.' },
          { id: 'n2a2-g12', text: 'このプロジェクトの【　　】は、来月末までに完了する見込みだ。', options: ['A. 実施', 'B. 実施を', 'C. 実施に', 'D. 実施の'], correctAnswer: 0, explanation: 'プロジェクトの実施 = thực hiện dự án.' },
          { id: 'n2a2-g13', text: '消費者の【　　】が变化していることを無視してはいけない。', options: ['A. 意識', 'B. 意識を', 'C. 意識に', 'D. 意識の'], correctAnswer: 0, explanation: '消費者の意識 = ý thức người tiêu dùng.' },
          { id: 'n2a2-g14', text: 'この記事は社会の【　　】を鋭くえぐっている。', options: ['A. 矛盾', 'B. 矛盾を', 'C. 矛盾に', 'D. 矛盾の'], correctAnswer: 0, explanation: '社会の矛盾 = mâu thuẫn xã hội.' },
          { id: 'n2a2-g15', text: '彼の【　　】には、いつも感心させられる。', options: ['A. 努力', 'B. 努力を', 'C. 努力に', 'D. 努力の'], correctAnswer: 0, explanation: '彼の努力 = sự nỗ lực.' },
          { id: 'n2a2-g16', text: '会議では、各部門の【　　】が報告された。', options: ['A. 成果', 'B. 成果を', 'C. 成果に', 'D. 成果の'], correctAnswer: 0, explanation: '各部門の成果 = thành quả các bộ phận.' },
          { id: 'n2a2-g17', text: 'この問題については、専門家に【　　】を仰ぐべきだ。', options: ['A. 意見', 'B. 意見を', 'C. 意見に', 'D. 意見の'], correctAnswer: 0, explanation: '専門家の意見を仰ぐ = xin ý kiến chuyên gia.' },
          { id: 'n2a2-g18', text: '彼は会議で自分の【　　】を述べた。', options: ['A. 立場', 'B. 立場を', 'C. 立場に', 'D. 立場の'], correctAnswer: 0, explanation: '自分の立場を述べた = nêu quan điểm.' },
          { id: 'n2a2-g19', text: '新しいシステムの【　　】には時間がかかる。', options: ['A. 導入', 'B. 導入を', 'C. 導入に', 'D. 導入の'], correctAnswer: 0, explanation: 'システムの導入 = giới thiệu hệ thống.' },
          { id: 'n2a2-g20', text: '彼はその【　　】をものともせず、挑戦し続けた。', options: ['A. 困難を', 'B. 困難に', 'C. 困難の', 'D. 困難と'], correctAnswer: 0, explanation: '困難をものともせず = không nản chí.' },
          { id: 'n2a2-g21', text: 'この地域は地震に対する【　　】が不十分だ。', options: ['A. 対策', 'B. 対策を', 'C. 対策に', 'D. 対策の'], correctAnswer: 0, explanation: '地震に対する対策 = biện pháp phòng chống.' },
          { id: 'n2a2-g22', text: 'この件については社長の【　　】を仰ぐ必要がある。', options: ['A. 許可', 'B. 許可を', 'C. 許可に', 'D. 許可の'], correctAnswer: 0, explanation: '社長の許可を仰ぐ = xin phép chủ tịch.' },
          { id: 'n2a2-g23', text: 'この法律は来年から【　　】される予定だ。', options: ['A. 施行', 'B. 施行を', 'C. 施行に', 'D. 施行の'], correctAnswer: 0, explanation: '法律が施行される = luật được thực thi.' },
          { id: 'n2a2-g24', text: '彼は会議で活発な【　　】を展開した。', options: ['A. 議論', 'B. 議論を', 'C. 議論に', 'D. 議論の'], correctAnswer: 0, explanation: '活発な議論 = tranh luận sôi nổi.' },
          { id: 'n2a2-g25', text: 'このプロジェクトの【　　】は、チーム全体に影響する。', options: ['A. 成否', 'B. 成否を', 'C. 成否に', 'D. 成否の'], correctAnswer: 0, explanation: 'プロジェクトの成否 = thành bại dự án.' },
          { id: 'n2a2-g26', text: '環境問題に対する【　　】が高まっている。', options: ['A. 意識', 'B. 意識を', 'C. 意識に', 'D. 意識の'], correctAnswer: 0, explanation: '環境問題への意識 = ý thức môi trường.' },
          { id: 'n2a2-g27', text: '彼はその【　　】を買って、昇進した。', options: ['A. 実績', 'B. 実績を', 'C. 実績に', 'D. 実績の'], correctAnswer: 0, explanation: '実績を買って = dựa trên thành tích.' },
          { id: 'n2a2-g28', text: '彼女の【　　】は非常に素晴らしい。', options: ['A. 先見', 'B. 先見を', 'C. 先見に', 'D. 先見の'], correctAnswer: 0, explanation: '先見の明 = con mắt nhìn xa.' },
          { id: 'n2a2-g29', text: 'この件については慎重な【　　】が必要だ。', options: ['A. 判断', 'B. 判断を', 'C. 判断に', 'D. 判断の'], correctAnswer: 0, explanation: '慎重な判断 = phán đoán cẩn thận.' },
          { id: 'n2a2-g30', text: '彼は自らの【　　】に従って行動した。', options: ['A. 信念', 'B. 信念を', 'C. 信念に', 'D. 信念の'], correctAnswer: 0, explanation: '自らの信念に従って = theo tín niệm.' },
          { id: 'n2a2-r1', passage: '現代社会では、インターネットが人々の生活に深く浸透している。情報収集だけでなく、買い物やコミュニケーションもオンラインで行われるようになった。しかし、デジタルデバイドと呼ばれる問題も浮上している。', text: '筆者が最も伝えたいことは何か。', options: ['A. インターネットは生活を変えたが、問題もある', 'B. インターネットは使わない方がいい', 'C. デジタルデバイドは解決済みだ', 'D. オンライン買い物は危険だ'], correctAnswer: 0, explanation: 'Internet thay đổi cuộc sống nhưng cũng có vấn đề.' },
          { id: 'n2a2-r2', passage: '企業における多様性の推進は、単に男女比を平等にすることではない。異なる背景を持つ人材が活躍できる環境を作ることで、イノベーションが生まれる。', text: '筆者の考えとして最も適切なものはどれか。', options: ['A. 多様性は数値で評価すべきだ', 'B. 多様性はイノベーションにつながる', 'C. 男性の方が多い方がいい', 'D. 多様性は経費の増加をもたらす'], correctAnswer: 1, explanation: 'Đa dạng dẫn đến đổi mới.' },
          { id: 'n2a2-r3', passage: '近年、リモートワークが急速に広がった。テレワークには通勤時間の削減や柔軟なスケジュール管理というメリットがある一方、コミュニケーションの希薄化や孤立感という課題も指摘されている。', text: 'リモートワークの課題として挙げられているものは何か。', options: ['A. 通勤時間の増加', 'B. コストの上昇', 'C. 意思疎通の希薄化', 'D. 生産性の低下'], correctAnswer: 2, explanation: 'Thách thức là sự mỏng manh trong giao tiếp.' },
          { id: 'n2a2-r4', passage: '日本の少子高齢化が進行する中、社会保障制度の見直しは避けて通れない課題となっている。現行の制度を維持していくためには、給付と負担のバランスを再検討する必要がある。', text: '筆者の提案として最も適切なものはどれか。', options: ['A. 社会保障制度を廃止する', 'B. 給付と負担のバランスを見直すべきだ', 'C. 税金を大幅に引き下げる', 'D. 移民を増やすべきだ'], correctAnswer: 1, explanation: 'Xem xét lại sự cân bằng quyền lợi và gánh nặng.' },
          { id: 'n2a2-r5', passage: 'アーティストの活動範囲は近年、大幅に拡大している。SNSを通じて世界中のファンと直接交流できることで、従来の音楽業界の枠組みを超えた活動が可能になった。', text: '本文の内容として最も適切なものはどれか。', options: ['A. SNSは音楽業界にとって悪影響だ', 'B. アーティストの活動は以前と同じだ', 'C. SNSがアーティストの活動を多様にした', 'D. 音楽業界は衰退している'], correctAnswer: 2, explanation: 'SNS làm cho hoạt động nghệ sĩ đa dạng hơn.' },
          { id: 'n2a2-r6', passage: '持続可能な社会を実現するためには、企業だけでなく、消費者も環境に配慮した行動を取ることが重要である。両者の努力が合わさることで、真の変化が生まれる。', text: '筆者が言いたいことは何か。', options: ['A. 企業だけが環境問題を解決すべきだ', 'B. 消費者は環境問題に無関心だ', 'C. 企業と消費者の両方が行動する必要がある', 'D. 持続可能な社会は不可能だ'], correctAnswer: 2, explanation: 'Cả doanh nghiệp và người tiêu dùng đều phải hành động.' },
          { id: 'n2a2-r7', passage: '人工知能の発展により、一部の職業は将来的に置き換えられる可能性がある。しかし、AIが人間に代わることで、人間はより創造的な仕事に集中できるようになるという見方もある。', text: '筆者はAIについてどう考えているか。', options: ['A. AIは人間にとって危険だ', 'B. AIは職業を奪うだけでいい', 'C. AIは人間の仕事を補完できる', 'D. AIの開発を止めるべきだ'], correctAnswer: 2, explanation: 'AI bổ sung công việc cho con người.' },
          { id: 'n2a2-r8', passage: '教育の場においてもテクノロジーの導入が進んでいる。オンライン学習やAI教材は、個別最適化された学習体験を提供する可能性を秘めている。', text: '本文の内容として正しいものはどれか。', options: ['A. テクノロジーは教育に不要だ', 'B. オンライン学習は効果がない', 'C. テクノロジーが個別学習を可能にする', 'D. 教育現場はテクノロジーを拒否している'], correctAnswer: 2, explanation: 'Công nghệ cho phép học tập cá nhân hóa.' },
          { id: 'n2a2-r9', passage: '都市部では、コンパクトシティの構想が注目されている。都市の拡大を抑え、公共交通の利用を促進することで、効率的で持続可能な都市運営を目指すものだ。', text: 'コンパクトシティの目的は何か。', options: ['A. 都市をより大きくすること', 'B. 都市の効率的運営を目指すこと', 'C. 車の利用を増やすこと', 'D. 郊外への移住を推奨すること'], correctAnswer: 1, explanation: 'Mục tiêu là vận hành đô thị hiệu quả.' },
          { id: 'n2a2-r10', passage: '近年、プレーン言語の重要性が認識されている。専門用語や難しい表現を避け、誰にでも分かりやすい言葉で説明することで、情報へのアクセスが向上する。', text: 'プレーン言語とは何か。', options: ['A. 専門用語が多い言葉', 'B. 外国語の表現', 'C. 誰にでも分かりやすい言葉', 'D. 言語学の専門用語'], correctAnswer: 2, explanation: 'Plain language là ngôn ngữ dễ hiểu.' },
          { id: 'n2a2-r11', passage: '日本の伝統文化は、現代社会でもその価値を失っていない。茶道や華道、書道などの伝統芸術は、忙しい現代人に心の平穏を与える手段として再評価されている。', text: '筆者は伝統文化についてどう述べているか。', options: ['A. 伝統文化は時代遅れだ', 'B. 伝統文化は現代でも価値がある', 'C. 伝統文化は外国人にだけ人気だ', 'D. 伝統文化は廃れるべきだ'], correctAnswer: 1, explanation: 'Truyền thống văn hóa vẫn có giá trị.' },
          { id: 'n2a2-r12', passage: 'バイオ燃料は、化石燃料に代わる有望なエネルギー源として注目されている。トウモロコシやサトウキビから作られるバイオ燃料は、CO2の削減に貢献できるとされる。', text: 'バイオ燃料の利点として挙げられているのは何か。', options: ['A. コストが安いこと', 'B. 大量に生産できること', 'C. CO2の削減に貢献すること', 'D. 石油と同じ効率があること'], correctAnswer: 2, explanation: 'Góp phần giảm CO2.' },
          { id: 'n2a2-r13', passage: '組織において、心理的安全性が重要な要素であることが明らかになった。メンバーが安心して意見を言い合える環境があることで、チームのパフォーマンスが向上する。', text: '心理的安全性がもたらす効果は何か。', options: ['A. コストの削減', 'B. チームのパフォーマンス向上', 'C. 人員の削減', 'D. 管理の簡素化'], correctAnswer: 1, explanation: 'Cải thiện hiệu suất nhóm.' },
          { id: 'n2a2-r14', passage: '地方都市でもスタートアップの創出が見られる。地方の独自の資源や文化を活かした事業は、地域振興に大きく貢献する可能性がある。', text: '地方のスタートアップが地域振興に貢献する理由は何か。', options: ['A. 都会よりコストが安いから', 'B. 独自の資源や文化を活かせるから', 'C. 政府の補助金が多いから', 'D. 人口が多いから'], correctAnswer: 1, explanation: 'Tận dụng tài nguyên và văn hóa độc đáo.' },
          { id: 'n2a2-r15', passage: '食物ロスの削減は、持続可能な社会の実現に向けた重要な課題の一つである。食品ロスを減らすことで、環境負荷の軽減と経済効率の向上を同時に達成できる。', text: '本文の内容として正しいものはどれか。', options: ['A. 食物ロスは問題ではない', 'B. 食物ロス削減は環境と経済の両方にメリットがある', 'C. 食物ロスはすでに削減されている', 'D. 食物ロスの原因は消費者だけだ'], correctAnswer: 1, explanation: 'Giảm lãng phí có lợi cho cả hai.' },
          { id: 'n2a2-r16', passage: '企業におけるDX推進において、技術導入だけでなく、組織文化の変革も不可欠である。デジタル技術を活用した業務改善を進めるためには、従業員の意識改革が求められる。', text: 'DX推進において不可欠なことは何か。', options: ['A. 技術導入だけ', 'B. 組織文化の変革', 'C. コスト削減', 'D. 人員増加'], correctAnswer: 1, explanation: 'Cần thay đổi văn hóa tổ chức.' },
          { id: 'n2a2-r17', passage: '近年、サステナビリティが企業経営の重要なテーマとなっている。環境負荷の低減だけでなく、社会貢献やガバナンスも含めた取り組みが求められている。', text: 'サステナビリティに含まれる要素として正しいものはどれか。', options: ['A. 環境負荷の低減のみ', 'B. 社会貢献とガバナンス', 'C. 利益追求のみ', 'D. 技術革新のみ'], correctAnswer: 1, explanation: 'Bao gồm cả đóng góp xã hội và quản trị.' },
          { id: 'n2a2-r18', passage: 'デジタル化が進む中、ペーパーレス化を推進する企業が増えている。コスト削減や業務効率化のメリットがある一方、情報セキュリティの確保も重要な課題となっている。', text: 'ペーパーレス化の課題として挙げられているのは何か。', options: ['A. コスト増加', 'B. 業務効率の低下', 'C. 情報セキュリティの確保', 'D. 従業員の反対'], correctAnswer: 2, explanation: 'Đảm bảo an ninh thông tin là thách thức.' },
          { id: 'n2a2-r19', passage: '日本の製造業は、高品質で信頼性の高い製品を生み出してきた。しかし、グローバル化が進む中、コスト競争力の維持が大きな課題となっている。', text: '日本の製造業の課題として正しいものはどれか。', options: ['A. 品質の低下', 'B. コスト競争力の維持', 'C. 人材不足', 'D. 技術力の不足'], correctAnswer: 1, explanation: ' duy trì năng lực cạnh tranh về chi phí.' },
          { id: 'n2a2-r20', passage: '社会貢献活動に積極的な企業は、従業員のエンゲージメント向上にもつながると言われている。企業の社会的責任を果たすことは、長期的な成長にも貢献する。', text: '社会貢献活動の効果として正しいものはどれか。', options: ['A. 短期的な利益増加', 'B. 従業員のエンゲージメント向上', 'C. コスト削減', 'D. 規制緩和'], correctAnswer: 1, explanation: 'Cải thiện sự gắn kết nhân viên.' },
          { id: 'n2a2-r21', passage: '日本の人口減少が加速する中、地方でのまちづくりは困難を極めている。しかし、ITの活用や新しいビジネスモデルの導入によって、人口減少に負けない地域運営が模索されている。', text: '筆者が言いたいことは何か。', options: ['A. 地方は衰退するしかない', 'B. ITで地方の問題を解決できる可能性がある', 'C. 都会の方が優れている', 'D. 人口増加は不可能だ'], correctAnswer: 1, explanation: 'IT có thể giải quyết vấn đề vùng quê.' },
          { id: 'n2a2-r22', passage: '消費者の意識が環境配慮型の製品に傾倒する中、企業はサプライチェーン全体での環境負荷削減に取り組むことが求められている。グリーンサプライチェーンの構築は、企業の競争力にも直結する。', text: 'グリーンサプライチェーンの構築が重要である理由は何か。', options: ['A. コスト削減のため', 'B. 企業の競争力に影響するから', 'C. 法律で義務付けられているから', 'D. 消費者は関心がないから'], correctAnswer: 1, explanation: 'Ảnh hưởng đến năng lực cạnh tranh.' },
          { id: 'n2a2-r23', passage: '知識経済の時代において、個人の学習能力がますます重要になっている。学校での学びだけでは不十分で、生涯学習を通じて知識とスキルを更新し続けることが不可欠だ。', text: '筆者は何を提案しているか。', options: ['A. 学校教育を廃止すべきだ', 'B. 社会人になっても学び続ける必要がある', 'C. 学校の教育だけで十分だ', 'D. 技術的なスキルは不要だ'], correctAnswer: 1, explanation: 'Cần học hỏi suốt đời.' },
          { id: 'n2a2-r24', passage: '文化の多様性は、社会の創造性を高める重要な要素である。異なる文化的背景を持つ人々が交流することで、新しいアイデアや視点が生まれる。', text: '文化の多様性がもたらす効果は何か。', options: ['A. コストの増加', 'B. コミュニケーションの困難', 'C. 社会の創造性の向上', 'D. 意思決定の遅延'], correctAnswer: 2, explanation: 'Nâng cao sáng tạo xã hội.' },
          { id: 'n2a2-r25', passage: '都市の緑化は、ヒートアイランド現象の緩和、生物多様性の保全、住民の健康増進など、多くのメリットをもたらす。都市における緑地の確保は、持続可能なまちづくりの重要な柱となっている。', text: '都市の緑化のメリットとして挙げられていないものはどれか。', options: ['A. ヒートアイランド現象の緩和', 'B. 生物多様性の保全', 'C. 経済成長の加速', 'D. 住民の健康増進'], correctAnswer: 2, explanation: 'Tăng trưởng kinh tế không được đề cập.' },
          { id: 'n2a2-r26', passage: 'サイバーセキュリティの重要性が高まる中、企業は組織全体で情報セキュリティ意識を向上させることが急務となっている。技術的な対策だけでなく、人的な脆弱性への対処も不可欠だ。', text: '企業が取るべき対策として正しいものはどれか。', options: ['A. 技術対策だけに集中する', 'B. 従業員の意識向上も含めた包括的な対策を講じる', 'C. セキュリティ対策は不要だ', 'D. 外部の専門家に任せる'], correctAnswer: 1, explanation: 'Biện pháp toàn diện bao gồm nâng cao ý thức.' },
          { id: 'n2a2-r27', passage: 'クラウドコンピューティングの普及により、企業の情報システムの構築・運用方法は大きく変わった。自社でサーバーを管理する必要がなくなり、コスト削減と柔軟性の向上が同時に実現された。', text: 'クラウドコンピューティングの利点として正しいものはどれか。', options: ['A. セキュリティリスクがゼロになる', 'B. コスト削減と柔軟性の向上', 'C. インターネットが不要になる', 'D. ハードウェアの購入が必要になる'], correctAnswer: 1, explanation: 'Giảm chi phí và tăng tính linh hoạt.' },
          { id: 'n2a2-r28', passage: '社会の高齢化に伴い、介護ロボットの開発が進んでいる。ロボットによって介護者の負担軽減が期待される一方、人間関係の希薄化への懸念もなされている。', text: '介護ロボットについての本文の内容として正しいものはどれか。', options: ['A. 介護ロボットは完全に人間の介護を置き換える', 'B. 介護ロボットには利点だけでなく課題もある', 'C. 介護ロボットは普及していない', 'D. 介護ロボットは高齢者にとって不要だ'], correctAnswer: 1, explanation: 'Có cả ưu điểm lẫn thách thức.' },
          { id: 'n2a2-r29', passage: 'オープンイノベーションは、企業が自社のリソースだけに頼らず、外部の知識や技術を取り入れてイノベーションを生み出す手法である。大学やスタートアップとの連携が注目されている。', text: 'オープンイノベーションの特徴として正しいものはどれか。', options: ['A. すべて自社内で完結させる', 'B. 外部の知識を活用する', 'C. 新製品は開発しない', 'D. 競合他社とは絶対に連携しない'], correctAnswer: 1, explanation: 'Tận dụng kiến thức bên ngoài.' },
          { id: 'n2a2-r30', passage: 'デジタルトランスフォーメーション（DX）は、企業のビジネスモデルや業務プロセスをデジタル技術を活用して変革することを意味する。単なるデジタル化ではなく、価値創造を伴う変革が求められている。', text: 'DXの本質として正しいものはどれか。', options: ['A. データを蓄積すること', 'B. ペーパーレス化を進めること', 'C. デジタル技術による価値創造を伴う変革', 'D. IT予算を増やすこと'], correctAnswer: 2, explanation: 'Bản chất là đổi mới sáng tạo bằng công nghệ số.' }
        ]
      },
      {
        id: 'n2a2-sec-3',
        title: '聴解',
        description: 'Nghe hiểu (30 câu hỏi, 30 phút)',
        questions: [
          { id: 'n2a2-l1', passage: '男：明日のプレゼン、資料は準備できた？\n女：はい、昨日のうちに完成させました。でも印刷機が壊れていて、明日の朝に印刷する予定です。', text: '女の人はいつ資料を印刷するか。', options: ['A. 今日のうちに', 'B. 明日の朝', 'C. 明日の昼', 'D. プレゼンの後'], correctAnswer: 1, explanation: 'Buổi sáng ngày mai.' },
          { id: 'n2a2-l2', passage: '女：駅前の新しいカフェ、行ってみた？\n男：うん、昨日行ったよ。コーヒーが美味しかったけど、混んでいてなかなか席が空かなかった。', text: '男の人は新しいカフェについてどう言っているか。', options: ['A. コーヒーがまずい', 'B. 席に着けなかった', 'C. 混雑していた', 'D. 閉まっていた'], correctAnswer: 2, explanation: 'Quán cà phê đông đúc.' },
          { id: 'n2a2-l3', passage: '男：来月の社員旅行、参加する？\n女：行きたいんだけど、その時期は出張が多いので、参加できるか分かりません。', text: '女の人は社員旅行についてどう言っているか。', options: ['A. 絶対に参加する', 'B. 参加しない', 'C. 参加できるか分からない', 'D. 参加を検討中だ'], correctAnswer: 2, explanation: 'Không biết tham dự được không.' },
          { id: 'n2a2-l4', passage: '女：このプロジェクトの締め切り、来週に変更されました。\n男：えっ、先週まで来月末だったのに。早まりましたね。', text: '男の人はどう思っているか。', options: ['A. 変更に賛成だ', 'B. 変更に反対だ', 'C. 変更に驚いている', 'D. 変更を知らなかった'], correctAnswer: 2, explanation: 'Ngạc nhiên vì thay đổi.' },
          { id: 'n2a2-l5', passage: '男：来週の会議、何時からだっけ？\n女：午後2時からです。でも、部長が30分前に集合するように言っています。', text: '部長は何時に集合するよう言っているか。', options: ['A. 1時', 'B. 1時30分', 'C. 2時', 'D. 2時30分'], correctAnswer: 1, explanation: '1h30 (trước 30 phút).' },
          { id: 'n2a2-l6', passage: '女：新しい制度について説明します。有給休暇は入社から半年後に付与されます。', text: '有給休暇はいつ付与されるか。', options: ['A. 入社と同時に', 'B. 3ヶ月後', 'C. 半年後', 'D. 1年後'], correctAnswer: 2, explanation: 'Sau 6 tháng.' },
          { id: 'n2a2-l7', passage: '男：この書類、部長に見せてもらえますか？\n女：部長は今会議中なので、午後まで待っていただけますか。', text: '部長はいつ書類を見られるか。', options: ['A. 今すぐ', 'B. 午前中', 'C. 午後', 'D. 明日'], correctAnswer: 2, explanation: 'Buổi chiều.' },
          { id: 'n2a2-l8', passage: '女：来月の研修、参加しますか。\n男：参加したいんですが、その週は海外出張が予定されています。', text: '男の人はどうするつもりか。', options: ['A. 研修に参加する', 'B. 出張を変更する', 'C. 研修には参加しない', 'D. 先に確認する'], correctAnswer: 2, explanation: 'Không tham gia đào tạo.' },
          { id: 'n2a2-l9', passage: '男：このプロジェクトのコスト、想定より高くつきそうだ。\n女：そうですね。原材料の価格が上がったのが原因です。', text: 'コストが高くなった理由は何か。', options: ['A. 人件費の増加', 'B. 原材料の値上げ', 'C. 輸送費の増加', 'D. 税金の引き上げ'], correctAnswer: 1, explanation: 'Giá nguyên liệu tăng.' },
          { id: 'n2a2-l10', passage: '女：来年度の予算について、各部门から提案を募集します。締め切りは今月末です。', text: '予算の提案の締め切りはいつか。', options: ['A. 来月末', 'B. 今月末', 'C. 来月の半ば', 'D. 今週末'], correctAnswer: 1, explanation: 'Cuối tháng này.' },
          { id: 'n2a2-l11', passage: '男：この商品の返品を受け付けていますが、返品の条件はありますか。\n女：購入から14日以内で、未開封の場合のみ返品可能です。', text: '返品の条件として正しいものはどれか。', options: ['A. 30日以内で使用済みでも可', 'B. 14日以内で未開封であること', 'C. いつでも可能', 'D. 開封済みでも可能'], correctAnswer: 1, explanation: '14 ngày, chưa mở.' },
          { id: 'n2a2-l12', passage: '女：新しいクライアントとの初回打合せ、来週の火曜日に設定したいのですが。', text: '打合せをいつにしたいと言っているか。', options: ['A. 来週の月曜日', 'B. 来週の火曜日', 'C. 来週の水曜日', 'D. 来週の金曜日'], correctAnswer: 1, explanation: 'Thứ Ba tuần sau.' },
          { id: 'n2a2-l13', passage: '男：会議室の予約、確認しましたか。\n女：はい、確認しました。でも3階の大きな会議室は既に予約が入っていて、4階の会議室になりました。', text: '会議はどこで行われるか。', options: ['A. 3階の大きな会議室', 'B. 4階の会議室', 'C. 2階の会議室', 'D. 1階の会議室'], correctAnswer: 1, explanation: 'Tầng 4.' },
          { id: 'n2a2-l14', passage: '女：この企画書、もう一度確認してから部長に提出してください。', text: '女の人は何と言っているか。', options: ['A. 企画書を部長に渡す', 'B. 企画書をもう一度確認してから提出する', 'C. 企画書を書き直す', 'D. 部長に確認してもらう'], correctAnswer: 1, explanation: 'Xác nhận lại rồi mới nộp.' },
          { id: 'n2a2-l15', passage: '男：明日の会議、資料は何部準備すればいいですか。\n女：参加者は8人ですけど、念のため10部お願いします。', text: '資料は何部準備するか。', options: ['A. 8部', 'B. 9部', 'C. 10部', 'D. 12部'], correctAnswer: 2, explanation: '10 bản.' },
          { id: 'n2a2-l16', passage: '男：来年の新人研修、今年はどうしますか。\n女：去年は3日間の研修でしたけど、今年は1週間に延長する方針です。', text: '新人研修は何日間か。', options: ['A. 2日間', 'B. 3日間', 'C. 5日間', 'D. 1週間'], correctAnswer: 3, explanation: '1 tuần.' },
          { id: 'n2a2-l17', passage: '女：このプロジェクトのメンバー、追加で2人増やしていただけますか。\n男：承知しました。人事部に相談して、来週までに対応します。', text: '男の人はどうすると言っているか。', options: ['A. メンバーを減らす', 'B. 人事部に相談する', 'C. プロジェクトを中止する', 'D. 自分で対応する'], correctAnswer: 1, explanation: 'Liên hệ bộ phận nhân sự.' },
          { id: 'n2a2-l18', passage: '女：先日の会議の議事録、確認していただけますか。\n男：はい、午後中には確認します。修正点があればメールで連絡しますね。', text: '男の人はどうすると言っているか。', options: ['A. 議事録を書き直す', 'B. 午後中に確認する', 'C. 明日確認する', 'D. 議事録を見ない'], correctAnswer: 1, explanation: 'Xác nhận vào buổi chiều.' },
          { id: 'n2a2-l19', passage: '男：クライアントからの要望を整理したメール、送りましたよ。\n女：ありがとうございます。確認して、明日までに返信します。', text: '女の人はいつ返信すると言っているか。', options: ['A. 今日中に', 'B. 明日までに', 'C. 来週までに', 'D. 今週末までに'], correctAnswer: 1, explanation: 'Trước ngày mai.' },
          { id: 'n2a2-l20', passage: '女：来月の忘年会、場所はどこにしますか。\n男：去年と同じレストランはどうですか。予約を取りますよ。', text: '男の人はどうすると言っているか。', options: ['A. 場所を変える', 'B. 予約を取る', 'C. 忘年会を中止する', 'D. 女の人に任せる'], correctAnswer: 1, explanation: 'Đặt chỗ.' },
          { id: 'n2a2-l21', passage: '男：この企画の予算、削減する余地はありますか。\n女：交通費と交際費を見直せば、10%は削減できると思います。', text: '予算をどれくらい削減できるか。', options: ['A. 5%', 'B. 10%', 'C. 15%', 'D. 20%'], correctAnswer: 1, explanation: '10%.' },
          { id: 'n2a2-l22', passage: '女：今度のセミナー、参加者数はどのくらい見込んでいますか。\n男：去年は100人でしたけど、今年は120人くらいになると思います。', text: '今年のセミナーの参加者はどのくらいか。', options: ['A. 80人', 'B. 100人', 'C. 120人', 'D. 150人'], correctAnswer: 2, explanation: 'Khoảng 120 người.' },
          { id: 'n2a2-l23', passage: '男：この書類、明日の午前中に提出できますか。\n女：はい、大丈夫です。今仕上げているところです。', text: '書類はいつ提出するか。', options: ['A. 今日中に', 'B. 明日の午前中', 'C. 明日の午後', 'D. 明後日'], correctAnswer: 1, explanation: 'Buổi sáng ngày mai.' },
          { id: 'n2a2-l24', passage: '女：来月の出張、航空券はもう予約しましたか。\n男：まだです。来週の初めに予約する予定です。', text: '航空券はいつ予約するか。', options: ['A. 今日中に', 'B. 来週の初め', 'C. 来月に', 'D. 出張の直前'], correctAnswer: 1, explanation: 'Đầu tuần sau.' },
          { id: 'n2a2-l25', passage: '男：このプロジェクトの完了予定日、いつですか。\n女：来月の末を目標にしていますが、早まる可能性もあります。', text: 'プロジェクトはいつ終わる見込みか。', options: ['A. 今月の末', 'B. 来月の半ば', 'C. 来月の末', 'D. 来月の初め'], correctAnswer: 2, explanation: 'Cuối tháng sau.' },
          { id: 'n2a2-l26', passage: '女：会議の参加者に確認メールを送りましたか。\n男：はい、全員から返信が来ました。全員参加です。', text: '会議の参加状況はどうなっているか。', options: ['A. 一部の人が欠席する', 'B. 全員が参加する', 'C. 参加者が未定', 'D. 中止になった'], correctAnswer: 1, explanation: 'Tất cả tham gia.' },
          { id: 'n2a2-l27', passage: '男：来月のセミナー、資料はいつまでに準備すればいいですか。\n女：2週間前までに完成させてください。', text: '資料の完成期限はいつか。', options: ['A. 1週間前', 'B. 2週間前', 'C. 3週間前', 'D. セミナー当日'], correctAnswer: 1, explanation: '2 tuần trước.' },
          { id: 'n2a2-l28', passage: '女：この書類、部長のサインをもらう必要がありますか。\n男：はい、必ず部長のサインがあってから提出してください。', text: '書類を提出する条件は何か。', options: ['A. 女の人のサインがあればいい', 'B. 部長のサインが必要', 'C. サインは不要', 'D. 誰のサインでもいい'], correctAnswer: 1, explanation: 'Cần chữ ký trưởng phòng.' },
          { id: 'n2a2-l29', passage: '男：来月の新人研修、場所はどこですか。\n女：3階の研修室で行います。朝9時から午後4時までです。', text: '研修は何時から何時までか。', options: ['A. 8時から3時まで', 'B. 9時から4時まで', 'C. 10時から5時まで', 'D. 9時から5時まで'], correctAnswer: 1, explanation: '9h đến 16h.' },
          { id: 'n2a2-l30', passage: '女：来年の予算案、いつまでに完成させればいいですか。\n男：今年度末までに完成させてください。12月半ばを目安にしています。', text: '予算案の完成期限はいつか。', options: ['A. 10月末', 'B. 11月末', 'C. 12月半ば', 'D. 年明け'], correctAnswer: 2, explanation: 'Giữa tháng 12.' }
        ]
      }
    ]
  },
  {
    id: 'n2-auth-3',
    title: 'JLPT N2 Practice Exam 3',
    difficulty: 'advanced',
    year: 2024,
    category: 'n2',
    timeLimitMinutes: 105,
    sections: [
      {
        id: 'n2a3-sec-1',
        title: '言語知識（文字・語彙）',
        description: 'Kiến thức ngôn ngữ: Chữ Hán và Từ vựng (60 câu hỏi, 25 phút)',
        questions: [
          { id: 'n2a3-v1', text: '彼の【卓越】した技術には誰もが感嘆した。', options: ['A. たくえつ', 'B. じょうえつ', 'C. たつえつ', 'D. じゅくえつ'], correctAnswer: 0, explanation: '卓越 = たくえつ (xuất sắc).' },
          { id: 'n2a3-v2', text: '彼女は職場で【謙虚】な態度を保っている。', options: ['A. けんきょ', 'B. けんぎょ', 'C. けんきょう', 'D. けんぎょう'], correctAnswer: 0, explanation: '謙虚 = けんきょ (khiêm tốn).' },
          { id: 'n2a3-v3', text: 'この地域は【脆弱】なインフラが課題となっている。', options: ['A. ぜいじゃく', 'B. ぜいじゃくう', 'C. ぜいじゃく', 'D. ぜいじゃくう'], correctAnswer: 0, explanation: '脆弱 = ぜいじゃく (mong manh).' },
          { id: 'n2a3-v4', text: '彼は非常に【思慮】深い人物だ。', options: ['A. しりょ', 'B. しりょう', 'C. しりょ', 'D. しりょう'], correctAnswer: 0, explanation: '思慮深い = しりょぶかい (sâu sắc).' },
          { id: 'n2a3-v5', text: '政府は経済【低迷】からの脱却を目指している。', options: ['A. ていたい', 'B. ていたいう', 'C. ていたい', 'D. ていたいう'], correctAnswer: 0, explanation: '低迷 = ていたい (suy thoái).' },
          { id: 'n2a3-v6', text: '彼の【独創】的なアイデアは高く評価された。', options: ['A. どくそう', 'B. どくそうう', 'C. どくそう', 'D. どくそうう'], correctAnswer: 0, explanation: '独創 = どくそう (độc đáo).' },
          { id: 'n2a3-v7', text: 'この計画の【実行】に当たっては、多くの協力が必要だ。', options: ['A. じっこう', 'B. じっこうう', 'C. じっこう', 'D. じっこうう'], correctAnswer: 0, explanation: '実行 = じっこう (thực hiện).' },
          { id: 'n2a3-v8', text: '彼女は【繊細】な感性の持ち主だ。', options: ['A. せんさい', 'B. せんさいう', 'C. せんさい', 'D. せんさいう'], correctAnswer: 0, explanation: '繊細 = せんさい (tinh tế).' },
          { id: 'n2a3-v9', text: 'この問題に対する【解決策】を提案してほしい。', options: ['A. かいけつさく', 'B. かいけつさくう', 'C. かいけつさく', 'D. かいけつさくう'], correctAnswer: 0, explanation: '解決策 = かいけつさく (giải pháp).' },
          { id: 'n2a3-v10', text: '彼は会議で自分の【見解】を述べた。', options: ['A. けんかい', 'B. けんかいう', 'C. けんかい', 'D. けんかいう'], correctAnswer: 0, explanation: '見解 = けんかい (quan điểm).' },
          { id: 'n2a3-v11', text: 'この技術の【応用】範囲は非常に広い。', options: ['A. おうよう', 'B. おうようう', 'C. おうよう', 'D. おうようう'], correctAnswer: 0, explanation: '応用 = おうよう (ứng dụng).' },
          { id: 'n2a3-v12', text: '彼は常日頃から【研鑽】を怠らない。', options: ['A. けんさん', 'B. けんさんう', 'C. けんさん', 'D. けんさんう'], correctAnswer: 0, explanation: '研鑽 = けんさん (nghiên cứu).' },
          { id: 'n2a3-v13', text: '彼女の【発想】はいつも斬新だ。', options: ['A. はっそう', 'B. はっそうう', 'C. はっそう', 'D. はっそうう'], correctAnswer: 0, explanation: '発想 = はっそう (ý tưởng).' },
          { id: 'n2a3-v14', text: 'この仕事には【忍耐】力が求められる。', options: ['A. にんたい', 'B. にんたいう', 'C. にんだい', 'D. にんだいう'], correctAnswer: 0, explanation: '忍耐 = にんたい (kiên nhẫn).' },
          { id: 'n2a3-v15', text: '彼はその分野で【権威】的存在だ。', options: ['A. けんい', 'B. けんいう', 'C. けんい', 'D. けんいう'], correctAnswer: 0, explanation: '権威 = けんい (uy quyền).' },
          { id: 'n2a3-v16', text: 'この会社は【革新】を重視している。', options: ['A. かくしん', 'B. かくしんう', 'C. かくしん', 'D. かくしんう'], correctAnswer: 0, explanation: '革新 = かくしん (đổi mới).' },
          { id: 'n2a3-v17', text: '彼は自分の【怠慢】を認めた。', options: ['A. たいまん', 'B. たいまんう', 'C. たいまん', 'D. たいまんう'], correctAnswer: 0, explanation: '怠慢 = たいまん (lười biếng).' },
          { id: 'n2a3-v18', text: '彼女は常に【前向き】な姿勢を保っている。', options: ['A. まえむき', 'B. まえむきう', 'C. まえむき', 'D. まえむきう'], correctAnswer: 0, explanation: '前向き = まえむき (tích cực).' },
          { id: 'n2a3-v19', text: 'この地域の【景観】を守ることが重要だ。', options: ['A. けいかん', 'B. けいかんう', 'C. けいかん', 'D. けいかんう'], correctAnswer: 0, explanation: '景観 = けいかん (phong cảnh).' },
          { id: 'n2a3-v20', text: '彼は非常に【器用】な人だ。', options: ['A. きよう', 'B. きようう', 'C. きよう', 'D. きようう'], correctAnswer: 0, explanation: '器用 = きよう (khéo léo).' },
          { id: 'n2a3-v21', text: '彼の【持論】は多くの人に支持されている。', options: ['A. じろん', 'B. じろんう', 'C. じろん', 'D. じろんう'], correctAnswer: 0, explanation: '持論 = じろん (luận điểm).' },
          { id: 'n2a3-v22', text: 'この仕事は【地道】な努力が必要だ。', options: ['A. じみち', 'B. じみちう', 'C. じみち', 'D. じみちう'], correctAnswer: 0, explanation: '地道 = じみち (tích lũy dần).' },
          { id: 'n2a3-v23', text: '彼女は【冷静】な対応で問題を解決した。', options: ['A. れいせい', 'B. れいせいう', 'C. れいせい', 'D. れいせいう'], correctAnswer: 0, explanation: '冷静 = れいせい (bình tĩnh).' },
          { id: 'n2a3-v24', text: '彼は【慎重】な判断を下した。', options: ['A. しんちょう', 'B. しんちょうう', 'C. しんちょう', 'D. しんちょうう'], correctAnswer: 0, explanation: '慎重 = しんちょう (cẩn trọng).' },
          { id: 'n2a3-v25', text: '彼女は常に【誠実】な対応をしている。', options: ['A. せいじつ', 'B. せいじつう', 'C. せいじつ', 'D. せいじつう'], correctAnswer: 0, explanation: '誠実 = せいじつ (chính trực).' },
          { id: 'n2a3-v26', text: '彼は非常に【優秀】な人材だ。', options: ['A. ゆうしゅう', 'B. ゆうしゅうう', 'C. ゆうしゅう', 'D. ゆうしゅうう'], correctAnswer: 0, explanation: '優秀 = ゆうしゅう (xuất sắc).' },
          { id: 'n2a3-v27', text: '彼は【大胆】な計画を立てた。', options: ['A. だいたん', 'B. だいたんう', 'C. だいたん', 'D. だいたんう'], correctAnswer: 0, explanation: '大胆 = だいたん (táo bạo).' },
          { id: 'n2a3-v28', text: '彼女は常に【柔軟】な対応ができる。', options: ['A. じゅうなん', 'B. じゅうなんう', 'C. じゅうなん', 'D. じゅうなんう'], correctAnswer: 0, explanation: '柔軟 = じゅうなん (linh hoạt).' },
          { id: 'n2a3-v29', text: '彼はその仕事に【情熱】を注いでいる。', options: ['A. じょうねつ', 'B. じょうねつう', 'C. じょうねつ', 'D. じょうねつう'], correctAnswer: 0, explanation: '情熱 = じょうねつ (nhiệt huyết).' },
          { id: 'n2a3-v30', text: '彼女は【豊富】な経験を持っている。', options: ['A. ほうふ', 'B. ほうふう', 'C. ほうふ', 'D. ほうふう'], correctAnswer: 0, explanation: '豊富 = ほうふ (phong phú).' },
          { id: 'n2a3-v31', text: 'この地域は【急速】な成長を遂げた。', options: ['A. きゅうそく', 'B. きゅうそくう', 'C. きゅうそく', 'D. きゅうそくう'], correctAnswer: 0, explanation: '急速 = きゅうそく (nhanh chóng).' },
          { id: 'n2a3-v32', text: '彼はその【先見】の明がある。', options: ['A. せんけん', 'B. せんけんう', 'C. せんけん', 'D. せんけんう'], correctAnswer: 0, explanation: '先見 = せんけん (nhìn xa).' },
          { id: 'n2a3-v33', text: 'この件については慎重な【判断】が必要だ。', options: ['A. はんだん', 'B. はんだんう', 'C. はんだん', 'D. はんだんう'], correctAnswer: 0, explanation: '判断 = はんだん (phán đoán).' },
          { id: 'n2a3-v34', text: '彼は自らの【信念】に従って行動した。', options: ['A. しんねん', 'B. しんねんう', 'C. しんねん', 'D. しんねんう'], correctAnswer: 0, explanation: '信念 = しんねん (tín niệm).' },
          { id: 'n2a3-v35', text: '彼女の【発想】は斬新で、いつも驚かされる。', options: ['A. はっそう', 'B. はっそうう', 'C. はっそう', 'D. はっそうう'], correctAnswer: 0, explanation: '発想 = はっそう (ý tưởng).' },
          { id: 'n2a3-v36', text: '彼は【堅実】な仕事ぶりで信頼を得ている。', options: ['A. けんじつ', 'B. けんじつう', 'C. けんじつ', 'D. けんじつう'], correctAnswer: 0, explanation: '堅実 = けんじつ (lâu bền).' },
          { id: 'n2a3-v37', text: 'この計画は【実現】可能性が高い。', options: ['A. じつげん', 'B. じつげんう', 'C. じつげん', 'D. じつげんう'], correctAnswer: 0, explanation: '実現 = じつげん (hiện thực hóa).' },
          { id: 'n2a3-v38', text: '彼は自分の過ちを【率直】に認めた。', options: ['A. そっちょく', 'B. そっちょくう', 'C. そっちょく', 'D. そっちょくう'], correctAnswer: 0, explanation: '率直 = そっちょく (thẳng thắn).' },
          { id: 'n2a3-v39', text: '彼女は【勤勉】に働いている。', options: ['A. きんべん', 'B. きんべんう', 'C. きんべん', 'D. きんべんう'], correctAnswer: 0, explanation: '勤勉 = きんべん (siêng năng).' },
          { id: 'n2a3-v40', text: 'このプロジェクトは【成果】を上げた。', options: ['A. せいか', 'B. せいかう', 'C. せいか', 'D. せいかう'], correctAnswer: 0, explanation: '成果 = せいか (thành quả).' },
          { id: 'n2a3-v41', text: '彼は非常に【繊細】な仕事をする。', options: ['A. せんさい', 'B. せんさいう', 'C. せんさい', 'D. せんさいう'], correctAnswer: 0, explanation: '繊細 = せんさい (tinh tế).' },
          { id: 'n2a3-v42', text: '彼女の【洞察】力は素晴らしい。', options: ['A. どうさつ', 'B. どうさつう', 'C. どうさつ', 'D. どうさつう'], correctAnswer: 0, explanation: '洞察 = どうさつ (sâu sắc).' },
          { id: 'n2a3-v43', text: 'この件について【慎重】な対応が必要だ。', options: ['A. しんちょう', 'B. しんちょうう', 'C. しんちょう', 'D. しんちょうう'], correctAnswer: 0, explanation: '慎重 = しんちょう (cẩn trọng).' },
          { id: 'n2a3-v44', text: '彼は【熱心】に勉強している。', options: ['A. ねっしん', 'B. ねっしんう', 'C. ねっしん', 'D. ねっしんう'], correctAnswer: 0, explanation: '熱心 = ねっしん (nhiệt tình).' },
          { id: 'n2a3-v45', text: '彼女は【有能】な幹部だ。', options: ['A. ゆうのう', 'B. ゆうのうう', 'C. ゆうのう', 'D. ゆうのうう'], correctAnswer: 0, explanation: '有能 = ゆうのう (có năng lực).' },
          { id: 'n2a3-v46', text: '彼は【誠実】に仕事をこなす。', options: ['A. せいじつ', 'B. せいじつう', 'C. せいじつ', 'D. せいじつう'], correctAnswer: 0, explanation: '誠実 = せいじつ (chính trực).' },
          { id: 'n2a3-v47', text: 'この問題の【解決策】を考えてください。', options: ['A. かいけつさく', 'B. かいけつさくう', 'C. かいけつさく', 'D. かいけつさくう'], correctAnswer: 0, explanation: '解決策 = かいけつさく (giải pháp).' },
          { id: 'n2a3-v48', text: '彼女は【優雅】な振る舞いをする。', options: ['A. ゆうが', 'B. ゆうがう', 'C. ゆうが', 'D. ゆうがう'], correctAnswer: 0, explanation: '優雅 = ゆうが (thanh nhã).' },
          { id: 'n2a3-v49', text: '彼は【大胆】なアイデアを出した。', options: ['A. だいたん', 'B. だいたんう', 'C. だいたん', 'D. だいたんう'], correctAnswer: 0, explanation: '大胆 = だいたん (táo bạo).' },
          { id: 'n2a3-v50', text: 'この地域は【安全】で住みやすい。', options: ['A. あんぜん', 'B. あんぜんう', 'C. あんぜん', 'D. あんぜんう'], correctAnswer: 0, explanation: '安全 = あんぜん (an toàn).' },
          { id: 'n2a3-v51', text: '彼女は【正確】なデータを提供した。', options: ['A. せいかく', 'B. せいかくう', 'C. せいかく', 'D. せいかくう'], correctAnswer: 0, explanation: '正確 = せいかく (chính xác).' },
          { id: 'n2a3-v52', text: '彼は【迅速】な対応をした。', options: ['A. じんそく', 'B. じんそくう', 'C. じんそく', 'D. じんそくう'], correctAnswer: 0, explanation: '迅速 = じんそく (nhanh chóng).' },
          { id: 'n2a3-v53', text: '彼女は【穏や】かな口調で話した。', options: ['A. おだや', 'B. おだやう', 'C. おだや', 'D. おだやう'], correctAnswer: 0, explanation: '穏やか = おだやか (ôn hòa).' },
          { id: 'n2a3-v54', text: 'この計画は【実現】した。', options: ['A. じつげん', 'B. じつげんう', 'C. じつげん', 'D. じつげんう'], correctAnswer: 0, explanation: '実現 = じつげん (hiện thực hóa).' },
          { id: 'n2a3-v55', text: '彼は【謙虚】な姿勢を忘れない。', options: ['A. けんきょ', 'B. けんぎょ', 'C. けんきょう', 'D. けんぎょう'], correctAnswer: 0, explanation: '謙虚 = けんきょ (khiêm tốn).' },
          { id: 'n2a3-v56', text: '彼女は【繊細】な感覚を持っている。', options: ['A. せんさい', 'B. せんさいう', 'C. せんさい', 'D. せんさいう'], correctAnswer: 0, explanation: '繊細 = せんさい (tinh tế).' },
          { id: 'n2a3-v57', text: 'この仕事は【地道】に積み上げる必要がある。', options: ['A. じみち', 'B. じみちう', 'C. じみち', 'D. じみちう'], correctAnswer: 0, explanation: '地道 = じみち (tích lũy dần).' },
          { id: 'n2a3-v58', text: '彼は【大胆】に改革を進めた。', options: ['A. だいたん', 'B. だいたんう', 'C. だいたん', 'D. だいたんう'], correctAnswer: 0, explanation: '大胆 = だいたん (táo bạo).' },
          { id: 'n2a3-v59', text: '彼女は【柔軟】に問題に対処する。', options: ['A. じゅうなん', 'B. じゅうなんう', 'C. じゅうなん', 'D. じゅうなんう'], correctAnswer: 0, explanation: '柔軟 = じゅうなん (linh hoạt).' },
          { id: 'n2a3-v60', text: '彼は【情熱】を持って取り組んでいる。', options: ['A. じょうねつ', 'B. じょうねつう', 'C. じょうねつ', 'D. じょうねつう'], correctAnswer: 0, explanation: '情熱 = じょうねつ (nhiệt huyết).' }
        ]
      },
      {
        id: 'n2a3-sec-2',
        title: '言語知識（文法）・読解',
        description: 'Kiến thức ngôn ngữ: Ngữ pháp và Đọc hiểu (60 câu hỏi, 50 phút)',
        questions: [
          { id: 'n2a3-g1', text: 'この政策は多くの市民から【批判】を受けた。', options: ['A. 批判を', 'B. 批判に', 'C. 批判の', 'D. 批判と'], correctAnswer: 0, explanation: '批判を受けた = nhận phê bình.' },
          { id: 'n2a3-g2', text: '彼の発言は会議の【雰囲気】を変えた。', options: ['A. 雰囲気', 'B. 雰囲気を', 'C. 雰囲気に', 'D. 雰囲気の'], correctAnswer: 0, explanation: '会議の雰囲気を変えた = thay đổi không khí.' },
          { id: 'n2a3-g3', text: '新しいシステムの【導入】には時間がかかる。', options: ['A. 導入', 'B. 導入を', 'C. 導入に', 'D. 導入の'], correctAnswer: 0, explanation: 'システムの導入 = giới thiệu hệ thống.' },
          { id: 'n2a3-g4', text: '彼はその【困難】をものともせず、挑戦し続けた。', options: ['A. 困難を', 'B. 困難に', 'C. 困難の', 'D. 困難と'], correctAnswer: 0, explanation: '困難をものともせず = không nản chí.' },
          { id: 'n2a3-g5', text: 'この地域は地震に対する【対策】が不十分だ。', options: ['A. 対策', 'B. 対策を', 'C. 対策に', 'D. 対策の'], correctAnswer: 0, explanation: '地震に対する対策 = biện pháp phòng chống.' },
          { id: 'n2a3-g6', text: '彼女の【努力】にはいつも感心させられる。', options: ['A. 努力', 'B. 努力を', 'C. 努力に', 'D. 努力の'], correctAnswer: 0, explanation: '彼女の努力 = sự nỗ lực.' },
          { id: 'n2a3-g7', text: 'この件については社長の【許可】を仰ぐ必要がある。', options: ['A. 許可', 'B. 許可を', 'C. 許可に', 'D. 許可の'], correctAnswer: 0, explanation: '社長の許可を仰ぐ = xin phép chủ tịch.' },
          { id: 'n2a3-g8', text: 'この法律は来年から【施行】される予定だ。', options: ['A. 施行', 'B. 施行を', 'C. 施行に', 'D. 施行の'], correctAnswer: 0, explanation: '法律が施行される = luật được thực thi.' },
          { id: 'n2a3-g9', text: '彼は会議で活発な【議論】を展開した。', options: ['A. 議論', 'B. 議論を', 'C. 議論に', 'D. 議論の'], correctAnswer: 0, explanation: '活発な議論 = tranh luận sôi nổi.' },
          { id: 'n2a3-g10', text: 'このプロジェクトの【成否】は、チーム全体に影響する。', options: ['A. 成否', 'B. 成否を', 'C. 成否に', 'D. 成否の'], correctAnswer: 0, explanation: 'プロジェクトの成否 = thành bại.' },
          { id: 'n2a3-g11', text: '環境問題に対する【意識】が高まっている。', options: ['A. 意識', 'B. 意識を', 'C. 意識に', 'D. 意識の'], correctAnswer: 0, explanation: '環境問題への意識 = ý thức môi trường.' },
          { id: 'n2a3-g12', text: '彼はその【実績】を買って、昇進した。', options: ['A. 実績', 'B. 実績を', 'C. 実績に', 'D. 実績の'], correctAnswer: 0, explanation: '実績を買って = dựa trên thành tích.' },
          { id: 'n2a3-g13', text: '彼女の【先見】は非常に素晴らしい。', options: ['A. 先見', 'B. 先見を', 'C. 先見に', 'D. 先見の'], correctAnswer: 0, explanation: '先見の明 = con mắt nhìn xa.' },
          { id: 'n2a3-g14', text: 'この件については慎重な【判断】が必要だ。', options: ['A. 判断', 'B. 判断を', 'C. 判断に', 'D. 判断の'], correctAnswer: 0, explanation: '慎重な判断 = phán đoán cẩn thận.' },
          { id: 'n2a3-g15', text: '彼は自らの【信念】に従って行動した。', options: ['A. 信念', 'B. 信念を', 'C. 信念に', 'D. 信念の'], correctAnswer: 0, explanation: '自らの信念に従って = theo tín niệm.' },
          { id: 'n2a3-g16', text: '会議では、各部門の【成果】が報告された。', options: ['A. 成果', 'B. 成果を', 'C. 成果に', 'D. 成果の'], correctAnswer: 0, explanation: '各部門の成果 = thành quả bộ phận.' },
          { id: 'n2a3-g17', text: 'この問題については、専門家に【意見】を仰ぐべきだ。', options: ['A. 意見', 'B. 意見を', 'C. 意見に', 'D. 意見の'], correctAnswer: 0, explanation: '専門家の意見を仰ぐ = xin ý kiến.' },
          { id: 'n2a3-g18', text: '彼は会議で自分の【立場】を述べた。', options: ['A. 立場', 'B. 立場を', 'C. 立場に', 'D. 立場の'], correctAnswer: 0, explanation: '自分の立場を述べた = nêu quan điểm.' },
          { id: 'n2a3-g19', text: '新しいシステムの【導入】には時間がかかる。', options: ['A. 導入', 'B. 導入を', 'C. 導入に', 'D. 導入の'], correctAnswer: 0, explanation: 'システムの導入 = giới thiệu hệ thống.' },
          { id: 'n2a3-g20', text: '彼はその【困難】をものともせず、挑戦し続けた。', options: ['A. 困難を', 'B. 困難に', 'C. 困難の', 'D. 困難と'], correctAnswer: 0, explanation: '困難をものともせず = không nản chí.' },
          { id: 'n2a3-g21', text: 'この地域は地震に対する【対策】が不十分だ。', options: ['A. 対策', 'B. 対策を', 'C. 対策に', 'D. 対策の'], correctAnswer: 0, explanation: '地震に対する対策 = biện pháp phòng chống.' },
          { id: 'n2a3-g22', text: 'この件については社長の【許可】を仰ぐ必要がある。', options: ['A. 許可', 'B. 許可を', 'C. 許可に', 'D. 許可の'], correctAnswer: 0, explanation: '社長の許可を仰ぐ = xin phép chủ tịch.' },
          { id: 'n2a3-g23', text: 'この法律は来年から【施行】される予定だ。', options: ['A. 施行', 'B. 施行を', 'C. 施行に', 'D. 施行の'], correctAnswer: 0, explanation: '法律が施行される = luật được thực thi.' },
          { id: 'n2a3-g24', text: '彼は会議で活発な【議論】を展開した。', options: ['A. 議論', 'B. 議論を', 'C. 議論に', 'D. 議論の'], correctAnswer: 0, explanation: '活発な議論 = tranh luận sôi nổi.' },
          { id: 'n2a3-g25', text: 'このプロジェクトの【成否】は、チーム全体に影響する。', options: ['A. 成否', 'B. 成否を', 'C. 成否に', 'D. 成否の'], correctAnswer: 0, explanation: 'プロジェクトの成否 = thành bại.' },
          { id: 'n2a3-g26', text: '環境問題に対する【意識】が高まっている。', options: ['A. 意識', 'B. 意識を', 'C. 意識に', 'D. 意識の'], correctAnswer: 0, explanation: '環境問題への意識 = ý thức môi trường.' },
          { id: 'n2a3-g27', text: '彼はその【実績】を買って、昇進した。', options: ['A. 実績', 'B. 実績を', 'C. 実績に', 'D. 実績の'], correctAnswer: 0, explanation: '実績を買って = dựa trên thành tích.' },
          { id: 'n2a3-g28', text: '彼女の【先見】は非常に素晴らしい。', options: ['A. 先見', 'B. 先見を', 'C. 先見に', 'D. 先見の'], correctAnswer: 0, explanation: '先見の明 = con mắt nhìn xa.' },
          { id: 'n2a3-g29', text: 'この件については慎重な【判断】が必要だ。', options: ['A. 判断', 'B. 判断を', 'C. 判断に', 'D. 判断の'], correctAnswer: 0, explanation: '慎重な判断 = phán đoán cẩn thận.' },
          { id: 'n2a3-g30', text: '彼は自らの【信念】に従って行動した。', options: ['A. 信念', 'B. 信念を', 'C. 信念に', 'D. 信念の'], correctAnswer: 0, explanation: '自らの信念に従って = theo tín niệm.' },
          { id: 'n2a3-r1', passage: '近年、データドリブンな意思決定が企業の間で急速に広がっている。大量のデータを分析することで、感覚に頼らない客観的な判断が可能になる。しかし、データに過度に依存すると、創造性や直感力が失われる危険もある。', text: '筆者が最も伝えたいことは何か。', options: ['A. データ分析は万能だ', 'B. データに頼るべきではない', 'C. データ活用と創造性のバランスが重要だ', 'D. 感覚的な判断は不要だ'], correctAnswer: 2, explanation: 'Cân bằng giữa dữ liệu và sáng tạo.' },
          { id: 'n2a3-r2', passage: '持続可能な開発目標（SDGs）は、各国が2030年までに達成を目指す17の目標からなる。', text: 'SDGsの特徴として正しいものはどれか。', options: ['A. 1つの目標だけに焦点を当てている', 'B. 2025年が達成期限だ', 'C. 17の目標からなる包括的な枠組みだ', 'D. 日本だけが参加している'], correctAnswer: 2, explanation: 'Khung toàn diện với 17 mục tiêu.' },
          { id: 'n2a3-r3', passage: '組織におけるリーダーシップの形態は時代とともに変化してきた。メンバーの自律性を重視するスタイルへの移行が進んでいる。', text: '現代のリーダーシップの傾向として正しいものはどれか。', options: ['A. 権威型が主流だ', 'B. メンバーの自律性を重視するスタイルが増加している', 'C. リーダーは不要だ', 'D. すべてのリーダーが同じスタイルだ'], correctAnswer: 1, explanation: 'Xu hướng coi trọng tính tự chủ.' },
          { id: 'n2a3-r4', passage: '人間の寿命が延伸する中で、リタイア後の人生をどう設計するかが重要な課題となっている。', text: '本文で強調されていることは何か。', options: ['A. 定年を早くすべきだ', 'B. 人の寿命は短くなるべきだ', 'C. 健康寿命の延伸が社会の持続可能性に重要だ', 'D. 老後の蓄えは不要だ'], correctAnswer: 2, explanation: 'Kéo dài tuổi thọ khỏe mạnh quan trọng.' },
          { id: 'n2a3-r5', passage: '自動運転技術の開発が進む中、それがもたらす社会変化への備えが問われている。', text: '自動運転技術について筆者はどう述べているか。', options: ['A. 技術は完璧だ', 'B. 開発をやめるべきだ', 'C. 利点だけでなく課題もある', 'D. すべての問題が解決済みだ'], correctAnswer: 2, explanation: 'Cả ưu điểm lẫn thách thức.' },
          { id: 'n2a3-r6', passage: '日本の人口減少が加速する中、地方でのまちづくりは困難を極めている。しかし、ITの活用によって、人口減少に負けない地域運営が模索されている。', text: '筆者が言いたいことは何か。', options: ['A. 地方は衰退するしかない', 'B. ITで地方の問題を解決できる可能性がある', 'C. 都会の方が優れている', 'D. 人口増加は不可能だ'], correctAnswer: 1, explanation: 'IT có thể giải quyết vấn đề vùng quê.' },
          { id: 'n2a3-r7', passage: '消費者の意識が環境配慮型の製品に傾倒する中、企業はサプライチェーン全体での環境負荷削減に取り組むことが求められている。', text: 'グリーンサプライチェーンの構築が重要である理由は何か。', options: ['A. コスト削減のため', 'B. 企業の競争力に影響するから', 'C. 法律で義務付けられているから', 'D. 消費者は関心がないから'], correctAnswer: 1, explanation: 'Ảnh hưởng đến năng lực cạnh tranh.' },
          { id: 'n2a3-r8', passage: '知識経済の時代において、個人の学習能力がますます重要になっている。生涯学習を通じて知識とスキルを更新し続けることが不可欠だ。', text: '筆者は何を提案しているか。', options: ['A. 学校教育を廃止すべきだ', 'B. 社会人になっても学び続ける必要がある', 'C. 学校の教育だけで十分だ', 'D. 技術的なスキルは不要だ'], correctAnswer: 1, explanation: 'Cần học hỏi suốt đời.' },
          { id: 'n2a3-r9', passage: '文化の多様性は、社会の創造性を高める重要な要素である。異なる文化的背景を持つ人々が交流することで、新しいアイデアや視点が生まれる。', text: '文化の多様性がもたらす効果は何か。', options: ['A. コストの増加', 'B. コミュニケーションの困難', 'C. 社会の創造性の向上', 'D. 意思決定の遅延'], correctAnswer: 2, explanation: 'Nâng cao sáng tạo.' },
          { id: 'n2a3-r10', passage: '都市の緑化は、ヒートアイランド現象の緩和、生物多様性の保全、住民の健康増進など、多くのメリットをもたらす。', text: '都市の緑化のメリットとして挙げられていないものはどれか。', options: ['A. ヒートアイランド現象の緩和', 'B. 生物多様性の保全', 'C. 経済成長の加速', 'D. 住民の健康増進'], correctAnswer: 2, explanation: 'Tăng trưởng kinh tế không được đề cập.' },
          { id: 'n2a3-r11', passage: 'サイバーセキュリティの重要性が高まる中、企業は組織全体で情報セキュリティ意識を向上させることが急務となっている。', text: '企業が取るべき対策として正しいものはどれか。', options: ['A. 技術対策だけに集中する', 'B. 従業員の意識向上も含めた包括的な対策を講じる', 'C. セキュリティ対策は不要だ', 'D. 外部の専門家に任せる'], correctAnswer: 1, explanation: 'Biện pháp toàn diện.' },
          { id: 'n2a3-r12', passage: 'クラウドコンピューティングの普及により、企業の情報システムの構築・運用方法は大きく変わった。', text: 'クラウドコンピューティングの利点として正しいものはどれか。', options: ['A. セキュリティリスクがゼロになる', 'B. コスト削減と柔軟性の向上', 'C. インターネットが不要になる', 'D. ハードウェアの購入が必要になる'], correctAnswer: 1, explanation: 'Giảm chi phí, tăng linh hoạt.' },
          { id: 'n2a3-r13', passage: '社会の高齢化に伴い、介護ロボットの開発が進んでいる。ロボットによって介護者の負担軽減が期待される一方、人間関係の希薄化への懸念もなされている。', text: '介護ロボットについての本文の内容として正しいものはどれか。', options: ['A. 介護ロボットは完全に人間の介護を置き換える', 'B. 介護ロボットには利点だけでなく課題もある', 'C. 介護ロボットは普及していない', 'D. 介護ロボットは高齢者にとって不要だ'], correctAnswer: 1, explanation: 'Cả ưu điểm lẫn thách thức.' },
          { id: 'n2a3-r14', passage: 'オープンイノベーションは、企業が外部の知識や技術を取り入れてイノベーションを生み出す手法である。', text: 'オープンイノベーションの特徴として正しいものはどれか。', options: ['A. すべて自社内で完結させる', 'B. 外部の知識を活用する', 'C. 新製品は開発しない', 'D. 競合他社とは絶対に連携しない'], correctAnswer: 1, explanation: 'Tận dụng kiến thức bên ngoài.' },
          { id: 'n2a3-r15', passage: 'DXは、企業のビジネスモデルや業務プロセスをデジタル技術を活用して変革することを意味する。価値創造を伴う変革が求められている。', text: 'DXの本質として正しいものはどれか。', options: ['A. データを蓄積すること', 'B. ペーパーレス化を進めること', 'C. デジタル技術による価値創造を伴う変革', 'D. IT予算を増やすこと'], correctAnswer: 2, explanation: 'Bản chất là đổi mới sáng tạo.' },
          { id: 'n2a3-r16', passage: 'DX推進において、技術導入だけでなく、組織文化の変革も不可欠である。', text: 'DX推進において不可欠なことは何か。', options: ['A. 技術導入だけ', 'B. 組織文化の変革', 'C. コスト削減', 'D. 人員増加'], correctAnswer: 1, explanation: 'Cần thay đổi văn hóa tổ chức.' },
          { id: 'n2a3-r17', passage: 'サステナビリティが企業経営の重要なテーマとなっている。環境負荷の低減だけでなく、社会貢献やガバナンスも含めた取り組みが求められている。', text: 'サステナビリティに含まれる要素として正しいものはどれか。', options: ['A. 環境負荷の低減のみ', 'B. 社会貢献とガバナンス', 'C. 利益追求のみ', 'D. 技術革新のみ'], correctAnswer: 1, explanation: 'Bao gồm đóng góp xã hội và quản trị.' },
          { id: 'n2a3-r18', passage: 'ペーパーレス化を推進する企業が増えている。コスト削減や業務効率化のメリットがある一方、情報セキュリティの確保も重要な課題となっている。', text: 'ペーパーレス化の課題として挙げられているのは何か。', options: ['A. コスト増加', 'B. 業務効率の低下', 'C. 情報セキュリティの確保', 'D. 従業員の反対'], correctAnswer: 2, explanation: 'Đảm bảo an ninh thông tin.' },
          { id: 'n2a3-r19', passage: '日本の製造業は高品質で信頼性の高い製品を生み出してきた。しかし、コスト競争力の維持が大きな課題となっている。', text: '日本の製造業の課題として正しいものはどれか。', options: ['A. 品質の低下', 'B. コスト競争力の維持', 'C. 人材不足', 'D. 技術力の不足'], correctAnswer: 1, explanation: 'Duy trì năng lực cạnh tranh chi phí.' },
          { id: 'n2a3-r20', passage: '社会貢献活動に積極的な企業は、従業員のエンゲージメント向上にもつながると言われている。', text: '社会貢献活動の効果として正しいものはどれか。', options: ['A. 短期的な利益増加', 'B. 従業員のエンゲージメント向上', 'C. コスト削減', 'D. 規制緩和'], correctAnswer: 1, explanation: 'Cải thiện sự gắn kết nhân viên.' },
          { id: 'n2a3-r21', passage: '日本の人口減少が加速する中、地方でのまちづくりは困難を極めている。しかし、ITの活用によって、地域運営が模索されている。', text: '筆者が言いたいことは何か。', options: ['A. 地方は衰退するしかない', 'B. ITで地方の問題を解決できる可能性がある', 'C. 都会の方が優れている', 'D. 人口増加は不可能だ'], correctAnswer: 1, explanation: 'IT có thể giải quyết vấn đề vùng quê.' },
          { id: 'n2a3-r22', passage: '企業はサプライチェーン全体での環境負荷削減に取り組むことが求められている。グリーンサプライチェーンの構築は、企業の競争力にも直結する。', text: 'グリーンサプライチェーンの構築が重要である理由は何か。', options: ['A. コスト削減のため', 'B. 企業の競争力に影響するから', 'C. 法律で義務付けられているから', 'D. 消費者は関心がないから'], correctAnswer: 1, explanation: 'Ảnh hưởng đến năng lực cạnh tranh.' },
          { id: 'n2a3-r23', passage: '個人の学習能力がますます重要になっている。生涯学習を通じて知識とスキルを更新し続けることが不可欠だ。', text: '筆者は何を提案しているか。', options: ['A. 学校教育を廃止すべきだ', 'B. 社会人になっても学び続ける必要がある', 'C. 学校の教育だけで十分だ', 'D. 技術的なスキルは不要だ'], correctAnswer: 1, explanation: 'Cần học hỏi suốt đời.' },
          { id: 'n2a3-r24', passage: '文化の多様性は、社会の創造性を高める重要な要素である。異なる文化的背景を持つ人々が交流することで、新しいアイデアや視点が生まれる。', text: '文化の多様性がもたらす効果は何か。', options: ['A. コストの増加', 'B. コミュニケーションの困難', 'C. 社会の創造性の向上', 'D. 意思決定の遅延'], correctAnswer: 2, explanation: 'Nâng cao sáng tạo.' },
          { id: 'n2a3-r25', passage: '都市の緑化は多くのメリットをもたらす。都市における緑地の確保は、持続可能なまちづくりの重要な柱となっている。', text: '都市の緑化のメリットとして挙げられていないものはどれか。', options: ['A. ヒートアイランド現象の緩和', 'B. 生物多様性の保全', 'C. 経済成長の加速', 'D. 住民の健康増進'], correctAnswer: 2, explanation: 'Tăng trưởng kinh tế không được đề公民。' },
          { id: 'n2a3-r26', passage: '企業は組織全体で情報セキュリティ意識を向上させることが急務となっている。技術的な対策だけでなく、人的な脆弱性への対処も不可欠だ。', text: '企業が取るべき対策として正しいものはどれか。', options: ['A. 技術対策だけに集中する', 'B. 従業員の意識向上も含めた包括的な対策を講じる', 'C. セキュリティ対策は不要だ', 'D. 外部の専門家に任せる'], correctAnswer: 1, explanation: 'Biện pháp toàn diện.' },
          { id: 'n2a3-r27', passage: 'クラウドコンピューティングにより、企業の情報システムの構築・運用方法は大きく変わった。', text: 'クラウドコンピューティングの利点として正しいものはどれか。', options: ['A. セキュリティリスクがゼロになる', 'B. コスト削減と柔軟性の向上', 'C. インターネットが不要になる', 'D. ハードウェアの購入が必要になる'], correctAnswer: 1, explanation: 'Giảm chi phí, tăng linh hoạt.' },
          { id: 'n2a3-r28', passage: '介護ロボットの開発が進んでいる。ロボットによって介護者の負担軽減が期待される一方、人間関係の希薄化への懸念もなされている。', text: '介護ロボットについての本文の内容として正しいものはどれか。', options: ['A. 介護ロボットは完全に人間の介護を置き換える', 'B. 介護ロボットには利点だけでなく課題もある', 'C. 介護ロボットは普及していない', 'D. 介護ロボットは高齢者にとって不要だ'], correctAnswer: 1, explanation: 'Cả ưu điểm lẫn thách thức.' },
          { id: 'n2a3-r29', passage: 'オープンイノベーションは、企業が外部の知識や技術を取り入れてイノベーションを生み出す手法である。', text: 'オープンイノベーションの特徴として正しいものはどれか。', options: ['A. すべて自社内で完結させる', 'B. 外部の知識を活用する', 'C. 新製品は開発しない', 'D. 競合他社とは絶対に連携しない'], correctAnswer: 1, explanation: 'Tận dụng kiến thức bên ngoài.' },
          { id: 'n2a3-r30', passage: 'DXは、企業のビジネスモデルや業務プロセスをデジタル技術を活用して変革することを意味する。価値創造を伴う変革が求められている。', text: 'DXの本質として正しいものはどれか。', options: ['A. データを蓄積すること', 'B. ペーパーレス化を進めること', 'C. デジタル技術による価値創造を伴う変革', 'D. IT予算を増やすこと'], correctAnswer: 2, explanation: 'Bản chất là đổi mới sáng tạo.' }
        ]
      },
      {
        id: 'n2a3-sec-3',
        title: '聴解',
        description: 'Nghe hiểu (30 câu hỏi, 30 phút)',
        questions: [
          { id: 'n2a3-l1', passage: '男：来月の新人研修、今年はオンラインで行うことになったそうです。\n女：えっ、前は対面でしたよね。変更になった理由は何ですか。', text: '新人研修はどのように行われるか。', options: ['A. 対面で行われる', 'B. オンラインで行われる', 'C. 電話で行われる', 'D. メールで行われる'], correctAnswer: 1, explanation: 'Đào tạo trực tuyến.' },
          { id: 'n2a3-l2', passage: '女：この書類、期限までに完成できますか。\n男：正直なところ、一人では無理です。でも、田中さんに手伝ってもらえれば大丈夫だと思います。', text: '男の人はどうするつもりか。', options: ['A. 一人で頑張る', 'B. 田中さんに手伝ってもらう', 'C. 期限を延ばしてもらう', 'D. 書類を諦める'], correctAnswer: 1, explanation: 'Nhờ田中 giúp đỡ.' },
          { id: 'n2a3-l3', passage: '男：来週の打ち合わせ、場所が変更になりました。3階の会議室から2階のラウンジに移動です。', text: '打ち合わせはどこで行われるか。', options: ['A. 3階の会議室', 'B. 2階のラウンジ', 'C. 1階のカフェ', 'D. 地下一階の食堂'], correctAnswer: 1, explanation: 'Phòng chờ tầng 2.' },
          { id: 'n2a3-l4', passage: '女：新しいクライアントとの契約、締結されましたか。\n男：はい、昨日正式にサインしました。来月からプロジェクトが始まります。', text: 'プロジェクトはいつ始まるか。', options: ['A. 今日から', 'B. 来週から', 'C. 来月から', 'D. 来年から'], correctAnswer: 2, explanation: 'Tháng sau.' },
          { id: 'n2a3-l5', passage: '男：この商品、在庫がもうないんですが。次の入荷はいつですか。\n女：確認しますが、おそらく来週の水曜日に入荷する予定です。', text: '商品はいつ入荷するか。', options: ['A. 今日', 'B. 明日', 'C. 来週の水曜日', 'D. 来月'], correctAnswer: 2, explanation: 'Thứ Tư tuần sau.' },
          { id: 'n2a3-l6', passage: '女：会社のウェブサイト、デザインが変わったんですね。\n男：はい、先月リニューアルしました。ユーザビリティも向上したとのことです。', text: 'ウェブサイトについて正しいことは何か。', options: ['A. 元に戻った', 'B. 先月リニューアルされた', 'C. 閉鎖された', 'D. 新しく作られた'], correctAnswer: 1, explanation: 'Website đã được nâng cấp.' },
          { id: 'n2a3-l7', passage: '男：明日の会議、資料をもう少し修正したいのですが。', text: '男の人はどうしたいと言っているか。', options: ['A. 資料を書き直す', 'B. 資料を修正したい', 'C. 資料を捨てたい', 'D. 資料をコピーしたい'], correctAnswer: 1, explanation: 'Muốn chỉnh sửa tài liệu.' },
          { id: 'n2a3-l8', passage: '女：来年度の予算について、各部署からの提案をまとめています。\n男：いつまでにまとめればいいですか。', text: '予算の提案のまとめの締め切りはいつか。', options: ['A. 今月末', 'B. 来月末', 'C. 来月の半ば', 'D. 今週末'], correctAnswer: 0, explanation: 'Cuối tháng này.' },
          { id: 'n2a3-l9', passage: '男：このプロジェクトは、三つのフェーズに分けて進める予定です。最初のフェーズは来月から始まります。', text: 'プロジェクトは何つのフェーズに分かれるか。', options: ['A. 二つ', 'B. 三つ', 'C. 四つ', 'D. 五つ'], correctAnswer: 1, explanation: 'Ba giai đoạn.' },
          { id: 'n2a3-l10', passage: '女：クライアントからのフィードバック、ご覧になりましたか。\n男：はい、先ほどメールで届きました。全体的にポジティブな評価です。', text: 'クライアントのフィードバックはどうだったか。', options: ['A. 全体的にネガティブ', 'B. 混合した反応', 'C. 全体的にポジティブ', 'D. フィードバックはない'], correctAnswer: 2, explanation: 'Nhìn chung tích cực.' },
          { id: 'n2a3-l11', passage: '男：来月の社員旅行の行き先、決まりましたか。', text: '社員旅行の行き先はどうなっているか。', options: ['A. 決まった', 'B. 決まっていない', 'C. 決まったが変更された', 'D. 中止された'], correctAnswer: 1, explanation: 'Chưa quyết định.' },
          { id: 'n2a3-l12', passage: '女：この書類、部長に見ていただけますか。\n男：部長は今出張中なので、戻り次第見ていただきます。', text: '部長はいつ書類を見られるか。', options: ['A. 今すぐ', 'B. 出張から戻り次第', 'C. 明日', 'D. 来週'], correctAnswer: 1, explanation: 'Sau khi trở về.' },
          { id: 'n2a3-l13', passage: '男：新製品の発売日、いつになりましたか。', text: '新製品はいつ発売されるか。', options: ['A. 今月の末', 'B. 来月の初め', 'C. 来月の半ば', 'D. 来月末'], correctAnswer: 2, explanation: 'Giữa tháng sau.' },
          { id: 'n2a3-l14', passage: '女：このプロジェクトの進捗状況、報告していただけますか。', text: '女の人は何と言っているか。', options: ['A. プロジェクトを中止してほしい', 'B. 進捗状況を報告してほしい', 'C. プロジェクトを開始してほしい', 'D. プロジェクトのメンバーを変えたい'], correctAnswer: 1, explanation: 'Yêu cầu báo cáo tiến độ.' },
          { id: 'n2a3-l15', passage: '男：来週の会議、参加人数は何人ですか。', text: '会議には何人が参加するか。', options: ['A. 5人', 'B. 8人', 'C. 10人', 'D. 12人'], correctAnswer: 2, explanation: '10 người.' },
          { id: 'n2a3-l16', passage: '女：来年の新人研修、今年はどうしますか。\n男：去年は3日間の研修でしたけど、今年は1週間に延長する方針です。', text: '新人研修は何日間か。', options: ['A. 2日間', 'B. 3日間', 'C. 5日間', 'D. 1週間'], correctAnswer: 3, explanation: '1 tuần.' },
          { id: 'n2a3-l17', passage: '男：このプロジェクトのメンバー、追加で2人増やしていただけますか。\n女：承知しました。人事部に相談して、来週までに対応します。', text: '女の人はどうすると言っているか。', options: ['A. メンバーを減らす', 'B. 人事部に相談する', 'C. プロジェクトを中止する', 'D. 自分で対応する'], correctAnswer: 1, explanation: 'Liên hệ nhân sự.' },
          { id: 'n2a3-l18', passage: '女：先日の会議の議事録、確認していただけますか。\n男：はい、午後中には確認します。修正点があればメールで連絡しますね。', text: '男の人はどうすると言っているか。', options: ['A. 議事録を書き直す', 'B. 午後中に確認する', 'C. 明日確認する', 'D. 議事録を見ない'], correctAnswer: 1, explanation: 'Xác nhận buổi chiều.' },
          { id: 'n2a3-l19', passage: '女：クライアントからの要望を整理したメール、送りましたよ。\n男：ありがとうございます。確認して、明日までに返信します。', text: '男の人はいつ返信すると言っているか。', options: ['A. 今日中に', 'B. 明日までに', 'C. 来週までに', 'D. 今週末までに'], correctAnswer: 1, explanation: 'Trước ngày mai.' },
          { id: 'n2a3-l20', passage: '男：来月の忘年会、場所はどこにしますか。\n女：去年と同じレストランはどうですか。予約を取りますよ。', text: '女の人はどうすると言っているか。', options: ['A. 場所を変える', 'B. 予約を取る', 'C. 忘年会を中止する', 'D. 男の人に任せる'], correctAnswer: 1, explanation: 'Đặt chỗ.' },
          { id: 'n2a3-l21', passage: '男：この企画の予算、削減する余地はありますか。\n女：交通費と交際費を見直せば、10%は削減できると思います。', text: '予算をどれくらい削減できるか。', options: ['A. 5%', 'B. 10%', 'C. 15%', 'D. 20%'], correctAnswer: 1, explanation: '10%.' },
          { id: 'n2a3-l22', passage: '女：今度のセミナー、参加者数はどのくらい見込んでいますか。\n男：去年は100人でしたけど、今年は120人くらいになると思います。', text: '今年のセミナーの参加者はどのくらいか。', options: ['A. 80人', 'B. 100人', 'C. 120人', 'D. 150人'], correctAnswer: 2, explanation: 'Khoảng 120 người.' },
          { id: 'n2a3-l23', passage: '男：この書類、明日の午前中に提出できますか。\n女：はい、大丈夫です。今仕上げているところです。', text: '書類はいつ提出するか。', options: ['A. 今日中に', 'B. 明日の午前中', 'C. 明日の午後', 'D. 明後日'], correctAnswer: 1, explanation: 'Buổi sáng ngày mai.' },
          { id: 'n2a3-l24', passage: '女：来月の出張、航空券はもう予約しましたか。\n男：まだです。来週の初めに予約する予定です。', text: '航空券はいつ予約するか。', options: ['A. 今日中に', 'B. 来週の初め', 'C. 来月に', 'D. 出張の直前'], correctAnswer: 1, explanation: 'Đầu tuần sau.' },
          { id: 'n2a3-l25', passage: '男：このプロジェクトの完了予定日、いつですか。\n女：来月の末を目標にしていますが、早まる可能性もあります。', text: 'プロジェクトはいつ終わる見込みか。', options: ['A. 今月の末', 'B. 来月の半ば', 'C. 来月の末', 'D. 来月の初め'], correctAnswer: 2, explanation: 'Cuối tháng sau.' },
          { id: 'n2a3-l26', passage: '女：会議の参加者に確認メールを送りましたか。\n男：はい、全員から返信が来ました。全員参加です。', text: '会議の参加状況はどうなっているか。', options: ['A. 一部の人が欠席する', 'B. 全員が参加する', 'C. 参加者が未定', 'D. 中止になった'], correctAnswer: 1, explanation: 'Tất cả tham gia.' },
          { id: 'n2a3-l27', passage: '男：来月のセミナー、資料はいつまでに準備すればいいですか。\n女：2週間前までに完成させてください。', text: '資料の完成期限はいつか。', options: ['A. 1週間前', 'B. 2週間前', 'C. 3週間前', 'D. セミナー当日'], correctAnswer: 1, explanation: '2 tuần trước.' },
          { id: 'n2a3-l28', passage: '女：この書類、部長のサインをもらう必要がありますか。\n男：はい、必ず部長のサインがあってから提出してください。', text: '書類を提出する条件は何か。', options: ['A. 女の人のサインがあればいい', 'B. 部長のサインが必要', 'C. サインは不要', 'D. 誰のサインでもいい'], correctAnswer: 1, explanation: 'Cần chữ ký trưởng phòng.' },
          { id: 'n2a3-l29', passage: '男：来月の新人研修、場所はどこですか。\n女：3階の研修室で行います。朝9時から午後4時までです。', text: '研修は何時から何時までか。', options: ['A. 8時から3時まで', 'B. 9時から4時まで', 'C. 10時から5時まで', 'D. 9時から5時まで'], correctAnswer: 1, explanation: '9h đến 16h.' },
          { id: 'n2a3-l30', passage: '女：来年の予算案、いつまでに完成させればいいですか。\n男：今年度末までに完成させてください。12月半ばを目安にしています。', text: '予算案の完成期限はいつか。', options: ['A. 10月末', 'B. 11月末', 'C. 12月半ば', 'D. 年明け'], correctAnswer: 2, explanation: 'Giữa tháng 12.' }
        ]
      }
    ]
  }
];
