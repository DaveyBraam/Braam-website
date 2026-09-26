import assert from 'node:assert/strict';
import test from 'node:test';
import { access } from 'node:fs/promises';

const workerPromise = import('../dist/server/index.js').then(({ default: worker }) => worker);
async function render(path) {
  const worker = await workerPromise;
  const response = await worker.fetch(new Request(`https://example.test${path}`), {
    ASSETS: { fetch: async () => new Response('Not found', { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
  assert.equal(response.status, 200);
  return response.text();
}

test('public cv route renders approved story, metadata and contact routes', async () => {
  const html = await render('/cv-ketels');
  assert.match(html, /id="product-story"/);
  assert.match(html, /id="ps-title-4"/);
  assert.match(html, /class="ps-aftercare"/);
  assert.doesNotMatch(html, /id="cv-woning"|class="cvw-|id="cv-doorsnede"/);
  assert.match(html, /name="robots"[^>]*content="index, follow"/);
  assert.match(html, /rel="canonical"[^>]*href="[^\"]*\/cv-ketels"/);
  for (const href of ['/offerte-aanvragen?dienst=cv-ketel', '/abonnement-aanvragen?abonnement=cv-comfort', 'tel:+31736222199']) {
    assert.ok(html.includes(`href="${href}"`), href);
  }
});

test('preserved concept is excluded from search indexing', async () => {
  const html = await render('/concept-product/cv-ketels');
  assert.match(html, /id="product-story"/);
  assert.match(html, /name="robots"[^>]*content="noindex/);
});

test('the production artifact includes both models and fallback images', async () => {
  for (const asset of [
    'concept-3d/cv-ketels/installatie.glb',
    'models/cv-fotoreferentie/radiator-fotoreferentie.glb',
    'concept-3d/cv-ketels/installation-overview.webp',
    'concept-3d/cv-ketels/connection-detail.webp',
  ]) await access(new URL(`../dist/client/${asset}`, import.meta.url));
});
