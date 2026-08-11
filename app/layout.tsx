import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

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
  return <html lang="en"><body className={jost.variable}>{children}</body></html>;
}
