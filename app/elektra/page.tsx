import type { Metadata } from 'next';
import Link from 'next/link';
import { MobileActionBar } from '../components/MobileActionBar';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { fotos } from './fotos';
import { KopLamp } from './KopLamp';
import { Werkwijze } from './Werkwijze';
import './elektra.css';

/* Elektra (versie 4, 14 oktober 2026): sfeer en overtuigende tekst, geen 3D. Davey:
   "sfeer laten zien met wat overtuigende teksten"; eigen foto's van elektrawerk volgen
   en komen in fotos.ts. Licht van toon; in de opening gaan de lampen aan terwijl u
   scrolt (KopLamp.tsx). De kamerfoto is puur sfeer, nooit onderwerp.
   Achtergrond: scrollcraft/builds/elektra/BRIEF.md

   Vaste regels: u-vorm, geen aantallen medewerkers of klanten, geen verzonnen
   bedragen, geen specifieke monteur beloven, telefoon nergens weggestopt. */

/* eslint-disable @next/next/no-img-element */
export const metadata: Metadata = {
  title: 'Elektra-installaties in de regio',
  description: "Groepenkast vervangen of uitbreiden, een eigen groep voor inductie, laadpaal, warmtepomp of airco, en elektra bij verbouwing of renovatie. Door het eigen team van Rob Braam uit 's-Hertogenbosch.",
  alternates: { canonical: '/elektra' },
};

const ADVIES = '/offerte-aanvragen?dienst=elektra';
const LABEL = 'Bespreek uw elektra';

const DIENSTEN = [
  ['Een groepenkast die weer past', 'Is uw kast oud, vol of te krap voor wat u nu gebruikt? We breiden hem uit of vervangen hem, passend bij uw huis en uw plannen.'],
  ['Een eigen groep voor nieuwe apparatuur', 'Voor een inductiekookplaat, laadpaal, warmtepomp of airco. Met de juiste beveiliging, zodat alles tegelijk aan kan.'],
  ['Elektra bij verbouwing of renovatie', 'We leggen de installatie aan of vernieuwen hem, afgestemd op de rest van het werk. Eén planning, één aanspreekpunt.'],
  ['Eerlijk advies bij twijfel', 'Weet u niet of uw kast nog voldoet? We komen kijken en zeggen eerlijk wat nodig is. En wat niet.'],
] as const;

const VRAGEN = [
  ['Is mijn groepenkast te oud?', 'Dat hangt af van de staat van de kast en van wat u wilt aansluiten. Oudere kasten hebben soms te weinig groepen of beveiliging voor wat er nu bijkomt. We komen kijken en adviseren wat nodig is.'],
  ['Kan een laadpaal of inductiekookplaat op mijn huidige kast?', 'Vaak wel, soms is er meer nodig. Dat hangt af van uw aansluiting en de ruimte in de kast. We bekijken het samen met u.'],
  ['Wat kost het?', 'Dat hangt af van het werk. Nadat we hebben gekeken, krijgt u een duidelijke offerte. Zo weet u vooraf waar u aan toe bent.'],
  ['Doen jullie ook de hele installatie bij een verbouwing?', 'Ja. Bij een verbouwing of renovatie leggen we de elektrische installatie aan of vernieuwen we hem, en stemmen we het af met de rest van het werk.'],
  ['Wat heeft u van mij nodig?', 'Een korte omschrijving van wat u wilt en, als het kan, een foto van uw groepenkast. Dan kunnen we gericht meedenken.'],
] as const;

function Pijl() {
  return <svg className="el-pijl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" /></svg>;
}
function Vink() {
  return <svg className="el-vink" viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.3 3 3 6-6.6" /></svg>;
}

export default function ElektraPage() {
  return <>
    <SiteHeader />
    <main className="el">

      <KopLamp advies={ADVIES} label={LABEL} pijl={<Pijl />} />

      <div className="el-zeker">
        <ul className="el-rand">
          <li><Vink />Elektricien in eigen team</li>
          <li><Vink />Geen onderaannemers</li>
          <li><Vink />Sinds 2000 in &apos;s-Hertogenbosch</li>
        </ul>
      </div>

      <section className="el-verandert" aria-labelledby="el-t-verandert">
        <div className="el-rand el-verandert-raster">
          <div>
            <h2 id="el-t-verandert">Uw huis verandert.</h2>
            <p>Er komt een inductiekookplaat. Een laadpaal bij de oprit. Een warmtepomp, misschien een airco op zolder. Allemaal apparaten die stroom vragen, en vaak op hetzelfde moment.</p>
          </div>
          <div>
            <h2>Uw elektra <span>verandert mee.</span></h2>
            <p>We kijken of uw groepenkast het aankan. Waar nodig breiden we uit of vervangen we hem, met een eigen groep voor wat veel vraagt. Zo kan alles tegelijk aan, veilig en zonder gedoe.</p>
          </div>
        </div>
      </section>

      {fotos.length > 0 && <section className="el-werkfotos" aria-labelledby="el-t-fotos">
        <div className="el-rand el-werkfotos-raster">
          <div className="el-werkfotos-tekst">
            <h2 id="el-t-fotos">Ons elektrawerk. <span>Eigen werk, uit de praktijk.</span></h2>
            <p>Groepenkasten die ons eigen team heeft geplaatst, gewoon bij klanten thuis in de meterkast.</p>
          </div>
          <div className="el-fotoraster">
            {fotos.map(f => <figure className="el-foto" key={f.src}>
              <img src={f.src} alt={f.alt} width={f.breedte} height={f.hoogte} loading="lazy" decoding="async" />
              <figcaption>{f.titel}</figcaption>
            </figure>)}
          </div>
        </div>
      </section>}

      <section className="el-hulp" aria-labelledby="el-t-hulp">
        <div className="el-rand el-hulp-raster">
          <h2 id="el-t-hulp">Waar kunnen we <span>u mee helpen?</span></h2>
          <ul className="el-hulp-lijst">
            {DIENSTEN.map(([kop, tekst]) => <li key={kop}>
              <h3>{kop}</h3>
              <p>{tekst}</p>
            </li>)}
          </ul>
        </div>
      </section>

      <Werkwijze />

      <section className="el-team" aria-labelledby="el-t-team">
        <div className="el-rand el-team-raster">
          <figure className="el-team-foto">
            <img src="/about/team-rob-braam.webp" alt="Monteurs van Rob Braam bij de bedrijfsbussen" width="1200" height="801" loading="lazy" decoding="async" />
          </figure>
          <div className="el-team-tekst">
            <h2 id="el-t-team">Eén team. <span>Van advies tot oplevering.</span></h2>
            <p>Dezelfde mensen geven het advies, doen het werk en staan er daarna voor u. Geen onderaannemers, één aanspreekpunt en één planning, ook als er naast de elektra een warmtepomp of airco komt.</p>
            <p className="el-regio">Sinds 2000 vanuit &apos;s-Hertogenbosch, in Noord-Brabant en aangrenzende delen van Gelderland.</p>
            <ul className="el-keur">
              <li><img src="/certifications/installq.png" alt="" width="82" height="48" loading="lazy" /><span>Geregistreerd bij InstallQ</span></li>
              <li><img src="/certifications/vca.png" alt="" width="84" height="48" loading="lazy" /><span>VCA-gecertificeerd</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="el-samen" aria-labelledby="el-t-samen">
        <div className="el-rand el-samen-raster">
          <h2 id="el-t-samen">Komt er een warmtepomp of airco?</h2>
          <p>Dan regelen we de elektrische aansluiting mee. U hoeft geen tweede bedrijf te zoeken.</p>
          <div className="el-samen-links">
            <Link href="/warmtepompen">Warmtepompen <Pijl /></Link>
            <Link href="/airco">Airco <Pijl /></Link>
          </div>
        </div>
      </section>

      <section className="el-vragen" aria-labelledby="el-t-vragen">
        <div className="el-rand el-vragen-raster">
          <h2 id="el-t-vragen">Vragen die we <span>vaak krijgen.</span></h2>
          <div className="el-vraag-lijst">
            {VRAGEN.map(([vraag, antwoord]) => <details key={vraag}>
              <summary>{vraag}<span className="el-plus" aria-hidden="true" /></summary>
              <p>{antwoord}</p>
            </details>)}
          </div>
        </div>
      </section>

      <section className="el-slot" aria-labelledby="el-t-slot">
        <div className="el-rand el-slot-raster">
          <div>
            <h2 id="el-t-slot">Vertel wat u wilt. <span>Wij denken mee.</span></h2>
            <p>Een korte omschrijving is genoeg. Een foto van uw groepenkast helpt ons om gericht mee te denken.</p>
          </div>
          <div className="el-slot-acties">
            <Link className="el-knop el-knop-licht" href={ADVIES}>{LABEL} <Pijl /></Link>
            <a className="el-bel" href="tel:+31736222199"><small>Of bel</small><strong>073 622 2199</strong></a>
            <p className="el-mail">Liever mailen? <a href="mailto:service@robbraam.com">service@robbraam.com</a></p>
          </div>
        </div>
      </section>
    </main>
    <MobileActionBar href={ADVIES} label={LABEL} />
    <SiteFooter />
  </>;
}
