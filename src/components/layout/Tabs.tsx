"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, tabPaths } from "@/components/ui/icons";
import { prefersReducedMotion } from "@/lib/utils";
import type { SectionId } from "@/types/website";

const ids = Object.keys(tabPaths) as SectionId[];

export function Tabs({ labels }: { labels: Record<SectionId, string> }) {
  const [current, setCurrent] = useState<SectionId>("home");
  const row = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spy = () => {
      let next: SectionId = "home";
      const y = window.scrollY + 170;
      for (const id of ids) {
        const section = document.getElementById(id);
        if (id !== "home" && section && section.offsetTop <= y) next = id;
      }
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) next = "contact";
      setCurrent(next);
    };
    spy();
    window.addEventListener("scroll", spy, { passive: true });
    return () => window.removeEventListener("scroll", spy);
  }, []);

  // Keep the active tab visible when the row is scrollable.
  useEffect(() => {
    const tab = row.current?.querySelector<HTMLElement>(`[data-tab="${current}"]`);
    if (tab) row.current?.scrollTo({ left: tab.offsetLeft - 40, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [current]);

  const goTo = (id: SectionId) => {
    const section = document.getElementById(id);
    const header = [".nav", ".tabs"].reduce((sum, s) => sum + (document.querySelector<HTMLElement>(s)?.offsetHeight ?? 0), 10);
    const top = id === "home" || !section ? 0 : section.getBoundingClientRect().top + window.scrollY - header;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <div className="tabs">
      <div className="wrap" ref={row}>
        {ids.map((id) => (
          <a key={id} data-tab={id} href={`#${id}`} className={id === current ? "tab on" : "tab"}
            aria-current={id === current ? "location" : undefined}
            onClick={(event) => { event.preventDefault(); goTo(id); }}>
            <Icon size={15}>{tabPaths[id]}</Icon>
            {labels[id]}
          </a>
        ))}
      </div>
    </div>
  );
}
