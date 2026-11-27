"use client";

import { useEffect, useRef, useState } from "react";
import { PhoneIcon, SendIcon, SparkleIcon } from "@/components/ui/icons";
import { prefillEnquiry } from "@/lib/enquiry";
import { cssUrl, prefersReducedMotion, telHref } from "@/lib/utils";
import type { Division, SiteContent } from "@/types/website";

/** Types each example into the placeholder: 38 ms per character, 2.2 s pause. */
function useTypedPlaceholder(prompts: string[], fallback: string) {
  const [placeholder, setPlaceholder] = useState("");
  useEffect(() => {
    const list = prompts.length ? prompts : [fallback];
    let prompt = 0, length = 0;
    let timer: ReturnType<typeof setTimeout>;
    const type = () => {
      const text = list[prompt % list.length];
      setPlaceholder(text.slice(0, ++length));
      if (length >= text.length) timer = setTimeout(() => { length = 0; prompt++; type(); }, 2200);
      else timer = setTimeout(type, 38);
    };
    // With reduced motion, show the first example without animating it.
    timer = setTimeout(prefersReducedMotion() ? () => setPlaceholder(list[0]) : type, 0);
    return () => clearTimeout(timer);
  }, [prompts, fallback]);
  return placeholder;
}

export function Hero({ hero, phone, ui }: { hero: SiteContent["hero"]; phone: string; ui: SiteContent["ui"] }) {
  const [division, setDivision] = useState<Division>("epc");
  const [brief, setBrief] = useState("");
  const focusTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const placeholder = useTypedPlaceholder(division === "epc" ? hero.promptsEPC : hero.promptsWater, ui.promptFallback);
  useEffect(() => () => clearTimeout(focusTimer.current), []);

  const send = () => {
    prefillEnquiry({ division, message: brief.trim() || undefined });
    document.getElementById("contact")?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
    focusTimer.current = setTimeout(() => document.getElementById("fName")?.focus(), 600);
  };

  const shade = (alpha: number) => `color-mix(in srgb, var(--color-primary-deep) ${alpha}%, transparent)`;

  return (
    <section className="hero" {...hero.edit}
      style={{ backgroundImage: [`linear-gradient(180deg, ${shade(55)}, ${shade(78)})`, hero.image && cssUrl(hero.image)].filter(Boolean).join(", ") }}>
      <div className="hero-in">
        <div className="hello"><span>{hero.greeting}</span> <em>{hero.greetingHighlight}</em></div>
        <h1>{hero.title}</h1>
        <p className="sub">{hero.subtitle}</p>
        <div className="brief">
          <div className="brief-row">
            <SparkleIcon />
            <textarea aria-label={ui.briefLabel} placeholder={placeholder} value={brief} onChange={(e) => setBrief(e.target.value)} />
          </div>
          <div className="brief-foot">
            <div className="div-toggle">
              {(["epc", "water"] as const).map((key) => (
                <button key={key} type="button" className={division === key ? "on" : undefined} aria-pressed={division === key} onClick={() => setDivision(key)}>
                  {key === "epc" ? ui.divisionEpc : ui.divisionWater}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {phone && (
                <a href={telHref(phone)} className="btn btn-ghost light" style={{ fontSize: 14, padding: "9px 14px" }}>
                  <PhoneIcon />
                  {ui.talk}
                </a>
              )}
              <button type="button" className="send" aria-label={ui.send} onClick={send}><SendIcon /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
