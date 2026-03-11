import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PhoneIncoming, Globe, MapPin, ClipboardList, Headset, Sparkles, Phone, X } from "lucide-react";

interface IncomingCallModal2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COUNTDOWN_DURATION = 15;

const getTimerColors = (ratio: number) => {
  if (ratio > 0.6) return { stroke: "hsl(var(--green-600))", track: "hsl(var(--green-200))" };
  if (ratio > 0.35) return { stroke: "hsl(var(--orange-500))", track: "hsl(var(--orange-200))" };
  return { stroke: "hsl(var(--cerise-600))", track: "hsl(var(--cerise-200))" };
};

const FemaleAvatar = () => (
  <svg viewBox="0 0 40 40" fill="none" className="h-8 w-8">
    <circle cx="20" cy="14" r="7" fill="#9ca3af" />
    <path d="M20 7c-3.5 0-6.5 2.5-7 6-.3 2 .5 3 .5 3s1-3 6.5-3 6.5 3 6.5 3 .8-1 .5-3c-.5-3.5-3.5-6-7-6z" fill="#6b7280" />
    <ellipse cx="20" cy="34" rx="12" ry="8" fill="#9ca3af" />
  </svg>
);

const IncomingCallModal2 = ({ open, onOpenChange }: IncomingCallModal2Props) => {
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setCountdown(COUNTDOWN_DURATION);
      return;
    }
  }, [open]);

  useEffect(() => {
    if (!open || countdown <= 0) return;
    const interval = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [open, countdown]);

  const ratio = countdown / COUNTDOWN_DURATION;
  const timerColors = getTimerColors(ratio);
  const circumference = 2 * Math.PI * 15;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[412px] p-0 gap-0 overflow-hidden border-border shadow-xl rounded-[20px] [&>button:last-child]:hidden">
          <DialogTitle className="sr-only">Incoming Call 2</DialogTitle>

          {/* Custom floating close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 z-20 rounded-sm opacity-70 transition-opacity hover:opacity-100">
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-green-100">
            <div className="flex items-center gap-2">
              <PhoneIncoming className="h-4 w-4 text-green-700" />
              <span className="text-base font-medium text-foreground">Incoming call</span>
              <span className="flex gap-1 items-center ml-1">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-[dotBounce_1.4s_ease-in-out_infinite]" />
                <span className="h-2 w-2 rounded-full bg-green-500 animate-[dotBounce_1.4s_ease-in-out_0.2s_infinite]" />
                <span className="h-2 w-2 rounded-full bg-green-500 animate-[dotBounce_1.4s_ease-in-out_0.4s_infinite]" />
              </span>
            </div>
            <svg className="h-9 w-9 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke={timerColors.track} strokeWidth="3" />
              <circle cx="18" cy="18" r="15" fill="none" stroke={timerColors.stroke} strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - ratio)}
                className="transition-[stroke-dashoffset] duration-1000 ease-linear" />
            </svg>
          </div>

          {/* Profile Banner */}
          <div className="bg-green-200 py-[19px] flex flex-col items-center gap-2">
            <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">
              <FemaleAvatar />
            </div>
            <p className="text-xl font-semibold text-foreground">Pooja Arora</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" />
                English
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                New Delhi
              </span>
            </div>
          </div>

          {/* Call Context */}
          <div className="px-6 pt-4 pb-[17px] bg-card space-y-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Call Context</span>
            </div>
            <div className="rounded-xl border border-onyx-300 p-4 space-y-4">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm text-muted-foreground shrink-0">Interested in</span>
                <span className="text-sm font-semibold text-foreground text-right">ACKO_Platinum Lite</span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm text-muted-foreground shrink-0">Plan Type</span>
                <span className="text-sm font-semibold text-foreground text-right">Family floater (10L cover)</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground shrink-0">Last Activity</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-purple-300 bg-white text-xs font-medium text-primary">
                  <Headset className="h-3.5 w-3.5" />
                  Smitha
                </span>
              </div>

              {/* Previous Summary */}
              <div className="space-y-2 rounded-lg p-3" style={{ backgroundColor: "#F8F7FC" }}>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Previous Summary:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-sm text-foreground leading-relaxed">
                  <li>Customer asked for comparison between HDFC Ergo and Platinum Lite</li>
                  <li>Mentioned to discuss with Husband and make decision.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="px-6 pb-6 pt-3 bg-card">
            <Button
              className="w-full rounded-2xl h-12 text-sm font-medium gap-2 bg-green-600 hover:bg-green-700"
              onClick={() => { onOpenChange(false); navigate("/crm", { state: { customer: "pooja" } }); }}>
              <Phone className="h-4 w-4" />
              Answer Call
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IncomingCallModal2;
