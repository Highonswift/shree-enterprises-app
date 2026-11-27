import { telHref } from "@/lib/utils";
import type { SiteContent } from "@/types/website";
import { EnquiryForm } from "./EnquiryForm";

export function Contact({ contact, form }: Pick<SiteContent, "contact" | "form">) {
  const emails = [
    { heading: contact.epcHeading, email: contact.epcEmail, note: contact.epcNote },
    { heading: contact.waterHeading, email: contact.waterEmail, note: contact.waterNote },
  ];
  return (
    <section className="panel reveal" id="contact" {...contact.edit}>
      <div className="enq">
        <div className="enq-side">
          <div>
            <div className="kicker" style={{ color: "var(--color-accent)" }}>{contact.kicker}</div>
            <h3 style={{ marginTop: 6 }}>{contact.title}</h3>
          </div>
          {emails.map((block, i) => (
            <div key={i} className="blk">
              <b>{block.heading}</b>
              <a href={`mailto:${block.email}`}>{block.email}</a>
              <p>{block.note}</p>
            </div>
          ))}
          <div className="blk">
            <b>{[contact.person, contact.role].filter(Boolean).join(" · ")}</b>
            <div className="ph-row">
              {contact.phones.map((phone, i) => <a key={i} href={telHref(phone)}>{phone}</a>)}
            </div>
          </div>
          <div className="blk">
            <b>{contact.officeHeading}</b>
            <p style={{ opacity: 1 }}>{contact.address}</p>
          </div>
        </div>
        <EnquiryForm contact={contact} form={form} />
      </div>
    </section>
  );
}
