import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ListeningView } from '../ListeningView';
import type { ListeningLesson } from '../../types';

vi.mock('../../utils/tts', () => ({
  speak: vi.fn(() => true),
  stopSpeaking: vi.fn(),
  hasVoiceFor: vi.fn(() => true),
  langForCategory: vi.fn((cat: string) => (cat === 'toeic' ? 'en-US' : 'ja-JP')),
}));

const mockLesson: ListeningLesson = {
  id: 'lst-1',
  title: 'Office Conversation',
  category: 'toeic',
  difficulty: 'beginner',
  transcript: [
    { time: 0, text: 'Hello, welcome to our office.', translation: 'Xin chào, chào mừng đến văn phòng.' },
    { time: 3, text: 'Thank you. I have an appointment.', translation: 'Cảm ơn. Tôi có hẹn.' },
  ],
};

describe('ListeningView', () => {
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<ListeningView lesson={mockLesson} onBack={mockOnBack} />);
    expect(screen.getAllByText('Office Conversation').length).toBeGreaterThan(0);
  });

  it('should display all transcript lines', () => {
    render(<ListeningView lesson={mockLesson} onBack={mockOnBack} />);
    expect(screen.getAllByText('Hello, welcome to our office.').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Thank you. I have an appointment.').length).toBeGreaterThan(0);
  });

  it('should display translations', () => {
    render(<ListeningView lesson={mockLesson} onBack={mockOnBack} />);
    expect(screen.getAllByText('Xin chào, chào mừng đến văn phòng.').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Cảm ơn. Tôi có hẹn.').length).toBeGreaterThan(0);
  });

  it('should show toeic audio lesson label', () => {
    render(<ListeningView lesson={mockLesson} onBack={mockOnBack} />);
    expect(screen.getAllByText('toeic Audio Lesson').length).toBeGreaterThan(0);
  });

  it('should show play button', () => {
    render(<ListeningView lesson={mockLesson} onBack={mockOnBack} />);
    expect(screen.getAllByLabelText('Play').length).toBeGreaterThan(0);
  });

  it('should show transcript section label', () => {
    render(<ListeningView lesson={mockLesson} onBack={mockOnBack} />);
    expect(screen.getAllByText('Transcript & Translation').length).toBeGreaterThan(0);
  });

  it('should call onBack when back button clicked', () => {
    render(<ListeningView lesson={mockLesson} onBack={mockOnBack} />);
    fireEvent.click(screen.getAllByLabelText('Go back')[0]);
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('should hide back button when hideBackButton is true', () => {
    const { container } = render(<ListeningView lesson={mockLesson} onBack={mockOnBack} hideBackButton={true} />);
    const goBackBtns = container.querySelectorAll('[aria-label="Go back"]');
    expect(goBackBtns.length).toBe(0);
  });

  it('should show DONE button when hideBackButton is true', () => {
    render(<ListeningView lesson={mockLesson} onBack={mockOnBack} hideBackButton={true} />);
    expect(screen.getAllByText('DONE').length).toBeGreaterThan(0);
  });

  it('should render with n2 category', () => {
    const n2Lesson = { ...mockLesson, category: 'n2' as const, title: '日本語の聴解' };
    render(<ListeningView lesson={n2Lesson} onBack={mockOnBack} />);
    expect(screen.getAllByText('日本語の聴解').length).toBeGreaterThan(0);
    expect(screen.getAllByText('n2 Audio Lesson').length).toBeGreaterThan(0);
  });

  it('should show audio controls when audioUrl is provided', () => {
    const lessonWithAudio = { ...mockLesson, audioUrl: 'https://example.com/audio.mp3' };
    render(<ListeningView lesson={lessonWithAudio} onBack={mockOnBack} />);
    expect(screen.getAllByLabelText('Rewind 5s').length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText('Forward 5s').length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText('Change Speed').length).toBeGreaterThan(0);
  });

  it('should show time display', () => {
    render(<ListeningView lesson={mockLesson} onBack={mockOnBack} />);
    expect(screen.getAllByText('0s').length).toBeGreaterThan(0);
  });
});
