import { useState } from "react";
import { Mail, MessageCircle, Phone, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SendQuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  phone: string;
  onSent: () => void;
}

const CHANNELS = [
  { id: "email", label: "Email", icon: Mail },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "sms", label: "SMS", icon: Phone },
] as const;

const SendQuoteModal = ({ open, onOpenChange, email, phone, onSent }: SendQuoteModalProps) => {
  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(new Set(["email"]));
  const [customerEmail, setCustomerEmail] = useState(email);
  const [altEmails, setAltEmails] = useState<string[]>([]);
  const [customerPhone, setCustomerPhone] = useState(phone);
  const [altPhones, setAltPhones] = useState<string[]>([]);
  const { toast } = useToast();

  const toggleChannel = (id: string) => {
    setSelectedChannels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const showEmailSection = selectedChannels.has("email");
  const showPhoneSection = selectedChannels.has("sms") || selectedChannels.has("whatsapp");

  const handleSend = () => {
    toast({
      title: "Quote sent successfully",
      description: `Sent via ${[...selectedChannels].join(", ")} to the customer.`,
    });
    onSent();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] p-0 gap-0 overflow-hidden border-border shadow-xl rounded-[20px] [&>button:last-child]:hidden">
        <DialogTitle className="sr-only">Send Quote</DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <p className="text-lg font-bold text-foreground">Send Quote</p>
          <button
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-onyx-200 transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 bg-card">
          {/* Send via */}
          <div className="rounded-xl border-2 border-dashed border-onyx-300 p-4 space-y-3">
            <p className="text-sm font-semibold text-foreground">Send via:</p>
            {CHANNELS.map((ch) => {
              const Icon = ch.icon;
              const checked = selectedChannels.has(ch.id);
              return (
                <div key={ch.id} className="flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggleChannel(ch.id)}
                      className={cn(
                        "h-5 w-5 rounded-md border-2",
                        checked
                          ? "border-green-600 bg-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                          : "border-purple-400"
                      )}
                    />
                    <Icon className="h-4.5 w-4.5 text-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {ch.label}
                    </span>
                  </label>
                  {ch.id === "email" && checked && (
                    <span className="text-xs text-muted-foreground bg-onyx-200 px-2.5 py-1 rounded-md">
                      {customerEmail}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Customer Email -- only when Email is selected */}
          {showEmailSection && (
            <>
              <div className="space-y-1.5">
                <p className="text-xs font-bold tracking-wide text-primary uppercase">
                  CUSTOMER EMAIL
                </p>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="pl-10 bg-onyx-200 border-onyx-300"
                  />
                </div>
              </div>

              {altEmails.map((ae, i) => (
                <div key={`email-${i}`} className="space-y-1.5">
                  <p className="text-xs font-bold tracking-wide text-primary uppercase">
                    ALTERNATIVE EMAIL {i + 1}
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={ae}
                        onChange={(e) =>
                          setAltEmails((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))
                        }
                        className="pl-10 bg-onyx-200 border-onyx-300"
                        placeholder="email@example.com"
                      />
                    </div>
                    <button
                      onClick={() => setAltEmails((prev) => prev.filter((_, j) => j !== i))}
                      className="h-12 w-12 shrink-0 rounded-[10px] flex items-center justify-center text-cerise-600 hover:bg-cerise-100 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setAltEmails((prev) => [...prev, ""])}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-onyx-300 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Alternative Email
              </button>
            </>
          )}

          {/* Customer Phone -- only when SMS or WhatsApp is selected */}
          {showPhoneSection && (
            <>
              <div className="space-y-1.5">
                <p className="text-xs font-bold tracking-wide text-primary uppercase">
                  CUSTOMER PHONE
                </p>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="pl-10 bg-onyx-200 border-onyx-300"
                  />
                </div>
              </div>

              {altPhones.map((ap, i) => (
                <div key={`phone-${i}`} className="space-y-1.5">
                  <p className="text-xs font-bold tracking-wide text-primary uppercase">
                    ALTERNATIVE NUMBER {i + 1}
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        value={ap}
                        onChange={(e) =>
                          setAltPhones((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))
                        }
                        className="pl-10 bg-onyx-200 border-onyx-300"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <button
                      onClick={() => setAltPhones((prev) => prev.filter((_, j) => j !== i))}
                      className="h-12 w-12 shrink-0 rounded-[10px] flex items-center justify-center text-cerise-600 hover:bg-cerise-100 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setAltPhones((prev) => [...prev, ""])}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-onyx-300 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Alternative Number
              </button>
            </>
          )}

          {/* Send Button */}
          <Button
            className="w-full rounded-xl h-12 text-sm font-bold tracking-wide"
            onClick={handleSend}
            disabled={selectedChannels.size === 0}
          >
            SEND QUOTE
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendQuoteModal;
