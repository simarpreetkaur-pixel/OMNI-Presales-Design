import { useCallback, useEffect, useRef, useState } from "react";
import {
  Loader2,
  FileText,
  CalendarDays,
  MessageSquare,
  Sparkles,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuoteFormData } from "@/components/QuoteBuilder";

export const FAMILY_FLOATER_QUOTE_DATA: QuoteFormData = {
  fullName: "Rajesh Kumar",
  age: "38",
  phoneNumber: "9XXXXXX321",
  emailId: "rajesh.kumar@example.com",
  gender: "Male",
  pincode: "560077",
  members: [{ type: "Mother", name: "Sushila Devi", age: "62" }],
  selectedPlan: "acko-platinum",
};

export type SchedulePreset = {
  dateOption: "tomorrow";
  exactTime: string;
  language: string;
  autoConfirmMs?: number;
};

export type StepKind = "listen" | "status" | "action";
export type StepStatus =
  | "pending"
  | "running"
  | "awaiting"
  | "done"
  | "rejected"
  | "skipped"
  | "stopped";

export type ActionId =
  | "create_quote"
  | "schedule_followup"
  | "alt_brochure"
  | "alt_schedule_evening";

export interface AgentStep {
  id: string;
  kind: StepKind;
  title: string;
  detail?: string;
  meta?: string[];
  capture?: string;
  /** Short quote of what on the call triggered this suggestion */
  suggestedBecause?: string;
  actionId?: ActionId;
  icon?: "listen" | "quote" | "calendar" | "message" | "sparkles";
  status: StepStatus;
}

const LISTEN_ICON = {
  listen: Radio,
  quote: FileText,
  calendar: CalendarDays,
  message: MessageSquare,
  sparkles: Sparkles,
} as const;

const QUOTE_ACTION: Omit<AgentStep, "status"> = {
  id: "a_quote",
  kind: "action",
  title: "Create Family Floater quote",
  detail:
    "Mother on the policy, heart waiting-period concern, and his go-ahead. Open the prefilled draft — you send it.",
  meta: [
    "Self: Rajesh Kumar, 38",
    "Member: Mother — Sushila Devi, 62",
    "Pincode 560077 · WhatsApp …4321",
  ],
  suggestedBecause: 'Rajesh: “Sure.”',
  actionId: "create_quote",
  icon: "quote",
};

const SCHEDULE_ACTION: Omit<AgentStep, "status"> = {
  id: "a_schedule",
  kind: "action",
  title: "Schedule follow-up for tomorrow, 11:00 AM",
  detail: "He asked for a morning callback after reviewing the quote. Open the calendar — you confirm.",
  meta: ["Date: Tomorrow", "Time: 11:00 AM", "Language: Hindi"],
  suggestedBecause: 'Rajesh: “Call me tomorrow around 11…”',
  actionId: "schedule_followup",
  icon: "calendar",
};

const ALT_BROCHURE: Omit<AgentStep, "status"> = {
  id: "a_alt_brochure",
  kind: "action",
  title: "Share waiting-period FAQ + plan brochure instead",
  detail: "Another option if you’d rather not open Quote Creator right now.",
  meta: ["Channel: WhatsApp …4321", "Includes: 2-year PED waiting period FAQ"],
  suggestedBecause: "You dismissed the quote draft",
  actionId: "alt_brochure",
  icon: "message",
};

const ALT_SCHEDULE: Omit<AgentStep, "status"> = {
  id: "a_alt_schedule",
  kind: "action",
  title: "Try tomorrow at 4:00 PM instead",
  detail: "Alternative slot if 11:00 AM doesn’t feel right. Open calendar — you confirm.",
  meta: ["Date: Tomorrow", "Time: 4:00 PM", "Language: Hindi"],
  suggestedBecause: "You dismissed the 11:00 AM slot",
  actionId: "alt_schedule_evening",
  icon: "calendar",
};

export interface Phase3AgentTools {
  onCreateQuote: (data: QuoteFormData) => void;
  onScheduleFollowUp: (preset: SchedulePreset) => void;
  onShareBrochure: () => void;
  onQuoteToolDone: () => void;
  onScheduleToolDone: (date: string, time: string) => void;
}

export type Phase3RunState =
  | "idle"
  | "listening"
  | "awaiting_approval"
  | "running"
  | "stopped"
  | "completed";

/** Action-only agent — listening UI lives in the caption ribbon */
export function usePhase3Agent(
  enabled: boolean,
  tools: Phase3AgentTools,
  onStepsChange?: () => void
) {
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [runState, setRunState] = useState<Phase3RunState>("idle");
  const timersRef = useRef<number[]>([]);
  const toolsRef = useRef(tools);
  toolsRef.current = tools;
  const offeredRef = useRef<Set<string>>(new Set());

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    onStepsChange?.();
  }, [steps, runState, onStepsChange]);

  useEffect(() => {
    if (!enabled) {
      clearTimers();
      offeredRef.current = new Set();
      setSteps([]);
      setRunState("idle");
      return;
    }
    offeredRef.current = new Set();
    setSteps([]);
    setRunState("listening");
    return () => clearTimers();
  }, [enabled, clearTimers]);

  const offerAction = useCallback((kind: "quote" | "schedule") => {
    if (kind === "quote" && offeredRef.current.has("quote")) return;
    if (kind === "schedule" && offeredRef.current.has("schedule")) return;

    if (kind === "quote") {
      offeredRef.current.add("quote");
      setSteps((prev) => {
        const kept = prev.filter(
          (s) =>
            (s.status === "done" || s.status === "rejected") &&
            s.actionId !== "create_quote"
        );
        return [...kept, { ...QUOTE_ACTION, status: "awaiting" as StepStatus }];
      });
      setRunState("awaiting_approval");
      return;
    }

    offeredRef.current.add("schedule");
    setSteps((prev) => {
      const kept = prev.filter(
        (s) =>
          (s.status === "done" || s.status === "rejected") &&
          s.actionId !== "schedule_followup" &&
          s.actionId !== "alt_schedule_evening"
      );
      return [...kept, { ...SCHEDULE_ACTION, status: "awaiting" as StepStatus }];
    });
    setRunState("awaiting_approval");
  }, []);

  const executeAction = useCallback(
    (actionId: ActionId, stepId: string) => {
      setRunState("running");
      setSteps((prev) =>
        prev.map((s) => (s.id === stepId ? { ...s, status: "running" as StepStatus } : s))
      );
      const t = toolsRef.current;

      if (actionId === "create_quote") {
        t.onCreateQuote(FAMILY_FLOATER_QUOTE_DATA);
        schedule(() => {
          setSteps((prev) =>
            prev.map((s) =>
              s.id === stepId
                ? {
                    ...s,
                    status: "done" as StepStatus,
                    detail:
                      "Opened Quote Creator with a prefilled draft — review and send when you’re ready.",
                  }
                : s
            )
          );
          t.onQuoteToolDone();
          setRunState("listening");
        }, 350);
        return;
      }

      if (actionId === "alt_brochure") {
        t.onShareBrochure();
        schedule(() => {
          setSteps((prev) =>
            prev.map((s) =>
              s.id === stepId
                ? {
                    ...s,
                    status: "done" as StepStatus,
                    detail: "FAQ + brochure shared on WhatsApp (…4321).",
                  }
                : s
            )
          );
          setRunState("listening");
        }, 500);
        return;
      }

      // Schedule: open prefilled calendar — CX confirms (no auto-confirm)
      if (actionId === "schedule_followup" || actionId === "alt_schedule_evening") {
        const exactTime = actionId === "alt_schedule_evening" ? "4:00pm" : "11:00am";
        const label = actionId === "alt_schedule_evening" ? "4:00 PM" : "11:00 AM";
        t.onScheduleFollowUp({
          dateOption: "tomorrow",
          exactTime,
          language: "Hindi",
        });
        schedule(() => {
          setSteps((prev) =>
            prev.map((s) =>
              s.id === stepId
                ? {
                    ...s,
                    status: "done" as StepStatus,
                    detail: `Opened calendar for tomorrow ${label} — confirm the slot yourself.`,
                  }
                : s
            )
          );
          setRunState("listening");
        }, 350);
      }
    },
    [schedule]
  );

  const approve = useCallback(
    (stepId: string) => {
      const step = steps.find((s) => s.id === stepId);
      if (!step?.actionId || step.status !== "awaiting") return;
      executeAction(step.actionId, step.id);
    },
    [executeAction, steps]
  );

  const reject = useCallback(
    (stepId: string) => {
      const step = steps.find((s) => s.id === stepId);
      if (!step?.actionId || step.status !== "awaiting") return;

      setSteps((prev) =>
        prev.map((s) =>
          s.id === stepId ? { ...s, status: "rejected" as StepStatus } : s
        )
      );

      if (step.actionId === "create_quote") {
        schedule(() => {
          setSteps((prev) => [
            ...prev.filter((s) => s.id !== ALT_BROCHURE.id),
            { ...ALT_BROCHURE, status: "awaiting" },
          ]);
          setRunState("awaiting_approval");
        }, 300);
        return;
      }

      if (step.actionId === "alt_brochure") {
        setRunState("listening");
        return;
      }

      if (step.actionId === "schedule_followup") {
        schedule(() => {
          setSteps((prev) => [
            ...prev.filter((s) => s.id !== ALT_SCHEDULE.id),
            { ...ALT_SCHEDULE, status: "awaiting" },
          ]);
          setRunState("awaiting_approval");
        }, 300);
        return;
      }

      if (step.actionId === "alt_schedule_evening") {
        setRunState("listening");
      }
    },
    [schedule, steps]
  );

  const stop = useCallback(() => {
    clearTimers();
    setRunState("stopped");
  }, [clearTimers]);

  const resume = useCallback(() => {
    if (runState !== "stopped") return;
    const awaiting = steps.some((s) => s.status === "awaiting");
    setRunState(awaiting ? "awaiting_approval" : "listening");
  }, [runState, steps]);

  const markCallEnded = useCallback(() => {
    setRunState((s) => (s === "completed" ? s : s === "awaiting_approval" ? s : "completed"));
  }, []);

  return {
    steps,
    runState,
    isBusy: runState === "running",
    isAwaiting: runState === "awaiting_approval",
    offerAction,
    approve,
    reject,
    stop,
    resume,
    markCallEnded,
    start: () => setRunState("listening"),
  };
}

function isViewAction(actionId?: ActionId) {
  return (
    actionId === "create_quote" ||
    actionId === "schedule_followup" ||
    actionId === "alt_schedule_evening"
  );
}

export function AgentStepCard({
  step,
  onApprove,
  onReject,
}: {
  step: AgentStep;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const Icon = LISTEN_ICON[step.icon ?? "quote"];
  const isAwaiting = step.status === "awaiting";
  const isRunning = step.status === "running";
  const isDone = step.status === "done";
  const isRejected = step.status === "rejected";

  if (step.kind !== "action") return null;
  if (step.status === "pending" || step.status === "skipped" || step.status === "stopped") {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3.5 transition-colors animate-cta-fade-in shadow-sm bg-card",
        isAwaiting && "border-[#5920C5]/45 ring-1 ring-[#5920C5]/10",
        isRunning && "border-purple-200",
        isDone && "border-border",
        isRejected && "border-border opacity-70"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
            (isAwaiting || isRunning) && "bg-purple-100 text-primary",
            (isDone || isRejected) && "bg-onyx-200 text-onyx-600"
          )}
        >
          {isRunning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Icon className="h-4 w-4" />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2.5">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-primary/80">
              {isAwaiting
                ? "Next best action"
                : isRunning
                  ? "Opening…"
                  : isDone
                    ? isViewAction(step.actionId)
                      ? "Ready for you"
                      : "Done"
                    : "Dismissed"}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-foreground leading-snug">
              {step.title}
            </p>
            {step.suggestedBecause && isAwaiting && (
              <p className="mt-1.5 inline-flex max-w-full items-start gap-1.5 rounded-lg bg-purple-50 border border-purple-100 px-2.5 py-1.5 text-xs text-[#4E29BB] leading-snug">
                <span className="font-semibold shrink-0">Suggested because</span>
                <span className="text-[#5B5675] truncate">{step.suggestedBecause}</span>
              </p>
            )}
            {step.detail && (
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{step.detail}</p>
            )}
          </div>

          {step.meta && step.meta.length > 0 && (isAwaiting || isRunning || isDone) && (
            <div className="rounded-xl bg-[#F8F7FC] border border-[rgba(208,189,244,0.45)] px-3 py-2.5 space-y-1.5">
              <p className="text-[11px] font-medium text-[#5B5675]">From the conversation</p>
              {step.meta.map((line) => (
                <p key={line} className="text-xs text-foreground/85 leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          )}

          {isAwaiting && (
            <div className="flex flex-wrap gap-2 pt-0.5">
              <Button
                size="sm"
                className="h-9 rounded-xl text-sm font-medium"
                onClick={() => onApprove(step.id)}
              >
                {isViewAction(step.actionId) ? "View" : "Approve"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-9 rounded-xl text-sm font-medium bg-white"
                onClick={() => onReject(step.id)}
              >
                Dismiss
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Phase3ListeningPanel({ captures }: { captures: string[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-3.5 shadow-sm animate-cta-fade-in">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        <p className="text-sm font-medium text-foreground">Listening to the call</p>
      </div>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
        Captions are live above. I’ll suggest a next best action when something useful comes up —
        the call won’t pause.
      </p>
      {captures.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px] font-medium text-[#5B5675] mb-1.5">
            Prefilling from the conversation
          </p>
          <div className="flex flex-wrap gap-1.5">
            {captures.map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center rounded-full border border-[rgba(208,189,244,0.7)] bg-purple-50/80 px-2.5 py-1 text-[11px] font-medium text-[#4E29BB] animate-cta-fade-in"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Chat surface: only next-best-action cards */
export default function Phase3NextBestActions({
  steps,
  onApprove,
  onReject,
}: {
  steps: AgentStep[];
  runState?: Phase3RunState;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onResume?: () => void;
}) {
  const actions = steps.filter(
    (s) =>
      s.kind === "action" &&
      (s.status === "awaiting" ||
        s.status === "running" ||
        s.status === "done" ||
        s.status === "rejected")
  );

  if (actions.length === 0) return null;

  return (
    <div className="space-y-3 w-full max-w-2xl">
      {actions.map((step) => (
        <AgentStepCard
          key={step.id}
          step={step}
          onApprove={onApprove}
          onReject={onReject}
        />
      ))}
    </div>
  );
}
