import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FlashcardView } from '../FlashcardView';
import type { Flashcard } from '../../types';

const mockCard: Flashcard = {
  id: 'test-1',
  user_id: 'guest',
  word: 'Hello',
  definition: 'Xin chào',
  example: 'Hello, how are you?',
  language: 'english',
  category: 'toeic',
  difficulty: 'beginner',
  state: 'New',
  reps: 0,
  lapses: 0,
  stability: 0,
  fsrs_difficulty: 0,
  next_review: null,
  created_at: new Date().toISOString(),
};

describe('FlashcardView', () => {
  it('should render the card word', () => {
    render(<FlashcardView card={mockCard} onRate={vi.fn()} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should render with different card data', () => {
    const diffCard = { ...mockCard, word: 'World', definition: 'Thế giới' };
    render(<FlashcardView card={diffCard} onRate={vi.fn()} />);
    expect(screen.getByText('World')).toBeInTheDocument();
  });

  it('should render the component without crashing', () => {
    const { container } = render(<FlashcardView card={mockCard} onRate={vi.fn()} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should render volume buttons for TTS', () => {
    const { container } = render(<FlashcardView card={mockCard} onRate={vi.fn()} />);
    // Volume2 icons are rendered as SVGs
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });
});
