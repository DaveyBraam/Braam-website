import Link from "next/link";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  accent: string;
  intro: string;
  image: string;
  imageAlt: string;
  primaryLabel?: string;
  primaryHref?: string;
  badge?: string;
};

export function PageHero({ eyebrow, title, accent, intro, image, imageAlt, primaryLabel = "Offerte aanvragen", primaryHref = "/offerte-aanvragen", badge }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="shell breadcrumb"><Link href="/">Home</Link><span>/</span><strong>{eyebrow}</strong></div>
      <div className="shell page-hero-grid">
        <div className="page-hero-copy">
          <h1>{title}<br /><em>{accent}</em></h1>
          <p className="hero-lead">{intro}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href={primaryHref}>{primaryLabel}<span aria-hidden="true">↗</span></Link>
            <a className="phone-link" href="tel:+31736222199"><span className="phone-icon" aria-hidden="true">↗</span><span><small>Even overleggen?</small><strong>073 622 2199</strong></span></a>
          </div>
        </div>
        <figure className="page-hero-image">
          <img src={image} alt={imageAlt} />
          {badge && <figcaption><i />{badge}</figcaption>}
        </figure>
      </div>
    </section>
  );
}
