"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type MobileActionBarProps = {
  href: string;
  label: string;
};

export function MobileActionBar({ href, label }: MobileActionBarProps) {
  return <nav className="mobile-action-bar" aria-label="Snel contact"><Link href={href}>{label}</Link><a href="tel:+31736222199" aria-label="Bel ons op 073 622 2199">Bel ons</a></nav>;
}

/* De aanvraagformulieren houden de onderrand vrij: daar staat de verzendknop. */
const zonderBalk = ["/offerte-aanvragen", "/bel-mij-terug", "/abonnement-aanvragen", "/eenmalig-onderhoud-aanvragen", "/bedankt"];

/* Belbalk voor elke pagina die geen eigen balk meebrengt (premium.css verbergt
   deze zodra er een andere .mobile-action-bar op de pagina staat). */
export function SiteMobileActionBar() {
  const pathname = usePathname();
  if (zonderBalk.includes(pathname)) return null;
  if (pathname === "/service") {
    return <nav className="mobile-action-bar mobile-action-bar--algemeen" aria-label="Snel contact"><a href="tel:+31736222199">Bel 073 622 2199</a></nav>;
  }
  return <nav className="mobile-action-bar mobile-action-bar--algemeen" aria-label="Snel contact"><Link href="/offerte-aanvragen">Offerte aanvragen</Link><a href="tel:+31736222199" aria-label="Bel ons op 073 622 2199">Bel ons</a></nav>;
}
