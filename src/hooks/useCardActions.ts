import { db } from '../data/db';
import type { Flashcard } from '../types';
import toast from 'react-hot-toast';

export function useCardActions() {
  const handleRemoveCard = async (id: string) => {
    try {
      await db.cards.delete(id);
    } catch (e) {
      console.error('Failed to delete card:', e);
      toast.error('Failed to delete card.');
    }
  };

  const handleRemoveCards = async (ids: string[]) => {
    try {
      await db.cards.bulkDelete(ids);
    } catch (e) {
      console.error('Failed to delete cards:', e);
      toast.error('Failed to delete cards.');
    }
  };

  const handleRemoveMistake = async (id: string) => {
    try {
      await db.mistakes.delete(id);
    } catch (e) {
      console.error('Failed to delete mistake:', e);
      toast.error('Failed to delete mistake.');
    }
  };

  const handleEditCard = async (updatedCard: Flashcard) => {
    try {
      await db.cards.put(updatedCard);
    } catch (e) {
      console.error('Failed to update card:', e);
      toast.error('Failed to save changes.');
    }
  };

  return {
    handleRemoveCard,
    handleRemoveCards,
    handleRemoveMistake,
    handleEditCard,
  };
}
