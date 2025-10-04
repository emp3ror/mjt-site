import Link from "next/link";

const navigation = [
  { label: "Art College", href: "/art-college" },
  { label: "Latest posts", href: "/#recent-work" },
  { label: "Browse tags", href: "/tags" },
];

const socials = [
  { label: "Email", href: "mailto:hello@mjt.studio" },
  { label: "GitHub", href: "https://github.com/manishjungthapa" },
  { label: "Instagram", href: "https://www.instagram.com" },
];

export function Footer() {
  return (
    <footer className="border-t border-neutral-200/70 bg-white/70 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-950/60">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12 md:flex-row md:justify-between">
        <div className="max-w-md space-y-3">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Manish Jung Thapa
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Building fast, human web experiences and keeping the sketchbook open.
            Thanks for visiting the studio log.
          </p>
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
            © {new Date().getFullYear()} MJT Studio
          </p>
        </div>

        <div className="grid flex-1 gap-8 sm:grid-cols-2 md:max-w-md">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Navigate
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link className="transition hover:text-blue-600 dark:hover:text-blue-400" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Connect
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
              {socials.map((item) => (
                <li key={item.href}>
                  <Link
                    className="transition hover:text-blue-600 dark:hover:text-blue-400"
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

