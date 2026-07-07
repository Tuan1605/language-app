interface StudyGoal {
  dailyCards: number;
  weeklyHours: number;
  targetAccuracy: number;
}

interface GoalSettingsModalProps {
  goal: StudyGoal;
  onChange: (goal: StudyGoal) => void;
  onSave: (goal: StudyGoal) => void;
  onClose: () => void;
}

export function GoalSettingsModal({ goal, onChange, onSave, onClose }: GoalSettingsModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-main w-full max-w-md rounded-[2rem] border-2 border-gray-path shadow-2xl p-8">
        <h3 className="font-black text-2xl text-text-main mb-6">Study Goals</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-2">Daily Cards Target</label>
            <input
              type="number"
              value={goal.dailyCards}
              onChange={(e) => onChange({ ...goal, dailyCards: parseInt(e.target.value) || 20 })}
              className="w-full bg-bg-hover border-2 border-border-main rounded-xl py-3 px-4 font-bold outline-none focus:border-blue transition-all text-text-main"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-2">Weekly Study Hours</label>
            <input
              type="number"
              value={goal.weeklyHours}
              onChange={(e) => onChange({ ...goal, weeklyHours: parseInt(e.target.value) || 5 })}
              className="w-full bg-bg-hover border-2 border-border-main rounded-xl py-3 px-4 font-bold outline-none focus:border-blue transition-all text-text-main"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-2">Target Accuracy (%)</label>
            <input
              type="number"
              value={goal.targetAccuracy}
              onChange={(e) => onChange({ ...goal, targetAccuracy: parseInt(e.target.value) || 80 })}
              className="w-full bg-bg-hover border-2 border-border-main rounded-xl py-3 px-4 font-bold outline-none focus:border-blue transition-all text-text-main"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-text-muted hover:bg-gray-path transition-colors border-2 border-transparent hover:border-border-main"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(goal)}
            className="flex-1 py-3 rounded-xl font-black text-white bg-blue hover:bg-[#2563EB] shadow-[0_4px_0_#1D4ED8] hover:shadow-[0_2px_0_#1D4ED8] hover:translate-y-[2px] transition-all"
          >
            Save Goals
          </button>
        </div>
      </div>
    </div>
  );
}
