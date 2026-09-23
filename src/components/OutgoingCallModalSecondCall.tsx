import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, UserRound, Globe, Award, ClipboardList, CalendarDays, Sparkles } from "lucide-react";
import RescheduleCallModal from "@/components/RescheduleCallModal";
import NotInterestedChecklistModal from "@/components/NotInterestedChecklistModal";
import DNDConfirmModal from "@/components/DNDConfirmModal";
import {
  SAMPADA_LAST_CALL_SUMMARY_BULLETS,
  SAMPADA_LAST_CALL_SUMMARY_LABEL,
} from "@/data/sampadaSecondCall";

interface OutgoingCallModalSecondCallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OutgoingCallModalSecondCall = ({ open, onOpenChange }: OutgoingCallModalSecondCallProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showNotInterested, setShowNotInterested] = useState(false);
  const [showDNDConfirm, setShowDNDConfirm] = useState(false);
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
        <DialogContent className="w-full max-w-md p-0 gap-0 overflow-hidden border-border shadow-xl rounded-[24px] [&>button:last-child]:hidden">
          <DialogTitle className="sr-only">2nd call – Sampada Tambolkar</DialogTitle>

          <div className="flex h-12 shrink-0 items-center justify-start gap-2 px-5 border-b border-[#f0f0f6] bg-white">
            {!isConnected ? (
              <>
                <Phone className="h-5 w-5 text-[#36354c]" />
                <span className="text-base font-semibold text-[#36354c]">Outgoing call</span>
                <span className="flex gap-1 items-center ml-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#040222] animate-[dotBounce_1.4s_ease-in-out_infinite] opacity-40" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#040222] animate-[dotBounce_1.4s_ease-in-out_0.2s_infinite] opacity-40" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#040222] animate-[dotBounce_1.4s_ease-in-out_0.4s_infinite] opacity-40" />
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

          <div className="bg-[#f3f7ff] py-3 px-6 flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <UserRound className="h-8 w-8 text-[#36354c]" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <h2 className="text-xl font-semibold text-[#36354c] tracking-[-0.1px]">Sampada Tambolkar</h2>
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-[#5b5675]" />
                  <span className="text-sm text-[#5b5675]">New customer</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4 text-[#5b5675]" />
                  <span className="text-sm text-[#5b5675]">English</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pt-4 pb-0 bg-white">
            <div className="flex items-center gap-1 mb-3">
              <ClipboardList className="h-5 w-5 text-[#5b5675]" />
              <span className="text-sm font-medium text-[#5b5675]">Call Context</span>
            </div>
            <div className="rounded-xl border border-[#e7e7f0] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#5b5675] opacity-80">Call type</span>
                <Badge className="bg-[#e3fafc] text-[#0895aa] hover:bg-[#e3fafc] border-0 px-2 py-0.5 rounded-md font-medium text-xs">
                  Fresh lead
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#5b5675] opacity-80">Vehicle</span>
                <span className="text-sm font-medium text-[#040222] text-right">Kia Sonet 2024</span>
              </div>

              <div className="bg-[#f8f7fc] rounded-xl p-3 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#7c47e1]" />
                  <span className="text-sm font-small text-[#36354c]">{SAMPADA_LAST_CALL_SUMMARY_LABEL}:</span>
                </div>
                <div className="space-y-2">
                  {SAMPADA_LAST_CALL_SUMMARY_BULLETS.map((bullet) => (
                    <div key={bullet} className="flex gap-2">
                      <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#36354c]" />
                      <span className="text-sm text-[#36354c]">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-4 pt-4 flex items-center gap-3 bg-white">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl h-12 w-12 text-[#7c47e1] border-[#b191ed] bg-white hover:bg-gray-50 shrink-0"
              disabled={!isConnected}
              onClick={() => { setShowReschedule(true); onOpenChange(false); }}>
              <CalendarDays className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="rounded-xl h-12 flex-1 text-sm font-medium text-[#7c47e1] border-[#b191ed] bg-white hover:bg-gray-50"
              disabled={!isConnected}
              onClick={() => { setShowNotInterested(true); onOpenChange(false); }}>
              Not Interested
            </Button>
            <Button
              className="rounded-xl h-12 flex-1 text-sm font-medium bg-[#7c47e1] border-[#7c47e1] hover:bg-[#5920c5] text-white"
              disabled={!isConnected}
              onClick={() => { onOpenChange(false); navigate("/crm2", { state: { customer: "second-call" } }); }}>
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <RescheduleCallModal
        open={showReschedule}
        onOpenChange={setShowReschedule}
        customerName="Sampada Tambolkar"
        product="Car_Comprehensive"
        onBack={() => { setShowReschedule(false); onOpenChange(true); }} />

      <NotInterestedChecklistModal
        open={showNotInterested}
        onOpenChange={setShowNotInterested}
        customerName="Sampada Tambolkar"
        onBack={() => { setShowNotInterested(false); onOpenChange(true); }}
        onEnableDND={() => setShowDNDConfirm(true)} />

      <DNDConfirmModal
        open={showDNDConfirm}
        onOpenChange={setShowDNDConfirm}
        customerName="Sampada Tambolkar"
        onBack={() => { setShowDNDConfirm(false); setShowNotInterested(true); }} />
    </>
  );
};

export default OutgoingCallModalSecondCall;
