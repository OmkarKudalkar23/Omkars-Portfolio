---
name: Omkar AI — Conversational Portfolio
description: A night-flight luxury AI console that lands the visitor in a conversation.
colors:
  runway-void: "#080809"
  tarmac: "#0f0f10"
  cockpit-glass: "#161618"
  frosted-panel: "rgba(255,255,255,0.04)"
  hairline-subtle: "rgba(255,255,255,0.06)"
  hairline: "rgba(255,255,255,0.1)"
  hairline-strong: "rgba(255,255,255,0.18)"
  instrument-white: "#f2f2f3"
  dimmed-steel: "#a0a0a8"
  shadowed-grey: "#505058"
  aurora-gauge-blue: "#4f8ef7"
  nav-light-gold: "#c9a96e"
  clearance-green: "#3ecf8e"
  alert-red: "oklch(0.6 0.22 25)"
typography:
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4rem)"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.1em"
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
  xl: "16px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.aurora-gauge-blue}"
    textColor: "{colors.runway-void}"
    rounded: "{rounded.pill}"
    size: "32px"
  button-primary-hover:
    backgroundColor: "{colors.aurora-gauge-blue}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.dimmed-steel}"
    rounded: "{rounded.md}"
    padding: "8px 14px"
  button-ghost-hover:
    backgroundColor: "{colors.cockpit-glass}"
    textColor: "{colors.instrument-white}"
  chip-prompt:
    backgroundColor: "{colors.frosted-panel}"
    textColor: "{colors.dimmed-steel}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  chip-prompt-hover:
    backgroundColor: "{colors.cockpit-glass}"
    textColor: "{colors.instrument-white}"
  pill-tech:
    backgroundColor: "{colors.frosted-panel}"
    textColor: "{colors.dimmed-steel}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  input-chat:
    backgroundColor: "{colors.frosted-panel}"
    textColor: "{colors.instrument-white}"
    rounded: "{rounded.xl}"
  card-project:
    backgroundColor: "{colors.tarmac}"
    textColor: "{colors.instrument-white}"
    rounded: "{rounded.xl}"
---

# Design System: Omkar AI — Conversational Portfolio

## Overview

**Creative North Star: "The Night Flight Deck"**

The visitor is a passenger being guided in for landing. The site is the air-traffic control tower of Omkar's career: a near-black night sky (`#080809`) with a single instrument panel of lights — one aurora-blue beacon for anything live or interactive, gold for wins, green for clearance to reach out. The airplane intro literally brings the visitor in to land; after that, the entire interface behaves like cockpit glass: dark, precise, layered, and lit only where it matters.

The personality is **precision luxury, quiet drama**. Everything is deliberate: 0.5px hairlines instead of borders, Geist's quiet geometry for display type, monospace labels read like instrument readouts, and motion uses one signature easing curve (`cubic-bezier(0.16, 1, 0.3, 1)`) so every transition feels sprung, never bouncy. The drama arrives in rare, earned moments — the landing intro, the lightfall background, a gold shimmer on a first-place card — never as constant noise.

The confirmed anti-reference is the neon cyberpunk overglow and gradient soup common to dark "AI" sites. This system rejects that entire lane: no neon fills, no rainbow gradients, no saturated glow on large surfaces. Glow is reserved for life: a pulsing dot, a hover accent, a live connection.

**Key Characteristics:**
- Near-black layered surfaces (void → tarmac → cockpit glass) separated by 0.5px hairlines, never heavy borders.
- One primary light — Aurora Gauge Blue — used only for interactive and live states.
- Geist display at light weights with tight tracking; Geist Mono as instrument readouts.
- Glass via backdrop blur on panels, rails, and sheets; depth via soft black shadows, not colored glows.
- One easing curve everywhere; state transitions at 150ms; entrances at 400–600ms.
- Motion reduced for `prefers-reduced-motion` in every animation path.

## Colors

The palette is a night instrument panel: near-black neutrals, one primary light, and two signal colors reserved for status.

### Primary
- **Aurora Gauge Blue** (`#4f8ef7`): The single interactive light of the system. Active nav items, the send button fill, the focus border on the chat input, live dots, link hovers, the home state. It appears at full strength only in small doses (a 32px button, a 2px indicator, an 11px label); as a wash it stays below 10–15% alpha (`rgba(79,142,247,0.08–0.15)`).

### Secondary
- **Nav Light Gold** (`#c9a96e`): Reserved for first-place wins — the gold-tinted border on 1st-place hackathon cards, the trophy label, and shimmer borders on win cards. Never used for navigation or body text.
- **Clearance Green** (`#3ecf8e`): Status only: "Available Now", "Open to opportunities", the pulsing green dot, success toasts. Signals that the path to contact is open.

### Tertiary
- **Alert Red** (`oklch(0.6 0.22 25)`): Destructive states only (shadcn `--destructive`).

### Neutral
- **Runway Void** (`#080809`): The page background — the night sky. Also the base behind the chat column and the underside of every surface.
- **Tarmac** (`#0f0f10`): The first layer up: card surfaces, contact card, panel contents.
- **Cockpit Glass** (`#161618`): Elevated surfaces: hover fills, popovers, the mobile sheet, toast backgrounds.
- **Frosted Panel** (`rgba(255,255,255,0.04)`): Glass fills on chips, icon wells, and the chat input.
- **Instrument White** (`#f2f2f3`): Primary text. Never pure `#ffffff`.
- **Dimmed Steel** (`#a0a0a8`): Secondary text, idle icons, meta lines.
- **Shadowed Grey** (`#505058`): Muted text, mono meta, uppercase eyebrow labels, disabled hints.
- **Hairline** family (`rgba(255,255,255,0.06/0.1/0.18)`): subtle/default/strong borders, always at 0.5px.

Project and hackathon cards carry a per-item accent (e.g. `#c084fc` Nolan, `#34d399` Finverse, `#60a5fa` SignSync) that tints the item's dot, glow, and border — a signal of the item's own identity, never a system-wide color.

### Named Rules
**The One Light Rule.** Aurora Gauge Blue covers under ~10% of any screen. Its rarity is what makes it a beacon; a second full-strength blue surface on the same screen is a defect.
**The Status Lock Rule.** Green and gold are status lights, not decoration. Green = open to opportunities / success. Gold = first place. Nothing else may borrow them.

## Typography

**Display Font:** Geist (with system-ui fallback), weights 300–500
**Body Font:** Inter (with system-ui fallback), weights 400–600
**Label/Mono Font:** Geist Mono (with ui-monospace fallback), weight 400

**Character:** Geist's geometric calm carries the brand voice — light weights, tight tracking, no serifs in the console. Mono readouts do the technical talking: dates, roles, tech stacks, stats, eyebrow labels. Inter keeps long-form answers readable and warm against the technical scaffolding.

### Hierarchy
- **Display** (Geist 300, 40px, line-height 1.1, tracking −0.02em): The greeting "Hi, I'm Omkar AI." and page heroes (case studies use 48px; large heroes scale to `clamp(2.5rem, 5vw, 4rem)`). Light weight is the identity — never bold display.
- **Headline** (Geist 500, 28px, line-height 1.2, tracking −0.02em): Section titles and widget headings.
- **Title** (Geist 500, 20px, tracking −0.01em): Card titles — project names, company names.
- **Body** (Inter 400, 16px, line-height 1.7): Chat answers, descriptions, paragraphs. The chat composer itself is 15px; secondary meta lines drop to 13–14px. Keep reading lines under ~65ch.
- **Label** (Geist Mono 400, 10–11px, letter-spacing 0.1em, uppercase): Eyebrow labels ("PROJECTS", "EXPERIENCE"), panel headers, mono metadata. The readout voice of the system.

### Named Rules
**The No-Bold-Display Rule.** Display type is always light or medium weight; bold display is the signature of the templates this system rejects. Weight contrast comes from mono vs sans, not black display type.
**The Readout Rule.** If it's a fact a recruiter scans for (dates, metrics, tech, roles), it's Geist Mono. If it's a sentence, it's Inter.

## Layout

The chat column is the runway: a single centered column, `max-width: 760px`, horizontal padding `20px`, with the greeting arriving at `14vh` down. Everything on the home page — greeting, prompts, messages, composer — lives inside that one column; nothing escapes it.

Around the runway: the icon rail is a fixed 48px-wide glass panel, vertically centered on the left, rounded only on its right edge (14px). On sub-routes the content area clears the rail with a 48px left margin. The contextual chat bubble docks bottom-right. The experience page runs a fixed flight-stage scrollytelling sequence (the "takeoff section") before its timeline.

Responsive: at ≤767px the rail disappears and a floating circular menu button (44px, bottom-right, accent-tinted glass) opens a bottom sheet (70vh, top radius 20px, spring-staggered tabs). The type scale steps down (base 16→14px, display 40→30px at the top end). The rail returns at ≥768px. Spacing rhythm is 4/8/16/24/40px; cards in grids gap at 12px, grids collapse to one column below `sm`.

## Elevation & Depth

Depth is **layered glass with glow as the "live" signal** — not colored shadows. The stack: page sits on Runway Void; surfaces are one layer up on Tarmac or Frosted Panel with backdrop blur (12–28px) where they float; the highest layer is translucent glass over blur (`rgba(8,8,9,0.93–0.97)` + blur 28px for the slide-out panel and mobile sheet).

Shadows are ambient and black — they separate glass from night, they never carry color:

- **Rest** (`0 4px 20px rgba(0,0,0,0.4)`): resting cards.
- **Hover** (`0 8px 32px rgba(0,0,0,0.6)`): cards lift −2px and deepen their shadow.
- **Floating** (`0 8px 40px rgba(0,0,0,0.45)`): the contact card, toast, floating bubble.
- **Hanging** (`0 16px 56px rgba(0,0,0,0.55)` + inset `0 2px 0 rgba(255,255,255,0.08)`): the scrollytelling experience cards — deepest shadow in the system, and the only place an inset top highlight is used.

Life is glow: the availability dot pulses a green ring (`dot-pulse-green`), timeline nodes glow `0 0 8px rgba(79,142,247,0.5)`, project dots cast `0 0 12px` of their accent, and the cable line in the takeoff section pulses a warm drop-shadow. If it glows, it means something is live.

### Named Rules
**The Glow-Means-Live Rule.** A glow on the page is always a status signal — pulsing availability, an active node, a hover state. Decorative glow that isn't a signal is rejected (see: no neon soup).
**The Black Shadow Rule.** Shadows are pure black on alpha. A colored shadow is a different design system; don't introduce one.

## Shapes

The form language is **precision instruments with soft edges**: the base radius is 12px (`--radius: 0.75rem`), buttons at 10px, cards and the chat input at 16px, pills fully round, and the mobile sheet at 20px on its top corners. Hairline borders (0.5px, white at 6–18% alpha) define nearly every surface; they read as seams of glass rather than outlines.

Geometry does the identity work: dots are perfect circles (8px node dots, 6px status dots), indicators are 2px bars, and the only sharp corner in the system is the rail's right edge — the dock where glass meets the night. Accent-tinted borders mark winners (gold at 30%) and signature projects (accent at ~19% with a 1px border for the gallery's hero card).

## Components

Components behave like precision instruments: hairline seams, quiet hover shifts, and one deliberate micro-interaction on the primary action.

### Buttons
- **Shape:** rounded 10px (ghost) / pill (primary send).
- **Primary (send):** 32px circle, Aurora Gauge Blue fill, dark arrow icon (`#080809`), magnetic hover pull (0.25 strength); disabled at 30% opacity. The only filled button in the system.
- **Hover / Focus:** ghost buttons shift surface to Cockpit Glass, border to strong, text to Instrument White, all in 150ms. Focus states use the accent at 40% alpha.
- **Ghost (default):** transparent, hairline border, Dimmed Steel text, 13px, padding 8px 14px. Used for actions everywhere (email, LinkedIn, GitHub, mobile nav).

### Chips
- **Prompt chips** (suggested prompts): pill, Frosted Panel fill, hairline border, Dimmed Steel text; hover lifts −1px, fills Cockpit Glass, text to white.
- **Tech pills:** pill, 11px Geist Mono, hairline border, Frosted Panel fill; accent-tinted variants inherit the item's accent color at ~8% fill and ~20% border.

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** Tarmac (`#0f0f10`); the gallery hero card sits on `#0d0d0d`.
- **Shadow Strategy:** ambient black per the Elevation section (rest → hover lift −2px).
- **Border:** 0.5px hairline; signature projects carry a 1px accent-tinted border, winners a gold-tinted one.
- **Internal Padding:** 24px (cards), 14px (compact panels).

### Inputs / Fields
- **Style:** rounded 16px, Frosted Panel fill, hairline border, 0.5px, backdrop blur 20px, autosizing textarea, 15px text.
- **Focus:** border shifts to Aurora Gauge Blue at 40%; the field also tracks the cursor with a faint radial gradient in the accent.
- **Placeholder:** Shadowed Grey. Disabled state dims the composer.

### Navigation
- **Desktop rail:** 48px fixed glass column, 40px icon wells rounded 10px, 17px icons at 1.8 stroke weight; idle at white 35%, active = Aurora Gauge Blue with a 10% accent wash and a 2px left indicator bar; tooltips slide out left of the rail.
- **Panel (home only):** 280px slide-out at 48px from the left, full height, blur 28px, hairline right border, spring animation (stiffness 300, damping 30). Panel headers are mono eyebrows with a 24px accent underline.
- **Mobile:** floating circular trigger bottom-right; bottom sheet at 70vh with tab chips, hairline dividers, and spring-staggered entries.

### Signature Components
- **The Landing Sequence:** an editorial serif (Libre Baskerville) scrollytelling intro in cream (`#D0CBC7`) and ink (`#171511`) over a blueprint grid (`#131C2A`) — a distinct, self-contained world that hands off to the night console. It has its own skip button.
- **The Takeoff Section:** fixed flight-stage with an SVG plane and hanging glass cards on glowing cables, driven by GSAP.
- **Lightfall:** a WebGL streak background (accent blue/violet/green on `#080809`) with mouse interaction, at 40% opacity on the home page.
- **The Plane Cursor:** a small plane follows the cursor site-wide.
- **The Dijkstra Visualization** (skills) and **Radar** (WebGL) extend the instrument-panel voice.

## Do's and Don'ts

### Do:
- **Do** build surfaces in the void → tarmac → cockpit-glass family with 0.5px hairlines; seams, not borders.
- **Do** keep the home conversation inside the 760px centered column.
- **Do** set every fact a recruiter scans for (dates, metrics, tech, roles) in Geist Mono.
- **Do** reserve Aurora Gauge Blue for interactive and live states — small doses only.
- **Do** use the signature easing `cubic-bezier(0.16, 1, 0.3, 1)` and 150ms state transitions; 400–600ms for entrances.
- **Do** honor `prefers-reduced-motion` — the system already carries reduced-motion rules for every animation.
- **Do** let gold mean first place and green mean "available".

### Don't:
- **Don't** use neon fills, rainbow gradients, or saturated glow on large surfaces — the neon-soup look is the system's anti-reference.
- **Don't** set display type in bold or heavier than medium; light-weight Geist is the identity.
- **Don't** use pure `#ffffff`; Instrument White is `#f2f2f3`.
- **Don't** bring the serif editorial faces (Libre Baskerville, cream, ink) outside the landing sequence — the night console speaks sans and mono.
- **Don't** give shadows color; black-on-alpha shadows only.
- **Don't** use green or gold for decoration — they are status lights.
- **Don't** widen the chat column, move the rail, or drop the 48px content margin on desktop; the runway geometry is fixed.
