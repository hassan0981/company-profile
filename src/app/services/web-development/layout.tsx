import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website Design & Web Development Services | Bouncy",
  description:
    "Bouncy provides professional web development services including business websites, WordPress development, eCommerce stores, portfolio websites, landing pages, and ongoing website maintenance.",
  openGraph: {
    title: "Website Design & Web Development Services | Bouncy",
    description:
      "Bouncy provides professional web development services including business websites, WordPress development, eCommerce stores, portfolio websites, landing pages, and ongoing website maintenance.",
    url: "https://bouncydigital.com/services/web-development",
    siteName: "Bouncy Digital",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/BOUNCY.webp",
        width: 1200,
        height: 630,
        alt: "Website Design & Web Development Services | Bouncy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Design & Web Development Services | Bouncy",
    description:
      "Bouncy provides professional web development services including business websites, WordPress development, eCommerce stores, portfolio websites, landing pages, and ongoing website maintenance.",
    images: ["/BOUNCY.webp"],
  },
  alternates: {
    canonical: "https://bouncydigital.com/services/web-development",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
