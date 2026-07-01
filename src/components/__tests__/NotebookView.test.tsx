import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NotebookView } from '../NotebookView';

describe('NotebookView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <NotebookView
        activeTrack="english"
        n2Grammar={[]}
        n2Kanji={[]}
        toeicGrammar={[]}
      />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should display notebook related content', () => {
    render(
      <NotebookView
        activeTrack="english"
        n2Grammar={[]}
        n2Kanji={[]}
        toeicGrammar={[]}
      />
    );
    expect(screen.getAllByText(/Notebook|Grammar|Grammar Points/).length).toBeGreaterThan(0);
  });

  it('should render with Japanese track', () => {
    const { container } = render(
      <NotebookView
        activeTrack="japanese"
        n2Grammar={[{ id: 'g1', pattern: 'Test', meaning: 'Test', example: 'Test', exampleTranslation: 'Test', difficulty: 'beginner' }]}
        n2Kanji={[{ id: 'k1', kanji: '漢', meaning: 'kanji' }]}
        toeicGrammar={[]}
      />
    );
    expect(container.firstChild).toBeTruthy();
  });
});
