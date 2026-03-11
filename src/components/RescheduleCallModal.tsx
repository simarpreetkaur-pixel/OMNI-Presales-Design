import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowLeft, X, Sunrise, Sun, Sunset, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

type TimeSlot = "morning" | "afternoon" | "evening";
type DateOption = "today" | "tomorrow" | "dayAfter" | "pick";

const amTimes = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM",
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
];

const pmTimes = [
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM",
];

const slotTimeRanges: Record<TimeSlot, string> = {
  morning: "8–11 AM",
  afternoon: "12–3 PM",
  evening: "4–7 PM",
};

const RescheduleCallModal = ({
  open,
  onOpenChange,
  onBack,
  customerName = "Rajesh Kumar",
  product = "Car Insurance",
  onConfirm,
}: RescheduleCallModalProps) => {
  const [selectedDate, setSelectedDate] = useState<DateOption>("today");
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const [pickedDate, setPickedDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [exactTimeOpen, setExactTimeOpen] = useState(false);
  const [selectedExactTime, setSelectedExactTime] = useState<string | null>(null);
  const [amPm, setAmPm] = useState<"AM" | "PM">("AM");

  const today = new Date();

  const getDateDisplayLabel = () => {
    switch (selectedDate) {
      case "today":
        return "Today";
      case "tomorrow":
        return "Tomorrow";
      case "dayAfter":
        return "Day After";
      case "pick":
        return pickedDate ? format(pickedDate, "dd MMM yyyy") : "";
    }
  };

  const getPickButtonLabel = () => {
    if (selectedDate === "pick" && pickedDate) {
      return format(pickedDate, "dd MMM");
    }
    return "Pick";
  };

  const timeSlots: { key: TimeSlot; label: string; time: string; icon: React.ReactNode; iconBg: string }[] = [
    {
      key: "morning",
      label: "Morning",
      time: "8–11 AM",
      icon: <Sunrise className="h-5 w-5 text-orange-500" />,
      iconBg: "bg-orange-100",
    },
    {
      key: "afternoon",
      label: "Afternoon",
      time: "12–3 PM",
      icon: <Sun className="h-5 w-5 text-orange-500" />,
      iconBg: "bg-orange-100",
    },
    {
      key: "evening",
      label: "Evening",
      time: "4–7 PM",
      icon: <Sunset className="h-5 w-5 text-purple-600" />,
      iconBg: "bg-purple-200",
    },
  ];

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedTime(slot);
    setSelectedExactTime(null);
    setExactTimeOpen(false);
  };

  const displayedTimes = amPm === "AM" ? amTimes : pmTimes;

  const handleConfirm = () => {
    const datePart = getDateDisplayLabel();
    const timePart = selectedExactTime
      ? selectedExactTime
      : selectedTime
        ? { morning: "Morning (8–11 AM)", afternoon: "Afternoon (12–3 PM)", evening: "Evening (4–7 PM)" }[selectedTime]
        : "";

    const scheduleLabel = timePart
      ? `${timePart}, ${datePart}`
      : datePart;

    toast(
      <div className="relative flex items-center gap-3 pr-6">
        <button
          onClick={() => toast.dismiss()}
          className="absolute top-0 right-0 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <div className="h-8 w-8 rounded-full bg-success-bg flex items-center justify-center shrink-0 animate-scale-in">
          <CheckCircle2 className="h-5 w-5 text-success" />
        </div>
        <p className="text-sm font-medium text-foreground">
          Call with <span className="font-semibold">{customerName}</span> re-scheduled to{" "}
          <span className="font-semibold">{scheduleLabel}</span> successfully
        </p>
      </div>,
      {
        duration: 4000,
        position: "bottom-right",
        className: "border border-success/20 bg-card shadow-lg rounded-2xl",
      }
    );

    onConfirm?.(datePart, timePart);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden rounded-[20px] border-border shadow-xl [&>button:last-child]:hidden">
        <DialogTitle className="sr-only">Reschedule Call</DialogTitle>

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border bg-card">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-onyx-800" />
          </Button>
          <div className="h-11 w-11 rounded-full flex items-center justify-center shrink-0 bg-purple-100">
            <CalendarDays className="h-5 w-5 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-onyx-800">
              Reschedule Call
            </h2>
            <p className="text-sm text-onyx-500">
              {customerName} · {product}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-lg"
          >
            <X className="h-5 w-5 text-onyx-500" />
          </Button>
        </div>

        <Separator className="bg-border" />

        {/* Content */}
        <div className="px-6 py-6 space-y-6 bg-white">
          {/* Select Date */}
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-wider uppercase text-onyx-500" style={{ letterSpacing: '0.5px' }}>
              Select date
            </p>
            <div className="flex gap-2">
              {(["today", "tomorrow", "dayAfter"] as DateOption[]).map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  size="sm"
                  onClick={() => { setSelectedDate(option); setSelectedExactTime(null); }}
                  className={cn(
                    "px-4 py-2.5 rounded-xl",
                    selectedDate === option
                      ? "border-primary bg-secondary text-primary"
                      : "border-border bg-card text-foreground hover:border-purple-400"
                  )}
                >
                  {option === "today" ? "Today" : option === "tomorrow" ? "Tomorrow" : "Day After"}
                </Button>
              ))}
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDate("pick")}
                    className={cn(
                      "px-4 py-2.5 rounded-xl gap-2",
                      selectedDate === "pick"
                        ? "border-primary bg-secondary text-primary"
                        : "border-border bg-card text-foreground hover:border-purple-400"
                    )}
                  >
                    <CalendarDays className="h-4 w-4" />
                    {getPickButtonLabel()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={pickedDate}
                    onSelect={(date) => {
                      setPickedDate(date);
                      setSelectedDate("pick");
                      setCalendarOpen(false);
                      setSelectedExactTime(null);
                    }}
                    disabled={(date) => date < today}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Preferred Slot */}
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-wider uppercase text-onyx-500" style={{ letterSpacing: '0.5px' }}>
              Preferred slot
            </p>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.key}
                  variant="outline"
                  onClick={() => handleSlotSelect(slot.key)}
                  className={cn(
                    "flex flex-col items-start gap-3 p-4 h-auto rounded-2xl",
                    selectedTime === slot.key
                      ? "border-primary bg-secondary shadow-sm"
                      : "border-border bg-card hover:border-purple-400"
                  )}
                >
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", slot.iconBg)}>
                    {slot.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-onyx-800">
                      {slot.label}
                    </p>
                    <p className="text-xs mt-0.5 text-onyx-500">
                      {slot.time}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Select Exact Time */}
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={() => setExactTimeOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-5 py-4 h-auto rounded-2xl border-border bg-card hover:border-purple-400"
            >
              <p className="text-xs font-semibold tracking-wider uppercase text-onyx-500" style={{ letterSpacing: '0.5px' }}>
                Select exact time
              </p>
              {exactTimeOpen
                ? <ChevronUp className="h-5 w-5 text-onyx-500" />
                : <ChevronDown className="h-5 w-5 text-onyx-500" />
              }
            </Button>
            <div className={cn(
              "grid transition-all duration-300 ease-in-out",
              exactTimeOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}>
              <div className="overflow-hidden">
                <div className="pt-1 space-y-3">
                  {/* AM / PM toggle */}
                  <div className="flex items-center gap-1 bg-muted rounded-lg p-1 w-fit">
                    {(["AM", "PM"] as const).map((period) => (
                      <button
                        key={period}
                        onClick={() => { setAmPm(period); setSelectedExactTime(null); }}
                        className={cn(
                          "px-3 py-1 text-sm font-semibold rounded-md transition-colors",
                          amPm === period
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                  {/* Horizontally scrollable times with right fade */}
                  <div className="relative">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 pr-12">
                      {displayedTimes.map((time) => (
                        <Button
                          key={time}
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedExactTime(time)}
                          className={cn(
                            "shrink-0 px-4 py-2.5 rounded-xl",
                            selectedExactTime === time
                              ? "border-primary bg-secondary text-primary"
                              : "border-border bg-card text-foreground hover:border-purple-400"
                          )}
                        >
                          {time.replace(" AM", "").replace(" PM", "")}
                        </Button>
                      ))}
                    </div>
                    {/* Right fade overlay */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary + CTA */}
        <div className="px-6 pb-6 pt-3 space-y-4 bg-white">
          <Button
            className="w-full rounded-2xl gap-2"
            size="lg"
            disabled={selectedDate === "pick" && !pickedDate}
            onClick={handleConfirm}
          >
            <CalendarDays className="h-5 w-5" />
            {selectedExactTime
              ? `Confirm · ${getDateDisplayLabel()}, ${selectedExactTime}`
              : selectedTime
                ? `Confirm · ${getDateDisplayLabel()}, ${slotTimeRanges[selectedTime]}`
                : `Confirm · ${getDateDisplayLabel()}`
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleCallModal;
