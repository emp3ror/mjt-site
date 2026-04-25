/**
 * Site footer: closing note, primary nav, archive index, and contact links.
 * All copy and links come from `content/site/navigation.json`.
 */

import Link from "next/link";

import navigation from "@content/site/navigation.json";

const isExternal = (href: string) => href.startsWith("http");

type FooterLink = { label: string; href: string };

function LinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="space-y-4 md:space-y-5">
      <p className="eyebrow">{title}</p>
      <ul className="space-y-2.5 text-[0.98rem] text-[color:var(--ink-soft)]">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="hover:text-[color:var(--foreground)]"
              target={isExternal(item.href) ? "_blank" : undefined}
              rel={isExternal(item.href) ? "noreferrer" : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { primary, archive, socials, footer } = navigation;

  return (
    <footer className="mt-24 border-t border-[color:var(--line-strong)]/50 bg-[color:var(--surface)]/76">
      <div className="page-wrap grid gap-10 py-14 md:grid-cols-[1.15fr_0.7fr_0.75fr_0.75fr] md:py-16">
        <div className="space-y-6">
          <p className="eyebrow">{footer.eyebrow}</p>
          <h2 className="max-w-md text-[2.05rem] leading-tight md:text-[2.7rem]">{footer.title}</h2>
          <p className="body-copy max-w-lg text-[color:var(--ink-soft)]">{footer.description}</p>
          <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
            © {new Date().getFullYear()} {footer.copyrightName}
          </p>
        </div>

        <LinkColumn title="Navigate" links={primary} />
        <LinkColumn title="Archive" links={archive} />
        <LinkColumn title="Contact" links={socials} />
      </div>
    </footer>
  );
}
