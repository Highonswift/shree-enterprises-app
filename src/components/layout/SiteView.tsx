import { FloatingActions } from "@/components/common/FloatingActions";
import { RevealObserver } from "@/components/common/RevealObserver";
import { Capabilities } from "@/components/sections/Capabilities";
import { Clients } from "@/components/sections/Clients";
import { Contact } from "@/components/sections/Contact";
import { Execution } from "@/components/sections/Execution";
import { FishMeal } from "@/components/sections/FishMeal";
import { Hero } from "@/components/sections/Hero";
import { Models } from "@/components/sections/Models";
import { Products } from "@/components/sections/Products";
import { Promos } from "@/components/sections/Promos";
import { Ticker } from "@/components/sections/Ticker";
import type { SectionId, SiteContent } from "@/types/website";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Tabs } from "./Tabs";

/** The whole page in its fixed section order. Rendered on the server, and again in the browser during live preview. */
export function SiteView({ content }: { content: SiteContent }) {
  const { ui } = content;
  const hidden: Partial<Record<SectionId, boolean>> = {
    capabilities: content.capabilities.hidden, fishmeal: content.fishmeal.hidden, models: content.models.hidden,
    execution: content.method.hidden, products: content.products.hidden, clients: content.clients.hidden,
    contact: content.contact.hidden,
  };
  const hiddenTabs = (Object.keys(hidden) as SectionId[]).filter((id) => hidden[id]).join();

  return (
    <>
      <Header brand={content.brand} />
      <Tabs labels={ui.tabs} hidden={hiddenTabs} />
      <main className="wrap" id="home">
        {!content.hero.hidden && <Hero hero={content.hero} phone={content.contact.phones[0] || content.brand.phone} ui={ui} />}
        {!content.ticker.hidden && <Ticker ticker={content.ticker} />}
        {!content.promos.hidden && <Promos promos={content.promos} />}
        {!content.capabilities.hidden && <Capabilities content={content.capabilities} swipeLabel={ui.swipe} />}
        {!content.fishmeal.hidden && <FishMeal content={content.fishmeal} closeLabel={ui.close} />}
        {!content.models.hidden && <Models content={content.models} ui={ui} />}
        {!content.method.hidden && <Execution content={content.method} />}
        {!content.products.hidden && <Products content={content.products} form={content.form} ui={ui} />}
        {!content.clients.hidden && <Clients content={content.clients} allLabel={ui.allFilter} />}
        {!content.contact.hidden && <Contact contact={content.contact} form={content.form} />}
      </main>
      {!content.footer.hidden && <Footer brand={content.brand} footer={content.footer} contact={content.contact} />}
      <FloatingActions whatsapp={content.contact.whatsapp} ui={ui} />
      <RevealObserver />
    </>
  );
}
