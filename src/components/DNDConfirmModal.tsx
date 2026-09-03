import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface DNDConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
  customerName?: string;
}

const DNDConfirmModal = ({
  open,
  onOpenChange,
  onBack,
  customerName = "Rajesh Kumar",
}: DNDConfirmModalProps) => {
  const handleConfirm = () => {
    toast(
      <div className="relative flex items-center gap-3 pr-6">
        <button
          onClick={() => toast.dismiss()}
          className="absolute top-0 right-0 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
        <p className="text-sm">DND enabled for {customerName}. They will not be contacted again.</p>
      </div>,
      { duration: 4000, position: "bottom-right" }
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[540px] p-6 gap-0 rounded-[20px] border-border shadow-xl [&>button:last-child]:hidden">
        <DialogTitle className="sr-only">Enable DND for this customer?</DialogTitle>

        {/* Icon + Text */}
        <div className="flex flex-col items-center gap-2 mb-5">
          {/* Warning icon — triangle with red tint matching Figma */}
          <div className="flex items-center justify-center w-[72px] h-[72px] rounded-full bg-[#fef3f2] mb-1">
            <AlertTriangle className="h-9 w-9 text-[#e53935]" strokeWidth={1.5} />
          </div>
          <h2 className="text-[18px] font-semibold leading-6 text-[#121212] text-center">
            Enable DND for this customer?
          </h2>
          <p className="text-[14px] font-normal leading-5 text-[#5b5675] text-center max-w-[410px]">
            Only enable DND if customer asks to not be contacted again. Once marked, DND cannot be
            reversed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4">
          <Button
            className="w-full h-14 rounded-[16px] text-[14px] font-medium bg-[#7c47e1] hover:bg-[#5920c5] text-white"
            onClick={handleConfirm}
          >
            Yes, continue
          </Button>
          <button
            onClick={onBack}
            className="text-[14px] font-medium text-[#5b5675] underline underline-offset-2 decoration-dotted hover:text-[#36354c] transition-colors"
          >
            Go back
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DNDConfirmModal;
