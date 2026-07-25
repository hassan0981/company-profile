import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meta Ads Services That Drive Leads & Sales | Bouncy",
  description:
    "Develop your business with Bouncy's Meta Ads services. We design high-converting Facebook and Instagram ad campaigns that increase leads, sales, website traffic, and brand awareness.",
  openGraph: {
    title: "Meta Ads Services That Drive Leads & Sales | Bouncy",
    description:
      "Develop your business with Bouncy's Meta Ads services. We design high-converting Facebook and Instagram ad campaigns that increase leads, sales, website traffic, and brand awareness.",
    url: "https://bouncydigital.com/services/meta-ads",
    siteName: "Bouncy Digital",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/BOUNCY.png",
        width: 1200,
        height: 630,
        alt: "Meta Ads Services That Drive Leads & Sales | Bouncy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meta Ads Services That Drive Leads & Sales | Bouncy",
    description:
      "Develop your business with Bouncy's Meta Ads services. We design high-converting Facebook and Instagram ad campaigns that increase leads, sales, website traffic, and brand awareness.",
    images: ["/BOUNCY.png"],
  },
  alternates: {
    canonical: "https://bouncydigital.com/services/meta-ads",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
