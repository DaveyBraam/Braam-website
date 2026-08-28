import Link from "next/link";

type ContactCTAProps = {
  title?: string;
  text?: string;
  primaryLabel?: string;
  primaryHref?: string;
};

export function ContactCTA({ title = "Waar kunnen we u mee helpen?", text = "Vertel kort wat er speelt. U krijgt persoonlijk antwoord van iemand uit ons team die uw vraag kan beoordelen.", primaryLabel = "Stel uw vraag", primaryHref = "/contact" }: ContactCTAProps) {
  return (
    <section className="contact-cta reveal">
      <div className="shell contact-cta-inner">
        <div><h2>{title}</h2><p>{text}</p></div>
        <div className="cta-actions"><Link className="button button-light" href={primaryHref}>{primaryLabel} <span aria-hidden="true">↗</span></Link><a href="tel:+31736222199">073 622 2199</a></div>
      </div>
    </section>
  );
}
