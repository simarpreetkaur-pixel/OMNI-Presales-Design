import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type CaptionMilestone = "quote" | "schedule" | "end";

export type CallCaption = {
  speaker: "agent" | "customer";
  name: string;
  text: string;
  milestone?: CaptionMilestone;
  /** Soft field picked up for Quote Creator / CRM */
  capture?: string;
  holdMs?: number;
};

/** Condensed Rajesh / Priya script — closed-caption friendly lengths */
export const PHASE3_CALL_CAPTIONS: CallCaption[] = [
  {
    speaker: "agent",
    name: "Priya",
    text: "Hey, am I speaking to Mr. Rajesh Kumar?",
    holdMs: 3000,
  },
  {
    speaker: "customer",
    name: "Rajesh",
    text: "Yes, speaking.",
    holdMs: 2200,
    capture: "Name: Rajesh Kumar",
  },
  {
    speaker: "agent",
    name: "Priya",
    text: "Hi Mr. Rajesh — Priya from ACKO. You explored Family Floater Health and reached payment but didn’t complete. Any questions I can help with?",
    holdMs: 4800,
    capture: "Intent: Family Floater · payment pending",
  },
  {
    speaker: "customer",
    name: "Rajesh",
    text: "Yes — what’s the waiting period for heart diseases?",
    holdMs: 3000,
  },
  {
    speaker: "agent",
    name: "Priya",
    text: "Sure. Is that for yourself or a family member?",
    holdMs: 2600,
  },
  {
    speaker: "customer",
    name: "Rajesh",
    text: "It’s for my mother. She has high BP — doctor mentioned a possible heart-related issue.",
    holdMs: 4000,
    capture: "Member: Mother · PED concern",
  },
  {
    speaker: "agent",
    name: "Priya",
    text: "For pre-existing heart conditions under this plan, the waiting period is 2 years. Buying earlier starts that clock sooner.",
    holdMs: 4400,
  },
  {
    speaker: "customer",
    name: "Rajesh",
    text: "Okay, that’s helpful. That was my main concern.",
    holdMs: 3000,
  },
  {
    speaker: "agent",
    name: "Priya",
    text: "Since you already started purchase, I can generate a personalized quote from those details.",
    holdMs: 3600,
    capture: "Plan: Family Floater · ACKO Platinum",
  },
  {
    speaker: "customer",
    name: "Rajesh",
    text: "Sure.",
    holdMs: 2000,
    milestone: "quote",
  },
  {
    speaker: "agent",
    name: "Priya",
    text: "Done — I’ve generated your quote. Can I confirm WhatsApp ending 4321?",
    holdMs: 3600,
    capture: "WhatsApp …4321",
  },
  {
    speaker: "customer",
    name: "Rajesh",
    text: "Yes, that’s correct. I just got it.",
    holdMs: 2800,
  },
  {
    speaker: "agent",
    name: "Priya",
    text: "You’ll see premium, coverage, benefits, and the payment link. Okay if I follow up after you’ve reviewed?",
    holdMs: 4200,
  },
  {
    speaker: "customer",
    name: "Rajesh",
    text: "Yes — call me tomorrow around 11 in the morning.",
    holdMs: 3400,
    milestone: "schedule",
    capture: "Callback: Tomorrow · 11:00 AM",
  },
  {
    speaker: "agent",
    name: "Priya",
    text: "Perfect. I’ll schedule tomorrow at 11:00 AM. Thank you, Mr. Rajesh — have a wonderful day!",
    holdMs: 4000,
  },
  {
    speaker: "customer",
    name: "Rajesh",
    text: "Thank you. You too. Bye.",
    holdMs: 2600,
    milestone: "end",
  },
];

interface Phase3CallCaptionRibbonProps {
  enabled: boolean;
  /** Only pause when CX agent explicitly stops / types to interrupt */
  paused?: boolean;
  onMilestone?: (milestone: CaptionMilestone) => void;
  onCapture?: (capture: string) => void;
}

function CaptionLine({
  line,
  emphasis,
}: {
  line: CallCaption;
  emphasis: "current" | "previous";
}) {
  return (
    <div
      className={cn(
        "flex items-baseline gap-2 min-w-0",
        emphasis === "previous" && "opacity-45"
      )}
    >
      <span
        className={cn(
          "shrink-0 text-xs font-semibold",
          line.speaker === "agent" ? "text-[#B59CF5]" : "text-[#8ED4A8]",
          emphasis === "previous" && "text-white/50"
        )}
      >
        {line.name}
      </span>
      <p
        className={cn(
          "text-sm font-normal leading-snug",
          emphasis === "current"
            ? "text-white/95 sm:line-clamp-2"
            : "text-white/55 truncate"
        )}
      >
        {line.text}
      </p>
    </div>
  );
}

const Phase3CallCaptionRibbon = ({
  enabled,
  paused = false,
  onMilestone,
  onCapture,
}: Phase3CallCaptionRibbonProps) => {
  const [index, setIndex] = useState(0);
  const firedRef = useRef<Set<number>>(new Set());
  const captureFiredRef = useRef<Set<number>>(new Set());
  const onMilestoneRef = useRef(onMilestone);
  const onCaptureRef = useRef(onCapture);
  onMilestoneRef.current = onMilestone;
  onCaptureRef.current = onCapture;

  useEffect(() => {
    if (!enabled) {
      setIndex(0);
      firedRef.current = new Set();
      captureFiredRef.current = new Set();
      return;
    }
    setIndex(0);
    firedRef.current = new Set();
    captureFiredRef.current = new Set();
  }, [enabled]);

  // Emit capture when a line becomes current
  useEffect(() => {
    if (!enabled || paused) return;
    if (index >= PHASE3_CALL_CAPTIONS.length) return;
    const line = PHASE3_CALL_CAPTIONS[index];
    if (line.capture && !captureFiredRef.current.has(index)) {
      captureFiredRef.current.add(index);
      onCaptureRef.current?.(line.capture);
    }
  }, [enabled, paused, index]);

  useEffect(() => {
    if (!enabled || paused) return;
    if (index >= PHASE3_CALL_CAPTIONS.length) return;

    const line = PHASE3_CALL_CAPTIONS[index];
    const hold = line.holdMs ?? 3200;

    const nextTimer = window.setTimeout(() => {
      if (line.milestone && !firedRef.current.has(index)) {
        firedRef.current.add(index);
        onMilestoneRef.current?.(line.milestone);
      }
      setIndex((i) => Math.min(i + 1, PHASE3_CALL_CAPTIONS.length));
    }, hold);

    return () => window.clearTimeout(nextTimer);
  }, [enabled, paused, index]);

  if (!enabled) return null;

  const done = index >= PHASE3_CALL_CAPTIONS.length;
  const currentIdx = done ? PHASE3_CALL_CAPTIONS.length - 1 : index;
  const current = PHASE3_CALL_CAPTIONS[currentIdx];
  const previous = currentIdx > 0 ? PHASE3_CALL_CAPTIONS[currentIdx - 1] : null;

  return (
    <div
      className="shrink-0 border-b border-border bg-[#0F0E17] text-white"
      role="region"
      aria-label="Live call captions"
      aria-live="polite"
    >
      <div className="flex items-stretch gap-3 px-5 py-2.5 min-h-[64px]">
        <div className="flex flex-col justify-center gap-1.5 shrink-0 w-[88px]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {!paused && !done && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#55B94D] opacity-75" />
              )}
              <span
                className={cn(
                  "relative inline-flex rounded-full h-2 w-2",
                  paused ? "bg-amber-400" : done ? "bg-onyx-400" : "bg-[#55B94D]"
                )}
              />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/55">
              {paused ? "Paused" : done ? "Ended" : "Live call"}
            </span>
          </div>
          {!done && (
            <span className="text-[10px] text-white/35 tabular-nums pl-4">
              {Math.min(index + 1, PHASE3_CALL_CAPTIONS.length)}/{PHASE3_CALL_CAPTIONS.length}
            </span>
          )}
        </div>

        <div className="h-auto w-px bg-white/15 shrink-0 self-stretch" aria-hidden />

        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 py-0.5">
          {previous && <CaptionLine line={previous} emphasis="previous" />}
          <CaptionLine line={current} emphasis="current" />
        </div>

        {paused && (
          <p className="hidden sm:flex items-center text-[11px] text-amber-200/90 shrink-0 max-w-[140px] text-right leading-snug">
            Type or continue listening to resume captions
          </p>
        )}
      </div>
    </div>
  );
};

export default Phase3CallCaptionRibbon;
