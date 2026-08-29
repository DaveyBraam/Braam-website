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

## Onopgelost

- **De keuzepagina staat nog open en is nooit beantwoord.** Ik ben doorgegaan
  op de toegewezen richting. Vraag de eigenaar of Het Handboek blijft of dat hij
  Het Energielabel, De Donkere Diepte of de gebaande weg wil zien.
- **Typografie is nog niet gekozen.** Nog steeds Geist. Dit is de grootste
  openstaande winst: een handboek leeft van zetwerk.
- **Subpagina's hebben de nieuwe wereld nog niet.** Bewust: eerst de homepage.
  `PageHero` heeft nog een eyebrow-prop die op negen pagina's wordt gebruikt.
- **DESIGN.md moet nog geschreven** door de documenter, aan het eind, uit de
  gebouwde wereld.

## Valkuilen in deze codebase

- `premium.css` laadt na `globals.css` en definieert `:root` opnieuw. Tokens
  wijzigen in globals.css doet niets.
- `.home section:not(...)` weegt zwaarder dan `.home .klasse`. Contact moest
  daarom op `.home section.contact-cta`.
- `.service-card` was zelf een grid met `min-height: 320px`.
- `overflow-x: clip` op html/body/main is weggehaald en moet weg blijven: het
  haalde `position: sticky` van de compositor en liet de hero trillen.
- Bouwen met `./node_modules/.bin/vinext build`, niet met `npm run build`.
