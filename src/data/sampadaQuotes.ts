/** Quotes created on CX calls. Newest first in the Quote creation list. */
export const SAMPADA_QUOTES_AFTER_1 = [
  "Quote 2: Max IDV ₹13,61,399 · ₹13,351",
  "Quote 1: Zero Dep · IDV ₹8,18,370 · ₹6,025",
] as const;

export const SAMPADA_QUOTES_AFTER_2 = [
  "Quote 3: Max IDV + RTI, passenger protect, NCB protect · ₹17,145",
  ...SAMPADA_QUOTES_AFTER_1,
] as const;

export const SAMPADA_QUOTES_AFTER_3 = [
  "Quote 4: Email · ₹14,530",
  ...SAMPADA_QUOTES_AFTER_2,
] as const;

export const SAMPADA_QUOTES_AFTER_4 = [
  "Quote 6: App IDV ₹13.61L · ₹36,000 (agent saw ₹31,379)",
  "Quote 5: App Zero Dep · IDV ₹8.18L · ₹22,250",
  ...SAMPADA_QUOTES_AFTER_3,
] as const;
