import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Link className="brand brand-image" href="/" aria-label="Rob Braam, naar de homepage">
            <img src="/brand/rob-braam-logo.png" alt="Service & Montagebedrijf Rob Braam" />
          </Link>
          <p>Installatie, onderhoud en service door een eigen team dat bereikbaar blijft. Vanuit &apos;s-Hertogenbosch actief in Noord-Brabant en aangrenzende delen van Gelderland.</p>
        </div>
        <div>
          <strong>Diensten</strong>
          <Link href="/warmtepompen">Warmtepompen</Link>
          <Link href="/cv-ketels">Cv-ketels</Link>
          <Link href="/airco">Airconditioning</Link>
          <Link href="/elektra">Elektra</Link>
        </div>
        <div>
          <strong>Service</strong>
          <Link href="/onderhoud">Onderhoud & abonnementen</Link>
          <Link href="/service">Storing & service</Link>
          <Link href="/kennisbank">Kennisbank</Link>
          <Link href="/bel-mij-terug">Bel mij terug</Link>
          <Link href="/projecten">Projecten</Link>
          <Link href="/veelgestelde-vragen">Veelgestelde vragen</Link>
          <Link href="/over-ons">Over ons</Link>
          <Link href="/privacy">Privacyverklaring</Link>
        </div>
        <div>
          <strong>Contact</strong>
          <a href="tel:+31736222199">073 622 2199</a>
          <a href="mailto:service@robbraam.com">service@robbraam.com</a>
          <a href="mailto:planning@robbraam.com">planning@robbraam.com</a>
          <span>Jacob van Wassenaerstraat 10<br />5224 GG &apos;s-Hertogenbosch</span>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} Service & Montagebedrijf Rob Braam</span>
        <div className="footer-legal"><span>KvK 17122994</span><span>Btw-id NL813301579B01</span><Link href="/privacy">Privacyverklaring</Link></div>
      </div>
    </footer>
  );
}
