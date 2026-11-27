import { DropIcon } from "@/components/ui/icons";
import type { SiteContent } from "@/types/website";

export function Ticker({ ticker }: { ticker: SiteContent["ticker"] }) {
  const { items } = ticker;
  return (
    <div className="ticker" {...ticker.edit}>
      <div className="track">
        {/* Rendered twice for a seamless loop; the copy is hidden from screen readers. */}
        {[...items, ...items].map((item, i) => (
          <span key={i} aria-hidden={i >= items.length || undefined}><DropIcon />{item}</span>
        ))}
      </div>
    </div>
  );
}
