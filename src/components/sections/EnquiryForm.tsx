"use client";

import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";
import { onEnquiryPrefill } from "@/lib/enquiry";
import { prefersReducedMotion } from "@/lib/utils";
import type { Division, SiteContent } from "@/types/website";

interface Props { contact: SiteContent["contact"]; form: SiteContent["form"] }
interface Enquiry { body: string; to: string; mailto: string }

/** Prepares an enquiry to copy or open in the visitor's mail app. Nothing is sent to a server. */
export function EnquiryForm({ contact, form }: Props) {
  const [values, setValues] = useState({
    division: "epc", name: "", phone: "", location: "", capacity: "", scope: form.scopes[0] ?? "", message: "",
  });
  const [invalid, setInvalid] = useState({ name: false, phone: false });
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [copyState, setCopyState] = useState<"copy" | "copied" | "copyFailed">("copy");
  const output = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => onEnquiryPrefill((prefill) => setValues((current) => ({
    ...current,
    ...(prefill.division && { division: prefill.division }),
    ...(prefill.scope && { scope: prefill.scope }),
    ...(prefill.message && { message: prefill.message }),
  }))), []);
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  useEffect(() => {
    if (enquiry) output.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "nearest" });
  }, [enquiry]);

  const field = (key: keyof typeof values) => ({
    value: values[key],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setValues((current) => ({ ...current, [key]: value }));
    },
  });
  const required = (key: "name" | "phone") => ({
    required: true,
    "aria-invalid": invalid[key],
    style: invalid[key] ? { borderColor: "var(--color-error)" } : undefined,
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const bad = { name: !values.name.trim(), phone: !values.phone.trim() };
    setInvalid(bad);
    if (bad.name || bad.phone) return;
    const division = values.division as Division;
    const to = division === "epc" ? contact.epcEmail : contact.waterEmail;
    const label = form.body;
    const body = [
      `${label.heading}${form.divisions[division]}`,
      "",
      `${label.name}: ${values.name}`,
      `${label.contact}: ${values.phone}`,
      `${label.location}: ${values.location || "-"}`,
      `${label.capacity}: ${values.capacity || "-"}`,
      `${label.scope}: ${values.scope}`,
      "",
      `${label.details}:`,
      values.message || "-",
    ].join("\n");
    const mailto = `mailto:${to}?subject=${encodeURIComponent(form.mailSubject + values.name)}&body=${encodeURIComponent(body)}`;
    setEnquiry({ body, to, mailto });
  };

  const copy = async () => {
    if (!enquiry) return;
    try {
      await navigator.clipboard.writeText(enquiry.body);
      setCopyState("copied");
    } catch {
      setCopyState("copyFailed");
    }
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyState("copy"), 2500);
  };

  return (
    <form noValidate onSubmit={submit}>
      <h3 style={{ color: "var(--color-primary)", fontSize: 24, marginBottom: 4 }}>{contact.formTitle}</h3>
      <p className="lede" style={{ marginBottom: 18 }}>{contact.formSubtitle}</p>
      <div className="row">
        <div>
          <label htmlFor="fDiv">{form.labels.division}</label>
          <select id="fDiv" {...field("division")}>
            <option value="epc">{form.divisions.epc}</option>
            <option value="water">{form.divisions.water}</option>
          </select>
        </div>
        <div>
          <label htmlFor="fName">{form.labels.name}</label>
          <input id="fName" placeholder={form.placeholders.name} {...field("name")} {...required("name")} />
        </div>
      </div>
      <div className="row">
        <div>
          <label htmlFor="fPhone">{form.labels.phone}</label>
          <input id="fPhone" placeholder={form.placeholders.phone} {...field("phone")} {...required("phone")} />
        </div>
        <div>
          <label htmlFor="fLoc">{form.labels.location}</label>
          <input id="fLoc" placeholder={form.placeholders.location} {...field("location")} />
        </div>
      </div>
      <div className="row">
        <div>
          <label htmlFor="fCap">{form.labels.capacity}</label>
          <input id="fCap" placeholder={form.placeholders.capacity} {...field("capacity")} />
        </div>
        <div>
          <label htmlFor="fScope">{form.labels.scope}</label>
          <select id="fScope" {...field("scope")}>
            {form.scopes.map((scope) => <option key={scope}>{scope}</option>)}
          </select>
        </div>
      </div>
      <div className="full">
        <label htmlFor="fMsg">{form.labels.message}</label>
        <textarea id="fMsg" {...field("message")} />
      </div>
      <button className="btn btn-lime" type="submit" style={{ fontSize: 16, padding: "12px 22px" }}>{form.submit}</button>
      <div ref={output} className={enquiry ? "out show" : "out"} role="status">
        {enquiry && (
          <>
            <strong style={{ color: "var(--color-primary)" }}>{form.readyTitle}</strong>
            {form.readyBeforeEmail}<span>{enquiry.to}</span>{form.readyAfterEmail}
            <pre>{enquiry.body}</pre>
            <div className="acts">
              <button type="button" className="btn btn-lime" onClick={copy}>{form[copyState]}</button>
              <a className="btn btn-ghost" href={enquiry.mailto}>{form.openMail}</a>
            </div>
          </>
        )}
      </div>
    </form>
  );
}
