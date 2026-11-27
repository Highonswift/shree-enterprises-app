"use client";

import { useState } from "react";
import { headingPaths } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { prefillEnquiry } from "@/lib/enquiry";
import type { SiteContent } from "@/types/website";

interface Props { content: SiteContent["products"]; form: SiteContent["form"]; ui: SiteContent["ui"] }

export function Products({ content, form, ui }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = openIndex === null ? undefined : content.items[openIndex];

  return (
    <section className="panel reveal" id="products" {...content.edit}>
      <SectionHeading icon={headingPaths.products} title={content.title} />
      <p className="lede">{content.subtitle}</p>
      <div className="prod-grid">
        {content.items.map((product, i) => (
          <button key={i} {...product.edit} type="button" className={product === open ? "prod on" : "prod"} aria-expanded={product === open}
            onClick={() => setOpenIndex(product === open ? null : i)}>
            <div className="pi">
              {/* Plain img keeps the original intrinsic sizing. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {product.image && <img src={product.image} alt={product.name} loading="lazy" />}
            </div>
            <h5>{product.name}</h5>
            <span>{product.items.length || product.missingItemCount || 0} {ui.itemsSuffix}</span>
          </button>
        ))}
      </div>
      <div className={open ? "prod-detail show" : "prod-detail"} aria-live="polite">
        {open && (
          <>
            <h5>{open.name}</h5>
            <div className="pills">{open.items.map((item, i) => <span key={i}>{item}</span>)}</div>
            <a href="#contact" className="btn btn-lime" style={{ marginTop: 14 }}
              onClick={() => prefillEnquiry({ division: "water", scope: form.productScope, message: `${form.productMessage}${open.name} — ` })}>
              {ui.enquireAbout}{open.name.toLowerCase()} →
            </a>
          </>
        )}
      </div>
    </section>
  );
}
