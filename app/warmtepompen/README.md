# Warmtepompen: het scrollverhaal (testversie 5)

Live op `/warmtepompen` sinds 3 oktober 2026. Gekozen uit vijf testversies; de andere
versies staan buiten de repo in `~/Desktop/Website v3/warmtepomp-versies/`. De vorige
live pagina blijft als noindex-preview op `/warmtepompen-test`.

Aanleiding: de eigen Blender-modellen in versie 3 zagen er in het verhaal nep uit.
Versie 5 houdt de reis en de teksten van versie 3, maar vervangt de live 3D door
foto's waarin de producten echt staan. Geen WebGL meer, geen 25 MB aan modellen.

## Hoe de foto's zijn gemaakt
1. Versie 3 renderde elke kamer schermvullend met de modellen erin (3200×1800), plus
   close-ups van elk product als referentie voor de logo's.
2. Higgsfield `gpt_image_2_5` (quality high, 4k) maakte er een echte foto van, met de
   opdracht de producten exact te laten zoals ze zijn. Nano Banana Pro is ook geprobeerd,
   maar die veranderde het display van de ketel en verknoeide het logo.
3. Buiten is alleen een uitsnede rond de buitenunit gefotografeerd en als zachte
   lap (`unit-ochtend.webp`, `unit-avond.webp`) op de bestaande huisfoto's van versie 3
   gelegd. Zo blijven ochtend, avond en de acht lichtlagen precies op elkaar passen.
4. De garage met boilervat is gemaakt op basis van de echte garagefoto; alleen de strook
   rond ketel/boilervat ligt als lap (`garage-boilervat.webp`) over de garage en vloeit
   in bij de wissel. De rest van de garage staat dus stil.

Beelden: `public/warmtepompen/reis/` (huis ochtend en avond, lichtlagen, unit, garage, woonkamer).

## De buitenunit (bijgesteld na de eerste bekijkronde)
- Recht voor de gevel en ongeveer 1 m ervan af, recht van voren gezien (geen zijkant in
  beeld), antraciet, zonder leidingen. Opnieuw gerenderd met de fotocamera van versie 2
  (32,3°, 2,68 m hoog, 20,3 m van de gevel), maar met de camera recht voor de unit en de
  lens verschoven, zodat de gevel precies blijft liggen waar hij in de foto ligt.
- "Laat het product exact zo" leverde een foto van het 3D-model op. Wat wel werkt: de render
  aanbieden als plaatshouder en vragen om een echte foto van de echte aroTHERM plus op die
  plek, met maat, stand, kleur en logo als harde eisen (GPT Image 2.5; Nano Banana Pro
  verkleurde de hele foto en veranderde grille en logo).
- De avondunit is daarna op exact dezelfde maat getrokken (vervorming alleen rond de unit),
  en beide lappen zijn per plek op de kleur van de huisfoto gebracht, zodat er geen waas
  rond de unit staat.

## De garage (tweede bekijkronde)
- De garage kwam iets uitgezoomd binnen; op een breed venster was de foto dan smaller dan
  het scherm en schoof hij opzij en groeide hij net als de tekst kwam. Nu komt de garage
  direct in zijn eindstand binnen en staat stil (woonkamer idem). `timeline.ts` wijkt daarin
  af van versie 3.
- Volledig elektrisch = boilervat **plus hydraulisch station** (Vaillant, wandmodel met zwart
  isolatiekader, 44 × 72 cm, net zo groot als de ketel), rechts naast het boilervat.
  Geplaatst vanaf Daveys productfoto, daarna met GPT Image 2.5 in de garage belicht.
  De wissellap heet nu `garage-elektrisch.webp`. De tekst bij "De ketel eruit" noemt het station
  (op verzoek); daarin wijkt v5 af van de live warmtepomppagina.
- Telefoon: bij de wissel schuift het beeld naar rechts, zodat boilervat en station allebei
  in beeld staan. Desktop "Twee vaten" iets ruimer, zodat het station niet half buiten beeld valt.

Higgsfield in totaal: circa 67 credits.

## Gecontroleerd
- Desktop 1440×900 en telefoon 390×844 met schermafbeeldingen over de hele reis.
- ESLint en TypeScript zonder meldingen.
