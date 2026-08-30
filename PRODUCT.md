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
- De prijzen kloppen en zijn actueel. **De onderhoudspagina is leidend** en
  deze bedragen gelden overal (Comfort, vanaf-prijzen):
  - cv-ketel: €11,58 per maand, jaarprijs €139
  - cv-ketel met hybride warmtepomp: €24,08 per maand, jaarprijs €289
  - volledig elektrische warmtepomp: €19,92 per maand, jaarprijs €239

  Eenmalig onderhoud €180 binnen 's-Hertogenbosch, €190 daarbuiten.

  (Hier stond eerder warmtepomp €325 en hybride €275. Dat weersprak de site en
  is door de eigenaar gecorrigeerd: de onderhoudspagina klopt.)
- Certificering: het bedrijf is CO-gecertificeerd en heeft STEK-gecertificeerde
  monteurs.

**Deels bevestigd:**
- De review van Han Engels op de homepage ("Al toch 20 jaar zeer tevreden
  klant.") is door de eigenaar bevestigd als echt. Hij komt van de oude website
  en is niet opnieuw bij de klant nagevraagd, dus behandel hem als een citaat
  met herkomst, niet als een verse referentie.
- De overige reviews op de site zijn nog niet nagekeken. Behandel die als
  voorlopig en bouw er geen vertrouwensargument op.

**Besloten:** reviews worden met de hand bijgehouden, niet via de Google
Places API. Reden: die geeft maximaal vijf reviews terug, Google kiest welke,
en er valt niet op sterren te filteren. Elk citaat dat op de site komt moet dus
een echt citaat zijn dat de eigenaar zelf heeft nagekeken.

**Niet aanwezig:** er zijn geen cijfers over aantallen klanten, doorlooptijden,
besparingen of marktaandeel. Verzin die niet.

## Capabilities and Constraints — teksten en beeld

Het bedrijf telt op dit moment vier mensen en **groeit**. De site moet daar
tegen kunnen zonder onderhoud:

- **Noem nooit een aantal medewerkers, monteurs, bussen of contracten.** Een
  getal is over een half jaar onwaar en dwingt tot aanpassen. Dit gold al voor
  personeel en geldt net zo goed voor klantaantallen: op de onderhoudspagina
  stond "1.900 vaste contracten" als kop en als bijschrift. Dat getal klopt,
  maar het bedrijf groeit, dus het mag nergens vast staan. Het is vervangen
  door "Vaste contracten. Persoonlijk contact." Houd het zo.
- **Beloof geen specifieke persoon.** Formuleringen als "dit zijn de mensen die
  bij u langskomen" bij een foto van twee monteurs lezen als een garantie dat de
  klant juist die twee krijgt. Claims horen over de **afspraak** te gaan (geen
  onderaannemers, wie plaatst onderhoudt ook), want die blijft waar bij elke
  teamgrootte.
- **Niet alle monteurs willen herkenbaar op de site.** Voeg geen nieuwe
  personen toe zonder dat de eigenaar bevestigt dat zij dat willen, en bouw geen
  onderdeel dat een portret per monteur nodig heeft. Werkfoto's zonder gezichten
  zijn altijd veilig.

## Warmtepompen: merken en vermogens

Vermogens: **5, 7, 9 en 11 kW** voor woningen. Grote bedrijfsunits,
cascadeopstellingen en collectieve systemen vallen buiten de werkzaamheden.

Drie vaste merken, **gelijkwaardig**:

- LG THERMA V R290 Monobloc
- Bosch Compress 5800i AW
- Vaillant aroTHERM plus

De reden dat het deze drie zijn, is een verkoopargument en hoort in de teksten
terug te komen: **er wordt gekozen op kwaliteit en levensduur, niet op de
laagste inkoopprijs.** Het toestel moet jaren mee, en Braam onderhoudt hem
daarna zelf — dat is precies waarom er kieskeurig wordt ingekocht. Welk merk
bij een woning past hangt af van de opstelling, niet van een voorkeur.

Noem geen aantal merken in de tekst ("twee vaste merken"): dat is dezelfde val
als een aantal medewerkers. Er kwam een derde bij en de tekst klopte niet meer.

Voor cv-ketelonderhoud: Intergas, Remeha, Nefit en Vaillant, tot en met 40 kW.

**Bevestigd door de eigenaar:** een hybride opstelling die Braam plaatst kan
later worden omgebouwd naar volledig elektrisch. Dat mag als belofte in de
teksten staan. Let op dat het een toezegging is waar een klant jaren later op
terugkomt; wijzig hem niet zonder de eigenaar.

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
