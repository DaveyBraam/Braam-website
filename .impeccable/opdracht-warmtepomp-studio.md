# Opdracht: de warmtepompstudio

Scroll-gescrubde tekstreeks bovenaan `app/warmtepompen/page.tsx`, met een
draaiende buitenunit als achtergrond. Uitgeschreven in de brainstorm met de
eigenaar; klaar om uit te voeren zodra de referentiefoto's er zijn.

**Uit te voeren met:** `scroll-world` in combinatie met de Higgsfield MCP,
daarna `impeccable` eroverheen.

---

## 1. Waar dit komt te staan

Tussen `PageHero` en de bestaande `keuze`-sectie op de warmtepompenpagina.

De argumentvolgorde van de pagina wordt daarmee:

| | sectie | grond |
|---|---|---|
| 1 | PageHero — wat deze pagina is | inkt |
| 2 | **de studio — of een warmtepomp iets voor u is** | **wit** |
| 3 | keuze — hybride of volledig elektrisch | papier |
| 4 | werkwijze | papier |
| 5 | onderhoud | inkt |
| 6 | merken | papier |
| 7 | veelgestelde vragen | papier |

Dat leest als: **zou u dit willen** → **welke van de twee** → **hoe we werken**
→ **wat erna gebeurt**.

**Let op:** in `app/warmtepompen/page.tsx` en `app/dienst.css` staat nog een
opmerking dat "hier later de film komt" bij het `keuze`-blok. Dat idee is
achterhaald — de film landt bovenaan, en het keuzeblok blijft zoals het is,
met de twee eigen foto's. Werk die opmerkingen bij bij het bouwen.

## 2. De wereld — geef dit vooraf mee aan scroll-world

Zonder dit kiest die skill zijn eigen kunstrichting en is impeccable daarna
twee werelden aan het verzoenen in plaats van er één te verfijnen.

- **Het Handboek.** Nederlandse technische handboeken; gezag door precisie,
  niet door glans.
- **Een witte studio is het papier van het handboek.** Dit is een plaat: het
  toestel vrijgesteld, met bijschriften eromheen. Geen sfeerbeeld.
- **Fira Sans**, vier gewichten (400/500/600/700). De typeschaal staat als
  tokens op `:root` in `app/premium.css` (`--t-monument` t/m `--t-label`,
  `--track-display`, `--track-title`, `--track-label`). Gebruik die.
- Het logoblauw `#0c70b8` (op wit: `#095a94`) markeert verwijzingen en
  versiert nooit.
- Niets is omsloten: geen afgeronde vlakken, geen slagschaduwen, geen glas.
- Haarlijnen mogen. Een vage grondlijn waar het toestel op staat, eventueel
  een maatverdeling, maakt er een handboekplaat van in plaats van een render.

## 3. De beats

De teksten zijn echte DOM-tekst, geen ingebakken beeld. Selecteerbaar,
doorzoekbaar, leesbaar voor een schermlezer, vindbaar voor Google.

**De tekst is de hoofdrol. Het toestel is decor** — iets ontkleurd, lager
contrast, achter de type. De ogen horen op de woorden te vallen.

### Beat 1 — introclip speelt zichzelf af, toestel staat stil

> ### Voordat u een grote uitgave doet, moet u één ding zeker weten.
> Of een warmtepomp in úw woning doet wat u ervan verwacht.

De fan draait aan. Zodra de bezoeker begint te scrollen stopt de introclip en
neemt de scrub het over.

### Beat 2 — het toestel komt omhoog, de tekst splitst

**Links:**

> ### Van het gas af
> Helemaal elektrisch, of eerst een hybride opstelling naast uw bestaande
> cv-ketel. Later om te bouwen naar volledig elektrisch, als uw woning
> zover is.

**Rechts:**

> ### In de zomer koelen
> Met hetzelfde toestel dat u in de winter verwarmt, als het systeem daarvoor
> geschikt is.

Twee redenen aan weerszijden, het toestel draait er tussenin als scharnier.

### Tussendoor — vliegt snel voorbij op weg naar beat 3

> **5 · 7 · 9 · 11 kW**

### Beat 3 — het toestel draait weg, dooft tot silhouet. De zwaarste tekst.

> ### Daarom vragen we eerst wat u nú heeft.
> Welk systeem er op dit moment bij u staat, en hoeveel gas u per jaar
> verbruikt in m³. Daaruit blijkt of een warmtepomp bij ú iets oplevert.
>
> ## Is het niet verstandig, dan zeggen we dat.

Die laatste regel is de grootste tekst van de hele pagina — groter dan de
koppen elders. Dit is het argument dat geen concurrent maakt.

### Beat 4 — hij komt terug naar voren

> ### Zijn de cijfers goed, dan komen we kijken.
> Warmteverlies, isolatie, de afgifte via radiatoren of vloerverwarming, de
> plek voor de buitenunit en de groepenkast. Pas daarna een offerte.

### Beat 5 — nog een kwartslag

> ### En de elektra regelen wij ook.
> Een warmtepomp vraagt een eigen groep en een zware voeding. Onze eigen
> elektricien legt die aan en breidt zo nodig de groepenkast uit. U hoeft geen
> tweede bedrijf te zoeken — en niemand kan naar de ander wijzen.

### Beat 6 — recht van voren, fan draait nog

> ### Wij helpen kiezen, plaatsen hem, en onderhouden hem daarna.
> Dezelfde mensen. Van het eerste advies tot de jaarlijkse beurt.

Hier landt de knop naar `/offerte-aanvragen?dienst=warmtepomp`, op het moment
dat het toestel weer recht voor je staat. Daarna gaat de pagina over in het
handboek dat er al staat.

## 4. De beweging

**Het toestel remt af tot bijna stilstand terwijl een tekst gelezen wordt en
draait verder zodra er weer gescrold wordt.**

Dat zit **niet in de clips** maar in de curve die scrollpositie op framenummer
mapt: bij een tekstmoment hoort veel scrollafstand bij weinig frames. Genereer
dus één gelijkmatige draai; het ritme leggen we er in code overheen en dat is
oneindig bij te stellen zonder credits.

**De draai koppelt aan diepte en licht.** Terwijl het toestel wegdraait
beweegt het naar achteren en dooft het tot silhouet; draait het terug naar
voren, dan komt het dichterbij en licht het op. Zo is de achterkant niet een
zwakke kant die verborgen moet worden maar het moment dat het object zich
terugtrekt — precies waar beat 3 staat.

**Terugval als dat niet lukt:** 270°, doordraaien maar stoppen vóór de
achterkant recht naar voren staat. Nooit frontaal op de achterkant, wel steeds
vooruit. Géén heen-en-weer beweging: een ding dat wiegt leest als
besluiteloos.

## 4b. De baan van de teksten — dit is het hart van de opdracht

Dit is het onderdeel dat bij de eerste poging misging. Lees het letterlijk.

**De teksten spawnen nooit in het midden van het beeld.** Elke tekst heeft een
zichtbare aankomst en een zichtbaar vertrek. Uit het niets verschijnen midden
in beeld is precies wat er niet moet gebeuren.

**De unit blijft continu in beeld.** Hij verdwijnt nooit, hij is de constante
waar de teksten langs reizen.

### De baan

Het gezichtspunt van de lezer staat stil. De teksten reizen over een vaste baan
door de ruimte, diagonaal, van ver naar dichtbij:

| fase | positie | grootte |
|---|---|---|
| aankomst | rechterhoek, ver weg, buiten beeld | klein |
| nadering | schuift naar het midden | groeit |
| **lezen** | **midden van het scherm** | **volle grootte, bijna stil** |
| vertrek | zweeft door naar links | groeit door en vervaagt |

Terwijl een tekst naar links wegzweeft, **komt de volgende al van rechtsboven
aanvliegen**. Er is dus altijd overlap: de baan is een doorlopende stroom, geen
reeks losse verschijningen.

Denk aan een rivier van tekst die schuin door het beeld loopt: rechtsachter
naar linksvoor, met de unit als vast punt in het midden waar alles langs komt.

### Wat dat betekent voor het scrubben

De positie op de baan hangt aan de scrollpositie. Bij het middenpunt — waar de
tekst gelezen moet worden — hoort veel scrollafstand bij weinig verplaatsing,
zodat de tekst daar bijna stilstaat. Datzelfde ritme als het afremmen van de
unit uit paragraaf 4: dezelfde curve, dezelfde rustpunten.

## 5. Wat er gegenereerd moet worden

Twee clips.

**A — de introclip.** Toestel stil, fan draait aan. Twee tot drie seconden.

**B — de draaireeks.** Gelijkmatige rotatie, gescrubd. Reken op 48 tot 72
frames voor een vloeiende draai op 1440px. De homepage gebruikt 48 frames per
scène op 1080p met een aparte mobiele set (`public/home/hero/01` t/m `04` en
`m01` t/m `m04`); volg dat patroon.

### Twee eisen die in de generatieprompt moeten

**1. De fan als bewegingsonscherpte, niet als scherpe bladen.** Een draaiende
ventilator is op elke echte foto een vage schijf. Rendert hij scherpe bladen,
dan is elk stilstaand frame een stilstaande fan — en een warmtepomp met een
stilstaande ventilator ziet eruit als een toestel dat kapot is. Met
onscherpte leest élk frame als draaiend, ook als de bezoeker niet scrolt.

**2. De laatste frame van de introclip is exact de eerste frame van de
draaireeks.** Zelfde camerastand, zelfde licht, zelfde onscherpte op de fan.
Anders springt het beeld bij de overgang, en dat merk je pas als alles al
gegenereerd is.

### Referentiefoto's

De eigenaar levert foto's van de eigen buitenunit. Gebruik die om Higgsfield
te sturen, zodat het gegenereerde toestel op de échte unit lijkt.

Minimaal voor- en achterkant. Beter is vier standen — **voor, linksvoor,
achter, rechtsvoor** — dan is elke zichtbare kant op een echte foto gebaseerd
in plaats van verzonnen. Voor een volledig vloeiende draai zijn het er 24 tot
36 rondom, op ooghoogte en gelijke afstand.

**Waarom dit telt:** gegenereerde apparatuur die niet op het geplaatste
toestel lijkt, belooft iets wat niet geleverd wordt. Dat is dezelfde categorie
als een verzonnen review. Het toestel is hier decor, maar het moet wel hun
decor zijn.

## 6. Technische eisen

- **Echte tekst in de pagina**, niet in het beeld gebakken.
- **Beperkte beweging:** scrub vervalt, beats worden stilstaande blokken onder
  elkaar, dezelfde woorden. Zoals de homepage het al doet.
- **Clip laadt niet:** eerste frame als stilstaande grond. Nooit zwevende
  tekst op een leeg vlak.
- **Telefoon:** minder frames, kortere reis. Zeven bewegingen op een telefoon
  is zwaar en het publiek is niet twintig. Controleer op 375px.
- **De naad naar beneden:** de studio is wit, de `keuze`-sectie eronder is
  papier (`#f2f5f8`). Die overgang moet bedoeld lijken, niet toevallig.
- Geen horizontale scroll, geen element buiten de viewport.
- Contrast: ≥ 4,5:1 voor tekst, ≥ 3:1 voor grote tekst. Meet met
  `getComputedStyle`, niet met screenshots.

## 7. Openstaand

- [ ] Referentiefoto's van de buitenunit (eigenaar levert)
- [ ] Fable 5 aangezet
- [ ] Opmerkingen over "hier komt de film" bijwerken in `warmtepompen/page.tsx`
      en `dienst.css`

## 8. Zo start je

```
/scroll-world
```

Geef daarbij mee: dit bestand, plus dat de wereld **Het Handboek** is en niet
opnieuw gekozen hoeft te worden. Daarna `/impeccable` over het resultaat.
