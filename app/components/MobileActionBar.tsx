import Link from "next/link";

type MobileActionBarProps = {
  href: string;
  label: string;
};

export function MobileActionBar({ href, label }: MobileActionBarProps) {
  return <nav className="mobile-action-bar" aria-label="Snel contact"><Link href={href}>{label}</Link><a href="tel:+31736222199" aria-label="Bel Rob Braam">Bel ons</a></nav>;
}
