"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { prefersReducedMotion, whatsappHref } from "@/lib/utils";
import type { SiteContent } from "@/types/website";

export function FloatingActions({ whatsapp, ui }: { whatsapp: string; ui: SiteContent["ui"] }) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const update = () => setShowTop(window.scrollY > 600);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <>
      <a className="wa" href={whatsappHref(whatsapp)} target="_blank" rel="noopener noreferrer" aria-label={ui.whatsappLabel}>
        <WhatsAppIcon />
        <span className="t"><small>{ui.whatsappSmall}</small><b>{ui.whatsappLabel}</b></span>
      </a>
      <button type="button" className={showTop ? "top show" : "top"} aria-label={ui.backToTop}
        tabIndex={showTop ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })}>
        <ArrowUp size={20} strokeWidth={2.6} color="var(--color-primary)" aria-hidden />
      </button>
    </>
  );
}
