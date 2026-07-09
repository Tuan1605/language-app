export function GameLoading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="flex gap-3">
        <div className="skeleton w-16 h-16 rounded-2xl" />
        <div className="skeleton w-16 h-16 rounded-2xl" />
        <div className="skeleton w-16 h-16 rounded-2xl" />
      </div>
      <p className="text-sm font-bold text-text-muted animate-pulse">{text}</p>
    </div>
  );
}
