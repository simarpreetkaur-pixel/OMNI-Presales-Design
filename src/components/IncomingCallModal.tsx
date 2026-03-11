import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PhoneIncoming, PhoneCall, Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import profileIcon from "@/assets/profile-icon.png";

interface IncomingCallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const IncomingCallModal = ({ open, onOpenChange }: IncomingCallModalProps) => {
  const [isRinging, setIsRinging] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setIsRinging(true);
      return;
    }
  }, [open]);

  const handleAnswerCall = () => {
    setIsRinging(false);
    onOpenChange(false);
    navigate("/crm", { state: { customer: "pooja" } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden border-border shadow-xl rounded-[20px]">
        <DialogTitle className="sr-only">Incoming Call</DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-center gap-2 py-4 border-b border-border bg-card">
          <PhoneIncoming className="h-4 w-4 text-muted-foreground" />
          <span className="text-base font-medium text-foreground">Incoming call</span>
          <span className="flex gap-1 items-center ml-1">
            <span className="h-2 w-2 rounded-full bg-onyx-400 animate-[dotBounce_1.4s_ease-in-out_infinite]" />
            <span className="h-2 w-2 rounded-full bg-onyx-400 animate-[dotBounce_1.4s_ease-in-out_0.2s_infinite]" />
            <span className="h-2 w-2 rounded-full bg-onyx-400 animate-[dotBounce_1.4s_ease-in-out_0.4s_infinite]" />
          </span>
        </div>

        {/* Customer Profile Card */}
        <div className="px-8 flex flex-col items-center gap-4 py-4 bg-green-100">
          <img src={profileIcon} alt="Profile" className="h-16 w-16 rounded-2xl" />
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">Pooja Arora</h2>
            <p className="text-base text-muted-foreground mt-1">Preferred Language: English</p>
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
        <div className="px-8 py-6 space-y-5 bg-card">
          {/* Interested In */}
          <div className="flex gap-4">
            <Car className="h-6 w-6 mt-0.5 shrink-0 text-onyx-500" />
            <div>
              <p className="text-sm font-medium text-onyx-500">Interested in:</p>
              <p className="text-base mt-1 text-onyx-800">
                ACKO Platinum Lite – family floater plan <span className="font-bold">10L cover</span>
              </p>
            </div>
          </div>

          <Separator className="bg-border" />

           {/* Last Activity */}
           <div className="flex gap-4">
             <PhoneCall className="h-5 w-5 mt-0.5 shrink-0 scale-110 text-onyx-500" />
             <div className="flex-1">
               <p className="text-sm font-medium text-onyx-500">Last Activity:</p>
              <p className="text-base mt-1 text-onyx-800">
                Discussed Zero Dep and RSA; customer mentioned he will discuss with his wife.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-8 pb-6 pt-1 bg-card">
          <Button
            size="lg"
            className="w-full rounded-2xl text-base font-medium bg-green-600 hover:bg-green-700 text-onyx-100"
            onClick={handleAnswerCall}>
            Answer Call
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IncomingCallModal;
