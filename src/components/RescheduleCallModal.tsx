import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowLeft, X, Sunrise, Sun, Sunset, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [exactTimeCollapsed, setExactTimeCollapsed] = useState(true);
  const [customDateOpen, setCustomDateOpen] = useState(false);

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
    setExactTimeCollapsed(true);
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
    <>
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
            <p className="text-sm font-medium text-foreground">Select Date</p>
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCustomDateOpen(true)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl",
                  selectedDate === "pick"
                    ? "border-primary bg-secondary text-primary"
                    : "border-border hover:border-purple-400"
                )}
              >
                <CalendarDays className="h-4 w-4" />
                <span className="text-sm font-medium">Custom</span>
              </Button>
            </div>
          </div>

          {/* Preferred Slot - Bento Box Style */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Preferred Slot</p>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((slot) => (
                <Card
                  key={slot.key}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedTime === slot.key
                      ? "border-primary bg-secondary"
                      : "border-border hover:border-purple-400"
                  )}
                  onClick={() => handleSlotSelect(slot.key)}
                >
                  <CardContent className="p-4 text-center space-y-2">
                    <div className={cn("w-10 h-10 rounded-lg mx-auto flex items-center justify-center", slot.iconBg)}>
                      {slot.icon}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{slot.label}</p>
                      <p className="text-xs text-muted-foreground">{slot.time}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Select Exact Time - Collapsible */}
          <Collapsible open={!exactTimeCollapsed} onOpenChange={() => setExactTimeCollapsed(!exactTimeCollapsed)}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex items-center justify-between px-4 py-3 h-auto rounded-xl border-border hover:border-purple-400"
              >
                <span className="text-sm font-medium text-foreground">Select Exact Time</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", !exactTimeCollapsed && "rotate-180")} />
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-4 mt-3">
              <Tabs defaultValue="AM" onValueChange={(value) => {
                setAmPm(value as "AM" | "PM");
                setSelectedExactTime(null);
              }}>
                <TabsList className="grid w-fit grid-cols-2">
                  <TabsTrigger value="AM">AM</TabsTrigger>
                  <TabsTrigger value="PM">PM</TabsTrigger>
                </TabsList>
                
                <TabsContent value="AM" className="mt-3">
                  <div className="grid grid-cols-4 gap-2">
                    {amTimes.map((time) => (
                      <Button
                        key={time}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedExactTime(time)}
                        className={cn(
                          "text-sm",
                          selectedExactTime === time
                            ? "border-primary bg-secondary text-primary"
                            : "border-border hover:border-purple-400"
                        )}
                      >
                        {time.replace(" AM", "")}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="PM" className="mt-3">
                  <div className="grid grid-cols-4 gap-2">
                    {pmTimes.map((time) => (
                      <Button
                        key={time}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedExactTime(time)}
                        className={cn(
                          "text-sm",
                          selectedExactTime === time
                            ? "border-primary bg-secondary text-primary"
                            : "border-border hover:border-purple-400"
                        )}
                      >
                        {time.replace(" PM", "")}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CollapsibleContent>
          </Collapsible>

          {/* Customer's Preferred Language */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Customer's preferred language <span className="text-muted-foreground">(Optional)</span>
            </label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select from options" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hindi">Hindi</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="malayalam">Malayalam</SelectItem>
                <SelectItem value="kannada">Kannada</SelectItem>
                <SelectItem value="telugu">Telugu</SelectItem>
              </SelectContent>
            </Select>
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

    {/* Custom Date Picker Modal */}
    {customDateOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Select date</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCustomDateOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <Calendar
            mode="single"
            selected={pickedDate}
            onSelect={setPickedDate}
            className="rounded-md border"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            }}
          />
          
          <Button
            onClick={() => {
              setSelectedDate("pick");
              setCustomDateOpen(false);
            }}
            className="w-full mt-4"
            disabled={!pickedDate}
          >
            Confirm
          </Button>
        </div>
      </div>
    )}
    </>
  );
};

export default RescheduleCallModal;
