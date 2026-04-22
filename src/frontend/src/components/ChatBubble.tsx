import type { Message } from "@/types/simulation";
import { useEffect, useRef } from "react";

interface ChatBubbleProps {
  message: Message;
  visibleText: string;
  index: number;
}

export function ChatBubble({ message, visibleText, index }: ChatBubbleProps) {
  const isA = message.agentId === "A";
  const ref = useRef<HTMLDivElement>(null);

  // Fade-in entrance
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = isA ? "translateX(-12px)" : "translateX(12px)";
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = "opacity 0.35s ease, transform 0.35s ease";
        el.style.opacity = "1";
        el.style.transform = "translateX(0)";
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [isA]);

  // Show cursor blinking if text is still being revealed
  const isTyping = visibleText.length < message.content.length;

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-1 ${isA ? "items-start" : "items-end"}`}
      data-ocid={`chat.item.${index + 1}`}
    >
      <span
        className={`text-xs font-display font-semibold tracking-wide ${
          isA ? "text-primary" : "text-accent"
        }`}
      >
        Agent {message.agentId}
      </span>
      <div
        className={`relative max-w-xs sm:max-w-sm md:max-w-md px-4 py-3 rounded-[4px] break-words text-sm leading-relaxed ${
          isA ? "agent-a-bubble" : "agent-b-bubble"
        }`}
      >
        <span>{visibleText}</span>
        {isTyping && (
          <span
            className={`inline-block w-0.5 h-4 ml-0.5 align-middle cursor-blink ${
              isA ? "bg-primary-foreground" : "bg-accent-foreground"
            }`}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
