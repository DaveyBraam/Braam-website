---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/home.css","app/components/CinematicHero.tsx"]
---

# Homepage

Scope: de homepage (`app/page.tsx`, `app/home.css`, `app/home-routes.css`,
`app/components/CinematicHero.tsx`, `app/cinematic-sequence.css`).
Bezoekersmodus: **Persuade**.

## Publiek en taak

Drie gelijkwaardige bezoekers (zie PRODUCT.md): storing met spoed, orientatie op
een warmtepomp, en onderhoud regelen. De routeband direct onder de hero bedient
ze alle drie in de woorden van de bezoeker zelf.

## Gekozen richting: Het Handboek

Uit de concept-seed (`--scope direction --mode persuade`, sleutel `6ef49c05`,
toegewezen kandidaat 6 van mijn eigen lijst). Wereld: Nederlandse technische
handboeken. Gezag door precisie, niet door glans.

Regels, vastgelegd in de kop van `app/home.css`:
- een grond, inkt; secties gescheiden door haarlijnen, nooit door kaarten
- niets is omsloten: geen afgeronde vlakken, slagschaduwen of glas
- hierarchie uit schaal en gewicht, niet uit omhulsels
- het logoblauw #0c70b8 markeert verwijzingen, versiert nooit
- precies een licht vlak op de pagina, aan het slot

Verhogingen van de uitdagers die deze richting versloeg: geen omhulsels
(cracktro), het ene getal dat ertoe doet monumentaal (anime command center),
een rustig wit vlak als enige luxe (aanplakbiljet).

## Typografie: Fira Sans

Gekozen door de eigenaar, uit drie voorgelegde kandidaten (Archivo, IBM Plex
Sans + Mono, Fira Sans). Humanistische grotesk, getekend voor schermleesbaarheid
in de traditie van de handleidingen die deze wereld leent. Warmer en opener dan
de twee technische alternatieven, wat past bij productprincipe 5: geschreven
voor een huiseigenaar, niet voor een installateur.

Vier gewichten geladen in `app/layout.tsx`: 400 leest, 500 verzacht, 600 leidt,
700 labelt. De sheets vroegen er eerder veertien, waarvan meerdere optisch
identiek; een statische familie had ze toch samengevouwen.

De schaal staat als tokens op `.home` in de kop van `app/home.css`: tien stappen,
alles in rem zodat de browserinstelling van de bezoeker werkt. Drie displaystappen
met drie taken: `--t-monument` voor het argument dat geen concurrent kan kopiëren
(de certificering), `--t-figure` voor het ene getal dat ertoe doet (de prijs),
`--t-display` voor elke andere kop. Niets anders mag groot zijn.

Ondergrens is `--t-label` (12px). De oude sheets zetten het apparaat op 8,5 en
9px in gewicht 800; dat is onleesbaar voor een deel van het publiek dat deze
pagina bedient.

## Hoofdstukken in plaats van een grond

Door de eigenaar gekozen nadat de pagina op volledige inkt te donker oogde. De
regel "een grond, inkt" is vervangen door een ritme:

| film | routeband | diensten | certificering | projecten | mensen | prijzen | regio | slot |
|---|---|---|---|---|---|---|---|---|
| inkt | inkt | papier | papier | inkt | papier | papier | inkt | papier |

Projecten en regio blijven donker omdat de foto's en de kaart die secties zelf
dragen. Elke regel in `home.css` leest zijn kleur uit vijf tokens (`--hair`,
`--hair-strong`, `--on-ink`, `--on-ink-soft`, `--wash`), dus een hoofdstuk
wisselt van grond door die tokens te herdefinieren op `.chapter-paper`, niet
door zichzelf te herhalen.

Het verwijsblauw beweegt mee in twee richtingen: `#7cc0f7` op inkt, `#095a94`
op papier. Het oorspronkelijke `#0c70b8` haalde op geen van beide gronden 4,5:1.

## Beweging: het handboek zet zichzelf

De zeven secties deden alle zeven dezelfde 18px-fade, bewust ingehouden, met als
resultaat dat de eigenaar er geen zag. Nu draagt de beweging de wereld: de
sectiehaarlijn tekent zichzelf van links naar rechts, de kopregel een tel later,
en de dienstenindex zet zich regel voor regel (`--reveal-delay` uit
`Experience.tsx`, 65ms per rij). De sectie zelf reist niet meer, hij vervaagt
alleen. Niets zweeft, niets blurt, niets schaalt.

De haarlijnen zijn `::before`/`::after` op `scaleX(0)` naar `scaleX(1)`. Dat
claimt meteen de `::before` die `premium.css` gebruikte voor een blauwe orb van
450px achter diensten en abonnementen. Onder `prefers-reduced-motion` staan alle
lijnen direct op `scaleX(1)`.

Drie stukken erfglas zijn weg in `.home`: die orbs, een eeuwig over de
prijskolommen glijdende glans (`subscription-sheen`), en een witte radial glow
van 933px achter elke dienstenrij -- op inkt een glans, op papier een grijze
band.

## Het keurmerk

`.mini-shield` tekende een blauw vijfhoekje met de letters "CO" en "VRIJ": een
keurmerk dat onder die naam niet bestaat. Vervangen door het echte
`public/certifications/co-keur.png`, dat al in de repo stond en al op de
onderhoudspagina wordt gebruikt. Dat is meteen de juiste naam: CO-Keur.

## Onopgelost

- **De keuzepagina staat nog open en is nooit beantwoord.** Ik ben doorgegaan
  op de toegewezen richting. Vraag de eigenaar of Het Handboek blijft of dat hij
  Het Energielabel, De Donkere Diepte of de gebaande weg wil zien.
- **Subpagina's hebben de nieuwe wereld nog niet.** Bewust: eerst de homepage.
  `PageHero` heeft nog een eyebrow-prop die op negen pagina's wordt gebruikt.
  De letterwissel is wel globaal: `premium.css` en `globals.css` houden nog
  ongeveer achttien component-regels met spatiëring krapper dan -0.04em, gesneden
  voor de oude smallere letter. De globale `h1, h2` is meegenomen omdat die elke
  pagina raakt; de rest hoort bij de subpagina-ronde.
- **Het hoofdstukrailtje toont vier scènes in drie kolommen.** `.cinema-route ol`
  staat op `repeat(3, 1fr)`, dus "04 AFRONDING" valt op een tweede regel. Viel
  eerder minder op toen de labels 9px waren.
- **Vinkje en plus zijn unicode-tekens, geen iconen** (`✓` en `+` in `page.tsx`,
  en een `\2713` als `::before` op de abonnementsvoordelen). Ze erven gewicht 700
  uit de letter in plaats van een consistente lijndikte. De ronde badges eromheen
  zijn wel weg: dat waren omhulsels.
- **De knop in het slot is nog een pil met slagschaduw.** Bewust gelaten: hij
  rijmt op `.cinema-call` in de film, en een knop is een bedieningselement, geen
  omhulsel. Wel het laatste stukje glans op papier.
- **DESIGN.md moet nog geschreven** door de documenter, aan het eind, uit de
  gebouwde wereld.

## Valkuilen in deze codebase

- `premium.css` laadt na `globals.css` en definieert `:root` opnieuw. Tokens
  wijzigen in globals.css doet niets.
- `.home section:not(...)` weegt zwaarder dan `.home .klasse`. Contact moest
  daarom op `.home section.contact-cta`.
- `.service-card` was zelf een grid met `min-height: 320px`.
- `.home h2` en `.route h2` wegen even zwaar en `home.css` laadt later, dus de
  routeband rendeerde zijn drie koppen op displayformaat in plaats van 21px.
  Teruggehaald met `.home .route h2` in `home.css`, naast de regel die hem sloeg.
- `max-width` in `ch` is aan de letter gebonden. De caps waren op de oude,
  smallere letter gesneden en knipten onder Fira de handmatige `<br />` af: vier
  koppen die als twee regels geschreven zijn kwamen als drie of vier uit.
- `.people-copy` en `.region-copy` zijn halve kolommen. Een displaystap die tegen
  de viewport schaalt weet dat niet, dus die twee koppen schalen tegen hun eigen
  kolom (`container-type: inline-size` + `cqw`), niet tegen het venster.
- De reset `.home section:not(.cinema-sequence):not(.routes):not(.contact-cta)`
  scoort met drie `:not()`-klassen hoger dan `.home .chapter-paper`. Daarom staat
  `:not(.chapter-paper)` daar expliciet in.
- `premium.css` scopet de projectenlead als `.projects-section .projects-heading p`,
  wat een gewone `.home .projects-heading p` verslaat.
- `.tilt-surface { transform: none !important }` staat in `@media (max-width: 660px)`
  en haalt daar de reveal-verplaatsing van de prijskolommen weg. Op telefoons
  bedoeld, dus gelaten.
- `.button-light` staat op `white-space: nowrap`. Veilig voor een Engels label,
  niet voor een Nederlands: het slot-CTA-label liep 8px buiten zijn paneel.
- `overflow-x: clip` op html/body/main is weggehaald en moet weg blijven: het
  haalde `position: sticky` van de compositor en liet de hero trillen.
- Bouwen met `./node_modules/.bin/vinext build`, niet met `npm run build`.
