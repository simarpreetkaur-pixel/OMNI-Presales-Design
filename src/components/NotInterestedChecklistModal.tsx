import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, ClipboardList, CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NotInterestedChecklistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
  customerName?: string;
  product?: string;
  onEnableDND?: () => void;
}

const questions = [
  "Do you currently have a Car Insurance?",
  "When is your policy expiring?",
  "What matters to you when choosing an insurance policy? Price, Claim service or coverage?",
];

const NotInterestedChecklistModal = ({
  open,
  onOpenChange,
  onBack,
  customerName = "Rajesh Kumar",
  product = "Car_Comprehensive",
  onEnableDND,
}: NotInterestedChecklistModalProps) => {
  const [checked, setChecked] = useState<boolean[]>(new Array(questions.length).fill(false));

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleMarkNotInterested = () => {
    toast(
      <div className="relative flex items-center gap-3 pr-6">
        <button
          onClick={() => toast.dismiss()}
          className="absolute top-0 right-0 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
        <p className="text-sm">Disposition for {customerName} will be complete automatically</p>
      </div>,
      { duration: 3000, position: "bottom-right" }
    );
    onOpenChange(false);
  };

  const handleEnableDND = () => {
    onOpenChange(false);
    onEnableDND?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[552px] p-0 gap-0 overflow-hidden rounded-[24px] border-border shadow-xl [&>button:last-child]:hidden">
        <DialogTitle className="sr-only">Disposition checklist</DialogTitle>

        {/* Header */}
        <div className="flex items-start gap-5 px-5 py-4 border-b border-[#f0f0f6] bg-white">
          <button
            onClick={onBack}
            className="mt-0.5 shrink-0 text-[#36354c] hover:text-[#040222] transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex items-start gap-2">
            <div className="bg-[#efe9fb] p-1 rounded-[6px] shrink-0 mt-0.5">
              <ClipboardList className="h-6 w-6 text-[#7c47e1]" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[18px] font-semibold leading-6 text-[#36354c]">
                Disposition checklist
              </span>
              <span className="text-[16px] font-normal leading-6 text-[#5b5675]">
                {customerName} • {product}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-5 pb-0 bg-white">
          <p className="text-[16px] font-normal text-[#5b5675] mb-3">
            Ensure you've asked these questions
          </p>
          <div className="flex flex-col gap-3">
            {questions.map((question, index) => (
              <button
                key={index}
                onClick={() => toggle(index)}
                className={cn(
                  "w-full flex items-start gap-[10px] p-5 rounded-[12px] border text-left transition-colors",
                  checked[index]
                    ? "border-[#b191ed] bg-[#efe9fb]"
                    : "border-[#e7e7f0] bg-white hover:border-[#b191ed]/60"
                )}
              >
                <Checkbox
                  checked={checked[index]}
                  onCheckedChange={() => toggle(index)}
                  className={cn(
                    "mt-0.5 h-5 w-5 rounded-[4px] shrink-0",
                    checked[index] && "bg-[#7c47e1] border-[#7c47e1]"
                  )}
                />
                <p className={cn(
                  "text-[16px] font-medium leading-6 transition-colors",
                  checked[index] ? "text-[#5b5675]" : "text-[#36354c]"
                )}>
                  {question}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="px-[64px] py-6 flex flex-col items-center gap-4 bg-white">
          <Button
            className="w-full h-14 rounded-[16px] text-[16px] font-medium bg-[#7c47e1] hover:bg-[#5920c5] text-white"
            onClick={handleMarkNotInterested}
          >
            Mark as not interested
          </Button>
          <button
            onClick={handleEnableDND}
            className="text-[14px] font-medium text-[#5b5675] underline underline-offset-2 decoration-dotted hover:text-[#36354c] transition-colors"
          >
            Mark as not interested & Enable DND
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotInterestedChecklistModal;
