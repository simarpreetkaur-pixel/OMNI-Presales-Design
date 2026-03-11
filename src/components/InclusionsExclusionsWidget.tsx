import { Check, X } from "lucide-react";

const inclusions = [
  "Own damage cover",
  "Third-party liability",
  "Fire & explosion",
  "Theft",
  "Natural calamities (flood, earthquake)",
  "Personal accident cover (owner-driver)",
  "Towing charges (up to ₹1,500)",
];

const exclusions = [
  "Normal wear & tear",
  "Mechanical / electrical breakdown",
  "Damage while driving under influence",
  "Driving without valid licence",
  "Consequential loss",
  "Depreciation on parts (without Zero Dep)",
  "War, nuclear risk, mutiny",
];

const InclusionsExclusionsWidget = () => {
  return (
    <div className="border border-border rounded-xl p-5 bg-card space-y-4 flex-1">
      <div>
        <p className="font-bold text-foreground">📋 Inclusions & Exclusions</p>
        <p className="text-sm text-muted-foreground">
          Car Comprehensive – Honda Amaze 2025
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs font-bold tracking-wide text-green-700 uppercase">
            Covered
          </p>
          <div className="space-y-1.5">
            {inclusions.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm text-foreground leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold tracking-wide text-destructive uppercase">
            Not Covered
          </p>
          <div className="space-y-1.5">
            {exclusions.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <span className="text-sm text-foreground leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InclusionsExclusionsWidget;
