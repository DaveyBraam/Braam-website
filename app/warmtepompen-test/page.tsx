import { permanentRedirect } from "next/navigation";

/* De testversie is uit de lucht (9 oktober 2026): hij liep achter op de echte
   pagina, zonder de vanaf-prijzen. De code blijft staan als naslag. */
export default function WarmtepompTestPage() { permanentRedirect("/warmtepompen"); }
