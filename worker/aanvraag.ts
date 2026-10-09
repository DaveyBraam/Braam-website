/*
  Aanvraagformulieren -> Microsoft 365 (oktober 2026, vervangt FormSubmit).

  De vier formulieren posten naar /api/aanvraag. Deze worker controleert de
  aanvraag, stuurt hem via Microsoft Graph vanuit de gedeelde postbus
  website@robbraam.com naar service@ of planning@ (antwoorden gaan naar de
  klant), en stuurt de klant een korte bevestiging (antwoorden gaan naar het
  juiste team). Zelfde koppeling als de review-app: client credentials, met
  Mail.Send alleen voor de postbus van de website (zie DEPLOYMENT.md).

  Secrets (wrangler secret put): MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET,
  MAIL_FROM, TURNSTILE_SECRET. Lokaal: MAIL_TESTMODUS=1 logt in plaats van te
  versturen.
*/

export interface AanvraagEnv {
  MS_TENANT_ID?: string;
  MS_CLIENT_ID?: string;
  MS_CLIENT_SECRET?: string;
  MAIL_FROM?: string;
  TURNSTILE_SECRET?: string;
  MAIL_TESTMODUS?: string;
}

type Formulier = "offerte" | "terugbel" | "abonnement" | "eenmalig";

const ontvangers = { service: "service@robbraam.com", planning: "planning@robbraam.com" } as const;
type Doel = keyof typeof ontvangers;

const formulieren: Record<Formulier, { doelen: Doel[]; klantOnderwerp: string }> = {
  offerte: { doelen: ["service", "planning"], klantOnderwerp: "We hebben uw aanvraag ontvangen" },
  terugbel: { doelen: ["service", "planning"], klantOnderwerp: "We hebben uw terugbelverzoek ontvangen" },
  abonnement: { doelen: ["planning"], klantOnderwerp: "We hebben uw abonnementsaanvraag ontvangen" },
  eenmalig: { doelen: ["planning"], klantOnderwerp: "We hebben uw onderhoudsaanvraag ontvangen" },
};

/* Velden die het kantoor wel ziet, maar die in de kopie aan de klant niets toevoegen. */
const alleenKantoor = /^(Herkomstpagina|Bestemd voor|utm_\w+|gclid|Privacyverklaring gelezen|Doorlopende abonnementskosten begrepen)$/;

/* Velden die alleen voor de verwerking bestaan en niet in de mail horen. */
const intern = new Set(["formulier", "doel", "_subject", "_honey", "_template", "_captcha", "cf-turnstile-response"]);

const MAX_VELD = 4000;
const MAX_VELDEN = 60;
const TELEFOON = "073 622 2199";

const melding = {
  algemeen: "Uw aanvraag kon niet worden verzonden. Probeer het over een paar minuten opnieuw.",
  controle: "De beveiligingscontrole is niet gelukt. Laad de pagina opnieuw en probeer het nog eens.",
  onvolledig: "Niet alle verplichte gegevens zijn ingevuld. Controleer het formulier en probeer het opnieuw.",
};

function antwoord(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
const geldigMailadres = (s: string) => /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(s) && s.length <= 254;
const regel = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

async function turnstileGoed(env: AanvraagEnv, token: string, ip: string | null) {
  if (!env.TURNSTILE_SECRET) return true; // nog niet ingesteld: alleen het verborgen veld
  if (!token) return false;
  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token });
  if (ip) body.set("remoteip", ip);
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  const data = (await r.json().catch(() => ({}))) as { success?: boolean };
  return data.success === true;
}

let tokenCache: { token: string; verloopt: number } | null = null;

async function graphToken(env: AanvraagEnv) {
  if (tokenCache && tokenCache.verloopt > Date.now() + 60_000) return tokenCache.token;
  const body = new URLSearchParams({
    client_id: env.MS_CLIENT_ID ?? "",
    client_secret: env.MS_CLIENT_SECRET ?? "",
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });
  const r = await fetch(`https://login.microsoftonline.com/${encodeURIComponent(env.MS_TENANT_ID ?? "")}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = (await r.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error?: string };
  if (!r.ok || !data.access_token) throw new Error(`Microsoft-aanmelding mislukt (${r.status}): ${data.error ?? "onbekend"}`);
  tokenCache = { token: data.access_token, verloopt: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return tokenCache.token;
}

type Mail = { aan: string; antwoordAan?: string; onderwerp: string; html: string; tekst: string };

async function verstuur(env: AanvraagEnv, mail: Mail) {
  const ingesteld = env.MS_TENANT_ID && env.MS_CLIENT_ID && env.MS_CLIENT_SECRET && env.MAIL_FROM;
  if (!ingesteld) {
    if (env.MAIL_TESTMODUS === "1") {
      console.log(`[MAIL TESTMODUS] aan=${mail.aan} antwoord-aan=${mail.antwoordAan ?? "-"} onderwerp=${JSON.stringify(mail.onderwerp)}\n${mail.tekst}`);
      return;
    }
    throw new Error("Mail is nog niet ingesteld (Microsoft-koppeling ontbreekt)");
  }
  const token = await graphToken(env);
  const r = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(env.MAIL_FROM as string)}/sendMail`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: {
        subject: mail.onderwerp,
        body: { contentType: "HTML", content: mail.html },
        toRecipients: [{ emailAddress: { address: mail.aan } }],
        ...(mail.antwoordAan ? { replyTo: [{ emailAddress: { address: mail.antwoordAan } }] } : {}),
      },
      saveToSentItems: true,
    }),
  });
  if (r.status !== 202) {
    if (r.status === 401) tokenCache = null;
    const fout = (await r.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(`Versturen mislukt (${r.status}): ${fout.error?.message ?? "onbekende fout"}`);
  }
}

function tabelHtml(velden: Array<[string, string]>) {
  return velden
    .map(([k, v]) => `<tr><td style="padding:8px 12px 8px 0;border-top:1px solid #e3e8ec;color:#56636f;vertical-align:top;width:190px;">${esc(k)}</td><td style="padding:8px 0;border-top:1px solid #e3e8ec;white-space:pre-wrap;">${esc(v)}</td></tr>`)
    .join("");
}

function kantoorMail(onderwerp: string, velden: Array<[string, string]>) {
  const tekst = `${onderwerp}\n\n${velden.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nVerstuurd via het formulier op de website. Beantwoorden gaat rechtstreeks naar de klant (als die een e-mailadres gaf).`;
  const html = `<!doctype html><html lang="nl"><head><meta charset="utf-8"></head><body style="margin:0;padding:24px 12px;background:#eef2f5;font-family:Arial,Helvetica,sans-serif;color:#18222c;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-top:6px solid #0c70b8;">
<tr><td style="padding:22px 28px 6px;font-size:20px;font-weight:bold;">${esc(onderwerp)}</td></tr>
<tr><td style="padding:0 28px 14px;font-size:14px;color:#56636f;">Via het formulier op de website. Beantwoorden gaat rechtstreeks naar de klant, als die een e-mailadres gaf.</td></tr>
<tr><td style="padding:0 28px 24px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;line-height:1.5;">${tabelHtml(velden)}</table></td></tr>
</table></body></html>`;
  return { html, tekst };
}

function klantMail(naam: string, doel: Doel, velden: Array<[string, string]>) {
  const aanhef = naam ? `Beste ${naam},` : "Beste klant,";
  const team = doel === "planning" ? "onze planning" : "ons serviceteam";
  const tekst = `${aanhef}

Bedankt voor uw aanvraag. Hij is goed bij ${team} aangekomen. U hoort binnen 48 uur van ons.

Heeft u een storing die niet kan wachten? Bel ons dan op ${TELEFOON}.
Kantoor: maandag t/m donderdag 8.00-17.00, vrijdag 8.00-14.00.

Wilt u nog iets aanvullen? Beantwoord dan deze mail.

Dit heeft u ingevuld:
${velden.map(([k, v]) => `${k}: ${v}`).join("\n")}

Met vriendelijke groet,
Service & Montagebedrijf Rob Braam
Jacob van Wassenaerstraat 10, 's-Hertogenbosch · ${TELEFOON}`;
  const html = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;padding:0;background:#eef2f5;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f5;padding:28px 12px;"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#18222c;">
<tr><td style="background:#0c70b8;height:8px;font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td style="padding:28px 32px 4px;font-size:22px;font-weight:bold;line-height:1.3;">${esc(aanhef)}</td></tr>
<tr><td style="padding:12px 32px 4px;font-size:16px;line-height:1.6;">
<p style="margin:0 0 14px;">Bedankt voor uw aanvraag. Hij is goed bij ${team} aangekomen. <b>U hoort binnen 48 uur van ons.</b></p>
<p style="margin:0 0 14px;">Heeft u een storing die niet kan wachten? Bel ons dan op <a href="tel:+31736222199" style="color:#095a94;font-weight:bold;">${TELEFOON}</a>.<br><span style="color:#56636f;">Kantoor: maandag t/m donderdag 8.00–17.00, vrijdag 8.00–14.00.</span></p>
<p style="margin:0 0 6px;">Wilt u nog iets aanvullen? Beantwoord dan deze mail.</p>
</td></tr>
<tr><td style="padding:14px 32px 6px;font-size:15px;font-weight:bold;">Dit heeft u ingevuld</td></tr>
<tr><td style="padding:0 32px 22px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.5;">${tabelHtml(velden)}</table></td></tr>
<tr><td style="padding:4px 32px 26px;font-size:16px;line-height:1.5;">Met vriendelijke groet,<br><br><b>Service &amp; Montagebedrijf Rob Braam</b></td></tr>
<tr><td style="padding:16px 32px;border-top:1px solid #e3e8ec;font-size:13px;line-height:1.5;color:#56636f;">Jacob van Wassenaerstraat 10, 's-Hertogenbosch · ${TELEFOON}<br>U ontvangt deze mail omdat u via onze website een aanvraag deed.</td></tr>
</table></td></tr></table></body></html>`;
  return { html, tekst };
}

export async function handleAanvraag(request: Request, env: AanvraagEnv): Promise<Response> {
  if (request.method !== "POST") return antwoord(405, { ok: false, melding: melding.algemeen });

  // Alleen vanaf de eigen site: een formulier op een andere site mag hier niet posten.
  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) return antwoord(403, { ok: false, melding: melding.algemeen });

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return antwoord(400, { ok: false, melding: melding.onvolledig });
  }

  // Het verborgen veld: een mens ziet het niet, een robot vult het in. Doe alsof het lukte.
  if (String(data.get("_honey") ?? "").trim()) return antwoord(200, { ok: true });

  const formulier = String(data.get("formulier") ?? "") as Formulier;
  const instelling = formulieren[formulier];
  if (!instelling) return antwoord(400, { ok: false, melding: melding.onvolledig });
  const gevraagdDoel = String(data.get("doel") ?? "") as Doel;
  const doel: Doel = instelling.doelen.includes(gevraagdDoel) ? gevraagdDoel : instelling.doelen[0];

  if (!(await turnstileGoed(env, String(data.get("cf-turnstile-response") ?? ""), request.headers.get("CF-Connecting-IP")))) {
    return antwoord(400, { ok: false, melding: melding.controle });
  }

  const velden: Array<[string, string]> = [];
  for (const [sleutel, waarde] of data.entries()) {
    if (intern.has(sleutel) || typeof waarde !== "string") continue;
    const tekst = waarde.trim();
    if (!tekst) continue;
    if (velden.length >= MAX_VELDEN) break;
    velden.push([regel(sleutel).slice(0, 120), tekst.slice(0, MAX_VELD)]);
  }

  const naam = regel(String(data.get("Naam") ?? "")).slice(0, 120);
  const email = regel(String(data.get("email") ?? ""));
  const telefoon = regel(String(data.get("Telefoonnummer") ?? ""));
  if (!naam || (!telefoon && !geldigMailadres(email))) return antwoord(400, { ok: false, melding: melding.onvolledig });

  const onderwerp = regel(String(data.get("_subject") ?? "Nieuwe aanvraag via de website")).slice(0, 200);
  const klantMailadres = geldigMailadres(email) ? email : undefined;

  try {
    const kantoor = kantoorMail(onderwerp, velden);
    await verstuur(env, { aan: ontvangers[doel], antwoordAan: klantMailadres, onderwerp, ...kantoor });
  } catch (fout) {
    console.error("[aanvraag] naar kantoor mislukt:", fout instanceof Error ? fout.message : fout);
    return antwoord(502, { ok: false, melding: melding.algemeen });
  }

  // De bevestiging is een extraatje: mislukt die, dan is de aanvraag toch binnen.
  if (klantMailadres) {
    try {
      const klant = klantMail(naam, doel, velden.filter(([k]) => !alleenKantoor.test(k)));
      await verstuur(env, { aan: klantMailadres, antwoordAan: ontvangers[doel], onderwerp: instelling.klantOnderwerp, ...klant });
    } catch (fout) {
      console.error("[aanvraag] bevestiging aan klant mislukt:", fout instanceof Error ? fout.message : fout);
    }
  }

  return antwoord(200, { ok: true });
}
