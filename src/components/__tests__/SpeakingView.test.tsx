import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpeakingView } from '../SpeakingView';
import type { SpeakingLesson } from '../../types';

vi.mock('../../utils/tts', () => ({
  speak: vi.fn(() => true),
  langForCategory: vi.fn((cat: string) => (cat === 'toeic' ? 'en-US' : 'ja-JP')),
  isSpeechRecognitionSupported: vi.fn(() => false),
}));

vi.mock('../../utils/stringSimilarity', () => ({
  calculateSimilarity: vi.fn(() => 80),
}));

const mockLesson: SpeakingLesson = {
  id: 'spk-1',
  category: 'toeic',
  difficulty: 'beginner',
  targetSentence: 'Hello, how are you today?',
  translation: 'Xin chào, bạn khỏe không?',
  phonetic: '',
};

describe('SpeakingView', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<SpeakingView lesson={mockLesson} onComplete={mockOnComplete} />);
    expect(screen.getAllByText('Hello, how are you today?').length).toBeGreaterThan(0);
  });

  it('should display target sentence and translation', () => {
    render(<SpeakingView lesson={mockLesson} onComplete={mockOnComplete} />);
    expect(screen.getAllByText('Hello, how are you today?').length).toBeGreaterThan(0);
    expect(screen.getAllByText('"Xin chào, bạn khỏe không?"').length).toBeGreaterThan(0);
  });

  it('should show speaking practice label', () => {
    render(<SpeakingView lesson={mockLesson} onComplete={mockOnComplete} />);
    expect(screen.getAllByText('Speaking Practice').length).toBeGreaterThan(0);
  });

  it('should show record & compare label', () => {
    render(<SpeakingView lesson={mockLesson} onComplete={mockOnComplete} />);
    expect(screen.getAllByText('Record & Compare').length).toBeGreaterThan(0);
  });

  it('should show listen to example button', () => {
    render(<SpeakingView lesson={mockLesson} onComplete={mockOnComplete} />);
    expect(screen.getAllByText('LISTEN TO EXAMPLE').length).toBeGreaterThan(0);
  });

  it('should show tap to record text', () => {
    render(<SpeakingView lesson={mockLesson} onComplete={mockOnComplete} />);
    expect(screen.getAllByText('Tap to record your voice').length).toBeGreaterThan(0);
  });

  it('should show skip button when no recording', () => {
    render(<SpeakingView lesson={mockLesson} onComplete={mockOnComplete} />);
    expect(screen.getAllByText(/Skip this exercise/).length).toBeGreaterThan(0);
  });

  it('should call onComplete when skip clicked', () => {
    render(<SpeakingView lesson={mockLesson} onComplete={mockOnComplete} />);
    fireEvent.click(screen.getAllByText(/Skip this exercise/)[0]);
    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it('should render with n2 category', () => {
    const n2Lesson = { ...mockLesson, category: 'n2' as const, targetSentence: 'こんにちは' };
    render(<SpeakingView lesson={n2Lesson} onComplete={mockOnComplete} />);
    expect(screen.getAllByText('こんにちは').length).toBeGreaterThan(0);
  });

  it('should show start recording button', () => {
    render(<SpeakingView lesson={mockLesson} onComplete={mockOnComplete} />);
    const btns = screen.getAllByLabelText('Start recording');
    expect(btns.length).toBeGreaterThan(0);
  });
});
