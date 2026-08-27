"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const serviceItems = [
  ["Warmtepompen", "/warmtepompen"],
  ["Cv-ketels", "/cv-ketels"],
  ["Airco", "/airco"],
  ["Elektra", "/elektra"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const desktopMenuRef = useRef<HTMLDetailsElement>(null);
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  const closeMenus = () => {
    if (desktopMenuRef.current) desktopMenuRef.current.open = false;
    if (mobileMenuRef.current) mobileMenuRef.current.open = false;
  };

  useEffect(() => {
    if (desktopMenuRef.current) desktopMenuRef.current.open = false;
    if (mobileMenuRef.current) mobileMenuRef.current.open = false;
  }, [pathname]);

  return (
    <>
      <div className="topline">
        <div className="shell topline-inner">
          <span>Persoonlijk installatiebedrijf uit &apos;s-Hertogenbosch</span>
          <div><a href="mailto:service@robbraam.com">service@robbraam.com</a><i>·</i><a href="tel:+31736222199">073 622 2199</a></div>
        </div>
      </div>
      <header className="site-header">
        <div className="shell header-inner">
          <Link className="brand brand-image" href="/" aria-label="Rob Braam, naar de homepage">
            <img src="/brand/rob-braam-logo.png" alt="Service & Montagebedrijf Rob Braam" />
          </Link>

          <nav className="desktop-nav" aria-label="Hoofdnavigatie">
            <details className="nav-dropdown" ref={desktopMenuRef}>
              <summary>Onze diensten <span aria-hidden="true">⌄</span></summary>
              <div className="dropdown-panel">
                {serviceItems.map(([label, href]) => <Link key={href} href={href} onClick={closeMenus}>{label}<span aria-hidden="true">→</span></Link>)}
              </div>
            </details>
            <Link href="/onderhoud" onClick={closeMenus}>Onderhoud</Link>
            <Link href="/projecten" onClick={closeMenus}>Projecten</Link>
            <Link href="/kennisbank" onClick={closeMenus}>Kennisbank</Link>
            <Link href="/over-ons" onClick={closeMenus}>Over ons</Link>
            <Link href="/contact" onClick={closeMenus}>Contact</Link>
          </nav>

          <Link className="button button-small button-dark header-cta" href="/offerte-aanvragen">Offerte aanvragen <span aria-hidden="true">↗</span></Link>

          <details
            className="mobile-menu"
            key={pathname}
            ref={mobileMenuRef}
          >
            <summary aria-label="Hoofdmenu"><span /><span /><span /></summary>
            <div className="mobile-panel">
              <details className="mobile-services">
                <summary>Onze diensten <span aria-hidden="true">+</span></summary>
                <div>
                  {serviceItems.map(([label, href]) => <Link key={href} href={href} onClick={closeMenus}>{label}<span aria-hidden="true">→</span></Link>)}
                </div>
              </details>
              <Link href="/onderhoud" onClick={closeMenus}>Onderhoud<span aria-hidden="true">→</span></Link>
              <Link href="/projecten" onClick={closeMenus}>Projecten<span aria-hidden="true">→</span></Link>
              <Link href="/kennisbank" onClick={closeMenus}>Kennisbank<span aria-hidden="true">→</span></Link>
              <Link href="/veelgestelde-vragen" onClick={closeMenus}>Veelgestelde vragen<span aria-hidden="true">→</span></Link>
              <Link href="/over-ons" onClick={closeMenus}>Over ons<span aria-hidden="true">→</span></Link>
              <Link href="/contact" onClick={closeMenus}>Contact<span aria-hidden="true">→</span></Link>
              <Link href="/bel-mij-terug" onClick={closeMenus}>Bel mij terug<span aria-hidden="true">→</span></Link>
              <Link className="mobile-offer" href="/offerte-aanvragen" onClick={closeMenus}>Offerte aanvragen <span aria-hidden="true">↗</span></Link>
              <a className="mobile-phone" href="tel:+31736222199" onClick={closeMenus}>Bel 073 622 2199</a>
            </div>
          </details>
        </div>
      </header>
    </>
  );
}
