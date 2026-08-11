import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({ variable: "--font-sans", subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({ variable: "--font-serif", subsets: ["latin"], weight: "400", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://inkmedia.in"),
  title: "Ink Media — Web Design & Development Studio",
  description: "Strategy, UX/UI and high-performance web development for ambitious brands. Based in India, working worldwide.",
  keywords: ["web design studio", "web development", "UX UI design", "website redesign", "real estate websites", "India"],
  alternates: { canonical: "/" },
  openGraph: { title: "Ink Media — Websites built to be impossible to ignore", description: "Web design & development for ambitious brands.", type: "website", url: "/", siteName: "Ink Media" },
  twitter: { card: "summary_large_image", title: "Ink Media — Web Design & Development Studio", description: "Websites built to make ambitious brands impossible to ignore." },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${serif.variable}`}>{children}</body></html>;
}
