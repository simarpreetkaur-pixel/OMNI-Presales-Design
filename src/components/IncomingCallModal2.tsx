import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Globe, Award, ClipboardList, Headset, Sparkles, X } from "lucide-react";

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md p-0 gap-0 overflow-hidden border-border shadow-xl rounded-[24px] [&>button:last-child]:hidden">
        <DialogTitle className="sr-only">Incoming Call – Pooja Arora</DialogTitle>

        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 z-20 rounded-sm opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4 text-[#36354c]" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#f0f0f6] bg-white pr-12">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-[#0fa968]" />
            <span className="text-base font-semibold text-[#36354c]">Incoming call</span>
            <span className="flex gap-1 items-center ml-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0fa968] animate-[dotBounce_1.4s_ease-in-out_infinite]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#0fa968] animate-[dotBounce_1.4s_ease-in-out_0.2s_infinite]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#0fa968] animate-[dotBounce_1.4s_ease-in-out_0.4s_infinite]" />
            </span>
          </div>
          <svg className="h-9 w-9 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke={timerColors.track} strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke={timerColors.stroke}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - ratio)}
              className="transition-[stroke-dashoffset] duration-1000 ease-linear"
            />
          </svg>
        </div>

        {/* Profile Banner */}
        <div className="bg-[#f3f7ff] py-3 px-6 flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
            <FemaleAvatar />
          </div>
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-xl font-semibold text-[#36354c] tracking-[-0.1px]">Pooja Arora</h2>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4 text-[#5b5675]" />
                <span className="text-sm text-[#5b5675]">Existing Customer</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4 text-[#5b5675]" />
                <span className="text-sm text-[#5b5675]">English</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call Context */}
        <div className="px-6 pt-4 pb-0 bg-white">
          <div className="flex items-center gap-1 mb-3">
            <ClipboardList className="h-5 w-5 text-[#5b5675]" />
            <span className="text-sm font-medium text-[#5b5675]">Call Context</span>
          </div>
          <div className="rounded-xl border border-[#e7e7f0] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#5b5675] opacity-80">Interested in</span>
              <span className="text-sm font-medium text-[#040222] text-right">ACKO_Platinum Lite</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#5b5675] opacity-80">Plan Type</span>
              <span className="text-sm font-medium text-[#040222] text-right">Family floater (10L cover)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#5b5675] opacity-80">Last activity</span>
              <div className="bg-[#f8f7fc] px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <Headset className="h-4 w-4 text-[#36354c]" />
                <span className="text-xs font-medium text-[#36354c]">Smitha</span>
              </div>
            </div>

            {/* Previous Summary */}
            <div className="bg-[#f8f7fc] rounded-xl p-3 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#7c47e1]" />
                <span className="text-sm text-[#36354c]">Previous Summary:</span>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#36354c] mt-2 shrink-0" />
                  <span className="text-sm text-[#36354c]">
                    Customer asked for comparison between HDFC Ergo and Platinum Lite
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#36354c] mt-2 shrink-0" />
                  <span className="text-sm text-[#36354c]">
                    Mentioned to discuss with Husband and make decision.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 pb-4 pt-4 bg-white">
          <Button
            className="w-full rounded-xl h-12 text-sm font-medium gap-2 bg-[#0fa968] hover:bg-[#0d945c] text-white"
            onClick={() => {
              onOpenChange(false);
              navigate("/crm2", { state: { customer: "pooja" } });
            }}
          >
            <Phone className="h-4 w-4" />
            Answer Call
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncomingCallModal2;
