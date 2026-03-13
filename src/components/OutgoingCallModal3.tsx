import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PhoneOutgoing, UserRound, Globe, MapPin, ClipboardList, CalendarDays, Sparkles, Headset } from "lucide-react";
import RescheduleCallModal from "@/components/RescheduleCallModal";
import NotInterestedChecklistModal from "@/components/NotInterestedChecklistModal";

interface OutgoingCallModal3Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OutgoingCallModal3 = ({ open, onOpenChange }: OutgoingCallModal3Props) => {
  const [isConnected, setIsConnected] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showNotInterested, setShowNotInterested] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setIsConnected(false);
      setTimer(0);
      return;
    }
    const connectTimeout = setTimeout(() => setIsConnected(true), 3000);
    return () => clearTimeout(connectTimeout);
  }, [open]);

  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isConnected]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[412px] p-0 gap-0 overflow-hidden border-border shadow-xl rounded-[20px]">
          <DialogTitle className="sr-only">Outgoing Call – Rajesh Kumar 2</DialogTitle>

          {/* Header */}
          <div className="flex items-center gap-2 px-6 py-3.5 border-b border-border bg-purple-100">
            {!isConnected ? (
              <>
                <PhoneOutgoing className="h-4 w-4 text-muted-foreground" />
                <span className="text-base font-medium text-foreground">Outgoing call</span>
                <span className="flex gap-1 items-center ml-1">
                  <span className="h-2 w-2 rounded-full bg-onyx-400 animate-[dotBounce_1.4s_ease-in-out_infinite]" />
                  <span className="h-2 w-2 rounded-full bg-onyx-400 animate-[dotBounce_1.4s_ease-in-out_0.2s_infinite]" />
                  <span className="h-2 w-2 rounded-full bg-onyx-400 animate-[dotBounce_1.4s_ease-in-out_0.4s_infinite]" />
                </span>
              </>
            ) : (
              <span className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                </span>
                <span className="text-sm font-semibold text-green-700">Connected: {formatTime(timer)}</span>
              </span>
            )}
          </div>

          {/* Profile Banner */}
          <div className="bg-purple-200 py-[18px] flex flex-col items-center gap-2">
            <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">
              <UserRound className="h-8 w-8 text-onyx-400" />
            </div>
            <p className="text-xl font-semibold text-foreground">Rajesh Kumar</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" />
                Hindi
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                Karnataka
              </span>
            </div>
          </div>

          {/* Call Context */}
          <div className="px-6 py-5 bg-card space-y-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Call Context</span>
            </div>
            <div className="rounded-xl border border-onyx-300 p-4 space-y-4">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm text-muted-foreground shrink-0">Interested in</span>
                <span className="text-sm font-semibold text-foreground text-right">Car_Comprehensive</span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm text-muted-foreground shrink-0">Vehicle</span>
                <span className="text-sm font-semibold text-foreground text-right">Honda Amaze 2025</span>
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
                  <li>Discussed RSA and Zero Dep</li>
                  <li>Will discuss with wife and finalise.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer CTAs */}
          <div className="px-6 pb-[17px] pt-0 flex items-center gap-3 bg-card">
            <Button
              variant="outline"
              size="icon"
              className="rounded-2xl h-12 w-12 text-primary shrink-0 shadow-[inset_0_0_0_1px_hsl(var(--purple-300))] bg-onyx-100"
              disabled={!isConnected}
              onClick={() => { setShowReschedule(true); onOpenChange(false); }}>
              <CalendarDays className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="rounded-2xl h-12 flex-1 text-sm font-medium shadow-[inset_0_0_0_1px_hsl(var(--purple-300))] bg-onyx-100"
              disabled={!isConnected}
              onClick={() => { setShowNotInterested(true); onOpenChange(false); }}>
              Not interested
            </Button>
            <Button
              className="rounded-2xl h-12 flex-1 text-sm font-medium"
              disabled={!isConnected}
              onClick={() => { onOpenChange(false); navigate("/crm2", { state: { customer: "rajesh2" } }); }}>
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <RescheduleCallModal
        open={showReschedule}
        onOpenChange={setShowReschedule}
        onBack={() => { setShowReschedule(false); onOpenChange(true); }} />

      <NotInterestedChecklistModal
        open={showNotInterested}
        onOpenChange={setShowNotInterested}
        onBack={() => { setShowNotInterested(false); onOpenChange(true); }} />
    </>
  );
};

export default OutgoingCallModal3;
