"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";

type InstallationId = "cv-ketel" | "hybride" | "full-electric" | "onbekend";
type FormStatus = "idle" | "sending" | "success" | "error";

const installations: Array<{ id: InstallationId; title: string; description: string }> = [
  { id: "cv-ketel", title: "Cv-ketel", description: "Voor Intergas, Remeha, Nefit of Vaillant." },
  { id: "hybride", title: "Cv-ketel met hybride warmtepomp", description: "Voor een cv-ketel in combinatie met een hybride warmtepomp." },
  { id: "full-electric", title: "Volledig elektrische warmtepomp", description: "Voor een warmtepomp die de woning zonder cv-ketel verwarmt." },
  { id: "onbekend", title: "Ik weet het niet precies", description: "Vul merk en model in voor zover die bij u bekend zijn." },
];

export function SingleMaintenanceApplicationForm() {
  const [installation, setInstallation] = useState<InstallationId>("cv-ketel");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const selectedInstallation = useMemo(
    () => installations.find((item) => item.id === installation) ?? installations[0],
    [installation],
  );

  const submitApplication = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    setStatus("sending");
    setErrorMessage("");

    const formData = new FormData(form);
    formData.set("Soort aanvraag", "EENMALIGE ONDERHOUDSBEURT / LOSSE CONTROLE");
    formData.set("Abonnement", "NEE — klant vraagt één losse onderhoudsbeurt aan");
    formData.set("Type installatie", selectedInstallation.title);
    formData.set("Gewenste afhandeling", "Eén losse onderhoudsafspraak laten beoordelen en inplannen");
    formData.set("_subject", `EENMALIG ONDERHOUD (GEEN ABONNEMENT) — ${selectedInstallation.title}`);
    formData.set("_template", "table");
    formData.set("_captcha", "false");

    try {
      const response = await fetch("https://formsubmit.co/ajax/planning@robbraam.com", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const result = await response.json().catch(() => null) as { success?: boolean | string; message?: string } | null;
      const succeeded = response.ok && (result?.success === true || result?.success === "true");
      if (!succeeded) throw new Error(result?.message || "De aanvraag kon niet worden verzonden.");
      setStatus("success");
      window.location.assign(`/bedankt?type=onderhoud&dienst=${encodeURIComponent(installation)}`);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "De aanvraag kon niet worden verzonden. Probeer het opnieuw of bel ons.");
    }
  };

  if (status === "success") {
    return (
      <section className="application-success" aria-live="polite">
        <div className="success-orbit" aria-hidden="true"><span>✓</span></div>
        <p className="eyebrow"><span /> Aanvraag ontvangen</p>
        <h1>Bedankt.<br /><em>Uw losse onderhoudsbeurt is aangevraagd.</em></h1>
        <p>Uw aanvraag voor <strong>één eenmalige onderhoudsbeurt</strong> is naar onze planning verzonden. U vraagt hiermee geen abonnement aan. We beoordelen de installatie en nemen contact met u op om de mogelijkheden, kosten en afspraak af te stemmen.</p>
        <div className="success-actions"><Link className="button button-primary" href="/onderhoud">Terug naar onderhoud <span aria-hidden="true">→</span></Link><a href="tel:+31736222199">Een dringende vraag? Bel 073 622 2199</a></div>
      </section>
    );
  }

  return (
    <form className="subscription-application-form" onSubmit={submitApplication} noValidate>
      <input type="text" name="_honey" className="form-honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <section className="form-section">
        <div className="form-section-heading"><span>01</span><div><h2>Welke installatie heeft u?</h2><p>Kies wat het beste past. Als u twijfelt, kunt u dat gewoon aangeven.</p></div></div>
        <div className="plan-choice-grid">
          {installations.map((item) => (
            <label className={installation === item.id ? "plan-choice is-selected" : "plan-choice"} key={item.id}>
              <input type="radio" name="Installatiekeuze" value={item.title} checked={installation === item.id} onChange={() => setInstallation(item.id)} />
              <span className="choice-radio" aria-hidden="true" /><strong>{item.title}</strong><small>Eenmalige onderhoudsbeurt</small><p>{item.description}</p>
            </label>
          ))}
        </div>
        <div className="installation-scope-note"><strong>Goed om te weten:</strong><span>Voor cv-ketels werken we met Intergas, Remeha, Nefit en Vaillant. Warmtepompen onderhouden we standaard van LG, Bosch en Vaillant; andere merken beoordelen we op aanvraag.</span></div>
      </section>

      <section className="form-section">
        <div className="form-section-heading"><span>02</span><div><h2>Uw contactgegevens</h2><p>Onze planning gebruikt deze gegevens om de onderhoudsaanvraag te beoordelen en u te bereiken.</p></div></div>
        <div className="field-grid">
          <label className="field field-wide"><span>Naam <b>*</b></span><input type="text" name="Naam" autoComplete="name" required /></label>
          <label className="field field-wide"><span>Straat en huisnummer <b>*</b></span><input type="text" name="Straat en huisnummer" autoComplete="street-address" required /></label>
          <label className="field"><span>Postcode <b>*</b></span><input type="text" name="Postcode" autoComplete="postal-code" required /></label>
          <label className="field"><span>Woonplaats <b>*</b></span><input type="text" name="Woonplaats" autoComplete="address-level2" required /></label>
          <label className="field"><span>E-mailadres <b>*</b></span><input type="email" name="email" autoComplete="email" required /></label>
          <label className="field"><span>Telefoonnummer <b>*</b></span><input type="tel" name="Telefoonnummer" autoComplete="tel" required /></label>
        </div>
      </section>

      <section className="form-section">
        <div className="form-section-heading"><span>03</span><div><h2>Over uw installatie</h2><p>Vul merk en model in voor zover u die weet. Daarmee kunnen we vooraf beter beoordelen of we het onderhoud kunnen uitvoeren.</p></div></div>
        <div className="field-grid">
          <label className="field"><span>Merk installatie {installation !== "onbekend" && <b>*</b>}</span><input type="text" name="Merk installatie" placeholder="Bijvoorbeeld Vaillant" required={installation !== "onbekend"} /></label>
          <label className="field"><span>Type of model</span><input type="text" name="Type of model" placeholder="Voor zover bekend" /></label>
          <label className="field"><span>Bouwjaar installatie</span><input type="text" name="Bouwjaar installatie" inputMode="numeric" placeholder="Bijvoorbeeld 2021" /></label>
          <label className="field"><span>Laatste onderhoud</span><input type="text" name="Laatste onderhoud" placeholder="Datum of jaar, indien bekend" /></label>
          <label className="field field-wide"><span>Opmerking of bijzonderheid</span><textarea name="Opmerking" rows={5} placeholder="Is er iets dat onze planning of monteur vooraf moet weten?" /></label>
        </div>
      </section>

      <div className="form-submit-panel">
        <label className="privacy-check single-maintenance-confirmation"><input type="checkbox" name="Bevestiging eenmalige aanvraag" value="Ja — één losse onderhoudsbeurt, geen abonnement" required /><span aria-hidden="true" /><small><strong>Ik vraag één eenmalige onderhoudsbeurt aan. Dit is geen abonnement.</strong> <b>*</b></small></label>
        <label className="privacy-check"><input type="checkbox" name="Privacyverklaring gelezen" value="Ja" required /><span aria-hidden="true" /><small>Ik heb de <Link href="/privacy">privacyverklaring</Link> gelezen en begrijp dat Braam mijn gegevens gebruikt om deze aanvraag te beoordelen en hierover contact met mij op te nemen. <b>*</b></small></label>
        {status === "error" && <p className="form-error" role="alert">{errorMessage} U kunt ook bellen via <a href="tel:+31736222199">073 622 2199</a>.</p>}
        <button className="button button-primary form-submit-button" type="submit" disabled={status === "sending"}>{status === "sending" ? "Aanvraag wordt verzonden…" : "Vraag mijn losse onderhoudsbeurt aan"}<span aria-hidden="true">→</span></button>
        <p className="form-smallprint">We beoordelen eerst uw installatie, merk en woonplaats. Daarna neemt onze planning contact met u op. Met dit formulier ontstaat geen abonnement of jaarlijkse overeenkomst.</p>
      </div>
    </form>
  );
}
