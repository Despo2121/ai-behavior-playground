export type Personality = "Logical" | "Aggressive" | "Funny" | "Emotional";

export interface Agent {
  id: "A" | "B";
  name: string;
  personality: Personality;
  color: "cyan" | "gold";
}

export interface Message {
  id: string;
  agentId: "A" | "B";
  content: string;
  timestamp: number;
}

export interface SimulationConfig {
  goal: string;
  agentAPersonality: Personality;
  agentBPersonality: Personality;
}

export type SimulationStatus = "idle" | "running" | "complete";

export interface SimulationState {
  config: SimulationConfig;
  messages: Message[];
  status: SimulationStatus;
  currentTyping: "A" | "B" | null;
}
