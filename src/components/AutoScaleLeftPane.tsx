import { useState } from "react";
import { Award, Bike, Car, ChevronDown, FileText, MoreHorizontal, Shield, Tag, UserRound } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

type PolicyId = "ecosport" | "activa" | "corporate" | "retail";

type PolicyRow = {
  id: PolicyId;
  title: string;
  subtitle: string;
  icon: typeof Car;
  details?: { label: string; value: string }[];
};

const POLICIES: PolicyRow[] = [
  {
    id: "ecosport",
    title: "Ecosport Titanium 2025",
    subtitle: "KA 03 NW 7373",
    icon: Car,
    details: [
      { label: "Policy holder name", value: "Rajesh Kumar" },
      { label: "Policy type", value: "Car_comprehensive" },
      { label: "Policy period", value: "28 Jun 2026 - 27 June 2027" },
      { label: "Policy tenure", value: "1 year" },
    ],
  },
  {
    id: "activa",
    title: "Honda Activa 2020",
    subtitle: "KA 8S BC 3934",
    icon: Bike,
  },
  {
    id: "corporate",
    title: "Corporate Health Plan",
    subtitle: "5 covered members",
    icon: Shield,
  },
  {
    id: "retail",
    title: "Retail Health Plan",
    subtitle: "2 covered members",
    icon: Shield,
  },
];

const LEAD_ROWS: { label: string; value: string; kind?: "badge" | "discount" }[] = [
  { label: "Lead ID", value: "00QHr00000.." },
  { label: "Lead type", value: "Win-back", kind: "badge" },
  { label: "Source event", value: "text here" },
  { label: "Campaign ID", value: "00QHr00000.." },
  { label: "Campaign name", value: "text here" },
  { label: "PPED", value: "Value here" },
  { label: "Email ID", value: "text here" },
  { label: "Registration number", value: "text here" },
  { label: "Applicable discount", value: "35% OFF", kind: "discount" },
  { label: "Active lapsed", value: "Yes" },
];

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="shrink-0 text-sm font-normal text-[#5B5675]">{label}</span>
      <span className="min-w-0 text-right text-sm font-medium leading-5 text-[#36354C]">
        {value}
      </span>
    </div>
  );
}

const AutoScaleLeftPane = () => {
  const [policiesOpen, setPoliciesOpen] = useState(false);

  return (
    <div className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
      <section className="space-y-3 rounded-xl border border-[#e7e7f0] bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserRound className="size-5 text-[#5B5675]" strokeWidth={1.75} />
            <p className="text-sm font-medium uppercase tracking-wide text-[#5B5675]">
              Customer Details
            </p>
          </div>
          <button
            type="button"
            className="rounded-md p-0.5 text-[#5B5675] hover:bg-[#f8f7fc]"
            aria-label="Customer details menu"
          >
            <MoreHorizontal className="size-6" strokeWidth={1.75} />
          </button>
        </div>
        <div className="h-px bg-[#e7e7f0]" />
        <div className="space-y-3">
          <DetailRow label="Name" value="Rajesh Kumar" />
          <DetailRow label="Language" value="Hindi" />
          <div className="flex items-center justify-between gap-3">
            <span className="shrink-0 text-sm font-normal text-[#5B5675]">Customer type</span>
            <span className="inline-flex items-center gap-0.5 text-sm font-medium text-[#36354C]">
              <Award className="size-[18px] text-[#5B5675]" strokeWidth={1.75} />
              Core
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-[#e7e7f0] bg-white p-4">
        <div className="flex items-center gap-2">
          <FileText className="size-5 text-[#5B5675]" strokeWidth={1.75} />
          <p className="text-sm font-medium uppercase tracking-wide text-[#5B5675]">
            Lead Details
          </p>
        </div>
        <div className="h-px bg-[#e7e7f0]" />
        <div className="space-y-3">
          {LEAD_ROWS.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3">
              <span className="shrink-0 text-sm font-normal text-[#5B5675]">{row.label}</span>
              {row.kind === "badge" ? (
                <span className="rounded-md bg-[#fff7e5] px-2 py-0.5 text-sm font-medium text-[#d16900]">
                  {row.value}
                </span>
              ) : row.kind === "discount" ? (
                <span className="inline-flex items-center gap-[5px] rounded-md bg-[#ebfbee] px-2.5 py-1 text-sm font-medium text-[#0b753e]">
                  <Tag className="size-[18px]" strokeWidth={1.75} />
                  {row.value}
                </span>
              ) : (
                <span className="text-right text-sm font-medium text-[#36354C]">{row.value}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <Collapsible open={policiesOpen} onOpenChange={setPoliciesOpen} asChild>
        <section className="space-y-3 rounded-xl border border-[#e7e7f0] bg-white p-4">
          <CollapsibleTrigger asChild>
            <button type="button" className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <UserRound className="size-5 text-[#5B5675]" strokeWidth={1.75} />
                <p className="text-xs font-medium uppercase tracking-wide text-[#36354C]">
                  Active Policies
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "size-5 text-[#5B5675] transition-transform duration-200",
                  policiesOpen && "rotate-180",
                )}
                strokeWidth={1.75}
              />
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-3">
            <Accordion type="single" collapsible className="space-y-3">
              {POLICIES.map((policy) => {
                const Icon = policy.icon;
                return (
                  <AccordionItem
                    key={policy.id}
                    value={policy.id}
                    className="rounded-lg border-0 bg-[#f8f7fc]"
                  >
                    <AccordionTrigger className="px-2 py-2 text-left hover:no-underline [&>svg]:size-5 [&>svg]:text-[#5B5675]">
                      <div className="flex items-start gap-1">
                        <Icon className="mt-0.5 size-5 shrink-0 text-[#36354C]" strokeWidth={1.75} />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-5 text-[#36354C]">{policy.title}</p>
                          <p className="text-xs font-normal leading-[18px] text-[#5B5675]">
                            {policy.subtitle}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-2 pb-2 pt-0">
                      {policy.details ? (
                        <>
                          <div className="mb-3 h-px bg-[#e7e7f0]" />
                          <div className="space-y-3">
                            {policy.details.map((detail) => (
                              <div key={detail.label} className="flex items-start justify-between gap-2">
                                <span className="shrink-0 text-xs font-normal text-[#5B5675]">
                                  {detail.label}
                                </span>
                                <span className="max-w-[123px] text-right text-xs font-medium leading-[18px] text-[#36354C]">
                                  {detail.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : null}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CollapsibleContent>
        </section>
      </Collapsible>
    </div>
  );
};

export default AutoScaleLeftPane;
