import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Send,
  Smartphone,
  FileText,
  CreditCard,
  Building2,
  MapPin,
  Scale,
  Stethoscope,
  CalendarDays,
  Clock,
  ChevronLeft,
  ChevronRight,
  Headset,
  Check,
  Sparkles,
  Wrench,
  Infinity as InfinityIcon,
  ChevronDown,
  Radio,
  Bot,
} from "lucide-react";
import aiIcon from "@/assets/ai-icon.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import PredictiveCTABar from "@/components/PredictiveCTABar";
import PlanComparison from "@/components/PlanComparison";
import NetworkHospitalWidget from "@/components/NetworkHospitalWidget";
import PaymentStatusWidget from "@/components/PaymentStatusWidget";
import InclusionsExclusionsWidget from "@/components/InclusionsExclusionsWidget";
import QuickActionsDrawer, { type QuickAction } from "@/components/QuickActionsDrawer";
import QuoteBuilder, { type QuoteFormData } from "@/components/QuoteBuilder";
import RescheduleCallModal, { type ReschedulePreset } from "@/components/RescheduleCallModal";
import OzontelPanel from "@/components/OzontelPanel";
import Phase3NextBestActions, {
  AgentStepCard,
  FAMILY_FLOATER_QUOTE_DATA,
  Phase3ListeningPanel,
  usePhase3Agent,
  type AgentStep,
} from "@/components/Phase3AgentFeed";
import Phase3CallCaptionRibbon from "@/components/Phase3CallCaptionRibbon";
import ackoFabIcon from "@/assets/acko-fab-icon.png";
import AppHeader from "@/components/AppHeader";

type Phase3Mode = "listen" | "agent";

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
  // Version-1 uses the main branch's original CRM workspace without exposing phase controls.
  const phase = "phase1" as const;
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [ctasVisible, setCtasVisible] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [nudgeRead, setNudgeRead] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [leftPaneCollapsed, setLeftPaneCollapsed] = useState(false);
  const [rightPanelExpanded, setRightPanelExpanded] = useState(true);
  /** Phase II/III: which right-rail tool is open; null = panel closed */
  const [activeRightTool, setActiveRightTool] = useState<RightTool | null>(null);
  const isToolPhase = phase === "phase2" || phase === "phase3";
  const quoteBuilderOpen = isToolPhase && activeRightTool === "Quote Creator";
  const toolPanelOpen = isToolPhase && activeRightTool !== null;
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [reschedulePreset, setReschedulePreset] = useState<ReschedulePreset | null>(null);
  const [quoteAgentData, setQuoteAgentData] = useState<QuoteFormData | null>(null);
  const [quoteAgentAutoFill, setQuoteAgentAutoFill] = useState(false);
  const [quoteAgentStep, setQuoteAgentStep] = useState(0);
  const [ozontelOpen, setOzontelOpen] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<{ date: string; time: string } | null>(null);
  const [phase3Mode, setPhase3Mode] = useState<Phase3Mode>("listen");
  const [manualAction, setManualAction] = useState<AgentStep | null>(null);
  const [phase3Captures, setPhase3Captures] = useState<string[]>([]);
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

  const phase3Tools = {
    onCreateQuote: (data: QuoteFormData) => {
      // Open prefilled Quote Creator — agent does not auto-send
      setQuoteAgentData(data);
      setQuoteAgentAutoFill(false);
      setQuoteAgentStep(3);
      setActiveRightTool("Quote Creator");
    },
    onScheduleFollowUp: (preset: ReschedulePreset) => {
      setReschedulePreset(preset);
      setRescheduleOpen(true);
    },
    onShareBrochure: () => {
      toast.success("Waiting-period FAQ + brochure sent on WhatsApp (…4321)", {
        duration: 3000,
        position: "bottom-right",
      });
    },
    onQuoteToolDone: () => {},
    onScheduleToolDone: (date: string, time: string) => {
      setScheduledTime({ date, time });
    },
  };

  const listeningEnabled = phase === "phase3" && phase3Mode === "listen";
  const phase3 = usePhase3Agent(listeningEnabled, phase3Tools, scrollToBottom);

  const setPhase3ModeSafe = useCallback(
    (mode: Phase3Mode) => {
      if (mode === phase3Mode) return;
      if (mode === "agent") {
        // Leave live listening — AI only acts on typed requests
        if (
          phase3.runState === "running" ||
          phase3.runState === "awaiting_approval" ||
          phase3.runState === "listening"
        ) {
          phase3.stop();
        }
        setManualAction(null);
        setPhase3Captures([]);
      }
      setPhase3Mode(mode);
      scrollToBottom();
    },
    [phase3, phase3Mode, scrollToBottom]
  );

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isAiTyping, ctasVisible, phase3.steps, phase3.runState, phase3Captures, scrollToBottom]);

  useEffect(() => {
    setChatMessages([]);
    setCtasVisible(false);
    setIsAiTyping(false);
    setInputValue("");
    setActiveRightTool(null);
    setQuoteAgentData(null);
    setQuoteAgentAutoFill(false);
    setQuoteAgentStep(0);
    setReschedulePreset(null);
    setScheduledTime(null);
    setPhase3Mode("listen");
    setManualAction(null);
    setPhase3Captures([]);
    if (phase === "phase3") {
      setLeftPaneCollapsed(false);
    }
  }, [phase]);

  const setQuoteBuilderOpen = useCallback((open: boolean) => {
    setActiveRightTool(open ? "Quote Creator" : null);
    if (!open) {
      setQuoteAgentAutoFill(false);
      setQuoteAgentData(null);
      setQuoteAgentStep(0);
    }
  }, []);

  // Staggered Phase I opening sections
  useEffect(() => {
    if (phase === "phase3") {
      setCtasVisible(false);
      return;
    }
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

    // Typing interrupts captions only (NBA can stay visible)
    if (
      phase === "phase3" &&
      phase3Mode === "listen" &&
      phase3.runState !== "stopped" &&
      phase3.runState !== "idle"
    ) {
      phase3.stop();
    }

    setChatMessages((prev) => [...prev, { role: "agent", content: [msg] }]);
    setIsAiTyping(true);
    scrollToBottom();

    setTimeout(() => {
      if (phase === "phase3") {
        const lower = msg.toLowerCase();

        if (phase3Mode === "agent") {
          // Agent mode: no call listening — only act on what the CX agent types
          if (lower.includes("quote") || lower.includes("floater")) {
            setManualAction({
              id: `manual_quote_${Date.now()}`,
              kind: "action",
              title: "Create Family Floater quote",
              detail:
                "Fill Quote Creator from abandoned checkout and share on WhatsApp (…4321) + email.",
              meta: [
                "Plan: Family Floater · ACKO Platinum",
                "Members: Self (Rajesh) + Mother (Sushila Devi, 62)",
              ],
              actionId: "create_quote",
              icon: "quote",
              status: "awaiting",
            });
            setChatMessages((prev) => [
              ...prev,
              {
                role: "ai",
                content: [
                  "I can draft the Family Floater quote from the abandoned checkout. Tap View to open Quote Creator — you send it yourself.",
                ],
              },
            ]);
          } else if (lower.includes("schedule") || lower.includes("follow") || lower.includes("callback")) {
            setManualAction({
              id: `manual_sched_${Date.now()}`,
              kind: "action",
              title: "Schedule follow-up for tomorrow, 11:00 AM",
              detail: "Book callback in CRM for Rajesh Kumar.",
              meta: ["Date: Tomorrow", "Time: 11:00 AM", "Language: Hindi"],
              actionId: "schedule_followup",
              icon: "calendar",
              status: "awaiting",
            });
            setChatMessages((prev) => [
              ...prev,
              {
                role: "ai",
                content: [
                  "I can schedule the follow-up for tomorrow at 11:00 AM. Approve below to open the calendar tool.",
                ],
              },
            ]);
          } else if (lower.includes("listen") || lower.includes("switch")) {
            setPhase3ModeSafe("listen");
            setChatMessages((prev) => [
              ...prev,
              {
                role: "ai",
                content: [
                  "Switched to Listen mode — I'll start monitoring the live call and propose actions again.",
                ],
              },
            ]);
          } else {
            setChatMessages((prev) => [
              ...prev,
              {
                role: "ai",
                content: [
                  "I'm in Agent mode — not listening to the call. Tell me what to do (e.g. “create quote” or “schedule follow-up”), or switch to Listen from the mode menu.",
                ],
              },
            ]);
          }
        } else {
          let reply =
            "Paused. I stopped the current agent run. Hit Resume on the timeline to keep listening, or tell me what to do next.";
          if (lower.includes("resume") || lower.includes("continue") || lower.includes("keep going")) {
            reply = "Resuming live assist — I'll keep listening and propose the next action.";
            phase3.resume();
          } else if (lower.includes("quote")) {
            reply =
              "Got it. Approve “Create Family Floater quote” on the timeline when you're ready, or say Resume to continue from the call.";
          } else if (lower.includes("schedule") || lower.includes("follow")) {
            reply =
              "Okay. When the follow-up step appears, Approve to book it — or Resume listening if I haven't proposed it yet.";
          } else if (lower.includes("stop") || lower.includes("cancel")) {
            reply = "Stopped. Agent is idle — type Resume or press Resume on the timeline to continue.";
          } else if (lower.includes("agent") || lower.includes("manual")) {
            setPhase3ModeSafe("agent");
            reply =
              "Switched to Agent mode. I won't listen to the call — only act when you type a request.";
          }
          setChatMessages((prev) => [
            ...prev,
            { role: "ai", content: [reply] },
          ]);
        }
      } else if (phase === "phase2") {
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

  const handlePowerToolClick = (_tool: string) => {
    window.open("/lead-360", "_blank");
  };

  const handleRightToolClick = (tool: RightTool) => {
    setActiveRightTool((prev) => (prev === tool ? null : tool));
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <AppHeader
        right={
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-200">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600" />
            </span>
            <span className="text-xs font-semibold text-green-800">On Call</span>
          </div>
        }
      />

      {/* Phase III only — live call captions (closed-caption style) */}
      {phase === "phase3" && phase3Mode === "listen" && (
        <Phase3CallCaptionRibbon
          enabled
          paused={phase3.runState === "stopped"}
          onCapture={(chip) => {
            setPhase3Captures((prev) => (prev.includes(chip) ? prev : [...prev, chip]));
          }}
          onMilestone={(m) => {
            if (m === "quote") phase3.offerAction("quote");
            if (m === "schedule") phase3.offerAction("schedule");
            if (m === "end") phase3.markCallEnded();
          }}
        />
      )}

      {/* Three-Pane Layout */}
      <div className={cn(
        "flex-1 grid overflow-hidden transition-all duration-300 relative",
        phase === "phase1"
          ? rightPanelExpanded
            ? "grid-cols-[328px_1fr_260px_63px]"
            : "grid-cols-[328px_1fr_63px]"
          : quoteBuilderOpen
            ? leftPaneCollapsed
              ? "grid-cols-[0px_1fr_420px_63px]"
              : "grid-cols-[280px_1fr_420px_63px]"
            : toolPanelOpen
              ? leftPaneCollapsed
                ? "grid-cols-[0px_1fr_260px_63px]"
                : "grid-cols-[320px_1fr_260px_63px]"
              : leftPaneCollapsed
                ? "grid-cols-[0px_1fr_63px]"
                : "grid-cols-[320px_1fr_63px]"
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
                    {phase === "phase3"
                      ? "Family Floater Health"
                      : isPooja
                        ? "Health Insurance"
                        : "Car_Comprehensive"}
                  </span>
                </div>
                {phase === "phase3" ? (
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-normal shrink-0" style={{ color: "#5B5675" }}>Plan</span>
                    <span className="text-sm font-medium text-right break-words min-w-0" style={{ color: "#36354C" }}>
                      Family Floater · ACKO Platinum
                    </span>
                  </div>
                ) : isPooja ? (
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
          </div>

        </aside>

        {/* Left pane collapse toggle (Phase II / III) */}
        {isToolPhase && (
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

        {/* Center Pane -- AI Chat / Phase III agent feed */}
        <main className="flex-1 flex flex-col bg-muted overflow-hidden">
          <ScrollArea className="flex-1 px-6 py-6" ref={scrollRef}>
            <div className="space-y-6">

              {/* Phase III: next-best-action only (captions live in the top ribbon) */}
              {phase === "phase3" && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full shrink-0 mt-1 overflow-hidden">
                    <img src={aiIcon} alt="AI" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-3">
                    {phase3Mode === "listen" ? (
                      <>
                        <Phase3ListeningPanel captures={phase3Captures} />
                        {phase3.runState === "stopped" && (
                          <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-3.5 py-2.5 flex items-center justify-between gap-3">
                            <p className="text-sm text-foreground">
                              Captions paused — call assist is waiting on you.
                            </p>
                            <button
                              type="button"
                              onClick={() => phase3.resume()}
                              className="text-sm font-semibold text-primary hover:underline shrink-0"
                            >
                              Continue listening
                            </button>
                          </div>
                        )}
                        <Phase3NextBestActions
                          steps={phase3.steps}
                          onApprove={phase3.approve}
                          onReject={phase3.reject}
                        />
                      </>
                    ) : (
                      <>
                        <div className="bg-card border border-border rounded-2xl px-4 py-[14px] shadow-sm">
                          <p className="text-sm font-semibold text-foreground">
                            Agent mode — on standby
                          </p>
                          <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">
                            Captions are off. I only act when you type (e.g. “create quote” or
                            “schedule follow-up”). Switch to Listen to follow the live call again.
                          </p>
                        </div>
                        {manualAction && (
                          <AgentStepCard
                            step={manualAction}
                            onApprove={(id) => {
                              if (!manualAction || manualAction.id !== id) return;
                              if (manualAction.actionId === "create_quote") {
                                phase3Tools.onCreateQuote(FAMILY_FLOATER_QUOTE_DATA);
                                setManualAction({
                                  ...manualAction,
                                  status: "done",
                                  detail:
                                    "Opened Quote Creator with a prefilled draft — review and send when you’re ready.",
                                });
                              } else if (manualAction.actionId === "schedule_followup") {
                                phase3Tools.onScheduleFollowUp({
                                  dateOption: "tomorrow",
                                  exactTime: "11:00am",
                                  language: "Hindi",
                                });
                                setManualAction({
                                  ...manualAction,
                                  status: "done",
                                  detail:
                                    "Opened calendar for tomorrow 11:00 AM — confirm the slot yourself.",
                                });
                              }
                            }}
                            onReject={(id) => {
                              if (!manualAction || manualAction.id !== id) return;
                              setManualAction({
                                ...manualAction,
                                status: "rejected",
                                detail: "Dismissed — tell me another action when you're ready.",
                              });
                            }}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

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
                          <p className="text-sm text-foreground leading-relaxed">
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
                    ctas={phase2CTAs}
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

          {/* Sticky Input Bar — Phase III: Stop while running (Cursor-style) */}
          <div className="px-6 py-4 bg-muted">
            {phase === "phase3" && scheduledTime && (
              <p className="mb-2 text-center text-xs text-muted-foreground">
                Follow-up locked:{" "}
                <span className="font-medium text-foreground">
                  {scheduledTime.date}, {scheduledTime.time}
                </span>
              </p>
            )}
            <div className="max-w-2xl mx-auto">
              {phase === "phase2" && (
                <QuickActionsDrawer
                  actions={phase2QuickActions}
                  filterText={inputValue}
                  onSelect={handleQuickAction}
                  visible={quickActionsOpen}
                />
              )}
              <div className="relative flex items-center gap-2">
                {phase === "phase3" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="h-11 shrink-0 inline-flex items-center gap-1.5 rounded-full border border-onyx-300 bg-onyx-200/80 px-3 text-onyx-600 hover:bg-onyx-200 hover:text-onyx-800 transition-colors"
                        aria-label="AI mode"
                      >
                        {phase3Mode === "listen" ? (
                          <InfinityIcon className="h-4 w-4" strokeWidth={2.25} />
                        ) : (
                          <Bot className="h-4 w-4" strokeWidth={2} />
                        )}
                        <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64 rounded-xl p-1">
                      <DropdownMenuItem
                        className="rounded-lg gap-2.5 py-2.5 cursor-pointer"
                        onClick={() => setPhase3ModeSafe("listen")}
                      >
                        <Radio className="h-4 w-4 text-primary shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">Listen</p>
                          <p className="text-xs text-muted-foreground">
                            Live captions + next-best actions from the call
                          </p>
                        </div>
                        {phase3Mode === "listen" && (
                          <Check className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="rounded-lg gap-2.5 py-2.5 cursor-pointer"
                        onClick={() => setPhase3ModeSafe("agent")}
                      >
                        <Bot className="h-4 w-4 text-primary shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">Agent</p>
                          <p className="text-xs text-muted-foreground">
                            Captions off — only respond when you type
                          </p>
                        </div>
                        {phase3Mode === "agent" && (
                          <Check className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <div className="relative flex-1">
                  <Input
                    placeholder={
                      phase === "phase3"
                        ? phase3Mode === "agent"
                          ? "Tell the AI what to do…"
                          : phase3.runState === "stopped"
                            ? "Captions paused — type or continue listening…"
                            : phase3.isAwaiting
                              ? "Suggestion ready above — View / Dismiss, or type…"
                              : "Type to pause captions and guide the AI…"
                        : "Ask any question..."
                    }
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
          </div>
        </main>

        {/* Quote Builder Pane (Phase II / III) */}
        {isToolPhase && (
          <QuoteBuilder
            open={quoteBuilderOpen}
            onOpenChange={setQuoteBuilderOpen}
            inline
            initialData={quoteAgentData ?? undefined}
            initialStep={quoteAgentData ? quoteAgentStep : 0}
            agentAutoFill={quoteAgentAutoFill}
          />
        )}

        {/* Phase I — Power Tools expanded list */}
        {phase === "phase1" && rightPanelExpanded && (
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

        {/* Phase II / III — selected tool panel (non–Quote Creator) */}
        {isToolPhase && activeRightTool && activeRightTool !== "Quote Creator" && (
          <aside className="bg-white shadow-[-2px_0_4px_rgba(0,0,0,0.09)] z-[1] flex flex-col overflow-y-auto">
            <div className="p-6 w-full h-full">
              {activeRightTool === "Payment Status" && <PaymentStatusWidget />}
              {activeRightTool === "Network Hospital" && <NetworkHospitalWidget />}
              {activeRightTool === "Garage Locator" && (
                <div className="border border-border rounded-xl p-5 bg-card space-y-3">
                  <p className="font-bold text-foreground">Garage Locator</p>
                  <p className="text-sm text-muted-foreground">
                    Find authorised garages near the customer. Content coming soon.
                  </p>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Right strip */}
        {phase === "phase1" ? (
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
        ) : (
          <aside
            className="relative z-[2] w-[63px] min-w-[63px] bg-white border-l border-[#e7e7f0] shadow-none flex flex-col items-center pt-4 pb-4 gap-3 select-none"
            aria-label="Product tools"
          >
            {powerTools.map((tool) => {
              const Icon = tool.icon;
              const isSelected = activeRightTool === tool.label;
              return (
                <button
                  key={tool.label}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={tool.label}
                  onClick={() => handleRightToolClick(tool.label)}
                  className="group flex flex-col items-center gap-1.5 cursor-pointer px-1"
                >
                  <div
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg shrink-0 transition-colors duration-150",
                      isSelected
                        ? "bg-[#f8f7fc]"
                        : "bg-transparent group-hover:bg-[#f8f7fc]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-5 text-[#5b5675] transition-[fill] duration-150",
                        isSelected
                          ? "fill-[#5b5675]"
                          : "fill-transparent group-hover:fill-[#5b5675]"
                      )}
                      strokeWidth={1.75}
                    />
                  </div>
                  <span className="text-[10px] font-medium leading-[1.3] text-[#5b5675] text-center w-[47px]">
                    {tool.label}
                  </span>
                </button>
              );
            })}
          </aside>
        )}
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
        onOpenChange={(open) => {
          setRescheduleOpen(open);
          if (!open) setReschedulePreset(null);
        }}
        onBack={() => {
          setRescheduleOpen(false);
          setReschedulePreset(null);
        }}
        product={phase === "phase3" ? "Family_Floater_Health" : undefined}
        preset={reschedulePreset}
        onConfirm={(date, time) => setScheduledTime({ date, time })}
      />

    </div>
  );
};

export default CrmView2;
