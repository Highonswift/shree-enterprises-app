"use client";

import { useState } from "react";
import { FilterChips } from "@/components/ui/FilterChips";
import { headingPaths } from "@/components/ui/icons";
import { SectionHeading, SwipeHint } from "@/components/ui/SectionHeading";
import type { SiteContent } from "@/types/website";

export function Capabilities({ content, swipeLabel }: { content: SiteContent["capabilities"]; swipeLabel: string }) {
  const names = content.groups.map((group) => group.name);
  const [choice, setChoice] = useState(names[0]);
  const selected = names.includes(choice) ? choice : names[0];
  const items = content.groups.find((group) => group.name === selected)?.items ?? [];

  return (
    <section className="panel reveal" id="capabilities">
      <SectionHeading icon={headingPaths.capabilities} title={content.title} />
      <p className="lede">{content.subtitle}</p>
      <FilterChips options={names} selected={selected} onSelect={setChoice} />
      <div className="cap-grid">
        {items.map((item) => (
          <div key={`${selected}-${item.title}`} className="cap fade">
            {item.number && <div className="n">{item.number}</div>}
            <h4>{item.title}</h4>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
      <SwipeHint label={swipeLabel} />
    </section>
  );
}
