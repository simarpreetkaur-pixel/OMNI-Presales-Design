import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Target, CircleHelp, X } from "lucide-react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import aiSparkle from "@/assets/lead-summary-ai-sparkle.svg";
import {
  RAJESH_LAST_CALL_SUMMARY_BULLETS,
  RAJESH_LAST_CALL_SUMMARY_LABEL,
  RAJESH_NEXT_BEST_ACTIONS_BULLETS,
  RAJESH_NEXT_BEST_ACTIONS_LABEL,
} from "@/data/rajeshLastCallSummary";
import {
  SAMPADA_LAST_CALL_SUMMARY_BULLETS,
  SAMPADA_LAST_CALL_SUMMARY_LABEL,
  SAMPADA_NEXT_BEST_ACTIONS_BULLETS,
  SAMPADA_NEXT_BEST_ACTIONS_LABEL,
  SAMPADA_TOPIC_BULLETS,
} from "@/data/sampadaSecondCall";
import {
  SAMPADA_THIRD_LAST_CALL_BULLETS,
  SAMPADA_THIRD_LAST_CALL_LABEL,
  SAMPADA_THIRD_NBA_BULLETS,
  SAMPADA_THIRD_NBA_LABEL,
  SAMPADA_THIRD_TOPIC_BULLETS,
} from "@/data/sampadaThirdCall";
import {
  SAMPADA_FOURTH_LAST_CALL_BULLETS,
  SAMPADA_FOURTH_LAST_CALL_LABEL,
  SAMPADA_FOURTH_NBA_BULLETS,
  SAMPADA_FOURTH_NBA_LABEL,
  SAMPADA_FOURTH_TOPIC_BULLETS,
} from "@/data/sampadaFourthCall";
import {
  SAMPADA_FIFTH_LAST_CALL_BULLETS,
  SAMPADA_FIFTH_LAST_CALL_LABEL,
  SAMPADA_FIFTH_NBA_BULLETS,
  SAMPADA_FIFTH_NBA_LABEL,
  SAMPADA_FIFTH_TOPIC_BULLETS,
} from "@/data/sampadaFifthCall";
import type { ObjectionItem } from "@/data/objections";

type Topic = "Quote creation" | "Decision Maker" | "Objections" | "Competitor mentions" | "Payment";

type TopicBullets = Partial<Record<Exclude<Topic, "Objections">, readonly string[]>> & {
  Objections?: readonly ObjectionItem[];
};

export type LeadSummaryVariant = "default" | "first-call" | "second-call" | "third-call" | "fourth-call" | "fifth-call";

type SummaryTile = {
  label: string;
  value: string;
  status?: "healthy" | "needs-attention" | "at-risk" | "critical";
  healthReasons?: readonly string[];
};

const ALL_TOPICS: Topic[] = [
  "Quote creation",
  "Decision Maker",
  "Objections",
  "Competitor mentions",
  "Payment",
];

const RAJESH_TOPIC_BULLETS: TopicBullets = {
  "Quote creation": [
    "A Zero Depreciation quote was generated for the Honda Amaze 2025 comprehensive plan.",
    "Payment was started but not completed.",
  ],
  "Decision Maker": [
    "Rajesh and his wife are joint decision makers for this purchase.",
    "He said he will not complete payment until they have reviewed the quote together.",
  ],
  Objections: [
    {
      objection: "Zero Dep premium feels high for a new Honda Amaze.",
      rebuttal: "Walked through Zero Dep and RSA on the call.",
      resolved: false,
    },
    {
      objection: "Wants to compare insurers and check the premium with his wife.",
      rebuttal: "Shared the quote; noted he will review with his wife before paying.",
      resolved: false,
    },
  ],
  "Competitor mentions": [
    "HDFC Ergo — He said their quote for the Amaze felt lower than ACKO’s Zero Dep premium.",
    "Digit — He likes their 6-hour claim settlement and is holding ACKO against Digit before he decides with his wife.",
  ],
  Payment: [
    "Payment was started but not completed.",
  ],
};

const VARIANT_CONTENT: Record<
  LeadSummaryVariant,
  {
    stage: string;
    stageProgress: number;
    tiles: readonly SummaryTile[];
    showBrief: boolean;
    lastCallLabel: string;
    lastCallBullets: readonly string[];
    nbaLabel: string;
    nbaBullets: readonly string[];
    topics: Topic[];
    topicBullets: TopicBullets;
  }
> = {
  default: {
    stage: "Objections",
    stageProgress: 31,
    tiles: [
      { label: "Lead health", value: "Healthy", status: "healthy", healthReasons: [
        "Stayed on the call for Zero Dep and RSA",
        "Quote shared; payment started",
        "Will decide with his wife",
      ] },
      { label: "Decision maker", value: "Rajesh and his wife" },
      { label: "Open objections", value: "" },
    ],
    showBrief: true,
    lastCallLabel: RAJESH_LAST_CALL_SUMMARY_LABEL,
    lastCallBullets: RAJESH_LAST_CALL_SUMMARY_BULLETS,
    nbaLabel: `${RAJESH_NEXT_BEST_ACTIONS_LABEL}:`,
    nbaBullets: RAJESH_NEXT_BEST_ACTIONS_BULLETS,
    topics: ALL_TOPICS,
    topicBullets: RAJESH_TOPIC_BULLETS,
  },
  "first-call": {
    stage: "Contacted",
    stageProgress: 12,
    tiles: [
      { label: "Lead health", value: "-" },
      { label: "Decision maker", value: "-" },
      { label: "Open objections", value: "-" },
    ],
    showBrief: false,
    lastCallLabel: "",
    lastCallBullets: [],
    nbaLabel: "",
    nbaBullets: [],
    topics: [],
    topicBullets: RAJESH_TOPIC_BULLETS,
  },
  "second-call": {
    stage: "Quote shared",
    stageProgress: 48,
    tiles: [
      { label: "Lead health", value: "Healthy", status: "healthy", healthReasons: [
        "Zero Dep quote shared at ₹6,025",
        "Asked for a callback after checking with her husband",
        "Still proceeding on the ACKO quote",
      ] },
      { label: "Decision maker", value: "Husband" },
      { label: "Open objections", value: "" },
    ],
    showBrief: true,
    lastCallLabel: SAMPADA_LAST_CALL_SUMMARY_LABEL,
    lastCallBullets: SAMPADA_LAST_CALL_SUMMARY_BULLETS,
    nbaLabel: `${SAMPADA_NEXT_BEST_ACTIONS_LABEL}:`,
    nbaBullets: SAMPADA_NEXT_BEST_ACTIONS_BULLETS,
    topics: ALL_TOPICS,
    topicBullets: SAMPADA_TOPIC_BULLETS,
  },
  "third-call": {
    stage: "Payment pending",
    stageProgress: 78,
    tiles: [
      { label: "Lead health", value: "Needs attention", status: "needs-attention", healthReasons: [
        "Pay link sent; payment not confirmed",
        "Revised quote at ₹17,145 after max IDV",
        "She said she would pay now but hasn't",
      ] },
      { label: "Decision maker", value: "Husband" },
      { label: "Open objections", value: "" },
    ],
    showBrief: true,
    lastCallLabel: SAMPADA_THIRD_LAST_CALL_LABEL,
    lastCallBullets: SAMPADA_THIRD_LAST_CALL_BULLETS,
    nbaLabel: `${SAMPADA_THIRD_NBA_LABEL}:`,
    nbaBullets: SAMPADA_THIRD_NBA_BULLETS,
    topics: ALL_TOPICS,
    topicBullets: SAMPADA_THIRD_TOPIC_BULLETS,
  },
  "fourth-call": {
    stage: "Payment pending",
    stageProgress: 78,
    tiles: [
      { label: "Lead health", value: "At risk", status: "at-risk", healthReasons: [
        "Spent 30+ minutes trying to pay",
        "Asked the agent for help",
        "Checkout still not going through",
      ] },
      { label: "Decision maker", value: "Husband" },
      { label: "Open objections", value: "" },
    ],
    showBrief: true,
    lastCallLabel: SAMPADA_FOURTH_LAST_CALL_LABEL,
    lastCallBullets: SAMPADA_FOURTH_LAST_CALL_BULLETS,
    nbaLabel: `${SAMPADA_FOURTH_NBA_LABEL}:`,
    nbaBullets: SAMPADA_FOURTH_NBA_BULLETS,
    topics: ALL_TOPICS,
    topicBullets: SAMPADA_FOURTH_TOPIC_BULLETS,
  },
  "fifth-call": {
    stage: "Payment pending",
    stageProgress: 78,
    tiles: [
      { label: "Lead health", value: "Critical", status: "critical", healthReasons: [
        "Trying for two hours",
        "Frustrated; asked to leave it",
        "Will buy from another company",
      ] },
      { label: "Decision maker", value: "Husband" },
      { label: "Open objections", value: "" },
    ],
    showBrief: true,
    lastCallLabel: SAMPADA_FIFTH_LAST_CALL_LABEL,
    lastCallBullets: SAMPADA_FIFTH_LAST_CALL_BULLETS,
    nbaLabel: `${SAMPADA_FIFTH_NBA_LABEL}:`,
    nbaBullets: SAMPADA_FIFTH_NBA_BULLETS,
    topics: ALL_TOPICS,
    topicBullets: SAMPADA_FIFTH_TOPIC_BULLETS,
  },
};

const healthStatusDotClass = (status?: SummaryTile["status"]) => {
  switch (status) {
    case "healthy":
      return "bg-[#0fa457]";
    case "needs-attention":
      return "bg-[#eab308]";
    case "at-risk":
      return "bg-[#d16900]";
    case "critical":
      return "bg-[#d83d37]";
    default:
      return null;
  }
};

const isAlertHealthStatus = (
  status?: SummaryTile["status"],
): status is Exclude<SummaryTile["status"], "healthy" | undefined> =>
  status === "needs-attention" || status === "at-risk" || status === "critical";

const healthNudgeClassName = (status: Exclude<SummaryTile["status"], "healthy" | undefined>) => {
  switch (status) {
    case "needs-attention":
      return "border-[#fde68a] bg-[#fffbeb]";
    case "at-risk":
      return "border-[#fdba74] bg-[#fff7ed]";
    case "critical":
      return "border-[#fecaca] bg-[#fef2f2]";
  }
};

const LeadSummary = ({ variant = "default" }: { variant?: LeadSummaryVariant }) => {
  const content = VARIANT_CONTENT[variant];
  const [expanded, setExpanded] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [healthNudgeDismissed, setHealthNudgeDismissed] = useState(false);
  const [healthNudgeClosing, setHealthNudgeClosing] = useState(false);
  const [healthTooltipPulse, setHealthTooltipPulse] = useState(false);
  const objections = content.topicBullets.Objections ?? [];
  const openObjectionsCount = objections.filter((item) => !item.resolved).length;
  const leadHealthTile = content.tiles.find((tile) => tile.label === "Lead health");
  const alertHealthStatus = isAlertHealthStatus(leadHealthTile?.status)
    ? leadHealthTile.status
    : null;
  const showHealthNudge =
    Boolean(alertHealthStatus && leadHealthTile?.healthReasons?.length) &&
    !healthNudgeDismissed &&
    !healthNudgeClosing;

  useEffect(() => {
    setHealthNudgeDismissed(false);
    setHealthNudgeClosing(false);
    setHealthTooltipPulse(false);
  }, [variant]);

  const dismissHealthNudge = () => {
    setHealthNudgeClosing(true);
    window.setTimeout(() => {
      setHealthNudgeDismissed(true);
      setHealthNudgeClosing(false);
      setHealthTooltipPulse(true);
      window.setTimeout(() => setHealthTooltipPulse(false), 700);
    }, 280);
  };

  const isTopicDiscussed = (label: Topic) => {
    if (label === "Objections") return objections.length > 0;
    return (content.topicBullets[label]?.length ?? 0) > 0;
  };

  const handleTopicClick = (label: Topic) => {
    if (!isTopicDiscussed(label)) return;
    setSelectedTopic((current) => (current === label ? null : label));
  };

  return (
    <section className="relative z-[1] min-w-0 shrink-0 border-b border-[#e7e7f0] bg-white">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-[#fafafa]"
      >
        <span className="flex min-w-0 flex-1 items-center gap-3">
          <span className="flex shrink-0 items-center gap-2">
            <span className="rounded-lg bg-[#efe9fb] p-1.5">
              <Target className="size-4 text-[#7c47e1]" strokeWidth={2} />
            </span>
            <span className="text-sm font-medium leading-5 text-[#5b5675]">LEAD SUMMARY:</span>
          </span>
          {!expanded && (
            <span className="inline-flex max-w-[min(100%,240px)] shrink truncate rounded-md bg-[#efe9fb] px-2.5 py-1 text-sm font-medium leading-5 text-[#7c47e1]">
              {content.stage}
            </span>
          )}
        </span>
        {expanded ? (
          <ChevronUp className="size-5 shrink-0 text-[#5b5675]" strokeWidth={2} />
        ) : (
          <ChevronDown className="size-5 shrink-0 text-[#5b5675]" strokeWidth={2} />
        )}
      </button>

      {expanded && (
        <div className="flex min-w-0 flex-col gap-3 px-5 pb-4 pt-0">
        <div className="flex w-full flex-wrap gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-[9px] border border-[#e7e7f0] p-3">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-normal leading-5 text-[#5b5675]">Current stage</p>
              <p className="text-sm font-medium leading-5 text-[#36354c]">{content.stage}</p>
            </div>
            <Progress
              value={content.stageProgress}
              className="h-1.5 rounded-[5px] bg-[#f0f0f6] [&>div]:rounded-[5px] [&>div]:bg-[#7c47e1]"
            />
          </div>

          {content.tiles.map((tile) => {
            const valueClass = "text-sm font-medium leading-5 text-[#36354c]";
            const statusDotClass = healthStatusDotClass(tile.status);
            const displayValue =
              tile.label === "Open objections" && tile.value !== "-"
                ? String(openObjectionsCount)
                : tile.value;
            const hasOpenObjections =
              tile.label === "Open objections" && tile.value !== "-" && openObjectionsCount > 0;
            const valueEl = statusDotClass ? (
              <span className={`flex items-center gap-1.5 ${valueClass}`}>
                <span className={`size-1.5 shrink-0 rounded-full ${statusDotClass}`} />
                {displayValue}
              </span>
            ) : (
              <span className={cn(valueClass, hasOpenObjections && "text-[#e22a2a]")}>
                {displayValue}
              </span>
            );

            return (
              <div
                key={tile.label}
                className="flex min-h-[82px] min-w-0 flex-1 flex-col gap-1 rounded-[9px] border border-[#e7e7f0] bg-white p-3"
              >
                <p className="text-sm font-normal leading-5 text-[#5b5675]">{tile.label}</p>
                <div className="flex items-center gap-1.5">
                  {valueEl}
                  {tile.healthReasons?.length ? (
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label={`${tile.value} details`}
                          className={cn(
                            "inline-flex size-5 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 text-[#5b5675] transition-transform hover:text-[#36354c]",
                            tile.label === "Lead health" &&
                              healthTooltipPulse &&
                              "scale-125 text-[#7c47e1]",
                          )}
                        >
                          <CircleHelp className="size-4" strokeWidth={1.75} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        align="center"
                        sideOffset={6}
                        className="max-w-[220px] overflow-visible rounded-lg border-0 bg-[#040222] px-3 py-2 text-left text-sm font-normal leading-5 text-white shadow-none"
                      >
                        <div className="space-y-1">
                          {tile.healthReasons.map((reason) => (
                            <p key={reason} className="flex gap-1.5">
                              <span
                                className={cn(
                                  "mt-1.5 size-1.5 shrink-0 rounded-full",
                                  healthStatusDotClass(tile.status),
                                )}
                              />
                              <span>{reason}</span>
                            </p>
                          ))}
                        </div>
                        <TooltipPrimitive.Arrow className="fill-[#040222]" width={10} height={5} />
                      </TooltipContent>
                    </Tooltip>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {(showHealthNudge || healthNudgeClosing) && alertHealthStatus && leadHealthTile?.healthReasons ? (
          <LeadHealthNudge
            status={alertHealthStatus}
            reasons={leadHealthTile.healthReasons}
            closing={healthNudgeClosing}
            onDismiss={dismissHealthNudge}
          />
        ) : null}

        {content.showBrief && (
          <>
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              <SparklePanel label={content.lastCallLabel} bullets={content.lastCallBullets} />
              <SparklePanel label={content.nbaLabel} bullets={content.nbaBullets} />
            </div>

            <div className="min-w-0">
              <div
                role="group"
                aria-label="Topics"
                className="flex flex-wrap items-center gap-2"
              >
                {content.topics.map((label) => {
                  const isSelected = selectedTopic === label;
                  const isDisabled = !isTopicDiscussed(label);

                  return (
                    <button
                      key={label}
                      type="button"
                      disabled={isDisabled}
                      aria-disabled={isDisabled}
                      aria-pressed={isDisabled ? undefined : isSelected}
                      onClick={() => handleTopicClick(label)}
                      className={cn(
                        "inline-flex h-9 shrink-0 items-center rounded-md px-2 py-1.5 text-sm font-medium leading-5 transition-colors",
                        isSelected && !isDisabled && "bg-[#7c47e1] text-white",
                        !isSelected &&
                          "bg-[#efe9fb] text-[#7c47e1] hover:bg-[#e7d9fb] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#efe9fb]",
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {selectedTopic === "Objections" && objections.length > 0 && (
                <ObjectionsList items={objections} />
              )}
              {selectedTopic && selectedTopic !== "Objections" && content.topicBullets[selectedTopic] && (
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm font-normal leading-5 text-[#5b5675]">
                  {content.topicBullets[selectedTopic].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
        </div>
      )}
    </section>
  );
};

export default LeadSummary;

function ObjectionsList({ items }: { items: readonly ObjectionItem[] }) {
  return (
    <ul className="mt-3 list-disc space-y-3 pl-5 text-sm leading-5 text-[#5b5675]">
      {items.map((item) => {
        return (
          <li key={item.objection} className="marker:text-[#36354c]">
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 flex-1 text-sm font-medium leading-5 text-[#36354c]">
                {item.objection}
              </p>
              <Badge
                size="sm"
                className={cn(
                  "shrink-0 border-0 px-2 py-0.5 text-xs font-medium",
                  item.resolved
                    ? "bg-[#e8f7ef] text-[#0fa457] hover:bg-[#e8f7ef]"
                    : "bg-[#fff7e5] text-[#d16900] hover:bg-[#fff7e5]",
                )}
              >
                {item.resolved ? "Resolved" : "Pending"}
              </Badge>
            </div>
            {item.rebuttal && (
              <p className="mt-1 text-sm font-normal leading-5 text-[#5b5675]">{item.rebuttal}</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function LeadHealthNudge({
  status,
  reasons,
  closing,
  onDismiss,
}: {
  status: Exclude<SummaryTile["status"], "healthy" | undefined>;
  reasons: readonly string[];
  closing: boolean;
  onDismiss: () => void;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 ease-out",
        closing ? "max-h-0 -translate-y-1 opacity-0" : "max-h-40 translate-y-0 opacity-100",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-3 rounded-lg border px-4 py-3",
          healthNudgeClassName(status),
        )}
      >
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          {reasons.map((reason) => (
            <span key={reason} className="inline-flex items-center gap-1">
              <span
                className={cn("size-1.5 shrink-0 rounded-full", healthStatusDotClass(status))}
              />
              <span className="text-xs font-normal leading-none text-[#5b5675]">{reason}</span>
            </span>
          ))}
        </div>
        <button
          type="button"
          aria-label="Dismiss deal health alert"
          onClick={onDismiss}
          className="inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-[#5b5675] transition-colors hover:text-[#36354c]"
        >
          <X className="size-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}

function SparklePanel({
  label,
  bullets,
}: {
  label: string;
  bullets: readonly string[];
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 rounded-[9px] bg-[rgba(248,247,252,0.5)] p-3">
      <div className="flex w-full items-center gap-2">
        <span className="relative size-[18px] shrink-0 overflow-clip">
          <img
            src={aiSparkle}
            alt=""
            className="absolute left-1/2 top-0 h-[18px] w-[10.5px] -translate-x-1/2"
          />
        </span>
        <p className="min-w-0 flex-1 break-words text-xs font-medium leading-[18px] text-[#36354c]">
          {label}
        </p>
      </div>
      {bullets.map((bullet) => (
        <ul key={bullet} className="w-full text-sm font-normal text-[#5b5675]">
          <li className="ms-[21px] list-disc break-words">
            <span className="leading-5">{bullet}</span>
          </li>
        </ul>
      ))}
    </div>
  );
}
