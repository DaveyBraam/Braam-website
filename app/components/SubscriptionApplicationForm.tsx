"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";

type PlanId = "cv-comfort" | "cv-comfort-plus" | "hybride-comfort" | "hybride-comfort-plus" | "all-electric-comfort" | "all-electric-comfort-plus" | "onbekend";
type InstallationId = "cv" | "hybride" | "all-electric" | "onbekend";
type CoverageId = "comfort" | "comfort-plus";
type ApplicantType = "particulier" | "verhuurder";
type PaymentFrequency = "jaarlijks" | "maandelijks";
type ExtraInstallations = "nee" | "een" | "meerdere";
type FormStatus = "idle" | "sending" | "success" | "error";

const plans: Array<{ id: PlanId; title: string; price: string; monthlyPrice?: string; description: string; landlordDescription: string }> = [
  { id: "cv-comfort", title: "Comfort - cv-ketel", price: "€ 139 per jaar", monthlyPrice: "11,58", description: "Voor een cv-ketel van Intergas, Remeha, Nefit of Vaillant. Materiaal is niet inbegrepen.", landlordDescription: "Voor cv-ketels van Intergas, Remeha, Nefit of Vaillant." },
  { id: "cv-comfort-plus", title: "Comfort Plus - cv-ketel", price: "€ 239 per jaar", monthlyPrice: "19,92", description: "Voor een cv-ketel met materiaal binnen de onderhoudsmantel.", landlordDescription: "Voor cv-ketels van Intergas, Remeha, Nefit of Vaillant." },
  { id: "hybride-comfort", title: "Comfort - hybride warmtepomp + cv-ketel", price: "€ 289 per jaar", monthlyPrice: "24,08", description: "Voor een cv-ketel met hybride warmtepomp. Materiaal is niet inbegrepen.", landlordDescription: "Voor woningen met een cv-ketel en hybride warmtepomp." },
  { id: "hybride-comfort-plus", title: "Comfort Plus - hybride warmtepomp + cv-ketel", price: "€ 429 per jaar", monthlyPrice: "35,75", description: "Voor een cv-ketel met hybride warmtepomp en materiaal binnen de onderhoudsmantels.", landlordDescription: "Voor woningen met een cv-ketel en hybride warmtepomp." },
  { id: "all-electric-comfort", title: "Comfort - all-electric warmtepomp", price: "€ 239 per jaar", monthlyPrice: "19,92", description: "Voor een all-electric warmtepomp zonder cv-ketel. Materiaal is niet inbegrepen.", landlordDescription: "Voor woningen met een volledig elektrische warmtepomp." },
  { id: "all-electric-comfort-plus", title: "Comfort Plus - all-electric warmtepomp", price: "€ 379 per jaar", monthlyPrice: "31,58", description: "Voor een all-electric warmtepomp met materiaal binnen de onderhoudsmantel.", landlordDescription: "Voor woningen met een volledig elektrische warmtepomp." },
  { id: "onbekend", title: "Ik weet het nog niet", price: "We kijken met u mee", description: "We bekijken welk onderhoud bij uw installatie past. Merk en model vult u in voor zover bekend.", landlordDescription: "Voor verschillende installaties of wanneer nog niet alles bekend is." },
];

const planIds = new Set<PlanId>(plans.map((plan) => plan.id));

const installationChoices: Array<{ id: InstallationId; title: string; description: string }> = [
  { id: "cv", title: "Alleen een cv-ketel", description: "Intergas, Remeha, Nefit of Vaillant" },
  { id: "hybride", title: "Cv-ketel + hybride warmtepomp", description: "Onderhoud voor beide toestellen" },
  { id: "all-electric", title: "All-electric warmtepomp", description: "Warmtepomp zonder cv-ketel" },
  { id: "onbekend", title: "Ik weet het niet zeker", description: "We kijken met u mee" },
];

function splitPlan(plan: PlanId): { installation: InstallationId; coverage: CoverageId } {
  if (plan === "onbekend") return { installation: "onbekend", coverage: "comfort" };
  if (plan.startsWith("all-electric-")) return { installation: "all-electric", coverage: plan.endsWith("plus") ? "comfort-plus" : "comfort" };
  if (plan.startsWith("hybride-")) return { installation: "hybride", coverage: plan.endsWith("plus") ? "comfort-plus" : "comfort" };
  return { installation: "cv", coverage: plan.endsWith("plus") ? "comfort-plus" : "comfort" };
}

function composePlan(installation: InstallationId, coverage: CoverageId): PlanId {
  if (installation === "onbekend") return "onbekend";
  return `${installation}-${coverage}` as PlanId;
}

export function SubscriptionApplicationForm() {
  const searchParams = useSearchParams();
  const requestedPlan = searchParams.get("abonnement") as PlanId | null;
  const initialApplicantType: ApplicantType = searchParams.get("type") === "verhuurder" ? "verhuurder" : "particulier";
  const initialPlan = requestedPlan && planIds.has(requestedPlan) ? requestedPlan : initialApplicantType === "verhuurder" ? "onbekend" : "cv-comfort";
  const initialChoice = splitPlan(initialPlan);
  const [applicantType, setApplicantType] = useState<ApplicantType>(initialApplicantType);
  const [installation, setInstallation] = useState<InstallationId>(initialChoice.installation);
  const [coverage, setCoverage] = useState<CoverageId>(initialChoice.coverage);
  const [paymentFrequency, setPaymentFrequency] = useState<PaymentFrequency>("maandelijks");
  const [extraInstallations, setExtraInstallations] = useState<ExtraInstallations>("nee");
  const [ventilation, setVentilation] = useState(initialApplicantType === "particulier" && searchParams.get("ventilatie") === "ja" && !initialPlan.startsWith("all-electric"));
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const plan = composePlan(installation, coverage);
  const selectedPlan = useMemo(() => plans.find((item) => item.id === plan) ?? plans[0], [plan]);
  const isLandlord = applicantType === "verhuurder";
  const canAddVentilation = !isLandlord && (plan.startsWith("cv-") || plan.startsWith("hybride-") || plan === "onbekend");
  const includesBoiler = plan.startsWith("cv-") || plan.startsWith("hybride-");
  const includesHeatPump = plan.startsWith("hybride-") || plan.startsWith("all-electric");

  const chooseInstallation = (nextInstallation: InstallationId) => {
    setInstallation(nextInstallation);
    if (nextInstallation === "all-electric") setVentilation(false);
  };

  const chooseApplicantType = (nextType: ApplicantType) => {
    setApplicantType(nextType);
    if (nextType === "verhuurder") {
      setVentilation(false);
      setExtraInstallations("nee");
    }
  };

  const submitApplication = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setStatus("sending");
    setErrorMessage("");

    const formData = new FormData(form);
    formData.set("Type aanvrager", isLandlord ? "Verhuurder of beheerder van meerdere panden" : "Particulier");
    formData.set("Aangevraagd abonnement", selectedPlan.title);
    formData.set("Jaarprijs", isLandlord ? "Prijs na beoordeling van de panden" : selectedPlan.price);
    formData.set("Betaalvoorkeur", isLandlord ? "Te bespreken na beoordeling" : paymentFrequency === "maandelijks" ? "Maandelijks via automatische incasso" : "Eén keer per jaar");
    formData.set("Ventilatiebox mee schoonmaken", ventilation && canAddVentilation ? "Ja, € 37,50 extra per jaar" : "Nee");
    formData.set("_subject", isLandlord ? "Nieuwe onderhoudsaanvraag voor meerdere panden" : `Nieuwe abonnementaanvraag: ${selectedPlan.title}`);
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
      window.location.assign(`/bedankt?type=abonnement&dienst=${encodeURIComponent(plan)}`);
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
        <h1>Bedankt.<br /><em>We nemen persoonlijk contact op.</em></h1>
        <p>{isLandlord ? <>Uw aanvraag voor <strong>onderhoud aan meerdere panden</strong> is verzonden naar onze planning. We bekijken de adressen en installaties en nemen contact met u op om werkzaamheden, planning en prijs af te stemmen.</> : <>Uw aanvraag voor het <strong>{selectedPlan.title.toLowerCase()}</strong> is verzonden naar onze planning. We bekijken de gegevens en nemen contact met u op om het abonnement te bevestigen.</>}</p>
        <div className="success-actions"><Link className="button button-primary" href="/">Terug naar de homepage <span aria-hidden="true">→</span></Link><a href="tel:+31736222199">Een dringende vraag? Bel 073 622 2199</a></div>
      </section>
    );
  }

  return (
    <form className="subscription-application-form" onSubmit={submitApplication} noValidate>
      <input type="text" name="_honey" className="form-honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <section className="form-section">
        <div className="form-section-heading"><span>01</span><div><h2>Voor wie is het onderhoud?</h2><p>Kies uw eigen woning of meerdere panden. Dan tonen we alleen de gegevens die we nodig hebben.</p></div></div>
        <div className="applicant-choice-grid">
          <label className={applicantType === "particulier" ? "applicant-choice is-selected" : "applicant-choice"}>
            <input type="radio" name="Aanvragerkeuze" value="Particulier" checked={applicantType === "particulier"} onChange={() => chooseApplicantType("particulier")} />
            <span className="applicant-radio" aria-hidden="true" /><span><strong>Voor mijn eigen woning</strong><small>Eén woning of één installatieadres</small></span>
          </label>
          <label className={isLandlord ? "applicant-choice is-selected" : "applicant-choice"}>
            <input type="radio" name="Aanvragerkeuze" value="Verhuurder of beheerder" checked={isLandlord} onChange={() => chooseApplicantType("verhuurder")} />
            <span className="applicant-radio" aria-hidden="true" /><span><strong>Ik ben verhuurder of beheer panden</strong><small>Meerdere woningen, adressen of installaties</small></span>
          </label>
        </div>
        <div className="plan-choice-heading"><h3>1. Welke installatie gaat het vooral om?</h3><p>{isLandlord ? "Kies wat het meest voorkomt. Verderop kunt u verschillende installaties en adressen invullen." : "Kies eerst het toestel dat bij u thuis staat."}</p></div>
        <div className="installation-choice-form-grid">
          {installationChoices.map((item) => <label className={installation === item.id ? "installation-choice-form is-selected" : "installation-choice-form"} key={item.id}><input type="radio" name="Installatiekeuze" value={item.title} checked={installation === item.id} onChange={() => chooseInstallation(item.id)} /><span className="choice-radio" aria-hidden="true" /><span><strong>{isLandlord && item.id === "onbekend" ? "Verschillende installaties" : item.title}</strong><small>{item.description}</small></span></label>)}
        </div>
        {!isLandlord && installation !== "onbekend" && <><div className="plan-choice-heading plan-choice-heading-second"><h3>2. Kies uw dekking</h3><p>Beide pakketten bevatten de jaarlijkse controle en storingsservice. Het verschil zit vooral in de materiaalkosten.</p></div><div className="coverage-choice-grid">
          {(["comfort", "comfort-plus"] as CoverageId[]).map((item) => {
            const itemPlan = plans.find((candidate) => candidate.id === composePlan(installation, item)) ?? plans[0];
            const selected = coverage === item;
            return <label className={selected ? "coverage-choice is-selected" : "coverage-choice"} key={item}><input type="radio" name="Dekkingskeuze" value={itemPlan.title} checked={selected} onChange={() => setCoverage(item)} /><span className="choice-radio" aria-hidden="true" /><span className="coverage-choice-copy"><span><strong>{item === "comfort-plus" ? "Comfort Plus" : "Comfort"}</strong>{item === "comfort-plus" && <b>Materiaal inbegrepen</b>}</span><span className="coverage-monthly"><strong>€ {itemPlan.monthlyPrice}</strong> per maand</span><small>{itemPlan.price} · ook jaarlijks betalen mogelijk</small><p>{itemPlan.description}</p></span></label>;
          })}
        </div></>}
        {!isLandlord && installation === "onbekend" && <p className="landlord-form-note"><strong>Geen probleem:</strong> vul merk en model in voor zover bekend. We bepalen eerst welk pakket bij uw installatie past en bespreken de prijs voordat het abonnement ingaat.</p>}
        {!isLandlord && <div className="installation-scope-note"><strong>Dit onderhouden wij:</strong><span>Cv-ketels van Intergas, Remeha, Nefit en Vaillant. Voor warmtepompen werken we standaard met LG, Bosch en Vaillant; andere merken beoordelen we op aanvraag.</span></div>}
        {canAddVentilation && <label className="ventilation-choice">
          <input type="checkbox" name="Ventilatiebox" checked={ventilation} onChange={(event) => setVentilation(event.target.checked)} />
          <span className="ventilation-check" aria-hidden="true">+</span><span><strong>Mechanische ventilatiebox mee laten schoonmaken</strong><small>€ 37,50 extra per jaar bij het ketel- of combinatieabonnement.</small></span>
        </label>}
        {isLandlord && <p className="landlord-form-note"><strong>Goed om te weten:</strong> de particuliere jaarprijzen gelden niet automatisch voor meerdere panden. We stemmen de onderhoudsafspraken en prijs af op het aantal adressen en installaties.</p>}
        {!isLandlord && <div className="payment-choice-form"><div><h3>Hoe wilt u betalen?</h3><p>Uw keuze wordt pas definitief nadat wij de aanvraag en installatie hebben gecontroleerd.</p></div><div className="payment-choice-grid"><label className={paymentFrequency === "maandelijks" ? "payment-choice is-selected" : "payment-choice"}><input type="radio" name="Betaalwijze" value="Maandelijks via automatische incasso" checked={paymentFrequency === "maandelijks"} onChange={() => setPaymentFrequency("maandelijks")} /><span aria-hidden="true" /><strong>Per maand via incasso</strong><small>Na goedkeuring ontvangt u eerst de bevestiging en incassomachtiging.</small></label><label className={paymentFrequency === "jaarlijks" ? "payment-choice is-selected" : "payment-choice"}><input type="radio" name="Betaalwijze" value="Jaarlijks" checked={paymentFrequency === "jaarlijks"} onChange={() => setPaymentFrequency("jaarlijks")} /><span aria-hidden="true" /><strong>Eén keer per jaar</strong><small>De volledige jaarprijs in één keer betalen.</small></label></div><p className="payment-security-note"><strong>Uw IBAN hoeft u hier niet in te vullen.</strong> Kiest u voor maandbetaling, dan ontvangt u de incassomachtiging apart nadat wij de aanvraag hebben goedgekeurd.</p></div>}
      </section>

      <section className="form-section">
        <div className="form-section-heading"><span>02</span><div><h2>Uw contactgegevens</h2><p>Daarmee kunnen we de aanvraag beoordelen en u persoonlijk bereiken.</p></div></div>
        <div className="field-grid">
          {isLandlord && <label className="field field-wide"><span>Naam organisatie of verhuurder <b>*</b></span><input type="text" name="Naam organisatie of verhuurder" autoComplete="organization" required /></label>}
          <label className="field field-wide"><span>Naam <b>*</b></span><input type="text" name="Naam" autoComplete="name" required /></label>
          <label className="field field-wide"><span>Straat en huisnummer <b>*</b></span><input type="text" name="Straat en huisnummer" autoComplete="street-address" required /></label>
          <label className="field"><span>Postcode <b>*</b></span><input type="text" name="Postcode" autoComplete="postal-code" required /></label>
          <label className="field"><span>Woonplaats <b>*</b></span><input type="text" name="Woonplaats" autoComplete="address-level2" required /></label>
          <label className="field"><span>E-mailadres <b>*</b></span><input type="email" name="email" autoComplete="email" required /></label>
          <label className="field"><span>Telefoonnummer <b>*</b></span><input type="tel" name="Telefoonnummer" autoComplete="tel" required /></label>
        </div>
      </section>

      <section className="form-section">
        <div className="form-section-heading"><span>03</span><div><h2>{isLandlord ? "Over uw panden en installaties" : "Over uw installatie"}</h2><p>{isLandlord ? "Geef elke woning of elk pand apart door. Daarmee kunnen we vooraf controleren of de installaties binnen onze onderhoudsscope vallen." : "Vul het merk en model in voor zover u die weet. Het vermogen mag u leeg laten als dat niet duidelijk is."}</p></div></div>
        <div className="field-grid">
          {isLandlord && <>
            <label className="field"><span>Aantal panden <b>*</b></span><input type="number" name="Aantal panden" min="2" inputMode="numeric" placeholder="Bijvoorbeeld 8" required /></label>
            <label className="field"><span>Totaal aantal installaties <b>*</b></span><input type="number" name="Totaal aantal installaties" min="2" inputMode="numeric" placeholder="Bijvoorbeeld 12" required /></label>
            <label className="field field-wide"><span>Installaties per adres <b>*</b></span><textarea name="Installaties per adres" rows={8} placeholder={"Noteer per woning of pand:\n1. volledig adres en postcode\n2. cv-ketel, hybride of volledig elektrische warmtepomp\n3. merk en model\n4. vermogen, indien bekend\n5. datum laatste onderhoud, indien bekend"} required /></label>
            <div className="field-wide landlord-scope-warning"><strong>Welke installaties nemen we aan?</strong><p>Wij onderhouden individuele cv-ketels en warmtepompen in woningen. Voor warmtepompen werken we standaard met LG, Bosch en Vaillant; andere merken beoordelen we op aanvraag. Collectieve ketelhuizen, cascadeopstellingen en grote bedrijfsinstallaties vallen buiten onze werkzaamheden.</p></div>
          </>}
          {!isLandlord && <label className="field field-wide"><span>Wanneer wilt u het abonnement laten ingaan? <b>*</b></span><select name="Gewenst startmoment" defaultValue="Zo spoedig mogelijk" required><option>Zo spoedig mogelijk</option><option>Binnen één maand</option><option>Over één tot drie maanden</option><option>Later of in overleg</option></select><small className="field-hint">Dit is uw voorkeur. De definitieve ingangsdatum staat in onze bevestiging.</small></label>}
          {!isLandlord && plan !== "onbekend" ? <>
            {includesBoiler && <label className="field"><span>Merk cv-ketel <b>*</b></span><select key={`boiler-${plan}`} name="Merk cv-ketel" defaultValue="" required><option value="" disabled>Kies het merk</option><option>Intergas</option><option>Remeha</option><option>Nefit</option><option>Vaillant</option><option>Anders of onbekend</option></select></label>}
            {includesHeatPump && <label className="field"><span>Merk warmtepomp <b>*</b></span><select key={`heat-pump-${plan}`} name="Merk warmtepomp" defaultValue="" required><option value="" disabled>Kies het merk</option><option>LG</option><option>Vaillant</option><option>Anders of onbekend</option></select></label>}
            {includesBoiler && <label className="field"><span>Type of model cv-ketel</span><input type="text" name="Type of model cv-ketel" placeholder="Voor zover bekend" /></label>}
            {includesHeatPump && <label className="field"><span>Type of model warmtepomp</span><input type="text" name="Type of model warmtepomp" placeholder="Voor zover bekend" /></label>}
          </> : <>
            <label className="field"><span>{isLandlord ? "Meest voorkomende merk" : "Merk installatie"}</span><input type="text" name="Merk installatie" placeholder="Bijvoorbeeld Vaillant" /></label>
            <label className="field"><span>Type of model</span><input type="text" name="Type of model" placeholder="Voor zover bekend" /></label>
          </>}
          {!isLandlord && <label className="field"><span>Vermogen, indien bekend</span><input type="text" name="Vermogen" inputMode="decimal" placeholder="Mag u leeg laten" /></label>}
          <label className="field"><span>Bouwjaar installatie</span><input type="text" name="Bouwjaar installatie" inputMode="numeric" placeholder="Bijvoorbeeld 2021" /></label>
          {!isLandlord && <label className="field field-wide"><span>Wilt u een extra installatie op hetzelfde adres aanmelden?</span><select name="Extra installaties aanmelden" value={extraInstallations} onChange={(event) => setExtraInstallations(event.target.value as ExtraInstallations)}><option value="nee">Nee</option><option value="een">Ja, één extra installatie</option><option value="meerdere">Ja, meerdere extra installaties</option></select></label>}
          {!isLandlord && extraInstallations !== "nee" && <label className="field field-wide"><span>Gegevens van de extra installatie{extraInstallations === "meerdere" ? "s" : ""} <b>*</b></span><textarea name="Gegevens extra installaties" rows={5} placeholder={"Vermeld per extra installatie:\n1. soort installatie\n2. merk en model\n3. bouwjaar, indien bekend"} required /></label>}
          <label className="field field-wide"><span>Opmerking of bijzonderheid</span><textarea name="Opmerking" rows={5} placeholder="Is er iets dat we vooraf moeten weten?" /></label>
        </div>
      </section>

      <div className="form-submit-panel">
        {!isLandlord && <label className="privacy-check subscription-understanding"><input type="checkbox" name="Doorlopende abonnementskosten begrepen" value="Ja" required /><span aria-hidden="true" /><small><strong>Ik begrijp hoe het abonnement werkt:</strong> Braam plant ieder jaar een controle. Het abonnement is een doorlopend servicepakket en geen betaling per bezoek. Als ik een geplande controle zelf uitstel of oversla, blijft het abonnement actief en blijven de abonnementskosten verschuldigd. <b>*</b></small></label>}
        <label className="privacy-check"><input type="checkbox" name="Privacyverklaring gelezen" value="Ja" required /><span aria-hidden="true" /><small>Ik heb de <Link href="/privacy">privacyverklaring</Link> gelezen en begrijp dat Braam mijn gegevens gebruikt om deze aanvraag te beoordelen en hierover contact met mij op te nemen. <b>*</b></small></label>
        {status === "error" && <p className="form-error" role="alert">{errorMessage} U kunt ook bellen via <a href="tel:+31736222199">073 622 2199</a>.</p>}
        <button className="button button-primary form-submit-button" type="submit" disabled={status === "sending"}>{status === "sending" ? "Aanvraag wordt verzonden…" : "Verstuur mijn aanvraag"}<span aria-hidden="true">→</span></button>
        <p className="form-smallprint">{isLandlord ? "Met dit formulier vraagt u nog geen definitief contract aan. We bekijken eerst de panden en installaties en nemen daarna contact met u op." : "U sluit met dit formulier nog niet direct een abonnement af. We controleren eerst of het gekozen abonnement bij uw installatie en woonplaats past."}</p>
      </div>
    </form>
  );
}
