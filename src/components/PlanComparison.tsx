import { useState } from "react";
import { X, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ackoPlans: Record<string, Record<string, string | boolean>> = {
  "ACKO Platinum": {
    "Sum Insured": "₹1 Cr / Unlimited",
    "Room Rent": "No capping",
    Copayment: "Nil",
    "Pre-existing Diseases": "0–36 months",
    "Specific Illness Waiting": "None",
    "No Claim Bonus": "Up to 100%",
    "Day Care": true,
    "Restoration Benefit": "Unlimited",
    "Consumables Cover": true,
    "Free Health Checkup": true,
  },
  "ACKO Standard": {
    "Sum Insured": "₹5L – ₹25L",
    "Room Rent": "No capping",
    Copayment: "Nil",
    "Pre-existing Diseases": "36 months",
    "Specific Illness Waiting": "24 months",
    "No Claim Bonus": "Up to 50%",
    "Day Care": true,
    "Restoration Benefit": "100%",
    "Consumables Cover": true,
    "Free Health Checkup": false,
  },
};

const competitorData: Record<string, Record<string, string | boolean>> = {
  "HDFC Ergo Optima Secure": {
    "Sum Insured": "₹3L – ₹1 Cr",
    "Room Rent": "No capping",
    Copayment: "Nil",
    "Pre-existing Diseases": "36 months",
    "Specific Illness Waiting": "24 months",
    "No Claim Bonus": "Up to 100%",
    "Day Care": true,
    "Restoration Benefit": "100%",
    "Consumables Cover": true,
    "Free Health Checkup": true,
  },
  "Star Comprehensive": {
    "Sum Insured": "₹5L – ₹1 Cr",
    "Room Rent": "Single AC room",
    Copayment: "Nil",
    "Pre-existing Diseases": "36 months",
    "Specific Illness Waiting": "24 months",
    "No Claim Bonus": "Up to 100%",
    "Day Care": true,
    "Restoration Benefit": "100%",
    "Consumables Cover": false,
    "Free Health Checkup": true,
  },
  "Niva Bupa Reassure 2.0": {
    "Sum Insured": "₹3L – ₹1 Cr",
    "Room Rent": "No capping",
    Copayment: "Nil",
    "Pre-existing Diseases": "36 months",
    "Specific Illness Waiting": "24 months",
    "No Claim Bonus": "Up to 100%",
    "Day Care": true,
    "Restoration Benefit": "Unlimited",
    "Consumables Cover": true,
    "Free Health Checkup": true,
  },
  "Care Supreme": {
    "Sum Insured": "₹5L – ₹6 Cr",
    "Room Rent": "No capping",
    Copayment: "Nil",
    "Pre-existing Diseases": "36 months",
    "Specific Illness Waiting": "24 months",
    "No Claim Bonus": "Up to 150%",
    "Day Care": true,
    "Restoration Benefit": "Unlimited",
    "Consumables Cover": true,
    "Free Health Checkup": true,
  },
};

const competitorNames = Object.keys(competitorData);

const features = [
  "Sum Insured",
  "Room Rent",
  "Copayment",
  "Pre-existing Diseases",
  "Specific Illness Waiting",
  "No Claim Bonus",
  "Day Care",
  "Restoration Benefit",
  "Consumables Cover",
  "Free Health Checkup",
];

const PlanComparison = () => {
  const [ackoSelected, setAckoSelected] = useState("ACKO Platinum");
  const [competitors, setCompetitors] = useState<string[]>([
    "HDFC Ergo Optima Secure",
  ]);

  const addCompetitor = () => {
    const available = competitorNames.filter((c) => !competitors.includes(c));
    if (available.length > 0 && competitors.length < 3) {
      setCompetitors([...competitors, available[0]]);
    }
  };

  const removeCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const changeCompetitor = (index: number, value: string) => {
    const updated = [...competitors];
    updated[index] = value;
    setCompetitors(updated);
  };

  const renderCell = (val: string | boolean) => {
    if (typeof val === "boolean") {
      return val ? (
        <Check className="w-5 h-5 text-green-500 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-destructive mx-auto" />
      );
    }
    return <span className="text-sm text-foreground">{val}</span>;
  };

  const acko = ackoPlans[ackoSelected];

  return (
    <div className="border border-border rounded-xl p-5 bg-card space-y-3 flex-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-foreground">📊 Plan Comparison:</p>
          <p className="text-sm text-muted-foreground">
            Use the dropdown to switch competitors:
          </p>
        </div>

        {competitors.length < 3 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={addCompetitor}
            className="gap-1 text-primary"
          >
            <Plus className="w-4 h-4" /> Add Competitor
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="w-[140px] font-semibold text-foreground">
              Feature
            </TableHead>

            <TableHead className="min-w-[150px]">
              <Select value={ackoSelected} onValueChange={setAckoSelected}>
                <SelectTrigger className="w-auto h-8 text-sm font-semibold text-primary border-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(ackoPlans).map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableHead>

            {competitors.map((comp, i) => (
              <TableHead key={i} className="min-w-[150px]">
                <div className="flex items-center gap-2">
                  <Select
                    value={comp}
                    onValueChange={(val) => changeCompetitor(i, val)}
                  >
                    <SelectTrigger className="w-auto h-8 text-sm font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {competitorNames.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {i > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCompetitor(i)}
                      className="h-6 w-6"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {features.map((feat) => (
            <TableRow key={feat}>
              <TableCell className="text-sm text-muted-foreground py-3">
                {feat}
              </TableCell>

              <TableCell className="text-center py-3">
                {renderCell(acko[feat])}
              </TableCell>

              {competitors.map((comp, i) => (
                <TableCell key={i} className="text-center py-3">
                  {renderCell(competitorData[comp][feat])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PlanComparison;
