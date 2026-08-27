import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { SubscriptionApplicationForm } from "../components/SubscriptionApplicationForm";

export const metadata: Metadata = {
  title: "Onderhoudsabonnement aanvragen | Rob Braam",
  description: "Vraag onderhoud aan voor uw eigen woning of voor meerdere huurwoningen en panden.",
  robots: { index: false, follow: false },
};

export default function SubscriptionApplicationPage() {
  return <><SiteHeader /><main className="application-page">
    <section className="application-intro"><div className="shell"><div className="breadcrumb breadcrumb-dark"><Link href="/">Home</Link><span>/</span><Link href="/onderhoud">Onderhoud</Link><span>/</span><strong>Aanvragen</strong></div><div className="application-heading"><div><p className="eyebrow eyebrow-light"><span /> Onderhoud aanvragen</p><h1>Eerst uw installatie.<br /><em>Dan het passende onderhoud.</em></h1></div><div className="application-intro-copy"><p>Dit formulier is een aanvraag, geen directe aankoop. We controleren het soort installatie, merk, model, woonplaats en de gekozen betaalwijze. Daarna neemt onze planning contact op.</p><div><span>01</span>Kies eerst uw installatie</div><div><span>02</span>Vergelijk Comfort en Comfort Plus</div><div><span>03</span>Wij beoordelen en bevestigen</div></div></div></div></section>
    <section className="application-form-section" id="aanvraagformulier"><div className="shell application-layout"><Suspense fallback={<div className="application-loading">Formulier wordt geladen…</div>}><SubscriptionApplicationForm /></Suspense><aside className="application-assurance"><span className="assurance-label">Goed om te weten</span><h2>Beoordeeld door onze planning.</h2><ul><li><span>✓</span>Ieder jaar een controle door Braam gepland</li><li><span>✓</span>Twee geplande controlemomenten in 24 maanden</li><li><span>✓</span>Doorlopend servicepakket, niet betalen per bezoek</li><li><span>✓</span>Maandelijkse incasso of jaarbetaling</li><li><span>✓</span>Geen automatische acceptatie</li></ul><div className="assurance-contact"><small>Liever eerst overleggen?</small><a href="tel:+31736222199">073 622 2199</a><a href="mailto:planning@robbraam.com">planning@robbraam.com</a></div></aside></div></section>
  </main><SiteFooter /></>;
}
