import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Digital Marketing Services | Bouncy Digital",
  description:
    "Explore Bouncy Digital's full suite of services: Web Development, SEO, Social Media Management, and Meta Ads.",
  alternates: {
    canonical: "https://bouncydigital.com/services",
  },
  openGraph: {
    title: "Our Digital Marketing Services | Bouncy Digital",
    description:
      "Explore Bouncy Digital's full suite of services: Web Development, SEO, Social Media Management, and Meta Ads.",
    url: "https://bouncydigital.com/services",
    siteName: "Bouncy Digital",
    locale: "en_US",
    type: "website",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
