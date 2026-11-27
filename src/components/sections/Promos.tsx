import type { CSSProperties } from "react";
import { cssUrl } from "@/lib/utils";
import type { SiteContent } from "@/types/website";

export function Promos({ promos }: { promos: SiteContent["promos"] }) {
  return (
    <section className="promos" id="promos" {...promos.edit}>
      {promos.items.map((promo, i) => (
        <a key={i} {...promo.edit} href={promo.link} className="promo"
          style={{ "--pc": promo.color || "var(--color-promo-epc)", "--pi": promo.image ? cssUrl(promo.image) : "none" } as CSSProperties}>
          <div>
            <span className="tag">{promo.tag}</span>
            <h3>{promo.title}</h3>
            <p>{promo.text}</p>
          </div>
          <span className="btn btn-lime" style={{ alignSelf: "flex-start" }}>{promo.button}</span>
        </a>
      ))}
    </section>
  );
}
