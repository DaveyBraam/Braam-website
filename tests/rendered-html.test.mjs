import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const workerPromise = import(workerUrl.href).then(({ default: worker }) => worker);

async function fetchRoute(path, accept = "text/html") {
  const worker = await workerPromise;
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept } }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders development preview metadata", async () => {
  const response = await fetchRoute("/");

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(await response.text(), developmentPreviewMeta);
});

test("renders conversion-focused homepage hero and maintenance proof", async () => {
  const response = await fetchRoute("/");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Warmtepomp, cv-ketel en onderhoud/i);
  assert.match(html, /Vraag warmtepompadvies aan/i);
  assert.match(html, /Cv-ketel vervangen of onderhouden/i);
  assert.match(html, /1\.900 vaste onderhoudscontracten/i);
  assert.match(html, /vanaf een maandbedrag/i);
  assert.match(html, /Scroll: onderhoud[\s\S]*inspectie/i);
  assert.match(html, /Echt installatiewerk/i);
  assert.match(html, /\/projects\/installaties\/installatie-02\.webp/i);
});

test("renders real installation projects with honest work-stage labels", async () => {
  const response = await fetchRoute("/projecten");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Installatiewerk[\s\S]*van dichtbij/i);
  assert.match(html, /Tijdens montage/i);
  for (let image = 1; image <= 9; image += 1) {
    assert.match(html, new RegExp(`\\/projects\\/installaties\\/installatie-${String(image).padStart(2, "0")}\\.webp`, "i"));
  }
});

test("renders the professional knowledge overview with crawlable article link", async () => {
  const response = await fetchRoute("/kennisbank");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<h1[^>]*>[\s\S]*Praktische kennis voor uw woning/i);
  assert.match(html, /href=["']\/kennisbank\/cv-ketel-bijvullen["']/i);
  assert.match(html, /Artikel in voorbereiding/i);
});

test("renders article metadata, structured data and conversion links", async () => {
  const response = await fetchRoute("/kennisbank/cv-ketel-bijvullen");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<h1[^>]*>CV-ketel bijvullen:/i);
  assert.match(html, /rel=["']canonical["'][^>]*\/kennisbank\/cv-ketel-bijvullen/i);
  assert.match(html, /"@type":"Article"/i);
  assert.match(html, /"@type":"BreadcrumbList"/i);
  assert.match(html, /href=["']\/service["']/i);
  assert.match(html, /href=["']\/onderhoud["']/i);
});

test("links the knowledge article from the maintenance service page", async () => {
  const response = await fetchRoute("/onderhoud");
  assert.equal(response.status, 200);
  assert.match(await response.text(), /href=["']\/kennisbank\/cv-ketel-bijvullen["']/i);
});

test("renders current maintenance subscriptions with monthly and annual pricing", async () => {
  const response = await fetchRoute("/onderhoud");
  assert.equal(response.status, 200);
  const html = await response.text();

  for (const monthlyPrice of ["11,58", "19,92", "24,08", "35,75", "31,58"]) {
    assert.match(html, new RegExp(`€\\s*${monthlyPrice}`, "i"));
  }
  for (const annualPrice of ["139", "239", "289", "429", "379"]) {
    assert.match(html, new RegExp(`Jaarprijs[\\s\\S]{0,80}${annualPrice}`, "i"));
  }
  assert.match(html, /Welke installatie heeft u/i);
  assert.match(html, /Comfort of Comfort Plus/i);
  assert.match(html, /Cv-ketel/i);
  assert.match(html, /warmtepomp/i);
  assert.match(html, /Materiaal binnen de onderhoudsmantel inbegrepen/i);
  assert.match(html, /Naar het aanvraagformulier/i);
  assert.match(html, /href=["']\/abonnement-aanvragen\?abonnement=cv-comfort#aanvraagformulier["']/i);
  assert.match(html, /href=["']\/abonnement-aanvragen\?abonnement=hybride-comfort#aanvraagformulier["']/i);
  assert.doesNotMatch(html, /Wat gebeurt er tijdens de jaarlijkse controle\?<\/h3>/i);
});

test("renders callback and thanks routes for low-commitment conversion tracking", async () => {
  const [callbackResponse, thanksResponse] = await Promise.all([
    fetchRoute("/bel-mij-terug"),
    fetchRoute("/bedankt?type=terugbellen"),
  ]);
  assert.equal(callbackResponse.status, 200);
  assert.match(await callbackResponse.text(), /Laat ons u[\s\S]*persoonlijk terugbellen/i);
  assert.equal(thanksResponse.status, 200);
  assert.match(await thanksResponse.text(), /Terugbelverzoek ontvangen/i);
});

test("publishes sitemap and robots routes", async () => {
  const [sitemapResponse, robotsResponse] = await Promise.all([
    fetchRoute("/sitemap.xml", "application/xml"),
    fetchRoute("/robots.txt", "text/plain"),
  ]);
  assert.equal(sitemapResponse.status, 200);
  assert.match(await sitemapResponse.text(), /\/kennisbank\/cv-ketel-bijvullen/);
  assert.equal(robotsResponse.status, 200);
  assert.match(await robotsResponse.text(), /Sitemap: .*\/sitemap\.xml/i);
});
