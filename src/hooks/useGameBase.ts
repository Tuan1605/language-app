import { useState, useCallback } from 'react';
import { db } from '../data/db';
import type { Flashcard, Question } from '../types';
import { useUserStore } from '../stores/useUserStore';
import toast from 'react-hot-toast';

interface UseGameBaseOptions {
  onComplete: () => void;
}

interface UseGameBaseReturn {
  gameState: 'loading' | 'ready' | 'playing' | 'paused' | 'gameover' | 'won_round' | 'level_complete';
  setGameState: React.Dispatch<React.SetStateAction<'loading' | 'ready' | 'playing' | 'paused' | 'gameover' | 'won_round' | 'level_complete'>>;
  loadCards: (filter?: (card: Flashcard) => boolean) => Promise<Flashcard[]>;
  loadQuestions: () => Promise<Question[]>;
}

export function useGameBase({ onComplete }: UseGameBaseOptions): UseGameBaseReturn {
  const [gameState, setGameState] = useState<'loading' | 'ready' | 'playing' | 'paused' | 'gameover' | 'won_round' | 'level_complete'>('loading');

  const activeTrack = useUserStore(s => s.activeTrack);

  const loadCards = useCallback(async (filter?: (card: Flashcard) => boolean): Promise<Flashcard[]> => {
    try {
      let cards = await db.cards.where('language').equals(activeTrack).toArray();
      if (filter) cards = cards.filter(filter);
      if (cards.length === 0) {
        toast.error('Not enough flashcards to play. Please add more!');
        onComplete();
      }
      return cards;
    } catch (e) {
      console.error(e);
      toast.error('Failed to load game');
      onComplete();
      return [];
    }
  }, [activeTrack, onComplete]);

  const loadQuestions = useCallback(async (): Promise<Question[]> => {
    try {
      const category = activeTrack === 'english' ? 'toeic' : 'n2';
      const questions = await db.questions.where('category').equals(category).toArray();
      if (questions.length === 0) {
        toast.error('Not enough questions to play. Please add more!');
        onComplete();
      }
      return questions;
    } catch (e) {
      console.error(e);
      toast.error('Failed to load game');
      onComplete();
      return [];
    }
  }, [activeTrack, onComplete]);

  return {
    gameState,
    setGameState,
    loadCards,
    loadQuestions,
  };
}
