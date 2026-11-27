"use client";

import type { ReactNode } from "react";
import { prefillEnquiry } from "@/lib/enquiry";
import type { Division } from "@/types/website";

/** Link to the enquiry form that also selects a division. */
export function PresetLink({ division, className, children }: { division: Division; className: string; children: ReactNode }) {
  return (
    <a href="#contact" className={className} onClick={() => prefillEnquiry({ division })}>
      {children}
    </a>
  );
}
