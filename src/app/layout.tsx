import type { Metadata } from "next";
import { Inter_Tight, Newsreader } from "next/font/google";

import "./globals.css";

import navigation from "@content/site/navigation.json";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PageSurface } from "@/components/page-surface";
import { SubpageNavigation } from "@/components/subpage-navigation";
import { filterHomeAnchors } from "@/lib/home-sections";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mjt.com.np"),
  title: {
    default: "Manish Jung Thapa",
    template: "%s · Manish Jung Thapa",
  },
  description:
    "A living archive of work, study, movement, and community by Manish Jung Thapa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Resolved on the server so the anchor strip never flashes a link to a
  // section the home page didn't render.
  const homeAnchors = filterHomeAnchors(navigation.homeAnchors);

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${newsreader.variable} ${interTight.variable} site-shell antialiased`}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="flex min-h-screen flex-col">
          <Header />
          <SubpageNavigation homeAnchors={homeAnchors} />
          <PageSurface>{children}</PageSurface>
          <Footer />
        </div>
      </body>
    </html>
  );
}
