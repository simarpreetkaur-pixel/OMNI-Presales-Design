import { useState, useCallback } from "react";
import { Check, Plus, Trash2, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
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
import SendQuoteModal from "@/components/SendQuoteModal";

interface QuoteBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inline?: boolean;
}

interface Member {
  type: string;
  name: string;
  age: string;
}

interface QuoteFormData {
  fullName: string;
  age: string;
  phoneNumber: string;
  emailId: string;
  gender: "Male" | "Female" | "Other";
  pincode: string;
  members: Member[];
  selectedPlan: string;
}

const STEPS = [
  { label: "BASIC INFO", number: 1 },
  { label: "MEMBERS", number: 2 },
  { label: "PLAN", number: 3 },
  { label: "SUMMARY", number: 4 },
];

const PLANS = [
  {
    id: "acko-platinum",
    name: "ACKO Platinum",
    price: "₹12,499/yr",
    range: "₹5L – ₹1 Cr",
    features: ["Zero deductions", "No room rent capping", "Unlimited restoration"],
  },
  {
    id: "acko-platinum-lite",
    name: "ACKO Platinum Lite",
    price: "₹8,299/yr",
    range: "₹5L – ₹50L",
    features: ["Zero deductions", "No room rent capping", "14,300+ cashless hospitals"],
  },
  {
    id: "arogya-sanjeevani",
    name: "Arogya Sanjeevani (ACKO)",
    price: "₹5,499/yr",
    range: "₹1L – ₹5L",
    features: [],
  },
];

const INITIAL_DATA: QuoteFormData = {
  fullName: "Rajesh Kumar",
  age: "70",
  phoneNumber: "8XXXXXX651",
  emailId: "rajesh.kumar@example.com",
  gender: "Male",
  pincode: "560077",
  members: [],
  selectedPlan: "acko-platinum",
};

const QuoteBuilder = ({ open, onOpenChange, inline = false }: QuoteBuilderProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<QuoteFormData>({ ...INITIAL_DATA });
  const [sendQuoteOpen, setSendQuoteOpen] = useState(false);

  const resetAndClose = useCallback(() => {
    onOpenChange(false);
    setTimeout(() => {
      setCurrentStep(0);
      setFormData({ ...INITIAL_DATA });
    }, 300);
  }, [onOpenChange]);

  const updateField = <K extends keyof QuoteFormData>(key: K, value: QuoteFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addMember = () => {
    updateField("members", [
      ...formData.members,
      { type: "Spouse", name: "Spouse", age: "65" },
    ]);
  };

  const removeMember = (index: number) => {
    updateField(
      "members",
      formData.members.filter((_, i) => i !== index)
    );
  };

  const updateMember = (index: number, field: keyof Member, value: string) => {
    const updated = formData.members.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    );
    updateField("members", updated);
  };

  const ctaLabels = [
    "PROCEED TO MEMBERS",
    "PROCEED TO PLAN",
    "PROCEED TO SUMMARY",
    "SEND QUOTE TO CUSTOMER",
  ];

  const handleCta = () => {
    if (currentStep < 3) {
      setCurrentStep((s) => s + 1);
    } else {
      setSendQuoteOpen(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const innerContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="h-3 w-3 rounded-full bg-purple-600" />
          <span className="text-base font-bold tracking-tight text-foreground">
            QUOTE BUILDER
          </span>
        </div>
        <button
          onClick={resetAndClose}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-onyx-200 transition-colors"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Stepper */}
      <div className="px-6 pt-5 pb-3 bg-card shrink-0">
        <div className="flex items-center justify-between">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200",
                    i < currentStep &&
                      "bg-purple-200 text-primary",
                    i === currentStep &&
                      "bg-purple-600 text-white shadow-[0_0_0_4px_hsl(var(--purple-200))]",
                    i > currentStep &&
                      "bg-onyx-200 text-onyx-500"
                  )}
                >
                  {i < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold tracking-wide",
                    i <= currentStep
                      ? "text-foreground"
                      : "text-onyx-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-8 mx-1.5 mt-[-18px]",
                    i < currentStep ? "bg-primary" : "bg-onyx-300"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-6 py-4">
          {currentStep === 0 && (
            <BasicInfoStep formData={formData} updateField={updateField} />
          )}
          {currentStep === 1 && (
            <MembersStep
              formData={formData}
              addMember={addMember}
              removeMember={removeMember}
              updateMember={updateMember}
            />
          )}
          {currentStep === 2 && (
            <PlanStep formData={formData} updateField={updateField} />
          )}
          {currentStep === 3 && (
            <SummaryStep
              formData={formData}
              updateField={updateField}
            />
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="px-6 pt-3 pb-5 bg-card border-t border-border shrink-0 space-y-2">
        <Button
          className="w-full rounded-xl h-12 text-sm font-bold tracking-wide"
          onClick={handleCta}
        >
          {ctaLabels[currentStep]}
        </Button>
        {currentStep > 0 && (
          <button
            onClick={handleBack}
            className="w-full text-center text-sm font-medium text-foreground py-1 hover:text-primary transition-colors"
          >
            Back
          </button>
        )}
      </div>
    </>
  );

  if (inline) {
    if (!open) return null;
    return (
      <>
        <div className="flex flex-col h-full border-l border-border bg-card overflow-hidden">
          {innerContent}
        </div>
        <SendQuoteModal
          open={sendQuoteOpen}
          onOpenChange={setSendQuoteOpen}
          email={formData.emailId}
          phone={formData.phoneNumber}
          onSent={() => {
            setSendQuoteOpen(false);
            resetAndClose();
          }}
        />
      </>
    );
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="sm:max-w-[420px] w-full p-0 gap-0 flex flex-col border-l border-border [&>button]:hidden"
        >
          <SheetTitle className="sr-only">Quote Builder</SheetTitle>
          {innerContent}
        </SheetContent>
      </Sheet>

      <SendQuoteModal
        open={sendQuoteOpen}
        onOpenChange={setSendQuoteOpen}
        email={formData.emailId}
        phone={formData.phoneNumber}
        onSent={() => {
          setSendQuoteOpen(false);
          resetAndClose();
        }}
      />
    </>
  );
};

/* ──────────────────────────────────────────────
   Step 1: Basic Info
   ────────────────────────────────────────────── */

function BasicInfoStep({
  formData,
  updateField,
}: {
  formData: QuoteFormData;
  updateField: <K extends keyof QuoteFormData>(key: K, value: QuoteFormData[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <p className="text-sm font-bold text-foreground tracking-tight">
        BASIC INFORMATION
      </p>

      <FieldGroup label="FULL NAME">
        <Input
          value={formData.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          className="bg-onyx-200 border-onyx-300"
        />
      </FieldGroup>

      <FieldGroup label="AGE">
        <Input
          type="number"
          value={formData.age}
          onChange={(e) => updateField("age", e.target.value)}
          className="bg-onyx-200 border-onyx-300"
        />
      </FieldGroup>

      <FieldGroup label="PHONE NUMBER">
        <Input
          value={formData.phoneNumber}
          onChange={(e) => updateField("phoneNumber", e.target.value)}
          className="bg-onyx-200 border-onyx-300"
        />
      </FieldGroup>

      <FieldGroup label="EMAIL ID">
        <Input
          type="email"
          value={formData.emailId}
          onChange={(e) => updateField("emailId", e.target.value)}
          className="bg-onyx-200 border-onyx-300"
        />
      </FieldGroup>

      <FieldGroup label="GENDER">
        <div className="flex gap-2">
          {(["Male", "Female", "Other"] as const).map((g) => (
            <button
              key={g}
              onClick={() => updateField("gender", g)}
              className={cn(
                "flex-1 h-10 rounded-lg text-sm font-medium border transition-colors",
                formData.gender === g
                  ? "border-purple-600 text-primary bg-white"
                  : "border-onyx-300 text-foreground bg-white hover:bg-onyx-100"
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </FieldGroup>

      <FieldGroup label="PINCODE">
        <Input
          value={formData.pincode}
          onChange={(e) => updateField("pincode", e.target.value)}
          className="bg-onyx-200 border-onyx-300"
        />
      </FieldGroup>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Step 2: Members
   ────────────────────────────────────────────── */

function MembersStep({
  formData,
  addMember,
  removeMember,
  updateMember,
}: {
  formData: QuoteFormData;
  addMember: () => void;
  removeMember: (i: number) => void;
  updateMember: (i: number, field: keyof Member, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-foreground tracking-tight">MEMBERS</p>

      {/* Self card */}
      <div className="rounded-xl border border-onyx-300 p-4 space-y-4">
        <p className="text-base font-bold text-foreground">Self</p>
        <FieldGroup label="NAME">
          <Input value={formData.fullName} readOnly className="bg-onyx-200 border-onyx-300" />
        </FieldGroup>
        <FieldGroup label="AGE">
          <Input value={formData.age} readOnly className="bg-onyx-200 border-onyx-300" />
        </FieldGroup>
      </div>

      {/* Additional members */}
      {formData.members.map((member, i) => (
        <div key={i} className="rounded-xl border border-onyx-300 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-base font-bold text-foreground">{member.type}</p>
            <button
              onClick={() => removeMember(i)}
              className="h-7 w-7 rounded-md flex items-center justify-center text-cerise-600 hover:bg-cerise-100 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <FieldGroup label="NAME">
            <Input
              value={member.name}
              onChange={(e) => updateMember(i, "name", e.target.value)}
              className="bg-onyx-200 border-onyx-300"
            />
          </FieldGroup>
          <FieldGroup label="AGE">
            <Input
              type="number"
              value={member.age}
              onChange={(e) => updateMember(i, "age", e.target.value)}
              className="bg-onyx-200 border-onyx-300"
            />
          </FieldGroup>
        </div>
      ))}

      {/* Add Member */}
      <button
        onClick={addMember}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-onyx-300 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add Member
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Step 3: Select Plan
   ────────────────────────────────────────────── */

function PlanStep({
  formData,
  updateField,
}: {
  formData: QuoteFormData;
  updateField: <K extends keyof QuoteFormData>(key: K, value: QuoteFormData[K]) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-foreground tracking-tight">SELECT PLAN</p>

      {PLANS.map((plan) => (
        <button
          key={plan.id}
          onClick={() => updateField("selectedPlan", plan.id)}
          className={cn(
            "w-full rounded-xl border-2 p-4 text-left transition-colors",
            formData.selectedPlan === plan.id
              ? "border-purple-600 bg-white"
              : "border-onyx-300 bg-white hover:border-purple-300"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-base font-bold text-foreground">{plan.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{plan.range}</p>
            </div>
            <p className="text-base font-bold text-primary whitespace-nowrap">
              {plan.price}
            </p>
          </div>
          {plan.features.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {plan.features.map((f) => (
                <span
                  key={f}
                  className="px-2.5 py-1 rounded-md bg-onyx-200 text-xs font-medium text-foreground"
                >
                  {f}
                </span>
              ))}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Step 4: Summary
   ────────────────────────────────────────────── */

function SummaryStep({
  formData,
  updateField,
}: {
  formData: QuoteFormData;
  updateField: <K extends keyof QuoteFormData>(key: K, value: QuoteFormData[K]) => void;
}) {
  const summaryRows = [
    { label: "Name", value: formData.fullName },
    { label: "Age", value: formData.age },
    { label: "Phone", value: formData.phoneNumber },
    { label: "Email", value: formData.emailId },
    { label: "Gender", value: formData.gender },
    { label: "Pincode", value: formData.pincode },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-foreground tracking-tight">SUMMARY</p>

      {/* Basic Info Table */}
      <div className="rounded-xl border border-onyx-300 overflow-hidden">
        {summaryRows.map((row, i) => (
          <div
            key={row.label}
            className={cn(
              "flex items-baseline justify-between px-4 py-2.5",
              i < summaryRows.length - 1 && "border-b border-onyx-200"
            )}
          >
            <span className="text-sm text-muted-foreground">{row.label}</span>
            <span className="text-sm font-semibold text-foreground text-right">
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Members */}
      <div className="rounded-xl border border-onyx-300 p-4 space-y-2">
        <p className="text-xs font-bold tracking-wide text-primary uppercase">
          MEMBERS
        </p>
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold text-foreground">
            Self — {formData.fullName}
          </span>
          <span className="text-sm text-muted-foreground">Age {formData.age}</span>
        </div>
        {formData.members.map((m, i) => (
          <div key={i} className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-foreground">
              {m.type} — {m.name}
            </span>
            <span className="text-sm text-muted-foreground">Age {m.age}</span>
          </div>
        ))}
      </div>

      {/* Selected Plan */}
      <div className="rounded-xl border-2 border-purple-600 p-4 space-y-2">
        <p className="text-xs font-bold tracking-wide text-primary uppercase">
          SELECTED PLAN
        </p>
        <Select
          value={formData.selectedPlan}
          onValueChange={(v) => updateField("selectedPlan", v)}
        >
          <SelectTrigger className="w-full h-12 rounded-[10px] bg-onyx-200 border-onyx-300 text-sm font-bold text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {PLANS.map((plan) => (
              <SelectItem key={plan.id} value={plan.id} className="text-sm py-2.5">
                {plan.name} — {plan.price}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Shared: Field Group
   ────────────────────────────────────────────── */

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-bold tracking-wide text-primary uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

export default QuoteBuilder;
