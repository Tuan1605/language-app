import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizView } from '../QuizView';
import type { Question } from '../../types';

vi.mock('../../utils/sound', () => ({
  playCorrectSound: vi.fn(),
  playIncorrectSound: vi.fn(),
}));

const mockQuestions: Question[] = [
  {
    id: 'q1',
    text: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    category: 'toeic',
    difficulty: 'beginner',
  },
  {
    id: 'q2',
    text: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctAnswer: 1,
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
      <QuizView questions={mockQuestions} category="toeic" onComplete={mockOnComplete} onCancel={mockOnCancel} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should display first question text', () => {
    render(<QuizView questions={mockQuestions} category="toeic" onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    expect(screen.getAllByText('What is the capital of France?').length).toBeGreaterThan(0);
  });

  it('should display all options for current question', () => {
    render(<QuizView questions={mockQuestions} category="toeic" onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    expect(screen.getAllByText('London').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Berlin').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Paris').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Madrid').length).toBeGreaterThan(0);
  });

  it('should show question counter', () => {
    render(<QuizView questions={mockQuestions} category="toeic" onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    expect(screen.getAllByText('Question 1 of 2').length).toBeGreaterThan(0);
  });

  it('should disable Check Answer when no option selected', () => {
    render(<QuizView questions={mockQuestions} category="toeic" onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    const checkBtns = screen.getAllByText('Check Answer');
    expect(checkBtns[0]).toHaveProperty('disabled', true);
  });

  it('should enable Check Answer after selecting an option', () => {
    render(<QuizView questions={mockQuestions} category="toeic" onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    fireEvent.click(screen.getAllByText('Paris')[0]);
    const checkBtns = screen.getAllByText('Check Answer');
    expect(checkBtns[0]).toHaveProperty('disabled', false);
  });

  it('should render with n2 category', () => {
    const { container } = render(
      <QuizView questions={[{ ...mockQuestions[0], category: 'n2' }]} category="n2" onComplete={mockOnComplete} onCancel={mockOnCancel} />
    );
    expect(container.textContent).toContain('n2');
  });

  it('should have quit quiz button', () => {
    render(<QuizView questions={mockQuestions} category="toeic" onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    expect(screen.getAllByText('Quit Quiz').length).toBeGreaterThan(0);
  });

  it('should show category indicator', () => {
    render(<QuizView questions={mockQuestions} category="toeic" onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    expect(screen.getAllByText('toeic Mock Exam').length).toBeGreaterThan(0);
  });
});
