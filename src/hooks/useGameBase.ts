import { useState, useCallback } from 'react';
import { db } from '../data/db';
import type { Flashcard, Question } from '../types';
import { useUserStore } from '../stores/useUserStore';
import toast from 'react-hot-toast';

type Difficulty = 'easy' | 'medium' | 'hard';
type GameId = string;

interface UseGameBaseOptions {
  gameId: GameId;
  difficulty: Difficulty;
  onComplete: () => void;
}

interface UseGameBaseReturn {
  gameState: 'loading' | 'playing' | 'paused' | 'gameover' | 'won_round' | 'level_complete';
  setGameState: React.Dispatch<React.SetStateAction<'loading' | 'playing' | 'paused' | 'gameover' | 'won_round' | 'level_complete'>>;
  loadCards: (filter?: (card: Flashcard) => boolean) => Promise<Flashcard[]>;
  loadQuestions: () => Promise<Question[]>;
  finishGame: (score: number) => void;
}

export function useGameBase({ gameId, difficulty, onComplete }: UseGameBaseOptions): UseGameBaseReturn {
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'paused' | 'gameover' | 'won_round' | 'level_complete'>('loading');

  const activeTrack = useUserStore(s => s.activeTrack);
  const addExp = useUserStore(s => s.addExp);
  const setGameHighScore = useUserStore(s => s.setGameHighScore);

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

  const finishGame = useCallback((score: number) => {
    setGameState('gameover');
    if (score > 0) {
      addExp(score);
      setGameHighScore(gameId, difficulty, score);
      toast.success(`Game Over! Earned ${score} EXP`);
    }
  }, [addExp, setGameHighScore, gameId, difficulty]);

  return {
    gameState,
    setGameState,
    loadCards,
    loadQuestions,
    finishGame,
  };
}
