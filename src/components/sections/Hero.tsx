import { cssUrl } from "@/lib/utils";
import type { SiteContent } from "@/types/website";

export function Hero({ hero }: { hero: SiteContent["hero"] }) {
  const shade = (alpha: number) => `color-mix(in srgb, var(--color-primary-deep) ${alpha}%, transparent)`;

  return (
    <section className="hero" {...hero.edit}
      style={{ backgroundImage: [`linear-gradient(180deg, ${shade(55)}, ${shade(78)})`, hero.image && cssUrl(hero.image)].filter(Boolean).join(", ") }}>
      <div className="hero-in">
        <div className="hello"><span>{hero.greeting}</span> <em>{hero.greetingHighlight}</em></div>
        <h1>{hero.title}</h1>
        <p className="sub">{hero.subtitle}</p>
      </div>
    </section>
  );
}
