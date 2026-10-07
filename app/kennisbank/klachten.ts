/* De klachten van "Wat ziet u?", van mild naar ernstig. Elke tekst komt uit
   bestaande sitetekst: het artikel over bijvullen, de korte uitleg van de
   geplande artikelen en de servicepagina. Niets hier is nieuw advies.

   Het oordeel staat in gewone woorden, zodat niemand een symbool of kleur
   hoeft te leren: kunt u zelf doen, zelf kijken en dan bellen, bel ons, of
   direct bellen. */

import { artikelHref } from "./basis";

export type Oordeel = "zelf" | "kijken" | "bellen" | "direct";

export const oordelen: Record<Oordeel, string> = {
  zelf: "Kunt u zelf doen",
  kijken: "Zelf kijken, dan bellen",
  bellen: "Bel ons",
  direct: "Direct bellen",
};

export type KlachtLink =
  | { soort: "artikel"; label: string; href: string }
  | { soort: "gepland"; label: string }
  | { soort: "pagina"; label: string; href: string }
  | { soort: "bel"; label: string; href: string; nadruk?: boolean };

export type Klacht = {
  id: string;
  klacht: string;
  oordeel: Oordeel;
  zoekwoorden: string[];
  zelfKop: string;
  zelf: string;
  /** Begin van de belzin, vet gezet: "Bel ons als", "Bel ons", "Bel direct". */
  bellenStart: string;
  bellen: string;
  links: KlachtLink[];
};

export const klachten: Klacht[] = [
  {
    id: "druk-te-laag",
    klacht: "De waterdruk is te laag",
    oordeel: "zelf",
    zoekwoorden: ["druk", "waterdruk", "bar", "bijvullen", "vullen", "drukmeter", "manometer"],
    zelfKop: "Wat u zelf kunt doen",
    zelf: "Lees de druk af als de installatie koud is. Bij veel installaties hoort die tussen 1,5 en 2,0 bar te staan; de handleiding van uw toestel blijft leidend. Staat hij lager, dan kunt u zelf bijvullen.",
    bellenStart: "Bel ons als",
    bellen: "u het vulpunt niet kunt vinden, een kraan vastzit of de druk niet stijgt.",
    links: [{ soort: "artikel", label: "Lees het stappenplan: cv-ketel bijvullen", href: artikelHref("cv-ketel-bijvullen") }],
  },
  {
    id: "radiatoren-koud",
    klacht: "De radiatoren worden niet goed warm",
    oordeel: "zelf",
    zoekwoorden: ["radiator", "radiatoren", "koud", "warm", "borrelt", "borrelen", "ontluchten", "verwarming"],
    zelfKop: "Wat u zelf kunt doen",
    zelf: "Kijk eerst naar de waterdruk, want een te lage druk kan de oorzaak zijn. Borrelt een radiator, dan kan ontluchten helpen. Controleer daarna de druk opnieuw: door ontluchten zakt die wat.",
    bellenStart: "Bel ons als",
    bellen: "het huis koud blijft terwijl de druk goed is. Dan is een andere controle nodig.",
    links: [
      { soort: "artikel", label: "Lees: cv-ketel bijvullen", href: artikelHref("cv-ketel-bijvullen", "wanneer-bijvullen") },
      { soort: "gepland", label: "Radiatoren ontluchten" },
    ],
  },
  {
    id: "steeds-bijvullen",
    klacht: "Ik moet steeds opnieuw bijvullen",
    oordeel: "kijken",
    zoekwoorden: ["steeds", "vaak", "opnieuw", "daalt", "zakt", "drukverlies", "terug", "lekt", "expansievat"],
    zelfKop: "Wat u zelf kunt doen",
    zelf: "Noteer bij welke koude druk u heeft gevuld en hoe snel die terugloopt. Een foto van de drukweergave helpt ons serviceteam bij de eerste beoordeling.",
    bellenStart: "Bel ons als",
    bellen: "de druk binnen dagen of weken weer daalt, of u meerdere keren per jaar moet bijvullen. Vaker bijvullen is een signaal, geen oplossing.",
    links: [
      { soort: "artikel", label: "Lees: waarom de druk blijft dalen", href: artikelHref("cv-ketel-bijvullen", "druk-blijft-dalen") },
      { soort: "gepland", label: "Cv-ketel druk te laag: oorzaken" },
    ],
  },
  {
    id: "storingscode",
    klacht: "De ketel geeft een storingscode",
    oordeel: "kijken",
    zoekwoorden: ["storing", "storingscode", "foutcode", "code", "melding", "display", "doet het niet", "tapwater", "warm water"],
    zelfKop: "Wat u zelf kunt doen",
    zelf: "Schrijf de code over, samen met merk en type van de ketel. Kijk naar de waterdruk en de thermostaat, zonder aan het toestel zelf te sleutelen.",
    bellenStart: "Bel ons als",
    bellen: "de ketel in storing blijft, of de woning en het tapwater niet warm worden.",
    links: [
      { soort: "pagina", label: "Naar storing en service", href: "/service" },
      { soort: "gepland", label: "Ketelstoring: wat u veilig zelf controleert" },
    ],
  },
  {
    id: "water-bij-ketel",
    klacht: "Ik zie water bij de ketel of de leidingen",
    oordeel: "bellen",
    zoekwoorden: ["water", "lek", "lekkage", "druppelt", "druppel", "nat", "plas", "overstortventiel"],
    zelfKop: "Wat u zelf kunt doen",
    zelf: "Open de mantel van de ketel niet. Maak een overzichtsfoto en een close-up van de plek waar het water zit.",
    bellenStart: "Bel ons",
    bellen: "altijd. Water bij de ketel, de leidingen, een radiator of het overstortventiel laat u door ons serviceteam bekijken.",
    links: [
      { soort: "bel", label: "Bel 073 622 2199", href: "tel:+31736222199" },
      { soort: "pagina", label: "Naar storing en service", href: "/service" },
    ],
  },
  {
    id: "gaslucht",
    klacht: "Ik ruik gas of vermoed koolmonoxide",
    oordeel: "direct",
    zoekwoorden: ["gas", "gaslucht", "ruik", "koolmonoxide", "co", "melder"],
    zelfKop: "Doe dit eerst",
    zelf: "Stop met wat u doet. Vermijd vonken en open vuur en ga naar buiten als dat veilig kan.",
    bellenStart: "Bel direct",
    bellen: "het Nationaal Storingsnummer gas en stroom: 0800 9009, gratis en dag en nacht bereikbaar. Bij direct gevaar belt u 112.",
    links: [
      { soort: "bel", label: "Gaslucht: bel 0800 9009", href: "tel:08009009", nadruk: true },
      { soort: "bel", label: "Direct gevaar: bel 112", href: "tel:112" },
    ],
  },
];

export function normaliseer(tekst: string) {
  return tekst.toLocaleLowerCase("nl").normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

export function zoekwoorden(vraag: string) {
  return normaliseer(vraag).split(/\s+/).filter((w) => w.length > 1);
}

/* Een klacht past als elk woord van de zoekvraag in de klacht of in een
   zoekwoord voorkomt. Een heel woord ("lek") telt zwaarder dan een stukje
   van een woord ("lekt"), zodat de beste treffer bovenaan komt. */
export function klachtScore(klacht: Klacht, vraag: string) {
  const woorden = zoekwoorden(vraag);
  if (woorden.length === 0) return 0;
  const tekst = normaliseer(`${klacht.klacht} ${klacht.zoekwoorden.join(" ")}`);
  const losseWoorden = new Set(tekst.split(/[^a-z0-9]+/));
  let score = 0;
  for (const w of woorden) {
    if (losseWoorden.has(w)) score += 2;
    else if (tekst.includes(w)) score += 1;
    else return 0;
  }
  return score;
}
