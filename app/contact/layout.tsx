import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Ink Media. Tell our Pune-based web design and development studio about your business, goals and digital challenge.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Ink Media",
    description:
      "Have a digital project in mind? Talk to Ink Media about what you are building.",
    url: "/contact",
    images: [{ url: "/ink-logo.png", width: 3375, height: 3375, alt: "Ink Media logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Ink Media",
    description:
      "Have a digital project in mind? Talk to Ink Media about what you are building.",
    images: ["/ink-logo.png"],
  },
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
