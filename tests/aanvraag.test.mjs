import assert from "node:assert/strict";
import test from "node:test";

/* /api/aanvraag: de worker die de formulieren via Microsoft 365 aflevert.
   Microsoft en Turnstile worden nagebootst; er wordt niets echt verstuurd. */

const workerPromise = import("../dist/server/index.js").then(({ default: worker }) => worker);
const ctx = { waitUntil() {}, passThroughOnException() {} };
const env = {
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  MS_TENANT_ID: "tenant", MS_CLIENT_ID: "client", MS_CLIENT_SECRET: "geheim", MAIL_FROM: "website@robbraam.com",
};

function formulier(velden) {
  const data = new FormData();
  for (const [k, v] of Object.entries(velden)) data.set(k, v);
  return data;
}

async function post(velden, extraEnv = {}, headers = {}) {
  const worker = await workerPromise;
  const verzonden = [];
  const echteFetch = globalThis.fetch;
  globalThis.fetch = async (url, init = {}) => {
    const u = String(url);
    if (u.includes("login.microsoftonline.com")) return Response.json({ access_token: "tok", expires_in: 3600 });
    if (u.includes("graph.microsoft.com")) { verzonden.push({ url: u, body: JSON.parse(init.body) }); return new Response(null, { status: 202 }); }
    if (u.includes("challenges.cloudflare.com")) return Response.json({ success: String(init.body).includes("response=goed") });
    return echteFetch(url, init);
  };
  try {
    const response = await worker.fetch(new Request("https://example.test/api/aanvraag", {
      method: "POST", body: formulier(velden), headers: { Origin: "https://example.test", ...headers },
    }), { ...env, ...extraEnv }, ctx);
    return { response, json: await response.json(), verzonden };
  } finally {
    globalThis.fetch = echteFetch;
  }
}

const offerte = { formulier: "offerte", doel: "service", _subject: "Nieuwe offerteaanvraag: Cv-ketel", Naam: "Gerda", Telefoonnummer: "0612345678", email: "gerda@example.nl", Omschrijving: "Ketel <b>lekt</b>" };

test("an offerte goes to service@ with the customer as reply-to, and the customer gets a confirmation", async () => {
  const { response, json, verzonden } = await post(offerte);
  assert.equal(response.status, 200);
  assert.equal(json.ok, true);
  assert.equal(verzonden.length, 2);
  const [kantoor, klant] = verzonden;
  assert.match(kantoor.url, /users\/website%40robbraam\.com\/sendMail/);
  assert.equal(kantoor.body.message.toRecipients[0].emailAddress.address, "service@robbraam.com");
  assert.equal(kantoor.body.message.replyTo[0].emailAddress.address, "gerda@example.nl");
  assert.match(kantoor.body.message.body.content, /Ketel &lt;b&gt;lekt&lt;\/b&gt;/);
  assert.equal(klant.body.message.toRecipients[0].emailAddress.address, "gerda@example.nl");
  assert.equal(klant.body.message.replyTo[0].emailAddress.address, "service@robbraam.com");
  assert.match(klant.body.message.body.content, /binnen 48 uur/);
});

test("subscriptions always go to planning@, whatever the browser asks", async () => {
  const { verzonden } = await post({ ...offerte, formulier: "abonnement", doel: "service" });
  assert.equal(verzonden[0].body.message.toRecipients[0].emailAddress.address, "planning@robbraam.com");
});

test("the hidden field stops robots without sending anything", async () => {
  const { response, json, verzonden } = await post({ ...offerte, _honey: "spam" });
  assert.equal(response.status, 200);
  assert.equal(json.ok, true);
  assert.equal(verzonden.length, 0);
});

test("missing name or contact details are refused in Dutch", async () => {
  const { response, json, verzonden } = await post({ formulier: "offerte", doel: "service", Naam: "" });
  assert.equal(response.status, 400);
  assert.match(json.melding, /verplichte gegevens/);
  assert.equal(verzonden.length, 0);
});

test("posts from another site are refused", async () => {
  const { response, verzonden } = await post(offerte, {}, { Origin: "https://elders.test" });
  assert.equal(response.status, 403);
  assert.equal(verzonden.length, 0);
});

test("with Turnstile configured, a failed check sends nothing", async () => {
  const fout = await post({ ...offerte, "cf-turnstile-response": "slecht" }, { TURNSTILE_SECRET: "x" });
  assert.equal(fout.response.status, 400);
  assert.equal(fout.verzonden.length, 0);
  const goed = await post({ ...offerte, "cf-turnstile-response": "goed" }, { TURNSTILE_SECRET: "x" });
  assert.equal(goed.response.status, 200);
  assert.equal(goed.verzonden.length, 2);
});

test("without the Microsoft secrets the live site refuses instead of pretending", async () => {
  const { response, json } = await post(offerte, { MS_CLIENT_SECRET: "" });
  assert.equal(response.status, 502);
  assert.equal(json.ok, false);
});
