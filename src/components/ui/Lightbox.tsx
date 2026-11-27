"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export interface LightboxItem { src: string; title: string; text: string }

export function Lightbox({ item, closeLabel, onClose }: { item: LightboxItem | null; closeLabel: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = item !== null;

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      // The close button is the only control, so keep focus on it.
      if (event.key === "Tab") { event.preventDefault(); closeRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      opener?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!item) return null;

  // Portal: the revealed panels use transforms, which would trap a fixed overlay.
  return createPortal(
    <div className="lb show" role="dialog" aria-modal="true" aria-label={item.title}
      onClick={(event) => { event.stopPropagation(); if (event.target === event.currentTarget) onClose(); }}>
      <button ref={closeRef} type="button" className="x" aria-label={closeLabel} onClick={onClose}>✕</button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.src} alt={item.title} />
      <div className="cap">
        <h4>{item.title}</h4>
        <p>{item.text}</p>
      </div>
    </div>,
    document.body,
  );
}
