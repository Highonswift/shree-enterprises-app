"use client";

import emailjs from "@emailjs/browser";
import { LoaderCircle } from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";
import { onEnquiryPrefill } from "@/lib/enquiry";
import { prefersReducedMotion } from "@/lib/utils";
import type { Division, SiteContent } from "@/types/website";

interface Props { contact: SiteContent["contact"]; form: SiteContent["form"] }

// Public EmailJS identifiers, built into the page. The recipient of a sent enquiry is set in the EmailJS template.
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_PROJECT_TEMPLATE;

/** Used only by "Open in mail app" when sending fails. */
const FALLBACK_EMAIL = "rajkumar.bic.2026@gmail.com";
const SUBJECT = "New Project Enquiry – Shree Enterprises";

// Wording for the fields and states that are not part of the Storyblok content.
const TEXT = {
  projectType: "Project Type",
  name: "Name",
  company: "Company (optional)",
  email: "Email",
  phone: "Phone",
  namePlaceholder: "Your name",
  companyPlaceholder: "Company name",
  emailPlaceholder: "you@example.com",
  submit: "Send enquiry →",
  sending: "Sending…",
  successTitle: "Enquiry sent",
  success: "Thank you. We have received your project enquiry.",
  errorTitle: "Your enquiry was not sent",
  error: `Your details are still in the form. Try again, or copy the enquiry below and email it to ${FALLBACK_EMAIL}.`,
  tooSoon: `Please wait a few seconds before trying again, or copy the enquiry below and email it to ${FALLBACK_EMAIL}.`,
  required: "This field is required.",
  invalidEmail: "Enter a valid email address.",
  tooLong: (max: number) => `Use no more than ${max} characters.`,
};

const REQUIRED = ["division", "name", "email", "phone", "message"] as const;
const MAX_LENGTH = { name: 100, company: 150, email: 254, phone: 30, location: 150, capacity: 150, message: 3000 };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Key = "division" | "scope" | keyof typeof MAX_LENGTH;
type Values = Record<Key, string>;
type Errors = Partial<Record<Key, string>>;
type Status = "idle" | "sending" | "sent" | "failed" | "tooSoon";

function validate(values: Values) {
  const errors: Errors = {};
  for (const key of REQUIRED) if (!values[key].trim()) errors[key] = TEXT.required;
  for (const [key, max] of Object.entries(MAX_LENGTH) as [keyof typeof MAX_LENGTH, number][]) {
    if (!errors[key] && values[key].trim().length > max) errors[key] = TEXT.tooLong(max);
  }
  if (!errors.email && !EMAIL_PATTERN.test(values.email.trim())) errors.email = TEXT.invalidEmail;
  return errors;
}

export function EnquiryForm({ contact, form }: Props) {
  const initialValues = (): Values => ({
    division: "epc", name: "", company: "", email: "", phone: "", location: "", capacity: "", scope: form.scopes[0] ?? "", message: "",
  });
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [copyState, setCopyState] = useState<"copy" | "copied" | "copyFailed">("copy");
  const output = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Blocks a second submission before the disabled button has rendered.
  const sending = useRef(false);

  useEffect(() => onEnquiryPrefill((prefill) => {
    if (sending.current) return;
    setValues((current) => ({
      ...current,
      ...(prefill.division && { division: prefill.division }),
      ...(prefill.scope && { scope: prefill.scope }),
      ...(prefill.message && { message: prefill.message }),
    }));
    setErrors((current) => (prefill.message ? { ...current, message: undefined } : current));
    setStatus("idle");
  }), []);
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  useEffect(() => {
    if (status !== "idle" && status !== "sending") {
      output.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "nearest" });
    }
  }, [status]);

  // Follows the option list if editors change it during live preview.
  const scope = form.scopes.includes(values.scope) ? values.scope : (form.scopes[0] ?? "");
  const isSending = status === "sending";
  const failed = status === "failed" || status === "tooSoon";

  const field = (key: Key) => ({
    value: key === "scope" ? scope : values[key],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setValues((current) => ({ ...current, [key]: value }));
      setErrors((current) => ({ ...current, [key]: undefined }));
      if (status === "sent") setStatus("idle");
    },
  });
  /** Validation attributes for a field; `id` must match the field's element. */
  const checked = (key: Key, id: string) => ({
    required: (REQUIRED as readonly string[]).includes(key),
    maxLength: key in MAX_LENGTH ? MAX_LENGTH[key as keyof typeof MAX_LENGTH] : undefined,
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `${id}Error` : undefined,
    style: errors[key] ? { borderColor: "var(--color-error)" } : undefined,
  });
  const errorText = (key: Key, id: string) => errors[key] && (
    <p id={`${id}Error`} style={{ color: "var(--color-error)", fontSize: 13, marginTop: 4 }}>{errors[key]}</p>
  );

  // The enquiry as text, for the copy and mail app options. Always matches what is in the form.
  const division = form.divisions[values.division as Division];
  const label = form.body;
  const body = [
    `${label.heading}${division}`,
    "",
    `${TEXT.name}: ${values.name.trim()}`,
    `Company: ${values.company.trim() || "-"}`,
    `${TEXT.email}: ${values.email.trim()}`,
    `${TEXT.phone}: ${values.phone.trim()}`,
    `${label.location}: ${values.location.trim() || "-"}`,
    `${label.capacity}: ${values.capacity.trim() || "-"}`,
    `${label.scope}: ${scope}`,
    "",
    `${label.details}:`,
    values.message.trim(),
  ].join("\n");
  const mailto = `mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(body)}`;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending.current) return;
    const problems = validate(values);
    setErrors(problems);
    if (Object.keys(problems).length) {
      setStatus("idle");
      event.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(problems)[0]}"]`)?.focus();
      return;
    }
    sending.current = true;
    setStatus("sending");
    try {
      if (!SERVICE_ID || !PUBLIC_KEY || !TEMPLATE_ID) throw new Error("EmailJS is not configured. Set the NEXT_PUBLIC_EMAILJS_ variables.");
      // These names must match the variables in the EmailJS template.
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: values.name.trim(),
        company: values.company.trim() || "-",
        reply_to: values.email.trim(),
        phone: values.phone.trim(),
        project_type: division,
        scope,
        capacity: values.capacity.trim() || "-",
        location: values.location.trim() || "-",
        message: values.message.trim(),
      }, { publicKey: PUBLIC_KEY, limitRate: { id: "project-enquiry", throttle: 10000 } });
      setValues(initialValues());
      setStatus("sent");
    } catch (error) {
      // EmailJS rejects with { status, text }; log both so the reason is readable.
      const { status: code, text } = error as { status?: number; text?: string };
      console.error("Enquiry email failed:", text ? `${code} ${text}` : error);
      setStatus(code === 429 ? "tooSoon" : "failed");
    } finally {
      sending.current = false;
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopyState("copied");
    } catch {
      setCopyState("copyFailed");
    }
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyState("copy"), 2500);
  };

  return (
    <form noValidate onSubmit={submit} aria-busy={isSending} {...form.edit}>
      <h3 style={{ color: "var(--color-primary)", fontSize: 24, marginBottom: 4 }}>{contact.formTitle}</h3>
      <p className="lede" style={{ marginBottom: 18 }}>{contact.formSubtitle}</p>
      {/* Locks every field while sending; "contents" leaves the layout unchanged. */}
      <fieldset disabled={isSending} style={{ display: "contents" }}>
        <div className="row">
          <div>
            <label htmlFor="fDiv">{TEXT.projectType}</label>
            <select id="fDiv" name="division" {...field("division")} {...checked("division", "fDiv")}>
              <option value="epc">{form.divisions.epc}</option>
              <option value="water">{form.divisions.water}</option>
            </select>
            {errorText("division", "fDiv")}
          </div>
          <div>
            <label htmlFor="fName">{TEXT.name}</label>
            <input id="fName" name="name" autoComplete="name" placeholder={TEXT.namePlaceholder} {...field("name")} {...checked("name", "fName")} />
            {errorText("name", "fName")}
          </div>
        </div>
        <div className="row">
          <div>
            <label htmlFor="fCompany">{TEXT.company}</label>
            <input id="fCompany" name="company" autoComplete="organization" placeholder={TEXT.companyPlaceholder} {...field("company")} {...checked("company", "fCompany")} />
            {errorText("company", "fCompany")}
          </div>
          <div>
            <label htmlFor="fEmail">{TEXT.email}</label>
            <input id="fEmail" name="email" type="email" autoComplete="email" placeholder={TEXT.emailPlaceholder} {...field("email")} {...checked("email", "fEmail")} />
            {errorText("email", "fEmail")}
          </div>
        </div>
        <div className="row">
          <div>
            <label htmlFor="fPhone">{TEXT.phone}</label>
            <input id="fPhone" name="phone" type="tel" autoComplete="tel" placeholder={form.placeholders.phone} {...field("phone")} {...checked("phone", "fPhone")} />
            {errorText("phone", "fPhone")}
          </div>
          <div>
            <label htmlFor="fLoc">{form.labels.location}</label>
            <input id="fLoc" name="location" placeholder={form.placeholders.location} {...field("location")} {...checked("location", "fLoc")} />
            {errorText("location", "fLoc")}
          </div>
        </div>
        <div className="row">
          <div>
            <label htmlFor="fCap">{form.labels.capacity}</label>
            <input id="fCap" name="capacity" placeholder={form.placeholders.capacity} {...field("capacity")} {...checked("capacity", "fCap")} />
            {errorText("capacity", "fCap")}
          </div>
          <div>
            <label htmlFor="fScope">{form.labels.scope}</label>
            <select id="fScope" name="scope" {...field("scope")}>
              {form.scopes.map((option, i) => <option key={i}>{option}</option>)}
            </select>
          </div>
        </div>
        <div className="full">
          <label htmlFor="fMsg">{form.labels.message}</label>
          <textarea id="fMsg" name="message" {...field("message")} {...checked("message", "fMsg")} />
          {errorText("message", "fMsg")}
        </div>
        <button className="btn btn-lime" type="submit" style={{ fontSize: 16, padding: "12px 22px", ...(isSending && { opacity: 0.75, cursor: "wait" }) }}>
          {isSending && <LoaderCircle size={18} className="animate-spin motion-reduce:animate-none" aria-hidden />}
          {isSending ? TEXT.sending : TEXT.submit}
        </button>
      </fieldset>
      <div ref={output} className={status === "sent" || failed ? "out show" : "out"} role="status">
        {status === "sent" && (
          <>
            <strong style={{ color: "var(--color-primary)" }}>{TEXT.successTitle}</strong>
            <p>{TEXT.success}</p>
          </>
        )}
        {failed && (
          <>
            <strong style={{ color: "var(--color-error)" }}>{TEXT.errorTitle}</strong>
            <p style={{ overflowWrap: "anywhere" }}>{status === "tooSoon" ? TEXT.tooSoon : TEXT.error}</p>
            <pre style={{ overflowWrap: "anywhere" }}>{body}</pre>
            <div className="acts">
              <button type="button" className="btn btn-lime" onClick={copy}>{form[copyState]}</button>
              <a className="btn btn-ghost" href={mailto}>{form.openMail}</a>
            </div>
          </>
        )}
      </div>
    </form>
  );
}
