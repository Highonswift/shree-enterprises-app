import { headingPaths } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pad2 } from "@/lib/utils";
import type { SiteContent } from "@/types/website";

export function Execution({ content }: { content: SiteContent["method"] }) {
  return (
    <section className="panel reveal" id="execution">
      <SectionHeading icon={headingPaths.execution} title={content.title} />
      <p className="lede">{content.subtitle}</p>
      <div className="method">
        {content.steps.map((step, i) => (
          <div key={step.title} className="ms">
            <div className="dot">{pad2(i + 1)}</div>
            <h5>{step.title}</h5>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
