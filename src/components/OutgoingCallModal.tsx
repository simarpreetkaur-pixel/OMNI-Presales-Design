import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PhoneOutgoing, Car, PhoneCall, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import profileIcon from "@/assets/profile-icon.png";
import RescheduleCallModal from "@/components/RescheduleCallModal";
import NotInterestedChecklistModal from "@/components/NotInterestedChecklistModal";

interface OutgoingCallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OutgoingCallModal = ({ open, onOpenChange }: OutgoingCallModalProps) => {
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

    const connectTimeout = setTimeout(() => {
      setIsConnected(true);
    }, 3000);

    return () => clearTimeout(connectTimeout);
  }, [open]);

  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

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
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden border-border shadow-xl rounded-[20px]">
        <DialogTitle className="sr-only">Outgoing Call</DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-center gap-2 py-4 border-b border-border bg-card">
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
              <span className="text-sm font-semibold text-green-700 timer">Connected: {formatTime(timer)}</span>
            </span>
          )}
        </div>

        {/* Customer Profile Card */}
        <div className="px-8 flex flex-col items-center gap-4 py-4 bg-blue-100">
          <img src={profileIcon} alt="Profile" className="h-16 w-16 rounded-2xl" />
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">Rajesh Kumar</h2>
            <p className="text-muted-foreground mt-1 text-sm">Preferred Language: Hindi</p>
          </div>
          <div className="flex gap-3 -mt-1">
            <Badge
              variant="outline"
              size="lg"
              className="rounded-lg border-orange-300 text-orange-700 bg-orange-100">
              <span className="h-2 w-2 rounded-full bg-warning" />
              Intent: Very High
            </Badge>
            <Badge
              variant="outline"
              size="lg"
              className="rounded-lg border-blue-300 text-blue-700 bg-blue-100">
              <span className="h-2 w-2 rounded-full bg-info" />
              Existing Customer
            </Badge>
          </div>
        </div>

        {/* Details Section */}
        <div className="px-5 py-6 space-y-5 bg-card">
          {/* Interested In */}
          <div className="flex gap-4">
            <Car className="h-6 w-6 mt-0.5 shrink-0 text-onyx-500" />
            <div>
              <p className="text-sm font-medium text-onyx-500">Interested in:</p>
              <p className="text-base mt-1 font-normal text-onyx-800">
                Car Insurance _Comprehensive for <span className="font-bold">Honda Amaze 2025 model</span>
              </p>
            </div>
          </div>

          <Separator className="bg-border" />

           {/* Last Activity */}
           <div className="flex gap-4">
             <PhoneCall className="h-5 w-5 mt-0.5 shrink-0 scale-110 text-onyx-500" />
             <div className="flex-1">
               <p className="text-sm font-medium text-onyx-500">Last Activity:</p>
              <p className="text-base mt-1 font-normal text-onyx-800">
                Discussed Zero Dep and RSA; customer mentioned he will discuss with his wife.
              </p>
            </div>
          </div>
        </div>

        {/* CTAs */}
         <div className="px-8 pb-6 pt-1 flex items-center gap-3 bg-card">
           <Button
              variant="outline"
              size="icon"
              className="rounded-2xl h-[54px] w-14 text-primary shrink-0 shadow-[inset_0_0_0_1px_hsl(var(--purple-300))] bg-onyx-100"
              disabled={!isConnected}
              onClick={() => {setShowReschedule(true);onOpenChange(false);}}>
             <CalendarDays className="h-6 w-6" />
           </Button>
           <Button
              variant="outline"
              className="rounded-2xl h-[54px] flex-1 text-base font-medium shadow-[inset_0_0_0_1px_hsl(var(--purple-300))] bg-onyx-100"
              disabled={!isConnected}
              onClick={() => {setShowNotInterested(true);onOpenChange(false);}}>
             Not interested
           </Button>
           <Button
              className="rounded-2xl h-[54px] flex-1 text-base font-medium"
              disabled={!isConnected}
              onClick={() => {onOpenChange(false);navigate("/crm", { state: { customer: "rajesh" } });}}>
             Continue
           </Button>
         </div>
      </DialogContent>
    </Dialog>
      <RescheduleCallModal
        open={showReschedule}
        onOpenChange={setShowReschedule}
        onBack={() => {setShowReschedule(false);onOpenChange(true);}} />
      
      <NotInterestedChecklistModal
        open={showNotInterested}
        onOpenChange={setShowNotInterested}
        onBack={() => {setShowNotInterested(false);onOpenChange(true);}} />
      
    </>);

};

export default OutgoingCallModal;
