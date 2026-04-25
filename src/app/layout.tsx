import type { Metadata } from "next";
import { Inter_Tight, Newsreader } from "next/font/google";

import "./globals.css";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PageSurface } from "@/components/page-surface";
import { SubpageNavigation } from "@/components/subpage-navigation";

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${newsreader.variable} ${interTight.variable} site-shell antialiased`}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="flex min-h-screen flex-col">
          <Header />
          <SubpageNavigation />
          <PageSurface>{children}</PageSurface>
          <Footer />
        </div>
      </body>
    </html>
  );
}
