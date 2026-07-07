import { Activity } from 'lucide-react';

interface HeatmapChartProps {
  heatmapData: Map<string, number>;
  daysArray: string[];
}

export function HeatmapChart({ heatmapData, daysArray }: HeatmapChartProps) {
  return (
    <div className="mb-12">
      <h3 className="text-lg font-black uppercase tracking-widest text-text-main mb-4 flex items-center gap-2">
        <Activity size={20} className="text-green" /> Review Activity (90 Days)
      </h3>
      <div className="w-full bg-bg-hover border-2 border-gray-path rounded-2xl p-6 custom-scrollbar overflow-x-auto">
        <div className="flex gap-1 min-w-[max-content]">
          {Array.from({ length: Math.ceil(90 / 7) }).map((_, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, rowIndex) => {
                const dayIndex = colIndex * 7 + rowIndex;
                if (dayIndex >= 90) return <div key={rowIndex} className="w-4 h-4" />;

                const dateStr = daysArray[dayIndex];
                const count = heatmapData.get(dateStr) || 0;

                let colorClass = 'bg-border-main/50';
                if (count > 0 && count <= 10) colorClass = 'bg-tint-green border-green border';
                else if (count > 10 && count <= 30) colorClass = 'bg-green border-green border';
                else if (count > 30) colorClass = 'bg-blue border-blue border';

                return (
                  <div
                    key={rowIndex}
                    className={`w-4 h-4 rounded-sm ${colorClass} group relative`}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-text-main text-bg-main text-[10px] font-black py-1 px-2 rounded whitespace-nowrap transition-opacity z-10 pointer-events-none">
                      {count} reviews on {new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex justify-end items-center mt-4 gap-2 text-[10px] font-bold text-text-muted">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-border-main/50"></div>
          <div className="w-3 h-3 rounded-sm bg-tint-green border-green border"></div>
          <div className="w-3 h-3 rounded-sm bg-green border-green border"></div>
          <div className="w-3 h-3 rounded-sm bg-blue border-blue border"></div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
