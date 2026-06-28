export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-2" aria-label="Omkar AI is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block h-2 w-2 rounded-full bg-text-muted"
          style={{ animation: `typing-bounce 1.2s ${i * 0.15}s infinite ease-in-out` }}
        />
      ))}
    </div>
  );
}
