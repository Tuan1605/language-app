import { memo } from 'react';
import { motion } from 'framer-motion';
import type { CurriculumUnit } from '../data/curriculums';
import type { Difficulty } from '../types';

const UnitIcon = ({ id, className = "" }: { id: number; className?: string }) => {
  if (id === 1) return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" /></svg>;
  if (id === 2) return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.45 15.04 15.04 0 01-.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.438 4.438 0 002.946-2.946 4.493 4.493 0 004.306-1.758q.26-.144.514-.306c.16-.1.31-.21.46-.324M12 10.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>;
  if (id === 3) return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>;
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M18.75 4.236c.982.143 1.954.317 2.916.52a6.003 6.003 0 01-5.395 4.972M10.5 4.236c0 1.125.504 2.25 1.125 2.25 1.125 0 1.625-1.125 1.625-2.25M10.5 4.236c0-1.125.504-2.25 1.125-2.25 1.125 0 1.625 1.125 1.625 2.25" /></svg>;
};

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
                      <div className="absolute -top-[70px] bg-[var(--blue)] text-white px-5 py-3 rounded-2xl font-black text-xs shadow-[0_6px_0_var(--blue-shadow)] animate-bounce z-20 uppercase tracking-widest whitespace-nowrap">
                        START
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--blue)] rotate-45"></div>
                      </div>
                    )}
                    {isCracked && !isCurrent && (
                      <div className="absolute -top-10 bg-[var(--tint-red)] text-[var(--red)] border-2 border-[var(--red)] px-3 py-1 rounded-xl font-black text-[10px] shadow-sm z-20 uppercase tracking-widest whitespace-nowrap opacity-90 animate-pulse">
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
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[var(--gray-bg)] text-[var(--text-main)] text-xs font-black px-3 py-1.5 rounded-xl border-2 border-[var(--gray-path)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        Lesson {idx + 1}
                      </div>
                      {isLocked ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[var(--gray-path-dark)]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      ) : isCrown ? (
                        <svg className={`w-8 h-8 text-white drop-shadow-sm ${isCracked ? 'opacity-60' : ''}`} fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" /></svg>
                      ) : isCurrent ? (
                        <svg className="w-8 h-8 text-white drop-shadow-sm ml-1" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
                      ) : isCompleted ? (
                        <svg className={`w-7 h-7 text-white drop-shadow-sm ${isCracked ? 'opacity-60' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
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
