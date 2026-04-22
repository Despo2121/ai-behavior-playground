import type { Personality } from "@/types/simulation";

const PERSONALITIES: Personality[] = [
  "Logical",
  "Aggressive",
  "Funny",
  "Emotional",
];

const personalityMeta: Record<
  Personality,
  { emoji: string; description: string }
> = {
  Logical: { emoji: "🧠", description: "Factual, structured" },
  Aggressive: { emoji: "⚡", description: "Direct, confrontational" },
  Funny: { emoji: "😄", description: "Witty, sarcastic" },
  Emotional: { emoji: "💙", description: "Empathetic, reactive" },
};

interface PersonalitySelectProps {
  label: string;
  value: Personality;
  onChange: (value: Personality) => void;
  agentId: "A" | "B";
  disabled?: boolean;
  dataOcid?: string;
}

export function PersonalitySelect({
  label,
  value,
  onChange,
  agentId,
  disabled = false,
  dataOcid,
}: PersonalitySelectProps) {
  const accentClass = agentId === "A" ? "text-primary" : "text-accent";
  const ringClass =
    agentId === "A"
      ? "focus:ring-primary/40 focus:border-primary/60"
      : "focus:ring-accent/40 focus:border-accent/60";

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={`personality-${agentId}`}
        className="text-xs font-display font-semibold tracking-wide text-muted-foreground uppercase"
      >
        <span className={accentClass}>Agent {agentId}</span> personality
      </label>
      <div className="relative">
        <select
          id={`personality-${agentId}`}
          value={value}
          onChange={(e) => onChange(e.target.value as Personality)}
          disabled={disabled}
          aria-label={label}
          data-ocid={dataOcid}
          className={`w-full appearance-none bg-secondary border border-border text-foreground text-sm font-body rounded-lg px-3 py-2.5 pr-9 cursor-pointer transition-smooth focus:outline-none focus:ring-2 ${ringClass} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {PERSONALITIES.map((p) => (
            <option key={p} value={p}>
              {personalityMeta[p].emoji} {p} — {personalityMeta[p].description}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            className="w-4 h-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
