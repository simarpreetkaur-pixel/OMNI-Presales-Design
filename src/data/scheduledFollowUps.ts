export type FollowUpSlot = "morning" | "afternoon" | "evening";

export type FollowUpCallStatus = "done" | "missed" | "upcoming";

export type FollowUpProductCategory = "car" | "life" | "health";

export type ScheduledFollowUp = {
  id: string;
  customerName: string;
  /** Display label on the card chip, e.g. "Car insurance" */
  product: string;
  productCategory: FollowUpProductCategory;
  /** Local time on that calendar day, e.g. "11:30" 24h */
  time24: string;
  displayTime: string;
  slot: FollowUpSlot;
  /** 0 = today, 1 = tomorrow, 2+ = later this week */
  dayOffset: number;
  dayLabel: string;
  /** AI prep blurb shown under the call card when present */
  quickSummary?: string;
  /** Explicit outcome for demo; otherwise inferred from time */
  status?: "done" | "missed";
};

const SLOT_LABELS: Record<FollowUpSlot, string> = {
  morning: "Morning (8 AM - 12 PM)",
  afternoon: "Afternoon (12 - 4 PM)",
  evening: "Evening (4 PM onwards)",
};

export function getSlotLabel(slot: FollowUpSlot) {
  return SLOT_LABELS[slot];
}

/** Current day part from clock time — matches slot windows in SLOT_LABELS */
export function getActiveSlot(now: Date): FollowUpSlot {
  const mins = now.getHours() * 60 + now.getMinutes();
  if (mins < 12 * 60) return "morning";
  if (mins < 16 * 60) return "afternoon";
  return "evening";
}

/** Mock follow-ups aligned with Figma OMNI Sales homepage (node 2847:26629) */
export const MOCK_FOLLOW_UPS: ScheduledFollowUp[] = [
  // Today — matches Figma Today board
  {
    id: "t1",
    customerName: "Rajesh Kumar",
    product: "Car insurance",
    productCategory: "car",
    time24: "11:30",
    displayTime: "11:30 AM",
    slot: "morning",
    dayOffset: 0,
    dayLabel: "Today",
    quickSummary:
      "Prioritized zero-depreciation and engine protect over lowest premium. Completed need assessment yesterday and is ready to close on a comprehensive policy if roadside assistance is included.",
  },
  {
    id: "t2",
    customerName: "Priya Sharma",
    product: "Car insurance",
    productCategory: "car",
    time24: "13:15",
    displayTime: "1:15 PM",
    slot: "afternoon",
    dayOffset: 0,
    dayLabel: "Today",
    quickSummary:
      "Browsed Creta quotes twice this week; dropped off at add-ons. Prefers bumper-to-bumper with low voluntary deductible — confirm IDV and close with zero-dep today.",
  },
  {
    id: "t3",
    customerName: "Amit Patel",
    product: "Life Insurance",
    productCategory: "life",
    time24: "14:45",
    displayTime: "2:45 PM",
    slot: "afternoon",
    dayOffset: 0,
    dayLabel: "Today",
  },
  {
    id: "t4",
    customerName: "Sneha Reddy",
    product: "Life Insurance",
    productCategory: "life",
    time24: "16:00",
    displayTime: "4:00 PM",
    slot: "evening",
    dayOffset: 0,
    dayLabel: "Today",
  },
  {
    id: "t5",
    customerName: "Rohit Malhotra",
    product: "Health insurance",
    productCategory: "health",
    time24: "18:00",
    displayTime: "6:00 PM",
    slot: "evening",
    dayOffset: 0,
    dayLabel: "Today",
  },
  // Tomorrow
  {
    id: "tm1",
    customerName: "Vikram Singh",
    product: "Car insurance",
    productCategory: "car",
    time24: "09:00",
    displayTime: "9:00 AM",
    slot: "morning",
    dayOffset: 1,
    dayLabel: "Tomorrow",
  },
  {
    id: "tm2",
    customerName: "Meera Joshi",
    product: "Car insurance",
    productCategory: "car",
    time24: "10:30",
    displayTime: "10:30 AM",
    slot: "morning",
    dayOffset: 1,
    dayLabel: "Tomorrow",
  },
  {
    id: "tm3",
    customerName: "Arjun Nair",
    product: "Life Insurance",
    productCategory: "life",
    time24: "12:00",
    displayTime: "12:00 PM",
    slot: "afternoon",
    dayOffset: 1,
    dayLabel: "Tomorrow",
  },
  {
    id: "tm4",
    customerName: "Kavita Deshmukh",
    product: "Health insurance",
    productCategory: "health",
    time24: "13:30",
    displayTime: "1:30 PM",
    slot: "afternoon",
    dayOffset: 1,
    dayLabel: "Tomorrow",
  },
  {
    id: "tm5",
    customerName: "Deepak Verma",
    product: "Car insurance",
    productCategory: "car",
    time24: "15:00",
    displayTime: "3:00 PM",
    slot: "afternoon",
    dayOffset: 1,
    dayLabel: "Tomorrow",
  },
  {
    id: "tm6",
    customerName: "Ananya Iyer",
    product: "Health insurance",
    productCategory: "health",
    time24: "17:00",
    displayTime: "5:00 PM",
    slot: "evening",
    dayOffset: 1,
    dayLabel: "Tomorrow",
  },
];

export function parseTimeToMinutes(time24: string): number {
  const [h, m] = time24.split(":").map(Number);
  return h * 60 + m;
}

export function getCallStatus(call: ScheduledFollowUp, now: Date): FollowUpCallStatus {
  if (call.status === "done" || call.status === "missed") return call.status;
  if (call.dayOffset > 0) return "upcoming";
  if (call.dayOffset < 0) return "done";
  const nowMins = now.getHours() * 60 + now.getMinutes();
  return parseTimeToMinutes(call.time24) < nowMins ? "done" : "upcoming";
}

/** Done only — excludes missed calls from the completed count */
export function isCallCompleted(call: ScheduledFollowUp, now: Date): boolean {
  return getCallStatus(call, now) === "done";
}

/** Past the follow-up window (done or missed) */
export function isCallPast(call: ScheduledFollowUp, now: Date): boolean {
  return getCallStatus(call, now) !== "upcoming";
}

export function formatDayHeader(call: ScheduledFollowUp, now: Date): string {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + call.dayOffset);
  const day = d.getDate();
  const month = d.toLocaleString("en-GB", { month: "short" });
  if (call.dayOffset === 0) return `Today, ${day} ${month}`;
  if (call.dayOffset === 1) return `Tomorrow, ${day} ${month}`;
  const weekday = d.toLocaleString("en-GB", { weekday: "short" });
  return `${weekday}, ${day} ${month}`;
}

export function getWeekdayName(dayOffset: number, now: Date): string {
  const d = new Date(now);
  d.setDate(d.getDate() + dayOffset);
  return d.toLocaleString("en-GB", { weekday: "long" });
}
