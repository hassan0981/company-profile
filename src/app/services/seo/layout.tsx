import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO Services That Increase Traffic & Leads | Bouncy",
  description:
    "Improve your online visibility with Bouncy’s search engine optimisation services. Our technical SEO, keyword research, on-page and off-page SEO, and local SEO services will increase your ranking, traffic, and leads.",
  openGraph: {
    title: "SEO Services That Increase Traffic & Leads | Bouncy",
    description:
      "Improve your online visibility with Bouncy’s search engine optimisation services. Our technical SEO, keyword research, on-page and off-page SEO, and local SEO services will increase your ranking, traffic, and leads.",
    url: "https://bouncydigital.com/services/seo",
    siteName: "Bouncy Digital",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/BOUNCY.png",
        width: 1200,
        height: 630,
        alt: "SEO Services That Increase Traffic & Leads | Bouncy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Services That Increase Traffic & Leads | Bouncy",
    description:
      "Improve your online visibility with Bouncy’s search engine optimisation services. Our technical SEO, keyword research, on-page and off-page SEO, and local SEO services will increase your ranking, traffic, and leads.",
    images: ["/BOUNCY.png"],
  },
  alternates: {
    canonical: "https://bouncydigital.com/services/seo",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
