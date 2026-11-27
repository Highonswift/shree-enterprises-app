"use client";

import { useState } from "react";
import { FilterChips } from "@/components/ui/FilterChips";
import { headingPaths } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { initials, unique } from "@/lib/utils";
import type { SiteContent } from "@/types/website";

export function Clients({ content, allLabel }: { content: SiteContent["clients"]; allLabel: string }) {
  const categories = unique(content.items.map((client) => client.category));
  const options = [allLabel, ...(categories.length ? categories : content.filters)];
  const [choice, setChoice] = useState(allLabel);
  const selected = options.includes(choice) ? choice : allLabel;
  const visible = content.items.filter((client) => selected === allLabel || client.category === selected);

  return (
    <section className="panel reveal" id="clients">
      <SectionHeading icon={headingPaths.clients} title={content.title} />
      <p className="lede">{content.subtitle}</p>
      <FilterChips options={options} selected={selected} onSelect={setChoice} />
      <div className="clients">
        {visible.map((client) => (
          <div key={`${selected}-${client.name}`} className="client fade">
            {client.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <div className="logoimg"><img src={client.logo} alt="" /></div>
            ) : (
              <div className="mono" aria-hidden="true">{initials(client.name)}</div>
            )}
            <h5>{client.name}</h5>
            <small>{client.sector}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
