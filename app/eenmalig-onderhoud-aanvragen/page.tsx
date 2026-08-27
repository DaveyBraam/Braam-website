import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { SingleMaintenanceApplicationForm } from "../components/SingleMaintenanceApplicationForm";

export const metadata: Metadata = {
  title: "Eenmalige onderhoudsbeurt aanvragen | Rob Braam",
  description: "Vraag één losse onderhoudsbeurt aan voor uw cv-ketel, hybride installatie of volledig elektrische warmtepomp.",
  robots: { index: false, follow: false },
};

export default function SingleMaintenanceApplicationPage() {
  return <><SiteHeader /><main className="application-page">
    <section className="application-intro"><div className="shell"><div className="breadcrumb breadcrumb-dark"><Link href="/">Home</Link><span>/</span><Link href="/onderhoud">Onderhoud</Link><span>/</span><strong>Eenmalig aanvragen</strong></div><div className="application-heading"><div><p className="eyebrow eyebrow-light"><span /> Losse onderhoudsbeurt</p><h1>Eén onderhoudsbeurt.<br /><em>Geen abonnement.</em></h1></div><div className="application-intro-copy"><p>Met dit formulier vraagt u alleen een eenmalige onderhoudsbeurt aan. We controleren eerst uw installatie, merk en woonplaats; daarna nemen we contact met u op.</p><div><span>01</span>Kies het soort installatie</div><div><span>02</span>Vul uw gegevens in</div><div><span>03</span>Wij beoordelen en stemmen de afspraak af</div></div></div></div></section>
    <section className="application-form-section"><div className="shell application-layout"><SingleMaintenanceApplicationForm /><aside className="application-assurance"><span className="assurance-label">Duidelijk aangevraagd</span><h2>Eenmalig onderhoud, zonder contract.</h2><ul><li><span>✓</span>Eén losse onderhoudsbeurt</li><li><span>✓</span>Geen abonnement of jaarlijkse overeenkomst</li><li><span>✓</span>Merk en installatie worden vooraf beoordeeld</li><li><span>✓</span>Afspraak en kosten worden afgestemd</li><li><span>✓</span>De aanvraag komt herkenbaar bij planning binnen</li></ul><div className="assurance-contact"><small>Liever eerst overleggen?</small><a href="tel:+31736222199">073 622 2199</a><a href="mailto:planning@robbraam.com">planning@robbraam.com</a></div></aside></div></section>
  </main><SiteFooter /></>;
}
