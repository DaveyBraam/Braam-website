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
