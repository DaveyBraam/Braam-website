# Opdracht: de openingen van airco, cv-ketels en elektra

Drie openingsblokken, één per dienstenpagina, in de plaats van de huidige
`PageHero`. Zelfde ambitie als de warmtepompstudio: het blok bovenaan voert
het argument dat de bezoeker moet horen vóór hij verder leest, in echte
DOM-tekst die op scroll aan het woord komt.

**Wereld: Het Handboek.** Ligt vast, hoeft niet opnieuw gekozen te worden.
Zie `.impeccable/surfaces/app-page-tsx.md` voor de regels en
`.impeccable/surfaces/app-warmtepompen-page-tsx.md` voor wat de studio
geleerd heeft.

---

## Waarom niet drie keer dezelfde studio

De warmtepompstudio draait een gegenereerd toestel rond op een witte plaat.
Dat werkt daar omdat de buitenunit hét ding is waar de bezoeker over twijfelt:
hij staat straks tegen zijn gevel. Bij de andere drie is het toestel juist
niet het argument.

- Bij **airco** gaat het niet over de wandunit maar over de ruimte eromheen.
- Bij **cv-ketels** gaat het er letterlijk over dat de ketel het makkelijke
  deel is.
- Bij **elektra** is het onderwerp de verdeler, en die is geen sfeerbeeld.

Drie keer een draaiend apparaat zou de vorm herhalen en het argument missen.
Daarom houdt elke pagina de mechaniek — sticky plaat, scroll-gescrubd, tekst
als hoofdrol — maar krijgt hij zijn eigen instrument.

**Twee praktische gevolgen.** Alle drie zijn getekende platen: SVG-lijnwerk
dat zichzelf tekent op scroll, geen frame-sequences. Dus:

1. **Geen Higgsfield-credits.** Niets te genereren, alles is code.
2. **Geen merkprobleem.** Een getekende plaat draagt geen woordmerk van een
   fabrikant, en dat is precies de vraag die op de warmtepompenpagina nog
   open staat.

Een getekende plaat is bovendien méér Het Handboek dan een render: gezag door
precisie. Wil je toch een gegenereerd toestel op één van de drie, dan is
cv-ketels de enige waar dat iets toevoegt (de doorsnede), en dan hoor ik dat
graag vóór het bouwen.

---

## 1 — Airco: de plaat van één ruimte

**Wat de bezoeker moet horen:** een airco is geen aankoop maar een rekensom,
en hij doet meer dan koelen.

**Het instrument.** Eén ruimte, isometrisch getekend zoals een handboek een
ruimte tekent: vloerlijn, twee wanden, een raam. De plaat bouwt zichzelf op
in de volgorde van de beats — eerst de ruimte, dan de zon op de gevel, dan de
wandunit, dan de luchtboog als gemeten kromme met graden erbij, dan de
leidingroute naar buiten, en tot slot draait de boog om.

De maatverdeling en de bijschriften uit de studio komen terug: dit is
dezelfde plaat, ander onderwerp.

### De beats

**1 — de lege ruimte**

> ### Eén ruimte koel krijgen is een rekensom.
> Niet de grootste airco wint, maar de airco die bij de ruimte past.

**2 — de zon komt op de gevel**

> ### De zon telt zwaarder dan de vierkante meters.
> Waar het raam op uitkijkt, hoe de zon er de hele dag op staat en waar u de
> ruimte voor gebruikt: dat bepaalt het vermogen.

**3 — de unit verschijnt, de boog wordt getekend**

> ### Te zwaar bemeten is niet veiliger.
> Een airco die te groot is, slaat kort aan en weer af. Dat kost meer stroom,
> maakt meer geluid en koelt onregelmatiger.

**4 — de leidingroute loopt naar buiten**

> ### De route bepaalt hoe netjes het wordt.
> Een goede plek is een plek met luchtverdeling, zo min mogelijk geluid en
> een leidingroute die niet dwars door uw huis loopt.
>
> Is er een aparte groep nodig, dan legt onze eigen elektricien die in
> hetzelfde werk aan.

**5 — de boog draait om, koel wordt warm. Het monument.**

> ### In de winter draait hij de andere kant op.
>
> ## Een airco is een warmtepomp.
>
> Technisch is het een lucht-luchtwarmtepomp. Daarmee verwarmt u gericht één
> werkkamer of leefruimte, zonder de hele woning op temperatuur te brengen.

Dit is de regel die de meeste bezoekers niet kennen en die nu ergens
halverwege de pagina op inkt staat. Hij hoort bovenaan.

**6 — de plaat staat compleet**

> ### Wij berekenen hem, plaatsen hem en houden hem bij.
> Installatie door STEK-gecertificeerde vakmensen. Heeft u later een vraag,
> dan komt u gewoon weer bij ons terecht.

Knop naar `/offerte-aanvragen?dienst=airco`.

---

## 2 — Cv-ketels: de doorsnede

**Wat de bezoeker moet horen:** het toestel is het makkelijke deel; wat
eromheen zit bepaalt of het veilig is. Dat is het argument achter de
CO-certificering, en het is niet te kopiëren door een installateur die alleen
het toestel hangt.

**Het instrument.** Een doorsnede van de situatie, niet van het apparaat: de
ketel aan de wand, de rookgasafvoer omhoog door het dak, de luchttoevoer, de
gasleiding, de aansluiting. Op scroll licht telkens één deel op terwijl de
rest naar haarlijn terugvalt — zoals een handboek een onderdeel aanwijst.

Nadrukkelijk **geen merk**: een generieke wandketel in lijnwerk. De merken
staan verderop op de pagina met hun eigen logo's, waar ze horen.

### De beats

**1 — de hele doorsnede staat er, alles even zwaar**

> ### Een nieuwe ketel staat nooit op zichzelf.
> Het toestel is één onderdeel van een installatie die als geheel moet
> kloppen.

**2 — de rookgasafvoer licht op**

> ### De afvoer is geen bijzaak.
> Rookgasafvoer en luchttoevoer moeten passen bij het toestel én bij het
> kanaal dat er al ligt. Dat bepaalt vaak wat er wel en niet kan.

**3 — de gasleiding licht op**

> ### De gasleiding wordt beproefd, niet aangenomen.
> Na plaatsing beproeven we de leiding op lekdichtheid, stellen we af en
> leggen we de metingen vast.

**4 — alles valt terug naar haarlijn, één regel blijft. Het monument.**

> ### De ketel is het makkelijke deel.
>
> ## Wat eromheen zit bepaalt of het veilig is.
>
> Daarom zijn we CO-gecertificeerd. We meten, we leveren op met een rapport,
> en u krijgt te horen wat er gemeten is.

**5 — de doorsnede komt terug, nu met het onderhoudsmerkje erbij**

> ### En daarna houden wij hem bij.
> Voor Intergas, Remeha, Nefit en Vaillant tot en met 40 kW. Onderhoud vanaf
> € 11,58 per maand, jaarprijs € 139. Eenmalig onderhoud € 180 in
> 's-Hertogenbosch, € 190 daarbuiten.

**6 — de plaat staat compleet**

> ### Wie hem plaatst, onderhoudt hem daarna.
> Dezelfde mensen, van de offerte tot de jaarlijkse beurt.

Knop naar `/offerte-aanvragen?dienst=cv-ketel`.

**Let op:** deze prijzen komen van de onderhoudspagina, die leidend is
(`PRODUCT.md`). Wijzigen ze daar, dan hier ook.

---

## 3 — Elektra: de verdeler

**Wat de bezoeker moet horen:** de vraag is niet of die ene groep past, maar
wat er daarna nog bij komt. Dit is de enige van de drie waar het argument
zich vanzelf laat tékenen, want een verdeler die vol loopt is het argument.

**Het instrument.** Een groepenkast, recht van voren, in lijnwerk. Op scroll
vullen de groepen zich één voor één: eerst wat er al zit, dan de warmtepomp,
dan de airco, dan de laadpaal — en dan is de kast vol. Daarna wordt hij
vervangen door een ruimere en is er weer plek over.

De beweging is dus geen camera maar een tabel die zich vult. Dat is precies
wat een handboek doet.

### De beats

**1 — de kast staat er, halfvol**

> ### Dit is wat er nu in zit.
> Verlichting, groepen voor de keuken, de wasmachine. Genoeg voor het huis
> zoals u het vandaag gebruikt.

**2 — er komt een groep bij, en nog een**

> ### En dit komt er de komende jaren bij.
> Een warmtepomp vraagt een eigen groep en een zware voeding. Een airco ook.
> Een laadpaal ook.

**3 — de kast zit vol. Het monument.**

> ### De vraag is niet of die ene groep past.
>
> ## De vraag is wat er daarna nog bij komt.
>
> Daarom kijken we naar de bestaande verdeler, het verwachte vermogen en uw
> plannen voor later. Zo hoeft een aanpassing niet twee keer.

**4 — de kast wordt vervangen, met ruimte over**

> ### Vervangen of uitbreiden, en klaar voor wat er nog komt.
> We bekijken of de bestaande verdeler nog past of dat vervangen verstandiger
> is. Met een nette oplevering en een controle erop.

**5 — de plaat staat compleet**

> ### Onze eigen elektricien doet het in hetzelfde werk.
> Komt er een warmtepomp of airco? Dan regelen wij de voeding mee. Eén
> planning, één aanspreekpunt, en niemand die naar de ander kan wijzen.

Knop naar `/offerte-aanvragen?dienst=elektra`.

---

## Technische eisen, alle drie

Overgenomen uit de warmtepompstudio, want die zijn daar duur betaald:

- **Echte tekst in de pagina**, niet in het beeld. Selecteerbaar,
  doorzoekbaar, leesbaar voor een schermlezer.
- **Zonder JavaScript of met `prefers-reduced-motion`** is het blok een
  gewoon document: de plaat als stilstaande tekening, de beats als blokken
  onder elkaar, dezelfde woorden.
- **Eén `<h1>` per pagina**, in de eerste beat.
- **De naad naar beneden.** De plaat is wit, de sectie eronder is papier
  (`#f2f5f8`). Een haarlijn over de volle breedte maakt daar een besluit van.
- **Telefoon: kortere reis, minder beats tegelijk.** Controleer op 375px, en
  laat het toestel of de plaat nooit buiten de plaatbreedte lopen — dat was
  de fout in de studio.
- **De studioknop niet herhalen naast de `MobileActionBar`.** Onder 660px
  draagt de balk de actie.
- Contrast ≥ 4,5:1 voor tekst, gemeten met `getComputedStyle`.
- Geen horizontale scroll, geen element buiten de viewport.

## Volgorde

Elektra eerst. Die plaat is het eenvoudigst te tekenen (rechthoeken en
haarlijnen), het argument is het scherpst, en hij levert meteen de
bouwstenen — de sticky plaat, de scrub, de beatvensters — die airco en
cv-ketels daarna hergebruiken. De warmtepompstudio kan zijn eigen mechaniek
houden; er hoeft niets aan die pagina veranderd te worden om dit te doen.

## Openstaand

- [ ] Akkoord op de drie concepten, of bijsturen
- [ ] Wil je bij cv-ketels tóch een gegenereerde doorsnede in plaats van
      lijnwerk? Dat is de enige van de drie waar credits iets toevoegen.
- [ ] De laadpaal in beat 2 van elektra: doet Braam die? Zo niet, dan gaat
      hij eruit en blijft het bij warmtepomp en airco.
