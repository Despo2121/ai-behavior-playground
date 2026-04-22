import {
  BEFORE_TYPING_DELAY,
  BETWEEN_TURN_DELAY,
  calcTypingDuration,
  generateConversation,
  generateMessageId,
} from "@/lib/conversationEngine";
import type {
  Message,
  SimulationConfig,
  SimulationStatus,
} from "@/types/simulation";
import { useCallback, useRef, useState } from "react";

interface SimulationHookState {
  messages: Message[];
  status: SimulationStatus;
  currentTyping: "A" | "B" | null;
  visibleContent: Record<string, string>; // messageId -> currently visible text
}

interface UseSimulationReturn extends SimulationHookState {
  startSimulation: (config: SimulationConfig) => void;
  resetSimulation: () => void;
}

export function useSimulation(): UseSimulationReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<SimulationStatus>("idle");
  const [currentTyping, setCurrentTyping] = useState<"A" | "B" | null>(null);
  const [visibleContent, setVisibleContent] = useState<Record<string, string>>(
    {},
  );

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);

  const clearAllTimers = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    intervalsRef.current.forEach(clearInterval);
    timeoutsRef.current = [];
    intervalsRef.current = [];
  }, []);

  const resetSimulation = useCallback(() => {
    clearAllTimers();
    setMessages([]);
    setStatus("idle");
    setCurrentTyping(null);
    setVisibleContent({});
  }, [clearAllTimers]);

  const typeMessage = useCallback(
    (msgId: string, fullText: string, onComplete: () => void) => {
      let charIndex = 0;
      const interval = setInterval(() => {
        charIndex++;
        setVisibleContent((prev) => ({
          ...prev,
          [msgId]: fullText.slice(0, charIndex),
        }));
        if (charIndex >= fullText.length) {
          clearInterval(interval);
          onComplete();
        }
      }, 28);
      intervalsRef.current.push(interval);
    },
    [],
  );

  const startSimulation = useCallback(
    (config: SimulationConfig) => {
      clearAllTimers();
      setMessages([]);
      setVisibleContent({});
      setStatus("running");
      setCurrentTyping(null);

      const turns = Math.floor(Math.random() * 3) + 6; // 6–8 turns
      const conversation = generateConversation(
        config.goal,
        config.agentAPersonality,
        config.agentBPersonality,
        turns,
      );

      let cumulativeDelay = 0;

      conversation.forEach((turn, index) => {
        const msgId = generateMessageId();

        // Show typing indicator
        const typingDelay = cumulativeDelay;
        const t1 = setTimeout(() => {
          setCurrentTyping(turn.agentId);
        }, typingDelay);
        timeoutsRef.current.push(t1);

        // Add message to list (empty) after typing indicator delay
        const messageDelay = cumulativeDelay + BEFORE_TYPING_DELAY;
        const t2 = setTimeout(() => {
          const newMessage: Message = {
            id: msgId,
            agentId: turn.agentId,
            content: turn.content,
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, newMessage]);
          setCurrentTyping(null);

          // Start character-by-character typing effect
          typeMessage(msgId, turn.content, () => {
            // typing done — nothing extra needed
          });
        }, messageDelay);
        timeoutsRef.current.push(t2);

        const typingDuration = calcTypingDuration(turn.content);
        cumulativeDelay +=
          BEFORE_TYPING_DELAY + typingDuration + BETWEEN_TURN_DELAY;

        // Mark complete after last turn
        if (index === conversation.length - 1) {
          const doneDelay = cumulativeDelay;
          const t3 = setTimeout(() => {
            setStatus("complete");
            setCurrentTyping(null);
          }, doneDelay);
          timeoutsRef.current.push(t3);
        }
      });
    },
    [clearAllTimers, typeMessage],
  );

  return {
    messages,
    status,
    currentTyping,
    visibleContent,
    startSimulation,
    resetSimulation,
  };
}
