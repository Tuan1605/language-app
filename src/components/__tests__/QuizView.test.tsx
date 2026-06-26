import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { QuizView } from '../QuizView';
import type { Question } from '../../types';

const mockQuestions: Question[] = [
  {
    id: 'q1',
    text: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    category: 'toeic',
    difficulty: 'beginner',
  },
];

describe('QuizView', () => {
  const mockOnComplete = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <QuizView
        questions={mockQuestions}
        category="toeic"
        onComplete={mockOnComplete}
        onCancel={mockOnCancel}
      />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render with single question', () => {
    const { container } = render(
      <QuizView
        questions={mockQuestions}
        category="toeic"
        onComplete={mockOnComplete}
        onCancel={mockOnCancel}
      />
    );
    expect(container.textContent).toContain('France');
  });

  it('should render with n2 category', () => {
    const { container } = render(
      <QuizView
        questions={[{ ...mockQuestions[0], category: 'n2' }]}
        category="n2"
        onComplete={mockOnComplete}
        onCancel={mockOnCancel}
      />
    );
    expect(container.firstChild).toBeTruthy();
  });
});
