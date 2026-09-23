import { SAMPADA_QUOTES_AFTER_1 } from "@/data/sampadaQuotes";
import type { ObjectionItem } from "@/data/objections";

export const SAMPADA_LAST_CALL_SUMMARY_LABEL = "Last call summary";

export const SAMPADA_LAST_CALL_SUMMARY_BULLETS = [
  "Zero Dep quote shared at ₹6,025. Digit till Aug 2026, NCB 25%, no claims.",
  "Max IDV almost doubled the premium. She paused to ask her husband.",
  "Asked for a 15-minute callback.",
] as const;

export const SAMPADA_NEXT_BEST_ACTIONS_LABEL = "Next best actions";

export const SAMPADA_NEXT_BEST_ACTIONS_BULLETS = [
  "Ask if everything is okay — she was travelling to the hospital.",
  "Confirm if her husband chose current IDV (₹6,025) or max IDV.",
  "Compare the ACKO quote with her Digit policy.",
] as const;

export const SAMPADA_TOPIC_BULLETS = {
  "Quote creation": [
    ...SAMPADA_QUOTES_AFTER_1,
  ],
  "Decision Maker": [
    "Husband usually buys and sets the insurance. She will not decide IDV without him.",
    "She asked for a callback in 10–15 minutes after she reaches the hospital and calls him.",
  ],
  Objections: [
    {
      objection: "Max IDV premium feels almost double versus ₹6,025.",
      rebuttal: "Explained the ₹7,326 IDV gap and kept the quote at current IDV for her husband.",
      resolved: false,
    },
    {
      objection: "Could not pull Digit policy documents while driving to the hospital.",
      rebuttal: "Updated Digit expiry to 22 Aug 2026; asked her to verify documents on callback.",
      resolved: false,
    },
  ] satisfies readonly ObjectionItem[],
  "Competitor mentions": [
    "Current policy is with Go Digit. ACKO records first showed expiry in Aug 2025; she said it is active till 22 Aug 2026.",
    "ACKO quote was not compared with her Digit policy.",
  ],
} as const;
