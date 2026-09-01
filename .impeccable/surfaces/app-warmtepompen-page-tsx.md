---
version: 1
slug: "app-warmtepompen-page-tsx"
primary_target: "app/warmtepompen/page.tsx"
related_targets: ["app/studio.css","app/dienst.css","app/components/WarmtepompStudio.tsx"]
---

# Warmtepompenpagina

Scope: `app/warmtepompen/page.tsx`, de studio (`app/components/WarmtepompStudio.tsx`
+ `app/studio.css`) en het blad dat de vier dienstenpagina's deelt
(`app/dienst.css`). Bezoekersmodus: **Persuade**.

De wereld is Het Handboek, gekozen op de homepage; zie
`.impeccable/surfaces/app-page-tsx.md` voor de regels en `PRODUCT.md` voor wat
er als bewijs mag staan. Deze pagina kiest niets opnieuw.

## De opbouw

De studio is de hero, niet een blok onder een hero. `PageHero` staat hier dus
niet meer, anders dan de opdracht in `.impeccable/opdracht-warmtepomp-studio.md`
oorspronkelijk voorschreef.

| | sectie | grond |
|---|---|---|
| 1 | de studio — of een warmtepomp iets voor u is | wit |
| 2 | keuze — hybride of volledig elektrisch | papier |
| 3 | werkwijze | papier |
| 4 | onderhoud | inkt |
| 5 | merken | papier |
| 6 | veelgestelde vragen | papier |

## Wat deze ronde heeft opgelost

**Het erfglas lag over álles heen.** `Experience.tsx` hangt een
`.experience-layer` op `position: fixed`, `z-index: 80` over de hele pagina:
twee `ambient-orb`s van 480px met 90px blur, een `pointer-aura` van 360px op
`mix-blend-mode: screen` die de muis volgt, en een `page-grain`. Die laag ligt
bóven elk hoofdstuk, dus een sectie kan zich er niet tegen verweren met een
eigen grond. Gemeten op de witte studio: 255,255,255 in het midden, maar
235,244,255 aan de randen — het papier van het handboek was een blauwe lucht.

Ze stonden alleen uit onder 660px en onder `prefers-reduced-motion`, dus op elk
ander scherm altijd aan. Nu uit voor de hele `.dienst`-wereld. **De homepage
heeft ze nog**; `.home` heeft alleen zijn eigen `::before`-orbs opgeruimd, niet
deze vaste laag. Meenemen in de volgende ronde daar.

De `scroll-progress` bleef, maar zonder de halo van 20px: 2px in het
verwijsblauw.

**De knop is ontglaasd.** `.button-primary` is een verloop met een blauwe
slagschaduw van 40px, een witte binnenlijn en een glans die bij hover
overheen veegt. Op de witte plaat was dat het luidste ding van de pagina.
Binnen `.dienst` nu effen `--lime` (#0c70b8, wit erop haalt 5,2:1), geen
verloop, geen halo, geen veeg. De pilvorm blijft: een knop is een
bedieningselement, geen omhulsel.

**Twee blauwe pillen op één telefoonscherm.** De laatste beat had een eigen
knop terwijl de `MobileActionBar` onderaan permanent naar hetzelfde adres wijst
met andere woorden erop. Onder 660px is de studioknop weg; de balk is de knop.

**Het toestel liep rechts uit beeld op 375px.** `los()` rekende de hoogte uit
de stagehoogte (0,34) zonder de breedte te toetsen: 368px toestel in een plaat
van 375. Nu geklemd op `(stageBreedte - 2 * MARGE) / UNIT_AR`.

## Onopgelost

- **De fan draait niet.** De opdracht eiste bewegingsonscherpte op de
  ventilator, juist zodat elk stilstaand frame als draaiend leest. De
  gegenereerde frames tonen een scherp, concentrisch rooster met een donkere
  holte erachter: inert. Dit is een assetprobleem, geen codeprobleem —
  opnieuw genereren kost credits. Vraag de eigenaar.
- **Het toestel draagt het merk Vaillant** — een leesbaar woordmerk op een
  gegenereerd apparaat, met "VAILLANT AROTHERM PLUS · BUITENUNIT" als
  bijschrift. `PRODUCT.md` zegt dat de drie merken gelijkwaardig zijn en dat
  het merk van de opstelling afhangt. Twee vragen voor de eigenaar: mag het
  woordmerk van een fabrikant op een gegenereerd toestel, en wil hij één merk
  in de hero terwijl de pagina eronder zegt dat ze gelijkwaardig zijn.
- **Beat 3 laat een grijze kast zien.** Als het toestel wegdraait en dooft,
  staat er op de zwaarste tekst van de pagina een vlakke achterkant. Bedoeld
  als terugtrekken, maar op een telefoon vult die kast de onderste helft.
- `.button` houdt de magneet (`--magnet-x/y`, de knop kruipt naar de muis).
  Zelfde categorie als de `pointer-aura` die eruit is; bewust gelaten omdat
  het de hele site raakt.

## Valkuilen

- De `experience-layer` staat op `z-index: 80` en ligt boven alles. Een sectie
  die "wit" moet zijn is dat pas als die laag uit staat.
- Het canvas tekent het hele frame op toestelmaat, niet op beeldmaat. Dat
  werkt alleen omdat de frames een zuiver witte grond hebben (gemeten:
  255,255,255). Frames met een vignet of tint breken de plaat.
- Het canvas hertekent alleen als de sleutel verandert; de teksten volgen de
  scroll altijd. Zet nooit een `return` vóór de tekstlus.
- Een verborgen browserpaneel levert zwarte screenshots en draait geen `rAF`,
  dus het canvas blijft dan leeg. Meet met een eigen headless-Chrome via CDP,
  niet met het paneel.
- Bouwen met `./node_modules/.bin/vinext build`, niet met `npm run build`.
