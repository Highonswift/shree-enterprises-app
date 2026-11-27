"use client";

import { useCallback, useState } from "react";
import { Lightbox } from "@/components/ui/Lightbox";

interface Props { src: string; title: string; caption: string; closeLabel: string }

export function FishMealFigure({ src, title, caption, closeLabel }: Props) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <figure role="button" tabIndex={0} aria-haspopup="dialog" onClick={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true); } }}>
        {/* Plain img keeps the original intrinsic sizing. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={title} />
      </figure>
      <Lightbox item={open ? { src, title, text: caption } : null} closeLabel={closeLabel} onClose={close} />
    </>
  );
}
