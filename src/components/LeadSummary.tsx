import { useState } from "react";
import { Target, CircleHelp } from "lucide-react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Card, CardContent } from "@/components/ui/card";
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

type Topic = "Quote creation" | "Decision Maker" | "Objections" | "Competitor mentions";

export type LeadSummaryVariant = "default" | "first-call" | "second-call" | "third-call" | "fourth-call" | "fifth-call";

type SummaryTile = {
  label: string;
  value: string;
  status?: "healthy" | "at-risk";
  healthReasons?: readonly string[];
};

const RAJESH_TOPICS: Topic[] = [
  "Quote creation",
  "Decision Maker",
  "Objections",
  "Competitor mentions",
];

const RAJESH_TOPIC_BULLETS: Record<Topic, string[]> = {
  "Quote creation": [
    "A Zero Depreciation quote was generated for the Honda Amaze 2025 comprehensive plan.",
    "Payment was started but not completed.",
  ],
  "Decision Maker": [
    "Rajesh and his wife are joint decision makers for this purchase.",
    "He said he will not complete payment until they have reviewed the quote together.",
  ],
  Objections: [
    "Pricing concern — Rajesh said the Zero Dep premium feels high for a new Honda Amaze and wants to compare it with other insurers.",
    "He wants to check the number with his wife before paying.",
  ],
  "Competitor mentions": [
    "HDFC Ergo — He said their quote for the Amaze felt lower than ACKO’s Zero Dep premium.",
    "Digit — He likes their 6-hour claim settlement and is holding ACKO against Digit before he decides with his wife.",
  ],
};

const SAMPADA_TOPICS = Object.keys(SAMPADA_TOPIC_BULLETS) as Topic[];

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
    topicBullets: Partial<Record<Topic, readonly string[]>>;
  }
> = {
  default: {
    stage: "Objections",
    stageProgress: 31,
    tiles: [
      { label: "Deal health", value: "Healthy", status: "healthy", healthReasons: [
        "Stayed on the call for Zero Dep and RSA",
        "Quote shared; payment started",
        "Will decide with his wife",
      ] },
      { label: "Decision maker", value: "Rajesh and his wife" },
      { label: "Last interaction", value: "2 days ago" },
    ],
    showBrief: true,
    lastCallLabel: RAJESH_LAST_CALL_SUMMARY_LABEL,
    lastCallBullets: RAJESH_LAST_CALL_SUMMARY_BULLETS,
    nbaLabel: `${RAJESH_NEXT_BEST_ACTIONS_LABEL}:`,
    nbaBullets: RAJESH_NEXT_BEST_ACTIONS_BULLETS,
    topics: RAJESH_TOPICS,
    topicBullets: RAJESH_TOPIC_BULLETS,
  },
  "first-call": {
    stage: "Contacted",
    stageProgress: 12,
    tiles: [
      { label: "Deal health", value: "-" },
      { label: "Decision maker", value: "-" },
      { label: "Last interaction", value: "-" },
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
      { label: "Deal health", value: "Pending" },
      { label: "Decision maker", value: "Husband" },
      { label: "Last interaction", value: "15 min ago" },
    ],
    showBrief: true,
    lastCallLabel: SAMPADA_LAST_CALL_SUMMARY_LABEL,
    lastCallBullets: SAMPADA_LAST_CALL_SUMMARY_BULLETS,
    nbaLabel: `${SAMPADA_NEXT_BEST_ACTIONS_LABEL}:`,
    nbaBullets: SAMPADA_NEXT_BEST_ACTIONS_BULLETS,
    topics: SAMPADA_TOPICS,
    topicBullets: SAMPADA_TOPIC_BULLETS,
  },
  "third-call": {
    stage: "Payment pending",
    stageProgress: 78,
    tiles: [
      { label: "Deal health", value: "Healthy", status: "healthy", healthReasons: [
        "Asked for max IDV and the revised ACKO quote",
        "Asked for payment link",
        "Mentioned she'd pay now",
      ] },
      { label: "Decision maker", value: "Husband" },
      { label: "Last interaction", value: "30 min ago" },
    ],
    showBrief: true,
    lastCallLabel: SAMPADA_THIRD_LAST_CALL_LABEL,
    lastCallBullets: SAMPADA_THIRD_LAST_CALL_BULLETS,
    nbaLabel: `${SAMPADA_THIRD_NBA_LABEL}:`,
    nbaBullets: SAMPADA_THIRD_NBA_BULLETS,
    topics: ["Quote creation", "Decision Maker", "Objections", "Competitor mentions"],
    topicBullets: SAMPADA_THIRD_TOPIC_BULLETS,
  },
  "fourth-call": {
    stage: "Payment pending",
    stageProgress: 78,
    tiles: [
      { label: "Deal health", value: "At risk", status: "at-risk", healthReasons: [
        "Spent 30+ minutes trying to pay",
        "Asked the agent for help",
        "Checkout still not going through",
      ] },
      { label: "Decision maker", value: "Husband" },
      { label: "Last interaction", value: "30 min ago" },
    ],
    showBrief: true,
    lastCallLabel: SAMPADA_FOURTH_LAST_CALL_LABEL,
    lastCallBullets: SAMPADA_FOURTH_LAST_CALL_BULLETS,
    nbaLabel: `${SAMPADA_FOURTH_NBA_LABEL}:`,
    nbaBullets: SAMPADA_FOURTH_NBA_BULLETS,
    topics: ["Quote creation", "Decision Maker", "Objections", "Competitor mentions"],
    topicBullets: SAMPADA_FOURTH_TOPIC_BULLETS,
  },
  "fifth-call": {
    stage: "Payment pending",
    stageProgress: 78,
    tiles: [
      { label: "Deal health", value: "At risk", status: "at-risk", healthReasons: [
        "Trying for two hours",
        "Frustrated; asked to leave it",
        "Will buy from another company",
      ] },
      { label: "Decision maker", value: "Husband" },
      { label: "Last interaction", value: "Just now" },
    ],
    showBrief: true,
    lastCallLabel: SAMPADA_FIFTH_LAST_CALL_LABEL,
    lastCallBullets: SAMPADA_FIFTH_LAST_CALL_BULLETS,
    nbaLabel: `${SAMPADA_FIFTH_NBA_LABEL}:`,
    nbaBullets: SAMPADA_FIFTH_NBA_BULLETS,
    topics: ["Quote creation", "Decision Maker", "Objections", "Competitor mentions"],
    topicBullets: SAMPADA_FIFTH_TOPIC_BULLETS,
  },
};

const LeadSummary = ({ variant = "default" }: { variant?: LeadSummaryVariant }) => {
  const content = VARIANT_CONTENT[variant];
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const handleTopicClick = (label: Topic) => {
    setSelectedTopic((current) => (current === label ? null : label));
  };

  return (
    <Card className="min-w-0 overflow-hidden rounded-lg border-[#e7e7f0] bg-white shadow-none">
      <CardContent className="flex min-w-0 flex-col gap-3 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div className="mt-0.5 rounded-lg bg-[#efe9fb] p-1.5">
            <Target className="size-4 text-[#7c47e1]" strokeWidth={2} />
          </div>
          <p className="text-sm font-medium leading-5 text-[#5b5675]">LEAD SUMMARY:</p>
        </div>

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
            const statusDotClass =
              tile.status === "healthy"
                ? "bg-[#0fa457]"
                : tile.status === "at-risk"
                  ? "bg-[#e22a2a]"
                  : null;
            const valueEl = statusDotClass ? (
              <span className={`flex items-center gap-1.5 ${valueClass}`}>
                <span className={`size-1.5 shrink-0 rounded-full ${statusDotClass}`} />
                {tile.value}
              </span>
            ) : (
              <span className={valueClass}>{tile.value}</span>
            );

            return (
              <div
                key={tile.label}
                className="flex min-h-[82px] min-w-0 flex-1 flex-col gap-1 rounded-[9px] border border-[#e7e7f0] p-3"
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
                          className="inline-flex size-5 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 text-[#5b5675] hover:text-[#36354c]"
                        >
                          <CircleHelp className="size-3.5" strokeWidth={1.75} />
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
                                  tile.status === "healthy" ? "bg-[#0fa457]" : "bg-[#e22a2a]",
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

        {content.showBrief && (
          <>
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
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

                  return (
                    <button
                      key={label}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => handleTopicClick(label)}
                      className={cn(
                        "inline-flex h-9 shrink-0 items-center rounded-md px-2 py-1.5 text-sm font-medium leading-5 transition-colors",
                        isSelected
                          ? "bg-[#7c47e1] text-white"
                          : "bg-[#efe9fb] text-[#7c47e1] hover:bg-[#e7d9fb]",
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {selectedTopic && content.topicBullets[selectedTopic] && (
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm font-normal leading-5 text-[#5b5675]">
                  {content.topicBullets[selectedTopic].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadSummary;

function SparklePanel({
  label,
  bullets,
}: {
  label: string;
  bullets: readonly string[];
}) {
  return (
    <div className="flex h-full min-w-0 flex-col gap-1.5 rounded-2xl bg-[#f8f7fc] p-3">
      <div className="flex items-center gap-2">
        <span className="relative size-[18px] shrink-0 overflow-clip">
          <img
            src={aiSparkle}
            alt=""
            className="absolute left-1/2 top-0 h-[18px] w-[10.5px] -translate-x-1/2"
          />
        </span>
        <p className="text-xs font-medium leading-[18px] text-[#36354c]">{label}</p>
      </div>
      <div className="space-y-2">
        {bullets.map((bullet) => (
          <div key={bullet} className="flex gap-2">
            <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#36354c]" />
            <span className="text-sm text-[#36354c]">{bullet}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
