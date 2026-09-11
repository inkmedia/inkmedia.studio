import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Ink Media, a Pune-based digital studio combining strategy, UX/UI design and web development to create distinctive digital experiences.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Ink Media",
    description:
      "A digital studio combining strategy, design and technology to build distinctive digital experiences.",
    url: "/about",
    images: [{ url: "/ink-logo.png", width: 3375, height: 3375, alt: "Ink Media logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Ink Media",
    description:
      "A digital studio combining strategy, design and technology to build distinctive digital experiences.",
    images: ["/ink-logo.png"],
  },
};

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
