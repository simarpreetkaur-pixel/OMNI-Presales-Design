import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SendQuoteModal from "@/components/SendQuoteModal";
import { cn } from "@/lib/utils";

const VEHICLES = ["Honda Amaze", "Honda City", "Hyundai i20", "Maruti Swift"] as const;
const VARIANTS: Record<(typeof VEHICLES)[number], string[]> = {
  "Honda Amaze": ["S CVT", "VX CVT", "ZX CVT"],
  "Honda City": ["V CVT", "VX CVT", "ZX CVT"],
  "Hyundai i20": ["Sportz", "Asta", "Asta (O)"],
  "Maruti Swift": ["VXI", "ZXI", "ZXI+"],
};
const YEARS = ["2025", "2024", "2023", "2022", "2021", "2020"];

const PLANS = [
  {
    id: "comprehensive",
    name: "Comprehensive",
    price: "₹6,499 / year",
    features: ["Own damage", "Third party"],
  },
  {
    id: "zero-dep",
    name: "Comprehensive + Zero Dep",
    price: "₹7,699 / year",
    features: ["Zero depreciation", "Own damage"],
  },
  {
    id: "zero-dep-rsa",
    name: "Comprehensive + Zero Dep + RSA",
    price: "₹8,249 / year",
    features: ["Zero depreciation", "Roadside assistance"],
  },
] as const;

type Step = "details" | "plans" | "summary";

type MotorQuoteCreatorProps = {
  onBack: () => void;
};

const MotorQuoteCreator = ({ onBack }: MotorQuoteCreatorProps) => {
  const [step, setStep] = useState<Step>("details");
  const [vehicle, setVehicle] = useState<(typeof VEHICLES)[number]>("Honda Amaze");
  const [variant, setVariant] = useState("VX CVT");
  const [registrationYear, setRegistrationYear] = useState("2025");
  const [pincode, setPincode] = useState("560077");
  const [policyActive, setPolicyActive] = useState<"yes" | "no">("no");
  const [currentInsurer, setCurrentInsurer] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<(typeof PLANS)[number]["id"]>("zero-dep-rsa");
  const [sendOpen, setSendOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const variants = VARIANTS[vehicle];
  const selectedPlan = PLANS.find((plan) => plan.id === selectedPlanId) ?? PLANS[2];

  const handleVehicleChange = (value: string) => {
    const next = value as (typeof VEHICLES)[number];
    setVehicle(next);
    setVariant(VARIANTS[next][0]);
  };

  const handleHeaderBack = () => {
    if (step === "plans") {
      setStep("details");
      return;
    }
    if (step === "summary") {
      setStep("plans");
      return;
    }
    onBack();
  };

  const subtitle =
    step === "details"
      ? "Collect vehicle details to generate a comprehensive quote."
      : step === "plans"
        ? "Pick a plan to share with Rajesh."
        : "Review the quote before you send it.";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-1 border-b border-[#e7e7f0] px-4 py-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleHeaderBack}
          className="h-8 gap-1 px-2 text-sm font-medium text-[#7c47e1] hover:bg-[#efe9fb] hover:text-[#7c47e1]"
        >
          <ChevronLeft className="size-4" strokeWidth={2} />
          {step === "details" ? "Power tools" : "Back"}
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <p className="text-sm font-semibold leading-5 text-[#36354c]">Quote creator</p>
        <p className="mt-1 text-xs leading-[18px] text-[#5b5675]">{subtitle}</p>

        {step === "details" && (
          <form
            className="mt-4 flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              setStep("plans");
            }}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="vehicle" className="text-sm font-medium text-[#5b5675]">
                Vehicle
              </Label>
              <Select value={vehicle} onValueChange={handleVehicleChange}>
                <SelectTrigger id="vehicle" className="h-10 border-[#e7e7f0] bg-white text-[#36354c]">
                  <SelectValue placeholder="Enter vehicle details" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="variant" className="text-sm font-medium text-[#5b5675]">
                Variant
              </Label>
              <Select value={variant} onValueChange={setVariant}>
                <SelectTrigger id="variant" className="h-10 border-[#e7e7f0] bg-white text-[#36354c]">
                  <SelectValue placeholder="Select variant" />
                </SelectTrigger>
                <SelectContent>
                  {variants.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="year" className="text-sm font-medium text-[#5b5675]">
                Registration year
              </Label>
              <Select value={registrationYear} onValueChange={setRegistrationYear}>
                <SelectTrigger id="year" className="h-10 border-[#e7e7f0] bg-white text-[#36354c]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pincode" className="text-sm font-medium text-[#5b5675]">
                Pincode
              </Label>
              <Input
                id="pincode"
                inputMode="numeric"
                maxLength={6}
                value={pincode}
                onChange={(event) => setPincode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter pincode"
                className="h-10 border-[#e7e7f0] bg-white text-[#36354c]"
              />
            </div>

            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium text-[#5b5675]">
                Is the current policy already active?
              </legend>
              <RadioGroup
                value={policyActive}
                onValueChange={(value) => setPolicyActive(value as "yes" | "no")}
                className="gap-2"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="policy-yes" />
                  <Label htmlFor="policy-yes" className="text-sm font-normal text-[#36354c]">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="policy-no" />
                  <Label htmlFor="policy-no" className="text-sm font-normal text-[#36354c]">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </fieldset>

            {policyActive === "yes" && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="insurer" className="text-sm font-medium text-[#5b5675]">
                  Current insurer
                </Label>
                <Input
                  id="insurer"
                  value={currentInsurer}
                  onChange={(event) => setCurrentInsurer(event.target.value)}
                  placeholder="e.g. HDFC Ergo"
                  className="h-10 border-[#e7e7f0] bg-white text-[#36354c]"
                />
              </div>
            )}

            <Button
              type="submit"
              className="mt-1 h-10 w-full rounded-xl bg-[#7c47e1] text-sm font-medium text-white hover:bg-[#5920c5]"
            >
              Generate quote
            </Button>
          </form>
        )}

        {step === "plans" && (
          <div className="mt-4 flex flex-col gap-3">
            <p className="text-xs leading-[18px] text-[#5b5675]">
              {vehicle} {variant} · {registrationYear} · {pincode}
            </p>
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlanId(plan.id)}
                className={cn(
                  "w-full rounded-xl border p-3 text-left",
                  selectedPlanId === plan.id
                    ? "border-[#7c47e1] bg-[#faf8ff]"
                    : "border-[#e7e7f0] bg-white",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-5 text-[#36354c]">{plan.name}</p>
                  <p className="shrink-0 text-sm font-semibold leading-5 text-[#7c47e1]">
                    {plan.price}
                  </p>
                </div>
                <p className="mt-1 text-xs leading-[18px] text-[#5b5675]">
                  {plan.features.join(" · ")}
                </p>
              </button>
            ))}
            <Button
              type="button"
              onClick={() => setStep("summary")}
              className="mt-1 h-10 w-full rounded-xl bg-[#7c47e1] text-sm font-medium text-white hover:bg-[#5920c5]"
            >
              Continue
            </Button>
          </div>
        )}

        {step === "summary" && (
          <div className="mt-4 flex flex-col gap-3">
            <div className="overflow-hidden rounded-xl border border-[#e7e7f0]">
              {[
                { label: "Vehicle", value: `${vehicle} ${variant}` },
                { label: "Registration year", value: registrationYear },
                { label: "Pincode", value: pincode },
                {
                  label: "Current policy",
                  value:
                    policyActive === "yes"
                      ? currentInsurer
                        ? `Active · ${currentInsurer}`
                        : "Active"
                      : "Not active",
                },
              ].map((row, index, rows) => (
                <div
                  key={row.label}
                  className={cn(
                    "flex items-start justify-between gap-3 px-3 py-2.5",
                    index < rows.length - 1 && "border-b border-[#e7e7f0]",
                  )}
                >
                  <span className="text-sm text-[#5b5675]">{row.label}</span>
                  <span className="text-right text-sm font-medium text-[#36354c]">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-[#d0bdf4] bg-[#faf8ff] p-3">
              <p className="text-xs font-medium leading-[18px] text-[#5b5675]">Selected plan</p>
              <p className="mt-1 text-sm font-medium leading-5 text-[#36354c]">{selectedPlan.name}</p>
              <p className="mt-0.5 text-sm font-semibold leading-5 text-[#7c47e1]">
                {selectedPlan.price}
              </p>
            </div>

            {sent ? (
              <p className="text-sm leading-5 text-[#15803d]">
                Quote sent to Rajesh on WhatsApp and email.
              </p>
            ) : (
              <Button
                type="button"
                onClick={() => setSendOpen(true)}
                className="h-10 w-full rounded-xl bg-[#7c47e1] text-sm font-medium text-white hover:bg-[#5920c5]"
              >
                Send quote
              </Button>
            )}
          </div>
        )}
      </div>

      <SendQuoteModal
        open={sendOpen}
        onOpenChange={setSendOpen}
        email="rajesh.kumar@example.com"
        phone="8XXXXXX651"
        onSent={() => {
          setSendOpen(false);
          setSent(true);
        }}
      />
    </div>
  );
};

export default MotorQuoteCreator;
