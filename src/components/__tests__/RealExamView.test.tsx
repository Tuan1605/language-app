import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RealExamView } from '../RealExamView';
import type { AuthenticExam } from '../../types';

vi.mock('../../utils/sound', () => ({
  playCorrectSound: vi.fn(),
  playIncorrectSound: vi.fn(),
}));

const mockExam: AuthenticExam = {
  id: 'test-exam-1',
  title: 'Test Exam',
  year: 2024,
  category: 'toeic',
  timeLimitMinutes: 120,
  sections: [
    {
      id: 'sec-1',
      title: 'Part 5: Grammar',
      description: 'Choose the correct word',
      questions: [
        {
          id: 'q1',
          text: 'The project is _____ completion.',
          options: ['near', 'nearly', 'nearing', 'neared'],
          correctAnswer: 2,
          explanation: 'nearing = đang gần đến'
        }
      ]
    }
  ]
};

describe('RealExamView', () => {
  const mockOnComplete = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <RealExamView exam={mockExam} onComplete={mockOnComplete} onCancel={mockOnCancel} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should display exam title', () => {
    render(<RealExamView exam={mockExam} onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    expect(screen.getAllByText('Test Exam').length).toBeGreaterThan(0);
  });

  it('should display section title', () => {
    render(<RealExamView exam={mockExam} onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    expect(screen.getAllByText('Part 5: Grammar').length).toBeGreaterThan(0);
  });

  it('should display first question', () => {
    render(<RealExamView exam={mockExam} onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    expect(screen.getAllByText(/The project is/).length).toBeGreaterThan(0);
  });

  it('should display answer options', () => {
    const { container } = render(<RealExamView exam={mockExam} onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    expect(container.textContent).toContain('near');
    expect(container.textContent).toContain('nearing');
  });
});
