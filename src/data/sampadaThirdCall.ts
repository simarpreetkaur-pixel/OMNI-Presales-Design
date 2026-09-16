import { SAMPADA_QUOTES_AFTER_2 } from "@/data/sampadaQuotes";

export const SAMPADA_THIRD_LAST_CALL_LABEL = "Last call summary";

export const SAMPADA_THIRD_LAST_CALL_BULLETS = [
  "She chose max IDV. Quote revised to ₹17,145 with RTI, passenger protect, NCB protect.",
  "Skipped engine, accessories, and RSA.",
  "Pay link sent. She said she will pay now.",
] as const;

export const SAMPADA_THIRD_NBA_LABEL = "Next best actions";

export const SAMPADA_THIRD_NBA_BULLETS = [
  "Confirm if ₹17,145 is paid. If not, complete payment on this call.",
  "If she cannot find Buy now, open the latest quote with her.",
  "If paid, complete KYC (PAN + OTP).",
] as const;

export const SAMPADA_THIRD_TOPIC_BULLETS = {
  "Quote creation": [
    ...SAMPADA_QUOTES_AFTER_2,
  ],
  "Decision Maker": [
    "Husband is the decision maker. She paused on the first call to check IDV with him.",
    "On the next call she still spoke for the household and asked for the revised pay link. Decision maker is unchanged.",
  ],
  Objections: [
    "Max IDV first felt almost double versus ₹6,025. She later accepted ~₹13L IDV and the ₹17,145 revised quote.",
    "She skipped engine protect (car is not in low-lying areas), accessories, and RSA. Those are closed.",
  ],
  "Competitor mentions": [
    "Current policy is with Go Digit. ACKO first showed expiry Aug 2025; she said it is active till 22 Aug 2026.",
    "Digit vs ACKO was never compared. She is still proceeding on the ACKO payment link.",
  ],
} as const;
