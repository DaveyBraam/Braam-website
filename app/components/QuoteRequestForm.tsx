"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

type ServiceId = "cv-ketel" | "warmtepomp" | "airco" | "elektra" | "onderhoud" | "anders";
type FormStatus = "idle" | "sending" | "success" | "error";

const services: Array<{ id: ServiceId; title: string; description: string }> = [
  { id: "cv-ketel", title: "Cv-ketel", description: "Vervangen, installeren of advies" },
  { id: "warmtepomp", title: "Warmtepomp", description: "Hybride of volledig elektrisch" },
  { id: "airco", title: "Airconditioning", description: "Koelen en gericht verwarmen" },
  { id: "elektra", title: "Elektra", description: "Groepenkast, extra groep of aansluiting" },
  { id: "onderhoud", title: "Onderhoud", description: "Eenmalig of een abonnement" },
  { id: "anders", title: "Iets anders", description: "Beschrijf hieronder uw situatie" },
];

const serviceIds = new Set<ServiceId>(services.map((service) => service.id));
const trackingKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"];

export function QuoteRequestForm() {
  const searchParams = useSearchParams();
  const requestedService = searchParams.get("dienst") as ServiceId | null;
  const [service, setService] = useState<ServiceId>(requestedService && serviceIds.has(requestedService) ? requestedService : "cv-ketel");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const selectedService = services.find((item) => item.id === service) ?? services[0];
  const recipient = service === "onderhoud" ? "planning@robbraam.com" : "service@robbraam.com";
  const recipientLabel = service === "onderhoud" ? "onze planning" : "ons serviceteam";

  const submitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setStatus("sending");
    setErrorMessage("");

    const formData = new FormData(form);
    formData.set("Gekozen dienst", selectedService.title);
    formData.set("Herkomstpagina", document.referrer || "Rechtstreeks of onbekend");
    trackingKeys.forEach((key) => {
      const value = searchParams.get(key);
      if (value) formData.set(key, value);
    });
    formData.set("Bestemd voor", recipient);
    formData.set("_subject", service === "onderhoud" ? "Nieuwe onderhoudsaanvraag" : `Nieuwe offerteaanvraag: ${selectedService.title}`);
    formData.set("_template", "table");
    formData.set("_captcha", "false");

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const result = await response.json().catch(() => null) as { success?: boolean | string; message?: string } | null;
      const succeeded = response.ok && (result?.success === true || result?.success === "true");
      if (!succeeded) throw new Error(result?.message || "De aanvraag kon niet worden verzonden.");
      setStatus("success");
      window.location.assign(`/bedankt?type=offerte&dienst=${encodeURIComponent(service)}`);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "De aanvraag kon niet worden verzonden. Probeer het opnieuw of bel ons.");
    }
  };

  if (status === "success") {
    return <section className="application-success" aria-live="polite"><div className="success-orbit" aria-hidden="true"><span>✓</span></div><p className="eyebrow"><span /> Aanvraag ontvangen</p><h1>Bedankt.<br /><em>We bekijken uw situatie.</em></h1><p>Uw aanvraag over <strong>{selectedService.title.toLowerCase()}</strong> is bij {recipientLabel} binnengekomen. We beoordelen uw gegevens en nemen persoonlijk contact met u op over de beste vervolgstap.</p><div className="success-actions"><Link className="button button-primary" href="/">Terug naar de homepage <span aria-hidden="true">→</span></Link><a href="tel:+31736222199">Liever bellen? 073 622 2199</a></div></section>;
  }

  return <form className="subscription-application-form quote-request-form" onSubmit={submitRequest} noValidate>
    <input type="text" name="_honey" className="form-honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <section className="form-section"><div className="form-section-heading"><span>01</span><div><h2>Waar kunnen we mee helpen?</h2><p>Kies de dienst die het beste aansluit. U hoeft de technische oplossing nog niet zelf te kennen.</p></div></div><div className="quote-service-grid">{services.map((item) => <label className={service === item.id ? "quote-service-choice is-selected" : "quote-service-choice"} key={item.id}><input type="radio" name="Dienstkeuze" value={item.title} checked={service === item.id} onChange={() => setService(item.id)} /><span className="choice-radio" aria-hidden="true" /><span><strong>{item.title}</strong><small>{item.description}</small></span></label>)}</div></section>

    <section className="form-section"><div className="form-section-heading"><span>02</span><div><h2>Vertel kort over uw situatie</h2><p>Met een paar concrete gegevens kunnen we uw aanvraag meteen bij de juiste collega leggen.</p></div></div><div className="field-grid">
      {service === "cv-ketel" && <><label className="field"><span>Wat wilt u laten doen? <b>*</b></span><select name="Gewenst werk" defaultValue="Vervangen" required><option>Vervangen</option><option>Nieuwe installatie</option><option>Advies</option><option>Anders</option></select></label><label className="field"><span>Huidig merk en model</span><input type="text" name="Huidige cv-ketel" placeholder="Voor zover bekend" /></label></>}
      {service === "warmtepomp" && <><label className="field"><span>Waar denkt u aan?</span><select name="Soort warmtepomp" defaultValue="Weet ik nog niet"><option>Weet ik nog niet</option><option>Hybride warmtepomp</option><option>Volledig elektrische warmtepomp</option></select></label><label className="field"><span>Huidige verwarming</span><input type="text" name="Huidige verwarming" placeholder="Bijvoorbeeld cv-ketel en radiatoren" /></label></>}
      {service === "airco" && <><label className="field"><span>Aantal ruimtes</span><input type="number" name="Aantal ruimtes" min="1" inputMode="numeric" placeholder="Bijvoorbeeld 2" /></label><label className="field"><span>Gebruik</span><select name="Airco gebruik" defaultValue="Koelen en verwarmen"><option>Koelen en verwarmen</option><option>Vooral koelen</option><option>Vooral verwarmen</option></select></label></>}
      {service === "elektra" && <label className="field field-wide"><span>Soort elektrawerk</span><select name="Soort elektrawerk" defaultValue="Groepenkast"><option>Groepenkast</option><option>Extra groep of aansluiting</option><option>Aansluiting voor warmtepomp of airco</option><option>Anders</option></select></label>}
      {service === "onderhoud" && <label className="field field-wide"><span>Soort onderhoud</span><select name="Soort onderhoud" defaultValue="Ik wil advies"><option>Ik wil advies</option><option>Eenmalige onderhoudsbeurt</option><option>Onderhoudsabonnement</option><option>Bestaand abonnement</option></select></label>}
      <label className="field field-wide"><span>Uw vraag of situatie <b>*</b></span><textarea name="Omschrijving" rows={6} placeholder="Vertel kort wat u wilt laten doen, wat er nu aanwezig is en of er bijzonderheden zijn." required /></label>
    </div></section>

    <section className="form-section"><div className="form-section-heading"><span>03</span><div><h2>Hoe kunnen we u bereiken?</h2><p>We gebruiken deze gegevens alleen om uw aanvraag te beoordelen en contact met u op te nemen.</p></div></div><div className="field-grid"><label className="field field-wide"><span>Naam <b>*</b></span><input type="text" name="Naam" autoComplete="name" required /></label><label className="field"><span>Postcode <b>*</b></span><input type="text" name="Postcode" autoComplete="postal-code" required /></label><label className="field"><span>Huisnummer</span><input type="text" name="Huisnummer" autoComplete="address-line2" /></label><label className="field"><span>E-mailadres <b>*</b></span><input type="email" name="email" autoComplete="email" required /></label><label className="field"><span>Telefoonnummer <b>*</b></span><input type="tel" name="Telefoonnummer" autoComplete="tel" required /></label></div></section>

    <div className="form-submit-panel"><label className="privacy-check"><input type="checkbox" name="Privacyverklaring gelezen" value="Ja" required /><span aria-hidden="true" /><small>Ik heb de <Link href="/privacy">privacyverklaring</Link> gelezen en begrijp dat Braam mijn gegevens gebruikt om deze aanvraag te beoordelen en hierover contact met mij op te nemen. <b>*</b></small></label>{status === "error" && <p className="form-error" role="alert">{errorMessage} U kunt ook bellen via <a href="tel:+31736222199">073 622 2199</a>.</p>}<button className="button button-primary form-submit-button" type="submit" disabled={status === "sending"}>{status === "sending" ? "Aanvraag wordt verzonden…" : "Verstuur mijn aanvraag"}<span aria-hidden="true">→</span></button><p className="form-smallprint">Dit is een aanvraag en nog geen opdracht. We bekijken eerst uw gegevens en nemen daarna contact op over de vervolgstap.</p></div>
  </form>;
}
