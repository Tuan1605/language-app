import type { Flashcard } from '../types';
import type { CurriculumUnit } from '../data/curriculums';

export interface NodeMastery {
  nodeIdx: number;
  mastery: number; // 0-100
  cardsStudied: number;
  accuracy: number;
}

export function calculateNodeMastery(
  cards: Flashcard[],
  curriculum: CurriculumUnit[],
  activeTrack: 'english' | 'japanese'
): Map<number, NodeMastery> {
  const masteryMap = new Map<number, NodeMastery>();

  // Filter cards for active track
  const trackCards = cards.filter(c => c.language === activeTrack);

  let globalNodeIdx = 0;

  for (const unit of curriculum) {
    const topicSet = new Set(unit.topics.map(t => t.toLowerCase()));

    for (let localIdx = 0; localIdx < unit.nodes; localIdx++) {
      const nodeIdx = globalNodeIdx + localIdx;

      // Get cards that belong to this node's topics and difficulty
      const nodeCards = trackCards.filter(card => {
        const topicMatch = !card.topic || topicSet.has(card.topic.toLowerCase());
        const difficultyMatch = card.difficulty === unit.difficulty;
        return topicMatch && difficultyMatch;
      });

      if (nodeCards.length === 0) {
        masteryMap.set(nodeIdx, {
          nodeIdx,
          mastery: 0,
          cardsStudied: 0,
          accuracy: 0,
        });
        continue;
      }

      // Calculate mastery based on card states
      let masteredCount = 0;
      let learningCount = 0;
      let totalAccuracy = 0;

      for (const card of nodeCards) {
        if (card.state === 'Review' && card.reps >= 3) {
          masteredCount++;
        } else if (card.state === 'Learning' || card.state === 'Relearning') {
          learningCount++;
        }

        // Calculate accuracy based on FSRS data
        if (card.reps > 0) {
          // Higher stability and lower difficulty = better accuracy
          const cardAccuracy = Math.min(100, Math.max(0,
            (card.stability / 21) * 50 + // Stability contributes 50%
            ((10 - card.fsrs_difficulty) / 10) * 30 + // Lower difficulty is better (30%)
            Math.min(card.reps / 5, 1) * 20 // Reps contribute 20%
          ));
          totalAccuracy += cardAccuracy;
        }
      }

      const studiedCards = nodeCards.filter(c => c.state !== 'New');
      const avgAccuracy = studiedCards.length > 0 ? totalAccuracy / studiedCards.length : 0;

      // Calculate overall mastery
      const masteryScore = Math.round(
        (masteredCount / nodeCards.length) * 60 + // 60% weight for mastered cards
        (learningCount / nodeCards.length) * 20 + // 20% weight for learning cards
        (avgAccuracy / 100) * 20 // 20% weight for accuracy
      );

      masteryMap.set(nodeIdx, {
        nodeIdx,
        mastery: Math.min(100, masteryScore),
        cardsStudied: studiedCards.length,
        accuracy: Math.round(avgAccuracy),
      });
    }

    globalNodeIdx += unit.nodes;
  }

  return masteryMap;
}
