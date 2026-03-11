import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Send, ChevronDown, CheckCircle2, Heart, UserRound, Baby, Car, Bike, Headset, FileText, Scale, Stethoscope, CalendarDays, Phone } from "lucide-react";
import aiIcon from "@/assets/ai-icon.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import profileIcon from "@/assets/profile-icon.png";
import insuredIcon from "@/assets/insured-icon.png";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import PredictiveCTABar from "@/components/PredictiveCTABar";
import PlanComparison from "@/components/PlanComparison";
import QuickActionsDrawer, { type QuickAction } from "@/components/QuickActionsDrawer";
import RescheduleCallModal from "@/components/RescheduleCallModal";

// --- Rajesh Kumar data ---
const rajeshAiSuggestions = [
  "Renew comprehensive policy – current policy expires in 3 days",
  "Highlight zero-depreciation add-on – saves ₹15K+ on claims",
  "Compare with Digit & HDFC Ergo – ACKO has fastest claim settlement",
  "Complete quote – confirm IDV value & add-ons, then send via SMS",
];

const rajeshInitialCTAs = [
  "Previous Interaction Summary",
  "Lead 360",
  "Resume Quote",
  "Compare with Competitors",
];

const rajeshSubsequentCTAs = [
  "Resume Quote",
  "Inclusions and Exclusions",
  "Add-ons & Coverage",
];

const rajeshQuickActions: QuickAction[] = [
  { label: "Create Quote", icon: Headset },
  { label: "Check Nearby Hospitals", icon: FileText },
  { label: "Compare with Competitors", icon: Scale },
  { label: "Pre-existing diseases", icon: Stethoscope },
];

const rajeshSmartResponses: { keywords: string[]; response: string[] }[] = [
  {
    keywords: ["hospital", "nearby hospital"],
    response: [
      "Max Super Speciality Hospital, Saket – 1.8 km",
      "AIIMS, Ansari Nagar – 3.2 km",
      "Fortis Escorts Heart Institute – 4.5 km",
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
    keywords: ["renew", "renewal", "expire", "expiry"],
    response: [
      "Current policy expires in 3 days",
      "Renewal quote: ₹8,450/yr with 20% NCB",
      "Zero Depreciation add-on recommended – saves ₹15K+ on claims",
    ],
  },
  {
    keywords: ["ncb", "no claim bonus"],
    response: [
      "Current NCB: 20% (1 claim-free year)",
      "Next year if no claim: 25% discount",
      "NCB protection add-on available – ₹650/yr",
    ],
  },
  {
    keywords: ["idv", "insured declared value"],
    response: [
      "Honda Amaze 2025 – recommended IDV: ₹6,25,000",
      "Min IDV: ₹5,31,250 · Max IDV: ₹6,87,500",
      "Higher IDV = higher claim payout but slightly higher premium",
    ],
  },
  {
    keywords: ["add-on", "addon", "add on", "coverage", "cover"],
    response: [
      "Zero Depreciation – ₹1,200/yr · full part value on claims",
      "Roadside Assistance – ₹499/yr · 24/7 towing & support",
      "Engine Protection – ₹899/yr · covers hydrostatic lock",
      "Return to Invoice – ₹750/yr · full invoice on total loss",
    ],
  },
  {
    keywords: ["roadside", "towing", "breakdown", "rsa"],
    response: [
      "Roadside Assistance – ₹499/yr",
      "Covers: flat tyre, battery jump, fuel delivery, towing up to 50 km",
      "Available 24/7 · avg response time: 30 mins",
    ],
  },
];

const rajeshCtaResponses: Record<string, string[]> = {
  "Previous Interaction Summary": [
    "Visited 2 days ago – Comprehensive Car Insurance, Honda Amaze 2025",
    "Last quote: ₹8,450/yr (Zero Depreciation) – did not complete purchase",
    "Also asked about Roadside Assistance",
  ],
  "Resume Quote": [
    "Honda Amaze 2025 – Comprehensive Plan",
    "IDV: ₹6,25,000 · Premium: ₹8,450/yr",
    "Add-ons: Zero Depreciation, Roadside Assistance",
  ],
  "Compare with Competitors": [
    "ACKO: ₹8,450/yr – 2-hr cashless, zero paperwork",
    "Digit: ₹9,200/yr – 6-hr settlement",
    "HDFC Ergo: ₹9,800/yr – 48-hr process",
  ],
  "Add-ons & Coverage": [
    "Zero Depreciation – ₹1,200/yr · full claim value",
    "Roadside Assistance – ₹499/yr · 24/7 towing",
    "Engine Protection – ₹899/yr · hydrostatic lock",
    "Return to Invoice – ₹750/yr · full invoice on total loss",
  ],
  "Create Quote": [
    "Honda Amaze 2025 – Comprehensive",
    "IDV: ₹6,25,000 · NCB: 20% · Base: ₹7,250/yr",
    "Confirm IDV & add-ons to generate quote",
  ],
  "Check Nearby Hospitals": [
    "Manipal Hospital, Old Airport Rd – 2.3 km",
    "Apollo Hospital, Bannerghatta Rd – 4.1 km",
    "Fortis Hospital, Cunningham Rd – 5.8 km",
  ],
  "Pre-existing diseases": [
    "Platinum: covered after 0–36 months",
    "Standard: covered after 36 months",
    "Diabetes, hypertension, thyroid – all covered post waiting period",
  ],
  "Inclusions and Exclusions": [
    "Covered: Own damage, third-party liability, fire, theft, natural calamities",
    "Excluded: Wear and tear, mechanical breakdown, drunk driving, unlicensed driver",
    "Add Zero Depreciation to cover full part cost without deduction",
  ],
};

// --- Pooja Arora data ---
const poojaAiSuggestions = [
  "Highlight ACKO Platinum Lite benefits – zero waiting for Day 1 covers",
  "Compare Platinum Lite with HDFC Ergo – ACKO covers more at lower premium",
  "Family floater covers husband + 2 kids under single 10L sum insured",
  "Mention free annual health check-up and unlimited teleconsultations",
];

const poojaInitialCTAs = [
  "Previous Interaction Summary",
  "Lead 360",
  "Compare Plans",
  "Check Nearby Hospitals",
];

const poojaSubsequentCTAs = [
  "Compare Plans",
  "Inclusions and Exclusions",
  "Pre-existing diseases",
];

const poojaQuickActions: QuickAction[] = [
  { label: "Create Quote", icon: Headset },
  { label: "Check Nearby Hospitals", icon: FileText },
  { label: "Compare Plans", icon: Scale },
  { label: "Pre-existing diseases", icon: Stethoscope },
];

const poojaSmartResponses: { keywords: string[]; response: string[] }[] = [
  {
    keywords: ["hospital", "nearby hospital", "network"],
    response: [
      "Max Super Speciality Hospital, Saket – 1.8 km",
      "AIIMS, Ansari Nagar – 3.2 km",
      "Fortis Escorts Heart Institute – 4.5 km",
      "All cashless-enabled under ACKO network",
    ],
  },
  {
    keywords: ["quote", "premium", "price", "cost"],
    response: [
      "ACKO Platinum Lite – Family Floater (10L cover)",
      "Members: Self + Husband + 2 Kids",
      "Premium: ₹12,999/yr · No room rent capping",
      "Ready to generate final quote – confirm members",
    ],
  },
  {
    keywords: ["claim", "claims", "settlement"],
    response: [
      "ACKO avg claim settlement: 4 hours (cashless)",
      "97.8% claim settlement ratio (FY25)",
      "Fully digital – zero paperwork via app",
    ],
  },
  {
    keywords: ["compare", "hdfc", "competitor"],
    response: [
      "ACKO Platinum Lite: ₹12,999/yr – 10L cover, no room rent limit",
      "HDFC Ergo Optima: ₹14,500/yr – 10L cover, room rent capped",
      "Star Family Health: ₹15,200/yr – 10L cover, 2% co-pay",
    ],
  },
  {
    keywords: ["pre-existing", "waiting", "diabetes", "bp"],
    response: [
      "Platinum Lite: pre-existing covered after 36 months",
      "Day 1 covers: accidents, COVID, dengue, malaria",
      "Diabetes, hypertension, thyroid – covered post waiting period",
    ],
  },
  {
    keywords: ["cover", "coverage", "benefit", "feature"],
    response: [
      "10L sum insured – family floater (shared across members)",
      "No room rent capping · No co-pay",
      "Free annual health check-up + unlimited teleconsultations",
      "Maternity cover available with 24-month waiting",
    ],
  },
  {
    keywords: ["family", "floater", "member"],
    response: [
      "Family floater covers: Self + Husband + 2 Kids",
      "Single premium of ₹12,999/yr for all 4 members",
      "10L sum insured shared across the family",
    ],
  },
];

const poojaCtaResponses: Record<string, string[]> = {
  "Previous Interaction Summary": [
    "Called 3 days ago – asked about ACKO Platinum Lite vs HDFC Ergo",
    "Interested in family floater plan with 10L cover",
    "Mentioned to discuss with husband and make decision",
  ],
  "Compare Plans": [
    "ACKO Platinum Lite: ₹12,999/yr – 10L, no room rent limit, no co-pay",
    "HDFC Ergo Optima: ₹14,500/yr – 10L, room rent capped at ₹5K/day",
    "Star Family Health: ₹15,200/yr – 10L, 2% co-pay on claims",
  ],
  "Check Nearby Hospitals": [
    "Max Super Speciality Hospital, Saket – 1.8 km",
    "AIIMS, Ansari Nagar – 3.2 km",
    "Fortis Escorts Heart Institute – 4.5 km",
  ],
  "Inclusions and Exclusions": [
    "Covered: Hospitalisation, daycare, pre/post hospitalisation, ambulance, teleconsultation",
    "Excluded: Cosmetic surgery, dental (unless from accident), self-inflicted injuries",
    "Day 1 covers: Accidents, COVID, dengue, malaria – no waiting period",
  ],
  "Pre-existing diseases": [
    "Platinum Lite: covered after 36 months waiting",
    "Day 1 covers: accidents, COVID, dengue, malaria",
    "Diabetes, hypertension, thyroid – all covered post waiting period",
  ],
  "Create Quote": [
    "ACKO Platinum Lite – Family Floater",
    "Members: Self + Husband + 2 Kids · 10L cover",
    "Premium: ₹12,999/yr · Confirm members to generate quote",
  ],
};

type ChatMessage = {
  role: "agent" | "ai";
  content: string[];
  component?: React.ReactNode;
};

const CrmView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isPooja = (location.state as { customer?: string } | null)?.customer === "pooja";

  const aiSuggestions = isPooja ? poojaAiSuggestions : rajeshAiSuggestions;
  const initialCTAs = isPooja ? poojaInitialCTAs : rajeshInitialCTAs;
  const subsequentCTAs = isPooja ? poojaSubsequentCTAs : rajeshSubsequentCTAs;
  const quickActions = isPooja ? poojaQuickActions : rajeshQuickActions;
  const smartResponses = isPooja ? poojaSmartResponses : rajeshSmartResponses;
  const ctaResponses = isPooja ? poojaCtaResponses : rajeshCtaResponses;

  const customerName = isPooja ? "Pooja Arora" : "Rajesh Kumar";
  const customerInitials = isPooja ? "PA" : "RK";
  const customerPhone = isPooja ? "+91 98765 43210" : "+91 98200 25524";
  const customerTag = isPooja ? "New Customer" : "Existing Customer";
  const productOfInterest = isPooja
    ? "Health Insurance – ACKO Platinum Lite, Family Floater (10L cover)"
    : "Car Insurance – Comprehensive for Honda Amaze 2025";

  const [inputValue, setInputValue] = useState("");
  const [vehiclesOpen, setVehiclesOpen] = useState(false);
  const [familyOpen, setFamilyOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<{ date: string; time: string } | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [ctasVisible, setCtasVisible] = useState(true);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [isFirstCTASelection, setIsFirstCTASelection] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeCTAs = isFirstCTASelection ? initialCTAs : subsequentCTAs;

  function getSmartResponse(message: string): string[] {
    const lower = message.toLowerCase();
    for (const entry of smartResponses) {
      if (entry.keywords.some((kw) => lower.includes(kw))) {
        return entry.response;
      }
    }
    return ["I'll look into that for you. Let me check the details."];
  }

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

  const handleQuickAction = (label: string) => {
    setQuickActionsOpen(false);
    setInputValue("");
    handleCtaSelect(label);
  };

  const handleCtaSelect = (cta: string) => {
    if (cta === "Lead 360") {
      window.open("/lead-360", "_blank");
      if (isFirstCTASelection) setIsFirstCTASelection(false);
      return;
    }
    if (isFirstCTASelection) setIsFirstCTASelection(false);
    setCtasVisible(false);
    setChatMessages((prev) => [...prev, { role: "agent", content: [cta] }]);
    setIsAiTyping(true);
    scrollToBottom();

    setTimeout(() => {
      if (cta === "Compare with Competitors" || cta === "Compare Plans") {
        setChatMessages((prev) => [...prev, { role: "ai", content: [], component: <PlanComparison /> }]);
      } else {
        const response = ctaResponses[cta] || ["I'll look into that for you."];
        setChatMessages((prev) => [...prev, { role: "ai", content: response }]);
      }
      setIsAiTyping(false);
      scrollToBottom();

      setTimeout(() => {
        setCtasVisible(true);
        scrollToBottom();
      }, 1000);
    }, 1200);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const msg = inputValue.trim();
    setInputValue("");
    if (isFirstCTASelection) setIsFirstCTASelection(false);
    setCtasVisible(false);
    setChatMessages((prev) => [...prev, { role: "agent", content: [msg] }]);
    setIsAiTyping(true);
    scrollToBottom();

    setTimeout(() => {
      setChatMessages((prev) => [...prev, { role: "ai", content: getSmartResponse(msg) }]);
      setIsAiTyping(false);
      scrollToBottom();

      setTimeout(() => {
        setCtasVisible(true);
        scrollToBottom();
      }, 1000);
    }, 1200);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <header className="h-[72px] border-b border-border bg-card flex items-center px-6 shrink-0">
        <div className="flex items-center gap-3">
          <img
            src="https://pub-c050457d48794d5bb9ffc2b4649de2c1.r2.dev/ACKO%20logo%20primary%20Light%20BG.svg"
            alt="ACKO"
            className="h-8" />
          
          <div className="h-5 w-px bg-border" />
          <span className="text-foreground tracking-tight text-lg font-medium">
            OMNI Pre-sales
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Customer Details */}
        <aside className="w-[364px] shrink-0 border-r border-onyx-300 flex flex-col overflow-y-auto p-4 gap-5 bg-onyx-100 shadow-[2px_0_8px_rgba(0,0,0,0.09)]">
          {/* Customer Profile Card */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start gap-3">
              <img src={profileIcon} alt="Profile" className="h-10 w-10 rounded-lg" />
              <div>
                <h2 className="text-foreground font-bold text-lg">{customerName}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                    <span className="font-medium text-sm text-orange-700">High intent</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-info" />
                    <span className="font-medium text-sm text-blue-700">{customerTag}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicles Collapsible (Rajesh only) */}
            {!isPooja && (
            <div className="mt-3">
            <Collapsible open={vehiclesOpen} onOpenChange={setVehiclesOpen}>
              <div className="rounded-2xl bg-purple-100">
                <CollapsibleTrigger className="w-full flex items-center justify-between px-5 transition-colors rounded-2xl py-3">
                  <span className="text-[15px] text-foreground font-medium">Vehicles (3)</span>
                  <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", vehiclesOpen && "rotate-180")} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-3 pb-4 space-y-0.5">
                    {[
                      { name: 'Ford Ecosport Titanium 2024', plate: 'KA 03 NW 7392', icon: Car, insured: true },
                      { name: 'Honda Activa 2020', plate: 'KA 04 CF 3823', icon: Bike, insured: true },
                      { name: 'Ford Ecosport Titanium 2024', plate: 'KA 06 GH 0392', icon: Car, insured: false },
                    ].map((vehicle, idx) => (
                      <div key={idx} className="flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-onyx-100/60 border-b border-border/20 last:border-b-0">
                        <div className="h-10 w-10 rounded-md flex items-center justify-center shrink-0 bg-onyx-300">
                          <vehicle.icon className="h-[18px] w-[18px] text-onyx-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-semibold text-foreground leading-tight">{vehicle.name}</p>
                           <p className="text-xs text-muted-foreground mt-0.5">{vehicle.plate}</p>
                        </div>
                        {vehicle.insured && (
                          <img src={insuredIcon} alt="Insured with ACKO" className="h-5 w-5 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
            </div>
            )}

            {/* Family Collapsible */}
            <div className={isPooja ? "mt-3" : "mt-2"}>
            <Collapsible open={familyOpen} onOpenChange={setFamilyOpen}>
              <div className="rounded-2xl bg-purple-100">
                <CollapsibleTrigger className="w-full flex items-center justify-between px-5 transition-colors rounded-2xl py-3">
                  <span className="text-[15px] text-foreground font-medium">
                    {isPooja ? "Family (4)" : "Family (4)"}
                  </span>
                  <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", familyOpen && "rotate-180")} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-3 pb-4 space-y-0.5">
                    {(isPooja
                      ? [
                          { name: 'Rahul Arora', relation: 'Husband', icon: Heart, insured: false },
                          { name: 'Ananya Arora', relation: 'Kid', icon: Baby, insured: false },
                          { name: 'Vivaan Arora', relation: 'Kid', icon: Baby, insured: false },
                          { name: 'Sunita Arora', relation: 'Mother', icon: UserRound, insured: false },
                        ]
                      : [
                          { name: 'Priya Kumar', relation: 'Spouse', icon: Heart, insured: true },
                          { name: 'Amit Kumar', relation: 'Father', icon: UserRound, insured: false },
                          { name: 'Sneha Kumar', relation: 'Mother', icon: UserRound, insured: false },
                          { name: 'Arjun Kumar', relation: 'Kid', icon: Baby, insured: true },
                        ]
                    ).map((member) => (
                      <div key={member.name} className="flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-onyx-100/60 border-b border-border/20 last:border-b-0">
                        <div className="h-10 w-10 rounded-md flex items-center justify-center shrink-0 bg-onyx-300">
                          <member.icon className="h-[18px] w-[18px] text-onyx-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-semibold text-foreground leading-tight">{member.name}</p>
                           <p className="text-xs text-muted-foreground mt-0.5">{member.relation}</p>
                        </div>
                        {member.insured && (
                          <img src={insuredIcon} alt="Insured with ACKO" className="h-5 w-5 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
            </div>
          </div>

          {/* Product of Interest Card */}
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="font-semibold text-foreground text-base">Product of Interest:</p>
            <p className="text-muted-foreground mt-1.5 leading-relaxed text-base">
              {productOfInterest}
            </p>
          </div>
        </aside>

        {/* Right Panel - Chat Window */}
        <main className="flex-1 flex flex-col bg-muted overflow-hidden">
          <ScrollArea className="flex-1 pl-6 pr-[60px] py-6" ref={scrollRef}>
            <div className="space-y-6">
              {/* AI Suggestions Bubble */}
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full shrink-0 mt-1 overflow-hidden">
                  <img src={aiIcon} alt="AI" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 bg-card border border-border rounded-2xl p-5 shadow-sm">
                  <div className="space-y-3">
                    {aiSuggestions.map((suggestion, index) =>
                    <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <p className="text-base text-foreground leading-relaxed">{suggestion}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={cn("flex items-start gap-3", msg.role === "agent" && "justify-end")}>
                  {msg.role === "ai" && (
                    <div className="h-8 w-8 rounded-full shrink-0 mt-1 overflow-hidden">
                      <img src={aiIcon} alt="AI" className="h-full w-full object-cover" />
                    </div>
                  )}
                  {msg.component ? (
                    <div className="max-w-full animate-cta-fade-in">
                      {msg.component}
                    </div>
                  ) : (
                    <div className={cn(
                      "rounded-2xl p-4 shadow-sm max-w-[75%] animate-cta-fade-in",
                      msg.role === "agent"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border"
                    )}>
                      <div className="space-y-2">
                        {msg.content.map((line, i) => (
                          <p key={i} className={cn("text-base leading-relaxed", msg.role === "ai" && "text-foreground")}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Predictive CTAs - appear after AI responses */}
              {ctasVisible && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full shrink-0 mt-1 overflow-hidden">
                    <img src={aiIcon} alt="AI" className="h-full w-full object-cover" />
                  </div>
                  <PredictiveCTABar ctas={activeCTAs} onSelect={handleCtaSelect} />
                </div>
              )}

              {/* AI Typing Indicator */}
              {isAiTyping && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full shrink-0 mt-1 overflow-hidden">
                    <img src={aiIcon} alt="AI" className="h-full w-full object-cover" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl px-5 py-4 shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-[dotBounce_1.4s_infinite_ease-in-out]" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-[dotBounce_1.4s_infinite_ease-in-out]" style={{ animationDelay: '200ms' }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground animate-[dotBounce_1.4s_infinite_ease-in-out]" style={{ animationDelay: '400ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Sticky Input Bar */}
          <div className="border-t border-onyx-200 bg-card px-6 py-4">
            <div className="max-w-3xl mx-auto relative">
              <QuickActionsDrawer
                actions={quickActions}
                filterText={inputValue}
                onSelect={handleQuickAction}
                visible={quickActionsOpen}
              />
              <Input
                placeholder="Ask a question or pick an option.."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setQuickActionsOpen(false);
                    handleSendMessage();
                  }
                }}
                onFocus={() => setQuickActionsOpen(true)}
                onBlur={() => {
                  setTimeout(() => setQuickActionsOpen(false), 150);
                }}
                className="pr-12 bg-card" />
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSendMessage}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary hover:bg-transparent active:bg-transparent active:scale-100">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Call Actions */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-lg h-14 w-14 border border-onyx-300"
          onClick={() => setRescheduleOpen(true)}
        >
          <CalendarDays className="h-5 w-5" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          className="rounded-full shadow-lg h-14 w-14 border border-onyx-300"
          onClick={() => {
            navigate("/");
            setTimeout(() => {
              toast(
                <div className="flex items-stretch gap-0">
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
        >
          <Phone className="h-5 w-5" />
        </Button>
      </div>

      <RescheduleCallModal
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        onBack={() => setRescheduleOpen(false)}
        onConfirm={(date, time) => setScheduledTime({ date, time })}
      />
    </div>);

};

export default CrmView;
