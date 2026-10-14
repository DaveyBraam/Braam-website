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
  title: 'Ook voor elektra kunt u bij ons terecht',
  description: "Ook voor elektrawerk kunt u terecht bij Rob Braam. Onze eigen elektricien verzorgt uw groepenkast en een aparte groep voor uw airco of warmtepomp als dat nodig is.",
  alternates: { canonical: '/elektra' },
};

const ADVIES = '/offerte-aanvragen?dienst=elektra';
const LABEL = 'Vraag naar de mogelijkheden';

const DIENSTEN = [
  ['Een aparte groep voor uw airco of warmtepomp', 'Plaatsen wij bij u een airco of warmtepomp en is daarvoor een aparte groep nodig? Dan verzorgt onze eigen elektricien die. We stemmen het elektrawerk af op de installatie.'],
  ['Uw groepenkast uitbreiden of vervangen', 'Nieuwe apparatuur kan om een aanpassing van uw groepenkast vragen. We bekijken wat er al aanwezig is en bespreken welke aanpassing nodig is.'],
  ['Elektrawerk in uw woning', 'Ook met andere elektrawerkzaamheden kunt u bij ons terecht. Vertel ons wat u wilt laten aanpassen, dan bekijken we samen de mogelijkheden.'],
  ['Meedenken over uw aansluiting', 'Twijfelt u of uw elektrische installatie geschikt is voor uw plannen? We kijken met u mee en leggen uit wat er nodig is.'],
] as const;

const VRAGEN = [
  ['Kan ik ook alleen voor elektrawerk bij u terecht?', 'Ja, ook voor elektrawerkzaamheden kunt u contact met ons opnemen. U hoeft daarvoor geen airco of warmtepomp bij ons te laten plaatsen. Vertel ons wat u nodig heeft, dan bespreken we de mogelijkheden.'],
  ['Verzorgt u ook een aparte groep voor mijn airco of warmtepomp?', 'Ja. Als wij een airco of warmtepomp installeren en daarvoor een aparte groep nodig is, verzorgt onze eigen elektricien die. U hoeft daar zelf geen andere elektricien voor te regelen.'],
  ['Is er altijd een aparte groep nodig?', 'Dat hangt af van het toestel en uw bestaande elektrische installatie. We bekijken wat de aansluiting vraagt en bespreken met u of er een extra groep of een andere aanpassing nodig is.'],
  ['Moet mijn groepenkast helemaal worden vervangen?', 'Dat is niet altijd nodig. We bekijken de staat van uw groepenkast en wat u wilt aansluiten. Daarna bespreken we of uitbreiden mogelijk is of vervangen nodig is.'],
  ['Hoe kan ik elektrawerk aanvragen?', 'U kunt ons bellen, mailen of het aanvraagformulier invullen. Beschrijf kort uw plannen. Heeft u een foto van uw groepenkast, dan helpt die ons om uw situatie te bekijken.'],
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
          <li><Vink />Onze eigen elektricien</li>
          <li><Vink />Elektrawerk en installatie afgestemd</li>
          <li><Vink />Ook voor losse elektrawerkzaamheden</li>
        </ul>
      </div>

      <section className="el-verandert" aria-labelledby="el-t-verandert">
        <div className="el-rand el-verandert-raster">
          <div>
            <h2 id="el-t-verandert">Een airco of warmtepomp in huis.</h2>
            <p>Bij het plaatsen van een airco of warmtepomp hoort ook een passende elektrische aansluiting. Daarom bekijken we vooraf of uw groepenkast geschikt is en of er een aparte groep nodig is.</p>
          </div>
          <div>
            <h2>Wij verzorgen <span>ook de elektra.</span></h2>
            <p>Is er een aanpassing nodig? Onze eigen elektricien verzorgt het elektrawerk. Zo sluiten de werkzaamheden op elkaar aan en kunt u voor de installatie en de elektra bij ons terecht.</p>
          </div>
        </div>
      </section>

      {fotos.length > 0 && <section className="el-werkfotos" aria-labelledby="el-t-fotos">
        <div className="el-rand el-werkfotos-raster">
          <div className="el-werkfotos-tekst">
            <h2 id="el-t-fotos">Elektrawerk <span>bij onze klanten.</span></h2>
            <p>Een kijkje in de meterkast: hieronder ziet u groepenkasten die wij bij klanten hebben geplaatst.</p>
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
          <h2 id="el-t-hulp">Voor deze werkzaamheden <span>kunt u bij ons terecht.</span></h2>
          <ul className="el-hulp-lijst">
            {DIENSTEN.map(([kop, tekst]) => <li key={kop}>
              <h3>{kop}</h3>
              <p>{tekst}</p>
            </li>)}
          </ul>
        </div>
      </section>

      <Werkwijze />

      <section className="el-samen" aria-labelledby="el-t-samen">
        <div className="el-rand el-samen-raster">
          <h2 id="el-t-samen">Meer weten over airco of warmtepompen?</h2>
          <p>Bekijk de mogelijkheden voor uw woning. Het elektrawerk dat bij de plaatsing nodig is, nemen we mee in het advies.</p>
          <div className="el-samen-links">
            <Link href="/warmtepompen">Warmtepompen <Pijl /></Link>
            <Link href="/airco">Airco <Pijl /></Link>
          </div>
        </div>
      </section>

      <section className="el-vragen" aria-labelledby="el-t-vragen">
        <div className="el-rand el-vragen-raster">
          <h2 id="el-t-vragen">Uw vragen <span>over elektrawerk.</span></h2>
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
            <h2 id="el-t-slot">Elektrawerk nodig? <span>Neem gerust contact op.</span></h2>
            <p>Of het nu gaat om een losse elektraklus of de aansluiting van een nieuwe installatie: vertel ons uw plannen. We bespreken graag wat we voor u kunnen doen.</p>
          </div>
          <div className="el-slot-acties">
            <Link className="el-knop el-knop-licht" href={ADVIES}>{LABEL} <Pijl /></Link>
            <a className="el-bel" href="tel:+31736222199"><small>Bel ons op</small><strong>073 622 2199</strong></a>
            <p className="el-mail">U kunt ook mailen: <a href="mailto:service@robbraam.com">service@robbraam.com</a></p>
          </div>
        </div>
      </section>
    </main>
    <MobileActionBar href={ADVIES} label={LABEL} />
    <SiteFooter />
  </>;
}
