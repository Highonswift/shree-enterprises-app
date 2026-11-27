import type { ReactNode, SVGProps } from "react";
import type { SectionId } from "@/types/website";

// The original site's own SVG paths. Lucide's versions of most of these differ in shape,
// so they are kept as they are. Lucide is used only where it matches.
type IconProps = SVGProps<SVGSVGElement> & { size: number; children: ReactNode };

export function Icon({ size, children, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export const tabPaths: Record<SectionId, ReactNode> = {
  home: <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  capabilities: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>,
  fishmeal: <path d="M2 12s4-6 11-6c4 0 7 3 9 6-2 3-5 6-9 6-7 0-11-6-11-6z" />,
  models: <path d="M3 21h18M5 21V9l7-5 7 5v12" />,
  execution: <path d="M4 12h16M14 6l6 6-6 6" />,
  products: <path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8" />,
  clients: <><circle cx="9" cy="7" r="4" /><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /></>,
  contact: <><path d="M4 4h16v16H4z" /><path d="M4 6l8 7 8-7" /></>,
};

export const headingPaths = {
  capabilities: tabPaths.capabilities,
  models: <path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6" />,
  execution: tabPaths.execution,
  products: tabPaths.products,
  clients: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
};

export const SparkleIcon = () => (
  <Icon size={22} stroke="var(--color-white)" strokeWidth={1.8} style={{ marginTop: 4, opacity: 0.85 }}>
    <path d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 16l-1.8-4.8L6 9.4l4.2-1.8z" />
    <path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
  </Icon>
);

export const PhoneIcon = () => (
  <Icon size={16} stroke="var(--color-accent)" strokeWidth={2}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
  </Icon>
);

export const SendIcon = () => (
  <Icon size={18} stroke="var(--color-white)">
    <path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4z" />
  </Icon>
);

export const DropIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--color-accent)" aria-hidden="true">
    <path d="M12 2s7 7.6 7 12.5A7 7 0 0 1 5 14.5C5 9.6 12 2 12 2z" />
  </svg>
);

export const WhatsAppIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="var(--color-white)" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.7-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.2-.2-.5-.3z" />
  </svg>
);
