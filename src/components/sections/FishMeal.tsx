import { PresetLink } from "@/components/common/PresetLink";
import { pad2 } from "@/lib/utils";
import type { SiteContent } from "@/types/website";
import { FishMealFigure } from "./FishMealFigure";

export function FishMeal({ content, closeLabel }: { content: SiteContent["fishmeal"]; closeLabel: string }) {
  return (
    <section className="panel reveal" id="fishmeal">
      <div className="feature">
        <div>
          <FishMealFigure src={content.image} title={content.title} caption={content.caption} closeLabel={closeLabel} />
          <figcaption>{content.caption}</figcaption>
        </div>
        <div>
          <div className="kicker">{content.kicker}</div>
          <h2 style={{ fontSize: 30, color: "var(--color-primary)", lineHeight: 1.15, margin: "8px 0 10px" }}>{content.title}</h2>
          <p style={{ color: "var(--color-text-muted)" }}>{content.text}</p>
          <div className="stats">
            {content.stats.map((stat) => (
              <div key={stat.label} className="stat">
                <div className="v">{stat.value}<small>{stat.unit}</small></div>
                <div className="l">{stat.label}</div>
              </div>
            ))}
          </div>
          <PresetLink division="epc" className="btn btn-lime">{content.button}</PresetLink>
        </div>
      </div>
      <h3 style={{ color: "var(--color-primary)", fontSize: 20, margin: "30px 0 14px" }}>{content.flowTitle}</h3>
      <div className="flow">
        {content.flow.map((step, i) => <div key={i} className="step"><b>{pad2(i + 1)}</b>{step}</div>)}
      </div>
    </section>
  );
}
