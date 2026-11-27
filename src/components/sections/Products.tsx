"use client";

import { useState } from "react";
import { headingPaths } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { prefillEnquiry } from "@/lib/enquiry";
import type { SiteContent } from "@/types/website";

interface Props { content: SiteContent["products"]; form: SiteContent["form"]; ui: SiteContent["ui"] }

export function Products({ content, form, ui }: Props) {
  const [openName, setOpenName] = useState<string | null>(null);
  const open = content.items.find((product) => product.name === openName);

  return (
    <section className="panel reveal" id="products">
      <SectionHeading icon={headingPaths.products} title={content.title} />
      <p className="lede">{content.subtitle}</p>
      <div className="prod-grid">
        {content.items.map((product) => (
          <button key={product.name} type="button" className={product === open ? "prod on" : "prod"} aria-expanded={product === open}
            onClick={() => setOpenName(product === open ? null : product.name)}>
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
            <div className="pills">{open.items.map((item) => <span key={item}>{item}</span>)}</div>
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
