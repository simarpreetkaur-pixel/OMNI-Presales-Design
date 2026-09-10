import { useState } from "react";
import { Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import aiSparkle from "@/assets/lead-summary-ai-sparkle.svg";
import stageTick from "@/assets/lead-summary-stage-tick.svg";

type Stage =
  | "Contacted"
  | "Qualified"
  | "Quote shared"
  | "Objections"
  | "Competitors"
  | "Closed Lost/Won";

const DETAILS = [
  { label: "Last interaction", value: "2 days ago" },
  { label: "Buying chances", value: "High" },
  { label: "Decision maker", value: "Rajesh and his wife" },
] as const;

const OPEN_OBJECTIONS = [
  {
    title: "Pricing concern",
    detail:
      "Rajesh said the Zero Dep premium feels high for a new Honda Amaze. He wants to compare it with other insurers and check the number with his wife before paying.",
  },
  {
    title: "No maternity included",
    detail:
      "He asked why maternity is not included. His wife is planning for a child, and he said they will not buy if maternity cover is missing from the plan.",
  },
] as const;

const COMPETITOR_MENTIONS = [
  {
    title: "HDFC Ergo",
    detail:
      "He likes that their family plan includes maternity, and he said their quote for the Amaze felt lower than ACKO’s Zero Dep premium.",
  },
  {
    title: "Digit",
    detail:
      "He likes their 6-hour claim settlement. He said that speed is the main reason he is holding ACKO against Digit before he decides with his wife.",
  },
] as const;

const STAGES: { label: Stage; completed: boolean; count?: number }[] = [
  { label: "Contacted", completed: true },
  { label: "Qualified", completed: true },
  { label: "Quote shared", completed: true },
  { label: "Objections", completed: true, count: 2 },
  { label: "Competitors", completed: true },
  { label: "Closed Lost/Won", completed: false },
];

const OVERALL_SUMMARY =
  "The lead is engaged and progressing through the sales journey. Customer needs, purchase intent, and key objections have been identified. The next interaction should focus on addressing unresolved concerns and driving a purchase decision.";

const STAGE_SUMMARIES: Record<
  Exclude<Stage, "Closed Lost/Won" | "Objections" | "Competitors">,
  string
> = {
  Contacted:
    "An outbound call was placed and Rajesh answered. He stayed on the line and confirmed he is an existing ACKO customer shopping cover for his new Honda Amaze.",
  Qualified:
    "ACKO can match the comprehensive cover he wants, including roadside assistance and zero depreciation. Budget is flexible if the add-ons clearly protect a new car.",
  "Quote shared":
    "A Zero Depreciation quote was generated for the Honda Amaze 2025 comprehensive plan. Payment was started but not completed.",
};

const StageDetailList = ({
  items,
}: {
  items: readonly { title: string; detail: string }[];
}) => (
  <ul className="space-y-2.5">
    {items.map(({ title, detail }) => (
      <li key={title} className="min-w-0">
        <p className="text-sm font-medium leading-5 text-[#36354c]">{title}</p>
        <p className="mt-0.5 text-sm font-normal leading-5 text-[#5b5675]">{detail}</p>
      </li>
    ))}
  </ul>
);

const SummaryPanel = ({ title, body }: { title: string; body: string }) => (
  <div className="flex w-full flex-col gap-1.5 rounded-2xl bg-[#f8f7fc] p-3">
    <div className="flex items-center gap-2">
      <span className="relative size-[18px] shrink-0 overflow-clip">
        <img
          src={aiSparkle}
          alt=""
          className="absolute left-1/2 top-0 h-[18px] w-[10.5px] -translate-x-1/2"
        />
      </span>
      <p className="text-xs font-medium leading-[18px] text-[#36354c]">{title}</p>
    </div>
    <p className="text-sm font-normal leading-5 text-[#5b5675]">{body}</p>
  </div>
);

const LeadSummary = () => {
  const [selectedStage, setSelectedStage] = useState<Stage>("Contacted");

  return (
    <Card className="min-w-0 overflow-hidden rounded-lg border-[#e7e7f0] bg-white shadow-none">
      <CardContent className="flex min-w-0 flex-col gap-3 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div className="mt-0.5 rounded-lg bg-[#efe9fb] p-1.5">
            <Target className="size-4 text-[#7c47e1]" strokeWidth={2} />
          </div>
          <p className="text-sm font-medium leading-5 text-[#5b5675]">LEAD SUMMARY:</p>
        </div>

        <div className="grid w-full grid-cols-3 gap-4">
          {DETAILS.map(({ label, value }) => (
            <div
              key={label}
              className="flex min-w-0 flex-col gap-1 rounded-[9px] border border-[#e7e7f0] p-3"
            >
              <p className="text-sm font-normal leading-5 text-[#5b5675]">{label}</p>
              <p className="text-sm font-medium leading-5 text-[#36354c]">{value}</p>
            </div>
          ))}
        </div>

        <SummaryPanel title="AI generated summary" body={OVERALL_SUMMARY} />

        <Tabs
          value={selectedStage}
          onValueChange={(value) => {
            if (value === "Closed Lost/Won") return;
            setSelectedStage(value as Stage);
          }}
          className="min-w-0"
        >
          <TabsList
            aria-label="Lead stages"
            className="flex h-auto w-full min-w-0 items-end justify-between gap-1 overflow-x-auto rounded-none border-b border-black/5 bg-transparent p-0"
          >
            {STAGES.map(({ label, completed, count }) => (
              <TabsTrigger
                key={label}
                value={label}
                disabled={!completed}
                className={cn(
                  "relative min-w-0 flex-1 gap-0.5 rounded-none bg-transparent px-0.5 pb-2.5 pt-3 text-center text-sm font-medium leading-4 shadow-none",
                  "text-[#474649] hover:text-[#0f0f10]",
                  "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-t-full after:bg-transparent",
                  "data-[state=active]:bg-transparent data-[state=active]:text-[#0f0f10] data-[state=active]:shadow-none",
                  "data-[state=active]:after:bg-[#6841e6]",
                  "disabled:pointer-events-none disabled:opacity-50",
                )}
              >
                {completed && (
                  <span className="relative size-4 shrink-0 overflow-clip">
                    <img src={stageTick} alt="" className="size-full" />
                  </span>
                )}
                <span className="text-balance">{label}</span>
                {count != null && (
                  <span className="shrink-0 rounded-full bg-[#eae0fe] px-1.5 py-0.5 text-xs font-semibold leading-4 text-[#6841e6]">
                    {count}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {STAGES.filter((stage) => stage.completed).map(({ label }) => (
            <TabsContent key={label} value={label} className="mt-3 min-w-0 space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="relative size-[18px] shrink-0 overflow-clip">
                  <img
                    src={aiSparkle}
                    alt=""
                    className="absolute left-1/2 top-0 h-[18px] w-[10.5px] -translate-x-1/2"
                  />
                </span>
                <p className="text-xs font-medium leading-[18px] text-[#36354c]">
                  {label} summary:
                </p>
              </div>
              {label === "Objections" ? (
                <StageDetailList items={OPEN_OBJECTIONS} />
              ) : label === "Competitors" ? (
                <StageDetailList items={COMPETITOR_MENTIONS} />
              ) : (
                <p className="text-sm font-normal leading-5 text-[#5b5675]">
                  {STAGE_SUMMARIES[label]}
                </p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LeadSummary;
