import type { Metadata } from "next";
import { AanvraagPagina } from "../components/aanvraag/AanvraagPagina";
import { SingleMaintenanceApplicationForm } from "../components/SingleMaintenanceApplicationForm";

export const metadata: Metadata = {
  title: "Eenmalige onderhoudsbeurt aanvragen",
  description: "Vraag één losse onderhoudsbeurt aan voor uw cv-ketel, hybride installatie of volledig elektrische warmtepomp.",
  robots: { index: false, follow: false },
};

export default function SingleMaintenanceApplicationPage() {
  return (
    <AanvraagPagina
      kruimels={[{ label: "Onderhoud", href: "/onderhoud" }, { label: "Eenmalig aanvragen" }]}
      titel="Eén onderhoudsbeurt."
      accent="Geen abonnement."
      intro="Met dit formulier vraagt u alleen een eenmalige onderhoudsbeurt aan. We controleren eerst uw installatie, merk en woonplaats; daarna nemen we contact met u op."
      puntenLabel="Eenmalig, zonder contract"
      punten={["Eén losse onderhoudsbeurt", "Geen abonnement of jaarlijkse overeenkomst", "Merk en installatie worden vooraf beoordeeld", "Cv-ketel: € 124, buiten ’s-⁠Hertogenbosch € 135"]}
      email="planning@robbraam.com"
      daarna={["Planning beoordeelt uw installatie, merk en woonplaats", "We nemen contact op en stemmen afspraak en kosten af"]}
    >
      <SingleMaintenanceApplicationForm />
    </AanvraagPagina>
  );
}
