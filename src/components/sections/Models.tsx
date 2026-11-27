"use client";

import { useCallback, useState } from "react";
import { PresetLink } from "@/components/common/PresetLink";
import { FilterChips } from "@/components/ui/FilterChips";
import { headingPaths } from "@/components/ui/icons";
import { Lightbox, type LightboxItem } from "@/components/ui/Lightbox";
import { SectionHeading, SwipeHint } from "@/components/ui/SectionHeading";
import { cssUrl, unique } from "@/lib/utils";
import type { PlantModel, SiteContent } from "@/types/website";

export function Models({ content, ui }: { content: SiteContent["models"]; ui: SiteContent["ui"] }) {
  const categories = unique(content.items.map((model) => model.category));
  const options = [ui.allFilter, ...(categories.length ? categories : content.filters)];
  const [choice, setChoice] = useState(ui.allFilter);
  const selected = options.includes(choice) ? choice : ui.allFilter;
  const [zoomed, setZoomed] = useState<LightboxItem | null>(null);
  const close = useCallback(() => setZoomed(null), []);
  const open = (model: PlantModel) => setZoomed({ src: model.image, title: model.title, text: model.text });
  const visible = content.items.filter((model) => selected === ui.allFilter || model.category === selected);

  return (
    <section className="panel reveal" id="models">
      <SectionHeading icon={headingPaths.models} title={content.title}
        action={<PresetLink division="water" className="btn btn-ghost">{content.button}</PresetLink>} />
      <p className="lede">{content.subtitle}</p>
      <FilterChips options={options} selected={selected} onSelect={setChoice} />
      <div className="cards">
        {visible.map((model) => (
          <article key={`${selected}-${model.title}`} className="card fade" role="button" tabIndex={0} aria-haspopup="dialog"
            onClick={() => open(model)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(model); } }}>
            <div className="im" style={{ backgroundImage: cssUrl(model.image) }} />
            <div className="bd">
              <h4>{model.title}</h4>
              {model.tag && <div><span className="mini lime">{model.tag}</span></div>}
              <p>{model.text}</p>
              <span className="more">{ui.viewDetails}</span>
            </div>
          </article>
        ))}
      </div>
      <SwipeHint label={ui.swipe} />
      <p className="note">{content.note}</p>
      <Lightbox item={zoomed} closeLabel={ui.close} onClose={close} />
    </section>
  );
}
