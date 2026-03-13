import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, ClipboardList, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NotInterestedChecklistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
  customerName?: string;
  product?: string;
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
  product = "Car Insurance",
}: NotInterestedChecklistModalProps) => {
  const [checked, setChecked] = useState<boolean[]>(new Array(questions.length).fill(false));

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const allChecked = checked.every(Boolean);
  const checkedCount = checked.filter(Boolean).length;

  const handleConfirm = () => {
    toast(
      <div className="relative flex items-center gap-3 pr-6">
        <button
          onClick={() => toast.dismiss()}
          className="absolute top-0 right-0 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <div className="h-5 w-5 animate-scale-in">
          <CheckCircle2 className="h-5 w-5 text-success" />
        </div>
        <p className="text-sm">Disposition for {customerName} will be complete automatically</p>
      </div>,
      { duration: 3000, position: "bottom-right" }
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden rounded-[20px] border-border shadow-xl [&>button:last-child]:hidden">
        <DialogTitle className="sr-only">Not Interested Checklist</DialogTitle>

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border bg-card">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Button>
          <div className="h-11 w-11 rounded-full flex items-center justify-center shrink-0 bg-cerise-100">
            <ClipboardList className="h-5 w-5 text-cerise-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-foreground">
              Disposition Checklist
            </h2>
            <p className="text-sm text-muted-foreground">
              {customerName} · {product}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-lg"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        <Separator className="bg-border" />

        {/* Content */}
        <div className="px-6 py-6 space-y-3 bg-white">
          <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground" style={{ letterSpacing: '0.5px' }}>
            Ensure you've asked these questions
          </p>

          <div className="space-y-3">
            {questions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => toggle(index)}
                className={cn(
                  "w-full flex items-start gap-4 p-4 h-auto rounded-2xl text-left justify-start",
                  checked[index]
                    ? "border-border bg-card"
                    : "border-border bg-card hover:border-purple-400"
                )}
              >
                <div className="mt-0.5 shrink-0">
                  <Checkbox
                    checked={checked[index]}
                    onCheckedChange={() => toggle(index)}
                    className={cn(
                      "h-5 w-5 rounded-md",
                      checked[index] && "bg-primary border-primary text-primary-foreground"
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium transition-colors whitespace-normal",
                    checked[index] ? "text-muted-foreground line-through" : "text-foreground"
                  )}>
                    {question}
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6 pt-3 space-y-4 bg-white">
          <Button
            className="w-full rounded-2xl gap-2"
            size="lg"
            
            onClick={handleConfirm}
          >
            <ClipboardList className="h-5 w-5" />
            Mark as Not Interested
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotInterestedChecklistModal;
