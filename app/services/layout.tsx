import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Services",
  description:
    "Explore Ink Media's web strategy, UX/UI design, web development, website redesign, e-commerce, optimisation and digital marketing services.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Digital Services | Ink Media",
    description:
      "Strategy, design, development and digital marketing services built to help ambitious brands grow.",
    url: "/services",
    images: [{ url: "/ink-logo.png", width: 3375, height: 3375, alt: "Ink Media logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Services | Ink Media",
    description:
      "Strategy, design, development and digital marketing services built to help ambitious brands grow.",
    images: ["/ink-logo.png"],
  },
};

export default function ServicesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
