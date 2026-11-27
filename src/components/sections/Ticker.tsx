import { DropIcon } from "@/components/ui/icons";

export function Ticker({ items }: { items: string[] }) {
  return (
    <div className="ticker">
      <div className="track">
        {/* Rendered twice for a seamless loop; the copy is hidden from screen readers. */}
        {[...items, ...items].map((item, i) => (
          <span key={i} aria-hidden={i >= items.length || undefined}><DropIcon />{item}</span>
        ))}
      </div>
    </div>
  );
}
