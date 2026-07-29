import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  X,
  CalendarDays,
  Sunrise,
  Sun,
  Sunset,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

interface RescheduleCallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
  customerName?: string;
  product?: string;
  onConfirm?: (date: string, time: string) => void;
}

type DateOption = "today" | "tomorrow" | "dayAfter" | "custom";
type TimeSlot = "morning" | "afternoon" | "evening";
type Iteration = "1" | "2" | "3";

// Iteration 1 — 30-min intervals
const exactTimes30 = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM",
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM",
];

// Iteration 2 — 15-min intervals (from Figma: 8:00am … 8:00pm)
interface TimeChip { label: string; hour24: number; }
const exactTimes15: TimeChip[] = [];
for (let h = 8; h <= 20; h++) {
  for (let m = 0; m < 60; m += 15) {
    if (h === 20 && m > 0) break;
    const suffix = h < 12 ? "am" : "pm";
    const displayH = h > 12 ? h - 12 : h;
    const displayM = m === 0 ? "00" : String(m);
    exactTimes15.push({ label: `${displayH}:${displayM}${suffix}`, hour24: h });
  }
}

const slotHourRange: Record<string, [number, number]> = {
  morning:   [8,  11],
  afternoon: [11, 16],
  evening:   [16, 21],
};

const slotForHour = (h: number): TimeSlot => {
  if (h < 11) return "morning";
  if (h < 16) return "afternoon";
  return "evening";
};

// Iteration 3 — hardcoded booked slots
const bookedSlots = new Set([
  "9:15am", "10:30am", "12:00pm", "1:45pm",
  "3:30pm", "4:15pm", "5:30pm", "6:45pm", "7:15pm",
]);

const hourLabel = (h: number) =>
  h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`;

const timeSlots: {
  id: TimeSlot;
  label: string;
  range: string;
  Icon: React.FC<{ className?: string }>;
}[] = [
  { id: "morning",   label: "Morning",   range: "8 - 11AM",   Icon: Sunrise },
  { id: "afternoon", label: "Afternoon", range: "11AM - 4PM", Icon: Sun },
  { id: "evening",   label: "Evening",   range: "4 - 8PM",    Icon: Sunset },
];

const languages = [
  "Hindi", "English", "Tamil", "Telugu",
  "Kannada", "Marathi", "Bengali", "Gujarati",
];

const CHIP_WIDTH = 90;   // px — from Figma
const CHIP_GAP  = 11;    // px — (101 - 90)
const SCROLL_BY = 3 * (CHIP_WIDTH + CHIP_GAP); // scroll 3 chips at a time

const RescheduleCallModal = ({
  open,
  onOpenChange,
  onBack,
  customerName = "Rajesh Kumar",
  product = "Car_Comprehensive",
  onConfirm,
}: RescheduleCallModalProps) => {
  const [iteration, setIteration] = useState<Iteration>("1");

  // Default slot based on current hour
  const defaultSlot = (): TimeSlot => {
    const h = new Date().getHours();
    if (h < 11) return "morning";
    if (h < 16) return "afternoon";
    return "evening";
  };

  // Shared state — reset when iteration changes
  const [selectedDate, setSelectedDate] = useState<DateOption | null>(null);
  const [customDate, setCustomDate]     = useState<Date | undefined>(undefined);
  const [customCalOpen, setCustomCalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot]  = useState<TimeSlot>(defaultSlot);
  const [selectedExactTime, setSelectedExactTime] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage]   = useState<string>("");

  // Iteration 2 chip-strip scroll ref
  const chipStripRef = useRef<HTMLDivElement>(null);

  const today = new Date();

  const getDateLabel = (opt: DateOption): string => {
    const d = new Date(today);
    if (opt === "today")    return format(d, "dd MMM");
    if (opt === "tomorrow") { d.setDate(d.getDate() + 1); return format(d, "dd MMM"); }
    if (opt === "dayAfter") { d.setDate(d.getDate() + 2); return format(d, "dd MMM"); }
    if (opt === "custom" && customDate) return format(customDate, "dd MMM yyyy");
    return "Custom";
  };

  const getDateFriendlyLabel = (opt: DateOption): string => {
    if (opt === "today")    return "Today";
    if (opt === "tomorrow") return "Tomorrow";
    if (opt === "dayAfter") return "Day After";
    if (opt === "custom" && customDate) return format(customDate, "dd MMM");
    return "Custom";
  };

  const dateLabel = selectedDate ? getDateLabel(selectedDate) : null;
  const dateFriendlyLabel = selectedDate ? getDateFriendlyLabel(selectedDate) : null;
  const canConfirm = selectedDate !== null;

  const handleIterationChange = (val: string) => {
    setIteration(val as Iteration);
    setSelectedExactTime("");
  };

  const handleSlotSelect = (id: TimeSlot) => {
    if (selectedSlot === id) return; // already active — no deselect
    setSelectedSlot(id);
    // Clear exact time if it falls outside the newly chosen slot
    if (selectedExactTime) {
      const [lo, hi] = slotHourRange[id];
      const chip = exactTimes15.find((c) => c.label === selectedExactTime);
      if (!chip || chip.hour24 < lo || chip.hour24 >= hi) {
        setSelectedExactTime("");
      }
    }
  };

  // Iteration 2 — chip tap: set exact time AND auto-highlight the parent slot
  const handleChipSelect = (label: string, hour24: number) => {
    if (selectedExactTime === label) {
      // Deselect chip — keep slot highlighted (agent still wants that window)
      setSelectedExactTime("");
      return;
    }
    setSelectedExactTime(label);
    setSelectedSlot(slotForHour(hour24));
  };

  const handleConfirm = () => {
    if (!canConfirm) return;
    const dateStr = dateLabel ?? "";
    const timeStr = selectedExactTime || slotLabel;

    if (onConfirm) {
      onConfirm(dateStr, timeStr);
    } else {
      toast(
        <div className="relative flex items-center gap-3 pr-6">
          <button
            onClick={() => toast.dismiss()}
            className="absolute top-0 right-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
          <p className="text-sm">
            Call rescheduled for {customerName} — {dateStr}, {timeStr}
          </p>
        </div>,
        { duration: 4000, position: "bottom-right" }
      );
    }
    onOpenChange(false);
  };

  // ── Iteration 1: Select dropdown ─────────────────────────────────────────
  const ExactTimeIteration1 = (
    <div className="flex items-center justify-between w-full px-5 py-3 rounded-[12px] border bg-[#efe9fb] border-[#b191ed]">
      <span className="text-[16px] font-medium text-[#36354c] shrink-0">
        Select exact time (optional)
      </span>
      <Select value={selectedExactTime} onValueChange={setSelectedExactTime}>
        <SelectTrigger className="h-auto w-[220px] border-[#e7e7f0] bg-white rounded-[12px] px-3 py-2 text-[14px] font-medium text-[#36354c] focus:ring-0 focus:ring-offset-0">
          <SelectValue placeholder="Select time" />
        </SelectTrigger>
        <SelectContent>
          {exactTimes30.map((t) => (
            <SelectItem key={t} value={t}>{t}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  // ── Iteration 2: Horizontal scrollable chip strip ────────────────────────
  const scrollStrip = (dir: "left" | "right") => {
    chipStripRef.current?.scrollBy({
      left: dir === "left" ? -SCROLL_BY : SCROLL_BY,
      behavior: "smooth",
    });
  };

  const filteredChips = (() => {
    if (!selectedSlot) return exactTimes15;
    const [lo, hi] = slotHourRange[selectedSlot];
    return exactTimes15.filter((c) => c.hour24 >= lo && c.hour24 < hi);
  })();

  const ExactTimeIteration2 = (
    <div className="flex flex-col gap-3">
      <span className="text-[14px] font-normal text-[#5b5675]">Select exact time (optional)</span>
      <div className="flex items-center gap-2">
        {/* Left scroll arrow */}
        <button
          onClick={() => scrollStrip("left")}
          className="shrink-0 h-11 w-7 flex items-center justify-center rounded-[8px] border border-[#e7e7f0] bg-white hover:border-[#7c47e1]/50 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4 text-[#5b5675]" />
        </button>

        {/* Chip strip — clipped viewport */}
        <div
          ref={chipStripRef}
          className="flex-1 overflow-x-auto scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`.chip-strip::-webkit-scrollbar { display: none; }`}</style>
          <div className="chip-strip flex" style={{ gap: `${CHIP_GAP}px` }}>
            {filteredChips.map(({ label, hour24 }) => (
              <button
                key={label}
                onClick={() => handleChipSelect(label, hour24)}
                style={{ minWidth: `${CHIP_WIDTH}px` }}
                className={cn(
                  "h-11 flex items-center justify-center rounded-[8px] border text-[14px] font-medium transition-colors shrink-0",
                  selectedExactTime === label
                    ? "bg-[#efe9fb] border-[#7c47e1] text-[#36354c]"
                    : "border-[#e7e7f0] bg-white text-[#36354c] hover:border-[#7c47e1]/50"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Right scroll arrow */}
        <button
          onClick={() => scrollStrip("right")}
          className="shrink-0 h-11 w-7 flex items-center justify-center rounded-[8px] border border-[#e7e7f0] bg-white hover:border-[#7c47e1]/50 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4 text-[#5b5675]" />
        </button>
      </div>
    </div>
  );

  // ── Iteration 3: Hour-row grid ───────────────────────────────────────────
  const chipsForGrid = (() => {
    if (!selectedSlot) return exactTimes15;
    const [lo, hi] = slotHourRange[selectedSlot];
    return exactTimes15.filter((c) => c.hour24 >= lo && c.hour24 < hi);
  })();

  // Group chips by hour for row rendering
  const hourGroups = chipsForGrid.reduce<{ hour24: number; chips: TimeChip[] }[]>(
    (acc, chip) => {
      const last = acc[acc.length - 1];
      if (last && last.hour24 === chip.hour24) {
        last.chips.push(chip);
      } else {
        acc.push({ hour24: chip.hour24, chips: [chip] });
      }
      return acc;
    },
    []
  );

  const ExactTimeIteration3 = (
    <div className="flex flex-col gap-3">
      <span className="text-[14px] font-normal text-[#5b5675]">Select exact time (optional)</span>
      <div className="flex flex-col gap-2">
        {hourGroups.map(({ hour24, chips }) => (
          <div key={hour24} className="flex items-center gap-[10px]">
            {/* Hour label */}
            <span className="w-[44px] shrink-0 text-[12px] font-medium text-[#a9a5be] text-right">
              {hourLabel(hour24)}
            </span>
            {/* Quarter-hour chips */}
            {chips.map(({ label }) => {
              const booked = bookedSlots.has(label);
              const chosen = selectedExactTime === label;
              return (
                <button
                  key={label}
                  disabled={booked}
                  onClick={() => !booked && handleChipSelect(label, hour24)}
                  className={cn(
                    "flex-1 h-10 flex items-center justify-center rounded-[10px] border text-[13px] font-medium transition-colors",
                    chosen  && "bg-[#efe9fb] border-[#7c47e1] text-[#36354c]",
                    booked  && "bg-[#f5f4fb] border-[#e7e7f0] text-[#c4c1d6] line-through cursor-not-allowed",
                    !chosen && !booked && "border-[#e7e7f0] bg-white text-[#36354c] hover:border-[#7c47e1]/50"
                  )}
                >
                  {label}
                </button>
              );
            })}
            {/* Pad incomplete rows (e.g. 8:00pm has only 1 chip) */}
            {chips.length < 4 &&
              Array.from({ length: 4 - chips.length }).map((_, i) => (
                <div key={i} className="flex-1" />
              ))}
          </div>
        ))}
      </div>
    </div>
  );

  const exactTimeUI =
    iteration === "1" ? ExactTimeIteration1
    : iteration === "2" ? ExactTimeIteration2
    : ExactTimeIteration3;

  // Confirm button label — builds up as user makes selections
  const slotLabel = timeSlots.find((s) => s.id === selectedSlot)?.label ?? "";
  const confirmLabel = (() => {
    if (!dateFriendlyLabel) return "Confirm";
    const parts: string[] = [dateFriendlyLabel];
    if (selectedExactTime) {
      parts.push(selectedExactTime);
    } else if (slotLabel) {
      parts.push(slotLabel);
    }
    return `Confirm • ${parts.join(", ")}`;
  })();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[552px] p-0 gap-0 overflow-hidden border-border shadow-xl rounded-[24px] [&>button:last-child]:hidden">
        <DialogTitle className="sr-only">Re-schedule Call</DialogTitle>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start gap-3 px-5 py-5 border-b border-[#f0f0f6] bg-white">
          <button
            onClick={onBack}
            className="mt-0.5 shrink-0 text-[#36354c] hover:text-[#040222] transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          {/* Title + subtitle */}
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className="bg-[#efe9fb] p-1 rounded-[6px] shrink-0 mt-0.5">
              <CalendarDays className="h-6 w-6 text-[#7c47e1]" />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-[18px] font-semibold leading-6 text-[#36354c]">
                Re-schedule Call
              </span>
              <span className="text-[16px] font-normal leading-6 text-[#5b5675] truncate">
                {customerName} • {product}
              </span>
            </div>
          </div>

          {/* Iteration switcher — top-right */}
          <Select value={iteration} onValueChange={handleIterationChange}>
            <SelectTrigger className="h-8 w-[110px] shrink-0 text-[12px] font-medium border-[#e7e7f0] rounded-[8px] focus:ring-0 focus:ring-offset-0 text-[#5b5675]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="1">Iteration 1</SelectItem>
              <SelectItem value="2">Iteration 2</SelectItem>
              <SelectItem value="3">Iteration 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-5 px-[25px] py-5 bg-white overflow-y-auto max-h-[500px]">

          {/* Select Date */}
          <div className="flex flex-col gap-3">
            <span className="text-[14px] font-normal text-[#5b5675]">Select Date</span>
            <div className="flex gap-[10px]">
              {(["today", "tomorrow", "dayAfter"] as DateOption[]).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedDate(opt)}
                  className={cn(
                    "flex-1 px-3 py-2.5 rounded-[12px] border text-[14px] font-medium transition-colors",
                    selectedDate === opt
                      ? "bg-[#efe9fb] border-[#7c47e1] text-[#36354c]"
                      : "border-[#e7e7f0] text-[#36354c] hover:border-[#7c47e1]/50"
                  )}
                >
                  {opt === "today" ? "Today" : opt === "tomorrow" ? "Tomorrow" : "Day After"}
                </button>
              ))}

              {/* Custom date picker */}
              <Popover open={customCalOpen} onOpenChange={setCustomCalOpen}>
                <PopoverTrigger asChild>
                  <button
                    onClick={() => setCustomCalOpen(true)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1 px-2 py-2.5 rounded-[12px] border text-[14px] font-medium transition-colors",
                      selectedDate === "custom"
                        ? "bg-[#efe9fb] border-[#7c47e1] text-[#36354c]"
                        : "border-[#e7e7f0] text-[#36354c] hover:border-[#7c47e1]/50"
                    )}
                  >
                    <CalendarDays className="h-4 w-4 shrink-0" />
                    <span className="whitespace-nowrap">
                      {selectedDate === "custom" && customDate
                        ? format(customDate, "dd MMM")
                        : "Custom"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={customDate}
                    onSelect={(date) => {
                      setCustomDate(date);
                      setSelectedDate("custom");
                      setCustomCalOpen(false);
                    }}
                    disabled={(date) => date < today}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Preferred Slot */}
          <div className="flex flex-col gap-3">
            <span className="text-[14px] font-normal text-[#5b5675]">Preferred Slot</span>
            <div className="flex gap-[10px]">
              {timeSlots.map(({ id, label, range, Icon }) => (
                <button
                  key={id}
                  onClick={() => handleSlotSelect(id)}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-2 py-3 rounded-[12px] border transition-colors",
                    selectedSlot === id
                      ? "border-[#7c47e1] bg-[#efe9fb]"
                      : "border-[#e7e7f0] hover:border-[#7c47e1]/50"
                  )}
                >
                  <div className="bg-[#fff7e5] p-2 rounded-[10px]">
                    <Icon className="h-6 w-6 text-[#ffab00]" />
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[14px] font-medium text-[#36354c] leading-5">{label}</span>
                    <span className="text-[12px] font-medium text-[#5b5675] leading-4">{range}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Select Exact Time — only shown after a slot is chosen */}
          {selectedSlot && exactTimeUI}

          {/* Customer's preferred language (Optional) */}
          <div className="flex flex-col gap-3">
            <span className="text-[14px] font-normal text-[#5b5675]">
              Customer's preferred language{" "}
              <span className="opacity-60">(Optional)</span>
            </span>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="h-auto px-3 py-4 rounded-[12px] border-[#e7e7f0] text-[14px] text-[#5b5675] focus:ring-0 focus:ring-offset-0 bg-white">
                <SelectValue placeholder="Select from options" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div className="px-8 pb-6 pt-4 bg-white">
          <Button
            className={cn(
              "w-full h-14 rounded-[16px] text-[16px] font-medium text-white transition-all",
              canConfirm
                ? "bg-[#7c47e1] hover:bg-[#5920c5]"
                : "bg-[#7c47e1]/60 cursor-not-allowed"
            )}
            disabled={!canConfirm}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleCallModal;
