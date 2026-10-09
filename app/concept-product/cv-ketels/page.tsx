import { permanentRedirect } from "next/navigation";

/* Het concept is uit de lucht (9 oktober 2026): de echte pagina is /cv-ketels.
   Story.tsx en de rest van deze map blijven staan als naslag; de oude opbouw van
   deze pagina staat in git (ebd3d53). */
export default function ProductStoryPage() { permanentRedirect("/cv-ketels"); }
