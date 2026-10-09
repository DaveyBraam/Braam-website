"use client";

import Script from "next/script";
import { turnstileSiteKey } from "../../site-config";

/* De spamcontrole van Cloudflare. Meestal onzichtbaar; zet zelf het verborgen
   veld cf-turnstile-response in het formulier. Zonder sitekey toont hij niets. */
export function Turnstile() {
  if (!turnstileSiteKey) return null;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <div className="cf-turnstile form-turnstile" data-sitekey={turnstileSiteKey} data-language="nl" data-appearance="interaction-only" />
    </>
  );
}
