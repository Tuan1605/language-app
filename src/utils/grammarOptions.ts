import type { GrammarPoint } from '../types';

// Generate fill-in-the-blank options for grammar questions
export function generateGrammarOptions(point: GrammarPoint): { correctAnswer: string; distractors: string[] } {
  const blanked = point.blankedExample || '';
  const pattern = point.pattern.toLowerCase();

  // Extract the correct answer from parentheses in blankedExample
  // Format: "I _____ (work) here for 5 years." -> correctAnswer = "work"
  const blankMatch = blanked.match(/\(([^)]+)\)/);
  let correctAnswer = blankMatch ? blankMatch[1] : '';

  const isJapanese = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf]/.test(point.pattern);

  // If no parentheses, infer answer from pattern
  if (!correctAnswer) {
    if (isJapanese) {
      correctAnswer = point.pattern.replace(/～/g, '').trim();
    } else if (pattern.includes('modal')) {
      correctAnswer = 'must';
    } else if (pattern.includes('preposition')) {
      correctAnswer = 'at';
    } else if (pattern.includes('article')) {
      correctAnswer = 'the';
    } else if (pattern.includes('conjunction')) {
      correctAnswer = 'although';
    } else if (pattern.includes('relative clause') || pattern.includes('who') || pattern.includes('which') || pattern.includes('that')) {
      correctAnswer = 'who';
    } else if (pattern.includes('possessive')) {
      correctAnswer = 'my';
    } else if (pattern.includes('demonstrative')) {
      correctAnswer = 'this';
    } else if (pattern.includes('quantifier')) {
      correctAnswer = 'some';
    } else if (pattern.includes('question word')) {
      correctAnswer = 'Who';
    } else if (pattern.includes('conditional')) {
      correctAnswer = 'would';
    } else if (pattern.includes('wish')) {
      correctAnswer = 'had';
    } else if (pattern.includes('passive')) {
      correctAnswer = 'was written';
    } else if (pattern.includes('present perfect')) {
      correctAnswer = 'have worked';
    } else if (pattern.includes('past perfect')) {
      correctAnswer = 'had left';
    } else if (pattern.includes('gerund') || pattern.includes('infinitive')) {
      correctAnswer = 'to read';
    } else if (pattern.includes('compar')) {
      correctAnswer = 'more';
    } else {
      // Final fallback - try to extract from context
      correctAnswer = 'the';
    }
  }

  // Generate distractors based on grammar pattern
  let distractorPool: string[] = [];

  if (pattern.includes('modal')) {
    distractorPool = ['must', 'should', 'can', 'could', 'would', 'might', 'may', 'will', 'shall'];
  } else if (pattern.includes('preposition')) {
    distractorPool = ['on', 'at', 'in', 'by', 'with', 'for', 'from', 'to', 'of'];
  } else if (pattern.includes('article')) {
    distractorPool = ['a', 'an', 'the', 'some', 'this', 'that'];
  } else if (pattern.includes('conjunction') || pattern.includes('although') || pattern.includes('despite')) {
    distractorPool = ['although', 'because', 'since', 'while', 'whereas', 'despite', 'however', 'therefore'];
  } else if (pattern.includes('relative clause') || pattern.includes('who') || pattern.includes('which') || pattern.includes('that')) {
    distractorPool = ['who', 'which', 'that', 'whom', 'whose', 'where', 'when'];
  } else if (pattern.includes('possessive')) {
    distractorPool = ['my', 'your', 'his', 'her', 'its', 'our', 'their'];
  } else if (pattern.includes('demonstrative')) {
    distractorPool = ['this', 'that', 'these', 'those', 'a', 'the'];
  } else if (pattern.includes('quantifier')) {
    distractorPool = ['some', 'many', 'much', 'few', 'little', 'enough', 'several'];
  } else if (pattern.includes('question word')) {
    distractorPool = ['Who', 'What', 'Where', 'When', 'Why', 'How'];
  } else if (pattern.includes('present perfect')) {
    distractorPool = ['have worked', 'has worked', 'have finished', 'has finished', 'worked', 'will work'];
  } else if (pattern.includes('past perfect')) {
    distractorPool = ['had left', 'had finished', 'have finished', 'has finished', 'was leaving'];
  } else if (pattern.includes('passive')) {
    distractorPool = ['was written', 'was made', 'wrote', 'make', 'is writing', 'has written'];
  } else if (pattern.includes('conditional')) {
    distractorPool = ['will', 'would', 'could', 'should', 'might', 'may'];
  } else if (pattern.includes('wish')) {
    distractorPool = ['had', 'were', 'could', 'would', 'should', 'might'];
  } else if (pattern.includes('gerund') || pattern.includes('infinitive')) {
    distractorPool = ['reading', 'to read', 'read', 'reads', 'having read', 'to reading'];
  } else if (pattern.includes('compar')) {
    distractorPool = ['more', 'less', 'as', 'than', 'most', 'least'];
  } else if (isJapanese) {
    distractorPool = [
      'にもかかわらず', 'ばかりに', 'からには', 'ざるを得ない', 'わけがない',
      'というものだ', 'にかぎって', 'をめぐって', 'にほかならない', 'ことには',
      'にすぎない', 'をもとに', 'に沿って', 'にわたって', 'くせに'
    ];
  } else {
    distractorPool = ['the', 'a', 'an', 'this', 'that', 'some', 'my', 'your'];
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
