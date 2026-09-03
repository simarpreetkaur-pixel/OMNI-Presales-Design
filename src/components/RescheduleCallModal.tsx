import { useEffect, useState } from "react";
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

export type ReschedulePreset = {
  dateOption?: "today" | "tomorrow" | "dayAfter";
  exactTime?: string;
  language?: string;
  /** When set, confirm automatically after this many ms (Phase III agent). */
  autoConfirmMs?: number;
};

interface RescheduleCallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
  customerName?: string;
  product?: string;
  onConfirm?: (date: string, time: string) => void;
  preset?: ReschedulePreset | null;
}

type DateOption = "today" | "tomorrow" | "dayAfter" | "custom";
type TimeSlot = "morning" | "afternoon" | "evening";

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

const RescheduleCallModal = ({
  open,
  onOpenChange,
  onBack,
  customerName = "Rajesh Kumar",
  product = "Car_Comprehensive",
  onConfirm,
  preset = null,
}: RescheduleCallModalProps) => {
  const defaultSlot = (): TimeSlot => {
    const h = new Date().getHours();
    if (h < 11) return "morning";
    if (h < 16) return "afternoon";
    return "evening";
  };

  const [selectedDate, setSelectedDate] = useState<DateOption | null>(null);
  const [customDate, setCustomDate]     = useState<Date | undefined>(undefined);
  const [customCalOpen, setCustomCalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot]  = useState<TimeSlot>(defaultSlot);
  const [selectedExactTime, setSelectedExactTime] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage]   = useState<string>("");

  const today = new Date();

  useEffect(() => {
    if (!open) return;
    if (!preset) {
      setSelectedDate(null);
      setSelectedExactTime("");
      setSelectedSlot(defaultSlot());
      setSelectedLanguage("");
      return;
    }
    const time = preset.exactTime ?? "";
    const chip = exactTimes15.find((c) => c.label === time);
    setSelectedDate(preset.dateOption ?? "tomorrow");
    setSelectedExactTime(time);
    setSelectedSlot(chip ? slotForHour(chip.hour24) : "morning");
    setSelectedLanguage(preset.language ?? "Hindi");
  }, [open, preset]);

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

  const handleSlotSelect = (id: TimeSlot) => {
    if (selectedSlot === id) return;
    setSelectedSlot(id);
    if (selectedExactTime) {
      const [lo, hi] = slotHourRange[id];
      const chip = exactTimes15.find((c) => c.label === selectedExactTime);
      if (!chip || chip.hour24 < lo || chip.hour24 >= hi) {
        setSelectedExactTime("");
      }
    }
  };

  const handleChipSelect = (label: string, hour24: number) => {
    if (selectedExactTime === label) {
      setSelectedExactTime("");
      return;
    }
    setSelectedExactTime(label);
    setSelectedSlot(slotForHour(hour24));
  };

  const slotLabel = timeSlots.find((s) => s.id === selectedSlot)?.label ?? "";

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

  useEffect(() => {
    if (!open || !preset?.autoConfirmMs || !canConfirm) return;
    const id = window.setTimeout(() => {
      handleConfirm();
    }, preset.autoConfirmMs);
    return () => window.clearTimeout(id);
    // Intentionally only when modal opens with an auto-confirm preset
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, preset?.autoConfirmMs, canConfirm]);

  const chipsForGrid = (() => {
    if (!selectedSlot) return exactTimes15;
    const [lo, hi] = slotHourRange[selectedSlot];
    return exactTimes15.filter((c) => c.hour24 >= lo && c.hour24 < hi);
  })();

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

          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className="bg-[#efe9fb] p-1 rounded-[6px] shrink-0 mt-0.5">
              <CalendarDays className="h-6 w-6 text-[#7c47e1]" />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-[18px] font-semibold leading-6 text-[#36354c]">
                Re-schedule Call
              </span>
              <span className="text-[14px] font-normal leading-6 text-[#5b5675] truncate">
                {customerName} • {product}
              </span>
            </div>
          </div>
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

          {/* Select Exact Time — hour-row grid (only after a slot is chosen) */}
          {selectedSlot && (
            <div className="flex flex-col gap-3">
              <span className="text-[14px] font-normal text-[#5b5675]">Select exact time (optional)</span>
              <div className="flex flex-col gap-2">
                {hourGroups.map(({ hour24, chips }) => (
                  <div key={hour24} className="flex items-center gap-[10px]">
                    <span className="w-[44px] shrink-0 text-[12px] font-medium text-[#a9a5be] text-right">
                      {hourLabel(hour24)}
                    </span>
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
                    {chips.length < 4 &&
                      Array.from({ length: 4 - chips.length }).map((_, i) => (
                        <div key={i} className="flex-1" />
                      ))}
                  </div>
                ))}
              </div>
            </div>
          )}

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
              "w-full h-14 rounded-[16px] text-[14px] font-medium text-white transition-all",
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
