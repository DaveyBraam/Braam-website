import type { Metadata } from "next";
import { ContactCTA } from "../components/ContactCTA";
import { PageHero } from "../components/PageHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Veelgestelde vragen | Rob Braam",
  description: "Antwoorden op veelgestelde vragen over offertes, warmtepompen, cv-ketels, airco, elektra, onderhoudsabonnementen en service.",
};

const faqGroups = [
  {
    eyebrow: "Offerte & werkwijze",
    title: "Van eerste vraag tot duidelijke afspraak.",
    intro: "U hoeft vooraf niet alle technische gegevens te kennen. Met een korte omschrijving en een paar foto’s kunnen we vaak al bepalen wat de beste volgende stap is.",
    items: [
      {
        question: "Hoe vraag ik een offerte aan?",
        answer: "Gebruik het offerteformulier en kies cv-ketel, warmtepomp, airco, elektra of onderhoud. Beschrijf kort wat u wilt laten maken of vervangen. Daarna laten we weten welke informatie of afspraak nog nodig is.",
      },
      {
        question: "Komen jullie altijd eerst bij mij thuis kijken?",
        answer: "Nee. We beoordelen eerst uw omschrijving, foto’s en installatiegegevens. Voor kleinere of duidelijk zichtbare werkzaamheden kan dat voldoende zijn. Als een technische opname nodig is, laten we dat na de eerste beoordeling weten en plannen we daarvoor een aparte afspraak.",
      },
      {
        question: "In welke plaatsen werkt Braam?",
        answer: "Het grootste deel van ons onderhoud zit in ’s-Hertogenbosch en omliggende plaatsen. Daarnaast werken we op veel adressen in Noord-Brabant en in aangrenzende delen van Gelderland, onder meer in Hedel en Ammerzoden. We gebruiken geen harde provinciegrens: stuur uw postcode en het soort werkzaamheden door, dan laten we weten wat op uw adres mogelijk is.",
      },
    ],
  },
  {
    eyebrow: "Installaties",
    title: "Warmte, koeling en elektra uit één team.",
    intro: "We kijken naar de volledige woninginstallatie. Zo sluiten techniek, capaciteit en elektrische voeding goed op elkaar aan.",
    items: [
      {
        question: "Kies ik een hybride of full-electric warmtepomp?",
        answer: "Een hybride warmtepomp werkt samen met uw cv-ketel. Een volledig elektrische, ook wel full-electric, warmtepomp verwarmt de woning zonder cv-ketel. Wij werken met warmtepompen van 5, 7, 9 en 11 kW. Welk vermogen en welke opstelling geschikt zijn, bepalen we aan de hand van onder meer het warmteverlies, de isolatie en de warmteafgifte.",
      },
      {
        question: "Met welke merken en vermogens werkt Braam?",
        answer: "Voor cv-ketelonderhoud werken we uitsluitend met Intergas, Remeha, Nefit en Vaillant, tot en met 40 kW. Voor warmtepompen werken we standaard met LG, Bosch en Vaillant en met vermogens van 5, 7, 9 en 11 kW. Onderhoud aan andere warmtepompmerken beoordelen we op aanvraag. Grote bedrijfsunits, cascades en collectieve systemen vallen buiten onze werkzaamheden.",
      },
      {
        question: "Kunnen LG- en Vaillant-warmtepompen verwarmen, warm water maken en koelen?",
        answer: "Afhankelijk van het gekozen systeem en binnendeel zijn verwarming, warm water en koeling mogelijk. Na uw aanvraag bepalen we of een technische opname nodig is om de bestaande installatie, warmteafgifte, mogelijke opstelplaats en elektrische aansluiting te beoordelen. De aangeboden functies en opstelling staan duidelijk in de offerte.",
      },
      {
        question: "Kan een airco ook verwarmen?",
        answer: "Ja. Een moderne airco kan gericht koelen én verwarmen. We berekenen welke capaciteit bij de ruimte past en bespreken waar de binnen- en buitenunit praktisch kunnen worden geplaatst.",
      },
      {
        question: "Moet ik zelf een elektricien regelen?",
        answer: "Nee. Onze eigen elektricien kan de groepenkast aanpassen, extra groepen plaatsen en de voeding voor een warmtepomp of airco meenemen in hetzelfde project.",
      },
    ],
  },
  {
    eyebrow: "Onderhoud & abonnement",
    title: "Eén losse beurt of alles voor het jaar geregeld.",
    intro: "Op de onderhoudspagina kunt u beide vormen naast elkaar vergelijken. De contractprijs hangt af van het systeem dat in uw woning staat.",
    items: [
      {
        question: "Wat is het verschil tussen eenmalig onderhoud en een abonnement?",
        answer: "Bij een eenmalige beurt maakt u één onderhoudsafspraak zonder jaarlijkse overeenkomst. Met een abonnement legt u jaarlijks onderhoud en de afgesproken servicevoordelen voor het hele contractjaar vast.",
      },
      {
        question: "Welke onderhoudsabonnementen zijn er?",
        answer: "Voor een cv-ketel kost Comfort € 11,58 en Comfort Plus € 19,92 per maand. Voor een hybride warmtepomp met cv-ketel kost Comfort € 24,08 en Comfort Plus € 35,75 per maand. Voor een all-electric warmtepomp kost Comfort € 19,92 en Comfort Plus € 31,58 per maand. De volledige jaarprijzen staan altijd bij de pakketten en alle bedragen zijn inclusief btw.",
      },
      {
        question: "Kan ik het abonnement per maand betalen?",
        answer: "Ja. U kunt jaarlijks betalen of de jaarprijs in 12 termijnen via automatische incasso laten afschrijven. Het maandbedrag staat bij ieder abonnement: van gemiddeld € 11,58 voor Comfort cv-ketel tot € 35,75 voor Comfort Plus hybride. Na beoordeling ontvangt u eerst de bevestiging en incassomachtiging. Door afronding kan één termijn enkele centen afwijken.",
      },
      {
        question: "Mogen bestaande klanten jaarlijks blijven betalen?",
        answer: "Ja. Bestaande klanten die gewend zijn één keer per jaar te betalen, kunnen die betaalwijze behouden. Er verandert niets zonder dat dit met de klant is afgesproken.",
      },
      {
        question: "Wat gebeurt er tijdens de jaarlijkse controle?",
        answer: "Braam plant ieder jaar een controle. We controleren het toestel visueel, voeren veiligheids- en verbrandingsmetingen uit en stellen het toestel bij wanneer dat nodig is. Niet ieder toestel hoeft bij ieder bezoek volledig uit elkaar; wat we openen of reinigen hangt af van het toestel, de toestand en de meetresultaten.",
      },
      {
        question: "Wat als ik de jaarlijkse controle wil uitstellen of overslaan?",
        answer: "Een afspraak kan in overleg worden uitgesteld. Het abonnement blijft actief en de abonnementskosten blijven verschuldigd, omdat u betaalt voor een doorlopend servicepakket en niet voor één los onderhoudsbezoek.",
      },
      {
        question: "Wat betekenen geen voorrijkosten en geen arbeidsloon?",
        answer: "Bij alle onderhoudsabonnementen zijn voorrijkosten en arbeidsloon inbegrepen voor onderhoud en storingswerk dat binnen de abonnementsafspraken valt. Bij Comfort wordt materiaal apart berekend. Bij Comfort Plus is materiaal binnen de onderhoudsmantel inbegrepen.",
      },
      {
        question: "Kan de mechanische ventilatiebox worden meegenomen?",
        answer: "Ja. Bij het ketel- of combinatieabonnement kan de ventilatiebox voor € 37,50 extra per jaar tijdens het geplande onderhoud worden schoongemaakt.",
      },
      {
        question: "Doet Braam ook onderhoud voor verhuurders of meerdere panden?",
        answer: "Ja. Geef per woning of pand het volledige adres door en vermeld duidelijk of daar een cv-ketel, een hybride installatie of een volledig elektrische warmtepomp staat. Voeg merk, model, vermogen indien bekend en de laatste onderhoudsdatum toe. Daarna beoordelen we de adressen en installaties en stemmen we werkzaamheden, planning en prijs met u af.",
      },
    ],
  },
  {
    eyebrow: "Service",
    title: "Sneller geholpen met de juiste informatie.",
    intro: "U hoeft de storing niet zelf op te lossen. Een paar concrete gegevens helpen ons wel om uw vraag sneller bij de juiste collega te krijgen.",
    items: [
      {
        question: "Waar plan, verzet of annuleer ik een onderhoudsafspraak?",
        answer: "Werk, offertes, storingen en technische vragen gaan via service@robbraam.com. Planning@robbraam.com is bedoeld voor onderhoud en voor het plannen, verzetten of annuleren van een afspraak.",
      },
      {
        question: "Wat stuur ik mee bij een servicevraag?",
        answer: "Stuur uw adres en telefoonnummer, het merk en type van de installatie, een eventuele storingscode en duidelijke foto’s van het toestel en de situatie mee.",
      },
      {
        question: "Helpen jullie ook bij een installatie die niet door Braam is geplaatst?",
        answer: "Stuur merk, type, leeftijd en uw vraag naar ons serviceteam. We beoordelen vervolgens persoonlijk of we de installatie in service of onderhoud kunnen nemen.",
      },
    ],
  },
];

export default function VeelgesteldeVragenPage() {
  return <><SiteHeader /><main>
    <PageHero eyebrow="Veelgestelde vragen" title="Eerst even rustig nalezen." accent="Daarna persoonlijk overleggen." intro="Hier vindt u korte antwoorden op vragen die klanten vaak stellen over advies, installatie, onderhoud en service. Staat uw vraag er niet bij? Dan helpen we u rechtstreeks verder." image="/about/planning-rob-braam.jpg" imageAlt="Medewerker van Rob Braam beantwoordt een klantvraag" primaryLabel="Offerte of vraag doorgeven" badge="Antwoord van ons eigen team" />

    <div className="faq-page">
      {faqGroups.map((group, groupIndex) => (
        <section className="section faq-page-section reveal" key={group.eyebrow}>
          <div className="shell faq-page-layout">
            <div className="faq-page-intro"><p className="eyebrow"><span /> {group.eyebrow}</p><h2>{group.title}</h2><p>{group.intro}</p></div>
            <div className="faq-accordion">
              {group.items.map((item, itemIndex) => (
                <details key={item.question}>
                  <summary><span>{String(groupIndex + 1).padStart(2, "0")}.{itemIndex + 1}</span><strong>{item.question}</strong><i aria-hidden="true">+</i></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>

    <ContactCTA title="Staat uw vraag er niet tussen?" text="Stuur ons een korte omschrijving of bel even. Iemand uit ons eigen team kijkt met u mee en vertelt welke volgende stap logisch is." />
  </main><SiteFooter /></>;
}
