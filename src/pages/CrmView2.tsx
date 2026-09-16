import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Send,
  FileText,
  CreditCard,
  Building2,
  MapPin,
  ArrowRight,
  Plus,
  CalendarDays,
  Check,
  Wrench,
} from "lucide-react";
import aiIcon from "@/assets/ai-icon.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import RescheduleCallModal from "@/components/RescheduleCallModal";
import OzontelPanel from "@/components/OzontelPanel";
import ackoFabIcon from "@/assets/acko-fab-icon.png";
import LeadSummary from "@/components/LeadSummary";

const smartResponses: { keywords: string[]; response: string[] }[] = [
  {
    keywords: ["hospital", "nearby hospital"],
    response: [
      "Manipal Hospital, Old Airport Rd – 2.3 km",
      "Apollo Hospital, Bannerghatta Rd – 4.1 km",
      "Fortis Hospital, Cunningham Rd – 5.8 km",
      "All cashless-enabled under ACKO network",
    ],
  },
  {
    keywords: ["quote", "premium", "price", "cost"],
    response: [
      "Honda Amaze 2025 – Comprehensive Plan",
      "IDV: ₹6,25,000 · Premium: ₹8,450/yr",
      "Add-ons: Zero Depreciation (₹1,200), RSA (₹499)",
      "Ready to generate final quote – confirm add-ons",
    ],
  },
  {
    keywords: ["claim", "claims", "settlement"],
    response: [
      "ACKO avg claim settlement: 2 hours (cashless)",
      "98.5% claim settlement ratio (FY25)",
      "No paperwork – 100% digital process via app",
    ],
  },
  {
    keywords: ["payment", "pay", "status"],
    response: [
      "Payment link sent via SMS on 28 Feb 2026",
      "Status: Pending · Amount: ₹8,450",
      "Retry or generate fresh link from Quote Creator",
    ],
  },
  {
    keywords: ["garage", "repair", "workshop"],
    response: [
      "Authorised garages near 560001:",
      "Bimal Auto – 1.2 km · Maruti authorised",
      "Kalyani Motors – 3.5 km · Multi-brand",
      "All cashless-enabled under ACKO network",
    ],
  },
  {
    keywords: ["engine protection", "engine cover"],
    response: [
      "ACKO Comprehensive covers engine damage caused by accidents.",
      "For flood/water damage, the Engine Protection add-on (₹899/yr) is needed.",
      "It covers hydrostatic lock and lubricant leakage from accident damage.",
      "Strongly recommended for Bangalore given frequent waterlogging.",
    ],
  },
  {
    keywords: ["premium is high", "high premium", "too expensive", "costly"],
    response: [
      "Acknowledge: 'I understand ₹8,450 may seem high upfront.'",
      "Reframe: It's only ₹23/day for full protection on a ₹6.25L car.",
      "Highlight: Zero paperwork, 2-hr cashless settlement, 98.5% claim ratio.",
      "Option: Base plan at ₹7,250/yr (without add-ons) if budget is tight.",
    ],
  },
  {
    keywords: ["add-ons", "add on", "addon", "what add-on", "suggest for this customer"],
    response: [
      "Recommended for Rajesh Kumar (Honda Amaze 2025, Bangalore):",
      "Zero Depreciation – ₹1,200/yr · Full part value on claims (must-have for new car)",
      "Engine Protection – ₹899/yr · Critical given Bangalore waterlogging risk",
      "Roadside Assistance – ₹499/yr · 24/7 towing, battery jump, flat tyre",
      "Return to Invoice – ₹750/yr · Full invoice value on total loss or theft",
    ],
  },
];

function getSmartResponse(message: string): string[] {
  const lower = message.toLowerCase();
  for (const entry of smartResponses) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      if (entry.response.length === 0) return [];
      return entry.response;
    }
  }
  return ["I'll look into that for you. Let me check the details."];
}

type RightTool = "Quote Creator" | "Payment Status" | "Network Hospital" | "Garage Locator";

const powerTools: { label: RightTool; icon: typeof FileText }[] = [
  { label: "Quote Creator", icon: FileText },
  { label: "Payment Status", icon: CreditCard },
  { label: "Network Hospital", icon: Building2 },
  { label: "Garage Locator", icon: MapPin },
];

type ChatMessage = {
  role: "agent" | "ai";
  content: string[];
  component?: React.ReactNode;
};

const CrmView2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const customer = (location.state as { customer?: string } | null)?.customer;
  const isPooja = customer === "pooja";
  const isRajesh2 = customer === "rajesh2";
  const isFirstCall = customer === "first-call";
  const isSecondCall = customer === "second-call";
  const isThirdCall = customer === "third-call";
  const isFourthCall = customer === "fourth-call";
  const isFifthCall = customer === "fifth-call";
  const customerName = isPooja
    ? "Pooja Arora"
    : isFirstCall || isSecondCall || isThirdCall || isFourthCall || isFifthCall
      ? "Sampada Tambolkar"
      : "Rajesh Kumar";
  const isSampada = isFirstCall || isSecondCall || isThirdCall || isFourthCall || isFifthCall;
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [nudgeRead] = useState(false);
  const [rightPanelExpanded, setRightPanelExpanded] = useState(true);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [ozontelOpen, setOzontelOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      const viewport = scrollRef.current?.querySelector<HTMLElement>(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }, 50);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isAiTyping, scrollToBottom]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const msg = inputValue.trim();
    setInputValue("");

    setChatMessages((prev) => [...prev, { role: "agent", content: [msg] }]);
    setIsAiTyping(true);
    scrollToBottom();

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", content: getSmartResponse(msg) },
      ]);
      setIsAiTyping(false);
      scrollToBottom();
    }, 1200);
  };

  const handlePowerToolClick = (_tool: string) => {
    window.open("/lead-360", "_blank");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-onyx-300 bg-card px-6">
        <div className="flex items-center gap-4">
          <img
            src="https://pub-c050457d48794d5bb9ffc2b4649de2c1.r2.dev/ACKO%20logo%20primary%20Light%20BG.svg"
            alt="ACKO"
            className="h-8 w-auto"
          />
          <div className="h-6 w-px shrink-0 bg-onyx-300" aria-hidden />
          <span className="text-base font-semibold tracking-tight text-onyx-800">
            OMNI Pre-sales
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-200">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600" />
            </span>
            <span className="text-xs font-semibold text-green-800">On Call</span>
          </div>
        </div>
      </header>

      {/* Three-Pane Layout */}
      <div className={cn(
        "flex-1 grid overflow-hidden transition-all duration-300 relative",
        rightPanelExpanded
          ? "grid-cols-[328px_1fr_260px_63px]"
          : "grid-cols-[328px_1fr_63px]"
      )}>
        {/* Left Pane -- Customer Data */}
        <aside className="relative bg-card shadow-[2px_0_12px_rgba(0,0,0,0.06)] z-10 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
            {/* Container 1: Customer Details */}
            <div className="rounded-xl border border-onyx-300 p-4 space-y-3">
              <p className="text-xs font-semibold tracking-wide text-[#5B5675] uppercase">
                Customer Details
              </p>
              <div className="h-px bg-border" />
              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-normal shrink-0" style={{ color: "#5B5675" }}>Name</span>
                  <span className="text-sm font-medium text-right" style={{ color: "#36354C" }}>
                    {customerName}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-normal shrink-0" style={{ color: "#5B5675" }}>Language</span>
                  <span className="text-sm font-medium text-right" style={{ color: "#36354C" }}>
                    {isSampada ? "English" : "Hindi"}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-normal shrink-0" style={{ color: "#5B5675" }}>State</span>
                  <span className="text-sm font-medium text-right" style={{ color: "#36354C" }}>
                    {isPooja ? "Delhi" : isSampada ? "Maharashtra" : "Karnataka"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-normal shrink-0" style={{ color: "#5B5675" }}>Customer type</span>
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                    isPooja || isSampada
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-green-50 text-green-700 border border-green-200"
                  )}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", isPooja || isSampada ? "bg-blue-500" : "bg-green-500")} />
                    {isPooja || isSampada ? "New" : "Existing"}
                  </span>
                </div>
              </div>
            </div>

            {/* Container 2: Call Context */}
            <div className="rounded-xl border border-onyx-300 p-4 space-y-3">
              <p className="text-xs font-semibold tracking-wide text-[#5B5675] uppercase">
                Call Context
              </p>
              <div className="h-px bg-border" />
              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-normal shrink-0" style={{ color: "#5B5675" }}>Interested in</span>
                  <span className="text-sm font-medium text-right" style={{ color: "#36354C" }}>
                    {isPooja ? "Health Insurance" : "Car_Comprehensive"}
                  </span>
                </div>
                {isPooja ? (
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-normal shrink-0" style={{ color: "#5B5675" }}>Plan</span>
                    <span className="text-sm font-medium text-right break-words min-w-0" style={{ color: "#36354C" }}>
                      ACKO Platinum Lite
                    </span>
                  </div>
                ) : (
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-normal shrink-0" style={{ color: "#5B5675" }}>Vehicle</span>
                    <span className="text-sm font-medium text-right break-words min-w-0" style={{ color: "#36354C" }}>
                      {isSampada ? "Kia Sonet 2024" : "Honda Amaze 2025"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Container 3: Ongoing Quote + Create New Quote */}
            <div className="rounded-xl border border-onyx-300 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-wide text-[#5B5675] uppercase">
                  Ongoing Quote
                </p>
                <button
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  onClick={() => window.open("/lead-360", "_blank")}
                >
                  <Plus className="h-3 w-3" />
                  Create New
                </button>
              </div>
              <div className="h-px bg-border" />
              <div className="rounded-lg p-4 space-y-1" style={{ backgroundColor: "rgba(239, 233, 251, 0.6)" }}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base font-medium truncate" style={{ color: "#36354C" }}>
                    {isPooja ? "Platinum Lite Plan" : "Zero Dep Plan"}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {isPooja ? "Feb 07 2026" : isSampada ? "Aug 23 2026" : "Feb 10 2026"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {isPooja
                    ? "Family Floater · 10L Cover"
                    : isFifthCall
                      ? "Kia Sonet · ₹22,250"
                      : isFourthCall
                      ? "Kia Sonet · ₹14,530"
                      : isThirdCall
                      ? "Kia Sonet · ₹17,145"
                      : isSecondCall
                        ? "Kia Sonet · ₹6,025"
                        : isFirstCall
                          ? "Kia Sonet 2024"
                          : "Honda Amaze 2025"}
                </p>
                <button
                  onClick={() => window.open("/lead-360", "_blank")}
                  className="flex items-center gap-1 text-sm font-medium text-primary mt-1 hover:underline"
                >
                  Resume Quote
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

        </aside>

        {/* Center Pane -- AI Chat */}
        <main className="flex-1 flex flex-col bg-muted overflow-hidden">
          <ScrollArea className="flex-1 px-6 py-6" ref={scrollRef}>
            <div className="space-y-6">

              {!nudgeRead && (
                <LeadSummary
                  variant={
                    isFirstCall
                      ? "first-call"
                      : isSecondCall
                        ? "second-call"
                        : isThirdCall
                          ? "third-call"
                          : isFourthCall
                            ? "fourth-call"
                            : isFifthCall
                              ? "fifth-call"
                              : "default"
                  }
                />
              )}

              {/* Chat Messages */}
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex items-start gap-3",
                    msg.role === "agent" && "justify-end"
                  )}
                >
                  {msg.role === "ai" && (
                    <div className="h-8 w-8 rounded-full shrink-0 mt-1 overflow-hidden">
                      <img
                        src={aiIcon}
                        alt="AI"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  {msg.component ? (
                    <div className="max-w-full animate-cta-fade-in">
                      {msg.component}
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-[14px] shadow-sm max-w-[75%] animate-cta-fade-in",
                        msg.role === "agent"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border"
                      )}
                    >
                      <div className="space-y-2">
                        {msg.content.length === 1 ? (
                          <p className={cn(
                            "text-base leading-relaxed",
                            msg.role === "ai" && "text-foreground"
                          )}>
                            {msg.content[0]}
                          </p>
                        ) : (
                          <ul className={cn(
                            "space-y-1 text-base leading-relaxed list-disc list-inside",
                            msg.role === "ai" && "text-foreground"
                          )}>
                            {msg.content.map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* AI Typing Indicator */}
              {isAiTyping && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full shrink-0 mt-1 overflow-hidden">
                    <img
                      src={aiIcon}
                      alt="AI"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="bg-card border border-border rounded-2xl px-5 py-4 shadow-sm">
                    <div className="flex gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full bg-muted-foreground animate-[dotBounce_1.4s_infinite_ease-in-out]"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="h-2 w-2 rounded-full bg-muted-foreground animate-[dotBounce_1.4s_infinite_ease-in-out]"
                        style={{ animationDelay: "200ms" }}
                      />
                      <span
                        className="h-2 w-2 rounded-full bg-muted-foreground animate-[dotBounce_1.4s_infinite_ease-in-out]"
                        style={{ animationDelay: "400ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Sticky Input Bar */}
          <div className="px-6 py-4 bg-muted">
            <div className="max-w-2xl mx-auto">
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Ask any question..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                    className="pr-12 rounded-xl text-sm placeholder:text-sm shadow-sm"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#E7E7F0" }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSendMessage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary hover:bg-transparent active:bg-transparent active:scale-100"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Power Tools expanded list */}
        {rightPanelExpanded && (
          <aside className="bg-white shadow-[-2px_0_4px_rgba(0,0,0,0.09)] z-[1] flex flex-col overflow-y-auto">
            <div className="p-6 w-full">
              <div className="flex flex-col gap-3 w-full">
                {powerTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.label}
                      type="button"
                      onClick={() => handlePowerToolClick(tool.label)}
                      className="w-full flex items-center gap-4 px-4 py-3 rounded-xl border border-[rgba(208,189,244,0.6)] bg-white shadow-[0_1px_3px_rgba(54,53,76,0.06)] hover:bg-[#f8f7fc] cursor-pointer transition-colors text-left"
                    >
                      <div className="size-10 rounded-lg bg-[#efe9fb] flex items-center justify-center shrink-0">
                        <Icon className="size-6 text-[#7c47e1]" strokeWidth={1.75} />
                      </div>
                      <span className="text-sm font-medium text-[#36354c] leading-5">
                        {tool.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        )}

        {/* Right strip */}
        <aside
          role="button"
          tabIndex={0}
          aria-expanded={rightPanelExpanded}
          aria-label={rightPanelExpanded ? "Collapse Power tools" : "Expand Power tools"}
          onClick={() => setRightPanelExpanded((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setRightPanelExpanded((prev) => !prev);
            }
          }}
          className="group relative z-[2] w-[63px] min-w-[63px] bg-white border-l border-[#e7e7f0] shadow-none flex flex-col items-center pt-4 gap-1.5 cursor-pointer select-none"
        >
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-lg shrink-0 transition-colors duration-150",
              rightPanelExpanded
                ? "bg-[#f8f7fc]"
                : "bg-transparent group-hover:bg-[#f8f7fc]"
            )}
          >
            <Wrench
              className={cn(
                "size-5 text-[#5b5675] transition-[fill] duration-150",
                rightPanelExpanded
                  ? "fill-[#5b5675]"
                  : "fill-transparent group-hover:fill-[#5b5675]"
              )}
              strokeWidth={1.75}
            />
          </div>
          <span className="mt-1 text-[10px] font-medium leading-[1.3] text-[#5b5675] text-center w-[39px]">
            Power tools
          </span>
        </aside>
      </div>

      {/* Floating Call Actions */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
        <button
          className="h-14 w-14 rounded-2xl shadow-lg p-0 overflow-hidden"
          onClick={() => setOzontelOpen((prev) => !prev)}
        >
          <img src={ackoFabIcon} alt="Ozontel" className="h-full w-full rounded-2xl" />
        </button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-2xl shadow-lg h-14 w-14 border border-onyx-300"
          onClick={() => setRescheduleOpen(true)}
        >
          <CalendarDays className="h-5 w-5" />
        </Button>
      </div>

      {ozontelOpen && (
        <OzontelPanel
          customer={isPooja ? "pooja" : isSampada ? "sampada" : isRajesh2 ? "rajesh2" : "rajesh"}
          onEndCall={() => {
            setOzontelOpen(false);
            navigate("/");
            setTimeout(() => {
              toast(
                <div className="flex items-stretch gap-0">
                  <div className="flex items-center pr-4 shrink-0">
                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <p className="text-sm flex-1 pr-4">
                    Call with <span className="font-semibold">{customerName}</span> has ended. Disposition will be done automatically.
                  </p>
                  <div className="w-px bg-border shrink-0" />
                  <div className="flex flex-col shrink-0 pl-4">
                    <button
                      className="text-sm font-medium text-primary hover:underline py-1"
                      onClick={() => { toast.dismiss(); }}
                    >
                      Dismiss
                    </button>
                    <div className="h-px bg-border" />
                    <button
                      className="text-sm font-medium text-primary hover:underline py-1"
                      onClick={() => { toast.dismiss(); navigate("/", { state: { confirmCallback: true } }); }}
                    >
                      Call back
                    </button>
                  </div>
                </div>,
                { duration: 4000, position: "bottom-right" }
              );
            }, 100);
          }}
        />
      )}

      <RescheduleCallModal
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        onBack={() => setRescheduleOpen(false)}
      />

    </div>
  );
};

export default CrmView2;
