# Ketelconcept — keuzes 25 september 2026

Route: `/concept-product/cv-ketels`. Dit is een lokale test, niet gepubliceerd.

- Gebruiker wil Apple-productpresentatie met lichte handboektypografie en de inhoud
  van de oorspronkelijke ketelpagina. Grote koppen, rust en productbeeld behouden.
- De variant met absoluut gestapelde tekstschermen is afgewezen als een diashow.
  Houd normale documentsecties; laat de 3D-camera het scrollen ondersteunen.
- Koppen verlopen van donkerblauw naar het logoblauw `#0c70b8`. Gekleurde
  interface-accenten gebruiken dat logoblauw, geen groene themakleur.
- De gebruiker vindt de camerabeweging mooi en wilde alleen soepelere overgangen.
  Actief: bestaande Higgsfield/Jutsu-regie in `jutsu-motion.json`, met geleidelijke
  scrollinterpolatie en 145 ms tijdconstante. Nieuwe studioproef in Jutsu revisie 3
  is niet de actieve websitecamera; die hoorde bij de afgewezen variant.
- Ketel hangt aan de wand. Wandafstand wordt afgeleid van de echte achterzijde van
  het model. Afvoerbeugel wordt in de presentatie op de wand aangesloten; de GLB
  zelf is ongewijzigd. Kleine contactschaduw, geen losse schaduw op een verre wand.
- Mobiel: eigen sticky 3D-venster boven normaal doorlopende tekst. De losse
  illustraties worden alleen bij gepauzeerde beweging, reduced motion, save-data
  of WebGL-terugval getoond. Geen dubbele desktopposter achter mobiele beelden.
- Bestaande contactroutes, onderhoudsprijzen en beperkingen komen uit PRODUCT.md.

Controle: desktoppreview, mobiele preview op 390 en 360 px, navigatie naar
Aansluitingen, pauzestand, geen horizontale overflow en gerichte ESLint-controle.
De bestaande CV-filmtests (9) en assetvalidator slagen. Dit is geen fysieke
Safari/iOS-proef. TypeScript projectbreed meldt de reeds bekende ontbrekende
Cloudflare runtime-typen; de gewijzigde route leverde geen TypeScript-meldingen.

## Uitloop naar naslag

Het product vervaagt scrollgestuurd tijdens het verlaten van de laatste sectie.
Een kort achtergrondverloop sluit aan op het wit van het naslaggedeelte. Het
scrollmenu vervaagt iets later en gebruikt geen `hidden`-schakelaar meer. Na de
fade is het menu inert en niet zichtbaar; bij terugscrollen verschijnt het weer.
Geen nieuwe camerabeweging of wijziging aan de goedgekeurde hoofdstukopmaak.

## Gasleiding expliciet uitlichten

Binnen Aansluitingen staat de gasleiding als eigen zichtbaar blauw controleblok,
niet in een dichtgeklapte accordion. Onderhoud (gasdruk) en installatie
(lekdichtheidsbeproeving) worden apart benoemd. De bestaande voorwaarde over
herstel en hercontrole van een vastgesteld gaslek staat nadrukkelijk onderaan.
Een geprojecteerd label wijst de gasafsluiter in het 3D-model aan. Tijdens het
lezen blijft de camera langer bij het aansluitdetail. Dit blijft hoofdstuk 02;
er is geen extra menustap of los hoofdstuk toegevoegd.

## Latere verfijningen

- Kopgradient na visuele feedback: heel donkerblauw → logoblauw → heel lichtblauw.
  Geen witte letters; het verloop volgt de tekstbreedte.
- Alleen het wandplaatje van de rookgasbeugel ontvangt geen realtime schaduwmap
  meer: de kleine metalen plaat knipperde tijdens scrollen door wisselende
  schaduwsamples. Het eigen metaalmateriaal, de verlichting en de schaduw die
  het plaatje op de wand werpt blijven behouden.

## Radiator in dezelfde 3D-wereld

Het bestaande `public/models/cv-fotoreferentie/radiator-fotoreferentie.glb`
staat naast de ketel aan dezelfde studiowand. Alleen tijdens het lezen van
Cv-aanvoer & retour mengt de camera vloeiend naar het radiatordetail. De
scrollpositie van die tekst bepaalt het moment; bij het gasleidingblok keert de
camera terug naar de bestaande aansluitingen. Op mobiel kadert de camera dichter.
De vijf hoofdstukken en de overige Jutsu-camerastanden blijven behouden.

Geen radiatorafbeelding of extra viewer tussen de tekst. De brongeometrie blijft
ongewijzigd en de korte aanvoer-/retourlegenda staat in de 3D-stage. De legenda
benoemt de kringloop, zonder een ongedocumenteerde linker/rechter aansluiting aan
het referentiemodel toe te wijzen. Bij een ontbrekend radiatormodel blijft de
bestaande ketelcamera werken. Pauze/reduced motion behouden de bestaande statische
terugval, zonder extra WebGL-context.

Gecontroleerd: desktopbeeld (1280×720), mobiel radiatordetail (390×844), terugkeer
naar ketelaansluitingen bij het gasblok, geen horizontale overflow en pauze met
opgeruimde canvas. Geen browserfouten in de gecontroleerde desktop-preview.
Geen fysieke iOS-test. Losse TypeScript-controle meldt uitsluitend de bestaande
ontbrekende Cloudflare-runtime-typen.

## Leesvolgorde aansluitingen en beugelcorrectie

Aansluitingen heeft nu drie leesmomenten binnen hetzelfde hoofdstuk: eerst de
ketelleidingen, vervolgens het radiatormodel met uitleg over de bestaande
installatie en instellingen, daarna terug naar de ketel voor gascontrole.
`connection-cues.ts` koppelt de camerabeweging en gasmarkering aan deze tekstblokken.
De camera blijft bij de aansluitingen tot de gasuitleg uit beeld is; pas daarna
loopt de bestaande beweging naar rookgasafvoer verder. Vooruit en achteruit
scrollen volgen dezelfde tijdlijn. De kopkleuren blijven uitsluitend blauw.

De gasmarkering gebruikte eerder inline `opacity`, waardoor de hoofdstuk-CSS
werd overschreven. De scène schrijft nu alleen een CSS-variabele; de combinatie
van live weergave, hoofdstuk en gasfase bepaalt of het label zichtbaar mag zijn.
De markering wacht bovendien totdat de camera van de radiator is teruggekeerd.
Oude inline waarden worden bij initialisatie opgeruimd.

De eerdere correctie van alleen de ontvangen schaduw op het wandplaatje was
onvoldoende. De beugelonderdelen hebben nu een mat metallic materiaal zonder
scherpe omgevingsreflecties en ontvangen geen zelfschaduw. Het wandplaatje werpt
geen losse schaduwvlek meer op de wand; arm en klem behouden hun slagschaduw. De
plaat zit vóór de schaduwlaag van de wand met een kleine geometrische speling.
Bron-GLB en overige materialen/cameratrack blijven ongewijzigd.

Verificatie: desktop 1280×720 en mobiel 390×844; gaslabel gemeten op 0 bij intro,
eerste aansluitingen, radiator en Veiligheid, en zichtbaar bij de gasuitleg.
Geen horizontale overflow of browserfouten in deze controle. Beugel visueel
vergeleken bij meerdere opeenvolgende scrollstanden en terugscrollen; geen
herhaald donker/licht wisselen gezien. Vier gerichte tijdlijntests controleren
volgorde, uitsluiting van overlappende radiator-/gasfasen en terugscrollen. Geen
fysieke iOS-test.

## Impeccable-verfijning — punten 1–4 (25 september 2026)

Het blauwe koppenverloop eindigt nu in een beter leesbaar lichtblauw; kleine
handboekkoppen gebruiken een donkerder verloop. Detailknoppen, leidinguitleg en
de handboekindex zijn vergroot. De contactkop heeft automatische zijmarges en
staat gecentreerd boven de tekst en contactacties.

Het hoofdstukmenu staat op desktop rechts onder het product, buiten de tekstkolom.
Onder 1200px toont het de huidige hoofdstuknaam met een uitklapbare lijst van vijf
benoemde hoofdstukken. Knoppen en keuzes hebben minimaal 44px bedieningshoogte.
Op mobiel krijgt het menu een eigen strook van 64px onder het bestaande 3D-beeld;
leesposities en ankers houden daarmee rekening. De navigatie blijft beschikbaar
bij gepauzeerde animatie. Escape en klikken buiten het menu sluiten de lijst.
De bestaande fade blijft behouden, onafhankelijk van het beeld.

Gecontroleerd op 1280×720, 900×800 en 390×844: desktopmenu overlapt de
detailknop niet, contactkop is gecentreerd, mobiele hoofdstukken openen en
navigeren naar leesbare tekst onder het beeld. Geen horizontale overflow.
Escape herstelt focus op de hoofdstukkeuze; pauzestand behoudt het menu.
Gerichte ESLint-controle en alle 13 bestaande film-/verhaaltijdlijntests slagen.
De Impeccable-detector meldt alleen de bestaande, bewust behouden keuzes:
blauwe verloopkoppen en de accentlijn bij het gascontrolepunt. Geen fysieke
iOS-test. Camera's, modellen, verhaal en onderhoudsaanbod zijn niet gewijzigd.

## Onderhoud na het 3D-verhaal — 25 september 2026

Op verzoek staat ‘Ook daarna. Bij Braam.’ nu als zelfstandige sectie direct na
het verhaal en vóór het handboek. Het verhaal en de hoofdstuknavigatie tellen
vier hoofdstukken en eindigen bij controle/oplevering. De bestaande camera-
transities blijven behouden; beeld en menu gebruiken de bestaande eindfade.
Het onderhoudsblok heeft twee kolommen op desktop en één kolom op mobiel,
zonder sticky paneel of herhaald ketelbeeld. Prijs en contactroutes zijn behouden.

Desktop 1280×720 en mobiel 390×844 visueel gecontroleerd: de sectie staat buiten
het verhaal, het menu is daar uit beeld, er is geen horizontale overflow en de
onderhouds-, naslag- en telefoonlinks behouden hun bestemming. Gerichte ESLint
controle en de 13 bestaande film-/tijdlijntests slagen. Geen fysieke iOS-test.

## Meer kleurdiepte — 26 september 2026

Alleen kleurwaarden in product-story.css aangepast: blauwgrijze verhaalachtergrond
(#e5edf5) en bijpassende 3D-vloerkleur, iets sterkere scheidingslijnen, donkerder
secundaire tekst en een zachtblauw contactvlak. Het handboek blijft licht.
‘Ook daarna. Bij Braam.’ is donkerblauw (#102b46), met blauwe verloopkoppen,
lichtblauwe acties en lichte leestekst. De bestaande uitstroomgradient sluit
qua eindkleur aan op die servicesectie. Typografie, afmetingen, inhoud,
camerabeweging en scrolllogica zijn ongewijzigd.

Visueel gecontroleerd op desktop 1280×720 en mobiel 390×844. Geen horizontale
overflow. Contrastberekening: gewone verhaaltekst 5,51:1; leestekst in de donkere
sectie 9,32:1; blauwe actie 7,19:1. De lichtste grote kopkleur blijft boven 3:1
op de aangepaste lichte vlakken. Geen nieuwe tests of renders nodig voor deze
uitsluitend CSS-kleurwijziging.

## Productieroute — 26 september 2026

De goedgekeurde pagina wordt gedeeld door /cv-ketels en de bewaarde conceptroute.
/cv-ketels heeft eigen publieke metadata en canonical; de conceptpagina blijft
noindex. De oude cv-3D-component wordt niet meer geïmporteerd door de route.
Beide modellen en de terugvalafbeeldingen zijn opgenomen in Git en de build.
Productiebuild, artifact-validator, vier tijdlijntests en drie controles van
gebouwde routes/assets slagen. De publieke route is ook lokaal in de browser
gecontroleerd. De rest van de GitHub-hoofdtak blijft ongewijzigd.
