import { SAMPADA_QUOTES_AFTER_4 } from "@/data/sampadaQuotes";

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
    "₹22,250 was not the lower plan they had discussed. NCB could not be changed from 0%.",
    "Fixing IDV to ~₹13.61L made the premium ₹36,000. Two hours on a broken link, then a wrong app quote. She stopped.",
  ],
  "Competitor mentions": [
    "Current policy is with Go Digit. Expiry on ACKO vs her records (22 Aug 2026) was never closed.",
    "She said her husband will buy from some other company. Digit vs ACKO was never compared.",
  ],
} as const;
