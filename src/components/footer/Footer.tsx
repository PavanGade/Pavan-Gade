import { siteConfig } from "@/lib/utils";
import Link from "next/link";

const companyLinks = [
  { label: "About", href: "/about/" },
  { label: "Opportunities", href: "/opportunities/" },
  { label: "Insights", href: "/insights/" },
  { label: "Contact", href: "/contact/" },
];

const resourceLinks = [
  { label: "Investor Guide", href: "/insights/" },
  { label: "FAQs", href: "/contact/" },
  { label: "Privacy Policy", href: "/contact/" },
  { label: "Terms", href: "/contact/" },
];

const legalLinks = [
  { label: "Risk Disclosure", href: "/contact/" },
  { label: "Disclaimer", href: "/contact/" },
];

const socialLinks = [
  { label: "LinkedIn", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-primary">
      <div className="container-page py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-text-secondary">
              Investors
            </p>
            <p className="text-lg font-semibold tracking-[0.08em]">Circle</p>
            <p className="mt-4 max-w-xs text-sm text-text-secondary">
              A curated investment ecosystem for ambitious, long-term capital.
            </p>
          </div>

          <FooterCol title="Company" links={companyLinks} />
          <FooterCol title="Resources" links={resourceLinks} />
          <div>
            <FooterCol title="Legal" links={legalLinks} />
            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.14em] text-text-muted">
                Social
              </p>
              <ul className="mt-3 space-y-2">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-text-secondary transition hover:text-text-primary"
                    >
                      {link.label}
                    </a>
                    <span className="ml-2 text-[10px] uppercase tracking-wider text-text-muted">
                      Placeholder
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>
            Investments involve risk. Past performance is not indicative of
            future results.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.14em] text-text-muted">
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            {link.href.startsWith("#") ? (
              <a
                href={link.href}
                className="text-sm text-text-secondary transition hover:text-text-primary"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-sm text-text-secondary transition hover:text-text-primary"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
