import type { GrammarPoint } from '../types';

// Generate fill-in-the-blank options for grammar questions
export function generateGrammarOptions(point: GrammarPoint): { correctAnswer: string; distractors: string[] } {
  const blanked = point.blankedExample || '';

  // Extract the correct answer from parentheses in blankedExample
  // Format: "I _____ (work) here for 5 years." -> correctAnswer = "work"
  const blankMatch = blanked.match(/\(([^)]+)\)/);
  const correctAnswer = blankMatch ? blankMatch[1] : '';

  if (!correctAnswer) {
    return { correctAnswer: '(no answer)', distractors: ['option A', 'option B', 'option C'] };
  }

  // Generate distractors based on grammar pattern
  const pattern = point.pattern.toLowerCase();
  let distractorPool: string[] = [];

  if (pattern.includes('present perfect')) {
    distractorPool = ['have worked', 'has worked', 'have finished', 'has finished', 'had worked', 'was working'];
  } else if (pattern.includes('past perfect')) {
    distractorPool = ['had left', 'had finished', 'have finished', 'has finished', 'was leaving', 'will leave'];
  } else if (pattern.includes('future perfect')) {
    distractorPool = ['will have completed', 'will have finished', 'have completed', 'had completed', 'are completing'];
  } else if (pattern.includes('passive')) {
    distractorPool = ['was written', 'was made', 'wrote', 'make', 'is writing', 'has written'];
  } else if (pattern.includes('modal')) {
    distractorPool = ['must', 'should', 'can', 'could', 'would', 'might', 'may', 'will'];
  } else if (pattern.includes('conditional')) {
    distractorPool = ['will', 'would', 'could', 'should', 'might', 'may'];
  } else if (pattern.includes('gerund') || pattern.includes('infinitive')) {
    distractorPool = ['reading', 'to read', 'read', 'reads', 'have read', 'to reading'];
  } else if (pattern.includes('compar')) {
    distractorPool = ['more interesting', 'better than', 'more efficient', 'faster than', 'most interesting'];
  } else if (pattern.includes('preposition')) {
    distractorPool = ['on', 'at', 'in', 'by', 'with', 'for', 'from'];
  } else if (pattern.includes('article')) {
    distractorPool = ['a', 'an', 'the', 'some', 'this'];
  } else if (pattern.includes('wish')) {
    distractorPool = ['had', 'were', 'could', 'would', 'should', 'might'];
  } else {
    distractorPool = ['work', 'works', 'worked', 'working', 'has worked', 'will work', 'is working'];
  }

  // Pick 3 unique distractors that are different from correctAnswer
  const distractors: string[] = [];
  const shuffled = [...distractorPool].sort(() => Math.random() - 0.5);
  for (const d of shuffled) {
    if (d !== correctAnswer && !distractors.includes(d)) {
      distractors.push(d);
    }
    if (distractors.length >= 3) break;
  }

  return { correctAnswer, distractors };
}
