"use client";

import { useEffect } from "react";

/** Fades in each `.reveal` section the first time it scrolls into view. */
export function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal:not(.in)").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }); // after every render, so sections added during live preview are revealed too
  return null;
}
