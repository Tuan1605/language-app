import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock the TOEIC_2024_PDF_EXAMS data
vi.mock('../../data/toeic2024Pdf', () => ({
  TOEIC_2024_PDF_EXAMS: [
    {
      id: 'toeic-2024-pdf-1',
      title: 'TOEIC ETS 2024 - Test 1',
      year: 2024,
      category: 'toeic',
      timeLimitMinutes: 120,
      pdfUrl_LC: '/pdfs/test_LC.pdf',
      pdfUrl_RC: '/pdfs/test_RC.pdf',
      audioUrl: '/audio/test.mp3',
      answers: Array.from({ length: 200 }, (_, i) => ({
        id: String(i + 1),
        correctAnswer: Math.floor(Math.random() * 4) as 0 | 1 | 2 | 3,
      })),
    },
  ],
}));

// Mock PdfViewer to avoid loading real PDFs
vi.mock('../PdfViewer', () => ({
  PdfViewer: () => <div data-testid="pdf-viewer">PDF Viewer</div>,
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

// Mock the database
vi.mock('../../data/db', () => ({
  db: {
    examResults: {
      add: vi.fn().mockResolvedValue(undefined),
    },
  },
}));

describe('PdfExamView', () => {
  it('should render without crashing for valid exam', async () => {
    const { PdfExamView } = await import('../PdfExamView');
    const { container } = render(<PdfExamView examId="toeic-2024-pdf-1" />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should show exam not found for invalid id', async () => {
    const { PdfExamView } = await import('../PdfExamView');
    const { container } = render(<PdfExamView examId="invalid-id" />);
    expect(container.textContent).toContain('Exam not found');
  });

  it('should display exam title', async () => {
    const { PdfExamView } = await import('../PdfExamView');
    render(<PdfExamView examId="toeic-2024-pdf-1" />);
    expect(screen.getAllByText(/TOEIC ETS 2024/).length).toBeGreaterThan(0);
  });

  it('should render exam content', async () => {
    const { PdfExamView } = await import('../PdfExamView');
    const { container } = render(<PdfExamView examId="toeic-2024-pdf-1" />);
    expect(container.textContent).toContain('TOEIC');
  });

  it('should show submit button', async () => {
    const { PdfExamView } = await import('../PdfExamView');
    render(<PdfExamView examId="toeic-2024-pdf-1" />);
    expect(screen.getAllByText(/Submit|submit/).length).toBeGreaterThan(0);
  });
});
