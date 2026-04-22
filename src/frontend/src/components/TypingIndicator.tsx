interface TypingIndicatorProps {
  agentId: "A" | "B";
}

export function TypingIndicator({ agentId }: TypingIndicatorProps) {
  const isA = agentId === "A";

  return (
    <div
      className={`flex flex-col gap-1 ${isA ? "items-start" : "items-end"}`}
      aria-label={`Agent ${agentId} is typing`}
    >
      <span
        className={`text-xs font-display font-semibold tracking-wide ${
          isA ? "text-primary" : "text-accent"
        }`}
      >
        Agent {agentId}
      </span>
      <div
        className={`px-4 py-3 rounded-[4px] ${
          isA
            ? "bg-primary/20 border border-primary/30"
            : "bg-accent/20 border border-accent/30"
        }`}
      >
        <div
          className={`typing-indicator ${isA ? "text-primary" : "text-accent"}`}
        >
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
