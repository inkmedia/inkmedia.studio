import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Explore selected web design and development work by Ink Media for real estate, hospitality and ambitious growing brands.",
  alternates: { canonical: "/case-studies" },
  openGraph: {
    title: "Case Studies | Ink Media",
    description:
      "Selected digital experiences designed and developed by Ink Media.",
    url: "/case-studies",
    images: [{ url: "/ink-logo.png", width: 3375, height: 3375, alt: "Ink Media logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies | Ink Media",
    description: "Selected digital experiences designed and developed by Ink Media.",
    images: ["/ink-logo.png"],
  },
};

export default function CaseStudiesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
