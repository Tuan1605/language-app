import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { 
  loadCards, saveCards, 
  loadProgress, saveProgress, 
  loadExamResults, saveExamResults,
  loadTheme, saveTheme,
  loadMistakes, saveMistakes,
  exportData, importData
} from './storage';
import type { Flashcard, ExamResult } from '../types';

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Cards Storage', () => {
    it('should return null if no cards in storage', () => {
      expect(loadCards()).toBeNull();
    });

    it('should save and load cards correctly', () => {
      const cards: Flashcard[] = [{ id: '1', word: 'test' } as Flashcard];
      saveCards(cards);
      expect(loadCards()).toEqual(cards);
    });
  });

  describe('Progress Storage', () => {
    it('should return default progress if empty', () => {
      const p = loadProgress();
      expect(p.unlocked_en).toBe(0);
      expect(p.unlocked_ja).toBe(0);
    });

    it('should save and load progress correctly', () => {
      const p = { unlocked_en: 5, unlocked_ja: 3 };
      saveProgress(p);
      const loaded = loadProgress();
      expect(loaded.unlocked_en).toBe(5);
      expect(loaded.unlocked_ja).toBe(3);
    });
  });

  describe('Exam Results Storage', () => {
    it('should return empty array if no results', () => {
      expect(loadExamResults()).toEqual([]);
    });

    it('should save and load exam results', () => {
      const results: ExamResult[] = [{ id: 'e1', score: 90, totalQuestions: 100 } as ExamResult];
      saveExamResults(results);
      expect(loadExamResults()).toEqual(results);
    });
  });

  describe('Theme Storage', () => {
    it('should return light theme as default', () => {
      expect(loadTheme()).toBe('light');
    });

    it('should save and load theme', () => {
      saveTheme('dark');
      expect(loadTheme()).toBe('dark');
      saveTheme('light');
      expect(loadTheme()).toBe('light');
    });
  });

  describe('Mistakes Storage', () => {
    it('should return empty array by default', () => {
      expect(loadMistakes()).toEqual([]);
    });

    it('should save and load mistakes correctly', () => {
      const mistakes: any[] = [{ id: 'm1', type: 'question', wrongAnswer: 'A' }];
      saveMistakes(mistakes);
      expect(loadMistakes()).toEqual(mistakes);
    });
  });

  describe('Data Import/Export', () => {
    it('should export all data correctly by creating a blob and triggering download', () => {
      // Mock DOM methods
      const mockCreateObjectURL = vi.fn().mockReturnValue('blob:test-url');
      const mockRevokeObjectURL = vi.fn();
      (globalThis as any).URL.createObjectURL = mockCreateObjectURL;
      (globalThis as any).URL.revokeObjectURL = mockRevokeObjectURL;

      const mockClick = vi.fn();
      const mockCreateElement = vi.spyOn(document, 'createElement').mockReturnValue({
        click: mockClick,
        href: '',
        download: ''
      } as any);

      saveTheme('dark');
      const cards: Flashcard[] = [{ id: 'c1' } as Flashcard];
      saveCards(cards);
      
      exportData();
      
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalled();
      
      mockCreateElement.mockRestore();
    });

    it('should import data from file and overwrite existing', async () => {
      const mockData = JSON.stringify({
        cards: [{ id: 'imported' }],
        progress: { unlocked_en: 999, unlocked_ja: 10 },
        examResults: [{ id: 'r1' }],
        mistakes: [{ id: 'm1' }]
      });

      const file = new File([mockData], "backup.json", { type: "application/json" });

      await expect(importData(file)).resolves.toBeUndefined();

      expect(loadCards()).toEqual([{ id: 'imported' }]);
      expect(loadProgress().unlocked_en).toBe(999);
      expect(loadExamResults()).toEqual([{ id: 'r1' }]);
      expect(loadMistakes()).toEqual([{ id: 'm1' }]);
    });

    it('should fail gracefully on invalid file content', async () => {
      const file = new File(["invalid-json"], "backup.json", { type: "application/json" });
      await expect(importData(file)).rejects.toThrow();
    });
  });
});
