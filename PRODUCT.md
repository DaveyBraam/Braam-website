# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Particulieren met een koopwoning in en rond 's-Hertogenbosch. Drie situaties komen
ongeveer even vaak voor en geen ervan is de hoofdgroep:

1. **Storing, met spoed.** De ketel doet het niet of het huis wordt niet warm. Deze
   bezoeker wil binnen één tel weten dat er iemand bereikbaar is.
2. **Oriënteert op een warmtepomp.** Overweegt een grote investering, vergelijkt en
   wil eerst begrijpen wat het kost en oplevert voordat hij een offerte aanvraagt.
3. **Bestaande klant voor onderhoud.** Kent het bedrijf al en wil een afspraak maken,
   een abonnement afsluiten of iets regelen.

Omdat er geen hoofdgroep is, moeten deze drie routes vanaf de homepage direct uit
elkaar te halen zijn. Eén groep voorrang geven kost de andere twee.

Er zijn ook verhuurders: het abonnementsformulier kent een aparte variant voor
onderhoud aan meerdere panden.

## Product Purpose

Verwarming en installatietechniek voor woningen: advies, ontwerp, installatie,
onderhoud en service. Cv-ketels plaatsen, cv-onderhoud en storingen, boilers,
geisers en kachels, warmtepompen, vloerverwarming, airconditioning en het
bijbehorende elektrawerk.

De site moet drie dingen mogelijk maken: contact leggen bij een storing, een
offerte aanvragen voor nieuw werk, en onderhoud of een abonnement regelen.

## Positioning

**Eigen team, van advies tot service.** Geen onderaannemers en geen wisselende
gezichten: dezelfde mensen doen het advies, de installatie én het onderhoud
daarna. Een installateur die het werk uitbesteedt kan dit niet waarmaken.

## Operating Context

Bedrijf: Service & Montagebedrijf Rob Braam, Jacob van Wassenaerstraat 10,
5224 GG 's-Hertogenbosch. Telefoon 073 622 2199. Eigenaar: Rob Braam.
Actief sinds 2000.

Werkgebied: Noord-Brabant en aangrenzende delen van Gelderland.

Aanvragen komen per e-mail binnen op twee adressen: `planning@robbraam.com` voor
onderhoud en abonnementen, `service@robbraam.com` voor offertes en
terugbelverzoeken. Die scheiding is een werkafspraak en moet blijven bestaan.

## Capabilities and Constraints

De site kent vier dienstenpagina's (warmtepompen, cv-ketels, airco, elektra),
een onderhouds- en abonnementenpagina, service, projecten, kennisbank met
artikelen, over ons, contact, veelgestelde vragen en privacy.

Vier formulieren: offerte aanvragen, terugbelverzoek, abonnement aanvragen en
eenmalig onderhoud aanvragen. Ze versturen via FormSubmit, een externe
doorstuurdienst; er is geen eigen serververwerking.

**Openstaand:** het is nog niet bevestigd dat FormSubmit voor beide mailadressen
is geactiveerd. Zolang dat niet vaststaat is onzeker of aanvragen daadwerkelijk
aankomen.

Technisch: Next.js 16 met vinext, draaiend als Cloudflare Worker. Geen database
in gebruik. `npm run build` werkt alleen in een Linux-omgeving; bouwen gaat met
`vinext build`.

## Brand Commitments

Naam en logo: Service & Montagebedrijf Rob Braam. Aanspreekvorm is **u**, niet je.
De site is volledig Nederlandstalig en moet dat blijven.

De homepage opent met een scroll-hero: vier eigen scènes van één klantbezoek —
aankomst, het werk aan de warmtepomp, uitleg bij de thermostaat, en afscheid met
een handdruk. Die vertelt de positionering in beeld en is bewust behouden.

## Evidence on Hand

**Bevestigd echt:**
- De projectfoto's in de galerij zijn eigen uitgevoerde installaties.
- De prijzen kloppen en zijn actueel: warmtepomp €325, hybride €275, cv-ketel
  €139 per jaar per toestel. Eenmalig onderhoud €180 binnen 's-Hertogenbosch,
  €190 daarbuiten.
- Certificering: het bedrijf is CO-gecertificeerd en heeft STEK-gecertificeerde
  monteurs.

**Deels bevestigd:**
- De review van Han Engels op de homepage ("Al toch 20 jaar zeer tevreden
  klant.") is door de eigenaar bevestigd als echt. Hij komt van de oude website
  en is niet opnieuw bij de klant nagevraagd, dus behandel hem als een citaat
  met herkomst, niet als een verse referentie.
- De overige reviews op de site zijn nog niet nagekeken. Behandel die als
  voorlopig en bouw er geen vertrouwensargument op.

**Openstaand:** de eigenaar overweegt de losse citaten te vervangen door
Google-reviews die zichzelf bijhouden. Zolang dat niet is besloten blijft het
bestaande citaat staan.

**Niet aanwezig:** er zijn geen cijfers over aantallen klanten, doorlooptijden,
besparingen of marktaandeel. Verzin die niet.

## Capabilities and Constraints — teksten en beeld

Het bedrijf telt op dit moment vier mensen en **groeit**. De site moet daar
tegen kunnen zonder onderhoud:

- **Noem nooit een aantal medewerkers, monteurs of bussen.** Een getal is over
  een half jaar onwaar en dwingt tot aanpassen. Op dit moment staat er nergens
  een aantal in de teksten; houd dat zo.
- **Beloof geen specifieke persoon.** Formuleringen als "dit zijn de mensen die
  bij u langskomen" bij een foto van twee monteurs lezen als een garantie dat de
  klant juist die twee krijgt. Claims horen over de **afspraak** te gaan (geen
  onderaannemers, wie plaatst onderhoudt ook), want die blijft waar bij elke
  teamgrootte.
- **Niet alle monteurs willen herkenbaar op de site.** Voeg geen nieuwe
  personen toe zonder dat de eigenaar bevestigt dat zij dat willen, en bouw geen
  onderdeel dat een portret per monteur nodig heeft. Werkfoto's zonder gezichten
  zijn altijd veilig.

## Product Principles

1. **Drie routes, gelijkwaardig.** Storing, oriëntatie en onderhoud zijn drie
   verschillende bezoekers. Elke pagina moet duidelijk maken welke route hij dient.
2. **Bereikbaarheid is de belangrijkste functie.** Bij een storing telt elke
   seconde; het telefoonnummer mag nergens weggestopt zijn.
3. **Toon het eigen team.** De positionering is dat het dezelfde mensen zijn.
   Dat werkt alleen met echt eigen beeld, niet met stockfotografie.
4. **Beloof niets wat niet is nagekeken.** Prijzen en certificeringen mogen hard
   gebracht worden; reviews en cijfers niet.
5. **Geschreven voor iemand zonder vakkennis.** De bezoeker is een huiseigenaar,
   geen installateur.

## Accessibility & Inclusion

Geen specifieke eis vastgesteld. De doelgroep bevat wel huiseigenaren van alle
leeftijden, dus leesbare tekstgroottes en voldoende contrast zijn een praktische
ondergrens, niet een formele norm.
