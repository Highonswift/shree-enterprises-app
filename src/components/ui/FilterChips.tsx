"use client";

import { prefersReducedMotion } from "@/lib/utils";

interface Props { options: string[]; selected: string; onSelect: (option: string) => void }

/** The content row must directly follow this element: selecting a chip scrolls it back to the start. */
export function FilterChips({ options, selected, onSelect }: Props) {
  return (
    <div className="chips">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={option === selected ? "chip on" : "chip"}
          aria-pressed={option === selected}
          onClick={(event) => {
            const chip = event.currentTarget;
            const row = chip.parentElement?.nextElementSibling;
            onSelect(option);
            chip.scrollIntoView({ inline: "nearest", block: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" });
            if (row) row.scrollLeft = 0;
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
