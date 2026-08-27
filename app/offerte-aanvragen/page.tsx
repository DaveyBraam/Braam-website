import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { QuoteRequestForm } from "../components/QuoteRequestForm";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Offerte of advies aanvragen | Rob Braam",
  description: "Vraag persoonlijk advies of een offerte aan voor een cv-ketel, warmtepomp, airco, elektra of onderhoud.",
  robots: { index: false, follow: true },
};

export default function QuoteRequestPage() {
  return <><SiteHeader /><main className="application-page quote-application-page"><section className="application-intro"><div className="shell"><div className="breadcrumb breadcrumb-dark"><Link href="/">Home</Link><span>/</span><strong>Offerte aanvragen</strong></div><div className="application-heading"><div><p className="eyebrow eyebrow-light"><span /> Advies of offerte aanvragen</p><h1>Vertel wat u nodig heeft.<br /><em>Wij kijken persoonlijk mee.</em></h1></div><div className="application-intro-copy"><p>U hoeft niet vooraf alle technische antwoorden te kennen. Kies de dienst, beschrijf kort uw situatie en wij bepalen welke informatie of opname nog nodig is.</p><div><span>01</span>Kies de dienst</div><div><span>02</span>Beschrijf uw situatie</div><div><span>03</span>Wij beoordelen de vervolgstap</div></div></div></div></section><section className="application-form-section"><div className="shell application-layout"><Suspense fallback={<div className="application-loading">Formulier wordt geladen…</div>}><QuoteRequestForm /></Suspense><aside className="application-assurance"><span className="assurance-label">Persoonlijk beoordeeld</span><h2>Geen standaardantwoord.</h2><ul><li><span>✓</span>Werk/offerte gaat naar service</li><li><span>✓</span>Onderhoud gaat naar planning</li><li><span>✓</span>We kijken naar uw woning en installatie</li><li><span>✓</span>U zit met dit formulier nergens aan vast</li></ul><div className="assurance-contact"><small>Liever even overleggen?</small><a href="tel:+31736222199">073 622 2199</a><a href="mailto:service@robbraam.com">service@robbraam.com</a></div></aside></div></section></main><SiteFooter /></>;
}
