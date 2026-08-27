"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

type CallbackTopic = "werk" | "onderhoud" | "storing";
type FormStatus = "idle" | "sending" | "error";

const callbackTopics: Array<{ id: CallbackTopic; title: string; description: string }> = [
  { id: "werk", title: "Nieuwe installatie of offerte", description: "Cv-ketel, warmtepomp, airco of elektra" },
  { id: "onderhoud", title: "Onderhoud of afspraak", description: "Onderhoud plannen, wijzigen of abonnement" },
  { id: "storing", title: "Storing of technische vraag", description: "Iets werkt niet of u wilt kort overleggen" },
];

const trackingKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"];

export function CallbackRequestForm() {
  const searchParams = useSearchParams();
  const [topic, setTopic] = useState<CallbackTopic>("werk");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const selectedTopic = callbackTopics.find((item) => item.id === topic) ?? callbackTopics[0];
  const recipient = topic === "onderhoud" ? "planning@robbraam.com" : "service@robbraam.com";

  const submitCallback = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setStatus("sending");
    setErrorMessage("");

    const formData = new FormData(form);
    formData.set("Onderwerp terugbelverzoek", selectedTopic.title);
    formData.set("Bestemd voor", recipient);
    formData.set("Herkomstpagina", document.referrer || "Rechtstreeks of onbekend");
    trackingKeys.forEach((key) => {
      const value = searchParams.get(key);
      if (value) formData.set(key, value);
    });
    formData.set("_subject", `Terugbelverzoek: ${selectedTopic.title}`);
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
      if (!succeeded) throw new Error(result?.message || "Het terugbelverzoek kon niet worden verzonden.");
      window.location.assign(`/bedankt?type=terugbellen&onderwerp=${encodeURIComponent(topic)}`);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Het terugbelverzoek kon niet worden verzonden. Probeer het opnieuw of bel ons.");
    }
  };

  return (
    <form className="subscription-application-form callback-request-form" onSubmit={submitCallback} noValidate>
      <input type="text" name="_honey" className="form-honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <section className="form-section">
        <div className="form-section-heading"><span>01</span><div><h2>Waarover wilt u gebeld worden?</h2><p>Kies de route die het beste past. Nieuwe werkzaamheden gaan naar service; onderhoud en afspraken naar planning.</p></div></div>
        <div className="quote-service-grid">
          {callbackTopics.map((item) => (
            <label className={topic === item.id ? "quote-service-choice is-selected" : "quote-service-choice"} key={item.id}>
              <input type="radio" name="Terugbelroute" value={item.title} checked={topic === item.id} onChange={() => setTopic(item.id)} />
              <span className="choice-radio" aria-hidden="true" />
              <span><strong>{item.title}</strong><small>{item.description}</small></span>
            </label>
          ))}
        </div>
      </section>

      <section className="form-section">
        <div className="form-section-heading"><span>02</span><div><h2>Uw gegevens</h2><p>We bellen u terug met iemand die uw vraag kan beoordelen.</p></div></div>
        <div className="field-grid">
          <label className="field field-wide"><span>Naam <b>*</b></span><input type="text" name="Naam" autoComplete="name" required /></label>
          <label className="field"><span>Telefoonnummer <b>*</b></span><input type="tel" name="Telefoonnummer" autoComplete="tel" required /></label>
          <label className="field"><span>Postcode</span><input type="text" name="Postcode" autoComplete="postal-code" /></label>
          <label className="field"><span>Wanneer komt bellen goed uit?</span><select name="Voorkeur terugbellen" defaultValue="Geen voorkeur"><option>Geen voorkeur</option><option>Vandaag, indien mogelijk</option><option>Ochtend</option><option>Middag</option><option>Einde middag</option></select></label>
          <label className="field"><span>E-mailadres</span><input type="email" name="email" autoComplete="email" /></label>
          <label className="field field-wide"><span>Korte toelichting</span><textarea name="Toelichting" rows={5} placeholder="Bijvoorbeeld: cv-ketel vervangen, onderhoud plannen, airco offerte, storing of vraag over elektra." /></label>
        </div>
      </section>

      <div className="form-submit-panel">
        <label className="privacy-check"><input type="checkbox" name="Privacyverklaring gelezen" value="Ja" required /><span aria-hidden="true" /><small>Ik heb de <Link href="/privacy">privacyverklaring</Link> gelezen en begrijp dat Braam mijn gegevens gebruikt om mij terug te bellen. <b>*</b></small></label>
        {status === "error" && <p className="form-error" role="alert">{errorMessage} U kunt ook bellen via <a href="tel:+31736222199">073 622 2199</a>.</p>}
        <button className="button button-primary form-submit-button" type="submit" disabled={status === "sending"}>{status === "sending" ? "Verzoek wordt verzonden…" : "Laat mij terugbellen"}<span aria-hidden="true">→</span></button>
        <p className="form-smallprint">Dit is geen opdracht. We gebruiken uw gegevens alleen om persoonlijk contact op te nemen over uw vraag.</p>
      </div>
    </form>
  );
}
