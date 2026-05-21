import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SNEAX — Premium Sneakers Costa Rica",
    template: "%s | SNEAX",
  },
  description:
    "La tienda de sneakers premium de Costa Rica. Drops exclusivos, marcas selectas, cultura auténtica.",
  keywords: ["sneakers", "zapatillas", "Costa Rica", "premium", "SNEAX"],
  // Prevents Chrome / browser auto-translation from wrapping text nodes in
  // <font> tags — that DOM mutation desyncs React's fiber tree and causes
  // "removeChild: node is not a child" crashes on route navigation.
  other: { google: "notranslate" },
  openGraph: {
    title: "SNEAX — Premium Sneakers Costa Rica",
    description: "La tienda de sneakers premium de Costa Rica.",
    locale: "es_CR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      translate="no"
      suppressHydrationWarning
      className={`notranslate ${bebasNeue.variable} ${dmSans.variable}`}
    >
      <body className="font-body antialiased bg-[var(--bg)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
