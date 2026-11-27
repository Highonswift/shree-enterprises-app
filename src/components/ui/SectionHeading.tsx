import type { ReactNode } from "react";
import { Icon } from "./icons";

export function SectionHeading({ icon, title, action }: { icon: ReactNode; title: string; action?: ReactNode }) {
  return (
    <div className="ph">
      <h2>
        <span className="ic">
          <Icon size={18} stroke="var(--color-accent-text)">{icon}</Icon>
        </span>
        <span>{title}</span>
      </h2>
      {action}
    </div>
  );
}

export function SwipeHint({ label }: { label: string }) {
  return (
    <div className="swipe-hint">
      <Icon size={16} strokeWidth={2}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>
      {label}
    </div>
  );
}
