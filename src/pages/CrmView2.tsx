import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Send,
  Smartphone,
  FileText,
  CreditCard,
  Building2,
  MapPin,
  ArrowRight,
  Plus,
  Scale,
  Stethoscope,
  CalendarDays,
  Clock,
  ChevronLeft,
  ChevronRight,
  Headset,
  Check,
  Sparkles,
} from "lucide-react";
import aiIcon from "@/assets/ai-icon.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import PredictiveCTABar from "@/components/PredictiveCTABar";
import PlanComparison from "@/components/PlanComparison";
import NetworkHospitalWidget from "@/components/NetworkHospitalWidget";
import PaymentStatusWidget from "@/components/PaymentStatusWidget";
import InclusionsExclusionsWidget from "@/components/InclusionsExclusionsWidget";
import QuickActionsDrawer, { type QuickAction } from "@/components/QuickActionsDrawer";
import QuoteBuilder from "@/components/QuoteBuilder";
import RescheduleCallModal from "@/components/RescheduleCallModal";
import OzontelPanel from "@/components/OzontelPanel";
import ackoFabIcon from "@/assets/acko-fab-icon.png";

const aiSuggestions = [
  "Understand the customer's request with clarity",
  "Give clear, confidence-building next steps",
];

const phase1CTAs = ["Resume Quote", "Check Payment Status", "Network Hospitals"];
const phase1PooJaCTAs = ["Compare Plans", "Check Nearby Hospitals", "Inclusions & Exclusions"];
const phase2CTAs = ["Resume Quote", "Compare Plans", "Inclusions & Exclusions", "Check Payment Status"];

const phase1QuickActions: QuickAction[] = [
  { label: "Create Quote", icon: FileText },
  { label: "Compare Plans", icon: Scale },
  { label: "Check Payment Status", icon: CreditCard },
  { label: "Pre-existing diseases", icon: Stethoscope },
];

const phase2QuickActions: QuickAction[] = [
  { label: "Compare Plans", icon: Scale },
  { label: "Check Payment Status", icon: CreditCard },
  { label: "Inclusions & Exclusions", icon: FileText },
  { label: "Network Hospital", icon: Building2 },
  { label: "Garage Locator", icon: MapPin },
  { label: "Create Quote", icon: FileText },
  { label: "Pre-existing diseases", icon: Stethoscope },
];

const phase1CtaResponses: Record<string, string[]> = {
  "Check Payment Status": [
    "Policy: Car Comprehensive – Honda Amaze 2025",
    "Premium: ₹8,450/yr · Status: Payment pending",
    "Link sent via SMS on 28 Feb 2026",
    "Retry payment or generate a fresh link from Quote Creator",
  ],
  "Compare Plans": [
    "ACKO Platinum: ₹8,450/yr – 2-hr cashless, zero paperwork, unlimited restoration",
    "HDFC Ergo Optima: ₹9,200/yr – 6-hr settlement, 100% restoration",
    "Star Comprehensive: ₹9,500/yr – single AC room, no consumables cover",
    "ACKO has the fastest claim settlement and best value",
  ],
  "Inclusions & Exclusions": [
    "Covered: Own damage, third-party, fire, theft, natural calamities",
    "Excluded: Wear & tear, mechanical breakdown, drunk driving",
    "Add Zero Depreciation to cover full part cost",
  ],
};

const phase2CtaResponses: Record<string, string[]> = {};

const phase1SmartResponses: { keywords: string[]; response: string[] }[] = [
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

const phase2SmartResponses: { keywords: string[]; response: string[] }[] = [
  {
    keywords: ["hospital", "nearby hospital"],
    response: [],
  },
  {
    keywords: ["quote", "premium", "price", "cost"],
    response: [
      "Honda Amaze 2025 – Comprehensive Plan",
      "IDV: ₹6,25,000 · Premium: ₹8,450/yr (20% NCB applied)",
      "Base premium: ₹7,250 + Zero Dep ₹1,200 = ₹8,450",
      "Add-ons available: RSA (₹499), Engine Protection (₹899), Return to Invoice (₹750)",
      "Payment link ready to generate – confirm add-on selection",
    ],
  },
  {
    keywords: ["claim", "claims", "settlement"],
    response: [
      "ACKO claim settlement: avg 2 hours for cashless, 48 hours for reimbursement",
      "98.5% claim settlement ratio (FY25) – industry best",
      "100% digital process: submit via app, track in real time",
      "Zero paperwork for cashless claims at 14,000+ network garages",
      "Dedicated claim manager assigned within 15 minutes",
    ],
  },
  {
    keywords: ["payment", "pay", "status"],
    response: [],
  },
  {
    keywords: ["garage", "repair", "workshop"],
    response: [
      "14,000+ network garages pan-India",
      "Nearest authorised garages for 560001:",
      "Bimal Auto, Koramangala – 1.2 km · Maruti authorised · 4.5★",
      "Kalyani Motors, Indiranagar – 3.5 km · Multi-brand · 4.3★",
      "All cashless-enabled – no out-of-pocket expense",
      "Avg repair turnaround: 3-5 working days",
    ],
  },
  {
    keywords: ["inclusion", "exclusion", "covered", "not covered"],
    response: [],
  },
  {
    keywords: ["add-on", "addon", "add on", "coverage", "cover"],
    response: [
      "Available add-ons for Honda Amaze 2025 Comprehensive:",
      "Zero Depreciation – ₹1,200/yr · full part value on claims (recommended)",
      "Roadside Assistance – ₹499/yr · 24/7 towing, flat tyre, battery jump",
      "Engine Protection – ₹899/yr · covers hydrostatic lock & water damage",
      "Return to Invoice – ₹750/yr · full invoice value on total loss/theft",
      "Consumables Cover – ₹350/yr · covers oil, coolant, nuts & bolts",
    ],
  },
];

const widgetCTAs = new Set([
  "Compare Plans",
  "Check Payment Status",
  "Inclusions & Exclusions",
  "Network Hospital",
]);

function getSmartResponse(message: string, currentPhase: "phase1" | "phase2"): string[] {
  const lower = message.toLowerCase();
  const responses = currentPhase === "phase1" ? phase1SmartResponses : phase2SmartResponses;
  for (const entry of responses) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      if (entry.response.length === 0) return [];
      return entry.response;
    }
  }
  return currentPhase === "phase2"
    ? [
        "Let me look into that for you.",
        "I'm pulling up the relevant information – one moment.",
      ]
    : ["I'll look into that for you. Let me check the details."];
}

function getWidgetForSmartResponse(
  message: string
): React.ReactNode | null {
  const lower = message.toLowerCase();
  if (lower.includes("hospital") || lower.includes("nearby hospital")) {
    return <NetworkHospitalWidget />;
  }
  if (lower.includes("payment") || lower.includes("pay") || lower.includes("status")) {
    return <PaymentStatusWidget />;
  }
  if (lower.includes("inclusion") || lower.includes("exclusion") || lower.includes("covered")) {
    return <InclusionsExclusionsWidget />;
  }
  return null;
}

const powerTools = [
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
  const [phase, setPhase] = useState<"phase1" | "phase2">("phase1");
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [ctasVisible, setCtasVisible] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [nudgeRead, setNudgeRead] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [quoteBuilderOpen, setQuoteBuilderOpen] = useState(false);
  const [leftPaneCollapsed, setLeftPaneCollapsed] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [ozontelOpen, setOzontelOpen] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<{ date: string; time: string } | null>(null);
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
  }, [chatMessages, isAiTyping, ctasVisible, scrollToBottom]);

  useEffect(() => {
    setChatMessages([]);
    setCtasVisible(false);
    setIsAiTyping(false);
    setInputValue("");
  }, [phase]);

  // Staggered Phase I opening sections
  useEffect(() => {
    if (phase !== "phase1") {
      setCtasVisible(true);
      return;
    }
    setCtasVisible(false);
    const t = setTimeout(() => setCtasVisible(true), 500);
    return () => clearTimeout(t);
  }, [phase, isPooja]);

  const handleQuickAction = (label: string) => {
    setQuickActionsOpen(false);
    setInputValue("");
    if ((label === "Create Quote" || label === "Resume Quote") && phase === "phase2") {
      setQuoteBuilderOpen(true);
      return;
    }
    handleCtaSelect(label);
  };

  const handleCtaSelect = (cta: string) => {
    if (cta === "Lead-360" || cta === "Network Hospitals" || cta === "Check Nearby Hospitals") {
      window.open("/lead-360", "_blank");
      return;
    }

    if (cta === "Resume Quote" && phase === "phase1") {
      window.open("/lead-360", "_blank");
      return;
    }

    if (cta === "Check Payment Status" && phase === "phase1") {
      window.open("/lead-360", "_blank");
      return;
    }

    if ((cta === "Create Quote" || cta === "Resume Quote") && phase === "phase2") {
      setQuoteBuilderOpen(true);
      return;
    }

    if (phase === "phase1") {
      setCtasVisible(false);
      setChatMessages((prev) => [...prev, { role: "agent", content: [cta] }]);
      setIsAiTyping(true);
      scrollToBottom();

      setTimeout(() => {
        if (cta === "Compare Plans") {
          setChatMessages((prev) => [...prev, { role: "ai", content: [], component: <PlanComparison /> }]);
        } else if (cta === "Inclusions & Exclusions") {
          setChatMessages((prev) => [...prev, { role: "ai", content: [], component: <InclusionsExclusionsWidget /> }]);
        } else {
          const response = phase1CtaResponses[cta] || getSmartResponse(cta, "phase1");
          setChatMessages((prev) => [...prev, { role: "ai", content: response }]);
        }
        setIsAiTyping(false);
        scrollToBottom();
        setTimeout(() => { setCtasVisible(true); scrollToBottom(); }, 1000);
      }, 1200);
      return;
    }

    setCtasVisible(false);
    setChatMessages((prev) => [...prev, { role: "agent", content: [cta] }]);
    setIsAiTyping(true);
    scrollToBottom();

    setTimeout(() => {
      const ctaWidgets: Record<string, React.ReactNode> = {
        "Compare Plans": <PlanComparison />,
        "Check Payment Status": <PaymentStatusWidget />,
        "Inclusions & Exclusions": <InclusionsExclusionsWidget />,
        "Network Hospital": <NetworkHospitalWidget />,
      };

      if (ctaWidgets[cta]) {
        setChatMessages((prev) => [
          ...prev,
          { role: "ai", content: [], component: ctaWidgets[cta] },
        ]);
      } else {
        const response = phase2CtaResponses[cta] || getSmartResponse(cta, "phase2");
        setChatMessages((prev) => [...prev, { role: "ai", content: response }]);
      }
      setIsAiTyping(false);
      scrollToBottom();
      setTimeout(() => { setCtasVisible(true); scrollToBottom(); }, 1000);
    }, 1200);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const msg = inputValue.trim();
    setInputValue("");
    setCtasVisible(false);
    setChatMessages((prev) => [...prev, { role: "agent", content: [msg] }]);
    setIsAiTyping(true);
    scrollToBottom();

    setTimeout(() => {
      if (phase === "phase2") {
        const widget = getWidgetForSmartResponse(msg);
        const textResponse = getSmartResponse(msg, "phase2");
        if (widget) {
          if (textResponse.length > 0) {
            setChatMessages((prev) => [
              ...prev,
              { role: "ai", content: textResponse },
            ]);
            setTimeout(() => {
              setChatMessages((prev) => [
                ...prev,
                { role: "ai", content: [], component: widget },
              ]);
              scrollToBottom();
            }, 300);
          } else {
            setChatMessages((prev) => [
              ...prev,
              { role: "ai", content: [], component: widget },
            ]);
          }
        } else {
          setChatMessages((prev) => [
            ...prev,
            { role: "ai", content: textResponse },
          ]);
        }
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: "ai", content: getSmartResponse(msg, "phase1") },
        ]);
      }
      setIsAiTyping(false);
      scrollToBottom();
      setTimeout(() => { setCtasVisible(true); scrollToBottom(); }, 1000);
    }, 1200);
  };

  const handlePowerToolClick = (tool: string) => {
    window.open("/lead-360", "_blank");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <header className="h-[72px] border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <img
            src="https://pub-c050457d48794d5bb9ffc2b4649de2c1.r2.dev/ACKO%20logo%20primary%20Light%20BG.svg"
            alt="ACKO"
            className="h-8"
          />
          <div className="h-5 w-px bg-onyx-300" />
          <span className="text-foreground tracking-tight text-lg font-medium">
            OMNI Pre-sales
          </span>
          <Select value={phase} onValueChange={(v) => setPhase(v as "phase1" | "phase2")}>
            <SelectTrigger className="w-[130px] h-9 rounded-lg border-onyx-300 text-sm font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="phase1">Phase I</SelectItem>
              <SelectItem value="phase2">Phase II</SelectItem>
            </SelectContent>
          </Select>
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
        phase === "phase1"
          ? "grid-cols-[328px_1fr_260px]"
          : quoteBuilderOpen
            ? leftPaneCollapsed
              ? "grid-cols-[0px_1fr_420px]"
              : "grid-cols-[280px_1fr_420px]"
            : leftPaneCollapsed
              ? "grid-cols-[0px_1fr]"
              : "grid-cols-[320px_1fr]"
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
                    {isPooja ? "Pooja Arora" : "Rajesh Kumar"}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-normal shrink-0" style={{ color: "#5B5675" }}>Language</span>
                  <span className="text-sm font-medium text-right" style={{ color: "#36354C" }}>
                    Hindi
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-normal shrink-0" style={{ color: "#5B5675" }}>State</span>
                  <span className="text-sm font-medium text-right" style={{ color: "#36354C" }}>
                    {isPooja ? "Delhi" : "Karnataka"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-normal shrink-0" style={{ color: "#5B5675" }}>Customer type</span>
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                    isPooja
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-green-50 text-green-700 border border-green-200"
                  )}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", isPooja ? "bg-blue-500" : "bg-green-500")} />
                    {isPooja ? "New" : "Existing"}
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
                      Honda Amaze 2025
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
                  onClick={() => {
                    if (phase === "phase2") {
                      setQuoteBuilderOpen(true);
                    } else {
                      window.open("/lead-360", "_blank");
                    }
                  }}
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
                  <span className="text-xs text-muted-foreground shrink-0">{isPooja ? "Feb 07 2026" : "Feb 10 2026"}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {isPooja ? "Family Floater · 10L Cover" : "Honda Amaze 2025"}
                </p>
                <button
                  onClick={() => phase === "phase2" ? setQuoteBuilderOpen(true) : window.open("/lead-360", "_blank")}
                  className="flex items-center gap-1 text-sm font-medium text-primary mt-1 hover:underline"
                >
                  Resume Quote
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

        </aside>

        {/* Left pane collapse toggle (Phase II only) */}
        {phase === "phase2" && (
          <button
            onClick={() => setLeftPaneCollapsed((prev) => !prev)}
            style={{
              left: leftPaneCollapsed
                ? 0
                : quoteBuilderOpen ? 280 : 320,
            }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 h-6 w-6 rounded-full border border-border bg-card shadow-md flex items-center justify-center transition-all duration-300"
          >
            {leftPaneCollapsed
              ? <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              : <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />}
          </button>
        )}

        {/* Center Pane -- AI Chat */}
        <main className="flex-1 flex flex-col bg-muted overflow-hidden">
          <ScrollArea className="flex-1 px-6 py-6" ref={scrollRef}>
            <div className="space-y-6">

              {/* Phase II: Agent's next best action */}
              {phase === "phase2" && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full shrink-0 mt-1 overflow-hidden">
                    <img src={aiIcon} alt="AI" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 bg-card border border-border rounded-2xl p-5 shadow-sm">
                    <p className="text-sm font-semibold text-foreground mb-2">
                      Agent&apos;s next best action:
                    </p>
                    <div className="space-y-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-2.5">
                          <span className="text-muted-foreground mt-1.5 text-[6px]">●</span>
                          <p className="text-base text-foreground leading-relaxed">
                            {suggestion}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Phase I: Nudge card (always visible until marked as read) */}
              {phase === "phase1" && !nudgeRead && (
                <div
                  className="rounded-2xl p-[2px] shrink-0"
                  style={{
                    background: "linear-gradient(to right, rgba(9,48,101,0.6) 0%, rgba(19,105,235,0.6) 27.5%, rgba(250,197,21,0.6) 60%, rgba(134,203,60,0.6) 100%)",
                  }}
                >
                  <div className="bg-white rounded-2xl p-4 space-y-3">
                    {/* Header row */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {isPooja ? "AI Summary:" : "Conversation cues:"}
                      </span>
                      <button
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setNudgeRead(true)}
                      >
                        <Check className="h-3 w-3" />
                        MARK AS READ
                      </button>
                    </div>
                    {/* Cue pills — Rajesh (original) and Rajesh 2 only */}
                    {!isPooja && (
                      <div className="flex flex-wrap gap-2">
                        {["ACKO customer since 4 years", "Bike Policy currently active"].map((cue) => (
                          <span
                            key={cue}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border"
                            style={{ backgroundColor: "#F0FDF4", borderColor: "#BBF7D0", color: "#15803D" }}
                          >
                            {cue}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* AI Summary — Rajesh 2 and Pooja only */}
                    {(isRajesh2 || isPooja) && (
                      <div className="pt-0.5 space-y-1.5">
                        {!isPooja && (
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                            <span className="text-sm font-medium text-foreground">AI Summary:</span>
                          </div>
                        )}
                        {(isPooja ? [
                          "Customer asked for comparison between HDFC Ergo and Platinum Lite",
                          "Mentioned to discuss with Husband and make decision.",
                        ] : [
                          "Discussed RSA and Zero Dep",
                          "Will discuss with wife and finalise",
                        ]).map((point, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="mt-1.5 text-[5px] shrink-0" style={{ color: "#5B5675" }}>●</span>
                            <p className="text-sm font-normal leading-relaxed" style={{ color: "#5B5675" }}>{point}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
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

              {/* Predictive CTAs */}
              {phase === "phase2" && ctasVisible && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full shrink-0 mt-1 overflow-hidden">
                    <img
                      src={aiIcon}
                      alt="AI"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <PredictiveCTABar
                    ctas={phase === "phase1" ? (isPooja ? phase1PooJaCTAs : phase1CTAs) : phase2CTAs}
                    onSelect={handleCtaSelect}
                  />
                </div>
              )}

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
              {phase === "phase2" && (
                <QuickActionsDrawer
                  actions={phase2QuickActions}
                  filterText={inputValue}
                  onSelect={handleQuickAction}
                  visible={quickActionsOpen}
                />
              )}
              <div className="relative">
                <Input
                  placeholder="Ask any question..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setQuickActionsOpen(false);
                      handleSendMessage();
                    }
                  }}
                  onFocus={() => { if (phase === "phase2") setQuickActionsOpen(true); }}
                  onBlur={() => {
                    if (phase === "phase2") setTimeout(() => setQuickActionsOpen(false), 150);
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
        </main>

        {/* Right Pane -- Power Tools (Phase I only) */}
        {phase === "phase1" && (
          <aside className="bg-card border-l border-border flex flex-col overflow-y-auto">
            <div className="p-5 space-y-3">
              <p className="text-xs font-bold tracking-wide uppercase text-primary px-1">
                Power Tools
              </p>
              <div className="space-y-1.5">
                {powerTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.label}
                      onClick={() => handlePowerToolClick(tool.label)}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl border border-onyx-300 bg-card hover:bg-purple-200 cursor-pointer transition-colors text-left"
                    >
                      <div className="h-9 w-9 rounded-lg bg-purple-200 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {tool.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        )}

        {/* Quote Builder Pane (Phase II inline) */}
        {phase === "phase2" && (
          <QuoteBuilder
            open={quoteBuilderOpen}
            onOpenChange={setQuoteBuilderOpen}
            inline
          />
        )}
      </div>

      {/* Floating Call Actions */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="rounded-2xl shadow-lg h-14 w-14 border border-onyx-300"
          onClick={() => setRescheduleOpen(true)}
        >
          <CalendarDays className="h-5 w-5" />
        </Button>
        <button
          className="h-14 w-14 rounded-2xl shadow-lg p-0 overflow-hidden"
          onClick={() => setOzontelOpen((prev) => !prev)}
        >
          <img src={ackoFabIcon} alt="Ozontel" className="h-full w-full rounded-2xl" />
        </button>
      </div>

      {ozontelOpen && (
        <OzontelPanel
          customer={isPooja ? "pooja" : isRajesh2 ? "rajesh2" : "rajesh"}
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
                    Call with <span className="font-semibold">{isPooja ? "Pooja Arora" : "Rajesh Kumar"}</span> has ended. Disposition will be done automatically.
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
        onConfirm={(date, time) => setScheduledTime({ date, time })}
      />

    </div>
  );
};

export default CrmView2;
