import type { CurriculumUnit } from '../data/curriculums';
import type { Difficulty } from '../types';

interface GamifiedPathProps {
  curriculum: CurriculumUnit[];
  currentUnlocked: number;
  onStartSession: (nodeIdx: number, difficulty: Difficulty) => void;
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

export function GamifiedPath({ curriculum, currentUnlocked, onStartSession }: GamifiedPathProps) {
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
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                  {unit.id === 1 ? '🌟' : unit.id === 2 ? '🚀' : unit.id === 3 ? '👑' : '🏆'}
                </div>
              </div>
            </div>

            <div className="relative w-full max-w-[500px]" style={{ height: `${sectionHeight}px` }}>
              <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <svg width="100%" height="100%" viewBox={`0 0 ${VIEWBOX_WIDTH} ${sectionHeight}`} preserveAspectRatio="none" className="overflow-visible">
                  <path d={fullPathD} fill="none" stroke="#cbd5e1" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" transform="translate(0, 8)" />
                  <path d={fullPathD} fill="none" stroke="#e2e8f0" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />
                  {activePathD && <path d={activePathD} fill="none" stroke={unit.shadow} strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" transform="translate(0, 8)" />}
                  {activePathD && <path d={activePathD} fill="none" stroke={unit.color} strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />}
                  <path d={fullPathD} fill="none" stroke={unit.shadow} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 16" opacity="0.4" />
                  {activePathD && <path d={activePathD} fill="none" stroke={unit.shadow} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 16" opacity="0.4" />}
                </svg>
              </div>

              {unitNodes.map((node) => {
                const { idx, svgX, svgY } = node;
                const isLocked = idx > currentUnlocked;
                const isCurrent = idx === currentUnlocked;
                const isCrown = (idx + 1) % 5 === 0;
                const leftPercent = (svgX / VIEWBOX_WIDTH) * 100;

                return (
                  <div 
                    key={idx} 
                    className="absolute z-10 flex flex-col items-center" 
                    style={{ left: `${leftPercent}%`, top: `${svgY}px`, transform: 'translate(-50%, -50%)' }}
                  >
                    {isCurrent && (
                      <div className="absolute -top-16 bg-[var(--bg-card)] text-[var(--text-main)] px-4 py-2 rounded-2xl font-black text-xs shadow-[0_4px_0_var(--border-main)] animate-bounce z-20 uppercase tracking-widest border-2 border-[var(--gray-path)] whitespace-nowrap">
                        START
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--bg-card)] border-b-2 border-r-2 border-[var(--gray-path)] rotate-45"></div>
                      </div>
                    )}
                    
                    <button 
                      disabled={isLocked}
                      onClick={() => onStartSession(idx, unit.difficulty as Difficulty)}
                      className={`duo-node ${isLocked ? 'locked' : ''} ${isCurrent ? 'current' : ''}`}
                      style={!isLocked ? { 
                        '--node-bg': isCrown ? 'var(--gold)' : unit.color, 
                        '--node-shadow': isCrown ? 'var(--gold-shadow)' : unit.shadow 
                      } as React.CSSProperties : {}}
                    >
                      {isLocked ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--gray-path-dark)]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      ) : isCrown ? '👑' : '⭐️'}
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
}
