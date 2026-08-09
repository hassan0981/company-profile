import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Get in Touch with Bouncy Digital",
  description:
    "Contact Bouncy Digital today for a free consultation on SEO, Web Development, Social Media Management, and Meta Ads for your business.",
  alternates: {
    canonical: "https://bouncydigital.com/contact-us",
  },
  openGraph: {
    title: "Contact Us | Get in Touch with Bouncy Digital",
    description:
      "Contact Bouncy Digital today for a free consultation on SEO, Web Development, Social Media Management, and Meta Ads for your business.",
    url: "https://bouncydigital.com/contact-us",
    siteName: "Bouncy Digital",
    locale: "en_US",
    type: "website",
  },
};

export default function ContactUsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
