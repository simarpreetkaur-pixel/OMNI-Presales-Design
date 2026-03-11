import { ExternalLink, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentStatusWidget = () => {
  return (
    <div className="border border-border rounded-xl p-5 bg-card space-y-4 flex-1">
      <div>
        <p className="font-bold text-foreground">💳 Payment Status</p>
        <p className="text-sm text-muted-foreground">
          Current payment details for this policy
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm text-muted-foreground">Policy</span>
          <span className="text-sm font-semibold text-foreground text-right">
            Car Comprehensive – Honda Amaze 2025
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm text-muted-foreground">Premium</span>
          <span className="text-sm font-semibold text-foreground">₹8,450/yr</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-muted-foreground">Status</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-200 text-orange-800">
            Payment Pending
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm text-muted-foreground">Link sent via</span>
          <span className="text-sm font-semibold text-foreground">SMS · 28 Feb 2026</span>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm text-muted-foreground">Attempts</span>
          <span className="text-sm font-semibold text-foreground">2 (last: 1 Mar 2026)</span>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Button variant="outline" size="sm" className="gap-1.5 rounded-lg text-primary shadow-[inset_0_0_0_1px_hsl(var(--purple-400))]">
          <RotateCcw className="h-3.5 w-3.5" />
          Resend Link
        </Button>
        <Button size="sm" className="gap-1.5 rounded-lg">
          <ExternalLink className="h-3.5 w-3.5" />
          Generate New Link
        </Button>
      </div>
    </div>
  );
};

export default PaymentStatusWidget;
