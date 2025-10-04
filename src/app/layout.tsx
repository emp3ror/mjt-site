import type { Metadata } from "next";
import { Baloo_2, Inter } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mjt.example"),
  title: {
    default: "Manish Jung Thapa — Studio Notes",
    template: "%s · mjt",
  },
  description:
    "An MDX-powered static site sketching ideas across tech builds, personal essays, and art studies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${baloo.variable} ${inter.variable} antialiased font-sans`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
