import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CallbackRequestForm } from "../components/CallbackRequestForm";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Bel mij terug | Rob Braam",
  description: "Laat Rob Braam u terugbellen over een offerte, onderhoud, servicevraag of afspraak.",
  robots: { index: false, follow: true },
};

export default function CallbackRequestPage() {
  return (
    <>
      <SiteHeader />
      <main className="application-page callback-application-page">
        <section className="application-intro">
          <div className="shell">
            <div className="breadcrumb breadcrumb-dark"><Link href="/">Home</Link><span>/</span><strong>Bel mij terug</strong></div>
            <div className="application-heading">
              <div><p className="eyebrow eyebrow-light"><span /> Laagdrempelig contact</p><h1>Laat ons u<br /><em>persoonlijk terugbellen.</em></h1></div>
              <div className="application-intro-copy">
                <p>Wilt u eerst kort overleggen voordat u een aanvraag doet? Vul uw nummer en onderwerp in. Dan komt het verzoek direct bij service of planning terecht.</p>
                <div><span>01</span>Kies het onderwerp</div>
                <div><span>02</span>Laat uw nummer achter</div>
                <div><span>03</span>Wij bellen persoonlijk terug</div>
              </div>
            </div>
          </div>
        </section>
        <section className="application-form-section">
          <div className="shell application-layout">
            <Suspense fallback={<div className="application-loading">Formulier wordt geladen…</div>}>
              <CallbackRequestForm />
            </Suspense>
            <aside className="application-assurance">
              <span className="assurance-label">Geen verplichting</span>
              <h2>Eerst even afstemmen.</h2>
              <ul>
                <li><span>✓</span>Nieuwe werkzaamheden gaan naar service</li>
                <li><span>✓</span>Onderhoud en afspraken gaan naar planning</li>
                <li><span>✓</span>Handig als u nog niet precies weet wat nodig is</li>
                <li><span>✓</span>U zit nergens aan vast</li>
              </ul>
              <div className="assurance-contact"><small>Liever direct bellen?</small><a href="tel:+31736222199">073 622 2199</a><a href="mailto:service@robbraam.com">service@robbraam.com</a></div>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
