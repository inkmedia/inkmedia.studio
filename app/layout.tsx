import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import PageTransition from "./components/PageTransition";

export const metadata: Metadata = {
  metadataBase: new URL("https://inkmedia.in"),
  title: "Ink Media — Web Design & Development Studio",
  description:
    "Strategy, UX/UI and high-performance web development for ambitious brands. Based in India, working worldwide.",
  keywords: [
    "web design studio",
    "web development",
    "UX UI design",
    "website redesign",
    "real estate websites",
    "India",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Ink Media — Websites built to be impossible to ignore",
    description: "Web design & development for ambitious brands.",
    type: "website",
    url: "/",
    siteName: "Ink Media",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ink Media — Web Design & Development Studio",
    description:
      "Websites built to make ambitious brands impossible to ignore.",
  },
  icons: {
    icon: [{ url: "/favicon.ico?v=2", type: "image/x-icon" }],
    shortcut: [{ url: "/favicon.ico?v=2", type: "image/x-icon" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" type="image/x-icon" />
      </head>
      <body>
        <SmoothScroll />
        <PageTransition />
        {children}
      </body>
    </html>
  );
}
