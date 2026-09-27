# Warmtepomp — rustige 3D-scrolltest

Route `/warmtepompen-test`, noindex/nofollow. Werkversie: braam-premium-concept.

## Huidige uitvoering — 26 september 2026

De gebruiker heeft de film-/afbeeldingenrichting vervangen door rechtstreeks
laden van de eigen 3D-modellen, zoals op de actuele cv-ketelpagina. Het eerdere
lokale ontwerp is hergebruikt: rustige tekst naast één productvlak, zonder
huis, wereld, losse keuzetabellen of modelbediening. Een compact hoofdstukmenu
en pauzeknop blijven beschikbaar. Op mobiel staat het beeld boven de tekst.

Actieve bestanden: page.tsx, WarmtepompStory.tsx, WarmtepompChapters.tsx,
story-scene.ts, scroll-story.css, WarmtepompContent.tsx en content.css.
De oude Handbook.tsx/handbook-data.ts/handbook.css blijven bewaard, maar zijn
niet gekoppeld aan deze route. Het Lovable-project is een afzonderlijke preview;
deze laatste wijzigingen zijn lokaal uitgevoerd en niet gepubliceerd.

## Scènes en onderdelen

Buitenlucht → control unit → hybride → volledig elektrisch → buffervat →
thermostaat → woningbeoordeling. De camera gebruikt dezelfde readingTravel-helper
als de cv-pagina: eerst lezen, dan bewegen, omkeerbaar met de scrollpositie.

Zes bestaande GLB's worden geladen: buitenunit en binnenunit uit de hoofdmap;
cv-ketel, boilervat en thermostaat uit handboek-v1; het originele Vaillant-buffervat
uit vaillant-buffer-v2. Geen bronmodellen
gewijzigd. Presentatiematen zijn illustratief, geen montage- of maatvoeringadvies.

Door de gebruiker bevestigd:
- Binnenunit = control unit, aan de muur bij de installatie.
- Thermostaat = bediening beneden in de leefruimte.
- Het kleine buffervat en de control unit blijven in beide getoonde opstellingen.
- Hybride → volledig elektrisch: alleen cv-ketel maakt plaats voor groot boilervat.
  Camera en de drie gedeelde onderdelen behouden bij die overgang hun positie.

De producten staan op een neutrale achtergrond. Een lokale RoomEnvironment
geeft reflecties zonder externe HDR. Rendering vindt alleen plaats bij scrollen,
laden, resize en uitdempen. Verborgen tabbladen en scènes pauzeren. Reduced
motion, databesparing, handmatige pauze en laadfouten gebruiken bestaande PNG's.

## Controle

- Browser: desktop 1280×720 en mobiele viewport 390×844.
- Echt 3D-canvas en zes modellen geladen; hybride/elektrische compositie en
  thermostaat visueel bekeken, hoofdstukken vooruit en terug gecontroleerd.
- Mobiele tekst bereikbaar en geen horizontale overflow gevonden.
- Pauze verwijdert canvas en toont geladen poster; hervatten werkt.
- Geen browsererrors in de controlepreview.
- Gerichte ESLint-check geslaagd.
- TypeScript meldt alleen bestaande ontbrekende Cloudflare-typen:
  cloudflare:workers, Fetcher en D1Database.
- Geen productiebuild of echte iOS Safari-proef; reduced-motion-OS-instelling
  niet apart getest. Geen film gerenderd of publicatie uitgevoerd.

Voor deze wijziging zijn de relevante eerdere bestanden bewaard onder
/tmp/warmtepomp-before-live-redesign (tijdelijke werkkopie).

## Impeccable inhouds- en kleurpass

Onafhankelijke ontwerp- en detectorbeoordeling: nulmeting 26/36, eerste run.
Rapport in .impeccable/critique/2026-09-26T16-35-07Z__app-warmtepompen-test-page-tsx.md.
Eigen team, advies/installatie/onderhoud staan nu in de hero en het verhaal.
Een concrete werkwijze beschrijft woningbeoordeling, voorstel, installatie en
onderhoud van hetzelfde systeem. Koppen gebruiken de bestaande CV-blauwe
gradient; kleine abonnementslabels de donkerdere toegankelijke variant.
Desktop en 390px mobiel visueel gecontroleerd, geen horizontale overflow of
browsererrors gevonden. ESLint slaagt. Modellen en cameraregie behouden.
Vragen over richting overgeslagen: doel en kleur expliciet door gebruiker bepaald.

## Visuele uitleg en kortere tekst — 26 september

De 3D-opstelling krijgt 56% van de desktopbreedte. Labels volgen de onderdelen;
een schematische warmtelijn beweegt met het lezen mee. Buitenunit, control unit
en Vaillant-buffervat blijven op hun plek bij cv-ketel ↔ groot boilervat.
Het nieuwe buffervat is uit de originele Blender-collectie geëxporteerd, zonder
studio of schaalfiguur. Bronbestand ongewijzigd; export en één statische fallback
staan in een nieuwe uitvoermap vaillant-buffer-v2, met source.json.

Tekst per scène ingekort tot één uitleg en één kernzin. Gasverbruik, verwarming
en isolatie staan direct zichtbaar in drie kolommen; werkwijze in vier stappen.
FAQ-antwoorden en abonnementsvoorwaarden staan open, zonder uitklapknoppen.
Woninggegevens worden nagevraagd; er wordt geen woningmeting beloofd.
De blauwe CV-koppen en eigen installatie-, onderhouds- en serviceverhaal blijven.
Focus na een hoofdstuklink gebruikt preventScroll, zodat de terugwissel niet
onbedoeld naar het begin springt.

Controle: desktop en mobiele 390px-preview, geen horizontale overflow;
origineel buffervat en hybride/elektrisch visueel bekeken. Drie gerichte tests
controleren de gedeelde onderdelen, omkeerbare tijdlijn en buffer-overgang.
Geen echte iOS Safari-test of publicatie uitgevoerd.

## Fotorealistische buitenunit en dieper contrast — 27 september

De buitenunit gebruikt nu `buitenunit-v3/buitenunit.glb`, geëxporteerd uit
`warmtepomp-vaillant-20260925/fotorealistisch-v3/` (431 productonderdelen,
107.223 vertices). `export_outdoor_v3.py` verwerkt ook selectie-beveiligde
onderdelen via geëvalueerde kopieën. Kleur, normaal, ruwheid, metaal en AO
zijn naar 2048px PBR-texturen gebakken. Het originele Blender-bestand is
met een SHA-256-controle ongewijzigd bevonden. Alleen productgeometrie is
geëxporteerd; geen camera's, lampen of wereld. Het bestaande transparante
V3-productbeeld wordt gebruikt als fallback. De oude buitenunit blijft bewaard.

De webbelichting gebruikt AgX met zachtere invulling en een koel randlicht.
De materiaalafwerking is vertaald naar glTF; de browserweergave is geen
exacte Cycles-render. De fijnste normaaltextuur is afgezwakt tegen flikkering.
De GLB is circa 13 MB; geen externe decoder of extra netwerkafhankelijkheid.

De opening zegt ‘Minder gas. Meer comfort.’ met direct de eigen werkwijze
advies → installatie → onderhoud. Het 3D-vlak is donkerblauw, de leesvlakken
staalblauw en onderhoud heeft een eigen donkerblauwe sectie. De blauwe
kopgradiënt blijft; op donkere vlakken is hij lichter voor leesbaarheid.
Camera's en de posities voor hybride/elektrisch zijn behouden.

Gecontroleerd: desktopopening en hybride opstelling, mobiele opening en
onderhoud op 390px, geen horizontale overloop, live canvas en geen browserfouten
in de controlepreview. Gerichte ESLint-check en drie tijdlijntests geslaagd.
Geen echte iOS-test, productiebuild of publicatie uitgevoerd.

## Herstel productweergave en complete hybride — 27 september

De oude materiaal-fade maakte iedere losse mesh transparant en schakelde
depthWrite uit. Daardoor waren binnenwerk en overlappende onderdelen zichtbaar.
De materialen blijven nu ongewijzigd en gesloten. Alleen tijdens een overgang
wordt elk wisselend product met eigen diepte eerst naar één herbruikbaar
render target getekend; het complete productbeeld vloeit vervolgens over de
vaste opstelling. De gedeelde onderdelen blijven rechtstreeks in 3D getekend.
Textures en shaders worden vooraf voorbereid en het eerste beeld wordt getekend
vóór het laadbeeld verdwijnt. Er wordt tijdens scrollen geen model bijgeladen.

Actief model: `buitenunit-v4/buitenunit.glb`, nog steeds gebaseerd op de originele
fotorealistische V3-bron. Deze export bewaart de afzonderlijke PBR-materialen
(11 primitives) en geometrie, en vervangt de korrelige 2048px-atlas uit v3.
Microscopische procedurele korrel is voor de webweergave weggelaten. De bron is
met hashcontrole ongewijzigd. De export is circa 9,1 MB. Zelfschaduwen zorgen
voor meer diepte; de bestaande productrender blijft het laad-/fallbackbeeld.

‘Warmte van buiten. Comfort binnen.’ toont direct de hybride opstelling, met
ketel. De ketel gebruikt de bestaande volledige installatie.glb van de CV-pagina:
leidingwerk, afsluiters, volledige rookgasafvoer en terminal bewegen en faden
samen. De ongewijzigde originele CV-asset wordt hergebruikt. Presentatieschaal
is illustratief. Het ketellabel staat bij de kast, niet boven de hoge terminal.

De 3D-kolom is breder en de camera kadert de opstelling strakker. Op mobiel
is het productvlak verhoogd van maximaal 245px naar 340px. Tekst blijft onder
dit vlak; langere koppen worden niet achter het vastgezette productvlak geduwd.

Controle: volledige werking/hybride met leidingen en terminal op desktop en
390px mobiel; daadwerkelijk tussenbeeld van ketel/boilervat-fade bekeken;
geen horizontale overloop of browsererrors. Vijf tijdlijntests en gerichte
ESLint-check slagen. Losse TypeScript-check meldt uitsluitend de al bekende
Cloudflare-typen (cloudflare:workers, Fetcher, D1Database). Geen echte iOS-test
of publicatie uitgevoerd.

## Vaten, klantvoordelen en scrollregie — 27 september 2026

Lokaal, niet gepubliceerd. Hoofdstuk 5 vergelijkt het oorspronkelijke Vaillant-buffervat
met het grote boilervat, op dezelfde basislijn en met behoud van schaalverschil.
Beide blijven volledig zichtbaar vanuit de elektrische opstelling, ook tijdens de
verplaatsing. Gepauzeerde weergave toont de twee bestaande productbeelden.

Voordelen staan vóór de informatie voor de offerte. Eigen team, geen onderaannemers
en verantwoordelijkheid na installatie zijn expliciet gemaakt. Er zijn geen
besparingsbedragen of woningmetingen beloofd. De merkenrij gebruikt originele
lokale logo's; herkomst staat in public/brand/warmtepomp-logo-sources.md.

Scroll-cinematic toegepast als regie op de bestaande Three.js-modellen, conform
de gebruikerskeuze voor eigen assets en behoud van de handboekstijl: subtiele
scrollgestuurde detailorbit/dolly, eased cameraverplaatsing, rustige leesmomenten
en zachte uitgaande tekst. Geen nieuwe Higgsfield-film, huiswereld of autoplay.
Hybride/elektrisch houden dezelfde camera; reduced motion behoudt statisch beeld.
Zeven tijdlijntests slagen; desktop- en mobiele vaten/merken visueel gecontroleerd.
