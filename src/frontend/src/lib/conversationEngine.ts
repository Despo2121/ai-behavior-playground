import type { Message, Personality } from "@/types/simulation";

// Personality-aware response templates
// Each template has placeholders: {goal}, {prevPoint}, {agentName}
type TemplateSet = { openers: string[]; replies: string[]; closers: string[] };

const templates: Record<Personality, TemplateSet> = {
  Logical: {
    openers: [
      "The objective of {goal} can be broken down into three measurable components: clarity, efficiency, and outcome.",
      "Analyzing {goal} from first principles reveals two critical constraints we must address upfront.",
      "Based on available data, {goal} has a clear success metric — let's define it before proceeding.",
      "The logical approach to {goal} starts with establishing a shared framework for evaluation.",
    ],
    replies: [
      "Your point has merit, but the evidence suggests a more structured approach would yield better results.",
      "I agree with the premise, however the conclusion doesn't follow without additional supporting data.",
      "That reasoning is partially sound — let me identify the gaps so we can strengthen the argument.",
      "Statistically, that approach works 67% of the time. We should account for the remaining variance.",
      "The causal chain here is: if A, then B, then C. You're skipping B, which introduces risk.",
    ],
    closers: [
      "In conclusion, the optimal path forward requires systematic validation at each step.",
      "The data supports a phased approach — test, measure, iterate.",
      "My final assessment: this is tractable if we remain disciplined about scope.",
    ],
  },
  Aggressive: {
    openers: [
      "Let's skip the pleasantries — {goal} is what matters and I'm not here to waste time.",
      "I'll be blunt: {goal} won't succeed without decisive action. Hesitation is the enemy here.",
      "Fine, we're talking about {goal}? Then we need to stop dancing around the obvious problems.",
      "Everyone else is overthinking {goal}. The answer is obvious if you actually commit.",
    ],
    replies: [
      "That's exactly the kind of passive thinking that kills progress. Pick a lane and stay in it.",
      "Wrong. You're hedging and hedging never built anything worth having.",
      "I've heard that excuse before. Either we push forward hard or we admit we're not serious.",
      "Stop overthinking it. Execute first, optimize later — that's how results happen.",
      "You're arguing semantics while the real problem sits right in front of us. Focus.",
    ],
    closers: [
      "Bottom line: commit fully or get out of the way. Half-measures don't cut it.",
      "We've talked enough. The next move needs to be bold and it needs to happen now.",
      "Results or excuses — pick one. I know which one I'm choosing.",
    ],
  },
  Funny: {
    openers: [
      "Ah, {goal} — the classic human obsession with doing things the hard way. I love it.",
      "So we're tackling {goal}? Great, I've always wanted to star in a disaster movie.",
      "{goal}? Sure, because clearly the easy problems were already taken.",
      "Let me guess — {goal} was someone's brilliant idea at 2am? Those always go well.",
    ],
    replies: [
      "That's a bold strategy — kind of like bringing a PowerPoint to a sword fight.",
      "Ah yes, the 'sounds reasonable until you actually try it' approach. Classic.",
      "I'd argue with that, but honestly I'm still laughing at the implications.",
      "Sure, if by 'works' you mean 'fails in an interesting and educational way'.",
      "You know what they say: the road to {goal} is paved with meetings and broken assumptions.",
    ],
    closers: [
      "Look on the bright side — if this all goes wrong, at least it'll be a great story.",
      "My plan: do the obvious thing, call it innovation, and act surprised when it works.",
      "In summary: we're probably fine. Probably. The margin of error is 'vibes'.",
    ],
  },
  Emotional: {
    openers: [
      "I really believe in {goal} — there's something deeply meaningful about what we're trying to do here.",
      "Honestly, {goal} matters to me on a personal level. This isn't just strategy, it's purpose.",
      "When I think about {goal}, I feel a real sense of responsibility to get it right for everyone involved.",
      "I want us to approach {goal} with genuine care — the stakes are real and so are the people affected.",
    ],
    replies: [
      "I hear you, and I appreciate the honesty. But I also feel like we're missing the human side of this.",
      "That perspective is valid, but what about the people whose lives are actually touched by this decision?",
      "I'm not sure that approach accounts for how this will feel to the people on the receiving end.",
      "Something about that doesn't sit right with me — can we slow down and think about the impact?",
      "I understand the logic, but I also trust my instincts here and they're telling me to be careful.",
    ],
    closers: [
      "At the end of the day, I just want us to do this with integrity and real empathy.",
      "Whatever we decide, I hope we carry the weight of this responsibility seriously.",
      "I feel good about where we landed — as long as we stay true to why we started.",
    ],
  },
};

function pickUnused<T>(arr: T[], used: Set<string>): T {
  const available = arr.filter((item) => !used.has(String(item)));
  if (available.length === 0)
    return arr[Math.floor(Math.random() * arr.length)];
  return available[Math.floor(Math.random() * available.length)];
}

function applyTemplateVars(template: string, goal: string): string {
  // Pick a meaningful snippet from the goal for {prevPoint}
  const goalWords = goal.split(" ").slice(0, 4).join(" ");
  return template
    .replace(/\{goal\}/g, goal)
    .replace(/\{prevPoint\}/g, goalWords)
    .replace(/\{agentName\}/g, "");
}

export type GeneratedTurn = {
  agentId: "A" | "B";
  content: string;
};

export function generateConversation(
  goal: string,
  personalityA: Personality,
  personalityB: Personality,
  turns = 7,
): GeneratedTurn[] {
  const usedLines = new Set<string>();
  const result: GeneratedTurn[] = [];
  const tmplA = templates[personalityA];
  const tmplB = templates[personalityB];

  for (let i = 0; i < turns; i++) {
    const isAgentA = i % 2 === 0;
    const tmpl = isAgentA ? tmplA : tmplB;
    const agentId: "A" | "B" = isAgentA ? "A" : "B";

    let pool: string[];
    if (i === 0) {
      pool = tmpl.openers;
    } else if (i >= turns - 2) {
      pool =
        tmpl.closers.length > 0
          ? [...tmpl.closers, ...tmpl.replies]
          : tmpl.replies;
    } else {
      pool = tmpl.replies;
    }

    const raw = pickUnused(pool, usedLines);
    const content = applyTemplateVars(raw, goal);
    usedLines.add(raw);

    result.push({ agentId, content });
  }

  return result;
}

export function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// Timing helpers
export const TYPING_DELAY_PER_CHAR = 28; // ms per character
export const BETWEEN_TURN_DELAY = 800; // ms between turns
export const BEFORE_TYPING_DELAY = 600; // ms showing typing indicator before text appears
export function calcTypingDuration(text: string): number {
  return Math.min(text.length * TYPING_DELAY_PER_CHAR, 3200);
}
