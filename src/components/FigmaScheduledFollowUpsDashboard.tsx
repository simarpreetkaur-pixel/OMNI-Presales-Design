import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type ScheduleDay = "today" | "tomorrow";

type ScheduledCall = {
  id: string;
  /** Minutes from midnight, aligned to 15-minute slots */
  minutes: number;
  customerName: string;
  campaign: string;
  summary: string;
};

const HOUR_START = 8;
const HOUR_END = 20;
const SLOTS_PER_HOUR = 4;
const SLOT_MINUTES = 15;
const BASE_HOUR_HEIGHT = 52;
const SLOT_HEIGHT = 32;
const SLOT_GAP = 4;
const TIME_COL_WIDTH = 56;
const TIME_EVENT_GAP = 14;
const HOURS = Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => HOUR_START + i);

const SCHEDULE: Record<ScheduleDay, ScheduledCall[]> = {
  today: [
    {
      id: "vikram-830",
      minutes: 8 * 60 + 30,
      customerName: "Vikram Singh",
      campaign: "car_campaign_name",
      summary:
        "Vikram compared renewal quotes. Zero-dep was explained and he asked for a follow-up after checking with his spouse.",
    },
    {
      id: "ananya-945",
      minutes: 9 * 60 + 45,
      customerName: "Ananya Iyer",
      campaign: "health_campaign_name",
      summary:
        "Ananya wanted family-floater options. Network hospitals in her city were confirmed and a quote was shared.",
    },
    {
      id: "deepak-1045",
      minutes: 10 * 60 + 45,
      customerName: "Deepak Verma",
      campaign: "car_campaign_name",
      summary:
        "Deepak needed clarity on IDV and NCB. The quote was revised and he requested a callback in the afternoon.",
    },
    {
      id: "sneha-1130",
      minutes: 11 * 60 + 30,
      customerName: "Sneha Reddy",
      campaign: "life_campaign_name",
      summary:
        "Sneha explored term cover for 20 years. Premium illustration was shared; she will discuss with family tonight.",
    },
    {
      id: "rohit-1215",
      minutes: 12 * 60 + 15,
      customerName: "Rohit Malhotra",
      campaign: "health_campaign_name",
      summary:
        "Rohit asked about room-rent limits and pre-existing conditions. A suitable plan was recommended before lunch.",
    },
    {
      id: "jaya-200",
      minutes: 14 * 60,
      customerName: "Jaya Kumari",
      campaign: "car_campaign_name",
      summary:
        "Jaya is comparing comprehensive cover options and wants clarity on the value of zero-depreciation before she makes a decision.",
    },
    {
      id: "neha-315",
      minutes: 15 * 60 + 15,
      customerName: "Neha Kapoor",
      campaign: "car_campaign_name",
      summary:
        "Neha dropped off at add-ons. Confirm IDV and close with zero-dep plus roadside assistance.",
    },
    {
      id: "priya-330",
      minutes: 15 * 60 + 30,
      customerName: "Priya Sharma",
      campaign: "car_campaign_name",
      summary:
        "Priya was guided from initial need assessment to final purchase by understanding her priorities.",
    },
    {
      id: "amit-430",
      minutes: 16 * 60 + 30,
      customerName: "Amit Kumar",
      campaign: "car_campaign_name",
      summary:
        "Amit is looking for a quick, clear comparison. Focus on the key plan differences and agree on the next action during the call.",
    },
    {
      id: "rahul-615",
      minutes: 18 * 60 + 15,
      customerName: "Rahul Verma",
      campaign: "life_campaign_name",
      summary:
        "Rahul is evaluating renewal options. Reconfirm his current insurer, no-claim bonus, and preferred add-ons before sharing the final quote.",
    },
  ],
  tomorrow: [
    {
      id: "meera-1030",
      minutes: 10 * 60 + 30,
      customerName: "Meera Joshi",
      campaign: "car_campaign_name",
      summary:
        "Meera is reviewing her car renewal. Confirm her current cover and preference for zero-depreciation before presenting options.",
    },
    {
      id: "arjun-1200",
      minutes: 12 * 60,
      customerName: "Arjun Nair",
      campaign: "life_campaign_name",
      summary:
        "Arjun is exploring life cover for his family. Start with his protection needs and desired policy duration.",
    },
    {
      id: "kavita-1330",
      minutes: 13 * 60 + 30,
      customerName: "Kavita Deshmukh",
      campaign: "health_campaign_name",
      summary:
        "Kavita needs health cover information. Confirm the family members to be covered and the preferred hospital network.",
    },
  ],
};

function formatHourLabel(hour: number) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(display).padStart(2, "0")}:00 ${suffix}`;
}

function formatSlotTime(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const suffix = hour >= 12 ? "pm" : "am";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${String(mins).padStart(2, "0")}${suffix}`;
}

function formatSelectedTime(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${String(mins).padStart(2, "0")} ${suffix}`;
}

function getCurrentLocalMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function getNextUpcomingCall(calls: ScheduledCall[], currentMinutes: number) {
  return calls.find((call) => call.minutes >= currentMinutes);
}

function getHourHeight(callCount: number) {
  if (callCount === 0) return BASE_HOUR_HEIGHT;
  return SLOTS_PER_HOUR * SLOT_HEIGHT + (SLOTS_PER_HOUR + 1) * SLOT_GAP;
}

function getStatusLine(day: ScheduleDay, remainingCount: number, totalCount: number) {
  if (day === "tomorrow") {
    if (totalCount === 0) return "No scheduled calls for tomorrow";
    if (totalCount === 1) return "1 scheduled call for tomorrow";
    return `${totalCount} scheduled calls for tomorrow`;
  }
  if (remainingCount === 0) {
    return totalCount === 0
      ? "No scheduled calls for today"
      : "All scheduled calls for today are done";
  }
  if (remainingCount === 1) return "1 scheduled call remaining for today";
  return `${remainingCount} scheduled calls remaining for today`;
}

function slotTop(minutes: number) {
  const slotIndex = Math.floor((minutes % 60) / SLOT_MINUTES);
  return SLOT_GAP + slotIndex * (SLOT_HEIGHT + SLOT_GAP);
}

function DashboardSkeleton() {
  return (
    <div
      className="flex h-full min-h-0 w-full flex-col gap-6 px-10 pb-6 pt-6"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      <div className="flex shrink-0 flex-col gap-2">
        <Skeleton className="h-7 w-[340px] rounded-md bg-[#eceaf4]" />
        <Skeleton className="h-5 w-full max-w-[560px] rounded-md bg-[#eceaf4]" />
      </div>
      <Card className="flex min-h-0 w-full max-w-[833px] flex-1 flex-col overflow-hidden rounded-2xl border-[#e7e7f0] bg-white p-4 shadow-none">
        <div className="flex shrink-0 items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-[220px] rounded-md bg-[#eceaf4]" />
            <Skeleton className="h-5 w-[260px] rounded-md bg-[#eceaf4]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-[112px] rounded-xl bg-[#eceaf4]" />
            <Skeleton className="h-9 w-[112px] rounded-xl bg-[#eceaf4]" />
          </div>
        </div>
        <div className="mt-6 grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_301px] gap-4">
          <section className="min-h-0 overflow-hidden rounded-xl border border-[#e7e7f0] bg-white p-4">
            <div className="space-y-3">
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-14 shrink-0 rounded-md bg-[#eceaf4]" />
                  <Skeleton className={cn("h-8 flex-1 rounded-md bg-[#eceaf4]", index % 3 === 0 && "max-w-[72%]")} />
                </div>
              ))}
            </div>
          </section>
          <aside className="min-h-0 rounded-xl border border-[#e7e7f0] bg-[#fafafa] p-4">
            <Skeleton className="h-5 w-[200px] rounded-md bg-[#eceaf4]" />
            <div className="mt-3 space-y-3 rounded-xl border border-[#e7e7f0] bg-white p-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-28 rounded-md bg-[#eceaf4]" />
                <Skeleton className="h-4 w-24 rounded-md bg-[#eceaf4]" />
              </div>
              <Skeleton className="h-5 w-36 rounded-md bg-[#eceaf4]" />
              <div className="space-y-2 rounded-lg bg-[#f8f7fc] p-4">
                <Skeleton className="h-5 w-32 rounded-md bg-[#eceaf4]" />
                <Skeleton className="h-4 w-full rounded-md bg-[#eceaf4]" />
                <Skeleton className="h-4 w-4/5 rounded-md bg-[#eceaf4]" />
              </div>
            </div>
          </aside>
        </div>
      </Card>
    </div>
  );
}

const FigmaScheduledFollowUpsDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(() => new Date());
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [day, setDay] = useState<ScheduleDay>("today");
  const [selectedCallId, setSelectedCallId] = useState(
    () => getNextUpcomingCall(SCHEDULE.today, getCurrentLocalMinutes())?.id ?? null
  );
  const timelineRef = useRef<HTMLElement>(null);
  const calls = SCHEDULE[day];
  const selectedCall = useMemo(
    () => calls.find((call) => call.id === selectedCallId) ?? null,
    [calls, selectedCallId]
  );
  const callsByHour = useMemo(() => {
    const map = new Map<number, ScheduledCall[]>();
    calls.forEach((call) => {
      const hour = Math.floor(call.minutes / 60);
      map.set(hour, [...(map.get(hour) ?? []), call]);
    });
    return map;
  }, [calls]);
  const hourOffsets = useMemo(() => {
    const offsets = new Map<number, number>();
    let offset = 0;
    HOURS.forEach((hour) => {
      offsets.set(hour, offset);
      offset += getHourHeight(callsByHour.get(hour)?.length ?? 0);
    });
    return offsets;
  }, [callsByHour]);
  const remainingCount =
    day === "today" ? calls.filter((call) => call.minutes >= currentMinutes).length : calls.length;
  const statusLine = getStatusLine(day, remainingCount, calls.length);

  useEffect(() => {
    const loader = window.setTimeout(() => setIsLoading(false), 2000);
    return () => window.clearTimeout(loader);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (day !== "today") return;
    const selected = SCHEDULE.today.find((call) => call.id === selectedCallId);
    if (!selected || selected.minutes < currentMinutes) {
      setSelectedCallId(getNextUpcomingCall(SCHEDULE.today, currentMinutes)?.id ?? null);
    }
  }, [currentMinutes, day, selectedCallId]);

  const switchDay = (value: string) => {
    const nextDay = value as ScheduleDay;
    setDay(nextDay);
    setSelectedCallId(
      nextDay === "today" ? getNextUpcomingCall(SCHEDULE.today, currentMinutes)?.id ?? null : null
    );
  };

  useEffect(() => {
    if (isLoading || !timelineRef.current) return;
    const targetMinutes =
      day === "today" ? currentMinutes : (SCHEDULE.tomorrow[0]?.minutes ?? HOUR_START * 60);
    const targetHour = Math.min(Math.max(Math.floor(targetMinutes / 60), HOUR_START), HOUR_END);
    const minuteProgress = (targetMinutes % 60) / 60;
    const scrollTop = Math.max(
      0,
      (hourOffsets.get(targetHour) ?? 0) +
        minuteProgress * getHourHeight(callsByHour.get(targetHour)?.length ?? 0) -
        timelineRef.current.clientHeight * 0.28
    );
    timelineRef.current.scrollTo({ top: scrollTop, behavior: "auto" });
  }, [callsByHour, currentMinutes, day, hourOffsets, isLoading]);

  if (isLoading) return <DashboardSkeleton />;

  const todayLabel = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowLabel = tomorrow.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-6 px-10 pb-6 pt-6">
      <div className="flex shrink-0 flex-col gap-2">
        <h1 className="text-[20px] font-semibold leading-7 tracking-[-0.1px] text-[#040222]">
          Hello Priya, welcome to <span className="text-[#7c47e1]">OMNI Sales</span>
        </h1>
        <p className="text-sm font-normal leading-5 text-[#5b5675]">
          An AI-powered, context-driven CRM that equips agents with real-time insights and guided
          actions to drive smarter, faster conversions.
        </p>
      </div>

      <Card className="flex min-h-0 w-full max-w-[833px] flex-1 flex-col overflow-hidden rounded-2xl border-[#e7e7f0] bg-white p-4 shadow-none">
        <div className="flex shrink-0 items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold leading-6 text-[#040222]">
              {day === "today" ? todayLabel : tomorrowLabel}
            </h2>
            <p className="mt-2 text-sm leading-5 text-[#5b5675]">{statusLine}</p>
          </div>
          <Tabs value={day} onValueChange={switchDay}>
            <TabsList className="h-auto gap-2 bg-transparent p-0">
              <TabsTrigger
                value="today"
                className="h-9 w-[112px] rounded-xl border border-[#e7e7f0] bg-white px-5 py-2 text-sm font-medium text-[#36354c] shadow-none data-[state=active]:border-[#b191ed] data-[state=active]:bg-[#efe9fb] data-[state=active]:shadow-none"
              >
                Today
              </TabsTrigger>
              <TabsTrigger
                value="tomorrow"
                className="h-9 w-[112px] rounded-xl border border-[#e7e7f0] bg-white px-5 py-2 text-sm font-medium text-[#36354c] shadow-none data-[state=active]:border-[#b191ed] data-[state=active]:bg-[#efe9fb] data-[state=active]:shadow-none"
              >
                Tomorrow
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-6 grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_301px] gap-4">
          <section ref={timelineRef} className="relative min-h-0 overflow-y-auto rounded-xl border border-[#e7e7f0] bg-white p-4">
            <div className="relative">
              {/* Vertical grid line — left of event column */}
              <div
                className="pointer-events-none absolute top-0 bottom-0 w-px bg-[#e7e7f0]"
                style={{ left: TIME_COL_WIDTH + TIME_EVENT_GAP }}
              />

              {day === "today" &&
                currentMinutes >= HOUR_START * 60 &&
                currentMinutes <= (HOUR_END + 1) * 60 && (
                <div
                  className="pointer-events-none absolute z-20 flex items-center"
                  style={{
                    top:
                      (hourOffsets.get(Math.floor(currentMinutes / 60)) ?? 0) +
                      ((currentMinutes % 60) / 60) *
                        getHourHeight(callsByHour.get(Math.floor(currentMinutes / 60))?.length ?? 0),
                    left: TIME_COL_WIDTH + TIME_EVENT_GAP - 5,
                    right: 0,
                  }}
                >
                  <span className="size-2.5 shrink-0 rounded-full bg-[#f35b5b]" />
                  <span className="h-px flex-1 bg-[#f35b5b]" />
                </div>
              )}

              {HOURS.map((hour) => {
                const callsInHour = callsByHour.get(hour) ?? [];
                const height = getHourHeight(callsInHour.length);
                return (
                  <div
                    key={hour}
                    className="grid"
                    style={{
                      height,
                      gridTemplateColumns: `${TIME_COL_WIDTH}px ${TIME_EVENT_GAP}px minmax(0,1fr)`,
                    }}
                  >
                    <p className="pt-px text-xs font-normal leading-[18px] text-[#5b5675]">
                      {formatHourLabel(hour)}
                    </p>
                    <span />
                    <div className="relative h-full border-t border-[#e7e7f0]">
                      {callsInHour.map((call) => {
                        const isCompleted = day === "today" && call.minutes < currentMinutes;
                        const isSelectable = day === "today" && !isCompleted;
                        const isSelected = isSelectable && selectedCall?.id === call.id;
                        return (
                          <button
                            key={call.id}
                            type="button"
                            disabled={!isSelectable}
                            onClick={() => {
                              if (!isSelectable) return;
                              setSelectedCallId(call.id);
                            }}
                            className={cn(
                              "absolute left-1 right-1 flex items-center justify-between rounded-md border px-4 text-left",
                              isCompleted &&
                                "cursor-not-allowed border-[#e7e7f0] bg-[#f8f7fc] opacity-70",
                              day === "tomorrow" &&
                                "cursor-default border-[#d0bdf4] bg-white",
                              isSelected && "border-[#b191ed] bg-[#eae0fe]",
                              isSelectable &&
                                !isSelected &&
                                "border-[#d0bdf4] bg-white hover:bg-[#f8f7fc]"
                            )}
                            style={{ top: slotTop(call.minutes), height: SLOT_HEIGHT }}
                          >
                            <span
                              className={cn(
                                "min-w-0 truncate text-sm font-medium leading-5",
                                isCompleted ? "text-[#9b97ad]" : "text-[#36354c]"
                              )}
                            >
                              {formatSlotTime(call.minutes)} · {call.customerName}
                            </span>
                            <span
                              className={cn(
                                "ml-2 shrink-0 text-xs leading-[18px]",
                                isCompleted ? "text-[#b8b4c7]" : "text-[#5b5675]"
                              )}
                            >
                              {isCompleted ? "Completed" : call.campaign}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="min-h-0 overflow-y-auto rounded-xl border border-[#e7e7f0] bg-[#fafafa] p-4">
            <h3 className="text-sm font-medium leading-5 text-[#36354c]">
              {day === "today" ? "Quick summary of the selected call" : "Quick summary"}
            </h3>
            {day === "tomorrow" ? (
              <Card className="mt-3 gap-0 rounded-xl border-[#e7e7f0] bg-white px-4 py-6 shadow-none">
                <p className="text-sm leading-5 text-[#5b5675]">
                  Summaries appear on the day of the call.
                </p>
              </Card>
            ) : selectedCall ? (
            <Card className="mt-3 gap-0 rounded-xl border-[#b191ed] bg-white px-4 py-3 shadow-none">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium leading-5 text-[#36354c]">{selectedCall.customerName}</p>
                <p className="text-xs leading-[18px] text-[#5b5675]">{selectedCall.campaign}</p>
              </div>
              <p className="mt-1 text-sm font-medium leading-5 text-[#36354c]">
                {formatSelectedTime(selectedCall.minutes)}
              </p>
              <div className="mt-4 rounded-lg bg-[#f8f7fc] p-4">
                <div className="flex items-center gap-1">
                  <Sparkles className="size-5 text-[#7c47e1]" strokeWidth={1.8} />
                  <p className="text-sm font-medium leading-5 text-[#36354c]">Quick Summary:</p>
                </div>
                <p className="mt-2 text-sm font-normal leading-5 text-[#5b5675]">{selectedCall.summary}</p>
              </div>
            </Card>
            ) : (
              <Card className="mt-3 gap-0 rounded-xl border-[#e7e7f0] bg-white px-4 py-6 shadow-none">
                <p className="text-sm leading-5 text-[#5b5675]">
                  No upcoming calls left today. Completed calls cannot be opened.
                </p>
              </Card>
            )}
          </aside>
        </div>
      </Card>
    </div>
  );
};

export default FigmaScheduledFollowUpsDashboard;
