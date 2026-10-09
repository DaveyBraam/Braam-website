/* Verstuurt een aanvraagformulier naar de eigen worker (/api/aanvraag), die
   hem via Microsoft 365 bij service@ of planning@ aflevert. Zie worker/aanvraag.ts. */

export type Formulier = "offerte" | "terugbel" | "abonnement" | "eenmalig";

/* De formulieren zetten zelf "U kunt ook bellen via 073 622 2199" achter de melding. */
const reserve = "Uw aanvraag kon niet worden verzonden. Probeer het over een paar minuten opnieuw.";

export async function verstuurAanvraag(formData: FormData, opties: { formulier: Formulier; doel: "service" | "planning" }) {
  formData.set("formulier", opties.formulier);
  formData.set("doel", opties.doel);
  let response: Response;
  try {
    response = await fetch("/api/aanvraag", { method: "POST", body: formData, headers: { Accept: "application/json" } });
  } catch {
    throw new Error("Er is geen verbinding. Controleer uw internet en probeer het opnieuw.");
  }
  const result = (await response.json().catch(() => null)) as { ok?: boolean; melding?: string } | null;
  if (!response.ok || !result?.ok) throw new Error(result?.melding || reserve);
}
