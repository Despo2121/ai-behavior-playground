import { ChatBubble } from "@/components/ChatBubble";
import { PersonalitySelect } from "@/components/PersonalitySelect";
import { TypingIndicator } from "@/components/TypingIndicator";
import { useSimulation } from "@/hooks/useSimulation";
import type { Personality, SimulationConfig } from "@/types/simulation";
import { type FormEvent, useEffect, useRef, useState } from "react";

export function PlaygroundPage() {
  const [goal, setGoal] = useState("");
  const [personalityA, setPersonalityA] = useState<Personality>("Logical");
  const [personalityB, setPersonalityB] = useState<Personality>("Aggressive");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    status,
    currentTyping,
    visibleContent,
    startSimulation,
    resetSimulation,
  } = useSimulation();

  const isRunning = status === "running";
  const hasStarted = messages.length > 0 || isRunning;
  const canStart = goal.trim().length > 0 && !isRunning;

  // Auto-scroll to bottom when messages change or typing indicator appears
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canStart) return;

    const config: SimulationConfig = {
      goal: goal.trim(),
      agentAPersonality: personalityA,
      agentBPersonality: personalityB,
    };

    resetSimulation();
    // Small delay so reset clears state before new sim starts
    setTimeout(() => startSimulation(config), 50);
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-2">
          AI Behavior Playground
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
          Simulate conversations between two AI agents with distinct
          personalities and observe emergent behavior.
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-3xl bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        {/* Config Panel */}
        <div className="p-5 sm:p-6 border-b border-border bg-card">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            data-ocid="simulation.form"
          >
            {/* Goal Input */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="sim-goal"
                className="text-xs font-display font-semibold tracking-wide text-muted-foreground uppercase"
              >
                Simulation Goal
              </label>
              <input
                id="sim-goal"
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Negotiate a peace treaty between rival tech companies"
                disabled={isRunning}
                data-ocid="simulation.goal_input"
                className="w-full bg-secondary border border-border text-foreground text-sm font-body rounded-lg px-4 py-2.5 placeholder:text-muted-foreground/50 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {goal.trim().length === 0 && hasStarted === false && (
                <p
                  className="text-xs text-muted-foreground/60"
                  data-ocid="simulation.goal_hint"
                >
                  Enter a goal to enable the simulation.
                </p>
              )}
            </div>

            {/* Personality Selects + Button */}
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1">
                <PersonalitySelect
                  label="Agent A Personality"
                  value={personalityA}
                  onChange={setPersonalityA}
                  agentId="A"
                  disabled={isRunning}
                  dataOcid="simulation.personality_a.select"
                />
              </div>
              <div className="flex-1">
                <PersonalitySelect
                  label="Agent B Personality"
                  value={personalityB}
                  onChange={setPersonalityB}
                  agentId="B"
                  disabled={isRunning}
                  dataOcid="simulation.personality_b.select"
                />
              </div>
              <div className="shrink-0 w-full sm:w-auto">
                <button
                  type="submit"
                  disabled={!canStart}
                  data-ocid="simulation.start_button"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-display font-semibold text-sm bg-primary text-primary-foreground transition-smooth hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isRunning ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                      Running…
                    </span>
                  ) : hasStarted ? (
                    "Restart Simulation"
                  ) : (
                    "Start Simulation"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Chat Area */}
        <div
          className="relative bg-background"
          data-ocid="simulation.chat_panel"
        >
          {!hasStarted ? (
            /* Empty State */
            <div
              className="flex flex-col items-center justify-center py-16 px-6 text-center"
              data-ocid="simulation.empty_state"
            >
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="font-display text-base font-semibold text-foreground mb-1">
                No conversation yet
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Enter a simulation goal and choose personalities above, then hit{" "}
                <span className="text-primary font-medium">
                  Start Simulation
                </span>
                .
              </p>
            </div>
          ) : (
            <div
              className="h-[420px] sm:h-[480px] overflow-y-auto px-5 sm:px-6 py-5 flex flex-col gap-4 scroll-smooth"
              data-ocid="simulation.chat_list"
            >
              {messages.map((msg, i) => (
                <ChatBubble
                  key={msg.id}
                  message={msg}
                  visibleText={visibleContent[msg.id] ?? ""}
                  index={i}
                />
              ))}

              {currentTyping && <TypingIndicator agentId={currentTyping} />}

              {status === "complete" && (
                <div
                  className="text-center py-3"
                  data-ocid="simulation.complete_state"
                >
                  <span className="inline-block text-xs font-display font-semibold text-muted-foreground/60 border border-border/50 rounded-full px-3 py-1">
                    — Simulation complete —
                  </span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Status Bar */}
        {hasStarted && (
          <div className="px-5 sm:px-6 py-3 border-t border-border bg-card flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isRunning
                    ? "bg-primary animate-pulse"
                    : "bg-muted-foreground/40"
                }`}
              />
              <span className="text-xs text-muted-foreground font-body">
                {isRunning
                  ? "Simulation running…"
                  : `${messages.length} messages · complete`}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground/60">
              <span>
                <span className="text-primary font-semibold">A</span> ·{" "}
                {personalityA}
              </span>
              <span className="text-border">|</span>
              <span>
                <span className="text-accent font-semibold">B</span> ·{" "}
                {personalityB}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Hint pills */}
      {!hasStarted && (
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {[
            "Negotiate a peace treaty",
            "Decide who gets the last pizza slice",
            "Plan the perfect heist",
            "Debate the meaning of consciousness",
          ].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setGoal(suggestion)}
              data-ocid="simulation.suggestion.button"
              className="text-xs font-body bg-secondary border border-border text-muted-foreground px-3 py-1.5 rounded-full transition-smooth hover:border-primary/50 hover:text-foreground"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
