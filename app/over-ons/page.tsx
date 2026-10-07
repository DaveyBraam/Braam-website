import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { Aanpak } from "./Aanpak";
import { Kop } from "./Kop";
import "./over-ons.css";

/* Over ons (sinds 7 oktober 2026): donkerblauw en sfeervol. Het eigen
   pand bij avond, wie we zijn, vijf stappen van één klantcontact, ruim 25 jaar,
   waar u op kunt rekenen, en contact. Achtergrond:
   braam-premium-concept/scrollcraft/builds/over-ons-v2/BRIEF.md

   Vaste regels: geen aantallen medewerkers of klanten, geen specifieke monteur
   beloven, merken zonder aantal noemen, keurmerkteksten zoals op /onderhoud. */

export const metadata: Metadata = {
  title: "Over Service & Montagebedrijf Rob Braam",
  description: "Gecertificeerd installatiebedrijf uit 's-Hertogenbosch, opgericht in 2000 door Rob Braam. Advies, installatie, onderhoud en service door ons eigen team.",
};

const keurmerken = [
  { logo: "/certifications/co-keur.png", titel: "CO-certificering via CO-Keur", tekst: "De verplichte controles en metingen aan gasverbrandingsinstallaties worden via CO-Keur vastgelegd en gerapporteerd. Onze monteurs behaalden hun Vakmanschap CO via Installatiewerk Nederland." },
  { logo: "/certifications/stek.png", titel: "STEK-gecertificeerd", tekst: "Voor werkzaamheden aan airco en warmtepompen waarbij koudemiddelen betrokken zijn." },
  { logo: "/certifications/installq.png", titel: "Geregistreerd bij InstallQ", tekst: "De onafhankelijke stichting voor kwaliteitsborging in de installatiesector." },
  { logo: "/certifications/vca.png", titel: "VCA-gecertificeerd", tekst: "Aantoonbare aandacht voor veilig, gezond en milieubewust werken tijdens onze werkzaamheden." },
];

export default function OverOnsPage() {
  return (
    <>
      <SiteHeader />
      <main className="oo">
        <Kop />

        <section className="oo-wie" aria-labelledby="oo-wie-titel">
          <div className="shell">
            <div className="oo-wie-kop">
              <h2 id="oo-wie-titel">Begonnen door Rob Braam. Gegroeid met een eigen team.</h2>
              <p className="oo-wie-lead">Wat in 2000 begon bij Rob Braam, is inmiddels een eigen team in ons pand in ’s-Hertogenbosch: een kantoor dat de planning en uw vragen regelt, en monteurs voor installatie en elektra. Rob is er nog altijd bij.</p>
            </div>
            <div className="oo-wie-raster">
              <div>
                <h3>Wat we doen</h3>
                <p>Verwarming en installatietechniek voor woningen: cv-ketels plaatsen, onderhoud en storingen, boilers, geisers en kachels, warmtepompen, vloerverwarming, airco en het elektrawerk dat erbij hoort. Van advies en ontwerp tot installatie, onderhoud en service.</p>
              </div>
              <div>
                <h3>Voor wie</h3>
                <p>Vooral voor particulieren met een eigen woning, voor eenmalig werk en voor onderhoud dat elk jaar terugkomt. Verhuurders met meerdere panden kunnen bij ons ook een onderhoudsabonnement afsluiten.</p>
              </div>
              <div>
                <h3>Waar we werken</h3>
                <p>Ons meeste onderhoud zit in ’s-Hertogenbosch en omgeving. Inmiddels werken we ook op veel adressen verder in Noord-Brabant en in aangrenzende delen van Gelderland. Bij een nieuwe aanvraag kijken we naar postcode, installatie en werkzaamheden, zodat u vooraf weet wat op uw adres mogelijk is.</p>
              </div>
            </div>
          </div>
        </section>

        <Aanpak />

        <section className="oo-jaren" aria-labelledby="oo-jaren-titel">
          <div className="shell oo-jaren-raster">
            <p className="oo-jaren-getal" aria-hidden="true">25<span>+</span></p>
            <div className="oo-jaren-tekst">
              <h2 id="oo-jaren-titel">Ruim 25 jaar dezelfde naam aan de deur.</h2>
              <p>Sinds 2000 installeren en onderhouden we verwarming in en rond ’s-Hertogenbosch, onder de naam van de man die het bedrijf begon. Dat is geen leus maar een afspraak: wie bij ons een installatie laat plaatsen, kan daar jaren later nog bij hetzelfde bedrijf mee terecht.</p>
            </div>
          </div>
        </section>

        <section className="oo-vak" aria-labelledby="oo-vak-titel">
          <div className="shell">
            <div className="oo-beloftes">
              <h2 id="oo-vak-titel">Waar u op kunt rekenen.</h2>
              <ul>
                <li><h3>Een eerlijk antwoord</h3><p>We adviseren wat technisch en praktisch bij uw woning past, ook als een andere oplossing verstandiger is.</p></li>
                <li><h3>Netjes werk</h3><p>Een installatie moet goed functioneren, verzorgd zijn aangelegd en later bereikbaar blijven voor onderhoud.</p></li>
                <li><h3>Veilige vakmensen</h3><p>Ons bedrijf en onze monteurs hebben de certificeringen en vakbekwaamheid die voor hun werk nodig zijn.</p></li>
                <li><h3>Contact na afloop</h3><p>Na de oplevering kunt u bij hetzelfde bedrijf terecht voor onderhoud, een servicevraag of gewoon uitleg.</p></li>
              </ul>
            </div>
          </div>
          <div className="shell oo-vak-raster">
            <div className="oo-vak-inkoop">
              <h3 className="oo-vak-kop">Kieskeurig in wat we plaatsen.</h3>
              <p>We kiezen op kwaliteit en levensduur, niet op de laagste inkoopprijs. Een toestel moet jaren mee, en we onderhouden het daarna zelf. Welk merk bij uw woning past, hangt af van de opstelling, niet van een voorkeur. Een hybride opstelling die wij plaatsen, kan later worden omgebouwd naar volledig elektrisch.</p>
              <dl className="oo-merken">
                <div><dt>Warmtepompen</dt><dd>LG THERMA V R290 Monobloc, Bosch Compress 5800i AW en Vaillant aroTHERM plus</dd></div>
                <div><dt>Onderhoud cv-ketels</dt><dd>Intergas, Remeha, Nefit en Vaillant</dd></div>
              </dl>
              <p className="oo-vak-link"><Link href="/projecten">Bekijk ons werk</Link></p>
            </div>
            <ul className="oo-keurmerken" aria-label="Keurmerken en certificeringen">
              {keurmerken.map((k) => (
                <li key={k.titel}>
                  <span className="oo-logo"><img src={k.logo} alt="" loading="lazy" decoding="async" /></span>
                  <div><h3>{k.titel}</h3><p>{k.tekst}</p></div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="oo-slot" aria-labelledby="oo-slot-titel">
          <div className="shell oo-slot-raster">
            <div className="oo-slot-tekst">
              <h2 id="oo-slot-titel">Wilt u weten of Braam bij u past?</h2>
              <p>Vertel ons eerst waar u hulp bij zoekt. We beoordelen uw vraag en laten weten of foto’s en gegevens voldoende zijn of dat een afspraak op locatie nodig is.</p>
              <div className="oo-acties">
                <Link className="button button-primary" href="/contact">Neem contact met ons op <span aria-hidden="true">↗</span></Link>
                <a className="oo-bel" href="tel:+31736222199"><small>Liever direct bellen?</small><strong>073 622 2199</strong></a>
              </div>
            </div>
            <address className="oo-adres">
              <strong>Service &amp; Montagebedrijf Rob Braam</strong>
              <span>Jacob van Wassenaerstraat 10</span>
              <span>5224 GG ’s-Hertogenbosch</span>
              <span className="oo-adres-noot">Op afspraak ontvangen we u hier. We werken in Noord-Brabant en aangrenzende delen van Gelderland.</span>
            </address>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
