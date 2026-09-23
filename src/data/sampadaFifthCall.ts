import { SAMPADA_QUOTES_AFTER_4 } from "@/data/sampadaQuotes";
import type { ObjectionItem } from "@/data/objections";

export const SAMPADA_FIFTH_LAST_CALL_LABEL = "Last call summary";

export const SAMPADA_FIFTH_LAST_CALL_BULLETS = [
  "App quote ₹22,250, then ₹36,000 after IDV change. She refused both.",
  "NCB stuck at 0%. She could not select 20% or 25%.",
  "Will ask her husband to buy elsewhere. Callback after two senior calls.",
] as const;

export const SAMPADA_FIFTH_NBA_LABEL = "Next best actions";

export const SAMPADA_FIFTH_NBA_BULLETS = [
  "Apologize for the checkout issues and reassure resolution.",
  "Assist payment completion on the call. If needed, create a fresh quote.",
] as const;

export const SAMPADA_FIFTH_TOPIC_BULLETS = {
  "Quote creation": [
    ...SAMPADA_QUOTES_AFTER_4,
  ],
  "Decision Maker": [
    "Husband is the decision maker. Captured on the first call; do not change it.",
    "She will ask him to buy from another company.",
  ],
  Objections: [
    {
      objection: "App Zero Dep showed ₹22,250 — not the plan discussed.",
      rebuttal: "Guided her through the app; asked her to edit car details when wrong plan showed.",
      resolved: false,
    },
    {
      objection: "NCB stuck at 0%; could not select 20% or 25%.",
      rebuttal: "Corrected policy date to 23 Aug; tried fixing 20% NCB from backend.",
      resolved: false,
    },
    {
      objection: "IDV at ~₹13.61L pushed premium to ₹36,000 on app checkout.",
      rebuttal: "Had her adjust IDV on app; apologised when premium jumped.",
      resolved: false,
    },
  ] satisfies readonly ObjectionItem[],
  "Competitor mentions": [
    "Current policy is with Go Digit. Expiry on ACKO vs her records (22 Aug 2026) was never closed.",
    "She said her husband will buy from some other company. Digit vs ACKO was never compared.",
  ],
  Payment: [
    "Two hours on a broken checkout, then a wrong app quote. She stopped.",
    "NCB stuck at 0%. She could not select 20% or 25%.",
  ],
} as const;
