# Lingomaster Ultimate 🌟

A gamified language learning web app inspired by Duolingo, designed for **TOEIC English** and **JLPT N2 Japanese** learners.

## Features

- **Gamified Learning Path** - Duolingo-style winding map with unlockable units and nodes
- **Flashcards with SM-2** - Spaced repetition algorithm for optimal memorization
- **Quiz Mode** - Timed multiple-choice questions with auto-skip
- **Listening Practice** - Audio lessons with synchronized transcripts
- **Speaking Practice** - Voice recognition powered by Web Speech API
- **Dictation Mode** - Listen and type exercises with accuracy scoring
- **Custom Exam Builder** - Create your own exams from the question bank
- **Full Mock Exams** - Complete TOEIC and JLPT N2 practice tests
- **Dark/Light Theme** - Toggle between themes with persistent preference
- **PWA Support** - Installable as a Progressive Web App
- **Responsive Design** - Desktop sidebar + mobile bottom navigation

## Content

All learning content (vocabulary, grammar, questions, listening/dictation/speaking
prompts) is **original practice material** authored for this app. It mirrors the
format and difficulty of TOEIC and JLPT N2 but is **not copied from any official
exam** (ETS / JEES). Do not add copyrighted exam questions to this repository.

Content lives as JSON under `src/data/` and is merged into the app via
`src/data/contentLoader.ts`, so it can grow to hundreds of items without changing
component code:

```
src/data/
├── toeic/
│   ├── vocabulary.json   # business vocabulary with examples
│   └── questions.json    # Part 5/6 style questions with explanations
└── n2/
    ├── vocabulary.json   # N2 vocabulary with readings
    ├── grammar.json      # N2 grammar patterns with examples
    └── questions.json    # 文法 / 語彙 style questions with explanations
```

Listening, dictation and speaking lessons fall back to the browser **Web Speech
API** (text-to-speech) when no recorded `audioUrl` is provided, so the app works
without hosting audio files. Real audio can be added later via the optional
`audioUrl` field.

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS v4** for utility-first styling
- **Supabase** for backend services (auth & database)
- **Web Speech API** for voice recognition

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://gitlab.com/tuan-group2/tuan.git
cd tuan

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials
```

### Development

```bash
npm run dev       # Start dev server with HMR
npm run build     # Type-check and build for production
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

## Project Structure

```
src/
├── assets/          # Static assets (images, SVGs)
├── components/      # React components
│   ├── AddFlashcard.tsx
│   ├── AnalyticsView.tsx
│   ├── CollectionView.tsx
│   ├── CreateExamView.tsx
│   ├── DictationView.tsx
│   ├── FlashcardView.tsx
│   ├── ListeningView.tsx
│   ├── QuizView.tsx
│   ├── SpeakingView.tsx
│   └── VocabQuizView.tsx
├── services/        # External service clients
│   └── supabaseClient.ts
├── types/           # TypeScript type definitions
│   └── index.ts
├── utils/           # Utility functions
│   ├── mockData.ts  # Sample data for development
│   └── sm2.ts       # SM-2 spaced repetition algorithm
├── App.tsx          # Main application component
├── App.css          # App-specific styles
├── index.css        # Global styles and Tailwind imports
└── main.tsx         # Application entry point
```

## License

This project is private.
