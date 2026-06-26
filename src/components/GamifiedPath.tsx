import { memo } from 'react';
import { motion } from 'framer-motion';
import type { CurriculumUnit } from '../data/curriculums';
import type { Difficulty } from '../types';

import { UnitIcon, LockIcon, CrownIcon, CurrentNodeIcon, CompletedNodeIcon } from './icons/PathIcons';

interface GamifiedPathProps {
  curriculum: CurriculumUnit[];
  currentUnlocked: number;
  onStartSession: (nodeIdx: number, difficulty: Difficulty, topics: string[]) => void;
}

const organicOffsets = [0, 50, 85, 100, 85, 50, 0, -50, -85, -100, -85, -50];

function buildUnitData(unit: CurriculumUnit, startIndex: number) {
  const VIEWBOX_WIDTH = 400;
  const CENTER_X = 200;
  const NODE_Y_SPACING = 180;
  const START_Y = 80;

  const unitNodes = Array.from({ length: unit.nodes }).map((_, i) => {
    const idx = startIndex + i;
    const xOffset = organicOffsets[idx % organicOffsets.length];
    const svgX = CENTER_X + xOffset;
    const svgY = START_Y + i * NODE_Y_SPACING;
    return { idx, svgX, svgY };
  });

  const sectionHeight = START_Y + (unit.nodes - 1) * NODE_Y_SPACING + 160;

  let fullPathD = '';
  unitNodes.forEach((node, i) => {
    if (i === 0) {
      fullPathD += `M ${node.svgX} ${node.svgY} `;
    } else {
      const prev = unitNodes[i - 1];
      const midY = (prev.svgY + node.svgY) / 2;
      const curve = `C ${prev.svgX} ${midY}, ${node.svgX} ${midY}, ${node.svgX} ${node.svgY} `;
      fullPathD += curve;
    }
  });

  return { unitNodes, sectionHeight, fullPathD, VIEWBOX_WIDTH };
}

export const GamifiedPath = memo(function GamifiedPath({ curriculum, currentUnlocked, onStartSession }: GamifiedPathProps) {
  let nextStartIndex = 0;

  return (
    <>
      {curriculum.map((unit) => {
        const startIndex = nextStartIndex;
        nextStartIndex += unit.nodes;
        const { unitNodes, sectionHeight, fullPathD, VIEWBOX_WIDTH } = buildUnitData(unit, startIndex);

        let activePathD = '';
        unitNodes.forEach((node, i) => {
          if (i === 0) {
            if (node.idx <= currentUnlocked) activePathD += `M ${node.svgX} ${node.svgY} `;
          } else {
            const prev = unitNodes[i - 1];
            const midY = (prev.svgY + node.svgY) / 2;
            const curve = `C ${prev.svgX} ${midY}, ${node.svgX} ${midY}, ${node.svgX} ${node.svgY} `;
            if (node.idx <= currentUnlocked) activePathD += curve;
          }
        });

        return (
          <section key={unit.id} className="w-full flex flex-col items-center mb-16 relative">
            <div 
              className={`w-full max-w-xl p-8 rounded-3xl ${unit.text} mb-12 flex flex-col justify-center relative overflow-hidden z-20`}
              style={{ backgroundColor: unit.color, boxShadow: `0 8px 0 ${unit.shadow}`, border: `2px solid ${unit.shadow}` }}
            >
              <div className="flex justify-between items-center z-10 relative">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black uppercase tracking-tight">Unit {unit.id}</h2>
                  <p className="text-sm font-bold opacity-90">{unit.title} • {unit.desc}</p>
                </div>
                <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center text-white shadow-inner backdrop-blur-md border border-white/30">
                  <UnitIcon id={unit.id} className="w-10 h-10 drop-shadow-sm" />
                </div>
              </div>
            </div>

            <div className="relative w-full max-w-[500px]" style={{ height: `${sectionHeight}px` }}>
              <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <svg width="100%" height="100%" viewBox={`0 0 ${VIEWBOX_WIDTH} ${sectionHeight}`} preserveAspectRatio="none" className="overflow-visible">
                  <path d={fullPathD} fill="none" style={{ stroke: 'var(--locked-path-shadow)' }} strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" transform="translate(0, 8)" />
                  <path d={fullPathD} fill="none" style={{ stroke: 'var(--locked-path-bg)' }} strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />
                  {activePathD && <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} d={activePathD} fill="none" style={{ stroke: unit.pathShadow }} strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" transform="translate(0, 8)" />}
                  {activePathD && <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} d={activePathD} fill="none" style={{ stroke: unit.pathColor }} strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />}
                  <path d={fullPathD} fill="none" style={{ stroke: 'var(--locked-path-shadow)' }} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 16" opacity="0.4" />
                  {activePathD && <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} d={activePathD} fill="none" style={{ stroke: unit.pathShadow }} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 16" opacity="0.4" />}
                </svg>
              </div>

              {unitNodes.map((node) => {
                const { idx, svgX, svgY } = node;
                const isLocked = idx > currentUnlocked;
                const isCurrent = idx === currentUnlocked;
                const isCrown = (idx + 1) % 5 === 0;
                const leftPercent = (svgX / VIEWBOX_WIDTH) * 100;
                const isCompleted = idx < currentUnlocked;
                const isCracked = isCompleted && (currentUnlocked - idx) >= 3 && idx % 2 === 0; // Simulate cracked for older even nodes

                return (
                  <div 
                    key={idx} 
                    className="absolute z-10 flex flex-col items-center" 
                    style={{ left: `${leftPercent}%`, top: `${svgY}px`, transform: 'translate(-50%, -50%)' }}
                  >
                    {isCurrent && (
                      <div className="absolute -top-[70px] bg-blue text-white px-5 py-3 rounded-2xl font-black text-xs shadow-[0_6px_0_var(--blue-shadow)] animate-bounce z-20 uppercase tracking-widest whitespace-nowrap">
                        START
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue rotate-45"></div>
                      </div>
                    )}
                    {isCracked && !isCurrent && (
                      <div className="absolute -top-10 bg-tint-red text-red border-2 border-red px-3 py-1 rounded-xl font-black text-[10px] shadow-sm z-20 uppercase tracking-widest whitespace-nowrap opacity-90 animate-pulse">
                        REVIEW
                      </div>
                    )}
                    
                    <button 
                      disabled={isLocked}
                      onClick={() => onStartSession(idx, unit.difficulty as Difficulty, unit.topics)}
                      className={`duo-node ${isLocked ? 'locked' : ''} ${isCurrent ? 'current' : ''} ${isCracked ? 'cracked scale-95 opacity-90 border-dashed border-4 border-white' : ''} relative group`}
                      style={!isLocked ? { 
                        '--node-bg': isCrown ? 'var(--gold)' : unit.color, 
                        '--node-shadow': isCrown ? 'var(--gold-shadow)' : unit.shadow 
                      } as React.CSSProperties : {}}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-bg text-text-main text-xs font-black px-3 py-1.5 rounded-xl border-2 border-gray-path opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        Lesson {idx + 1}
                      </div>
                      {isLocked ? (
                        <LockIcon className="h-7 w-7 text-gray-path-dark/50" />
                      ) : isCrown ? (
                        <CrownIcon className={`w-8 h-8 text-white drop-shadow-sm ${isCracked ? 'opacity-60' : ''}`} />
                      ) : isCurrent ? (
                        <CurrentNodeIcon className="w-8 h-8 text-white drop-shadow-sm ml-1" />
                      ) : isCompleted ? (
                        <CompletedNodeIcon className={`w-7 h-7 text-white drop-shadow-sm ${isCracked ? 'opacity-60' : ''}`} />
                      ) : null}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
});
