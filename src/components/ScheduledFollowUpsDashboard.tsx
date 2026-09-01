import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  Car,
  CheckCircle2,
  CircleEllipsis,
  Clock3,
  Coffee,
  CupSoda,
  Play,
  Shield,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  MOCK_FOLLOW_UPS,
  parseTimeToMinutes,
  type FollowUpProductCategory,
  type ScheduledFollowUp,
} from "@/data/scheduledFollowUps";

type BreakKind = "Tea break" | "Lunch break" | "Bio break";

const BREAKS: Record<BreakKind, { allotted: number; taken: number; icon: LucideIcon }> = {
  "Tea break": { allotted: 30, taken: 10, icon: Coffee },
  "Lunch break": { allotted: 45, taken: 0, icon: CupSoda },
  "Bio break": { allotted: 20, taken: 5, icon: Clock3 },
};

const PRODUCT_ICON: Record<FollowUpProductCategory, LucideIcon> = {
  car: Car,
  life: Shield,
  health: Stethoscope,
};

const NEXT_STEPS: Record<string, string[]> = {
  t1: [
    "Confirm the renewal date and current insurer.",
    "Position zero-depreciation and engine protect together.",
    "Offer roadside assistance before sharing the premium.",
  ],
  t2: [
    "Confirm the vehicle’s current IDV and claim history.",
    "Recommend bumper-to-bumper with zero depreciation.",
    "Close with roadside assistance after confirming the premium.",
  ],
  t3: [
    "Understand the family’s protection and savings priorities.",
    "Confirm the desired cover amount and policy term.",
    "Share a suitable protection plan with key benefits.",
  ],
};

function CallCard({
  call,
  isSelected,
  onSelect,
}: {
  call: ScheduledFollowUp;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const Icon = PRODUCT_ICON[call.productCategory];
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-xl border bg-white p-3.5 text-left transition-colors hover:border-[#b191ed]",
        isSelected ? "border-[#7c47e1] ring-2 ring-[#7c47e1]/15" : "border-[#e7e7f0]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-5 text-[#36354c]">{call.displayTime}</p>
          <p className="mt-1 text-sm font-normal leading-5 text-[#5b5675]">{call.customerName}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 text-xs text-[#5b5675]">
          <Icon className="size-3.5" strokeWidth={1.75} />
          {call.product}
        </span>
      </div>
      {isSelected && (
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#6736c6]">
          <CheckCircle2 className="size-3.5" /> Selected
        </span>
      )}
    </button>
  );
}

const ScheduledFollowUpsDashboard = () => {
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);
  const tomorrow = useMemo(() => {
    const date = new Date(today);
    date.setDate(today.getDate() + 1);
    return date;
  }, [today]);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedCallId, setSelectedCallId] = useState("t2");
  const [activeBreak, setActiveBreak] = useState<BreakKind | null>(null);
  const [breakStartedAt, setBreakStartedAt] = useState<Date | null>(null);
  const [takenBreaks, setTakenBreaks] = useState<Record<BreakKind, number>>({
    "Tea break": 10,
    "Lunch break": 0,
    "Bio break": 5,
  });
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!activeBreak) return;
    const timer = window.setInterval(() => setTick((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [activeBreak]);

  const selectedDayOffset = selectedDate.toDateString() === tomorrow.toDateString() ? 1 : 0;
  const selectedCalls = useMemo(
    () =>
      MOCK_FOLLOW_UPS.filter((call) => call.dayOffset === selectedDayOffset).sort(
        (a, b) => parseTimeToMinutes(a.time24) - parseTimeToMinutes(b.time24)
      ),
    [selectedDayOffset]
  );
  const selectedCall =
    selectedCalls.find((call) => call.id === selectedCallId) ?? selectedCalls[0] ?? MOCK_FOLLOW_UPS[0];
  const activeBreakSeconds = breakStartedAt ? Math.floor((Date.now() - breakStartedAt.getTime()) / 1000) : 0;
  const formatElapsed = (seconds: number) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const startBreak = (breakKind: BreakKind) => {
    setActiveBreak(breakKind);
    setBreakStartedAt(new Date());
  };
  const endBreak = () => {
    if (!activeBreak || !breakStartedAt) return;
    const minutes = Math.max(1, Math.ceil((Date.now() - breakStartedAt.getTime()) / 60000));
    setTakenBreaks((current) => ({
      ...current,
      [activeBreak]: Math.min(BREAKS[activeBreak].allotted, current[activeBreak] + minutes),
    }));
    setActiveBreak(null);
    setBreakStartedAt(null);
  };
  const selectDate = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    const offset = date.toDateString() === tomorrow.toDateString() ? 1 : 0;
    const firstCall = MOCK_FOLLOW_UPS.find((call) => call.dayOffset === offset);
    if (firstCall) setSelectedCallId(firstCall.id);
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-[#fafaff] px-8 pb-6 pt-7">
      <header className="flex shrink-0 items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#5b5675]">
            {today.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className="mt-1 text-[24px] font-semibold leading-8 tracking-[-0.2px] text-[#040222]">
            Your workday
          </h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 gap-2 rounded-xl border-[#e7e7f0] bg-white px-3.5 text-sm font-medium text-[#36354c] hover:bg-[#f8f7fc]">
              <CircleEllipsis className="size-4" />
              Breaks
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[292px] rounded-xl border-[#e7e7f0] p-2">
            <DropdownMenuLabel className="px-2 py-2 text-sm text-[#36354c]">Productive breaks</DropdownMenuLabel>
            {activeBreak ? (
              <>
                <div className="mx-2 mb-2 rounded-lg bg-[#f4edff] p-3">
                  <p className="text-sm font-semibold text-[#4d237d]">{activeBreak} in progress</p>
                  <p className="mt-1 text-xs text-[#765f91]">{formatElapsed(activeBreakSeconds)} elapsed · End when you are back</p>
                </div>
                <DropdownMenuItem onSelect={endBreak} className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-[#6736c6]">
                  End break
                </DropdownMenuItem>
              </>
            ) : (
              (Object.entries(BREAKS) as [BreakKind, (typeof BREAKS)[BreakKind]][]).map(([name, config]) => {
                const Icon = config.icon;
                const remaining = config.allotted - takenBreaks[name];
                return (
                  <DropdownMenuItem key={name} onSelect={() => startBreak(name)} disabled={remaining <= 0} className="cursor-pointer rounded-lg px-3 py-2.5">
                    <Icon className="mr-2 size-4 text-[#7c47e1]" />
                    <span className="flex-1 text-sm font-medium text-[#36354c]">{name}</span>
                    <span className="text-xs text-[#7b7790]">{remaining} min left</span>
                  </DropdownMenuItem>
                );
              })
            )}
            <DropdownMenuSeparator className="bg-[#e7e7f0]" />
            <div className="space-y-2 px-2 py-2">
              {(Object.entries(BREAKS) as [BreakKind, (typeof BREAKS)[BreakKind]][]).map(([name, config]) => (
                <div key={name}>
                  <div className="mb-1 flex justify-between text-xs text-[#5b5675]">
                    <span>{name.replace(" break", "")}</span>
                    <span>{takenBreaks[name]} / {config.allotted} min</span>
                  </div>
                  <Progress value={(takenBreaks[name] / config.allotted) * 100} className="h-1.5 bg-[#eeeef4] [&>div]:bg-[#7c47e1]" />
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {activeBreak && (
        <div className="mt-5 flex shrink-0 items-center justify-between rounded-xl border border-[#dac8fa] bg-[#f7f2ff] px-4 py-3">
          <div className="flex items-center gap-2">
            <Coffee className="size-4 text-[#6736c6]" />
            <p className="text-sm font-medium text-[#4d237d]">{activeBreak} in progress · {formatElapsed(activeBreakSeconds)}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={endBreak} className="h-8 text-[#6736c6] hover:bg-[#eadcff] hover:text-[#4d237d]">End break</Button>
        </div>
      )}

      <div className="mt-6 grid min-h-0 flex-1 grid-cols-1 gap-5 xl:grid-cols-[330px_minmax(0,1fr)_360px]">
        <Card className="min-h-0 overflow-hidden rounded-2xl border-[#e7e7f0] bg-white p-0 shadow-none">
          <div className="border-b border-[#eeeef3] px-5 py-4">
            <div className="flex items-center gap-2">
              <CalendarClock className="size-4 text-[#7c47e1]" />
              <h2 className="text-base font-semibold text-[#36354c]">Schedule</h2>
            </div>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={selectDate}
            disabled={(date) => date.toDateString() !== today.toDateString() && date.toDateString() !== tomorrow.toDateString()}
            className="w-full p-4"
          />
          <div className="border-t border-[#eeeef3] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7b7790]">Break balance today</p>
            <div className="mt-3 space-y-3">
              {(Object.entries(BREAKS) as [BreakKind, (typeof BREAKS)[BreakKind]][]).map(([name, config]) => (
                <div key={name}>
                  <div className="mb-1 flex justify-between text-xs text-[#5b5675]">
                    <span>{name}</span>
                    <span>{takenBreaks[name]} of {config.allotted} min used</span>
                  </div>
                  <Progress value={(takenBreaks[name] / config.allotted) * 100} className="h-1.5 bg-[#eeeef4] [&>div]:bg-[#7c47e1]" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="min-h-0 overflow-hidden rounded-2xl border-[#e7e7f0] bg-white p-0 shadow-none">
          <div className="flex items-center justify-between border-b border-[#eeeef3] px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-[#36354c]">
                {selectedDayOffset === 0 ? "Today’s" : "Tomorrow’s"} follow-ups
              </h2>
              <p className="mt-0.5 text-sm text-[#7b7790]">Select a time to view call preparation</p>
            </div>
            <span className="rounded-lg bg-[#f2eefc] px-2.5 py-1 text-xs font-medium text-[#6736c6]">
              {selectedCalls.length} calls
            </span>
          </div>
          <div className="min-h-0 space-y-3 overflow-y-auto p-5">
            {selectedCalls.map((call) => (
              <CallCard
                key={call.id}
                call={call}
                isSelected={call.id === selectedCall.id}
                onSelect={() => setSelectedCallId(call.id)}
              />
            ))}
          </div>
        </Card>

        <aside className="min-h-0 overflow-y-auto rounded-2xl border border-[#e7e7f0] bg-white p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-[#7c47e1]" />
            <h2 className="text-base font-semibold text-[#36354c]">Call preparation</h2>
          </div>
          <div className="mt-5 rounded-xl bg-[#f7f4fd] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6736c6]">Selected time</p>
            <p className="mt-2 text-lg font-semibold text-[#2f2d43]">{selectedCall.displayTime}</p>
            <p className="mt-1 text-sm text-[#5b5675]">{selectedCall.customerName} · {selectedCall.product}</p>
          </div>
          <section className="mt-5">
            <h3 className="text-sm font-semibold text-[#36354c]">AI summary</h3>
            <p className="mt-2 text-sm leading-5 text-[#5b5675]">
              {selectedCall.quickSummary ?? "Review the customer’s previous interactions and confirm their current needs before connecting."}
            </p>
          </section>
          <section className="mt-6 border-t border-[#eeeef3] pt-5">
            <h3 className="text-sm font-semibold text-[#36354c]">Next steps</h3>
            <ol className="mt-3 space-y-3">
              {(NEXT_STEPS[selectedCall.id] ?? [
                "Review the most recent customer interaction.",
                "Confirm the customer’s current requirement.",
                "Agree on a clear next action before ending the call.",
              ]).map((step, index) => (
                <li key={step} className="flex gap-3 text-sm leading-5 text-[#5b5675]">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#eee5fd] text-xs font-semibold text-[#6736c6]">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </section>
          <Button className="mt-6 h-10 w-full gap-2 rounded-xl bg-[#7c47e1] text-sm font-medium hover:bg-[#6736c6]">
            <Play className="size-4 fill-current" /> Start call
          </Button>
        </aside>
      </div>
    </div>
  );
};

export default ScheduledFollowUpsDashboard;
/*
import { useMemo, useState } from "react";
import { Car, Shield, Sparkles, Stethoscope, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  MOCK_FOLLOW_UPS,
  getActiveSlot,
  getCallStatus,
  getSlotLabel,
  parseTimeToMinutes,
  type FollowUpProductCategory,
  type FollowUpSlot,
  type ScheduledFollowUp,
} from "@/data/scheduledFollowUps";
import slotMorningIcon from "@/assets/slot-morning.svg";
import slotAfternoonIcon from "@/assets/slot-afternoon.svg";
import slotEveningIcon from "@/assets/slot-evening.svg";

type TabKey = "today" | "tomorrow";

const SLOT_ORDER: FollowUpSlot[] = ["morning", "afternoon", "evening"];

const SLOT_ICONS: Record<FollowUpSlot, string> = {
  morning: slotMorningIcon,
  afternoon: slotAfternoonIcon,
  evening: slotEveningIcon,
};

const PRODUCT_ICON: Record<FollowUpProductCategory, LucideIcon> = {
  car: Car,
  life: Shield,
  health: Stethoscope,
};

function ProductChip({ call }: { call: ScheduledFollowUp }) {
  const Icon = PRODUCT_ICON[call.productCategory];
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-normal leading-[18px] text-[#5b5675]">
      <Icon className="size-3.5 shrink-0 text-[#5b5675]" strokeWidth={1.75} />
      {call.product}
    </span>
  );
}

function CallCard({
  call,
  showQuickSummary,
}: {
  call: ScheduledFollowUp;
  showQuickSummary: boolean;
}) {
  return (
    <Card className="gap-0 rounded-xl border border-[#e7e7f0] bg-white p-4 shadow-none">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-5 text-[#36354c]">{call.customerName}</p>
          <p className="mt-1 text-sm font-medium leading-5 text-[#36354c]">{call.displayTime}</p>
        </div>
        <ProductChip call={call} />
      </div>

      {showQuickSummary && call.quickSummary && (
        <div className="mt-3 rounded-lg bg-[#f5f4fa] px-3 py-2.5">
          <div className="flex items-start gap-1.5">
            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-[#7c47e1]" strokeWidth={2} />
            <p className="text-xs font-semibold leading-[18px] text-[#36354c]">Quick Summary:</p>
          </div>
          <p className="mt-1.5 text-sm font-normal leading-[18px] text-[#5b5675]">
            {call.quickSummary}
          </p>
        </div>
      )}
    </Card>
  );
}

function EmptySlotCard() {
  return (
    <Card className="rounded-xl border border-dashed border-[#e7e7f0] bg-white/70 p-4 shadow-none">
      <p className="text-sm font-medium leading-5 text-[#9b97ad]">No calls scheduled</p>
    </Card>
  );
}

const ScheduledFollowUpsDashboard = () => {
  const [tab, setTab] = useState<TabKey>("today");
  /** Demo clock: noon today — Morning done, Afternoon active, next call gets Quick Summary * /
  const [now] = useState(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  });

  const activeSlot = useMemo(() => getActiveSlot(now), [now]);
  const activeSlotIndex = SLOT_ORDER.indexOf(activeSlot);

  const filtered = useMemo(() => {
    const dayOffset = tab === "today" ? 0 : 1;
    return [...MOCK_FOLLOW_UPS]
      .filter((c) => c.dayOffset === dayOffset)
      .sort((a, b) => parseTimeToMinutes(a.time24) - parseTimeToMinutes(b.time24));
  }, [tab]);

  /** Today: only remaining (upcoming) calls; Tomorrow: full day plan * /
  const visibleCalls = useMemo(() => {
    if (tab !== "today") return filtered;
    return filtered.filter((c) => getCallStatus(c, now) === "upcoming");
  }, [tab, filtered, now]);

  /** Next upcoming call today only — Quick Summary is never shown on Tomorrow * /
  const nextCallId = tab === "today" ? (visibleCalls[0]?.id ?? null) : null;

  /**
   * Today: drop finished slots (e.g. 12:15 → hide Morning).
   * Also drop a remaining slot if it has no upcoming calls left.
   * Tomorrow: keep all three columns.
   * /
  const slotGroups = useMemo(() => {
    const groups = SLOT_ORDER.map((slot) => ({
      slot,
      label: getSlotLabel(slot),
      items: visibleCalls.filter((c) => c.slot === slot),
    }));

    if (tab !== "today") return groups;

    return groups.filter((g) => {
      const slotIndex = SLOT_ORDER.indexOf(g.slot);
      if (slotIndex < activeSlotIndex) return false; // past slot — hide
      return true;
    });
  }, [tab, visibleCalls, activeSlotIndex]);

  const columnCount = Math.max(slotGroups.length, 1);

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-6 px-10 pb-6 pt-8">
      <div className="flex shrink-0 flex-col gap-2">
        <h1 className="text-[20px] font-semibold leading-7 tracking-[-0.1px] text-[#040222]">
          Hello Priya, welcome to{" "}
          <span className="text-[#7c47e1]">OMNI Sales</span>
        </h1>
        <p className="text-sm font-normal leading-5 text-[#5b5675]">
          An AI-powered, context-driven CRM that equips agents with real-time insights and guided
          actions to drive smarter, faster conversions.
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-5 rounded-2xl border border-[#e7e7f0] bg-white p-5">
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold leading-6 text-[#040222]">Scheduled follow-ups</h2>
          <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
            <TabsList className="h-auto gap-2 bg-transparent p-0">
              {(
                [
                  ["today", "Today"],
                  ["tomorrow", "Tomorrow"],
                ] as const
              ).map(([key, label]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className={cn(
                    "h-9 w-[112px] rounded-xl border border-[#e7e7f0] bg-white px-5 py-2 text-sm font-medium leading-5 text-[#36354c] shadow-none",
                    "data-[state=active]:border-[#b191ed] data-[state=active]:bg-[#efe9fb] data-[state=active]:text-[#36354c] data-[state=active]:shadow-none",
                    "data-[state=inactive]:hover:bg-[#f8f7fc]"
                  )}
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {tab === "today" && visibleCalls.length === 0 ? (
          <div className="flex min-h-0 flex-1 items-center justify-center rounded-2xl bg-[#f5f5f8] p-8">
            <p className="text-sm font-medium text-[#5b5675]">
              All follow-ups for today are done.
            </p>
          </div>
        ) : (
          <div
            className={cn(
              "grid min-h-0 flex-1 grid-cols-1 gap-4",
              columnCount === 1 && "lg:grid-cols-1",
              columnCount === 2 && "lg:grid-cols-2",
              columnCount >= 3 && "lg:grid-cols-3"
            )}
          >
            {slotGroups.map(({ slot, label, items }) => (
              <section
                key={slot}
                className={cn(
                  "flex min-h-0 flex-col gap-3 rounded-2xl bg-[#f5f5f8] p-3",
                  tab === "today" && slot === activeSlot && "ring-1 ring-[#b191ed]/60"
                )}
              >
                <div className="flex shrink-0 items-center gap-2 px-1">
                  <span className="relative size-6 shrink-0 overflow-hidden">
                    <img
                      src={SLOT_ICONS[slot]}
                      alt=""
                      className="size-full max-w-none"
                      width={24}
                      height={24}
                    />
                  </span>
                  <h3 className="text-sm font-medium leading-5 text-[#36354c]">{label}</h3>
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-0.5">
                  {items.length === 0 ? (
                    <EmptySlotCard />
                  ) : (
                    items.map((call) => (
                      <CallCard
                        key={call.id}
                        call={call}
                        showQuickSummary={tab === "today" && call.id === nextCallId}
                      />
                    ))
                  )}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduledFollowUpsDashboard;
*/
