import type { SiteContent } from "@/types/website";
import { Logo } from "./Logo";

export function Footer({ brand, footer, contact }: Pick<SiteContent, "brand" | "footer" | "contact">) {
  return (
    <footer>
      <div className="wrap">
        <div className="fgrid">
          <div>
            <Logo name={brand.name} suffix={brand.suffix} />
            <p style={{ marginTop: 12, fontSize: 15, maxWidth: 320 }}>{footer.about}</p>
          </div>
          {footer.columns.map((column) => (
            <div key={column.heading}>
              <h6>{column.heading}</h6>
              <ul>
                {column.links.map((item) => <li key={item.label}><a href={item.link}>{item.label}</a></li>)}
              </ul>
            </div>
          ))}
          <div>
            <h6>{footer.contactHeading}</h6>
            <ul>
              {[...contact.phones, contact.city].map((line) => <li key={line}>{line}</li>)}
            </ul>
          </div>
        </div>
        <div className="fbot">
          <span>© <span>{new Date().getFullYear()}</span> {footer.copyrightName} · <span>{footer.tagline}</span></span>
          <span>{footer.disclaimer}</span>
        </div>
      </div>
    </footer>
  );
}
