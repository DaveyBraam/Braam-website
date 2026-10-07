# /over-ons

Over ons in donkerblauw, gebouwd 7 oktober 2026 met scroll-craft (eerst als /over-ons-v2), live sinds dezelfde dag.
Brief: `braam-premium-concept/scrollcraft/builds/over-ons-v2/BRIEF.md`.

- **Kop** (`Kop.tsx`): het eigen pand bij avond (`public/over-ons/pand-avond.webp`, koel nagekleurd
  van `public/about/bedrijfspand-braam.png`), licht in de voordeur.
- **Wie we zijn**: begonnen door Rob Braam, wat we doen, voor wie, waar.
- **Aanpak** (`Aanpak.tsx`): de piek. Vijf stappen (telefoon, advies, eigen team, installatie,
  onderhoud); op de computer blijft het deel staan en vloeit rechts per stap een grote foto in beeld,
  links een klikbare stappenlijst. Telefoon en zonder beweging: stappen onder elkaar met foto.
- **Ruim 25 jaar**: groot getal (sinds 2000; blijft waar).
- **Waar u op kunt rekenen** + vakmanschap: vier afspraken, merken zonder aantal, keurmerken.
- **Slot**: contact en adres.

Davey (7 okt): getekende lijn voelde niet high end; één losse review op een eigen plek woog te zwaar.
Beide eruit.

Niet doen: aantallen medewerkers of klanten noemen, een specifieke monteur beloven, andere reviews
gebruiken zonder dat de eigenaar ze heeft nagekeken.

## Kopfoto vervangen (bijv. het pand met de nieuwe bussen)

In `Kop.tsx` bovenaan staat `pand`: `src` (bestand in `public/over-ons/`) en `deurX` / `deurY` (de
onderkant van de voordeur, in procenten van de foto). Licht en lijn verhuizen dan vanzelf mee.
De huidige foto is koel nagekleurd met ffmpeg; een nieuwe foto liefst bij schemering, binnen licht aan.

## Gewenste foto's (voorstel aan Davey, 7 okt 2026)

1. Kop: het pand recht van voren met de nieuwe bussen, bij schemering met licht binnen; liggend.
2. Wie we zijn: Rob Braam aan het werk (alleen als Rob dat wil).
3. Station Advies: een nieuwe, scherpere opname van een gesprek aan tafel (huidige is 655 px).
4. Station Installatie: handen van een monteur aan leidingwerk, zonder gezicht.
5. Station Onderhoud: een onderhoudsbeurt bij een klant (meetapparatuur, open ketel), zonder gezicht.
6. Vakmanschap: de ingerichte laadruimte van een bus of het magazijn met materiaal.
In bus- en teamfoto's geen aantal noemen in de tekst.
