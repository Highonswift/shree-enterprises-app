import type { Division } from "@/types/website";

/** Lets other parts of the page pre-fill the enquiry form. */
export interface EnquiryPrefill { division?: Division; scope?: string; message?: string }

const EVENT = "enquiry:prefill";

export function prefillEnquiry(detail: EnquiryPrefill) {
  window.dispatchEvent(new CustomEvent<EnquiryPrefill>(EVENT, { detail }));
}

export function onEnquiryPrefill(handler: (detail: EnquiryPrefill) => void) {
  const listener = (event: Event) => handler((event as CustomEvent<EnquiryPrefill>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
