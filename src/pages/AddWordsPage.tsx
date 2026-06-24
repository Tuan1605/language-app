import { AnimatedPage } from '../components/AnimatedPage';
import { AddFlashcard } from '../components/AddFlashcard';
import { LocalErrorBoundary } from '../components/LocalErrorBoundary';
import { db } from '../data/db';
import type { Flashcard } from '../types';
import toast from 'react-hot-toast';

type CardInput = { word: string; definition: string; example?: string; language: 'english' | 'japanese' };

export function AddWordsPage() {
  const handleAddCard = async (card: CardInput) => {
    const newCard: Flashcard = {
      id: crypto.randomUUID(),
      user_id: 'guest',
      word: card.word,
      definition: card.definition,
      example: card.example,
      language: card.language,
      category: card.language === 'english' ? 'toeic' : 'n2',
      difficulty: 'beginner',
      status: 'new',
      next_review: null,
      repetition: 0,
      interval: 1,
      easiness: 2.5,
      created_at: new Date().toISOString()
    };
    await db.cards.add(newCard);
    toast.success('Flashcard added successfully!');
  };

  const handleAddCardsBulk = async (cardsData: CardInput[]) => {
    const newCards: Flashcard[] = cardsData.map(card => ({
      id: crypto.randomUUID(),
      user_id: 'guest',
      word: card.word,
      definition: card.definition,
      example: card.example,
      language: card.language,
      category: card.language === 'english' ? 'toeic' : 'n2',
      difficulty: 'beginner',
      status: 'new',
      next_review: null,
      repetition: 0,
      interval: 1,
      easiness: 2.5,
      created_at: new Date().toISOString()
    }));
    await db.cards.bulkAdd(newCards);
  };

  return (
    <LocalErrorBoundary>
      <AnimatedPage>
        <div className="w-full view-enter">
        <AddFlashcard 
          onAdd={handleAddCard} 
          onAddBulk={handleAddCardsBulk} 
        />
        </div>
      </AnimatedPage>
    </LocalErrorBoundary>
  );
}
