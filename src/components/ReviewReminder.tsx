interface ReviewReminderProps {
  dueCount: number;
  onStartReview: () => void;
}

export function ReviewReminder({ dueCount, onStartReview }: ReviewReminderProps) {
  if (dueCount === 0) return null;

  return (
    <div className="w-full lingo-card p-6 border-2 border-[var(--gold)] bg-[var(--tint-gold)] text-[var(--gold-shadow)] mb-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[var(--gold)]/20 flex items-center justify-center text-2xl">
          🔔
        </div>
        <div>
          <h3 className="font-black text-lg leading-tight">
            {dueCount} card{dueCount !== 1 ? 's' : ''} due for review
          </h3>
          <p className="text-sm font-bold opacity-80">
            Keep your memory sharp!
          </p>
        </div>
      </div>
      <button
        onClick={onStartReview}
        className="btn-duo btn-gold h-12 px-6 text-xs whitespace-nowrap"
      >
        START REVIEW
      </button>
    </div>
  );
}
