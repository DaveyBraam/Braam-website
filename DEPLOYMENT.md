# Live publicatie

De live website is https://braam-premium-concept.braam-site-installatie.workers.dev.
Cloudflare Worker: `braam-premium-concept`.
GitHub: `DaveyBraam/Braam-website`, branch `main`.

De oude `chatgpt.site`-publicatie en `.openai/hosting.json` horen bij de historische
Sites-testwebsite. Publiceer wijzigingen voor de live site via Cloudflare Workers.

Na een gecontroleerde bronwijziging:

```sh
npm ci
npx vinext build
node --test tests/cv-product-page.test.mjs tests/cv-product-story.test.mjs
bash scripts/validate-artifact.sh
git push origin HEAD:main
npx wrangler deploy --config dist/server/wrangler.json --name braam-premium-concept --keep-vars
```

`vinext build` genereert de Worker-configuratie en de statische assets. De bestaande
shell-buildhelper vereist Linux; bovenstaande directe build werkt ook op macOS.
Gebruik het aangemelde Cloudflare-account; zet geen toegangstokens in de broncode.
Controleer na publicatie `/cv-ketels`, beide modellen en de metadata. De concept-
route blijft bewaard en staat op noindex. Alleen een GitHub-push bewijst niet dat
Cloudflare de nieuwe versie heeft gepubliceerd.

## Warmtepomppagina — 27 september 2026

`/warmtepompen` gebruikt nu het goedgekeurde 3D-scrollverhaal. Dezelfde pagina
blijft als noindex-preview bereikbaar op `/warmtepompen-test`. De modellen staan
onder `public/warmtepompen-test/`; de cv-opstelling heeft daar een eigen asset,
zodat de bestaande cv-pagina ongewijzigd blijft. Zeven compacte WebP-beelden
verzorgen de weergave bij verminderde beweging of een WebGL-fout.

Controle: productiebuild, 16 warmtepomp- en cv-tests, artifactvalidatie,
HTTP-render van beide warmtepomproutes en het offerteformulier, plus aanwezigheid
van alle zes modellen, zeven stilstaande scènes en drie merklogo's. Ontvangst
van formuliermails blijft het bestaande open punt uit PRODUCT.md.

## Warmtepomppagina — 3 oktober 2026

`/warmtepompen` is vervangen door het scrollverhaal van testversie 5 (zie
`app/warmtepompen/README.md`): één doorlopende reis langs de woning, de garage en de
woonkamer, met de producten als echte foto's in plaats van live 3D. Beelden in
`public/warmtepompen/reis/` (±3 MB, geen WebGL). De vorige pagina blijft als
noindex-preview op `/warmtepompen-test`.

## Aanvraagformulieren via Microsoft 365 — oktober 2026

De vier formulieren posten naar `/api/aanvraag` (`worker/aanvraag.ts`). Die stuurt via Microsoft
Graph vanuit de gedeelde postbus **website@robbraam.com** naar service@ of planning@ (beantwoorden
gaat naar de klant) en stuurt de klant één bevestiging (beantwoorden gaat naar het team). FormSubmit
is niet meer in gebruik. Zelfde opzet als de review-app (`~/Braam-reviews/README.md`).

### Eenmalig instellen (beheerder van de Microsoft-tenant)

1. **Postbus**: maak de gedeelde postbus `website@robbraam.com` aan (geen licentie nodig).
2. **App-registratie**: entra.microsoft.com → Identiteit → Toepassingen → App-registraties → Nieuwe
   registratie, naam `Braam website formulieren`, alleen accounts in deze organisatiemap, geen
   redirect-URI. Noteer **Directory (tenant) ID** en **Application (client) ID**.
3. **Geheim**: Certificaten en geheimen → Nieuw clientgeheim (bijv. 24 maanden). Kopieer de
   **Waarde** meteen en zet een herinnering voor de vervaldatum: daarna stoppen de formulieren.
4. **Géén API-machtiging `Mail.Send` in Entra toevoegen**: dan zou de app als elke postbus kunnen
   mailen. Het recht komt beperkt in stap 5.
5. **Recht op alleen website@** (Exchange Online PowerShell). Zoek bij Bedrijfstoepassingen de app op
   en noteer daar de **Object-ID**:
   ```powershell
   Connect-ExchangeOnline
   New-ServicePrincipal -AppId <application-client-id> -ObjectId <object-id-bedrijfstoepassing> -DisplayName "Braam website formulieren"
   New-ManagementScope -Name "Braam website postbus" -RecipientRestrictionFilter "PrimarySmtpAddress -eq 'website@robbraam.com'"
   New-ManagementRoleAssignment -App <application-client-id> -Role "Application Mail.Send" -CustomResourceScope "Braam website postbus"
   # moet InScope tonen voor website@ en NotInScope voor een andere postbus:
   Test-ServicePrincipalAuthorization -Identity <application-client-id> -Resource website@robbraam.com
   ```
   Het recht kan tot ongeveer een uur nodig hebben.
6. **Turnstile**: Cloudflare-dashboard → Turnstile → Widget toevoegen, naam `Braam formulieren`,
   modus *Managed*, hostnamen: het workers.dev-adres (en later robbraam.com). Zet de **sitekey** in
   `app/site-config.ts` (`turnstileSiteKey`); de **geheime sleutel** gaat in stap 7.
7. **Secrets in Cloudflare** (vanuit de projectmap; wrangler vraagt om de waarde):
   ```bash
   ./node_modules/.bin/wrangler secret put MS_TENANT_ID --name braam-premium-concept
   ./node_modules/.bin/wrangler secret put MS_CLIENT_ID --name braam-premium-concept
   ./node_modules/.bin/wrangler secret put MS_CLIENT_SECRET --name braam-premium-concept
   ./node_modules/.bin/wrangler secret put MAIL_FROM --name braam-premium-concept        # website@robbraam.com
   ./node_modules/.bin/wrangler secret put TURNSTILE_SECRET --name braam-premium-concept
   ```

### Volgorde bij live zetten

Eerst stap 1 t/m 7, dan pas deze code publiceren: zonder de Microsoft-secrets weigert
`/api/aanvraag` te versturen en ziet de klant een foutmelding. Zonder `TURNSTILE_SECRET` werkt het
wel, met alleen het verborgen veld tegen spam. Na publicatie één echte testaanvraag doen per
formulier en controleren: komt hij binnen bij service@/planning@, staat hij in *Verzonden items* van
website@, en krijgt het testadres de bevestiging.

Lokaal zonder te versturen: zet `MAIL_TESTMODUS=1` in `.dev.vars`; de worker logt de mails dan.
