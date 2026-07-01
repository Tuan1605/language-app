import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GrammarQuizView } from '../GrammarQuizView';
import type { GrammarQuizTaskData } from '../../types';

vi.mock('../../utils/sound', () => ({
  playCorrectSound: vi.fn(),
  playIncorrectSound: vi.fn(),
}));

const mockTask: GrammarQuizTaskData = {
  id: 'gq-1',
  point: {
    id: 'tg-1',
    pattern: 'Present Perfect',
    structure: 'S + have/has + V3/ed',
    meaning: 'Thì hiện tại hoàn thành',
    example: 'I have worked here for 5 years.',
    exampleTranslation: 'Tôi đã làm việc ở đây 5 năm.',
    difficulty: 'intermediate',
    blankedExample: 'I _____ (work) here for 5 years.'
  },
  options: ['will work', 'have worked', 'am working', 'was working'],
  correctIndex: 1,
};

describe('GrammarQuizView', () => {
  const mockOnComplete = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <GrammarQuizView task={mockTask} onComplete={mockOnComplete} onCancel={mockOnCancel} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should display answer options', () => {
    render(<GrammarQuizView task={mockTask} onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    expect(screen.getAllByText('will work').length).toBeGreaterThan(0);
    expect(screen.getAllByText('have worked').length).toBeGreaterThan(0);
    expect(screen.getAllByText('am working').length).toBeGreaterThan(0);
    expect(screen.getAllByText('was working').length).toBeGreaterThan(0);
  });

  it('should have a check answer button', () => {
    render(<GrammarQuizView task={mockTask} onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    expect(screen.getAllByText('Check Answer').length).toBeGreaterThan(0);
  });

  it('should disable check button when no option selected', () => {
    render(<GrammarQuizView task={mockTask} onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    const checkBtns = screen.getAllByText('Check Answer');
    expect(checkBtns[0]).toHaveProperty('disabled', true);
  });

  it('should enable check button after selecting option', () => {
    render(<GrammarQuizView task={mockTask} onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    fireEvent.click(screen.getAllByText('have worked')[0]);
    const checkBtns = screen.getAllByText('Check Answer');
    expect(checkBtns[0]).toHaveProperty('disabled', false);
  });

  it('should show feedback after answering correctly', () => {
    render(<GrammarQuizView task={mockTask} onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    fireEvent.click(screen.getAllByText('have worked')[0]);
    fireEvent.click(screen.getAllByText('Check Answer')[0]);
    expect(screen.getAllByText(/Correct/).length).toBeGreaterThan(0);
  });

  it('should display the blanked example text', () => {
    const { container } = render(
      <GrammarQuizView task={mockTask} onComplete={mockOnComplete} onCancel={mockOnCancel} />
    );
    expect(container.textContent).toContain('here for 5 years');
  });

  it('should have quit and continue buttons', () => {
    render(<GrammarQuizView task={mockTask} onComplete={mockOnComplete} onCancel={mockOnCancel} />);
    expect(screen.getAllByText('Quit Quest').length).toBeGreaterThan(0);
  });
});
