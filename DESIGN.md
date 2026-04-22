# Design Brief — AI Behavior Playground

## Purpose & Context
Interactive simulator for conversing between two personality-driven AI agents. Showcase app emphasizing visual clarity, agent differentiation, and engaging conversation flow. Demonstrate emergent behavior through clean, centered card interface.

## Tone & Aesthetic
Futuristic-minimal. Deep charcoal background with crisp white text. Bold, saturated agent colors (cyan vs. gold). High contrast, clean typography. Modern tech demo — impressive yet beginner-friendly.

## Differentiation
Two distinct agent colors (cyan for Agent A, gold for Agent B) create instant visual separation. Smooth typing animation with bouncing indicator. Elevated card surfaces with subtle depth. Geometric display font (Space Grotesk) reinforces forward-thinking aesthetic.

## Color Palette

| Token | Light OKLCH | Dark OKLCH | Usage |
|-------|------------|-----------|-------|
| Background | `0.99 0 0` | `0.12 0 0` | Page background — near white (light) → near black (dark) |
| Foreground | `0.15 0 0` | `0.96 0 0` | Text — dark grey (light) → off-white (dark) |
| Card | `1.0 0 0` | `0.16 0 0` | Card surfaces — elevated from background |
| Primary (Agent A) | `0.68 0.16 265` | `0.70 0.15 262` | Cyan — chatbubble for Agent A, CTA buttons |
| Accent (Agent B) | `0.70 0.18 84` | `0.70 0.18 84` | Gold/amber — chatbubble for Agent B |
| Destructive | `0.60 0.25 25` | `0.60 0.25 25` | Error/warning states |
| Muted | `0.20 0 0` | `0.20 0 0` | Secondary text, borders |
| Border | `0.9 0 0` | `0.24 0 0` | Element edges — subtle in light, darker in dark |

## Typography

| Layer | Font | Weight | Scale | Usage |
|-------|------|--------|-------|-------|
| Display | Space Grotesk | 700 | 32–48px | Page title "AI Behavior Playground" |
| Heading | Space Grotesk | 700 | 20–24px | Card titles, section labels |
| Body | General Sans | 400–500 | 14–16px | Message text, input, dropdowns |
| Mono | JetBrains Mono | 400 | 12–14px | Code/system output (future) |

## Structural Zones

| Zone | Background | Treatment | Purpose |
|------|-----------|-----------|---------|
| Header | Card (0.16) | Subtle border-b, padding | Title, logo area |
| Main Content | Background (0.12) | Full-bleed centred layout | Control panel and chat display |
| Chat Area | Background (0.12) | Scrollable region, flex column | Message bubbles (Agent A left, Agent B right) |
| Footer | Muted (0.20) | Subtle border-t, small text | Attribution, status hints |
| Card Container | Card (0.16) | Rounded-lg (12px), shadow-elevated, padding | Control inputs, chat wrapper |

## Shape Language
- **Cards:** `rounded-lg` (12px) — soft, approachable
- **Chat Bubbles:** `rounded-[4px]` (4px) — sharp, modern, distinct from cards
- **Buttons:** `rounded-md` (8px) — balanced
- **Inputs:** `rounded-sm` (6px) — minimal

## Spacing & Rhythm
- **Grid:** 8px base unit
- **Density:** Tight in chat (compact bubbles), generous in control panel (visual breathing room)
- **Margins:** 24px between major sections, 16px between subsections, 12px between controls
- **Padding:** 20px inside cards, 16px inside bubbles, 12px inside inputs

## Component Patterns
- **Chat Bubbles:** Agent A (cyan, left-aligned, sharp corners) vs. Agent B (gold, right-aligned, sharp corners). Max-width 65% to prevent excessive line-wrapping.
- **Buttons:** Primary (cyan bg, white text, rounded-md) for "Start Simulation". Secondary (muted bg, grey text) for dropdowns.
- **Inputs:** Light bg (0.24), subtle border, smooth focus state (ring-primary).
- **Typing Indicator:** Bouncing dots (3 grey dots) with 1.4s animation loop.

## Motion & Animation
- **Typing Effect:** Messages fade in + character-by-character reveal (120ms per char)
- **Typing Indicator:** Bouncing dots animation (1.4s loop)
- **Hover States:** Buttons scale 102%, opacity +10%
- **Transitions:** `transition-smooth` (0.3s ease-out) on all interactive elements

## Responsive Design
- **Mobile (< 640px):** Single-column layout, full-width cards, narrower chat bubbles (90% width)
- **Tablet (640–1024px):** Centred card layout, 90% max-width
- **Desktop (> 1024px):** Centred card layout, 1000px max-width

## Constraints
- No external gradients on page background — only solid charcoal
- No glow/neon effects — keep shadows realistic (shadow-elevated only)
- Maintain high contrast (dark bg + cyan/gold) for accessibility
- Avoid animation loops > 2s (reduces motion sickness risk)

## Signature Detail
**Agent color duality:** Cyan vs. gold creates immediate visual distinction without relying on text alone. Replayed in typing indicator (dots use card foreground for visual unity). Elevates from generic chat UI to branded agent-simulator experience.

## Learnings & Guiderails
- Space Grotesk conveys forward-thinking tech aesthetic; pair with neutral General Sans for approachability
- Deep charcoal (0.12) provides strong canvas for bright agent colors; avoids "dim UI" feel
- 4px rounded corners on bubbles contrast nicely with 12px rounded cards — visual hierarchy through shape
- Typing effect + bouncing indicator drive user engagement (reinforces "agent is thinking")

