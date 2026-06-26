import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MistakeBookView } from '../MistakeBookView';
import type { Mistake, Question } from '../../types';

const mockQuestion: Question = {
  id: 'q1',
  text: 'What is the capital of France?',
  options: ['London', 'Berlin', 'Paris', 'Madrid'],
  correctAnswer: 2,
  category: 'toeic',
  difficulty: 'beginner',
};

const mockMistakes: Mistake[] = [
  {
    id: 'm1',
    type: 'question',
    data: mockQuestion,
    wrongAnswer: 'London',
    timestamp: new Date().toISOString(),
  },
];

describe('MistakeBookView', () => {
  const mockOnRemoveMistake = vi.fn();
  const mockOnReview = vi.fn();

  it('should render without crashing with mistakes', () => {
    const { container } = render(
      <MistakeBookView
        mistakes={mockMistakes}
        onRemoveMistake={mockOnRemoveMistake}
        onReview={mockOnReview}
      />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render without crashing with empty mistakes', () => {
    const { container } = render(
      <MistakeBookView
        mistakes={[]}
        onRemoveMistake={mockOnRemoveMistake}
        onReview={mockOnReview}
      />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should contain mistake book title', () => {
    const { container } = render(
      <MistakeBookView
        mistakes={mockMistakes}
        onRemoveMistake={mockOnRemoveMistake}
        onReview={mockOnReview}
      />
    );
    expect(container.textContent).toContain('Mistake Book');
  });

  it('should contain question text in content', () => {
    const { container } = render(
      <MistakeBookView
        mistakes={mockMistakes}
        onRemoveMistake={mockOnRemoveMistake}
        onReview={mockOnReview}
      />
    );
    expect(container.textContent).toContain('France');
  });
});
