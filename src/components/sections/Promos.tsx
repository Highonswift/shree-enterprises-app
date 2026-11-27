import type { CSSProperties } from "react";
import { cssUrl } from "@/lib/utils";
import type { Promo } from "@/types/website";

export function Promos({ promos }: { promos: Promo[] }) {
  return (
    <section className="promos" id="promos">
      {promos.map((promo) => (
        <a key={promo.title} href={promo.link} className="promo"
          style={{ "--pc": promo.color || "var(--color-promo-epc)", "--pi": cssUrl(promo.image) } as CSSProperties}>
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
