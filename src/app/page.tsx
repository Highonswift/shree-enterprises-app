import { FloatingActions } from "@/components/common/FloatingActions";
import { RevealObserver } from "@/components/common/RevealObserver";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Tabs } from "@/components/layout/Tabs";
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
import { getContent } from "@/lib/content";

export default function Page() {
  const content = getContent();
  const { ui } = content;
  return (
    <>
      <Header brand={content.brand} />
      <Tabs labels={ui.tabs} />
      <main className="wrap" id="home">
        <Hero hero={content.hero} phone={content.contact.phones[0] || content.brand.phone} ui={ui} />
        <Ticker items={content.ticker} />
        <Promos promos={content.promos} />
        <Capabilities content={content.capabilities} swipeLabel={ui.swipe} />
        <FishMeal content={content.fishmeal} closeLabel={ui.close} />
        <Models content={content.models} ui={ui} />
        <Execution content={content.method} />
        <Products content={content.products} form={content.form} ui={ui} />
        <Clients content={content.clients} allLabel={ui.allFilter} />
        <Contact contact={content.contact} form={content.form} />
      </main>
      <Footer brand={content.brand} footer={content.footer} contact={content.contact} />
      <FloatingActions whatsapp={content.contact.whatsapp} ui={ui} />
      <RevealObserver />
    </>
  );
}
