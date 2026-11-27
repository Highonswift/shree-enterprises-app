import { telHref } from "@/lib/utils";
import type { SiteContent } from "@/types/website";
import { Logo } from "./Logo";

export function Header({ brand }: { brand: SiteContent["brand"] }) {
  return (
    <nav className="nav">
      <div className="wrap">
        <Logo name={brand.name} suffix={brand.suffix} />
        <div className="links">
          <a href={telHref(brand.phone)}>{brand.phone}</a>
          <a href="#contact" className="btn btn-lime">{brand.ctaLabel}</a>
        </div>
      </div>
    </nav>
  );
}
