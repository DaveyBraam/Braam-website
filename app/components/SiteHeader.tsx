"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function MenuArrow() {
  return <svg className="menu-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>;
}

const serviceItems = [
  ["Warmtepompen", "/warmtepompen"],
  ["Cv-ketels", "/cv-ketels"],
  ["Airco", "/airco"],
  ["Elektra", "/elektra"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
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

  useEffect(() => {
    const menu = mobileMenuRef.current;
    const header = headerRef.current;
    if (!menu || !header) return;
    const positionPanel = () => {
      if (menu.open) menu.style.setProperty("--menu-top", `${header.getBoundingClientRect().bottom}px`);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu.open) {
        menu.open = false;
        menu.querySelector("summary")?.focus();
      }
    };
    const onOutside = (event: PointerEvent) => {
      if (menu.open && event.target instanceof Node && !menu.contains(event.target)) menu.open = false;
    };
    const onFocus = (event: FocusEvent) => {
      if (menu.open && event.target instanceof Node && !menu.contains(event.target)) menu.open = false;
    };
    const onResize = () => {
      if (window.innerWidth > 960) menu.open = false;
      positionPanel();
    };
    menu.addEventListener("toggle", positionPanel);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", positionPanel, { passive: true });
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("focusin", onFocus);
    return () => {
      menu.removeEventListener("toggle", positionPanel);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", positionPanel);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onOutside);
      document.removeEventListener("focusin", onFocus);
    };
  }, [pathname]);

  return (
    <>
      <div className="topline">
        <div className="shell topline-inner">
          <span>Persoonlijk installatiebedrijf uit &apos;s-Hertogenbosch</span>
          <div><a href="mailto:service@robbraam.com">service@robbraam.com</a><i>·</i><a href="tel:+31736222199">073 622 2199</a></div>
        </div>
      </div>
      <header className="site-header" ref={headerRef}>
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
            <Link className="nav-storing" href="/service" onClick={closeMenus}><span className="nav-storing-label">Storing</span></Link>
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
            <summary aria-label="Menu" aria-controls="mobile-navigation">
              <span className="mobile-menu-label">Menu</span>
              <svg className="mobile-menu-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path className="menu-icon-open" d="M3 7h18M3 12h18M3 17h18" />
                <path className="menu-icon-close" d="m5 5 14 14M5 19 19 5" />
              </svg>
            </summary>
            <nav className="mobile-panel" id="mobile-navigation" aria-label="Mobiele hoofdnavigatie" data-lenis-prevent>
              <div className="mobile-menu-index">
                <details className="mobile-services">
                  <summary>Onze diensten <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 12h16" /><path className="menu-plus" d="M12 4v16" /></svg></summary>
                  <div>
                    {serviceItems.map(([label, href]) => <Link key={href} href={href} onClick={closeMenus} aria-current={pathname === href ? "page" : undefined}>{label}<MenuArrow /></Link>)}
                  </div>
                </details>
                <div className="mobile-menu-links">
                  <Link className="nav-storing" href="/service" onClick={closeMenus} aria-current={pathname === "/service" ? "page" : undefined}><span className="nav-storing-label">Storing</span><MenuArrow /></Link>
                  {[
                    ["Onderhoud", "/onderhoud"],
                    ["Projecten", "/projecten"],
                    ["Kennisbank", "/kennisbank"],
                    ["Veelgestelde vragen", "/veelgestelde-vragen"],
                    ["Over ons", "/over-ons"],
                    ["Contact", "/contact"],
                    ["Bel mij terug", "/bel-mij-terug"],
                  ].map(([label, href]) => <Link key={href} href={href} onClick={closeMenus} aria-current={pathname === href ? "page" : undefined}>{label}<MenuArrow /></Link>)}
                </div>
                <div className="mobile-menu-contact">
                  <Link className="mobile-offer" href="/offerte-aanvragen" onClick={closeMenus}>Offerte aanvragen <MenuArrow /></Link>
                  <a className="mobile-phone" href="tel:+31736222199" onClick={closeMenus}><small>Storing of een vraag?</small><strong>073 622 2199</strong></a>
                </div>
              </div>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
