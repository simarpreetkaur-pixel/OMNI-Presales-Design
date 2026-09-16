import { SAMPADA_QUOTES_AFTER_3 } from "@/data/sampadaQuotes";

export const SAMPADA_FOURTH_LAST_CALL_LABEL = "Last call summary";

export const SAMPADA_FOURTH_LAST_CALL_BULLETS = [
  "Opened older emails first: ₹6,000, then ₹5,160. Not the latest quote.",
  "Latest email quote: ₹14,530. PDF had no Buy now.",
  "Checkout on that email failed. Husband to finish payment. Callback in 30 minutes.",
] as const;

export const SAMPADA_FOURTH_NBA_LABEL = "Next best actions";

export const SAMPADA_FOURTH_NBA_BULLETS = [
  "Check if the ₹14,530 checkout is working.",
  "Guide payment on this call if they are still trying.",
] as const;

export const SAMPADA_FOURTH_TOPIC_BULLETS = {
  "Quote creation": [
    ...SAMPADA_QUOTES_AFTER_3,
  ],
  "Decision Maker": [
    "Husband is the decision maker. Captured on the first call; do not change it.",
    "She tried to pay herself from the hospital, then handed it back: let her husband complete it.",
  ],
  Objections: [
    "Max IDV first felt expensive; she later accepted the higher quote.",
    "Last call: checkout stuck, no pay button on the attachment. She stopped.",
  ],
  "Competitor mentions": [
    "Current policy is with Go Digit. Expiry on ACKO vs her records (22 Aug 2026) was never closed.",
    "Digit vs ACKO was never compared.",
  ],
} as const;
