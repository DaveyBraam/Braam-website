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
